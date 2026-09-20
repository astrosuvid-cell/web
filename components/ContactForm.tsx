'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, Clock, Loader2, Mail, MessageCircle, Phone, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/lib/LanguageContext';
import { useSiteSettings } from '@/lib/SiteSettingsContext';
import { useSelectedService } from '@/lib/SelectedServiceContext';

interface ContactFormProps {
  embedded?: boolean;
}

export default function ContactForm({ embedded = false }: ContactFormProps) {
  const { t } = useLanguage();
  const { settings, telHref, whatsappHref, mailtoHref, supportMailtoHref } = useSiteSettings();
  const { selectedService } = useSelectedService();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  useEffect(() => {
    if (selectedService) {
      let serviceValue = '';
      if (['kundli', 'matchmaking'].includes(selectedService)) {
        serviceValue = 'vedic-astrology';
      } else if (['gemstone', 'vastu', 'prashna', 'matrimonial'].includes(selectedService)) {
        serviceValue = 'other';
      }

      if (serviceValue) {
        setFormData((prev) => ({ ...prev, service: serviceValue }));
      }
    }
  }, [selectedService]);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, service: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage(t('contact.error.name'));
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage(t('contact.error.email'));
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMessage(t('contact.error.phone'));
      return false;
    }
    if (!formData.service) {
      setErrorMessage(t('contact.error.service'));
      return false;
    }
    if (!formData.message.trim()) {
      setErrorMessage(t('contact.error.message'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service_type: formData.service,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || t('contact.error.message'));
        setStatus('error');
        return;
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setErrorMessage(t('contact.error.message'));
    }
  };

  return (
    <section
      id="contact-form"
      className={embedded ? 'relative w-full' : 'relative w-full bg-background py-12 md:py-16 lg:py-20'}
    >
      <div className={embedded ? 'w-full' : 'mx-auto w-full max-w-[1280px] px-4 sm:px-5 lg:px-6'}>
        <div
          className={`w-full border border-stone-200 ${
            embedded ? 'overflow-visible' : 'overflow-hidden'
          }`}
        >
          <div className="grid lg:grid-cols-2">
            {/* Left trust panel */}
            <div className="relative bg-[#0f172a] p-6 text-white sm:p-8 lg:p-10">
              <h2 className="font-serif text-2xl leading-tight sm:text-3xl">{t('contact.title')}</h2>
              <p className="mt-4 text-sm leading-relaxed text-stone-400">{t('contact.subtitle')}</p>

              <ul className="mt-10 space-y-6">
                <li className="flex items-start gap-4">
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center border border-white/15 text-[#c4a574]">
                    <Phone size={15} />
                  </span>
                  <div>
                    <p className="text-xs text-stone-500">{t('contact.channel.call')}</p>
                    <a href={telHref} className="text-sm font-medium hover:text-[#c4a574]">
                      {settings.phoneDisplay}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center border border-white/15 text-[#c4a574]">
                    <MessageCircle size={15} />
                  </span>
                  <div>
                    <p className="text-xs text-stone-500">{t('contact.channel.whatsapp')}</p>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:text-[#c4a574]"
                    >
                      {t('contact.channel.chat')}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center border border-white/15 text-[#c4a574]">
                    <Mail size={15} />
                  </span>
                  <div>
                    <p className="text-xs text-stone-500">{t('contact.channel.email')}</p>
                    <a href={supportMailtoHref} className="text-sm font-medium hover:text-[#c4a574]">
                      {settings.supportEmail}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center border border-white/15 text-[#c4a574]">
                    <Clock size={15} />
                  </span>
                  <div>
                    <p className="text-xs text-stone-500">{t('contact.channel.response')}</p>
                    <p className="text-sm font-medium">{t('contact.channel.responseTime')}</p>
                  </div>
                </li>
              </ul>

              <div className="mt-10 flex items-center gap-2 border border-white/10 px-4 py-3 text-xs text-stone-400">
                <Shield size={14} className="shrink-0 text-[#c4a574]" />
                {t('contact.privacy')}
              </div>
            </div>

            {/* Right form */}
            <div className="relative z-10 min-w-0 bg-card p-6 sm:p-8 lg:p-9">
              {status === 'success' && (
                <Alert className="mb-6 border-emerald-500/30 bg-emerald-500/10">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-700 dark:text-emerald-400">
                    {t('contact.success')}
                  </AlertDescription>
                </Alert>
              )}

              {status === 'error' && errorMessage && (
                <Alert className="mb-6 border-destructive/50 bg-destructive/10">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">{errorMessage}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('contact.label.name')}
                    </label>
                    <Input
                      type="text"
                      name="name"
                      placeholder={t('contact.placeholder.name')}
                      value={formData.name}
                      onChange={handleChange}
                      className="h-12 rounded-xl border-border bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('contact.label.email')}
                    </label>
                    <Input
                      type="email"
                      name="email"
                      placeholder={t('contact.placeholder.email')}
                      value={formData.email}
                      onChange={handleChange}
                      className="h-12 rounded-xl border-border bg-background"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('contact.label.phone')}
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder={t('contact.placeholder.phone')}
                      value={formData.phone}
                      onChange={handleChange}
                      className="h-12 rounded-xl border-border bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('contact.label.service')}
                    </label>
                    <Select value={formData.service} onValueChange={handleServiceChange}>
                      <SelectTrigger className="h-12 w-full rounded-xl border-border bg-background">
                        <SelectValue placeholder={t('contact.placeholder.service')} />
                      </SelectTrigger>
                      <SelectContent position="popper" className="z-[250] rounded-xl border-stone-200 bg-white shadow-lg">
                        <SelectItem value="vedic-astrology">{t('contact.service.vedic')}</SelectItem>
                        <SelectItem value="tarot-reading">{t('contact.service.tarot')}</SelectItem>
                        <SelectItem value="both">{t('contact.service.both')}</SelectItem>
                        <SelectItem value="other">{t('contact.service.other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t('contact.label.message')}
                  </label>
                  <Textarea
                    name="message"
                    placeholder={t('contact.placeholder.message')}
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="resize-none rounded-xl border-border bg-background"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  className="h-14 w-full rounded-xl text-sm font-bold uppercase tracking-[0.15em]"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('contact.button.sending')}
                    </>
                  ) : (
                    t('contact.button.send')
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
