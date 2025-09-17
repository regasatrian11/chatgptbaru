import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Activity, MessageSquare, TrendingUp, Eye, Calendar, Crown, Smartphone, BarChart3 } from 'lucide-react';
import { userAnalytics, UserStats, UserActivity } from '../services/userAnalytics';

interface UserAnalyticsDashboardProps {
  onBack: () => void;
}

export default function UserAnalyticsDashboard({ onBack }: UserAnalyticsDashboardProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'activity'>('overview');

  useEffect(() => {
    loadData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const userStats = userAnalytics.getUserStats();
    const userActivities = userAnalytics.getUserActivities();
    
    setStats(userStats);
    setActivities(userActivities);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (isOnline: boolean, lastActive: Date | string) => {
    if (isOnline) return 'text-green-500';
    
    const now = new Date();
    const last = new Date(lastActive);
    const diffHours = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) return 'text-yellow-500';
    if (diffHours < 24) return 'text-orange-500';
    return 'text-gray-500';
  };

  const getStatusText = (isOnline: boolean, lastActive: Date | string) => {
    if (isOnline) return 'Online';
    
    const now = new Date();
    const last = new Date(lastActive);
    const diffMinutes = Math.floor((now.getTime() - last.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} hari lalu`;
  };

  if (!stats) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4">
        <div className="flex items-center gap-3 mb-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <BarChart3 className="text-blue-600" size={24} />
          <h1 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h1>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'activity'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Activity
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="text-blue-500" size={20} />
                  <span className="text-sm text-gray-600">Total Users</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="text-green-500" size={20} />
                  <span className="text-sm text-gray-600">Active Today</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.dailyActiveUsers}</p>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="text-purple-500" size={20} />
                  <span className="text-sm text-gray-600">Total Messages</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-orange-500" size={20} />
                  <span className="text-sm text-gray-600">Avg Messages</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.averageMessagesPerUser}</p>
              </div>
            </div>

            {/* User Distribution */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">User Distribution</h3>
              <div className="space-y-3">
                {stats.usersByPlan.map((plan, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {plan.plan === 'Demo' && <Smartphone className="text-yellow-500" size={16} />}
                      {plan.plan === 'Gratis' && <Users className="text-blue-500" size={16} />}
                      {plan.plan === 'Premium' && <Crown className="text-purple-500" size={16} />}
                      <span className="text-sm text-gray-700">{plan.plan}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{plan.count}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            plan.plan === 'Demo' ? 'bg-yellow-500' :
                            plan.plan === 'Gratis' ? 'bg-blue-500' : 'bg-purple-500'
                          }`}
                          style={{ 
                            width: `${stats.totalUsers > 0 ? (plan.count / stats.totalUsers) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration Trend */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Registrations (Last 7 Days)</h3>
              <div className="space-y-2">
                {stats.registrationsByDay.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {new Date(day.date).toLocaleDateString('id-ID', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{day.count}</span>
                      <div className="w-12 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ 
                            width: `${Math.max(day.count * 20, 5)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* User Summary */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">User Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-yellow-600">{stats.demoUsers}</p>
                  <p className="text-xs text-gray-600">Demo</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600">{stats.regularUsers}</p>
                  <p className="text-xs text-gray-600">Regular</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-600">{stats.premiumUsers}</p>
                  <p className="text-xs text-gray-600">Premium</p>
                </div>
              </div>
            </div>

            {/* User List */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">All Users ({activities.length})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activities.map((user, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium relative">
                      {user.userName.charAt(0)}
                      {user.accountType === 'demo' && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">D</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 truncate">{user.userName}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          user.accountType === 'demo' ? 'bg-yellow-100 text-yellow-800' :
                          user.accountType === 'premium' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {user.accountType}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{user.email}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className={`text-xs ${getStatusColor(user.isOnline, user.lastActive)}`}>
                          {getStatusText(user.isOnline, user.lastActive)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user.totalMessages} pesan
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {activities.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500">Belum ada pengguna</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            {/* Activity Summary */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Activity Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{stats.activeUsers}</p>
                  <p className="text-xs text-gray-600">Active (24h)</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">{stats.dailyActiveUsers}</p>
                  <p className="text-xs text-gray-600">Active Today</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activities.slice(0, 20).map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {user.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.userName}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-medium ${getStatusColor(user.isOnline, user.lastActive)}`}>
                        {getStatusText(user.isOnline, user.lastActive)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTime(user.lastActive)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {activities.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500">Belum ada aktivitas</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="p-4 bg-white border-t border-gray-100">
        <button
          onClick={loadData}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Activity size={16} />
          Refresh Data
        </button>
      </div>
    </div>
  );
}