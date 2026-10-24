import React from 'react';
import { CivicFeedDispatcher } from '../components/CivicFeedDispatcher';
import { useApp } from '../context/AppContext';

export const ComposeView: React.FC = () => {
  const { go } = useApp();

  return (
    <div className="px-3.5 sm:px-5 pt-4 pb-16 max-w-2xl mx-auto space-y-4 animate-fade-in text-slate-900 dark:text-slate-100">
      <CivicFeedDispatcher
        defaultExpanded={true}
        standalonePage={true}
        onPostSuccess={() => go('feed')}
      />
    </div>
  );
};
