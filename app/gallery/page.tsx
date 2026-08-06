"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ShowroomSpinner360 from "@/components/ShowroomSpinner360";

// ─── Gallery Page ─────────────────────────────────────────────────────────
export default function Gallery() {
  const [activeTab, setActiveTab] = useState<"exterior" | "interior" | "360">("exterior");
  const [lightboxState, setLightboxState] = useState<{src: string, label: string} | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxState(null);
    };
    if (lightboxState) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxState]);

  const exteriorImages = [
    { url: "/cars/hero-poster.jpeg", label: "TS27 1087 — Signature Edit" },
    { url: "/cars/exterior-front.jpeg", label: "Grand i10 — Front View" },
    { url: "/cars/exterior-side.jpeg", label: "Grand i10 — Side Profile" },
    { url: "/cars/exterior-rear.jpeg", label: "Grand i10 — Rear View" },
    { url: "/cars/exterior-front1.jpeg", label: "Grand i10 — On Location" },
    { url: "/cars/exterior-front-day.jpeg", label: "Grand i10 — Night, Headlights On" }
  ];

  const interiorImages = [
    { url: "/cars/interior-dashboard.jpeg", label: "Full Dashboard View" },
    { url: "/cars/interior-infotainment.jpeg", label: "Infotainment & Console" },
    { url: "/cars/interior-driving.jpeg", label: "Driver POV — Open Road" }
  ];

  return (
    <main className="min-h-screen pt-20 bg-[#080808]">
      {/* Header */}
      <section className="py-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-inter text-[#888888] mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Gallery</span>
          </div>
          <h1 className="font-rajdhani text-[40px] md:text-[56px] font-bold text-white mb-4">The Flagship Gallery</h1>
          <p className="font-inter text-[#888888] text-lg">Every angle. Every detail. Every inch, perfected.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Tabs */}
          <div className="flex justify-center mb-12">
            <div className="glass-card flex p-1 rounded-xl">
              {[{ id: "exterior", label: "Exterior" }, { id: "interior", label: "Interior" }, { id: "360", label: "360° View" }].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as "exterior" | "interior" | "360")}
                  className={`px-6 py-2 rounded-lg font-rajdhani font-bold text-lg transition-colors ${activeTab === tab.id ? "bg-[#CC0000] text-white" : "text-gray-400 hover:text-white"}`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[500px]">
            {/* EXTERIOR GRID — uniform 4:3 cards */}
            {activeTab === "exterior" && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
              }}
              className="gallery-grid">
                {exteriorImages.map((img, i) => (
                  <div
                    key={i}
                    className="gallery-card"
                    onClick={() => setLightboxState({ src: img.url, label: img.label })}
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '75%',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: '#111',
                    }}
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                        transition: 'transform 0.4s ease',
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.style.background = 'rgba(204,0,0,0.08)';
                        }
                      }}
                    />
                    <div
                      className="gallery-hover-overlay"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(transparent 40%, rgba(204,0,0,0.75) 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '14px',
                      }}
                    >
                      <span style={{
                        color: '#fff',
                        fontFamily: 'Rajdhani, sans-serif',
                        fontWeight: 700,
                        fontSize: '14px',
                        letterSpacing: '0.05em',
                      }}>{img.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* INTERIOR GRID — uniform 4:3 cards */}
            {activeTab === "interior" && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
              }}
              className="gallery-grid">
                {interiorImages.map((img, i) => (
                  <div
                    key={i}
                    className="gallery-card"
                    onClick={() => setLightboxState({ src: img.url, label: img.label })}
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '75%',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: '#111',
                    }}
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                        transition: 'transform 0.4s ease',
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.style.background = 'rgba(204,0,0,0.08)';
                        }
                      }}
                    />
                    <div
                      className="gallery-hover-overlay"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(transparent 40%, rgba(204,0,0,0.75) 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '14px',
                      }}
                    >
                      <span style={{
                        color: '#fff',
                        fontFamily: 'Rajdhani, sans-serif',
                        fontWeight: 700,
                        fontSize: '14px',
                        letterSpacing: '0.05em',
                      }}>{img.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 360° TAB */}
            {activeTab === "360" && (
              <div className="max-w-4xl mx-auto">
                <div style={{ padding: '24px 0' }}>
                  <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <h2 style={{
                      fontFamily: 'Rajdhani, sans-serif',
                      fontWeight: 700, fontSize: 28,
                      color: '#fff', marginBottom: 8,
                    }}>360° Exterior View</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
                      Drag to rotate the car · Switch between doors closed and open
                    </p>
                  </div>
                  <ShowroomSpinner360 />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxState && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            onClick={() => setLightboxState(null)}>
            
            <div style={{ position: 'relative', maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
              <button 
                style={{
                  position: 'absolute', top: -16, right: -16,
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: 20
                }}
                onClick={() => setLightboxState(null)}>
                ✕
              </button>
              
              <img
                src={lightboxState.src}
                alt={lightboxState.label}
                style={{
                  maxHeight: '85vh',
                  maxWidth: '90vw',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  display: 'block',
                }}
              />
              <p style={{
                color: 'rgba(255,255,255,0.7)', textAlign: 'center',
                marginTop: 12, fontFamily: 'Rajdhani,sans-serif',
                fontSize: 15, letterSpacing: '0.05em'
              }}>
                {lightboxState.label}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
