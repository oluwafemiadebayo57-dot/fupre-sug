import { CheckCircle2, Mail, Handshake, TrendingUp } from 'lucide-react';
import { sponsorshipTiers, currentPartners } from '../data/sponsors';

export default function Partner() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Handshake className="mx-auto text-fupre-navy mb-3" size={48} />
        <h1 className="text-3xl md:text-4xl font-bold text-fupre-navy mb-3">
          Partner With FUPRE SUG
        </h1>
        <p className="text-gray-600">
          Reach thousands of engaged FUPRE students. Sponsor the Student Union Government
          and put your brand in front of the next generation of engineers, scientists, and leaders.
        </p>
      </div>

      {/* Why partner */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <TrendingUp className="mx-auto text-fupre-navy mb-3" size={32} />
          <h3 className="font-bold text-gray-800 mb-1">Direct Access</h3>
          <p className="text-sm text-gray-600">
            Reach thousands of students through the official SUG website and events.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Handshake className="mx-auto text-fupre-navy mb-3" size={32} />
          <h3 className="font-bold text-gray-800 mb-1">Long-Term Visibility</h3>
          <p className="text-sm text-gray-600">
            Your brand stays visible for the full academic session — not just one event.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <CheckCircle2 className="mx-auto text-fupre-navy mb-3" size={32} />
          <h3 className="font-bold text-gray-800 mb-1">Trusted Platform</h3>
          <p className="text-sm text-gray-600">
            Align your brand with the official student body of FUPRE.
          </p>
        </div>
      </div>

      {/* Tiers */}
      <h2 className="text-2xl font-bold text-fupre-navy mb-6 text-center">
        Sponsorship Packages
      </h2>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {sponsorshipTiers.map(tier => (
          <div
            key={tier.id}
            className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 transition hover:shadow-2xl ${
              tier.featured ? 'border-fupre-gold scale-105' : 'border-transparent'
            }`}
          >
            {tier.featured && (
              <div className="bg-fupre-gold text-fupre-navy text-xs font-bold text-center py-1 uppercase tracking-wider">
                Most Popular
              </div>
            )}

            <div className={`bg-gradient-to-br ${tier.color} text-white p-6`}>
              <h3 className="font-bold text-xl mb-1">{tier.name}</h3>
              <p className="text-3xl font-black mb-1">{tier.price}</p>
              <p className="text-xs opacity-90">{tier.duration}</p>
            </div>

            <div className="p-6">
              <ul className="space-y-3 mb-6">
                {tier.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 size={16} className="text-fupre-navy mt-0.5 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <a
                href="mailto:sug@fupre.edu.ng?subject=Partnership%20Inquiry"
                className={`block text-center py-3 rounded-lg font-semibold transition ${
                  tier.featured
                    ? 'bg-fupre-gold text-fupre-navy hover:bg-yellow-500'
                    : 'bg-fupre-navy text-white hover:bg-fupre-light'
                }`}
              >
                Become a Partner
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Current partners */}
      {currentPartners.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-fupre-navy mb-6 text-center">
            Our Partners
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {currentPartners.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center">
                <img src={p.logo} alt={p.name} className="max-h-16 object-contain" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact CTA */}
      <div className="bg-fupre-navy text-white rounded-2xl p-8 text-center">
        <Mail className="mx-auto mb-3 text-fupre-gold" size={36} />
        <h3 className="text-xl font-bold mb-2">Ready to partner with us?</h3>
        <p className="text-gray-300 text-sm mb-4">
          Reach out to discuss a custom package that fits your brand.
        </p>
        <a
          href="mailto:sug@fupre.edu.ng?subject=Partnership%20Inquiry"
          className="inline-block bg-fupre-gold text-fupre-navy px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}