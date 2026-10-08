import { CdOpsPromotionalAd, CountryCode } from '../types';
import { COUNTRIES } from './countries';

export interface CountryTransitCampaignSpec {
  countryCode: CountryCode;
  countryName: string;
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
}

export const COUNTRY_TRANSIT_SPECS: Partial<Record<CountryCode, CountryTransitCampaignSpec>> = {
  UG: {
    countryCode: 'UG',
    countryName: 'Uganda',
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
    localSlogan: 'BODA MAN & TAXI DRIVER: GWE BOSS W’OLUGUUDO! · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'KCCA, UNRA & Ministry of Works and Transport',
  },
  KE: {
    countryCode: 'KE',
    countryName: 'Kenya',
    ussdCode: '*3030*254#',
    busPartnerName: 'Super Metro, BasiGo / Roam Electric & Leading Matatu SACCOs',
    busFleetType: 'Organized 33–51 Seater Commuter Buses, Electric Transit & Nganya Matatus',
    busRoutes: 'Waiyaki Way, Thika Superhighway, Jogoo Road, Mombasa Road, Rongai & CBD Termini',
    busProposalSummary:
      'Advertisement Partnership Proposal: Upon partnership sign-off with Super Metro, BasiGo, and registered NTSA Matatu SACCOs, CivicDuty will fund and execute the actual custom exterior bus painting and 3-Signal livery wrap across high-volume Nairobi and county commuter fleets.',
    trainOperatorName: 'Kenya Railways Corporation (KRC)',
    trainType: 'Nairobi Commuter Rail DMU Coaches, Metre-Gauge & Madaraka SGR Rolling Stock',
    trainCorridors: 'Nairobi Central–Syokimau, Embakasi Village, Ruiru, Kikuyu & Mombasa SGR Termini',
    trainProposalSummary:
      'Moving Billboard Refurbishment Proposal: CivicDuty proposes a commercial branding accord with Kenya Railways to freshly paint and wrap existing Nairobi Commuter Rail steel carriages and DMU coaches in the CivicDuty 3-Signal brand livery—creating a moving accountability billboard seen by 500,000+ daily commuters.',
    stageTransportName: 'Boda Boda Stages & Matatu Termini SACCOs',
    stageLocations: 'Nairobi CBD, Westlands, Eastleigh, Kisumu, Nakuru & Mombasa Boda & Matatu Stages',
    localSlogan: 'MWANANCHI & BODA RIDER: PAZA SAUTI YAKO! · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'Nairobi City County, KeNHA, KURA & NTSA',
  },
  NG: {
    countryCode: 'NG',
    countryName: 'Nigeria',
    ussdCode: '*3030*234#',
    busPartnerName: 'LAMATA Lagos BRT, Cowry Fleet & Abuja Mass Transit',
    busFleetType: 'High-Capacity BRT Articulated Buses, Coaster Commuters & Organized Danfo Unions',
    busRoutes: 'Ikorodu–TBS, Oshodi–Abule Egba, Lekki–Epe Expressway & Abuja Berger–Airport Corridors',
    busProposalSummary:
      'Advertisement Partnership Proposal: Upon agreement with LAMATA and state mass transit operators, CivicDuty will fund and execute the actual exterior painting and 3-Signal livery branding of BRT and metropolitan commuter buses.',
    trainOperatorName: 'Nigerian Railway Corporation (NRC) & Lagos Rail Mass Transit',
    trainType: 'NRC Narrow-Gauge Commuter Coaches, Lagos Blue/Red Line & Abuja–Kaduna Passenger Rolling Stock',
    trainCorridors: 'Iddo–Ijoko Commuter Line, Marina–Mile 2, Agege–Agbado & Lagos–Ibadan Corridor',
    trainProposalSummary:
      'Moving Billboard Refurbishment Proposal: CivicDuty is ready to partner with the Nigerian Railway Corporation (NRC) to refurbish, prime, and paint existing commuter rail carriages in the official CivicDuty 3-Signal livery as moving civic billboards.',
    stageTransportName: 'Okada Stages, Keke NAPEP & Danfo Motor Parks',
    stageLocations: 'Oshodi, Ojota,Berger, Wuse, Kano & Port Harcourt Okada, Keke & Danfo Parks',
    localSlogan: 'NO GREE FOR BAD ROAD OR EXTORTION! · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'FERMA, Federal Ministry of Works & State Transport Ministries',
  },
  SS: {
    countryCode: 'SS',
    countryName: 'South Sudan',
    ussdCode: '*3030*211#',
    busPartnerName: 'Juba City Commuter Coaches, Interstate Bus Lines & Public Taxi Unions',
    busFleetType: 'Organized City Coaster Buses, Juba–Nimule Coaches & 14-Seater Public Taxis',
    busRoutes: 'Konyokonyo, Custom Market, Gudele, Munuki, Bilpam & Juba–Nimule Highway',
    busProposalSummary:
      'Advertisement Partnership Proposal: Upon agreement with Juba City Council and organized bus/taxi cooperatives, CivicDuty will fund and execute the actual exterior painting of city buses and public taxis in our official 3-Signal brand design.',
    trainOperatorName: 'South Sudan National Railway Corporation (SSNRC)',
    trainType: 'Wau–Babanusa Heritage Steel Locomotives & National Rail Corridor Carriages',
    trainCorridors: 'Wau Central Station, Aweil Corridor & Bahr el Ghazal Rail Line',
    trainProposalSummary:
      'Moving Billboard Refurbishment Proposal: CivicDuty is ready to partner with the Ministry of Transport & Roads to restore, prime, and paint existing Wau railway carriages and locomotives in the CivicDuty 3-Signal brand design as national civic unity and accountability billboards.',
    stageTransportName: 'Bodaboda Stages & Public Bus/Taxi Parks',
    stageLocations: 'Konyokonyo, Custom, Hai Referendum, Wau & Malakal Bodaboda & Taxi Stages',
    localSlogan: 'BODA RIDER & CITIZEN: BUILD OUR NATION! · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'Juba City Council & Ministry of Roads and Bridges',
  },
  TZ: {
    countryCode: 'TZ',
    countryName: 'Tanzania',
    ussdCode: '*3030*255#',
    busPartnerName: 'UDART (Mwendokasi BRT) & Daladala Transit Cooperatives',
    busFleetType: 'Dar es Salaam BRT Buses & Organized Urban Daladala Fleets',
    busRoutes: 'Kimara–Kivukoni, Mbagala, Gerezani, Morocco & Dodoma City Routes',
    busProposalSummary:
      'Advertisement Partnership Proposal: Upon agreement with UDART and LATRA-registered bus operators, CivicDuty will fund and execute the actual exterior painting of Mwendokasi and Daladala buses with our 3-Signal brand design.',
    trainOperatorName: 'Tanzania Railways Corporation (TRC) & TAZARA',
    trainType: 'Dar Commuter Rail (Treni ya Jiji) Steel Carriages & SGR Passenger Coaches',
    trainCorridors: 'Kamata–Pugu, Ubungo–Stesheni & Dar–Morogoro–Dodoma Corridors',
    trainProposalSummary:
      'Moving Billboard Refurbishment Proposal: CivicDuty is ready to partner with TRC and TAZARA to freshly paint existing commuter train carriages in the CivicDuty 3-Signal brand design as moving billboards across Dar es Salaam.',
    stageTransportName: 'Bodaboda, Bajaji & Daladala Stages',
    stageLocations: 'Kariakoo, Ubungo, Mwenge, Arusha & Mwanza Bodaboda & Bajaji Stages',
    localSlogan: 'SAUTI YA MWANANCHI · HUDUMA BORA KWA WOTE · PIGA *3030*255#',
    municipalAuthority: 'TANROADS, TARURA & LATRA',
  },
  RW: {
    countryCode: 'RW',
    countryName: 'Rwanda',
    ussdCode: '*3030*250#',
    busPartnerName: 'Tap&Go (AC Group), Yutong Electric Fleet & KBS / Royal Express',
    busFleetType: 'Zero-Emission Electric City Buses & High-Capacity Commuter Coaches',
    busRoutes: 'Nyabugogo, Downtown Kigali, Remera, Kimironko, Kanombe & Musanze Corridors',
    busProposalSummary:
      'Advertisement Partnership Proposal: Upon agreement with Tap&Go and RURA transit operators, CivicDuty will fund and execute the full exterior painting/wrapping of city buses in our 3-Signal brand design.',
    trainOperatorName: 'Rwanda Transport Development Agency (RTDA) Rail & Multimodal Corridors',
    trainType: 'Regional Standard Gauge Corridor Coaches & Dry-Port Rolling Stock',
    trainCorridors: 'Kigali–Isaka Multimodal Corridor & Masaka Logistics Rail Hub',
    trainProposalSummary:
      'Moving Billboard Proposal: CivicDuty partners with national transport authorities to brand rail and multimodal transit units with the 3-Signal civic accountability design.',
    stageTransportName: 'Ferarimar Moto-Taxi Stages & Nyabugogo Bus Park',
    stageLocations: 'Kigali, Huye, Rubavu & Musanze Moto-Taxi Cooperatives & Bus Terminals',
    localSlogan: 'UMUTURAGE KU ISONGA · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'City of Kigali, RTDA & RURA',
  },
  GH: {
    countryCode: 'GH',
    countryName: 'Ghana',
    ussdCode: '*3030*233#',
    busPartnerName: 'Aayalolo BRT, Metro Mass Transit & GPRTU Trotro Unions',
    busFleetType: 'Aayalolo Quality Bus System, Metro Mass Coaches & Organized Trotro Fleets',
    busRoutes: 'Amasaman–Tudu, Adenta–Accra Central, Kasoa & Kumasi Kejetia Corridors',
    busProposalSummary:
      'Advertisement Partnership Proposal: Upon agreement with Metro Mass Transit, Aayalolo, and GPRTU, CivicDuty will fund and execute the actual exterior painting of buses in our official 3-Signal brand design.',
    trainOperatorName: 'Ghana Railway Company Limited (GRCL)',
    trainType: 'Accra–Tema & Accra–Nsawam Diesel Commuter Train Carriages',
    trainCorridors: 'Accra Central, Achimota, Tema Harbour & Takoradi Suburban Rail Lines',
    trainProposalSummary:
      'Moving Billboard Refurbishment Proposal: CivicDuty is ready to partner with GRCL to prime and paint existing commuter rail carriages in the CivicDuty 3-Signal livery as moving civic billboards.',
    stageTransportName: 'Okada, Pragya & Trotro Lorry Stations',
    stageLocations: 'Kwame Nkrumah Circle, Kaneshie, Madina, Tema & Kejetia Lorry Parks',
    localSlogan: 'CITIZEN VOICE IN ACTION · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'AMA, Department of Urban Roads & Ministry of Roads and Highways',
  },
  ZA: {
    countryCode: 'ZA',
    countryName: 'South Africa',
    ussdCode: '*3030*27#',
    busPartnerName: 'Rea Vaya BRT, MyCiTi, Golden Arrow & SANTACO Taxi Associations',
    busFleetType: 'Articulated BRT Buses, Commuter Coaches & Minibus Taxis',
    busRoutes: 'Soweto–Johannesburg CBD, Sandton, Tshwane A Re Yeng & Cape Town Civic Centre',
    busProposalSummary:
      'Advertisement Partnership Proposal: Upon agreement with municipal BRT agencies and SANTACO, CivicDuty will fund and execute full exterior fleet painting in our 3-Signal brand design.',
    trainOperatorName: 'PRASA Metrorail Commuter Rail',
    trainType: 'Metrorail 5M2A Steel Coaches & X’Trapolis Mega Commuter Trains',
    trainCorridors: 'Johannesburg Park Station–Pretoria, Soweto, Cape Town Southern Line & Durban',
    trainProposalSummary:
      'Moving Billboard Refurbishment Proposal: CivicDuty is ready to partner with PRASA Metrorail to refurbish and paint classic steel commuter carriages in the CivicDuty 3-Signal brand livery.',
    stageTransportName: 'Minibus Taxi Ranks & Motorbike Delivery Hubs',
    stageLocations: 'Bree Street, Noord Street, Baragwanath, Bellville & Umlazi Taxi Ranks',
    localSlogan: 'BATHO PELE · PEOPLE FIRST · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'SANRAL, Municipal Roads & Department of Transport',
  },
};

export function getCountryTransitSpecs(countryCode: CountryCode = 'UG'): CountryTransitCampaignSpec {
  const existing = COUNTRY_TRANSIT_SPECS[countryCode];
  if (existing) return existing;

  const cName = COUNTRIES[countryCode]?.name || countryCode;
  return {
    countryCode,
    countryName: cName,
    ussdCode: '*3030#',
    busPartnerName: `${cName} Metropolitan Bus Transit & Public Taxi Cooperatives`,
    busFleetType: `Organized City Transit Buses, Commuter Coaches & Public Taxis in ${cName}`,
    busRoutes: `Central Business District, Metropolitan Arterials & Regional Highway Termini`,
    busProposalSummary: `Advertisement Partnership Proposal: Upon bilateral agreement with ${cName} public bus operators and transit cooperatives, CivicDuty will fund and execute the actual exterior painting of the bus fleet in our official 3-Signal brand design.`,
    trainOperatorName: `${cName} National Railways & Suburban Commuter Rail`,
    trainType: `Existing Passenger Commuter Train Carriages & Diesel/Electric Locomotives in ${cName}`,
    trainCorridors: `Central Railway Station, Suburban Commuter Lines & Level Crossings`,
    trainProposalSummary: `Moving Billboard Refurbishment Proposal: CivicDuty is ready to partner with ${cName} Railways to refurbish, prime, and paint existing passenger train coaches with the CivicDuty 3-Signal brand design as moving civic billboards.`,
    stageTransportName: `Bodaboda / Moto Stages & Public Bus/Taxi Parks`,
    stageLocations: `Major Bodaboda Stages, Commuter Taxi Ranks & Bus Shelters across ${cName}`,
    localSlogan: `${cName.toUpperCase()} CITIZEN VOICE · SPEAK. SERVE. BE HEARD.`,
    municipalAuthority: `${cName} Ministry of Works, Transport & Municipal Authorities`,
  };
}

export function getCountryPromotionalAds(countryCode: CountryCode = 'UG'): CdOpsPromotionalAd[] {
  const spec = getCountryTransitSpecs(countryCode);

  return [
    {
      id: `bus-partnership-proposal-${spec.countryCode.toLowerCase()}`,
      title: `${spec.countryName} Organized Bus Fleet Painting & Ad Partnership Proposal`,
      category: 'bus',
      categoryLabel: `Bus Painting Partnership · ${spec.countryName}`,
      tagline: `PROPOSAL FOR ACTUAL FLEET PAINTING · ${spec.busPartnerName.toUpperCase()}`,
      summary: spec.busProposalSummary,
      imageSrc: '/campaign/kayoola_bus_partnership.jpg',
      callToAction: 'Inspect Bus Painting Proposal & Livery',
      ctaType: 'specs',
      ctaValue: 'transit_preview',
      specs: `${spec.busFleetType} · Full Exterior Paint & 3M Cast Lamination Proposal · ${spec.busRoutes}`,
      highlights: [
        `Partnership Proposal: Once agreed upon with ${spec.busPartnerName}, CivicDuty funds and executes the actual painting of the buses with our 3-Signal brand design`,
        `Features the iconic Red (Speak) · Amber (Serve) · Green Checkmark (Be Heard) beacon and ${spec.ussdCode} offline shortcode`,
        `Turns daily commutes along ${spec.busRoutes} into high-trust public accountability touchpoints`,
      ],
      sponsorName: `CivicDuty Transit Partnership Proposal · ${spec.countryName}`,
      targetAudience: `Bus Fleet Operators, Commuters & ${spec.municipalAuthority}`,
      published: true,
      postedAt: '2026-10-08',
      impressions: 34850,
      clicks: 4920,
    },
    {
      id: `railway-train-billboard-${spec.countryCode.toLowerCase()}`,
      title: `${spec.trainOperatorName} "Moving Billboard" Train Painting Proposal`,
      category: 'train',
      categoryLabel: `Railway Moving Billboard · ${spec.countryName}`,
      tagline: `PAINTING EXISTING TRAINS AS MOVING BILLBOARDS · ${spec.ussdCode}`,
      summary: spec.trainProposalSummary,
      imageSrc: '/campaign/train_moving_billboard.jpg',
      callToAction: 'View Railway Moving Billboard Livery',
      ctaType: 'specs',
      ctaValue: 'transit_preview',
      specs: `${spec.trainType} · Industrial Anti-Corrosion Primer & Polyurethane Rail Livery Paint · ${spec.trainCorridors}`,
      highlights: [
        `CivicDuty is ready to paint existing ${spec.countryName} railway trains (${spec.trainType}) in our official 3-Signal brand livery`,
        `Transforms whole multi-car commuter trains into panoramic moving billboards across ${spec.trainCorridors}`,
        `Co-branded with ${spec.trainOperatorName} to revitalize public rail aesthetics while educating millions of citizens`,
      ],
      sponsorName: `CivicDuty × ${spec.trainOperatorName} Livery Proposal`,
      targetAudience: `Rail Commuters, Pedestrian Crossings & Transport Authorities`,
      published: true,
      postedAt: '2026-10-08',
      impressions: 29400,
      clicks: 4180,
    },
    {
      id: `bodaboda-stage-poster-${spec.countryCode.toLowerCase()}`,
      title: `${spec.countryName} ${spec.stageTransportName} Sensitization Campaign`,
      category: 'bodaboda',
      categoryLabel: `${spec.stageTransportName} · ${spec.countryName}`,
      tagline: `${spec.localSlogan} • DIAL ${spec.ussdCode}`,
      summary: `High-visibility stage shelter posters and rider reflector branding tailored to ${spec.stageLocations}, empowering riders and passengers to report road potholes, utility hazards, and extortion.`,
      imageSrc: '/campaign/bodaboda_matatu_poster.jpg',
      callToAction: `Dial ${spec.ussdCode} FREE (Zero Data)`,
      ctaType: 'ussd',
      ctaValue: spec.ussdCode,
      specs: `A1/A2 Weather-Resistant Stage Shelter Poster & Rider Reflector Vests · ${spec.countryName}`,
      highlights: [
        `Auto-adapted for ${spec.countryName}: ${spec.stageLocations}`,
        `Instant USSD ${spec.ussdCode} works on any basic feature phone without mobile data`,
        `Verified stage watchdogs earn pre-funded fuel, airtime, and data perks from the CSR Escrow Vault`,
      ],
      sponsorName: `CivicDuty Grassroots Transit Ops · ${spec.countryName}`,
      targetAudience: `Bodaboda Riders, Matatu/Taxi Drivers, Stage Chairmen & Commuters`,
      published: true,
      postedAt: '2026-10-08',
      impressions: 41200,
      clicks: 5640,
    },
  ];
}

export const INITIAL_PROMOTIONAL_ADS: CdOpsPromotionalAd[] = getCountryPromotionalAds('UG');
