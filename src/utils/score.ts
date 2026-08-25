import { UserProfile } from '../types';
import { getRank } from './helpers';

export function addScoreToProfile(profile: UserProfile, pts: number): UserProfile {
  const newScore = (profile.civic_score || 0) + pts;
  const newRank = getRank(newScore).name;
  return {
    ...profile,
    civic_score: newScore,
    rank: newRank,
  };
}
