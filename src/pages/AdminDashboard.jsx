import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { LogOut, Loader2, CheckCircle2, Shield, MessageSquare, Newspaper } from 'lucide-react';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check who is logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email.includes('welfare')) setUserRole('Welfare Director');
        else if (user.email.includes('info')) setUserRole('Information Director');
        else if (user.email.includes('president')) setUserRole('President');
        else setUserRole('Executive Admin');
      } else {
        navigate('/admin'); // Kick them out if not logged in
      }
    });

    // 2. Fetch complaints
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

      {/* Info Director specific view */}
      {(userRole === 'Information Director' || userRole === 'President') && (
        <div className="bg-fupre-navy text-white rounded-xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">News & Announcements Manager</h2>
            <p className="text-sm text-gray-300">Publish official updates to the student body.</p>
          </div>
          <button className="bg-fupre-gold text-fupre-navy px-4 py-2 rounded-lg font-bold hover:bg-yellow-500 flex items-center gap-2">
            <Newspaper size={18} /> Create New Post (Coming Soon)
          </button>
        </div>
      )}

      {/* Complaints view for everyone, but heavily prioritized for Welfare */}
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

              {/* Status Box */}
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