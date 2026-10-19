import { useState, useEffect } from 'react';
import { Calendar, Tag, ArrowLeft, Loader2 } from 'lucide-react';
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

function NewsCard({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow text-left border border-gray-100 flex flex-col"
    >
      {/* 👇 FIXED: object-contain + bg-gray-100 👇 */}
      {item.imageUrl && (
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-48 object-contain bg-gray-100 p-2" 
        />
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span className="bg-fupre-navy/10 text-fupre-navy px-2 py-1 rounded-full font-semibold flex items-center gap-1">
            <Tag size={12} /> {item.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {new Date(item.date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>

        <h3 className="font-bold text-lg text-gray-800 mb-2 leading-snug">
          {item.title}
        </h3>
        <p className="text-sm text-gray-600 flex-1 leading-relaxed line-clamp-3">
          {item.excerpt}
        </p>
        <span className="text-fupre-navy font-semibold text-sm mt-3 hover:text-fupre-gold transition">
          Read more →
        </span>
      </div>
    </button>
  );
}

export default function News() {
  const [selected, setSelected] = useState(null);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(collection(db, "news"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        setNewsItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return <div className="min-h-[60vh] flex justify-center items-center"><Loader2 className="animate-spin text-fupre-navy" size={48} /></div>;
  }

  // ===== DETAIL VIEW =====
  if (selected) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-fupre-navy font-semibold mb-6 hover:text-fupre-gold transition"
        >
          <ArrowLeft size={18} /> Back to News
        </button>

        <article className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* 👇 FIXED: object-contain + bg-gray-100 👇 */}
          {selected.imageUrl && (
            <img 
              src={selected.imageUrl} 
              alt={selected.title} 
              className="w-full max-h-[500px] object-contain bg-gray-100" 
            />
          )}

          <div className="p-8">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <span className="bg-fupre-navy/10 text-fupre-navy px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                <Tag size={12} /> {selected.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(selected.date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-fupre-navy mb-4 leading-snug">
              {selected.title}
            </h1>

            <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
              {selected.body}
            </div>
          </div>
        </article>
      </div>
    );
  }

  // ===== LIST VIEW =====
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-fupre-navy mb-2">
        News & Announcements
      </h1>
      <p className="text-gray-600 mb-8">
        Official updates from the FUPRE Student Union Government.
      </p>

      {newsItems.length === 0 ? (
        <p className="text-gray-500 italic bg-white p-6 rounded-xl shadow-sm">No news has been published yet. Please check back later.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map(item => (
            <NewsCard
              key={item.id}
              item={item}
              onClick={() => setSelected(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}