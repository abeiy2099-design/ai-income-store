import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface BookingConfirmationRequest {
  bookingId: string;
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

    const { bookingId }: BookingConfirmationRequest = await req.json();

    if (!bookingId) {
      return new Response(
        JSON.stringify({ error: 'Booking ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: booking, error: bookingError } = await supabase
      .from('consultation_bookings')
      .select('*, consulting_services!inner(*)')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      console.error('Error fetching booking:', bookingError);
      return new Response(
        JSON.stringify({ error: 'Booking not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const emailHtml = generateBookingConfirmationEmail(booking);

    await supabase
      .rpc('mark_booking_confirmation_sent', { p_booking_id: bookingId });

    console.log(`Booking confirmation sent to: ${booking.customer_email}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Booking confirmation sent successfully',
        email: emailHtml,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in send-booking-confirmation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateBookingConfirmationEmail(booking: any): string {
  const service = booking.consulting_services;
  const scheduledDate = new Date(booking.scheduled_date);
  const formattedDate = scheduledDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = scheduledDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your JENA Tech Consulting Session is Confirmed!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f7;">
  <div style="max-width: 600px; margin: 40px auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #2C2E83 0%, #8A2BE2 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">✅ Your Consulting Session is Confirmed!</h1>
    </div>
    
    <div style="padding: 40px 30px;">
      <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
        Hi ${booking.customer_name},
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 30px 0;">
        Thank you for booking your consulting session with <strong>JENA Tech</strong>!
      </p>
      
      <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #2C2E83; margin-bottom: 30px;">
        <h3 style="color: #2C2E83; margin: 0 0 15px 0; font-size: 18px;">Your Session Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: 600;">Service:</td>
            <td style="padding: 8px 0; color: #333;">${service.title}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: 600;">Date:</td>
            <td style="padding: 8px 0; color: #333;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: 600;">Time:</td>
            <td style="padding: 8px 0; color: #333;">${formattedTime}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: 600;">Duration:</td>
            <td style="padding: 8px 0; color: #333;">${service.duration}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: 600;">Meeting Link:</td>
            <td style="padding: 8px 0;">
              <a href="${booking.meeting_link || '#'}" style="color: #2C2E83; text-decoration: none; font-weight: 600;">Join Meeting</a>
            </td>
          </tr>
        </table>
      </div>
      
      <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <p style="font-size: 15px; line-height: 1.6; color: #1565c0; margin: 0;">
          🔔 <strong>Reminder:</strong> You will receive reminders 24 hours and 1 hour before your scheduled session.
        </p>
      </div>
      
      <div style="margin: 30px 0; padding: 20px; background-color: #e8f5e9; border-radius: 8px;">
        <p style="font-size: 15px; line-height: 1.6; color: #2e7d32; margin: 0;">
          We're excited to work with you and help you grow your AI-powered business!
        </p>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 20px 0 0 0;">
        Warm regards,<br>
        <strong>The JENA Tech Team</strong>
      </p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
        <p style="font-size: 14px; color: #666; margin: 0;">
          🌐 <a href="https://www.jenatechandai.com" style="color: #2C2E83; text-decoration: none;">www.jenatechandai.com</a>
        </p>
        <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">
          📧 <a href="mailto:info@jenatechs.com" style="color: #2C2E83; text-decoration: none;">info@jenatechs.com</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
