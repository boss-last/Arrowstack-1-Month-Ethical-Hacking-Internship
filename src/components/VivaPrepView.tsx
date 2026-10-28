import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle, Lightbulb, Sparkles, MessageSquare } from 'lucide-react';
import { VIVA_QUESTIONS } from '../data/pentestData';

interface VivaPrepViewProps {
  lang: 'fr' | 'en';
}

export const VivaPrepView: React.FC<VivaPrepViewProps> = ({ lang }) => {
  const isFr = lang === 'fr';
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const toggleQuestion = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <MessageSquare className="w-4 h-4" />
          <span>Section 6 — {isFr ? 'Questions de Soutenance & Entretien Technique' : 'Viva & Technical Interview Prep'}</span>
        </div>
        <h2 className="text-2xl font-black text-white mt-1">
          {isFr ? 'Préparation à la Soutenance (Viva Q&A Rubric)' : 'Defense & Viva Interview Questions'}
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl">
          {isFr
            ? 'Les 7 questions fondamentales imposées par le barème d’évaluation Arrowstack pour justifier vos choix méthodologiques, vos compromis techniques et votre impact métier face aux mentors et recruteurs.'
            : 'The 7 mandatory questions specified in the Arrowstack syllabus to articulate methodology, technical trade-offs, and business relevance during mentor defense.'}
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {VIVA_QUESTIONS.map((item) => {
          const isOpen = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-slate-900 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => toggleQuestion(item.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center space-x-3.5">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold ${
                      isOpen
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    0{item.id}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {isFr ? item.question : item.questionEn}
                  </h3>
                </div>

                <div className="text-slate-400 p-1">
                  {isOpen ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-800/80">
                  {/* Detailed Model Answer */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {isFr ? 'Réponse Recommandée pour l’Entretien :' : 'Model Professional Answer:'}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {isFr ? item.answer : item.answerEn}
                    </p>
                  </div>

                  {/* Key Takeaway / Elevator Pitch */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start space-x-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-amber-300 block">
                        {isFr ? 'Point Clé à Retenir (Key Takeaway) :' : 'Core Key Takeaway:'}
                      </span>
                      <p className="text-xs text-amber-200/90 mt-0.5">
                        {isFr ? item.keyTakeaway : item.keyTakeawayEn}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
