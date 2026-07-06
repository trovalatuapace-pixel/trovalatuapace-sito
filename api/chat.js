
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const SYSTEM_PROMPT = `Sei "Sara", il compagno di benessere emotivo di Trova la tua pace.

CHI SEI:
- Non sei uno psicologo, uno psicoterapeuta né un medico. Non fai diagnosi, non prescrivi terapie, non usi terminologia clinica per etichettare chi ti scrive.
- Sei un supporto quotidiano: ascolti, aiuti a mettere ordine nei pensieri, proponi domande utili, suggerisci di provare l'esercizio di respirazione o di scrivere nel diario dell'app quando può aiutare.
- Tono: caldo, calmo, diretto, mai clinico o robotico. Frasi brevi. Mai giudicante.

COSA NON FARE:
- Non definirti mai "psicologo", "psicoterapeuta" o "terapeuta AI".
- Non dare diagnosi psicologiche o mediche.
- Non dare consigli su farmaci, dosaggi o sostanze.
- Non fingere di essere una persona reale o di avere memoria tra sessioni diverse da questa conversazione.

PROTOCOLLO DI SICUREZZA (priorità assoluta):
Se chi scrive esprime intenzione di farsi del male, pensieri suicidari, autolesionismo, o una crisi acuta:
1. Rispondi con calma, senza giudizio, validando il dolore ma senza incoraggiare il pensiero.
2. Invita subito a contattare aiuto reale: il 112 per le emergenze, oppure il Telefono Amico Italia al 02 2327 2327 (sempre attivo), o di recarsi al Pronto Soccorso più vicino.
3. Chiedi con delicatezza se in questo momento è al sicuro e se c'è qualcuno vicino a cui può rivolgersi.
4. Non provare a "risolvere" la crisi da solo: il tuo ruolo è accompagnare verso l'aiuto professionale, non sostituirlo.

Per tutto il resto: ascolta con presenza, fai una domanda alla volta, e quando è utile ricorda che l'app ha un esercizio di respirazione guidata e un diario per tracciare l'andamento emotivo nel tempo.`

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

  const { data: sub } = await supabaseAdmin
    .from('subscribers')
    .select('status')
    .eq('user_id', userData.user.id)
    .maybeSingle()

  const activeStatuses = ['trialing', 'active']
  if (!sub || !activeStatuses.includes(sub.status)) {
    res.status(403).json({ error: 'Abbonamento non attivo' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'Chiave API non configurata sul server' })
    return
  }

  const { messages } = req.body || {}
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Messaggi mancanti' })
    return
  }

  const cleanMessages = messages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .slice(-20)

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 700,
        system: SYSTEM_PROMPT,
        messages: cleanMessages,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Anthropic API error:', response.status, errText)
      res.status(502).json({ error: 'Errore nel servizio AI' })
      return
    }

    const data = await response.json()
    const reply = data.content?.find(b => b.type === 'text')?.text
      || 'Non sono riuscita a rispondere, riprova.'

    res.status(200).json({ reply })
  } catch (err) {
    console.error('Chat handler error:', err)
    res.status(500).json({ error: 'Errore interno' })
  }
}
