import { CdOpsPromotionalAd, CountryCode } from '../types';
import { COUNTRIES } from './countries';

export type CampaignRegion =
  | 'uganda'
  | 'rwanda'
  | 'east_africa'
  | 'west_africa'
  | 'southern_africa'
  | 'north_africa'
  | 'europe'
  | 'americas'
  | 'south_asia'
  | 'east_se_asia'
  | 'mena'
  | 'oceania';

export interface CountryTransitCampaignSpec {
  countryCode: CountryCode;
  countryName: string;
  region: CampaignRegion;
  ussdCode: string;
  busPartnerName: string;
  busFleetType: string;
  busRoutes: string;
  busProposalSummary: string;
  trainOperatorName: string;
  trainType: string;
  trainCorridors: string;
  trainProposalSummary: string;
  stageTransportName: string;
  stageLocations: string;
  localSlogan: string;
  municipalAuthority: string;
  // Localized pillar tabs & copy (strictly region-authentic)
  scoutTabLabel: string;
  marketTabLabel: string;
  taxiTabLabel: string;
  taxiHeadlineLabel: string;
  marketHeadlinePlaces: string;
  // Strictly isolated image assets per jurisdiction/region
  busPosterSrc: string;
  trainPosterSrc: string;
  scoutPosterSrc: string;
  marketPosterSrc: string;
  taxiPosterSrc: string;
  healthPosterSrc: string;
  teacherPosterSrc: string;
  artisanPosterSrc: string;
}

export const CAMPAIGN_ASSET_VERSION = '20261114';
const v = `?v=${CAMPAIGN_ASSET_VERSION}`;

const REGION_ASSET_SETS: Record<
  CampaignRegion,
  Pick<
    CountryTransitCampaignSpec,
    | 'busPosterSrc'
    | 'trainPosterSrc'
    | 'scoutPosterSrc'
    | 'marketPosterSrc'
    | 'taxiPosterSrc'
    | 'healthPosterSrc'
    | 'teacherPosterSrc'
    | 'artisanPosterSrc'
  >
> = {
  uganda: {
    busPosterSrc: `/campaign/kayoola_kampala_street_ad.jpg${v}`,
    trainPosterSrc: `/campaign/train_moving_billboard_kampala.jpg${v}`,
    scoutPosterSrc: `/campaign/boda_stage_billboard_ad.jpg${v}`,
    marketPosterSrc: `/campaign/market_vendors_billboard_ad.jpg${v}`,
    taxiPosterSrc: `/campaign/taxi_park_billboard_ad.jpg${v}`,
    healthPosterSrc: `/campaign/africa_health_clinic_ad.jpg${v}`,
    teacherPosterSrc: `/campaign/africa_school_youth_ad.jpg${v}`,
    artisanPosterSrc: `/campaign/africa_artisan_works_ad.jpg${v}`,
  },
  rwanda: {
    busPosterSrc: `/campaign/kigali_bus_station_poster.jpg${v}`,
    trainPosterSrc: `/campaign/kigali_bus_station_poster.jpg${v}`,
    scoutPosterSrc: `/campaign/kigali_moto_scouts_billboard.jpg${v}`,
    marketPosterSrc: `/campaign/kimironko_market_billboard.jpg${v}`,
    taxiPosterSrc: `/campaign/kigali_moto_scouts_billboard.jpg${v}`,
    healthPosterSrc: `/campaign/africa_health_clinic_ad.jpg${v}`,
    teacherPosterSrc: `/campaign/africa_school_youth_ad.jpg${v}`,
    artisanPosterSrc: `/campaign/africa_artisan_works_ad.jpg${v}`,
  },
  east_africa: {
    busPosterSrc: `/campaign/intl_bus_transit_poster.jpg${v}`,
    trainPosterSrc: `/campaign/intl_rail_station_poster.jpg${v}`,
    scoutPosterSrc: `/campaign/ke_matatu_boda_billboard.jpg${v}`,
    marketPosterSrc: `/campaign/regional_africa_market_billboard.jpg${v}`,
    taxiPosterSrc: `/campaign/ke_matatu_boda_billboard.jpg${v}`,
    healthPosterSrc: `/campaign/africa_health_clinic_ad.jpg${v}`,
    teacherPosterSrc: `/campaign/africa_school_youth_ad.jpg${v}`,
    artisanPosterSrc: `/campaign/africa_artisan_works_ad.jpg${v}`,
  },
  west_africa: {
    busPosterSrc: `/campaign/intl_bus_transit_poster.jpg${v}`,
    trainPosterSrc: `/campaign/intl_rail_station_poster.jpg${v}`,
    scoutPosterSrc: `/campaign/ng_west_africa_billboard.jpg${v}`,
    marketPosterSrc: `/campaign/regional_africa_market_billboard.jpg${v}`,
    taxiPosterSrc: `/campaign/ng_west_africa_billboard.jpg${v}`,
    healthPosterSrc: `/campaign/africa_health_clinic_ad.jpg${v}`,
    teacherPosterSrc: `/campaign/africa_school_youth_ad.jpg${v}`,
    artisanPosterSrc: `/campaign/africa_artisan_works_ad.jpg${v}`,
  },
  southern_africa: {
    busPosterSrc: `/campaign/za_transit_bus_billboard.jpg${v}`,
    trainPosterSrc: `/campaign/za_transit_bus_billboard.jpg${v}`,
    scoutPosterSrc: `/campaign/za_taxi_scouts_billboard.jpg${v}`,
    marketPosterSrc: `/campaign/regional_africa_market_billboard.jpg${v}`,
    taxiPosterSrc: `/campaign/za_taxi_scouts_billboard.jpg${v}`,
    healthPosterSrc: `/campaign/africa_health_clinic_ad.jpg${v}`,
    teacherPosterSrc: `/campaign/africa_school_youth_ad.jpg${v}`,
    artisanPosterSrc: `/campaign/africa_artisan_works_ad.jpg${v}`,
  },
  north_africa: {
    busPosterSrc: `/campaign/intl_bus_transit_poster.jpg${v}`,
    trainPosterSrc: `/campaign/intl_rail_station_poster.jpg${v}`,
    scoutPosterSrc: `/campaign/intl_bus_transit_poster.jpg${v}`,
    marketPosterSrc: `/campaign/regional_africa_market_billboard.jpg${v}`,
    taxiPosterSrc: `/campaign/intl_bus_transit_poster.jpg${v}`,
    healthPosterSrc: `/campaign/africa_health_clinic_ad.jpg${v}`,
    teacherPosterSrc: `/campaign/africa_school_youth_ad.jpg${v}`,
    artisanPosterSrc: `/campaign/africa_artisan_works_ad.jpg${v}`,
  },
  europe: {
    busPosterSrc: `/campaign/intl_bus_transit_poster.jpg${v}`,
    trainPosterSrc: `/campaign/intl_rail_station_poster.jpg${v}`,
    scoutPosterSrc: `/campaign/eu_uk_frontline_billboard.jpg${v}`,
    marketPosterSrc: `/campaign/intl_market_square_billboard.jpg${v}`,
    taxiPosterSrc: `/campaign/eu_uk_frontline_billboard.jpg${v}`,
    healthPosterSrc: `/campaign/health_clinic_billboard_ad.jpg${v}`,
    teacherPosterSrc: `/campaign/school_youth_billboard_ad.jpg${v}`,
    artisanPosterSrc: `/campaign/artisan_construction_billboard_ad.jpg${v}`,
  },
  americas: {
    busPosterSrc: `/campaign/intl_bus_transit_poster.jpg${v}`,
    trainPosterSrc: `/campaign/intl_rail_station_poster.jpg${v}`,
    scoutPosterSrc: `/campaign/us_americas_frontline_billboard.jpg${v}`,
    marketPosterSrc: `/campaign/intl_market_square_billboard.jpg${v}`,
    taxiPosterSrc: `/campaign/us_americas_frontline_billboard.jpg${v}`,
    healthPosterSrc: `/campaign/health_clinic_billboard_ad.jpg${v}`,
    teacherPosterSrc: `/campaign/school_youth_billboard_ad.jpg${v}`,
    artisanPosterSrc: `/campaign/artisan_construction_billboard_ad.jpg${v}`,
  },
  south_asia: {
    busPosterSrc: `/campaign/intl_bus_transit_poster.jpg${v}`,
    trainPosterSrc: `/campaign/intl_rail_station_poster.jpg${v}`,
    scoutPosterSrc: `/campaign/asia_frontline_billboard.jpg${v}`,
    marketPosterSrc: `/campaign/asia_market_billboard.jpg${v}`,
    taxiPosterSrc: `/campaign/asia_frontline_billboard.jpg${v}`,
    healthPosterSrc: `/campaign/asia_health_clinic_ad.jpg${v}`,
    teacherPosterSrc: `/campaign/asia_school_youth_ad.jpg${v}`,
    artisanPosterSrc: `/campaign/artisan_construction_billboard_ad.jpg${v}`,
  },
  east_se_asia: {
    busPosterSrc: `/campaign/intl_bus_transit_poster.jpg${v}`,
    trainPosterSrc: `/campaign/intl_rail_station_poster.jpg${v}`,
    scoutPosterSrc: `/campaign/east_asia_frontline_billboard.jpg${v}`,
    marketPosterSrc: `/campaign/asia_market_billboard.jpg${v}`,
    taxiPosterSrc: `/campaign/east_asia_frontline_billboard.jpg${v}`,
    healthPosterSrc: `/campaign/asia_health_clinic_ad.jpg${v}`,
    teacherPosterSrc: `/campaign/asia_school_youth_ad.jpg${v}`,
    artisanPosterSrc: `/campaign/artisan_construction_billboard_ad.jpg${v}`,
  },
  mena: {
    busPosterSrc: `/campaign/intl_bus_transit_poster.jpg${v}`,
    trainPosterSrc: `/campaign/intl_rail_station_poster.jpg${v}`,
    scoutPosterSrc: `/campaign/intl_bus_transit_poster.jpg${v}`,
    marketPosterSrc: `/campaign/intl_market_square_billboard.jpg${v}`,
    taxiPosterSrc: `/campaign/us_americas_frontline_billboard.jpg${v}`,
    healthPosterSrc: `/campaign/health_clinic_billboard_ad.jpg${v}`,
    teacherPosterSrc: `/campaign/school_youth_billboard_ad.jpg${v}`,
    artisanPosterSrc: `/campaign/artisan_construction_billboard_ad.jpg${v}`,
  },
  oceania: {
    busPosterSrc: `/campaign/intl_bus_transit_poster.jpg${v}`,
    trainPosterSrc: `/campaign/intl_rail_station_poster.jpg${v}`,
    scoutPosterSrc: `/campaign/eu_uk_frontline_billboard.jpg${v}`,
    marketPosterSrc: `/campaign/intl_market_square_billboard.jpg${v}`,
    taxiPosterSrc: `/campaign/us_americas_frontline_billboard.jpg${v}`,
    healthPosterSrc: `/campaign/health_clinic_billboard_ad.jpg${v}`,
    teacherPosterSrc: `/campaign/school_youth_billboard_ad.jpg${v}`,
    artisanPosterSrc: `/campaign/artisan_construction_billboard_ad.jpg${v}`,
  },
};

const AMERICAS_CODES = new Set([
  'US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'JM', 'HT', 'TT',
  'BO', 'PY', 'UY', 'GY', 'SR', 'BZ', 'CR', 'SV', 'GT', 'HN', 'NI', 'PA', 'CU',
  'DO', 'BS', 'BB', 'AG', 'DM', 'GD', 'KN', 'LC', 'VC',
]);

const EUROPE_CODES = new Set([
  'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'NO', 'FI', 'DK', 'PL', 'UA', 'IE',
  'CH', 'AT', 'BE', 'PT', 'GR', 'TR', 'RU', 'AL', 'AD', 'AM', 'AZ', 'BY', 'BA',
  'BG', 'HR', 'CY', 'CZ', 'EE', 'GE', 'HU', 'IS', 'XK', 'LV', 'LI', 'LT', 'LU',
  'MT', 'MD', 'MC', 'ME', 'MK', 'RO', 'SM', 'RS', 'SK', 'SI', 'VA',
]);

const SOUTH_ASIA_CODES = new Set(['IN', 'PK', 'BD', 'LK', 'NP', 'BT', 'MV', 'AF']);

const EAST_SE_ASIA_CODES = new Set([
  'JP', 'KR', 'CN', 'TW', 'HK', 'SG', 'MY', 'TH', 'VN', 'ID', 'PH', 'KH', 'LA',
  'MM', 'BN', 'TL', 'MN', 'KZ', 'KG', 'TJ', 'TM', 'UZ', 'KP',
]);

const MENA_CODES = new Set(['AE', 'SA', 'QA', 'BH', 'KW', 'OM', 'JO', 'IL', 'PS', 'LB', 'IQ', 'IR', 'SY', 'YE']);

const OCEANIA_CODES = new Set(['AU', 'NZ', 'FJ', 'KI', 'MH', 'FM', 'NR', 'PW', 'PG', 'WS', 'SB', 'TO', 'TV', 'VU']);

const WEST_AFRICA_CODES = new Set([
  'NG', 'GH', 'SN', 'CI', 'BJ', 'BF', 'CM', 'CV', 'GM', 'GN', 'GW', 'LR', 'ML', 'MR', 'NE', 'SL', 'TG',
]);

const EAST_AFRICA_CODES = new Set(['KE', 'TZ', 'SS', 'BI', 'ET', 'ER', 'DJ', 'SO']);

const NORTH_AFRICA_CODES = new Set(['EG', 'MA', 'TN', 'DZ', 'LY', 'SD']);

export function inferCampaignRegion(countryCode: CountryCode): CampaignRegion {
  if (countryCode === 'UG') return 'uganda';
  if (countryCode === 'RW') return 'rwanda';
  if (EAST_AFRICA_CODES.has(countryCode)) return 'east_africa';
  if (WEST_AFRICA_CODES.has(countryCode)) return 'west_africa';
  if (NORTH_AFRICA_CODES.has(countryCode)) return 'north_africa';
  if (EUROPE_CODES.has(countryCode)) return 'europe';
  if (AMERICAS_CODES.has(countryCode)) return 'americas';
  if (SOUTH_ASIA_CODES.has(countryCode)) return 'south_asia';
  if (EAST_SE_ASIA_CODES.has(countryCode)) return 'east_se_asia';
  if (MENA_CODES.has(countryCode)) return 'mena';
  if (OCEANIA_CODES.has(countryCode)) return 'oceania';
  return 'southern_africa';
}

export function getRegionPosterFallback(countryCode: CountryCode = 'US'): string {
  const region = inferCampaignRegion(countryCode);
  return REGION_ASSET_SETS[region].scoutPosterSrc;
}

export const COUNTRY_TRANSIT_SPECS: Partial<Record<CountryCode, CountryTransitCampaignSpec>> = {
  UG: {
    countryCode: 'UG',
    countryName: 'Uganda',
    region: 'uganda',
    ussdCode: '*3030#',
    busPartnerName: 'Kiira Motors Corporation (Kayoola EVS) & Tondeka Metro',
    busFleetType: 'Kayoola EVS 10.5m/12m Electric & Diesel City Transit Buses',
    busRoutes: 'Kampala Central, Northern Bypass, Jinja Road, Entebbe & Wakiso Corridors',
    busProposalSummary:
      'Advertisement Partnership Proposal: Upon bilateral agreement with Kiira Motors Corporation (KMC) and the Ministry of Works & Transport, CivicDuty will fund and execute the actual exterior painting and 3M UV-laminated livery branding of the Kayoola bus fleet in our official 3-Signal design.',
    trainOperatorName: 'Uganda Railways Corporation (URC)',
    trainType: 'URC Steel Diesel-Electric Commuter Coaches & Locomotives',
    trainCorridors: 'Kampala–Namanve, Mukono, Port Bell & Nalukolongo Rail Corridors',
    trainProposalSummary:
      'Moving Billboard Refurbishment Proposal: CivicDuty is ready to partner with Uganda Railways Corporation (URC) to sandblast, prime, and freshly paint Uganda’s existing steel commuter train carriages with the CivicDuty 3-Signal brand design—transforming daily trains into high-impact moving civic billboards across every level crossing.',
    stageTransportName: 'Bodaboda Stages & Old/New Taxi Park Cooperatives',
    stageLocations: '1.5M+ Bodaboda Riders & 14-Seater Kamunye Taxi Stages across Kampala, Wakiso, Mukono, Mbarara & Gulu',
    localSlogan: 'BODA MAN: GWE BOSS W’OLUGUUDO! · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'KCCA, UNRA & Ministry of Works and Transport',
    scoutTabLabel: 'Bodaboda',
    marketTabLabel: 'Owino Market',
    taxiTabLabel: 'Kamunye Taxis',
    taxiHeadlineLabel: 'Kamunye & Taxi Park Watchdogs',
    marketHeadlinePlaces: 'Nakasero, Owino, Kalerwe & city markets',
    ...REGION_ASSET_SETS.uganda,
  },
  KE: {
    countryCode: 'KE',
    countryName: 'Kenya',
    region: 'east_africa',
    ussdCode: '*3030*254#',
    busPartnerName: 'Super Metro, BasiGo / Roam Electric & Leading Matatu SACCOs',
    busFleetType: 'Organized 33–51 Seater Commuter Buses, Electric Transit & Nganya Matatus',
    busRoutes: 'Waiyaki Way, Thika Superhighway, Jogoo Road, Mombasa Road, Rongai & CBD Termini',
    busProposalSummary:
      'Advertisement Partnership Proposal: Upon partnership sign-off with Super Metro, BasiGo, and registered NTSA Matatu SACCOs, CivicDuty will fund and execute custom 3-Signal livery wraps across high-volume Nairobi and county commuter fleets.',
    trainOperatorName: 'Kenya Railways Corporation (KRC)',
    trainType: 'Nairobi Commuter Rail DMU Coaches, Metre-Gauge & Madaraka SGR Rolling Stock',
    trainCorridors: 'Nairobi Central–Syokimau, Embakasi Village, Ruiru, Kikuyu & Mombasa SGR Termini',
    trainProposalSummary:
      'Moving Billboard Refurbishment Proposal: CivicDuty proposes a commercial branding accord with Kenya Railways to wrap existing Nairobi Commuter Rail steel carriages and DMU coaches in the CivicDuty 3-Signal brand livery—creating a moving accountability billboard seen by 500,000+ daily commuters.',
    stageTransportName: 'Boda Boda Stages & Matatu Termini SACCOs',
    stageLocations: 'Nairobi CBD, Westlands, Eastleigh, Kisumu, Nakuru & Mombasa Boda & Matatu Stages',
    localSlogan: 'MWANANCHI & BODA RIDER: PAZA SAUTI YAKO! · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'Nairobi City County, KeNHA, KURA & NTSA',
    scoutTabLabel: 'Boda SACCO',
    marketTabLabel: 'Gikomba',
    taxiTabLabel: 'Matatu Crew',
    taxiHeadlineLabel: 'Matatu Crews & Tuk-Tuk Watchdogs',
    marketHeadlinePlaces: 'Gikomba, Wakulima, Kongowea & county markets',
    ...REGION_ASSET_SETS.east_africa,
  },
  NG: {
    countryCode: 'NG',
    countryName: 'Nigeria',
    region: 'west_africa',
    ussdCode: '*3030*234#',
    busPartnerName: 'LAMATA Lagos BRT, Cowry Fleet & Abuja Mass Transit',
    busFleetType: 'High-Capacity BRT Articulated Buses, Coaster Commuters & Organized Danfo Unions',
    busRoutes: 'Ikorodu–TBS, Oshodi–Abule Egba, Lekki–Epe Expressway & Abuja Berger–Airport Corridors',
    busProposalSummary:
      'Advertisement Partnership Proposal: Upon agreement with LAMATA and state mass transit operators, CivicDuty will fund and execute exterior 3-Signal livery branding of BRT and metropolitan commuter buses.',
    trainOperatorName: 'Nigerian Railway Corporation (NRC) & Lagos Rail Mass Transit',
    trainType: 'NRC Commuter Coaches, Lagos Blue/Red Line & Abuja–Kaduna Passenger Rolling Stock',
    trainCorridors: 'Iddo–Ijoko Commuter Line, Marina–Mile 2, Agege–Agbado & Lagos–Ibadan Corridor',
    trainProposalSummary:
      'Moving Billboard Refurbishment Proposal: CivicDuty is ready to partner with the Nigerian Railway Corporation (NRC) to brand commuter rail carriages in the official CivicDuty 3-Signal livery as moving civic billboards.',
    stageTransportName: 'Okada Stages, Keke NAPEP & Danfo Motor Parks',
    stageLocations: 'Oshodi, Ojota, Berger, Wuse, Kano & Port Harcourt Okada, Keke & Danfo Parks',
    localSlogan: 'OKADA, KEKE & DANFO: SPEAK UP FOR BETTER ROADS! · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'FERMA, LAMATA & State Transport Ministries',
    scoutTabLabel: 'Okada / Keke',
    marketTabLabel: 'Balogun / Mile 12',
    taxiTabLabel: 'Danfo Parks',
    taxiHeadlineLabel: 'Danfo & Keke NAPEP Highway Watchdogs',
    marketHeadlinePlaces: 'Balogun, Mile 12, Wuse & Ariaria markets',
    ...REGION_ASSET_SETS.west_africa,
  },
  SS: {
    countryCode: 'SS',
    countryName: 'South Sudan',
    region: 'east_africa',
    ussdCode: '*3030*211#',
    busPartnerName: 'Juba City Commuter Coaches & Public Transport Unions',
    busFleetType: 'Organized City Coaster Buses, Juba–Nimule Coaches & Commercial Taxis',
    busRoutes: 'Konyokonyo, Custom Market, Gudele, Munuki, Bilpam & Juba–Nimule Highway',
    busProposalSummary:
      'Advertisement Partnership Proposal: Upon agreement with Juba City Council and organized bus/taxi cooperatives, CivicDuty will fund and execute exterior branding in our official 3-Signal brand design.',
    trainOperatorName: 'South Sudan National Railway Corporation (SSNRC)',
    trainType: 'Wau Corridor Steel Locomotives & National Rail Carriages',
    trainCorridors: 'Wau Central Station, Aweil Corridor & Bahr el Ghazal Rail Line',
    trainProposalSummary:
      'Moving Billboard Refurbishment Proposal: CivicDuty is ready to partner with the Ministry of Transport & Roads to restore and paint existing railway carriages in the CivicDuty 3-Signal brand design.',
    stageTransportName: 'Motorbike Stages & Public Bus/Taxi Parks',
    stageLocations: 'Konyokonyo, Custom, Hai Referendum, Wau & Malakal Transport Stages',
    localSlogan: 'CITIZEN & RIDER: BUILD OUR NATION! · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'Juba City Council & Ministry of Roads and Bridges',
    scoutTabLabel: 'Moto Stages',
    marketTabLabel: 'Konyokonyo',
    taxiTabLabel: 'Coaster Taxis',
    taxiHeadlineLabel: 'Coaster & City Taxi Watchdogs',
    marketHeadlinePlaces: 'Konyokonyo, Custom & city markets',
    ...REGION_ASSET_SETS.east_africa,
  },
  TZ: {
    countryCode: 'TZ',
    countryName: 'Tanzania',
    region: 'east_africa',
    ussdCode: '*3030*255#',
    busPartnerName: 'UDART (Mwendokasi BRT) & Daladala Transit Cooperatives',
    busFleetType: 'Dar es Salaam BRT Buses & Organized Urban Daladala Fleets',
    busRoutes: 'Kimara–Kivukoni, Mbagala, Gerezani, Morocco & Dodoma City Routes',
    busProposalSummary:
      'Advertisement Partnership Proposal: Upon agreement with UDART and LATRA-registered bus operators, CivicDuty will fund and execute exterior branding of Mwendokasi and Daladala buses with our 3-Signal brand design.',
    trainOperatorName: 'Tanzania Railways Corporation (TRC) & TAZARA',
    trainType: 'Dar Commuter Rail (Treni ya Jiji) & SGR Passenger Coaches',
    trainCorridors: 'Kamata–Pugu, Ubungo–Stesheni & Dar–Morogoro–Dodoma Corridors',
    trainProposalSummary:
      'Moving Billboard Refurbishment Proposal: CivicDuty is ready to partner with TRC and TAZARA to brand commuter train carriages in the CivicDuty 3-Signal design.',
    stageTransportName: 'Bodaboda, Bajaji & Daladala Stages',
    stageLocations: 'Kariakoo, Ubungo, Mwenge, Arusha & Mwanza Bodaboda & Bajaji Stages',
    localSlogan: 'SAUTI YA MWANANCHI · HUDUMA BORA KWA WOTE · PIGA *3030*255#',
    municipalAuthority: 'TANROADS, TARURA & LATRA',
    scoutTabLabel: 'Boda & Bajaji',
    marketTabLabel: 'Kariakoo',
    taxiTabLabel: 'Daladala Crew',
    taxiHeadlineLabel: 'Daladala & Bajaji Corridor Watchdogs',
    marketHeadlinePlaces: 'Kariakoo, Buguruni & city markets',
    ...REGION_ASSET_SETS.east_africa,
  },
  RW: {
    countryCode: 'RW',
    countryName: 'Rwanda',
    region: 'rwanda',
    ussdCode: '*3030*250#',
    busPartnerName: 'Tap&Go (AC Group), Kigali Bus Service & Royal Express',
    busFleetType: 'Zero-Emission Electric City Buses & Coaster Commuter Coaches',
    busRoutes: 'Nyabugogo, Downtown Kigali, Remera, Kimironko, Kanombe & Musanze Corridors',
    busProposalSummary:
      'Advertisement Partnership Proposal: Upon agreement with Tap&Go and RURA transit operators, CivicDuty will fund and execute exterior wrapping of Kigali city buses in our 3-Signal brand design.',
    trainOperatorName: 'Rwanda Transport Development Agency (RTDA) Multimodal Corridors',
    trainType: 'Regional Standard Gauge Multimodal Coaches & BRT Rapid Transit',
    trainCorridors: 'Kigali Central Hub, Nyabugogo–Kacyiru & Regional Transit Terminals',
    trainProposalSummary:
      'Moving Billboard Proposal: CivicDuty partners with Rwandan transport authorities to brand rapid transit buses and hubs with the 3-Signal civic accountability design.',
    stageTransportName: 'Abamotari Cooperatives & Nyabugogo Bus Park',
    stageLocations: 'Kigali, Huye, Rubavu & Musanze Moto-Taxi Cooperatives & Bus Terminals',
    localSlogan: 'ABAMOTARI: UMUTURAGE KU ISONGA · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'City of Kigali, RTDA & RURA',
    scoutTabLabel: 'Abamotari',
    marketTabLabel: 'Kimironko',
    taxiTabLabel: 'Coasters',
    taxiHeadlineLabel: 'Kigali Coaster & Cabs Watchdogs',
    marketHeadlinePlaces: 'Kimironko, Nyabugogo & district markets',
    ...REGION_ASSET_SETS.rwanda,
  },
  GH: {
    countryCode: 'GH',
    countryName: 'Ghana',
    region: 'west_africa',
    ussdCode: '*3030*233#',
    busPartnerName: 'Aayalolo BRT, Metro Mass Transit & GPRTU Trotro Unions',
    busFleetType: 'Aayalolo Quality Bus System, Metro Mass Coaches & Organized Trotro Fleets',
    busRoutes: 'Amasaman–Tudu, Adenta–Accra Central, Kasoa & Kumasi Kejetia Corridors',
    busProposalSummary:
      'Advertisement Partnership Proposal: Upon agreement with Metro Mass Transit, Aayalolo, and GPRTU, CivicDuty will fund exterior branding of buses in our official 3-Signal design.',
    trainOperatorName: 'Ghana Railway Company Limited (GRCL)',
    trainType: 'Accra–Tema & Accra–Nsawam Commuter Train Carriages',
    trainCorridors: 'Accra Central, Achimota, Tema Harbour & Takoradi Rail Lines',
    trainProposalSummary:
      'Moving Billboard Refurbishment Proposal: CivicDuty is ready to partner with GRCL to brand commuter rail carriages in the CivicDuty 3-Signal livery.',
    stageTransportName: 'Okada, Pragya Tricycles & Trotro Lorry Stations',
    stageLocations: 'Kwame Nkrumah Circle, Kaneshie, Madina, Tema & Kejetia Lorry Parks',
    localSlogan: 'CITIZEN VOICE IN ACTION · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'AMA, Department of Urban Roads & Ministry of Roads and Highways',
    scoutTabLabel: 'Okada / Pragya',
    marketTabLabel: 'Makola Market',
    taxiTabLabel: 'Trotro Unions',
    taxiHeadlineLabel: 'Trotro & Pragya Corridor Watchdogs',
    marketHeadlinePlaces: 'Makola, Kaneshie & Kejetia markets',
    ...REGION_ASSET_SETS.west_africa,
  },
  ZA: {
    countryCode: 'ZA',
    countryName: 'South Africa',
    region: 'southern_africa',
    ussdCode: '*3030*27#',
    busPartnerName: 'Rea Vaya BRT, MyCiTi, Golden Arrow & SANTACO Taxi Associations',
    busFleetType: 'Articulated BRT Buses, Commuter Coaches & Minibus Taxis',
    busRoutes: 'Soweto–Johannesburg CBD, Sandton, Tshwane A Re Yeng & Cape Town Civic Centre',
    busProposalSummary:
      'Advertisement Partnership Proposal: Upon agreement with municipal BRT agencies and SANTACO, CivicDuty will fund full exterior fleet wraps in our 3-Signal brand design.',
    trainOperatorName: 'PRASA Metrorail & Gautrain',
    trainType: 'X’Trapolis Mega Commuter Trains & Gautrain Rolling Stock',
    trainCorridors: 'Johannesburg Park Station–Pretoria, Soweto, Cape Town Southern Line & Durban',
    trainProposalSummary:
      'Moving Billboard Refurbishment Proposal: CivicDuty proposes partnering with PRASA Metrorail to wrap commuter carriages in the CivicDuty 3-Signal brand livery.',
    stageTransportName: 'Minibus Taxi Ranks & Delivery Rider Hubs',
    stageLocations: 'Bree Street, Noord Street, Baragwanath, Bellville & Umlazi Taxi Ranks',
    localSlogan: 'BATHO PELE · PEOPLE FIRST · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'SANRAL, Municipal Roads & Department of Transport',
    scoutTabLabel: 'Delivery Riders',
    marketTabLabel: 'Fresh Markets',
    taxiTabLabel: 'Minibus Taxis',
    taxiHeadlineLabel: 'Minibus Taxi & Commuter Watchdogs',
    marketHeadlinePlaces: 'municipal markets, plazas & trading bays',
    ...REGION_ASSET_SETS.southern_africa,
  },
  GB: {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    region: 'europe',
    ussdCode: 'SMS 83030',
    busPartnerName: 'Transport for London (TfL), Stagecoach, Arriva & FirstBus',
    busFleetType: 'Zero-Emission Double-Decker & Single-Deck Metropolitan Transit Buses',
    busRoutes: 'Oxford Street, Piccadilly Circus, Kings Cross, Manchester Piccadilly & Birmingham City Centre',
    busProposalSummary:
      'Advertisement Partnership Proposal: With TfL and regional transport executives, CivicDuty funds official 3-Signal exterior livery wraps across high-visibility urban double-decker bus routes.',
    trainOperatorName: 'Network Rail & London Overground / Elizabeth Line',
    trainType: 'British Rail Commuter EMUs, Class 345 & Regional Rolling Stock',
    trainCorridors: 'London Waterloo, Victoria, Paddington, Birmingham New Street & Edinburgh Waverley',
    trainProposalSummary:
      'Moving Billboard Proposal: CivicDuty proposes partnering with rail operators to display the official 3-Signal civic accountability campaign on commuter rail carriages and concourse screens.',
    stageTransportName: 'Cargo-Bike Couriers, Black Cabs & High-Street Ranks',
    stageLocations: 'King’s Cross, Soho, Manchester Arndale, Victoria Station & Birmingham New Street Hubs',
    localSlogan: 'CITIZEN SCRUTINY & PUBLIC VALUE · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'Department for Transport (DfT), National Highways & Transport for London',
    scoutTabLabel: 'Cycle Couriers',
    marketTabLabel: 'Borough & High St',
    taxiTabLabel: 'Black Cabs',
    taxiHeadlineLabel: 'Licensed Cabs & Private Hire Watchdogs',
    marketHeadlinePlaces: 'Borough Market, indoor food halls & high streets',
    ...REGION_ASSET_SETS.europe,
  },
  FR: {
    countryCode: 'FR',
    countryName: 'France',
    region: 'europe',
    ussdCode: 'SMS 3030',
    busPartnerName: 'RATP (Réseau de Bus Parisien), TCL Lyon & Keolis Métropole',
    busFleetType: 'Bus Articulés 100% Électriques & Flottes de Transport Urbain',
    busRoutes: 'Boulevard Saint-Germain, Champs-Élysées, Lyon Part-Dieu & Marseille Vieux-Port',
    busProposalSummary:
      'Proposition de Partenariat Affichage: En accord avec les autorités organisatrices de la mobilité, CivicDuty réalisera le pelliculage 3-Signal des bus urbains pour promouvoir la transparence du service public.',
    trainOperatorName: 'SNCF Voyageurs & Transilien / RER',
    trainType: 'Rames RER B/D, Transilien Ligne N & TER Régionaux',
    trainCorridors: 'Paris Gare du Nord–Châtelet, Gare de Lyon & Corridors Métropolitains',
    trainProposalSummary:
      'Projet Panneau Mobile Ferroviaire: CivicDuty propose une livrée citoyenne sur les rames Transilien et RER et écrans de quai.',
    stageTransportName: 'Stations de Taxis Urbains & Coursiers à Vélo',
    stageLocations: 'Gare Montparnasse, Châtelet-Les Halles, République & Place Bellecour',
    localSlogan: 'LA VOIX DU CITOYEN · SERVICE PUBLIC · PARLEZ. AGISSEZ.',
    municipalAuthority: 'Île-de-France Mobilités, SNCF Réseau & Collectivités Locales',
    scoutTabLabel: 'Coursiers Vélo',
    marketTabLabel: 'Marchés & Halles',
    taxiTabLabel: 'Taxis Urbains',
    taxiHeadlineLabel: 'Taxis Parisiens & Chauffeurs VTC',
    marketHeadlinePlaces: 'marchés couverts, halles et commerces de proximité',
    ...REGION_ASSET_SETS.europe,
  },
  DE: {
    countryCode: 'DE',
    countryName: 'Germany',
    region: 'europe',
    ussdCode: 'SMS 3030',
    busPartnerName: 'BVG Berlin, MVG München, Hochbahn Hamburg & Rheinbahn Düsseldorf',
    busFleetType: 'Elektrische Gelenkbusse & Urbane Niederflur-Linienbusse',
    busRoutes: 'Alexanderplatz, Kurfürstendamm, München Marienplatz & Hamburg Jungfernstieg',
    busProposalSummary:
      'Werbepartnerschafts-Initiative: In Zusammenarbeit mit Verkehrsverbünden realisiert CivicDuty moderne 3-Signal Folierungen auf Linienbussen.',
    trainOperatorName: 'Deutsche Bahn (S-Bahn & Regional-Express)',
    trainType: 'S-Bahn Elektrotriebzüge & Doppelstock Regional-Express',
    trainCorridors: 'Berliner Stadtbahn, Stammstrecke München & Rhein-Ruhr Express',
    trainProposalSummary:
      'Fahrbare Bürger-Infowand: CivicDuty kooperiert mit Nahverkehrsbetrieben zur Darstellung des 3-Signal Bürgerdialogs an Bahnhöfen und auf Pendlerzügen.',
    stageTransportName: 'Taxistände & Fahrradkurier-Logistikhubs',
    stageLocations: 'Berlin Hauptbahnhof, Alexanderplatz, München Hbf & Frankfurt Hauptwache',
    localSlogan: 'BÜRGERSTIMME ZÄHLT · TRANSPARENZ & SERVICE · SPRECHEN. WIRKEN.',
    municipalAuthority: 'BMDV, Landesverkehrsgesellschaften & Kommunale Ordnungsämter',
    scoutTabLabel: 'Radkuriere',
    marketTabLabel: 'Wochenmärkte',
    taxiTabLabel: 'Taxistände',
    taxiHeadlineLabel: 'Taxi- & Kurier-Mobilitätsscouts',
    marketHeadlinePlaces: 'Wochenmärkte, Markthallen & Stadtzentren',
    ...REGION_ASSET_SETS.europe,
  },
  ES: {
    countryCode: 'ES',
    countryName: 'Spain',
    region: 'europe',
    ussdCode: 'SMS 3030',
    busPartnerName: 'EMT Madrid, TMB Barcelona & Alsa Urbano',
    busFleetType: 'Autobuses Eléctricos Urbanos y Flotas Metropolitanas',
    busRoutes: 'Paseo de la Castellana, Gran Vía Madrid & Diagonal Barcelona',
    busProposalSummary:
      'Acuerdo de Movilidad Cívica: Campañas exteriores en autobuses urbanos mostrando las 3 Señales de CivicDuty.',
    trainOperatorName: 'Renfe Cercanías & Rodalies',
    trainType: 'Trenes Eléctricos de Cercanías y Media Distancia',
    trainCorridors: 'Madrid Atocha–Sol, Barcelona Sants & Valencia Nord',
    trainProposalSummary:
      'Paneles digitales en estaciones de Cercanías conectando a los viajeros con la gestión municipal.',
    stageTransportName: 'Paradas de Taxi y Repartidores en Bicicleta',
    stageLocations: 'Madrid Sol, Barcelona Plaça Catalunya, Sevilla & Bilbao',
    localSlogan: 'TU VOZ EN TU CIUDAD · HABLA. SIRVE. SÉ ESCUCHADO.',
    municipalAuthority: 'Ayuntamientos, Consorcios de Transporte y Ministerio de Transportes',
    scoutTabLabel: 'Repartidores',
    marketTabLabel: 'Mercados Municipales',
    taxiTabLabel: 'Taxis Urbanos',
    taxiHeadlineLabel: 'Taxistas y Repartidores de Barrio',
    marketHeadlinePlaces: 'mercados municipales y plazas de abastos',
    ...REGION_ASSET_SETS.europe,
  },
  IT: {
    countryCode: 'IT',
    countryName: 'Italy',
    region: 'europe',
    ussdCode: 'SMS 3030',
    busPartnerName: 'ATM Milano, ATAC Roma & GTT Torino',
    busFleetType: 'Autobus Elettrici Urbani e Tram Cittadini',
    busRoutes: 'Milano Duomo, Roma Termini, Torino Porta Nuova & Napoli Centrale',
    busProposalSummary:
      'Iniziativa di Trasparenza Urbana: Livree istituzionali a 3 Segnali su autobus e pensiline di attesa.',
    trainOperatorName: 'Trenitalia Regionale & Trenord',
    trainType: 'Treni Pendolari Rock / Pop e Collegamenti Metropolitani',
    trainCorridors: 'Milano Centrale, Roma Termini, Bologna & Firenze',
    trainProposalSummary:
      'Pannelli digitali nelle stazioni ferroviarie per segnalazioni civiche rapide.',
    stageTransportName: 'Posteggi Taxi & Corrieri E-Bike',
    stageLocations: 'Milano, Roma, Torino, Bologna & Firenze',
    localSlogan: 'LA VOCE DEI CITTADINI · PARLA. SERVI. FATTI SENTIRE.',
    municipalAuthority: 'Comuni, Assessorati alla Mobilità e Ministeri Competenti',
    scoutTabLabel: 'Corrieri E-Bike',
    marketTabLabel: 'Mercati Rionali',
    taxiTabLabel: 'Taxi Cittadini',
    taxiHeadlineLabel: 'Tassisti e Corrieri Urbani',
    marketHeadlinePlaces: 'mercati rionali, piazze e botteghe',
    ...REGION_ASSET_SETS.europe,
  },
  US: {
    countryCode: 'US',
    countryName: 'United States',
    region: 'americas',
    ussdCode: 'SMS 30300',
    busPartnerName: 'Metropolitan Transit Agencies (MTA NYC, CTA Chicago, LA Metro)',
    busFleetType: 'Low-Floor Zero-Emission Electric & Clean Hybrid City Transit Buses',
    busRoutes: 'Manhattan 42nd St, Chicago Loop, Austin Congress Ave & Los Angeles Wilshire Blvd',
    busProposalSummary:
      'Advertisement Partnership Proposal: Under partnership agreements with municipal transit authorities, CivicDuty funds full-wrap exterior transit and shelter campaigns showcasing the 3-Signal civic accountability model.',
    trainOperatorName: 'Amtrak & Regional Commuter Rail (LIRR, Metra, Caltrain, BART)',
    trainType: 'Northeast Regional Coaches, Metra Bi-Level & Commuter EMU Rolling Stock',
    trainCorridors: 'Northeast Corridor, Penn Station–Grand Central, Chicago Union Station & Bay Area',
    trainProposalSummary:
      'Moving Billboard Proposal: CivicDuty partners with regional rail and metro authorities to display 3-Signal civic oversight campaigns across commuter rail concourses.',
    stageTransportName: 'E-Bike Delivery Couriers, Yellow Cabs & Rideshare Zones',
    stageLocations: 'Midtown Manhattan, Downtown Chicago, San Francisco Market St & Austin Transit Hubs',
    localSlogan: 'COMMUNITY INTEGRITY & PUBLIC TRUST · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'Municipal 311 Desks, State DOTs & City Public Works',
    scoutTabLabel: 'E-Bike Couriers',
    marketTabLabel: 'City Markets',
    taxiTabLabel: 'Cabs & Rideshare',
    taxiHeadlineLabel: 'Yellow Cabs, Rideshare & Delivery Fleets',
    marketHeadlinePlaces: 'public market halls, farmers markets & retail corridors',
    ...REGION_ASSET_SETS.americas,
  },
  CA: {
    countryCode: 'CA',
    countryName: 'Canada',
    region: 'americas',
    ussdCode: 'SMS 30300',
    busPartnerName: 'TTC Toronto, STM Montréal & TransLink Vancouver',
    busFleetType: 'Electric & Hybrid Articulated City Transit Buses',
    busRoutes: 'Yonge Street Toronto, Rue Sainte-Catherine Montréal & Broadway Vancouver',
    busProposalSummary:
      'Transit Shelter & Bus Exterior Initiative: High-visibility CivicDuty 3-Signal displays along metropolitan commuter arteries.',
    trainOperatorName: 'GO Transit, EXO Montréal & SkyTrain / VIA Rail',
    trainType: 'Bi-Level Commuter Trains & Automated Rapid Transit',
    trainCorridors: 'Toronto Union Station, Montréal Gare Centrale & Vancouver Waterfront',
    trainProposalSummary:
      'Commuter Platform Digital Signage linking riders to municipal 311 and civic service tracking.',
    stageTransportName: 'Cycle Couriers, Licensed Cabs & Rideshare Pickups',
    stageLocations: 'Toronto Downtown, Montréal Plateau, Vancouver CBD & Calgary',
    localSlogan: 'TRANSPARENT CITIES ACROSS CANADA · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'Municipal 311 Services & Provincial Transport Ministries',
    scoutTabLabel: 'Bike Couriers',
    marketTabLabel: 'Public Markets',
    taxiTabLabel: 'Cabs & Rideshare',
    taxiHeadlineLabel: 'Licensed Taxis, Rideshare & Couriers',
    marketHeadlinePlaces: 'St. Lawrence, Jean-Talon, Granville & community markets',
    ...REGION_ASSET_SETS.americas,
  },
  BR: {
    countryCode: 'BR',
    countryName: 'Brazil',
    region: 'americas',
    ussdCode: 'SMS 30300',
    busPartnerName: 'SPTrans São Paulo, Rio Ônibus & Curitiba BRT',
    busFleetType: 'Ônibus Articulados BRT e Elétricos Urbanos',
    busRoutes: 'Av. Paulista, Corredor TransOeste Rio & Eixo Sul Curitiba',
    busProposalSummary:
      'Campanha de Mobilidade Cívica: Adesivagem externa com os 3 Sinais CivicDuty em corredores de BRT e pontos de ônibus.',
    trainOperatorName: 'CPTM São Paulo, MetrôRio & Trensurb',
    trainType: 'Trens Metropolitanos e VLT Urbano',
    trainCorridors: 'Estação da Luz, Central do Brasil & Corredores Metropolitanos',
    trainProposalSummary:
      'Painéis digitais em estações ferroviárias conectando cidadãos às prefeituras e concessionárias.',
    stageTransportName: 'Motoboys Entregadores, Táxis & Aplicativos',
    stageLocations: 'São Paulo, Rio de Janeiro, Belo Horizonte, Recife & Porto Alegre',
    localSlogan: 'VOZ DO CIDADÃO NAS RUAS · FALE. SIRVA. SEJA OUVIDO.',
    municipalAuthority: 'Prefeituras Municipais, Secretarias de Transporte e Obras',
    scoutTabLabel: 'Motoboys / Bikes',
    marketTabLabel: 'Mercadões',
    taxiTabLabel: 'Táxis & Apps',
    taxiHeadlineLabel: 'Taxistas, Motoristas de App & Motoboys',
    marketHeadlinePlaces: 'mercados municipais e feiras livres',
    ...REGION_ASSET_SETS.americas,
  },
  IN: {
    countryCode: 'IN',
    countryName: 'India',
    region: 'south_asia',
    ussdCode: '*3030*91#',
    busPartnerName: 'DTC Delhi, BEST Mumbai, BMTC Bengaluru & State RTCs',
    busFleetType: 'Electric Low-Floor City Commuter Buses & CNG Articulated Transit Fleets',
    busRoutes: 'Connaught Place Delhi, Marine Drive Mumbai, MG Road Bengaluru & Anna Salai Chennai',
    busProposalSummary:
      'Advertisement Partnership Proposal: In cooperation with state transport undertakings, CivicDuty sponsors exterior livery branding in our official 3-Signal civic accountability design.',
    trainOperatorName: 'Indian Railways (Suburban Local Networks & Metro Rail)',
    trainType: 'Mumbai Suburban Local EMUs, Metro Rail Coaches & Regional Commuter Stock',
    trainCorridors: 'CSMT–Thane, Churchgate–Virar, Howrah, Delhi Metro & Bengaluru Namma Metro',
    trainProposalSummary:
      'Moving Billboard Proposal: CivicDuty proposes partnering with urban rail and metro authorities to display 3-Signal citizen oversight branding across suburban concourses.',
    stageTransportName: 'Auto-Rickshaw Stands, Delivery Scooters & Taxi Unions',
    stageLocations: 'Metro Feeder Hubs, Railway Auto Ranks & Urban Bazaar Ranks across Delhi, Mumbai & Bengaluru',
    localSlogan: 'JANTA KI AWAAZ · CITIZEN VOICE · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'MoRTH, Municipal Corporations & Smart City Missions',
    scoutTabLabel: 'Delivery Scooters',
    marketTabLabel: 'Local Bazaars',
    taxiTabLabel: 'Auto & Cabs',
    taxiHeadlineLabel: 'Auto-Rickshaws, Yellow Cabs & Delivery Riders',
    marketHeadlinePlaces: 'local bazaars, mandis & commercial markets',
    ...REGION_ASSET_SETS.south_asia,
  },
  JP: {
    countryCode: 'JP',
    countryName: 'Japan',
    region: 'east_se_asia',
    ussdCode: 'WEB/3030',
    busPartnerName: 'Toei Bus (東京都交通局), Osaka City Bus & Yokohama Municipal Bus',
    busFleetType: 'Fuel Cell Transit Buses (SORA) & Non-Step Urban Route Buses',
    busRoutes: 'Shinjuku Station, Shibuya Crossing, Tokyo Marunouchi & Umeda Osaka',
    busProposalSummary:
      'Metropolitan Transit Branding: Clean horizontal 3-Signal CivicDuty visual messaging on municipal buses and street information kiosks.',
    trainOperatorName: 'JR Commuter Lines & Tokyo / Osaka Metro',
    trainType: 'Urban Commuter EMU Rolling Stock & Platform Signage',
    trainCorridors: 'Yamanote Line, Chuo-Sobu Line & Osaka Loop Corridors',
    trainProposalSummary:
      'Commuter Concourse Accountability Displays linking rail riders and local merchants with municipal ward offices.',
    stageTransportName: 'E-Bike Delivery Couriers & Licensed City Taxi Stands',
    stageLocations: 'Shinjuku West Exit, Shibuya, Akihabara & Namba Station Ranks',
    localSlogan: '市民の声がまちを動かす · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'MLIT & Municipal Ward Administration Desks',
    scoutTabLabel: 'Cycle Couriers',
    marketTabLabel: 'Shotengai Markets',
    taxiTabLabel: 'City Taxis',
    taxiHeadlineLabel: 'City Taxis & Delivery Rider Watchdogs',
    marketHeadlinePlaces: 'Shotengai shopping arcades & local fresh markets',
    ...REGION_ASSET_SETS.east_se_asia,
  },
  KR: {
    countryCode: 'KR',
    countryName: 'South Korea',
    region: 'east_se_asia',
    ussdCode: 'WEB/3030',
    busPartnerName: 'Seoul Blue/Green Bus Network & Busan Metropolitan Transit',
    busFleetType: 'Electric Low-Floor City Buses & Hydrogen Transit Coaches',
    busRoutes: 'Gangnam-daero, Gwanghwamun, Hongdae & Haeundae Corridors',
    busProposalSummary:
      'Smart Transit Shelter Signage: Clean 3-Signal CivicDuty displays integrated at urban bus shelters and transfer stations.',
    trainOperatorName: 'KORAIL Metropolitan Subway & Seoul Metro',
    trainType: 'High-Frequency Urban Subway & Commuter EMUs',
    trainCorridors: 'Seoul Line 2 Loop, Bundang Line & Busan Metro',
    trainProposalSummary:
      'Digital concourse signage empowering riders to verify municipal road and station repairs.',
    stageTransportName: 'Delivery Motorbike Couriers & Taxi Ranks',
    stageLocations: 'Seoul Station, Gangnam, Myeongdong & Busan Seomyeon',
    localSlogan: '시민과 함께하는 공공혁신 · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'Seoul Metropolitan Government (120 Dasan) & MOLIT',
    scoutTabLabel: 'Delivery Riders',
    marketTabLabel: 'Traditional Markets',
    taxiTabLabel: 'City Taxis',
    taxiHeadlineLabel: 'Licensed Taxis & Delivery Riders',
    marketHeadlinePlaces: 'Gwangjang, Namdaemun & local community markets',
    ...REGION_ASSET_SETS.east_se_asia,
  },
  SG: {
    countryCode: 'SG',
    countryName: 'Singapore',
    region: 'east_se_asia',
    ussdCode: 'WEB/3030',
    busPartnerName: 'SBS Transit, SMRT Buses & Tower Transit',
    busFleetType: 'Electric Single & Double-Deck Public Buses',
    busRoutes: 'Orchard Road, Marina Bay, Tampines & Jurong East Interchanges',
    busProposalSummary:
      'Municipal Civic Feedback Campaign: Clean 3-Signal digital displays across bus interchanges and shelters.',
    trainOperatorName: 'SMRT & SBS MRT Networks',
    trainType: 'Automated Mass Rapid Transit Trains',
    trainCorridors: 'North-South, East-West, Circle & Downtown MRT Corridors',
    trainProposalSummary:
      'MRT station concourse screens encouraging timely municipal defect reporting.',
    stageTransportName: 'Delivery Riders, PHVs & Comfort/Strides Taxi Stands',
    stageLocations: 'Raffles Place, Orchard, Bugis, Jurong & Tampines Hubs',
    localSlogan: 'CIVIC ACTION IN EVERY PRECINCT · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'Municipal Services Office (OneService) & Land Transport Authority',
    scoutTabLabel: 'Delivery Riders',
    marketTabLabel: 'Hawker & Markets',
    taxiTabLabel: 'Taxis & PHV',
    taxiHeadlineLabel: 'Taxi Stands, PHV Drivers & Couriers',
    marketHeadlinePlaces: 'hawker centres, wet markets & town plazas',
    ...REGION_ASSET_SETS.east_se_asia,
  },
  AE: {
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    region: 'mena',
    ussdCode: 'SMS 3030',
    busPartnerName: 'RTA Dubai Bus & Integrated Transport Centre Abu Dhabi',
    busFleetType: 'Air-Conditioned Electric & Hydrogen Metropolitan Coaches',
    busRoutes: 'Sheikh Zayed Road, Downtown Dubai, Corniche Abu Dhabi & Al Majaz',
    busProposalSummary:
      'Smart City Digital Kiosk Campaign: Architectural 3-Signal civic feedback screens at climate-controlled bus shelters.',
    trainOperatorName: 'Dubai Metro & Etihad Rail',
    trainType: 'Automated Driverless Metro & National Passenger Rail',
    trainCorridors: 'Dubai Red/Green Metro Lines & Abu Dhabi–Dubai Corridors',
    trainProposalSummary:
      'Digital concourse signage enabling commuters to verify neighborhood service SLAs.',
    stageTransportName: 'Licensed Taxi Ranks & Delivery Rider Fleets',
    stageLocations: 'Business Bay, Deira, Abu Dhabi Marina & Sharjah Central',
    localSlogan: 'SMART CITY CIVIC EXCELLENCE · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'Dubai Municipality, RTA & Department of Municipalities and Transport',
    scoutTabLabel: 'Delivery Riders',
    marketTabLabel: 'Souks & Plazas',
    taxiTabLabel: 'City Taxis',
    taxiHeadlineLabel: 'Licensed City Taxis & Delivery Fleets',
    marketHeadlinePlaces: 'community souks, malls & neighborhood centers',
    ...REGION_ASSET_SETS.mena,
  },
  AU: {
    countryCode: 'AU',
    countryName: 'Australia',
    region: 'oceania',
    ussdCode: 'SMS 30300',
    busPartnerName: 'Transport for NSW, PTV Melbourne & Translink Queensland',
    busFleetType: 'Zero-Emission Electric Urban Buses & Light Rail',
    busRoutes: 'Sydney George St, Melbourne CBD, Brisbane Cultural Centre & Perth St Georges Terrace',
    busProposalSummary:
      'Urban Civic Signage Initiative: Clean 3-Signal accountability displays on bus shelters and electric transit.',
    trainOperatorName: 'Sydney Trains, Metro Trains Melbourne & Queensland Rail',
    trainType: 'Suburban Double-Deck & Metropolitan EMUs',
    trainCorridors: 'Central–Parramatta, Flinders Street Loop & Brisbane Central',
    trainProposalSummary:
      'Station concourse displays enabling commuters to report council infrastructure defects in 30 seconds.',
    stageTransportName: 'E-Bike Delivery Couriers, Taxis & Rideshare Hubs',
    stageLocations: 'Sydney Circular Quay, Melbourne CBD, Brisbane South Bank & Adelaide',
    localSlogan: 'LOCAL COUNCIL ACCOUNTABILITY · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'Local City Councils & State Departments of Transport',
    scoutTabLabel: 'Cycle Couriers',
    marketTabLabel: 'Produce Markets',
    taxiTabLabel: 'Cabs & Rideshare',
    taxiHeadlineLabel: 'City Taxis, Rideshare & Couriers',
    marketHeadlinePlaces: 'Queen Victoria, Adelaide Central & local markets',
    ...REGION_ASSET_SETS.oceania,
  },
};

function getRegionDefaults(region: CampaignRegion, countryName: string, countryCode: CountryCode) {
  const assets = REGION_ASSET_SETS[region];
  switch (region) {
    case 'europe':
      return {
        ussdCode: 'SMS 3030',
        busPartnerName: `${countryName} Metropolitan Bus & Tram Authorities`,
        busFleetType: `Electric & Low-Floor Municipal Buses and City Trams`,
        busRoutes: `Central Squares, Rail Termini & Metropolitan High Streets in ${countryName}`,
        trainOperatorName: `${countryName} National & Suburban Rail`,
        trainType: `Regional EMUs, S-Bahn/Metro & Intercity Passenger Coaches`,
        trainCorridors: `Central Station & Suburban Commuter Corridors`,
        stageTransportName: `Cycle Delivery Couriers, Licensed City Taxis & Transit Plazas`,
        stageLocations: `Major Rail Plazas, Taxi Ranks & Market Squares across ${countryName}`,
        localSlogan: `${countryName.toUpperCase()} CITIZEN VOICE · SPEAK. SERVE. BE HEARD.`,
        municipalAuthority: `${countryName} Municipal Councils & Ministry of Transport`,
        scoutTabLabel: 'Cycle Couriers',
        marketTabLabel: 'City Markets',
        taxiTabLabel: 'Licensed Taxis',
        taxiHeadlineLabel: 'Licensed City Taxis & Mobility Scouts',
        marketHeadlinePlaces: `covered markets, plazas & town centers across ${countryName}`,
        ...assets,
      };
    case 'americas':
      return {
        ussdCode: 'SMS 30300',
        busPartnerName: `${countryName} Municipal Bus & BRT Operators`,
        busFleetType: `Clean Electric & Articulated City Transit Buses`,
        busRoutes: `Downtown Avenues, BRT Corridors & Transit Terminals in ${countryName}`,
        trainOperatorName: `${countryName} Commuter Rail & Metro`,
        trainType: `Urban Metro & Commuter Passenger Trains`,
        trainCorridors: `Central Station & Metropolitan Transit Corridors`,
        stageTransportName: `E-Bike Couriers, Rideshare Zones & City Taxi Stands`,
        stageLocations: `Downtown Transit Shelters, Taxi Stands & Courier Hubs across ${countryName}`,
        localSlogan: `${countryName.toUpperCase()} COMMUNITY TRUST · SPEAK. SERVE. BE HEARD.`,
        municipalAuthority: `${countryName} Municipal Public Works & Transit Boards`,
        scoutTabLabel: 'E-Bike Couriers',
        marketTabLabel: 'City Markets',
        taxiTabLabel: 'Taxis & Rideshare',
        taxiHeadlineLabel: 'Taxis, Rideshare & Courier Fleets',
        marketHeadlinePlaces: `municipal markets, food halls & neighborhood corridors in ${countryName}`,
        ...assets,
      };
    case 'south_asia':
      return {
        ussdCode: `*3030#`,
        busPartnerName: `${countryName} City & State Road Transport Buses`,
        busFleetType: `Urban CNG & Electric City Commuter Buses`,
        busRoutes: `Central Markets, Railway Termini & Highway Corridors in ${countryName}`,
        trainOperatorName: `${countryName} National & Metro Railways`,
        trainType: `Suburban EMUs & Urban Metro Rolling Stock`,
        trainCorridors: `Central Terminus & Suburban Commuter Corridors`,
        stageTransportName: `Delivery Scooters, Auto-Rickshaw Stands & City Taxis`,
        stageLocations: `Railway Auto Stands, Metro Feeders & Urban Bazaars across ${countryName}`,
        localSlogan: `${countryName.toUpperCase()} CITIZEN VOICE · SPEAK. SERVE. BE HEARD.`,
        municipalAuthority: `${countryName} Municipal Corporations & Transport Authorities`,
        scoutTabLabel: 'Scooter / Auto',
        marketTabLabel: 'Local Bazaars',
        taxiTabLabel: 'Rickshaw & Cabs',
        taxiHeadlineLabel: 'Auto-Rickshaws, City Taxis & Delivery Riders',
        marketHeadlinePlaces: `bazaars, wholesale markets & town squares across ${countryName}`,
        ...assets,
      };
    case 'east_se_asia':
      return {
        ussdCode: `WEB/3030`,
        busPartnerName: `${countryName} Municipal Bus & BRT Networks`,
        busFleetType: `Electric Non-Step City Buses & Rapid Transit`,
        busRoutes: `Metro Interchanges, Commercial Boulevards & Stations in ${countryName}`,
        trainOperatorName: `${countryName} Metro & Commuter Rail`,
        trainType: `Automated Metro & High-Frequency Commuter Rail`,
        trainCorridors: `Main Station Interchanges & Urban Rail Corridors`,
        stageTransportName: `E-Bike & Scooter Couriers, Licensed City Taxis & Transit Hubs`,
        stageLocations: `Subway Exits, Taxi Ranks & Commercial Plazas across ${countryName}`,
        localSlogan: `${countryName.toUpperCase()} SMART CIVIC ACTION · SPEAK. SERVE. BE HEARD.`,
        municipalAuthority: `${countryName} Municipal Government & Transit Bureaus`,
        scoutTabLabel: 'Delivery Riders',
        marketTabLabel: 'Urban Markets',
        taxiTabLabel: 'City Taxis',
        taxiHeadlineLabel: 'City Taxis & Delivery Rider Watchdogs',
        marketHeadlinePlaces: `street markets, arcades & neighborhood hubs in ${countryName}`,
        ...assets,
      };
    case 'mena':
      return {
        ussdCode: `SMS 3030`,
        busPartnerName: `${countryName} Public Bus & Smart Transit Authority`,
        busFleetType: `Modern Climate-Controlled City Coaches`,
        busRoutes: `Central Boulevards, Business Districts & Corniche Routes in ${countryName}`,
        trainOperatorName: `${countryName} Metro & National Rail`,
        trainType: `Modern Metro & High-Speed Regional Rail`,
        trainCorridors: `Central Transit Hubs & Urban Rail Lines`,
        stageTransportName: `Licensed City Taxis, Delivery Riders & Transit Stations`,
        stageLocations: `Metro Stations, Commercial Plazas & Taxi Ranks across ${countryName}`,
        localSlogan: `${countryName.toUpperCase()} CIVIC EXCELLENCE · SPEAK. SERVE. BE HEARD.`,
        municipalAuthority: `${countryName} Municipalities & Transport Regulators`,
        scoutTabLabel: 'Delivery Riders',
        marketTabLabel: 'Souks & Plazas',
        taxiTabLabel: 'City Taxis',
        taxiHeadlineLabel: 'Licensed Taxis & Urban Delivery Watchdogs',
        marketHeadlinePlaces: `public markets, souks & district centers in ${countryName}`,
        ...assets,
      };
    case 'oceania':
      return {
        ussdCode: `SMS 30300`,
        busPartnerName: `${countryName} Metropolitan Public Buses`,
        busFleetType: `Electric & Low-Floor City Buses`,
        busRoutes: `CBD Termini & Suburban Transit Corridors in ${countryName}`,
        trainOperatorName: `${countryName} Suburban Rail Networks`,
        trainType: `Metropolitan Commuter EMUs`,
        trainCorridors: `Central Station & Suburban Lines`,
        stageTransportName: `Cycle Couriers, Cabs & Rideshare Ranks`,
        stageLocations: `CBD Ranks, Ferry/Rail Interchanges & Markets across ${countryName}`,
        localSlogan: `${countryName.toUpperCase()} COUNCIL ACCOUNTABILITY · SPEAK. SERVE. BE HEARD.`,
        municipalAuthority: `${countryName} City Councils & Transport Departments`,
        scoutTabLabel: 'Cycle Couriers',
        marketTabLabel: 'Fresh Markets',
        taxiTabLabel: 'Cabs & Rideshare',
        taxiHeadlineLabel: 'Licensed Taxis, Rideshare & Couriers',
        marketHeadlinePlaces: `produce markets, malls & council precincts in ${countryName}`,
        ...assets,
      };
    case 'west_africa':
      return {
        ussdCode: `*3030#`,
        busPartnerName: `${countryName} Mass Transit & Urban Bus Cooperatives`,
        busFleetType: `BRT Coaches & Organized Commercial Minibuses`,
        busRoutes: `Central Terminals, Highways & Market Corridors in ${countryName}`,
        trainOperatorName: `${countryName} National Railway Authority`,
        trainType: `Commuter Passenger Coaches & Locomotives`,
        trainCorridors: `Central Rail Termini & Suburban Corridors`,
        stageTransportName: `Okada / Moto Riders, Tricycle Parks & Minibus Stations`,
        stageLocations: `Major Motor Parks, Tricycle Junctions & City Markets across ${countryName}`,
        localSlogan: `${countryName.toUpperCase()} FRONTLINE SCOUTS · SPEAK. SERVE. BE HEARD.`,
        municipalAuthority: `${countryName} Municipal Assemblies & Ministry of Roads`,
        scoutTabLabel: 'Okada / Moto',
        marketTabLabel: 'Urban Markets',
        taxiTabLabel: 'Motor Parks',
        taxiHeadlineLabel: 'Commercial Bus, Tricycle & Taxi Drivers',
        marketHeadlinePlaces: `urban trading markets & lorry parks across ${countryName}`,
        ...assets,
      };
    case 'east_africa':
    case 'southern_africa':
    case 'north_africa':
    default:
      return {
        ussdCode: `*3030#`,
        busPartnerName: `${countryName} Metropolitan Bus Transit & Public Operators`,
        busFleetType: `City Transit Buses & Organized Commuter Coaches in ${countryName}`,
        busRoutes: `Central Business District & Regional Highway Termini in ${countryName}`,
        trainOperatorName: `${countryName} National Railways & Suburban Rail`,
        trainType: `Commuter Passenger Carriages & Locomotives`,
        trainCorridors: `Central Railway Station & High-Traffic Crossings`,
        stageTransportName: `Commercial Rider Ranks, Taxi Terminals & Courier Hubs`,
        stageLocations: `Major Commuter Termini & Urban Transit Shelters across ${countryName}`,
        localSlogan: `${countryName.toUpperCase()} CITIZEN VOICE · SPEAK. SERVE. BE HEARD.`,
        municipalAuthority: `${countryName} Ministry of Works, Transport & Municipal Authorities`,
        scoutTabLabel: region === 'north_africa' ? 'Delivery Riders' : 'Rider Stages',
        marketTabLabel: 'City Markets',
        taxiTabLabel: region === 'north_africa' ? 'City Taxis' : 'Commuter Taxis',
        taxiHeadlineLabel: 'Commercial Taxi & Transit Corridor Watchdogs',
        marketHeadlinePlaces: `municipal markets & commercial hubs across ${countryName}`,
        ...assets,
      };
  }
}

export function getCountryTransitSpecs(countryCode: CountryCode = 'UG'): CountryTransitCampaignSpec {
  const existing = COUNTRY_TRANSIT_SPECS[countryCode];
  if (existing) return existing;

  const cName = COUNTRIES[countryCode]?.name || countryCode;
  const region = inferCampaignRegion(countryCode);
  const defaults = getRegionDefaults(region, cName, countryCode);

  return {
    countryCode,
    countryName: cName,
    region,
    ...defaults,
    busProposalSummary: `Advertisement Partnership Proposal: Upon bilateral agreement with ${defaults.busPartnerName}, CivicDuty will fund and execute exterior 3-Signal civic branding across commuter buses and transit shelters in ${cName}.`,
    trainProposalSummary: `Moving Billboard Refurbishment Proposal: CivicDuty is ready to partner with ${defaults.trainOperatorName} to install 3-Signal civic accountability displays across passenger trains and station concourses in ${cName}.`,
  };
}

export function getCountryPromotionalAds(countryCode: CountryCode = 'UG'): CdOpsPromotionalAd[] {
  const spec = getCountryTransitSpecs(countryCode);
  const isUganda = countryCode === 'UG';

  // 1. Bus Proposal Ad: Uganda shows Kayoola EVS; every other nation shows its own localized transit photo
  const busAd: CdOpsPromotionalAd = isUganda
    ? {
        id: 'bus-partnership-proposal-ug',
        title: 'Uganda Kayoola & Transit Bus Fleet: Livery Design Plan & Kampala Street Poster',
        category: 'bus',
        categoryLabel: 'Bus Painting Plan & Street Experience · Uganda',
        tagline: 'TYPE 1: CAD PAINT PLAN + TYPE 2: LIVE KAMPALA STREET POSTER · *3030#',
        summary:
          'Advertisement Partnership Proposal: Upon bilateral agreement with Kiira Motors Corporation (KMC) and the Ministry of Works & Transport, CivicDuty will fund and execute the actual exterior painting and 3M UV-laminated livery branding of the Kayoola bus fleet in our official 3-Signal design.',
        imageSrc: spec.busPosterSrc,
        realLifePosterSrc: spec.busPosterSrc,
        adFormatType: 'real_life_street_poster',
        callToAction: 'Inspect Bus Paint Plan & Street Poster',
        ctaType: 'specs',
        ctaValue: 'transit_preview',
        specs: `${spec.busFleetType} · Full Exterior Paint Blueprint + Real-Life Kampala Street Commuter Poster · ${spec.busRoutes}`,
        highlights: [
          `Ad Type 1 (Design Plan): Full engineering livery blueprint for painting ${spec.busPartnerName} buses in the 3-Signal brand`,
          'Ad Type 2 (Real-Life Experience): Street poster of the branded Kayoola bus cruising Kampala roads with passengers & citizens',
          `Prominent Red (Speak) · Amber (Serve) · Green (Be Heard) beacon and ${spec.ussdCode} zero-data access`,
        ],
        sponsorName: 'CivicDuty Transit Partnership Proposal · Uganda',
        targetAudience: 'Kiira Motors (KMC), Tondeka Metro, Commuters & KCCA',
        published: true,
        postedAt: '2026-10-11',
        impressions: 48200,
        clicks: 6410,
      }
    : {
        id: `bus-partnership-proposal-${spec.countryCode.toLowerCase()}`,
        title: `${spec.countryName} ${spec.busPartnerName}: 3-Signal Bus Livery & Street Transit Poster`,
        category: 'bus',
        categoryLabel: `Bus Fleet Livery & Urban Transit Poster · ${spec.countryName}`,
        tagline: `3-SIGNAL TRANSIT WRAP + METROPOLITAN SHELTER POSTER · ${spec.ussdCode}`,
        summary: `${spec.busProposalSummary} Features both the vehicle livery specification for ${spec.busFleetType} and street shelter posters along ${spec.busRoutes}.`,
        imageSrc: spec.busPosterSrc,
        realLifePosterSrc: spec.busPosterSrc,
        adFormatType: 'real_life_street_poster',
        callToAction: `Inspect ${spec.countryName} Transit Campaign`,
        ctaType: 'specs',
        ctaValue: 'transit_preview',
        specs: `${spec.busFleetType} · Exterior Livery + Commuter Shelter Poster · ${spec.busRoutes}`,
        highlights: [
          `Tailored transit display proposal for ${spec.busPartnerName} corridors`,
          `High-visibility urban shelter posters displaying the 3-Signal Red/Amber/Green Checkmark mark`,
          `Instant public reporting access (${spec.ussdCode} / civicduty.site) along ${spec.busRoutes}`,
        ],
        sponsorName: `CivicDuty Transit Partnership Proposal · ${spec.countryName}`,
        targetAudience: `Fleet Operators, Urban Commuters & ${spec.municipalAuthority}`,
        published: true,
        postedAt: '2026-10-11',
        impressions: 34100,
        clicks: 4890,
      };

  // 2. Train Moving Billboard Ad: Uganda shows URC Kampala; every other nation shows localized rail photo
  const trainAd: CdOpsPromotionalAd = isUganda
    ? {
        id: 'railway-train-billboard-ug',
        title: 'Uganda Railways Corporation (URC) "Moving Billboard": Train Paint Plan & Live Commuter Poster',
        category: 'train',
        categoryLabel: 'Railway Moving Billboard · Uganda',
        tagline: 'TYPE 1: RAIL CAD BLUEPRINT + TYPE 2: LIVE PASSENGER STATION POSTER · *3030#',
        summary:
          'Moving Billboard Refurbishment Proposal: CivicDuty is ready to partner with Uganda Railways Corporation (URC) to sandblast, prime, and freshly paint Uganda’s existing steel commuter train carriages with the CivicDuty 3-Signal brand design.',
        imageSrc: spec.trainPosterSrc,
        realLifePosterSrc: spec.trainPosterSrc,
        adFormatType: 'real_life_street_poster',
        callToAction: 'View Train Paint Plan & Station Poster',
        ctaType: 'specs',
        ctaValue: 'transit_preview',
        specs: `${spec.trainType} · Anti-Corrosion Polyurethane Rail Livery Plan + Real-Life Commuter Crossing Poster · ${spec.trainCorridors}`,
        highlights: [
          'Ad Type 1 (Design Plan): Technical carriage painting specification for Uganda Railways Corporation rolling stock',
          'Ad Type 2 (Real-Life Experience): Full-color poster of the CivicDuty commuter train passing Kampala streets and passengers',
          `Transforms daily rail corridors (${spec.trainCorridors}) into panoramic moving civic accountability billboards`,
        ],
        sponsorName: 'CivicDuty × Uganda Railways Corporation Livery Proposal',
        targetAudience: 'Rail Commuters, Level Crossings & Ministry of Works & Transport',
        published: true,
        postedAt: '2026-10-11',
        impressions: 39600,
        clicks: 5280,
      }
    : {
        id: `railway-train-billboard-${spec.countryCode.toLowerCase()}`,
        title: `${spec.trainOperatorName} "Moving Billboard": Station & Commuter Rail Campaign`,
        category: 'train',
        categoryLabel: `Railway & Station Concourse · ${spec.countryName}`,
        tagline: `RAIL CONCOURSE DIGITAL KIOSK + TRAIN LIVERY · ${spec.ussdCode}`,
        summary: `${spec.trainProposalSummary} Displays authentic 3-Signal CivicDuty station kiosks and platform panels along ${spec.trainCorridors}.`,
        imageSrc: spec.trainPosterSrc,
        realLifePosterSrc: spec.trainPosterSrc,
        adFormatType: 'real_life_street_poster',
        callToAction: `View ${spec.countryName} Rail Campaign`,
        ctaType: 'specs',
        ctaValue: 'transit_preview',
        specs: `${spec.trainType} · Station Concourse Display + Carriage Branding · ${spec.trainCorridors}`,
        highlights: [
          `Platform digital totems and carriage branding designed for ${spec.trainOperatorName}`,
          `Displays the iconic 3-Signal CivicDuty mark along ${spec.trainCorridors}`,
          `Connects daily rail commuters directly with local municipal desks via ${spec.ussdCode}`,
        ],
        sponsorName: `CivicDuty × ${spec.trainOperatorName} Civic Campaign`,
        targetAudience: `Rail Commuters, Station Operators & ${spec.municipalAuthority}`,
        published: true,
        postedAt: '2026-10-11',
        impressions: 31200,
        clicks: 4120,
      };

  // 3. Stage & Frontline Mobility Scouts Ad: Strictly adapted to each nation's real courier / bike / rider ecosystem
  const stageAd: CdOpsPromotionalAd = {
    id: `stage-scouts-poster-${spec.countryCode.toLowerCase()}`,
    title: `${spec.countryName} ${spec.stageTransportName}: Frontline Scouts Campaign`,
    category: 'bodaboda',
    categoryLabel: `Frontline Mobility Scouts · ${spec.countryName}`,
    tagline: `${spec.localSlogan} • ${spec.ussdCode}`,
    summary: isUganda
      ? `Real-life outdoor stage billboards and frontline scout safety gear deployed across ${spec.stageLocations}, empowering Bodaboda riders and passengers to report road washouts, potholes, and extortion.`
      : spec.region === 'rwanda'
      ? `Real-life street billboards across Kigali avenues empowering Abamotari moto-taxi cooperatives and commuters to report road defects, drainage issues, and public service gaps.`
      : spec.region === 'europe' || spec.region === 'americas' || spec.region === 'oceania'
      ? `High-visibility architectural street kiosks across ${spec.stageLocations}, uniting ${spec.stageTransportName.toLowerCase()} as verified Frontline Scouts reporting potholes, blocked cycle lanes, broken streetlights, and transit hazards directly to ${spec.municipalAuthority}.`
      : `Real-life street billboards and digital displays across ${spec.stageLocations}, mobilizing ${spec.stageTransportName.toLowerCase()} and daily commuters in ${spec.countryName} to report road hazards, outages, and service failures directly to ${spec.municipalAuthority}.`,
    imageSrc: spec.scoutPosterSrc,
    realLifePosterSrc: spec.scoutPosterSrc,
    adFormatType: 'real_life_street_poster',
    callToAction: `Join Frontline Scouts (${spec.ussdCode})`,
    ctaType: 'ussd',
    ctaValue: spec.ussdCode,
    specs: `Country-Authentic Frontline Scouts Display (${spec.scoutTabLabel}) · ${spec.countryName}`,
    highlights: [
      `Features CivicDuty’s 3-Signal emblem (Red: Speak · Amber: Serve · Green Check: Be Heard) tailored to ${spec.countryName}`,
      `Direct civic reporting channel (${spec.ussdCode} & civicduty.site) for urban riders, couriers, and daily commuters`,
      `Connects citizen evidence directly to ${spec.municipalAuthority} with verifiable SLA accountability`,
    ],
    sponsorName: `CivicDuty Frontline Scouts · ${spec.countryName}`,
    targetAudience: `${spec.stageTransportName} & Daily Commuters`,
    published: true,
    postedAt: '2026-10-11',
    impressions: 54900,
    clicks: 7820,
  };

  // 4. Commercial Markets & Traders Billboard
  const marketAd: CdOpsPromotionalAd = {
    id: `market-vendors-billboard-${spec.countryCode.toLowerCase()}`,
    title: `${spec.countryName} ${spec.marketTabLabel} & Commercial Traders: Frontline Accountability Campaign`,
    category: 'market',
    categoryLabel: `Markets & Local Traders · ${spec.countryName}`,
    tagline: `LOCAL TRADERS & CITIZENS: PROTECT YOUR MARKETPLACE · ${spec.ussdCode}`,
    summary: `Clean 3-Signal civic accountability banners installed across ${spec.marketHeadlinePlaces}, empowering vendors, small merchants, and shoppers in ${spec.countryName} to flag sanitation backlogs, water/power outages, and facility repairs.`,
    imageSrc: spec.marketPosterSrc,
    realLifePosterSrc: spec.marketPosterSrc,
    adFormatType: 'real_life_street_poster',
    callToAction: 'Explore Market Accountability Campaign',
    ctaType: 'specs',
    ctaValue: 'transit_preview',
    specs: `Market Square Overhead Banner & Merchant Signage (${spec.marketTabLabel}) · ${spec.countryName}`,
    highlights: [
      `Installed above bustling trading halls and stalls across ${spec.marketHeadlinePlaces}`,
      `Fast 24h–48h escalation channel to ${spec.municipalAuthority} for sanitation, lighting, and drainage`,
      `Built-in Monthly Merit Recognition for active market stewards and merchant associations`,
    ],
    sponsorName: `CivicDuty Trade & Municipal Sanitation Oversight · ${spec.countryName}`,
    targetAudience: `Market Vendors, Shopkeepers, Cooperatives & Consumers`,
    published: true,
    postedAt: '2026-10-11',
    impressions: 46300,
    clicks: 6190,
  };

  // 5. Licensed Taxis, Rideshare & Corridor Drivers Campaign
  const taxiAd: CdOpsPromotionalAd = {
    id: `transit-drivers-gantry-${spec.countryCode.toLowerCase()}`,
    title: `${spec.countryName} ${spec.taxiHeadlineLabel}: Road Safety & Civic Watchdogs`,
    category: 'taxi',
    categoryLabel: `${spec.taxiTabLabel} & Road Corridors · ${spec.countryName}`,
    tagline: `${spec.taxiTabLabel.toUpperCase()}: REPORT CORRIDOR HAZARDS & DELAYS · ${spec.ussdCode}`,
    summary: `Strategic roadside gantries and transit hub digital displays mobilizing ${spec.taxiHeadlineLabel.toLowerCase()} across ${spec.countryName} to report highway washouts, broken traffic signals, dangerous intersections, and roadworks delays.`,
    imageSrc: spec.taxiPosterSrc,
    realLifePosterSrc: spec.taxiPosterSrc,
    adFormatType: 'real_life_street_poster',
    callToAction: `Report Road Hazards (${spec.ussdCode})`,
    ctaType: 'ussd',
    ctaValue: spec.ussdCode,
    specs: `${spec.taxiTabLabel} Corridor Gantry & Digital Street Totem · ${spec.countryName}`,
    highlights: [
      `Reflects the real commercial vehicles operating on ${spec.countryName} streets (${spec.taxiTabLabel})`,
      `One-touch geotagged incident reporting protecting commuters and drivers`,
      `Direct escalation to ${spec.municipalAuthority}`,
    ],
    sponsorName: `CivicDuty Road Safety & Transit Watch · ${spec.countryName}`,
    targetAudience: `${spec.taxiTabLabel}, Commercial Drivers & Commuters`,
    published: true,
    postedAt: '2026-10-11',
    impressions: 42100,
    clicks: 5870,
  };

  // 6. Healthcare Quality Monitor Billboard
  const healthAd: CdOpsPromotionalAd = {
    id: `health-center-accountability-${spec.countryCode.toLowerCase()}`,
    title: `${spec.countryName} Healthcare Monitors & Community Clinic Accountability Board`,
    category: 'health',
    categoryLabel: `Healthcare Quality Monitor · ${spec.countryName}`,
    tagline: `HEALTHCARE WORKERS & PATIENTS: DEFEND YOUR CLINIC · ${spec.ussdCode}`,
    summary: `Entrance accountability boards at clinics, pharmacies, and community hospitals in ${spec.countryName}, empowering nurses, doctors, and patients to report supply shortages, ambulance delays, and utility outages. CivicDuty is an independent civic oversight platform (not a healthcare operator).`,
    imageSrc: spec.healthPosterSrc,
    realLifePosterSrc: spec.healthPosterSrc,
    adFormatType: 'real_life_street_poster',
    callToAction: 'Explore Clinic Quality Board',
    ctaType: 'specs',
    ctaValue: 'transit_preview',
    specs: `Community Healthcare Center Entrance Signage · ${spec.countryName}`,
    highlights: [
      `Showcases CivicDuty’s official 3-Signal emblem at primary care clinic entrances`,
      `Independent third-party monitoring linking clinic alerts directly to health authorities`,
      `Verified health monitors receive community utility & recognition credits`,
    ],
    sponsorName: `CivicDuty Healthcare Oversight · ${spec.countryName}`,
    targetAudience: `Doctors, Nurses, Pharmacists, Patients & Caregivers`,
    published: true,
    postedAt: '2026-10-11',
    impressions: 38400,
    clicks: 5310,
  };

  // 7. Education & Youth Watchdog Poster
  const teacherAd: CdOpsPromotionalAd = {
    id: `teacher-youth-watch-${spec.countryCode.toLowerCase()}`,
    title: `${spec.countryName} Teachers, Students & Youth Leaders: Safe School Zones`,
    category: 'teacher',
    categoryLabel: `Education & Youth Watch · ${spec.countryName}`,
    tagline: `TEACHERS & YOUTH SCOUTS: SAFE SCHOOL ZONES · ${spec.ussdCode}`,
    summary: `3-Signal civic noticeboards placed along school crosswalks and campus gates across ${spec.countryName}, engaging educators, students, and parent associations to flag crossing hazards, lighting failures, and school facility repairs.`,
    imageSrc: spec.teacherPosterSrc,
    realLifePosterSrc: spec.teacherPosterSrc,
    adFormatType: 'real_life_street_poster',
    callToAction: 'View School Zone Poster',
    ctaType: 'specs',
    ctaValue: 'transit_preview',
    specs: `School Crosswalk & Campus Bulletin Display · ${spec.countryName}`,
    highlights: [
      `Promotes safe school crossings, working traffic signals, and maintained classrooms`,
      `Direct civic audit link to municipal school boards and public works`,
      `Top youth scouts earn verified educational data and learning vouchers`,
    ],
    sponsorName: `CivicDuty Education & Youth Watchdog · ${spec.countryName}`,
    targetAudience: `Teachers, University Students, Youth Leaders & Parents`,
    published: true,
    postedAt: '2026-10-11',
    impressions: 42100,
    clicks: 5880,
  };

  // 8. Artisans, Engineers & Public Works Inspector Billboard
  const artisanAd: CdOpsPromotionalAd = {
    id: `artisan-builders-inspector-${spec.countryCode.toLowerCase()}`,
    title: `${spec.countryName} Artisans, Engineers & Builders: Public Works Audit Board`,
    category: 'artisan',
    categoryLabel: `Artisans & Workmanship Inspector · ${spec.countryName}`,
    tagline: `ARTISANS & BUILDERS: WATCHDOG PUBLIC WORKS · ${spec.ussdCode}`,
    summary: `3-Signal public works accountability signboards positioned at active road, drainage, and civil infrastructure sites across ${spec.countryName}, enlisting local technicians, masons, and engineers as third-party quality monitors.`,
    imageSrc: spec.artisanPosterSrc,
    realLifePosterSrc: spec.artisanPosterSrc,
    adFormatType: 'real_life_street_poster',
    callToAction: 'Inspect Public Works Signboard',
    ctaType: 'specs',
    ctaValue: 'transit_preview',
    specs: `Active Civil Works Accountability Signboard · ${spec.countryName}`,
    highlights: [
      `Installed alongside municipal road, curb, and drainage construction corridors`,
      `Enables skilled artisans to log substandard materials or stalled public works`,
      `Links to ${spec.municipalAuthority} engineering oversight desks`,
    ],
    sponsorName: `CivicDuty Infrastructure Quality Watch · ${spec.countryName}`,
    targetAudience: `Civil Engineers, Artisans, Technicians & Contractors`,
    published: true,
    postedAt: '2026-10-11',
    impressions: 37900,
    clicks: 4990,
  };

  return [busAd, trainAd, stageAd, marketAd, taxiAd, healthAd, teacherAd, artisanAd];
}

export const INITIAL_PROMOTIONAL_ADS: CdOpsPromotionalAd[] = getCountryPromotionalAds('UG');
