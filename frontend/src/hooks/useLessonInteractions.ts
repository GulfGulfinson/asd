import { useState, useCallback, useEffect } from 'react';
import { lessonsAPI } from '../services/api';

export interface LessonStats {
  viewsCount: number;
  uniqueViewers: number;
  likesCount: number;
  completedUsers: number;
  completionRate: number;
  averageTimeSpent: number;
  totalTimeSpent: number;
  lastUpdated: Date;
}

export interface ShareData {
  url: string;
  title: string;
  description: string;
  image?: string;
}

export const useLessonInteractions = (lessonId: string) => {
  const [stats, setStats] = useState<LessonStats | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Fetch lesson statistics
  const fetchStats = useCallback(async () => {
    if (!lessonId) return;
    
    try {
      const response = await lessonsAPI.getLessonStats(lessonId);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch lesson stats:', error);
    }
  }, [lessonId]);

  // Share lesson
  const shareLesson = useCallback(async (platform: string = 'link'): Promise<ShareData | null> => {
    if (isSharing) return null;
    
    setIsSharing(true);
    setShareSuccess(false);
    
    try {
      const response = await lessonsAPI.shareLesson(lessonId, platform, 'manual');
      
      // Show success animation
      setShareSuccess(true);
      setTimeout(() => {
        setShareSuccess(false);
      }, 2000);
      
      return response.data;
    } catch (error) {
      console.error('Failed to share lesson:', error);
      return null;
    } finally {
      setIsSharing(false);
    }
  }, [lessonId, isSharing]);

  // Share via native Web Share API or copy to clipboard
  const handleShare = useCallback(async () => {
    const shareData = await shareLesson('social');
    
    if (!shareData) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.description,
          url: shareData.url,
        });
      } catch (error) {
        // User cancelled or share failed, fallback to clipboard
        await copyToClipboard(shareData.url);
      }
    } else {
      // Fallback to clipboard
      await copyToClipboard(shareData.url);
    }
  }, [shareLesson]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could trigger a toast notification here
      console.log('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, []);

  // Fetch stats on mount and when lessonId changes
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Format numbers for display
  const formatNumber = useCallback((num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  }, []);

  // Format time duration
  const formatDuration = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  }, []);

  return {
    // Stats
    stats,
    
    // Share functionality
    isSharing,
    shareSuccess,
    shareLesson,
    handleShare,
    copyToClipboard,
    
    // Utilities
    formatNumber,
    formatDuration,
    refreshStats: fetchStats
  };
}; 