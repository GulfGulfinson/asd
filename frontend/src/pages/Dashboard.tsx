import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loadProgress, updateTodayStatus } from '../store/slices/progressSlice';
import { 
  Trophy, 
  Flame, 
  BookOpen, 
  Target, 
  Clock, 
  Award,
  TrendingUp,
  Star,
  Zap
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    userStats, 
    dailyStreak, 
    achievements, 
    todayCompleted,
    loading 
  } = useSelector((state: RootState) => state.progress);

  useEffect(() => {
    dispatch(loadProgress());
    dispatch(updateTodayStatus());
  }, [dispatch]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getProgressPercentage = (): number => {
    return Math.round(((100 - userStats.pointsToNextLevel) / 100) * 100);
  };

  const getStreakColor = (): string => {
    if (dailyStreak.currentStreak >= 7) return 'text-orange-500';
    if (dailyStreak.currentStreak >= 3) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getRecentAchievements = () => {
    return achievements
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
      .slice(0, 3);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Ihr Lernfortschritt
        </h1>
        <p className="text-gray-600">
          Verfolgen Sie Ihre Lernerfolge und bleiben Sie motiviert
        </p>
      </div>

      {/* Today's Status */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Heute</h2>
            <p className="text-blue-100">
              {todayCompleted 
                ? "🎉 Großartig! Sie haben heute bereits gelernt!" 
                : "📚 Bereit für eine neue Lektion heute?"
              }
            </p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getStreakColor()}`}>
              <Flame className="inline w-8 h-8 mr-2" />
              {dailyStreak.currentStreak}
            </div>
            <p className="text-blue-100">Tage-Streak</p>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Lessons Completed */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lektionen</p>
              <p className="text-2xl font-bold text-gray-900">
                {userStats.totalLessonsCompleted}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Quizzes Passed */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quiz bestanden</p>
              <p className="text-2xl font-bold text-gray-900">
                {userStats.totalQuizzesPassed}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Time Spent */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lernzeit</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(userStats.totalTimeSpent)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Current Level */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Level</p>
              <p className="text-2xl font-bold text-gray-900">
                {userStats.currentLevel}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Streak Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Flame className="w-5 h-5 mr-2 text-orange-500" />
            Lern-Streak
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Aktueller Streak</span>
              <span className={`text-2xl font-bold ${getStreakColor()}`}>
                {dailyStreak.currentStreak} Tage
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Längster Streak</span>
              <span className="text-xl font-semibold text-gray-900">
                {dailyStreak.longestStreak} Tage
              </span>
            </div>
            
            {dailyStreak.streakStartDate && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Streak gestartet</span>
                <span className="text-sm text-gray-500">
                  {new Date(dailyStreak.streakStartDate).toLocaleDateString('de-DE')}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-700">
              💡 <strong>Tipp:</strong> Lernen Sie jeden Tag, um Ihren Streak zu erhalten und Bonuspunkte zu sammeln!
            </p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Level Fortschritt
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Aktuelles Level</span>
              <span className="text-2xl font-bold text-blue-600">
                {userStats.currentLevel}
              </span>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Fortschritt zu Level {userStats.currentLevel + 1}</span>
                <span>{100 - userStats.pointsToNextLevel}/100 Punkte</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Gesamtpunkte</span>
              <span className="text-xl font-semibold text-gray-900">
                {userStats.totalPoints}
              </span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              🎯 Noch <strong>{userStats.pointsToNextLevel} Punkte</strong> bis zum nächsten Level!
            </p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-yellow-500" />
          Erfolge ({achievements.length})
        </h3>
        
        {achievements.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Noch keine Erfolge freigeschaltet</p>
            <p className="text-sm text-gray-400 mt-1">
              Absolvieren Sie Ihre erste Lektion, um einen Erfolg zu erhalten!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Recent Achievements */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Kürzlich freigeschaltet</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getRecentAchievements().map((achievement) => (
                  <div 
                    key={achievement.id}
                    className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                  >
                    <div className="text-2xl mr-3">{achievement.icon}</div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {achievement.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        {new Date(achievement.unlockedAt).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Achievements */}
            {achievements.length > 3 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Alle Erfolge</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id}
                      className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      title={`${achievement.name}: ${achievement.description}`}
                    >
                      <div className="text-2xl mb-1">{achievement.icon}</div>
                      <p className="text-xs text-center text-gray-700 font-medium">
                        {achievement.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quiz Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-green-500" />
          Quiz-Leistung
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {userStats.totalQuizzesPassed}
            </div>
            <p className="text-sm text-gray-600">Quiz bestanden</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {userStats.averageQuizScore.toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600">Durchschnittliche Punktzahl</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {Math.floor(userStats.averageQuizScore / 10)}
            </div>
            <p className="text-sm text-gray-600">Sterne verdient</p>
          </div>
        </div>

        {userStats.averageQuizScore > 0 && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              {userStats.averageQuizScore >= 80 
                ? "🌟 Ausgezeichnet! Sie meistern die Quizzes mit Bravour!"
                : userStats.averageQuizScore >= 60
                ? "👍 Gut gemacht! Weiter so!"
                : "💪 Übung macht den Meister - Sie sind auf dem richtigen Weg!"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 