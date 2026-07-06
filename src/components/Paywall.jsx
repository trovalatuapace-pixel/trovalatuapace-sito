import React, { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Paywall({ userEmail }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function startCheckout() {
    setError('')
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ email: userEmail })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Errore nella creazione del pagamento')
      }
    } catch (err) {
      setError('Non siamo riuscite ad avviare il pagamento. Riprova tra poco.')
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <div className="paywall-view">
      <div className="eyebrow">Trova la tua pace</div>
      <h2>Sblocca il tuo spazio</h2>
      <p className="paywall-lead">
        3 giorni di prova gratuita, poi €9,90 al mese. Disdici quando vuoi.
      </p>
      <ul className="paywall-features">
        <li>Chat con supporto emotivo AI</li>
        <li>Esercizi di respirazione guidata</li>
        <li>Diario con andamento umore</li>
      </ul>
      {error && <div className="auth-error">{error}</div>}
      <button className="cta-primary" onClick={startCheckout} disabled={loading}>
        {loading ? '...' : 'Inizia i 3 giorni gratuiti'}
      </button>
      <button className="auth-switch" onClick={logout}>Esci</button>
    </div>
  )
}
