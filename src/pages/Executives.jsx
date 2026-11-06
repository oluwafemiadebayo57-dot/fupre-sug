import { useState, useEffect } from 'react';
import { Mail, User, MessageCircle, Loader2, Landmark, Scale, Gavel } from 'lucide-react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function ExecutiveCard({ exec }) {
  const [imgError, setImgError] = useState(false);
  const showPhoto = exec.photo && !imgError;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">
      <div className="h-64 bg-gradient-to-br from-fupre-navy to-fupre-light flex items-center justify-center relative">
        {showPhoto ? (
          <img src={exec.photo} alt={exec.name} className="w-full h-full object-cover object-top" onError={() => setImgError(true)} />
        ) : (
          <User size={72} className="text-white/50" />
        )}
        <span className="absolute bottom-2 left-2 bg-fupre-gold text-fupre-navy text-xs font-bold px-3 py-1 rounded-full shadow">
          {exec.position}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-base text-gray-800 leading-snug">{exec.name}</h3>
        {exec.level && exec.department && (
          <p className="text-xs text-gray-500 mt-1">{exec.level} — {exec.department}</p>
        )}
        <div className="flex items-center gap-4 mt-auto pt-3">
          {exec.email && (
            <a href={`mailto:${exec.email}`} className="text-fupre-navy hover:text-fupre-gold text-xs flex items-center gap-1 font-medium transition">
              <Mail size={14} /> Email
            </a>
          )}
          {exec.whatsapp && (
            <a href={`https://wa.me/${exec.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 text-xs flex items-center gap-1 font-medium transition">
              <MessageCircle size={14} /> WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Executives() {
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "executives"));
        setExecutives(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching executives:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExecutives();
  }, []);

  if (loading) return <div className="min-h-[60vh] flex justify-center items-center"><Loader2 className="animate-spin text-fupre-navy" size={48} /></div>;

  const currentExecs = executives.filter(e => e.isCurrent === true);
  const pastExecs = executives.filter(e => e.isCurrent === false);

  // Group current executives by their official Arm of Government
  // (Includes fallbacks in case old data was saved as just "Executive" etc.)
  const executiveArm = currentExecs.filter(e => e.arm === 'Student Executive Council' || e.arm === 'Executive');
  const legislativeArm = currentExecs.filter(e => e.arm === 'Students Senate House' || e.arm === 'Legislative');
  const judicialArm = currentExecs.filter(e => e.arm === 'Students Judiciary Council' || e.arm === 'Judicial');

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-fupre-navy mb-2">SUG Leadership</h1>
      <p className="text-gray-600 mb-10">Meet the leaders serving the FUPRE student body.</p>

      {/* CURRENT EXECUTIVES */}
      {currentExecs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
          <p className="text-gray-500">Executive data is currently being updated. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Student Executive Council */}
          {executiveArm.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6 border-b pb-2">
                <Landmark className="text-fupre-gold" size={24} />
                <h2 className="text-2xl font-bold text-fupre-navy">Student Executive Council (SEC)</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {executiveArm.map(e => <ExecutiveCard key={e.id} exec={e} />)}
              </div>
            </div>
          )}

          {/* Students Senate House */}
          {legislativeArm.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6 border-b pb-2">
                <Scale className="text-fupre-gold" size={24} />
                <h2 className="text-2xl font-bold text-fupre-navy">Students Senate House (SSH)</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {legislativeArm.map(e => <ExecutiveCard key={e.id} exec={e} />)}
              </div>
            </div>
          )}

          {/* Students Judiciary Council */}
          {judicialArm.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6 border-b pb-2">
                <Gavel className="text-fupre-gold" size={24} />
                <h2 className="text-2xl font-bold text-fupre-navy">Students Judiciary Council (SJC)</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {judicialArm.map(e => <ExecutiveCard key={e.id} exec={e} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PAST EXECUTIVES */}
      {pastExecs.length > 0 && (
        <div className="mt-20 border-t pt-10">
          <h2 className="text-2xl font-bold text-fupre-navy mb-6">Past Executives Archive</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 opacity-75 grayscale hover:grayscale-0 transition duration-500">
            {pastExecs.map(e => (
              <div key={e.id} className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                   {e.photo ? <img src={e.photo} className="w-full h-full object-cover" /> : <User size={24} className="m-auto mt-3 text-gray-400" />}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm leading-tight">{e.name}</p>
                  <p className="text-xs text-fupre-navy font-semibold">{e.position}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{e.tenure} Tenure</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}