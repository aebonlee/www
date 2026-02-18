import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, webhook-id, webhook-timestamp, webhook-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { type, data } = body;

    // Webhook signature verification (recommended for production)
    const webhookSecret = Deno.env.get('PORTONE_WEBHOOK_SECRET');
    if (webhookSecret) {
      const webhookId = req.headers.get('webhook-id');
      const webhookTimestamp = req.headers.get('webhook-timestamp');
      const webhookSignature = req.headers.get('webhook-signature');

      if (!webhookId || !webhookTimestamp || !webhookSignature) {
        return new Response(
          JSON.stringify({ error: 'Missing webhook signature headers' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      // Note: Full HMAC verification can be added here for production
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (type === 'Transaction.Paid') {
      const paymentId = data?.paymentId;
      if (!paymentId) {
        return new Response(
          JSON.stringify({ error: 'No paymentId in webhook data' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Find order by portone_payment_id
      const { data: order } = await supabase
        .from('orders')
        .select('id, total_amount, payment_status')
        .eq('portone_payment_id', paymentId)
        .single();

      if (order && order.payment_status !== 'paid') {
        // Verify with PortOne API
        const portoneApiSecret = Deno.env.get('PORTONE_API_SECRET');
        const portoneRes = await fetch(
          `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
          {
            headers: {
              'Authorization': `PortOne ${portoneApiSecret}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (portoneRes.ok) {
          const payment = await portoneRes.json();
          if (payment.status === 'PAID' && payment.amount?.total === order.total_amount) {
            await supabase
              .from('orders')
              .update({
                payment_status: 'paid',
                portone_tx_id: payment.txId || null,
                paid_at: new Date().toISOString(),
              })
              .eq('id', order.id);
          }
        }
      }
    } else if (type === 'Transaction.Cancelled') {
      const paymentId = data?.paymentId;
      if (paymentId) {
        await supabase
          .from('orders')
          .update({ payment_status: 'cancelled' })
          .eq('portone_payment_id', paymentId);
      }
    } else if (type === 'Transaction.Failed') {
      const paymentId = data?.paymentId;
      if (paymentId) {
        await supabase
          .from('orders')
          .update({ payment_status: 'failed' })
          .eq('portone_payment_id', paymentId);
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('portone-webhook error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
