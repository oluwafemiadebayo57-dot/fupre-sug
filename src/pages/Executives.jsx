import { useState } from 'react';
import { Mail, User } from 'lucide-react';
import { currentExecutives, pastExecutives } from '../data/executives';

function ExecutiveCard({ exec }) {
  const [imgError, setImgError] = useState(false);
  const showPhoto = exec.photo && !imgError;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      {/* Photo area */}
      <div className="h-64 bg-gradient-to-br from-fupre-navy to-fupre-light flex items-center justify-center relative">
        {showPhoto ? (
          <img
            src={exec.photo}
            alt={exec.name}
            className="w-full h-full object-cover object-top"
            onError={() => setImgError(true)}
          />
        ) : (
          <User size={72} className="text-white/50" />
        )}

        {/* Position badge */}
        <span className="absolute bottom-2 left-2 bg-fupre-gold text-fupre-navy text-xs font-bold px-3 py-1 rounded-full shadow">
          {exec.position}
        </span>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-bold text-base text-gray-800 leading-snug min-h-[2.5rem]">
          {exec.name}
        </h3>

        {exec.email && (
          <a
            href={`mailto:${exec.email}`}
            className="text-fupre-navy hover:text-fupre-gold text-xs flex items-center gap-1 mt-3 font-medium transition"
          >
            <Mail size={14} /> Contact
          </a>
        )}
      </div>
    </div>
  );
}

export default function Executives() {
  const [tab, setTab] = useState('current');

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-fupre-navy mb-2">SUG Executives</h1>
      <p className="text-gray-600 mb-8">
        Meet the leaders serving the FUPRE student body — Team Aurora 2025/2026.
      </p>

      {/* Tabs */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <button
          onClick={() => setTab('current')}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            tab === 'current'
              ? 'bg-fupre-navy text-white shadow-md'
              : 'bg-white text-fupre-navy border border-fupre-navy/20 hover:bg-fupre-navy/5'
          }`}
        >
          Current (2025/2026)
        </button>
        <button
          onClick={() => setTab('past')}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            tab === 'past'
              ? 'bg-fupre-navy text-white shadow-md'
              : 'bg-white text-fupre-navy border border-fupre-navy/20 hover:bg-fupre-navy/5'
          }`}
        >
          Past Executives
        </button>
      </div>

      {/* Current */}
      {tab === 'current' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentExecutives.map(e => (
            <ExecutiveCard key={e.id} exec={e} />
          ))}
        </div>
      )}

      {/* Past */}
      {tab === 'past' && (
        <div className="space-y-12">
          {pastExecutives.map(tenure => (
            <div key={tenure.tenure}>
              <h2 className="text-xl font-bold text-fupre-navy mb-4 border-b-2 border-fupre-gold pb-2 inline-block">
                {tenure.tenure} Tenure
              </h2>

              {tenure.members.length === 0 ? (
                <p className="text-gray-500 italic text-sm mt-2">
                  Past executive data coming soon.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  {tenure.members.map(e => (
                    <ExecutiveCard key={e.id} exec={e} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}