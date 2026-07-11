import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import {
  FaCheck, FaPlus, FaTrash, FaFile,
  FaShieldAlt, FaBell, FaHistory,
  FaEye, FaEyeSlash,
} from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import { PiUploadFill } from 'react-icons/pi';
import { BiSolidMessageDetail, BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { AiFillThunderbolt, AiOutlineCheckCircle } from 'react-icons/ai';
import './Bestellen.css';

/* ─── Static data ─────────────────────────────────────── */

const DOC_TYPES = [
  { id: 'geburtsurkunde',       label: 'Geburtsurkunde',               price: 30.30 },
  { id: 'heiratsurkunde',       label: 'Heiratsurkunde',               price: 30.30 },
  { id: 'scheidungsurkunde',    label: 'Scheidungsurkunde',            price: 30.30 },
  { id: 'sterbeurkunde',        label: 'Sterbeurkunde',                price: 30.30 },
  { id: 'fuehrerschein',        label: 'Führerschein',                 price: 30.30 },
  { id: 'reisepass',            label: 'Reisepass / Personalausweis',  price: 30.30 },
  { id: 'vollmacht',            label: 'Vollmacht / Beglaubigung',     price: 30.30 },
  { id: 'apostille',            label: 'Apostille',                    price: 30.30 },
  { id: 'schulzeugnis',         label: 'Schulzeugnis',                 price: 40.00 },
  { id: 'arbeitszeugnis',       label: 'Arbeitszeugnis',               price: 40.00 },
  { id: 'diplom',               label: 'Diplom / Abschlusszeugnis',    price: null  },
  { id: 'transcript',           label: 'Transcript / Notenausweis',    price: null  },
  { id: 'gerichtsentscheidung', label: 'Gerichtsentscheidung',         price: null  },
  { id: 'sonstiges',            label: 'Sonstiges Dokument',           price: null  },
] as const;

const LANGUAGES = [
  { code: 'uk',    label: 'Ukrainisch 🇺🇦' },
  { code: 'ru',    label: 'Russisch 🇷🇺'   },
  { code: 'tr',    label: 'Türkisch 🇹🇷'   },
  { code: 'en',    label: 'Englisch 🇬🇧'   },
  { code: 'pl',    label: 'Polnisch 🇵🇱'   },
  { code: 'ro',    label: 'Rumänisch 🇷🇴'  },
  { code: 'lt',    label: 'Litauisch 🇱🇹'  },
  { code: 'lv',    label: 'Lettisch 🇱🇻'   },
  { code: 'other', label: 'Andere Sprache 🌐' },
];

const PAYMENT_OPTS = [
  {
    id:    'kostenvoranschlag',
    title: 'Kostenvoranschlag anfordern',
    desc:  'Wir kalkulieren Ihren Auftrag und bestätigen den Preis vor Beginn.',
  },
  {
    id:    'rechnung',
    title: 'Auf Rechnung zahlen',
    desc:  'Zahlung nach Erhalt der fertigen Übersetzung per Überweisung.',
  },
  {
    id:    'stripe',
    title: 'Sofort online bezahlen',
    desc:  'Kreditkarte, Giropay, Apple Pay, Google Pay — sicher via Stripe.',
  },
];

const STEPS = ['Was übersetzen?', 'Kontaktdaten', 'Lieferung & Zahlung'];

/* ─── Types ───────────────────────────────────────────── */

interface DocRow { id: string; type: string; lang: string; }
type DeliveryMethod = 'pickup' | 'post';
type PaymentMethod  = 'kostenvoranschlag' | 'rechnung' | 'stripe';

const uid  = () => Math.random().toString(36).slice(2);
const fEur = (n: number) => `${n.toFixed(2).replace('.', ',')} €`;

/* ─── Component ───────────────────────────────────────── */

export default function Bestellen() {
  const [step,      setStep]      = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Step 0
  const [docs,    setDocs]    = useState<DocRow[]>([{ id: uid(), type: '', lang: 'uk' }]);
  const [files,   setFiles]   = useState<File[]>([]);
  const [message, setMessage] = useState('');
  const [msgOpen, setMsgOpen] = useState(false);
  const [drag,    setDrag]    = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Step 1
  const [name,  setName]  = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Step 2
  const [isExpress,    setIsExpress]    = useState(false);
  const [delivery,     setDelivery]     = useState<DeliveryMethod>('pickup');
  const [payment,      setPayment]      = useState<PaymentMethod>('kostenvoranschlag');
  const [wantsAccount, setWantsAccount] = useState(false);
  const [password,     setPassword]     = useState('');
  const [showPw,       setShowPw]       = useState(false);
  const [consent,      setConsent]      = useState({ agb: false, daten: false, widerruf: false });

  /* ── Derived price ── */
  const getPrice = (id: string): number | null =>
    (DOC_TYPES.find(d => d.id === id) as any)?.price ?? null;

  const filled    = docs.filter(d => d.type);
  const hasIndiv  = filled.some(d => getPrice(d.type) === null);
  const base      = filled.reduce((s, d) => s + (getPrice(d.type) ?? 0), 0);
  const exAdd     = isExpress ? base * 0.25 : 0;
  const postAdd   = delivery === 'post' ? 2.20 : 0;
  const total     = base + exAdd + postAdd;
  const priceLabel = !filled.length
    ? '—'
    : hasIndiv
    ? 'Kostenvoranschlag'
    : fEur(total);

  /* ── File handlers ── */
  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles(p => [...p, ...Array.from(list)]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    addFiles(e.dataTransfer.files);
  };

  /* ── Validation ── */
  const canNext = () => {
    if (step === 0) return filled.length > 0;
    if (step === 1) return !!(name.trim() && email.trim() && phone.trim());
    return consent.agb && consent.daten && consent.widerruf;
  };

  const goNext = () => {
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── Submit label ── */
  const submitLabel =
    payment === 'kostenvoranschlag' ? 'Kostenvoranschlag anfordern →'
    : payment === 'rechnung'        ? 'Bestellen & auf Rechnung zahlen →'
    :                                 'Bestellen & jetzt zahlen →';

  /* ── Success screen ── */
  if (submitted) {
    return (
      <div className="bst-page">
        <div className="bst-success">
          <AiOutlineCheckCircle className="bst-success__icon" />
          <h1>Bestellung eingegangen!</h1>
          <p>
            Wir haben Ihre Anfrage erhalten und melden uns innerhalb von
            30&nbsp;Minuten per E-Mail bei Ihnen.
          </p>
          <Link to="/" className="bst-btn-primary" style={{ marginTop: 8 }}>
            Zurück zur Startseite
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Main render ── */
  return (
    <div className="bst-page">

      {/* Sticky price bar */}
      <div className="bst-price-bar">
        <span className="bst-price-bar__label">Ihr Preis:</span>
        <span className="bst-price-bar__value">{priceLabel}</span>
        {hasIndiv && (
          <span className="bst-price-bar__note">
            Enthält Dokumente mit individuellem Preis
          </span>
        )}
      </div>

      <div className="bst-wrap">

        {/* Header */}
        <div className="bst-header">
          <h1>Beglaubigte Übersetzung bestellen</h1>
          <p>Schnell &amp; rechtssicher — vereidigter Übersetzer am Landgericht Hannover</p>
        </div>

        {/* Step indicator */}
        <div className="bst-steps">
          <div className="bst-steps__track">
            <div
              className="bst-steps__fill"
              style={{ width: step === 0 ? '0%' : step === 1 ? '50%' : '100%' }}
            />
          </div>
          {STEPS.map((label, i) => (
            <div
              key={i}
              className={`bst-step${i === step ? ' bst-step--active' : ''}${i < step ? ' bst-step--done' : ''}`}
            >
              <div className="bst-step__bubble">
                {i < step ? <FaCheck size={11} /> : i + 1}
              </div>
              <span className="bst-step__label">{label}</span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bst-card">

          {/* ══ Step 0: Dokumente ══ */}
          {step === 0 && (
            <>
              <div className="bst-section">
                <div className="bst-section-title">
                  <span>Welche Dokumente sollen übersetzt werden?</span>
                </div>

                {docs.map(doc => (
                  <div key={doc.id} className="bst-doc-row">
                    <div className="bst-select-wrap">
                      <select
                        className="bst-select"
                        value={doc.type}
                        onChange={e =>
                          setDocs(p => p.map(d =>
                            d.id === doc.id ? { ...d, type: e.target.value } : d
                          ))
                        }
                      >
                        <option value="">Dokumenttyp wählen …</option>
                        {DOC_TYPES.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.label}
                            {t.price !== null ? ` — ${fEur(t.price)}` : ' — Preis auf Anfrage'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="bst-select-wrap">
                      <select
                        className="bst-select"
                        value={doc.lang}
                        onChange={e =>
                          setDocs(p => p.map(d =>
                            d.id === doc.id ? { ...d, lang: e.target.value } : d
                          ))
                        }
                      >
                        {LANGUAGES.map(l => (
                          <option key={l.code} value={l.code}>{l.label}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      className="bst-btn-icon bst-btn-icon--del"
                      disabled={docs.length === 1}
                      onClick={() => setDocs(p => p.filter(d => d.id !== doc.id))}
                      title="Entfernen"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="bst-btn-add"
                  onClick={() => setDocs(p => [...p, { id: uid(), type: '', lang: 'uk' }])}
                >
                  <FaPlus size={11} /> Weiteres Dokument hinzufügen
                </button>
              </div>

              <div className="bst-section">
                <div className="bst-section-title">
                  <span>Dokumente hochladen</span>
                  <span className="bst-section-hint">Foto oder Scan (PDF, JPG, PNG)</span>
                </div>

                <div
                  className={`bst-dropzone${drag ? ' bst-dropzone--active' : ''}`}
                  onClick={() => fileRef.current?.click()}
                  onDrop={onDrop}
                  onDragOver={e => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                >
                  <PiUploadFill size={40} className="bst-dropzone__icon" />
                  <p className="bst-dropzone__title">Klicken oder hierher ziehen</p>
                  <p className="bst-dropzone__sub">PDF, JPG, PNG, DOCX — max. 10 MB pro Datei</p>
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={e => addFiles(e.target.files)}
                />

                {files.length > 0 && (
                  <div className="bst-files">
                    {files.map((f, i) => (
                      <div key={i} className="bst-file">
                        <FaFile className="bst-file__icon" size={15} />
                        <span className="bst-file__name">{f.name}</span>
                        <span className="bst-file__size">{(f.size / 1024).toFixed(0)} KB</span>
                        <button
                          type="button"
                          className="bst-file__del"
                          onClick={() => setFiles(p => p.filter((_, idx) => idx !== i))}
                          title="Entfernen"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bst-section">
                <button
                  type="button"
                  className="bst-accordion-trigger"
                  onClick={() => setMsgOpen(o => !o)}
                >
                  <BiSolidMessageDetail size={15} />
                  <span>Nachricht hinzufügen (optional)</span>
                  {msgOpen
                    ? <BiChevronUp  size={18} style={{ marginLeft: 'auto' }} />
                    : <BiChevronDown size={18} style={{ marginLeft: 'auto' }} />
                  }
                </button>
                {msgOpen && (
                  <div className="bst-accordion-body">
                    <textarea
                      className="bst-textarea"
                      rows={4}
                      placeholder="Besondere Anforderungen, Zielverwendung, Fristen …"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* ══ Step 1: Kontaktdaten ══ */}
          {step === 1 && (
            <div className="bst-section">
              <div className="bst-section-title">
                <span>Ihre Kontaktdaten</span>
              </div>

              <div className="bst-field">
                <label className="bst-label">Vor- und Nachname *</label>
                <input
                  className="bst-input"
                  type="text"
                  placeholder="Max Mustermann"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="bst-field">
                <label className="bst-label">E-Mail-Adresse *</label>
                <input
                  className="bst-input"
                  type="email"
                  placeholder="max@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="bst-field">
                <label className="bst-label">Handynummer *</label>
                <div className="bst-phone-wrap">
                  <span className="bst-phone-prefix">🇩🇪 +49</span>
                  <input
                    className="bst-input bst-input--phone"
                    type="tel"
                    placeholder="151 23456789"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
                <p className="bst-field-hint">
                  Wir kontaktieren Sie bei Rückfragen per WhatsApp oder Anruf.
                </p>
              </div>
            </div>
          )}

          {/* ══ Step 2: Zusammenfassung ══ */}
          {step === 2 && (
            <>
              {/* Summary */}
              {filled.length > 0 && (
                <div className="bst-section">
                  <div className="bst-section-title"><span>Zusammenfassung</span></div>
                  <div className="bst-summary-docs">
                    {filled.map(doc => {
                      const dt  = DOC_TYPES.find(t => t.id === doc.type);
                      const lg  = LANGUAGES.find(l => l.code === doc.lang);
                      const pr  = getPrice(doc.type);
                      return (
                        <div key={doc.id} className="bst-summary-doc">
                          <span className="bst-summary-doc__name">
                            {dt?.label}{' '}
                            <span className="bst-summary-doc__lang">
                              ({lg?.label.split(' ')[0]})
                            </span>
                          </span>
                          <span className="bst-summary-doc__price">
                            {pr !== null ? fEur(pr) : <em>Preis auf Anfrage</em>}
                          </span>
                        </div>
                      );
                    })}
                    {files.length > 0 && (
                      <p className="bst-summary-files">
                        {files.length} Datei{files.length !== 1 ? 'en' : ''} angehängt
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Express */}
              <div className="bst-section">
                <div className="bst-section-title"><span>Express-Option</span></div>
                <label className={`bst-toggle-card${isExpress ? ' bst-toggle-card--on' : ''}`}>
                  <input
                    type="checkbox"
                    checked={isExpress}
                    onChange={e => setIsExpress(e.target.checked)}
                  />
                  <div className="bst-toggle-card__icon">
                    <AiFillThunderbolt size={18} />
                  </div>
                  <div className="bst-toggle-card__info">
                    <span className="bst-toggle-card__title">Express 24 Stunden</span>
                    <span className="bst-toggle-card__desc">
                      Fertig am nächsten Werktag — 25% Aufpreis
                    </span>
                  </div>
                  <span className="bst-toggle-card__badge">+25%</span>
                </label>
              </div>

              {/* Delivery */}
              <div className="bst-section">
                <div className="bst-section-title"><span>Abholmethode</span></div>
                <div className="bst-radio-group">
                  {([
                    { id: 'pickup', icon: '🏢', title: 'Persönliche Abholung', sub: 'Hannover Innenstadt — kostenlos' },
                    { id: 'post',   icon: '📬', title: 'Versand per Post',      sub: 'Deutschlandweit — +2,20 €'     },
                  ] as const).map(opt => (
                    <label
                      key={opt.id}
                      className={`bst-radio-card${delivery === opt.id ? ' bst-radio-card--on' : ''}`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={opt.id}
                        checked={delivery === opt.id}
                        onChange={() => setDelivery(opt.id)}
                      />
                      <span className="bst-radio-card__icon">{opt.icon}</span>
                      <div>
                        <span className="bst-radio-card__title">{opt.title}</span>
                        <span className="bst-radio-card__sub">{opt.sub}</span>
                      </div>
                      <span className={`bst-radio-check${delivery === opt.id ? ' bst-radio-check--on' : ''}`}>
                        {delivery === opt.id && <FaCheck size={9} />}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price breakdown (only when price is known) */}
              {filled.length > 0 && !hasIndiv && (
                <div className="bst-section">
                  <div className="bst-breakdown">
                    <div className="bst-breakdown__row">
                      <span>Dokumente ({filled.length})</span>
                      <span>{fEur(base)}</span>
                    </div>
                    {isExpress && (
                      <div className="bst-breakdown__row bst-breakdown__row--add">
                        <span>Express-Aufpreis (+25%)</span>
                        <span>+{fEur(exAdd)}</span>
                      </div>
                    )}
                    {delivery === 'post' && (
                      <div className="bst-breakdown__row bst-breakdown__row--add">
                        <span>Versand per Post</span>
                        <span>+2,20 €</span>
                      </div>
                    )}
                    <div className="bst-breakdown__total">
                      <span>Gesamt</span>
                      <span>{fEur(total)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment */}
              <div className="bst-section">
                <div className="bst-section-title"><span>Zahlungsart</span></div>
                <div className="bst-payment-opts">
                  {PAYMENT_OPTS.map(opt => (
                    <label
                      key={opt.id}
                      className={`bst-payment-opt${payment === opt.id ? ' bst-payment-opt--on' : ''}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={opt.id}
                        checked={payment === opt.id}
                        onChange={() => setPayment(opt.id as PaymentMethod)}
                      />
                      <span className={`bst-radio-check${payment === opt.id ? ' bst-radio-check--on' : ''}`}>
                        {payment === opt.id && <FaCheck size={9} />}
                      </span>
                      <div>
                        <span className="bst-payment-opt__title">{opt.title}</span>
                        <span className="bst-payment-opt__desc">{opt.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Optional account creation */}
              <div className="bst-section">
                <div className={`bst-account-card${wantsAccount ? ' bst-account-card--on' : ''}`}>
                  <div className="bst-account-promo">
                    <div className="bst-account-icon">
                      <FaShieldAlt size={16} />
                    </div>
                    <div className="bst-account-promo__text">
                      <span className="bst-account-promo__title">Kostenloses Konto anlegen</span>
                      <span className="bst-account-promo__sub">
                        Auftragsstatus verfolgen und Benachrichtigungen erhalten
                      </span>
                    </div>
                    <button
                      type="button"
                      className={`bst-account-toggle${wantsAccount ? ' bst-account-toggle--on' : ''}`}
                      onClick={() => setWantsAccount(o => !o)}
                    >
                      {wantsAccount ? 'Aktiviert ✓' : 'Aktivieren'}
                    </button>
                  </div>

                  {!wantsAccount && (
                    <div className="bst-account-benefits">
                      {[
                        { icon: <FaHistory size={12} />, text: 'Auftragsstatus in Echtzeit verfolgen' },
                        { icon: <FaBell    size={12} />, text: 'E-Mail-Benachrichtigungen erhalten'  },
                        { icon: <FaShieldAlt size={12} />, text: 'Nächste Bestellung schneller aufgeben' },
                      ].map((b, i) => (
                        <div key={i} className="bst-account-benefit">
                          <span className="bst-account-benefit__icon">{b.icon}</span>
                          <span>{b.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={`bst-account-fields${wantsAccount ? ' bst-account-fields--open' : ''}`}>
                    <div className="bst-account-fields__inner">
                      <div className="bst-field" style={{ marginBottom: 0 }}>
                        <label className="bst-label">Passwort wählen</label>
                        <div className="bst-pw-wrap">
                          <input
                            className="bst-pw-input"
                            type={showPw ? 'text' : 'password'}
                            placeholder="Mindestens 8 Zeichen"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            className="bst-pw-toggle"
                            onClick={() => setShowPw(o => !o)}
                          >
                            {showPw ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consent checkboxes */}
              <div className="bst-section">
                <div className="bst-consent">
                  {([
                    {
                      key:  'agb',
                      text: (
                        <>
                          Ich stimme den{' '}
                          <Link to="/terms" className="bst-link">Allgemeinen Geschäftsbedingungen</Link>{' '}
                          zu.
                        </>
                      ),
                    },
                    {
                      key:  'daten',
                      text: (
                        <>
                          Ich habe die{' '}
                          <Link to="/privacy" className="bst-link">Datenschutzerklärung</Link>{' '}
                          gelesen und stimme der Verarbeitung meiner Daten zu.
                        </>
                      ),
                    },
                    {
                      key:  'widerruf',
                      text: 'Ich stimme zu, dass mit der Ausführung des Auftrags vor Ablauf der Widerrufsfrist begonnen wird.',
                    },
                  ] as const).map(({ key, text }) => (
                    <label key={key} className="bst-consent-row">
                      <input
                        type="checkbox"
                        className="bst-checkbox"
                        checked={consent[key]}
                        onChange={e => setConsent(c => ({ ...c, [key]: e.target.checked }))}
                      />
                      <span className="bst-consent-text">{text}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Navigation ── */}
          <div className="bst-nav">
            {step > 0 && (
              <button className="bst-btn-ghost" onClick={goBack}>
                <IoArrowBack size={15} /> Zurück
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < 2 ? (
              <button
                className="bst-btn-primary"
                disabled={!canNext()}
                onClick={goNext}
              >
                Weiter →
              </button>
            ) : (
              <button
                className="bst-btn-primary bst-btn-submit"
                disabled={!canNext()}
                onClick={() => setSubmitted(true)}
              >
                {submitLabel}
              </button>
            )}
          </div>
        </div>

        {/* Trust signals */}
        <div className="bst-trust">
          <span>🔒 SSL-verschlüsselt</span>
          <span>⚡ Antwort in 30 Min.</span>
          <span>✅ Vereidigter Übersetzer</span>
          <span>★ 4,8 / 5 Google</span>
        </div>

      </div>
      <Footer />
    </div>
  );
}
