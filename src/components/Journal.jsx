import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const MOODS = [
  { value: 1, emoji: '😔' },
  { value: 2, emoji: '😕' },
  { value: 3, emoji: '😐' },
  { value: 4, emoji: '🙂' },
  { value: 5, emoji: '😄' },
]

export default function Journal({ session }) {
  const [entries, setEntries] = useState([])
  const [mood, setMood] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEntries()
  }, [])

  async function loadEntries() {
    setLoading(true)
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    if (!error && data) setEntries(data)
    setLoading(false)
  }

  async function handleSave() {
    if (!mood && !text.trim()) return
    const { error } = await supabase.from('journal_entries').insert({
      user_id: session.user.id,
      mood: mood || 3,
      entry_text: text.trim(),
    })
    if (!error) {
      setMood(null)
      setText('')
      loadEntries()
    }
  }

  const trend = [...entries].slice(0, 14).reverse()

  return (
    <div className="journal-view">
      <h2>Come ti senti oggi?</h2>
      <p className="journal-sub">Un piccolo spazio per fare ordine nei pensieri.</p>

      <div className="mood-row">
        {MOODS.map(m => (
          <button
            key={m.value}
            className={mood === m.value ? 'active' : ''}
            onClick={() => setMood(m.value)}
            aria-label={`stato d'animo ${m.value}`}
          >
            {m.emoji}
          </button>
        ))}
      </div>

      <textarea
        className="journal-textarea"
        placeholder="Scrivi liberamente, senza filtri..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button className="save-entry" onClick={handleSave}>Salva nel diario</button>

      {trend.length > 1 && (
        <div className="trend-chart">
          {trend.map(e => (
            <div key={e.id} className="trend-bar" style={{ height: `${e.mood * 18}px` }} />
          ))}
        </div>
      )}

      <div className="entry-list">
        {loading && <div className="empty-state">Caricamento...</div>}
        {!loading && entries.length === 0 && (
          <div className="empty-state">Non hai ancora nessuna voce. Inizia da qui sopra.</div>
        )}
        {entries.map(e => (
          <div key={e.id} className="entry-card">
            <div className="entry-top">
              <span>{new Date(e.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              <span>{MOODS.find(m => m.value === e.mood)?.emoji}</span>
            </div>
            {e.entry_text && <p>{e.entry_text}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
 
