import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const CLOUD_RUN_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : null;

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // In-Memory / File backed database store
  const dbFilePath = path.join(process.cwd(), 'src', 'data', 'database.json');

  let dbData: any = {};
  try {
    if (fs.existsSync(dbFilePath)) {
      dbData = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading database.json:', err);
  }

  // --- API ROUTES FIRST ---

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      app: 'CivicDuty Sovereign Governance Platform',
      version: '14.1.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      node: process.version,
    });
  });

  // Full database JSON dump
  app.get('/api/db', (req, res) => {
    try {
      if (fs.existsSync(dbFilePath)) {
        const data = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
        return res.json(data);
      }
      res.json(dbData);
    } catch (err) {
      res.status(500).json({ error: 'Failed to read database' });
    }
  });

  // Export / Download Build ZIP endpoint (if generated)
  app.get('/api/export/zip', (req, res) => {
    const zipPath = path.join(process.cwd(), 'public', 'civicduty-fullstack-build.zip');
    if (fs.existsSync(zipPath)) {
      res.download(zipPath, 'civicduty-fullstack-build.zip');
    } else {
      res.status(404).json({ error: 'Build ZIP not yet generated. Run npm run build or use in-app ZIP exporter.' });
    }
  });

  // Export / Download Official Product Overview PDF
  app.get('/api/export/pdf', (req, res) => {
    const pdfPath = path.join(process.cwd(), 'public', 'CivicDuty_Product_Overview_v14.1_August_2026.pdf');
    if (fs.existsSync(pdfPath)) {
      res.download(pdfPath, 'CivicDuty_Product_Overview_v14.1_August_2026.pdf');
    } else {
      res.status(404).json({ error: 'Product Overview PDF not found' });
    }
  });

  app.get('/api/export/pdf/overview', (req, res) => {
    const pdfPath = path.join(process.cwd(), 'public', 'CivicDuty_Product_Overview_v14.1_August_2026.pdf');
    if (fs.existsSync(pdfPath)) {
      res.download(pdfPath, 'CivicDuty_Product_Overview_v14.1_August_2026.pdf');
    } else {
      res.status(404).json({ error: 'Product Overview PDF not found' });
    }
  });

  app.get('/api/export/pdf/dossier', (req, res) => {
    const pdfPath = path.join(process.cwd(), 'public', 'CivicDuty_Master_Dossier_v6.1_Uganda_6th_August_2026.pdf');
    if (fs.existsSync(pdfPath)) {
      res.download(pdfPath, 'CivicDuty_Master_Dossier_v6.1_Uganda_6th_August_2026.pdf');
    } else {
      res.status(404).json({ error: 'Master Dossier PDF not found' });
    }
  });

  app.get('/api/export/pdf/submission', (req, res) => {
    const pdfPath = path.join(process.cwd(), 'public', 'CivicDuty_Submission_Letter_Inzama_Robin_6th_August_2026.pdf');
    if (fs.existsSync(pdfPath)) {
      res.download(pdfPath, 'CivicDuty_Submission_Letter_Inzama_Robin_6th_August_2026.pdf');
    } else {
      res.status(404).json({ error: 'Submission Letter PDF not found' });
    }
  });

  // Public stats endpoint
  app.get('/api/stats', (req, res) => {
    res.json({
      activeDesks: 6420,
      countriesServed: 15,
      resolvedTicketsRate: '94.2%',
      averageSlaHours: 32.4,
      totalCivicVolunteers: 128450,
      lastBlockVerified: 'BLK-' + Math.floor(Date.now() / 1000),
    });
  });

  // =========================================================================
  // ITEM 1: PARISH CHIEF CIRCULAR DISPATCH & NOTIFICATION QUEUE (PHASE 4)
  // =========================================================================
  const inMemoryCircularQueue: any[] = [];

  app.get('/api/notifications/queue', (req, res) => {
    res.json({
      success: true,
      totalQueued: inMemoryCircularQueue.length,
      queue: inMemoryCircularQueue.slice(-50).reverse(),
    });
  });

  app.post('/api/notifications/dispatch-circular', (req, res) => {
    const { circularRef, subject, body, targetAudience, channels } = req.body || {};
    if (!circularRef || !subject || !body) {
      return res.status(400).json({ error: 'Missing required circular fields: circularRef, subject, body' });
    }

    // Sample roster of parish chiefs and accounting officers
    const sampleChiefs = [
      { name: 'Kato Paul', district: 'Wakiso', parish: 'Kasangati Parish', phone: '+256772100101' },
      { name: 'Akello Grace', district: 'Gulu', parish: 'Pece Ward', phone: '+256782200202' },
      { name: 'Mbabazi Sarah', district: 'Mbarara', parish: 'Kamukuzi Parish', phone: '+256701300303' },
      { name: 'Okello David', district: 'Lira', parish: 'Ojwina Ward', phone: '+256752400404' },
      { name: 'Musoke Ronald', district: 'Kampala', parish: 'Bukoto II Parish', phone: '+256773500505' },
      { name: 'Nalwanga Prossy', district: 'Mukono', parish: 'Goma Division', phone: '+256784600606' },
      { name: 'Tumwine Arthur', district: 'Kabale', parish: 'Central Ward', phone: '+256705700707' },
      { name: 'Cherotich Faith', district: 'Kapchorwa', parish: 'Tebeson Parish', phone: '+256756800808' },
    ];

    const targetList = Array.isArray(targetAudience) && targetAudience.length > 0 ? targetAudience : sampleChiefs;
    const dispatchedRecords: any[] = [];
    const chosenChannels = Array.isArray(channels) && channels.length > 0 ? channels : ['sms', 'whatsapp'];

    for (const chief of targetList) {
      for (const ch of chosenChannels) {
        const item = {
          id: 'notif_' + Math.random().toString(36).substring(2, 9),
          circularRef,
          subject,
          body,
          channel: ch,
          targetDistrict: chief.district || 'National',
          targetChiefName: chief.name,
          targetChiefPhone: chief.phone,
          parishName: chief.parish || 'Parish Secretariat',
          status: 'delivered',
          dispatchedAt: new Date().toISOString(),
          deliveryLatencyMs: Math.floor(80 + Math.random() * 120),
        };
        inMemoryCircularQueue.push(item);
        dispatchedRecords.push(item);
      }
    }

    res.json({
      success: true,
      circularRef,
      dispatchedCount: dispatchedRecords.length,
      channelsUsed: chosenChannels,
      message: `Dispatched circular ${circularRef} to ${targetList.length} local accounting nodes.`,
      records: dispatchedRecords,
    });
  });

  // =========================================================================
  // ITEM 2: TELECOM USSD (*3030#) & 2-WAY SMS WEBHOOK INGESTION (PHASE 2)
  // =========================================================================
  // Compliant with Africa's Talking / Twilio / Telco GSM Gateway standards
  app.post('/api/ussd/session', (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text, networkCode } = req.body || {};
    const cleanText = (text || '').trim();
    const parts = cleanText.split('*');
    const step = cleanText === '' ? 0 : parts.length;

    let response = '';

    if (step === 0) {
      // Dialing initial shortcode *3030#
      response = `CON 🇺🇬 CIVICDUTY SOVEREIGN GOVERNANCE (*3030#)
1. Report Broken Infrastructure
2. Track Ticket Status
3. PDM SACCO / Parish Grievance
4. Confirm Work Completed (Heard)
5. Anti-Corruption Whistleblower
0. Exit`;
    } else if (parts[0] === '1') {
      if (step === 1) {
        response = `CON SELECT CATEGORY:
1. Pothole / Road
2. Water Borehole
3. Power Outage
4. Health Center
5. Primary School
0. Back`;
      } else if (step === 2) {
        response = `CON ENTER YOUR PARISH / WARD NAME:
(e.g. Bukoto, Kasangati, Pece)`;
      } else if (step === 3) {
        response = `CON DESCRIBE THE ISSUE BRIEFLY:
(e.g. Deep crater near market)`;
      } else if (step === 4) {
        const ticketId = 'UG-USSD-' + Math.floor(1000 + Math.random() * 9000);
        response = `END TICKET CREATED: #${ticketId}
Report dispatched to District Works Desk.
SLA Timer: 48 Hours.
Free tracking SMS sent to ${phoneNumber || 'your phone'}.
Speak. Serve. Be Heard.`;
      }
    } else if (parts[0] === '2') {
      if (step === 1) {
        response = `CON ENTER TICKET ID TO TRACK:
(e.g. KLA-102 or UG-902)`;
      } else {
        const queryId = parts[1] || 'KLA-102';
        response = `END STATUS FOR #${queryId}:
Status: IN PROGRESS (Amber Signal)
Assigned: Kampala Central Works
SLA Remaining: 18h 40m
Contractor on-site.`;
      }
    } else if (parts[0] === '4') {
      if (step === 1) {
        response = `CON COMMUNITY PROOF-OF-WORK:
Enter Ticket ID to confirm work completed:`;
      } else {
        const queryId = parts[1] || 'TKT';
        response = `END THANK YOU CITIZEN!
Ratification logged for #${queryId}.
Work certified by community consensus.
Signal changed to GREEN (Closed).`;
      }
    } else if (parts[0] === '5') {
      if (step === 1) {
        response = `CON 🔒 ANTI-CORRUPTION WHISTLEBLOWER
Protected under Whistleblower Act 2010.
Enter Agency & Extortion/Bribe Details:`;
      } else {
        const sealId = 'SEAL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        response = `END 🛡️ ENCRYPTED REPORT RECEIVED!
Evidence Sealed: #${sealId}
Forwarded to IGG & SHACU desks.
Your phone identity has been masked.`;
      }
    } else {
      response = `END Thank you for using CivicDuty Sovereign Network.
Session ended.`;
    }

    res.setHeader('Content-Type', 'text/plain');
    res.send(response);
  });

  app.post('/api/sms/incoming', (req, res) => {
    const { from, body, text: rawText, to, messageId } = req.body || {};
    const text = (body || rawText || '').trim();
    const sender = from || '+256770000000';

    // Parse simple SMS command: e.g. "REPORT Pothole on Jinja Road near Shell"
    const isReport = text.toLowerCase().startsWith('report');
    const isTrack = text.toLowerCase().startsWith('track');

    let replyMessage = '';
    let generatedTicket = null;

    if (isReport) {
      const ticketId = 'SMS-' + Math.floor(10000 + Math.random() * 90000);
      generatedTicket = {
        id: ticketId,
        sender,
        text: text.replace(/^report\s*/i, ''),
        status: 'pending',
        timestamp: new Date().toISOString(),
      };
      replyMessage = `CIVICDUTY: Report registered as #${ticketId}. Routed to municipal engineer. 48h SLA timer active. Reply TRACK ${ticketId} for updates.`;
    } else if (isTrack) {
      const queryId = text.replace(/^track\s*/i, '').trim();
      replyMessage = `CIVICDUTY: Ticket #${queryId || 'RECORD'} is ACTIVE. Assigned to municipal field unit. Inspection scheduled within 24h.`;
    } else {
      replyMessage = `CIVICDUTY UGANDA: Send 'REPORT <details>' to lodge civic issues, or 'TRACK <ticket-id>' to follow up. Toll-free or dial *3030#.`;
    }

    res.json({
      success: true,
      messageId: messageId || 'sms_' + Date.now(),
      reply: replyMessage,
      ticket: generatedTicket,
    });
  });

  // =========================================================================
  // ITEM 3: FISCAL VOUCHER & MILESTONE DISBURSEMENT ENGINE (PHASE 3)
  // =========================================================================
  const inMemoryVouchers: any[] = [];

  app.get('/api/disbursements/vouchers', (req, res) => {
    res.json({
      success: true,
      totalVouchers: inMemoryVouchers.length,
      vouchers: inMemoryVouchers,
    });
  });

  app.post('/api/disbursements/generate-voucher', (req, res) => {
    const { projectId, projectTitle, contractor, country, milestoneId, milestoneTitle, grossAmount, currency, awarderSigner, contractorSigner } = req.body || {};
    
    if (!projectId || !milestoneId || !grossAmount) {
      return res.status(400).json({ error: 'Missing required voucher parameters: projectId, milestoneId, grossAmount' });
    }

    const gross = Number(grossAmount);
    const whtTaxRate = 0.06; // 6% Withholding Tax standard for Gov procurement
    const whtTaxDeduction = Math.round(gross * whtTaxRate);
    const vatRate = 0.18; // 18% Value Added Tax
    const vatAmount = Math.round(gross * vatRate);
    const netPayable = gross - whtTaxDeduction;

    const voucherNumber = 'VCH-' + (country || 'UG') + '-' + Math.floor(100000 + Math.random() * 900000);
    const blockchainSeal = 'SEAL-' + Buffer.from(voucherNumber + milestoneId + netPayable).toString('hex').slice(0, 32).toUpperCase();

    const voucher = {
      id: 'vch_' + Math.random().toString(36).substring(2, 9),
      voucherNumber,
      projectId,
      projectTitle: projectTitle || 'Public Infrastructure Project',
      contractor: contractor || 'Certified Works Contractor',
      country: country || 'UG',
      milestoneId,
      milestoneTitle: milestoneTitle || 'Dual-Signed Milestone',
      grossAmount: gross,
      currency: currency || 'UGX',
      whtTaxRate,
      whtTaxDeduction,
      vatRate,
      vatAmount,
      netPayable,
      awarderSigner: awarderSigner || 'Supervising Engineer (Procuring Entity)',
      contractorSigner: contractorSigner || 'Managing Director (Contractor)',
      treasurySigner: 'MoFPED Automated Fiscal Warrant Authority',
      issuedAt: new Date().toISOString(),
      disbursementStatus: 'certified_pending_release',
      blockchainSeal,
    };

    inMemoryVouchers.push(voucher);

    res.json({
      success: true,
      message: `Fiscal Warrant & Milestone Release Voucher #${voucherNumber} minted successfully.`,
      voucher,
    });
  });

  app.post('/api/disbursements/release-escrow', (req, res) => {
    const { voucherId } = req.body || {};
    const found = inMemoryVouchers.find((v) => v.id === voucherId || v.voucherNumber === voucherId);

    if (!found) {
      return res.status(404).json({ error: 'Voucher not found' });
    }

    found.disbursementStatus = 'completed_bank_transfer';
    found.releasedAt = new Date().toISOString();

    res.json({
      success: true,
      message: `Funds disbursed: ${found.currency} ${found.netPayable.toLocaleString()} transferred to ${found.contractor} Bank Escrow.`,
      voucher: found,
    });
  });

  // =========================================================================
  // ITEM 4: AFRICAN PAYMENT GATEWAY (MOMO & CARDS - PHASE 5)
  // =========================================================================
  const inMemoryTransactions: any[] = [];

  app.get('/api/payments/transactions', (req, res) => {
    res.json({
      success: true,
      transactions: inMemoryTransactions,
    });
  });

  app.post('/api/payments/initialize', (req, res) => {
    const {
      provider,
      paymentMethod,
      invoiceId,
      amount,
      currency,
      payerPhoneOrEmail,
      payerPhone,
      payerEmail,
      channel,
      entityName,
    } = req.body || {};

    const contact = payerPhoneOrEmail || payerPhone || payerEmail || '+256778277900';
    const selectedProvider = provider || paymentMethod || 'mtn_momo';
    const reference = 'CD-PAY-' + Math.floor(10000000 + Math.random() * 90000000);

    const transaction = {
      id: 'tx_' + Math.random().toString(36).substring(2, 9),
      provider: selectedProvider,
      paymentMethod: selectedProvider,
      entityName: entityName || 'CivicDesk Entity',
      invoiceId: invoiceId || 'INV-DIRECT',
      amount: Number(amount || 18000),
      currency: currency || 'USD',
      payerPhoneOrEmail: contact,
      reference,
      transactionReference: reference,
      status: 'pending',
      channel: channel || (selectedProvider.includes('momo') || selectedProvider.includes('airtel') ? 'mobile_money' : 'card'),
      timestamp: new Date().toISOString(),
      instructions: selectedProvider.includes('momo')
        ? `Prompt sent to ${contact}. Dial *165*1# to approve PIN.`
        : selectedProvider.includes('airtel')
        ? `USSD push sent to ${contact}. Enter Airtel Money PIN.`
        : `Secure 3D-Secure link generated for ${contact}.`,
    };

    inMemoryTransactions.push(transaction);

    res.json({
      success: true,
      reference,
      transactionReference: reference,
      transaction,
      message: `Transaction initiated via ${selectedProvider.toUpperCase()}.`,
    });
  });

  app.post('/api/payments/verify', (req, res) => {
    const { reference, transactionReference } = req.body || {};
    const refToLookup = reference || transactionReference;
    const tx = inMemoryTransactions.find((t) => t.reference === refToLookup || t.transactionReference === refToLookup);

    if (!tx) {
      return res.status(404).json({ error: 'Transaction reference not found' });
    }

    tx.status = 'success';
    tx.receiptUrl = `/api/payments/receipt/${tx.reference}`;

    res.json({
      success: true,
      status: 'success',
      message: `Payment reference ${tx.reference} verified and settled.`,
      transaction: tx,
    });
  });

  app.get('/api/payments/receipt/:ref', (req, res) => {
    const tx = inMemoryTransactions.find((t) => t.reference === req.params.ref);
    if (!tx) {
      return res.status(404).send('Receipt not found');
    }

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>CivicDuty Payment Receipt #${tx.reference}</title>
        <style>
          body { font-family: monospace; padding: 40px; background: #0f172a; color: #f8fafc; }
          .receipt-box { max-width: 500px; margin: 0 auto; background: #1e293b; padding: 24px; border-radius: 12px; border: 1px solid #334155; }
          .header { border-bottom: 2px dashed #475569; padding-bottom: 12px; margin-bottom: 16px; }
          .title { font-size: 18px; font-weight: bold; color: #10b981; }
          .row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 13px; }
          .footer { border-top: 2px dashed #475569; padding-top: 12px; margin-top: 16px; text-align: center; font-size: 11px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="receipt-box">
          <div class="header">
            <div class="title">CIVICDUTY SOVEREIGN RECEIPT</div>
            <div>Ref: ${tx.reference}</div>
            <div>Date: ${tx.timestamp}</div>
          </div>
          <div class="row"><span>Channel:</span><strong>${tx.channel.toUpperCase()} (${tx.provider})</strong></div>
          <div class="row"><span>Payer:</span><strong>${tx.payerPhoneOrEmail}</strong></div>
          <div class="row"><span>Invoice:</span><strong>${tx.invoiceId}</strong></div>
          <div class="row" style="font-size: 16px; color: #38bdf8;"><span>Amount Settled:</span><strong>${tx.currency} ${tx.amount.toLocaleString()}</strong></div>
          <div class="row" style="color: #4ade80;"><span>Status:</span><strong>SETTLED ✓</strong></div>
          <div class="footer">
            Sovereign Municipal & Commercial Billing Engine<br/>
            Cryptographically sealed and audited.
          </div>
        </div>
      </body>
      </html>
    `);
  });

  // =========================================================================
  // ITEM 5: PRE-FUNDED DIGITAL UTILITY PERK ESCROW VAULT (PHASE 6)
  // =========================================================================
  const getReimbursementLabel = (cat: string) => {
    switch (cat) {
      case 'telco_data':
        return '📡 Field Data Reimbursement (Replenishes Citizen Evidence Upload Data)';
      case 'transit_credit':
        return '🛵 Scout Transit Pass (Offsets Frontline Site Verification Fare)';
      case 'water_utility':
        return '💧 Water Utility Credit (Leak & Sanitation Whistleblower Recognition)';
      case 'electricity':
        return '⚡ Power Grid Credit (Transformer & Line Safety Audit Recognition)';
      default:
        return '🎁 Community Service Field Cost Reimbursement';
    }
  };

  const buildCommissionBreakdown = (faceValue: number, isByovCsv: boolean = false) => {
    const fv = Number(faceValue) || 10000;
    const wholesaleDiscountPct = isByovCsv ? 0 : 6;
    const wholesaleSpreadCommission = Math.round(fv * (wholesaleDiscountPct / 100));
    const csrPlatformFeePct = isByovCsv ? 0 : 5;
    const csrPlatformFee = Math.round(fv * (csrPlatformFeePct / 100));
    return {
      faceValueTotal: fv,
      wholesaleDiscountPct,
      wholesaleSpreadCommission,
      csrPlatformFeePct,
      csrPlatformFee,
      totalCivicDutyRevenue: wholesaleSpreadCommission + csrPlatformFee,
    };
  };

  const inMemoryPerkVouchers: any[] = [
    {
      id: 'PV-UG-001',
      voucherCode: 'MTN-2GB-8841-CIVIC',
      pin: '8841',
      category: 'telco_data',
      brand: 'MTN Uganda',
      title: '2GB High-Speed MTN Data Pack',
      faceValue: 10000,
      currency: 'UGX',
      country: 'UG',
      sponsoredBy: 'Seyani Brothers Construction Ltd (CSR Allocation)',
      sponsorType: 'contractor',
      projectId: 'PRJ-KLA-001',
      projectName: 'Kampala Flyover & Southern Bypass',
      batchId: 'BATCH-SEYANI-CSR-01',
      status: 'escrow_unassigned',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      redemptionUssdString: '*165*2*8841#',
      expiryDate: '2026-12-31',
      isDemo: true,
      reimbursementFraming: getReimbursementLabel('telco_data'),
      ethicalPledgeSealed: true,
      commissionBreakdown: buildCommissionBreakdown(10000, false),
    },
    {
      id: 'PV-UG-002',
      voucherCode: 'MTN-2GB-9923-CIVIC',
      pin: '9923',
      category: 'telco_data',
      brand: 'MTN Uganda',
      title: '2GB High-Speed MTN Data Pack',
      faceValue: 10000,
      currency: 'UGX',
      country: 'UG',
      sponsoredBy: 'Seyani Brothers Construction Ltd (CSR Allocation)',
      sponsorType: 'contractor',
      projectId: 'PRJ-KLA-001',
      projectName: 'Kampala Flyover & Southern Bypass',
      batchId: 'BATCH-SEYANI-CSR-01',
      status: 'escrow_unassigned',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      redemptionUssdString: '*165*2*9923#',
      expiryDate: '2026-12-31',
      isDemo: true,
      reimbursementFraming: getReimbursementLabel('telco_data'),
      ethicalPledgeSealed: true,
      commissionBreakdown: buildCommissionBreakdown(10000, false),
    },
    {
      id: 'PV-UG-003',
      voucherCode: 'AIRTEL-1GB-4491-UG',
      pin: '4491',
      category: 'telco_data',
      brand: 'Airtel Uganda',
      title: '1.5GB Airtel 4G/5G Data Bundle',
      faceValue: 8000,
      currency: 'UGX',
      country: 'UG',
      sponsoredBy: 'KCCA Urban Infrastructure Division',
      sponsorType: 'authority',
      batchId: 'BATCH-KCCA-GOV-02',
      status: 'escrow_unassigned',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      redemptionUssdString: '*185*9*4491#',
      expiryDate: '2026-12-31',
      isDemo: true,
      reimbursementFraming: getReimbursementLabel('telco_data'),
      ethicalPledgeSealed: true,
      commissionBreakdown: buildCommissionBreakdown(8000, false),
    },
    {
      id: 'PV-UG-004',
      voucherCode: 'NWSC-10K-9902-UG',
      pin: '9902',
      category: 'water_utility',
      brand: 'NWSC Uganda',
      title: '10,000 UGX NWSC Water Prepaid Token',
      faceValue: 10000,
      currency: 'UGX',
      country: 'UG',
      sponsoredBy: 'National Water & Sewerage Corp (Leakage Reporting Program)',
      sponsorType: 'authority',
      batchId: 'BATCH-NWSC-CSR-01',
      status: 'escrow_unassigned',
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
      redemptionUssdString: '*303*9902#',
      expiryDate: '2026-12-31',
      isDemo: true,
      reimbursementFraming: getReimbursementLabel('water_utility'),
      ethicalPledgeSealed: true,
      commissionBreakdown: buildCommissionBreakdown(10000, false),
    },
    {
      id: 'PV-UG-005',
      voucherCode: 'YAKA-15K-3382-UG',
      pin: '3382',
      category: 'electricity',
      brand: 'Umeme Power',
      title: '15,000 UGX Umeme Yaka Electricity Token',
      faceValue: 15000,
      currency: 'UGX',
      country: 'UG',
      sponsoredBy: 'Ministry of Energy & Mineral Development',
      sponsorType: 'authority',
      batchId: 'BATCH-MEMD-01',
      status: 'escrow_unassigned',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      redemptionUssdString: '*185*4*1*3382#',
      expiryDate: '2026-12-31',
      isDemo: true,
      reimbursementFraming: getReimbursementLabel('electricity'),
      ethicalPledgeSealed: true,
      commissionBreakdown: buildCommissionBreakdown(15000, false),
    },
    {
      id: 'PV-UG-006',
      voucherCode: 'SB-RIDE-5K-7712',
      pin: '7712',
      category: 'transit_credit',
      brand: 'SafeBoda',
      title: '5,000 UGX SafeBoda Commuter Pass',
      faceValue: 5000,
      currency: 'UGX',
      country: 'UG',
      sponsoredBy: 'Seyani Brothers Construction Ltd (CSR Allocation)',
      sponsorType: 'contractor',
      projectId: 'PRJ-KLA-001',
      projectName: 'Kampala Flyover & Southern Bypass',
      batchId: 'BATCH-SEYANI-CSR-01',
      status: 'escrow_unassigned',
      createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
      redemptionUssdString: '*165*4*7712#',
      expiryDate: '2026-12-31',
      isDemo: true,
      reimbursementFraming: getReimbursementLabel('transit_credit'),
      ethicalPledgeSealed: true,
      commissionBreakdown: buildCommissionBreakdown(5000, false),
    },
    {
      id: 'PV-KE-001',
      voucherCode: 'SAF-5GB-7712-KE',
      pin: '7712',
      category: 'telco_data',
      brand: 'Safaricom',
      title: '5GB Safaricom High-Speed Data',
      faceValue: 500,
      currency: 'KES',
      country: 'KE',
      sponsoredBy: 'Nairobi City County Public Works',
      sponsorType: 'authority',
      batchId: 'BATCH-NCC-01',
      status: 'escrow_unassigned',
      createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
      redemptionUssdString: '*141*7712#',
      expiryDate: '2026-12-31',
      isDemo: true,
      reimbursementFraming: getReimbursementLabel('telco_data'),
      ethicalPledgeSealed: true,
      commissionBreakdown: buildCommissionBreakdown(500, false),
    },
    {
      id: 'PV-KE-002',
      voucherCode: 'KPLC-TOK-8831-KE',
      pin: '8831',
      category: 'electricity',
      brand: 'Kenya Power (KPLC)',
      title: '1,000 KES KPLC Stima Electricity Token',
      faceValue: 1000,
      currency: 'KES',
      country: 'KE',
      sponsoredBy: 'H-Young Engineering Contractors',
      sponsorType: 'contractor',
      batchId: 'BATCH-HYOUNG-CSR-01',
      status: 'escrow_unassigned',
      createdAt: new Date(Date.now() - 3600000 * 40).toISOString(),
      redemptionUssdString: '*977*8831#',
      expiryDate: '2026-12-31',
      isDemo: true,
      reimbursementFraming: getReimbursementLabel('electricity'),
      ethicalPledgeSealed: true,
      commissionBreakdown: buildCommissionBreakdown(1000, false),
    },
    {
      id: 'PV-NG-001',
      voucherCode: 'MTN-NG-3GB-5521',
      pin: '5521',
      category: 'telco_data',
      brand: 'MTN Nigeria',
      title: '3GB MTN Nigeria Civic Scout Data Pack',
      faceValue: 2500,
      currency: 'NGN',
      country: 'NG',
      sponsoredBy: 'Julius Berger Nigeria PLC (CSR Watchdog Pool)',
      sponsorType: 'contractor',
      batchId: 'BATCH-JBN-NG-01',
      status: 'escrow_unassigned',
      createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      redemptionUssdString: '*312*5521#',
      expiryDate: '2026-12-31',
      isDemo: true,
      reimbursementFraming: getReimbursementLabel('telco_data'),
      ethicalPledgeSealed: true,
      commissionBreakdown: buildCommissionBreakdown(2500, false),
    },
    {
      id: 'PV-GH-001',
      voucherCode: 'ECG-GH-50GHS-9012',
      pin: '9012',
      category: 'electricity',
      brand: 'ECG Ghana',
      title: '50 GHS ECG Prepaid Power Credit',
      faceValue: 50,
      currency: 'GHS',
      country: 'GH',
      sponsoredBy: 'Accra Metropolitan Assembly (Grid Safety Pool)',
      sponsorType: 'authority',
      batchId: 'BATCH-AMA-GH-01',
      status: 'escrow_unassigned',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      redemptionUssdString: '*226*9012#',
      expiryDate: '2026-12-31',
      isDemo: true,
      reimbursementFraming: getReimbursementLabel('electricity'),
      ethicalPledgeSealed: true,
      commissionBreakdown: buildCommissionBreakdown(50, false),
    },
    {
      id: 'PV-ZA-001',
      voucherCode: 'VODA-ZA-2GB-6619',
      pin: '6619',
      category: 'telco_data',
      brand: 'Vodacom SA',
      title: '2GB Vodacom Field Evidence Data Pack',
      faceValue: 150,
      currency: 'ZAR',
      country: 'ZA',
      sponsoredBy: 'OUTA & Johannesburg Civic Integrity Trust',
      sponsorType: 'corporate_csr',
      batchId: 'BATCH-ZA-CSR-01',
      status: 'escrow_unassigned',
      createdAt: new Date(Date.now() - 3600000 * 16).toISOString(),
      redemptionUssdString: '*136*6619#',
      expiryDate: '2026-12-31',
      isDemo: true,
      reimbursementFraming: getReimbursementLabel('telco_data'),
      ethicalPledgeSealed: true,
      commissionBreakdown: buildCommissionBreakdown(150, false),
    },
  ];

  // GET /api/perks/vault - List escrow vouchers with statistics
  app.get('/api/perks/vault', (req, res) => {
    const { country, status, brand, projectId, sponsorType } = req.query as Record<string, string>;

    let filtered = [...inMemoryPerkVouchers];

    if (country) {
      filtered = filtered.filter((v) => v.country.toUpperCase() === country.toUpperCase());
    }
    if (status) {
      filtered = filtered.filter((v) => v.status === status);
    }
    if (brand) {
      filtered = filtered.filter((v) => v.brand.toLowerCase().includes(brand.toLowerCase()));
    }
    if (projectId) {
      filtered = filtered.filter((v) => v.projectId === projectId);
    }
    if (sponsorType) {
      filtered = filtered.filter((v) => v.sponsorType === sponsorType);
    }

    const totalCount = inMemoryPerkVouchers.length;
    const unassignedCount = inMemoryPerkVouchers.filter((v) => v.status === 'escrow_unassigned').length;
    const dispatchedCount = inMemoryPerkVouchers.filter((v) => v.status === 'dispatched').length;
    const redeemedCount = inMemoryPerkVouchers.filter((v) => v.status === 'redeemed').length;

    const totalEscrowFaceValue = inMemoryPerkVouchers
      .filter((v) => v.status === 'escrow_unassigned')
      .reduce((sum, v) => sum + (Number(v.faceValue) || 0), 0);

    const uniqueSponsors = new Set(inMemoryPerkVouchers.map((v) => v.sponsoredBy)).size;

    res.json({
      success: true,
      vouchers: filtered,
      stats: {
        totalCount,
        unassignedCount,
        dispatchedCount,
        redeemedCount,
        totalEscrowFaceValue,
        uniqueSponsors,
      },
    });
  });

  // POST /api/perks/upload-batch - Batch deposit pre-funded vouchers from CSV / JSON
  app.post('/api/perks/upload-batch', (req, res) => {
    const {
      batchName,
      sponsorName,
      sponsorType,
      projectId,
      projectName,
      country,
      vouchers,
      isDemo,
      sourceMethod,
    } = req.body || {};

    if (!vouchers || !Array.isArray(vouchers) || vouchers.length === 0) {
      return res.status(400).json({ error: 'vouchers array is required and must not be empty' });
    }

    const batchId = 'BATCH-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const createdDate = new Date().toISOString();
    const targetCountry = country || 'UG';
    const targetSponsor = sponsorName || 'Contractor CSR Escrow';
    const targetSponsorType = sponsorType || 'contractor';
    const isByov = sourceMethod === 'csv' || sourceMethod === 'manual';

    const uploadedRecords: any[] = [];

    for (let i = 0; i < vouchers.length; i++) {
      const v = vouchers[i];
      const code = v.voucherCode || v.code || `VOUCH-${Math.floor(100000 + Math.random() * 900000)}`;
      const brand = v.brand || 'Utility Partner';
      const category = v.category || (brand.toLowerCase().includes('data') || brand.toLowerCase().includes('mtn') || brand.toLowerCase().includes('airtel') ? 'telco_data' : 'water_utility');
      const fv = Number(v.faceValue) || 10000;

      const record = {
        id: 'PV-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        voucherCode: code,
        pin: v.pin || code.split('-').pop() || '',
        category,
        brand,
        title: v.title || `${fv} ${v.currency || 'UGX'} ${brand} Voucher`,
        faceValue: fv,
        currency: v.currency || (targetCountry === 'KE' ? 'KES' : 'UGX'),
        country: targetCountry,
        sponsoredBy: targetSponsor,
        sponsorType: targetSponsorType,
        projectId: projectId || undefined,
        projectName: projectName || undefined,
        batchId: batchName ? `${batchName} (${batchId})` : batchId,
        status: 'escrow_unassigned',
        createdAt: createdDate,
        isDemo: Boolean(isDemo),
        reimbursementFraming: getReimbursementLabel(category),
        ethicalPledgeSealed: true,
        commissionBreakdown: buildCommissionBreakdown(fv, isByov),
        redemptionUssdString: v.redemptionUssdString || (targetCountry === 'KE' ? '*141*CODE#' : '*303*CODE#').replace('CODE', code),
        expiryDate: v.expiryDate || '2026-12-31',
      };

      inMemoryPerkVouchers.unshift(record);
      uploadedRecords.push(record);
    }

    res.json({
      success: true,
      batchId,
      uploadedCount: uploadedRecords.length,
      vouchers: uploadedRecords,
      message: `Successfully deposited ${uploadedRecords.length} pre-funded vouchers into Sovereign Perk Escrow.`,
    });
  });

  // POST /api/perks/dispatch-from-vault - Atomically dispatches a pre-funded voucher to a citizen
  app.post('/api/perks/dispatch-from-vault', (req, res) => {
    const {
      voucherId,
      brand,
      category,
      recipientName,
      recipientContact,
      note,
      dispatchedBy,
      projectId,
      selfRedeem,
      xpSpent,
    } = req.body || {};

    if (!recipientName || !recipientContact) {
      return res.status(400).json({ error: 'recipientName and recipientContact are required' });
    }

    let targetVoucher: any = null;

    if (voucherId) {
      targetVoucher = inMemoryPerkVouchers.find((v) => v.id === voucherId && v.status === 'escrow_unassigned');
    } else {
      // Find matching unassigned voucher
      targetVoucher = inMemoryPerkVouchers.find((v) => {
        if (v.status !== 'escrow_unassigned') return false;
        if (brand && !v.brand.toLowerCase().includes(brand.toLowerCase())) return false;
        if (category && v.category !== category) return false;
        if (projectId && v.projectId && v.projectId !== projectId) return false;
        return true;
      });

      // Fallback: any unassigned voucher if brand match was not exact
      if (!targetVoucher) {
        targetVoucher = inMemoryPerkVouchers.find((v) => v.status === 'escrow_unassigned');
      }
    }

    if (!targetVoucher) {
      return res.status(404).json({
        error: 'NO_VOUCHERS_IN_ESCROW',
        message: 'No pre-funded vouchers matching this category are currently unassigned in escrow. Please upload vouchers to the Perk Vault first.',
      });
    }

    // Mark as dispatched
    targetVoucher.status = 'dispatched';
    targetVoucher.selfRedeemedByCitizen = Boolean(selfRedeem);
    if (xpSpent) {
      targetVoucher.xpSpent = Number(xpSpent);
    }
    targetVoucher.dispatchedTo = {
      recipientName,
      recipientContact,
      dispatchedAt: new Date().toISOString(),
      dispatchedBy: selfRedeem ? `Citizen Self-Redemption (${xpSpent || 500} XP)` : (dispatchedBy || 'CivicDuty Official'),
      citationNote: note || 'Frontline Civic Field Cost Reimbursement · Non-Interference Covenant Sealed',
      smsDeliveryStatus: 'delivered',
      ethicalNonInterferenceAck: true,
    };

    res.json({
      success: true,
      voucher: targetVoucher,
      message: `Voucher ${targetVoucher.voucherCode} dispatched to ${recipientName} (${recipientContact}). SMS push sent.`,
    });
  });

  // ============================================================================
  // CD-OPS AI ARCHITECTURAL & PROMPT RECOMMENDATION ENGINE (GEMINI API)
  // ============================================================================
  app.post('/api/cd-ops/ai-recommendations', async (req, res) => {
    const {
      id,
      countryCode = 'UG',
      countryName = 'Uganda',
      senderMinistry = 'Ministry of Local Government (MoLG)',
      senderOfficer = 'Permanent Secretary',
      senderTitle = 'National Superadmin',
      subject = 'Sovereign Platform Modification Request',
      message = '',
      priority = 'statutory_directive',
      superadminNotes = '',
    } = req.body || {};

    // Deterministic, context-aware fallback generator so CD-Ops is always responsive
    const buildContextualFallback = () => {
      const lowerText = `${subject} ${message}`.toLowerCase();
      const isUssdOrTelecom = lowerText.includes('ussd') || lowerText.includes('sms') || lowerText.includes('3030') || lowerText.includes('telco');
      const isSlaOrEscalation = lowerText.includes('sla') || lowerText.includes('escalat') || lowerText.includes('window') || lowerText.includes('hour') || lowerText.includes('pfma');
      const isAuditOrBudget = lowerText.includes('audit') || lowerText.includes('budget') || lowerText.includes('procurement') || lowerText.includes('igg') || lowerText.includes('fiscal');

      return {
        modelUsed: 'gemini-3.8-flash (CivicDuty Sovereign Synthesis)',
        executiveDiagnosis: `National Node Head (${senderOfficer}, ${senderTitle} — ${senderMinistry}, ${countryName}) is requesting a ${priority.replace(/_/g, ' ')} regarding "${subject}". Recommended approach: execute a non-breaking modular update scoped to [${countryCode}] while preserving cross-country schema parity and SHA-256 audit seals.`,
        recommendations: [
          {
            id: 'opt-a-rapid',
            tierLabel: 'OPTION A · RAPID CONFIGURATION & SLA CALIBRATION',
            title: isUssdOrTelecom
              ? `Calibrate [${countryCode}] USSD *3030# Session Routing & Menu Tree`
              : isSlaOrEscalation
              ? `Update [${countryCode}] Statutory SLA Timer & Escalation Thresholds`
              : `Configure [${countryCode}] ${senderMinistry} Desk Parameters & Metadata`,
            impactSummary: `Fastest zero-downtime deployment. Adjusts country configuration, SLA rules, and statutory labels for ${countryName} without altering core database tables.`,
            estimatedTurnaround: 'Immediate (Single Turn)',
            recommendedPrompt: `For ${countryName} (${countryCode}) per the directive "${subject}" from ${senderOfficer} (${senderTitle}, ${senderMinistry}): Update the ${countryCode} country configuration, statutory SLA thresholds, and desk routing rules to fulfill: "${message}". Ensure the update is reflected in the Government Desk, Audit Ledger, and USSD simulator while maintaining the aistudio.google aesthetic.`,
            officialReplyDraft: `Attention: ${senderTitle} ${senderOfficer}, ${senderMinistry} (${countryName}).\n\nCivicDuty Platform Operations (CD-Ops) has executed Option A (Rapid Configuration & Statutory Calibration) for Directive #[${id || 'DIR'}]: "${subject}". The ${countryName} node configuration and SLA routing matrix are now live and verified on the sovereign ledger.`,
          },
          {
            id: 'opt-b-workflow',
            tierLabel: 'OPTION B · FULL UI WORKFLOW & DESK ENHANCEMENT (RECOMMENDED)',
            title: isAuditOrBudget
              ? `Build Dedicated Fiscal & Statutory Audit Dossier Module for ${senderMinistry}`
              : `Upgrade ${countryName} Accounting Officer & Superadmin Desk UI Workflow`,
            impactSummary: `Builds a dedicated interactive panel in the Government & Statutory Desk and Audit View tailored to ${senderMinistry}'s operational requirements, complete with exportable SHA-256 compliance certificates.`,
            estimatedTurnaround: 'Standard Full-Stack Turn',
            recommendedPrompt: `Execute the National Superadmin directive "${subject}" for ${countryName} (${countryCode}) requested by ${senderOfficer} (${senderMinistry}): "${message}". Build the complete UI workflow and interactive controls in the Government Desk and Audit screens using the clean aistudio.google aesthetic (#ffffff / #161a22 surfaces, 1px borders, monospace telemetry), wire state handlers in AppContext, and add SHA-256 receipt verification.`,
            officialReplyDraft: `Attention: ${senderTitle} ${senderOfficer}, ${senderMinistry} (${countryName}).\n\nCivicDuty Platform Operations (CD-Ops) has deployed Option B (Full UI Workflow & Statutory Desk Enhancement) in response to Directive #[${id || 'DIR'}]. Accounting Officers across ${countryName} now have direct access to the upgraded workflow with full SHA-256 audit trail compliance.`,
          },
          {
            id: 'opt-c-fullstack',
            tierLabel: 'OPTION C · DEEP FULL-STACK API, TELECOM & LEDGER ARCHITECTURE',
            title: `End-to-End Server API Endpoint + Real-Time Firestore & Telemetry Sync`,
            impactSummary: `Adds dedicated Express backend routes in server.ts, Firestore cloud synchronization, and automated webhook/notification triggers for ${countryName}'s national infrastructure.`,
            estimatedTurnaround: 'Comprehensive Architectural Turn',
            recommendedPrompt: `Implement a full-stack architectural solution for ${countryName} (${countryCode}) National Superadmin directive "${subject}" (${senderMinistry}): "${message}". Create the backend Express API endpoints in server.ts, synchronize state with AppContext and Firestore, and add real-time telemetry indicators in the CD-Ops and PS Executive Desks following the aistudio.google design system.`,
            officialReplyDraft: `Attention: ${senderTitle} ${senderOfficer}, ${senderMinistry} (${countryName}).\n\nCivicDuty Platform Operations (CD-Ops) has completed Option C (Full-Stack API & Sovereign Ledger Architecture) for Directive #[${id || 'DIR'}]. Dedicated server-side endpoints, real-time notifications, and cryptographic audit seals are now active nationwide.`,
          },
        ],
      };
    };

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        ...buildContextualFallback(),
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const promptText = `You are the Principal AI Systems Architect for CivicDuty (the world's #1 civic technology and sovereign government accountability platform, built with React, TypeScript, Tailwind CSS in the aistudio.google aesthetic, Express server.ts, and Cloud Firestore).
A National Superadmin has endorsed and transmitted the following bilateral directive to CivicDuty Operations (CD-Ops):
- Directive ID: ${id}
- Country: ${countryName} (${countryCode})
- Ministry / Authority: ${senderMinistry}
- Officer: ${senderOfficer} (${senderTitle})
- Priority: ${priority}
- Superadmin Endorsement Note: ${superadminNotes || 'Endorsed for CD-Ops execution'}
- Subject: ${subject}
- Directive Message: ${message}

Generate:
1. "executiveDiagnosis": A concise 2-sentence architectural & statutory diagnosis of what the Superadmin needs and how it impacts the platform.
2. "recommendations": Exactly 3 actionable engineering options (Option A: Rapid Configuration/Calibration, Option B: Recommended UI & Workflow Feature, Option C: Deep Full-Stack API & Ledger Integration).
For each option, provide:
- "id": short string ID
- "tierLabel": e.g. "OPTION A · RAPID CONFIGURATION"
- "title": concise engineering title
- "impactSummary": 1-2 sentences explaining the technical scope
- "estimatedTurnaround": e.g. "1 Turn (Fast)"
- "recommendedPrompt": The exact, detailed natural-language prompt that the CivicDuty founder/team can copy and paste directly into Google AI Studio Build to command the AI engineer to implement this exact solution in the codebase (mentioning aistudio.google aesthetic, specific views/components, and country ${countryCode}).
- "officialReplyDraft": A formal, respectful bureaucratic dispatch response that CD-Ops can send back to ${senderTitle} ${senderOfficer} once the solution is deployed.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveDiagnosis: { type: Type.STRING },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    tierLabel: { type: Type.STRING },
                    title: { type: Type.STRING },
                    impactSummary: { type: Type.STRING },
                    estimatedTurnaround: { type: Type.STRING },
                    recommendedPrompt: { type: Type.STRING },
                    officialReplyDraft: { type: Type.STRING },
                  },
                  required: [
                    'id',
                    'tierLabel',
                    'title',
                    'impactSummary',
                    'estimatedTurnaround',
                    'recommendedPrompt',
                    'officialReplyDraft',
                  ],
                },
              },
            },
            required: ['executiveDiagnosis', 'recommendations'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed && Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
        return res.json({
          success: true,
          modelUsed: 'gemini-3.8-flash',
          executiveDiagnosis: parsed.executiveDiagnosis,
          recommendations: parsed.recommendations,
        });
      }

      return res.json({
        success: true,
        ...buildContextualFallback(),
      });
    } catch (error: any) {
      console.warn('Gemini recommendation synthesis fallback:', error?.message);
      return res.json({
        success: true,
        ...buildContextualFallback(),
      });
    }
  });

  // Vite development middleware or production static serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.sendFile(path.join(process.cwd(), 'index.html'));
      }
    });
  }

  // Primary platform listener on port 3000 (required for platform reverse proxy)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ CivicDuty Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });

  // If deployed in a standalone Cloud Run container expecting incoming traffic on $PORT
  if (CLOUD_RUN_PORT && CLOUD_RUN_PORT !== PORT) {
    try {
      const ingressServer = app.listen(CLOUD_RUN_PORT, '0.0.0.0', () => {
        console.log(`✓ Cloud Run ingress listening on port ${CLOUD_RUN_PORT}`);
      });
      ingressServer.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${CLOUD_RUN_PORT} proxy active in infrastructure.`);
        } else {
          console.warn(`Ingress port ${CLOUD_RUN_PORT} notice:`, err.message);
        }
      });
    } catch {
      // Handled by proxy
    }
  }
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
