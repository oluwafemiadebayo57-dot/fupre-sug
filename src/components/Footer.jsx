import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-fupre-navy text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="font-bold text-lg text-fupre-gold mb-3">FUPRE SUG</h3>
          <p className="text-sm text-gray-300">
            The official Student Union Government of the Federal University of Petroleum Resources, Effurun.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg text-fupre-gold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#/executives" className="hover:text-fupre-gold">Executives</a></li>
            <li><a href="#/projects" className="hover:text-fupre-gold">Projects</a></li>
            <li><a href="#/complaints" className="hover:text-fupre-gold">Submit a Complaint</a></li>
            <li><a href="#/constitution" className="hover:text-fupre-gold">Constitution</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-lg text-fupre-gold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2"><MapPin size={14} /> FUPRE, Effurun, Delta State</li>
            <li className="flex items-center gap-2"><Mail size={14} /> sug@fupre.edu.ng</li>
            <li className="flex items-center gap-2"><Phone size={14} /> +234 XXX XXX XXXX</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} FUPRE Student Union Government. All rights reserved.
      </div>
    </footer>
  );
}