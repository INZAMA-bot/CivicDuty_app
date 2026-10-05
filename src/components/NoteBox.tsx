import React from 'react';

interface NoteBoxProps {
  tone: 'emerald' | 'amber' | 'red' | 'teal';
  title: string;
  text: string;
}

export const NoteBox: React.FC<NoteBoxProps> = ({ tone, title, text }) => {
  const toneMap = {
    amber: {
      wrap: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/30',
      title: 'text-amber-900 dark:text-amber-300',
    },
    red: {
      wrap: 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/30',
      title: 'text-rose-900 dark:text-rose-300',
    },
    emerald: {
      wrap: 'bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-500/30',
      title: 'text-teal-900 dark:text-teal-300',
    },
    teal: {
      wrap: 'bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-500/30',
      title: 'text-teal-900 dark:text-teal-300',
    },
  };

  const toneClasses = toneMap[tone] || toneMap.emerald;

  return (
    <div className={`p-3.5 rounded-xl border space-y-1 my-3 ${toneClasses.wrap}`}>
      <p className={`text-[9.5px] mono font-black uppercase tracking-wider ${toneClasses.title}`}>
        {title}
      </p>
      <p className="text-[9.5px] mono text-slate-700 dark:text-slate-400 leading-relaxed">{text}</p>
    </div>
  );
};
