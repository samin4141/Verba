
import PersonalInfoForm from './PersonalInfoForm';
import UserStatsCard from './UserStatsCard';
import { User } from '@supabase/supabase-js';

interface Profile {
  full_name: string;
  username: string;
  avatar_url: string;
  phone: string;
  location: string;
}

interface UserStats {
  currentLevel: number;
  streak: number;
  avgTimePerDay: number;
  weeklyHours: number[];
  totalHours: number;
  completedLessons: number;
}

interface UserProfileTabProps {
  user: User | null;
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  userStats: UserStats;
}

const UserProfileTab = ({ user, profile, setProfile, userStats }: UserProfileTabProps) => {
  return (
    <div className="space-y-6">
      <PersonalInfoForm user={user} profile={profile} setProfile={setProfile} />
      <UserStatsCard userStats={userStats} />
    </div>
  );
};

export default UserProfileTab;
