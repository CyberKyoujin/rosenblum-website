import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { IoCalculatorOutline, IoWarningOutline } from 'react-icons/io5';

const PRICE_PER_LINE = 1.40;

interface DocTypeConfig {
  id: string;
  labelKey: string;
  avgLines: number;
}

const DOC_TYPES: DocTypeConfig[] = [
  { id: 'workbook',  labelKey: 'calc.docWorkbook', avgLines: 40 },
  { id: 'diploma',   labelKey: 'calc.docDiploma',  avgLines: 35 },
  { id: 'court',     labelKey: 'calc.docCourt',    avgLines: 45 },
  { id: 'medical',   labelKey: 'calc.docMedical',  avgLines: 30 },
  { id: 'education', labelKey: 'calc.docEducation',avgLines: 30 },
];

export default function PriceCalculator() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedDocId, setSelectedDocId] = useState(DOC_TYPES[0].id);
  const [pages, setPages] = useState(3);

  const doc = DOC_TYPES.find(d => d.id === selectedDocId)!;
  const avgPrice = Math.ceil(pages * doc.avgLines * PRICE_PER_LINE);

  return (
    <div className="price-calculator">

      <div className="price-calculator__header">
        <div className="price-calculator__badge">
          <IoCalculatorOutline />
          {t('calc.badge')}
        </div>
        <h2 className="price-calculator__title">{t('calc.title')}</h2>
        <p className="price-calculator__subtitle">{t('calc.subtitle')}</p>
      </div>

      <div className="price-calculator__card">

        <div className="price-calculator__controls">

          {/* Document type */}
          <div className="price-calculator__field">
            <label className="price-calculator__label">{t('calc.docType')}</label>
            <div className="price-calculator__select-wrapper">
              <select
                className="price-calculator__select"
                value={selectedDocId}
                onChange={e => setSelectedDocId(e.target.value)}
              >
                {DOC_TYPES.map(dt => (
                  <option key={dt.id} value={dt.id}>{t(dt.labelKey)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Page count */}
          <div className="price-calculator__field">
            <label className="price-calculator__label">
              {t('calc.pages')}
              <span className="price-calculator__pages-badge">{pages}</span>
            </label>
            <input
              type="range"
              min={1}
              max={30}
              value={pages}
              onChange={e => setPages(Number(e.target.value))}
              className="price-calculator__slider"
              style={{ '--val': pages } as React.CSSProperties}
            />
            <div className="price-calculator__slider-labels">
              <span>1</span>
              <span>30</span>
            </div>
          </div>

        </div>

        {/* Result display */}
        <div className="price-calculator__result">
          <p className="price-calculator__result-label">{t('calc.estimatedCost')}</p>
          <div className="price-calculator__price-avg">
            ~{avgPrice}€
            <span className="price-calculator__price-tolerance">±25%</span>
          </div>
          <p className="price-calculator__price-breakdown">
            {pages} {t('calc.pagesLabel')} × ~{doc.avgLines} {t('calc.linesPerPage')} × {PRICE_PER_LINE.toFixed(2)}€
          </p>
        </div>

        {/* Disclaimer */}
        <div className="price-calculator__disclaimer">
          <IoWarningOutline className="price-calculator__disclaimer-icon" />
          <p>{t('calc.disclaimer')}</p>
        </div>

        <button
          className="price-calculator__cta"
          onClick={() => navigate('/order')}
        >
          {t('calc.cta')}
        </button>

      </div>
    </div>
  );
}
