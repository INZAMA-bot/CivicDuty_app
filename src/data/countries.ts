import { CountryCode, CountryInfo, Department, TerritoryNode } from '../types';
export { getDept, allDepts } from '../utils/helpers';

export const COUNTRIES: Record<string, CountryInfo> = {
  // Africa Primary
  UG: { name: 'Uganda', node: 'UG_NODE_01', id_label: 'National ID No.', id_ph: 'CM9000XXXXXXXXXXX', flag: '🇺🇬', currency: 'UGX' },
  KE: { name: 'Kenya', node: 'KE_NODE_02', id_label: 'National ID Number', id_ph: '12345678', flag: '🇰🇪', currency: 'KES' },
  NG: { name: 'Nigeria', node: 'NG_NODE_05', id_label: 'NIN (11 digits)', id_ph: '12345678901', flag: '🇳🇬', currency: 'NGN' },
  GH: { name: 'Ghana', node: 'GH_NODE_03', id_label: 'Ghana Card No.', id_ph: 'GHA-XXXXXXXXX-X', flag: '🇬🇭', currency: 'GHS' },
  RW: { name: 'Rwanda', node: 'RW_NODE_04', id_label: 'National ID No.', id_ph: '1 XXXX X XXXXXXX X XX', flag: '🇷🇼', currency: 'RWF' },
  TZ: { name: 'Tanzania', node: 'TZ_NODE_06', id_label: 'NIDA Card No.', id_ph: '19900101-12345-00001-12', flag: '🇹🇿', currency: 'TZS' },
  ZA: { name: 'South Africa', node: 'ZA_NODE_07', id_label: 'SA ID Number', id_ph: '9001010000080', flag: '🇿🇦', currency: 'ZAR' },
  ET: { name: 'Ethiopia', node: 'ET_NODE_08', id_label: 'Fayda ID Number', id_ph: 'ET-9000-123456', flag: '🇪🇹', currency: 'ETB' },
  EG: { name: 'Egypt', node: 'EG_NODE_09', id_label: 'National ID (14 digits)', id_ph: '29801011234567', flag: '🇪🇬', currency: 'EGP' },
  SN: { name: 'Senegal', node: 'SN_NODE_10', id_label: 'Carte CEDEAO / NINEA', id_ph: '1 750 1990 12345', flag: '🇸🇳', currency: 'XOF' },
  ZM: { name: 'Zambia', node: 'ZM_NODE_11', id_label: 'NRC Number', id_ph: '123456/11/1', flag: '🇿🇲', currency: 'ZMW' },
  ZW: { name: 'Zimbabwe', node: 'ZW_NODE_12', id_label: 'National ID No.', id_ph: '63-123456 A 63', flag: '🇿🇼', currency: 'ZWG' },
  AO: { name: 'Angola', node: 'AO_NODE_16', id_label: 'BI / NIF Number', id_ph: '000123456LA012', flag: '🇦🇴' },
  BJ: { name: 'Benin', node: 'BJ_NODE_17', id_label: 'Numéro NPI / CIP', id_ph: '1234567890', flag: '🇧🇯' },
  BW: { name: 'Botswana', node: 'BW_NODE_18', id_label: 'Omang ID Card', id_ph: '123412345', flag: '🇧🇼' },
  BF: { name: 'Burkina Faso', node: 'BF_NODE_19', id_label: 'CNIB Card No.', id_ph: 'B1234567', flag: '🇧🇫' },
  BI: { name: 'Burundi', node: 'BI_NODE_20', id_label: 'Carte Nationale d\'Identité', id_ph: '123456/90', flag: '🇧🇮' },
  CM: { name: 'Cameroon', node: 'CM_NODE_21', id_label: 'CNI Number', id_ph: '112233445', flag: '🇨🇲' },
  CV: { name: 'Cape Verde', node: 'CV_NODE_22', id_label: 'CNI / Passaporte', id_ph: '1234567', flag: '🇨🇻' },
  CF: { name: 'Central African Republic', node: 'CF_NODE_23', id_label: 'Carte d\'Identité', id_ph: '12345678', flag: '🇨🇫' },
  TD: { name: 'Chad', node: 'TD_NODE_24', id_label: 'Carte d\'Identité Nationale', id_ph: '123456789', flag: '🇹🇩' },
  KM: { name: 'Comoros', node: 'KM_NODE_25', id_label: 'CNI Comores', id_ph: '1234567', flag: '🇰🇲' },
  CG: { name: 'Congo (Brazzaville)', node: 'CG_NODE_26', id_label: 'CNI Congo', id_ph: '123456789', flag: '🇨🇬' },
  CD: { name: 'Congo (DRC)', node: 'CD_NODE_27', id_label: 'Carte d\'Electeur / CNI', id_ph: '12345678901', flag: '🇨🇩' },
  CI: { name: 'Côte d\'Ivoire', node: 'CI_NODE_28', id_label: 'NNI / Carte CNI', id_ph: 'C0012345678', flag: '🇨🇮' },
  DJ: { name: 'Djibouti', node: 'DJ_NODE_29', id_label: 'CNI Djibouti', id_ph: '1234567', flag: '🇩🇯' },
  GQ: { name: 'Equatorial Guinea', node: 'GQ_NODE_30', id_label: 'DNI Guinea Ecuatorial', id_ph: '12345678', flag: '🇬🇶' },
  ER: { name: 'Eritrea', node: 'ER_NODE_31', id_label: 'National ID Card', id_ph: '12345678', flag: '🇪🇷' },
  SZ: { name: 'Eswatini', node: 'SZ_NODE_32', id_label: 'National ID Number', id_ph: '900101000', flag: '🇸🇿' },
  GA: { name: 'Gabon', node: 'GA_NODE_33', id_label: 'CNI Gabon', id_ph: '123456789', flag: '🇬🇦' },
  GM: { name: 'Gambia', node: 'GM_NODE_34', id_label: 'Gambia National ID', id_ph: '12345678', flag: '🇬🇲' },
  GN: { name: 'Guinea', node: 'GN_NODE_35', id_label: 'CNI Guinée', id_ph: '123456789', flag: '🇬🇳' },
  GW: { name: 'Guinea-Bissau', node: 'GW_NODE_36', id_label: 'Bilhete de Identidade', id_ph: '1234567', flag: '🇬🇼' },
  LS: { name: 'Lesotho', node: 'LS_NODE_37', id_label: 'National ID Number', id_ph: '123456789', flag: '🇱🇸' },
  LR: { name: 'Liberia', node: 'LR_NODE_38', id_label: 'NIR National ID', id_ph: '12345678', flag: '🇱🇷' },
  LY: { name: 'Libya', node: 'LY_NODE_39', id_label: 'National ID (NID)', id_ph: '119900123456', flag: '🇱🇾' },
  MG: { name: 'Madagascar', node: 'MG_NODE_40', id_label: 'CIN Madagascar', id_ph: '101 234 567 890', flag: '🇲🇬' },
  MW: { name: 'Malawi', node: 'MW_NODE_41', id_label: 'National ID Number', id_ph: 'A1B2C3D4', flag: '🇲🇼' },
  ML: { name: 'Mali', node: 'ML_NODE_42', id_label: 'NINA Card Number', id_ph: '12345678901234', flag: '🇲🇱' },
  MR: { name: 'Mauritania', node: 'MR_NODE_43', id_label: 'NNI Mauritanie', id_ph: '1234567890', flag: '🇲🇷' },
  MU: { name: 'Mauritius', node: 'MU_NODE_44', id_label: 'National Identity Card', id_ph: 'A123456789012B', flag: '🇲🇺' },
  MA: { name: 'Morocco', node: 'MA_NODE_45', id_label: 'CNIE Maroc', id_ph: 'AB123456', flag: '🇲🇦' },
  MZ: { name: 'Mozambique', node: 'MZ_NODE_46', id_label: 'BI Moçambique', id_ph: '123456789012A', flag: '🇲🇿' },
  NA: { name: 'Namibia', node: 'NA_NODE_47', id_label: 'Namibian ID Card', id_ph: '90010100123', flag: '🇳🇦' },
  NE: { name: 'Niger', node: 'NE_NODE_48', id_label: 'CNI Niger', id_ph: '123456789', flag: '🇳🇪' },
  ST: { name: 'São Tomé and Príncipe', node: 'ST_NODE_49', id_label: 'Cartão de Cidadão', id_ph: '1234567', flag: '🇸🇹' },
  SC: { name: 'Seychelles', node: 'SC_NODE_50', id_label: 'NIN Seychelles', id_ph: '900-1234-1-1-00', flag: '🇸🇨' },
  SL: { name: 'Sierra Leone', node: 'SL_NODE_51', id_label: 'NCRA National ID', id_ph: '1234567890', flag: '🇸🇱' },
  SO: { name: 'Somalia', node: 'SO_NODE_52', id_label: 'National ID Card', id_ph: '1234567890', flag: '🇸🇴' },
  SS: { name: 'South Sudan', node: 'SS_NODE_53', id_label: 'National ID Number', id_ph: '123456789', flag: '🇸🇸' },
  SD: { name: 'Sudan', node: 'SD_NODE_54', id_label: 'National Number', id_ph: '12345678901', flag: '🇸🇩' },
  TG: { name: 'Togo', node: 'TG_NODE_55', id_label: 'Carte Nationale d\'Identité', id_ph: '123456789', flag: '🇹🇬' },
  TN: { name: 'Tunisia', node: 'TN_NODE_56', id_label: 'CIN Tunisie', id_ph: '01234567', flag: '🇹🇳' },

  // Americas & Caribbean
  US: { name: 'United States', node: 'US_NODE_13', id_label: "Driver's License / SSN", id_ph: 'A1234567', flag: '🇺🇸' },
  CA: { name: 'Canada', node: 'CA_NODE_57', id_label: 'SIN / Driver License', id_ph: '123-456-789', flag: '🇨🇦' },
  MX: { name: 'Mexico', node: 'MX_NODE_58', id_label: 'CURP / INE Clave', id_ph: 'ABCD900101HDFXXX00', flag: '🇲🇽' },
  BR: { name: 'Brazil', node: 'BR_NODE_59', id_label: 'CPF / RG Number', id_ph: '123.456.789-00', flag: '🇧🇷' },
  AR: { name: 'Argentina', node: 'AR_NODE_60', id_label: 'DNI Argentina', id_ph: '12.345.678', flag: '🇦🇷' },
  CL: { name: 'Chile', node: 'CL_NODE_61', id_label: 'RUT / RUN Number', id_ph: '12.345.678-K', flag: '🇨🇱' },
  CO: { name: 'Colombia', node: 'CO_NODE_62', id_label: 'Cédula de Ciudadanía', id_ph: '1.234.567.890', flag: '🇨🇴' },
  PE: { name: 'Peru', node: 'PE_NODE_63', id_label: 'DNI Peru', id_ph: '12345678', flag: '🇵🇪' },
  VE: { name: 'Venezuela', node: 'VE_NODE_64', id_label: 'Cédula de Identidad', id_ph: 'V-12.345.678', flag: '🇻🇪' },
  EC: { name: 'Ecuador', node: 'EC_NODE_65', id_label: 'Cédula de Identidad', id_ph: '1712345678', flag: '🇪🇨' },
  JM: { name: 'Jamaica', node: 'JM_NODE_66', id_label: 'TRN Number', id_ph: '123-456-789', flag: '🇯🇲' },
  HT: { name: 'Haiti', node: 'HT_NODE_67', id_label: 'NIF / CIN Haiti', id_ph: '000-000-000-0', flag: '🇭🇹' },
  TT: { name: 'Trinidad and Tobago', node: 'TT_NODE_68', id_label: 'National ID Card', id_ph: '19900101012', flag: '🇹🇹' },

  // Europe & Central Asia
  GB: { name: 'United Kingdom', node: 'GB_NODE_14', id_label: 'National Insurance No.', id_ph: 'QQ 12 34 56 A', flag: '🇬🇧' },
  DE: { name: 'Germany', node: 'DE_NODE_69', id_label: 'Personalausweis ID', id_ph: 'T22000129', flag: '🇩🇪' },
  FR: { name: 'France', node: 'FR_NODE_70', id_label: 'Numéro Sécurité Sociale / CNI', id_ph: '1 90 01 75 123 456 78', flag: '🇫🇷' },
  IT: { name: 'Italy', node: 'IT_NODE_71', id_label: 'Codice Fiscale', id_ph: 'RSSMRA80A01H501U', flag: '🇮🇹' },
  ES: { name: 'Spain', node: 'ES_NODE_72', id_label: 'DNI / NIE Number', id_ph: '12345678Z', flag: '🇪🇸' },
  NL: { name: 'Netherlands', node: 'NL_NODE_73', id_label: 'BSN (Burgerservicenummer)', id_ph: '123456789', flag: '🇳🇱' },
  SE: { name: 'Sweden', node: 'SE_NODE_74', id_label: 'Personnummer', id_ph: '19900101-1234', flag: '🇸🇪' },
  NO: { name: 'Norway', node: 'NO_NODE_75', id_label: 'Fødselsnummer', id_ph: '01019012345', flag: '🇳🇴' },
  FI: { name: 'Finland', node: 'FI_NODE_76', id_label: 'Henkilötunnus (HETU)', id_ph: '010190-123A', flag: '🇫🇮' },
  DK: { name: 'Denmark', node: 'DK_NODE_77', id_label: 'CPR-nummer', id_ph: '010190-1234', flag: '🇩🇰' },
  PL: { name: 'Poland', node: 'PL_NODE_78', id_label: 'PESEL Number', id_ph: '90010112345', flag: '🇵🇱' },
  UA: { name: 'Ukraine', node: 'UA_NODE_79', id_label: 'Tax ID / Passport No.', id_ph: '1234567890', flag: '🇺🇦' },
  IE: { name: 'Ireland', node: 'IE_NODE_80', id_label: 'PPS Number', id_ph: '1234567T', flag: '🇮🇪' },
  CH: { name: 'Switzerland', node: 'CH_NODE_81', id_label: 'AHV / NAVS13 Number', id_ph: '756.1234.5678.90', flag: '🇨🇭' },
  AT: { name: 'Austria', node: 'AT_NODE_82', id_label: 'Sozialversicherungsnummer', id_ph: '1234 010190', flag: '🇦🇹' },
  BE: { name: 'Belgium', node: 'BE_NODE_83', id_label: 'Rijksregisternummer', id_ph: '90.01.01-123.45', flag: '🇧🇪' },
  PT: { name: 'Portugal', node: 'PT_NODE_84', id_label: 'NIF / Cartão de Cidadão', id_ph: '12345678 9 ZZ1', flag: '🇵🇹' },
  GR: { name: 'Greece', node: 'GR_NODE_85', id_label: 'AMKA / AMDA', id_ph: '01019012345', flag: '🇬🇷' },
  TR: { name: 'Türkiye', node: 'TR_NODE_86', id_label: 'T.C. Kimlik No', id_ph: '12345678901', flag: '🇹🇷' },

  // Middle East & Asia Pacific
  IN: { name: 'India', node: 'IN_NODE_15', id_label: 'Aadhaar Number (12 digits)', id_ph: '1234 5678 9012', flag: '🇮🇳' },
  PK: { name: 'Pakistan', node: 'PK_NODE_87', id_label: 'CNIC Number', id_ph: '61101-1234567-1', flag: '🇵🇰' },
  BD: { name: 'Bangladesh', node: 'BD_NODE_88', id_label: 'Smart NID Card', id_ph: '1234567890', flag: '🇧🇩' },
  CN: { name: 'China', node: 'CN_NODE_89', id_label: 'Resident ID Card', id_ph: '110101199001011234', flag: '🇨🇳' },
  JP: { name: 'Japan', node: 'JP_NODE_90', id_label: 'My Number Card', id_ph: '1234 5678 9012', flag: '🇯🇵' },
  KR: { name: 'South Korea', node: 'KR_NODE_91', id_label: 'RRN (Resident Reg. No.)', id_ph: '900101-1234567', flag: '🇰🇷' },
  ID: { name: 'Indonesia', node: 'ID_NODE_92', id_label: 'NIK / KTP Number', id_ph: '3171010101900001', flag: '🇮🇩' },
  PH: { name: 'Philippines', node: 'PH_NODE_93', id_label: 'PhilSys National ID', id_ph: '1234-5678-9012', flag: '🇵🇭' },
  VN: { name: 'Vietnam', node: 'VN_NODE_94', id_label: 'CCCD / Citizen ID', id_ph: '001090123456', flag: '🇻🇳' },
  TH: { name: 'Thailand', node: 'TH_NODE_95', id_label: 'Thai National ID Card', id_ph: '1 2345 67890 12 3', flag: '🇹🇭' },
  MY: { name: 'Malaysia', node: 'MY_NODE_96', id_label: 'MyKad Number', id_ph: '900101-14-1234', flag: '🇲🇾' },
  SG: { name: 'Singapore', node: 'SG_NODE_97', id_label: 'NRIC / FIN Number', id_ph: 'S1234567A', flag: '🇸🇬' },
  AE: { name: 'United Arab Emirates', node: 'AE_NODE_98', id_label: 'Emirates ID Card', id_ph: '784-1990-1234567-1', flag: '🇦🇪' },
  SA: { name: 'Saudi Arabia', node: 'SA_NODE_99', id_label: 'Iqama / National ID', id_ph: '1012345678', flag: '🇸🇦' },
  QA: { name: 'Qatar', node: 'QA_NODE_100', id_label: 'QID Qatar ID', id_ph: '29012345678', flag: '🇶🇦' },
  AU: { name: 'Australia', node: 'AU_NODE_101', id_label: 'Driver License / Medicare', id_ph: '12345678', flag: '🇦🇺', currency: 'AUD' },
  NZ: { name: 'New Zealand', node: 'NZ_NODE_102', id_label: 'NHI / Driver Licence', id_ph: 'ABC1234', flag: '🇳🇿', currency: 'NZD' },

  // Additional Africa
  DZ: { name: 'Algeria', node: 'DZ_NODE_103', id_label: 'NIN Algérie', id_ph: '199012345678', flag: '🇩🇿', currency: 'DZD' },

  // Additional Americas & Caribbean
  BO: { name: 'Bolivia', node: 'BO_NODE_104', id_label: 'Cédula de Identidad', id_ph: '1234567 LP', flag: '🇧🇴', currency: 'BOB' },
  PY: { name: 'Paraguay', node: 'PY_NODE_105', id_label: 'Cédula de Identidad Civil', id_ph: '1.234.567', flag: '🇵🇾', currency: 'PYG' },
  UY: { name: 'Uruguay', node: 'UY_NODE_106', id_label: 'Cédula de Identidad', id_ph: '1.234.567-8', flag: '🇺🇾', currency: 'UYU' },
  GY: { name: 'Guyana', node: 'GY_NODE_107', id_label: 'National ID Card', id_ph: '123456789', flag: '🇬🇾', currency: 'GYD' },
  SR: { name: 'Suriname', node: 'SR_NODE_108', id_label: 'ID-kaart', id_ph: 'FA123456', flag: '🇸🇷', currency: 'SRD' },
  BZ: { name: 'Belize', node: 'BZ_NODE_109', id_label: 'Social Security Card', id_ph: '123-456-789', flag: '🇧🇿', currency: 'BZD' },
  CR: { name: 'Costa Rica', node: 'CR_NODE_110', id_label: 'Cédula de Identidad', id_ph: '1-1234-0567', flag: '🇨🇷', currency: 'CRC' },
  SV: { name: 'El Salvador', node: 'SV_NODE_111', id_label: 'DUI (Documento Único)', id_ph: '01234567-8', flag: '🇸🇻', currency: 'USD' },
  GT: { name: 'Guatemala', node: 'GT_NODE_112', id_label: 'DPI (Documento Personal)', id_ph: '1234 56789 0101', flag: '🇬🇹', currency: 'GTQ' },
  HN: { name: 'Honduras', node: 'HN_NODE_113', id_label: 'DNI Honduras', id_ph: '0801-1990-12345', flag: '🇭🇳', currency: 'HNL' },
  NI: { name: 'Nicaragua', node: 'NI_NODE_114', id_label: 'Cédula de Identidad', id_ph: '001-010190-0001A', flag: '🇳🇮', currency: 'NIO' },
  PA: { name: 'Panama', node: 'PA_NODE_115', id_label: 'Cédula de Identidad', id_ph: '8-123-4567', flag: '🇵🇦', currency: 'PAB' },
  CU: { name: 'Cuba', node: 'CU_NODE_116', id_label: 'Carné de Identidad', id_ph: '90010112345', flag: '🇨🇺', currency: 'CUP' },
  DO: { name: 'Dominican Republic', node: 'DO_NODE_117', id_label: 'Cédula de Identidad', id_ph: '001-1234567-8', flag: '🇩🇴', currency: 'DOP' },
  BS: { name: 'Bahamas', node: 'BS_NODE_118', id_label: 'National Insurance Card', id_ph: '12345678', flag: '🇧🇸', currency: 'BSD' },
  BB: { name: 'Barbados', node: 'BB_NODE_119', id_label: 'National ID Number', id_ph: '900101-0123', flag: '🇧🇧', currency: 'BBD' },
  AG: { name: 'Antigua and Barbuda', node: 'AG_NODE_120', id_label: 'National ID / Passport', id_ph: 'AB123456', flag: '🇦🇬', currency: 'XCD' },
  DM: { name: 'Dominica', node: 'DM_NODE_121', id_label: 'National ID', id_ph: 'DM123456', flag: '🇩🇲', currency: 'XCD' },
  GD: { name: 'Grenada', node: 'GD_NODE_122', id_label: 'National Insurance Card', id_ph: '123456', flag: '🇬🇩', currency: 'XCD' },
  KN: { name: 'Saint Kitts and Nevis', node: 'KN_NODE_123', id_label: 'Social Security Number', id_ph: '123456', flag: '🇰🇳', currency: 'XCD' },
  LC: { name: 'Saint Lucia', node: 'LC_NODE_124', id_label: 'National ID Card', id_ph: '123456789', flag: '🇱🇨', currency: 'XCD' },
  VC: { name: 'Saint Vincent & Grenadines', node: 'VC_NODE_125', id_label: 'National ID', id_ph: '123456', flag: '🇻🇨', currency: 'XCD' },

  // Additional Europe
  AL: { name: 'Albania', node: 'AL_NODE_126', id_label: 'Letërnjoftim ID', id_ph: 'A01234567B', flag: '🇦🇱', currency: 'ALL' },
  AD: { name: 'Andorra', node: 'AD_NODE_127', id_label: 'DNI Andorrà', id_ph: '123456A', flag: '🇦🇩', currency: 'EUR' },
  AM: { name: 'Armenia', node: 'AM_NODE_128', id_label: 'National ID Card', id_ph: '123456789', flag: '🇦🇲', currency: 'AMD' },
  AZ: { name: 'Azerbaijan', node: 'AZ_NODE_129', id_label: 'Şəxsiyyət Vəsiqəsi', id_ph: 'AZE12345678', flag: '🇦🇿', currency: 'AZN' },
  BY: { name: 'Belarus', node: 'BY_NODE_130', id_label: 'Passport ID No.', id_ph: 'AB1234567', flag: '🇧🇾', currency: 'BYN' },
  BA: { name: 'Bosnia and Herzegovina', node: 'BA_NODE_131', id_label: 'JMBG', id_ph: '0101990123456', flag: '🇧🇦', currency: 'BAM' },
  BG: { name: 'Bulgaria', node: 'BG_NODE_132', id_label: 'EGN (ЕГН)', id_ph: '9001011234', flag: '🇧🇬', currency: 'BGN' },
  HR: { name: 'Croatia', node: 'HR_NODE_133', id_label: 'OIB Number', id_ph: '12345678901', flag: '🇭🇷', currency: 'EUR' },
  CY: { name: 'Cyprus', node: 'CY_NODE_134', id_label: 'Identity Card No.', id_ph: '123456', flag: '🇨🇾', currency: 'EUR' },
  CZ: { name: 'Czech Republic', node: 'CZ_NODE_135', id_label: 'Rodné číslo / Občanský průkaz', id_ph: '900101/1234', flag: '🇨🇿', currency: 'CZK' },
  EE: { name: 'Estonia', node: 'EE_NODE_136', id_label: 'Isikukood', id_ph: '39001011234', flag: '🇪🇪', currency: 'EUR' },
  GE: { name: 'Georgia', node: 'GE_NODE_137', id_label: 'Personal Number', id_ph: '01019012345', flag: '🇬🇪', currency: 'GEL' },
  HU: { name: 'Hungary', node: 'HU_NODE_138', id_label: 'Személyi igazolvány', id_ph: '123456AB', flag: '🇭🇺', currency: 'HUF' },
  IS: { name: 'Iceland', node: 'IS_NODE_139', id_label: 'Kennitala', id_ph: '010190-1239', flag: '🇮🇸', currency: 'ISK' },
  XK: { name: 'Kosovo', node: 'XK_NODE_140', id_label: 'Letërnjoftim Kosovë', id_ph: '1001234567', flag: '🇽🇰', currency: 'EUR' },
  LV: { name: 'Latvia', node: 'LV_NODE_141', id_label: 'Personas kods', id_ph: '010190-12345', flag: '🇱🇻', currency: 'EUR' },
  LI: { name: 'Liechtenstein', node: 'LI_NODE_142', id_label: 'Identitätskarte', id_ph: '123456', flag: '🇱🇮', currency: 'CHF' },
  LT: { name: 'Lithuania', node: 'LT_NODE_143', id_label: 'Asmens kodas', id_ph: '39001011234', flag: '🇱🇹', currency: 'EUR' },
  LU: { name: 'Luxembourg', node: 'LU_NODE_144', id_label: 'Numéro matricule', id_ph: '1990 0101 123 45', flag: '🇱🇺', currency: 'EUR' },
  MT: { name: 'Malta', node: 'MT_NODE_145', id_label: 'Identity Card Number', id_ph: '123456M', flag: '🇲🇹', currency: 'EUR' },
  MD: { name: 'Moldova', node: 'MD_NODE_146', id_label: 'IDNP', id_ph: '2001234567890', flag: '🇲🇩', currency: 'MDL' },
  MC: { name: 'Monaco', node: 'MC_NODE_147', id_label: 'Carte d\'Identité', id_ph: '123456', flag: '🇲🇨', currency: 'EUR' },
  ME: { name: 'Montenegro', node: 'ME_NODE_148', id_label: 'JMBG', id_ph: '0101990123456', flag: '🇲🇪', currency: 'EUR' },
  MK: { name: 'North Macedonia', node: 'MK_NODE_149', id_label: 'EMBG', id_ph: '0101990123456', flag: '🇲🇰', currency: 'MKD' },
  RO: { name: 'Romania', node: 'RO_NODE_150', id_label: 'CNP (Cod Numeric Personal)', id_ph: '1900101123456', flag: '🇷🇴', currency: 'RON' },
  SM: { name: 'San Marino', node: 'SM_NODE_151', id_label: 'Carta d\'Identità', id_ph: '12345', flag: '🇸🇲', currency: 'EUR' },
  RS: { name: 'Serbia', node: 'RS_NODE_152', id_label: 'JMBG', id_ph: '0101990123456', flag: '🇷🇸', currency: 'RSD' },
  SK: { name: 'Slovakia', node: 'SK_NODE_153', id_label: 'Rodné číslo', id_ph: '900101/1234', flag: '🇸🇰', currency: 'EUR' },
  SI: { name: 'Slovenia', node: 'SI_NODE_154', id_label: 'EMŠO', id_ph: '0101990500123', flag: '🇸🇮', currency: 'EUR' },
  VA: { name: 'Vatican City', node: 'VA_NODE_155', id_label: 'Cittadinanza Vaticana', id_ph: 'VA-1234', flag: '🇻🇦', currency: 'EUR' },

  // Middle East
  BH: { name: 'Bahrain', node: 'BH_NODE_156', id_label: 'CPR Number', id_ph: '900112345', flag: '🇧🇭', currency: 'BHD' },
  IQ: { name: 'Iraq', node: 'IQ_NODE_157', id_label: 'National Card ID', id_ph: '199012345678', flag: '🇮🇶', currency: 'IQD' },
  IL: { name: 'Israel', node: 'IL_NODE_158', id_label: 'Teudat Zehut', id_ph: '012345678', flag: '🇮🇱', currency: 'ILS' },
  JO: { name: 'Jordan', node: 'JO_NODE_159', id_label: 'National ID Number', id_ph: '9901012345', flag: '🇯🇴', currency: 'JOD' },
  KW: { name: 'Kuwait', node: 'KW_NODE_160', id_label: 'Civil ID Number', id_ph: '290010112345', flag: '🇰🇼', currency: 'KWD' },
  LB: { name: 'Lebanon', node: 'LB_NODE_161', id_label: 'Carte d\'Identité', id_ph: '12345678', flag: '🇱🇧', currency: 'LBP' },
  OM: { name: 'Oman', node: 'OM_NODE_162', id_label: 'Civil Number', id_ph: '12345678', flag: '🇴🇲', currency: 'OMR' },
  PS: { name: 'Palestine', node: 'PS_NODE_163', id_label: 'Hawiyya ID', id_ph: '912345678', flag: '🇵🇸', currency: 'ILS' },
  SY: { name: 'Syria', node: 'SY_NODE_164', id_label: 'National Number', id_ph: '01010012345', flag: '🇸🇾', currency: 'SYP' },
  YE: { name: 'Yemen', node: 'YE_NODE_165', id_label: 'National Number', id_ph: '01010123456', flag: '🇾🇪', currency: 'YER' },
  IR: { name: 'Iran', node: 'IR_NODE_166', id_label: 'National ID Card', id_ph: '0012345678', flag: '🇮🇷', currency: 'IRR' },

  // Asia
  AF: { name: 'Afghanistan', node: 'AF_NODE_167', id_label: 'Tazkira National ID', id_ph: '1234-5678-9012', flag: '🇦🇫', currency: 'AFN' },
  BT: { name: 'Bhutan', node: 'BT_NODE_168', id_label: 'Citizenship ID Card', id_ph: '11201001234', flag: '🇧🇹', currency: 'BTN' },
  BN: { name: 'Brunei', node: 'BN_NODE_169', id_label: 'Smart Identity Card', id_ph: '00-123456', flag: '🇧🇳', currency: 'BND' },
  KH: { name: 'Cambodia', node: 'KH_NODE_170', id_label: 'Khmer Identity Card', id_ph: '012345678', flag: '🇰🇭', currency: 'KHR' },
  KZ: { name: 'Kazakhstan', node: 'KZ_NODE_171', id_label: 'IIN (ИИН)', id_ph: '900101300123', flag: '🇰🇿', currency: 'KZT' },
  KG: { name: 'Kyrgyzstan', node: 'KG_NODE_172', id_label: 'PIN (ПИН)', id_ph: '10101199000123', flag: '🇰🇬', currency: 'KGS' },
  LA: { name: 'Laos', node: 'LA_NODE_173', id_label: 'National ID Card', id_ph: '123456789', flag: '🇱🇦', currency: 'LAK' },
  MV: { name: 'Maldives', node: 'MV_NODE_174', id_label: 'National Identity Card', id_ph: 'A123456', flag: '🇲🇻', currency: 'MVR' },
  MN: { name: 'Mongolia', node: 'MN_NODE_175', id_label: 'Citizen ID (Регистр)', id_ph: 'УБ90010112', flag: '🇲🇳', currency: 'MNT' },
  MM: { name: 'Myanmar', node: 'MM_NODE_176', id_label: 'NRC Number', id_ph: '12/DAGAMA(N)123456', flag: '🇲🇲', currency: 'MMK' },
  NP: { name: 'Nepal', node: 'NP_NODE_177', id_label: 'Citizenship Number', id_ph: '12-01-75-12345', flag: '🇳🇵', currency: 'NPR' },
  KP: { name: 'North Korea', node: 'KP_NODE_178', id_label: 'Citizen Certificate', id_ph: 'KP-12345678', flag: '🇰🇵', currency: 'KPW' },
  LK: { name: 'Sri Lanka', node: 'LK_NODE_179', id_label: 'NIC Number', id_ph: '199001234567', flag: '🇱🇰', currency: 'LKR' },
  TJ: { name: 'Tajikistan', node: 'TJ_NODE_180', id_label: 'Passport ID', id_ph: 'A1234567', flag: '🇹🇯', currency: 'TJS' },
  TL: { name: 'Timor-Leste', node: 'TL_NODE_181', id_label: 'Bilhete de Identidade', id_ph: '1234567', flag: '🇹🇱', currency: 'USD' },
  TM: { name: 'Turkmenistan', node: 'TM_NODE_182', id_label: 'Passport Number', id_ph: 'I-AS 123456', flag: '🇹🇲', currency: 'TMT' },
  UZ: { name: 'Uzbekistan', node: 'UZ_NODE_183', id_label: 'PINFL', id_ph: '30101901234567', flag: '🇺🇿', currency: 'UZS' },
  TW: { name: 'Taiwan', node: 'TW_NODE_184', id_label: 'National ID Card', id_ph: 'A123456789', flag: '🇹🇼', currency: 'TWD' },
  HK: { name: 'Hong Kong', node: 'HK_NODE_185', id_label: 'HKID Card', id_ph: 'A123456(7)', flag: '🇭🇰', currency: 'HKD' },

  // Oceania
  FJ: { name: 'Fiji', node: 'FJ_NODE_186', id_label: 'Joint FNPF/FRCS ID', id_ph: '123456789', flag: '🇫🇯', currency: 'FJD' },
  KI: { name: 'Kiribati', node: 'KI_NODE_187', id_label: 'National ID', id_ph: 'KI-123456', flag: '🇰🇮', currency: 'AUD' },
  MH: { name: 'Marshall Islands', node: 'MH_NODE_188', id_label: 'Social Security Card', id_ph: '123-45-6789', flag: '🇲🇭', currency: 'USD' },
  FM: { name: 'Micronesia', node: 'FM_NODE_189', id_label: 'Social Security Number', id_ph: '123-45-6789', flag: '🇫🇲', currency: 'USD' },
  NR: { name: 'Nauru', node: 'NR_NODE_190', id_label: 'National ID', id_ph: 'NR-1234', flag: '🇳🇷', currency: 'AUD' },
  PW: { name: 'Palau', node: 'PW_NODE_191', id_label: 'Social Security Number', id_ph: '12-34-5678', flag: '🇵🇼', currency: 'USD' },
  PG: { name: 'Papua New Guinea', node: 'PG_NODE_192', id_label: 'NID Card', id_ph: '1001234567', flag: '🇵🇬', currency: 'PGK' },
  WS: { name: 'Samoa', node: 'WS_NODE_193', id_label: 'National ID', id_ph: 'WS-123456', flag: '🇼🇸', currency: 'WST' },
  SB: { name: 'Solomon Islands', node: 'SB_NODE_194', id_label: 'National ID', id_ph: 'SB-123456', flag: '🇸🇧', currency: 'SBD' },
  TO: { name: 'Tonga', node: 'TO_NODE_195', id_label: 'National ID Card', id_ph: 'TO-123456', flag: '🇹🇴', currency: 'TOP' },
  TV: { name: 'Tuvalu', node: 'TV_NODE_196', id_label: 'National ID', id_ph: 'TV-1234', flag: '🇹🇻', currency: 'AUD' },
  VU: { name: 'Vanuatu', node: 'VU_NODE_197', id_label: 'National ID Card', id_ph: 'VU-123456', flag: '🇻🇺', currency: 'VUV' },
};

export const TERRITORY: Record<CountryCode, TerritoryNode[]> = {
  UG: [
    {
      id: 'kla',
      name: 'Kampala District',
      children: [
        {
          id: 'nakawa',
          name: 'Nakawa Division',
          children: [
            { id: 'bukoto', name: 'Bukoto' },
            { id: 'naguru', name: 'Naguru' },
            { id: 'ntinda', name: 'Ntinda' },
            { id: 'mbuya_1', name: 'Mbuya I' },
            { id: 'mbuya_2', name: 'Mbuya II' },
            { id: 'mutungo', name: 'Mutungo' },
            { id: 'luzira', name: 'Luzira' },
            { id: 'nakawa_p', name: 'Nakawa' },
            { id: 'banda', name: 'Banda' },
            { id: 'kinawataka', name: 'Kinawataka' },
            { id: 'kulambiro', name: 'Kulambiro' },
            { id: 'kireka', name: 'Kireka' },
            { id: 'kyambogo', name: 'Kyambogo' },
            { id: 'butabika', name: 'Butabika' },
            { id: 'namuwongo', name: 'Namuwongo' },
            { id: 'kiswa', name: 'Kiswa' },
            { id: 'wantoni', name: 'Wantoni' },
            { id: 'kalinabiri', name: 'Kalinabiri' },
            { id: 'komamboga', name: 'Komamboga' },
            { id: 'kitintale', name: 'Kitintale' },
            { id: 'portbell', name: 'Port Bell' },
          ],
        },
        {
          id: 'kawempe',
          name: 'Kawempe Division',
          children: [
            { id: 'bwaise_1', name: 'Bwaise I' },
            { id: 'bwaise_2', name: 'Bwaise II' },
            { id: 'bwaise_3', name: 'Bwaise III' },
            { id: 'kazo', name: 'Kazo' },
            { id: 'mpererwe', name: 'Mpererwe' },
            { id: 'kikaya', name: 'Kikaya' },
            { id: 'kyebando', name: 'Kyebando' },
            { id: 'kawempe_p', name: 'Kawempe' },
            { id: 'tula', name: 'Tula' },
            { id: 'makerere', name: 'Makerere' },
            { id: 'makerere_uni', name: 'Makerere University' },
            { id: 'mulago_1', name: 'Mulago I' },
            { id: 'mulago_2', name: 'Mulago II' },
            { id: 'mulago_3', name: 'Mulago III' },
            { id: 'katanga', name: 'Katanga' },
            { id: 'wandegeya', name: 'Wandegeya' },
            { id: 'kasubi', name: 'Kasubi' },
            { id: 'ttula', name: 'Ttula' },
            { id: 'lufula', name: 'Lufula' },
          ],
        },
        {
          id: 'makindye',
          name: 'Makindye Division',
          children: [
            { id: 'salama', name: 'Salama Road' },
            { id: 'kibuye_p', name: 'Kibuye' },
            { id: 'nsambya_1', name: 'Nsambya I' },
            { id: 'nsambya_2', name: 'Nsambya II' },
            { id: 'gogonya', name: 'Gogonya' },
            { id: 'makindye_p', name: 'Makindye' },
            { id: 'kabalagala', name: 'Kabalagala' },
            { id: 'luwafu', name: 'Luwafu' },
            { id: 'lukuli', name: 'Lukuli' },
            { id: 'kizungu', name: 'Kizungu' },
            { id: 'katwe_1', name: 'Katwe I' },
            { id: 'katwe_2', name: 'Katwe II' },
            { id: 'kigo', name: 'Kigo' },
            { id: 'ggaba', name: 'Ggaba' },
            { id: 'buziga', name: 'Buziga' },
            { id: 'munyonyo', name: 'Munyonyo' },
            { id: 'kibuli', name: 'Kibuli' },
            { id: 'muyenga', name: 'Muyenga' },
            { id: 'tank_hill', name: 'Tank Hill' },
          ],
        },
        {
          id: 'rubaga',
          name: 'Rubaga Division',
          children: [
            { id: 'namirembe', name: 'Namirembe' },
            { id: 'nateete', name: 'Nateete' },
            { id: 'lubaga_p', name: 'Lubaga' },
            { id: 'lungujja', name: 'Lungujja' },
            { id: 'busega', name: 'Busega' },
            { id: 'mutundwe', name: 'Mutundwe' },
            { id: 'salaama', name: 'Salaama' },
            { id: 'kagugube', name: 'Kagugube' },
            { id: 'mengo', name: 'Mengo' },
            { id: 'katwe_r', name: 'Katwe Parish (Rubaga)' },
            { id: 'kisenyi_r', name: 'Kisenyi Parish (Rubaga)' },
            { id: 'kasubi_r', name: 'Kasubi Parish (Rubaga)' },
            { id: 'nabulagala', name: 'Nabulagala' },
            { id: 'nakulabye', name: 'Nakulabye' },
            { id: 'maganjo', name: 'Maganjo' },
            { id: 'bweya', name: 'Bweya' },
            { id: 'kitebi', name: 'Kitebi' },
            { id: 'bunamwaya', name: 'Bunamwaya' },
            { id: 'konge', name: 'Konge' },
          ],
        },
        {
          id: 'cbd',
          name: 'Central Division',
          children: [
            { id: 'nakasero_1', name: 'Nakasero I' },
            { id: 'nakasero_2', name: 'Nakasero II' },
            { id: 'nakasero_3', name: 'Nakasero III' },
            { id: 'kisenyi_1', name: 'Kisenyi I' },
            { id: 'kisenyi_2', name: 'Kisenyi II' },
            { id: 'kisenyi_3', name: 'Kisenyi III' },
            { id: 'mulago_cbd', name: 'Mulago Parish (Central)' },
            { id: 'kamwokya_1', name: 'Kamwokya I' },
            { id: 'kamwokya_2', name: 'Kamwokya II' },
            { id: 'kitante', name: 'Kitante' },
            { id: 'kololo', name: 'Kololo' },
            { id: 'city_east', name: 'City East' },
            { id: 'city_north', name: 'City North' },
            { id: 'old_kampala', name: 'Old Kampala' },
            { id: 'laroo_c', name: 'Laroo Parish (Central)' },
            { id: 'kasubi_c', name: 'Kasubi Parish (Central)' },
            { id: 'kabowa', name: 'Kabowa' },
            { id: 'namirembe_c', name: 'Namirembe Parish (Central)' },
            { id: 'nakivubo', name: 'Nakivubo' },
            { id: 'katwe_c', name: 'Katwe Parish (Central)' },
            { id: 'kawala', name: 'Kawala' },
            { id: 'lubiri', name: 'Lubiri' },
          ],
        },
      ],
    },
    {
      id: 'wjk',
      name: 'Wakiso District',
      children: [
        {
          id: 'kira_tc',
          name: 'Kira Town Council',
          children: [
            { id: 'kiwatule', name: 'Kiwatule Parish' },
            { id: 'mende', name: 'Mende Parish' },
            { id: 'kyaliwajjala', name: 'Kyaliwajjala Parish' },
            { id: 'kasokoso', name: 'Kasokoso Parish' },
          ],
        },
        {
          id: 'nansana_tc',
          name: 'Nansana Town Council',
          children: [
            { id: 'nansana_c', name: 'Nansana Central' },
            { id: 'nabweru', name: 'Nabweru Parish' },
            { id: 'busukuma', name: 'Busukuma Parish' },
            { id: 'ganda', name: 'Ganda Parish' },
          ],
        },
        {
          id: 'makindye_ss',
          name: 'Makindye Ssabagabo',
          children: [
            { id: 'bunga', name: 'Bunga Parish' },
            { id: 'zzana', name: 'Zzana Parish' },
            { id: 'ndejje', name: 'Ndejje Parish' },
          ],
        },
        {
          id: 'entebbe_mc',
          name: 'Entebbe Municipality',
          children: [
            { id: 'kitooro', name: 'Kitooro Parish' },
            { id: 'katabi', name: 'Katabi Parish' },
            { id: 'bugonga', name: 'Bugonga Parish' },
            { id: 'entebbe_airport', name: 'Airport Parish' },
          ],
        },
      ],
    },
    {
      id: 'mbarara_c',
      name: 'Mbarara City',
      variant: 'city',
      children: [
        {
          id: 'kakoba',
          name: 'Kakoba Division',
          children: [
            { id: 'katete', name: 'Katete' },
            { id: 'nyamityobora', name: 'Nyamityobora' },
          ],
        },
        {
          id: 'kamukuzi',
          name: 'Kamukuzi Division',
          children: [
            { id: 'boma', name: 'Boma' },
            { id: 'ruti', name: 'Ruti' },
          ],
        },
        {
          id: 'nyamitanga',
          name: 'Nyamitanga Division',
          children: [
            { id: 'katukuru', name: 'Katukuru' },
            { id: 'rwebikoona', name: 'Rwebikoona' },
          ],
        },
      ],
    },
    {
      id: 'gulu_d',
      name: 'Gulu District',
      children: [
        {
          id: 'unyama_s',
          name: 'Unyama SubCounty',
          children: [
            { id: 'unyama_p', name: 'Unyama Parish' },
            { id: 'paicho_p', name: 'Paicho Parish' },
          ],
        },
        {
          id: 'awach_s',
          name: 'Awach SubCounty',
          children: [
            { id: 'awach_p', name: 'Awach Parish' },
            { id: 'pukony_p', name: 'Pukony Parish' },
          ],
        },
        {
          id: 'patiko_s',
          name: 'Patiko SubCounty',
          children: [
            { id: 'pugwenyi_p', name: 'Pugwenyi Parish' },
            { id: 'pawel_p', name: 'Pawel Parish' },
          ],
        },
      ],
    },
    {
      id: 'gulu_c',
      name: 'Gulu City',
      variant: 'city',
      children: [
        {
          id: 'bardege',
          name: 'Bardege-Layibi Division',
          children: [
            { id: 'bardege_w', name: 'Bardege' },
            { id: 'layibi', name: 'Layibi' },
          ],
        },
        {
          id: 'pece',
          name: 'Pece-Laroo Division',
          children: [
            { id: 'pece_w', name: 'Pece' },
            { id: 'laroo', name: 'Laroo' },
          ],
        },
      ],
    },
    {
      id: 'kayunga',
      name: 'Kayunga District',
      children: [
        {
          id: 'ntenjeru_s',
          name: 'Ntenjeru SubCounty',
          children: [
            { id: 'kitimbwa', name: 'Kitimbwa Parish' },
            { id: 'nazigo', name: 'Nazigo Parish' },
          ],
        },
        {
          id: 'kayunga_tc',
          name: 'Kayunga Town Council',
          variant: 'municipal',
          children: [
            { id: 'kayunga_central', name: 'Kayunga Central' },
            { id: 'kayunga_east', name: 'Kayunga East' },
          ],
        },
      ],
    },
  ],
  KE: [
    {
      id: 'nbo',
      name: 'Nairobi County',
      children: [
        {
          id: 'wstl',
          name: 'Westlands SubCounty',
          children: [
            { id: 'kiti', name: 'Kitisuru Ward' },
            { id: 'spring', name: 'Spring Valley Ward' },
            { id: 'parklands', name: 'Parklands Ward' },
          ],
        },
        {
          id: 'lang',
          name: 'Langata SubCounty',
          children: [
            { id: 'karen', name: 'Karen Ward' },
            { id: 'nairobi_west', name: 'Nairobi West Ward' },
          ],
        },
      ],
    },
  ],
  NG: [
    {
      id: 'lag',
      name: 'Lagos State',
      children: [
        {
          id: 'ikeja',
          name: 'Ikeja LGA',
          children: [
            { id: 'opebi', name: 'Opebi Ward' },
            { id: 'oregun', name: 'Oregun Ward' },
          ],
        },
        {
          id: 'surulere',
          name: 'Surulere LGA',
          children: [
            { id: 'surulere_w', name: 'Surulere Ward' },
            { id: 'itire_ikate', name: 'Itire-Ikate Ward' },
          ],
        },
      ],
    },
  ],
  GH: [
    {
      id: 'greater_accra',
      name: 'Greater Accra Region',
      children: [
        {
          id: 'accra_metro',
          name: 'Accra Metropolitan',
          children: [
            { id: 'osu_klottey', name: 'Osu Klottey' },
            { id: 'ayawaso_c', name: 'Ayawaso Central' },
            { id: 'okaikoi_s', name: 'Okaikoi South' },
          ],
        },
        {
          id: 'tema_metro',
          name: 'Tema Metropolitan',
          children: [
            { id: 'tema_c', name: 'Tema Central' },
            { id: 'tema_e', name: 'Tema East' },
          ],
        },
      ],
    },
    {
      id: 'ashanti',
      name: 'Ashanti Region',
      children: [
        {
          id: 'kumasi_metro',
          name: 'Kumasi Metropolitan',
          children: [
            { id: 'bantama', name: 'Bantama' },
            { id: 'subin', name: 'Subin' },
          ],
        },
      ],
    },
  ],
  RW: [
    {
      id: 'kigali',
      name: 'Kigali City',
      children: [
        {
          id: 'gasabo',
          name: 'Gasabo District',
          children: [
            {
              id: 'remera',
              name: 'Remera Sector',
              children: [
                { id: 'rukiri_i', name: 'Rukiri I Cell' },
                { id: 'rukiri_ii', name: 'Rukiri II Cell' },
                { id: 'nyabisindu', name: 'Nyabisindu Cell' },
              ],
            },
            {
              id: 'kimironko',
              name: 'Kimironko Sector',
              children: [
                { id: 'bibare', name: 'Bibare Cell' },
                { id: 'kibagabaga', name: 'Kibagabaga Cell' },
              ],
            },
            {
              id: 'kacyiru',
              name: 'Kacyiru Sector',
              children: [
                { id: 'kamatamu', name: 'Kamatamu Cell' },
                { id: 'kamutwa', name: 'Kamutwa Cell' },
              ],
            },
          ],
        },
        {
          id: 'nyarugenge',
          name: 'Nyarugenge District',
          children: [
            {
              id: 'nyamirambo',
              name: 'Nyamirambo Sector',
              children: [
                { id: 'cyivugiza', name: 'Cyivugiza Cell' },
                { id: 'mumena', name: 'Mumena Cell' },
              ],
            },
          ],
        },
      ],
    },
  ],
  TZ: [
    {
      id: 'dar',
      name: 'Dar es Salaam Region',
      children: [
        {
          id: 'ilala',
          name: 'Ilala District / MC',
          children: [
            { id: 'kivukoni', name: 'Kivukoni Ward' },
            { id: 'kariakoo', name: 'Kariakoo Ward' },
            { id: 'upanga', name: 'Upanga East Ward' },
          ],
        },
        {
          id: 'kinondoni',
          name: 'Kinondoni MC',
          children: [
            { id: 'mikocheni', name: 'Mikocheni Ward' },
            { id: 'msasani', name: 'Msasani Ward' },
          ],
        },
      ],
    },
  ],
  ZA: [
    {
      id: 'gauteng',
      name: 'Gauteng Province',
      children: [
        {
          id: 'joburg',
          name: 'City of Johannesburg Metro',
          children: [
            { id: 'region_a', name: 'Region A (Midrand)' },
            { id: 'region_e', name: 'Region E (Sandton/Alexandra)' },
            { id: 'region_f', name: 'Region F (Inner City)' },
          ],
        },
      ],
    },
  ],
  ET: [
    {
      id: 'addis',
      name: 'Addis Ababa City Admin',
      children: [
        {
          id: 'bole',
          name: 'Bole Sub-City',
          children: [
            { id: 'woreda_01', name: 'Woreda 01' },
            { id: 'woreda_03', name: 'Woreda 03' },
          ],
        },
      ],
    },
  ],
  EG: [
    {
      id: 'cairo',
      name: 'Cairo Governorate',
      children: [
        {
          id: 'eastern_zone',
          name: 'Eastern District',
          children: [
            { id: 'nasr_city', name: 'Nasr City Ward' },
            { id: 'heliopolis', name: 'Heliopolis Ward' },
          ],
        },
      ],
    },
  ],
  SN: [
    {
      id: 'dakar',
      name: 'Région de Dakar',
      children: [
        {
          id: 'dakar_dept',
          name: 'Département de Dakar',
          children: [
            { id: 'plateau', name: 'Dakar Plateau' },
            { id: 'medina', name: 'La Médina' },
          ],
        },
      ],
    },
  ],
  ZM: [
    {
      id: 'lusaka_prov',
      name: 'Lusaka Province',
      children: [
        {
          id: 'lusaka_city',
          name: 'Lusaka City Council',
          children: [
            { id: 'kabwata', name: 'Kabwata Ward' },
            { id: 'munali', name: 'Munali Ward' },
          ],
        },
      ],
    },
  ],
  ZW: [
    {
      id: 'harare_prov',
      name: 'Harare Metropolitan',
      children: [
        {
          id: 'harare_city',
          name: 'Harare City Council',
          children: [
            { id: 'ward_1', name: 'Ward 1 (CBD)' },
            { id: 'ward_7', name: 'Ward 7 (Avondale)' },
          ],
        },
      ],
    },
  ],
  US: [
    {
      id: 'ny_state',
      name: 'New York State',
      children: [
        {
          id: 'nyc',
          name: 'New York City',
          children: [
            { id: 'manhattan', name: 'Manhattan Community Board 1' },
            { id: 'brooklyn', name: 'Brooklyn Community Board 2' },
          ],
        },
      ],
    },
  ],
  GB: [
    {
      id: 'greater_london',
      name: 'Greater London Authority',
      children: [
        {
          id: 'camden',
          name: 'London Borough of Camden',
          children: [
            { id: 'holborn', name: 'Holborn Ward' },
            { id: 'kentish_town', name: 'Kentish Town Ward' },
          ],
        },
      ],
    },
  ],
  IN: [
    {
      id: 'delhi_ut',
      name: 'National Capital Territory of Delhi',
      children: [
        {
          id: 'new_delhi',
          name: 'New Delhi District',
          children: [
            { id: 'connaught_place', name: 'Connaught Place Ward' },
            { id: 'chanakyapuri', name: 'Chanakyapuri Ward' },
          ],
        },
      ],
    },
  ],
};

export const DEPARTMENTS: Record<string, { civic: Department[]; consumer: Department[] }> = {
  UG: {
    civic: [
      { id: 'mofped', name: 'Finance (MoFPED)', full: 'Ministry of Finance, Planning & Economic Dev (Treasury)', icon: '🏛', ministry: 'Ministry of Finance', sla: 48, category: 'government', sector: 'Public Treasury & PDM Grants', trustScore: 89, verified: true, qualityAudit: 'Auditor General Approved' },
      { id: 'molg', name: 'Local Gov (LG)', full: 'District Local Gov / Min. Local Gov', icon: '🏛', ministry: 'Ministry of Local Government', sla: 48, category: 'government', sector: 'Local Government & Parishes', trustScore: 92, verified: true, qualityAudit: 'Cap 243 Statutory Desk' },
      { id: 'kcca', name: 'KCCA', full: 'Kampala Capital City Authority', icon: '🏛', ministry: 'Office of the President', sla: 48, category: 'government', sector: 'Metropolitan Infrastructure & Waste', trustScore: 84, verified: true, qualityAudit: 'KCCA Act 2010 Authority' },
      { id: 'unra', name: 'UNRA', full: 'Uganda National Roads Authority', icon: '🛣', ministry: 'Ministry of Works & Transport', sla: 48, category: 'government', sector: 'Highways & Pothole Repair', trustScore: 81, verified: true, qualityAudit: 'MoWT Highway Standard' },
      { id: 'nwsc', name: 'NWSC', full: 'National Water & Sewerage Corp', icon: '💧', ministry: 'Ministry of Water & Environment', sla: 48, category: 'utility', sector: 'Piped Water Supply & Sanitation', trustScore: 94, verified: true, qualityAudit: 'ISO 9001:2015 Certified' },
      { id: 'moh_ug', name: 'Min. Health', full: 'Ministry of Health Uganda', icon: '🏥', ministry: 'Ministry of Health', sla: 48, category: 'government', sector: 'Public Healthcare & Drug Stocks', trustScore: 88, verified: true, qualityAudit: 'National Health Policy' },
      { id: 'upf', name: 'Uganda Police', full: 'Uganda Police Force', icon: '⚖', ministry: 'Ministry of Internal Affairs', sla: 24, category: 'government', sector: 'Law Enforcement & Community Security', trustScore: 78, verified: true, qualityAudit: 'UPF Professional Standards' },
      { id: 'ura', name: 'URA', full: 'Uganda Revenue Authority', icon: '📋', ministry: 'Ministry of Finance', sla: 72, category: 'government', sector: 'Tax Assessment & Customs Integrity', trustScore: 91, verified: true, qualityAudit: 'URA Taxpayer Charter' },
      { id: 'moes', name: 'Min. Education', full: 'Ministry of Education & Sports', icon: '📚', ministry: 'Ministry of Education', sla: 72, category: 'government', sector: 'Curriculum, UNEB & School Grants', trustScore: 86, verified: true, qualityAudit: 'Directorate of Education Standards' },
      { id: 'nema', name: 'NEMA', full: 'National Environment Mgmt Auth.', icon: '🌿', ministry: 'Ministry of Water & Environment', sla: 48, category: 'government', sector: 'Wetland Protection & Noise Control', trustScore: 83, verified: true, qualityAudit: 'Environmental Compliance Audited' },
      { id: 'igg', name: 'IGG / AG', full: 'Inspectorate of Government', icon: '⚖', ministry: 'Office of the President', sla: 72, category: 'government', sector: 'Anti-Corruption & Whistleblower Desk', trustScore: 96, verified: true, qualityAudit: 'Whistleblowers Act Statutory Desk' },
      { id: 'unbs_gov', name: 'UNBS Standards', full: 'Uganda National Bureau of Standards', icon: '🛡️', ministry: 'Ministry of Trade & Industry', sla: 48, category: 'government', sector: 'Product Quality & Food Safety Enforcement', trustScore: 93, verified: true, qualityAudit: 'UNBS Standard Q-Mark' },
    ],
    consumer: [
      // 🏫 Education & Schools
      { id: 'mak_univ', name: 'Makerere University', full: 'Makerere University (Colleges, Halls & Tuition)', sla: 48, icon: '🎓', category: 'education', sector: 'Higher Education', trustScore: 91, verified: true, qualityAudit: 'NCHE Accredited', location: 'Makerere Hill, Kampala' },
      { id: 'kyambogo_u', name: 'Kyambogo Univ.', full: 'Kyambogo University (Academic Registrar & Hostels)', sla: 48, icon: '🎓', category: 'education', sector: 'Higher Education', trustScore: 87, verified: true, qualityAudit: 'NCHE Accredited', location: 'Banda, Kyambogo' },
      { id: 'mubs_kla', name: 'MUBS Nakawa', full: 'Makerere University Business School', sla: 48, icon: '🎓', category: 'education', sector: 'Business Education', trustScore: 89, verified: true, qualityAudit: 'NCHE Accredited', location: 'Nakawa Division' },
      { id: 'kings_budo', name: 'Kings College Budo', full: 'King\'s College Budo (Secondary & Boarding)', sla: 48, icon: '🏫', category: 'education', sector: 'Secondary Education', trustScore: 96, verified: true, qualityAudit: 'MoES Registered P.128', location: 'Wakiso District' },
      { id: 'namagunga', name: 'Mt. St. Mary\'s Namagunga', full: 'Mount Saint Mary\'s College Namagunga', sla: 48, icon: '🏫', category: 'education', sector: 'Secondary Education', trustScore: 97, verified: true, qualityAudit: 'MoES Registered P.045', location: 'Mukono District' },
      { id: 'gayaza_hs', name: 'Gayaza High School', full: 'Gayaza High School (Academics & Student Welfare)', sla: 48, icon: '🏫', category: 'education', sector: 'Secondary Education', trustScore: 95, verified: true, qualityAudit: 'MoES Registered P.012', location: 'Gayaza, Wakiso' },
      { id: 'kampala_parents', name: 'Kampala Parents School', full: 'Kampala Parents School (Primary & Kindergarten)', sla: 36, icon: '🎒', category: 'education', sector: 'Primary Education', trustScore: 92, verified: true, qualityAudit: 'MoES Registered', location: 'Naguru, Kampala' },
      
      // 🏥 Healthcare & Hospitals
      { id: 'mulago_hosp', name: 'Mulago Referral Hospital', full: 'Mulago National Referral & Teaching Hospital', sla: 24, icon: '🏥', category: 'health', sector: 'Public Referral Hospital', trustScore: 86, verified: true, qualityAudit: 'MoH Tertiary Hospital Level', location: 'Mulago Hill' },
      { id: 'nakasero_hosp', name: 'Nakasero Hospital', full: 'Nakasero Hospital (Private Emergency & ICU)', sla: 24, icon: '🏥', category: 'health', sector: 'Private Multi-Specialty Hospital', trustScore: 95, verified: true, qualityAudit: 'Uganda Medical Council Certified', location: 'Akii Bua Rd, Nakasero' },
      { id: 'international_hosp', name: 'IHK (C-Care Uganda)', full: 'International Hospital Kampala (C-Care)', sla: 24, icon: '🏥', category: 'health', sector: 'Private Hospital & Wellness', trustScore: 93, verified: true, qualityAudit: 'ISO 9001 Certified Clinic', location: 'Kisugu-Namuwongo' },
      { id: 'case_hospital', name: 'Case Medical Hospital', full: 'Case Hospital (Emergency Care & Ward Services)', sla: 24, icon: '🏥', category: 'health', sector: 'Emergency & Surgical Center', trustScore: 91, verified: true, qualityAudit: 'MoH Registered HC-IV', location: 'Buganda Road, Kampala' },
      { id: 'kiruddu_hosp', name: 'Kiruddu National Hospital', full: 'Kiruddu National Referral Hospital (Burns & Internal)', sla: 24, icon: '🏥', category: 'health', sector: 'National Referral Hospital', trustScore: 84, verified: true, qualityAudit: 'MoH Public Referral', location: 'Makindye-Buziga' },
      { id: 'ecopharm_ug', name: 'Ecopharm Pharmacies', full: 'Ecopharm Ltd (Pharmacy Chain & Prescription Drugs)', sla: 24, icon: '💊', category: 'health', sector: 'Retail Pharmacy & Diagnostics', trustScore: 94, verified: true, qualityAudit: 'National Drug Authority (NDA) Licensed', location: 'Citywide Branches' },

      // 🍽️ Hospitality, Dining & Food Safety
      { id: 'cafe_javas', name: 'Café Javas (CJ\'s)', full: 'Café Javas Restaurants & Bakeries (Mandela Group)', sla: 24, icon: '☕', category: 'hospitality', sector: 'Restaurant & Dining', trustScore: 98, verified: true, qualityAudit: 'UNBS Food Hygiene Grade A', location: 'Kampala & Entebbe Branches' },
      { id: 'kfc_ug', name: 'KFC Uganda', full: 'KFC Uganda (Fast Food & Drive-Thru Chain)', sla: 24, icon: '🍗', category: 'hospitality', sector: 'Quick Service Restaurant', trustScore: 90, verified: true, qualityAudit: 'UNBS Food Safety Certified', location: 'Oasis Mall / Acacia / Lugogo' },
      { id: 'java_house_ug', name: 'Java House Kampala', full: 'Java House Africa (Coffee & Casual Dining)', sla: 24, icon: '☕', category: 'hospitality', sector: 'Casual Dining & Coffee', trustScore: 91, verified: true, qualityAudit: 'UNBS Hygiene Standards Audited', location: 'Acacia Mall / Village Mall' },
      { id: '2k_restaurant', name: '2K Restaurant', full: '2K Restaurant (Authentic Traditional Dishes & Catering)', sla: 24, icon: '🍲', category: 'hospitality', sector: 'Local Cuisine & Catering', trustScore: 89, verified: true, qualityAudit: 'KCCA Public Health Certified', location: 'Bakuli / Hoima Road' },
      { id: 'serena_hotel_kla', name: 'Kampala Serena Hotel', full: 'Kampala Serena Hotel (Hospitality, Events & Rooms)', sla: 24, icon: '🏨', category: 'hospitality', sector: '5-Star Luxury Hospitality', trustScore: 97, verified: true, qualityAudit: 'Uganda Tourism Board 5-Star', location: 'Kintu Road, Kampala' },

      // 💳 Banking, SACCOs & Fintech
      { id: 'stanbic', name: 'Stanbic Bank', full: 'Stanbic Bank Uganda Ltd (Branches, ATMs & Mobile)', sla: 48, icon: '🏦', category: 'finance', sector: 'Commercial Banking', trustScore: 93, verified: true, qualityAudit: 'Bank of Uganda Licensed Bank 001', location: 'Crested Towers & National' },
      { id: 'centenary_bank', name: 'Centenary Bank', full: 'Centenary Rural Development Bank (Microfinance & Agri)', sla: 48, icon: '🏦', category: 'finance', sector: 'Commercial & Microfinance', trustScore: 94, verified: true, qualityAudit: 'Bank of Uganda Licensed Bank 004', location: 'Mapeera House & National' },
      { id: 'equity_ug', name: 'Equity Bank UG', full: 'Equity Bank Uganda (SME, Forex & Agency Banking)', sla: 48, icon: '🏦', category: 'finance', sector: 'Commercial Banking', trustScore: 90, verified: true, qualityAudit: 'Bank of Uganda Licensed', location: 'Church House, Kampala' },
      { id: 'pdm_sacco_nakawa', name: 'Parish PDM SACCO Desk', full: 'Parish Development Model Financial SACCO Federation', sla: 48, icon: '🪙', category: 'finance', sector: 'Parish SACCO & Micro-Grants', trustScore: 88, verified: true, qualityAudit: 'UMRA Registered Tier-4 Microfinance', location: 'All 10,595 Parishes' },

      // 🚌 Transport, Logistics & Transit
      { id: 'link_bus', name: 'Link Bus Services', full: 'Link Bus Services Ltd (Western & Northern Routes)', sla: 24, icon: '🚌', category: 'transport', sector: 'Inter-District Coach Transit', trustScore: 91, verified: true, qualityAudit: 'MoWT Route Licensed & Inspected', location: 'Kisenyi Bus Terminal' },
      { id: 'yy_coaches', name: 'YY Coaches & Couriers', full: 'YY Coaches Ltd (Eastern Uganda Express)', sla: 24, icon: '🚌', category: 'transport', sector: 'Inter-District Coach Transit', trustScore: 92, verified: true, qualityAudit: 'MoWT Route Licensed', location: 'Namayiba Bus Terminal' },
      { id: 'kotsa_taxi', name: 'KOTSA Taxi SACCO', full: 'Kampala Operational Taxi Stages Association', sla: 24, icon: '🚐', category: 'transport', sector: 'Urban Commuter Matatus', trustScore: 84, verified: true, qualityAudit: 'KCCA Gazetted Stage Operator', location: 'Old / New Taxi Parks' },
      { id: 'safeboda_ug', name: 'SafeBoda Rides & Pay', full: 'SafeBoda Uganda (Boda Boda Transport & Safety)', sla: 24, icon: '🛵', category: 'transport', sector: 'E-Hailing & Motorbike Safety', trustScore: 95, verified: true, qualityAudit: 'Certified Driver Safety Academy', location: 'Kampala Metropolitan' },
      { id: 'boda_union_ug', name: 'National Boda Union', full: 'National Boda Boda Transporters Union', sla: 24, icon: '🛵', category: 'transport', sector: 'Motorcycle Transit SACCO', trustScore: 82, verified: true, qualityAudit: 'Ministry of Works Registered', location: 'Countrywide Stages' },

      // 🏢 Real Estate, Plazas & Public Markets
      { id: 'garden_city_mall', name: 'Garden City Complex', full: 'Garden City Shopping Mall & Commercial Center', sla: 48, icon: '🏢', category: 'housing', sector: 'Commercial Plaza & Retail', trustScore: 93, verified: true, qualityAudit: 'KCCA Building Safety Passed', location: 'Yusuf Lule Road' },
      { id: 'acacia_mall', name: 'The Acacia Mall', full: 'The Acacia Mall Kisementi (Property & Tenancy)', sla: 48, icon: '🏢', category: 'housing', sector: 'Commercial Retail & Dining', trustScore: 96, verified: true, qualityAudit: 'Building Structural Safety Certified', location: 'Kisementi, Kololo' },
      { id: 'owino_market', name: 'St. Balikuddembe (Owino)', full: 'St. Balikuddembe Market Traders & Vendor Desks', sla: 48, icon: '🏬', category: 'housing', sector: 'Public Municipal Market', trustScore: 81, verified: true, qualityAudit: 'KCCA Market Administration', location: 'Downtown Kampala' },
      { id: 'nakasero_market', name: 'Nakasero Fresh Market', full: 'Nakasero Fresh Food Market Vendors Association', sla: 48, icon: '🏬', category: 'housing', sector: 'Municipal Produce Market', trustScore: 87, verified: true, qualityAudit: 'KCCA Food Sanitation Inspected', location: 'Market Street, Nakasero' },

      // ⚡ Utilities & Connectivity
      { id: 'umeme', name: 'Umeme', full: 'Umeme Ltd (Power Grid Distribution & Metering)', sla: 24, icon: '⚡', category: 'utility', sector: 'Electricity Distribution', trustScore: 83, verified: true, qualityAudit: 'ERA Regulated Utility #01', location: 'National Grid' },
      { id: 'mtn_ug', name: 'MTN Uganda', full: 'MTN Uganda Limited (Telecom, MoMo & 5G Data)', sla: 48, icon: '📡', category: 'telecom', sector: 'Telecommunications & Internet', trustScore: 91, verified: true, qualityAudit: 'UCC Licensed National Operator', location: 'National Coverage' },
      { id: 'airtel_ug', name: 'Airtel Uganda', full: 'Airtel Uganda Limited (Telecom & Fiber Network)', sla: 48, icon: '📡', category: 'telecom', sector: 'Telecommunications & Broadband', trustScore: 90, verified: true, qualityAudit: 'UCC Licensed National Operator', location: 'National Coverage' },
      { id: 'solarnow_ug', name: 'SolarNow OffGrid', full: 'SolarNow Uganda (Clean Power Mini-Grids)', sla: 48, icon: '☀️', category: 'utility', sector: 'Renewable Solar Energy', trustScore: 93, verified: true, qualityAudit: 'UNBS Quality Solar Standards', location: 'Rural & Peri-Urban' },

      // 🏗️ Civil Engineering & Contractors
      { id: 'roko_ctr', name: 'Roko Construction', full: 'Roko Construction Ltd (Civil Engineering Contractor)', sla: 48, icon: '🏗️', category: 'contractor', sector: 'Commercial Infrastructure', trustScore: 88, verified: true, qualityAudit: 'UNABCEC Class A1 Contractor' },
      { id: 'dott_ctr', name: 'Dott Services', full: 'Dott Services Ltd (Highways Contractor)', sla: 48, icon: '🏗️', category: 'contractor', sector: 'Highway Infrastructure', trustScore: 82, verified: true, qualityAudit: 'UNRA Pre-Qualified Civil Contractor' },
      { id: 'sterling_ctr', name: 'Sterling Civil Works', full: 'Sterling Civil Works Ltd (Infrastructure Contractor)', sla: 48, icon: '🛣️', category: 'contractor', sector: 'Bridges & Culverts', trustScore: 86, verified: true, qualityAudit: 'MoWT Registered Contractor' },

      // 🛡️ Civil Society & Consumer Watchdogs
      { id: 'ti_ug', name: 'Transparency Int.', full: 'Transparency International Uganda (CSO / NGO)', sla: 48, icon: '🛡️', category: 'cso', sector: 'Anti-Corruption Advocacy', trustScore: 97, verified: true, qualityAudit: 'NGO Bureau Registered #554' },
      { id: 'redcross_ug', name: 'Red Cross UG', full: 'Uganda Red Cross Society (Humanitarian & First Aid)', sla: 24, icon: '🚑', category: 'cso', sector: 'Emergency Medical & Disaster', trustScore: 98, verified: true, qualityAudit: 'Statutory Humanitarian Society' },
      { id: 'actionaid_ug', name: 'ActionAid UG', full: 'ActionAid Uganda (Civic Rights & Social Accountability)', sla: 48, icon: '🤝', category: 'cso', sector: 'Human Rights & Social Justice', trustScore: 95, verified: true, qualityAudit: 'National NGO Permit Verified' },
      { id: 'kacita_ug', name: 'KACITA Traders', full: 'Kampala City Traders Association (Business Hub)', sla: 48, icon: '🏬', category: 'cso', sector: 'Trader Advocacy & Fair Prices', trustScore: 91, verified: true, qualityAudit: 'Registered Business Association' },
    ],
  },
  KE: {
    civic: [
      { id: 'kra', name: 'KRA', full: 'Kenya Revenue Authority', icon: '📋', ministry: 'National Treasury', sla: 72, category: 'government', sector: 'Tax & Customs', trustScore: 88, verified: true },
      { id: 'kplc', name: 'Kenya Power', full: 'Kenya Power & Lighting Co', icon: '⚡', ministry: 'Ministry of Energy', sla: 48, category: 'utility', sector: 'Electricity Grid', trustScore: 82, verified: true },
      { id: 'nwco_ke', name: 'Nairobi Water', full: 'Nairobi City Water & Sewerage', icon: '💧', ministry: 'Nairobi City County', sla: 48, category: 'utility', sector: 'Water Supply', trustScore: 85, verified: true },
      { id: 'nps_ke', name: 'Kenya Police', full: 'National Police Service', icon: '⚖', ministry: 'Ministry of Interior', sla: 24, category: 'government', sector: 'Security & Order', trustScore: 76, verified: true },
      { id: 'ncc', name: 'Nairobi County', full: "Nairobi City County Gov't", icon: '🏛', ministry: 'County Government', sla: 48, category: 'government', sector: 'County Services', trustScore: 81, verified: true },
    ],
    consumer: [
      { id: 'uon_ke', name: 'Univ. of Nairobi', full: 'University of Nairobi (Colleges & Student Welfare)', sla: 48, icon: '🎓', category: 'education', sector: 'Higher Education', trustScore: 93, verified: true },
      { id: 'aga_khan_hosp', name: 'Aga Khan Hospital', full: 'Aga Khan University Hospital Nairobi (Emergency & Clinics)', sla: 24, icon: '🏥', category: 'health', sector: 'Private Multi-Specialty Hospital', trustScore: 97, verified: true },
      { id: 'nairobi_hosp', name: 'The Nairobi Hospital', full: 'The Nairobi Hospital (Trauma & Critical Care)', sla: 24, icon: '🏥', category: 'health', sector: 'Private Hospital', trustScore: 95, verified: true },
      { id: 'java_house_nbo', name: 'Java House Kenya', full: 'Java House Restaurants & Roasteries', sla: 24, icon: '☕', category: 'hospitality', sector: 'Casual Dining & Coffee', trustScore: 96, verified: true },
      { id: 'safaricom', name: 'Safaricom', full: 'Safaricom PLC (Telecom & M-Pesa)', sla: 48, icon: '📡', category: 'telecom', sector: 'Telecom & M-Pesa', trustScore: 95, verified: true },
      { id: 'kcb_csr', name: 'KCB Bank', full: 'KCB Bank Kenya Ltd (Retail Banking & Loans)', sla: 48, icon: '🏦', category: 'finance', sector: 'Commercial Banking', trustScore: 92, verified: true },
      { id: 'matatu_moa', name: 'Matatu Owners', full: 'Matatu Owners Association (Public Transit SACCO)', sla: 24, icon: '🚐', category: 'transport', sector: 'Public Transit SACCO', trustScore: 81, verified: true },
      { id: 'ti_ke', name: 'Transparency KE', full: 'Transparency International Kenya (CSO)', sla: 48, icon: '🛡️', category: 'cso', sector: 'Anti-Corruption Advocacy', trustScore: 96, verified: true },
      { id: 'redcross_ke', name: 'Kenya Red Cross', full: 'Kenya Red Cross Society (Humanitarian NGO)', sla: 24, icon: '🚑', category: 'cso', sector: 'Humanitarian & Emergency', trustScore: 98, verified: true },
    ],
  },
  NG: {
    civic: [
      { id: 'lawma', name: 'LAWMA', full: 'Lagos Waste Mgmt Authority', icon: '🗑', ministry: 'Lagos State', sla: 48, category: 'government', sector: 'Waste Management', trustScore: 84, verified: true },
      { id: 'npf', name: 'Nigeria Police', full: 'Nigeria Police Force', icon: '⚖', ministry: 'Min. Police Affairs', sla: 24, category: 'government', sector: 'Law Enforcement', trustScore: 72, verified: true },
      { id: 'lasg', name: 'Lagos State', full: 'Lagos State Government', icon: '🏛', ministry: 'State Government', sla: 48, category: 'government', sector: 'State Administration', trustScore: 82, verified: true },
    ],
    consumer: [
      { id: 'unilag_ng', name: 'UNILAG Lagos', full: 'University of Lagos (Faculties & Hostels)', sla: 48, icon: '🎓', category: 'education', sector: 'Higher Education', trustScore: 91, verified: true },
      { id: 'luth_hosp', name: 'LUTH Hospital', full: 'Lagos University Teaching Hospital (Emergency & Care)', sla: 24, icon: '🏥', category: 'health', sector: 'Teaching Hospital', trustScore: 87, verified: true },
      { id: 'tastee_fried', name: 'Tastee Fried Chicken', full: 'Tastee Fried Chicken (TFC Quick Food Chain)', sla: 24, icon: '🍗', category: 'hospitality', sector: 'Food & Quick Dining', trustScore: 90, verified: true },
      { id: 'mtn_ng', name: 'MTN Nigeria', full: 'MTN Nigeria Communications (Telecom & MoMo)', sla: 48, icon: '📡', category: 'telecom', sector: 'Telecom & Fiber', trustScore: 90, verified: true },
      { id: 'gtbank_ng', name: 'Guaranty Trust Bank', full: 'GTBank (Retail Banking, Cards & Transfers)', sla: 48, icon: '🏦', category: 'finance', sector: 'Commercial Banking', trustScore: 93, verified: true },
      { id: 'nurtw_ng', name: 'NURTW Transit', full: 'National Union of Road Transport Workers (Cooperative)', sla: 24, icon: '🚐', category: 'transport', sector: 'Public Transit Cooperative', trustScore: 78, verified: true },
      { id: 'serap_ng', name: 'SERAP Nigeria', full: 'Socio-Economic Rights & Accountability Project (NGO)', sla: 48, icon: '⚖️', category: 'cso', sector: 'Rights Watchdog', trustScore: 96, verified: true },
    ],
  },
  GH: {
    civic: [
      { id: 'ecg', name: 'ECG', full: 'Electricity Co of Ghana', icon: '⚡', ministry: 'Ministry of Energy', sla: 48, category: 'utility', sector: 'Power Distribution', trustScore: 81, verified: true },
      { id: 'gwcl', name: 'GWCL', full: 'Ghana Water Co Ltd', icon: '💧', ministry: 'Ministry of Works', sla: 48, category: 'utility', sector: 'Water Supply', trustScore: 84, verified: true },
      { id: 'gps', name: 'Ghana Police', full: 'Ghana Police Service', icon: '⚖', ministry: 'Ministry of Interior', sla: 24, category: 'government', sector: 'Police & Security', trustScore: 79, verified: true },
      { id: 'amc', name: 'Accra Metro', full: 'Accra Metropolitan Assembly', icon: '🏛', ministry: 'Local Government', sla: 48, category: 'government', sector: 'Metropolitan Services', trustScore: 83, verified: true },
    ],
    consumer: [
      { id: 'ug_legon', name: 'Univ. of Ghana Legon', full: 'University of Ghana (Legon Campus & Halls)', sla: 48, icon: '🎓', category: 'education', sector: 'Higher Education', trustScore: 94, verified: true },
      { id: 'korle_bu', name: 'Korle Bu Hospital', full: 'Korle Bu Teaching Hospital (Emergency & Surgical)', sla: 24, icon: '🏥', category: 'health', sector: 'National Teaching Hospital', trustScore: 88, verified: true },
      { id: 'papaye_gh', name: 'Papaye Fast Foods', full: 'Papaye Fast Foods (Dining & Takeaway Chain)', sla: 24, icon: '🍗', category: 'hospitality', sector: 'Restaurants & Dining', trustScore: 93, verified: true },
      { id: 'mtn_gh', name: 'MTN Ghana', full: 'MTN Ghana Limited (Telecom & MoMo)', sla: 48, icon: '📡', category: 'telecom', sector: 'Telecom & Mobile Money', trustScore: 92, verified: true },
      { id: 'ecobank_gh', name: 'Ecobank Ghana', full: 'Ecobank Ghana PLC (Commercial & SME Banking)', sla: 48, icon: '🏦', category: 'finance', sector: 'Commercial Banking', trustScore: 94, verified: true },
      { id: 'gprtu_gh', name: 'GPRTU Transit', full: 'Ghana Private Road Transport Union (Cooperative)', sla: 24, icon: '🚐', category: 'transport', sector: 'Public Trotro & Transit Union', trustScore: 82, verified: true },
      { id: 'cdd_ghana', name: 'CDD-Ghana', full: 'Center for Democratic Development (CSO / NGO)', sla: 48, icon: '📊', category: 'cso', sector: 'Democratic Governance', trustScore: 96, verified: true },
    ],
  },
  RW: {
    civic: [
      { id: 'reg', name: 'REG', full: 'Rwanda Energy Group', icon: '⚡', ministry: 'Ministry of Infrastructure', sla: 48, category: 'utility', sector: 'Power Grid', trustScore: 94, verified: true },
      { id: 'wasac', name: 'WASAC', full: 'Water & Sanitation Corp Rwanda', icon: '💧', ministry: 'Ministry of Infrastructure', sla: 48, category: 'utility', sector: 'Clean Water Network', trustScore: 92, verified: true },
      { id: 'rnp', name: 'Rwanda Police', full: 'Rwanda National Police', icon: '⚖', ministry: 'Min. Internal Security', sla: 24, category: 'government', sector: 'National Police', trustScore: 96, verified: true },
      { id: 'cob_rw', name: 'City of Kigali', full: 'City of Kigali Administration', icon: '🏛', ministry: 'Kigali City', sla: 48, category: 'government', sector: 'Urban Governance', trustScore: 95, verified: true },
    ],
    consumer: [
      { id: 'ur_rwanda', name: 'Univ. of Rwanda', full: 'University of Rwanda (Campuses & Research)', sla: 48, icon: '🎓', category: 'education', sector: 'Higher Education', trustScore: 92, verified: true },
      { id: 'chuk_hosp', name: 'CHUK Referral Hosp.', full: 'University Teaching Hospital of Kigali (CHUK)', sla: 24, icon: '🏥', category: 'health', sector: 'Teaching & Referral Hospital', trustScore: 91, verified: true },
      { id: 'bourbon_coffee', name: 'Bourbon Coffee Kigali', full: 'Bourbon Coffee (Dining & Specialty Coffee)', sla: 24, icon: '☕', category: 'hospitality', sector: 'Dining & Specialty Coffee', trustScore: 95, verified: true },
      { id: 'mtn_rw', name: 'MTN Rwanda', full: 'MTN Rwanda Limited (Telecom & MoMo)', sla: 48, icon: '📡', category: 'telecom', sector: 'Telecommunications', trustScore: 93, verified: true },
      { id: 'bk_rwanda', name: 'Bank of Kigali', full: 'Bank of Kigali PLC (Retail, SME & Digital)', sla: 48, icon: '🏦', category: 'finance', sector: 'Commercial Banking', trustScore: 96, verified: true },
      { id: 'atp_rw', name: 'ATPR Transit', full: 'Rwanda Transport Persons Association (Cooperative)', sla: 24, icon: '🚐', category: 'transport', sector: 'Kigali Bus & Transit Union', trustScore: 89, verified: true },
      { id: 'ti_rw', name: 'Transparency RW', full: 'Transparency International Rwanda (CSO)', sla: 48, icon: '🛡️', category: 'cso', sector: 'Civic Watchdog', trustScore: 97, verified: true },
    ],
  },
  TZ: {
    civic: [
      { id: 'tanesco', name: 'TANESCO', full: 'Tanzania Electric Supply Co', icon: '⚡', ministry: 'Ministry of Energy', sla: 48, category: 'utility', sector: 'Electric Grid', trustScore: 84, verified: true },
      { id: 'dawasa', name: 'DAWASA', full: 'Dar es Salaam Water & Sewerage', icon: '💧', ministry: 'Ministry of Water', sla: 48, category: 'utility', sector: 'Piped Water Supply', trustScore: 86, verified: true },
      { id: 'tanroads', name: 'TANROADS', full: 'Tanzania National Roads Agency', icon: '🛣', ministry: 'Ministry of Works', sla: 48, category: 'government', sector: 'National Highways', trustScore: 85, verified: true },
      { id: 'tpb', name: 'Tanzania Police', full: 'Tanzania Police Force', icon: '⚖', ministry: 'Ministry of Home Affairs', sla: 24, category: 'government', sector: 'Law & Order', trustScore: 78, verified: true },
    ],
    consumer: [
      { id: 'udsm_tz', name: 'Univ. of Dar es Salaam', full: 'University of Dar es Salaam (Mlimani Campus)', sla: 48, icon: '🎓', category: 'education', sector: 'Higher Education', trustScore: 94, verified: true },
      { id: 'muhimbili_hosp', name: 'Muhimbili National Hosp.', full: 'Muhimbili National Hospital (MNH)', sla: 24, icon: '🏥', category: 'health', sector: 'National Referral Hospital', trustScore: 90, verified: true },
      { id: 'akemi_dar', name: 'Akemi Dining & Lounge', full: 'Akemi Revolving Restaurant (Hospitality & Dining)', sla: 24, icon: '🍽️', category: 'hospitality', sector: 'Fine Dining & Hospitality', trustScore: 93, verified: true },
      { id: 'vodacom_tz', name: 'Vodacom TZ', full: 'Vodacom Tanzania PLC (Telecom & M-Pesa)', sla: 48, icon: '📡', category: 'telecom', sector: 'Telecom & M-Pesa', trustScore: 92, verified: true },
      { id: 'crdb_csr', name: 'CRDB Bank', full: 'CRDB Bank PLC (Commercial & Micro-Agri Banking)', sla: 48, icon: '🏦', category: 'finance', sector: 'Commercial Banking', trustScore: 95, verified: true },
      { id: 'udart_tz', name: 'DART Bus Rapid Transit', full: 'Dar es Salaam Rapid Transit (Bus Service)', sla: 24, icon: '🚌', category: 'transport', sector: 'Metropolitan Bus Transit', trustScore: 87, verified: true },
      { id: 'lhrc_tz', name: 'LHRC Tanzania', full: 'Legal and Human Rights Centre (CSO / NGO)', sla: 48, icon: '⚖️', category: 'cso', sector: 'Human Rights Watchdog', trustScore: 96, verified: true },
    ],
  },
  ZA: {
    civic: [
      { id: 'eskom', name: 'Eskom', full: 'Eskom Holdings SOC Ltd', icon: '⚡', ministry: 'Public Enterprises', sla: 48, category: 'utility', sector: 'National Electricity Grid', trustScore: 71, verified: true },
      { id: 'joburg_water', name: 'Joburg Water', full: 'City of Johannesburg Water', icon: '💧', ministry: 'CoJ Municipality', sla: 48, category: 'utility', sector: 'Municipal Water & Sewerage', trustScore: 80, verified: true },
      { id: 'saps', name: 'SAPS', full: 'South African Police Service', icon: '⚖', ministry: 'Police Ministry', sla: 24, category: 'government', sector: 'National Police', trustScore: 74, verified: true },
      { id: 'sanral', name: 'SANRAL', full: 'SA National Roads Agency', icon: '🛣', ministry: 'Transport Dept', sla: 48, category: 'government', sector: 'National Freeways & Tolls', trustScore: 83, verified: true },
    ],
    consumer: [
      { id: 'wits_univ', name: 'Wits University', full: 'University of the Witwatersrand Johannesburg', sla: 48, icon: '🎓', category: 'education', sector: 'Higher Education', trustScore: 95, verified: true },
      { id: 'bara_hosp', name: 'Chris Hani Baragwanath', full: 'Chris Hani Baragwanath Academic Hospital', sla: 24, icon: '🏥', category: 'health', sector: 'Academic Hospital', trustScore: 82, verified: true },
      { id: 'nandos_sa', name: 'Nando\'s South Africa', full: 'Nando\'s Restaurants (Flame-Grilled & Takeaway)', sla: 24, icon: '🍗', category: 'hospitality', sector: 'Restaurant & Hospitality', trustScore: 94, verified: true },
      { id: 'vodacom_za', name: 'Vodacom SA', full: 'Vodacom Group Ltd (Telecom & 5G Broadband)', sla: 48, icon: '📡', category: 'telecom', sector: 'Telecommunications', trustScore: 91, verified: true },
      { id: 'standardbank_za', name: 'Standard Bank SA', full: 'Standard Bank South Africa (Retail & Corporate)', sla: 48, icon: '🏦', category: 'finance', sector: 'Commercial Banking', trustScore: 92, verified: true },
      { id: 'santaco_za', name: 'SANTACO Taxi', full: 'SA National Taxi Council (Transit SACCO)', sla: 24, icon: '🚐', category: 'transport', sector: 'National Minibus Taxi Transit', trustScore: 79, verified: true },
      { id: 'outa_za', name: 'OUTA Civil Action', full: 'Organisation Undoing Tax Abuse (CSO / Watchdog)', sla: 48, icon: '🛡️', category: 'cso', sector: 'Citizen Tax & Governance Watchdog', trustScore: 96, verified: true },
    ],
  },
  ET: {
    civic: [
      { id: 'eeu', name: 'EEU', full: 'Ethiopian Electric Utility', icon: '⚡', ministry: 'Ministry of Water & Energy', sla: 48 },
      { id: 'aawsa', name: 'AAWSA', full: 'Addis Ababa Water Authority', icon: '💧', ministry: 'City Admin', sla: 48 },
      { id: 'era', name: 'ERA', full: 'Ethiopian Roads Authority', icon: '🛣', ministry: 'Ministry of Transport', sla: 48 },
    ],
    consumer: [{ id: 'ethio_telecom', name: 'Ethio Telecom', full: 'Ethio Telecom Corporation', sla: 72, icon: '📡' }],
  },
  EG: {
    civic: [
      { id: 'eehc', name: 'EEHC', full: 'Egyptian Electricity Holding Co', icon: '⚡', ministry: 'Ministry of Electricity', sla: 48 },
      { id: 'hcww', name: 'HCWW', full: 'Holding Co for Water & Wastewater', icon: '💧', ministry: 'Ministry of Housing', sla: 48 },
      { id: 'egypt_police', name: 'Egypt Police', full: 'Egyptian National Police', icon: '⚖', ministry: 'Ministry of Interior', sla: 24 },
    ],
    consumer: [{ id: 'vodafone_eg', name: 'Vodafone Egypt', full: 'Vodafone Egypt Telecommunications', sla: 72, icon: '📡' }],
  },
  SN: {
    civic: [
      { id: 'senelec', name: 'SENELEC', full: 'Société Nationale d’Electricité', icon: '⚡', ministry: 'Ministère du Pétrole', sla: 48 },
      { id: 'sen_eau', name: 'SEN’EAU', full: 'Sénégalaise des Eaux', icon: '💧', ministry: 'Ministère de l’Eau', sla: 48 },
      { id: 'police_sn', name: 'Police Nationale', full: 'Police Nationale du Sénégal', icon: '⚖', ministry: 'Ministère de l’Intérieur', sla: 24 },
    ],
    consumer: [{ id: 'orange_sn', name: 'Orange Sénégal', full: 'Sonatel / Orange', sla: 72, icon: '📡' }],
  },
  ZM: {
    civic: [
      { id: 'zesco', name: 'ZESCO', full: 'Zambia Electricity Supply Corp', icon: '⚡', ministry: 'Ministry of Energy', sla: 48 },
      { id: 'lwsc', name: 'Lusaka Water', full: 'Lusaka Water Supply & Sanitation', icon: '💧', ministry: 'Ministry of Water', sla: 48 },
      { id: 'zps', name: 'Zambia Police', full: 'Zambia Police Service', icon: '⚖', ministry: 'Ministry of Home Affairs', sla: 24 },
    ],
    consumer: [{ id: 'airtel_zm', name: 'Airtel Zambia', full: 'Airtel Networks Zambia', sla: 72, icon: '📡' }],
  },
  ZW: {
    civic: [
      { id: 'zetdc', name: 'ZETDC', full: 'Zimbabwe Electricity Trans & Distrib', icon: '⚡', ministry: 'Ministry of Energy', sla: 48 },
      { id: 'harare_water', name: 'Harare Water', full: 'City of Harare Water Department', icon: '💧', ministry: 'City Council', sla: 48 },
      { id: 'zrp', name: 'ZRP', full: 'Zimbabwe Republic Police', icon: '⚖', ministry: 'Ministry of Home Affairs', sla: 24 },
    ],
    consumer: [{ id: 'econet', name: 'Econet', full: 'Econet Wireless Zimbabwe', sla: 72, icon: '📡' }],
  },
  US: {
    civic: [
      { id: 'dot_us', name: 'DOT / Highways', full: 'Department of Transportation', icon: '🛣', ministry: 'US DOT / State DOT', sla: 48 },
      { id: 'dep_nyc', name: 'Water & Sewage', full: 'Department of Environmental Protection', icon: '💧', ministry: 'City Govt', sla: 48 },
      { id: 'nypd', name: 'Police Dept', full: 'Metropolitan Police Department', icon: '⚖', ministry: 'Public Safety', sla: 24 },
    ],
    consumer: [{ id: 'coned', name: 'ConEdison', full: 'Consolidated Edison Power', sla: 24, icon: '⚡' }],
  },
  GB: {
    civic: [
      { id: 'council_uk', name: 'Borough Council', full: 'Local Highway & Public Services Authority', icon: '🏛', ministry: 'DLUHC', sla: 48 },
      { id: 'met_police', name: 'Met Police', full: 'Metropolitan Police Service', icon: '⚖', ministry: 'Home Office', sla: 24 },
      { id: 'nhs_trust', name: 'NHS Trust', full: 'National Health Service Trust', icon: '🏥', ministry: 'Dept of Health', sla: 48 },
    ],
    consumer: [{ id: 'thames_water', name: 'Thames Water', full: 'Thames Water Utilities Ltd', sla: 48, icon: '💧' }],
  },
  IN: {
    civic: [
      { id: 'pwd_in', name: 'PWD Infrastructure', full: 'Public Works Department', icon: '🛣', ministry: 'State PWD', sla: 48 },
      { id: 'djb', name: 'Jal Board / Water', full: 'Delhi Jal Board & Sanitation', icon: '💧', ministry: 'Ministry of Jal Shakti', sla: 48 },
      { id: 'delhi_police', name: 'Delhi Police', full: 'Delhi Police Command', icon: '⚖', ministry: 'Ministry of Home Affairs', sla: 24 },
    ],
    consumer: [{ id: 'bses', name: 'BSES Power', full: 'BSES Yamuna Power Limited', sla: 24, icon: '⚡' }],
  },
  DE: {
    civic: [
      { id: 'bmi_de', name: 'BMI / Bundesinnenministerium', full: 'Bundesministerium des Innern und für Heimat', icon: '🏛', ministry: 'BMI', sla: 48 },
      { id: 'stadtwerke_de', name: 'Stadtwerke / Netze', full: 'Kommunale Stadtwerke & Netze', icon: '⚡', ministry: 'Kommunale Verwaltung', sla: 24 },
      { id: 'bwb_de', name: 'Wasserbetriebe', full: 'Städtische Wasserbetriebe & Kanalisation', icon: '💧', ministry: 'Umwelt & Wasser', sla: 48 },
      { id: 'polizei_de', name: 'Polizei & Ordnungsamt', full: 'Landespolizei & Kommunales Ordnungsamt', icon: '⚖', ministry: 'Innenministerium', sla: 24 },
      { id: 'strassen_de', name: 'Tiefbauamt & Strassen', full: 'Kommunales Tiefbauamt & Landesbetrieb Mobilität', icon: '🛣', ministry: 'Verkehrsministerium', sla: 48 },
    ],
    consumer: [{ id: 'telekom_de', name: 'Deutsche Telekom', full: 'Deutsche Telekom AG', sla: 48, icon: '📡' }],
  },
};
