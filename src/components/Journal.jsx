import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'ttp_journal_entries_v1'
const MOODS = [
  { value: 1, emoji: '😔' },
  { value: 2, emoji: '😕' },
  { value: 3, emoji: '😐' },
  { value: 4, emoji: '🙂' },
  { value: 5, emoji: '😄' },
]

function loadEntries() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveEntries(entries) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // storage unavailable, entries stay in-memory for this session
  }
}

export default function Journal() {
  const [entries, setEntries] = useState([])
  const [mood, setMood] = useState(null)
  const [text, setText] = useState('')

  useEffect(() => {
    setEntries(loadEntries())
  }, [])

  function handleSave() {
    if (!mood && !text.trim()) return
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mood: mood || 3,
      text: text.trim(),
    }
    const next = [entry, ...entries]
    setEntries(next)
    saveEntries(next)
    setMood(null)
    setText('')
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
        {entries.length === 0 && (
          <div className="empty-state">Non hai ancora nessuna voce. Inizia da qui sopra.</div>
        )}
        {entries.map(e => (
          <div key={e.id} className="entry-card">
            <div className="entry-top">
              <span>{new Date(e.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              <span>{MOODS.find(m => m.value === e.mood)?.emoji}</span>
            </div>
            {e.text && <p>{e.text}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
