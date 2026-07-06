import React, { useEffect, useRef, useState } from 'react'

const PATTERNS = {
  calma: { label: 'Calma (4-6)', steps: [
    { phase: 'inhale', label: 'Inspira', seconds: 4 },
    { phase: 'exhale', label: 'Espira', seconds: 6 },
  ]},
  scatola: { label: 'Scatola (4-4-4-4)', steps: [
    { phase: 'inhale', label: 'Inspira', seconds: 4 },
    { phase: 'hold', label: 'Trattieni', seconds: 4 },
    { phase: 'exhale', label: 'Espira', seconds: 4 },
    { phase: 'rest', label: 'Trattieni', seconds: 4 },
  ]},
  '478': { label: '4-7-8', steps: [
    { phase: 'inhale', label: 'Inspira', seconds: 4 },
    { phase: 'hold', label: 'Trattieni', seconds: 7 },
    { phase: 'exhale', label: 'Espira', seconds: 8 },
  ]},
}

export default function Breathing() {
  const [patternKey, setPatternKey] = useState('calma')
  const [running, setRunning] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(PATTERNS.calma.steps[0].seconds)
  const timeoutRef = useRef(null)
  const tickRef = useRef(null)

  const pattern = PATTERNS[patternKey]
  const step = pattern.steps[stepIndex]

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
      clearInterval(tickRef.current)
    }
  }, [])

  useEffect(() => {
    if (!running) return
    setSecondsLeft(step.seconds)
    tickRef.current = setInterval(() => {
      setSecondsLeft(s => (s > 1 ? s - 1 : s))
    }, 1000)
    timeoutRef.current = setTimeout(() => {
      clearInterval(tickRef.current)
      setStepIndex(i => (i + 1) % pattern.steps.length)
    }, step.seconds * 1000)
    return () => {
      clearTimeout(timeoutRef.current)
      clearInterval(tickRef.current)
    }
  }, [running, stepIndex, patternKey])

  function toggle() {
    if (running) {
      setRunning(false)
      clearTimeout(timeoutRef.current)
      clearInterval(tickRef.current)
    } else {
      setStepIndex(0)
      setRunning(true)
    }
  }

  function pickPattern(key) {
    setPatternKey(key)
    setRunning(false)
    setStepIndex(0)
    clearTimeout(timeoutRef.current)
    clearInterval(tickRef.current)
    setSecondsLeft(PATTERNS[key].steps[0].seconds)
  }

  return (
    <div className="breathing-view">
      <div className="breath-orb-wrap">
        <div
          className={`breath-orb ${running ? step.phase : 'rest'}`}
          style={{ transitionDuration: `${step.seconds}s` }}
        />
      </div>
      <div>
        <div className="breath-label">{running ? step.label : 'Pronta quando vuoi'}</div>
        {running && <div className="breath-count">{secondsLeft}s</div>}
      </div>
      <div className="pattern-picker">
        {Object.entries(PATTERNS).map(([key, p]) => (
          <button
            key={key}
            className={patternKey === key ? 'active' : ''}
            onClick={() => pickPattern(key)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <button className="breath-toggle" onClick={toggle}>
        {running ? 'Ferma' : 'Inizia a respirare'}
      </button>
    </div>
  )
}
