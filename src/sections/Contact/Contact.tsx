import { BookingForm } from './BookingForm';
import { useFormSubmission } from './useFormSubmission';

/**
 * Contact section — minimalist booking form area.
 */
export function Contact(): React.ReactNode {
  const { formData, errors, status, handleChange, handleSubmit, reset } = useFormSubmission();

  return (
    <section
      id="contact"
      className="relative w-full py-24 md:py-32 lg:py-40"
      style={{ backgroundColor: '#0A0A0A', color: '#F5F0E8' }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left: Heading and description */}
          <div className="lg:w-2/5">
            <p
              className="text-xs tracking-[0.3em] uppercase mb-4"
              style={{ color: '#C9302C' }}
            >
              Contact
            </p>
            <h2
              className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              预约咨询
            </h2>
            <div
              className="space-y-4 text-sm leading-relaxed"
              style={{ color: 'rgba(245,240,232,0.6)', fontFamily: "'Noto Serif SC', serif" }}
            >
              <p>
                每支定制香水都是一次深度对话。我每月仅接受 4 位新客户的预约，以确保对每一份作品的专注。
              </p>
              <p>
                请填写以下表单，我将在 48 小时内回复，并安排一次 60 分钟的初次对话。
              </p>
            </div>

            {/* Contact info */}
            <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(245,240,232,0.1)' }}>
              <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(245,240,232,0.4)' }}>
                Direct Contact
              </p>
              <p className="text-sm mb-2" style={{ color: 'rgba(245,240,232,0.7)' }}>
                hello@lina-perfume.com
              </p>
              <p className="text-sm" style={{ color: 'rgba(245,240,232,0.7)' }}>
                京都市中京区
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:w-3/5 lg:pl-8">
            <BookingForm
              formData={formData}
              errors={errors}
              status={status}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onReset={reset}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
