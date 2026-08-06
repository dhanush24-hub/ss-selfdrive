"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Phone, MapPin, CalendarCheck, ChevronRight } from "lucide-react";

interface DropdownCalendarProps {
  value: Date | null
  onChange: (date: Date) => void
  minDate?: Date
  placeholder?: string
}

function DropdownCalendar({
  value, onChange, minDate, placeholder = 'Select preferred date'
}: DropdownCalendarProps) {
  const [open, setOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState(value || minDate || new Date())
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const today = new Date()
  today.setHours(0,0,0,0)
  const effectiveMin = minDate || today

  // Build calendar days
  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ]
  const monthNames = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
    'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER']

  const formatDisplay = (d: Date) =>
    d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>

      {/* Trigger field — looks like glass-input */}
      <div
        onClick={() => setOpen(p => !p)}
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${open ? '#CC0000' : 'rgba(255,255,255,0.12)'}`,
          borderRadius: 10,
          color: value ? '#fff' : 'rgba(255,255,255,0.30)',
          padding: '12px 16px',
          width: '100%',
          fontFamily: 'Inter, sans-serif',
          fontSize: 15,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          boxShadow: open ? '0 0 0 3px rgba(204,0,0,0.15)' : 'none',
          transition: 'all 0.2s',
          userSelect: 'none',
        }}
      >
        <span>{value ? `📅 ${formatDisplay(value)}` : placeholder}</span>
        <span style={{
          color: 'rgba(255,255,255,0.4)', fontSize: 12,
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
        }}>▼</span>
      </div>

      {/* Dropdown calendar panel */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          zIndex: 9999,
          background: '#111111',
          border: '1px solid rgba(204,0,0,0.35)',
          borderRadius: 14,
          padding: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(204,0,0,0.1)',
          minWidth: 280,
          backdropFilter: 'blur(20px)',
          animation: 'calDropIn 0.18s ease',
        }}>

          {/* Month navigation */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 12,
          }}>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setViewMonth(new Date(year, month - 1, 1)) }}
              style={{
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
                fontSize: 20, cursor: 'pointer', padding: '2px 10px',
                lineHeight: 1,
              }}
              onMouseEnter={e => (e.currentTarget.style.color='#CC0000')}
              onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.5)')}
            >‹</button>

            <span style={{
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
              fontSize: 15, color: '#fff', letterSpacing: '0.06em',
            }}>
              {monthNames[month]} {year}
            </span>

            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setViewMonth(new Date(year, month + 1, 1)) }}
              style={{
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
                fontSize: 20, cursor: 'pointer', padding: '2px 10px',
                lineHeight: 1,
              }}
              onMouseEnter={e => (e.currentTarget.style.color='#CC0000')}
              onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.5)')}
            >›</button>
          </div>

          {/* Day names */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7,1fr)',
            marginBottom: 6,
          }}>
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
              <div key={d} style={{
                textAlign: 'center', fontSize: 11,
                color: 'rgba(255,255,255,0.3)',
                fontWeight: 600, padding: '4px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}>{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
            {cells.map((day, idx) => {
              if (!day) return <div key={idx} />
              const cellDate = new Date(year, month, day)
              cellDate.setHours(0,0,0,0)
              const isPast = cellDate < effectiveMin
              const isToday = cellDate.getTime() === today.getTime()
              const isSelected = value &&
                cellDate.toDateString() === value.toDateString()

              return (
                <div key={idx}
                  onClick={() => {
                    if (isPast) return
                    onChange(cellDate)
                    setOpen(false)
                  }}
                  style={{
                    width: 34, height: 34, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontFamily: 'Inter, sans-serif',
                    cursor: isPast ? 'not-allowed' : 'pointer',
                    background: isSelected ? '#CC0000' : 'transparent',
                    color: isPast ? 'rgba(255,255,255,0.18)' :
                           isSelected ? '#fff' :
                           isToday ? '#FF4444' : 'rgba(255,255,255,0.8)',
                    fontWeight: isSelected || isToday ? 700 : 400,
                    border: isToday && !isSelected
                      ? '1px solid rgba(204,0,0,0.5)' : '1px solid transparent',
                    boxShadow: isSelected ? '0 0 12px rgba(204,0,0,0.5)' : 'none',
                    transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => {
                    if (!isPast && !isSelected)
                      (e.currentTarget as HTMLDivElement).style.background =
                        'rgba(204,0,0,0.2)'
                  }}
                  onMouseLeave={e => {
                    if (!isSelected)
                      (e.currentTarget as HTMLDivElement).style.background = 'transparent'
                  }}
                >{day}</div>
              )
            })}
          </div>

          {/* Clear button */}
          {value && (
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); onChange(null as any); setOpen(false) }}
                style={{
                  background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.3)', fontSize: 12,
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={e => (e.currentTarget.style.color='#CC0000')}
                onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.3)')}
              >Clear selection</button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes calDropIn {
          from { opacity: 0; transform: translateY(-8px) }
          to   { opacity: 1; transform: translateY(0) }
        }
      `}</style>
    </div>
  )
}


export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  const [preferredDate, setPreferredDate] = useState<Date|null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, preferredDate: preferredDate ? preferredDate.toISOString() : undefined })
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", phone: "", email: "", message: "" });
        setPreferredDate(null);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen pt-20 bg-[#080808]">
      {/* Header */}
      <section className="py-12 border-b border-white/5 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-inter text-[#888888] mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Contact</span>
          </div>
          <h1 className="font-rajdhani text-[40px] md:text-[56px] font-bold text-white mb-2">Get In Touch</h1>
          <p className="font-inter text-[#888888] text-lg">We're one call away.</p>
        </div>
      </section>

      <section className="py-[80px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* LEFT — Contact Info */}
            <div className="space-y-6">
              <div className="glass-card p-8 flex gap-6">
                <div className="bg-[#CC0000]/10 p-4 rounded-full h-fit">
                  <Phone className="text-[#CC0000] w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-rajdhani text-2xl font-bold text-white mb-4">Call Us Directly</h3>
                  <div className="flex flex-col gap-2 mb-4 font-inter text-gray-300">
                    <a href="tel:+919182399850" className="hover:text-[#CC0000] transition-colors">+91 91823 99850</a>
                    <a href="tel:+918309987067" className="hover:text-[#CC0000] transition-colors">+91 83099 87067</a>
                  </div>
                  <p className="text-sm text-[#888888] font-inter">Available daily · 8 AM – 9 PM</p>
                </div>
              </div>

              <div className="glass-card p-8 flex gap-6">
                <div className="bg-[#CC0000]/10 p-4 rounded-full h-fit">
                  <MapPin className="text-[#CC0000] w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-rajdhani text-2xl font-bold text-white mb-4">Where We Are</h3>
                  <p className="font-inter text-gray-300 mb-2">Hyderabad, Telangana, India</p>
                  <p className="text-sm text-[#888888] font-inter">We deliver the car to your location within the city.</p>
                </div>
              </div>

              <div className="glass-card-red p-8 flex gap-6">
                <div className="bg-white/10 p-4 rounded-full h-fit">
                  <CalendarCheck className="text-white w-6 h-6" />
                </div>
                <div className="w-full">
                  <h3 className="font-rajdhani text-2xl font-bold text-white mb-4">Ready to ride?</h3>
                  <Link href="/book" className="btn-red w-full justify-center">
                    BOOK NOW
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT — Contact Form */}
            <div className="glass-card p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-inter text-gray-400 mb-2">Full Name *</label>
                  <input required type="text" className="glass-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-inter text-gray-400 mb-2">Phone Number *</label>
                  <input required type="tel" placeholder="+91 98765 43210" className="glass-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-inter text-gray-400 mb-2">Email Address *</label>
                  <input required type="email" className="glass-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label style={{ color:'rgba(255,255,255,0.6)', fontSize:13, marginBottom:6, display:'block' }}>
                    Preferred Date (Optional)
                  </label>
                  <DropdownCalendar
                    value={preferredDate}
                    onChange={setPreferredDate}
                    minDate={new Date()}
                    placeholder="Select preferred date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-inter text-gray-400 mb-2">Message / Questions *</label>
                  <textarea required rows={4} className="glass-input resize-none" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                </div>

                <button type="submit" disabled={status === "loading"} className="btn-red w-full justify-center">
                  {status === "loading" ? "SENDING..." : "SEND MESSAGE"}
                </button>

                {status === "success" && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm font-inter text-center">
                    Thanks! We'll reach you within 2 hours. ✓
                  </div>
                )}
                {status === "error" && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-inter text-center">
                    Something went wrong. Call us directly.
                  </div>
                )}
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Map */}
      <section className="px-4 sm:px-6 lg:px-8 pb-[80px] max-w-7xl mx-auto">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.3172505457!2d78.24323049082761!3d17.41262370000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1234567890"
          width="100%" height="380" style={{ border: 0, borderRadius: "16px" }}
          allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade">
        </iframe>
      </section>
    </main>
  );
}
