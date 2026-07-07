import React from 'react'

const CONTACT_PRIVACY = 'privacy@trovalatuapace.com'
const CONTACT_SUPPORT = 'support@trovalatuapace.com'
const SEDE = 'Via G. Garibaldi, 36045 Lonigo (VI)'
const PIVA = '04054360245'
const LAST_UPDATE = '7 luglio 2026'

function Section({ title, children }) {
  return (
    <section className="legal-section">
      <h3>{title}</h3>
      {children}
    </section>
  )
}

function Privacy() {
  return (
    <>
      <Section title="1. Titolare del trattamento">
        <p>
          Il Titolare del trattamento dei dati raccolti tramite "Trova la tua pace" è
          <strong> Miriam Peloso</strong>, titolare di ditta individuale.
        </p>
        <p>Sede: {SEDE}<br />P.IVA: {PIVA}<br />Email: {CONTACT_PRIVACY}</p>
      </Section>

      <Section title="2. Che dati raccogliamo">
        <ul>
          <li><strong>Dati di registrazione:</strong> email e password (salvata in forma crittografata).</li>
          <li><strong>Dati di pagamento:</strong> gestiti interamente da Stripe, Inc. Non memorizziamo i dati completi della tua carta.</li>
          <li><strong>Contenuti che generi:</strong> voci del diario, conversazioni con il compagno di benessere emotivo AI, dati sugli esercizi di respirazione.</li>
          <li><strong>Dati tecnici:</strong> indirizzo IP, dispositivo, browser, log di accesso.</li>
        </ul>
        <p>
          I contenuti del diario e delle conversazioni con l'AI rientrano tra le "categorie particolari di dati"
          (art. 9 GDPR), relative al benessere psicologico. Vengono trattati solo con il tuo consenso esplicito,
          richiesto in fase di registrazione.
        </p>
      </Section>

      <Section title="3. Finalità e base giuridica">
        <ul>
          <li>Erogazione del Servizio — esecuzione del contratto</li>
          <li>Gestione abbonamento e pagamenti — esecuzione del contratto</li>
          <li>Trattamento contenuti diario/chat AI — consenso esplicito</li>
          <li>Sicurezza e obblighi di legge — obbligo legale / legittimo interesse</li>
        </ul>
        <p>Non usiamo i tuoi dati per marketing senza un consenso separato.</p>
      </Section>

      <Section title="4. Con chi condividiamo i dati">
        <ul>
          <li><strong>Supabase</strong> — database e autenticazione, infrastruttura nell'Unione Europea (Italia).</li>
          <li><strong>Stripe, Inc.</strong> — elaborazione pagamenti, certificato PCI-DSS.</li>
          <li><strong>Vercel Inc.</strong> — hosting dell'applicazione.</li>
        </ul>
        <p>Non vendiamo né cediamo i tuoi dati a terzi per finalità pubblicitarie.</p>
      </Section>

      <Section title="5. Conservazione dei dati">
        <p>
          Conserviamo i tuoi dati per tutta la durata dell'account. In caso di cancellazione, i dati vengono
          eliminati entro 30 giorni, salvo obblighi di legge (es. dati fiscali, conservati 10 anni).
        </p>
      </Section>

      <Section title="6. I tuoi diritti">
        <p>
          Hai diritto di accesso, rettifica, cancellazione, limitazione, portabilità, opposizione e revoca del
          consenso in qualsiasi momento. Scrivi a {CONTACT_PRIVACY} per esercitarli, oppure presenta reclamo al
          Garante Privacy (garanteprivacy.it).
        </p>
      </Section>

      <Section title="7. Minori">
        <p>Il Servizio non è destinato a persone di età inferiore ai 18 anni.</p>
      </Section>

      <Section title="8. Sicurezza">
        <p>Adottiamo crittografia delle password, connessioni HTTPS e controlli di accesso per proteggere i tuoi dati.</p>
      </Section>

      <Section title="9. Modifiche">
        <p>Questa informativa può essere aggiornata; le modifiche sostanziali ti saranno comunicate via email o notifica in-app.</p>
      </Section>
    </>
  )
}

function Termini() {
  return (
    <>
      <Section title="1. Chi siamo">
        <p>
          Il Servizio è gestito da <strong>Miriam Peloso</strong>, titolare di ditta individuale, P.IVA {PIVA},
          con sede in {SEDE}. Contatti: {CONTACT_SUPPORT}.
        </p>
      </Section>

      <Section title="2. Descrizione del Servizio">
        <p>"Trova la tua pace" offre un compagno di benessere emotivo AI, esercizi di respirazione guidata e un diario personale.</p>
        <p>
          <strong>Il Servizio non è un dispositivo medico, non fornisce diagnosi, cure o terapie psicologiche e non
          sostituisce la consulenza di uno psicologo, psicoterapeuta o medico abilitato.</strong> Se stai attraversando
          un momento di crisi o hai pensieri di autolesionismo, contatta subito un medico, il 112, o Telefono Amico
          Italia (02 2327 2327).
        </p>
      </Section>

      <Section title="3. Registrazione e account">
        <p>Devi avere almeno 18 anni e fornire un'email valida. Sei responsabile della riservatezza delle tue credenziali.</p>
      </Section>

      <Section title="4. Abbonamento e pagamenti">
        <ul>
          <li>Costo: €9,90/mese, salvo eventuale periodo di prova gratuita indicato al momento della sottoscrizione.</li>
          <li>Pagamenti elaborati da Stripe, Inc. Rinnovo automatico mensile fino a disdetta.</li>
          <li>
            <strong>Diritto di recesso:</strong> 14 giorni dalla sottoscrizione senza penalità (D.Lgs. 206/2005),
            salvo consenso espresso all'uso immediato del Servizio con perdita del diritto di recesso.
          </li>
          <li>Disdetta possibile in qualsiasi momento dalle impostazioni dell'account, con effetto a fine periodo di fatturazione.</li>
        </ul>
      </Section>

      <Section title="5. Uso corretto del Servizio">
        <p>Non è consentito un uso illecito, tentativi di violare la sicurezza, o il caricamento di contenuti offensivi o lesivi di diritti di terzi.</p>
      </Section>

      <Section title="6. Proprietà intellettuale">
        <p>
          Contenuti, grafica e marchio del Servizio sono di proprietà di Miriam Peloso. I contenuti che inserisci
          (diario, messaggi) restano tuoi; ci concedi una licenza limitata a trattarli per l'erogazione del Servizio.
        </p>
      </Section>

      <Section title="7. Limitazione di responsabilità">
        <p>
          Il Servizio è fornito "così com'è", nei limiti di legge. Non siamo responsabili per danni indiretti,
          salvo dolo o colpa grave. Restano fermi i diritti inderogabili dei consumatori.
        </p>
      </Section>

      <Section title="8. Modifiche">
        <p>Ci riserviamo il diritto di modificare Servizio e Termini, comunicando le modifiche sostanziali con ragionevole anticipo.</p>
      </Section>

      <Section title="9. Risoluzione">
        <p>Puoi cancellare il tuo account in qualsiasi momento. Possiamo sospendere account che violino i presenti Termini.</p>
      </Section>

      <Section title="10. Legge applicabile">
        <p>Legge italiana. Foro competente: quello di residenza del consumatore, secondo il Codice del Consumo.</p>
      </Section>

      <Section title="11. Contatti">
        <p>{CONTACT_SUPPORT}</p>
      </Section>
    </>
  )
}

function Cookie() {
  return (
    <>
      <Section title="1. Cosa sono i cookie">
        <p>Piccoli file di testo che il sito invia al tuo dispositivo, per essere poi ritrasmessi al sito stesso alla visita successiva.</p>
      </Section>

      <Section title="2. Cookie tecnici necessari">
        <p>Indispensabili al funzionamento del Servizio, sempre attivi, non richiedono consenso:</p>
        <ul>
          <li><strong>Autenticazione (Supabase):</strong> mantiene la sessione attiva.</li>
          <li><strong>Sicurezza checkout (Stripe):</strong> gestisce in modo sicuro il pagamento.</li>
        </ul>
      </Section>

      <Section title="3. Cookie di terze parti">
        <p>
          Durante il checkout, Stripe può impostare propri cookie tecnici per sicurezza e prevenzione frodi
          (vedi privacy policy di Stripe).
        </p>
      </Section>

      <Section title="4. Cookie di profilazione">
        <p>
          <strong>Non utilizziamo cookie di profilazione o marketing di terze parti</strong> (es. Google Analytics,
          Facebook Pixel). Se in futuro li introducessimo, richiederemo un consenso esplicito.
        </p>
      </Section>

      <Section title="5. Come gestirli">
        <p>
          Puoi gestire o eliminare i cookie dalle impostazioni del browser; disabilitare i cookie tecnici necessari
          potrebbe impedire il corretto funzionamento del Servizio.
        </p>
      </Section>

      <Section title="6. Contatti">
        <p>{CONTACT_PRIVACY}</p>
      </Section>
    </>
  )
}

const PAGES = {
  privacy: { label: 'Informativa sulla Privacy', Body: Privacy },
  termini: { label: 'Termini di Servizio', Body: Termini },
  cookie: { label: 'Cookie Policy', Body: Cookie },
}

export default function LegalPage({ page, onBack }) {
  const entry = PAGES[page]
  if (!entry) return null
  const { label, Body } = entry

  return (
    <div className="legal-view">
      <div className="top-nav">
        <button className="back" onClick={onBack}>← Indietro</button>
        <div className="brand">Trova la tua pace</div>
        <div style={{ width: 72 }} />
      </div>
      <div className="legal-content">
        <div className="eyebrow">{label}</div>
        <p className="legal-updated">Ultimo aggiornamento: {LAST_UPDATE}</p>
        <Body />
      </div>
    </div>
  )
}
