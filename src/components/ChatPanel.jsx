import React, { useState, useRef, useEffect } from 'react'

const WELCOME = "Ciao. Sono qui per ascoltarti, senza fretta. Cosa ti va di raccontarmi oggi?"

export default function ChatPanel() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: WELCOME }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })) })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setMessages(m => [...m, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setMessages(m => [...m, {
        role: 'system-note',
        content: 'Qualcosa non ha funzionato. Riprova tra un momento.'
      }])
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="chat-view">
      <div className="chat-scroll" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>{m.content}</div>
        ))}
        {loading && <div className="msg assistant">…</div>}
      </div>
      <div className="chat-input-bar">
        <textarea
          rows={1}
          value={input}
          placeholder="Scrivi qui..."
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button onClick={send} disabled={loading || !input.trim()}>↑</button>
      </div>
    </div>
  )
}
