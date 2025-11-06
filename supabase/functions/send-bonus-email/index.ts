import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface BonusEmailRequest {
  email: string;
  customerName?: string;
  orderId: string;
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

    const { email, customerName, orderId }: BonusEmailRequest = await req.json();

    if (!email || !orderId) {
      return new Response(
        JSON.stringify({ error: 'Email and orderId are required' }),
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

    const { data: bonusProducts, error: bonusError } = await supabase
      .from('customer_product_access')
      .select('product_id, products!inner(title, download_url, is_bonus)')
      .eq('email', email)
      .eq('order_id', orderId)
      .eq('products.is_bonus', true);

    if (bonusError) {
      console.error('Error fetching bonus products:', bonusError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch bonus products' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!bonusProducts || bonusProducts.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No bonus products found for this order' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const emailHtml = generateBonusEmail(
      customerName || 'Valued Customer',
      bonusProducts
    );

    console.log(`Sending bonus email to: ${email}`);
    console.log(`Bonus products: ${JSON.stringify(bonusProducts)}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Bonus email sent successfully',
        email: emailHtml,
        bonusCount: bonusProducts.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in send-bonus-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateBonusEmail(customerName: string, bonusProducts: any[]): string {
  const bonusLinks = bonusProducts
    .map((bp: any) => {
      const product = bp.products;
      return `<div style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #2C2E83;">
        <h3 style="color: #2C2E83; margin: 0 0 10px 0;">${product.title}</h3>
        <a href="${product.download_url}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #2C2E83 0%, #8A2BE2 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Download Now</a>
      </div>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Bonus Downloads Are Ready!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f7;">
  <div style="max-width: 600px; margin: 40px auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #2C2E83 0%, #8A2BE2 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Your Bonus Downloads Are Ready!</h1>
    </div>
    
    <div style="padding: 40px 30px;">
      <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
        Hi ${customerName},
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
        Thank you for purchasing <strong>Zero to AI Income</strong>!
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 30px 0;">
        As promised, your free bonuses are ready to download:
      </p>
      
      ${bonusLinks}
      
      <div style="margin: 30px 0; padding: 20px; background-color: #e8f5e9; border-radius: 8px;">
        <p style="font-size: 15px; line-height: 1.6; color: #2e7d32; margin: 0;">
          We're excited to see you start your AI-powered journey. You've made your first step toward creating income that works for you 24/7.
        </p>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 20px 0 0 0;">
        Keep learning, keep building — and remember, we're here to help!
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 30px 0 10px 0;">
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
