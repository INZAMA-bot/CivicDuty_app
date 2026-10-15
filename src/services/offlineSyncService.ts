/**
 * Frontline Scout Offline Storage & Background Sync Service
 * 
 * Enables youth parish scouts, village local councilors, and citizen monitors
 * to lodge high-resolution incident reports and GPS timestamps even in remote
 * rural parishes with zero cellular reception. Queued records automatically
 * flush to the national sovereign database upon reconnecting to network.
 */

export interface OfflineReportItem {
  id: string;
  category: string;
  title: string;
  description: string;
  parish: string;
  subCounty?: string;
  district?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  photoDataUrl?: string;
  scoutNin?: string;
  queuedAt: string;
  syncAttempts: number;
  status: 'QUEUED' | 'SYNCING' | 'SYNCED' | 'FAILED';
}

const DB_NAME = 'civicduty_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'scout_outbox';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Enqueues a frontline incident report into IndexedDB
 */
export async function queueOfflineReport(
  report: Omit<OfflineReportItem, 'id' | 'queuedAt' | 'syncAttempts' | 'status'>
): Promise<OfflineReportItem> {
  const item: OfflineReportItem = {
    ...report,
    id: 'OFFLINE-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    queuedAt: new Date().toISOString(),
    syncAttempts: 0,
    status: 'QUEUED',
  };

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to save to IndexedDB, fallback to localStorage:', err);
    try {
      const existing = JSON.parse(localStorage.getItem('civicduty_offline_outbox') || '[]');
      existing.push(item);
      localStorage.setItem('civicduty_offline_outbox', JSON.stringify(existing));
    } catch (e) {
      // storage failed
    }
  }

  return item;
}

/**
 * Retrieves all currently queued offline incident reports
 */
export async function getQueuedOfflineReports(): Promise<OfflineReportItem[]> {
  try {
    const db = await openDatabase();
    return await new Promise<OfflineReportItem[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    try {
      return JSON.parse(localStorage.getItem('civicduty_offline_outbox') || '[]');
    } catch {
      return [];
    }
  }
}

/**
 * Removes a successfully synced report from the offline queue
 */
export async function removeOfflineReport(id: string): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    try {
      const existing: OfflineReportItem[] = JSON.parse(localStorage.getItem('civicduty_offline_outbox') || '[]');
      const filtered = existing.filter((item) => item.id !== id);
      localStorage.setItem('civicduty_offline_outbox', JSON.stringify(filtered));
    } catch {}
  }
}

/**
 * Attempts to sync all queued reports with the backend server
 */
export async function syncOfflineOutbox(): Promise<{
  synced: number;
  remaining: number;
  failed: number;
}> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { synced: 0, remaining: (await getQueuedOfflineReports()).length, failed: 0 };
  }

  const reports = await getQueuedOfflineReports();
  let synced = 0;
  let failed = 0;

  for (const report of reports) {
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_offline_report',
          report,
        }),
      });

      if (res.ok) {
        await removeOfflineReport(report.id);
        synced++;
      } else {
        failed++;
      }
    } catch (err) {
      failed++;
    }
  }

  const remainingReports = await getQueuedOfflineReports();
  return {
    synced,
    remaining: remainingReports.length,
    failed,
  };
}

/**
 * Subscribes to window online/offline events for automatic synchronization
 */
export function registerAutoSyncListener(onSyncComplete?: (syncedCount: number) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleOnline = async () => {
    console.log('[OfflineSync] Internet connection detected! Flushing scout queue...');
    const result = await syncOfflineOutbox();
    if (onSyncComplete && result.synced > 0) {
      onSyncComplete(result.synced);
    }
  };

  window.addEventListener('online', handleOnline);
  return () => {
    window.removeEventListener('online', handleOnline);
  };
}
