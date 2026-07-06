import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
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

  const { data, error } = await supabaseAdmin
    .from('subscribers')
    .select('status, trial_end, current_period_end')
    .eq('user_id', userData.user.id)
    .maybeSingle()

  if (error) {
    res.status(500).json({ error: 'Errore nel controllo abbonamento' })
    return
  }

  const activeStatuses = ['trialing', 'active']
  const isActive = data ? activeStatuses.includes(data.status) : false

  res.status(200).json({
    active: isActive,
    status: data?.status || 'none',
    trialEnd: data?.trial_end || null,
    currentPeriodEnd: data?.current_period_end || null
  })
}
