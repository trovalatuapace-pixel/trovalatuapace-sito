import React, { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Auth({ onAuthed }) {
  const [mode, setMode] = useState('login') // login | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({ email, password })
        if (signUpError) throw signUpError
        setNotice('Controlla la tua email per confermare la registrazione, poi accedi.')
        setMode('login')
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
        onAuthed?.()
      }
    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Email o password non corrette.'
        : 'Qualcosa non ha funzionato. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-view">
      <div className="auth-card">
        <div className="eyebrow">Trova la tua pace</div>
        <h2>{mode === 'login' ? 'Bentornata' : 'Crea il tuo account'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={6}
            required
          />
          {error && <div className="auth-error">{error}</div>}
          {notice && <div className="auth-notice">{notice}</div>}
          <button type="submit" disabled={loading}>
            {loading ? '...' : mode === 'login' ? 'Accedi' : 'Registrati'}
          </button>
        </form>
        <button
          className="auth-switch"
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setNotice('') }}
        >
          {mode === 'login' ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
        </button>
      </div>
    </div>
  )
}
