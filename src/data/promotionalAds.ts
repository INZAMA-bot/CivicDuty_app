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
  GB: {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    ussdCode: 'SMS 83030',
    busPartnerName: 'Transport for London (TfL), Stagecoach, Arriva & FirstBus',
    busFleetType: 'Zero-Emission Double-Decker & Single-Deck Metropolitan Transit Buses',
    busRoutes: 'Oxford Street, Piccadilly Circus, Kings Cross, Manchester Piccadilly & Birmingham City Centre',
    busProposalSummary:
      'Advertisement Partnership Proposal: In bilateral agreement with TfL and regional passenger transport executives, CivicDuty will fund and execute official 3-Signal exterior livery wraps across high-visibility urban double-decker bus routes.',
    trainOperatorName: 'Network Rail & London Overground / Elizabeth Line',
    trainType: 'British Rail Commuter EMUs, Class 345 & Regional Passenger Rolling Stock',
    trainCorridors: 'London Waterloo, Victoria, Paddington, Birmingham New Street & Edinburgh Waverley',
    trainProposalSummary:
      'Moving Billboard Refurbishment Proposal: CivicDuty proposes an accord with rail operating companies to wrap commuter carriages in the official 3-Signal civic brand, transforming suburban rail transit into high-impact public accountability displays.',
    stageTransportName: 'Licensed Black Cab Ranks & Cycle Courier Cooperatives',
    stageLocations: 'King’s Cross, Soho, Manchester Arndale, Victoria Station & Birmingham New Street Hubs',
    localSlogan: 'CITIZEN SCRUTINY & PUBLIC VALUE · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'Department for Transport (DfT), National Highways & Transport for London',
  },
  US: {
    countryCode: 'US',
    countryName: 'United States',
    ussdCode: 'SMS 30300',
    busPartnerName: 'Metropolitan Transit Agencies (MTA NYC, CTA Chicago, Austin CapMetro)',
    busFleetType: 'Low-Floor Clean Diesel & Electric Articulated City Transit Buses',
    busRoutes: 'Manhattan 42nd St, Chicago Loop, Austin Congress Ave & Los Angeles Wilshire Blvd',
    busProposalSummary:
      'Advertisement Partnership Proposal: Under partnership agreements with municipal transit authorities, CivicDuty funds and executes full-wrap exterior transit campaigns showcasing the 3-Signal public service accountability model.',
    trainOperatorName: 'Amtrak Passenger Rail & Regional Commuter Authorities',
    trainType: 'Northeast Regional Coaches, Metra Bi-Level & Metro-North Commuter Train Rolling Stock',
    trainCorridors: 'Northeast Corridor, Penn Station–Grand Central, Chicago Union Station & Caltrain Bay Area',
    trainProposalSummary:
      'Moving Billboard Refurbishment Proposal: CivicDuty is prepared to partner with regional commuter rail agencies to install high-durability 3-Signal civic liveries along high-density commuter rail corridors.',
    stageTransportName: 'Rideshare Pickup Zones, Taxi Stands & Courier Staging Hubs',
    stageLocations: 'Times Square, Downtown Austin, Chicago West Loop & San Francisco Market Street Ranks',
    localSlogan: 'COMMUNITY INTEGRITY & PUBLIC TRUST · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'Federal Transit Administration (FTA), State DOTs & Municipal Transit Boards',
  },
  IN: {
    countryCode: 'IN',
    countryName: 'India',
    ussdCode: '*3030*91#',
    busPartnerName: 'DTC Delhi, BEST Mumbai, BMTC Bengaluru & State Road Transport Corporations (SRTC)',
    busFleetType: 'Electric Low-Floor City Commuter Buses & CNG Articulated Transit Fleets',
    busRoutes: 'Connaught Place Delhi, Marine Drive Mumbai, MG Road Bengaluru & Anna Salai Chennai',
    busProposalSummary:
      'Advertisement Partnership Proposal: In cooperation with state transport undertakings, CivicDuty will sponsor and execute full-fleet exterior painting and livery branding in our official 3-Signal civic accountability design.',
    trainOperatorName: 'Indian Railways (Suburban Rail Networks & Vande Bharat Corridors)',
    trainType: 'Mumbai Suburban Local EMUs, Chennai EMU & Northern Railway Commuter Coaches',
    trainCorridors: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)–Thane, Churchgate–Virar, Howrah & New Delhi',
    trainProposalSummary:
      'Moving Billboard Refurbishment Proposal: CivicDuty proposes partnering with Indian Railways to paint and wrap suburban commuter rakes with the 3-Signal civic oversight emblem, viewed daily by over 7 million suburban commuters.',
    stageTransportName: 'Auto-Rickshaw Stands, Taxi Unions & Delivery Scout Hubs',
    stageLocations: 'Railway Station Auto Ranks, Metro Station Feeder Hubs & Urban Bazaar Ranks across Delhi, Mumbai & Bengaluru',
    localSlogan: 'JANTA KI AWAAZ · CITIZEN VOICE · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: 'Ministry of Road Transport and Highways (MoRTH), NHAI & Municipal Corporations',
  },
  FR: {
    countryCode: 'FR',
    countryName: 'France',
    ussdCode: 'SMS 3030',
    busPartnerName: 'RATP (Réseau de Bus Parisien), TCL Lyon & Keolis Métropole',
    busFleetType: 'Bus Articulés 100% Électriques & Flottes de Transport Urbain',
    busRoutes: 'Boulevard Saint-Germain, Champs-Élysées, Lyon Part-Dieu & Marseille Vieux-Port',
    busProposalSummary:
      'Proposition de Partenariat Affichage: En accord avec les autorités organisatrices de la mobilité, CivicDuty financera et réalisera le pelliculage intégral 3-Signal des bus urbains pour promouvoir la transparence du service public.',
    trainOperatorName: 'SNCF Voyageurs & Transilien / RER',
    trainType: 'Rames RER B/D, Transilien Ligne N & TER Régionaux',
    trainCorridors: 'Paris Gare du Nord–Châtelet, Gare de Lyon, Ligne C & Corridors Métropolitains',
    trainProposalSummary:
      'Projet Panneau Mobile Ferroviaire: CivicDuty propose un accord de livrée citoyenne sur les rames Transilien et RER, transformant les corridors ferroviaires quotidiens en vecteurs d’engagement civique.',
    stageTransportName: 'Stations de Taxis Parisiens & Hubs de Livraisons Cyclistes',
    stageLocations: 'Gare Montparnasse, Châtelet-Les Halles, République & Place de la Comédie Montpellier',
    localSlogan: 'LA VOIX DU CITOYEN · ENGAGEMENT & SERVICE PUBLIC · PARLEZ. AGISSEZ.',
    municipalAuthority: 'Île-de-France Mobilités, SNCF Réseau & Ministère de la Transition Écologique',
  },
  DE: {
    countryCode: 'DE',
    countryName: 'Germany',
    ussdCode: 'SMS 3030',
    busPartnerName: 'BVG Berlin, MVG München, Hochbahn Hamburg & Rheinbahn Düsseldorf',
    busFleetType: 'Elektrische Gelenkbusse & Urbane Niederflur-Linienbusse',
    busRoutes: 'Alexanderplatz, Kurfürstendamm, München Marienplatz & Hamburg Jungfernstieg',
    busProposalSummary:
      'Werbepartnerschafts-Initiative: In Zusammenarbeit mit den Verkehrsverbünden finanziert CivicDuty die professionelle 3-Signal Lackierung und Folierung von Linienbussen im Sinne moderner Bürgerbeteiligung.',
    trainOperatorName: 'Deutsche Bahn (S-Bahn Berlin / München & Regional-Express)',
    trainType: 'Baureihe 481 S-Bahn Rungen & Doppelstock Regional-Express Wagen',
    trainCorridors: 'Berliner Stadtbahn (Hauptbahnhof–Ostbahnhof), Stammstrecke München & Rhein-Ruhr Express',
    trainProposalSummary:
      'Fahrbare Bürger-Infowand: CivicDuty kooperiert mit der S-Bahn zur Neugestaltung von Pendlerzügen im dreifarbigen 3-Signal Design für Transparenz und kommunale Bürgeranliegen.',
    stageTransportName: 'Taxistände & Fahrradkurier-Logistikhubs',
    stageLocations: 'Berlin Hauptbahnhof, Alexanderplatz, München Hbf & Frankfurt Hauptwache',
    localSlogan: 'BÜRGERSTIMME ZÄHLT · TRANSPARENZ & SERVICE · SPRECHEN. WIRKEN.',
    municipalAuthority: 'Bundesministerium für Digitales und Verkehr (BMDV) & Landeverkehrsgesellschaften',
  },
  JP: {
    countryCode: 'JP',
    countryName: 'Japan',
    ussdCode: 'WEB/LINE 3030',
    busPartnerName: 'Toei Bus (東京都交通局), Osaka City Bus & Yokohama Municipal Bus',
    busFleetType: '燃料電池バス (SORA FC Bus) & ノンステップ路線バス',
    busRoutes: 'Shinjuku Station, Shibuya Crossing, Tokyo Station Marunouchi & Umeda Osaka',
    busProposalSummary:
      '交通ラッピング広告提案: 東京都交通局および都市交通各社との合意に基づき、CivicDuty公式の3シグナルデザインによるクリーンな外装ラッピングを展開します。',
    trainOperatorName: 'JR東日本 / JR西日本 (山手線・環状線通勤電車)',
    trainType: 'E235系通勤形電車 & 近郊形ステンレス車両',
    trainCorridors: '山手線 (Yamanote Line), 中央・総武線 & 大阪環状線',
    trainProposalSummary:
      '動く市民ボード構想: 日常の通勤輸送を支える主要鉄道路線において、市民の声と公共サービスを結ぶCivicDutyシンボル車両を展開します。',
    stageTransportName: '主要駅タクシー乗り場 & サイクルデリバリー拠点',
    stageLocations: '新宿駅西口, 渋谷駅ハチ公前, 秋葉原中央口 & なんば駅前',
    localSlogan: '市民の声がまちを動かす · SPEAK. SERVE. BE HEARD.',
    municipalAuthority: '国土交通省 (MLIT) & 各自治体交通局',
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
    busPartnerName: `${cName} Metropolitan Bus Transit & Public Transport Operators`,
    busFleetType: `Organized City Transit Buses, Commuter Coaches & Public Taxis in ${cName}`,
    busRoutes: `Central Business District, Metropolitan Arterials & Regional Highway Termini`,
    busProposalSummary: `Advertisement Partnership Proposal: Upon bilateral agreement with ${cName} public bus operators and municipal transit cooperatives, CivicDuty will fund and execute the actual exterior painting and livery branding of the bus fleet in our official 3-Signal brand design.`,
    trainOperatorName: `${cName} National Railways & Suburban Passenger Rail`,
    trainType: `Existing Passenger Commuter Train Carriages & Diesel/Electric Locomotives in ${cName}`,
    trainCorridors: `Central Railway Station, Suburban Commuter Lines & High-Traffic Crossings`,
    trainProposalSummary: `Moving Billboard Refurbishment Proposal: CivicDuty is ready to partner with ${cName} Rail Authorities to refurbish, prime, and paint existing passenger train coaches with the CivicDuty 3-Signal brand design as moving civic billboards.`,
    stageTransportName: `Public Transport Terminals, Taxi Ranks & Delivery Courier Hubs`,
    stageLocations: `Major Commuter Hubs, Transit Ranks & Urban Shelters across ${cName}`,
    localSlogan: `${cName.toUpperCase()} CITIZEN VOICE · SPEAK. SERVE. BE HEARD.`,
    municipalAuthority: `${cName} Ministry of Works, Transport & Municipal Authorities`,
  };
}

export function getCountryPromotionalAds(countryCode: CountryCode = 'UG'): CdOpsPromotionalAd[] {
  const spec = getCountryTransitSpecs(countryCode);
  const isUganda = countryCode === 'UG';

  // 1. Bus Proposal Ad: Strictly Uganda-only for Kayoola and Kampala; country-specific elsewhere
  const busAd: CdOpsPromotionalAd = isUganda
    ? {
        id: 'bus-partnership-proposal-ug',
        title: 'Uganda Kayoola & Transit Bus Fleet: Livery Design Plan & Kampala Street Poster',
        category: 'bus',
        categoryLabel: 'Bus Painting Plan & Street Experience · Uganda',
        tagline: 'TYPE 1: CAD PAINT PLAN + TYPE 2: LIVE KAMPALA STREET POSTER · *3030#',
        summary:
          'Advertisement Partnership Proposal: Upon bilateral agreement with Kiira Motors Corporation (KMC) and the Ministry of Works & Transport, CivicDuty will fund and execute the actual exterior painting and 3M UV-laminated livery branding of the Kayoola bus fleet in our official 3-Signal design. Switch between our engineering CAD paint plan and the real-life street poster showing the branded Kayoola EVS bus on Kampala Road with commuters and pedestrians.',
        imageSrc: '/campaign/kayoola_kampala_street_ad.jpg',
        realLifePosterSrc: '/campaign/kayoola_kampala_street_ad.jpg',
        adFormatType: 'real_life_street_poster',
        callToAction: 'Inspect Bus Paint Plan & Street Poster',
        ctaType: 'specs',
        ctaValue: 'transit_preview',
        specs: `${spec.busFleetType} · Full Exterior Paint Blueprint + Real-Life Kampala Street Commuter Poster · ${spec.busRoutes}`,
        highlights: [
          `Ad Type 1 (Design Plan): Full engineering livery blueprint for painting ${spec.busPartnerName} buses in the 3-Signal brand`,
          'Ad Type 2 (Real-Life Experience): Street poster of the branded Kayoola bus cruising Kampala roads with passengers & citizens',
          `Prominent Red (Speak) · Amber (Serve) · Green (Be Heard) beacon and ${spec.ussdCode} zero-data USSD shortcode`,
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
        title: `${spec.countryName} ${spec.busPartnerName}: 3-Signal Bus Livery Design Plan & Street Transit Poster`,
        category: 'bus',
        categoryLabel: `Bus Fleet Livery & Urban Transit Poster · ${spec.countryName}`,
        tagline: `TYPE 1: FLEET PAINT BLUEPRINT + TYPE 2: METROPOLITAN COMMUTER POSTER · ${spec.ussdCode}`,
        summary: `${spec.busProposalSummary} Features both the technical vehicle livery blueprint for ${spec.busFleetType} and high-impact transit posters displayed along ${spec.busRoutes}.`,
        imageSrc: '/campaign/kayoola_kampala_street_ad.jpg',
        realLifePosterSrc: '/campaign/kayoola_kampala_street_ad.jpg',
        adFormatType: 'real_life_street_poster',
        callToAction: `Inspect ${spec.countryName} Bus Paint Plan & Poster`,
        ctaType: 'specs',
        ctaValue: 'transit_preview',
        specs: `${spec.busFleetType} · Full Exterior Livery Blueprint + Real-Life Commuter Corridor Poster · ${spec.busRoutes}`,
        highlights: [
          `Ad Type 1 (Design Plan): Comprehensive CAD paint and wrap specification for ${spec.busPartnerName}`,
          `Ad Type 2 (Real-Life Experience): High-visibility street poster showcasing the 3-Signal civic design along ${spec.busRoutes}`,
          `Displays the Red (Speak) · Amber (Serve) · Green (Be Heard) beacon and local ${spec.ussdCode} access`,
        ],
        sponsorName: `CivicDuty Transit Partnership Proposal · ${spec.countryName}`,
        targetAudience: `Fleet Operators, Urban Commuters & ${spec.municipalAuthority}`,
        published: true,
        postedAt: '2026-10-11',
        impressions: 34100,
        clicks: 4890,
      };

  // 2. Train Moving Billboard Ad: Strictly Uganda-only for URC and Kampala; country-specific elsewhere
  const trainAd: CdOpsPromotionalAd = isUganda
    ? {
        id: 'railway-train-billboard-ug',
        title: 'Uganda Railways Corporation (URC) "Moving Billboard": Train Paint Plan & Live Commuter Poster',
        category: 'train',
        categoryLabel: 'Railway Moving Billboard · Uganda',
        tagline: 'TYPE 1: RAIL CAD BLUEPRINT + TYPE 2: LIVE PASSENGER STATION POSTER · *3030#',
        summary:
          'Moving Billboard Refurbishment Proposal: CivicDuty is ready to partner with Uganda Railways Corporation (URC) to sandblast, prime, and freshly paint Uganda’s existing steel commuter train carriages with the CivicDuty 3-Signal brand design—transforming daily trains into high-impact moving civic billboards across every level crossing. Includes both the multi-carriage technical painting schematic and the real-life railway crossing poster with passengers boarding in Kampala.',
        imageSrc: '/campaign/train_moving_billboard_kampala.jpg',
        realLifePosterSrc: '/campaign/train_moving_billboard_kampala.jpg',
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
        title: `${spec.trainOperatorName} "Moving Billboard": Passenger Rail Carriage Paint Plan & Station Poster`,
        category: 'train',
        categoryLabel: `Railway Moving Billboard · ${spec.countryName}`,
        tagline: `TYPE 1: RAIL CAD BLUEPRINT + TYPE 2: PASSENGER STATION POSTER · ${spec.ussdCode}`,
        summary: `${spec.trainProposalSummary} Provides complete carriage painting schematics and realistic passenger concourse posters for daily travelers along ${spec.trainCorridors}.`,
        imageSrc: '/campaign/train_moving_billboard_kampala.jpg',
        realLifePosterSrc: '/campaign/train_moving_billboard_kampala.jpg',
        adFormatType: 'real_life_street_poster',
        callToAction: `View ${spec.countryName} Train Paint Plan & Poster`,
        ctaType: 'specs',
        ctaValue: 'transit_preview',
        specs: `${spec.trainType} · Anti-Corrosion Rail Livery Plan + Passenger Station Poster · ${spec.trainCorridors}`,
        highlights: [
          `Ad Type 1 (Design Plan): Carriage livery blueprints customized for ${spec.trainOperatorName} passenger stock`,
          `Ad Type 2 (Real-Life Experience): Panoramic commuter platform display across major stations on ${spec.trainCorridors}`,
          `Connects daily rail commuters directly with municipal and utility desks via ${spec.ussdCode}`,
        ],
        sponsorName: `CivicDuty × ${spec.trainOperatorName} Livery Initiative`,
        targetAudience: `Passenger Rail Authorities, Commuters & ${spec.municipalAuthority}`,
        published: true,
        postedAt: '2026-10-11',
        impressions: 31200,
        clicks: 4120,
      };

  // 3. Stage & Frontline Scouts Ad: Country authentic
  const stageAd: CdOpsPromotionalAd = {
    id: `stage-scouts-poster-${spec.countryCode.toLowerCase()}`,
    title: `${spec.countryName} ${spec.stageTransportName}: Frontline Scouts Outdoor Billboard Campaign`,
    category: 'bodaboda',
    categoryLabel: `Frontline Stage Billboards · ${spec.countryName}`,
    tagline: `${spec.localSlogan} • ${spec.ussdCode}`,
    summary: `Real-life outdoor stage billboards and frontline scout safety gear deployed across ${spec.stageLocations}, empowering local frontline operators and commuters to report infrastructure hazards, road washouts, and extortion.`,
    imageSrc: '/campaign/boda_stage_billboard_ad.jpg',
    realLifePosterSrc: '/campaign/boda_stage_billboard_ad.jpg',
    adFormatType: 'real_life_street_poster',
    callToAction: `Access Toll-Free via ${spec.ussdCode}`,
    ctaType: 'ussd',
    ctaValue: spec.ussdCode,
    specs: `High-Impact Overhead Stage Billboard + Frontline Scout High-Visibility Vests · ${spec.countryName}`,
    highlights: [
      `Photographic stage billboard showcasing frontline drivers and scouts in high-visibility 3-Signal safety vests`,
      `Instant access via ${spec.ussdCode} functions on any basic mobile phone without data bundles`,
      `Monthly Top-3 Frontline Scouts in each registered stage or ward receive guaranteed fuel and airtime bounty awards`,
    ],
    sponsorName: `CivicDuty Grassroots Transit Operations · ${spec.countryName}`,
    targetAudience: `Stage Chairmen, Commercial Drivers, Couriers & Daily Commuters`,
    published: true,
    postedAt: '2026-10-11',
    impressions: 54900,
    clicks: 7820,
  };

  // 4. Commercial & Market Vendors Billboard
  const marketAd: CdOpsPromotionalAd = {
    id: `market-vendors-billboard-${spec.countryCode.toLowerCase()}`,
    title: `${spec.countryName} Urban Markets & Commercial Trading Centers Billboard Campaign`,
    category: 'market',
    categoryLabel: `Market Vendors & Trade Hubs · ${spec.countryName}`,
    tagline: `LOCAL TRADERS & SHOPPERS: PROTECT YOUR MARKETPLACE · ${spec.ussdCode}`,
    summary: `High-impact commercial billboards installed above major urban trading centers across ${spec.countryName}, empowering vendors, shoppers, and local merchants to directly flag sanitation, lighting, power outages, and unfair dues.`,
    imageSrc: '/campaign/market_vendors_billboard_ad.jpg',
    realLifePosterSrc: '/campaign/market_vendors_billboard_ad.jpg',
    adFormatType: 'real_life_street_poster',
    callToAction: 'Explore Market Sensitization Poster',
    ctaType: 'specs',
    ctaValue: 'transit_preview',
    specs: `Large-Format Urban Market Square Billboard & Canopy Branding · ${spec.countryName}`,
    highlights: [
      `Overlooks bustling market stalls, giving vendors and buyers an instant direct escalation line via ${spec.ussdCode}`,
      `Guaranteed 24h–48h statutory response from municipal market masters and public works engineers`,
      'Synchronized with Monthly Top-3 Merit Vault rankings for active community business stewards',
    ],
    sponsorName: `CivicDuty Commercial Trade & Sanitation Oversight · ${spec.countryName}`,
    targetAudience: `Market Vendors, Retailers, Cooperatives & Municipal Revenue Officers`,
    published: true,
    postedAt: '2026-10-11',
    impressions: 46300,
    clicks: 6190,
  };

  // 5. Transit Drivers Gantry Billboard
  const taxiAd: CdOpsPromotionalAd = {
    id: `transit-drivers-gantry-${spec.countryCode.toLowerCase()}`,
    title: `${spec.countryName} Highway Corridors & Commuter Park Gantry Campaign`,
    category: 'taxi',
    categoryLabel: `Highway Drivers & Commuter Parks · ${spec.countryName}`,
    tagline: `HIGHWAY DRIVERS: ROAD SAFETY & CORRUPTION WATCHDOGS · ${spec.ussdCode}`,
    summary: `Large-scale highway gantry billboards across major transport arteries in ${spec.countryName}, mobilizing commercial drivers to report road washouts, dangerous blackspots, and checkpoint bribery.`,
    imageSrc: '/campaign/taxi_park_billboard_ad.jpg',
    realLifePosterSrc: '/campaign/taxi_park_billboard_ad.jpg',
    adFormatType: 'real_life_street_poster',
    callToAction: `Report Road Hazards: ${spec.ussdCode}`,
    ctaType: 'ussd',
    ctaValue: spec.ussdCode,
    specs: `Arterial Highway Overhead Steel Gantry + Terminal Information Kiosk · ${spec.countryName}`,
    highlights: [
      `High-contrast illuminated gantry visible to tens of thousands of drivers day and night`,
      'Anonymous one-touch GPS incident reporting protecting drivers against retaliation',
      'Automated dispatch to Highway Patrol, Traffic Command, and Road Maintenance agencies',
    ],
    sponsorName: `CivicDuty Highway & Transit Safety Initiative · ${spec.countryName}`,
    targetAudience: `Interstate Drivers, Commuter Fleets & National Road Authorities`,
    published: true,
    postedAt: '2026-10-11',
    impressions: 42100,
    clicks: 5870,
  };

  // 6. Healthcare Quality Monitor Billboard
  const healthAd: CdOpsPromotionalAd = {
    id: `health-center-accountability-${spec.countryCode.toLowerCase()}`,
    title: `${spec.countryName} Healthcare Monitors & Clinic Quality Accountability Board`,
    category: 'health',
    categoryLabel: `Healthcare Quality Monitor · ${spec.countryName}`,
    tagline: `HEALTHCARE WORKERS & PATIENTS: DEFEND YOUR CLINIC · DIAL ${spec.ussdCode}`,
    summary: `Wall-mounted outdoor accountability boards at public health centers, hospital outpatient triage gates, and pharmacies, empowering health workers and patients to report drug stockouts, oxygen delays, and broken maternity equipment. CivicDuty operates as an independent third-party monitoring platform (not a health facility operator).`,
    imageSrc: '/campaign/health_clinic_billboard_ad.jpg',
    realLifePosterSrc: '/campaign/health_clinic_billboard_ad.jpg',
    adFormatType: 'real_life_street_poster',
    callToAction: 'Explore Clinic Quality Board',
    ctaType: 'specs',
    ctaValue: 'transit_preview',
    specs: `Primary Healthcare Center Entrance Billboard & Pharmacy Signage · ${spec.countryName}`,
    highlights: [
      `Installed at community health centers and referral hospital outpatient gates`,
      `Independent third-party verification platform connecting monitors to District Health Officers (DHO)`,
      `Healthcare monitors eligible for pre-funded clinical wellness and data allocations`,
    ],
    sponsorName: `CivicDuty Independent Healthcare Oversight Platform · ${spec.countryName}`,
    targetAudience: `Nurses, Clinical Officers, Patients, Caregivers & Pharmacists`,
    published: true,
    postedAt: '2026-10-11',
    impressions: 38400,
    clicks: 5310,
  };

  // 7. Education & Youth Watchdog Poster
  const teacherAd: CdOpsPromotionalAd = {
    id: `teacher-youth-watch-${spec.countryCode.toLowerCase()}`,
    title: `${spec.countryName} Teachers, Students & Youth Leaders Education Watchdog Poster`,
    category: 'teacher',
    categoryLabel: `Education & Youth Watch Billboard · ${spec.countryName}`,
    tagline: `TEACHERS & YOUTH SCOUTS: SAFE SCHOOL ZONES · DIAL ${spec.ussdCode}`,
    summary: `High-visibility community billboards placed at public school gates and university student hubs, engaging teachers, student leaders, and youth councils to report dilapidated classrooms, road-crossing hazards, and missing learning supplies. CivicDuty provides independent civic oversight (not a school operator).`,
    imageSrc: '/campaign/school_youth_billboard_ad.jpg',
    realLifePosterSrc: '/campaign/school_youth_billboard_ad.jpg',
    adFormatType: 'real_life_street_poster',
    callToAction: 'View School Zone Poster',
    ctaType: 'specs',
    ctaValue: 'transit_preview',
    specs: `School Gate Bulletin Billboard & Student Council Noticeboard Branding · ${spec.countryName}`,
    highlights: [
      `Sensitizes youth leaders, teachers, and PTAs across primary and secondary school zones`,
      `Independent third-party citizen audit line to Ministry of Education and municipal school inspectors`,
      `Top youth reporters earn pre-funded educational data bundles and library vouchers`,
    ],
    sponsorName: `CivicDuty Independent Education & Youth Watchdog · ${spec.countryName}`,
    targetAudience: `Teachers, Headmasters, University Students, Youth Guilds & Parents`,
    published: true,
    postedAt: '2026-10-11',
    impressions: 42100,
    clicks: 5880,
  };

  // 8. Artisan & Public Works Inspector Billboard
  const artisanAd: CdOpsPromotionalAd = {
    id: `artisan-builders-inspector-${spec.countryCode.toLowerCase()}`,
    title: `${spec.countryName} Artisans, Builders & Public Works Infrastructure Inspector Billboard`,
    category: 'artisan',
    categoryLabel: `Artisans & Workmanship Inspector · ${spec.countryName}`,
    tagline: `ARTISANS & BUILDERS: WATCHDOG PUBLIC WORKS · DIAL ${spec.ussdCode}`,
    summary: `Reflective roadside construction billboards installed along ongoing road, drainage, and bridge sites, enlisting local masons, plumbers, electricians, and civil artisans as third-party workmanship and material quality inspectors.`,
    imageSrc: '/campaign/artisan_construction_billboard_ad.jpg',
    realLifePosterSrc: '/campaign/artisan_construction_billboard_ad.jpg',
    adFormatType: 'real_life_street_poster',
    callToAction: 'Inspect Public Works Signboard',
    ctaType: 'specs',
    ctaValue: 'transit_preview',
    specs: `Active Worksite Billboard & Reflective Safety Signage · ${spec.countryName}`,
    highlights: [
      `Installed along active municipal and national highways corridors`,
      `Mobilizes technical artisans to document concrete mix quality, asphalt thickness, and delayed culverts`,
      `Direct link to Contractor Watchdog Vault for verified civil inspection bounties`,
    ],
    sponsorName: `CivicDuty Infrastructure Workmanship Watch · ${spec.countryName}`,
    targetAudience: `Masons, Civil Technicians, Plumbers, Electricians & Engineering Apprentices`,
    published: true,
    postedAt: '2026-10-11',
    impressions: 37900,
    clicks: 4990,
  };

  return [busAd, trainAd, stageAd, marketAd, taxiAd, healthAd, teacherAd, artisanAd];
}

export const INITIAL_PROMOTIONAL_ADS: CdOpsPromotionalAd[] = getCountryPromotionalAds('UG');

