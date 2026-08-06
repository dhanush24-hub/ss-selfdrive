"use client";

import Link from "next/link";
import { Calendar, Car, Clock, Users } from "lucide-react";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* SECTION A — HERO */}
      <Hero />

      {/* SECTION B — OFFERS */}
      <section id="offers" className="py-[100px] bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani text-[36px] md:text-[48px] font-bold text-white mb-4">
              Built-In Savings, Every Time You Ride
            </h2>
            <p className="font-inter text-[#888888] text-lg">
              No coupon codes. Discounts auto-applied at checkout.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="glass-card p-8 relative overflow-hidden group">
              <div className="absolute top-4 right-4 bg-[#CC0000] text-white text-[11px] font-bold px-2 py-1 rounded">WEEKEND DEAL</div>
              <Calendar className="text-[#CC0000] w-7 h-7 mb-6" />
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-2">Book 2 Days</h3>
              <div className="text-xl text-red-gradient font-bold mb-4">3rd Day at 50% OFF</div>
              <p className="font-inter text-[#888888] text-sm">Stack your weekend — save every third day.</p>
            </div>
            
            {/* Card 2 */}
            <div className="glass-card p-8 relative overflow-hidden group">
              <div className="absolute top-4 right-4 bg-[#CC0000] text-white text-[11px] font-bold px-2 py-1 rounded">NEW USER</div>
              <Car className="text-[#CC0000] w-7 h-7 mb-6" />
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-2">First Self-Drive?</h3>
              <div className="text-xl text-red-gradient font-bold mb-4">Get 15% OFF</div>
              <p className="font-inter text-[#888888] text-sm">Your first ride with us comes with a discount.</p>
            </div>
            
            {/* Card 3 */}
            <div className="glass-card p-8 relative overflow-hidden group">
              <div className="absolute top-4 right-4 bg-[#CC0000] text-white text-[11px] font-bold px-2 py-1 rounded">PLAN AHEAD</div>
              <Clock className="text-[#CC0000] w-7 h-7 mb-6" />
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-2">Book 7 Days Early</h3>
              <div className="text-xl text-red-gradient font-bold mb-4">Save Flat ₹500</div>
              <p className="font-inter text-[#888888] text-sm">Reward yourself for planning ahead.</p>
            </div>
            
            {/* Card 4 */}
            <div className="glass-card p-8 relative overflow-hidden group">
              <div className="absolute top-4 right-4 bg-[#CC0000] text-white text-[11px] font-bold px-2 py-1 rounded">REFERRAL</div>
              <Users className="text-[#CC0000] w-7 h-7 mb-6" />
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-2">Refer a Friend</h3>
              <div className="text-xl text-red-gradient font-bold mb-4">Both Get ₹300 OFF</div>
              <p className="font-inter text-[#888888] text-sm">Share the experience, share the savings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C — WHY US */}
      <section className="py-[80px] bg-[#CC0000]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card-red p-8">
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-4">Total Attention</h3>
              <p className="font-inter text-gray-300 leading-relaxed text-sm">
                One car = 100% of our focus. Every clean, every check, every service, done right.
              </p>
            </div>
            <div className="glass-card-red p-8">
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-4">Local &amp; Trusted</h3>
              <p className="font-inter text-gray-300 leading-relaxed text-sm">
                Hyderabadis serving Hyderabad. Real people, direct numbers, zero middlemen.
              </p>
            </div>
            <div className="glass-card-red p-8">
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-4">Fully Transparent</h3>
              <p className="font-inter text-gray-300 leading-relaxed text-sm">
                ₹999/day. No surprises. No hidden fees. What you see is exactly what you pay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION D — STATS ROW */}
      <section className="py-[60px] bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: '500+', label: 'Happy Rides' },
              { num: '100%', label: 'Satisfaction' },
              { num: '24/7', label: 'Support' },
              { num: '₹0', label: 'Hidden Fees' }
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-6 text-center">
                <div className="font-rajdhani text-[36px] md:text-[48px] font-bold text-[#CC0000] mb-2">{stat.num}</div>
                <div className="font-inter text-[#888888] text-sm tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION E — FINAL CTA STRIP */}
      <section className="py-[80px] bg-[#080808]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card-red p-12 text-center rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#CC0000]/10 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="font-rajdhani text-[36px] md:text-[48px] font-bold text-white mb-4">Your Ride Is Waiting.</h2>
              <p className="font-inter text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                One flagship. One experience. Entirely yours.
              </p>
              <Link href="/book" className="btn-red text-lg px-8 py-4 shadow-[0_0_30px_rgba(204,0,0,0.4)] hover:shadow-[0_0_50px_rgba(204,0,0,0.6)]">
                BOOK NOW →
              </Link>
              <div className="mt-8 flex items-center justify-center gap-4 text-[#888888] font-inter text-sm">
                <a href="tel:+919182399850" className="hover:text-[#CC0000] transition-colors">+91 91823 99850</a>
                <span>·</span>
                <a href="tel:+918309987067" className="hover:text-[#CC0000] transition-colors">+91 83099 87067</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
