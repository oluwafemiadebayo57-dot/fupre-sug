import { useState, useEffect } from 'react';
import { Calendar, Tag, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

function ProjectCard({ project, isAchievement }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">
      <div className={`h-2 ${isAchievement ? 'bg-fupre-gold' : 'bg-fupre-navy'}`}></div>

      {/* Image Gallery (Supports 1 or 2 images) */}
      <div className="flex h-48 bg-gray-100">
        {project.image1 ? (
          <img src={project.image1} alt={project.title} className={`w-full h-full object-cover ${project.image2 ? 'w-1/2 border-r border-white' : ''}`} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">No Image</div>
        )}
        
        {project.image2 && (
          <img src={project.image2} alt={`${project.title} second`} className="w-1/2 h-full object-cover" />
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${isAchievement ? 'text-green-700 bg-green-100' : 'text-fupre-gold bg-fupre-gold/15'}`}>
            {isAchievement ? <><CheckCircle2 size={12} /> Completed</> : <><Clock size={12} /> Ongoing</>}
          </span>
        </div>

        <h3 className="font-bold text-lg text-gray-800 mb-2 leading-snug">{project.title}</h3>
        <p className="text-gray-600 text-sm flex-1 mb-4 leading-relaxed">{project.description}</p>

        {/* Progress bar (ongoing only) */}
        {!isAchievement && typeof project.progress === 'number' && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span className="font-semibold text-fupre-navy">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-fupre-navy h-2 rounded-full transition-all" style={{ width: `${project.progress}%` }}></div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-gray-500 border-t pt-3 mt-auto">
          <Calendar size={13} />
          <span>{new Date(project.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [tab, setTab] = useState('ongoing');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, "projects"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        setProjects(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="min-h-[60vh] flex justify-center items-center"><Loader2 className="animate-spin text-fupre-navy" size={48} /></div>;

  const ongoing = projects.filter(p => p.status === 'Ongoing');
  const completed = projects.filter(p => p.status === 'Completed');

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-fupre-navy mb-2">Projects & Achievements</h1>
      <p className="text-gray-600 mb-8">What we've delivered, and what we're still building for FUPRE students.</p>

      <div className="flex gap-3 mb-8 flex-wrap">
        <button onClick={() => setTab('ongoing')} className={`px-6 py-2 rounded-full font-semibold transition ${tab === 'ongoing' ? 'bg-fupre-navy text-white shadow-md' : 'bg-white text-fupre-navy border border-fupre-navy/20 hover:bg-fupre-navy/5'}`}>
          Ongoing Projects ({ongoing.length})
        </button>
        <button onClick={() => setTab('completed')} className={`px-6 py-2 rounded-full font-semibold transition ${tab === 'completed' ? 'bg-fupre-navy text-white shadow-md' : 'bg-white text-fupre-navy border border-fupre-navy/20 hover:bg-fupre-navy/5'}`}>
          Achievements ({completed.length})
        </button>
      </div>

      {tab === 'ongoing' && (
        ongoing.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border"><p className="text-gray-500">No ongoing projects at the moment.</p></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoing.map(p => <ProjectCard key={p.id} project={p} isAchievement={false} />)}
          </div>
        )
      )}

      {tab === 'completed' && (
        completed.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border"><p className="text-gray-500">No completed projects yet.</p></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {completed.map(p => <ProjectCard key={p.id} project={p} isAchievement={true} />)}
          </div>
        )
      )}
    </div>
  );
}