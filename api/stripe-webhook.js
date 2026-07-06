import { createClient } from '@supabase/supabase-js'
import crypto from 'node:crypto'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function verifyStripeSignature(rawBody, signatureHeader, secret) {
  const parts = Object.fromEntries(
    signatureHeader.split(',').map(p => p.split('='))
  )
  const signedPayload = `${parts.t}.${rawBody}`
  const expected = crypto
    .createHmac('sha256', secret)
    .update(signedPayload, 'utf8')
    .digest('hex')
  return expected === parts.v1
}

export async function POST(request) {
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature') || ''

  let valid = false
  try {
    valid = verifyStripeSignature(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    valid = false
  }

  if (!valid) {
    return new Response(JSON.stringify({ error: 'Firma non valida' }), { status: 400 })
  }

  const event = JSON.parse(rawBody)

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const userId = session.metadata?.user_id || session.client_reference_id
      if (userId) {
        await supabaseAdmin.from('subscribers').upsert({
          user_id: userId,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          status: 'trialing',
          updated_at: new Date().toISOString()
        })
      }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const sub = event.data.object
      const userId = sub.metadata?.user_id
      if (userId) {
        await supabaseAdmin.from('subscribers').upsert({
          user_id: userId,
          stripe_customer_id: sub.customer,
          stripe_subscription_id: sub.id,
          status: event.type === 'customer.subscription.deleted' ? 'canceled' : sub.status,
          trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
          current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
          updated_at: new Date().toISOString()
        })
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return new Response(JSON.stringify({ error: 'Errore interno' }), { status: 500 })
  }
}
