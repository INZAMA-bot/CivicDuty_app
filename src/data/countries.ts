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
  AU: { name: 'Australia', node: 'AU_NODE_101', id_label: 'Driver License / Medicare', id_ph: '12345678', flag: '🇦🇺' },
  NZ: { name: 'New Zealand', node: 'NZ_NODE_102', id_label: 'NHI / Driver Licence', id_ph: 'ABC1234', flag: '🇳🇿' },
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
      { id: 'molg', name: 'Local Gov (LG)', full: 'District Local Gov / Min. Local Gov', icon: '🏛', ministry: 'Ministry of Local Government', sla: 48 },
      { id: 'kcca', name: 'KCCA', full: 'Kampala Capital City Authority', icon: '🏛', ministry: 'Office of the President', sla: 48 },
      { id: 'unra', name: 'UNRA', full: 'Uganda National Roads Authority', icon: '🛣', ministry: 'Ministry of Works & Transport', sla: 48 },
      { id: 'nwsc', name: 'NWSC', full: 'National Water & Sewerage Corp', icon: '💧', ministry: 'Ministry of Water & Environment', sla: 48 },
      { id: 'moh_ug', name: 'Min. Health', full: 'Ministry of Health Uganda', icon: '🏥', ministry: 'Ministry of Health', sla: 48 },
      { id: 'upf', name: 'Uganda Police', full: 'Uganda Police Force', icon: '⚖', ministry: 'Ministry of Internal Affairs', sla: 24 },
      { id: 'ura', name: 'URA', full: 'Uganda Revenue Authority', icon: '📋', ministry: 'Ministry of Finance', sla: 72 },
      { id: 'moes', name: 'Min. Education', full: 'Ministry of Education & Sports', icon: '📚', ministry: 'Ministry of Education', sla: 72 },
      { id: 'nema', name: 'NEMA', full: 'National Environment Mgmt Auth.', icon: '🌿', ministry: 'Ministry of Water & Environment', sla: 48 },
      { id: 'igg', name: 'IGG / AG', full: 'Inspectorate of Government', icon: '⚖', ministry: 'Office of the President', sla: 72 },
    ],
    consumer: [
      { id: 'umeme', name: 'Umeme', full: 'Umeme Ltd (Power Distribution)', sla: 24, icon: '⚡' },
      { id: 'mtn_ug', name: 'MTN Uganda', full: 'MTN Uganda Limited', sla: 72, icon: '📡' },
      { id: 'airtel_ug', name: 'Airtel Uganda', full: 'Airtel Uganda Limited', sla: 72, icon: '📡' },
      { id: 'stanbic', name: 'Stanbic Bank', full: 'Stanbic Bank Uganda Ltd', sla: 72, icon: '🏦' },
    ],
  },
  KE: {
    civic: [
      { id: 'kra', name: 'KRA', full: 'Kenya Revenue Authority', icon: '📋', ministry: 'National Treasury', sla: 72 },
      { id: 'kplc', name: 'Kenya Power', full: 'Kenya Power & Lighting Co', icon: '⚡', ministry: 'Ministry of Energy', sla: 48 },
      { id: 'nwco_ke', name: 'Nairobi Water', full: 'Nairobi City Water & Sewerage', icon: '💧', ministry: 'Nairobi City County', sla: 48 },
      { id: 'nps_ke', name: 'Kenya Police', full: 'National Police Service', icon: '⚖', ministry: 'Ministry of Interior', sla: 24 },
      { id: 'ncc', name: 'Nairobi County', full: "Nairobi City County Gov't", icon: '🏛', ministry: 'County Government', sla: 48 },
    ],
    consumer: [{ id: 'safaricom', name: 'Safaricom', full: 'Safaricom PLC', sla: 72, icon: '📡' }],
  },
  NG: {
    civic: [
      { id: 'lawma', name: 'LAWMA', full: 'Lagos Waste Mgmt Authority', icon: '🗑', ministry: 'Lagos State', sla: 48 },
      { id: 'npf', name: 'Nigeria Police', full: 'Nigeria Police Force', icon: '⚖', ministry: 'Min. Police Affairs', sla: 24 },
      { id: 'lasg', name: 'Lagos State', full: 'Lagos State Government', icon: '🏛', ministry: 'State Government', sla: 48 },
    ],
    consumer: [{ id: 'mtn_ng', name: 'MTN Nigeria', full: 'MTN Nigeria Communications', sla: 72, icon: '📡' }],
  },
  GH: {
    civic: [
      { id: 'ecg', name: 'ECG', full: 'Electricity Co of Ghana', icon: '⚡', ministry: 'Ministry of Energy', sla: 48 },
      { id: 'gwcl', name: 'GWCL', full: 'Ghana Water Co Ltd', icon: '💧', ministry: 'Ministry of Works', sla: 48 },
      { id: 'gps', name: 'Ghana Police', full: 'Ghana Police Service', icon: '⚖', ministry: 'Ministry of Interior', sla: 24 },
      { id: 'amc', name: 'Accra Metro', full: 'Accra Metropolitan Assembly', icon: '🏛', ministry: 'Local Government', sla: 48 },
    ],
    consumer: [{ id: 'mtn_gh', name: 'MTN Ghana', full: 'MTN Ghana Limited', sla: 72, icon: '📡' }],
  },
  RW: {
    civic: [
      { id: 'reg', name: 'REG', full: 'Rwanda Energy Group', icon: '⚡', ministry: 'Ministry of Infrastructure', sla: 48 },
      { id: 'wasac', name: 'WASAC', full: 'Water & Sanitation Corp Rwanda', icon: '💧', ministry: 'Ministry of Infrastructure', sla: 48 },
      { id: 'rnp', name: 'Rwanda Police', full: 'Rwanda National Police', icon: '⚖', ministry: 'Min. Internal Security', sla: 24 },
      { id: 'cob_rw', name: 'City of Kigali', full: 'City of Kigali', icon: '🏛', ministry: 'Kigali City', sla: 48 },
    ],
    consumer: [{ id: 'mtn_rw', name: 'MTN Rwanda', full: 'MTN Rwanda Limited', sla: 72, icon: '📡' }],
  },
  TZ: {
    civic: [
      { id: 'tanesco', name: 'TANESCO', full: 'Tanzania Electric Supply Co', icon: '⚡', ministry: 'Ministry of Energy', sla: 48 },
      { id: 'dawasa', name: 'DAWASA', full: 'Dar es Salaam Water & Sewerage', icon: '💧', ministry: 'Ministry of Water', sla: 48 },
      { id: 'tanroads', name: 'TANROADS', full: 'Tanzania National Roads Agency', icon: '🛣', ministry: 'Ministry of Works', sla: 48 },
      { id: 'tpb', name: 'Tanzania Police', full: 'Tanzania Police Force', icon: '⚖', ministry: 'Ministry of Home Affairs', sla: 24 },
    ],
    consumer: [{ id: 'vodacom_tz', name: 'Vodacom TZ', full: 'Vodacom Tanzania PLC', sla: 72, icon: '📡' }],
  },
  ZA: {
    civic: [
      { id: 'eskom', name: 'Eskom', full: 'Eskom Holdings SOC Ltd', icon: '⚡', ministry: 'Public Enterprises', sla: 48 },
      { id: 'joburg_water', name: 'Joburg Water', full: 'City of Johannesburg Water', icon: '💧', ministry: 'CoJ Municipality', sla: 48 },
      { id: 'saps', name: 'SAPS', full: 'South African Police Service', icon: '⚖', ministry: 'Police Ministry', sla: 24 },
      { id: 'sanral', name: 'SANRAL', full: 'SA National Roads Agency', icon: '🛣', ministry: 'Transport Dept', sla: 48 },
    ],
    consumer: [{ id: 'vodacom_za', name: 'Vodacom SA', full: 'Vodacom Group Ltd', sla: 72, icon: '📡' }],
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
};
