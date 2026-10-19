import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, orderBy, query, addDoc } from "firebase/firestore";
import { LogOut, Loader2, CheckCircle2, Shield, MessageSquare, Newspaper, CalendarDays, Image as ImageIcon, Ticket } from 'lucide-react';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  // --- NEWS STATE ---
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('Update');
  const [newsExcerpt, setNewsExcerpt] = useState('');
  const [newsBody, setNewsBody] = useState('');
  const [newsImage, setNewsImage] = useState(null);
  const [publishingNews, setPublishingNews] = useState(false);
  const [newsSuccess, setNewsSuccess] = useState(false);

  // --- EVENT STATE ---
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventPrice, setEventPrice] = useState('Free');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [eventImage, setEventImage] = useState(null);
  const [publishingEvent, setPublishingEvent] = useState(false);
  const [eventSuccess, setEventSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email.includes('welfare')) setUserRole('Welfare Director');
        else if (user.email.includes('info')) setUserRole('Information Director');
        else if (user.email.includes('president')) setUserRole('President');
        else if (user.email.includes('social')) setUserRole('Social Director');
        else setUserRole('Executive Admin');
      } else {
        navigate('/admin');
      }
    });

    const fetchData = async () => {
      try {
        // Fetch Complaints
        const compQuery = query(collection(db, "complaints"), orderBy("date", "desc"));
        const compSnapshot = await getDocs(compQuery);
        setComplaints(compSnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));

        // Fetch Tickets
        const tickQuery = query(collection(db, "tickets"), orderBy("date", "desc"));
        const tickSnapshot = await getDocs(tickQuery);
        setTickets(tickSnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const updateComplaintStatus = async (docId, newStatus) => {
    setUpdatingId(docId);
    try {
      await updateDoc(doc(db, "complaints", docId), { status: newStatus });
      setComplaints(prev => prev.map(c => c.docId === docId ? { ...c, status: newStatus } : c));
    } catch (error) { alert("Error updating."); } finally { setUpdatingId(null); }
  };

  const verifyTicket = async (docId) => {
    setUpdatingId(docId);
    try {
      await updateDoc(doc(db, "tickets", docId), { status: 'Verified' });
      setTickets(prev => prev.map(t => t.docId === docId ? { ...t, status: 'Verified' } : t));
    } catch (error) { alert("Error verifying ticket."); } finally { setUpdatingId(null); }
  };

  const uploadToImgBB = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, { method: "POST", body: formData });
    const data = await response.json();
    if (data.success) return data.data.url;
    throw new Error("Image upload failed");
  };

  const handlePublishNews = async (e) => {
    e.preventDefault(); setPublishingNews(true); setNewsSuccess(false);
    try {
      const imageUrl = await uploadToImgBB(newsImage);
      await addDoc(collection(db, "news"), { title: newsTitle, category: newsCategory, excerpt: newsExcerpt, body: newsBody, imageUrl, date: new Date().toISOString() });
      setNewsSuccess(true); setNewsTitle(''); setNewsCategory('Update'); setNewsExcerpt(''); setNewsBody(''); setNewsImage(null); e.target.reset();
      setTimeout(() => setNewsSuccess(false), 3000);
    } catch (error) { alert("Error publishing news."); } finally { setPublishingNews(false); }
  };

  const handlePublishEvent = async (e) => {
    e.preventDefault(); setPublishingEvent(true); setEventSuccess(false);
    try {
      const imageUrl = await uploadToImgBB(eventImage);
      await addDoc(collection(db, "events"), { 
        title: eventTitle, date: eventDate, location: eventLocation, description: eventDesc, 
        price: eventPrice, bankName, accountNumber, accountName, imageUrl, createdAt: new Date().toISOString() 
      });
      setEventSuccess(true); setEventTitle(''); setEventDate(''); setEventLocation(''); setEventDesc(''); setEventPrice('Free'); setBankName(''); setAccountNumber(''); setAccountName(''); setEventImage(null); e.target.reset();
      setTimeout(() => setEventSuccess(false), 3000);
    } catch (error) { alert("Error creating event."); } finally { setPublishingEvent(false); }
  };

  if (loading) return <div className="min-h-[60vh] flex justify-center items-center"><Loader2 className="animate-spin text-fupre-navy" size={48} /></div>;

  // Define who gets to see what
  const isPresidentOrAdmin = userRole === 'President' || userRole === 'Executive Admin';
  const canManageNews = userRole === 'Information Director' || isPresidentOrAdmin;
  const canManageEvents = userRole === 'Social Director' || isPresidentOrAdmin;
  const canManageComplaints = userRole === 'Welfare Director' || isPresidentOrAdmin;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-fupre-navy flex items-center gap-2"><Shield className="text-fupre-gold" /> {userRole} Dashboard</h1>
          <p className="text-gray-500 text-sm">Logged in as: {auth.currentUser?.email}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 font-semibold hover:bg-red-50 px-4 py-2 rounded-lg transition"><LogOut size={18} /> Logout</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* NEWS MANAGER (Info Director & President) */}
        {canManageNews && (
          <div className="bg-fupre-navy text-white rounded-xl p-6 shadow-lg h-fit">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Newspaper className="text-fupre-gold" /> Publish Official News</h2>
            {newsSuccess && <div className="bg-green-500 text-white p-3 rounded-lg mb-4 text-sm flex items-center gap-2"><CheckCircle2 size={16} /> News published!</div>}
            <form onSubmit={handlePublishNews} className="space-y-4">
              <input required value={newsTitle} onChange={e => setNewsTitle(e.target.value)} placeholder="News Title" className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none" />
              <select value={newsCategory} onChange={e => setNewsCategory(e.target.value)} className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none">
                <option value="Update">Update</option><option value="Academic">Academic</option><option value="Welfare">Welfare</option><option value="Urgent">Urgent</option>
              </select>
              <input required value={newsExcerpt} onChange={e => setNewsExcerpt(e.target.value)} placeholder="Short Excerpt" className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none" />
              <textarea required rows={3} value={newsBody} onChange={e => setNewsBody(e.target.value)} placeholder="Full news article..." className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none resize-none" />
              <div className="bg-white/10 p-3 rounded-lg border border-white/20">
                <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-fupre-gold"><ImageIcon size={16} /> Attach Image</label>
                <input type="file" accept="image/*" onChange={e => setNewsImage(e.target.files[0])} className="w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-fupre-gold file:text-fupre-navy cursor-pointer" />
              </div>
              <button type="submit" disabled={publishingNews} className="bg-fupre-gold text-fupre-navy px-6 py-2 rounded-lg font-bold hover:bg-yellow-500 transition flex items-center gap-2">
                {publishingNews ? <><Loader2 className="animate-spin" size={18} /> Publishing...</> : <><Newspaper size={18} /> Publish News</>}
              </button>
            </form>
          </div>
        )}

        {/* EVENT MANAGER (Social Director & President) */}
        {canManageEvents && (
          <div className="bg-fupre-blue text-white rounded-xl p-6 shadow-lg h-fit">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CalendarDays className="text-fupre-gold" /> Create Upcoming Event</h2>
            {eventSuccess && <div className="bg-green-500 text-white p-3 rounded-lg mb-4 text-sm flex items-center gap-2"><CheckCircle2 size={16} /> Event created!</div>}
            <form onSubmit={handlePublishEvent} className="space-y-4">
              <input required value={eventTitle} onChange={e => setEventTitle(e.target.value)} placeholder="Event Title" className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input required type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none" />
                <input required value={eventLocation} onChange={e => setEventLocation(e.target.value)} placeholder="Location" className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none" />
              </div>
              <textarea required rows={2} value={eventDesc} onChange={e => setEventDesc(e.target.value)} placeholder="Description..." className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none resize-none" />
              <input required value={eventPrice} onChange={e => setEventPrice(e.target.value)} placeholder="Ticket Price (e.g., Free or ₦2,000)" className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none" />
              
              <div className="bg-white/10 p-3 rounded-lg border border-white/20 space-y-2">
                <p className="text-sm font-semibold text-fupre-gold">Payment Details (For Students)</p>
                <input value={bankName} onChange={e => setBankName(e.target.value)} placeholder="Bank Name (e.g., Access Bank)" className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none" />
                <input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="Account Number" className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none" />
                <input value={accountName} onChange={e => setAccountName(e.target.value)} placeholder="Account Name (e.g., FUPRE SUG)" className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none" />
              </div>

              <div className="bg-white/10 p-3 rounded-lg border border-white/20">
                <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-fupre-gold"><ImageIcon size={16} /> Attach Flyer</label>
                <input type="file" accept="image/*" onChange={e => setEventImage(e.target.files[0])} className="w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-fupre-gold file:text-fupre-navy cursor-pointer" />
              </div>
              <button type="submit" disabled={publishingEvent} className="bg-fupre-gold text-fupre-navy px-6 py-2 rounded-lg font-bold hover:bg-yellow-500 transition flex items-center gap-2">
                {publishingEvent ? <><Loader2 className="animate-spin" size={18} /> Creating...</> : <><CalendarDays size={18} /> Create Event</>}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* TICKET BOOKINGS (Social Director & President) */}
      {canManageEvents && (
        <>
          <div className="mb-6 flex items-center gap-2 border-t pt-8">
            <Ticket className="text-fupre-navy" />
            <h2 className="text-xl font-bold text-gray-800">Ticket Bookings</h2>
          </div>
          {tickets.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl shadow-sm border mb-10"><p className="text-gray-500">No tickets booked yet.</p></div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {tickets.map(t => (
                <div key={t.docId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-fupre-navy">{t.ticketCode}</p>
                    <p className="text-sm font-semibold text-gray-700">{t.studentName}</p>
                    <p className="text-xs text-gray-500">{t.phone} • {t.eventTitle}</p>
                  </div>
                  {t.status === 'Verified' ? (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><CheckCircle2 size={14}/> Verified</span>
                  ) : (
                    <button onClick={() => verifyTicket(t.docId)} disabled={updatingId === t.docId} className="bg-fupre-navy text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-fupre-light transition">
                      Mark Verified
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* COMPLAINTS (Welfare Director & President) */}
      {canManageComplaints && (
        <>
          <div className="mb-6 flex items-center gap-2 border-t pt-8">
            <MessageSquare className="text-fupre-navy" />
            <h2 className="text-xl font-bold text-gray-800">Student Complaints</h2>
          </div>
          {complaints.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl shadow-sm border"><p className="text-gray-500">There are no complaints at the moment.</p></div>
          ) : (
            <div className="grid gap-4">
              {complaints.map(c => (
                <div key={c.docId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">{c.id}</span>
                      <span className="text-xs font-semibold bg-fupre-navy/10 text-fupre-navy px-2 py-0.5 rounded-full">{c.category}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">{c.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{c.message}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border min-w-[200px] w-full md:w-auto">
                    <select value={c.status} onChange={(e) => updateComplaintStatus(c.docId, e.target.value)} disabled={updatingId === c.docId} className={`w-full p-2 rounded-lg font-semibold outline-none border-2 cursor-pointer ${c.status === 'Resolved' ? 'border-green-500 bg-green-50 text-green-700' : c.status === 'In Progress' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-yellow-500 bg-yellow-50 text-yellow-700'}`}>
                      <option value="Pending">Pending</option><option value="In Progress">In Progress</option><option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}