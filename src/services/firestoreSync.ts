import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Post,
  ClaimedEntityRecord,
  UserProfile,
  CountryCode,
  FiscalVoucher,
  ParishChiefNotification,
  GatewayTransaction,
  EscrowPerkVoucher,
  CdOpsPromotionalAd,
  CompiledWitnessReport,
} from '../types';

/**
 * Persists a new or updated citizen post to Cloud Firestore,
 * and records an immutable cryptographic audit receipt in /audit_ledger/
 */
export async function savePostToCloud(post: Post): Promise<void> {
  const postPath = `posts/${post.id}`;
  try {
    const postPayload = {
      id: post.id,
      country: post.country || 'UG',
      dept: post.dept || 'civic_desk',
      lane: post.lane || 'civic',
      citizen_id: post.citizen_id || 'anonymous',
      citizen_name: post.anonymous ? 'Masked Citizen' : (post.citizen_name || 'Citizen'),
      citizen_rank: post.citizen_rank || 'Observer',
      anonymous: Boolean(post.anonymous),
      category: post.category || 'other',
      title: post.title.slice(0, 256),
      body: post.body.slice(0, 4000),
      location: post.location ? post.location.slice(0, 256) : '',
      source: post.source || 'web',
      status: post.status || 'pending',
      is_corruption: Boolean(post.is_corruption),
      created_at: post.created_at || new Date().toISOString(),
      upvotes: Number(post.upvotes || 0),
      downvotes: Number(post.downvotes || 0),
      author_profession: post.author_profession || '',
      crypto_seal_hash: post.crypto_seal_hash || '',
      compiled_reports: post.compiled_reports || [],
      compiled_count: Number(post.compiled_count || (post.compiled_reports ? post.compiled_reports.length + 1 : 1)),
      is_master_dossier: Boolean(post.is_master_dossier),
      merged_from_ids: post.merged_from_ids || [],
    };

    await setDoc(doc(db, 'posts', post.id), postPayload);

    // If a cryptographic seal hash is present, record in the immutable audit ledger
    if (post.crypto_seal_hash) {
      const receiptId = `receipt_${post.id}`;
      const auditPayload = {
        ticketId: post.id,
        hash: post.crypto_seal_hash,
        country: post.country || 'UG',
        dept: post.dept || 'civic_desk',
        timestamp: new Date().toISOString(),
      };
      await setDoc(doc(db, 'audit_ledger', receiptId), auditPayload);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, postPath);
  }
}

/**
 * Updates upvotes count on a post in Cloud Firestore
 */
export async function updatePostUpvotesInCloud(postId: string, upvotes: number): Promise<void> {
  const path = `posts/${postId}`;
  try {
    await updateDoc(doc(db, 'posts', postId), { upvotes });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Updates downvotes count on a post in Cloud Firestore
 */
export async function updatePostDownvotesInCloud(postId: string, downvotes: number): Promise<void> {
  const path = `posts/${postId}`;
  try {
    await updateDoc(doc(db, 'posts', postId), { downvotes });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Updates post status or citizen resolution feedback in Cloud Firestore
 */
export async function updatePostResolutionInCloud(
  postId: string,
  status: string,
  citizenSatisfied: boolean | null
): Promise<void> {
  const path = `posts/${postId}`;
  try {
    await updateDoc(doc(db, 'posts', postId), {
      status,
      citizen_satisfied: citizenSatisfied,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Subscribes to real-time updates for posts matching the target country
 */
export function subscribeToPostsFromCloud(
  country: CountryCode | undefined,
  onPostsReceived: (posts: Partial<Post>[]) => void
): () => void {
  const collectionRef = collection(db, 'posts');
  const q = country
    ? query(collectionRef, where('country', '==', country))
    : collectionRef;

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const cloudPosts: Partial<Post>[] = [];
      snapshot.forEach((docSnap) => {
        cloudPosts.push(docSnap.data() as Partial<Post>);
      });
      onPostsReceived(cloudPosts);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'posts');
    }
  );

  return unsubscribe;
}

/**
 * Persists a commercial desk subscription claim to Cloud Firestore
 */
export async function saveClaimToCloud(claim: ClaimedEntityRecord): Promise<void> {
  const claimPath = `claims/${claim.deptId}`;
  try {
    const payload = {
      deptId: claim.deptId,
      country: claim.country || 'UG',
      businessName: claim.businessName.slice(0, 128),
      representativeName: claim.representativeName.slice(0, 128),
      officialEmail: claim.officialEmail.slice(0, 128),
      phone: claim.phone.slice(0, 32),
      role: claim.role.slice(0, 64),
      plan: claim.plan.slice(0, 64),
      claimedAt: claim.claimedAt || new Date().toISOString(),
      verified: Boolean(claim.verified),
      monthlyFee: Number(claim.monthlyFee || 0),
    };
    await setDoc(doc(db, 'claims', claim.deptId), payload);

    // Also update department claimed state
    await setDoc(
      doc(db, 'departments', claim.deptId),
      {
        id: claim.deptId,
        isClaimed: true,
        claimedPlan: claim.plan,
        claimedBy: claim.businessName,
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, claimPath);
  }
}

/**
 * Saves or updates citizen profile in Cloud Firestore
 */
export async function saveUserProfileToCloud(profile: UserProfile): Promise<void> {
  const path = `users/${profile.id}`;
  try {
    const payload = {
      id: profile.id,
      country: profile.country || 'UG',
      id_frag: profile.id_frag || '0000',
      display_name: profile.display_name.slice(0, 64),
      civic_score: Number(profile.civic_score || 0),
      rank: profile.rank || 'Observer',
    };
    await setDoc(doc(db, 'users', profile.id), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Phase 3: Persists milestone fiscal release voucher
 */
export async function saveFiscalVoucherToCloud(voucher: FiscalVoucher): Promise<void> {
  const path = `fiscal_vouchers/${voucher.id}`;
  try {
    await setDoc(doc(db, 'fiscal_vouchers', voucher.id), voucher);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Phase 4: Persists statutory circular notification
 */
export async function saveCircularNotificationToCloud(notif: ParishChiefNotification): Promise<void> {
  const path = `circular_notifications/${notif.id}`;
  try {
    await setDoc(doc(db, 'circular_notifications', notif.id), notif);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Phase 5: Persists payment gateway transaction
 */
export async function saveGatewayTransactionToCloud(tx: GatewayTransaction): Promise<void> {
  const path = `gateway_transactions/${tx.id}`;
  try {
    await setDoc(doc(db, 'gateway_transactions', tx.id), tx);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Phase 6: Persists single pre-funded utility perk voucher into Cloud Escrow
 */
export async function savePerkVoucherToCloud(voucher: EscrowPerkVoucher): Promise<void> {
  const path = `perk_vouchers/${voucher.id}`;
  try {
    await setDoc(doc(db, 'perk_vouchers', voucher.id), voucher);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Phase 6: Batch persists multiple utility perk vouchers to Cloud Escrow
 */
export async function savePerkVoucherBatchToCloud(vouchers: EscrowPerkVoucher[]): Promise<void> {
  try {
    await Promise.all(
      vouchers.map((v) => setDoc(doc(db, 'perk_vouchers', v.id), v))
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'perk_vouchers/batch');
  }
}

/**
 * Persists an official disciplinary query or determination to Cloud Firestore
 */
export async function saveOfficialQueryToCloud(queryItem: any): Promise<void> {
  const path = `official_queries/${queryItem.id}`;
  try {
    await setDoc(doc(db, 'official_queries', queryItem.id), queryItem, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetches all official queries from Cloud Firestore
 */
export async function fetchOfficialQueriesFromCloud(): Promise<any[]> {
  try {
    const snap = await getDocs(collection(db, 'official_queries'));
    return snap.docs.map((d) => d.data());
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'official_queries');
    return [];
  }
}

/**
 * Persists an audit ledger entry to Cloud Firestore
 */
export async function saveAuditEntryToCloud(entry: any): Promise<void> {
  const entryId = entry.id || `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `audit_ledger/${entryId}`;
  try {
    await setDoc(doc(db, 'audit_ledger', entryId), { ...entry, id: entryId }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Phase 6: Fetches all perk vouchers from Cloud Escrow
 */
export async function fetchPerkVouchersFromCloud(): Promise<EscrowPerkVoucher[]> {
  try {
    const snap = await getDocs(collection(db, 'perk_vouchers'));
    return snap.docs.map((d) => d.data() as EscrowPerkVoucher);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'perk_vouchers');
    return [];
  }
}

/**
 * Updates a Master Dossier post with compiled witness reports and co-signers in Cloud Firestore
 */
export async function updatePostCompilationInCloud(
  postId: string,
  compiledReports: CompiledWitnessReport[],
  compiledCount: number,
  upvotes: number,
  escalated: boolean,
  mergedFromIds: string[] = []
): Promise<void> {
  const path = `posts/${postId}`;
  try {
    await updateDoc(doc(db, 'posts', postId), {
      compiled_reports: compiledReports.slice(0, 50).map((r) => ({
        id: r.id,
        citizen_id: r.citizen_id,
        citizen_name: r.anonymous ? 'Verified Citizen' : r.citizen_name.slice(0, 128),
        author_profession: (r.author_profession || '').slice(0, 128),
        anonymous: Boolean(r.anonymous),
        body: r.body.slice(0, 2000),
        gps: r.gps || null,
        created_at: r.created_at,
        source: r.source || 'web',
      })),
      compiled_count: Number(compiledCount),
      upvotes: Number(upvotes),
      escalated: Boolean(escalated),
      is_master_dossier: true,
      merged_from_ids: mergedFromIds.slice(0, 50),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Deletes a merged duplicate post from Cloud Firestore
 */
export async function deletePostFromCloud(postId: string): Promise<void> {
  const path = `posts/${postId}`;
  try {
    await deleteDoc(doc(db, 'posts', postId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Persists a CD-Ops Promotional Ad to Cloud Firestore for real-time citizen feed broadcasting
 */
export async function savePromotionalAdToCloud(ad: CdOpsPromotionalAd): Promise<void> {
  const path = `promotional_ads/${ad.id}`;
  try {
    const payload = {
      id: ad.id.slice(0, 128),
      title: ad.title.slice(0, 256),
      category: ad.category,
      categoryLabel: ad.categoryLabel.slice(0, 128),
      tagline: ad.tagline.slice(0, 256),
      summary: ad.summary.slice(0, 2000),
      imageSrc: ad.imageSrc.slice(0, 512),
      callToAction: ad.callToAction.slice(0, 128),
      ctaType: ad.ctaType,
      ctaValue: (ad.ctaValue || '').slice(0, 128),
      specs: (ad.specs || '').slice(0, 512),
      sponsorName: ad.sponsorName.slice(0, 128),
      targetAudience: ad.targetAudience.slice(0, 128),
      published: Boolean(ad.published),
      postedAt: ad.postedAt.slice(0, 64),
      highlights: (ad.highlights || []).slice(0, 10),
      impressions: Number(ad.impressions || 0),
      clicks: Number(ad.clicks || 0),
    };
    await setDoc(doc(db, 'promotional_ads', ad.id), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Deletes a CD-Ops Promotional Ad from Cloud Firestore
 */
export async function deletePromotionalAdFromCloud(adId: string): Promise<void> {
  const path = `promotional_ads/${adId}`;
  try {
    await deleteDoc(doc(db, 'promotional_ads', adId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Subscribes to real-time updates for CD-Ops Promotional Ads across all connected devices
 */
export function subscribeToPromotionalAdsFromCloud(
  onAdsReceived: (ads: CdOpsPromotionalAd[]) => void
): () => void {
  const collectionRef = collection(db, 'promotional_ads');
  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      const cloudAds: CdOpsPromotionalAd[] = [];
      snapshot.forEach((docSnap) => {
        cloudAds.push(docSnap.data() as CdOpsPromotionalAd);
      });
      onAdsReceived(cloudAds);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'promotional_ads');
    }
  );
  return unsubscribe;
}



