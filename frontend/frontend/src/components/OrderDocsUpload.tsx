import { Box, Divider, FormControl, InputLabel, ListSubheader, MenuItem, Select } from '@mui/material';
import { t } from 'i18next';
import { useState, useEffect, useRef } from 'react';
import { FaFile, FaCircleQuestion } from 'react-icons/fa6';
import { PiUploadFill } from 'react-icons/pi';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import OrderSectionHeader from './OrderSectionHeader';
import { IoDocuments } from "react-icons/io5";
import { DocsType, DocTemplate, CATEGORY_ORDER } from '../hooks/useOrder';
import ruFlag from "../assets/ru.svg"
import uaFlag from "../assets/ua.svg"
import deFlag from "../assets/de.svg"

const OrderDocsUpload = ({logic}: {logic: any}) => {

  const { docs } = logic;
  const [selectOpen, setSelectOpen] = useState(false);
  const [newDocIndex, setNewDocIndex] = useState<number | null>(null);
  const prevLengthRef = useRef(docs.list.length);

  useEffect(() => {
    const handleScroll = () => setSelectOpen(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (docs.list.length > prevLengthRef.current) {
      const idx = docs.list.length - 1;
      setNewDocIndex(idx);
      setTimeout(() => setNewDocIndex(null), 3000);
    }
    prevLengthRef.current = docs.list.length;
  }, [docs.list.length]);

  const templates: DocTemplate[] = docs.templates;
  const sonstigesTemplate = templates.find((d: DocTemplate) => d.individualPrice);
  const regularTemplates = templates.filter((d: DocTemplate) => !d.individualPrice);
  const sonstigesAlreadyAdded = docs.list.some((d: DocsType) => d.individualPrice);

  const groupedTemplates = CATEGORY_ORDER.map(cat => ({
    ...cat,
    items: regularTemplates.filter((d: DocTemplate) => d.category === cat.key),
  })).filter(g => g.items.length > 0);

  return (
    <>

      <OrderSectionHeader Icon={IoDocuments} headerText={t('selectYourDocuments')}/>

      <div className="docs-warning">
        <p>{t('docsWarningPre')}<strong>{t('docsWarningBold')}</strong>{t('docsWarningMid')}<Link to="/pricing" className="docs-warning-link">{t('docsWarningLinkText')}</Link>{t('docsWarningPost')}</p>
      </div>

      {/* Sonstiges — prominent card, shown before the regular select */}

      {/* Grouped document selector */}
      <Box sx={{ minWidth: 120 }} className="docs-select">
        <FormControl fullWidth>
            <InputLabel id="docs-select-label">{t('documents')}</InputLabel>
            <Select
            labelId="docs-select-label"
            id="docs-select"
            value=""
            label={t('documents')}
            onChange={docs.handleInputChange}
            open={selectOpen}
            onOpen={() => setSelectOpen(true)}
            onClose={() => setSelectOpen(false)}
            MenuProps={{
              disableScrollLock: true,
              PaperProps: { className: 'docs-select-paper', style: { maxHeight: 320, overflowY: 'auto' } }
            }}
            >
            {sonstigesTemplate && ([
              <ListSubheader key="sonstiges-header" className="docs-select-category">
                {t('docSonstigesCategory')}
              </ListSubheader>,
              <MenuItem key="sonstiges-item" value={sonstigesTemplate.type} className="docs-select-sonstiges">
                <span className="docs-select-sonstiges__label">{t('docSonstigesSelectLabel')}</span>
                <span className="docs-select-sonstiges__badge">{t('individualCalculation')}</span>
              </MenuItem>
            ])}
            {groupedTemplates.map(group => [
              <ListSubheader key={group.key} className="docs-select-category">
                {t(group.labelKey)}
              </ListSubheader>,
              ...group.items.map((doc: DocTemplate, idx: number) => (
                <MenuItem key={idx} value={doc.type}>
                  {doc.label} — {`${doc.price}€`}
                </MenuItem>
              ))
            ])}
            </Select>
        </FormControl>
      </Box>

      {sonstigesTemplate && (
        <div
          className={`docs-sonstiges-card ${sonstigesAlreadyAdded ? 'docs-sonstiges-card--added' : ''}`}
          onClick={() => !sonstigesAlreadyAdded && docs.addDoc(sonstigesTemplate.type)}
        >
          <div className="docs-sonstiges-card__icon">
            <FaCircleQuestion />
          </div>
          <div className="docs-sonstiges-card__content">
            <span className="docs-sonstiges-card__title">{t('docSonstigesCardTitle')}</span>
            <span className="docs-sonstiges-card__desc">{t('docSonstigesCardDesc')}</span>
          </div>
          <button
            type="button"
            className={`docs-sonstiges-card__btn ${sonstigesAlreadyAdded ? 'docs-sonstiges-card__btn--added' : ''}`}
            disabled={sonstigesAlreadyAdded}
            onClick={(e) => { e.stopPropagation(); if (!sonstigesAlreadyAdded) docs.addDoc(sonstigesTemplate.type); }}
          >
            {sonstigesAlreadyAdded ? t('docSonstigesCardAdded') : t('docSonstigesCardBtn')}
          </button>
        </div>
      )}

      <div className='docs-container'>
            {docs.list.map((doc: DocsType, index: number) => (
                <div className={`doc-item${newDocIndex === index ? ' doc-item--new' : ''}`} key={index}>

                    <div className='doc-item-info'>
                        <p className='doc-name'>{doc.label}</p>
                        <p className='doc-price'>
                          {doc.individualPrice ? t('individualCalculation') : `${doc.price.toFixed(2)} €`}
                        </p>
                    </div>

                    <div className='doc-actions'>
                        <div className="doc-language-wrapper">
                          <span className="doc-language-label">{t('targetLanguage')}</span>
                          <FormControl size="small" className="doc-language-select">
                            <Select
                              value={doc.language}
                              onChange={(e) => docs.changeLanguage(index, e.target.value)}
                              renderValue={(value) => {
                                const langs = [
                                  { code: 'ua', flag: uaFlag, label: 'UKR' },
                                  { code: 'ru', flag: ruFlag, label: 'RU' },
                                  { code: 'de', flag: deFlag, label: 'DE' },
                                ];
                                const lang = langs.find(l => l.code === value);
                                if (!lang) return null;
                                return <span className="lang-item-select"><img src={lang.flag} className="lang-flag-img" alt="" />{lang.label}</span>;
                              }}
                            >
                              {[
                                { code: 'ua', flag: uaFlag, label: 'UKR' },
                                { code: 'ru', flag: ruFlag, label: 'RU' },
                                { code: 'de', flag: deFlag, label: 'DE' },
                              ].map((lang) => (
                                <MenuItem key={lang.code} value={lang.code} className='lang-item-select'>
                                  <img src={lang.flag} className="lang-flag-img" alt="" />{lang.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                        <button type="button" className='doc-remove-btn' onClick={() => docs.removeDoc(index)}>
                          <RiDeleteBin6Fill />
                        </button>
                    </div>

                </div>
            ))}
      </div>

      {docs.list.length > 0 && (
        <div className="docs-total">
          <div className="docs-total-row">
            <span className="docs-total-label">{t('total')}</span>
            <span className="docs-total-value">{docs.total.toFixed(2)} €</span>
          </div>
          {docs.specialDocs > 0 && (
            <p className="docs-total-note">{t('specialDocsNote', { count: docs.specialDocs })}</p>
          )}
        </div>
      )}

      <Divider style={{ height: '32px', marginTop: '1rem' }} />

      <OrderSectionHeader Icon={PiUploadFill} headerText={t('uploadDocuments')} />
      <p className="docs-upload-hint">{t('uploadAllSelectedDocuments')}</p>

        <div
          className={`file-upload ${logic.files.dragging ? 'dragging' : ''}`}
          onDrop={logic.files.onDrop}
          onDragOver={(e) => { e.preventDefault(); logic.files.setDragging(true); }}
          onDragLeave={() => logic.files.setDragging(false)}
          onClick={() => logic.files.inputRef.current?.click()}
        >
          <PiUploadFill style={{ fontSize: '50px', color: 'rgb(76, 121, 212)' }} />
          <p>{t('uploadArea')}</p>
        </div>

        <input
          type="file" multiple accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,.doc,.docx"
          ref={logic.files.inputRef}
          style={{ display: 'none' }}
          onChange={logic.files.handleInputChange}
        />

        <div className="files-container">
          {logic.files.list.map((file: File, index: number) => (
            <div key={index} className="file-item">
              <div className="file-item-icon">
                <FaFile />
              </div>
              <div className="file-item-details">
                <p className="file-item-name">{file.name}</p>
                <p className="file-item-size">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button type="button" className="file-item-remove" onClick={() => logic.files.remove(index)}>
                <RiDeleteBin6Fill />
              </button>
            </div>
          ))}
        </div>
    </>
  )
}

export default OrderDocsUpload;
