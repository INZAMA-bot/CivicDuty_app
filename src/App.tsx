import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { InstallPwaBanner } from './components/InstallPwaBanner';
import { Footer } from './components/Footer';
import { COUNTRIES } from './data/countries';
import {
  SlidersHorizontal,
  ShieldCheck,
  Terminal,
  Award,
  FileCheck2,
  Clock,
  Lock,
  Layers,
  Building2,
  ArrowUpRight,
} from 'lucide-react';

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
import { LegalTrustModal } from './components/LegalTrustModal';
import { GlobalSocialModals } from './components/GlobalSocialModals';

const StudioRightInspector: React.FC = () => {
  const { user, ensureCitizenSession, posts, go, trafficSignalFilter, setTrafficSignalFilter } = useApp();
  const activeUser = user || ensureCitizenSession();
  const countryCode = activeUser.country || 'UG';
  const countryInfo = COUNTRIES[countryCode] || { name: countryCode, currency: 'USD' };
  const countryPosts = posts.filter((p) => p.country === countryCode);

  const redCount = countryPosts.filter(
    (p) => p.category === 'corruption' || p.status === 'pending' || p.status === 'overdue' || p.escalated
  ).length;
  const amberCount = countryPosts.filter(
    (p) => (p.status === 'investigating' || p.status === 'budget' || p.status === 'received') && p.category !== 'corruption'
  ).length;
  const greenCount = countryPosts.filter(
    (p) => p.status === 'resolved' || p.citizen_satisfied === true || p.citizen_dispute_status === 'confirmed_by_community'
  ).length;
  const totalCount = Math.max(1, countryPosts.length);

  return (
    <aside className="hidden xl:flex flex-col w-[280px] border-l border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] shrink-0 sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto no-scrollbar p-3.5 space-y-4 select-none">
      {/* Studio Run Settings / Parameters Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#e3e6ea] dark:border-[#262b36]">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-slate-100">
          <SlidersHorizontal size={14} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
          <span>Sovereign Parameters</span>
        </div>
        <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-500 dark:text-slate-400">
          LIVE
        </span>
      </div>

      {/* Parameter Block 1: Active Jurisdiction & SLA */}
      <div className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
        <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Jurisdiction Configuration
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Sovereign Node</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
              {countryCode} · {countryInfo.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Statutory SLA</span>
            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Clock size={11} strokeWidth={1.75} />
              <span>48h Window</span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Ledger Security</span>
            <span className="font-mono text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Lock size={11} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
              <span>SHA-256 Sealed</span>
            </span>
          </div>
        </div>
      </div>

      {/* Parameter Block 2: 3-Signal Telemetry Distribution */}
      <div className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            3-Signal Telemetry
          </span>
          {trafficSignalFilter !== 'all' && (
            <button
              onClick={() => setTrafficSignalFilter('all')}
              className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setTrafficSignalFilter(trafficSignalFilter === 'red' ? 'all' : 'red')}
            className={`w-full text-left p-2 rounded-md border transition-colors cursor-pointer ${
              trafficSignalFilter === 'red'
                ? 'bg-rose-500/10 border-rose-500/40'
                : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-medium mb-1">
              <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>1. Citizen Speaks</span>
              </span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{redCount}</span>
            </div>
            <div className="w-full h-1 bg-[#e3e6ea] dark:bg-[#262b36] rounded-full overflow-hidden">
              <div className="h-full bg-rose-500" style={{ width: `${Math.round((redCount / totalCount) * 100)}%` }} />
            </div>
          </button>

          <button
            onClick={() => setTrafficSignalFilter(trafficSignalFilter === 'amber' ? 'all' : 'amber')}
            className={`w-full text-left p-2 rounded-md border transition-colors cursor-pointer ${
              trafficSignalFilter === 'amber'
                ? 'bg-amber-500/10 border-amber-500/40'
                : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-medium mb-1">
              <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>2. Gov Serves</span>
              </span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{amberCount}</span>
            </div>
            <div className="w-full h-1 bg-[#e3e6ea] dark:bg-[#262b36] rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: `${Math.round((amberCount / totalCount) * 100)}%` }} />
            </div>
          </button>

          <button
            onClick={() => setTrafficSignalFilter(trafficSignalFilter === 'green' ? 'all' : 'green')}
            className={`w-full text-left p-2 rounded-md border transition-colors cursor-pointer ${
              trafficSignalFilter === 'green'
                ? 'bg-emerald-500/10 border-emerald-500/40'
                : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-medium mb-1">
              <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>3. Citizen Heard</span>
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{greenCount}</span>
            </div>
            <div className="w-full h-1 bg-[#e3e6ea] dark:bg-[#262b36] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${Math.round((greenCount / totalCount) * 100)}%` }} />
            </div>
          </button>
        </div>
      </div>

      {/* Parameter Block 3: Studio Consoles */}
      <div className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
        <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Studio Tools
        </div>
        <div className="space-y-1">
          {[
            { id: 'depts', label: 'Service Provider Registry', icon: Building2 },
            { id: 'perk_vault', label: 'Honours & Perk Escrow', icon: Award },
            { id: 'verify', label: 'Verify SHA-256 Ledger Seal', icon: FileCheck2 },
            { id: 'ussd', label: 'USSD *3030# Simulator', icon: Terminal },
            { id: 'entity', label: 'Claim Provider Desk', icon: ShieldCheck },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => go(tool.id as any)}
                className="w-full p-2 rounded-md bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2 truncate">
                  <Icon size={13} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{tool.label}</span>
                </span>
                <ArrowUpRight size={12} strokeWidth={1.75} className="text-slate-400 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

const AppContent: React.FC = () => {
  const { view, guideModalOpen, closeGuide, guideInitialTab, legalModalOpen, closeLegalCenter, legalInitialTab } = useApp();

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

  if (view === 'splash') {
    return (
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white font-sans">
        <SplashView />
        <CivicDutyGuideModal isOpen={guideModalOpen} onClose={closeGuide} initialTab={guideInitialTab} />
        <LegalTrustModal isOpen={legalModalOpen} onClose={closeLegalCenter} initialTab={legalInitialTab} />
        <GlobalSocialModals />
      </div>
    );
  }

  const showRightInspector = ['feed', 'depts', 'dept_wall', 'post_detail', 'compose', 'profile'].includes(view);
  const isFullWidthView = [
    'transit_preview',
    'livery',
    'docs',
    'ps_opm_analytics',
    'ps_molg_rollout',
    'gov_partnership',
    'perk_vault',
    'company_management',
    'cd_ops',
    'gov_team',
    'ps_executive_desk',
    'gov_admin',
    'gov_billing',
  ].includes(view);

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-slate-100 flex antialiased selection:bg-emerald-500 selection:text-white font-sans transition-colors duration-200">
      {/* Left Pane: Google AI Studio Persistent Collapsible Sidebar */}
      <Navigation isWide={isFullWidthView} />

      {/* Center + Right Studio Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header />
        <InstallPwaBanner />

        <div className="flex-1 flex min-w-0">
          <div className="flex-1 flex flex-col min-w-0">
            <main
              className={`flex-1 min-w-0 mx-auto w-full pb-8 ${
                isFullWidthView ? 'max-w-6xl' : 'max-w-3xl'
              }`}
            >
              {renderView()}
            </main>
            <Footer />
          </div>

          {showRightInspector && <StudioRightInspector />}
        </div>
      </div>

      <CivicDutyGuideModal isOpen={guideModalOpen} onClose={closeGuide} initialTab={guideInitialTab} />
      <LegalTrustModal isOpen={legalModalOpen} onClose={closeLegalCenter} initialTab={legalInitialTab} />
      <GlobalSocialModals />
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

