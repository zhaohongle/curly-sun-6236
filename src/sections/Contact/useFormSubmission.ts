import { useState, useCallback } from 'react';
import { env } from '@/config/env';

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

/**
 * Form submission hook with validation and Formspree integration.
 */
export function useFormSubmission() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    inquiryType: 'custom',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入您的姓名';
    }
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    if (!formData.message.trim()) {
      newErrors.message = '请输入留言内容';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error on change
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validate()) return;

      setStatus('submitting');

      try {
        const response = await fetch(env.formspreeEndpoint, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            inquiryType: formData.inquiryType,
            message: formData.message,
          }),
        });

        if (response.ok) {
          setStatus('success');
          setFormData({ name: '', email: '', inquiryType: 'custom', message: '' });
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    },
    [formData, validate],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    status,
    handleChange,
    handleSubmit,
    reset,
  };
}
