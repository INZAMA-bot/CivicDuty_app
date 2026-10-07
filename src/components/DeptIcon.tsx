import React from 'react';
import {
  Landmark,
  Building2,
  Droplets,
  Zap,
  Scale,
  ShieldCheck,
  HeartPulse,
  GraduationCap,
  Radio,
  Bus,
  Utensils,
  Store,
  HardHat,
  Trash2,
  AlertTriangle,
  Award,
  Layers,
  CreditCard,
  Wrench,
} from 'lucide-react';
import { Department, EntityCategory, TicketCategory } from '../types';

interface DeptIconProps {
  dept?: Partial<Department> | null;
  iconStr?: string;
  category?: EntityCategory | string;
  size?: number;
  className?: string;
}

/**
 * Google AI Studio UI Grade Icon Component (1.75px stroke monochrome vector geometry).
 * Replaces all legacy decorative icons with crisp technical vectors.
 */
export const DeptIcon: React.FC<DeptIconProps> = ({
  dept,
  iconStr,
  category,
  size = 16,
  className = '',
}) => {
  const cat = (dept?.category || category || '').toLowerCase();
  const id = (dept?.id || '').toLowerCase();
  const rawIcon = (iconStr || dept?.icon || '').toLowerCase();
  const strokeWidth = 1.75;

  if (
    cat === 'water' ||
    id.includes('water') ||
    id.includes('nwsc') ||
    id.includes('dawasa') ||
    id.includes('wasac') ||
    id.includes('lwsc') ||
    id.includes('aawsa') ||
    id.includes('hcww') ||
    id.includes('sen_eau') ||
    id.includes('djb') ||
    rawIcon === 'droplets' ||
    rawIcon === 'water'
  ) {
    return <Droplets size={size} strokeWidth={strokeWidth} className={className} />;
  }

  if (
    cat === 'utility' ||
    id.includes('power') ||
    id.includes('umeme') ||
    id.includes('kplc') ||
    id.includes('ecg') ||
    id.includes('eskom') ||
    id.includes('zetdc') ||
    id.includes('tanesco') ||
    id.includes('reg') ||
    id.includes('stadtwerke') ||
    rawIcon === 'zap' ||
    rawIcon === 'power'
  ) {
    return <Zap size={size} strokeWidth={strokeWidth} className={className} />;
  }

  if (
    cat === 'health' ||
    id.includes('health') ||
    id.includes('hosp') ||
    id.includes('mulago') ||
    id.includes('knh') ||
    id.includes('luth') ||
    rawIcon === 'heart-pulse' ||
    rawIcon === 'health'
  ) {
    return <HeartPulse size={size} strokeWidth={strokeWidth} className={className} />;
  }

  if (
    cat === 'education' ||
    id.includes('univ') ||
    id.includes('mak') ||
    id.includes('uon') ||
    id.includes('unilag') ||
    id.includes('school') ||
    id.includes('edu') ||
    rawIcon === 'graduation-cap' ||
    rawIcon === 'education'
  ) {
    return <GraduationCap size={size} strokeWidth={strokeWidth} className={className} />;
  }

  if (
    cat === 'telecom' ||
    id.includes('telecom') ||
    id.includes('mtn') ||
    id.includes('airtel') ||
    id.includes('safaricom') ||
    rawIcon === 'radio' ||
    rawIcon === 'telecom'
  ) {
    return <Radio size={size} strokeWidth={strokeWidth} className={className} />;
  }

  if (
    cat === 'finance' ||
    id.includes('bank') ||
    id.includes('stanbic') ||
    id.includes('centenary') ||
    id.includes('equity') ||
    id.includes('gtbank') ||
    id.includes('mofped') ||
    rawIcon === 'credit-card' ||
    rawIcon === 'finance'
  ) {
    return <CreditCard size={size} strokeWidth={strokeWidth} className={className} />;
  }

  if (
    cat === 'transport' ||
    id.includes('transit') ||
    id.includes('bus') ||
    id.includes('boda') ||
    id.includes('matatu') ||
    id.includes('unra') ||
    id.includes('kenha') ||
    id.includes('ferma') ||
    rawIcon === 'bus' ||
    rawIcon === 'transport'
  ) {
    return <Bus size={size} strokeWidth={strokeWidth} className={className} />;
  }

  if (
    cat === 'hospitality' ||
    id.includes('cafe') ||
    id.includes('javas') ||
    id.includes('hotel') ||
    id.includes('food') ||
    rawIcon === 'utensils' ||
    rawIcon === 'hospitality'
  ) {
    return <Utensils size={size} strokeWidth={strokeWidth} className={className} />;
  }

  if (
    cat === 'housing' ||
    id.includes('mall') ||
    id.includes('plaza') ||
    id.includes('market') ||
    rawIcon === 'store' ||
    rawIcon === 'building-2' ||
    rawIcon === 'housing'
  ) {
    return <Store size={size} strokeWidth={strokeWidth} className={className} />;
  }

  if (
    cat === 'contractor' ||
    id.includes('works') ||
    id.includes('construct') ||
    rawIcon === 'hard-hat' ||
    rawIcon === 'contractor'
  ) {
    return <HardHat size={size} strokeWidth={strokeWidth} className={className} />;
  }

  if (
    id.includes('police') ||
    id.includes('upf') ||
    id.includes('nps') ||
    id.includes('court') ||
    rawIcon === 'scale' ||
    rawIcon === 'police'
  ) {
    return <Scale size={size} strokeWidth={strokeWidth} className={className} />;
  }

  if (
    cat === 'cso' ||
    id.includes('ombudsman') ||
    id.includes('igg') ||
    id.includes('eacc') ||
    id.includes('efcc') ||
    id.includes('cso') ||
    rawIcon === 'shield-check' ||
    rawIcon === 'cso'
  ) {
    return <ShieldCheck size={size} strokeWidth={strokeWidth} className={className} />;
  }

  if (
    id.includes('waste') ||
    id.includes('lawma') ||
    rawIcon === 'trash-2' ||
    rawIcon === 'waste'
  ) {
    return <Trash2 size={size} strokeWidth={strokeWidth} className={className} />;
  }

  if (cat === 'government' || dept?.lane === 'civic' || rawIcon === 'landmark') {
    return <Landmark size={size} strokeWidth={strokeWidth} className={className} />;
  }

  return <Building2 size={size} strokeWidth={strokeWidth} className={className} />;
};

interface CategoryIconProps {
  category: TicketCategory | string;
  size?: number;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  size = 13,
  className = '',
}) => {
  const strokeWidth = 1.75;
  switch (category) {
    case 'corruption':
      return <AlertTriangle size={size} strokeWidth={strokeWidth} className={className} />;
    case 'pothole':
      return <Wrench size={size} strokeWidth={strokeWidth} className={className} />;
    case 'water':
      return <Droplets size={size} strokeWidth={strokeWidth} className={className} />;
    case 'power':
      return <Zap size={size} strokeWidth={strokeWidth} className={className} />;
    case 'health':
      return <HeartPulse size={size} strokeWidth={strokeWidth} className={className} />;
    case 'education':
      return <GraduationCap size={size} strokeWidth={strokeWidth} className={className} />;
    case 'hospitality':
      return <Utensils size={size} strokeWidth={strokeWidth} className={className} />;
    case 'finance':
      return <CreditCard size={size} strokeWidth={strokeWidth} className={className} />;
    case 'transport':
      return <Bus size={size} strokeWidth={strokeWidth} className={className} />;
    case 'housing':
      return <Store size={size} strokeWidth={strokeWidth} className={className} />;
    case 'telecom':
      return <Radio size={size} strokeWidth={strokeWidth} className={className} />;
    case 'waste':
      return <Trash2 size={size} strokeWidth={strokeWidth} className={className} />;
    case 'police':
      return <Scale size={size} strokeWidth={strokeWidth} className={className} />;
    case 'praise':
      return <Award size={size} strokeWidth={strokeWidth} className={className} />;
    default:
      return <Layers size={size} strokeWidth={strokeWidth} className={className} />;
  }
};
