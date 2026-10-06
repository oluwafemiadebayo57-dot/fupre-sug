import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import fupreLogo from '../assets/fupre-logo.png';
import sugLogo from '../assets/sug-logo.png';

const links = [
  { path: '/', label: 'Home' },
  { path: '/executives', label: 'Executives' },
  { path: '/projects', label: 'Projects' },
  { path: '/complaints', label: 'Complaints' },
  { path: '/news', label: 'News' },
  { path: '/constitution', label: 'Constitution' },
  { path: '/partner', label: 'Partner' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-fupre-navy text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logos + Title */}
          <Link to="/" className="flex items-center gap-3">
            {/* FUPRE logo in white chip */}
            <div className="bg-white rounded-full p-1.5 shadow-md ring-2 ring-fupre-gold/40 flex items-center justify-center w-12 h-12 md:w-14 md:h-14">
              <img
                src={fupreLogo}
                alt="FUPRE Logo"
                className="w-full h-full object-contain rounded-full"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>

            {/* SUG logo in white chip */}
            <div className="bg-white rounded-full p-1.5 shadow-md ring-2 ring-fupre-gold/40 flex items-center justify-center w-12 h-12 md:w-14 md:h-14">
              <img
                src={sugLogo}
                alt="SUG Logo"
                className="w-full h-full object-contain rounded-full"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>

            {/* Text */}
            <div className="leading-tight hidden sm:block ml-1">
              <p className="font-bold text-sm md:text-lg tracking-wide">FUPRE SUG</p>
              <p className="text-[10px] md:text-xs text-fupre-gold font-medium tracking-wider uppercase">
                Student Union Government
              </p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex gap-6">
            {links.map(l => (
              <Link
                key={l.path}
                to={l.path}
                className={`hover:text-fupre-gold transition ${
                  location.pathname === l.path ? 'text-fupre-gold font-semibold' : ''
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            {links.map(l => (
              <Link
                key={l.path}
                to={l.path}
                onClick={() => setOpen(false)}
                className="hover:text-fupre-gold"
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}