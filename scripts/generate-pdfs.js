import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Color Palette
const COLORS = {
  navy: '#0f172a',
  gold: '#d97706',
  teal: '#0d9488',
  slate: '#334155',
  lightBg: '#f8fafc',
  border: '#e2e8f0',
  darkText: '#1e293b',
};

// -------------------------------------------------------------
// 1. GENERATE SUBMISSION LETTER PDF
// -------------------------------------------------------------
function generateSubmissionLetter() {
  const filePath = path.join(publicDir, 'CivicDuty_Submission_Letter_Inzama_Robin_6th_August_2026.pdf');
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  let pageNum = 1;

  // Header / Logo helper
  function drawHeader() {
    // Top banner
    doc.rect(40, 35, 515, 60).fill(COLORS.navy);
    
    // Official Traffic Light Signal Beacon Emblem (Red, Amber, Glowing Green Peeping Light)
    doc.save();
    // Traffic Light Capsule Housing
    doc.roundedRect(50, 48, 48, 30, 15).fillAndStroke('#020617', '#475569');

    // Red Light Signal
    doc.circle(62, 63, 4.5).fill('#f43f5e');

    // Amber Light Signal
    doc.circle(74, 63, 4.5).fill('#fbbf24');

    // Glowing Green Peeping Light Signal
    doc.circle(86, 63, 6.5).fill('#10b981');
    doc.lineWidth(1.5).strokeColor('#34d399').circle(86, 63, 8.5).stroke();
    doc.restore();

    // Text logo
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

  // Recipient Box
  doc.rect(40, 110, 515, 80).fill(COLORS.lightBg).stroke('#cbd5e1');
  doc.fillColor(COLORS.navy).font('Helvetica-Bold').fontSize(9);
  doc.text('DATE: 6th August, 2026', 50, 118);
  doc.text('TO: The Permanent Secretary, Ministry of ICT & National Guidance, Kampala, Uganda', 50, 130);
  doc.text('THROUGH: The Department of National Guidance, Ministry of ICT & National Guidance', 50, 142);
  doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.darkText);
  doc.text('CC: 1. Hon. Minister of ICT & National Guidance | 2. Hon. Minister of State | 3. Director, National Guidance', 50, 154);
  doc.font('Helvetica-Bold').fillColor(COLORS.gold);
  doc.text('FROM: Inzama Robin — Lead Innovator & Founder, CivicDuty', 50, 166);
  doc.text('CONTACTS: Phone: 0778277900 / 0748338796 | Email: inzamarobin279@gmail.com', 50, 178);

  // Subject Line Box
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

  addSection('1. EXECUTIVE SUMMARY', 'We respectfully write to formally submit this Concept Note introducing CivicDuty, an indigenous digital civic technology platform engineered to elevate Quality Service Delivery across Uganda, combat corruption in public procurement and contract execution, and establish an unbroken feedback loop between citizens, government authorities, and service providers. Designed as a Global Digital Nation Management System supporting over 100+ countries, CivicDuty features an Adaptive Administrative Engine that automatically auto-adopts each nation\'s unique governance hierarchy (in Uganda: Parish -> Sub-County -> District -> Ministry). Operating under the motto "Speak, Serve and Be Heard", CivicDuty connects taxpayers directly to civil servants with full audit trails, real-time Mandatory Response Window enforcement, and automatic escalation.');

  addSection('2. INSPIRATION & FIELD BACKGROUND', 'The development of CivicDuty was directly sparked by the public challenge issued by Hon. Alioni Yorke Odria, who called upon Ugandan innovators to build a practical digital tool capable of confronting corruption in public service delivery and local administration. This vision is anchored in three years of hands-on field experience working as a Contract Supervisor and Project Manager supervising major public infrastructure contracts—specifically building Seed Secondary Schools across Agago District, Lira, and Gulu in close coordination with District Engineers, CAO offices, Local Government technical officers, and Ministry Inspectors.');

  addSection('3. PUBLIC CONTRACT & INFRASTRUCTURE SUPERVISION MODULE', 'To address widespread delays and payment for unverified work in public infrastructure, CivicDuty incorporates a dedicated Infrastructure Supervision Module:\n• Milestone-Based Geotagged Proof Uploads: Mandatory geotagged photos at Foundation, Walling, Roofing, and Finishing stages before progress is logged.\n• Tripartite Digital Sign-Offs: Online signatures from District Project Engineer, Ministry Technical Inspector, and Parish Chief before payment certificates unlock.\n• Eliminating Extortion & Fraud: Stops inspection delays, extortion demands, and payment for ghost projects.');

  addSection('4. CORE OPERATIONAL ARCHITECTURE & CLOSED ACCOUNTABILITY LOOP', '5-Step Closed Loop: 1. Citizen SPEAKS (Geotagged report filed) -> 2. Government SERVES (Assigned officer acknowledges within 24h-48h) -> 3. Mandatory Proof Upload (Photo/document evidence attached) -> 4. Citizen Confirms HEARD (Citizen verifies resolution) -> 5. Resolved & Archived.');

  addSection('5. UGANDA GOVERNMENT HIERARCHY & AUTO-ESCALATION', 'Level 1 (Cabinet / OPM) -> Level 2 (146 CAO / Town Clerk Nodes) -> Level 3 (Sub-County / Division Chiefs) -> Level 4 (10,515 Parish Chiefs). If an assigned officer fails to acknowledge a report within the SLA, the system automatically escalates the issue up the hierarchy.');

  addSection('6. ANTI-CORRUPTION FRAMEWORK & IGG AUTO-REFERRAL', 'Automated alerts to Inspectorate of Government (IGG), locked GPS evidence, court-order disclosure protection for whistleblowers, and tamper-proof audit trails.');

  addSection('7. SYSTEM ACCESS POINTS & MULTI-CHANNEL INCLUSION', 'Accessible via Smartphone Web App + Feature phone USSD (*3030# / *284#) for rural inclusion, ensuring no citizen is left behind.');

  addSection('8. COMMERCIAL MODEL & FOREIGN REVENUE EXPORTS FOR UGANDA', '100% Free universal access for citizens. Institutional SaaS licenses generate revenue remitted to Uganda headquarters as tech export revenue.');

  addSection('9. STRATEGIC ALIGNMENT WITH MINISTRY OBJECTIVES', 'Directly supports the Digital Transformation Roadmap 2023–2027 and Parish Development Model (PDM).');

  addSection('10. PROPOSED KAMPALA 30-DAY SANDBOX PILOT', 'Zero-cost 30-day pilot across Kampala\'s 5 Divisions and 99 parishes in coordination with KCCA, NWSC, and Umeme.');

  checkPageBreak(120);
  doc.fillColor(COLORS.navy).font('Helvetica-Bold').fontSize(10).text('11. LIVE DEMO ACCESS CODES FOR EVALUATION', 40, y);
  y += 14;
  doc.strokeColor(COLORS.navy).lineWidth(1).moveTo(40, y).lineTo(555, y).stroke();
  y += 8;

  // Table of Access Codes
  const tableData = [
    ['Role', 'Access Code', 'Scope & Permissions'],
    ['Platform Admin', 'CD-ADMIN-0001', 'Whole System Control & Master Audit'],
    ['CAO (Node Admin)', 'UG-KCCA-ADMIN', 'Kampala District CAO Dashboard'],
    ['Parish Chief Desk', 'UG-KCCA-2847', 'Bukoto / Nakawa Local Desk'],
    ['IGG Anti-Corruption', 'UG-IGG-9999', 'National Audit & Referral Desk'],
    ['RDC Desk', 'UG-RDC-READ', 'Security Oversight & PDF Export'],
  ];

  tableData.forEach((row, rowIndex) => {
    checkPageBreak(22);
    const bg = rowIndex === 0 ? COLORS.navy : (rowIndex % 2 === 0 ? '#f1f5f9' : '#ffffff');
    const txtColor = rowIndex === 0 ? '#ffffff' : (rowIndex === 1 ? COLORS.gold : COLORS.darkText);
    
    doc.rect(40, y, 515, 18).fill(bg).stroke('#cbd5e1');
    doc.fillColor(txtColor).font(rowIndex === 0 ? 'Helvetica-Bold' : 'Helvetica').fontSize(8.5);
    doc.text(row[0], 45, y + 4, { width: 130 });
    doc.text(row[1], 180, y + 4, { width: 130 });
    doc.text(row[2], 315, y + 4, { width: 235 });
    y += 18;
  });

  y += 10;
  addSection('12. REQUEST FOR OFFICIAL BRIEFING', 'We humbly request an opportunity for a 15-minute official briefing and live demonstration before the Permanent Secretary and Hon. Minister on Thursday, 13th August, 2026.');

  checkPageBreak(100);
  doc.fillColor(COLORS.darkText).font('Helvetica').fontSize(9.5).text('Yours faithfully,', 40, y);
  y += 35;
  doc.fillColor(COLORS.navy).font('Helvetica-Bold').fontSize(11).text('Inzama Robin', 40, y);
  y += 14;
  doc.fillColor(COLORS.slate).font('Helvetica').fontSize(9).text('Lead Innovator & Founder, CivicDuty', 40, y);
  y += 12;
  doc.text('Telephone: 0778277900 / 0748338796 (+256)', 40, y);
  y += 12;
  doc.text('Email: inzamarobin279@gmail.com', 40, y);
  y += 12;
  doc.text('Date: 6th August, 2026', 40, y);

  drawFooter();
  doc.end();
  console.log('Generated Submission Letter PDF successfully!');
}

// -------------------------------------------------------------
// 2. GENERATE MASTER DOSSIER v6.1 PDF
// -------------------------------------------------------------
function generateMasterDossier() {
  const filePath = path.join(publicDir, 'CivicDuty_Master_Dossier_v6.1_Uganda_6th_August_2026.pdf');
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  let pageNum = 1;

  function drawHeader() {
    doc.rect(40, 35, 515, 60).fill(COLORS.navy);
    
    // Official Traffic Light Signal Beacon Emblem (Red, Amber, Glowing Green Peeping Light)
    doc.save();
    // Traffic Light Capsule Housing
    doc.roundedRect(50, 48, 48, 30, 15).fillAndStroke('#020617', '#475569');

    // Red Light Signal
    doc.circle(62, 63, 4.5).fill('#f43f5e');

    // Amber Light Signal
    doc.circle(74, 63, 4.5).fill('#fbbf24');

    // Glowing Green Peeping Light Signal
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

  // Cover / Header Banner
  doc.rect(40, 105, 515, 45).fill('#0f172a').stroke(COLORS.gold);
  doc.fillColor(COLORS.gold).font('Helvetica-Bold').fontSize(11).text('CIVICDUTY MASTER DOSSIER v6.1 — TECHNICAL & PRODUCT SPECIFICATION', 50, 115, { align: 'center', width: 495 });
  doc.fillColor('#2dd4bf').font('Helvetica-Bold').fontSize(8.5).text('Confidential Presentation • Republic of Uganda • 6th August, 2026', 50, 132, { align: 'center', width: 495 });

  let y = 160;

  function checkPageBreak(neededHeight = 40) {
    if (y + neededHeight > 770) {
      drawFooter();
      doc.addPage({ margin: 40, size: 'A4' });
      pageNum++;
      drawHeader();
      y = 110;
    }
  }

  function addDossierSection(number, title, text) {
    checkPageBreak(50);
    doc.fillColor(COLORS.navy).font('Helvetica-Bold').fontSize(10.5).text(`${number}. ${title.toUpperCase()}`, 40, y);
    y += 14;
    doc.strokeColor(COLORS.navy).lineWidth(1.2).moveTo(40, y).lineTo(555, y).stroke();
    y += 6;
    doc.fillColor(COLORS.darkText).font('Helvetica').fontSize(9).text(text, 40, y, { width: 515, align: 'justify', lineGap: 2 });
    y = doc.y + 12;
  }

  addDossierSection('1', 'Executive Summary & Core Thesis', 'CivicDuty is an advanced digital nation management platform engineered to establish a lawful, documented, and accountable channel between citizens and government institutions. Citizens file reports directly to named government department walls. Government officials are legally and operationally obligated to respond within a published Response Window SLA. Every post, response, GPS coordinate, and status change forms a permanent public record.');

  addDossierSection('2', 'The Closed Accountability Loop', 'The platform operates a strict 5-Step Accountability Loop:\n1. Citizen SPEAKS (Geotagged public report created)\n2. Government SERVES (Assigned desk acknowledges within 24h-48h)\n3. Mandatory Proof Upload (Verified photographic/document evidence uploaded)\n4. Citizen Confirms HEARD (Original reporter validates resolution quality)\n5. Resolved & Archived.');

  addDossierSection('3', 'Two-Lane Architecture (Civic vs. Consumer)', 'Civic Lane: Applied to local council, health, education, roads, water, and public security. Mandatory 24h-48h Response Window, auto-escalation chain, emerald badge.\nConsumer Lane: Applied to registered private businesses and utilities. Voluntary 72h Response Window, public "No Response" badge on failure, zinc badge.');

  addDossierSection('4', 'Public Contract & Infrastructure Supervision Module', 'Informed by 3 years of hands-on field experience supervising Seed Secondary School contracts across Agago District, Lira, and Gulu. Enforces geotagged milestone proof uploads (Foundation, Walling, Roofing, Completion) and tripartite digital sign-offs (District Engineer, Ministry Inspector, Parish Chief) before payment certificates can be released.');

  addDossierSection('5', 'Adaptive Government Hierarchy Engine', 'Capable of auto-adapting to 100+ national administrative structures. In Uganda, it mirrors the 4-tier governance structure:\n• Level 1: Cabinet & Office of the Prime Minister (OPM)\n• Level 2: 146 Chief Administrative Officers (CAOs) & Town Clerks\n• Level 3: Sub-County & Division Chiefs\n• Level 4: 10,515 Parish Chiefs & Community Wardens.');

  addDossierSection('6', 'Anti-Corruption Framework & IGG Auto-Referral', 'Features automated anti-corruption triggers that flag unresolved high-value project anomalies directly to the Inspectorate of Government (IGG). All evidence is cryptographically locked with immutable GPS coordinates and timestamping.');

  addDossierSection('7', 'Multi-Channel Access & Rural Inclusion', 'Ensures universal access via a responsive web portal and feature phone USSD access (*3030# / *284#), enabling citizens in remote rural parishes to lodge reports and track progress without internet connections.');

  addDossierSection('8', 'Commercial Model & Foreign Revenue Exports', 'Universal free access for citizens. Revenue is generated through institutional SaaS subscriptions from utility providers and private enterprise boards, remitting software export earnings to Uganda.');

  addDossierSection('9', 'Strategic Alignment with Ministry Objectives', 'Directly aligns with the Ministry of ICT & National Guidance Digital Transformation Roadmap 2023–2027 and accelerates the data-driven execution of the Parish Development Model (PDM).');

  addDossierSection('10', 'Proposed 30-Day Kampala Sandbox Pilot', 'Proposed zero-cost 30-day pilot across Kampala\'s 5 Divisions and 99 parishes in active partnership with KCCA, NWSC, and Umeme.');

  checkPageBreak(120);
  doc.fillColor(COLORS.navy).font('Helvetica-Bold').fontSize(10.5).text('11. AUTHOR CREDENTIALS & CONTACT', 40, y);
  y += 14;
  doc.strokeColor(COLORS.navy).lineWidth(1.2).moveTo(40, y).lineTo(555, y).stroke();
  y += 8;

  doc.rect(40, y, 515, 80).fill('#f1f5f9').stroke('#cbd5e1');
  doc.fillColor(COLORS.navy).font('Helvetica-Bold').fontSize(10).text('INZAMA ROBIN', 55, y + 10);
  doc.fillColor(COLORS.gold).font('Helvetica-Bold').fontSize(9).text('Lead Innovator & Founder, CivicDuty', 55, y + 24);
  doc.fillColor(COLORS.darkText).font('Helvetica').fontSize(8.5);
  doc.text('Primary Phone: 0778277900 (+256)', 55, y + 38);
  doc.text('Secondary Phone: 0748338796 (+256)', 55, y + 50);
  doc.text('Email: inzamarobin279@gmail.com', 55, y + 62);
  doc.text('Date of Submission: 6th August, 2026', 280, y + 38);
  doc.text('Target Location: Kampala, Republic of Uganda', 280, y + 50);

  drawFooter();
  doc.end();
  console.log('Generated Master Dossier PDF successfully!');
}

generateSubmissionLetter();
generateMasterDossier();
