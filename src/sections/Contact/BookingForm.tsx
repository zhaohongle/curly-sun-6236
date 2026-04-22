import type { FormStatus } from './useFormSubmission';

interface InputFieldProps {
  label: string;
  value: string;
  error?: string;
  type?: string;
  onChange: (value: string) => void;
}

function InputField({ label, value, error, type = 'text', onChange }: InputFieldProps): React.ReactNode {
  return (
    <div className="relative mb-8">
      <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(245,240,232,0.5)' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b pb-2 outline-none transition-colors duration-300 text-base"
        style={{
          borderColor: error ? '#C9302C' : 'rgba(245,240,232,0.2)',
          color: '#F5F0E8',
          fontFamily: "'Noto Serif SC', serif",
        }}
        onFocus={(e) => { if (!error) e.target.style.borderColor = '#C9302C'; }}
        onBlur={(e) => { if (!error) e.target.style.borderColor = 'rgba(245,240,232,0.2)'; }}
      />
      {error && <p className="text-xs mt-1" style={{ color: '#C9302C' }}>{error}</p>}
    </div>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }): React.ReactNode {
  return (
    <div className="relative mb-8">
      <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(245,240,232,0.5)' }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b pb-2 outline-none transition-colors duration-300 text-base appearance-none cursor-none"
        style={{ borderColor: 'rgba(245,240,232,0.2)', color: '#F5F0E8', fontFamily: "'Noto Serif SC', serif" }}
        onFocus={(e) => (e.target.style.borderColor = '#C9302C')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(245,240,232,0.2)')}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: '#0A0A0A', color: '#F5F0E8' }}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function TextareaField({ label, value, error, onChange }: { label: string; value: string; error?: string; onChange: (value: string) => void }): React.ReactNode {
  return (
    <div className="relative mb-10">
      <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(245,240,232,0.5)' }}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full bg-transparent border-b pb-2 outline-none transition-colors duration-300 text-base resize-none"
        style={{ borderColor: error ? '#C9302C' : 'rgba(245,240,232,0.2)', color: '#F5F0E8', fontFamily: "'Noto Serif SC', serif" }}
        onFocus={(e) => { if (!error) e.target.style.borderColor = '#C9302C'; }}
        onBlur={(e) => { if (!error) e.target.style.borderColor = 'rgba(245,240,232,0.2)'; }}
      />
      {error && <p className="text-xs mt-1" style={{ color: '#C9302C' }}>{error}</p>}
    </div>
  );
}

interface BookingFormProps {
  formData: { name: string; email: string; inquiryType: string; message: string };
  errors: { name?: string; email?: string; message?: string };
  status: FormStatus;
  onChange: (field: 'name' | 'email' | 'inquiryType' | 'message', value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

const inquiryOptions = [
  { value: 'custom', label: '定制香水' },
  { value: 'consultation', label: '香氛咨询' },
  { value: 'collaboration', label: '商务合作' },
  { value: 'other', label: '其他' },
];

export function BookingForm({ formData, errors, status, onChange, onSubmit, onReset }: BookingFormProps): React.ReactNode {
  if (status === 'success') {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-8 rounded-full flex items-center justify-center" style={{ border: '1px solid rgba(201,48,44,0.3)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9302C" strokeWidth="1.5"><path d="M5 13l4 4L19 7" /></svg>
        </div>
        <blockquote className="font-serif text-2xl md:text-3xl italic mb-6 leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif", color: '#F5F0E8' }}>
          「香气是时间的艺术，耐心是最美的配方。」
        </blockquote>
        <p className="text-sm mb-8" style={{ color: 'rgba(245,240,232,0.5)' }}>感谢您的来信，我将在 48 小时内回复。</p>
        <button onClick={onReset} className="text-xs tracking-[0.2em] uppercase transition-colors duration-300" style={{ color: '#C9302C' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#F5F0E8')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#C9302C')}
        >再次预约</button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center py-16">
        <p className="text-lg mb-4" style={{ color: '#C9302C' }}>发送失败，请稍后重试。</p>
        <button onClick={onReset} className="text-xs tracking-[0.2em] uppercase transition-colors duration-300" style={{ color: '#C9302C' }}>返回表单</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <InputField label="姓名 Name" value={formData.name} error={errors.name} onChange={(v) => onChange('name', v)} />
      <InputField label="邮箱 Email" type="email" value={formData.email} error={errors.email} onChange={(v) => onChange('email', v)} />
      <SelectField label="咨询类型 Inquiry Type" value={formData.inquiryType} options={inquiryOptions} onChange={(v) => onChange('inquiryType', v)} />
      <TextareaField label="留言 Message" value={formData.message} error={errors.message} onChange={(v) => onChange('message', v)} />
      <button type="submit" disabled={status === 'submitting'}
        className="group relative px-8 py-3 text-xs tracking-[0.2em] uppercase transition-all duration-500 cursor-none"
        style={{ color: '#F5F0E8', border: '1px solid rgba(245,240,232,0.3)', background: 'transparent' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#C9302C'; e.currentTarget.style.borderColor = '#C9302C'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(245,240,232,0.3)'; }}
      >
        {status === 'submitting' ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            发送中...
          </span>
        ) : '发送预约'}
      </button>
    </form>
  );
}
