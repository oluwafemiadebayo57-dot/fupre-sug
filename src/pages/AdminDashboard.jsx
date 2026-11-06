import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, orderBy, query, addDoc, where } from "firebase/firestore";
import { 
  LogOut, Loader2, CheckCircle2, Shield, MessageSquare, Newspaper, 
  CalendarDays, Image as ImageIcon, Ticket, UserPlus, Archive, 
  FolderKanban, Handshake 
} from 'lucide-react';

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

  // --- EXECUTIVE STATE ---
  const [execName, setExecName] = useState('');
  const [execPosition, setExecPosition] = useState('');
  const [execArm, setExecArm] = useState('Student Executive Council');
  const [execLevel, setExecLevel] = useState('');
  const [execDept, setExecDept] = useState('');
  const [execWhatsapp, setExecWhatsapp] = useState('');
  const [execEmail, setExecEmail] = useState('');
  const [execImage, setExecImage] = useState(null);
  const [publishingExec, setPublishingExec] = useState(false);
  const [execSuccess, setExecSuccess] = useState(false);
  const [archiving, setArchiving] = useState(false);

  // --- PROJECT STATE ---
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projStatus, setProjStatus] = useState('Ongoing');
  const [projProgress, setProjProgress] = useState(0);
  const [projImage1, setProjImage1] = useState(null);
  const [projImage2, setProjImage2] = useState(null);
  const [publishingProj, setPublishingProj] = useState(false);
  const [projSuccess, setProjSuccess] = useState(false);

  // --- PARTNER STATE ---
  const [partnerName, setPartnerName] = useState('');
  const [partnerLink, setPartnerLink] = useState('');
  const [partnerTier, setPartnerTier] = useState('Bronze');
  const [partnerLogo, setPartnerLogo] = useState(null);
  const [publishingPartner, setPublishingPartner] = useState(false);
  const [partnerSuccess, setPartnerSuccess] = useState(false);

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
        const compQuery = query(collection(db, "complaints"), orderBy("date", "desc"));
        const compSnapshot = await getDocs(compQuery);
        setComplaints(compSnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() })));

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

  const handleAddExecutive = async (e) => {
    e.preventDefault(); setPublishingExec(true); setExecSuccess(false);
    try {
      const imageUrl = await uploadToImgBB(execImage);
      await addDoc(collection(db, "executives"), { 
        name: execName, position: execPosition, arm: execArm, level: execLevel, 
        department: execDept, whatsapp: execWhatsapp, email: execEmail, photo: imageUrl,
        isCurrent: true, tenure: "2025/2026" 
      });
      setExecSuccess(true); setExecName(''); setExecPosition(''); setExecArm('Student Executive Council'); setExecLevel(''); setExecDept(''); setExecWhatsapp(''); setExecEmail(''); setExecImage(null); e.target.reset();
      setTimeout(() => setExecSuccess(false), 3000);
    } catch (error) { alert("Error adding executive."); } finally { setPublishingExec(false); }
  };

  const handlePublishProject = async (e) => {
    e.preventDefault(); setPublishingProj(true); setProjSuccess(false);
    try {
      const img1Url = await uploadToImgBB(projImage1);
      const img2Url = await uploadToImgBB(projImage2);

      await addDoc(collection(db, "projects"), {
        title: projTitle, description: projDesc, status: projStatus,
        progress: projStatus === 'Ongoing' ? Number(projProgress) : 100,
        image1: img1Url, image2: img2Url, date: new Date().toISOString()
      });

      setProjSuccess(true); setProjTitle(''); setProjDesc(''); setProjStatus('Ongoing'); setProjProgress(0); setProjImage1(null); setProjImage2(null); e.target.reset();
      setTimeout(() => setProjSuccess(false), 3000);
    } catch (error) { alert("Error creating project."); } finally { setPublishingProj(false); }
  };

  const handleAddPartner = async (e) => {
    e.preventDefault(); setPublishingPartner(true); setPartnerSuccess(false);
    try {
      const logoUrl = await uploadToImgBB(partnerLogo);
      await addDoc(collection(db, "partners"), { 
        name: partnerName, link: partnerLink, tier: partnerTier, logo: logoUrl, date: new Date().toISOString()
      });
      setPartnerSuccess(true); setPartnerName(''); setPartnerLink(''); setPartnerTier('Bronze'); setPartnerLogo(null); e.target.reset();
      setTimeout(() => setPartnerSuccess(false), 3000);
    } catch (error) { alert("Error adding partner."); } finally { setPublishingPartner(false); }
  };

  const handleArchiveTenure = async () => {
    if (!window.confirm("Are you sure? This will move all CURRENT executives to the Past Executives archive.")) return;
    setArchiving(true);
    try {
      const q = query(collection(db, "executives"), where("isCurrent", "==", true));
      const snapshot = await getDocs(q);
      const updates = snapshot.docs.map(execDoc => updateDoc(doc(db, "executives", execDoc.id), { isCurrent: false }));
      await Promise.all(updates);
      alert("Tenure Archived Successfully!");
    } catch (error) { alert("Error archiving tenure."); } finally { setArchiving(false); }
  };

  if (loading) return <div className="min-h-[60vh] flex justify-center items-center"><Loader2 className="animate-spin text-fupre-navy" size={48} /></div>;

  const isPresidentOrAdmin = userRole === 'President' || userRole === 'Executive Admin';
  const canManageNews = userRole === 'Information Director' || isPresidentOrAdmin;
  const canManageEvents = userRole === 'Social Director' || isPresidentOrAdmin;
  const canManageComplaints = userRole === 'Welfare Director' || isPresidentOrAdmin;
  const canManageExecutives = userRole === 'Information Director' || isPresidentOrAdmin;
  const canManageProjects = userRole === 'Information Director' || isPresidentOrAdmin;
  const canManagePartners = userRole === 'Information Director' || isPresidentOrAdmin;

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
        {/* NEWS MANAGER */}
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

        {/* EVENT MANAGER */}
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
                <p className="text-sm font-semibold text-fupre-gold">Payment Details</p>
                <input value={bankName} onChange={e => setBankName(e.target.value)} placeholder="Bank Name" className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none" />
                <input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="Account Number" className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none" />
                <input value={accountName} onChange={e => setAccountName(e.target.value)} placeholder="Account Name" className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none" />
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

        {/* EXECUTIVE MANAGER */}
        {canManageExecutives && (
          <div className="bg-gray-800 text-white rounded-xl p-6 shadow-lg h-fit">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><UserPlus className="text-fupre-gold" /> Add Executive</h2>
              <button onClick={handleArchiveTenure} disabled={archiving} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition flex items-center gap-2">
                {archiving ? <Loader2 className="animate-spin" size={14} /> : <><Archive size={14} /> Archive Tenure</>}
              </button>
            </div>
            {execSuccess && <div className="bg-green-500 text-white p-3 rounded-lg mb-4 text-sm flex items-center gap-2"><CheckCircle2 size={16} /> Added!</div>}
            <form onSubmit={handleAddExecutive} className="grid grid-cols-2 gap-3 text-sm">
              <input required value={execName} onChange={e => setExecName(e.target.value)} placeholder="Full Name" className="col-span-2 bg-white text-gray-900 rounded-lg px-3 py-2 outline-none" />
              <input required value={execPosition} onChange={e => setExecPosition(e.target.value)} placeholder="Position" className="bg-white text-gray-900 rounded-lg px-3 py-2 outline-none" />
              <select value={execArm} onChange={e => setExecArm(e.target.value)} className="bg-white text-gray-900 rounded-lg px-3 py-2 outline-none">
                <option value="Student Executive Council">Student Executive Council</option>
                <option value="Students Senate House">Students Senate House</option>
                <option value="Students Judiciary Council">Students Judiciary Council</option>
              </select>
              <input value={execLevel} onChange={e => setExecLevel(e.target.value)} placeholder="Level (400L)" className="bg-white text-gray-900 rounded-lg px-3 py-2 outline-none" />
              <input value={execDept} onChange={e => setExecDept(e.target.value)} placeholder="Department" className="bg-white text-gray-900 rounded-lg px-3 py-2 outline-none" />
              <input value={execWhatsapp} onChange={e => setExecWhatsapp(e.target.value)} placeholder="WhatsApp (23480...)" className="col-span-2 bg-white text-gray-900 rounded-lg px-3 py-2 outline-none" />
              
              <div className="col-span-2 bg-white/10 p-2 rounded-lg border border-white/20">
                <input type="file" accept="image/*" onChange={e => setExecImage(e.target.files[0])} className="w-full text-xs text-gray-200 file:py-1 file:px-2 file:rounded file:border-0 file:bg-fupre-gold file:text-fupre-navy cursor-pointer" />
              </div>
              <button type="submit" disabled={publishingExec} className="col-span-2 bg-fupre-gold text-fupre-navy py-2 rounded-lg font-bold hover:bg-yellow-500 transition flex justify-center items-center gap-2">
                {publishingExec ? <Loader2 className="animate-spin" size={16} /> : "Add Executive"}
              </button>
            </form>
          </div>
        )}

        {/* PROJECT MANAGER */}
        {canManageProjects && (
          <div className="bg-fupre-navy text-white rounded-xl p-6 shadow-lg h-fit">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FolderKanban className="text-fupre-gold" /> Add New Project</h2>
            {projSuccess && <div className="bg-green-500 text-white p-3 rounded-lg mb-4 text-sm flex items-center gap-2"><CheckCircle2 size={16} /> Project added!</div>}
            <form onSubmit={handlePublishProject} className="space-y-4">
              <input required value={projTitle} onChange={e => setProjTitle(e.target.value)} placeholder="Project Title" className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none" />
              <textarea required rows={3} value={projDesc} onChange={e => setProjDesc(e.target.value)} placeholder="Project Description..." className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none resize-none" />
              
              <div className="grid grid-cols-2 gap-4">
                <select value={projStatus} onChange={e => setProjStatus(e.target.value)} className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none">
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
                {projStatus === 'Ongoing' && (
                  <input type="number" min="0" max="100" required value={projProgress} onChange={e => setProjProgress(e.target.value)} placeholder="Progress %" className="w-full bg-white text-gray-900 rounded-lg px-3 py-2 outline-none" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 bg-white/10 p-3 rounded-lg border border-white/20">
                <div>
                  <label className="text-xs font-semibold text-fupre-gold mb-1 block">Image 1 (Main)</label>
                  <input type="file" accept="image/*" onChange={e => setProjImage1(e.target.files[0])} className="w-full text-xs text-gray-200 file:py-1 file:px-2 file:rounded file:border-0 file:bg-fupre-gold file:text-fupre-navy cursor-pointer" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-fupre-gold mb-1 block">Image 2 (Optional)</label>
                  <input type="file" accept="image/*" onChange={e => setProjImage2(e.target.files[0])} className="w-full text-xs text-gray-200 file:py-1 file:px-2 file:rounded file:border-0 file:bg-fupre-gold file:text-fupre-navy cursor-pointer" />
                </div>
              </div>

              <button type="submit" disabled={publishingProj} className="w-full bg-fupre-gold text-fupre-navy px-6 py-2 rounded-lg font-bold hover:bg-yellow-500 transition flex justify-center items-center gap-2">
                {publishingProj ? <><Loader2 className="animate-spin" size={18} /> Uploading...</> : <><FolderKanban size={18} /> Publish Project</>}
              </button>
            </form>
          </div>
        )}

        {/* PARTNER MANAGER */}
        {canManagePartners && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg h-fit">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-fupre-navy"><Handshake className="text-fupre-gold" /> Add Sponsor / Partner</h2>
            {partnerSuccess && <div className="bg-green-500 text-white p-3 rounded-lg mb-4 text-sm flex items-center gap-2"><CheckCircle2 size={16} /> Partner added!</div>}
            <form onSubmit={handleAddPartner} className="space-y-4">
              <input required value={partnerName} onChange={e => setPartnerName(e.target.value)} placeholder="Company Name" className="w-full border rounded-lg px-3 py-2 outline-none focus:border-fupre-navy" />
              <input required value={partnerLink} onChange={e => setPartnerLink(e.target.value)} placeholder="Website Link (https://...)" className="w-full border rounded-lg px-3 py-2 outline-none focus:border-fupre-navy" />
              <select value={partnerTier} onChange={e => setPartnerTier(e.target.value)} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-fupre-navy bg-white">
                <option value="Bronze">Bronze Partner</option>
                <option value="Silver">Silver Partner</option>
                <option value="Gold">Gold Partner</option>
              </select>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700"><ImageIcon size={16} /> Upload Logo</label>
                <input type="file" accept="image/*" onChange={e => setPartnerLogo(e.target.files[0])} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-fupre-navy file:text-white cursor-pointer" />
              </div>
              <button type="submit" disabled={publishingPartner} className="w-full bg-fupre-navy text-white px-6 py-2 rounded-lg font-bold hover:bg-fupre-light transition flex justify-center items-center gap-2">
                {publishingPartner ? <><Loader2 className="animate-spin" size={18} /> Uploading...</> : "Add Partner"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* TICKET BOOKINGS */}
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

      {/* COMPLAINTS */}
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