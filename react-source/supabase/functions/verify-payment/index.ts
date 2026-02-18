import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { paymentId, orderId } = await req.json();

    if (!paymentId || !orderId) {
      return new Response(
        JSON.stringify({ error: 'paymentId and orderId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // PortOne API Secret from environment
    const portoneApiSecret = Deno.env.get('PORTONE_API_SECRET');
    if (!portoneApiSecret) {
      throw new Error('PORTONE_API_SECRET not configured');
    }

    // 1. Query PortOne API for payment details
    const portoneRes = await fetch(
      `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
      {
        headers: {
          'Authorization': `PortOne ${portoneApiSecret}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!portoneRes.ok) {
      const errText = await portoneRes.text();
      throw new Error(`PortOne API error: ${portoneRes.status} - ${errText}`);
    }

    const payment = await portoneRes.json();

    // 2. Get order from DB
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Compare amounts
    const paidAmount = payment.amount?.total;
    const orderAmount = order.total_amount;

    if (payment.status === 'PAID' && paidAmount === orderAmount) {
      // Verification passed — update order status
      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          portone_payment_id: paymentId,
          portone_tx_id: payment.txId || null,
          paid_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      return new Response(
        JSON.stringify({ verified: true, status: 'paid' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Amount mismatch or payment not completed
      await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
          portone_payment_id: paymentId,
        })
        .eq('id', orderId);

      return new Response(
        JSON.stringify({
          verified: false,
          status: 'failed',
          reason: paidAmount !== orderAmount
            ? `Amount mismatch: paid ${paidAmount}, expected ${orderAmount}`
            : `Payment status: ${payment.status}`,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (err) {
    console.error('verify-payment error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
