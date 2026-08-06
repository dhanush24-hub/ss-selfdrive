import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function About() {
  return (
    <main className="min-h-screen pt-20 bg-[#080808]">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#141414] to-[#080808] py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-inter text-[#888888] mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">About</span>
          </div>
          <h1 className="font-rajdhani text-[40px] md:text-[56px] font-bold text-white">Our Story</h1>
        </div>
      </section>

      {/* Section 1 */}
      <section className="py-[80px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-rajdhani text-[32px] md:text-[44px] font-bold text-red-gradient leading-[1.2]">
                "We didn't build a fleet.<br/>We built an experience."
              </h2>
            </div>
            <div className="space-y-6 font-inter text-gray-300 leading-relaxed text-lg">
              <p>
                SS Self Drive was born from one belief: every driver deserves a car that feels personal, pristine, and perfectly maintained — not a random vehicle from a crowded lot.
              </p>
              <p>
                Our Hyundai Grand i10 is cleaned, inspected, and prepared before every single ride. That level of care is only possible because we put all our attention into one exceptional vehicle.
              </p>
              <p>
                Based in Hyderabad, we're local, reachable, and genuinely invested in your experience — from booking to return.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — What Sets Us Apart */}
      <section className="py-[80px] bg-[#CC0000]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-rajdhani text-[36px] font-bold text-white text-center mb-12">What Sets Us Apart</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card-red p-8">
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-4">One Car, All Attention</h3>
              <p className="font-inter text-gray-300 leading-relaxed text-sm">
                Zero fleet management chaos. Every service dollar goes into perfecting one vehicle for you.
              </p>
            </div>
            <div className="glass-card-red p-8">
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-4">Hyderabad Local</h3>
              <p className="font-inter text-gray-300 leading-relaxed text-sm">
                We know the city, we serve the city, and we're always just a call away.
              </p>
            </div>
            <div className="glass-card-red p-8">
              <h3 className="font-rajdhani text-2xl font-bold text-white mb-4">Honest Pricing</h3>
              <p className="font-inter text-gray-300 leading-relaxed text-sm">
                ₹999/day. No peak pricing. No hidden charges. What you see is what you pay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Stats */}
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

      {/* Section 4 — CTA */}
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
