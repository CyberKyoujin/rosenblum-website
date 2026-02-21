import { Box, Divider, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { t } from 'i18next';
import { useState, useEffect } from 'react';
import { FaFile } from 'react-icons/fa6';
import { PiUploadFill } from 'react-icons/pi';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import OrderSectionHeader from './OrderSectionHeader';
import { IoDocuments } from "react-icons/io5";
import { DocsType, languages } from '../hooks/useOrder';


const OrderDocsUpload = ({logic}: {logic: any}) => {

  const { docs } = logic;
  const [selectOpen, setSelectOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setSelectOpen(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>

      <OrderSectionHeader Icon={IoDocuments} headerText={t('selectYourDocuments')}/>

      <div className="docs-warning">
        <p>{t('docsWarningPre')}<Link to="/pricing" className="docs-warning-link">{t('docsWarningLinkText')}</Link>{t('docsWarningPost')}</p>
      </div>

      <Box sx={{ minWidth: 120 }} className="docs-select">
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Unterlagen</InputLabel>
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value=""
            label="Unterlagen"
            onChange={docs.handleInputChange}
            open={selectOpen}
            onOpen={() => setSelectOpen(true)}
            onClose={() => setSelectOpen(false)}
            MenuProps={{
              disableScrollLock: true,
              PaperProps: { style: { maxHeight: 280, overflowY: 'auto' } }
            }}
            >
            {docs.templates.map((doc: { type: string; label: string; price: number; individualPrice: boolean }, idx: number) => (
              <MenuItem key={idx} value={doc.type}>
                {doc.label} - {doc.individualPrice ? 'Individuelle Berechnung' : `${doc.price}€`}
              </MenuItem>
            ))}
            </Select>
        </FormControl>
      </Box>

      <div className='docs-container'>
            {docs.list.map((doc: DocsType, index: number) => (
                <div className='doc-item' key={index}>

                    <div className='doc-item-info'>
                        <p className='doc-name'>{doc.label}</p>
                        <p className='doc-price'>
                          {doc.individualPrice ? 'Individuelle Berechnung' : `${doc.price.toFixed(2)} €`}
                        </p>
                    </div>

                    <div className='doc-actions'>
                        <div className="doc-language-wrapper">
                          <span className="doc-language-label">{t('targetLanguage')}</span>
                          <FormControl size="small" className="doc-language-select">
                            <Select
                              value={doc.language}
                              onChange={(e) => docs.changeLanguage(index, e.target.value)}
                            >
                              {languages.map((lang) => (
                                <MenuItem key={lang.code} value={lang.code}>
                                  <img src={lang.flag} alt={lang.label} className="doc-lang-flag" />
                                  {lang.label}
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
            <span className="docs-total-label">Gesamt</span>
            <span className="docs-total-value">{docs.total.toFixed(2)} €</span>
          </div>
          {docs.specialDocs > 0 && (
            <p className="docs-total-note">+ {docs.specialDocs} individuell berechnete{docs.specialDocs === 1 ? 's' : ''} Dokument{docs.specialDocs === 1 ? '' : 'e'}</p>
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
          type="file" multiple accept=".jpg,.png,.pdf,.doc,.docx" 
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