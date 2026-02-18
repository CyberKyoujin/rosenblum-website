import {
    IoPersonOutline,
    IoCallOutline,
    IoLocationOutline,
    IoChatbubbleOutline,
    IoAttachOutline,
    IoDocumentTextOutline,
    IoDownloadOutline,
    IoAddOutline,
    IoTrashOutline,
} from "react-icons/io5";
import { IoDocuments } from "react-icons/io5";
import { MdPayment } from "react-icons/md";
import { FaUserAlt, FaFilePdf } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Order, getStatusConfig, statusConfigs } from "../types/order";
import { DocumentEdit } from "../hooks/useOrderDetails";
import { SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../zustand/axiosInstance";

import uaFlag from '../assets/ua.svg';
import ruFlag from '../assets/ru.svg';
import deFlag from '../assets/de.svg';


const languages = [
    { code: 'ua', label: 'UKR', flag: uaFlag },
    { code: 'ru', label: 'RU', flag: ruFlag },
    { code: 'de', label: 'DE', flag: deFlag },
];

interface OrderDetailsItemProps {
    orderData: Order;
    status: string;
    setStatus: React.Dispatch<SetStateAction<string>>;
    formActive: boolean;
    orderType: string;
    setOrderType: React.Dispatch<SetStateAction<string>>;
    paymentStatus: string;
    setPaymentStatus: React.Dispatch<SetStateAction<string>>;
    documentPrices: DocumentEdit[];
    setDocumentPrices: React.Dispatch<SetStateAction<DocumentEdit[]>>;
    addDocument: () => void;
    removeDocument: (id: number) => void;
}

const orderTypeLabels: Record<string, string> = {
    order: 'Auftrag',
    kostenvoranschlag: 'Kostenvoranschlag',
};

const paymentTypeLabels: Record<string, string> = {
    rechnung: 'Rechnung',
    stripe: 'Online-Zahlung',
};

const languageOptions = [
    { code: 'ua', label: 'Ukrainisch' },
    { code: 'ru', label: 'Russisch' },
    { code: 'de', label: 'Deutsch' },
];

const OrderDetailsItem = ({
    orderData,
    status,
    setStatus,
    orderType,
    setOrderType,
    paymentStatus,
    setPaymentStatus,
    formActive,
    documentPrices,
    setDocumentPrices,
    addDocument,
    removeDocument,
}: OrderDetailsItemProps) => {

    const navigate = useNavigate();
    const statusConfig = getStatusConfig(status);

    const { name, phone_number, street, city, zip, files, email } = orderData;

    const docsTotal = documentPrices
        .filter(d => !d.individual_price)
        .reduce((sum, d) => sum + parseFloat(d.price || '0'), 0);
    const hasIndividualDocs = documentPrices.some(d => d.individual_price);

    const updateDocField = (docId: number | string, field: keyof DocumentEdit, value: string | boolean) => {
        setDocumentPrices(prev => prev.map(dp =>
            dp.id === docId ? { ...dp, [field]: value } : dp
        ));
    };

    return (
        <div className="od__body">

            {/* Status & Type Badges / Edit Controls */}
            <div className="od__badges-row">
                {!formActive ? (
                    <div className="od__header-badges">
                        <div
                            className="od__status-badge"
                            style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}
                        >
                            <span className="od__status-dot" style={{ backgroundColor: statusConfig.color }} />
                            {statusConfig.label}
                        </div>
                        {orderType && (
                            <div className="od__type-badge">
                                {orderTypeLabels[orderType] || orderType}
                            </div>
                        )}
                        {(() => {
                            const psCfg: Record<string, { label: string; cls: string }> = {
                                paid:            { label: 'Bezahlt',       cls: 'od__paid-badge--yes' },
                                not_paid:        { label: 'Nicht bezahlt', cls: 'od__paid-badge--no' },
                                payment_pending: { label: 'Ausstehend',    cls: 'od__paid-badge--pending' },
                            };
                            const cfg = psCfg[paymentStatus] || psCfg.not_paid;
                            return (
                                <div className={`od__paid-badge ${cfg.cls}`}>
                                    {cfg.label}
                                </div>
                            );
                        })()}
                    </div>
                ) : (
                    <div className="od__edit-controls">
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel>Status</InputLabel>
                            <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                                {Object.entries(statusConfigs).map(([key, cfg]) => (
                                    <MenuItem key={key} value={key}>{cfg.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel>Auftragstyp</InputLabel>
                            <Select value={orderType} label="Auftragstyp" onChange={(e) => setOrderType(e.target.value)}>
                                {Object.entries(orderTypeLabels).map(([key, label]) => (
                                    <MenuItem key={key} value={key}>{label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel>Zahlungsstatus</InputLabel>
                            <Select
                                value={paymentStatus}
                                label="Zahlungsstatus"
                                onChange={(e) => setPaymentStatus(e.target.value)}
                            >
                                <MenuItem value="paid">Bezahlt</MenuItem>
                                <MenuItem value="not_paid">Nicht bezahlt</MenuItem>
                                <MenuItem value="payment_pending">Ausstehend</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                )}
            </div>

            {/* Cards Grid */}
            <div className="od__cards-grid">
                {/* Contact Info Card */}
                <div className="od__card">
                    <h3 className="od__card-title">Kontaktinformationen</h3>
                    <div className="od__info-list">
                        <div className="od__info-item">
                            <IoPersonOutline className="od__info-icon" />
                            <div className="od__info-content">
                                <span className="od__info-label">Name</span>
                                <span className="od__info-value">{name}</span>
                            </div>
                        </div>
                        {email && (
                            <div className="od__info-item">
                                <IoPersonOutline className="od__info-icon" />
                                <div className="od__info-content">
                                    <span className="od__info-label">E-Mail</span>
                                    <span className="od__info-value">{email}</span>
                                </div>
                            </div>
                        )}
                        <div className="od__info-item">
                            <IoCallOutline className="od__info-icon" />
                            <div className="od__info-content">
                                <span className="od__info-label">Telefon</span>
                                <span className="od__info-value">{phone_number}</span>
                            </div>
                        </div>
                        <div className="od__info-item">
                            <IoLocationOutline className="od__info-icon" />
                            <div className="od__info-content">
                                <span className="od__info-label">Anschrift</span>
                                <span className="od__info-value">{`${street}, ${zip} ${city}`}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        className="od__profile-btn"
                        type="button"
                        onClick={() => navigate(`/user/${orderData?.user}`)}
                    >
                        <FaUserAlt />
                        {name}
                        <FaArrowRightLong />
                    </button>
                </div>

                {/* Message Card */}
                <div className="od__card">
                    <h3 className="od__card-title">
                        <IoChatbubbleOutline className="od__title-icon" />
                        Nachricht
                    </h3>
                    <div className="od__message-box">
                        {orderData?.message || 'Keine Nachricht hinterlassen.'}
                    </div>
                </div>
            </div>

            {/* Documents Card */}
            {(documentPrices.length > 0 || formActive) && (
                <div className="od__card od__card--full">
                    <h3 className="od__card-title">
                        <IoDocuments className="od__title-icon" />
                        Unterlagen
                    </h3>
                    <div className="od__docs-list">
                        {documentPrices.map((doc) => {
                            const lang = languages.find(l => l.code === doc.language);
                            return formActive ? (
                                <div key={doc.id} className="od__doc-item od__doc-item--edit">
                                    <div className="od__doc-edit-row">
                                        <FormControl size="small" sx={{ minWidth: 130 }}>
                                            <InputLabel>Sprache</InputLabel>
                                            <Select
                                                value={doc.language}
                                                label="Sprache"
                                                onChange={(e) => updateDocField(doc.id, 'language', e.target.value)}
                                            >
                                                {languageOptions.map(lo => (
                                                    <MenuItem key={lo.code} value={lo.code}>{lo.label}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <input
                                            type="text"
                                            className="od__doc-type-input"
                                            placeholder="Dokumenttyp"
                                            value={doc.type}
                                            onChange={(e) => updateDocField(doc.id, 'type', e.target.value)}
                                        />
                                        <label className="od__doc-individual-toggle">
                                            <input
                                                type="checkbox"
                                                checked={doc.individual_price}
                                                onChange={() => updateDocField(doc.id, 'individual_price', !doc.individual_price)}
                                            />
                                            <span>Individuell</span>
                                        </label>
                                        {!doc.individual_price && (
                                            <div className="od__doc-price-input-wrapper">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    className="od__doc-price-input"
                                                    value={doc.price}
                                                    onChange={(e) => updateDocField(doc.id, 'price', e.target.value)}
                                                />
                                                <span className="od__doc-price-currency">&euro;</span>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            className="od__doc-remove-btn"
                                            onClick={() => removeDocument(doc.id)}
                                        >
                                            <IoTrashOutline />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div key={doc.id} className="od__doc-item">
                                    <div className="od__doc-info">
                                        {lang && (
                                            <img src={lang.flag} alt={lang.label} className="od__doc-flag" />
                                        )}
                                        <span className="od__doc-lang">{lang?.label || doc.language}</span>
                                        <span className="od__doc-type">{doc.type}</span>
                                    </div>
                                    <span className="od__doc-price">
                                        {doc.individual_price ? 'Individuelle Berechnung' : `${parseFloat(doc.price).toFixed(2)} \u20AC`}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    {formActive && (
                        <button type="button" className="od__doc-add-btn" onClick={addDocument}>
                            <IoAddOutline />
                            Dokument hinzufügen
                        </button>
                    )}
                    <div className="od__docs-footer">
                        <div className="od__docs-total">
                            <span>Gesamt</span>
                            <span className="od__docs-total-value">{docsTotal.toFixed(2)} &euro;</span>
                        </div>
                        {hasIndividualDocs && (
                            <p className="od__docs-note">
                                + individuell berechnete Dokumente
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Payment Card */}
            <div className="od__card od__card--full">
                <h3 className="od__card-title">
                    <MdPayment className="od__title-icon" />
                    Zahlungsinformationen
                </h3>
                <div className="od__payment-info">
                    <div className="od__info-item">
                        <div className="od__info-content">
                            <span className="od__info-label">Auftragsart</span>
                            <span className="od__info-value">
                                {orderTypeLabels[orderData?.order_type || ''] || orderData?.order_type || '\u2014'}
                            </span>
                        </div>
                    </div>
                    {orderData?.payment_type && (
                        <div className="od__info-item">
                            <div className="od__info-content">
                                <span className="od__info-label">Zahlungsmethode</span>
                                <span className="od__info-value">
                                    {paymentTypeLabels[orderData.payment_type] || orderData.payment_type}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="od__info-item">
                        <div className="od__info-content">
                            <span className="od__info-label">Zahlungsstatus</span>
                            {(() => {
                                const psMap: Record<string, { label: string; cls: string }> = {
                                    paid:            { label: 'Bezahlt',       cls: 'od__info-value--success' },
                                    not_paid:        { label: 'Nicht bezahlt', cls: 'od__info-value--warning' },
                                    payment_pending: { label: 'Ausstehend',    cls: 'od__info-value--pending' },
                                };
                                const ps = psMap[paymentStatus] || psMap.not_paid;
                                return (
                                    <span className={`od__info-value ${ps.cls}`}>
                                        {ps.label}
                                    </span>
                                );
                            })()}
                        </div>
                    </div>
                    {orderData?.stripe_payment_intent_id && (
                        <div className="od__info-item">
                            <div className="od__info-content">
                                <span className="od__info-label">Stripe ID</span>
                                <span className="od__info-value od__info-value--mono">
                                    {orderData.stripe_payment_intent_id}
                                </span>
                            </div>
                        </div>
                    )}
                    {orderData?.lexoffice_id && (
                        <div className="od__info-item">
                            <div className="od__info-content">
                                <span className="od__info-label">Lexoffice ID</span>
                                <span className="od__info-value od__info-value--mono">
                                    {orderData.lexoffice_id}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Kostenvoranschlag Card */}
            
            <CostEstimateCard orderData={orderData} hasIndividualDocuments={hasIndividualDocs}/>
           

            {/* Invoice Card */}
            {orderData.invoice && (
                <div className="od__card od__card--full">
                    <h3 className="od__card-title">
                        <FaFilePdf className="od__title-icon" />
                        Rechnung
                    </h3>
                    <div className="od__file-item">
                        <div className="od__file-icon">
                            <FaFilePdf />
                        </div>
                        <div className="od__file-info">
                            <span className="od__file-name">Rechnung #{orderData.id}</span>
                            <span className="od__file-size">PDF</span>
                        </div>
                        <button
                            className="od__file-download"
                            type="button"
                            onClick={() => window.open(orderData.invoice!.file, '_blank')}
                        >
                            <IoDownloadOutline />
                        </button>
                    </div>
                </div>
            )}

            {/* Files Card */}
            <div className="od__card od__card--full">
                <h3 className="od__card-title">
                    <IoAttachOutline className="od__title-icon" />
                    Dateien
                </h3>
                {files && files.length > 0 ? (
                    <div className="od__files-grid">
                        {files.map((file, index) => (
                            <div key={index} className="od__file-item">
                                <div className="od__file-icon">
                                    <IoDocumentTextOutline />
                                </div>
                                <div className="od__file-info">
                                    <span className="od__file-name">
                                        {file.file_name.length > 17 ? `${file.file_name.slice(0, 17)}...` : file.file_name}
                                    </span>
                                    <span className="od__file-size">{file.file_size} MB</span>
                                </div>
                                <button
                                    className="od__file-download"
                                    type="button"
                                    onClick={() => window.open(file.file, '_blank')}
                                >
                                    <IoDownloadOutline />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="od__no-files">Keine Dateien angehängt.</p>
                )}
            </div>
        </div>
    );
};

const CostEstimateCard = ({ orderData, hasIndividualDocuments }: { orderData: Order, hasIndividualDocuments: boolean }) => {
    const [creating, setCreating] = useState(false);
    const [estimate, setEstimate] = useState(orderData.cost_estimate);

    const handleCreate = async () => {
        setCreating(true);
        try {
            await axiosInstance.post('/cost-estimate/', { order_id: orderData.id });
            const res = await axiosInstance.get(`/orders/${orderData.id}/`);
            setEstimate(res.data.cost_estimate);
        } catch {
            // error handling via store
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="od__card od__card--full">
            <h3 className="od__card-title">
                <FaFilePdf className="od__title-icon" />
                Kostenvoranschlag
            </h3>
            {estimate ? (
                <div className="od__file-item">
                    <div className="od__file-icon">
                        <FaFilePdf />
                    </div>
                    <div className="od__file-info">
                        <span className="od__file-name">Kostenvoranschlag</span>
                        <span className="od__file-size">PDF</span>
                    </div>
                    <button
                        className="od__file-download"
                        type="button"
                        onClick={() => window.open(estimate.file, '_blank')}
                    >
                        <IoDownloadOutline />
                    </button>
                </div>
            ) : (
                <div className="od__ce-empty">
                    <p className="od__no-files">Noch kein Kostenvoranschlag erstellt.</p>
                    <button
                        type="button"
                        className="od__ce-create-btn"
                        onClick={handleCreate}
                        disabled={creating || hasIndividualDocuments}
                    >
                        <IoAddOutline />
                        {creating ? 'Wird erstellt...' : 'Kostenvoranschlag erstellen'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderDetailsItem;
