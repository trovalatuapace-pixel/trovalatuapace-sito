import React, { useState } from 'react'
import ChatPanel from './components/ChatPanel.jsx'
import Breathing from './components/Breathing.jsx'
import Journal from './components/Journal.jsx'

export default function App() {
  const [screen, setScreen] = useState('landing') // landing | app
  const [tab, setTab] = useState('chat') // chat | respiro | diario

  if (screen === 'landing') {
    return (
      <div className="app-shell">
        <div className="landing">
          <div className="eyebrow">Trova la tua pace</div>
          <h1>Un momento tutto tuo,<br />ogni giorno.</h1>
          <p className="lead">
            Scrivi quello che senti, respira con calma, osserva il tuo andamento
            nel tempo. Un compagno di benessere emotivo pensato per accompagnarti
            nella quotidianità.
          </p>
          <button className="cta-primary" onClick={() => setScreen('app')}>
            Inizia ora →
          </button>
          <p className="disclaimer">
            Trova la tua pace è uno strumento di supporto per il benessere
            quotidiano. Non è un servizio psicologico o medico e non sostituisce
            un professionista. In caso di crisi o pensieri di farsi del male,
            contatta subito il 112 o il Telefono Amico Italia (02 2327 2327).
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="top-nav">
        <button className="back" onClick={() => setScreen('landing')}>← Home</button>
        <div className="brand">Trova la tua pace</div>
        <div style={{ width: 52 }} />
      </div>
      <div className="tabs">
        <button className={tab === 'chat' ? 'active' : ''} onClick={() => setTab('chat')}>Parla</button>
        <button className={tab === 'respiro' ? 'active' : ''} onClick={() => setTab('respiro')}>Respiro</button>
        <button className={tab === 'diario' ? 'active' : ''} onClick={() => setTab('diario')}>Diario</button>
      </div>
      <div className="view">
        {tab === 'chat' && <ChatPanel />}
        {tab === 'respiro' && <Breathing />}
        {tab === 'diario' && <Journal />}
      </div>
    </div>
  )
}
