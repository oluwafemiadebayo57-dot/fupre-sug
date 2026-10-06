import { useState } from 'react';
import { Send, Search, CheckCircle2, AlertCircle, Clock, Shield } from 'lucide-react';

const CATEGORIES = [
  'Academic',
  'Hostel / Welfare',
  'Infrastructure',
  'Security',
  'Finance / Dues',
  'Other',
];

export default function Complaints() {
  const [form, setForm] = useState({
    title: '',
    category: 'Academic',
    message: '',
    anonymous: true,
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = 'SUG-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const complaint = {
      ...form,
      id,
      date: new Date().toISOString(),
      status: 'Pending',
    };

    // TODO: Replace with backend API call (Firebase) after approval
    const existing = JSON.parse(localStorage.getItem('fupre_complaints') || '[]');
    existing.push(complaint);
    localStorage.setItem('fupre_complaints', JSON.stringify(existing));

    setTicketId(id);
    setSubmitted(true);
  };

  const handleSearch = () => {
    if (!searchId.trim()) return;
    const existing = JSON.parse(localStorage.getItem('fupre_complaints') || '[]');
    const found = existing.find(
      c => c.id.toLowerCase() === searchId.trim().toLowerCase()
    );
    setSearchResult(found || 'notfound');
  };

  const resetForm = () => {
    setForm({ title: '', category: 'Academic', message: '', anonymous: true });
    setSubmitted(false);
    setTicketId('');
  };

  // ===== SUCCESS SCREEN =====
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <CheckCircle2 className="mx-auto text-green-600 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-fupre-navy mb-2">
            Complaint Submitted
          </h2>
          <p className="text-gray-600 mb-6">
            Your complaint has been received. Save this ID to track its status:
          </p>

          <div className="bg-fupre-cream border-2 border-dashed border-fupre-gold rounded-xl p-6 mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Your Tracking ID
            </p>
            <p className="text-3xl font-mono font-black text-fupre-navy">
              {ticketId}
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 text-left mb-6">
            <AlertCircle size={16} className="inline mr-1" />
            <strong>Screenshot or write this ID down.</strong> You'll need it to
            check your complaint's status.
          </div>

          <button
            onClick={resetForm}
            className="text-fupre-navy font-semibold hover:text-fupre-gold underline"
          >
            Submit another complaint
          </button>
        </div>
      </div>
    );
  }

  // ===== MAIN PAGE =====
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-fupre-navy mb-2">
        Student Complaints
      </h1>
      <p className="text-gray-600 mb-8">
        Your voice matters. Submit complaints anonymously or with your identity —
        every issue is reviewed.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ============ FORM ============ */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-6 space-y-5 h-fit"
        >
          <div className="flex items-center gap-2 text-fupre-navy border-b pb-3">
            <Send size={20} />
            <h2 className="font-bold text-lg">Submit a Complaint</h2>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fupre-navy focus:border-transparent outline-none"
              placeholder="Brief title of the issue"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category
            </label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fupre-navy focus:border-transparent outline-none bg-white"
            >
              {CATEGORIES.map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Details <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fupre-navy focus:border-transparent outline-none resize-none"
              placeholder="Describe the issue in detail..."
            />
          </div>

          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.anonymous}
              onChange={e => setForm({ ...form, anonymous: e.target.checked })}
              className="mt-1 accent-fupre-navy"
            />
            <span className="text-gray-700">
              <strong>Submit anonymously</strong>
              <span className="block text-xs text-gray-500">
                Your name won't be attached to this complaint.
              </span>
            </span>
          </label>

          <button
            type="submit"
            className="w-full bg-fupre-navy text-white py-3 rounded-lg font-semibold hover:bg-fupre-light transition flex items-center justify-center gap-2"
          >
            <Send size={18} /> Submit Complaint
          </button>
        </form>

        {/* ============ TRACKER ============ */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 text-fupre-navy border-b pb-3 mb-4">
              <Search size={20} />
              <h2 className="font-bold text-lg">Track a Complaint</h2>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fupre-navy focus:border-transparent outline-none"
                placeholder="e.g. SUG-A1B2C3"
              />
              <button
                onClick={handleSearch}
                className="bg-fupre-gold text-fupre-navy px-5 rounded-lg font-semibold hover:bg-yellow-500 transition"
              >
                Track
              </button>
            </div>

            {searchResult === 'notfound' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-center gap-2">
                <AlertCircle size={16} />
                No complaint found with that ID on this device.
              </div>
            )}

            {searchResult && searchResult !== 'notfound' && (
              <div className="bg-fupre-cream rounded-lg p-4 space-y-2 text-sm">
                <p><span className="font-semibold text-gray-700">ID:</span> <span className="font-mono">{searchResult.id}</span></p>
                <p><span className="font-semibold text-gray-700">Title:</span> {searchResult.title}</p>
                <p><span className="font-semibold text-gray-700">Category:</span> {searchResult.category}</p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Status:</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                    <Clock size={12} /> {searchResult.status}
                  </span>
                </p>
                <p className="text-gray-500 text-xs">
                  Submitted: {new Date(searchResult.date).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Info card */}
          <div className="bg-fupre-navy text-white rounded-xl p-6">
            <Shield className="text-fupre-gold mb-3" size={28} />
            <h3 className="font-bold text-lg mb-2">Your Privacy is Protected</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Anonymous complaints cannot be traced back to you. The SUG Welfare
              Director reviews every submission and forwards valid issues to
              management.
            </p>
          </div>

          {/* Info card 2 */}
          <div className="bg-white border-l-4 border-fupre-gold rounded-lg p-4 text-sm">
            <p className="font-semibold text-fupre-navy mb-1">What happens next?</p>
            <ul className="text-gray-600 space-y-1 list-disc list-inside">
              <li>Complaint is logged with a unique ID</li>
              <li>Welfare Director reviews within 48 hours</li>
              <li>Status updates as action is taken</li>
              <li>Serious issues escalate to management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}