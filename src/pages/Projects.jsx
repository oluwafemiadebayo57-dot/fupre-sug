import { useState } from 'react';
import { Calendar, Tag, CheckCircle2, Clock } from 'lucide-react';
import { ongoingProjects, achievements } from '../data/projects';

function ProjectCard({ project, isAchievement }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">
      {/* Header bar */}
      <div className={`h-2 ${isAchievement ? 'bg-fupre-gold' : 'bg-fupre-navy'}`}></div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Category + status */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-fupre-navy bg-fupre-navy/10 px-2 py-1 rounded-full flex items-center gap-1">
            <Tag size={12} /> {project.category}
          </span>

          {isAchievement ? (
            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 size={12} /> Completed
            </span>
          ) : (
            <span className="text-xs font-semibold text-fupre-gold bg-fupre-gold/15 px-2 py-1 rounded-full flex items-center gap-1">
              <Clock size={12} /> Ongoing
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-gray-800 mb-2 leading-snug">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm flex-1 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Progress bar (ongoing only) */}
        {!isAchievement && typeof project.progress === 'number' && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span className="font-semibold text-fupre-navy">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-fupre-navy h-2 rounded-full transition-all"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-1 text-xs text-gray-500 border-t pt-3 mt-auto">
          <Calendar size={13} />
          <span>{isAchievement ? project.year : `Started ${project.startDate}`}</span>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [tab, setTab] = useState('ongoing');

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-fupre-navy mb-2">
        Projects & Achievements
      </h1>
      <p className="text-gray-600 mb-8">
        What we've delivered, and what we're still building for FUPRE students.
      </p>

      {/* Tabs */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <button
          onClick={() => setTab('ongoing')}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            tab === 'ongoing'
              ? 'bg-fupre-navy text-white shadow-md'
              : 'bg-white text-fupre-navy border border-fupre-navy/20 hover:bg-fupre-navy/5'
          }`}
        >
          Ongoing Projects
        </button>
        <button
          onClick={() => setTab('achievements')}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            tab === 'achievements'
              ? 'bg-fupre-navy text-white shadow-md'
              : 'bg-white text-fupre-navy border border-fupre-navy/20 hover:bg-fupre-navy/5'
          }`}
        >
          Achievements
        </button>
      </div>

      {/* Ongoing */}
      {tab === 'ongoing' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ongoingProjects.map(p => (
            <ProjectCard key={p.id} project={p} isAchievement={false} />
          ))}
        </div>
      )}

      {/* Achievements */}
      {tab === 'achievements' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map(p => (
            <ProjectCard key={p.id} project={p} isAchievement={true} />
          ))}
        </div>
      )}
    </div>
  );
}