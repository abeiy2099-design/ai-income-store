import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'Bolt Integration',
    version: '1.0.0',
  },
});

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

Deno.serve(async (req) => {
  try {
    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // get the signature from the header
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    // get the raw body
    const body = await req.text();

    // verify the webhook signature
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(`Webhook signature verification failed: ${error.message}`, { status: 400 });
    }

    EdgeRuntime.waitUntil(handleEvent(event));

    return Response.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function handleEvent(event: Stripe.Event) {
  const stripeData = event?.data?.object ?? {};

  if (!stripeData) {
    return;
  }

  if (!('customer' in stripeData)) {
    return;
  }

  // for one time payments, we only listen for the checkout.session.completed event
  if (event.type === 'payment_intent.succeeded' && event.data.object.invoice === null) {
    return;
  }

  const { customer: customerId } = stripeData;

  if (!customerId || typeof customerId !== 'string') {
    console.error(`No customer received on event: ${JSON.stringify(event)}`);
  } else {
    let isSubscription = true;

    if (event.type === 'checkout.session.completed') {
      const { mode } = stripeData as Stripe.Checkout.Session;

      isSubscription = mode === 'subscription';

      console.info(`Processing ${isSubscription ? 'subscription' : 'one-time payment'} checkout session`);
    }

    const { mode, payment_status } = stripeData as Stripe.Checkout.Session;

    if (isSubscription) {
      console.info(`Starting subscription sync for customer: ${customerId}`);
      await syncCustomerFromStripe(customerId);
    } else if (mode === 'payment' && payment_status === 'paid') {
      try {
        // Extract the necessary information from the session
        const {
          id: checkout_session_id,
          payment_intent,
          amount_subtotal,
          amount_total,
          currency,
          customer_details,
          metadata,
        } = stripeData as Stripe.Checkout.Session;

        // Insert the order into the stripe_orders table
        const { error: orderError } = await supabase.from('stripe_orders').insert({
          checkout_session_id,
          payment_intent_id: payment_intent,
          customer_id: customerId,
          amount_subtotal,
          amount_total,
          currency,
          payment_status,
          status: 'completed',
        });

        if (orderError) {
          console.error('Error inserting order:', orderError);
          return;
        }

        // Get customer email
        const customerEmail = customer_details?.email;
        const customerName = customer_details?.name;

        if (customerEmail) {
          // Check if this is a consultation booking
          if (metadata?.type === 'consultation') {
            try {
              const { data: bookingData, error: bookingError } = await supabase.rpc(
                'create_consultation_booking',
                {
                  p_service_id: metadata.serviceId,
                  p_customer_name: metadata.customerName || customerName || 'Customer',
                  p_customer_email: customerEmail,
                  p_scheduled_date: metadata.scheduledDate,
                  p_message: metadata.message || '',
                  p_payment_intent_id: payment_intent as string,
                  p_payment_amount: (amount_total || 0) / 100,
                }
              );

              if (bookingError) {
                console.error('Error creating consultation booking:', bookingError);
              } else {
                console.info('Consultation booking created successfully');

                // Send booking confirmation email
                try {
                  const confirmationResponse = await fetch(
                    `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-booking-confirmation`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
                      },
                      body: JSON.stringify({
                        bookingId: bookingData,
                      }),
                    }
                  );

                  if (!confirmationResponse.ok) {
                    console.error('Failed to send booking confirmation:', await confirmationResponse.text());
                  } else {
                    console.info('Booking confirmation sent successfully');
                  }
                } catch (emailError) {
                  console.error('Error sending booking confirmation:', emailError);
                }
              }
            } catch (error) {
              console.error('Error processing consultation booking:', error);
            }
          } else {
            // Product purchase - create order for bonus access system
            const { data: orderData, error: orderCreateError } = await supabase
              .from('orders')
              .insert({
                email: customerEmail,
                total_amount: (amount_total || 0) / 100,
                payment_status: 'paid',
                payment_intent_id: payment_intent as string,
              })
              .select()
              .single();

            if (orderCreateError) {
              console.error('Error creating order for bonus system:', orderCreateError);
            } else if (orderData) {
              // Add order items from metadata if available
              if (metadata?.productId) {
                await supabase.from('order_items').insert({
                  order_id: orderData.id,
                  product_id: metadata.productId,
                  price: (amount_total || 0) / 100,
                  quantity: 1,
                });
              }

              // Send bonus email
              try {
                const emailResponse = await fetch(
                  `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-bonus-email`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
                    },
                    body: JSON.stringify({
                      email: customerEmail,
                      customerName: customerName || 'Valued Customer',
                      orderId: orderData.id,
                    }),
                  }
                );

                if (!emailResponse.ok) {
                  console.error('Failed to send bonus email:', await emailResponse.text());
                } else {
                  console.info('Bonus email sent successfully');
                }
              } catch (emailError) {
                console.error('Error sending bonus email:', emailError);
              }
            }
          }
        }

        console.info(`Successfully processed one-time payment for session: ${checkout_session_id}`);
      } catch (error) {
        console.error('Error processing one-time payment:', error);
      }
    }
  }
}

// based on the excellent https://github.com/t3dotgg/stripe-recommendations
async function syncCustomerFromStripe(customerId: string) {
  try {
    // fetch latest subscription data from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    // TODO verify if needed
    if (subscriptions.data.length === 0) {
      console.info(`No active subscriptions found for customer: ${customerId}`);
      const { error: noSubError } = await supabase.from('stripe_subscriptions').upsert(
        {
          customer_id: customerId,
          subscription_status: 'not_started',
        },
        {
          onConflict: 'customer_id',
        },
      );

      if (noSubError) {
        console.error('Error updating subscription status:', noSubError);
        throw new Error('Failed to update subscription status in database');
      }
    }

    // assumes that a customer can only have a single subscription
    const subscription = subscriptions.data[0];

    // store subscription state
    const { error: subError } = await supabase.from('stripe_subscriptions').upsert(
      {
        customer_id: customerId,
        subscription_id: subscription.id,
        price_id: subscription.items.data[0].price.id,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        ...(subscription.default_payment_method && typeof subscription.default_payment_method !== 'string'
          ? {
              payment_method_brand: subscription.default_payment_method.card?.brand ?? null,
              payment_method_last4: subscription.default_payment_method.card?.last4 ?? null,
            }
          : {}),
        status: subscription.status,
      },
      {
        onConflict: 'customer_id',
      },
    );

    if (subError) {
      console.error('Error syncing subscription:', subError);
      throw new Error('Failed to sync subscription in database');
    }
    console.info(`Successfully synced subscription for customer: ${customerId}`);
  } catch (error) {
    console.error(`Failed to sync subscription for customer ${customerId}:`, error);
    throw error;
  }
}
