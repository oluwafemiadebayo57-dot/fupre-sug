import { Download, FileText, AlertCircle } from 'lucide-react';

// TODO: Upload the real constitution PDF to /public/docs/fupre-sug-constitution.pdf
// Then update this path to "/docs/fupre-sug-constitution.pdf"
const CONSTITUTION_PDF = '/docs/fupre-sug-constitution.pdf';

export default function Constitution() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-fupre-navy mb-2">
        SUG Constitution
      </h1>
      <p className="text-gray-600 mb-8">
        The governing document of the FUPRE Student Union Government.
      </p>

      {/* Download card */}
      <div className="bg-fupre-navy text-white rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
        <FileText size={64} className="text-fupre-gold shrink-0" />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-bold mb-1">
            FUPRE SUG Constitution (As Amended)
          </h2>
          <p className="text-sm text-gray-300">
            Download the full constitution as a PDF document.
          </p>
        </div>
        <a
          href={CONSTITUTION_PDF}
          download
          className="bg-fupre-gold text-fupre-navy px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition flex items-center gap-2 whitespace-nowrap"
        >
          <Download size={18} /> Download PDF
        </a>
      </div>

      {/* Placeholder notice */}
      <div className="bg-yellow-50 border-l-4 border-fupre-gold rounded-lg p-4 text-sm text-yellow-900 flex items-start gap-2 mb-8">
        <AlertCircle size={18} className="mt-0.5 shrink-0" />
        <div>
          <strong>Note to SUG Admin:</strong> Upload the real constitution PDF to{' '}
          <code className="bg-yellow-100 px-1 rounded">
            public/docs/fupre-sug-constitution.pdf
          </code>{' '}
          and the download button above will work automatically.
        </div>
      </div>

      {/* Key sections summary */}
      <h2 className="text-2xl font-bold text-fupre-navy mb-4">
        Key Sections
      </h2>

      <div className="space-y-4">
        {[
          {
            title: "Article I — Name & Motto",
            body: "The Union shall be known as the Federal University of Petroleum Resources, Effurun Student Union Government (FUPRE SUG).",
          },
          {
            title: "Article II — Aims & Objectives",
            body: "To protect the welfare and interests of all students, foster unity, and serve as the bridge between students and management.",
          },
          {
            title: "Article III — Membership",
            body: "Every registered student of FUPRE is automatically a member of the Union.",
          },
          {
            title: "Article IV — Arms of Government",
            body: "The Union consists of three arms: the Executive, the Legislative (Student Representative Council), and the Judicial (headed by the Chief Judge).",
          },
          {
            title: "Article V — Tenure of Office",
            body: "All elected executives shall serve a single term of one academic session, as prescribed by the electoral committee.",
          },
          {
            title: "Article VI — Financial Accountability",
            body: "The Financial Secretary and Treasurer shall publish financial reports to the Student Representative Council. Misuse of funds shall be subject to impeachment.",
          },
        ].map((article, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-fupre-navy">
            <h3 className="font-bold text-fupre-navy mb-1">{article.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{article.body}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-8 italic text-center">
        This is a summary. The full constitution is the authoritative document — download it above.
      </p>
    </div>
  );
}