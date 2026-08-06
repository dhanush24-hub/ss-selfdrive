"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { calculatePrice } from "@/lib/pricing";
import { format, addDays, startOfDay, isBefore, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday } from "date-fns";

// ─── DarkCalendar ────────────────────────────────────────────────────────
interface DarkCalendarProps {
  value: Date | null;
  onChange: (date: Date) => void;
  minDate: Date;
  label: string;
  disabled?: boolean;
  blockedDates?: Date[];
}

function DarkCalendar({ value, onChange, minDate, label, disabled, blockedDates = [] }: DarkCalendarProps) {
  const [viewMonth, setViewMonth] = useState(value || minDate);

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart);

  const isBlocked = (d: Date) => blockedDates.some(bd => isSameDay(bd, d));
  const isPast = (d: Date) => isBefore(startOfDay(d), startOfDay(minDate));

  const prevMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  const nextMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div style={{ opacity: disabled ? 0.4 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      <div style={{ marginBottom: '8px', fontSize: '12px', fontFamily: 'Inter,sans-serif', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(204,0,0,0.3)', borderRadius: '14px', padding: '16px', backdropFilter: 'blur(12px)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <button onClick={prevMonth} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '20px', cursor: 'pointer', padding: '4px 10px', lineHeight: 1, transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#CC0000')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>‹</button>
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '16px', fontWeight: 700, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {format(viewMonth, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '20px', cursor: 'pointer', padding: '4px 10px', lineHeight: 1, transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#CC0000')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>›</button>
        </div>

        {/* Day names */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: '6px' }}>
          {dayNames.map(d => <div key={d} style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '6px 0' }}>{d}</div>)}
        </div>

        {/* Days */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px' }}>
          {Array.from({ length: startPadding }).map((_, i) => <div key={`p${i}`} />)}
          {days.map(day => {
            const blocked = isBlocked(day);
            const past = isPast(day);
            const selected = value && isSameDay(day, value);
            const todayDay = isToday(day);
            const isDisabledDay = past || blocked;

            let bg = 'transparent';
            let color = 'rgba(255,255,255,0.75)';
            let border = 'none';
            let boxShadow = 'none';
            let cursor = 'pointer';
            let fontWeight: any = 400;

            if (selected) { bg = '#CC0000'; color = 'white'; fontWeight = 700; boxShadow = '0 0 14px rgba(204,0,0,0.5)'; }
            else if (blocked) { bg = 'rgba(204,0,0,0.08)'; color = 'rgba(255,255,255,0.2)'; border = '1px dashed rgba(204,0,0,0.2)'; cursor = 'not-allowed'; }
            else if (past) { color = 'rgba(255,255,255,0.15)'; cursor = 'not-allowed'; }
            else if (todayDay) { color = '#FF3333'; fontWeight = 700; border = '1px solid rgba(204,0,0,0.5)'; }

            return (
              <div key={day.toISOString()} onClick={() => !isDisabledDay && onChange(day)}
                style={{ width: '36px', height: '36px', borderRadius: '8px', fontSize: '13px', cursor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif', transition: 'all 0.15s', background: bg, color, border, boxShadow, fontWeight, position: 'relative' }}
                onMouseEnter={e => { if (!isDisabledDay && !selected) { (e.currentTarget as HTMLElement).style.background = 'rgba(204,0,0,0.2)'; (e.currentTarget as HTMLElement).style.color = 'white'; } }}
                onMouseLeave={e => { if (!isDisabledDay && !selected) { (e.currentTarget as HTMLElement).style.background = bg; (e.currentTarget as HTMLElement).style.color = color; } }}
              >
                {format(day, 'd')}
                {blocked && <span style={{ position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(204,0,0,0.6)' }} />}
              </div>
            );
          })}
        </div>

        {/* Selected display */}
        <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '8px', textAlign: 'center', background: value ? 'rgba(204,0,0,0.12)' : 'transparent', border: value ? '1px solid rgba(204,0,0,0.25)' : '1px solid transparent' }}>
          <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: value ? 'white' : 'rgba(255,255,255,0.3)' }}>
            {value ? `📅 ${format(value, 'EEE, dd MMM yyyy')}` : 'Select a date'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Book Page ────────────────────────────────────────────────────────────
export default function Book() {
  const [step, setStep] = useState(1);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pricing, setPricing] = useState<any>(null);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const tomorrow = addDays(startOfDay(new Date()), 1);

  // Fetch blocked dates on mount
  useEffect(() => {
    fetch('/api/admin/blocked-dates')
      .then(r => r.json())
      .then(data => setBlockedDates(data.map((b: any) => new Date(b.date + 'T00:00:00'))))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      if (startDate < endDate) {
        setPricing(calculatePrice(startDate, endDate, true));
      } else { setPricing(null); }
    } else { setPricing(null); }
    setAvailable(null);
  }, [startDate, endDate]);

  const handleCheckAvailability = async () => {
    if (!startDate || !endDate) return;
    if (startDate >= endDate) { setErrorMsg("Return date must be after pickup date."); return; }
    setErrorMsg(""); setChecking(true);
    try {
      const res = await fetch("/api/bookings/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate:   endDate.toISOString(),
        }),
      });

      const data = await res.json();
      console.log('[book] availability response:', res.status, data);

      if (res.ok && data.available) {
        setAvailable(true);
      } else {
        setAvailable(false);
        setErrorMsg(
          data.message || data.error || 'Car not available for those dates.'
        );
      }
    } catch (error) {
      console.error('[book] check availability error:', error);
      setAvailable(false);
      setErrorMsg(
        'Could not connect to server. Check your internet connection.'
      );
    } finally { setChecking(false); }
  };

  const handleConfirm = async () => {
    if (!agreed) return;
    setSubmitting(true); setErrorMsg("");
    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate: startDate?.toISOString(), endDate: endDate?.toISOString(), customerName: name, phone, email, notes })
      });
      const data = await res.json();
      if (res.ok && data.success) { setBookingId(data.bookingId); setStep(4); }
      else { setErrorMsg(data.message || "Failed to confirm booking."); setStep(1); }
    } catch { setErrorMsg("Network error. Please try again."); setStep(1); }
    finally { setSubmitting(false); }
  };

  return (
    <main className="min-h-screen pt-24 pb-12 bg-[#080808]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {step < 4 && (
          <div className="mb-12 relative">
            <div className="absolute top-4 left-0 w-full h-[2px] bg-white/10 z-0" />
            <div className="relative z-10 flex justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-rajdhani font-bold transition-colors ${step > s ? "bg-[#CC0000] text-white" : step === s ? "bg-[#080808] border-2 border-[#CC0000] text-[#CC0000]" : "bg-[#080808] border-2 border-white/20 text-gray-500"}`}>
                    {step > s ? "✓" : s}
                  </div>
                  <span className={`text-xs font-inter ${step >= s ? "text-white" : "text-gray-500"}`}>
                    {s === 1 ? "Choose Dates" : s === 2 ? "Your Details" : "Confirm"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="glass-card-red p-6 text-center flex flex-col items-center gap-4">
                <img src="/cars/exterior-front.jpeg" alt="Hyundai Grand i10 — TS27 1087"
                  style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '12px', margin: '0 auto', display: 'block' }} />
                <div>
                  <h2 className="font-rajdhani text-2xl font-bold text-white">Your Flagship Ride</h2>
                  <p className="font-inter text-[#888888]">₹999 / day</p>
                </div>
              </div>

              {/* Dual calendars */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px', marginTop: '20px' }}>
                <div>
                  <DarkCalendar
                    label="Pickup Date"
                    value={startDate}
                    minDate={tomorrow}
                    blockedDates={blockedDates}
                    onChange={(date) => {
                      setStartDate(date);
                      if (endDate && endDate <= date) setEndDate(null);
                    }}
                  />
                </div>
                <div>
                  <DarkCalendar
                    label="Return Date"
                    value={endDate}
                    minDate={startDate ? addDays(startDate, 1) : tomorrow}
                    blockedDates={blockedDates}
                    onChange={setEndDate}
                    disabled={!startDate}
                  />
                </div>
              </div>

              {pricing && (
                <div className="glass-card p-6 font-inter text-gray-300">
                  <div className="flex justify-between mb-2"><span>🚗 Hyundai Grand i10</span><span /></div>
                  <div className="flex justify-between mb-2"><span>{pricing.totalDays} days × ₹999</span><span>₹{pricing.baseAmount}</span></div>
                  {pricing.discountAmount > 0 && (
                    <div className="flex justify-between mb-4 text-green-400"><span>{pricing.discountReason}</span><span>−₹{pricing.discountAmount}</span></div>
                  )}
                  <div className="h-[1px] bg-white/10 my-4" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Estimated Total</span>
                    <span className="font-rajdhani text-2xl font-bold text-[#CC0000]">₹{pricing.finalAmount}</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <button onClick={handleCheckAvailability} disabled={checking || !startDate || !endDate} className="btn-red w-full">
                  {checking ? "Checking..." : "Check Availability"}
                </button>
                {available === true && (
                  <div className="glass-card p-6 text-center space-y-4" style={{ border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.05)' }}>
                    <p className="text-green-400 font-inter">✓ Great news! The car is available for your dates.</p>
                    <button onClick={() => setStep(2)} className="btn-red w-full">Continue to Details →</button>
                  </div>
                )}
                {errorMsg && (
                  <div className="glass-card p-4 text-center" style={{ border: '1px solid rgba(204,0,0,0.3)', background: 'rgba(204,0,0,0.05)' }}>
                    <p className="text-red-400 font-inter">{errorMsg}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="glass-card p-8 space-y-6">
                <div><label className="block text-sm font-inter text-gray-400 mb-2">Full Name *</label><input type="text" className="glass-input" value={name} onChange={e => setName(e.target.value)} /></div>
                <div><label className="block text-sm font-inter text-gray-400 mb-2">Phone Number *</label><input type="tel" placeholder="+91" className="glass-input" value={phone} onChange={e => setPhone(e.target.value)} /></div>
                <div><label className="block text-sm font-inter text-gray-400 mb-2">Email Address *</label><input type="email" className="glass-input" value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div><label className="block text-sm font-inter text-gray-400 mb-2">Notes (Optional)</label><textarea rows={3} className="glass-input resize-none" value={notes} onChange={e => setNotes(e.target.value)} /></div>
              </div>
              <div className="glass-card-red p-4 text-sm text-gray-300 font-inter text-center">
                Discounts auto-applied: first-ride 15% OFF, early bird ₹500, 3-day weekend deal — all calculated at checkout.
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="btn-glass flex-1">Back</button>
                <button onClick={() => { if (name && phone && email) setStep(3); else alert("Please fill all required fields."); }} className="btn-red flex-1">Review Booking →</button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="glass-card p-8 font-inter text-gray-300 space-y-4">
                <h3 className="font-rajdhani text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Booking Summary</h3>
                <div className="flex justify-between"><span>🚗 Vehicle</span><span className="text-white">Hyundai Grand i10</span></div>
                <div className="flex justify-between"><span>Pickup</span><span className="text-white">{startDate ? format(startDate, 'dd MMM yyyy') : '-'}</span></div>
                <div className="flex justify-between"><span>Return</span><span className="text-white">{endDate ? format(endDate, 'dd MMM yyyy') : '-'}</span></div>
                <div className="flex justify-between"><span>Duration</span><span className="text-white">{pricing?.totalDays} days</span></div>
                <div className="flex justify-between"><span>Base</span><span className="text-white">₹{pricing?.baseAmount}</span></div>
                {pricing?.discountAmount > 0 && (
                  <div className="flex justify-between text-green-400"><span>Discount ({pricing.discountReason})</span><span>−₹{pricing.discountAmount}</span></div>
                )}
                <div className="h-[1px] bg-white/10 my-4" />
                <div className="flex justify-between items-center">
                  <span className="font-bold">TOTAL</span>
                  <span className="font-rajdhani text-[28px] font-bold text-[#CC0000]">₹{pricing?.finalAmount}</span>
                </div>
              </div>
              <div className="glass-card p-6 flex items-start gap-4">
                <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 w-5 h-5 accent-[#CC0000]" />
                <label htmlFor="agree" className="text-sm font-inter text-gray-400 cursor-pointer select-none">
                  I confirm I hold a valid Indian Driving Licence and agree to the rental terms and conditions.
                </label>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(2)} disabled={submitting} className="btn-glass flex-1">Back</button>
                <button onClick={handleConfirm} disabled={!agreed || submitting} className="btn-red flex-1">
                  {submitting ? "Confirming..." : "CONFIRM BOOKING"}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4 — SUCCESS */}
          {step === 4 && (
            <motion.div key="step4" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="text-center space-y-8 py-12">
              <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto text-green-500 text-5xl">✓</div>
              <div>
                <h2 className="font-rajdhani text-[36px] font-bold text-red-gradient mb-4">Booking Confirmed! 🎉</h2>
                <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-gray-300 mb-6">ID: {bookingId}</div>
                <p className="font-inter text-gray-300 text-lg max-w-md mx-auto">We'll call you on <span className="text-white font-bold">{phone}</span> within 2 hours to confirm your ride.</p>
              </div>
              <div className="glass-card-red p-6 max-w-sm mx-auto">
                <p className="text-sm text-gray-400 mb-4 uppercase tracking-wider">Save our number</p>
                <div className="flex flex-col gap-3 font-inter text-lg">
                  <a href="tel:+919182399850" className="text-[#CC0000] hover:text-[#FF2200]">📞 +91 91823 99850</a>
                  <a href="tel:+918309987067" className="text-[#CC0000] hover:text-[#FF2200]">📞 +91 83099 87067</a>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <button onClick={() => { setStep(1); setStartDate(null); setEndDate(null); setName(""); setPhone(""); setEmail(""); setNotes(""); setAgreed(false); setBookingId(null); }} className="btn-glass">Book Another</button>
                <Link href="/" className="btn-red">Go Home</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
