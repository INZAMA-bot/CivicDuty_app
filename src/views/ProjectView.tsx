import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  HardHat, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  MessageSquare, 
  Plus, 
  Activity, 
  Edit3, 
  ShieldCheck, 
  Gift, 
  Zap, 
  Building2, 
  ListChecks, 
  BadgeCheck,
  Send,
  Ticket,
  Briefcase,
  Lock,
  Landmark,
  Check,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Camera,
  Image as ImageIcon,
  Eye,
  Upload,
  X,
  FileText,
  Sparkles,
  HeartHandshake,
  Printer,
  Wrench,
  Clock,
  Layers,
  QrCode,
} from 'lucide-react';
import { PostCardComponent } from '../components/PostCardComponent';
import { RewardModal } from '../components/RewardModal';
import { DefectsLiabilityPanel } from '../components/DefectsLiabilityPanel';
import { ContractorCsrModal } from '../components/ContractorCsrModal';
import { SiteDepotBranchesCard } from '../components/SiteDepotBranchesCard';
import { PrintableTreasuryWarrantModal } from '../components/PrintableTreasuryWarrantModal';
import { ProjectMilestone, MilestoneEvidenceImage, Post, ContractorCsrDisbursement } from '../types';
import { saveFiscalVoucherToCloud } from '../services/firestoreSync';
import { getCountryCapacityPresets } from '../data/tiers';

export const ProjectView: React.FC = () => {
  const { activeProject, projects, posts, user, go, setActiveProject, toast, addPost } = useApp();

  const proj = activeProject || projects[0];
  const countryCode = proj?.country || user?.country || 'UG';
  const capacityPresets = getCountryCapacityPresets(countryCode);

  const [commentText, setCommentText] = useState('');
  const [inspectorCapacity, setInspectorCapacity] = useState(capacityPresets[4] || capacityPresets[0] || 'Local Resident / Community Watchdog');
  const [progressPct, setProgressPct] = useState(65);
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [selectedCitizenForReward, setSelectedCitizenForReward] = useState<{ name: string; phone?: string; postId?: string }>({
    name: 'Inzama Robin',
    phone: '+256 778 277 900 / +256 748 338 796',
  });

  // Keep inspectorCapacity updated if country changes
  useEffect(() => {
    if (capacityPresets && capacityPresets.length > 0) {
      setInspectorCapacity(capacityPresets[4] || capacityPresets[0]);
    }
  }, [countryCode]);

  const defaultMilestones: ProjectMilestone[] = [
    {
      id: '1',
      title: 'Phase 1: Bush Clearing, Site Preparation & Setting Foundation',
      date: 'Jan 2026',
      done: true,
      awarderVerified: true,
      awarderSignedBy: 'Supervising Engineer (Gov)',
      awarderSignedAt: '2026-01-15',
      contractorVerified: true,
      contractorSignedBy: 'Lead Engineer (Contractor)',
      contractorSignedAt: '2026-01-18',
      contractorNotes: 'Baseline topographic surveys and GPS benchmarks established; 1.5km bush clearing stripped to 300mm depth.',
      ipcNumber: 'IPC-01/2026',
      awarderAuditNotes: 'Supervising engineer verified setting-out coordinates with KCCA/MoWT survey benchmarks.',
      evidenceImages: [
        {
          id: 'ev-1-1',
          url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
          caption: 'Baseline topographic survey & benchmark establishment at Chainage 0+000',
          uploadedAt: '2026-01-16',
          uploadedBy: 'Lead Surveyor & Site Engineer',
          gpsTag: '0.3476° N, 32.5825° E',
        },
        {
          id: 'ev-1-2',
          url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=80',
          caption: 'Mechanical bush clearance & topsoil stripping (300mm depth)',
          uploadedAt: '2026-01-17',
          uploadedBy: 'Heavy Plant Supervisor',
          gpsTag: '0.3478° N, 32.5828° E',
        },
      ],
    },
    {
      id: '2',
      title: 'Phase 2: Contract Award & Site Handover Clearance',
      date: 'Feb 2026',
      done: true,
      awarderVerified: true,
      awarderSignedBy: 'Procurement Officer (Gov)',
      awarderSignedAt: '2026-02-01',
      contractorVerified: true,
      contractorSignedBy: 'Managing Director (Contractor)',
      contractorSignedAt: '2026-02-02',
      contractorNotes: 'Joint site possession protocol signed. Mobilization of site camp, safety hoardings, and plant.',
      ipcNumber: 'IPC-02/2026',
      awarderAuditNotes: 'Handover protocol signed; insurance and advance payment guarantee validated.',
      evidenceImages: [
        {
          id: 'ev-2-1',
          url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
          caption: 'Site camp establishment, safety signage & hoardings along project corridor',
          uploadedAt: '2026-02-01',
          uploadedBy: 'Safety Officer & Site Agent',
          gpsTag: '0.3480° N, 32.5830° E',
        },
      ],
    },
    {
      id: '3',
      title: 'Phase 3: Substructure Drainage Channel Heavy Excavation',
      date: 'May 2026',
      done: false,
      awarderVerified: false,
      contractorVerified: false,
      contractorNotes: 'Excavation 1.8m depth for hydraulic flow completed. Ready for joint inspection.',
      ipcNumber: 'IPC-03/2026',
      evidenceImages: [
        {
          id: 'ev-3-1',
          url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80',
          caption: 'Channel prism trench excavation to grade with CAT 320 excavator',
          uploadedAt: '2026-05-08',
          uploadedBy: 'Excavation Foreman',
          gpsTag: '0.3485° N, 32.5835° E',
        },
      ],
    },
    {
      id: '4',
      title: 'Phase 4: Concrete Box Culvert Installation & Subgrade Laying',
      date: 'In Progress',
      done: false,
      awarderVerified: false,
      contractorVerified: false,
      evidenceImages: [],
    },
    {
      id: '5',
      title: 'Phase 5: Road Surfacing Tarmacking & Solar Lighting Works',
      date: 'Est. Sep 2026',
      done: false,
      awarderVerified: false,
      contractorVerified: false,
      evidenceImages: [],
    },
    {
      id: '6',
      title: 'Phase 6: Final Technical Audit & Handover Certificate',
      date: 'Est. Nov 2026',
      done: false,
      awarderVerified: false,
      contractorVerified: false,
      evidenceImages: [],
    },
  ];

  const [milestones, setMilestones] = useState<ProjectMilestone[]>(() => {
    return proj?.milestones && proj.milestones.length > 0 ? proj.milestones : defaultMilestones;
  });

  const [signingRole, setSigningRole] = useState<'awarder' | 'contractor'>('awarder');
  const [newWallMilestoneTitle, setNewWallMilestoneTitle] = useState('');
  const [newWallMilestoneDate, setNewWallMilestoneDate] = useState('');

  // Milestone Evidence Modal States
  const [selectedMilestoneForEvidence, setSelectedMilestoneForEvidence] = useState<ProjectMilestone | null>(null);
  const [evidenceModalMode, setEvidenceModalMode] = useState<'contractor_upload' | 'procuring_entity_inspect' | null>(null);
  const [lightboxImage, setLightboxImage] = useState<MilestoneEvidenceImage | null>(null);

  // Contractor Evidence Form State
  const [contractorNotesInput, setContractorNotesInput] = useState('');
  const [ipcNumberInput, setIpcNumberInput] = useState('IPC-03/2026');
  const [gpsTagInput, setGpsTagInput] = useState('0.3478° N, 32.5829° E (Chainage 2+150)');
  const [uploadedImages, setUploadedImages] = useState<MilestoneEvidenceImage[]>([]);
  const [customCaption, setCustomCaption] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Procuring Entity Inspection State
  const [awarderAuditNotesInput, setAwarderAuditNotesInput] = useState('');

  // DLP Lifecycle Stage Switcher ('active' = Works in progress, 'defects' = 12-Month DLP & Warranty Watch)
  const [lifecycleStage, setLifecycleStage] = useState<'active' | 'defects'>(() => {
    return proj?.status === 'defects' ? 'defects' : 'active';
  });

  // CSR Grants State
  const [csrModalOpen, setCsrModalOpen] = useState(false);
  const [corridorCsrGrants, setCorridorCsrGrants] = useState<ContractorCsrDisbursement[]>([
    {
      id: 'csr-init-1',
      projectId: proj.id,
      contractor: proj.contractor,
      targetGroup: 'Bukoto Central Boda Boda Stage Vault',
      parish: 'Bukoto Parish',
      itemTitle: '25x Certified DOT Boda Safety Helmets',
      itemCount: 25,
      monetaryValueUgx: 1500000,
      disbursedAt: '2026-08-10',
      donorStatement: `${proj.contractor} dispatched certified high-impact safety helmets to local commercial riders along the construction works corridor.`,
    },
  ]);

  // Printable Treasury Warrant Slip Modal
  const [printableModalOpen, setPrintableModalOpen] = useState(false);
  const [voucherForPrint, setVoucherForPrint] = useState<any | null>(null);

  useEffect(() => {
    if (proj?.status === 'defects') {
      setLifecycleStage('defects');
    }
  }, [proj?.status]);

  useEffect(() => {
    if (proj?.milestones && proj.milestones.length > 0) {
      setMilestones(proj.milestones);
    } else {
      setMilestones(defaultMilestones);
    }
  }, [proj?.id]);

  const canUpdateProject = user && (user.role === 'node_admin' || user.role === 'spokesperson' || user.role === 'platform_admin' || user.is_utility);

  if (!proj) {
    return (
      <div className="p-4 space-y-4 animate-fade-in pb-12 text-center text-slate-800 dark:text-slate-100">
        <button
          onClick={() => go('feed')}
          className="flex items-center gap-1 text-[10px] mono text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 mb-3.5 transition-colors"
        >
          <ChevronLeft size={14} /> Back
        </button>
        <p className="text-sm mono text-slate-600 dark:text-slate-400">No public projects available.</p>
      </div>
    );
  }
  const projectPosts = posts.filter((p) => p.title.toLowerCase().includes(proj.title.toLowerCase()) || p.dept === proj.dept);

  const handlePostProjectFeedback = () => {
    if (!commentText.trim()) {
      toast('Write inspection feedback or result first', 'amber');
      return;
    }

    const roleTitle = inspectorCapacity.trim() || 'Local Resident / Watchdog';
    const authorName = user?.name ? `${user.name} (${roleTitle})` : roleTitle;

    const memoPost: Post = {
      id: 'p-memo-' + Date.now(),
      country: user?.country || proj.country || 'UG',
      dept: proj.dept || 'kcca',
      lane: 'civic',
      territory: {
        district: proj.location || 'Central',
        subcounty: proj.location || 'Central',
        parish: proj.location || 'Central',
      },
      citizen_id: user?.id || 'usr-inspect',
      citizen_name: authorName,
      citizen_rank: roleTitle,
      anonymous: false,
      category: 'other',
      title: `[Inspection Memo: ${roleTitle}] ${proj.title}`,
      body: `Statement Capacity / Designation: ${roleTitle}\n\n${commentText.trim()}`,
      location: proj.location || 'Project Site',
      source: 'web',
      media: [],
      status: 'pending',
      gov_status: 'investigating',
      is_corruption: false,
      created_at: new Date().toISOString(),
      comments: [],
      upvotes: 1,
      citizen_satisfied: null,
      escalated: false,
    };

    addPost(memoPost);
    toast(`Site memo logged under capacity: ${roleTitle}`, 'emerald');
    setCommentText('');
  };

  const [activeVoucher, setActiveVoucher] = useState<any | null>(null);
  const [isMintingVoucher, setIsMintingVoucher] = useState(false);

  const handleGenerateDisbursementVoucher = async (milestone: ProjectMilestone) => {
    setIsMintingVoucher(true);
    try {
      // Calculate estimated milestone tranche from project total
      const totalNumeric = parseInt(proj.value.replace(/[^0-9]/g, '')) || 450000000;
      const trancheGross = Math.round(totalNumeric / (milestones.length || 1));

      const res = await fetch('/api/disbursements/generate-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: proj.id,
          projectTitle: proj.title,
          contractor: proj.contractor,
          country: proj.country || 'UG',
          milestoneId: milestone.id,
          milestoneTitle: milestone.title,
          grossAmount: trancheGross,
          currency: proj.country === 'KE' ? 'KES' : proj.country === 'NG' ? 'NGN' : 'UGX',
          awarderSigner: milestone.awarderSignedBy || user?.name || 'Supervising Engineer',
          contractorSigner: milestone.contractorSignedBy || `${proj.contractor} Executive`,
        }),
      });
      const data = await res.json();
      if (data.success && data.voucher) {
        setActiveVoucher(data.voucher);
        // Persist to Cloud Firestore
        saveFiscalVoucherToCloud(data.voucher).catch(() => {});
        toast(`Fiscal Release Warrant #${data.voucher.voucherNumber} minted! Ready for MoFPED release.`, 'emerald');
      }
    } catch {
      toast('Failed to reach automated treasury minting service.', 'amber');
    } finally {
      setIsMintingVoucher(false);
    }
  };

  const handleReleaseEscrowFunds = async (voucherId: string) => {
    try {
      const res = await fetch('/api/disbursements/release-escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherId }),
      });
      const data = await res.json();
      if (data.success && data.voucher) {
        setActiveVoucher(data.voucher);
        // Update voucher status in Cloud Firestore
        saveFiscalVoucherToCloud(data.voucher).catch(() => {});
        toast(data.message, 'emerald');
      }
    } catch {
      toast('Error triggering automated escrow disbursement', 'amber');
    }
  };

  const SAMPLE_CIVIL_PHOTO_PRESETS = [
    {
      title: 'Concrete Box Culvert Bedding & Invert Slab',
      url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80',
      caption: 'Precast box culvert units placed on 150mm class 15 concrete blinding bedding',
    },
    {
      title: 'Trench Prism Hydraulic Excavation',
      url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=80',
      caption: 'Trapezoidal drainage channel excavation completed per hydraulic slope DWG-03',
    },
    {
      title: 'Subgrade Compaction & Slump Test Verification',
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      caption: 'Nuclear density gauge test verifying 98% MDD compaction on base gravel layer',
    },
    {
      title: 'Asphalt Concrete (AC20) Binder Course Laying',
      url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
      caption: 'Vögele asphalt paver laying 60mm AC20 binder course at 155°C compaction temperature',
    },
    {
      title: 'Solar Streetlight Mast Foundation & Armature',
      url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
      caption: 'C25 reinforced concrete plinth & anchor bolts installed for 8m solar streetlight masts',
    },
  ];

  const handleOpenContractorEvidenceModal = (milestone: ProjectMilestone) => {
    setSelectedMilestoneForEvidence(milestone);
    setUploadedImages(milestone.evidenceImages ? [...milestone.evidenceImages] : []);
    setContractorNotesInput(milestone.contractorNotes || '');
    setIpcNumberInput(milestone.ipcNumber || `IPC-0${milestones.indexOf(milestone) + 1}/2026`);
    setGpsTagInput(proj.location ? `${proj.location} (Chainage ${milestones.indexOf(milestone) * 2}+150)` : '0.3478° N, 32.5829° E');
    setEvidenceModalMode('contractor_upload');
  };

  const handleOpenProcuringEntityInspector = (milestone: ProjectMilestone) => {
    setSelectedMilestoneForEvidence(milestone);
    setAwarderAuditNotesInput(milestone.awarderAuditNotes || 'On-site engineering inspection confirmed compliance with contract specifications.');
    setEvidenceModalMode('procuring_entity_inspect');
  };

  const handleToggleAwarder = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (signingRole !== 'awarder') {
      toast('ACCESS DENIED: Contractor Executives/Engineers CANNOT sign the Procuring Entity slot!', 'amber');
      return;
    }
    const target = milestones.find((m) => m.id === id);
    if (!target) return;

    // MANDATORY REQUIREMENT: Contractor MUST have attached pictorial evidence before Procuring Entity signs off
    if (!target.awarderVerified && (!target.evidenceImages || target.evidenceImages.length === 0)) {
      toast('BLOCKED: Mandatory on-site pictorial evidence required before Procuring Entity can verify and sign off!', 'amber');
      handleOpenProcuringEntityInspector(target);
      return;
    }

    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextAwarder = !m.awarderVerified;
        const isBoth = nextAwarder && Boolean(m.contractorVerified);
        if (isBoth) {
          toast('Dual Signoff Complete! Phase 100% verified by Procuring Entity & Contractor with on-site pictorial proof', 'emerald');
        } else if (nextAwarder) {
          toast('Procuring Entity (Gov Authority) signoff appended after reviewing photographic proof', 'emerald');
        } else {
          toast('Procuring Entity signoff removed', 'amber');
        }
        return {
          ...m,
          awarderVerified: nextAwarder,
          awarderSignedBy: nextAwarder ? (user?.name || 'Procuring Entity Supervising Engineer') : undefined,
          awarderSignedAt: nextAwarder ? new Date().toISOString().split('T')[0] : undefined,
          done: isBoth,
        };
      })
    );
  };

  const handleToggleContractor = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (signingRole !== 'contractor') {
      toast('ACCESS DENIED: Government Officials CANNOT sign the Contractor Executive slot!', 'amber');
      return;
    }
    const target = milestones.find((m) => m.id === id);
    if (!target) return;

    // If contractor has NOT attached pictorial evidence yet, launch mandatory evidence modal
    if (!target.contractorVerified && (!target.evidenceImages || target.evidenceImages.length === 0)) {
      handleOpenContractorEvidenceModal(target);
      toast('Mandatory Pictorial Evidence: Attach on-site completion photos to sign this milestone.', 'amber');
      return;
    }

    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextContractor = !m.contractorVerified;
        const isBoth = Boolean(m.awarderVerified) && nextContractor;
        if (isBoth) {
          toast('Dual Signoff Complete! Phase 100% verified by Government & Contractor', 'emerald');
        } else if (nextContractor) {
          toast('Contractor Executive signoff appended with pictorial proof', 'emerald');
        } else {
          toast('Contractor Executive signoff removed', 'amber');
        }
        return {
          ...m,
          contractorVerified: nextContractor,
          contractorSignedBy: nextContractor ? `${proj.contractor} Lead Site Engineer` : undefined,
          contractorSignedAt: nextContractor ? new Date().toISOString().split('T')[0] : undefined,
          done: isBoth,
        };
      })
    );
  };

  const handleSaveContractorEvidenceAndSign = () => {
    if (!selectedMilestoneForEvidence) return;
    if (uploadedImages.length === 0) {
      toast('Please attach at least one on-site photographic evidence.', 'amber');
      return;
    }

    const updatedMilestones = milestones.map((m) => {
      if (m.id !== selectedMilestoneForEvidence.id) return m;
      const nextContractor = true;
      const isBoth = Boolean(m.awarderVerified) && nextContractor;
      return {
        ...m,
        contractorVerified: nextContractor,
        contractorSignedBy: `${proj.contractor} Lead Site Engineer`,
        contractorSignedAt: new Date().toISOString().split('T')[0],
        evidenceImages: [...uploadedImages],
        contractorNotes: contractorNotesInput.trim() || 'All structural works, testing and surveys completed to specifications.',
        ipcNumber: ipcNumberInput.trim() || `IPC-0${milestones.indexOf(m) + 1}/2026`,
        done: isBoth,
      };
    });

    setMilestones(updatedMilestones);
    setEvidenceModalMode(null);
    setSelectedMilestoneForEvidence(null);
    setUploadedImages([]);
    toast(`Pictorial evidence saved & milestone signed by Contractor! Procuring Entity can now inspect and sign off.`, 'emerald');
  };

  const handleProcuringEntityVerifyEvidenceAndSign = () => {
    if (!selectedMilestoneForEvidence) return;
    if (!selectedMilestoneForEvidence.evidenceImages || selectedMilestoneForEvidence.evidenceImages.length === 0) {
      toast('Cannot verify: No on-site pictorial evidence submitted by contractor.', 'amber');
      return;
    }

    const updatedMilestones = milestones.map((m) => {
      if (m.id !== selectedMilestoneForEvidence.id) return m;
      const nextAwarder = true;
      const isBoth = Boolean(m.contractorVerified) && nextAwarder;
      return {
        ...m,
        awarderVerified: nextAwarder,
        awarderSignedBy: user?.name || 'Procuring Entity Supervising Engineer',
        awarderSignedAt: new Date().toISOString().split('T')[0],
        awarderAuditNotes: awarderAuditNotesInput.trim() || 'Visual on-site inspection & core strength tests verified and approved.',
        done: isBoth,
      };
    });

    setMilestones(updatedMilestones);
    setEvidenceModalMode(null);
    setSelectedMilestoneForEvidence(null);
    toast(`Procuring Entity verified pictorial evidence & signed off milestone! Dual sign-off unlocked.`, 'emerald');
  };

  const handleAddWallMilestone = () => {
    if (!newWallMilestoneTitle.trim()) {
      toast('Enter milestone deliverable title', 'amber');
      return;
    }
    const item: ProjectMilestone = {
      id: 'm-' + Date.now(),
      title: newWallMilestoneTitle.trim(),
      date: newWallMilestoneDate.trim() || 'Target Stage',
      done: false,
      awarderVerified: false,
      contractorVerified: false,
    };
    setMilestones((prev) => [...prev, item]);
    setNewWallMilestoneTitle('');
    setNewWallMilestoneDate('');
    toast('Milestone added to contract wall!', 'emerald');
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-16 text-slate-800 dark:text-slate-100">
      <div>
        <button
          onClick={() => go('gov_projects')}
          className="flex items-center gap-1 text-[11px] mono text-slate-500 hover:text-amber-700 dark:text-slate-400 dark:hover:text-amber-400 mb-3.5 transition-colors font-bold"
        >
          <ChevronLeft size={14} /> Back to Works & Contracts
        </button>
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="chip ch-invest flex items-center gap-1 text-[9.5px]">
            <HardHat size={12} /> {proj.status}
          </span>
          <span className="text-[9.5px] mono text-amber-800 dark:text-amber-300 font-bold bg-amber-600/10 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-600/20 dark:border-amber-500/20">
            Tender: {proj.tender || 'PUBLIC-WORKS-2026'}
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">{proj.title}</h2>
        <p className="text-[12px] mono text-slate-600 dark:text-slate-300 mt-1 font-semibold">{proj.contractor}</p>
      </div>

      {/* Interactive 3-Role Contract & Supervision Activity Demo Console */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold block">
              Interactive Contract &amp; Supervision Sandbox · 3 Live Perspectives
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Test Every Contract Activity: Contractor, Appointed Supervisor &amp; Resident/Traveler
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-semibold">
            1-Click Live Simulation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          {/* Demo 1: Contractor */}
          <button
            type="button"
            onClick={() => {
              setSigningRole('contractor');
              setProgressPct((prev) => Math.min(100, prev + 10));
              setMilestones((prev) =>
                prev.map((m, idx) =>
                  idx === 2
                    ? {
                        ...m,
                        contractorVerified: true,
                        contractorSignedBy: `${proj.contractor} Lead Site Engineer`,
                        contractorSignedAt: new Date().toISOString().split('T')[0],
                        done: Boolean(m.awarderVerified),
                      }
                    : m
                )
              );
              setInspectorCapacity(`Lead Site Engineer — ${proj.contractor}`);
              setCommentText(
                `[CONTRACTOR BOQ & MILESTONE CLAIM] Phase 3 substructure drainage channel excavation and box culvert bedding completed per engineering drawings. Submitting IPC Certificate #03 for joint verification by the Appointed Supervising Engineer.`
              );
              toast('Contractor Demo loaded: Phase 3 signed by Contractor & BOQ claim prepared below!', 'emerald');
            }}
            className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-amber-500/60 border border-[#e3e6ea] dark:border-[#262b36] text-left space-y-1.5 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <HardHat size={12} /> 1. Contractor Demo
              </span>
              <span className="text-[9.5px] font-mono text-slate-400 group-hover:text-amber-500">Run →</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-white text-[11.5px]">
              File BOQ Progress &amp; Sign Contractor Slot
            </div>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-snug">
              Act as {proj.contractor} Site Engineer: advance completion %, sign Phase 3, and prepare Interim Payment Claim.
            </p>
          </button>

          {/* Demo 2: Appointed Supervision Official */}
          <button
            type="button"
            onClick={() => {
              setSigningRole('awarder');
              setMilestones((prev) =>
                prev.map((m, idx) =>
                  idx === 2
                    ? {
                        ...m,
                        awarderVerified: true,
                        awarderSignedBy: 'Appointed District Supervising Engineer (Gov)',
                        awarderSignedAt: new Date().toISOString().split('T')[0],
                        done: Boolean(m.contractorVerified),
                      }
                    : m
                )
              );
              setInspectorCapacity(capacityPresets[0] || 'Appointed Government Supervising Engineer / Clerk of Works');
              setCommentText(
                `[STATUTORY SUPERVISION AUDIT] Conducted on-site core-drilling and culvert concrete cube strength test (C30 grade verified). Drainage gradient meets MoWT/PPDA specification. Cleared for Dual Sign-Off and Treasury Warrant minting.`
              );
              toast('Supervision Official Demo loaded: Gov Engineer verification & audit memo ready!', 'emerald');
            }}
            className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500/60 border border-[#e3e6ea] dark:border-[#262b36] text-left space-y-1.5 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={12} /> 2. Appointed Supervisor
              </span>
              <span className="text-[9.5px] font-mono text-slate-400 group-hover:text-emerald-500">Run →</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-white text-[11.5px]">
              Official Technical Audit &amp; Dual Sign-Off
            </div>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-snug">
              Act as Appointed Supervising Engineer / CAO Inspector: counter-sign milestone &amp; log technical quality clearance.
            </p>
          </button>

          {/* Demo 3: Resident / Traveler / Commuter */}
          <button
            type="button"
            onClick={() => {
              setInspectorCapacity('Local Resident & Daily Highway Traveler / Commuter Watchdog');
              setCommentText(
                `[RESIDENT & TRAVELER FIELD OBSERVATION] Passing through kilometer 4.2 of ${proj.title}: Concrete culverts are installed on the eastern shoulder, but reflective night hazard barriers are needed near the open trench for evening travelers and boda riders.`
              );
              toast('Resident / Traveler Supervision Demo loaded! Click "Log Site Inspection Memo" below to publish.', 'emerald');
            }}
            className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-indigo-500/60 border border-[#e3e6ea] dark:border-[#262b36] text-left space-y-1.5 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <BadgeCheck size={12} /> 3. Resident / Traveler
              </span>
              <span className="text-[9.5px] font-mono text-slate-400 group-hover:text-indigo-500">Run →</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-white text-[11.5px]">
              Citizen &amp; Traveler Eyewitness Audit
            </div>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-snug">
              Act as a Local Resident or Road Traveler: file geo-tagged eyewitness supervision feedback &amp; qualify for Perks.
            </p>
          </button>
        </div>
      </div>

      {/* Progress Completion Indicator */}
      <div className="card p-4 space-y-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm rounded-2xl">
        <div className="flex items-center justify-between text-[10px] mono">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-bold">
            <Activity size={13} className="text-amber-600 dark:text-amber-400" /> Physical Execution Completion
          </span>
          <span className="text-amber-800 dark:text-amber-300 font-bold text-xs">{progressPct}% Complete</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 p-0.5">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>

        {canUpdateProject && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[9px] mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-bold">
              <ShieldCheck size={13} /> Area Engineer Verification Active
            </span>
            <button
              onClick={() => {
                const next = progressPct >= 100 ? 25 : progressPct + 15;
                setProgressPct(next);
                toast(`Updated contractor progress to ${next}%`, 'emerald');
              }}
              className="text-[9.5px] mono text-amber-800 dark:text-amber-300 hover:text-amber-900 bg-amber-600/10 dark:bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-600/30 dark:border-amber-500/30 font-bold flex items-center gap-1 transition-colors"
            >
              <Edit3 size={11} /> Advance Progress (+15%)
            </button>
          </div>
        )}
      </div>

      {/* Project Specs Grid */}
      <div className="card p-4 grid grid-cols-2 gap-3 text-[10px] mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm rounded-2xl">
        <div>
          <span className="text-slate-500 dark:text-slate-400 block mb-0.5 flex items-center gap-1 font-bold">
            <HardHat size={12} /> Contractor
          </span>
          <span className="text-slate-900 dark:text-slate-100 font-bold">{proj.contractor}</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 block mb-0.5 flex items-center gap-1 font-bold">
            <DollarSign size={12} /> Total Value
          </span>
          <span className="text-amber-700 dark:text-amber-400 font-bold">{proj.value}</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 block mb-0.5 flex items-center gap-1 font-bold">
            <Calendar size={12} /> Completion Date
          </span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">{proj.completes}</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-bold">Access Code</span>
          <span className="text-amber-800 dark:text-amber-300 font-bold">{proj.code}</span>
        </div>
      </div>

      {/* Project Lifecycle Stage Switcher (Works in Progress vs 12-Month Defects Liability Period) */}
      <div className="card p-3 sm:p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm rounded-2xl space-y-2.5 font-mono text-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Building2 size={14} className="text-amber-600" />
              Contract Lifecycle Stage:
            </span>
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${
              lifecycleStage === 'defects'
                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:border-amber-700 dark:text-amber-300'
                : 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950 dark:border-teal-700 dark:text-teal-300'
            }`}>
              {lifecycleStage === 'defects' ? '12-Month Defects Liability Window' : 'Works In Progress'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setLifecycleStage('active');
                toast('Switched view to Contract Works in Progress', 'emerald');
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                lifecycleStage === 'active'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Works in Progress (Phases)
            </button>
            <button
              type="button"
              onClick={() => {
                setLifecycleStage('defects');
                toast('Switched view to 12-Month Defects Liability Period & Citizen Warranty Watch', 'amber');
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                lifecycleStage === 'defects'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Clock size={11} />
              <span>12-Month Defects (DLP)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ITEM 3: SUBCONTRACTOR & SITE DEPOT CHILD BRANCHES ($0 Free Delegation) */}
      <SiteDepotBranchesCard project={proj} toast={toast} />

      {/* ITEM 2: CONTRACTOR CSR DIRECT CORRIDOR GRANTS SECTION */}
      <div className="card p-4 sm:p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm rounded-2xl space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center shrink-0">
              <HeartHandshake size={16} />
            </div>
            <div>
              <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs block">
                Contractor Corridor CSR &amp; Grassroots Vaults
              </span>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                Direct corporate social responsibility grants dedicated to transport &amp; community hubs along {proj.title}.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCsrModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-[10.5px] flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
          >
            <Gift size={12} />
            <span>Disburse Contractor CSR to Parishes →</span>
          </button>
        </div>

        {/* List of Recent Corridor CSR Disbursements */}
        <div className="space-y-2 pt-1">
          {corridorCsrGrants.map((grant) => (
            <div
              key={grant.id}
              className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 flex-wrap"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{grant.itemTitle}</span>
                  <span className="text-[8.5px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-300">
                    Disbursed to {grant.targetGroup}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Parish: <strong>{grant.parish}</strong> · Date: {grant.disbursedAt}
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-300 italic pt-0.5">
                  "{grant.donorStatement}"
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                  UGX {grant.monetaryValueUgx.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-400 block font-semibold">{grant.itemCount} items</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ITEM 1: DEFECTS LIABILITY PERIOD (DLP) & CITIZEN WARRANTY WATCH (Shown in 'defects' mode) */}
      {lifecycleStage === 'defects' && (
        <DefectsLiabilityPanel
          project={proj}
          signingRole={signingRole}
          user={user}
          posts={posts}
          toast={toast}
          onOpenLightbox={(url, caption) => {
            setLightboxImage({
              id: 'lb-' + Date.now(),
              url,
              caption,
              uploadedAt: new Date().toISOString().split('T')[0],
              uploadedBy: 'Site Engineer / Citizen Reporter',
            });
          }}
          onReleaseRetentionSuccess={(warrant) => {
            setVoucherForPrint({
              voucherNumber: warrant.warrantNumber,
              projectTitle: proj.title,
              contractor: proj.contractor,
              milestoneTitle: 'Final Technical Handover & 5% Retention Escrow Clearance',
              grossAmount: warrant.retentionAmount,
              whtTaxDeduction: 0,
              retentionEscrowHold: 0,
              netPayable: warrant.retentionAmount,
              currency: warrant.currency || 'UGX',
              awarderSigner: warrant.awarderSigner || 'Supervising Engineer (Gov)',
              contractorSigner: `${proj.contractor} Managing Director`,
              issuedAt: warrant.releasedAt || new Date().toISOString(),
              disbursementStatus: 'completed_bank_transfer',
              blockchainSeal: warrant.sha256Seal,
            });
            setPrintableModalOpen(true);
          }}
        />
      )}

      {/* Milestones Timeline */}
      <div className="card p-5 space-y-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm rounded-2xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-[11px] mono text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5 font-black">
              <ListChecks size={15} className="text-amber-600 dark:text-amber-400" /> Dual-Verified Contract Milestones
            </p>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
              Requires 2 independent signatures (Procuring Entity + Contractor Exec) to confirm phase completion.
            </p>
          </div>
          <span className="text-[9px] mono text-amber-800 dark:text-amber-300 bg-amber-600/10 dark:bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-600/30 dark:border-amber-500/30 font-bold">
            2-Party Cryptographic Lock
          </span>
        </div>

        {/* Signing Duty Authority Switcher */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mono">
              <ShieldCheck size={14} className="text-amber-600 dark:text-amber-400" /> Active Signing Duty Authority:
            </span>
            <span className="text-[9px] mono text-slate-500 dark:text-slate-400">
              Select official role to perform signoff
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mono">
            <button
              type="button"
              onClick={() => {
                setSigningRole('awarder');
                toast('Active Duty set: Procuring Entity (Gov Supervising Engineer)', 'emerald');
              }}
              className={`p-2.5 rounded-lg border font-bold flex items-center justify-between transition-all ${
                signingRole === 'awarder'
                  ? 'bg-teal-50 border-teal-500 text-teal-900 dark:bg-teal-500/20 dark:border-teal-400 dark:text-teal-200 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Landmark size={13} strokeWidth={1.75} />
                <span>Procuring Entity (Gov Authority)</span>
              </span>
              {signingRole === 'awarder' && <span className="text-[9px] bg-teal-600 text-white dark:bg-teal-400 dark:text-slate-950 px-1.5 py-0.5 rounded font-black">ACTIVE</span>}
            </button>

            <button
              type="button"
              onClick={() => {
                setSigningRole('contractor');
                toast('Active Duty set: Contractor Executive / Site Engineer', 'amber');
              }}
              className={`p-2.5 rounded-lg border font-bold flex items-center justify-between transition-all ${
                signingRole === 'contractor'
                  ? 'bg-amber-600/15 border-amber-600/50 text-amber-900 dark:bg-amber-500/20 dark:border-amber-400 dark:text-amber-200 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <HardHat size={13} strokeWidth={1.75} />
                <span>Contractor Executive (Site Engineer)</span>
              </span>
              {signingRole === 'contractor' && <span className="text-[9px] bg-amber-700 text-white dark:bg-amber-400 dark:text-slate-950 px-1.5 py-0.5 rounded font-black">ACTIVE</span>}
            </button>
          </div>

          {/* Strict Separation Notice */}
          <div className="text-[9.5px] mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-start gap-2">
            <AlertTriangle size={14} strokeWidth={1.75} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">Strict Authority Isolation Enforced</span>
              {signingRole === 'awarder' ? (
                <span className="text-slate-600 dark:text-slate-300">
                  You are currently acting as <strong>Procuring Entity (Gov Authority)</strong>. You can <strong>ONLY</strong> sign the Procuring Entity slot. The Contractor slot is strictly locked for you.
                </span>
              ) : (
                <span className="text-slate-600 dark:text-slate-300">
                  You are currently acting as <strong>Contractor Executive / Site Engineer</strong>. You can <strong>ONLY</strong> sign the Contractor Exec slot. The Procuring Entity slot is strictly locked for you.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {milestones.map((m, idx) => {
            const awarderSigned = Boolean(m.awarderVerified);
            const contractorSigned = Boolean(m.contractorVerified);
            const dualVerified = m.done || (awarderSigned && contractorSigned);
            const countTicks = (awarderSigned ? 1 : 0) + (contractorSigned ? 1 : 0);

            return (
              <div
                key={m.id}
                className={`p-4 rounded-xl border transition-all text-xs mono space-y-3 ${
                  dualVerified
                    ? 'bg-emerald-50/60 border-emerald-300 dark:bg-emerald-950/25 dark:border-emerald-500/50 shadow-sm'
                    : countTicks === 1
                    ? 'bg-amber-50/60 border-amber-600/30 dark:bg-amber-950/20 dark:border-amber-500/40'
                    : 'bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800 shadow-sm'
                }`}
              >
                {/* Phase Header Badges & Verification Status */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-600/10 text-amber-800 dark:text-amber-300 border border-amber-600/30">
                      PHASE {idx + 1}
                    </span>
                    <span className="text-[9.5px] text-slate-600 dark:text-slate-400 font-bold">Target Stage: {m.date}</span>
                  </div>

                  <span
                    className={`text-[8.5px] font-bold px-2.5 py-1 rounded-md border ${
                      dualVerified
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-900 dark:bg-emerald-500/20 dark:border-emerald-500/50 dark:text-emerald-300'
                        : countTicks === 1
                        ? 'bg-amber-50 border-amber-600/30 text-amber-900 dark:bg-amber-500/20 dark:border-amber-500/40 dark:text-amber-300'
                        : 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {dualVerified ? '2/2 DUAL VERIFIED' : countTicks === 1 ? '1/2 PENDING COUNTERPART' : '0/2 UNVERIFIED'}
                  </span>
                </div>

                {/* Phase Title */}
                <div className="border-l-4 border-amber-600 pl-3 py-1.5 bg-slate-50 dark:bg-slate-900/80 rounded-r-lg">
                  <h3 className={`text-base font-bold tracking-tight leading-snug ${
                    dualVerified ? 'text-emerald-800 dark:text-emerald-200 line-through' : 'text-slate-900 dark:text-white'
                  }`}>
                    {m.title}
                  </h3>
                </div>

                {/* MANDATORY PICTORIAL EVIDENCE SECTION */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      <Camera size={13} className="text-amber-600 dark:text-amber-400" />
                      <span>On-Site Pictorial Evidence &amp; Engineering Dossier:</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {m.evidenceImages && m.evidenceImages.length > 0 ? (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          <span>{m.evidenceImages.length} On-Site Photos Attached</span>
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1">
                          <AlertTriangle size={10} />
                          <span>No Photos Attached (Sign-Off Blocked)</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenProcuringEntityInspector(m)}
                        className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-slate-800 dark:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye size={10} />
                        <span>Inspect Photos</span>
                      </button>

                      {signingRole === 'contractor' && (
                        <button
                          type="button"
                          onClick={() => handleOpenContractorEvidenceModal(m)}
                          className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-800 dark:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Upload size={10} />
                          <span>+ Upload Photos</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  {m.evidenceImages && m.evidenceImages.length > 0 ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {m.evidenceImages.map((img, photoIdx) => (
                          <div
                            key={img.id || photoIdx}
                            onClick={() => setLightboxImage(img)}
                            className="relative group cursor-pointer shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all w-24 h-16 bg-slate-900"
                            title={`${img.caption} (Click to inspect full resolution)`}
                          >
                            <img
                              src={img.url}
                              alt={img.caption}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-end p-1">
                              <span className="text-[8px] text-white truncate drop-shadow-sm font-sans font-medium">
                                #{photoIdx + 1} {img.caption.slice(0, 14)}...
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {m.contractorNotes && (
                        <p className="text-[10px] text-slate-600 dark:text-slate-300 font-sans italic border-l-2 border-amber-500/60 pl-2">
                          <strong>Contractor Note ({m.ipcNumber || 'IPC'}):</strong> {m.contractorNotes}
                        </p>
                      )}
                      {m.awarderAuditNotes && (
                        <p className="text-[10px] text-emerald-800 dark:text-emerald-300 font-sans border-l-2 border-emerald-500/60 pl-2">
                          <strong>Procuring Entity Audit:</strong> {m.awarderAuditNotes}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[9.5px] font-mono text-amber-800 dark:text-amber-300 flex items-center justify-between gap-2">
                      <span>
                        ⚠️ <strong>Procuring Entity Rule:</strong> Procuring entity cannot sign off this milestone without verified on-site photos of completed works.
                      </span>
                      {signingRole === 'contractor' && (
                        <button
                          type="button"
                          onClick={() => handleOpenContractorEvidenceModal(m)}
                          className="px-2 py-0.5 rounded bg-amber-600 text-white font-bold text-[9px] shrink-0 cursor-pointer"
                        >
                          Attach Now
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Interactive Dual Signoff Action Row */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Tick 1: Procuring Entity / Supervising Officer */}
                    {signingRole === 'awarder' ? (
                      m.evidenceImages && m.evidenceImages.length > 0 ? (
                        <button
                          type="button"
                          onClick={(e) => handleToggleAwarder(m.id, e)}
                          className={`px-3 py-1.5 rounded-lg border font-bold transition-all flex items-center gap-1.5 text-[10px] ${
                            awarderSigned
                              ? 'bg-teal-100 border-teal-400 text-teal-900 dark:bg-teal-500/25 dark:border-teal-400 dark:text-teal-200 cursor-pointer'
                              : 'bg-teal-700 text-white hover:bg-teal-600 cursor-pointer'
                          }`}
                        >
                          <Landmark size={11} strokeWidth={1.75} />
                          <span>Procuring Entity {awarderSigned ? 'Verified & Signed' : 'Verify & Sign Off'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            toast('SIGN-OFF BLOCKED: Contractor must upload on-site pictorial evidence before the Procuring Entity can verify!', 'amber');
                            handleOpenProcuringEntityInspector(m);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1.5 text-[10px] cursor-pointer"
                          title="Locked until contractor attaches pictorial evidence"
                        >
                          <Lock size={11} className="text-amber-600" />
                          <span>Blocked · Awaiting Evidence Photos</span>
                        </button>
                      )
                    ) : (
                      <div className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 text-slate-400 dark:text-slate-500 text-[10px] font-bold flex items-center gap-1.5 opacity-70">
                        <Lock size={11} />
                        <span>Gov Slot Locked {awarderSigned ? '(Signed)' : ''}</span>
                      </div>
                    )}

                    {/* Tick 2: Contractor Executive */}
                    {signingRole === 'contractor' ? (
                      <button
                        type="button"
                        onClick={(e) => handleToggleContractor(m.id, e)}
                        className={`px-3 py-1.5 rounded-lg border font-bold transition-all flex items-center gap-1.5 text-[10px] cursor-pointer ${
                          contractorSigned
                            ? 'bg-amber-50 border-amber-600/40 text-amber-900 dark:bg-amber-500/25 dark:border-amber-400 dark:text-amber-200'
                            : 'bg-amber-700 text-white hover:bg-amber-600'
                        }`}
                      >
                        <HardHat size={11} strokeWidth={1.75} />
                        <span>Contractor Exec {contractorSigned ? 'Signed' : (m.evidenceImages && m.evidenceImages.length > 0 ? '+ Sign Milestone' : '+ Attach Photos & Sign')}</span>
                      </button>
                    ) : (
                      <div className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 text-slate-400 dark:text-slate-500 text-[10px] font-bold flex items-center gap-1.5 opacity-70">
                        <Lock size={11} />
                        <span>Contractor Slot Locked {contractorSigned ? '(Signed)' : ''}</span>
                      </div>
                    )}
                  </div>

                  {/* Audit Trail Signatures display */}
                  <div className="text-[9px] text-slate-600 dark:text-slate-400 flex items-center gap-2.5 ml-auto flex-wrap">
                    {m.awarderSignedBy ? (
                      <span className="text-teal-800 dark:text-teal-300 font-bold bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800/60">
                        Gov: {m.awarderSignedBy} ({m.awarderSignedAt || 'Verified'})
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 italic">Gov: Pending Review</span>
                    )}

                    {m.contractorSignedBy ? (
                      <span className="text-amber-800 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/60">
                        Exec: {m.contractorSignedBy} ({m.contractorSignedAt || 'Verified'})
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 italic">Exec: Pending Claim</span>
                    )}

                    {dualVerified && (
                      <button
                        type="button"
                        onClick={() => handleGenerateDisbursementVoucher(m)}
                        disabled={isMintingVoucher}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[9.5px] transition-colors shadow-xs flex items-center gap-1"
                      >
                        <ShieldCheck size={11} />
                        <span>{isMintingVoucher ? 'Minting...' : 'Mint Fiscal Warrant'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {canUpdateProject && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-[8.5px] mono text-slate-600 dark:text-slate-400 uppercase tracking-wider block font-bold">+ Add New Contract Deliverable / Milestone</span>
            <div className="grid grid-cols-3 gap-1.5">
              <input
                type="text"
                value={newWallMilestoneTitle}
                onChange={(e) => setNewWallMilestoneTitle(e.target.value)}
                placeholder="Milestone title (e.g. Asphalting Complete)"
                className="col-span-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2"
              />
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newWallMilestoneDate}
                  onChange={(e) => setNewWallMilestoneDate(e.target.value)}
                  placeholder="Stage / Date"
                  className="text-xs w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-2.5 py-2"
                />
                <button
                  onClick={handleAddWallMilestone}
                  className="bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs px-3 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                  title="Add milestone"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Community & Field Inspection Wall */}
      <div className="space-y-3">
        {/* Wall Reward Banner for Entities & Contractors */}
        <div className="card p-3.5 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2 rounded-xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-600/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-600/20 dark:border-amber-500/30">
                <Gift size={18} />
              </span>
              <div>
                <strong className="text-xs text-amber-900 dark:text-amber-200 block font-bold">
                  Reward Citizen Wall Engagement
                </strong>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">
                  <span className="text-teal-700 dark:text-teal-300 font-semibold">{user?.dept_label || 'Entity Authority'}</span> & Contractor <span className="text-amber-800 dark:text-amber-300 font-semibold">{proj.contractor}</span> can dispatch digital perk vouchers to active citizens.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCitizenForReward({
                  name: projectPosts[0]?.citizen_name || 'Inzama Robin',
                  phone: '+256 778 277 900 / +256 748 338 796',
                  postId: projectPosts[0]?.id,
                });
                setRewardModalOpen(true);
              }}
              className="bg-amber-700 hover:bg-amber-600 text-white font-bold px-3.5 py-2 rounded-xl text-[10px] uppercase tracking-wider mono flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Zap size={13} />
              <span>Reward Wall Watchdog</span>
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-[10px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest font-bold">Public & Field Inspection Wall</p>
          <span className="text-[9px] mono text-slate-500">{projectPosts.length} reports</span>
        </div>

        <div className="card p-4 space-y-3.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <label className="text-[10px] mono text-amber-800 dark:text-amber-400 font-bold uppercase tracking-widest block flex items-center gap-1.5">
              <Edit3 size={14} /> Log On-Site Inspection Memo
            </label>
            <span className="text-[9px] mono text-slate-500 dark:text-slate-400 font-bold">
              Public Ledger Audit
            </span>
          </div>

          {/* Provision for Title / Official Capacity Selection */}
          <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-[9.5px] mono font-bold text-slate-800 dark:text-slate-300">
              <span className="uppercase tracking-wider">Identify Capacity / Title:</span>
              <span className="text-amber-800 dark:text-amber-300 font-semibold">Specify capacity of statement</span>
            </div>

            {/* Quick Capacity Preset Chips */}
            <div className="flex flex-wrap gap-1.5 text-[9.5px] mono">
              {capacityPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setInspectorCapacity(preset)}
                  className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    inspectorCapacity === preset
                      ? 'bg-amber-600/15 border-amber-600/40 text-amber-900 dark:bg-amber-500/20 dark:border-amber-400 dark:text-amber-200 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Custom Capacity Designation Text Provision */}
            <div className="pt-1">
              <input
                type="text"
                value={inspectorCapacity}
                onChange={(e) => setInspectorCapacity(e.target.value)}
                placeholder="Or type custom capacity e.g. World Bank Auditor, RDC, Media Reporter, Site Engineer, Local Resident..."
                className="w-full text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          {/* Statement & Observations Textarea */}
          <div className="space-y-1">
            <label className="text-[9.5px] mono text-slate-600 dark:text-slate-400 uppercase tracking-wider block font-bold">
              Log Findings & Inspection Observations:
            </label>
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Log technical site findings, material quality audit, work progress observation, or local community feedback..."
              className="text-xs resize-none w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3"
            ></textarea>
          </div>

          <button
            onClick={handlePostProjectFeedback}
            className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl py-2.5 text-[10px] uppercase tracking-widest mono transition-all active:scale-[.98] shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>Log Site Inspection Memo ({inspectorCapacity || 'Unspecified Role'})</span>
          </button>
        </div>

        <div className="space-y-2">
          {projectPosts.length === 0 ? (
            <p className="text-center py-8 text-xs mono text-slate-500">No public reports logged on this project wall yet.</p>
          ) : (
            projectPosts.map((p) => (
              <div key={p.id} className="relative group">
                <PostCardComponent post={p} />
                <div className="px-4 pb-3 -mt-1 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCitizenForReward({
                        name: p.citizen_name || 'Verified Citizen',
                        phone: '+256 778 277 900 / +256 748 338 796',
                        postId: p.id,
                      });
                      setRewardModalOpen(true);
                    }}
                    className="text-[9.5px] mono font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-600/30 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                  >
                    <Gift size={11} /> Reward {p.citizen_name.split(' ')[0]} with Perk
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reward Citizen Modal */}
      <RewardModal
        isOpen={rewardModalOpen}
        onClose={() => setRewardModalOpen(false)}
        targetCitizenName={selectedCitizenForReward.name}
        targetCitizenPhone={selectedCitizenForReward.phone}
        postId={selectedCitizenForReward.postId}
        contractorName={proj.contractor}
        entityName={user?.dept_label || proj.dept.toUpperCase()}
        contextTitle={proj.title}
      />

      {/* PHASE 3: FISCAL RELEASE WARRANT & DISBURSEMENT VOUCHER MODAL */}
      {activeVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[9px] mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-black block">
                  MoFPED Public Works Electronic Warrant Authority
                </span>
                <h3 className="text-lg font-black text-slate-950 dark:text-white">
                  Milestone Disbursement Warrant #{activeVoucher.voucherNumber}
                </h3>
              </div>
              <button
                onClick={() => setActiveVoucher(null)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                ×
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Project / Asset:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{activeVoucher.projectTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contractor Recipient:</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">{activeVoucher.contractor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Milestone Deliverable:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{activeVoucher.milestoneTitle}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gross Milestone Value:</span>
                  <span>{activeVoucher.currency} {activeVoucher.grossAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-rose-600 dark:text-rose-400">
                  <span>6% Statutory WHT Deduction:</span>
                  <span>- {activeVoucher.currency} {activeVoucher.whtTaxDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-emerald-600 dark:text-emerald-400 pt-1 border-t border-slate-300 dark:border-slate-700">
                  <span>Net Escrow Release Amount:</span>
                  <span>{activeVoucher.currency} {activeVoucher.netPayable.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] mono text-slate-500 dark:text-slate-400 space-y-1">
              <div>• Procuring Signoff: {activeVoucher.awarderSigner}</div>
              <div>• Contractor Signoff: {activeVoucher.contractorSigner}</div>
              <div>• Blockchain Audit Seal: <span className="text-teal-600 dark:text-teal-400 font-bold">{activeVoucher.blockchainSeal}</span></div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800 flex-wrap">
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase ${
                activeVoucher.disbursementStatus === 'completed_bank_transfer'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {activeVoucher.disbursementStatus === 'completed_bank_transfer' ? 'Disbursed to Bank' : 'Certified: Pending Release'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setVoucherForPrint(activeVoucher);
                    setPrintableModalOpen(true);
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print / Save Warrant Slip</span>
                </button>

                {activeVoucher.disbursementStatus !== 'completed_bank_transfer' ? (
                  <button
                    onClick={() => handleReleaseEscrowFunds(activeVoucher.id)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck size={14} />
                    <span>Authorize Bank Disbursement Release →</span>
                  </button>
                ) : (
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    Warrant Settled via RTGS / Bank Escrow
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: CONTRACTOR MILESTONE EVIDENCE & PHOTO UPLOAD */}
      {evidenceModalMode === 'contractor_upload' && selectedMilestoneForEvidence && (
        <div
          onClick={() => {
            setEvidenceModalMode(null);
            setSelectedMilestoneForEvidence(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#161a22] border border-amber-500/40 rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto text-slate-900 dark:text-slate-100"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center shrink-0">
                  <Camera size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400 font-bold block">
                    Mandatory Contractor Physical Proof · Milestone Delivery
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Attach Pictorial Evidence: {selectedMilestoneForEvidence.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEvidenceModalMode(null);
                  setSelectedMilestoneForEvidence(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Instruction Banner */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-slate-700 dark:text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                <AlertTriangle size={13} />
                <span>Statutory Procurement Requirement</span>
              </div>
              <p>
                The Procuring Entity (Supervising Engineer) cannot sign off this completed milestone without clear on-site photographic evidence. Attach actual photographs showing completed excavation, concrete casting, compaction, or installation.
              </p>
            </div>

            {/* Project & Milestone Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
                <span className="text-[9.5px] text-slate-400 block uppercase">Contractor</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{proj.contractor}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
                <span className="text-[9.5px] text-slate-400 block uppercase">IPC Claim Reference</span>
                <input
                  type="text"
                  value={ipcNumberInput}
                  onChange={(e) => setIpcNumberInput(e.target.value)}
                  placeholder="e.g. IPC-03/2026"
                  className="w-full bg-transparent font-bold text-amber-600 dark:text-amber-400 focus:outline-none"
                />
              </div>
              <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
                <span className="text-[9.5px] text-slate-400 block uppercase">GPS / Chainage Stamp</span>
                <input
                  type="text"
                  value={gpsTagInput}
                  onChange={(e) => setGpsTagInput(e.target.value)}
                  placeholder="e.g. 0.3478° N, 32.5829° E"
                  className="w-full bg-transparent font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Contractor Technical Note */}
            <div>
              <label className="text-[10.5px] font-mono text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                Contractor BOQ Delivery Statement &amp; Engineering Details
              </label>
              <textarea
                rows={2}
                value={contractorNotesInput}
                onChange={(e) => setContractorNotesInput(e.target.value)}
                placeholder="Describe completed works, materials used, concrete grade (C25/C30), layer compaction percentage, or test results..."
                className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-[#12161f] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Quick-Select Sample Engineering Photo Presets (for instant live testing) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-mono text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                  <Sparkles size={11} className="text-amber-500" />
                  <span>1-Tap Realistic Civil Engineering Photo Presets:</span>
                </span>
                <span className="text-[9.5px] font-mono text-slate-400">Click to add preset photo</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {SAMPLE_CIVIL_PHOTO_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const newPhoto: MilestoneEvidenceImage = {
                        id: `ev-upload-${Date.now()}-${idx}`,
                        url: preset.url,
                        caption: preset.caption,
                        uploadedAt: new Date().toISOString().split('T')[0],
                        uploadedBy: `${proj.contractor} Lead Site Engineer`,
                        gpsTag: gpsTagInput || '0.3478° N, 32.5829° E',
                      };
                      setUploadedImages((prev) => [...prev, newPhoto]);
                      toast(`Added "${preset.title}" to evidence dossier!`, 'emerald');
                    }}
                    className="p-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-amber-500/60 border border-[#e3e6ea] dark:border-[#262b36] text-left flex items-center gap-2 transition-all cursor-pointer group"
                  >
                    <img src={preset.url} alt={preset.title} className="w-10 h-10 rounded object-cover shrink-0" />
                    <div className="truncate text-left">
                      <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-amber-600">
                        {preset.title}
                      </div>
                      <div className="text-[8.5px] font-mono text-slate-400 truncate">
                        + Add photo to milestone
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Or Custom Photo Upload / URL Entry */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 uppercase block">
                Or Upload from Camera / Device / Custom URL:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="Paste Image URL (https://...)"
                  className="sm:col-span-2 px-3 py-1.5 text-xs font-mono bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!customImageUrl.trim()) {
                      toast('Paste a valid image URL first', 'amber');
                      return;
                    }
                    const newPhoto: MilestoneEvidenceImage = {
                      id: `ev-custom-${Date.now()}`,
                      url: customImageUrl.trim(),
                      caption: customCaption.trim() || 'On-site engineering inspection evidence',
                      uploadedAt: new Date().toISOString().split('T')[0],
                      uploadedBy: `${proj.contractor} Site Agent`,
                      gpsTag: gpsTagInput || '0.3478° N, 32.5829° E',
                    };
                    setUploadedImages((prev) => [...prev, newPhoto]);
                    setCustomImageUrl('');
                    setCustomCaption('');
                    toast('Custom photo attached to evidence dossier!', 'emerald');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus size={12} />
                  <span>Attach Image</span>
                </button>
              </div>
            </div>

            {/* Current Attached Photos Gallery with Delete Action */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  <span>Photos Staged for Milestone ({uploadedImages.length}):</span>
                </span>
                <span className="text-slate-400 text-[10px]">
                  {uploadedImages.length > 0 ? 'Ready for submission' : 'At least 1 photo required'}
                </span>
              </div>

              {uploadedImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {uploadedImages.map((img, idx) => (
                    <div
                      key={img.id || idx}
                      className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 group"
                    >
                      <img src={img.url} alt={img.caption} className="w-full h-24 object-cover" />
                      <div className="p-1.5 bg-white/95 dark:bg-[#161a22]/95 border-t border-slate-200 dark:border-slate-800">
                        <div className="text-[9px] font-mono text-slate-800 dark:text-slate-200 truncate font-semibold" title={img.caption}>
                          {img.caption}
                        </div>
                        <div className="text-[8px] font-mono text-slate-400 truncate">
                          {img.gpsTag || 'GPS Geotagged'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center text-xs shadow-md cursor-pointer"
                        title="Remove photo"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl text-slate-400 text-xs font-mono">
                  No photographs staged yet. Tap a preset above or paste an image URL to attach evidence.
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setEvidenceModalMode(null);
                  setSelectedMilestoneForEvidence(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveContractorEvidenceAndSign}
                disabled={uploadedImages.length === 0}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <Camera size={14} />
                <span>Submit Pictorial Evidence &amp; Sign Contractor Slot</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PROCURING ENTITY (GOV) EVIDENCE INSPECTOR & AUDIT SIGN-OFF */}
      {evidenceModalMode === 'procuring_entity_inspect' && selectedMilestoneForEvidence && (
        <div
          onClick={() => {
            setEvidenceModalMode(null);
            setSelectedMilestoneForEvidence(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#161a22] border border-teal-500/40 rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto text-slate-900 dark:text-slate-100"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-600 flex items-center justify-center shrink-0">
                  <Landmark size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-teal-700 dark:text-teal-400 font-bold block">
                    Procuring Entity Supervisory Technical Audit
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Inspect Milestone Proof: {selectedMilestoneForEvidence.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEvidenceModalMode(null);
                  setSelectedMilestoneForEvidence(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Evidence Evaluation Status */}
            {selectedMilestoneForEvidence.evidenceImages && selectedMilestoneForEvidence.evidenceImages.length > 0 ? (
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-[11px] font-mono text-slate-700 dark:text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-teal-800 dark:text-teal-300">
                  <CheckCircle2 size={13} />
                  <span>Contractor Pictorial Evidence Ready for Supervisory Audit</span>
                </div>
                <p>
                  {selectedMilestoneForEvidence.evidenceImages.length} photographic records uploaded by contractor <strong>{proj.contractor}</strong>. Review below prior to appending the Procuring Entity sign-off.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[11px] font-mono text-rose-800 dark:text-rose-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle size={14} />
                  <span>SIGN-OFF STRICTLY BLOCKED: No Evidence Photos Uploaded</span>
                </div>
                <p>
                  Contractor has not attached photographic evidence of completed physical works for this stage. The Procuring Entity cannot certify or authorize milestone disbursements without on-site proof.
                </p>
              </div>
            )}

            {/* Contractor Technical Note & IPC Claim */}
            <div className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono space-y-1.5">
              <div className="flex items-center justify-between text-slate-500 text-[10px]">
                <span>Contractor: <strong>{proj.contractor}</strong></span>
                <span>IPC Claim: <strong>{selectedMilestoneForEvidence.ipcNumber || 'IPC-03/2026'}</strong></span>
                <span>Date: <strong>{selectedMilestoneForEvidence.contractorSignedAt || selectedMilestoneForEvidence.date}</strong></span>
              </div>
              <div className="text-slate-800 dark:text-slate-200">
                <strong>Contractor Statement:</strong> {selectedMilestoneForEvidence.contractorNotes || 'Structural works completed in accordance with BoQ specifications and core compaction tests.'}
              </div>
            </div>

            {/* High-Resolution Photo Gallery */}
            {selectedMilestoneForEvidence.evidenceImages && selectedMilestoneForEvidence.evidenceImages.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">
                  Verified On-Site Photographs (Click to enlarge):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedMilestoneForEvidence.evidenceImages.map((img, idx) => (
                    <div
                      key={img.id || idx}
                      onClick={() => setLightboxImage(img)}
                      className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 cursor-pointer hover:border-teal-500 transition-all group"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={img.url}
                          alt={img.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white font-mono text-[9px] flex items-center gap-1">
                          <Eye size={10} />
                          <span>Inspect Fullscreen</span>
                        </div>
                      </div>
                      <div className="p-2.5 bg-white dark:bg-[#161a22] space-y-1 text-[10px] font-mono">
                        <div className="font-bold text-slate-900 dark:text-white leading-tight">
                          {img.caption}
                        </div>
                        <div className="flex items-center justify-between text-slate-400 text-[9px]">
                          <span>GPS: {img.gpsTag || 'Verified Geotag'}</span>
                          <span>Uploaded: {img.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Procuring Entity Supervisory Audit Notes Input */}
            <div>
              <label className="text-[10.5px] font-mono text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                Supervising Engineer / CAO Inspector Statutory Audit Memo
              </label>
              <textarea
                rows={2}
                value={awarderAuditNotesInput}
                onChange={(e) => setAwarderAuditNotesInput(e.target.value)}
                placeholder="Enter technical audit findings (e.g. Slump test C30 compliant, drainage gradient verified, core samples approved)..."
                className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-[#12161f] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setEvidenceModalMode(null);
                  setSelectedMilestoneForEvidence(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold cursor-pointer"
              >
                Close Dossier
              </button>

              {signingRole === 'awarder' && (
                <button
                  type="button"
                  onClick={handleProcuringEntityVerifyEvidenceAndSign}
                  disabled={!selectedMilestoneForEvidence.evidenceImages || selectedMilestoneForEvidence.evidenceImages.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Landmark size={14} />
                  <span>Verify Evidence &amp; Append Procuring Entity Sign-Off</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: FULLSCREEN HIGH-RES LIGHTBOX */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-3 p-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-white">
              <div className="text-xs font-mono font-bold flex items-center gap-2">
                <Camera size={14} className="text-amber-500" />
                <span>On-Site Photographic Evidence (Full Resolution)</span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[70vh] flex items-center justify-center bg-black rounded-2xl overflow-hidden">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.caption}
                className="max-h-[68vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
              <div className="font-bold text-white text-sm">{lightboxImage.caption}</div>
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>GPS Location: <strong>{lightboxImage.gpsTag || 'Chainage Geotagged'}</strong></span>
                <span>Uploaded By: <strong>{lightboxImage.uploadedBy}</strong> ({lightboxImage.uploadedAt})</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contractor CSR Direct Corridor Disburse Modal */}
      <ContractorCsrModal
        isOpen={csrModalOpen}
        onClose={() => setCsrModalOpen(false)}
        project={proj}
        user={user}
        onDisburseSuccess={(grant) => setCorridorCsrGrants((prev) => [grant, ...prev])}
        toast={toast}
      />

      {/* Printable MoFPED Treasury Warrant Slip Modal */}
      <PrintableTreasuryWarrantModal
        isOpen={printableModalOpen}
        onClose={() => setPrintableModalOpen(false)}
        voucher={voucherForPrint}
        project={proj}
      />
    </div>
  );
};
