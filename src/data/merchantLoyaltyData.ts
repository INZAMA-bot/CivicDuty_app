import { MerchantProductService, CountryCode } from '../types';

export const INITIAL_MERCHANT_PRODUCTS: MerchantProductService[] = [
  // --- UGANDA: KAMPALA / WAKISO PARISHES ---
  {
    id: 'merch-salon-01',
    merchantId: 'kireka_beauty_salon',
    merchantName: 'Kireka Beauty & Braiding Salon',
    category: 'hospitality',
    parish: 'Kitintale Parish',
    subCounty: 'Nakawa Division',
    district: 'Kampala',
    address: 'Plot 14, Kireka-Kinawataka Road (Opp. Shell Kitintale)',
    country: 'UG',
    title: 'Professional Hair Braiding & Conditioning Treatment',
    basePrice: 50000,
    currency: 'UGX',
    rewardType: 'discount',
    rewardHeadline: '20% OFF Braiding & Treatment',
    rewardDescription: 'Get 20% off professional box braids, knotless braids or scalp steaming. Voucher covers complete service.',
    discountPercent: 20,
    voucherCost: 40000,
    commissionPct: 0.02,
    commissionAmount: 800, // 2%
    merchantPayoutAmount: 39200, // 98%
    payoutStatus: 'escrowed',
    qrCodePayload: 'CIVIC-VCH-SALON-20OFF-KIREKA',
    barcode: '890124458921',
    ussdCode: '*303*2040#',
    smsCode: 'SALON20',
    active: true,
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'merch-barber-02',
    merchantId: 'kireka_beauty_salon',
    merchantName: 'Kireka Beauty & Executive Barbers',
    category: 'hospitality',
    parish: 'Kitintale Parish',
    subCounty: 'Nakawa Division',
    district: 'Kampala',
    address: 'Plot 14, Kireka-Kinawataka Road',
    country: 'UG',
    title: "Executive Men's Haircut & Beard Trim",
    basePrice: 30000,
    currency: 'UGX',
    rewardType: 'freebie',
    rewardHeadline: 'Buy Haircut Get Free Hair Wash & Massage',
    rewardDescription: 'Purchase executive haircut and receive a complimentary herbal scalp wash, hot towel steam & massage worth UGX 15,000.',
    voucherCost: 30000,
    commissionPct: 0.02,
    commissionAmount: 600, // 2%
    merchantPayoutAmount: 29400, // 98%
    payoutStatus: 'escrowed',
    qrCodePayload: 'CIVIC-VCH-HAIRCUT-FREEWASH-02',
    barcode: '890124458922',
    ussdCode: '*303*2041#',
    smsCode: 'WASHFREE',
    active: true,
    createdAt: '2026-10-02T11:00:00Z',
  },
  {
    id: 'merch-bakery-03',
    merchantId: 'shop_quality_supermarket',
    merchantName: 'Quality Supermarket & Artisan Bakery',
    category: 'retail_shops',
    parish: 'Kitintale Parish',
    subCounty: 'Nakawa Division',
    district: 'Kampala',
    address: 'Port Bell Road, Kitintale Stage',
    country: 'UG',
    title: 'Fresh Milk Loaf & Family Bread Basket',
    basePrice: 12000,
    currency: 'UGX',
    rewardType: 'bogo',
    rewardHeadline: 'BOGO: Buy 1 Fresh Loaf Get 1 Free',
    rewardDescription: 'Buy 1 jumbo enriched milk loaf (800g) and receive a second loaf or tea buns pack 100% free at checkout till.',
    voucherCost: 12000,
    commissionPct: 0.02,
    commissionAmount: 240, // 2%
    merchantPayoutAmount: 11760, // 98%
    payoutStatus: 'escrowed',
    qrCodePayload: 'CIVIC-VCH-BOGO-BREAD-03',
    barcode: '890124458923',
    ussdCode: '*303*2042#',
    smsCode: 'BOGOBREAD',
    active: true,
    createdAt: '2026-10-03T09:30:00Z',
  },
  {
    id: 'merch-garage-04',
    merchantId: 'bwaise_moto_mechanics',
    merchantName: 'Bwaise Bodaboda & Auto Mechanics Workshop',
    category: 'transport',
    parish: 'Bwaise III Parish',
    subCounty: 'Kawempe Division',
    district: 'Kampala',
    address: 'Northern Bypass Junction / Bwaise Roundabout Stage',
    country: 'UG',
    title: 'Bodaboda & Motorcycle 4T Servicing & Inspection',
    basePrice: 25000,
    currency: 'UGX',
    rewardType: 'gift',
    rewardHeadline: 'Buy Engine Service, Get Chain Lube & Spark Plug Free',
    rewardDescription: 'Book motorcycle oil servicing and receive premium chain lubrication, brake adjustment, and high-performance spark plug free of charge.',
    voucherCost: 25000,
    commissionPct: 0.02,
    commissionAmount: 500, // 2%
    merchantPayoutAmount: 24500, // 98%
    payoutStatus: 'escrowed',
    qrCodePayload: 'CIVIC-VCH-BODA-GIFT-LUBE-04',
    barcode: '890124458924',
    ussdCode: '*303*2043#',
    smsCode: 'BODAGIFT',
    active: true,
    createdAt: '2026-10-04T14:15:00Z',
  },
  {
    id: 'merch-grocer-05',
    merchantId: 'nakasero_fresh_grocers',
    merchantName: 'Nakasero Farm Fresh & Organic Grocers',
    category: 'retail_shops',
    parish: 'Nakasero II Parish',
    subCounty: 'Kampala Central',
    district: 'Kampala',
    address: 'Market Street, Nakasero Complex',
    country: 'UG',
    title: 'Organic Vegetable, Fruit & Pantry Basket',
    basePrice: 50000,
    currency: 'UGX',
    rewardType: 'cashback',
    rewardHeadline: 'Spend 50k, Get 5k Voucher Next Visit',
    rewardDescription: 'Spend UGX 50,000 on fresh groceries and receive a UGX 5,000 instant store credit voucher redeemable on your subsequent shopping trip.',
    voucherCost: 50000,
    commissionPct: 0.02,
    commissionAmount: 1000, // 2%
    merchantPayoutAmount: 49000, // 98%
    payoutStatus: 'escrowed',
    qrCodePayload: 'CIVIC-VCH-CASHBACK-5K-NAKASERO',
    barcode: '890124458925',
    ussdCode: '*303*2044#',
    smsCode: 'CASHBACK5K',
    active: true,
    createdAt: '2026-10-05T08:45:00Z',
  },
  {
    id: 'merch-clinic-06',
    merchantId: 'wandegeya_wellness_clinic',
    merchantName: 'Wandegeya Community Dental & Health Clinic',
    category: 'health',
    parish: 'Wandegeya Parish',
    subCounty: 'Kawempe Division',
    district: 'Kampala',
    address: 'Bombo Road near Makerere Gate',
    country: 'UG',
    title: 'Dental Scaling, Polish & Oral Health Consultation',
    basePrice: 60000,
    currency: 'UGX',
    rewardType: 'discount',
    rewardHeadline: '25% OFF Dental Checkup & Hygiene',
    rewardDescription: 'Comprehensive dental consultation and ultrasound plaque cleaning with 25% discount for verified community watchdogs.',
    discountPercent: 25,
    voucherCost: 45000,
    commissionPct: 0.02,
    commissionAmount: 900, // 2%
    merchantPayoutAmount: 44100, // 98%
    payoutStatus: 'escrowed',
    qrCodePayload: 'CIVIC-VCH-DENTAL-25OFF-WAND',
    barcode: '890124458926',
    ussdCode: '*303*2045#',
    smsCode: 'DENTAL25',
    active: true,
    createdAt: '2026-10-06T12:00:00Z',
  },
  {
    id: 'merch-solar-07',
    merchantId: 'ntinda_solar_tech',
    merchantName: 'Ntinda Green Energy & Solar Mart',
    category: 'retail_shops',
    parish: 'Ntinda Parish',
    subCounty: 'Nakawa Division',
    district: 'Kampala',
    address: 'Ntinda Shopping Centre, Level 1',
    country: 'UG',
    title: 'Solar Home Reading Lantern Kit & Phone Charger',
    basePrice: 40000,
    currency: 'UGX',
    rewardType: 'gift',
    rewardHeadline: 'Buy Solar Lantern, Get 3x Multi-Pin Phone Cables Free',
    rewardDescription: 'Purchase long-life rechargeable solar lantern kit and get high-gauge heavy duty multi-port USB phone charging kit included free.',
    voucherCost: 40000,
    commissionPct: 0.02,
    commissionAmount: 800, // 2%
    merchantPayoutAmount: 39200, // 98%
    payoutStatus: 'escrowed',
    qrCodePayload: 'CIVIC-VCH-SOLAR-GIFT-NTINDA',
    barcode: '890124458927',
    ussdCode: '*303*2046#',
    smsCode: 'SOLARGIFT',
    active: true,
    createdAt: '2026-10-07T15:20:00Z',
  },

  // --- KENYA: NAIROBI WARDS ---
  {
    id: 'merch-ke-salon-01',
    merchantId: 'kilimani_haven_salon',
    merchantName: 'Kilimani Haven Hair & Grooming Lounge',
    category: 'hospitality',
    parish: 'Kilimani Ward',
    subCounty: 'Dagoretti North',
    district: 'Nairobi County',
    address: 'Argwings Kodhek Road, Kilimani Plaza',
    country: 'KE',
    title: "Executive Styling & Scalp Treatment Package",
    basePrice: 1500,
    currency: 'KES',
    rewardType: 'discount',
    rewardHeadline: '20% OFF Executive Haircut & Styling',
    rewardDescription: 'Full cut, hot towel cleanse, beard shaping, and styling with 20% savings.',
    discountPercent: 20,
    voucherCost: 1200,
    commissionPct: 0.02,
    commissionAmount: 24, // 2%
    merchantPayoutAmount: 1176, // 98%
    payoutStatus: 'escrowed',
    qrCodePayload: 'CIVIC-VCH-KILIMANI-20OFF-KE',
    barcode: '710123891001',
    ussdCode: '*141*1200#',
    smsCode: 'KILIMANI20',
    active: true,
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'merch-ke-supermarket-02',
    merchantId: 'shop_quality_supermarket',
    merchantName: 'Naivas & Westlands Fresh Deli',
    category: 'retail_shops',
    parish: 'Westlands Ward',
    subCounty: 'Westlands',
    district: 'Nairobi County',
    address: 'Waiyaki Way, Westlands Commercial Arcade',
    country: 'KE',
    title: '1,000 KSh Household Essentials Basket',
    basePrice: 1000,
    currency: 'KES',
    rewardType: 'bogo',
    rewardHeadline: 'BOGO: Buy 1 Premium Loaf Get 1 Free',
    rewardDescription: 'Buy 1 wholemeal family loaf and get a second fresh loaf free, or redeem towards 1,000 KSh packaged shopping basket.',
    voucherCost: 1000,
    commissionPct: 0.02,
    commissionAmount: 20, // 2%
    merchantPayoutAmount: 980, // 98%
    payoutStatus: 'escrowed',
    qrCodePayload: 'CIVIC-VCH-NAIVAS-1000KSH-BOGO',
    barcode: '710123891002',
    ussdCode: '*141*1000#',
    smsCode: 'NAIVASBOGO',
    active: true,
    createdAt: '2026-10-02T12:00:00Z',
  },
  {
    id: 'merch-ke-boda-03',
    merchantId: 'kibera_scout_mobility',
    merchantName: 'Kibera Riders & Spares Garage',
    category: 'transport',
    parish: 'Kibera Lindi Ward',
    subCounty: 'Kibra',
    district: 'Nairobi County',
    address: 'Olympic Stage, Kibera',
    country: 'KE',
    title: 'Rider Engine Service & 2L Petrol Pass',
    basePrice: 800,
    currency: 'KES',
    rewardType: 'gift',
    rewardHeadline: 'Buy Oil Change, Get Free Spark Plug & Chain Lube',
    rewardDescription: 'Comprehensive motorbike safety inspection, oil change, and free spark plug & chain lubrication for active road hazard reporters.',
    voucherCost: 800,
    commissionPct: 0.02,
    commissionAmount: 16, // 2%
    merchantPayoutAmount: 784, // 98%
    payoutStatus: 'escrowed',
    qrCodePayload: 'CIVIC-VCH-KIBERA-RIDER-GIFT',
    barcode: '710123891003',
    ussdCode: '*141*800#',
    smsCode: 'KIBERAGIFT',
    active: true,
    createdAt: '2026-10-03T14:00:00Z',
  },
];

const LOCAL_STORAGE_KEY = 'cd_merchant_products_v1';

export function getStoredMerchantProducts(): MerchantProductService[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with defaults to ensure seed catalog is always present
        const ids = new Set(parsed.map((p) => p.id));
        const merged = [...parsed];
        for (const init of INITIAL_MERCHANT_PRODUCTS) {
          if (!ids.has(init.id)) {
            merged.push(init);
          }
        }
        return merged;
      }
    }
  } catch {
    // fallback
  }
  return [...INITIAL_MERCHANT_PRODUCTS];
}

export function saveStoredMerchantProduct(product: MerchantProductService): void {
  try {
    const current = getStoredMerchantProducts();
    const existingIdx = current.findIndex((p) => p.id === product.id);
    let updated: MerchantProductService[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = product;
    } else {
      updated = [product, ...current];
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore local storage errors
  }
}

export function filterMerchantProductsByLocation(
  products: MerchantProductService[],
  targetCountry: CountryCode,
  targetParish?: string
): { exactParish: MerchantProductService[]; widerJurisdiction: MerchantProductService[] } {
  const countryFiltered = products.filter(
    (p) => p.country.toUpperCase() === targetCountry.toUpperCase() && p.active
  );

  if (!targetParish || targetParish.trim() === '' || targetParish.toLowerCase().includes('all')) {
    return {
      exactParish: countryFiltered,
      widerJurisdiction: [],
    };
  }

  const cleanTarget = targetParish.toLowerCase().replace(/parish|ward|division|sub-county/g, '').trim();

  const exact: MerchantProductService[] = [];
  const wider: MerchantProductService[] = [];

  countryFiltered.forEach((p) => {
    const pParish = (p.parish || '').toLowerCase();
    const pSub = (p.subCounty || '').toLowerCase();
    const pDist = (p.district || '').toLowerCase();

    if (pParish.includes(cleanTarget) || cleanTarget.includes(pParish.replace(/parish|ward/g, '').trim())) {
      exact.push(p);
    } else if (pSub.includes(cleanTarget) || pDist.includes(cleanTarget)) {
      wider.push(p);
    } else {
      wider.push(p);
    }
  });

  return { exactParish: exact, widerJurisdiction: wider };
}

export function calculateVoucherEconomics(
  voucherCost: number,
  customCommissionPct: number = 0.02
) {
  // Hard cap commission at 2% maximum
  const cappedCommissionRate = Math.min(0.02, Math.max(0.005, customCommissionPct));
  const commissionAmount = Math.round(voucherCost * cappedCommissionRate);
  const merchantPayoutAmount = voucherCost - commissionAmount;

  return {
    voucherCost,
    commissionPct: cappedCommissionRate,
    commissionPctDisplay: (cappedCommissionRate * 100).toFixed(1) + '%',
    commissionAmount,
    merchantPayoutAmount,
    merchantPayoutPctDisplay: ((1 - cappedCommissionRate) * 100).toFixed(1) + '%',
  };
}
