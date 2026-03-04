import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import  {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../zustand/useAuthStore';
import useOrderStore from '../zustand/useOrderStore';
import { ApiErrorResponse } from '../types/error';
import { SelectChangeEvent } from '@mui/material';
import uaFlag from '../assets/ua.svg';
import ruFlag from '../assets/ru.svg';
import deFlag from '../assets/de.svg';
import { t } from 'i18next';

export const orderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone_number: z.string().min(5, "Invalid phone"),
  city: z.string().min(1, "City is required"),
  street: z.string().min(1, "Street is required"),
  zip: z.string().min(1, "ZIP is required"),
  message: z.string().min(1, "Message is required"),
});

export interface DocsType {
    type: string;
    label: string;
    price: number;
    language: string;
    individualPrice: boolean;
}

export const languages: { code: string; label: string; flag: string }[] = [
  { code: 'ua', label: 'UKR', flag: uaFlag },
  { code: 'ru', label: 'RU', flag: ruFlag },
  { code: 'de', label: 'DE', flag: deFlag },
];

export type DocCategory = 'personenstand' | 'ausweis' | 'bescheinigung' | 'bildung' | 'apostille' | 'sonstiges';

export interface DocTemplate extends Omit<DocsType, 'language'> {
  category: DocCategory;
}

export const CATEGORY_ORDER: { key: DocCategory; labelKey: string }[] = [
  { key: 'personenstand', labelKey: 'docCategoryPersonenstand' },
  { key: 'ausweis',       labelKey: 'docCategoryAusweis' },
  { key: 'bescheinigung', labelKey: 'docCategoryBescheinigung' },
  { key: 'bildung',       labelKey: 'docCategoryBildung' },
  { key: 'apostille',     labelKey: 'docCategoryApostille' },
];

const getDocTemplates = (): DocTemplate[] => [
    // Sonstiges — shown as a separate card in UI, not inside the Select
    {type: "Sonstiges Dokument mit komplexem Inhalt (Diplom, Arbeitsbuch, Gerichtsurteil, Erklärung)", label: t('docSonstiges'), price: 0, individualPrice: true, category: 'sonstiges'},
    // Personenstandsurkunden
    {type: "Geburtsurkunde",        label: t('docGeburtsurkunde'),        price: 35.30, individualPrice: false, category: 'personenstand'},
    {type: "Heiratsurkunde",        label: t('docHeiratsurkunde'),        price: 35.30, individualPrice: false, category: 'personenstand'},
    {type: "Sterbeurkunde",         label: t('docSterbeurkunde'),         price: 35.30, individualPrice: false, category: 'personenstand'},
    {type: "Scheidungsurkunde",     label: t('docScheidungsurkunde'),     price: 35.30, individualPrice: false, category: 'personenstand'},
    {type: "Namensänderungsurkunde",label: t('docNamensanderung'),        price: 35.30, individualPrice: false, category: 'personenstand'},
    // Ausweise & Reise
    {type: "Pass, Ausweis",         label: t('docPassAusweis'),           price: 35.30, individualPrice: false, category: 'ausweis'},
    {type: "Führerschein",          label: t('docFuhrerschein'),          price: 30.30, individualPrice: false, category: 'ausweis'},
    {type: "Aufenthaltserlaubnis",  label: t('docAufenthaltserlaubnis'),  price: 35.30, individualPrice: false, category: 'ausweis'},
    {type: "Führungszeugnis",       label: t('docFuhrungszeugnis'),       price: 35.30, individualPrice: false, category: 'ausweis'},
    // Bescheinigungen
    {type: "Melde-/Negativbescheinigung",                       label: t('docMeldeNegativbescheinigung'), price: 35.30, individualPrice: false, category: 'bescheinigung'},
    {type: "Sonstige Zertifikat/Zeugnis/Bescheinigung (1 Seite)",label: t('docSonstigeZertifikat'),       price: 35.30, individualPrice: false, category: 'bescheinigung'},
    // Bildung
    {type: "Reifezeugnis (ohne Notenanlage)", label: t('docReifezeugnis'),                price: 35.30, individualPrice: false, category: 'bildung'},
    {type: "Reifezeugnis mit Notenanlage",    label: t('docReifezeugnisMitNotenanlage'),  price: 70.60, individualPrice: false, category: 'bildung'},
    {type: "Diplom (ohne Notenanlage)",       label: t('docDiplom'),                      price: 35.30, individualPrice: false, category: 'bildung'},
    // Apostille
    {type: "Übersetzung der Appostile",       label: t('docUbersetzungAppostile'),        price: 10.50, individualPrice: false, category: 'apostille'},
    {type: "Apostille auf unsere Übersetzung",label: t('docApostilleUbersetzung'),        price: 35.00, individualPrice: false, category: 'apostille'},
]

export type OrderFormValues = z.infer<typeof orderSchema>;

export const useOrder = () => {
  const { user, userData } = useAuthStore();
  const { createOrder, createOrderLoading } = useOrderStore();
  const navigate = useNavigate();

  const [orderId, setOrderId] = useState<string | null>(null);

  const [error, setError] = useState<ApiErrorResponse | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);

  const [docs, setDocs] = useState<DocsType[]>([]);
  const [total, setTotal] = useState(0);
  const [specialDocs, setSpecialDocs] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [agbAccepted, setAgbAccepted] = useState(false);
  const [datenschutzAccepted, setDatenschutzAccepted] = useState(false);
  const [widerrufsrechtAccepted, setWiderrufsrechtAccepted] = useState(false);

  // Registration state
  const [wantsAccount, setWantsAccount] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordChecks = {
    length: password.length > 7,
    number: /\d/.test(password),
    uppercase: /[A-Z]/.test(password),
  };
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const passwordsMatch = password === passwordConfirm;

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const specialCount = docs.filter(doc => doc.individualPrice).length;

    setSpecialDocs(specialCount);

    const totalPrice = docs.reduce((sum, doc) => sum + doc.price, 0);

    setTotal(totalPrice);

    if (specialCount > 0) {
      setPaymentMethod('kostenvoranschlag');
    }
  }, [docs]);


  const methods = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '',
      email: user?.email || '',
      phone_number: userData?.phone_number || '',
      city: userData?.city || '',
      street: userData?.street || '',
      zip: userData?.zip || '',
      message: ''
    }
  });

  const handleFiles = (newFiles: File[]) => setUploadedFiles(prev => [...prev, ...newFiles]);
  const removeFile = (index: number) => setUploadedFiles(prev => prev.filter((_, i) => i !== index));

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) handleFiles(Array.from(e.dataTransfer.files));
  };

  const addDoc = (type: string) => {
    const template = getDocTemplates().find(d => d.type === type);
    if (template) {
      const { category, ...docData } = template;
      setDocs(prev => [...prev, { ...docData, language: 'ua' }]);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    addDoc(event.target.value as string);
  };

  const handleRemoveDoc = (index: number) => {
    setDocs(prev => prev.filter((_, i) => i !== index));
  };

  const handleLanguageChange = (index: number, language: string) => {
    setDocs(prev => {
      const doc = prev[index];
      const duplicate = prev.some(
        (d, i) => i !== index && d.type === doc.type && d.language === language
      );
      if (duplicate) return prev;
      return prev.map((d, i) => i === index ? { ...d, language } : d);
    });
  };

  const canSubmit = (() => {
    if (!agbAccepted || !datenschutzAccepted || !widerrufsrechtAccepted) return false;
    if (!paymentMethod) return false;
    if (wantsAccount && (!isPasswordValid || !passwordsMatch)) return false;
    return true;
  })();

  const onSubmit = async (data: OrderFormValues) => {
    setError(null);

    if (!canSubmit) return;

    const formData = new FormData();
    uploadedFiles.forEach(file => formData.append('uploaded_files', file));
    docs.forEach(doc => formData.append('order_docs', JSON.stringify(doc)));
    Object.entries(data).forEach(([key, value]) => formData.append(key, value || ''));

    if (paymentMethod === "kostenvoranschlag") {
      formData.append('order_type', 'kostenvoranschlag');
    } else {
      formData.append('payment_type', paymentMethod);
    }

    if (wantsAccount && !user) {
      formData.append('password', password);
    }

    try {
      const data = await createOrder(formData);

      setOrderId(data.id);

      if (wantsAccount && !user) {
        navigate("/email-verification", { state: { email: methods.getValues('email') } });
      } else if (paymentMethod === "stripe") {
        navigate("/payment", { state: { orderId: data.id, total: total } });
      } else if (paymentMethod === "kostenvoranschlag") {
        navigate("/order-success", { state: { orderId: data.id, type: 'kostenvoranschlag' } });
      } else {
        navigate("/order-success", { state: { orderId: data.id, type: 'rechnung' } });
      }
    } catch (err) {
      setError(err as ApiErrorResponse);
    }
  };

  return {
    methods,
    loading: createOrderLoading,
    orderId: orderId,
    error,
    files: {
      list: uploadedFiles,
      remove: removeFile,
      onDrop,
      dragging,
      setDragging,
      inputRef: fileInputRef,
      handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) handleFiles(Array.from(e.target.files));
      }
    },
    docs: {
      list: docs,
      templates: getDocTemplates(),
      addDoc,
      removeDoc: handleRemoveDoc,
      changeLanguage: handleLanguageChange,
      handleInputChange: handleChange,
      total: total,
      specialDocs: specialDocs
    },
    payment: {
      method: paymentMethod,
      setMethod: setPaymentMethod,
    },
    consent: {
      agb: agbAccepted,
      setAgb: setAgbAccepted,
      datenschutz: datenschutzAccepted,
      setDatenschutz: setDatenschutzAccepted,
      widerrufsrecht: widerrufsrechtAccepted,
      setWiderrufsrecht: setWiderrufsrechtAccepted,
    },
    registration: {
      wantsAccount,
      setWantsAccount,
      password,
      setPassword,
      passwordConfirm,
      setPasswordConfirm,
      showPassword,
      togglePassword: () => setShowPassword(prev => !prev),
      passwordChecks,
      isPasswordValid,
      passwordsMatch,
      isLoggedIn: !!user,
    },
    canSubmit,
    onSubmit: methods.handleSubmit(onSubmit)
  };
};