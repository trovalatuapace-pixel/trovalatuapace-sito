import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Metodo non consentito' })
    return
  }

  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace('Bearer ', '')
  if (!token) {
    res.status(401).json({ error: 'Non autenticata' })
    return
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
  if (userError || !userData?.user) {
    res.status(401).json({ error: 'Sessione non valida' })
    return
  }
  const user = userData.user

  try {
    const params = new URLSearchParams()
    params.append('mode', 'subscription')
    params.append('line_items[0][price]', process.env.STRIPE_PRICE_ID)
    params.append('line_items[0][quantity]', '1')
    params.append('payment_method_types[0]', 'card')
    params.append('payment_method_types[1]', 'satispay')
    params.append('subscription_data[trial_period_days]', '3')
    params.append('client_reference_id', user.id)
    params.append('customer_email', user.email)
    params.append('metadata[user_id]', user.id)
    params.append('subscription_data[metadata][user_id]', user.id)
    params.append('success_url', `${req.headers.origin}/?checkout=success`)
    params.append('cancel_url', `${req.headers.origin}/?checkout=cancelled`)

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })

    const session = await response.json()
    if (!response.ok) {
      console.error('Stripe error:', session)
      res.status(502).json({ error: 'Errore nella creazione del pagamento' })
      return
    }

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Checkout session error:', err)
    res.status(500).json({ error: 'Errore interno' })
  }
}
