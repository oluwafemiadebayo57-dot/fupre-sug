import { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Ticket, Loader2, CheckCircle2, X } from 'lucide-react';
import { collection, getDocs, orderBy, query, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Booking State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [booking, setBooking] = useState(false);
  const [ticketCode, setTicketCode] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), orderBy("date", "asc"));
        const querySnapshot = await getDocs(q);
        setEvents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleBookTicket = async (e) => {
    e.preventDefault();
    setBooking(true);
    const code = 'TIX-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
      await addDoc(collection(db, "tickets"), {
        eventId: selectedEvent.id,
        eventTitle: selectedEvent.title,
        studentName,
        phone,
        ticketCode: code,
        status: 'Pending',
        date: new Date().toISOString(),
      });
      setTicketCode(code);
    } catch (error) {
      alert("Error booking ticket. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setStudentName('');
    setPhone('');
    setTicketCode('');
  };

  if (loading) return <div className="min-h-[60vh] flex justify-center items-center"><Loader2 className="animate-spin text-fupre-navy" size={48} /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-fupre-navy mb-2">Upcoming Events</h1>
      <p className="text-gray-600 mb-8">Don't miss out on what's happening around campus.</p>

      {events.length === 0 ? (
        <p className="text-gray-500 italic bg-white p-6 rounded-xl shadow-sm">No upcoming events at the moment.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-100">
              {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="w-full h-52 object-contain bg-gray-100 p-2" />}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-xl text-fupre-navy mb-2 leading-snug">{event.title}</h3>
                <p className="text-gray-600 text-sm flex-1 mb-4">{event.description}</p>
                
                <div className="space-y-2 mb-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2"><CalendarDays size={16} className="text-fupre-gold" /> {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })}</div>
                  <div className="flex items-center gap-2"><MapPin size={16} className="text-fupre-gold" /> {event.location}</div>
                  <div className="flex items-center gap-2 font-semibold text-fupre-navy"><Ticket size={16} className="text-fupre-gold" /> {event.price}</div>
                </div>

                <button onClick={() => setSelectedEvent(event)} className="mt-auto block w-full text-center bg-fupre-navy text-white py-2 rounded-lg font-semibold hover:bg-fupre-light transition">
                  Book Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOOKING MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><X size={24} /></button>
            
            <div className="p-6">
              {ticketCode ? (
                <div className="text-center py-6">
                  <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Pending!</h2>
                  <p className="text-sm text-gray-600 mb-6">Show this code at the SUG office to verify your payment and collect your ticket.</p>
                  
                  <div className="bg-fupre-cream border-2 border-dashed border-fupre-gold rounded-xl p-6 mb-6">
                    <p className="text-xs text-gray-500 uppercase mb-1">Your Ticket Code</p>
                    <p className="text-3xl font-mono font-black text-fupre-navy">{ticketCode}</p>
                  </div>
                  <button onClick={closeModal} className="bg-fupre-navy text-white px-6 py-2 rounded-lg font-semibold">Done</button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-fupre-navy mb-1">Book Event Ticket</h2>
                  <p className="text-sm text-gray-500 mb-4">{selectedEvent.title}</p>
                  
                  <form onSubmit={handleBookTicket} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Full Name</label>
                      <input required value={studentName} onChange={e => setStudentName(e.target.value)} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-fupre-navy" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Phone Number</label>
                      <input required value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-fupre-navy" placeholder="08012345678" />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-xs font-bold text-fupre-navy mb-2 uppercase tracking-wider">Payment Instructions</p>
                      <p className="text-sm text-gray-600 mb-3">Transfer <strong>{selectedEvent.price}</strong> to the account below:</p>
                      <ul className="text-sm space-y-1 text-gray-800 font-medium bg-white p-3 rounded border">
                        <li>Bank: {selectedEvent.bankName || "N/A"}</li>
                        <li>Account No: {selectedEvent.accountNumber || "N/A"}</li>
                        <li>Name: {selectedEvent.accountName || "N/A"}</li>
                      </ul>
                    </div>

                    <button type="submit" disabled={booking} className="w-full bg-fupre-gold text-fupre-navy py-3 rounded-lg font-bold hover:bg-yellow-500 transition">
                      {booking ? <Loader2 className="animate-spin mx-auto" size={20} /> : "I Have Made Payment"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}