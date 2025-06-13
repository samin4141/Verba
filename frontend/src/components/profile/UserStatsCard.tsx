
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Target, Zap, Calendar } from 'lucide-react';

interface UserStats {
  currentLevel: number;
  streak: number;
  avgTimePerDay: number;
  weeklyHours: number[];
  totalHours: number;
  completedLessons: number;
}

interface UserStatsCardProps {
  userStats: UserStats;
}

const UserStatsCard = ({ userStats }: UserStatsCardProps) => {
  const formatWeeklyHours = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return userStats.weeklyHours.map((hours, index) => ({
      day: days[index],
      hours: hours.toFixed(1)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Learning Statistics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 border rounded-lg">
            <div className="text-2xl font-bold text-primary">{userStats.currentLevel}</div>
            <div className="text-sm text-muted-foreground">Current Level</div>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-2xl font-bold text-orange-500 flex items-center justify-center">
              <Zap className="h-5 w-5 mr-1" />
              {userStats.streak}
            </div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-2xl font-bold text-green-500">{userStats.avgTimePerDay}m</div>
            <div className="text-sm text-muted-foreground">Avg/Day</div>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-2xl font-bold text-blue-500">{userStats.totalHours}h</div>
            <div className="text-sm text-muted-foreground">Total Hours</div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-3 flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Weekly Activity</span>
          </h4>
          <div className="grid grid-cols-7 gap-2">
            {formatWeeklyHours().map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-muted-foreground mb-1">{day.day}</div>
                <div className="text-sm font-medium">{day.hours}h</div>
                <div className="h-2 bg-muted rounded-full mt-1">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min((parseFloat(day.hours) / 4) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatsCard;
