import React, { useState } from 'react';
import {
  X,
  UserCheck,
  UserX,
  UserPlus,
  Shield,
  MapPin,
  Mail,
  Phone,
  Globe,
  Radio,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  CdOpsStaffMember,
  CD_OPS_ROLE_DEFINITIONS,
  CdOpsRoleDefinition,
} from '../../data/partnerships';
import { COUNTRIES } from '../../data/countries';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  staffToEdit?: CdOpsStaffMember | null;
}

const REGION_OPTIONS = ['UG', 'KE', 'NG', 'GH', 'RW', 'TZ', 'ZA', 'ET', 'SN', 'ALL'];

export const CdOpsStaffManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  staffToEdit,
}) => {
  const { addCdOpsStaff, updateCdOpsStaff, removeCdOpsStaff, reassignCdOpsRole, toast } = useApp();

  const isEditing = !!staffToEdit;

  // Form State
  const [name, setName] = useState(staffToEdit ? staffToEdit.name : '');
  const [role, setRole] = useState(
    staffToEdit ? staffToEdit.role : CD_OPS_ROLE_DEFINITIONS[0].title
  );
  const [email, setEmail] = useState(
    staffToEdit ? staffToEdit.email : ''
  );
  const [phone, setPhone] = useState(staffToEdit?.phone || '');
  const [dutyStation, setDutyStation] = useState(
    staffToEdit ? staffToEdit.dutyStation : 'Kampala & Regional Hub'
  );
  const [avatar, setAvatar] = useState(
    staffToEdit
      ? staffToEdit.avatar
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  );
  const [status, setStatus] = useState<'online' | 'on_call' | 'standby'>(
    staffToEdit ? staffToEdit.status : 'online'
  );
  const [handlingRegions, setHandlingRegions] = useState<string[]>(
    staffToEdit ? staffToEdit.handlingRegions : ['UG', 'KE']
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync when staffToEdit changes
  React.useEffect(() => {
    if (staffToEdit) {
      setName(staffToEdit.name);
      setRole(staffToEdit.role);
      setEmail(staffToEdit.email);
      setPhone(staffToEdit.phone || '');
      setDutyStation(staffToEdit.dutyStation);
      setAvatar(staffToEdit.avatar);
      setStatus(staffToEdit.status);
      setHandlingRegions(staffToEdit.handlingRegions);
      setShowDeleteConfirm(false);
    } else {
      setName('');
      setRole(CD_OPS_ROLE_DEFINITIONS[0].title);
      setEmail('');
      setPhone('');
      setDutyStation('Kampala & Regional Hub');
      setAvatar(
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
      );
      setStatus('online');
      setHandlingRegions(['UG', 'KE']);
      setShowDeleteConfirm(false);
    }
  }, [staffToEdit, isOpen]);

  if (!isOpen) return null;

  const handleRegionToggle = (reg: string) => {
    if (reg === 'ALL') {
      setHandlingRegions(handlingRegions.includes('ALL') ? ['UG'] : ['ALL']);
      return;
    }
    const filtered = handlingRegions.filter((r) => r !== 'ALL');
    if (filtered.includes(reg)) {
      const next = filtered.filter((r) => r !== reg);
      setHandlingRegions(next.length ? next : ['UG']);
    } else {
      setHandlingRegions([...filtered, reg]);
    }
  };

  const handleSelectRolePreset = (preset: CdOpsRoleDefinition) => {
    setRole(preset.title);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast('Staff member full name is required', 'red');
      return;
    }
    if (!email.trim()) {
      toast('Official civicduty.org email required', 'red');
      return;
    }

    if (isEditing && staffToEdit) {
      updateCdOpsStaff(staffToEdit.id, {
        name: name.trim(),
        role: role.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        dutyStation: dutyStation.trim(),
        avatar: avatar.trim(),
        status,
        handlingRegions,
      });
      onClose();
    } else {
      const newStaff: CdOpsStaffMember = {
        id: `cd-ops-${Date.now().toString().slice(-4)}`,
        name: name.trim(),
        role: role.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        dutyStation: dutyStation.trim(),
        avatar:
          avatar.trim() ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        status,
        handlingRegions,
        joinedDate: new Date().toISOString().slice(0, 10),
        activeAssignmentsCount: 0,
      };
      addCdOpsStaff(newStaff);
      onClose();
    }
  };

  const handleDelete = () => {
    if (!staffToEdit) return;
    removeCdOpsStaff(staffToEdit.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              {isEditing ? <Briefcase size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {isEditing ? 'Manage Staff & Role Assignment' : 'Add CD-Ops Staff Engineer'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sovereign duty station credentials, role specializations &amp; region coverage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Delete Confirmation Warning */}
        {showDeleteConfirm && staffToEdit && (
          <div className="p-4 bg-rose-500/10 border-b border-rose-500/30 space-y-3 animate-fade-in">
            <div className="flex items-start gap-3 text-rose-700 dark:text-rose-400">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase mono">Stand Down / Remove Staff Member</h4>
                <p className="text-[11.5px] mt-0.5 text-slate-700 dark:text-slate-300">
                  Are you sure you want to stand down <strong>{staffToEdit.name}</strong> from the active CD-Ops duty roster? This will reassign any active dispatches to standby operators.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
              >
                Confirm Stand Down
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Preset Roles Picker */}
          <div className="space-y-2">
            <label className="text-[11px] mono font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span>Standard Operational Role Presets</span>
              <span className="text-[9px] text-amber-600 dark:text-amber-400">Click to apply role</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CD_OPS_ROLE_DEFINITIONS.map((rDef) => {
                const isSelected = role === rDef.title;
                return (
                  <button
                    key={rDef.id}
                    type="button"
                    onClick={() => handleSelectRolePreset(rDef)}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {rDef.title}
                      </span>
                      <span className="text-[8px] mono px-1.5 py-0.2 rounded font-bold uppercase bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {rDef.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                      {rDef.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name & Custom Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] mono font-bold uppercase text-slate-600 dark:text-slate-400">
                Staff Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Eng. Ronald Ssematimba"
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] mono font-bold uppercase text-slate-600 dark:text-slate-400">
                Assigned Role Title *
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Lead Sovereign Infrastructure Architect"
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] mono font-bold uppercase text-slate-600 dark:text-slate-400">
                Official Email (@civicduty.org) *
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-2.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="r.ssematimba@civicduty.org"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] mono font-bold uppercase text-slate-600 dark:text-slate-400">
                Direct Hotline / Phone
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+256 772 109 840"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Duty Station & Operational Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] mono font-bold uppercase text-slate-600 dark:text-slate-400">
                Duty Station / Hub
              </label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={dutyStation}
                  onChange={(e) => setDutyStation(e.target.value)}
                  placeholder="e.g. Kampala & Regional Hub"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] mono font-bold uppercase text-slate-600 dark:text-slate-400">
                Duty Roster Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['online', 'on_call', 'standby'] as const).map((st) => {
                  const isCur = status === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st)}
                      className={`px-2.5 py-2 rounded-xl text-[11px] font-bold capitalize transition-all border ${
                        isCur
                          ? st === 'online'
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500'
                            : st === 'on_call'
                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-400'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Regional Jurisdictions */}
          <div className="space-y-2">
            <label className="text-[11px] mono font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span>Authorized Global Jurisdictions ({Object.keys(COUNTRIES).length} Nations)</span>
              <span className="text-[9px] text-slate-400">Select or add any country</span>
            </label>
            <div className="flex items-center gap-2">
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) handleRegionToggle(e.target.value);
                }}
                aria-label="Add Country Jurisdiction"
                className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500 cursor-pointer"
              >
                <option value="">+ Select any of {Object.keys(COUNTRIES).length} Global Countries to Toggle...</option>
                <option value="ALL">ALL GLOBAL JURISDICTIONS</option>
                {Object.entries(COUNTRIES).map(([cCode, cInfo]) => (
                  <option key={cCode} value={cCode}>
                    [{cCode}] {cInfo.name} {handlingRegions.includes(cCode) ? '(Active)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from(new Set([...REGION_OPTIONS, ...handlingRegions])).map((code) => {
                const isSelected = handlingRegions.includes(code);
                const c = COUNTRIES[code as any];
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleRegionToggle(code)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{code === 'ALL' ? 'ALL GLOBAL' : `[${code}] ${c?.name || code}`}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Avatar URL */}
          <div className="space-y-1.5">
            <label className="text-[11px] mono font-bold uppercase text-slate-600 dark:text-slate-400">
              Staff Photo Avatar URL
            </label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500 font-mono text-[10px]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            {isEditing ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1.5"
              >
                <UserX size={14} /> Stand Down Staff
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md transition-all flex items-center gap-1.5"
              >
                {isEditing ? <UserCheck size={14} /> : <UserPlus size={14} />}
                {isEditing ? 'Save Changes' : 'Add to Active Roster'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
