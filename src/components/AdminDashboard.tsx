import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Activity, CreditCard, TrendingUp, Eye, EyeOff, Key, Ban, CheckCircle, AlertCircle, DollarSign, Calendar, Smartphone, Monitor } from 'lucide-react';
import { adminAuth } from '../services/adminAuth';
import { userManagement, UserManagementData, PaymentRecord } from '../services/userManagement';

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'traffic' | 'users' | 'payments' | 'management'>('traffic');
  const [users, setUsers] = useState<UserManagementData[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [trafficData, setTrafficData] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<UserManagementData | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const usersData = userManagement.getAllUsers();
    const paymentsData = userManagement.getPaymentRecords();
    const traffic = userManagement.getTrafficData();
    
    setUsers(usersData);
    setPayments(paymentsData);
    setTrafficData(traffic);
  };

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari admin panel?')) {
      adminAuth.logoutAdmin();
      onBack();
    }
  };

  const handleResetPassword = () => {
    if (!selectedUser || !newPassword) return;
    
    const success = userManagement.resetUserPassword(selectedUser.id, newPassword);
    if (success) {
      alert(`Password untuk ${selectedUser.name} berhasil direset`);
      setShowPasswordModal(false);
      setNewPassword('');
      setSelectedUser(null);
    } else {
      alert('Gagal mereset password');
    }
  };

  const handleSuspendUser = (user: UserManagementData) => {
    const reason = prompt(`Masukkan alasan suspend untuk ${user.name}:`);
    if (reason) {
      const success = userManagement.suspendUser(user.id, reason);
      if (success) {
        alert(`User ${user.name} berhasil disuspend`);
        loadData();
      } else {
        alert('Gagal suspend user');
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'text-green-600 bg-green-100';
      case 'UNPAID': return 'text-yellow-600 bg-yellow-100';
      case 'EXPIRED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!trafficData) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data admin...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Password Reset Modal */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reset Password - {selectedUser.name}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Baru
              </label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan password baru"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleResetPassword}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Reset Password
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword('');
                  setSelectedUser(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <Users size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Kelola pengguna dan sistem</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-500 text-sm font-medium hover:text-red-600 px-3 py-1 rounded hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('traffic')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'traffic'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Traffic
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'payments'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setActiveTab('management')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'management'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Manage
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'traffic' && (
          <div className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="text-blue-500" size={20} />
                  <span className="text-sm text-gray-600">Total Users</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{trafficData.totalUsers}</p>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="text-green-500" size={20} />
                  <span className="text-sm text-gray-600">Online Now</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{trafficData.onlineUsers}</p>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="text-purple-500" size={20} />
                  <span className="text-sm text-gray-600">Today</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{trafficData.todayUsers}</p>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="text-orange-500" size={20} />
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(trafficData.totalRevenue)}</p>
              </div>
            </div>

            {/* Traffic Overview */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Traffic Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Weekly Active</span>
                  <span className="font-medium text-gray-900">{trafficData.weeklyUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Monthly Active</span>
                  <span className="font-medium text-gray-900">{trafficData.monthlyUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Messages</span>
                  <span className="font-medium text-gray-900">{trafficData.totalMessages}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Messages/User</span>
                  <span className="font-medium text-gray-900">{trafficData.averageMessagesPerUser}</span>
                </div>
              </div>
            </div>

            {/* User Distribution */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">User Distribution</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="text-yellow-500" size={16} />
                    <span className="text-sm text-gray-700">Demo Users</span>
                  </div>
                  <span className="font-medium text-gray-900">{trafficData.demoUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="text-blue-500" size={16} />
                    <span className="text-sm text-gray-700">Regular Users</span>
                  </div>
                  <span className="font-medium text-gray-900">{trafficData.regularUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="text-purple-500" size={16} />
                    <span className="text-sm text-gray-700">Premium Users</span>
                  </div>
                  <span className="font-medium text-gray-900">{trafficData.premiumUsers}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">All Users ({users.length})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium relative">
                      {user.name.charAt(0)}
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 truncate">{user.name}</h4>
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
                        <span className="text-xs text-gray-500">
                          {user.totalMessages} pesan
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(user.lastActive)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Records</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {payments.map((payment) => (
                  <div key={payment.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{payment.userName}</h4>
                        <p className="text-xs text-gray-600">{payment.userEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{payment.planName} - {payment.paymentMethod}</span>
                      <span>{formatDate(payment.transactionDate)}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs text-gray-400">Ref: {payment.reference}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'management' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">User Management</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900">{user.name}</h4>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowPasswordModal(true);
                        }}
                        className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Reset Password"
                      >
                        <Key size={16} />
                      </button>
                      <button
                        onClick={() => handleSuspendUser(user)}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Suspend User"
                      >
                        <Ban size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="p-4 bg-white border-t border-gray-100">
        <button
          onClick={loadData}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <Activity size={16} />
          Refresh Data
        </button>
      </div>
    </div>
  );
}