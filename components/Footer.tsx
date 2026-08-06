import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="text-[#CC0000] font-rajdhani font-bold text-2xl tracking-wide">SS</span>
              <span className="text-white font-rajdhani font-bold text-2xl tracking-wide">SELF DRIVE</span>
            </div>
            <p className="text-gray-400 font-inter text-sm mb-6 leading-relaxed">
              Hyderabad&apos;s exclusive flagship self-drive experience.
            </p>
            <div className="flex flex-col gap-2">
              <a href="tel:+919182399850" className="text-gray-300 hover:text-[#CC0000] transition-colors font-inter text-sm">
                +91 91823 99850
              </a>
              <a href="tel:+918309987067" className="text-gray-300 hover:text-[#CC0000] transition-colors font-inter text-sm">
                +91 83099 87067
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="text-[#CC0000] font-rajdhani font-bold text-xl mb-4 tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'About', 'Gallery', 'Contact', 'Book Now'].map((link) => {
                const href = link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '')}`;
                return (
                  <li key={link}>
                    <Link href={href} className="text-gray-400 hover:text-[#CC0000] transition-colors font-inter text-sm">
                      {link}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="text-[#CC0000] font-rajdhani font-bold text-xl mb-4 tracking-wide">Reach Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-xl">📞</span>
                <a href="tel:+919182399850" className="text-gray-400 hover:text-[#CC0000] transition-colors font-inter text-sm">
                  +91 91823 99850
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">📞</span>
                <a href="tel:+918309987067" className="text-gray-400 hover:text-[#CC0000] transition-colors font-inter text-sm">
                  +91 83099 87067
                </a>
              </li>
              <li className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                <span className="text-xl">📍</span>
                <span className="text-gray-400 font-inter text-sm">
                  Hyderabad, Telangana
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-gray-500 font-inter text-xs">
            © {new Date().getFullYear()} SS Self Drive and Rentals. All rights reserved.
          </p>
          {/* Hidden admin access — invisible to users */}
          <div style={{
            textAlign: 'center',
            paddingBottom: '10px',
            marginTop: '6px',
          }}>
            <a
              href="/admin/login"
              title="Admin"
              style={{
                color: 'rgba(255,255,255,0.12)',
                fontSize: '11px',
                textDecoration: 'none',
                userSelect: 'none',
                display: 'inline-block',
                padding: '10px 40px',
                letterSpacing: '0.2em',
                cursor: 'pointer',
                lineHeight: 1,
              }}
            >· · ·</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
