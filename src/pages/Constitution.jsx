import { Download, FileText } from 'lucide-react';

// The actual PDF should be placed in the public/docs folder
const CONSTITUTION_PDF = '/docs/fupre-sug-constitution.pdf';

export default function Constitution() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-fupre-navy mb-2">
        SUG Constitution
      </h1>
      <p className="text-gray-600 mb-8">
        The governing document of the FUPRE Student Union Government. Reviewed and Adopted on 12th July 2024 by the 12th Student Senate House of Assembly.
      </p>

      {/* Download card */}
      <div className="bg-fupre-navy text-white rounded-2xl p-8 mb-10 flex flex-col md:flex-row items-center gap-6 shadow-lg">
        <FileText size={64} className="text-fupre-gold shrink-0" />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-bold mb-1">
            FUPRE SUG Constitution (2024 Review)
          </h2>
          <p className="text-sm text-gray-300">
            Download the full, reviewed constitution as a PDF document.
          </p>
        </div>
        <a
          href={CONSTITUTION_PDF}
          download
          className="bg-fupre-gold text-fupre-navy px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition flex items-center gap-2 whitespace-nowrap shadow-md"
        >
          <Download size={18} /> Download PDF
        </a>
      </div>

      {/* Key Articles Summary */}
      <h2 className="text-2xl font-bold text-fupre-navy mb-6">
        Summary of Key Articles
      </h2>

      <div className="space-y-4">
        {[
          {
            title: "Article I — Introduction",
            body: "Defines the Union as the Students Union Government, FUPRE. Outlines the philosophy, vision, and mission of the Union, which includes protecting the interest of students and promoting peace, goodwill, and unity.",
          },
          {
            title: "Article II — Membership",
            body: "Composition consists of all registered full-time students. Also outlines Honorary Members and Patrons/Matrons, along with their specific rights, privileges, and bereavement support for members.",
          },
          {
            title: "Article III — Organs of the Union",
            body: "Establishes the four main organs: The Students Executive Council (SEC), The Student Senate House (SSH - Legislative), The Students Judiciary Council (SJC), and The General Students Congress (GSC). The tenure of office is one academic session.",
          },
          {
            title: "Article III (Cont.) — Forfeiture & Removal",
            body: "Details the rules for the forfeiture of seats (e.g., missing two consecutive sittings without permission) and the process for suspension, resignation, or removal of officers via a vote of no confidence.",
          },
          {
            title: "Article IV — Standing Committees",
            body: "Establishes committees such as Information, Sports, Social, Welfare, Academic, and the Budget Implementation Committee to assist in the effective running of the Union.",
          },
          {
            title: "Article V — General Election",
            body: "Governs the conduct of elections, the establishment of the Independent Students' Electoral Commission (ISEC), qualifications for aspirants, and the swearing-in/handover process.",
          },
          {
            title: "Article VI — Finance",
            body: "Outlines the assets and liabilities of the Union. Mandates that all funds be deposited in the Union's account. Signatories include the President, Director of Finance, and the Dean of Students' Affairs.",
          },
          {
            title: "Article VII — Affiliated Clubs & Societies",
            body: "Sets the requirements for clubs and societies to be affiliated with the Union, including submitting their constitution and paying registration fees.",
          },
          {
            title: "Article VIII — Constitution Amendment",
            body: "States the conditions for amending the constitution, requiring a two-thirds majority of the Student Senate House and a minimum duration of ten years between amendments.",
          },
          {
            title: "Article X — 2023/2024 Bills Passed",
            body: "Highlights newly enacted laws including the Students' Loan Scheme, Anti-Discrimination/Anti-Bullying Policy, Compulsory Leadership Training, FUPRE Research Fund, and the Class Representative Succession Act.",
          },
        ].map((article, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-fupre-navy">
            <h3 className="font-bold text-fupre-navy mb-1">{article.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{article.body}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-8 italic text-center">
        This is a summary for quick reading. The downloaded PDF remains the authoritative legal document of the FUPRE SUG.
      </p>
    </div>
  );
}