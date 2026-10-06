import { Link } from 'react-router-dom';
import {
  Users,
  FolderKanban,
  MessageSquare,
  Newspaper,
  Handshake,
  ArrowRight,
  Shield,
  Target,
  Heart,
} from 'lucide-react';
import { newsItems } from '../data/news';
import sugLogo from '../assets/sug-logo.png';

const stats = [
  { label: "Executive Members", value: "11", icon: Users },
  { label: "Active Projects", value: "3+", icon: FolderKanban },
  { label: "Complaint Response", value: "48hrs", icon: Shield },
  { label: "Students Represented", value: "1000s", icon: Heart },
];

const quickLinks = [
  {
    to: "/executives",
    label: "Meet the Executives",
    desc: "Current and past leaders serving FUPRE students.",
    icon: Users,
  },
  {
    to: "/projects",
    label: "Projects & Achievements",
    desc: "See what's ongoing and what's been delivered.",
    icon: FolderKanban,
  },
  {
    to: "/complaints",
    label: "Submit a Complaint",
    desc: "Anonymous. Tracked. Reviewed within 48 hours.",
    icon: MessageSquare,
  },
  {
    to: "/news",
    label: "Latest News",
    desc: "Official announcements from the Union.",
    icon: Newspaper,
  },
];

export default function Home() {
  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-fupre-navy via-fupre-blue to-fupre-navy text-white">
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">

          {/* SUG Logo chip */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-full p-3 md:p-4 shadow-2xl ring-4 ring-fupre-gold/40 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
              <img
                src={sugLogo}
                alt="FUPRE SUG Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>

          <span className="inline-block bg-fupre-gold/20 text-fupre-gold text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full mb-4">
            Team Aurora 2025/2026
          </span>

          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
            The Official Voice of<br />FUPRE Students
          </h1>

          <p className="text-gray-200 max-w-2xl mx-auto mb-8 text-base md:text-lg">
            The Student Union Government of the Federal University of Petroleum
            Resources, Effurun — bridging students and management.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/complaints"
              className="bg-fupre-gold text-fupre-navy px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition inline-flex items-center justify-center gap-2"
            >
              <MessageSquare size={18} /> Submit a Complaint
            </Link>
            <Link
              to="/executives"
              className="bg-white/10 border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition inline-flex items-center justify-center gap-2"
            >
              Meet the Executives <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <s.icon className="mx-auto text-fupre-navy mb-2" size={24} />
              <p className="text-2xl md:text-3xl font-black text-fupre-navy">
                {s.value}
              </p>
              <p className="text-xs md:text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== QUICK LINKS ===== */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-fupre-navy mb-2 text-center">
          What You Can Do Here
        </h2>
        <p className="text-gray-600 text-center mb-10">
          Everything the SUG offers, in one place.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map(q => (
            <Link
              key={q.to}
              to={q.to}
              className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl border border-gray-100 transition hover:-translate-y-1"
            >
              <div className="bg-fupre-navy/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-fupre-navy transition">
                <q.icon className="text-fupre-navy group-hover:text-fupre-gold transition" size={24} />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{q.label}</h3>
              <p className="text-sm text-gray-600">{q.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== MISSION ===== */}
      <section className="bg-fupre-cream border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <Target className="mx-auto text-fupre-navy mb-3" size={32} />
            <h3 className="font-bold text-fupre-navy mb-2">Our Mission</h3>
            <p className="text-sm text-gray-600">
              To protect the welfare and interests of every FUPRE student.
            </p>
          </div>
          <div className="text-center">
            <Shield className="mx-auto text-fupre-navy mb-3" size={32} />
            <h3 className="font-bold text-fupre-navy mb-2">Our Commitment</h3>
            <p className="text-sm text-gray-600">
              Transparency, accountability, and student-first leadership.
            </p>
          </div>
          <div className="text-center">
            <Heart className="mx-auto text-fupre-navy mb-3" size={32} />
            <h3 className="font-bold text-fupre-navy mb-2">Our Promise</h3>
            <p className="text-sm text-gray-600">
              Every complaint is heard. Every project is tracked.
            </p>
          </div>
        </div>
      </section>

      {/* ===== LATEST NEWS ===== */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-fupre-navy mb-1">
              Latest News
            </h2>
            <p className="text-gray-600 text-sm">Straight from the SUG.</p>
          </div>
          <Link
            to="/news"
            className="text-fupre-navy font-semibold hover:text-fupre-gold transition flex items-center gap-1 text-sm"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {newsItems.slice(0, 3).map(item => (
            <Link
              key={item.id}
              to="/news"
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition border border-gray-100"
            >
              <div className="h-2 bg-fupre-gold"></div>
              <div className="p-5">
                <span className="text-xs font-semibold text-fupre-navy bg-fupre-navy/10 px-2 py-1 rounded-full">
                  {item.category}
                </span>
                <h3 className="font-bold text-gray-800 mt-3 mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {item.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== PARTNER CTA ===== */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-fupre-navy to-fupre-blue rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-6">
          <Handshake size={64} className="text-fupre-gold shrink-0" />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-1">
              Interested in Partnering With Us?
            </h2>
            <p className="text-gray-200 text-sm">
              Put your brand in front of thousands of FUPRE students.
            </p>
          </div>
          <Link
            to="/partner"
            className="bg-fupre-gold text-fupre-navy px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition whitespace-nowrap"
          >
            See Packages
          </Link>
        </div>
      </section>
    </div>
  );
}