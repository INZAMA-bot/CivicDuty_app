import { EntityCustomRole, EntityRolePermissions } from '../types';

export const ROLE_COLORS = [
  { id: 'emerald', label: 'Emerald Green', bg: 'bg-emerald-500/15', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-500', hex: '#10b981' },
  { id: 'indigo', label: 'Indigo Blue', bg: 'bg-indigo-500/15', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-500/30', dot: 'bg-indigo-500', hex: '#6366f1' },
  { id: 'amber', label: 'Amber Orange', bg: 'bg-amber-500/15', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-500', hex: '#f59e0b' },
  { id: 'purple', label: 'Purple Violet', bg: 'bg-purple-500/15', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-500/30', dot: 'bg-purple-500', hex: '#a855f7' },
  { id: 'rose', label: 'Rose Pink', bg: 'bg-rose-500/15', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-500/30', dot: 'bg-rose-500', hex: '#f43f5e' },
  { id: 'cyan', label: 'Cyan Teal', bg: 'bg-cyan-500/15', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-500/30', dot: 'bg-cyan-500', hex: '#06b6d4' },
  { id: 'slate', label: 'Slate Gray', bg: 'bg-slate-500/15', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-500/30', dot: 'bg-slate-400', hex: '#64748b' },
];

export const PERMISSION_DESCRIPTIONS: {
  key: keyof EntityRolePermissions;
  label: string;
  desc: string;
  iconName: string;
}[] = [
  {
    key: 'can_reply',
    label: 'Respond to Reviews & Citizen Tickets',
    desc: 'Authorized to draft and publish public replies to customer feedback, patron complaints, and inquiries.',
    iconName: 'MessageSquare',
  },
  {
    key: 'can_resolve',
    label: 'Investigate & Mark Resolved',
    desc: 'Authorized to update ticket statuses to "Investigating" or "Resolved" and attach verification photos.',
    iconName: 'CheckCircle2',
  },
  {
    key: 'can_broadcast',
    label: 'Publish Bulletins & Advisories',
    desc: 'Authorized to broadcast official public notices, schedule updates, menu changes, promotions, and announcements.',
    iconName: 'Megaphone',
  },
  {
    key: 'can_view_billing',
    label: 'View Invoices & Billing Details',
    desc: 'Can access invoices, receipts, payment history, and seat quota subscriptions.',
    iconName: 'Receipt',
  },
  {
    key: 'can_manage_staff',
    label: 'Invite Staff & Manage Shifts',
    desc: 'Authorized to mint new staff access codes, reassign roles, and configure shift duty stations.',
    iconName: 'Users',
  },
];

export const SECTOR_DEFAULT_ROLES: Record<string, Omit<EntityCustomRole, 'id' | 'dept'>[]> = {
  nightlife_bars: [
    {
      title: 'Shift Duty Manager',
      description: 'Oversees day/night shift operations, floor coordination, customer escalation handling, and duty rosters.',
      color: 'purple',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: true, can_view_billing: false, can_manage_staff: true },
      is_default: true,
    },
    {
      title: 'Head Bartender & Floor Lead',
      description: 'Manages bar service speed, beverage stock complaints, and customer service satisfaction on the floor.',
      color: 'amber',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: false, can_view_billing: false, can_manage_staff: false },
      is_default: true,
    },
    {
      title: 'Cashier & POS Supervisor',
      description: 'Handles billing inquiries, payment discrepancies, receipt reconciliations, and financial verification.',
      color: 'emerald',
      permissions: { can_reply: true, can_resolve: false, can_broadcast: false, can_view_billing: true, can_manage_staff: false },
      is_default: true,
    },
    {
      title: 'Safety & Hospitality Host',
      description: 'Monitors patron welfare, lost & found items, venue security, and VIP reservation desk inquiries.',
      color: 'indigo',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: false, can_view_billing: false, can_manage_staff: false },
      is_default: true,
    },
  ],
  retail_shops: [
    {
      title: 'Store Operations Manager',
      description: 'Full supervisory authority over store stock, aisle leads, price updates, and customer service resolution.',
      color: 'emerald',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: true, can_view_billing: true, can_manage_staff: true },
      is_default: true,
    },
    {
      title: 'Customer Care & POS Lead',
      description: 'Handles product inquiries, exchanges, warranty claims, and checkout reviews.',
      color: 'cyan',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: false, can_view_billing: false, can_manage_staff: false },
      is_default: true,
    },
    {
      title: 'Inventory & Dispatch Clerk',
      description: 'Manages incoming stock deliveries, supplier confirmations, and order fulfillment tickets.',
      color: 'amber',
      permissions: { can_reply: false, can_resolve: true, can_broadcast: false, can_view_billing: false, can_manage_staff: false },
      is_default: true,
    },
  ],
  pharmacy_chemists: [
    {
      title: 'Supervising Pharmacist',
      description: 'Statutory oversight, prescription verification, drug safety compliance, and patient advisories.',
      color: 'emerald',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: true, can_view_billing: true, can_manage_staff: true },
      is_default: true,
    },
    {
      title: 'Dispensing Pharmacy Technician',
      description: 'Assists customers with medication availability, dosages, drug schedules, and standard inquiries.',
      color: 'cyan',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: false, can_view_billing: false, can_manage_staff: false },
      is_default: true,
    },
    {
      title: 'Stock & Storage Technologist',
      description: 'Maintains cold chain logs, batch expiration tracking, and supplier intake verifications.',
      color: 'indigo',
      permissions: { can_reply: false, can_resolve: true, can_broadcast: false, can_view_billing: false, can_manage_staff: false },
      is_default: true,
    },
  ],
  food_dining: [
    {
      title: 'Restaurant General Manager',
      description: 'Supervises dining floor, kitchen workflow, customer feedback loops, and hygiene certifications.',
      color: 'rose',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: true, can_view_billing: true, can_manage_staff: true },
      is_default: true,
    },
    {
      title: 'Head Chef / Kitchen Lead',
      description: 'Maintains meal preparation standards, ingredient sourcing alerts, and special order requests.',
      color: 'amber',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: true, can_view_billing: false, can_manage_staff: false },
      is_default: true,
    },
    {
      title: 'Maître D’ / Floor Captain',
      description: 'Oversees dining table reservations, service staff speed, and patron greeting experience.',
      color: 'purple',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: false, can_view_billing: false, can_manage_staff: false },
      is_default: true,
    },
  ],
  artisans_garages: [
    {
      title: 'Workshop Floor Manager',
      description: 'Coordinates mechanical repair bays, technician assignments, job cards, and customer delivery timelines.',
      color: 'amber',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: true, can_view_billing: true, can_manage_staff: true },
      is_default: true,
    },
    {
      title: 'Lead Auto Diagnostician / Mechanic',
      description: 'Diagnoses complex faults, prepares repair estimates, and inspects final quality before handover.',
      color: 'indigo',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: false, can_view_billing: false, can_manage_staff: false },
      is_default: true,
    },
    {
      title: 'Spare Parts & Billing Desk',
      description: 'Tracks genuine parts inventory, customer invoicing, supplier quotes, and warranty terms.',
      color: 'emerald',
      permissions: { can_reply: true, can_resolve: false, can_broadcast: false, can_view_billing: true, can_manage_staff: false },
      is_default: true,
    },
  ],
  health: [
    {
      title: 'Clinical Director / Medical Officer',
      description: 'Clinical governance, triage protocols, medical safety compliance, and patient welfare oversight.',
      color: 'rose',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: true, can_view_billing: true, can_manage_staff: true },
      is_default: true,
    },
    {
      title: 'Senior Nurse & Triage Lead',
      description: 'Handles outpatient queue management, patient inquiries, appointment scheduling, and care feedback.',
      color: 'cyan',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: false, can_view_billing: false, can_manage_staff: false },
      is_default: true,
    },
    {
      title: 'Reception & Patient Records Officer',
      description: 'Assists patients with registration, lab results collection notices, and insurance clearance.',
      color: 'indigo',
      permissions: { can_reply: true, can_resolve: false, can_broadcast: false, can_view_billing: false, can_manage_staff: false },
      is_default: true,
    },
  ],
  education: [
    {
      title: 'Dean of Studies / Head Teacher',
      description: 'Academic planning, parent-teacher communication, student welfare alerts, and curriculum delivery.',
      color: 'indigo',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: true, can_view_billing: false, can_manage_staff: true },
      is_default: true,
    },
    {
      title: 'Bursar & Accounts Lead',
      description: 'Handles school fees inquiries, payment clearance, receipt issuance, and financial verification.',
      color: 'emerald',
      permissions: { can_reply: true, can_resolve: false, can_broadcast: false, can_view_billing: true, can_manage_staff: false },
      is_default: true,
    },
    {
      title: 'Student Affairs & Welfare Officer',
      description: 'Manages day-to-day student disciplinary reviews, health bay notifications, and parent inquiries.',
      color: 'purple',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: true, can_view_billing: false, can_manage_staff: false },
      is_default: true,
    },
  ],
  banking_finance: [
    {
      title: 'SACCO Operations Manager',
      description: 'Supervises savings desk, loan committee workflows, member disputes, and statutory reporting.',
      color: 'emerald',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: true, can_view_billing: true, can_manage_staff: true },
      is_default: true,
    },
    {
      title: 'Credit & Loans Officer',
      description: 'Handles loan applications, collateral verifications, repayment inquiries, and member counseling.',
      color: 'indigo',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: false, can_view_billing: false, can_manage_staff: false },
      is_default: true,
    },
    {
      title: 'Teller & Customer Care Lead',
      description: 'Assists members with passbooks, mobile deposit verifications, statements, and general queries.',
      color: 'cyan',
      permissions: { can_reply: true, can_resolve: false, can_broadcast: false, can_view_billing: false, can_manage_staff: false },
      is_default: true,
    },
  ],
  transport_cooperative: [
    {
      title: 'Stage Master & Route Coordinator',
      description: 'Controls vehicle departures, passenger safety compliance, fare discipline, and lost property returns.',
      color: 'amber',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: true, can_view_billing: false, can_manage_staff: true },
      is_default: true,
    },
    {
      title: 'Safety & Disciplinary Officer',
      description: 'Investigates rider complaints, reckless driving alerts, and enforces SACCO code of conduct.',
      color: 'rose',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: false, can_view_billing: false, can_manage_staff: false },
      is_default: true,
    },
    {
      title: 'Booking & Accounts Clerk',
      description: 'Manages ticket booking queries, charter hire confirmations, and passenger cargo tracking.',
      color: 'cyan',
      permissions: { can_reply: true, can_resolve: false, can_broadcast: false, can_view_billing: true, can_manage_staff: false },
      is_default: true,
    },
  ],
  other: [
    {
      title: 'Operations & Duty Manager',
      description: 'General supervisory authority over daily operations, customer resolution, and service delivery.',
      color: 'indigo',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: true, can_view_billing: true, can_manage_staff: true },
      is_default: true,
    },
    {
      title: 'Customer Relations Lead',
      description: 'Handles inbound reviews, customer inquiries, quality feedback, and follow-ups.',
      color: 'emerald',
      permissions: { can_reply: true, can_resolve: true, can_broadcast: false, can_view_billing: false, can_manage_staff: false },
      is_default: true,
    },
    {
      title: 'Field & Service Specialist',
      description: 'Executes hands-on resolution of reported issues, investigations, and technical tasks.',
      color: 'amber',
      permissions: { can_reply: false, can_resolve: true, can_broadcast: false, can_view_billing: false, can_manage_staff: false },
      is_default: true,
    },
  ],
};

export function getDefaultRolesForSector(deptId: string, sector?: string): EntityCustomRole[] {
  const s = sector && SECTOR_DEFAULT_ROLES[sector] ? sector : 'other';
  const templates = SECTOR_DEFAULT_ROLES[s] || SECTOR_DEFAULT_ROLES.other;

  return templates.map((tmpl, idx) => ({
    ...tmpl,
    id: `role-${deptId}-${s}-${idx + 1}`,
    dept: deptId,
    created_at: new Date().toISOString(),
  }));
}

export function getColorDef(colorId: string) {
  return ROLE_COLORS.find((c) => c.id === colorId) || ROLE_COLORS[0];
}

export function generateStaffDispatchText(params: {
  orgName: string;
  staffName: string;
  roleTitle: string;
  dutyStation?: string;
  accessCode: string;
  portalUrl?: string;
}) {
  const stationLine = params.dutyStation ? `[STATION] Assigned Station: ${params.dutyStation}\n` : '';
  const url = params.portalUrl || window.location.origin;

  return `[${params.orgName.toUpperCase()} — OFFICIAL STAFF ACCESS INVITATION]
---------------------------------
Dear *${params.staffName}*,
You have been invited to join the official Service Provider Desk on CivicDuty for *${params.orgName}*.

[ROLE] *Assigned Role:* ${params.roleTitle}
${stationLine}[KEY] *Your Staff Access Code:* ${params.accessCode}

*HOW TO ACCESS YOUR DESK:*
1. Open: ${url}
2. Click on *"Service Provider Desk"*
3. Enter your Access Code: *${params.accessCode}*
4. Confirm your staff PIN/details to activate your duty terminal.

_This is a verified institutional staff access pass. Please do not share your code outside authorized duty personnel._`;
}
