import { CountryCode, EscrowPerkVoucher, MerchantProductService } from '../types';
import { COUNTRIES } from './countries';
import { inferCampaignRegion, CampaignRegion } from './promotionalAds';

export const ASSET_VERSION_TAG = '20261114';

export const CURRENCY_USD_RATES: Record<string, number> = {
  USD: 1,
  AED: 3.67,
  AFN: 70,
  ALL: 92,
  AMD: 390,
  AOA: 910,
  ARS: 980,
  AUD: 1.52,
  AZN: 1.7,
  BAM: 1.8,
  BBD: 2,
  BDT: 119,
  BGN: 1.8,
  BHD: 0.376,
  BIF: 2890,
  BND: 1.33,
  BOB: 6.91,
  BRL: 5.7,
  BSD: 1,
  BTN: 84,
  BWP: 13.5,
  BYN: 3.27,
  BZD: 2,
  CAD: 1.38,
  CDF: 2850,
  CHF: 0.88,
  CLP: 950,
  CNY: 7.2,
  COP: 4200,
  CRC: 515,
  CUP: 24,
  CVE: 102,
  CZK: 23.5,
  DJF: 178,
  DKK: 6.88,
  DOP: 60,
  DZD: 134,
  EGP: 49,
  ERN: 15,
  ETB: 120,
  EUR: 0.92,
  FJD: 2.25,
  GBP: 0.78,
  GEL: 2.72,
  GHS: 15.8,
  GMD: 70,
  GNF: 8600,
  GTQ: 7.73,
  GYD: 209,
  HKD: 7.78,
  HNL: 25,
  HTG: 131,
  HUF: 375,
  IDR: 15700,
  ILS: 3.72,
  INR: 84,
  IQD: 1310,
  IRR: 42000,
  ISK: 138,
  JMD: 157,
  JOD: 0.709,
  JPY: 153,
  KES: 129,
  KGS: 86,
  KHR: 4060,
  KMF: 454,
  KPW: 900,
  KRW: 1380,
  KWD: 0.307,
  KZT: 490,
  LAK: 21900,
  LBP: 89500,
  LKR: 294,
  LRD: 192,
  LSL: 18,
  LYD: 4.82,
  MAD: 9.8,
  MDL: 17.8,
  MGA: 4600,
  MKD: 56.8,
  MMK: 2100,
  MNT: 3400,
  MRU: 39.7,
  MUR: 46.2,
  MVR: 15.4,
  MWK: 1735,
  MXN: 20,
  MYR: 4.38,
  MZN: 63.9,
  NAD: 18,
  NGN: 1600,
  NIO: 36.8,
  NOK: 10.9,
  NPR: 134,
  NZD: 1.66,
  OMR: 0.385,
  PAB: 1,
  PEN: 3.75,
  PGK: 3.95,
  PHP: 58,
  PKR: 278,
  PLN: 4,
  PYG: 7800,
  QAR: 3.64,
  RON: 4.58,
  RSD: 108,
  RUB: 97,
  RWF: 1370,
  SAR: 3.75,
  SBD: 8.4,
  SCR: 14,
  SDG: 600,
  SEK: 10.7,
  SGD: 1.33,
  SLE: 22.6,
  SOS: 571,
  SRD: 35,
  SSP: 3300,
  STN: 22.6,
  SYP: 13000,
  SZL: 18,
  THB: 34,
  TJS: 10.6,
  TMT: 3.5,
  TND: 3.1,
  TOP: 2.36,
  TRY: 34.2,
  TTD: 6.78,
  TWD: 32,
  TZS: 2650,
  UAH: 41.3,
  UGX: 3700,
  UYU: 41.6,
  UZS: 12800,
  VES: 42,
  VND: 25300,
  VUV: 119,
  WST: 2.75,
  XAF: 605,
  XCD: 2.7,
  XOF: 605,
  YER: 250,
  ZAR: 18,
  ZMW: 26.8,
  ZWG: 25,
};

export function getCurrencyForCountry(countryCode: CountryCode): string {
  return COUNTRIES[countryCode]?.currency || 'USD';
}

export function getUsdRateForCurrency(currency: string): number {
  return CURRENCY_USD_RATES[currency.toUpperCase()] || 1;
}

export function roundFriendlyCurrencyAmount(raw: number, currency: string): number {
  const c = currency.toUpperCase();
  if (raw <= 0) return 0;
  if (raw < 10) return Math.max(1, Math.round(raw));
  if (raw < 50) {
    // Low-denomination currencies (USD, EUR, GBP, GHS, ZAR, CNY, etc.)
    if (['USD', 'EUR', 'GBP', 'CHF', 'CAD', 'AUD', 'NZD', 'SGD', 'BHD', 'KWD', 'OMR', 'JOD'].includes(c)) {
      return Math.max(1, Math.round(raw));
    }
    return Math.max(5, Math.round(raw / 5) * 5);
  }
  if (raw < 250) return Math.round(raw / 10) * 10;
  if (raw < 1000) return Math.round(raw / 25) * 25;
  if (raw < 5000) return Math.round(raw / 100) * 100;
  if (raw < 25000) return Math.round(raw / 500) * 500;
  if (raw < 150000) return Math.round(raw / 1000) * 1000;
  return Math.round(raw / 5000) * 5000;
}

export function convertUsdToLocal(
  usd: number,
  countryCode: CountryCode
): { currency: string; amount: number; formatted: string; compact: string } {
  const currency = getCurrencyForCountry(countryCode);
  const rate = getUsdRateForCurrency(currency);
  const amount = roundFriendlyCurrencyAmount(usd * rate, currency);
  const formatted = `${currency} ${amount.toLocaleString()}`;
  const compact =
    amount >= 10000 && amount % 1000 === 0
      ? `${Math.round(amount / 1000)}K ${currency}`
      : formatted;
  return { currency, amount, formatted, compact };
}

export interface CountryPerkProfile {
  countryCode: CountryCode;
  countryName: string;
  currency: string;
  phonePrefix: string;
  samplePhone: string;
  altPhone: string;
  ussdDial: string;
  supermarketBrand: string;
  familySupermarketBrand: string;
  telcoBrand: string;
  altTelcoBrand: string;
  waterBrand: string;
  powerBrand: string;
  transitBrand: string;
  fuelBrand: string;
  diningBrand: string;
  solarBrand: string;
  pharmacyBrand: string;
  bookshopBrand: string;
  agroBrand: string;
  bankName: string;
  bankBranch: string;
  swiftCode: string;
  accountNo: string;
  sampleSponsor: string;
  sampleProject: string;
  sampleRecipientName: string;
  defaultParish: string;
  barcodePrefix: string;
  basketStaples: string[];
  corridors: Array<{ id: string; label: string; authority: string }>;
}

const CALLING_CODE_BY_COUNTRY: Partial<Record<string, string>> = {
  UG: '+256', KE: '+254', RW: '+250', TZ: '+255', NG: '+234', GH: '+233', ZA: '+27',
  ET: '+251', EG: '+20', SN: '+221', ZM: '+260', ZW: '+263', US: '+1', CA: '+1',
  GB: '+44', DE: '+49', FR: '+33', AT: '+43', CH: '+41', NL: '+31', BE: '+32',
  IT: '+39', ES: '+34', PT: '+351', SE: '+46', NO: '+47', DK: '+45', FI: '+358',
  IE: '+353', PL: '+48', UA: '+380', TR: '+90', IN: '+91', PK: '+92', BD: '+880',
  CN: '+86', JP: '+81', KR: '+82', ID: '+62', PH: '+63', VN: '+84', TH: '+66',
  MY: '+60', SG: '+65', AE: '+971', SA: '+966', QA: '+974', AU: '+61', NZ: '+64',
  BR: '+55', MX: '+52', AR: '+54', CL: '+56', CO: '+57', PE: '+51',
};

export function getCountryPerkProfile(countryCode: CountryCode): CountryPerkProfile {
  const info = COUNTRIES[countryCode] || { name: 'Global', currency: 'USD' };
  const countryName = info.name;
  const currency = info.currency || 'USD';
  const region = inferCampaignRegion(countryCode);
  const phonePrefix = CALLING_CODE_BY_COUNTRY[countryCode] || '+1';
  const dialCodeDigits = phonePrefix.replace('+', '');
  const ussdDial = `*3030*${dialCodeDigits}#`;

  const COUNTRY_OVERRIDES: Partial<Record<string, Partial<CountryPerkProfile>>> = {
    UG: {
      samplePhone: '+256 774 819 203',
      altPhone: '+256 704 512 880',
      supermarketBrand: 'Quality Supermarket / Carrefour',
      familySupermarketBrand: 'Capital Shoppers / Carrefour',
      telcoBrand: 'MTN Uganda',
      altTelcoBrand: 'Airtel Uganda',
      waterBrand: 'NWSC Uganda',
      powerBrand: 'Umeme Yaka Power',
      transitBrand: 'SafeBoda',
      fuelBrand: 'TotalEnergies / Shell Uganda',
      diningBrand: 'KFC Uganda',
      solarBrand: 'Barefoot / d.light Uganda',
      pharmacyBrand: 'Vine Pharmacy / Ecopharm',
      bookshopBrand: 'Aristoc Booklex / Quality Desk',
      agroBrand: 'Bukoola / Market Vendor Input Desk',
      bankName: 'Stanbic Bank Uganda Ltd',
      bankBranch: 'Corporate Escrow Branch, Kampala',
      swiftCode: 'SBICUGKX',
      accountNo: '9030018849201',
      sampleSponsor: 'Seyani Brothers Construction Ltd',
      sampleProject: 'Kampala Flyover & Southern Bypass',
      sampleRecipientName: 'Amina Nabatanzi',
      defaultParish: 'Kitintale Parish',
      barcodePrefix: '890',
      basketStaples: ['2kg Maize Flour (Posho)', '1L Cooking Oil', '1kg Sugar & Tea Leaves', '2kg Rice & Laundry Soap', 'Fresh Milk & Bread'],
      corridors: [
        { id: 'corridor_northern_bypass', label: 'Kampala Northern Bypass & Bwaise Bodaboda Stage', authority: 'UNRA / MoWT & SafeBoda Stage Safety' },
        { id: 'corridor_jinja_highway', label: 'Jinja Road, Nakawa & Mukono Highway Scout Corridor', authority: 'KCCA / Traffic Police Road Safety Pool' },
        { id: 'corridor_entebbe_express', label: 'Entebbe Road, Kibuye & Kajjansi Stage Scout Zone', authority: 'MoWT / Frontline Bodaboda Union' },
      ],
    },
    KE: {
      samplePhone: '+254 712 409 881',
      altPhone: '+254 733 618 220',
      supermarketBrand: 'Naivas / Carrefour Kenya',
      familySupermarketBrand: 'Carrefour / Quickmart Kenya',
      telcoBrand: 'Safaricom Kenya',
      altTelcoBrand: 'Airtel Kenya',
      waterBrand: 'Nairobi Water (NCWSC)',
      powerBrand: 'Kenya Power (KPLC)',
      transitBrand: 'SafeBoda / Little Ride KE',
      fuelBrand: 'TotalEnergies / Rubis Kenya',
      diningBrand: 'KFC / Java House Kenya',
      solarBrand: 'd.light Solar Kenya',
      pharmacyBrand: 'Goodlife Pharmacy Kenya',
      bookshopBrand: 'Text Book Centre / Naivas',
      agroBrand: 'Kenya Seed & Market Coop',
      bankName: 'KCB Bank Kenya Ltd',
      bankBranch: 'Kencom Corporate Escrow Desk, Nairobi',
      swiftCode: 'KCBLKENX',
      accountNo: '110924881034',
      sampleSponsor: 'Kenya Urban Roads CSR Consortium',
      sampleProject: 'Nairobi Commuter & Drainage Resilience',
      sampleRecipientName: 'Wanjiku Mwangi',
      defaultParish: 'Kilimani Ward',
      barcodePrefix: '710',
      basketStaples: ['2kg Jogoo Maize Meal (Unga)', '1L Cooking Oil', '1kg Kabras Sugar & Chai', '2kg Pishori Rice & Soap', 'Fresh Milk & Bread'],
      corridors: [
        { id: 'corridor_thika_superhighway', label: 'Thika Superhighway & Roysambu Bodaboda / Matatu Stage', authority: 'KeNHA / NTSA Road Safety Desk' },
        { id: 'corridor_mombasa_road', label: 'Mombasa Road & Nyayo Stadium Transit Corridor', authority: 'KURA / Nairobi Transit Watch' },
        { id: 'corridor_waiyaki_way', label: 'Waiyaki Way & Westlands Stage Scout Zone', authority: 'NTSA Frontline Riders Pool' },
      ],
    },
    RW: {
      samplePhone: '+250 788 412 690',
      altPhone: '+250 738 221 490',
      supermarketBrand: 'Simba / Sawa Citi Supermarket',
      familySupermarketBrand: 'Simba Supermarket Kigali',
      telcoBrand: 'MTN Rwanda',
      altTelcoBrand: 'Airtel Rwanda',
      waterBrand: 'WASAC Water Supply',
      powerBrand: 'REG / EUCL CashPower',
      transitBrand: 'Tap&Go / Kigali Moto Coop',
      fuelBrand: 'SP / Engen Rwanda',
      diningBrand: 'Camellia / Bourbon Café Kigali',
      solarBrand: 'Bboxx / Ignite Power Rwanda',
      pharmacyBrand: 'Kigali Life Pharmacy',
      bookshopBrand: 'Ikirezi / Caritas Bookshop Kigali',
      agroBrand: 'Kimironko Co-op Market Desk',
      bankName: 'Bank of Kigali Plc',
      bankBranch: 'KN 4 Ave Corporate Escrow, Kigali',
      swiftCode: 'BKIGRWRW',
      accountNo: '00040-06928410-12',
      sampleSponsor: 'Rwanda Civic Works & Smart Transit Partner',
      sampleProject: 'Kigali Clean Corridor & Kimironko Drainage',
      sampleRecipientName: 'Marie-Claire Uwase',
      defaultParish: 'Rukiri I Cell',
      barcodePrefix: '694',
      basketStaples: ['2kg Kawunga / Maize Flour', '1L Sunflower Cooking Oil', '1kg Sugar & Rwandan Tea', '2kg Rice & Hygiene Soap', 'Inyange Milk & Bread'],
      corridors: [
        { id: 'corridor_kg11_remera', label: 'KG 11 Ave · Remera Taxi Park & Moto Stage', authority: 'RURA / City of Kigali Transit Watch' },
        { id: 'corridor_nyabugogo_hub', label: 'Nyabugogo Intercity Terminal & KN 1 Rd Corridor', authority: 'RTDA / Kigali Bus Service Pool' },
        { id: 'corridor_kimironko', label: 'KG 17 Ave · Kimironko Market & Civic Axis', authority: 'Gasabo District & Umuganda Watch' },
      ],
    },
    NG: {
      samplePhone: '+234 803 412 9088',
      altPhone: '+234 802 910 3412',
      supermarketBrand: 'Shoprite / Spar Nigeria',
      familySupermarketBrand: 'Prince Ebeano / Spar Family',
      telcoBrand: 'MTN Nigeria',
      altTelcoBrand: 'Airtel Nigeria',
      waterBrand: 'Lagos Water Corporation',
      powerBrand: 'EKEDC / Ikeja Electric',
      transitBrand: 'BRT / Gokada Rider Pool',
      fuelBrand: 'NNPC / TotalEnergies Nigeria',
      diningBrand: 'Chicken Republic / Tantalizers',
      solarBrand: 'Lumos / Arnergy Nigeria',
      pharmacyBrand: 'HealthPlus Pharmacy Nigeria',
      bookshopBrand: 'CSS Bookshop / Laterna',
      agroBrand: 'Mile 12 Agro & Market Coop',
      bankName: 'Zenith Bank Plc',
      bankBranch: 'Victoria Island Escrow Desk, Lagos',
      swiftCode: 'ZEIBNGLA',
      accountNo: '1014882910',
      sampleSponsor: 'Lagos Infrastructure & Civic Alliance',
      sampleProject: 'Ishaga Road & Third Mainland Resilience',
      sampleRecipientName: 'Chinedu Okafor',
      defaultParish: 'Lekki Phase 1 Ward',
      barcodePrefix: '615',
      basketStaples: ['2kg Semovita / Garri', '1L Vegetable Oil', '1kg Sugar & Milo', '2kg Ofada / Parboiled Rice', 'Peak Milk & Sliced Bread'],
      corridors: [
        { id: 'corridor_lekki_epe', label: 'Lekki-Epe Expressway & Danfo / Rider Scout Corridor', authority: 'LAMATA / FRSC Road Safety Pool' },
        { id: 'corridor_third_mainland', label: 'Third Mainland & Ikeja Along BRT Corridor', authority: 'LASTMA / Lagos Civic Corridor Watch' },
      ],
    },
    GH: {
      samplePhone: '+233 24 489 1023',
      altPhone: '+233 27 812 3409',
      supermarketBrand: 'Melcom / Palace Mall Ghana',
      familySupermarketBrand: 'Shoprite / Melcom Family',
      telcoBrand: 'MTN Ghana',
      altTelcoBrand: 'Telecel Ghana',
      waterBrand: 'Ghana Water (GWCL)',
      powerBrand: 'ECG Prepaid Power',
      transitBrand: 'Aayalolo / Trotro Scout Pool',
      fuelBrand: 'GOIL / TotalEnergies Ghana',
      diningBrand: 'Papaye / KFC Ghana',
      solarBrand: 'PEG Africa Solar Ghana',
      pharmacyBrand: 'Ernest Chemists / East Cantonments',
      bookshopBrand: 'EPP Books Services Ghana',
      agroBrand: 'Makola & Kaneshie Market Coop',
      bankName: 'GCB Bank Plc',
      bankBranch: 'Accra High Street Corporate Escrow',
      swiftCode: 'GHCBGHAC',
      accountNo: '1041180049210',
      sampleSponsor: 'Accra Urban Civic Infrastructure Fund',
      sampleProject: 'Kaneshie & Ring Road Grid Accountability',
      sampleRecipientName: 'Kwame Mensah',
      defaultParish: 'Osu Electoral Area',
      barcodePrefix: '603',
      basketStaples: ['2kg Maize / Banku Flour', '1L Cooking Oil', '1kg Sugar & Cocoa Drink', '2kg Jasmine Rice & Soap', 'Ideal Milk & Bread'],
      corridors: [
        { id: 'corridor_kaneshie_mallam', label: 'Kaneshie Market & George Walker Bush Hwy', authority: 'GPRTU / MTTD Scout Corridor' },
        { id: 'corridor_circle_madina', label: 'Kwame Nkrumah Circle & Madina Trotro Hub', authority: 'AMA Transit & Road Safety Pool' },
      ],
    },
    ZA: {
      samplePhone: '+27 82 419 6032',
      altPhone: '+27 83 710 4421',
      supermarketBrand: 'Checkers / Pick n Pay',
      familySupermarketBrand: 'Woolworths / Checkers Sixty60',
      telcoBrand: 'Vodacom / MTN South Africa',
      altTelcoBrand: 'MTN South Africa',
      waterBrand: 'Joburg Water / Cape Town Water',
      powerBrand: 'Eskom / City Power Prepaid',
      transitBrand: 'MyCiTi / Rea Vaya / Taxi Rank Pool',
      fuelBrand: 'Engen / Sasol South Africa',
      diningBrand: 'Nando\'s / Steers SA',
      solarBrand: 'Wetility / SunSynk SA',
      pharmacyBrand: 'Clicks / Dis-Chem Pharmacy',
      bookshopBrand: 'Exclusive Books / Waltons',
      agroBrand: 'FreshProduce Coop Market',
      bankName: 'Standard Bank South Africa',
      bankBranch: 'Sandton Corporate Escrow Desk',
      swiftCode: 'SBZAZAJJ',
      accountNo: '00249182041',
      sampleSponsor: 'Gauteng Municipal Accountability Coalition',
      sampleProject: 'Alexandra–Sandton Grid & Water Recovery',
      sampleRecipientName: 'Thabo Mokoena',
      defaultParish: 'Region E (Alexandra / Sandton)',
      barcodePrefix: '600',
      basketStaples: ['2.5kg Iwisa Maize Meal', '750ml Cooking Oil', '2kg Sugar & Rooibos Tea', '2kg Tastic Rice & Soap', 'Fresh Milk & Bread'],
      corridors: [
        { id: 'corridor_alex_sandton', label: 'Bree St & Alexandra Minibus Taxi Rank Corridor', authority: 'SANTACO / JRA Road Safety Desk' },
        { id: 'corridor_myciti_cbd', label: 'Cape Town MyCiTi BRT & N2 Civic Corridor', authority: 'City of Cape Town Transport Watch' },
      ],
    },
    GB: {
      samplePhone: '+44 7700 900412',
      altPhone: '+44 7700 900891',
      supermarketBrand: 'Tesco / Sainsbury\'s',
      familySupermarketBrand: 'Waitrose / Marks & Spencer Food',
      telcoBrand: 'EE / Vodafone UK',
      altTelcoBrand: 'O2 UK',
      waterBrand: 'Thames Water / United Utilities',
      powerBrand: 'Octopus / British Gas Smart',
      transitBrand: 'TfL Oyster & Santander Cycle Credit',
      fuelBrand: 'BP / Shell UK',
      diningBrand: 'Pret A Manger / Greggs',
      solarBrand: 'Anker / EcoFlow UK',
      pharmacyBrand: 'Boots UK Pharmacy',
      bookshopBrand: 'Waterstones / WHSmith',
      agroBrand: 'Borough & Community Co-op',
      bankName: 'Barclays Bank UK Plc',
      bankBranch: 'Canary Wharf Civic Escrow',
      swiftCode: 'BUKBGB22',
      accountNo: '20-41-55 / 40928173',
      sampleSponsor: 'Camden & London Civic Accountability Fund',
      sampleProject: 'Thames Trunk Main & Cycling Safety',
      sampleRecipientName: 'Eleanor Davies',
      defaultParish: 'Kentish Town Ward',
      barcodePrefix: '501',
      basketStaples: ['Artisan Bread & Fresh Milk', 'Free-Range Eggs & Pasta', 'Olive Oil & Wholegrain Rice', 'Yorkshire Tea & Fresh Fruit', 'Household Essentials'],
      corridors: [
        { id: 'corridor_camden_euston', label: 'Euston Rd & Camden Cycling / Bus Lane Corridor', authority: 'TfL Streetspace Safety Watch' },
        { id: 'corridor_manchester_metro', label: 'Oxford Rd & Metrolink Civic Corridor', authority: 'TfGM Public Transit Pool' },
      ],
    },
    US: {
      samplePhone: '+1 917 555 0148',
      altPhone: '+1 312 555 0192',
      supermarketBrand: 'Whole Foods / Target Grocery',
      familySupermarketBrand: 'Costco / Trader Joe\'s',
      telcoBrand: 'T-Mobile / Verizon 5G',
      altTelcoBrand: 'AT&T Mobility',
      waterBrand: 'Municipal Water & Sewer Utility',
      powerBrand: 'ConEdison / Community Electric',
      transitBrand: 'MTA OMNY / Citi Bike Pass',
      fuelBrand: 'Shell / Chevron US',
      diningBrand: 'Sweetgreen / Panera Bread',
      solarBrand: 'Goal Zero / Anker Power',
      pharmacyBrand: 'CVS / Walgreens Wellness',
      bookshopBrand: 'Barnes & Noble / Civic Books',
      agroBrand: 'Greenmarket & Co-op Grocery',
      bankName: 'JPMorgan Chase Bank N.A.',
      bankBranch: 'NYC Civic Escrow Account',
      swiftCode: 'CHASUS33',
      accountNo: '4810-9920-4172',
      sampleSponsor: 'Metro Civic Infrastructure Watch',
      sampleProject: 'Atlantic Ave Main & Transit Resilience',
      sampleRecipientName: 'Marcus Vance',
      defaultParish: 'Brooklyn CB2 Precinct',
      barcodePrefix: '036',
      basketStaples: ['Organic Produce & Whole Grain Bread', 'Olive Oil & Brown Rice', 'Dairy / Oat Milk & Coffee', 'Pasta & Pantry Staples', 'Household Care Essentials'],
      corridors: [
        { id: 'corridor_brooklyn_atlantic', label: 'Atlantic Ave & Fulton St Transit / Courier Corridor', authority: 'NYC DOT Street Safety Watch' },
        { id: 'corridor_chicago_loop', label: 'Chicago Loop Bus & Delivery Courier Grid', authority: 'CDOT Public Corridor Desk' },
      ],
    },
    DE: {
      samplePhone: '+49 171 555 0194',
      altPhone: '+49 176 555 0283',
      supermarketBrand: 'REWE / EDEKA Markt',
      familySupermarketBrand: 'Alnatura / REWE Familienkorb',
      telcoBrand: 'Telekom Deutschland',
      altTelcoBrand: 'Vodafone DE',
      waterBrand: 'Berliner Wasserbetriebe / Stadtwerke',
      powerBrand: 'Stadtwerke Ökostrom',
      transitBrand: 'Deutschlandticket / VBB Mobilität',
      fuelBrand: 'Aral / Shell Deutschland',
      diningBrand: 'Kamps / Dean&David',
      solarBrand: 'Anker Solix Deutschland',
      pharmacyBrand: 'dm / Apotheke Wellness',
      bookshopBrand: 'Thalia Buchhandlung',
      agroBrand: 'Wochenmarkt Regionalgutschein',
      bankName: 'Deutsche Bank AG',
      bankBranch: 'Frankfurt Civic Treuhandkonto',
      swiftCode: 'DEUTDEFF',
      accountNo: 'DE89 3704 0044 0532 0130 00',
      sampleSponsor: 'Bündnis Kommunale Transparenz',
      sampleProject: 'Stadtwerke Fernwärme & Radwege',
      sampleRecipientName: 'Lukas Weber',
      defaultParish: 'Mitte Ortsteil',
      barcodePrefix: '400',
      basketStaples: ['Vollkornbrot & Bio-Milch', 'Olivenöl & Basmati-Reis', 'Kaffee, Tee & Haferflocken', 'Frisches Obst & Gemüse', 'Haushaltsbedarf'],
      corridors: [
        { id: 'corridor_berlin_mitte', label: 'Alexanderplatz & Fahrrad-Schnellweg Korridor', authority: 'Senatsverwaltung Mobilität Watch' },
        { id: 'corridor_munich_mvg', label: 'München Tram & Lieferrad Korridor', authority: 'MVG / Kommunaler Service-Tisch' },
      ],
    },
    AT: {
      samplePhone: '+43 660 555 0182',
      altPhone: '+43 676 555 0241',
      supermarketBrand: 'SPAR / BILLA Österreich',
      familySupermarketBrand: 'INTERSPAR Familienkorb',
      telcoBrand: 'A1 Telekom Austria',
      altTelcoBrand: 'Drei / Magenta Austria',
      waterBrand: 'Wiener Wasser / Gemeindewerke',
      powerBrand: 'Wien Energie / Verbund',
      transitBrand: 'Wiener Linien / ÖBB Klimaticket',
      fuelBrand: 'OMV / Shell Austria',
      diningBrand: 'Ankerbrot / Ströck',
      solarBrand: 'Fronius / Anker Österreich',
      pharmacyBrand: 'Rat & Tat Apotheke',
      bookshopBrand: 'Thalia Österreich',
      agroBrand: 'Naschmarkt / Bauernmarkt Wien',
      bankName: 'Erste Bank Österreich',
      bankBranch: 'Wien Treuhandkonto Civic',
      swiftCode: 'GIBAATWW',
      accountNo: 'AT61 1904 3002 3457 3201',
      sampleSponsor: 'Österreichische Bürger-Infrastruktur Initiative',
      sampleProject: 'Wiener Wasserleitung & ÖV Kontrolle',
      sampleRecipientName: 'Katharina Gruber',
      defaultParish: 'Innere Stadt Bezirk',
      barcodePrefix: '900',
      basketStaples: ['Bauernbrot & Bio-Milch', 'Rapsöl & Naturreis', 'Almkäse & Obstkorb', 'Kaffee & Tee', 'Haushaltswaren'],
      corridors: [
        { id: 'corridor_vienna_ring', label: 'Wiener Ringstraße & Radweg Korridor', authority: 'MA 46 / Wiener Linien Watch' },
        { id: 'corridor_graz_mur', label: 'Graz Hauptplatz & ÖV Scout Korridor', authority: 'Holding Graz Mobilität' },
      ],
    },
    CN: {
      samplePhone: '+86 138 0013 8000',
      altPhone: '+86 139 1092 4820',
      supermarketBrand: 'Freshippo (Hema) / RT-Mart',
      familySupermarketBrand: 'Sam\'s Club / Yonghui Super',
      telcoBrand: 'China Mobile 5G',
      altTelcoBrand: 'China Unicom',
      waterBrand: 'Municipal Water Group',
      powerBrand: 'State Grid Smart Meter Credit',
      transitBrand: 'Metro & E-Scooter Courier Pass',
      fuelBrand: 'Sinopec / NIO Power Credit',
      diningBrand: 'Luckin / Community Kitchen',
      solarBrand: 'EcoFlow / Anker CN',
      pharmacyBrand: 'Nepstar / Sinopharm Care',
      bookshopBrand: 'Xinhua Bookstore',
      agroBrand: 'Community Fresh Market Voucher',
      bankName: 'Bank of China',
      bankBranch: 'Beijing Civic Escrow Settlement',
      swiftCode: 'BKCHCNBJ',
      accountNo: '4563-5108-0092-1840',
      sampleSponsor: 'Urban Community Service Foundation',
      sampleProject: 'Metro Drainage & Smart Grid Audit',
      sampleRecipientName: 'Wei Zhang',
      defaultParish: 'Chaoyang Ward 1',
      barcodePrefix: '690',
      basketStaples: ['5kg Jasmine Rice', '1L Peanut Cooking Oil', 'Fresh Produce & Soy Milk', 'Noodles & Green Tea', 'Household Care Essentials'],
      corridors: [
        { id: 'corridor_urban_delivery', label: 'Central Business District & E-Scooter Courier Corridor', authority: 'Municipal Transit & Rider Safety Pool' },
        { id: 'corridor_metro_arterial', label: 'Metro Interchange & Arterial Bikeway Scout Line', authority: 'Urban Infrastructure Watch' },
      ],
    },
    IN: {
      samplePhone: '+91 98110 42910',
      altPhone: '+91 98201 77412',
      supermarketBrand: 'BigBasket / Reliance Fresh',
      familySupermarketBrand: 'DMart / Reliance Smart',
      telcoBrand: 'Jio 5G / Airtel India',
      altTelcoBrand: 'Bharti Airtel',
      waterBrand: 'Delhi Jal Board / Municipal Water',
      powerBrand: 'Tata Power / BSES Prepaid',
      transitBrand: 'Metro / Rapid Delivery Rider Pass',
      fuelBrand: 'IndianOil / Bharat Petroleum',
      diningBrand: 'Haldiram\'s / Café Coffee Day',
      solarBrand: 'Tata Power Solar Kit',
      pharmacyBrand: 'Apollo Pharmacy Wellness',
      bookshopBrand: 'Crossword / NCERT Supply Desk',
      agroBrand: 'Safal / FPO Market Kendra',
      bankName: 'State Bank of India',
      bankBranch: 'New Delhi Escrow Settlement Branch',
      swiftCode: 'SBININBB',
      accountNo: '309812449012',
      sampleSponsor: 'National Urban Accountability Fellowship',
      sampleProject: 'Connaught Place Water & Ward Audit',
      sampleRecipientName: 'Arjun Sharma',
      defaultParish: 'Connaught Place Ward',
      barcodePrefix: '890',
      basketStaples: ['5kg Chakki Atta & Toor Dal', '1L Mustard / Cooking Oil', '1kg Sugar & Assam Tea', '2kg Basmati Rice & Soap', 'Fresh Milk & Bread'],
      corridors: [
        { id: 'corridor_delhi_cp', label: 'Connaught Place & Metro Feeder Rider Corridor', authority: 'NDMC / Delhi Traffic Watch' },
        { id: 'corridor_bengaluru_orr', label: 'Outer Ring Road & Two-Wheeler Scout Corridor', authority: 'BBMP Road Safety Pool' },
      ],
    },
  };

  const regionFallback = (r: CampaignRegion): Partial<CountryPerkProfile> => {
    switch (r) {
      case 'europe':
        return {
          supermarketBrand: `Carrefour / ${countryName} Fresh Market`,
          familySupermarketBrand: `Carrefour / Spar ${countryName}`,
          telcoBrand: `${countryName} 5G Mobile`,
          altTelcoBrand: 'Vodafone / Orange EU',
          waterBrand: `${countryName} Municipal Water`,
          powerBrand: `${countryName} Clean Energy Grid`,
          transitBrand: 'City Metro & Bike Share Pass',
          fuelBrand: 'Shell / TotalEnergies EU',
          diningBrand: 'Local Bakery & Café Voucher',
          solarBrand: 'EcoFlow Portable Power',
          pharmacyBrand: `${countryName} Care Pharmacy`,
          bookshopBrand: 'Civic Bookshop & Press',
          agroBrand: 'Farmers Co-op Market Desk',
          bankName: `${countryName} National Escrow Bank`,
          bankBranch: 'SEPA Corporate Escrow Desk',
          swiftCode: `${countryCode}EUXX`,
          sampleRecipientName: 'Elena Novak',
          corridors: [
            { id: `corridor_${countryCode.toLowerCase()}_central`, label: `${countryName} Central Metro & Cycling Scout Corridor`, authority: 'Municipal Mobility Authority' },
            { id: `corridor_${countryCode.toLowerCase()}_market`, label: `${countryName} Main Square & Courier Safety Zone`, authority: 'City Transit Inspection Desk' },
          ],
        };
      case 'americas':
        return {
          supermarketBrand: `${countryName} Community Market / Carrefour`,
          familySupermarketBrand: `${countryName} Family Superstore`,
          telcoBrand: `${countryName} Mobile 5G`,
          altTelcoBrand: 'Claro / Movistar / AT&T',
          waterBrand: `${countryName} Municipal Water`,
          powerBrand: `${countryName} Electric Utility`,
          transitBrand: 'City Transit & Courier Pass',
          fuelBrand: 'Shell / Chevron Partner',
          diningBrand: 'Community Café & Grill',
          solarBrand: 'Portable Solar Battery Kit',
          pharmacyBrand: `${countryName} Wellness Pharmacy`,
          bookshopBrand: 'Regional Bookshop & School Supply',
          agroBrand: 'Public Fresh Market Co-op',
          bankName: `${countryName} Civic Escrow Bank`,
          bankBranch: 'Main Civic Settlement Branch',
          swiftCode: `${countryCode}AMXX`,
          sampleRecipientName: 'Carlos Mendoza',
          corridors: [
            { id: `corridor_${countryCode.toLowerCase()}_central`, label: `${countryName} Central Bus & Courier Scout Corridor`, authority: 'Metropolitan DOT Watch' },
            { id: `corridor_${countryCode.toLowerCase()}_port`, label: `${countryName} Downtown Transit & Bikeway Zone`, authority: 'Civic Mobility Desk' },
          ],
        };
      case 'south_asia':
      case 'east_se_asia':
        return {
          supermarketBrand: `${countryName} Fresh Mart / AEON`,
          familySupermarketBrand: `${countryName} Family Supermarket`,
          telcoBrand: `${countryName} 5G Telecom`,
          altTelcoBrand: 'National Mobile Data',
          waterBrand: `${countryName} Water Utility`,
          powerBrand: `${countryName} Smart Power Grid`,
          transitBrand: 'Metro & Two-Wheeler Courier Pass',
          fuelBrand: 'Shell / Petronas Partner',
          diningBrand: 'Community Eatery & Tea Voucher',
          solarBrand: 'Portable Powerbank & Solar Kit',
          pharmacyBrand: `${countryName} Health Pharmacy`,
          bookshopBrand: 'National Book & School Desk',
          agroBrand: 'Wet Market & Co-op Vendor Desk',
          bankName: `${countryName} Civic Escrow Bank`,
          bankBranch: 'Capital Clearing Escrow Branch',
          swiftCode: `${countryCode}ASXX`,
          sampleRecipientName: 'Priya Tanaka',
          corridors: [
            { id: `corridor_${countryCode.toLowerCase()}_central`, label: `${countryName} Metro Hub & Courier Rider Corridor`, authority: 'Metropolitan Transit Watch' },
            { id: `corridor_${countryCode.toLowerCase()}_market`, label: `${countryName} Central Market & Arterial Line`, authority: 'Municipal Road Safety Desk' },
          ],
        };
      case 'oceania':
        return {
          supermarketBrand: 'Woolworths / Countdown Grocery',
          familySupermarketBrand: 'Coles / Pak\'nSave Family',
          telcoBrand: 'Telstra / Spark 5G',
          altTelcoBrand: 'Optus / One NZ',
          waterBrand: `${countryName} Water Corp`,
          powerBrand: `${countryName} Clean Energy Credit`,
          transitBrand: 'Opal / AT Hop Transit Pass',
          fuelBrand: 'BP / Ampol Fuel Credit',
          diningBrand: 'Community Café & Bakery',
          solarBrand: 'Anker Outdoor Power',
          pharmacyBrand: 'Chemist Warehouse Care',
          bookshopBrand: 'Dymocks / Whitcoulls',
          agroBrand: 'Weekend Growers Market Coop',
          bankName: `${countryName} Civic Reserve Bank`,
          bankBranch: 'Metropolitan Escrow Desk',
          swiftCode: `${countryCode}AUXX`,
          sampleRecipientName: 'Liam Taylor',
          corridors: [
            { id: `corridor_${countryCode.toLowerCase()}_central`, label: `${countryName} CBD Light Rail & Courier Corridor`, authority: 'Regional Transport Watch' },
          ],
        };
      case 'mena':
      case 'north_africa':
        return {
          supermarketBrand: `Carrefour / HyperPanda ${countryName}`,
          familySupermarketBrand: `Carrefour Family ${countryName}`,
          telcoBrand: `${countryName} Telecom 5G`,
          altTelcoBrand: 'Orange / Etisalat / Ooredoo',
          waterBrand: `${countryName} Water Utility`,
          powerBrand: `${countryName} Electricity Credit`,
          transitBrand: 'City Metro & Delivery Pass',
          fuelBrand: 'TotalEnergies / ENOC Station',
          diningBrand: 'Family Bakery & Grill Voucher',
          solarBrand: 'Solar Lantern & Power Pack',
          pharmacyBrand: `${countryName} Care Pharmacy`,
          bookshopBrand: 'National Scholastic Desk',
          agroBrand: 'Central Souk Fresh Co-op',
          bankName: `${countryName} Commercial Escrow Bank`,
          bankBranch: 'Capital Clearing Branch',
          swiftCode: `${countryCode}MEXX`,
          sampleRecipientName: 'Nadia Hassan',
          corridors: [
            { id: `corridor_${countryCode.toLowerCase()}_central`, label: `${countryName} Metro & Delivery Rider Corridor`, authority: 'Urban Transport & Works Watch' },
          ],
        };
      default:
        return {
          supermarketBrand: `Carrefour / ${countryName} Supermarket`,
          familySupermarketBrand: `${countryName} Family Mart`,
          telcoBrand: `MTN / ${countryName} Telecom`,
          altTelcoBrand: `Airtel / Orange ${countryName}`,
          waterBrand: `${countryName} Water Utility`,
          powerBrand: `${countryName} Power Utility`,
          transitBrand: `${countryName} Stage Scout Pass`,
          fuelBrand: 'TotalEnergies / Shell Station',
          diningBrand: `KFC / Fresh Bistro ${countryName}`,
          solarBrand: 'd.light Solar & Power Pack',
          pharmacyBrand: `${countryName} Community Pharmacy`,
          bookshopBrand: `${countryName} Scholastic Desk`,
          agroBrand: `${countryName} Market & Agro Coop`,
          bankName: `${countryName} National Commercial Bank`,
          bankBranch: 'Corporate Civic Escrow Branch',
          swiftCode: `${countryCode}AFXX`,
          sampleRecipientName: 'Samuel Mensah',
          corridors: [
            { id: `corridor_${countryCode.toLowerCase()}_central`, label: `${countryName} Central Transit Hub & Rider Stage`, authority: 'National Road & Transit Authority' },
            { id: `corridor_${countryCode.toLowerCase()}_market`, label: `${countryName} Primary Market & Arterial Road`, authority: 'Municipal Works Corridor Watch' },
          ],
        };
    }
  };

  const baseFallback = regionFallback(region);
  const override = COUNTRY_OVERRIDES[countryCode] || {};

  return {
    countryCode,
    countryName,
    currency,
    phonePrefix,
    samplePhone: override.samplePhone || `${phonePrefix} 700 412 890`,
    altPhone: override.altPhone || `${phonePrefix} 710 829 310`,
    ussdDial,
    supermarketBrand: override.supermarketBrand || baseFallback.supermarketBrand!,
    familySupermarketBrand: override.familySupermarketBrand || baseFallback.familySupermarketBrand!,
    telcoBrand: override.telcoBrand || baseFallback.telcoBrand!,
    altTelcoBrand: override.altTelcoBrand || baseFallback.altTelcoBrand!,
    waterBrand: override.waterBrand || baseFallback.waterBrand!,
    powerBrand: override.powerBrand || baseFallback.powerBrand!,
    transitBrand: override.transitBrand || baseFallback.transitBrand!,
    fuelBrand: override.fuelBrand || baseFallback.fuelBrand!,
    diningBrand: override.diningBrand || baseFallback.diningBrand!,
    solarBrand: override.solarBrand || baseFallback.solarBrand!,
    pharmacyBrand: override.pharmacyBrand || baseFallback.pharmacyBrand!,
    bookshopBrand: override.bookshopBrand || baseFallback.bookshopBrand!,
    agroBrand: override.agroBrand || baseFallback.agroBrand!,
    bankName: override.bankName || baseFallback.bankName!,
    bankBranch: override.bankBranch || baseFallback.bankBranch!,
    swiftCode: override.swiftCode || baseFallback.swiftCode!,
    accountNo: override.accountNo || `CIVIC-${countryCode}-8849201`,
    sampleSponsor: override.sampleSponsor || `${countryName} Civic Infrastructure Partners`,
    sampleProject: override.sampleProject || `${countryName} Municipal Works & Service Accountability`,
    sampleRecipientName: override.sampleRecipientName || baseFallback.sampleRecipientName!,
    defaultParish: override.defaultParish || `Central Ward (${countryName})`,
    barcodePrefix: override.barcodePrefix || '740',
    basketStaples: override.basketStaples || [
      '2kg Staple Flour / Grain',
      '1L Cooking Oil',
      '1kg Sugar & Tea/Coffee',
      '2kg Rice & Household Soap',
      'Fresh Milk & Bakery Loaf',
    ],
    corridors: override.corridors || baseFallback.corridors!,
  };
}

export function getLocalizedMerchantProductsForCountry(
  countryCode: CountryCode,
  parishOptions: string[]
): MerchantProductService[] {
  const profile = getCountryPerkProfile(countryCode);
  const basket = convertUsdToLocal(8, countryCode);
  const haircut = convertUsdToLocal(7, countryCode);
  const grocery = convertUsdToLocal(5, countryCode);
  const clinic = convertUsdToLocal(6, countryCode);
  const p0 = parishOptions[0] || profile.defaultParish;
  const p1 = parishOptions[1] || p0;

  return [
    {
      id: `merch-loc-${countryCode}-grocery`,
      merchantId: `shop_${countryCode.toLowerCase()}_market`,
      merchantName: profile.supermarketBrand,
      category: 'groceries_consumables',
      parish: p0,
      subCounty: `${profile.countryName} Metro`,
      district: profile.countryName,
      address: `Main High Street, ${p0}`,
      country: countryCode,
      title: `Household Essentials Basket (${basket.formatted})`,
      basePrice: basket.amount,
      currency: basket.currency,
      rewardType: 'bogo',
      rewardHeadline: `BOGO: Fresh Bakery & Produce Basket (${basket.formatted})`,
      rewardDescription: `Redeem at checkout in ${p0} for essential household groceries plus a complimentary fresh loaf pack.`,
      voucherCost: basket.amount,
      commissionPct: 0.02,
      commissionAmount: Math.round(basket.amount * 0.02),
      merchantPayoutAmount: basket.amount - Math.round(basket.amount * 0.02),
      payoutStatus: 'escrowed',
      qrCodePayload: `CIVIC-VCH-${countryCode}-GROCERY`,
      barcode: `${profile.barcodePrefix}100458921`,
      ussdCode: profile.ussdDial,
      smsCode: `${countryCode}BASKET`,
      active: true,
      createdAt: '2026-10-03T09:30:00Z',
    },
    {
      id: `merch-loc-${countryCode}-salon`,
      merchantId: `shop_${countryCode.toLowerCase()}_care`,
      merchantName: `${p0.split(' ')[0]} Grooming & Care Studio`,
      category: 'beauty_personal_care',
      parish: p0,
      subCounty: `${profile.countryName} Central`,
      district: profile.countryName,
      address: `Civic Square Arcade, ${p0}`,
      country: countryCode,
      title: 'Full Grooming & Conditioning Service',
      basePrice: haircut.amount,
      currency: haircut.currency,
      rewardType: 'freebie',
      rewardHeadline: `20% OFF + Free Wash (${haircut.formatted})`,
      rewardDescription: `Verified citizen scouts receive a complimentary wash & care add-on in ${p0}.`,
      discountPercent: 20,
      voucherCost: haircut.amount,
      commissionPct: 0.02,
      commissionAmount: Math.round(haircut.amount * 0.02),
      merchantPayoutAmount: haircut.amount - Math.round(haircut.amount * 0.02),
      payoutStatus: 'escrowed',
      qrCodePayload: `CIVIC-VCH-${countryCode}-CARE`,
      barcode: `${profile.barcodePrefix}100458922`,
      ussdCode: profile.ussdDial,
      smsCode: `${countryCode}CARE`,
      active: true,
      createdAt: '2026-10-04T10:00:00Z',
    },
    {
      id: `merch-loc-${countryCode}-pharmacy`,
      merchantId: `shop_${countryCode.toLowerCase()}_pharma`,
      merchantName: profile.pharmacyBrand,
      category: 'healthcare_wellness',
      parish: p1,
      subCounty: `${profile.countryName} Urban`,
      district: profile.countryName,
      address: `Health Plaza, ${p1}`,
      country: countryCode,
      title: `First-Aid & Family Wellness Kit (${clinic.formatted})`,
      basePrice: clinic.amount,
      currency: clinic.currency,
      rewardType: 'discount',
      rewardHeadline: `25% OFF Family Wellness Kit (${clinic.formatted})`,
      rewardDescription: `Counter discount voucher on over-the-counter family health & hygiene essentials.`,
      discountPercent: 25,
      voucherCost: clinic.amount,
      commissionPct: 0.02,
      commissionAmount: Math.round(clinic.amount * 0.02),
      merchantPayoutAmount: clinic.amount - Math.round(clinic.amount * 0.02),
      payoutStatus: 'escrowed',
      qrCodePayload: `CIVIC-VCH-${countryCode}-HEALTH`,
      barcode: `${profile.barcodePrefix}100458923`,
      ussdCode: profile.ussdDial,
      smsCode: `${countryCode}HEALTH`,
      active: true,
      createdAt: '2026-10-05T11:30:00Z',
    },
    {
      id: `merch-loc-${countryCode}-transit`,
      merchantId: `shop_${countryCode.toLowerCase()}_transit`,
      merchantName: profile.fuelBrand,
      category: 'automotive_motorbikes',
      parish: p1,
      subCounty: `${profile.countryName} Transit`,
      district: profile.countryName,
      address: `Main Arterial Station, ${p1}`,
      country: countryCode,
      title: `Commuter Mobility & Rider Service (${grocery.formatted})`,
      basePrice: grocery.amount,
      currency: grocery.currency,
      rewardType: 'gift',
      rewardHeadline: `Mobility & Safety Check Gift (${grocery.formatted})`,
      rewardDescription: `Redeem for commuter fuel, charging, or bicycle/motorbike safety tune-up at participating hubs.`,
      voucherCost: grocery.amount,
      commissionPct: 0.02,
      commissionAmount: Math.round(grocery.amount * 0.02),
      merchantPayoutAmount: grocery.amount - Math.round(grocery.amount * 0.02),
      payoutStatus: 'escrowed',
      qrCodePayload: `CIVIC-VCH-${countryCode}-TRANSIT`,
      barcode: `${profile.barcodePrefix}100458924`,
      ussdCode: profile.ussdDial,
      smsCode: `${countryCode}RIDE`,
      active: true,
      createdAt: '2026-10-06T12:15:00Z',
    },
  ];
}

// Legacy Uganda-specific images that MUST never bleed into non-UG jurisdictions
export const UGANDA_ONLY_EVIDENCE_FRAGMENTS = [
  'water_main_burst.jpg',
  'unbuilt_road_site.jpg',
  'sidewalk_damage.jpg',
  'power_transformer_repair.jpg',
  'pipe_repaired_nwsc.jpg',
  'hospital_emergency_mulago.jpg',
  'matatu_swerving_pothole.jpg',
  'damaged_tyre_pothole.jpg',
  'transformer_fire.jpg',
];

export function isUgandaLegacyMediaUrl(url?: string): boolean {
  if (!url) return false;
  return UGANDA_ONLY_EVIDENCE_FRAGMENTS.some((frag) => url.includes(frag));
}

export function getRegionEvidenceMedia(
  countryCode: CountryCode | undefined,
  hint: string = ''
): string {
  const cc = (countryCode || 'UG').toUpperCase() as CountryCode;
  const h = (hint || '').toLowerCase();
  const v = `?v=${ASSET_VERSION_TAG}`;

  if (cc === 'UG') {
    if (h.includes('power') || h.includes('electric') || h.includes('transformer')) return `/evidence/power_transformer_repair.jpg${v}`;
    if (h.includes('unbuilt') || h.includes('graft') || h.includes('culvert') || h.includes('corruption')) return `/evidence/unbuilt_road_site.jpg${v}`;
    if (h.includes('hospital') || h.includes('health') || h.includes('clinic')) return `/evidence/hospital_emergency_mulago.jpg${v}`;
    if (h.includes('repair') || h.includes('fixed')) return `/evidence/pipe_repaired_nwsc.jpg${v}`;
    if (h.includes('road') || h.includes('pothole')) return `/evidence/matatu_swerving_pothole.jpg${v}`;
    return `/evidence/water_main_burst.jpg${v}`;
  }

  if (cc === 'RW') {
    if (h.includes('power') || h.includes('electric') || h.includes('transformer') || h.includes('reg')) {
      return `/evidence/rw_reg_substation.jpg${v}`;
    }
    if (h.includes('clean') || h.includes('praise') || h.includes('corridor')) {
      return `/evidence/kigali_clean_corridor.jpg${v}`;
    }
    if (h.includes('asphalt') || h.includes('repaired') || h.includes('sealed')) {
      return `/evidence/kigali_asphalt_road_repair.jpg${v}`;
    }
    return `/evidence/rw_kigali_water_repair.jpg${v}`;
  }

  if (cc === 'KE') {
    if (h.includes('power') || h.includes('kplc') || h.includes('transformer') || h.includes('electric')) {
      return `/evidence/ke_kplc_power_repair.jpg${v}`;
    }
    return `/evidence/ke_nairobi_sewer_repair.jpg${v}`;
  }

  if (cc === 'NG') {
    return `/evidence/ng_lagos_drainage_flood.jpg${v}`;
  }

  if (cc === 'GH') {
    return `/evidence/gh_accra_power_repair.jpg${v}`;
  }

  if (cc === 'ZA') {
    return `/evidence/za_eskom_substation_repair.jpg${v}`;
  }

  const region = inferCampaignRegion(cc);
  if (region === 'europe') {
    if (h.includes('unbuilt') || h.includes('graft') || h.includes('culvert') || h.includes('corruption')) {
      return `/evidence/eu_unbuilt_culvert_site.jpg${v}`;
    }
    return `/evidence/eu_water_main_break.jpg${v}`;
  }
  if (region === 'americas' || region === 'oceania') {
    return `/evidence/us_street_water_main.jpg${v}`;
  }
  if (region === 'south_asia' || region === 'east_se_asia') {
    if (h.includes('unbuilt') || h.includes('graft') || h.includes('culvert') || h.includes('corruption')) {
      return `/evidence/asia_unbuilt_culvert_site.jpg${v}`;
    }
    return `/evidence/asia_urban_water_break.jpg${v}`;
  }
  if (region === 'southern_africa') {
    return `/evidence/za_eskom_substation_repair.jpg${v}`;
  }
  if (region === 'west_africa') {
    return h.includes('power') || h.includes('electric')
      ? `/evidence/gh_accra_power_repair.jpg${v}`
      : `/evidence/ng_lagos_drainage_flood.jpg${v}`;
  }
  if (region === 'east_africa') {
    return h.includes('power') || h.includes('electric')
      ? `/evidence/ke_kplc_power_repair.jpg${v}`
      : `/evidence/ke_nairobi_sewer_repair.jpg${v}`;
  }
  return `/evidence/eu_water_main_break.jpg${v}`;
}

export function getLocalizedSandboxVouchersForCountry(
  countryCode: CountryCode,
  parishOptions: string[] = []
): EscrowPerkVoucher[] {
  const cc = (countryCode || 'UG').toUpperCase() as CountryCode;
  const profile = getCountryPerkProfile(cc);
  const parish = parishOptions[0] || profile.defaultParish;
  const basketVal = convertUsdToLocal(8, cc);
  const dataVal = convertUsdToLocal(3, cc);
  const waterVal = convertUsdToLocal(3, cc);
  const powerVal = convertUsdToLocal(4, cc);
  const transitVal = convertUsdToLocal(2, cc);
  const nowIso = new Date().toISOString();

  return [
    {
      id: `PV-${cc}-LOC-01`,
      voucherCode: `SHOP-${cc}-8820`,
      pin: '8820',
      category: 'supermarket',
      brand: profile.supermarketBrand,
      title: `${basketVal.formatted} Supermarket Shopping Basket Voucher`,
      faceValue: basketVal.amount,
      currency: basketVal.currency,
      country: cc,
      merchantLocation: { parish },
      packagedItems: profile.basketStaples,
      sponsoredBy: `${profile.supermarketBrand} Community Desk`,
      sponsorType: 'corporate_csr',
      vaultType: 'provider_vault',
      jurisdictionLabel: `${profile.supermarketBrand} Community Desk`,
      batchId: `BATCH-MKT-${cc}-01`,
      status: 'escrow_unassigned',
      createdAt: nowIso,
      redemptionUssdString: profile.ussdDial,
      expiryDate: '2026-12-31',
      isDemo: true,
      reimbursementFraming: 'Household Groceries & Field Scout Appreciation',
      ethicalPledgeSealed: true,
      commissionBreakdown: {
        faceValueTotal: basketVal.amount,
        wholesaleDiscountPct: 0.06,
        wholesaleSpreadCommission: Math.round(basketVal.amount * 0.06),
        csrPlatformFeePct: 0.1,
        csrPlatformFee: Math.round(basketVal.amount * 0.1),
        totalCivicDutyRevenue: Math.round(basketVal.amount * 0.16),
      },
    },
    {
      id: `PV-${cc}-LOC-02`,
      voucherCode: `DATA-${cc}-7712`,
      pin: '7712',
      category: 'telco_data',
      brand: profile.telcoBrand,
      title: `2GB ${profile.telcoBrand} Civic Watchdog Data Pack`,
      faceValue: dataVal.amount,
      currency: dataVal.currency,
      country: cc,
      merchantLocation: { parish },
      packagedItems: [`2GB ${profile.telcoBrand} 4G/5G Data`, 'Zero-Rated Evidence Upload'],
      sponsoredBy: profile.sampleSponsor,
      sponsorType: 'contractor',
      vaultType: 'contractor_vault',
      jurisdictionLabel: profile.sampleProject,
      projectName: profile.sampleProject,
      batchId: `BATCH-DATA-${cc}-02`,
      status: 'escrow_unassigned',
      createdAt: nowIso,
      redemptionUssdString: profile.ussdDial,
      expiryDate: '2026-12-31',
      isDemo: true,
      reimbursementFraming: 'Mobile Data & Connectivity Stipend',
      ethicalPledgeSealed: true,
      commissionBreakdown: {
        faceValueTotal: dataVal.amount,
        wholesaleDiscountPct: 0.06,
        wholesaleSpreadCommission: Math.round(dataVal.amount * 0.06),
        csrPlatformFeePct: 0.1,
        csrPlatformFee: Math.round(dataVal.amount * 0.1),
        totalCivicDutyRevenue: Math.round(dataVal.amount * 0.16),
      },
    },
    {
      id: `PV-${cc}-LOC-03`,
      voucherCode: `WTR-${cc}-4419`,
      pin: '4419',
      category: 'water_utility',
      brand: profile.waterBrand,
      title: `${waterVal.formatted} ${profile.waterBrand} Utility Credit`,
      faceValue: waterVal.amount,
      currency: waterVal.currency,
      country: cc,
      merchantLocation: { parish },
      packagedItems: [`Prepaid Municipal Water Credit (${profile.waterBrand})`, 'Sanitation & Leakage Audit Grant'],
      sponsoredBy: `${profile.countryName} Municipal Works Watch`,
      sponsorType: 'authority',
      vaultType: 'parish_vault',
      jurisdictionLabel: parish,
      batchId: `BATCH-WTR-${cc}-03`,
      status: 'escrow_unassigned',
      createdAt: nowIso,
      redemptionUssdString: profile.ussdDial,
      expiryDate: '2026-12-31',
      isDemo: true,
      reimbursementFraming: 'Utility Water Bill Waiver',
      ethicalPledgeSealed: true,
      commissionBreakdown: {
        faceValueTotal: waterVal.amount,
        wholesaleDiscountPct: 0.06,
        wholesaleSpreadCommission: Math.round(waterVal.amount * 0.06),
        csrPlatformFeePct: 0.1,
        csrPlatformFee: Math.round(waterVal.amount * 0.1),
        totalCivicDutyRevenue: Math.round(waterVal.amount * 0.16),
      },
    },
    {
      id: `PV-${cc}-LOC-04`,
      voucherCode: `PWR-${cc}-6630`,
      pin: '6630',
      category: 'electricity',
      brand: profile.powerBrand,
      title: `${powerVal.formatted} ${profile.powerBrand} Prepaid Token`,
      faceValue: powerVal.amount,
      currency: powerVal.currency,
      country: cc,
      merchantLocation: { parish },
      packagedItems: [`Domestic Prepaid Power Credit (${profile.powerBrand})`, 'Grid & Streetlight Safety Incentive'],
      sponsoredBy: profile.sampleSponsor,
      sponsorType: 'contractor',
      vaultType: 'parish_vault',
      jurisdictionLabel: parish,
      batchId: `BATCH-PWR-${cc}-04`,
      status: 'escrow_unassigned',
      createdAt: nowIso,
      redemptionUssdString: profile.ussdDial,
      expiryDate: '2026-12-31',
      isDemo: true,
      reimbursementFraming: 'Prepaid Electricity Token Reimbursement',
      ethicalPledgeSealed: true,
      commissionBreakdown: {
        faceValueTotal: powerVal.amount,
        wholesaleDiscountPct: 0.06,
        wholesaleSpreadCommission: Math.round(powerVal.amount * 0.06),
        csrPlatformFeePct: 0.1,
        csrPlatformFee: Math.round(powerVal.amount * 0.1),
        totalCivicDutyRevenue: Math.round(powerVal.amount * 0.16),
      },
    },
    {
      id: `PV-${cc}-LOC-05`,
      voucherCode: `TRN-${cc}-5102`,
      pin: '5102',
      category: 'transit_credit',
      brand: profile.transitBrand,
      title: `${transitVal.formatted} ${profile.transitBrand} Scout Mobility Pass`,
      faceValue: transitVal.amount,
      currency: transitVal.currency,
      country: cc,
      merchantLocation: { parish },
      packagedItems: [`${profile.transitBrand} Commuter & Field Scout Credit`],
      sponsoredBy: `${profile.countryName} Mobility & Road Safety Pool`,
      sponsorType: 'corporate_csr',
      vaultType: 'scout_bounty_vault',
      jurisdictionLabel: profile.corridors[0]?.label || `${profile.countryName} Transit Corridor`,
      batchId: `BATCH-TRN-${cc}-05`,
      status: 'dispatched',
      createdAt: nowIso,
      redemptionUssdString: profile.ussdDial,
      expiryDate: '2026-12-31',
      isDemo: true,
      reimbursementFraming: 'Frontline Scout Road Safety Mobility Grant',
      ethicalPledgeSealed: true,
      dispatchedTo: {
        recipientName: profile.sampleRecipientName,
        recipientContact: profile.samplePhone,
        dispatchedAt: nowIso,
        dispatchedBy: `${profile.countryName} Corridor Safety Escrow`,
        citationNote: `Dispatched to active civic scout in ${parish}`,
        postOrProjectId: `POST-${cc}-01`,
        smsDeliveryStatus: 'delivered',
        ethicalNonInterferenceAck: true,
        vaultType: 'scout_bounty_vault',
        jurisdictionLabel: parish,
      },
      commissionBreakdown: {
        faceValueTotal: transitVal.amount,
        wholesaleDiscountPct: 0.06,
        wholesaleSpreadCommission: Math.round(transitVal.amount * 0.06),
        csrPlatformFeePct: 0.1,
        csrPlatformFee: Math.round(transitVal.amount * 0.1),
        totalCivicDutyRevenue: Math.round(transitVal.amount * 0.16),
      },
    },
  ];
}
