import { LanguageCode } from '../types';

export interface Translations {
  motto: string;
  mottoSub: string;
  citizenPortal: string;
  citizenDesc: string;
  govDesk: string;
  govDesc: string;
  entityHub: string;
  entityDesc: string;
  dialUssd: string;
  architecture: string;
  feed: string;
  depts: string;
  compose: string;
  profile: string;
  contracts: string;
  reports: string;
  resolved: string;
  corruption: string;
  nations: string;
  offline: string;
  online: string;
  syncPending: string;
  verifySeal: string;
  confirmResolution: string;
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  EN: {
    motto: 'Speak. Serve. Be Heard.',
    mottoSub: 'Free · Sovereign Civic Operating Infrastructure',
    citizenPortal: 'Citizen Portal',
    citizenDesc: 'Onboard ID, Parish & Live Feed',
    govDesk: 'Gov Desk',
    govDesc: 'Civil Servants & Admins',
    entityHub: 'Entity Hub',
    entityDesc: 'Businesses & NGOs',
    dialUssd: 'Dial *3030# (USSD)',
    architecture: 'Architecture & Pitch',
    feed: 'Civic Feed',
    depts: 'Departments',
    compose: 'Speak',
    profile: 'Identity',
    contracts: 'Contracts',
    reports: 'Reports',
    resolved: 'Resolved',
    corruption: 'Corruption',
    nations: 'Nations',
    offline: 'Offline Mode',
    online: 'Live Connected',
    syncPending: 'Sync Pending',
    verifySeal: 'Verify Seal',
    confirmResolution: 'Confirm Resolution',
  },
  LG: {
    motto: 'Yogera. Wereza. Wulirwa.',
    mottoSub: 'Kya Bwerere · Obuvunaanyizibwa Bw’omutuuze',
    citizenPortal: 'Omuryango Gw’Omutuuze',
    citizenDesc: 'Yingiza Ndaga Muntu, Omuluka & Ebyogerwa',
    govDesk: 'Ekitongole kya Gavumenti',
    govDesc: 'Abakozi ba Gavumenti & Abakungu',
    entityHub: 'Ebitongole By’obwannannyini',
    entityDesc: 'Amakampuni, Eby’obulamu & NGOs',
    dialUssd: 'Kuba *3030# (USSD)',
    architecture: 'Entekateeka y’Omusingi',
    feed: 'Ebyogerwa mu Ggwanga',
    depts: 'Ebitongole',
    compose: 'Yogera',
    profile: 'Ebikukwatako',
    contracts: 'Endagaano z’Enguudo',
    reports: 'Emiranga',
    resolved: 'Ebigonjoddwa',
    corruption: 'Enguzi',
    nations: 'Amawanga',
    offline: 'Tolina Yintaneeti',
    online: 'Oli Ku Yintaneeti',
    syncPending: 'Ebikolebwa Byongeddwako',
    verifySeal: 'Kakasa Akabonero',
    confirmResolution: 'Kakasa nti Kimaze Okukolebwa',
  },
  SW: {
    motto: 'Sema. Tumikia. Sikika.',
    mottoSub: 'Bure · Miundombinu ya Uwajibikaji wa Raia',
    citizenPortal: 'Lango la Mwananchi',
    citizenDesc: 'Sajili Kitambulisho, Kata & Taarifa za Moja kwa Moja',
    govDesk: 'Dawati la Serikali',
    govDesc: 'Watumishi wa Umma & Wasimamizi',
    entityHub: 'Kituo cha Mashirika',
    entityDesc: 'Biashara, Mashirika & NGOs',
    dialUssd: 'Piga *3030# (USSD)',
    architecture: 'Muundo & Mkakati',
    feed: 'Ukurasa wa Taarifa',
    depts: 'Idara za Umma',
    compose: 'Ripoti',
    profile: 'Wasifu & Cheo',
    contracts: 'Mikataba ya Umma',
    reports: 'Ripoti',
    resolved: 'Yaliyotatuliwa',
    corruption: 'Ufisadi',
    nations: 'Nchi Wanachama',
    offline: 'Hali ya Nje ya Mtandao',
    online: 'Imeunganishwa Mtandaoni',
    syncPending: 'Kutuma Ripoti Zilizosubiri',
    verifySeal: 'Thibitisha Muhuri',
    confirmResolution: 'Thibitisha Utatuzi',
  },
  RW: {
    motto: 'Vuga. Kora. Umvikane.',
    mottoSub: 'Ubuntu · Uburyo bwo Gukurikirana Imikorere y’Umuturage',
    citizenPortal: 'Uruhande rw’Umuturage',
    citizenDesc: 'Injiza Indangamuntu, Umurenge & Amakuru',
    govDesk: 'Ibiro by’Ubuyobozi',
    govDesc: 'Abakozi ba Leta n’Abayobozi',
    entityHub: 'Ikigo cy’Ubucuruzi',
    entityDesc: 'Ibigo by’Abikorera n’Imiryango',
    dialUssd: 'Kanda *3030# (USSD)',
    architecture: 'Imiterere y’Uburyo',
    feed: 'Amakuru Mashya',
    depts: 'Inzego',
    compose: 'Tanga Raporo',
    profile: 'Umwirondoro',
    contracts: 'Amasezerano y’Ibikorwa',
    reports: 'Raporo',
    resolved: 'Byakemutse',
    corruption: 'Ruswa',
    nations: 'Ibihugu',
    offline: 'Nta Murongo',
    online: 'Biri ku Murongo',
    syncPending: 'Guhuza Raporo Zitegereje',
    verifySeal: 'Genzura Ikimenyetso',
    confirmResolution: 'Emeza ko Byakemutse',
  },
};
