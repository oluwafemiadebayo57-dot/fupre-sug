import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Executives from './pages/Executives';
import Projects from './pages/Projects';
import Complaints from './pages/Complaints';
import News from './pages/News';
import Constitution from './pages/Constitution';
import Partner from './pages/Partner';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-fupre-cream">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/executives" element={<Executives />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/news" element={<News />} />
            <Route path="/constitution" element={<Constitution />} />
            <Route path="/partner" element={<Partner />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}