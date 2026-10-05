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
import { EntityGatewayView } from './views/EntityGatewayView';
import { EntityTeamView } from './views/EntityTeamView';
import { ProjectView } from './views/ProjectView';
import { GovProjectsView } from './views/GovProjectsView';
import { UssdView } from './views/UssdView';
import { DocsView } from './views/DocsView';
import { PsOpmAnalyticsView } from './views/PsOpmAnalyticsView';
import { PsMolgRolloutView } from './views/PsMolgRolloutView';
import { PsExecutiveDeskView } from './views/PsExecutiveDeskView';
import { CompanyManagementView } from './views/CompanyManagementView';
import { VerifyView } from './views/VerifyView';
import { TransitPreviewView } from './views/TransitPreviewView';
import { GovPartnershipView } from './views/GovPartnershipView';
import { PerkVaultView } from './views/PerkVaultView';
import { CivicDutyGuideModal } from './components/CivicDutyGuideModal';


const AppContent: React.FC = () => {
  const { view, guideModalOpen, closeGuide, guideInitialTab } = useApp();

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
        return <EntityRegisterView />;
      case 'entity_gateway':
      case 'entity_portal':
      case 'entity':
        return <EntityGatewayView />;
      case 'entity_team':
        return <EntityTeamView />;
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
      case 'ps_opm_analytics':
        return <PsOpmAnalyticsView />;
      case 'ps_molg_rollout':
        return <PsMolgRolloutView />;
      case 'ps_executive_desk':
        return <PsExecutiveDeskView />;
      case 'company_management':
      case 'cd_ops':
        return <CompanyManagementView />;
      case 'perk_vault':
        return <PerkVaultView />;
      case 'gov_partnership':
        return <GovPartnershipView />;
      case 'transit_preview':
      case 'livery':
        return <TransitPreviewView />;

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
    'gov_partnership',
    'perk_vault',
    'entity_register',
    'entity_gateway',
    'entity_portal',
    'entity',
    'entity_done',
    'ussd',
    'docs',
    'verify',
    'company_management',
    'cd_ops',
    'transit_preview',
    'livery',
  ].includes(view);

  const isWide = ['transit_preview', 'livery', 'docs', 'ps_opm_analytics', 'ps_molg_rollout', 'gov_partnership', 'perk_vault', 'company_management', 'cd_ops', 'gov_team', 'ps_executive_desk', 'gov_admin', 'gov_billing'].includes(view);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-start antialiased selection:bg-emerald-500 selection:text-white font-sans transition-colors duration-200">
      <div
        className={`w-full ${
          isWide ? 'max-w-5xl' : 'max-w-md'
        } bg-white dark:bg-slate-950 border-x border-slate-200 dark:border-slate-800/80 min-h-screen flex flex-col shadow-2xl relative pb-28 transition-all duration-200`}
      >
        <Header />
        {!isPortal && <InstallPwaBanner />}

        <main className="flex-1 relative w-full">{renderView()}</main>

        {!isPortal && <Navigation isWide={isWide} />}

        <CivicDutyGuideModal
          isOpen={guideModalOpen}
          onClose={closeGuide}
          initialTab={guideInitialTab}
        />
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
