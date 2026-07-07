import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js'
import Auth from './components/Auth.jsx'
import Paywall from './components/Paywall.jsx'
import ChatPanel from './components/ChatPanel.jsx'
import Breathing from './components/Breathing.jsx'
import Journal from './components/Journal.jsx'
import LegalPage from './components/LegalPage.jsx'
import LegalFooter from './components/LegalFooter.jsx'

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = loading, null = no session
  const [subStatus, setSubStatus] = useState(undefined) // undefined = loading, {active:bool}
  const [tab, setTab] = useState('chat')
  const [legalPage, setLegalPage] = useState(null) // null | 'privacy' | 'termini' | 'cookie'

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) {
      setSubStatus(session === null ? null : undefined)
      return
    }
    let cancelled = false
    fetch('/api/check-subscription', {
      headers: { Authorization: `Bearer ${session.access_token}` }
    })
      .then(res => res.json())
      .then(data => { if (!cancelled) setSubStatus(data) })
      .catch(() => { if (!cancelled) setSubStatus({ active: false }) })
    return () => { cancelled = true }
  }, [session])

  if (legalPage) {
    return <LegalPage page={legalPage} onBack={() => setLegalPage(null)} />
  }

  if (session === undefined) {
    return <div className="app-shell loading-shell" />
  }

  if (!session) {
    return <Auth onAuthed={() => {}} onShowLegal={setLegalPage} />
  }

  if (subStatus === undefined) {
    return <div className="app-shell loading-shell" />
  }

  if (!subStatus.active) {
    return <Paywall userEmail={session.user.email} onShowLegal={setLegalPage} />
  }

  return (
    <div className="app-shell">
      <div className="top-nav">
        <button className="back" onClick={() => supabase.auth.signOut()}>Esci</button>
        <div className="brand">Trova la tua pace</div>
        <div style={{ width: 52 }} />
      </div>
      <div className="tabs">
        <button className={tab === 'chat' ? 'active' : ''} onClick={() => setTab('chat')}>Parla</button>
        <button className={tab === 'respiro' ? 'active' : ''} onClick={() => setTab('respiro')}>Respiro</button>
        <button className={tab === 'diario' ? 'active' : ''} onClick={() => setTab('diario')}>Diario</button>
      </div>
      <div className="view">
        {tab === 'chat' && <ChatPanel session={session} />}
        {tab === 'respiro' && <Breathing />}
        {tab === 'diario' && <Journal session={session} />}
      </div>
      <LegalFooter onShowLegal={setLegalPage} />
    </div>
  )
}
