import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Visual Color Palette
const COLORS = {
  navy: '#0f172a',
  navyDark: '#020617',
  gold: '#d97706',
  goldLight: '#fef3c7',
  teal: '#0d9488',
  tealDark: '#115e59',
  slate: '#334155',
  slateLight: '#f8fafc',
  border: '#cbd5e1',
  darkText: '#1e293b',
  crimson: '#e11d48',
  emerald: '#059669',
};

// -------------------------------------------------------------
// 1. GENERATE UPDATED PRODUCT OVERVIEW & DOCUMENTATION v14.1 PDF
// -------------------------------------------------------------
function generateProductOverviewPDF() {
  const filePath = path.join(publicDir, 'CivicDuty_Product_Overview_v14.1_August_2026.pdf');
  const doc = new PDFDocument({ margin: 40, size: 'A4', bufferPages: true });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  let pageNum = 1;

  function drawHeader(isCover = false) {
    if (isCover) return;
    doc.rect(40, 30, 515, 50).fill(COLORS.navy);

    // Traffic Light Capsule Housing
    doc.save();
    doc.roundedRect(50, 40, 44, 28, 14).fillAndStroke('#020617', '#475569');
    doc.circle(60, 54, 4).fill('#f43f5e'); // Red
    doc.circle(72, 54, 4).fill('#fbbf24'); // Amber
    doc.circle(84, 54, 5.5).fill('#10b981'); // Glowing Green
    doc.lineWidth(1.2).strokeColor('#34d399').circle(84, 54, 7.5).stroke();
    doc.restore();

    doc.fillColor('#f59e0b').font('Helvetica-Bold').fontSize(16).text('CIVICDUTY', 104, 38);
    doc.fillColor('#2dd4bf').font('Helvetica-Bold').fontSize(7).text('SOVEREIGN GOVERNANCE PLATFORM & NATIONAL SERVICE LEDGER', 104, 58);

    doc.fillColor('#94a3b8').font('Helvetica-Bold').fontSize(7.5).text('PRODUCT OVERVIEW & SPECIFICATION v14.1', 320, 48, { align: 'right', width: 225 });
    doc.y = 95;
  }

  function drawFooter() {
    doc.save();
    doc.strokeColor(COLORS.border).lineWidth(1).moveTo(40, 792).lineTo(555, 792).stroke();
    doc.fillColor('#64748b').font('Helvetica').fontSize(7.5).text('CivicDuty Sovereign Governance Platform • v14.1 (August 2026) • Contact: inzamarobin279@gmail.com', 40, 802);
    doc.text(`Page ${pageNum}`, 490, 802, { align: 'right', width: 65 });
    doc.restore();
  }

  // --- COVER PAGE ---
  doc.rect(40, 40, 515, 740).fill('#090d16');

  // Traffic Light Logo Banner
  doc.save();
  doc.roundedRect(235, 110, 85, 48, 24).fillAndStroke('#020617', '#d97706');
  doc.circle(255, 134, 7).fill('#f43f5e');
  doc.circle(277, 134, 7).fill('#fbbf24');
  doc.circle(300, 134, 9).fill('#10b981');
  doc.lineWidth(2).strokeColor('#34d399').circle(300, 134, 12).stroke();
  doc.restore();

  doc.fillColor('#f59e0b').font('Helvetica-Bold').fontSize(32).text('CIVICDUTY', 40, 185, { align: 'center', width: 515 });
  doc.fillColor('#38bdf8').font('Helvetica-Bold').fontSize(13).text('Speak. Serve. Be Heard.', 40, 225, { align: 'center', width: 515 });

  doc.strokeColor('#334155').lineWidth(1.5).moveTo(120, 255).lineTo(475, 255).stroke();

  doc.fillColor('#f8fafc').font('Helvetica-Bold').fontSize(20).text('Product Overview & Technical Documentation', 40, 280, { align: 'center', width: 515 });
  doc.fillColor('#a855f7').font('Helvetica-Bold').fontSize(12).text('v14.1 | Sovereign Governance Platform | August 2026', 40, 310, { align: 'center', width: 515 });

  doc.fillColor('#cbd5e1').font('Helvetica').fontSize(11).text('A Sovereign Nation Management & Service Delivery Infrastructure\nConnecting Citizens, Civil Servants, and Contractors through Immutable Public Ledgers', 70, 350, { align: 'center', width: 455, lineGap: 4 });

  // Key Highlights Box on Cover
  doc.rect(70, 430, 455, 175).fill('#111827').stroke('#d97706');
  doc.fillColor('#f59e0b').font('Helvetica-Bold').fontSize(11).text('CORE ARCHITECTURAL PILLARS', 85, 445);

  const pillars = [
    '• Department Walls: Immutable, permanent public records for all public offices.',
    '• Database-Enforced Audit: Server-side database triggers logging actor, role, and time.',
    '• Salaried Desk Routing: Automatic L1-L5 escalation to appointed accounting officers.',
    '• Anti-Corruption Pipeline: Evidence-backed reports auto-referred to the Inspectorate.',
    '• 15 Sovereign Nations: Dynamic adaptation to African and global government tiers.',
    '• Multi-Channel Inclusion: Full Web App + Feature-Phone USSD (*284*55#) / SMS.',
  ];

  let pillarY = 470;
  pillars.forEach((p) => {
    doc.fillColor('#e2e8f0').font('Helvetica').fontSize(9).text(p, 85, pillarY, { width: 425 });
    pillarY += 17;
  });

  // Metadata Footer on Cover
  doc.fillColor('#94a3b8').font('Helvetica').fontSize(9).text('Republic of Uganda & Global Sovereign Deployments', 40, 680, { align: 'center', width: 515 });
  doc.fillColor('#64748b').font('Helvetica').fontSize(8.5).text('Author: Inzama Robin (Founder & Lead Architect) • inzamarobin279@gmail.com', 40, 700, { align: 'center', width: 515 });

  drawFooter();

  // --- PAGE 2 ONWARDS ---
  doc.addPage({ margin: 40, size: 'A4' });
  pageNum++;
  drawHeader();

  let y = 95;

  function checkPageBreak(neededHeight = 45) {
    if (y + neededHeight > 775) {
      drawFooter();
      doc.addPage({ margin: 40, size: 'A4' });
      pageNum++;
      drawHeader();
      y = 95;
    }
  }

  function addSectionHeading(num, title) {
    checkPageBreak(50);
    doc.fillColor(COLORS.navy).font('Helvetica-Bold').fontSize(11.5).text(`${num}. ${title.toUpperCase()}`, 40, y);
    y += 15;
    doc.strokeColor(COLORS.navy).lineWidth(1.2).moveTo(40, y).lineTo(555, y).stroke();
    y += 8;
  }

  function addParagraph(text, font = 'Helvetica', size = 9, color = COLORS.darkText) {
    checkPageBreak(30);
    doc.fillColor(color).font(font).fontSize(size).text(text, 40, y, { width: 515, align: 'justify', lineGap: 2.5 });
    y = doc.y + 8;
  }

  function addCalloutBox(title, text, borderColor = COLORS.gold, bgColor = COLORS.goldLight, titleColor = '#78350f') {
    checkPageBreak(55);
    const boxTop = y;
    doc.fillColor(titleColor).font('Helvetica-Bold').fontSize(9.5).text(title, 52, boxTop + 8, { width: 490 });
    const titleEnd = doc.y;
    doc.fillColor(COLORS.darkText).font('Helvetica').fontSize(8.5).text(text, 52, titleEnd + 4, { width: 490, align: 'justify', lineGap: 2 });
    const boxHeight = doc.y - boxTop + 10;
    
    // Draw background and border behind
    doc.save();
    doc.rect(40, boxTop, 515, boxHeight).fillAndStroke(bgColor, borderColor);
    // Redraw text over box
    doc.fillColor(titleColor).font('Helvetica-Bold').fontSize(9.5).text(title, 52, boxTop + 8, { width: 490 });
    doc.fillColor(COLORS.darkText).font('Helvetica').fontSize(8.5).text(text, 52, titleEnd + 4, { width: 490, align: 'justify', lineGap: 2 });
    doc.restore();

    y = doc.y + 12;
  }

  // 1. EXECUTIVE SUMMARY
  addSectionHeading('1', 'Executive Summary');
  addParagraph('CivicDuty is an enterprise full-stack nation management platform creating a lawful, documented, and accountable channel between citizens and public institutions. Citizens file geolocated, evidence-backed reports directly onto named government department walls. Government officials are legally and operationally obligated to respond within published Statutory Service Level Agreements (SLAs). Every ticket, status change, official response, contractor milestone, and audit record is committed to a permanent public ledger.');
  addParagraph('The platform is not a petition site, a complaint box, or a social network. It is operating infrastructure for state service delivery—the sovereign digital layer connecting taxpayers to accounting civil servants, backed by real-time SLA countdowns, multi-tier auto-escalation up the administrative hierarchy, and an anti-corruption referral pipeline directly connected to national inspectorates.');

  addCalloutBox(
    'THE PROBLEM & THE CIVICDUTY SOLUTION',
    '• Reports Disappear: Paper petitions and phone calls vanish without trace. CivicDuty provides Department Walls where neither party can delete records.\n• No Accountability Trail: "I never received it" is unfalsifiable. CivicDuty triggers database-enforced audit logs for every reply.\n• Geographic Flooding: National desks receive irrelevant complaints. CivicDuty routes automatically to local salaried Parish/Ward chiefs.\n• Corruption in Darkness: Procurement fraud stays hidden for years. CivicDuty provides Project Walls with 12-month defects liability tracking.'
  );

  addParagraph('Tagline: Speak. Serve. Be Heard. — As taxpayers, citizens have a civic duty to demand quality public service from civil servants. CivicDuty is the sovereign, documented channel.', 'Helvetica-Bold', 9, COLORS.tealDark);

  // 2. PLATFORM ARCHITECTURE
  addSectionHeading('2', 'Platform Architecture & Closed Loop');
  addParagraph('2.1 Department Walls (Not an Algorithmic Feed)\nEvery department has an immutable public wall. Reports cannot be buried or reordered. Citizens follow walls that matter to them rather than receiving an algorithmic feed. Reports reaching 100 verified citizen supporters are automatically pinned to the top of the wall.');
  addParagraph('2.2 Accountability Docket & Performance Scoreboard\nEach wall features an active docket tracking open reports, resolution percentage, average response hours, and overdue breaches. Ministers and citizens read identical performance metrics.');
  addParagraph('2.3 Two-Lane Accountability Model\n• Lane 1 (Civic): Government ministries, municipal councils, and statutory authorities. Mandatory 12h-72h SLA with automatic escalation up the state hierarchy.\n• Lane 2 (Consumer): Commercial utilities, telecommunications, and private banks. Commercial SLA with public regulatory visibility.');

  addCalloutBox(
    'THE 5-STEP CLOSED ACCOUNTABILITY LOOP',
    '1. Citizen SPEAKS: Files report with geotagged photo, video, or voice note tagged to a location.\n2. SLA Countdown Runs: Ticket appears on public wall and assigned officer inbox with live timer.\n3. Government SERVES: Assigned officer investigates and provides status update.\n4. Proof of Work Uploaded: Officer MUST upload verified photographic/documentary evidence to resolve.\n5. Citizen Confirms HEARD: Original reporter confirms resolution; a "No" reopens the case automatically.',
    COLORS.teal,
    '#f0fdfa',
    COLORS.tealDark
  );

  // 3. UGANDA GOVERNMENT HIERARCHY & ROUTING
  addSectionHeading('3', 'Sovereign Government Structure & Auto-Escalation');
  addParagraph('3.1 The Salaried Primary Desk Rule\nReports route to the lowest office with a permanent, salaried, appointed civil servant. In Uganda that is the Parish Chief (L2) or Ward Administrator. LC I village chairpersons are unpaid volunteers without budget and receive read-only visibility without SLA countdowns.');
  addParagraph('3.2 Auto-Escalation Timing Chain (Uganda):\n• 0 hrs: Assigned to Parish Chief / Ward Administrator (L2)\n• 48 hrs: Escalates to Sub-County Chief / Division Town Clerk (L3)\n• 72 hrs: Escalates to Chief Administrative Officer (CAO) / City Town Clerk (L4)\n• 96 hrs: Escalates to Resident District Commissioner (RDC) & District Chairperson\n• 120 hrs: Escalates to Permanent Secretary / Office of the Prime Minister (OPM) (L5)');

  // 4. MULTI-COUNTRY ARCHITECTURE
  addSectionHeading('4', 'Multi-Country Architecture (15 Sovereign Nations)');
  addParagraph('CivicDuty features a schema-driven engine auto-adapting to 15 national administrative structures without code modifications:');

  const countryRows = [
    ['Country', 'Code', 'Administrative Hierarchy', 'Primary Salaried Desk'],
    ['Uganda', 'UG', 'District › SubCounty › Parish › Village', 'Parish Chief'],
    ['Kenya', 'KE', 'County › SubCounty › Ward › Village', 'Ward Administrator'],
    ['Nigeria', 'NG', 'State › Senatorial Zone › LGA › Ward', 'Ward Councillor / Admin'],
    ['Ghana', 'GH', 'Region › District/Municipal › Electoral Area', 'Assembly Member'],
    ['Rwanda', 'RW', 'Province › District › Sector › Cell › Village', 'Cell Executive Secretary'],
    ['Tanzania', 'TZ', 'Region › District › Ward › Village/Mtaa', 'Ward Executive Officer'],
    ['South Africa', 'ZA', 'Province › District/Metro › Municipality › Ward', 'Ward Councillor / Clerk'],
    ['Ethiopia', 'ET', 'Region › Zone › Woreda › Kebele', 'Kebele Manager'],
    ['Egypt', 'EG', 'Governorate › Markaz/Kism › Local Unit', 'Local Unit Head'],
    ['Senegal', 'SN', 'Région › Département › Arrondissement › Commune', 'Secrétaire Général'],
    ['Zambia', 'ZM', 'Province › District › Constituency › Ward', 'Ward Development Officer'],
    ['Zimbabwe', 'ZW', 'Province › District › Ward › Village', 'Ward Executive Officer'],
    ['United States', 'US', 'State › County › Municipality › Precinct', 'Municipal Supervisor'],
    ['United Kingdom', 'GB', 'Nation › County/Unitary › Borough › Ward', 'Ward Councillor'],
    ['India', 'IN', 'State › District › Block › Gram Panchayat', 'Panchayat Secretary'],
  ];

  countryRows.forEach((row, idx) => {
    checkPageBreak(18);
    const bg = idx === 0 ? COLORS.navy : (idx % 2 === 0 ? '#f8fafc' : '#ffffff');
    const txt = idx === 0 ? '#ffffff' : COLORS.darkText;
    doc.rect(40, y, 515, 16).fill(bg).stroke('#cbd5e1');
    doc.fillColor(txt).font(idx === 0 ? 'Helvetica-Bold' : 'Helvetica').fontSize(7.5);
    doc.text(row[0], 45, y + 4, { width: 75 });
    doc.text(row[1], 125, y + 4, { width: 35 });
    doc.text(row[2], 165, y + 4, { width: 205 });
    doc.text(row[3], 375, y + 4, { width: 175 });
    y += 16;
  });

  y += 10;

  // 5. CITIZEN EXPERIENCE & SCORE
  addSectionHeading('5', 'Citizen Experience, Identity & Gamification');
  addParagraph('5.1 Verified Profiles & Uploadable Avatars\nCitizens register using National ID (NIN) and phone verification. The system supports client-side avatar photo uploads with HTML5 Canvas auto-cropping, compression, and civic role badges.');
  addParagraph('5.2 Civic Score & Rank Ladder\n• File a standard report: +50 pts\n• File an anti-corruption report: +100 pts\n• Report resolved and confirmed: +250 pts\n• Support another citizen\'s report: +5 pts\n• Rank Ladder: Observer (0-199) → Reporter (200-499) → Advocate (500-999) → Watchdog (1,000-2,499) → Sentinel (2,500+ pts).');

  // 6. GOVERNMENT & TEAM CASCADE
  addSectionHeading('6', 'Government Desk, Audit Trail & Team Cascade');
  addParagraph('6.1 One Account = One Salaried Desk\nNo public self-registration for officials. Desks exist solely through single-use cryptographic invitation codes issued down the hierarchy: Ministry (L5) → CAO (L4) → Sub-County (L3) → Parish (L2).');
  addParagraph('6.2 Standing Down & Audit Immortality\nRevoking access requires recorded statutory grounds (Transferred, Retired, Dismissed, Contract Ended). Nobody is deleted from the historical audit log.');

  // 7. ANTI-CORRUPTION & PUBLIC WORKS
  addSectionHeading('7', 'Anti-Corruption Framework & Public Works Walls');
  addParagraph('7.1 Inspectorate Referral Pipeline\nEvidence-backed reports detailing bribery, unperformed works, or procurement fraud bypass municipal desks and trigger automatic referrals to the Inspectorate of Government (IGG).');
  addParagraph('7.2 Contractor Project Walls & Defects Liability\nPublic tenders (e.g. Roads, Sub-stations, Seed Schools) receive individual project walls displaying budget, contractor, and milestones. Walls remain open for public defect reports for 12 months post-handover.');

  // 8. FULL-STACK TECHNICAL IMPLEMENTATION
  addSectionHeading('8', 'Full-Stack Architecture & Production Deployment');
  addParagraph('• Frontend: React 19, TypeScript, Tailwind CSS v4, Motion Transitions, Lucide Icons.\n• Backend: Express Node.js server (server.ts) on port 3000 bundled via esbuild into dist/server.cjs.\n• REST APIs: /api/health (status & version 14.1.0), /api/db (JSON ledger snapshot), /api/export/zip (downloadable distribution).\n• Persistence: JSON database (src/data/database.json) + client localStorage offline sync.\n• Containerization: Production multi-stage Dockerfile and docker-compose.yml included in release zip.');

  // 9. COMMERCIAL LICENSING MODEL
  addSectionHeading('9', 'Commercial & Revenue Model');
  addParagraph('• Citizens: 100% Free permanently (no ads, no subscriptions).\n• Public Institutions: Sovereign national annual licence banded by country scale (never billed per parish).\n• Commercial Utilities & Entities: Geographic tier subscriptions with automated proforma tax invoicing.\n• Contractors: Zero platform fees (project walls covered by government licence).');

  // 10. AUTHOR & VERIFICATION
  addSectionHeading('10', 'Lead Innovator Credentials & Verification');
  
  checkPageBreak(85);
  doc.rect(40, y, 515, 75).fill('#f1f5f9').stroke('#cbd5e1');
  doc.fillColor(COLORS.navy).font('Helvetica-Bold').fontSize(10).text('INZAMA ROBIN', 55, y + 10);
  doc.fillColor(COLORS.gold).font('Helvetica-Bold').fontSize(9).text('Founder & Lead System Architect, CivicDuty', 55, y + 24);
  doc.fillColor(COLORS.darkText).font('Helvetica').fontSize(8.5);
  doc.text('Contacts: 0778277900 / 0748338796 (+256)', 55, y + 38);
  doc.text('Email: inzamarobin279@gmail.com', 55, y + 50);
  doc.text('Release Version: v14.1 Production Build', 300, y + 38);
  doc.text('Date: August 2026 • Kampala, Uganda', 300, y + 50);

  y += 90;

  drawFooter();
  doc.end();
  console.log('✓ Generated CivicDuty Product Overview v14.1 PDF successfully!');
}

// -------------------------------------------------------------
// 2. GENERATE SUBMISSION LETTER PDF
// -------------------------------------------------------------
function generateSubmissionLetter() {
  const filePath = path.join(publicDir, 'CivicDuty_Submission_Letter_Inzama_Robin_6th_August_2026.pdf');
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  let pageNum = 1;

  function drawHeader() {
    doc.rect(40, 35, 515, 60).fill(COLORS.navy);
    doc.save();
    doc.roundedRect(50, 48, 48, 30, 15).fillAndStroke('#020617', '#475569');
    doc.circle(62, 63, 4.5).fill('#f43f5e');
    doc.circle(74, 63, 4.5).fill('#fbbf24');
    doc.circle(86, 63, 6.5).fill('#10b981');
    doc.lineWidth(1.5).strokeColor('#34d399').circle(86, 63, 8.5).stroke();
    doc.restore();

    doc.fillColor('#f59e0b').font('Helvetica-Bold').fontSize(19).text('CIVICDUTY', 108, 47);
    doc.fillColor('#2dd4bf').font('Helvetica-Bold').fontSize(7.5).text('GLOBAL DIGITAL NATION MANAGEMENT PLATFORM & CIVIC LEDGER', 108, 68);
    doc.fillColor('#64748b').font('Helvetica-Bold').fontSize(8).text('OFFICIAL MINISTERIAL SUBMISSION LETTER', 330, 60, { align: 'right', width: 210 });
    doc.y = 110;
  }

  function drawFooter() {
    doc.save();
    doc.strokeColor(COLORS.border).lineWidth(1).moveTo(40, 790).lineTo(555, 790).stroke();
    doc.fillColor('#64748b').font('Helvetica').fontSize(8).text(`CivicDuty Official Submission Letter • Lead Innovator: Inzama Robin (Tel: 0778277900 / 0748338796)`, 40, 800);
    doc.text(`Page ${pageNum}`, 500, 800, { align: 'right', width: 55 });
    doc.restore();
  }

  drawHeader();

  doc.rect(40, 110, 515, 80).fill(COLORS.slateLight).stroke('#cbd5e1');
  doc.fillColor(COLORS.navy).font('Helvetica-Bold').fontSize(9);
  doc.text('DATE: 6th August, 2026', 50, 118);
  doc.text('TO: The Permanent Secretary, Ministry of ICT & National Guidance, Kampala, Uganda', 50, 130);
  doc.text('THROUGH: The Department of National Guidance, Ministry of ICT & National Guidance', 50, 142);
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.darkText);
  doc.text('CC: 1. Hon. Minister of ICT & National Guidance | 2. Hon. Minister of State | 3. Director, National Guidance', 50, 154);
  doc.font('Helvetica-Bold').fillColor(COLORS.gold);
  doc.text('FROM: Inzama Robin — Lead Innovator & Founder, CivicDuty', 50, 166);
  doc.text('CONTACTS: Phone: 0778277900 / 0748338796 | Email: inzamarobin279@gmail.com', 50, 178);

  doc.rect(40, 200, 515, 36).fill('#fffbe6').stroke(COLORS.gold);
  doc.fillColor('#78350f').font('Helvetica-Bold').fontSize(9.5);
  doc.text('SUBJECT: CONCEPT NOTE AND FORMAL SUBMISSION ON "CIVICDUTY" GLOBAL DIGITAL NATION MANAGEMENT PLATFORM FOR QUALITY SERVICE DELIVERY MONITORING & PUBLIC CONTRACT SUPERVISION', 48, 208, { width: 498 });

  let y = 246;

  function checkPageBreak(neededHeight = 40) {
    if (y + neededHeight > 770) {
      drawFooter();
      doc.addPage({ margin: 40, size: 'A4' });
      pageNum++;
      drawHeader();
      y = 110;
    }
  }

  function addSection(title, body) {
    checkPageBreak(50);
    doc.fillColor(COLORS.navy).font('Helvetica-Bold').fontSize(10).text(title, 40, y);
    y += 14;
    doc.strokeColor(COLORS.navy).lineWidth(1).moveTo(40, y).lineTo(555, y).stroke();
    y += 6;
    doc.fillColor(COLORS.darkText).font('Helvetica').fontSize(9).text(body, 40, y, { width: 515, align: 'justify', lineGap: 2 });
    y = doc.y + 10;
  }

  addSection('1. EXECUTIVE SUMMARY', 'We respectfully write to formally submit this Concept Note introducing CivicDuty, an indigenous digital civic technology platform engineered to elevate Quality Service Delivery across Uganda, combat corruption in public procurement and contract execution, and establish an unbroken feedback loop between citizens, government authorities, and service providers.');
  addSection('2. INSPIRATION & FIELD BACKGROUND', 'The development of CivicDuty was directly sparked by the public challenge issued by Hon. Alioni Yorke Odria, calling upon innovators to confront corruption in public service delivery, anchored in 3 years of field experience supervising public infrastructure contracts.');
  addSection('3. PUBLIC CONTRACT SUPERVISION', 'Enforces geotagged milestone proof uploads (Foundation, Walling, Roofing, Finishing) and tripartite digital sign-offs before payments unlock.');
  addSection('4. COMMERCIAL MODEL & FOREIGN REVENUE', 'Universal free access for citizens. Institutional SaaS licenses generate revenue remitted to Uganda headquarters as tech export revenue.');

  drawFooter();
  doc.end();
  console.log('✓ Generated Submission Letter PDF successfully!');
}

// -------------------------------------------------------------
// 3. GENERATE MASTER DOSSIER v6.1 PDF
// -------------------------------------------------------------
function generateMasterDossier() {
  const filePath = path.join(publicDir, 'CivicDuty_Master_Dossier_v6.1_Uganda_6th_August_2026.pdf');
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  let pageNum = 1;

  function drawHeader() {
    doc.rect(40, 35, 515, 60).fill(COLORS.navy);
    doc.save();
    doc.roundedRect(50, 48, 48, 30, 15).fillAndStroke('#020617', '#475569');
    doc.circle(62, 63, 4.5).fill('#f43f5e');
    doc.circle(74, 63, 4.5).fill('#fbbf24');
    doc.circle(86, 63, 6.5).fill('#10b981');
    doc.lineWidth(1.5).strokeColor('#34d399').circle(86, 63, 8.5).stroke();
    doc.restore();

    doc.fillColor('#f59e0b').font('Helvetica-Bold').fontSize(19).text('CIVICDUTY', 108, 47);
    doc.fillColor('#2dd4bf').font('Helvetica-Bold').fontSize(7.5).text('GLOBAL DIGITAL NATION MANAGEMENT PLATFORM & CIVIC LEDGER', 108, 68);
    doc.fillColor('#64748b').font('Helvetica-Bold').fontSize(8).text('MASTER DOSSIER v6.1 • TECHNICAL SPECIFICATION', 310, 60, { align: 'right', width: 230 });
    doc.y = 110;
  }

  function drawFooter() {
    doc.save();
    doc.strokeColor(COLORS.border).lineWidth(1).moveTo(40, 790).lineTo(555, 790).stroke();
    doc.fillColor('#64748b').font('Helvetica').fontSize(8).text(`CivicDuty Master Dossier v6.1 • Author: Inzama Robin (Tel: 0778277900 / 0748338796)`, 40, 800);
    doc.text(`Page ${pageNum}`, 500, 800, { align: 'right', width: 55 });
    doc.restore();
  }

  drawHeader();

  doc.rect(40, 105, 515, 45).fill('#0f172a').stroke(COLORS.gold);
  doc.fillColor(COLORS.gold).font('Helvetica-Bold').fontSize(11).text('CIVICDUTY MASTER DOSSIER v6.1 — TECHNICAL SPECIFICATION', 50, 115, { align: 'center', width: 495 });
  doc.fillColor('#2dd4bf').font('Helvetica-Bold').fontSize(8.5).text('Confidential Presentation • Republic of Uganda • 6th August, 2026', 50, 132, { align: 'center', width: 495 });

  drawFooter();
  doc.end();
  console.log('✓ Generated Master Dossier PDF successfully!');
}

generateProductOverviewPDF();
generateSubmissionLetter();
generateMasterDossier();
