import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, orderBy, query, addDoc } from "firebase/firestore";
import { LogOut, Loader2, CheckCircle2, Shield, MessageSquare, Newspaper, Image as ImageIcon } from 'lucide-react';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  // News Form State
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('Update');
  const [newsExcerpt, setNewsExcerpt] = useState('');
  const [newsBody, setNewsBody] = useState('');
  const [newsImage, setNewsImage] = useState(null); // <-- Added Image State
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email.includes('welfare')) setUserRole('Welfare Director');
        else if (user.email.includes('info')) setUserRole('Information Director');
        else if (user.email.includes('president')) setUserRole('President');
        else setUserRole('Executive Admin');
      } else {
        navigate('/admin');
      }
    });

    const fetchComplaints = async () => {
      try {
        const q = query(collection(db, "complaints"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        setComplaints(querySnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const updateStatus = async (docId, newStatus) => {
    setUpdatingId(docId);
    try {
      await updateDoc(doc(db, "complaints", docId), { status: newStatus });
      setComplaints(prev => prev.map(c => c.docId === docId ? { ...c, status: newStatus } : c));
    } catch (error) {
      alert("Error updating status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePublishNews = async (e) => {
    e.preventDefault();
    setPublishing(true);
    setPublishSuccess(false);

    try {
      let imageUrl = "";

      // 1. Upload image to ImgBB (if selected)
      if (newsImage) {
        const formData = new FormData();
        formData.append("image", newsImage);
        
        // Use the API key from the .env file
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
          method: "POST",
          body: formData,
        });
        
        const data = await response.json();
        
        if (data.success) {
          imageUrl = data.data.url; // Get the live image URL from ImgBB
        } else {
          throw new Error("Image upload failed. Check your API key.");
        }
      }

      // 2. Save text + image URL to Firestore
      await addDoc(collection(db, "news"), {
        title: newsTitle,
        category: newsCategory,
        excerpt: newsExcerpt,
        body: newsBody,
        imageUrl: imageUrl, // Save the ImgBB URL
        date: new Date().toISOString(),
      });
      
      setPublishSuccess(true);
      setNewsTitle('');
      setNewsCategory('Update');
      setNewsExcerpt('');
      setNewsBody('');
      setNewsImage(null);
      
      // Reset the file input visually
      e.target.reset();

      setTimeout(() => setPublishSuccess(false), 3000);
    } catch (error) {
      alert("Error publishing news. Check console.");
      console.error(error);
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex justify-center items-center"><Loader2 className="animate-spin text-fupre-navy" size={48} /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-fupre-navy flex items-center gap-2">
            <Shield className="text-fupre-gold" /> {userRole} Dashboard
          </h1>
          <p className="text-gray-500 text-sm">Logged in as: {auth.currentUser?.email}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 font-semibold hover:bg-red-50 px-4 py-2 rounded-lg transition">
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* NEWS MANAGER - Only for Info Director & President */}
      {(userRole === 'Information Director' || userRole === 'President' || userRole === 'Executive Admin') && (
        <div className="bg-fupre-navy text-white rounded-xl p-6 mb-10 shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Newspaper className="text-fupre-gold" /> Publish Official News
          </h2>
          
          {publishSuccess && (
            <div className="bg-green-500 text-white p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <CheckCircle2 size={16} /> News published successfully! It is now live on the website.
            </div>
          )}

          <form onSubmit={handlePublishNews} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input 
                required 
                value={newsTitle} 
                onChange={e => setNewsTitle(e.target.value)}
                placeholder="News Title (e.g., SUG Week Announced)" 
                className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none"
              />
              <select 
                value={newsCategory} 
                onChange={e => setNewsCategory(e.target.value)}
                className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none"
              >
                <option value="Update">Update</option>
                <option value="Academic">Academic</option>
                <option value="Social">Social</option>
                <option value="Welfare">Welfare</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <input 
              required 
              value={newsExcerpt} 
              onChange={e => setNewsExcerpt(e.target.value)}
              placeholder="Short Excerpt (Shows on the Home page card)" 
              className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none"
            />
            <textarea 
              required 
              rows={4} 
              value={newsBody} 
              onChange={e => setNewsBody(e.target.value)}
              placeholder="Full news article text..." 
              className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none resize-none"
            />
            
            {/* Image Upload Field */}
            <div className="bg-white/10 p-3 rounded-lg border border-white/20">
              <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-fupre-gold">
                <ImageIcon size={16} /> Attach Cover Image (Optional)
              </label>
              <input 
                type="file" 
                accept="image/*"
                onChange={e => setNewsImage(e.target.files[0])}
                className="w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-fupre-gold file:text-fupre-navy hover:file:bg-yellow-500 cursor-pointer"
              />
              <p className="text-xs text-gray-400 mt-2">Keep it under 2MB for fast loading.</p>
            </div>

            <button type="submit" disabled={publishing} className="bg-fupre-gold text-fupre-navy px-6 py-2 rounded-lg font-bold hover:bg-yellow-500 transition flex items-center gap-2">
              {publishing ? <><Loader2 className="animate-spin" size={18} /> Uploading...</> : <><Newspaper size={18} /> Publish News</>}
            </button>
          </form>
        </div>
      )}

      {/* Complaints Manager */}
      <div className="mb-6 flex items-center gap-2">
        <MessageSquare className="text-fupre-navy" />
        <h2 className="text-xl font-bold text-gray-800">Student Complaints</h2>
      </div>

      {complaints.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
          <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-700">All caught up!</h2>
          <p className="text-gray-500">There are no complaints at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {complaints.map(c => (
            <div key={c.docId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">{c.id}</span>
                  <span className="text-xs text-gray-400">{new Date(c.date).toLocaleString()}</span>
                  <span className="text-xs font-semibold bg-fupre-navy/10 text-fupre-navy px-2 py-0.5 rounded-full">{c.category}</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{c.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{c.message}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border min-w-[200px] w-full md:w-auto">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Update Status</p>
                <select 
                  value={c.status}
                  onChange={(e) => updateStatus(c.docId, e.target.value)}
                  disabled={updatingId === c.docId}
                  className={`w-full p-2 rounded-lg font-semibold outline-none border-2 cursor-pointer ${
                    c.status === 'Resolved' ? 'border-green-500 bg-green-50 text-green-700' : 
                    c.status === 'In Progress' ? 'border-blue-500 bg-blue-50 text-blue-700' : 
                    'border-yellow-500 bg-yellow-50 text-yellow-700'
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}