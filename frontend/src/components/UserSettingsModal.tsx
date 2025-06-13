
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { User, Settings } from 'lucide-react';
import UserProfileTab from './profile/UserProfileTab';
import UserSettingsTab from './profile/UserSettingsTab';

interface UserSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const UserSettingsModal = ({ open, onClose }: UserSettingsModalProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    avatar_url: '',
    phone: '',
    location: ''
  });
  const [preferences, setPreferences] = useState({
    notifications_enabled: true,
    language: 'en'
  });

  // Mock user stats - in real app these would come from database
  const userStats = {
    currentLevel: 15,
    streak: 12,
    avgTimePerDay: 45, // minutes
    weeklyHours: [2.5, 1.8, 3.2, 2.1, 2.8, 1.5, 2.3], // hours per day for the week
    totalHours: 120,
    completedLessons: 85
  };

  useEffect(() => {
    if (user && open) {
      fetchProfile();
      fetchPreferences();
    }
  }, [user, open]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          username: data.username || '',
          avatar_url: data.avatar_url || '',
          phone: data.phone || '',
          location: data.location || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          notifications_enabled: data.notifications_enabled,
          language: data.language
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>User Profile & Settings</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('profile')}
            className="flex-1"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('settings')}
            className="flex-1"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>

        {activeTab === 'profile' && (
          <UserProfileTab 
            user={user} 
            profile={profile} 
            setProfile={setProfile} 
            userStats={userStats} 
          />
        )}

        {activeTab === 'settings' && (
          <UserSettingsTab 
            user={user} 
            preferences={preferences} 
            setPreferences={setPreferences} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserSettingsModal;
