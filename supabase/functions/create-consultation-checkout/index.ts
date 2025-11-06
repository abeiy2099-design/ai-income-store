import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  appInfo: {
    name: 'JENA Tech Consulting',
    version: '1.0.0',
  },
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

interface ConsultationCheckoutRequest {
  serviceId: string;
  customerName: string;
  customerEmail: string;
  scheduledDate: string;
  message?: string;
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders,
      });
    }

    const { serviceId, customerName, customerEmail, scheduledDate, message }: ConsultationCheckoutRequest = await req.json();

    console.log('Received checkout request:', { serviceId, customerName, customerEmail, scheduledDate, message });

    if (!serviceId || !customerName || !customerEmail || !scheduledDate) {
      console.error('Missing required fields:', { serviceId, customerName, customerEmail, scheduledDate });
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Fetching service from database with ID:', serviceId);
    const { data: service, error: serviceError } = await supabase
      .from('consulting_services')
      .select('*')
      .eq('service_id', serviceId)
      .maybeSingle();

    if (serviceError) {
      console.error('Database error fetching service:', serviceError);
      return new Response(
        JSON.stringify({ error: `Service lookup failed: ${serviceError.message}` }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!service) {
      console.error('Service not found in database for ID:', serviceId);
      return new Response(
        JSON.stringify({ error: 'Service not found. Please ensure services are configured in the database.' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Found service:', service);

    console.log('Creating Stripe checkout session...');
    const origin = req.headers.get('origin') || 'https://www.jenatechandai.com';
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: service.title,
              description: `${service.description} - ${service.duration}`,
            },
            unit_amount: Math.round(parseFloat(service.price) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/consultation-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/consulting`,
      customer_email: customerEmail,
      metadata: {
        serviceId: serviceId,
        customerName: customerName,
        scheduledDate: scheduledDate,
        message: message || '',
        type: 'consultation',
      },
    });

    console.log('Stripe checkout session created successfully:', session.id);

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error creating consultation checkout:', error);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
