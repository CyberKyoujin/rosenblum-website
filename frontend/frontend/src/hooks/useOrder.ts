import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import  {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../zustand/useAuthStore';
import useOrderStore from '../zustand/useOrderStore';
import { parsePhoneNumber } from 'libphonenumber-js';
import { ApiErrorResponse } from '../types/error';

export const orderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone_number: z.string().min(5, "Invalid phone"),
  city: z.string().min(1, "City is required"),
  street: z.string().min(1, "Street is required"),
  zip: z.string().min(1, "ZIP is required"),
  message: z.string().optional(),
});

export type OrderFormValues = z.infer<typeof orderSchema>;

export const useOrder = () => {
  const { user, userData } = useAuthStore();
  const { createOrder, createOrderLoading } = useOrderStore();
  const navigate = useNavigate();

  const [error, setError] = useState<ApiErrorResponse | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const phoneValue = methods.watch('phone_number');
  const isPhoneInvalid = (() => {
    try {
      const parsed = parsePhoneNumber(phoneValue, 'DE');
      return !parsed || !parsed.isValid();
    } catch { return true; }
  })();

  const handleFiles = (newFiles: File[]) => setUploadedFiles(prev => [...prev, ...newFiles]);
  const removeFile = (index: number) => setUploadedFiles(prev => prev.filter((_, i) => i !== index));

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) handleFiles(Array.from(e.dataTransfer.files));
  };

  const onSubmit = async (data: OrderFormValues) => {
    setError(null);
    const formData = new FormData();
    uploadedFiles.forEach(file => formData.append('uploaded_files', file));
    Object.entries(data).forEach(([key, value]) => formData.append(key, value || ''));

    try {
      await createOrder(formData);
      navigate("/profile", { state: { orderCreateSuccess: true } });
    } catch (err) {
      setError(err as ApiErrorResponse);
    }
  };

  return {
    methods,
    loading: createOrderLoading,
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
    isPhoneInvalid,
    onSubmit: methods.handleSubmit(onSubmit)
  };
};