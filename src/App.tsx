import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { InstallPwaBanner } from './components/InstallPwaBanner';

import { SplashView } from './views/SplashView';
import { OnboardingCitizenView } from './views/OnboardingCitizenView';
import { GovLoginView } from './views/GovLoginView';
import { FeedView } from './views/FeedView';
import { DepartmentsView } from './views/DepartmentsView';
import { DeptWallView } from './views/DeptWallView';
import { PostDetailView } from './views/PostDetailView';
import { ComposeView } from './views/ComposeView';
import { ProfileView } from './views/ProfileView';
import { GovInboxView } from './views/GovInboxView';
import { GovReplyView } from './views/GovReplyView';
import { GovAuditView } from './views/GovAuditView';
import { GovTeamView } from './views/GovTeamView';
import { GovBulkView } from './views/GovBulkView';
import { GovAdminView } from './views/GovAdminView';
import { GovBillingView } from './views/GovBillingView';
import { EntityRegisterView, EntityDoneView } from './views/EntityRegisterView';
import { ProjectView } from './views/ProjectView';
import { GovProjectsView } from './views/GovProjectsView';
import { UssdView } from './views/UssdView';
import { DocsView } from './views/DocsView';
import { VerifyView } from './views/VerifyView';

const AppContent: React.FC = () => {
  const { view } = useApp();

  const renderView = () => {
    switch (view) {
      case 'splash':
        return <SplashView />;
      case 'onboarding_citizen':
      case 'ob1':
      case 'ob_home':
      case 'ob3':
        return <OnboardingCitizenView />;
      case 'gov_login':
      case 'ob2':
        return <GovLoginView />;
      case 'feed':
        return <FeedView />;
      case 'depts':
        return <DepartmentsView />;
      case 'dept_wall':
        return <DeptWallView />;
      case 'post_detail':
        return <PostDetailView />;
      case 'compose':
        return <ComposeView />;
      case 'profile':
        return <ProfileView />;
      case 'gov_inbox':
        return <GovInboxView />;
      case 'gov_reply':
        return <GovReplyView />;
      case 'gov_audit':
        return <GovAuditView />;
      case 'gov_team':
        return <GovTeamView />;
      case 'gov_bulk':
        return <GovBulkView />;
      case 'gov_admin':
        return <GovAdminView />;
      case 'gov_billing':
        return <GovBillingView />;
      case 'entity_register':
      case 'entity':
        return <EntityRegisterView />;
      case 'entity_done':
        return <EntityDoneView />;
      case 'project':
        return <ProjectView />;
      case 'gov_projects':
        return <GovProjectsView />;
      case 'ussd':
        return <UssdView />;
      case 'docs':
        return <DocsView />;
      case 'verify':
        return <VerifyView />;
      default:
        return <SplashView />;
    }
  };

  const isPortal = [
    'splash',
    'onboarding_citizen',
    'ob1',
    'ob_home',
    'ob3',
    'ob2',
    'gov_login',
    'entity_register',
    'entity',
    'entity_done',
    'ussd',
    'docs',
    'verify',
  ].includes(view);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-start antialiased selection:bg-emerald-500 selection:text-white font-sans transition-colors duration-200">
      <div className="w-full max-w-md bg-slate-50 dark:bg-[#020617] min-h-screen border-x border-slate-200/80 dark:border-slate-800/60 shadow-[0_0_40px_rgba(0,0,0,0.06)] dark:shadow-[0_0_50px_rgba(2,6,23,0.9)] flex flex-col relative pb-20 transition-colors duration-200">
        <Header />
        {!isPortal && <InstallPwaBanner />}

        <main className="flex-1 overflow-y-auto">{renderView()}</main>

        {!isPortal && <Navigation />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
