import React from 'react'

export default function LegalFooter({ onShowLegal }) {
  return (
    <div className="legal-footer">
      <button onClick={() => onShowLegal('privacy')}>Privacy</button>
      <span>·</span>
      <button onClick={() => onShowLegal('termini')}>Termini</button>
      <span>·</span>
      <button onClick={() => onShowLegal('cookie')}>Cookie</button>
    </div>
  )
}
