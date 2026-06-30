'use client';

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { twMerge } from 'tailwind-merge';
import {
  Users,
  Activity,
  Trophy,
  TrendingUp,
  Wallet,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bell,
  FileText,
  ShieldAlert,
  Search,
  Download,
  ZoomIn,
  Camera,
  Database
} from 'lucide-react';

// Design System Imports
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/cards/StatCard';
import RevenueCard from '@/components/cards/RevenueCard';
import ChartCard from '@/components/cards/ChartCard';
import StatusCard from '@/components/cards/StatusCard';
import DataTable from '@/components/tables/DataTable';
import TableCard from '@/components/tables/TableCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Modal from '@/components/ui/Modal';
import Drawer from '@/components/ui/Drawer';
import SearchBar from '@/components/ui/SearchBar';
import EmptyState from '@/components/ui/EmptyState';
import { CardSkeleton, TableSkeleton } from '@/components/ui/LoadingSkeleton';

// Recharts Custom Wrappers
import RevenueChart from '@/components/charts/RevenueChart';
import UserChart from '@/components/charts/UserChart';
import BattleChart from '@/components/charts/BattleChart';
import ProfitChart from '@/components/charts/ProfitChart';

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);

  // Dashboard state variables
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'users' | 'battles' | 'ai_reviews' | 'screenshots' | 'transactions' | 'deposits_withdrawals' | 'referrals' | 'reports_audit' | 'settings'>('overview');
  
  // Data lists
  const [stats, setStats] = useState<any>(null);
  const [financialStats, setFinancialStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [battles, setBattles] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [screenshots, setScreenshots] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [referralAnalytics, setReferralAnalytics] = useState<any>(null);
  const [topReferrers, setTopReferrers] = useState<any[]>([]);
  const [referralEarnings, setReferralEarnings] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  
  // Settings Editor
  const [settings, setSettings] = useState<any[]>([]);
  const [originalSettings, setOriginalSettings] = useState<any[]>([]);
  const [activeSettingsCategory, setActiveSettingsCategory] = useState<'GENERAL' | 'WALLET' | 'BATTLE' | 'REFERRAL' | 'PAYMENTS' | 'NOTIFICATIONS' | 'SECURITY'>('GENERAL');


  // Modal / Drawer variables
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [adjustingUser, setAdjustingUser] = useState<any>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [disputeBattle, setDisputeBattle] = useState<any>(null);
  const [rejectWithdrawalId, setRejectWithdrawalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Form input variables
  const [adjustAmount, setAdjustAmount] = useState('100');
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit');
  const [adjustBalanceType, setAdjustBalanceType] = useState<'DEPOSIT' | 'WINNING' | 'BONUS'>('DEPOSIT');
  const [disputeDecision, setDisputeDecision] = useState<'CREATOR_WIN' | 'JOINER_WIN' | 'CANCEL'>('CREATOR_WIN');
  
  // Notification Broadcast
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [notifTarget, setNotifTarget] = useState('all');
  const [notifTargetId, setNotifTargetId] = useState('');

  // Search & Filters state
  const [userSearch, setUserSearch] = useState('');
  const [battleSearch, setBattleSearch] = useState('');
  const [txSearch, setTxSearch] = useState('');
  const [auditSearch, setAuditSearch] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');

  // Auto-fill token from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        setToken(savedToken);
      }
    }
  }, []);

  // Fetch all dashboard data when token is loaded
  useEffect(() => {
    if (token) {
      fetchAllData();

      // Setup Socket.IO connection
      const socket = io('https://ludo-backend-production-72bc.up.railway.app', {
        auth: { token }
      });

      socket.on('connect', () => {
        console.log('🔌 Connected to Live Admin Dashboard Socket');
        setSocketConnected(true);
      });

      socket.on('disconnect', () => {
        setSocketConnected(false);
      });

      socket.on('connect_error', (err) => {
        console.error('🔌 Socket connection error:', err.message);
        if (err.message.includes('Authentication error') || err.message.includes('token')) {
          handleLogout();
          setError('Session expired. Please log in again.');
        }
      });

      socket.on('battle_list_update', () => {
        console.log('🔄 Real-time update: Battle outcome declared');
        fetchOverviewStats();
        fetchFinancialStats();
        fetchBattles();
        fetchPendingReviews();
      });

      // Poll as a robust failover every 20 seconds
      const timer = setInterval(() => {
        fetchAllData();
      }, 20000);

      return () => {
        socket.disconnect();
        clearInterval(timer);
      };
    }
  }, [token]);

  const fetchAllData = () => {
    fetchOverviewStats();
    fetchFinancialStats();
    fetchUsers();
    fetchBattles();
    fetchPendingReviews();
    fetchScreenshots();
    fetchTransactions();
    fetchDepositsAndWithdrawals();
    fetchReferralData();
    fetchAuditLogs();
    fetchSettings();
  };

  const headers = () => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setStats(null);
    setFinancialStats(null);
  };

  const customFetch = async (url: string, init?: RequestInit) => {
    try {
      const res = await fetch(url, init);
      if (res.status === 401) {
        handleLogout();
        setError('Session expired. Please log in again.');
        return null;
      }
      return res;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const fetchOverviewStats = async () => {
    try {
      const res = await customFetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/dashboard-stats', { headers: headers() });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') setStats(data.data);
    } catch (e) { console.error(e); }
  };

  const fetchFinancialStats = async () => {
    try {
      const res = await customFetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/stats-financial', { headers: headers() });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') setFinancialStats(data.data);
    } catch (e) { console.error(e); }
  };

  const fetchUsers = async () => {
    try {
      const res = await customFetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/users-detailed', { headers: headers() });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') setUsers(data.data.users);
    } catch (e) { console.error(e); }
  };

  const fetchBattles = async () => {
    try {
      const res = await customFetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/battles', { headers: headers() });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') setBattles(data.data.battles);
    } catch (e) { console.error(e); }
  };

  const fetchPendingReviews = async () => {
    try {
      const res = await customFetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/pending-ai-reviews', { headers: headers() });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') setReviews(data.data.reviews);
    } catch (e) { console.error(e); }
  };

  const fetchScreenshots = async () => {
    try {
      const res = await customFetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/screenshots', { headers: headers() });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') setScreenshots(data.data.screenshots);
    } catch (e) { console.error(e); }
  };

  const fetchTransactions = async () => {
    try {
      const res = await customFetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/transactions', { headers: headers() });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') setTransactions(data.data.transactions);
    } catch (e) { console.error(e); }
  };

  const fetchDepositsAndWithdrawals = async () => {
    try {
      const resDep = await customFetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/deposits', { headers: headers() });
      if (resDep) {
        const dataDep = await resDep.json();
        if (dataDep.status === 'success') setDeposits(dataDep.data.deposits);
      }

      const resWit = await customFetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/withdrawals', { headers: headers() });
      if (resWit) {
        const dataWit = await resWit.json();
        if (dataWit.status === 'success') setWithdrawals(dataWit.data.withdrawals);
      }
    } catch (e) { console.error(e); }
  };

  const fetchReferralData = async () => {
    try {
      const resAna = await customFetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/referral-analytics', { headers: headers() });
      if (resAna) {
        const dataAna = await resAna.json();
        if (dataAna.status === 'success') setReferralAnalytics(dataAna.data.analytics);
      }

      const resTop = await customFetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/referral-top', { headers: headers() });
      if (resTop) {
        const dataTop = await resTop.json();
        if (dataTop.status === 'success') setTopReferrers(dataTop.data.topReferrers);
      }

      const resEar = await customFetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/referral-earnings', { headers: headers() });
      if (resEar) {
        const dataEar = await resEar.json();
        if (dataEar.status === 'success') setReferralEarnings(dataEar.data.earningsList);
      }
    } catch (e) { console.error(e); }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await customFetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/audit-logs', { headers: headers() });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') setAuditLogs(data.data.auditLogs);
    } catch (e) { console.error(e); }
  };

  const fetchSettings = async () => {
    try {
      const res = await customFetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/system-settings', { headers: headers() });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') {
        setSettings(data.data.settings);
        setOriginalSettings(JSON.parse(JSON.stringify(data.data.settings)));
      }
    } catch (e) { console.error(e); }
  };

  // Auth logins
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        if (data.data.user.role !== 'ADMIN' && data.data.user.role !== 'SUPPORT') {
          setError('Access denied: Unauthorized role');
          setLoading(false);
          return;
        }
        localStorage.setItem('token', data.data.token);
        setToken(data.data.token);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network connection error');
    } finally {
      setLoading(false);
    }
  };

  // Administrative Actions
  const handleUserStatusToggle = async (userId: string, currentStatus: string) => {
    const status = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await customFetch(`https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify({ status })
      });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') {
        setMessage(`User status updated to ${status}`);
        fetchUsers();
        fetchAuditLogs();
      }
    } catch (e) { console.error(e); }
  };

  const handleAdjustWalletSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingUser) return;
    try {
      const amt = parseFloat(adjustAmount) * (adjustType === 'credit' ? 1 : -1);
      const res = await customFetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/wallet/adjust', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          userId: adjustingUser.id,
          amount: amt,
          balanceType: adjustBalanceType,
          type: adjustType
        })
      });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') {
        setMessage('Wallet updated successfully');
        setAdjustingUser(null);
        fetchUsers();
        fetchOverviewStats();
        fetchFinancialStats();
        fetchAuditLogs();
      } else {
        setError(data.message || 'Adjustment failed');
      }
    } catch (err) { console.error(err); }
  };

  const handleApproveWithdrawal = async (withdrawalId: string) => {
    try {
      const res = await customFetch(`https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/withdrawals/${withdrawalId}/approve`, {
        method: 'POST',
        headers: headers()
      });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') {
        setMessage('Withdrawal approved successfully');
        fetchDepositsAndWithdrawals();
        fetchFinancialStats();
        fetchAuditLogs();
      }
    } catch (err) { console.error(err); }
  };

  const handleRejectWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectWithdrawalId) return;
    try {
      const res = await customFetch(`https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/withdrawals/${rejectWithdrawalId}/reject`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ reason: rejectReason })
      });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') {
        setMessage('Withdrawal request rejected and refunded');
        setRejectWithdrawalId(null);
        setRejectReason('');
        fetchDepositsAndWithdrawals();
        fetchFinancialStats();
        fetchAuditLogs();
      }
    } catch (err) { console.error(err); }
  };

  const handleApproveDeposit = async (depositId: string) => {
    try {
      const res = await customFetch(`https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/deposits/${depositId}/approve`, {
        method: 'POST',
        headers: headers()
      });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') {
        setMessage('Deposit approved successfully');
        fetchDepositsAndWithdrawals();
        fetchFinancialStats();
        fetchAuditLogs();
      }
    } catch (err) { console.error(err); }
  };

  const handleRejectDeposit = async (depositId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      const res = await customFetch(`https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/deposits/${depositId}/reject`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ reason })
      });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') {
        setMessage('Deposit request rejected');
        fetchDepositsAndWithdrawals();
        fetchFinancialStats();
        fetchAuditLogs();
      }
    } catch (err) { console.error(err); }
  };

  const handleResolveAIReview = async (battleId: string, decision: string, winnerId?: string) => {
    try {
      const res = await customFetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/resolve-ai-review', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          battleId,
          decision,
          winnerId,
          adminNotes: 'Resolved manually from reviews portal'
        })
      });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') {
        setMessage('Review resolved successfully');
        fetchPendingReviews();
        fetchBattles();
        fetchFinancialStats();
        fetchAuditLogs();
      } else {
        setError(data.message || 'Resolution failed');
      }
    } catch (err) { console.error(err); }
  };

  const handleResolveDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeBattle) return;
    try {
      const res = await customFetch(`https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/battles/${disputeBattle.id}/resolve-dispute`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ decision: disputeDecision })
      });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') {
        setMessage('Battle dispute resolved');
        setDisputeBattle(null);
        fetchBattles();
        fetchFinancialStats();
        fetchAuditLogs();
      }
    } catch (err) { console.error(err); }
  };

  const handleBroadcastNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userIds = notifTarget === 'all' ? 'all' : [notifTargetId];
      const res = await customFetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/send-notification', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          userIds,
          title: notifTitle,
          body: notifBody,
          type: 'SYSTEM'
        })
      });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') {
        setMessage('Broadcast sent successfully!');
        setNotifTitle('');
        setNotifBody('');
        setNotifTargetId('');
        fetchAuditLogs();
      }
    } catch (e) { console.error(e); }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Record<string, string> = {};
      settings.forEach(s => {
        payload[s.key] = s.value;
      });

      const res = await customFetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/system-settings', {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(payload)
      });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') {
        setMessage('Configurations updated successfully');
        setSettings(data.data.settings);
        setOriginalSettings(JSON.parse(JSON.stringify(data.data.settings)));
        fetchAuditLogs();
      } else {
        setError(data.message || 'Update failed');
      }
    } catch (e) { console.error(e); }
  };

  const handleSaveSingleSetting = async (key: string, value: string) => {
    setMessage('');
    setError('');
    try {
      const res = await customFetch('https://ludo-backend-production-72bc.up.railway.app/api/v1/admin/system-settings', {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ [key]: value })
      });
      if (!res) return;
      const data = await res.json();
      if (data.status === 'success') {
        setMessage(`Setting '${key}' updated successfully`);
        setSettings(data.data.settings);
        setOriginalSettings(JSON.parse(JSON.stringify(data.data.settings)));
        fetchAuditLogs();
      } else {
        setError(data.message || 'Update failed');
      }
    } catch (e) { console.error(e); }
  };

  const handleResetSingleSetting = (key: string) => {
    const orig = originalSettings.find(s => s.key === key);
    if (orig) {
      setSettings(prev => prev.map(s => s.key === key ? { ...s, value: orig.value } : s));
    }
  };

  const handleSettingChange = (key: string, newValue: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value: newValue } : s));
  };

  // Client-side report export utilities (CSV generator)
  const exportToCSV = (jsonData: any[], filename: string) => {
    if (!jsonData || jsonData.length === 0) return;
    const keys = Object.keys(jsonData[0]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [keys.join(','), ...jsonData.map(row => keys.map(k => {
        let cell = row[k] === null || row[k] === undefined ? '' : String(row[k]);
        cell = cell.replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
        return cell;
      }).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Global Filter matching
  const matchesGlobal = (fields: string[]) => {
    if (!globalSearch) return true;
    return fields.some(f => f?.toLowerCase().includes(globalSearch.toLowerCase()));
  };

  // Filter lists based on searches
  const filteredUsers = users.filter(u =>
    matchesGlobal([u.name, u.email, u.mobile]) && (
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.mobile.includes(userSearch)
    )
  );

  const filteredBattles = battles.filter(b =>
    matchesGlobal([b.id, b.title, b.inviteCode, b.creator?.name, b.joiner?.name]) && (
      b.id.toLowerCase().includes(battleSearch.toLowerCase()) ||
      (b.inviteCode && b.inviteCode.toLowerCase().includes(battleSearch.toLowerCase())) ||
      b.creator?.name.toLowerCase().includes(battleSearch.toLowerCase()) ||
      (b.joiner?.name && b.joiner?.name.toLowerCase().includes(battleSearch.toLowerCase()))
    )
  );

  const filteredTransactions = transactions.filter(t =>
    matchesGlobal([t.id, t.userId, t.user?.name, t.razorpayPaymentId]) && (
      t.id.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.userId.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.user?.name.toLowerCase().includes(txSearch.toLowerCase()) ||
      (t.razorpayPaymentId && t.razorpayPaymentId.toLowerCase().includes(txSearch.toLowerCase()))
    )
  );

  const filteredAuditLogs = auditLogs.filter(log =>
    matchesGlobal([log.id, log.adminName, log.action]) && (
      log.adminName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.id.toLowerCase().includes(auditSearch.toLowerCase())
    )
  );

  // Tab mapping labels
  const tabLabels: Record<string, string> = {
    overview: 'Dashboard Overview',
    financials: 'Financial Analytics',
    users: 'User Registry',
    battles: 'Battle Rooms',
    ai_reviews: 'AI Review Center',
    screenshots: 'Screenshot Vault',
    transactions: 'Ledger Audit',
    deposits_withdrawals: 'Deposits & Payouts',
    referrals: 'Referrals & Broadcasts',
    reports_audit: 'Reports & Audits',
    settings: 'System Settings'
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primaryBg font-sans text-text p-4">
        <form onSubmit={handleLogin} className="bg-cardBg p-8 rounded-xl w-full max-w-[420px] border border-border shadow-2xl">
          <div className="text-center mb-8 select-none">
            <h1 className="text-2xl font-black text-accent tracking-widest uppercase">Arena Control</h1>
            <p className="mt-1.5 text-[10px] text-secondaryText uppercase tracking-widest font-bold">Secured Administration Portal</p>
          </div>
          
          {error && (
            <div className="text-danger bg-danger/5 border border-danger/20 p-3.5 rounded-lg mb-4 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4 mb-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@platform.com"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" isLoading={loading} className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    );
  }

  return (
    <DashboardLayout
      activeTab={activeTab}
      activeTabLabel={tabLabels[activeTab]}
      onTabChange={(tabId) => {
        setActiveTab(tabId as any);
        setMessage('');
        setError('');
      }}
      sidebarItems={[
        { id: 'overview', label: 'Dashboard Overview', icon: Activity },
        { id: 'financials', label: 'Financial Analytics', icon: TrendingUp },
        { id: 'users', label: 'User Registry', icon: Users },
        { id: 'battles', label: 'Battle Rooms', icon: Trophy },
        { id: 'ai_reviews', label: 'AI Review Center', icon: ShieldAlert, badge: reviews.length },
        { id: 'screenshots', label: 'Screenshot Vault', icon: Camera },
        { id: 'transactions', label: 'Ledger Audit', icon: Wallet },
        { id: 'deposits_withdrawals', label: 'Deposits & Payouts', icon: Database, badge: (deposits.filter(d=>d.status==='PENDING').length + withdrawals.filter(w=>w.status==='PENDING').length) },
        { id: 'referrals', label: 'Referrals & Broadcasts', icon: Bell },
        { id: 'reports_audit', label: 'Reports & Audits', icon: FileText },
        { id: 'settings', label: 'System Settings', icon: Settings }
      ]}
      onLogout={handleLogout}
      socketConnected={socketConnected}
      onRefresh={fetchAllData}
      searchValue={globalSearch}
      onSearchChange={setGlobalSearch}
      adminName="Super Admin"
      adminRole="Platform Lead"
      adminEmail="admin@battles.com"
    >
      {message && (
        <div className="bg-success/5 border border-success/20 text-success p-3 rounded-lg flex items-center gap-2 mb-6 text-xs font-semibold select-none">
          <CheckCircle size={16} /> {message}
        </div>
      )}
      {error && (
        <div className="bg-danger/5 border border-danger/20 text-danger p-3 rounded-lg flex items-center gap-2 mb-6 text-xs font-semibold select-none">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-6">
          <PageHeader
            title="Dashboard Overview"
            subtitle="Platform operational parameters and statistics"
          />

          {!stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
            </div>
          ) : (
            <>
              {/* Analytics Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard label="Registered Users" value={stats.totalUsers} icon={Users} color="#00D4FF" description="Total database user base" />
                <StatCard label="Online Users" value={stats.onlineUsers} icon={Activity} color="#22C55E" description="Active lobby connections" />
                <StatCard label="Active Today" value={stats.activeUsersToday} icon={Clock} color="#F59E0B" description="Unique login sessions today" />
                <StatCard label="Active Weekly" value={stats.activeUsersThisWeek} icon={Database} color="#EF4444" description="Logged in users last 7 days" />
              </div>

              {/* Battle metrics */}
              <div className="flex flex-col gap-3 mt-2">
                <h3 className="text-xs font-bold text-secondaryText uppercase tracking-wider">Battle Rooms Statistics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[
                    { label: 'Total Matches', val: stats.totalBattles, color: '#FFFFFF' },
                    { label: 'Running / Active', val: (stats.statusCounts?.IN_PROGRESS || 0) + (stats.statusCounts?.JOINED || 0), color: '#00D4FF' },
                    { label: 'Pending Admin', val: (stats.statusCounts?.PENDING_APPROVAL || 0) + (stats.statusCounts?.RESULT_SUBMITTED || 0), color: '#F59E0B' },
                    { label: 'Disputed Rooms', val: stats.statusCounts?.DISPUTED || 0, color: '#EF4444' },
                    { label: 'Settled Matches', val: (stats.statusCounts?.SETTLED || 0) + (stats.statusCounts?.COMPLETED || 0), color: '#22C55E' }
                  ].map((group, idx) => (
                    <div key={idx} className="bg-cardBg border border-border p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-lg">
                      <span className="text-xl font-black tracking-wide" style={{ color: group.color }}>{group.val}</span>
                      <span className="text-[9px] text-secondaryText font-bold uppercase tracking-wider mt-1">{group.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick operations */}
              <div className="bg-cardBg/30 border border-border p-5 rounded-xl flex flex-col gap-4 mt-2">
                <h3 className="text-xs font-bold text-accent uppercase tracking-wider">System Operations Shortcuts</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={() => setActiveTab('ai_reviews')} className="text-xs font-bold">
                    Verify AI Conflicts ({reviews.length})
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('deposits_withdrawals')} className="text-xs font-bold border-warning text-warning hover:bg-warning/10">
                    Process Payouts ({withdrawals.filter(w=>w.status==='PENDING').length})
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('users')} className="text-xs font-bold">
                    Adjust Wallet Balance
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: FINANCIALS */}
      {activeTab === 'financials' && (
        <div className="flex flex-col gap-6">
          <PageHeader
            title="Financial Analytics"
            subtitle="Platform transaction values and profits"
          />

          {!financialStats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
            </div>
          ) : (
            <>
              {/* Financial cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard label="Total Deposits" value={`₹${parseFloat(financialStats.totalDeposits).toLocaleString('en-IN')}`} icon={TrendingUp} color="#22C55E" />
                <StatCard label="Total Withdrawals" value={`₹${parseFloat(financialStats.totalWithdrawals).toLocaleString('en-IN')}`} icon={TrendingUp} color="#EF4444" />
                <StatCard label="Platform Commissions" value={`₹${parseFloat(financialStats.totalPlatformCommission).toLocaleString('en-IN')}`} icon={Wallet} color="#00D4FF" />
                <StatCard label="Company Profit" value={`₹${parseFloat(financialStats.totalCompanyProfit).toLocaleString('en-IN')}`} icon={Activity} color="#F59E0B" />
              </div>

              {/* Profit summaries and vault wagers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-2">
                <RevenueCard
                  title="Net Commission Profit Periods"
                  items={[
                    { label: "Today's Profit", value: `₹${(financialStats.todayProfit || 0).toFixed(2)}`, color: '#22C55E' },
                    { label: "Weekly Profit", value: `₹${(financialStats.weeklyProfit || 0).toFixed(2)}`, color: '#22C55E' },
                    { label: "Monthly Profit", value: `₹${(financialStats.monthlyProfit || 0).toFixed(2)}`, color: '#22C55E' }
                  ]}
                />
                <RevenueCard
                  title="Wallet Ledgers & Vault Balances"
                  items={[
                    { label: "Net Wallet Balance", value: `₹${(financialStats.netWalletBalance || 0).toLocaleString()}`, color: '#00D4FF' },
                    { label: "Referral Bonus Paid", value: `₹${(financialStats.referralBonusPaid || 0).toLocaleString()}`, color: '#F59E0B' },
                    { label: "Welcome Bonus Given", value: `₹${(financialStats.totalCashbackGiven || 0).toLocaleString()}`, color: '#8B5CF6' }
                  ]}
                />
              </div>

              {/* Charts grid */}
              {financialStats.dailyTrendList && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                  <ChartCard title="Daily Commissions Trend (Last 30 Days)" subtitle="Net revenue growth">
                    <RevenueChart data={financialStats.dailyTrendList} />
                  </ChartCard>

                  <ChartCard title="Deposits vs Withdrawals (Last 30 Days)" subtitle="Cash inflow/outflow matching">
                    <ProfitChart data={financialStats.dailyTrendList} />
                  </ChartCard>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* TAB 3: USER REGISTRY */}
      {activeTab === 'users' && (
        <div className="flex flex-col gap-6">
          <PageHeader
            title="User Registry"
            subtitle="Manage platform user accounts and limits"
            actions={
              <Button variant="secondary" onClick={() => exportToCSV(users, 'users_report')} className="gap-2">
                <Download size={14} /> Export CSV
              </Button>
            }
          />

          <TableCard
            searchBar={
              <SearchBar value={userSearch} onChange={setUserSearch} placeholder="Search name, email..." />
            }
          >
            <DataTable
              columns={[
                {
                  header: 'User Info',
                  accessor: (row) => (
                    <div className="flex items-center gap-3">
                      <Avatar name={row.name} src={row.avatar} size="sm" />
                      <div className="flex flex-col select-none">
                        <span className="font-bold text-text truncate max-w-[150px]">{row.name}</span>
                        <span className="text-[10px] text-secondaryText truncate max-w-[150px]">{row.email}</span>
                      </div>
                    </div>
                  )
                },
                {
                  header: 'Balances (Dep / Win / Bon)',
                  accessor: (row) => (
                    <span className="font-bold">
                      ₹{row.wallet?.depositBalance} / <span className="text-success">₹{row.wallet?.winningBalance}</span> / <span className="text-purple-400">₹{row.wallet?.bonusBalance}</span>
                    </span>
                  )
                },
                {
                  header: 'Win Rate / Battles',
                  accessor: (row) => (
                    <div className="flex flex-col">
                      <span className="font-bold">{row.winRate}%</span>
                      <span className="text-[10px] text-secondaryText">Wins: {row.totalWins} / matches: {row.totalBattles}</span>
                    </div>
                  )
                },
                {
                  header: 'Profit Generated',
                  accessor: (row) => (
                    <span className="text-accent font-bold">₹{row.profitGenerated.toFixed(2)}</span>
                  )
                },
                {
                  header: 'Last Login / IP',
                  accessor: (row) => (
                    <div className="flex flex-col text-[10px] text-secondaryText leading-relaxed">
                      <span>{row.lastLogin ? new Date(row.lastLogin).toLocaleString() : 'Never'}</span>
                      <span>IP: {row.ipAddress} | {row.device}</span>
                    </div>
                  )
                },
                {
                  header: 'Status',
                  accessor: (row) => (
                    <Badge variant={row.status === 'ACTIVE' ? 'success' : 'danger'}>
                      {row.status}
                    </Badge>
                  )
                },
                {
                  header: 'Actions',
                  headerClassName: 'text-right',
                  className: 'text-right',
                  accessor: (row) => (
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="secondary" onClick={() => setSelectedUser(row)} className="px-2.5 py-1.5 text-xs">
                        Profile
                      </Button>
                      <Button variant="outline" onClick={() => setAdjustingUser(row)} className="px-2.5 py-1.5 text-xs">
                        Adjust
                      </Button>
                      <Button
                        variant={row.status === 'ACTIVE' ? 'danger' : 'outline'}
                        onClick={() => handleUserStatusToggle(row.id, row.status)}
                        className="px-2.5 py-1.5 text-xs"
                      >
                        {row.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </Button>
                    </div>
                  )
                }
              ]}
              data={filteredUsers}
              emptyTitle="No users matched"
              emptyDescription="No users match the search input."
            />
          </TableCard>
        </div>
      )}

      {/* TAB 4: BATTLE ROOMS */}
      {activeTab === 'battles' && (
        <div className="flex flex-col gap-6">
          <PageHeader
            title="Battle Rooms"
            subtitle="Monitor rooms logs and wagers"
          />

          <TableCard
            searchBar={
              <SearchBar value={battleSearch} onChange={setBattleSearch} placeholder="Search Battle ID..." />
            }
          >
            <DataTable
              columns={[
                {
                  header: 'Battle Details',
                  accessor: (row) => (
                    <div className="flex flex-col gap-0.5 select-none">
                      <span className="text-accent font-bold font-mono tracking-wider text-[10px]">{row.id}</span>
                      <span className="font-bold text-text truncate max-w-[150px]">{row.title}</span>
                      <span className="text-[10px] text-secondaryText">Room: {row.inviteCode || 'N/A'}</span>
                    </div>
                  )
                },
                {
                  header: 'Wager / Prize',
                  accessor: (row) => (
                    <div className="flex flex-col gap-0.5">
                      <span>Wager: ₹{row.amount}</span>
                      <span className="text-success font-bold">Prize: ₹{row.winnerAmount}</span>
                      <span className="text-[10px] text-secondaryText">Fee: {row.commission}%</span>
                    </div>
                  )
                },
                {
                  header: 'Players',
                  accessor: (row) => (
                    <div className="flex flex-col leading-relaxed">
                      <span>Host: {row.creator?.name || 'Unknown'}</span>
                      <span className="text-secondaryText">Joiner: {row.joiner?.name || 'Pending'}</span>
                    </div>
                  )
                },
                {
                  header: 'Winner / Loser',
                  accessor: (row) => {
                    if (!row.winnerId) return <span className="text-secondaryText">None declared</span>;
                    const winnerName = row.winnerId === row.createdBy ? row.creator?.name : row.joiner?.name;
                    const loserName = row.winnerId === row.createdBy ? row.joiner?.name : row.creator?.name;
                    return (
                      <div className="flex flex-col leading-relaxed">
                        <span className="text-success font-bold">Winner: {winnerName}</span>
                        <span className="text-danger">Loser: {loserName}</span>
                      </div>
                    );
                  }
                },
                {
                  header: 'Status',
                  accessor: (row) => (
                    <Badge variant={row.status === 'COMPLETED' || row.status === 'SETTLED' ? 'success' : row.status === 'DISPUTED' ? 'danger' : 'neutral'}>
                      {row.status}
                    </Badge>
                  )
                },
                {
                  header: 'AI Verification',
                  accessor: (row) => (
                    <div className="flex flex-col leading-relaxed select-none">
                      <span>{row.verificationStatus || 'PENDING'}</span>
                      {row.aiConfidence !== null && (
                        <span className={twMerge('font-bold text-[10px]', row.aiConfidence >= 95 ? 'text-success' : 'text-danger')}>
                          Conf: {row.aiConfidence}%
                        </span>
                      )}
                    </div>
                  )
                },
                {
                  header: 'Actions',
                  headerClassName: 'text-right',
                  className: 'text-right',
                  accessor: (row) => (
                    (row.status === 'DISPUTED' || row.status === 'PENDING_APPROVAL') ? (
                      <Button variant="danger" onClick={() => setDisputeBattle(row)} className="px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider">
                        Settle Dispute
                      </Button>
                    ) : null
                  )
                }
              ]}
              data={filteredBattles}
              emptyTitle="No matches found"
              emptyDescription="No battles matches search input."
            />
          </TableCard>
        </div>
      )}

      {/* TAB 5: AI REVIEW CENTER */}
      {activeTab === 'ai_reviews' && (
        <div className="flex flex-col gap-6">
          <PageHeader
            title="AI Review Center"
            subtitle="Conflict resolution and screenshot checks"
            actions={
              <Button variant="secondary" onClick={fetchPendingReviews} className="text-xs font-bold uppercase tracking-wider">
                Refresh Queue
              </Button>
            }
          />

          {reviews.length === 0 ? (
            <EmptyState
              title="Queue empty"
              description="All screenshot uploads matches wagers. Settle outcomes manually if conflict happens in the game rooms."
              icon={ShieldAlert}
            />
          ) : (
            <div className="flex flex-col gap-6">
              {reviews.map(battle => {
                const creatorPart = battle.participants?.find((p: any) => p.role === 'CREATOR');
                const joinerPart = battle.participants?.find((p: any) => p.role === 'JOINER');
                const aiDetails = battle.aiResponse;

                return (
                  <div key={battle.id} className="bg-cardBg border border-border p-6 rounded-xl flex flex-col shadow-xl select-none">
                    {/* Header bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-3 mb-4 gap-2">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-text uppercase tracking-wide">Battle Room: <span className="text-accent font-mono">{battle.id}</span></h4>
                          <Badge variant="warning">{battle.status}</Badge>
                        </div>
                        <span className="text-[10px] text-secondaryText font-bold uppercase mt-1">
                          Wager: ₹{battle.amount} | Code: {battle.inviteCode || 'N/A'}
                        </span>
                      </div>
                      <span className="text-[10px] text-secondaryText font-medium">
                        Created: {new Date(battle.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Screenshot comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      {/* Creator */}
                      <div className="bg-primaryBg/50 p-4 rounded-lg border border-border/30 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-text">Host: {battle.creator?.name}</span>
                          <Badge variant={creatorPart?.submittedResult === 'WIN' ? 'success' : 'danger'}>
                            Declared: {creatorPart?.submittedResult || 'NONE'}
                          </Badge>
                        </div>
                        {creatorPart?.screenshotUrl ? (
                          <div className="relative border border-border/40 rounded overflow-hidden aspect-video bg-black flex items-center justify-center">
                            <img src={creatorPart.screenshotUrl} alt="" className="max-h-[180px] object-contain" />
                            <button
                              onClick={() => setZoomImage(creatorPart.screenshotUrl)}
                              className="absolute right-2.5 bottom-2.5 bg-black/60 hover:bg-black/90 p-1.5 rounded text-text cursor-pointer transition-all border-none"
                            >
                              <ZoomIn size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="aspect-video flex items-center justify-center text-xs text-secondaryText border border-dashed border-border rounded">
                            No screenshot uploaded
                          </div>
                        )}
                      </div>

                      {/* Joiner */}
                      <div className="bg-primaryBg/50 p-4 rounded-lg border border-border/30 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-text">Challenger: {battle.joiner?.name}</span>
                          <Badge variant={joinerPart?.submittedResult === 'WIN' ? 'success' : 'danger'}>
                            Declared: {joinerPart?.submittedResult || 'NONE'}
                          </Badge>
                        </div>
                        {joinerPart?.screenshotUrl ? (
                          <div className="relative border border-border/40 rounded overflow-hidden aspect-video bg-black flex items-center justify-center">
                            <img src={joinerPart.screenshotUrl} alt="" className="max-h-[180px] object-contain" />
                            <button
                              onClick={() => setZoomImage(joinerPart.screenshotUrl)}
                              className="absolute right-2.5 bottom-2.5 bg-black/60 hover:bg-black/90 p-1.5 rounded text-text cursor-pointer transition-all border-none"
                            >
                              <ZoomIn size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="aspect-video flex items-center justify-center text-xs text-secondaryText border border-dashed border-border rounded">
                            No screenshot uploaded
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI analysis */}
                    <div className="bg-accent/5 border border-accent/20 p-4 rounded-lg flex flex-col gap-3 mb-5">
                      <h5 className="text-[10px] font-black text-accent uppercase tracking-wider">Gemini Vision AI Analysis Result</h5>
                      {aiDetails ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs leading-relaxed">
                          <div><strong>Layout:</strong> {aiDetails.isLudoKing ? 'LUDO KING' : 'INVALID'}</div>
                          <div><strong>Suggested Winner:</strong> <span className="text-success font-bold">{aiDetails.winner || 'None'}</span></div>
                          <div><strong>AI Confidence:</strong> <span className={twMerge('font-bold', aiDetails.confidence >= 95 ? 'text-success' : 'text-danger')}>{aiDetails.confidence}%</span></div>
                          <div><strong>Image Alterations:</strong> {aiDetails.editedImage ? 'YES (ALERT)' : 'NO'}</div>
                          <div className="col-span-2 sm:col-span-4 border-t border-accent/10 pt-2 mt-1">
                            <strong>Reason:</strong> <span className="text-text/80">{aiDetails.reason}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-secondaryText">No vision analysis found. API keys mismatch or upload failed.</span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2.5">
                      {aiDetails?.winner && (
                        <Button variant="primary" onClick={() => handleResolveAIReview(battle.id, 'APPROVE_AI_WINNER')} className="text-xs py-2 uppercase tracking-wide">
                          Approve AI Winner
                        </Button>
                      )}
                      <Button variant="secondary" onClick={() => handleResolveAIReview(battle.id, 'MANUAL_SETTLE', battle.createdBy)} className="text-xs py-2 border-accent text-accent uppercase tracking-wide">
                        Settle Host (A)
                      </Button>
                      <Button variant="secondary" onClick={() => handleResolveAIReview(battle.id, 'MANUAL_SETTLE', battle.joinedBy)} className="text-xs py-2 border-accent text-accent uppercase tracking-wide">
                        Settle Challenger (B)
                      </Button>
                      <Button variant="secondary" onClick={() => handleResolveAIReview(battle.id, 'MANUAL_REFUND')} className="text-xs py-2 uppercase tracking-wide">
                        Refund Both
                      </Button>
                      <Button variant="danger" onClick={() => handleResolveAIReview(battle.id, 'REJECT')} className="text-xs py-2 uppercase tracking-wide">
                        Reject & Cancel
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: SCREENSHOT VAULT */}
      {activeTab === 'screenshots' && (
        <div className="flex flex-col gap-6">
          <PageHeader
            title="Screenshot Vault"
            subtitle="History logs of all submitted result proof"
          />

          {screenshots.length === 0 ? (
            <EmptyState title="No uploads" description="No screenshots uploaded in matches." icon={Camera} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {screenshots.map(s => (
                <div key={s.id} className="bg-cardBg border border-border rounded-xl overflow-hidden flex flex-col shadow-xl select-none">
                  <div className="relative aspect-video bg-black flex items-center justify-center border-b border-border/50">
                    <img src={s.screenshotUrl} alt="" className="max-h-[140px] object-contain" />
                    <button
                      onClick={() => setZoomImage(s.screenshotUrl)}
                      className="absolute right-2 bottom-2 bg-black/60 hover:bg-black/90 p-1 rounded text-text cursor-pointer transition-all border-none"
                    >
                      <ZoomIn size={12} />
                    </button>
                  </div>
                  <div className="p-4 flex-1 flex flex-col gap-2 text-[10px] leading-relaxed">
                    <div className="font-bold text-text truncate">Uploader: {s.uploaderName}</div>
                    <div className="text-secondaryText truncate">{s.uploaderEmail}</div>
                    <div className="font-mono text-accent truncate">Battle: {s.battleId}</div>
                    <div className="text-secondaryText/60">Time: {new Date(s.uploadTime).toLocaleString()}</div>
                    <div className="border-t border-border/50 pt-2 mt-1 flex justify-between font-bold text-text uppercase">
                      <span>Decision: <strong className={s.adminDecision === 'AUTO_SETTLED' ? 'text-success' : 'text-warning'}>{s.adminDecision || 'PENDING'}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 7: LEDGER AUDIT */}
      {activeTab === 'transactions' && (
        <div className="flex flex-col gap-6">
          <PageHeader
            title="Ledger Audit"
            subtitle="Full wallet transactions audit history"
          />

          <TableCard
            searchBar={
              <SearchBar value={txSearch} onChange={setTxSearch} placeholder="Search ledger..." />
            }
          >
            <DataTable
              columns={[
                {
                  header: 'Transaction ID',
                  accessor: (row) => <span className="font-mono text-secondaryText text-[10px]">{row.id}</span>
                },
                {
                  header: 'User Info',
                  accessor: (row) => (
                    <div className="flex flex-col leading-relaxed select-none">
                      <span className="font-bold">{row.user?.name || 'Unknown'}</span>
                      <span className="text-[10px] text-secondaryText">{row.user?.mobile}</span>
                    </div>
                  )
                },
                {
                  header: 'Type',
                  accessor: 'type'
                },
                {
                  header: 'Amount',
                  accessor: (row) => {
                    const isCredit = ['DEPOSIT', 'BATTLE_WIN', 'ADMIN_CREDIT', 'REFERRAL_BONUS', 'BATTLE_REFUND'].includes(row.type);
                    return (
                      <span className={twMerge('font-bold', isCredit ? 'text-success' : 'text-danger')}>
                        {isCredit ? '+' : '-'}₹{row.amount}
                      </span>
                    );
                  }
                },
                {
                  header: 'Status',
                  accessor: (row) => (
                    <Badge variant={row.status === 'SUCCESS' ? 'success' : row.status === 'PENDING' ? 'warning' : 'danger'}>
                      {row.status}
                    </Badge>
                  )
                },
                {
                  header: 'Description',
                  accessor: (row) => (
                    <div className="flex flex-col leading-relaxed select-none truncate max-w-[200px]">
                      <span>{row.description}</span>
                      {row.razorpayPaymentId && <span className="text-[9px] text-secondaryText font-mono">Gateway: {row.razorpayPaymentId}</span>}
                    </div>
                  )
                },
                {
                  header: 'Date',
                  accessor: (row) => <span className="text-[10px] text-secondaryText">{new Date(row.createdAt).toLocaleString()}</span>
                }
              ]}
              data={filteredTransactions}
              emptyTitle="No records"
              emptyDescription="No transactions matching filters."
            />
          </TableCard>
        </div>
      )}

      {/* TAB 8: DEPOSITS & PAYOUTS */}
      {activeTab === 'deposits_withdrawals' && (
        <div className="flex flex-col gap-8">
          {/* Withdrawals block */}
          <div className="flex flex-col gap-4">
            <PageHeader
              title="Withdrawal Payout Requests"
              subtitle="Approve player payouts to bank or UPI"
            />
            <DataTable
              columns={[
                {
                  header: 'User Info',
                  accessor: (row) => (
                    <div className="flex flex-col select-none">
                      <span className="font-bold">{row.user?.name}</span>
                      <span className="text-[10px] text-secondaryText">{row.user?.email}</span>
                    </div>
                  )
                },
                {
                  header: 'Amount',
                  accessor: (row) => <span className="font-bold text-danger">₹{row.amount}</span>
                },
                {
                  header: 'Payout Method',
                  accessor: 'paymentMethod'
                },
                {
                  header: 'Payout Details',
                  accessor: (row) => <span className="font-mono text-secondaryText text-[10px]">{row.paymentDetails}</span>
                },
                {
                  header: 'Status',
                  accessor: (row) => (
                    <Badge variant={row.status === 'APPROVED' ? 'success' : row.status === 'PENDING' ? 'warning' : 'danger'}>
                      {row.status}
                    </Badge>
                  )
                },
                {
                  header: 'Requested Time',
                  accessor: (row) => <span className="text-[10px] text-secondaryText">{new Date(row.createdAt).toLocaleString()}</span>
                },
                {
                  header: 'Actions',
                  headerClassName: 'text-right',
                  className: 'text-right',
                  accessor: (row) => (
                    row.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="primary" onClick={() => handleApproveWithdrawal(row.id)} className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
                          Approve
                        </Button>
                        <Button variant="danger" onClick={() => setRejectWithdrawalId(row.id)} className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
                          Reject
                        </Button>
                      </div>
                    ) : null
                  )
                }
              ]}
              data={withdrawals}
              emptyTitle="No payouts"
              emptyDescription="No withdrawal payout requests active."
            />
          </div>

          {/* Manual deposits block */}
          <div className="flex flex-col gap-4">
            <PageHeader
              title="Manual Deposit Requests"
              subtitle="Manually settle wagers based on receipts"
            />
            <DataTable
              columns={[
                {
                  header: 'User Info',
                  accessor: (row) => (
                    <div className="flex flex-col select-none">
                      <span className="font-bold">{row.user?.name}</span>
                      <span className="text-[10px] text-secondaryText">{row.user?.email}</span>
                    </div>
                  )
                },
                {
                  header: 'Amount',
                  accessor: (row) => <span className="font-bold text-success">₹{row.amount}</span>
                },
                {
                  header: 'Method',
                  accessor: 'paymentMethod'
                },
                {
                  header: 'Transaction ID',
                  accessor: (row) => <span className="font-mono text-secondaryText text-[10px]">{row.transactionId}</span>
                },
                {
                  header: 'Receipt Screenshot',
                  accessor: (row) => (
                    row.screenshotUrl ? (
                      <div className="relative w-10 h-10 border border-border/50 rounded overflow-hidden flex items-center justify-center bg-black">
                        <img src={row.screenshotUrl} alt="" className="object-cover w-full h-full" />
                        <button
                          onClick={() => setZoomImage(row.screenshotUrl)}
                          className="absolute inset-0 bg-transparent cursor-zoom-in border-none w-full h-full"
                        />
                      </div>
                    ) : (
                      <span className="text-secondaryText">No Receipt</span>
                    )
                  )
                },
                {
                  header: 'Status',
                  accessor: (row) => (
                    <Badge variant={row.status === 'APPROVED' ? 'success' : row.status === 'PENDING' ? 'warning' : 'danger'}>
                      {row.status}
                    </Badge>
                  )
                },
                {
                  header: 'Requested Time',
                  accessor: (row) => <span className="text-[10px] text-secondaryText">{new Date(row.createdAt).toLocaleString()}</span>
                },
                {
                  header: 'Actions',
                  headerClassName: 'text-right',
                  className: 'text-right',
                  accessor: (row) => (
                    row.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="primary" onClick={() => handleApproveDeposit(row.id)} className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
                          Approve
                        </Button>
                        <Button variant="danger" onClick={() => handleRejectDeposit(row.id)} className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
                          Reject
                        </Button>
                      </div>
                    ) : null
                  )
                }
              ]}
              data={deposits}
              emptyTitle="No deposits"
              emptyDescription="No manual deposit requests active."
            />
          </div>
        </div>
      )}

      {/* TAB 9: REFERRALS & BROADCASTS */}
      {activeTab === 'referrals' && (
        <div className="flex flex-col gap-6">
          <PageHeader
            title="Referrals & Broadcasts"
            subtitle="Announcements dispatcher and referral statistics"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Broadcast Form */}
            <div className="bg-cardBg border border-border p-6 rounded-xl flex flex-col shadow-xl select-none h-fit">
              <h3 className="text-xs font-bold text-accent uppercase tracking-wider mb-5 pb-2 border-b border-border/50">Dispatch System Alert</h3>
              <form onSubmit={handleBroadcastNotification} className="flex flex-col gap-4">
                <Input
                  label="Notification Title"
                  type="text"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  required
                  placeholder="e.g. Server Maintenance Scheduled"
                />

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-semibold text-secondaryText uppercase tracking-wider">Message Body</label>
                  <textarea
                    value={notifBody}
                    onChange={(e) => setNotifBody(e.target.value)}
                    required
                    placeholder="Describe announcement details here..."
                    className="w-full px-4 py-2.5 bg-primaryBg border border-border rounded-lg text-text outline-none text-sm transition-all focus:ring-1 focus:ring-accent focus:border-accent min-h-[90px]"
                  />
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-semibold text-secondaryText uppercase tracking-wider font-bold">Target Audience</label>
                  <select
                    value={notifTarget}
                    onChange={(e) => setNotifTarget(e.target.value)}
                    className="w-full px-4 py-2.5 bg-primaryBg border border-border rounded-lg text-text outline-none text-sm focus:ring-1 focus:ring-accent focus:border-accent"
                  >
                    <option value="all">Broadcast to All Users</option>
                    <option value="specific">Target Specific User ID</option>
                  </select>
                </div>

                {notifTarget === 'specific' && (
                  <Input
                    label="Target User UID"
                    type="text"
                    value={notifTargetId}
                    onChange={(e) => setNotifTargetId(e.target.value)}
                    required
                    placeholder="Enter User UUID"
                  />
                )}

                <Button type="submit" className="w-full mt-2 py-3 text-xs font-bold uppercase tracking-wider">
                  Dispatch Broadcast
                </Button>
              </form>
            </div>

            {/* Referrals stats */}
            <div className="flex flex-col gap-6">
              <StatusCard
                title="Referrals aggregates"
                items={[
                  { label: 'Total Referrals Count', value: referralAnalytics?.totalReferrals || 0 },
                  { label: 'Total Payouts Paid', value: `₹${(referralAnalytics?.totalReferralPayouts || 0).toFixed(2)}`, icon: Wallet }
                ]}
              />

              <div className="bg-cardBg border border-border p-6 rounded-xl flex flex-col shadow-xl select-none">
                <h4 className="text-xs font-bold text-secondaryText uppercase tracking-wider mb-4 border-b border-border pb-2">Referral Leaderboard</h4>
                <div className="flex flex-col gap-3">
                  {topReferrers.slice(0, 5).map((ref, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-semibold border-b border-border/30 pb-2">
                      <span className="text-text">#{idx+1} {ref.referrer?.name} ({ref.referralsCount} refs)</span>
                      <span className="text-success font-bold">₹{ref.earnings.toFixed(2)}</span>
                    </div>
                  ))}
                  {topReferrers.length === 0 && (
                    <span className="text-xs text-secondaryText text-center py-4">No referrers active</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: REPORTS & AUDIT LOGS */}
      {activeTab === 'reports_audit' && (
        <div className="flex flex-col gap-8">
          {/* Exporter console */}
          <div className="bg-cardBg border border-border p-6 rounded-xl flex flex-col shadow-xl select-none">
            <h3 className="text-xs font-bold text-accent uppercase tracking-wider mb-4 border-b border-border pb-2">Business Data Exporters</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => exportToCSV(users, 'users_detailed_report')} className="text-xs">
                Export Users Database
              </Button>
              <Button variant="secondary" onClick={() => exportToCSV(battles, 'battles_history_report')} className="text-xs">
                Export Battles Logs
              </Button>
              <Button variant="secondary" onClick={() => exportToCSV(transactions, 'wallet_transactions_ledger')} className="text-xs">
                Export Wallet Ledger
              </Button>
              <Button variant="secondary" onClick={() => exportToCSV(auditLogs, 'admin_activity_audits')} className="text-xs">
                Export Admin Audits
              </Button>
            </div>
          </div>

          {/* Audit Logs list */}
          <div className="flex flex-col gap-4">
            <PageHeader
              title="Administrative Audit Logs"
              subtitle="Full logs of all administrative modification activities"
            />
            <TableCard
              searchBar={
                <SearchBar value={auditSearch} onChange={setAuditSearch} placeholder="Filter audit logs..." />
              }
            >
              <DataTable
                columns={[
                  {
                    header: 'Log ID',
                    accessor: (row) => <span className="font-mono text-secondaryText text-[10px]">{row.id}</span>
                  },
                  {
                    header: 'Administrator',
                    accessor: 'adminName'
                  },
                  {
                    header: 'Action Event',
                    accessor: (row) => <span className="text-accent font-bold">{row.action}</span>
                  },
                  {
                    header: 'IP Address / Device',
                    accessor: (row) => <span className="text-secondaryText leading-relaxed">{row.ip} ({row.device})</span>
                  },
                  {
                    header: 'Timestamp',
                    accessor: (row) => <span className="text-[10px] text-secondaryText">{new Date(row.createdAt).toLocaleString()}</span>
                  }
                ]}
                data={filteredAuditLogs}
                emptyTitle="No logs found"
                emptyDescription="No audits match filters."
              />
            </TableCard>
          </div>
        </div>
      )}

      {/* TAB 11: SYSTEM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="flex flex-col gap-6">
          <PageHeader
            title="Centralized System Settings Control"
            subtitle="Configure and fine-tune global business parameters in real-time"
          />

          {/* Sub-tabs by Category */}
          <div className="flex border-b border-border mb-2 overflow-x-auto gap-2 select-none">
            {[
              { id: 'GENERAL', label: 'General' },
              { id: 'WALLET', label: 'Wallet Settings' },
              { id: 'BATTLE', label: 'Battle Stake & AI' },
              { id: 'REFERRAL', label: 'Referral Rewards' },
              { id: 'PAYMENTS', label: 'Payment Channels' },
              { id: 'NOTIFICATIONS', label: 'Alert Toggles' },
              { id: 'SECURITY', label: 'Security & OTP' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveSettingsCategory(cat.id as any)}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap outline-none ${
                  activeSettingsCategory === cat.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-secondaryText hover:text-text'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Settings Lists */}
          <div className="flex flex-col gap-4">
            {settings.filter(s => s.category === activeSettingsCategory).map(s => {
              const isChanged = originalSettings.find(orig => orig.key === s.key)?.value !== s.value;
              
              return (
                <div key={s.key} className="bg-cardBg border border-border p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md transition-all hover:border-border/80">
                  {/* Label & Description */}
                  <div className="flex flex-col gap-1 w-full md:max-w-[60%]">
                    <span className="text-sm font-bold text-text">{s.label || s.key}</span>
                    <span className="text-[11px] text-secondaryText leading-relaxed">{s.description}</span>
                  </div>

                  {/* Control input & Save/Reset buttons */}
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
                    {s.type === 'BOOLEAN' ? (
                      <select
                        value={s.value}
                        onChange={(e) => handleSettingChange(s.key, e.target.value)}
                        className="px-3 py-2 bg-primaryBg border border-border rounded-lg text-text text-xs font-bold outline-none focus:ring-1 focus:ring-accent focus:border-accent w-full md:w-[130px] cursor-pointer"
                      >
                        <option value="true">ENABLED</option>
                        <option value="false">DISABLED</option>
                      </select>
                    ) : s.key === 'PASSWORD_POLICY' ? (
                      <select
                        value={s.value}
                        onChange={(e) => handleSettingChange(s.key, e.target.value)}
                        className="px-3 py-2 bg-primaryBg border border-border rounded-lg text-text text-xs font-bold outline-none focus:ring-1 focus:ring-accent focus:border-accent w-full md:w-[200px] cursor-pointer"
                      >
                        <option value="MIN_8_CHARS">Min 8 Chars</option>
                        <option value="MIN_8_CHARS_1_NUM">Min 8 Chars + 1 Number</option>
                        <option value="MIN_8_CHARS_1_ALPHA_1_NUM">Min 8 Chars + Letter & Number</option>
                        <option value="MIN_8_CHARS_SPECIAL">Min 8 Chars + Special Character</option>
                      </select>
                    ) : (
                      <div className="relative w-full md:w-auto">
                        <input
                          type={s.type === 'NUMBER' || s.type === 'PERCENTAGE' ? 'number' : 'text'}
                          step="any"
                          value={s.value}
                          onChange={(e) => handleSettingChange(s.key, e.target.value)}
                          className="px-3 py-2 pl-6 bg-primaryBg border border-border rounded-lg text-text text-xs font-bold outline-none focus:ring-1 focus:ring-accent focus:border-accent w-full md:w-[160px]"
                        />
                        {(s.type === 'PERCENTAGE' || s.key.includes('PERCENT')) && (
                          <span className="absolute right-2.5 top-2.5 text-[10px] text-secondaryText font-bold select-none">%</span>
                        )}
                        {(s.key.includes('AMOUNT') || s.key.includes('DEPOSIT') || s.key.includes('WITHDRAWAL') || s.key.includes('REWARD')) && (
                          <span className="absolute left-2.5 top-2.5 text-[10px] text-secondaryText font-bold select-none">₹</span>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 w-full md:w-auto justify-end">
                      <Button
                        variant="primary"
                        onClick={() => handleSaveSingleSetting(s.key, s.value)}
                        disabled={!isChanged}
                        className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider flex-1 md:flex-initial ${
                          !isChanged ? 'opacity-30 cursor-not-allowed bg-border text-secondaryText' : 'cursor-pointer'
                        }`}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleResetSingleSetting(s.key)}
                        disabled={!isChanged}
                        className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border-border flex-1 md:flex-initial ${
                          !isChanged ? 'opacity-30 cursor-not-allowed text-secondaryText' : 'cursor-pointer'
                        }`}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: Image Zoom Viewer */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 select-none cursor-pointer"
          onClick={() => setZoomImage(null)}
        >
          <img src={zoomImage} alt="" className="max-w-[95%] max-h-[85vh] object-contain rounded-lg shadow-2xl border border-border" />
          <span className="text-[10px] text-secondaryText font-bold uppercase tracking-wider mt-4">Click anywhere to close full preview</span>
        </div>
      )}

      {/* MODAL 2: User Profile Drawer */}
      <Drawer
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="User Full Profile details"
      >
        {selectedUser && (
          <div className="flex flex-col gap-6 select-none leading-relaxed">
            <div className="flex items-center gap-3">
              <Avatar name={selectedUser.name} src={selectedUser.avatar} size="lg" />
              <div className="flex flex-col">
                <h4 className="text-sm font-black text-text">{selectedUser.name}</h4>
                <span className="text-[10px] text-secondaryText font-mono mt-0.5">UID: {selectedUser.id}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <span className="text-[9px] text-secondaryText uppercase tracking-wider">Email Address</span>
                <div className="text-text mt-0.5 break-all">{selectedUser.email}</div>
              </div>
              <div>
                <span className="text-[9px] text-secondaryText uppercase tracking-wider">Mobile Number</span>
                <div className="text-text mt-0.5">{selectedUser.mobile}</div>
              </div>
              <div>
                <span className="text-[9px] text-secondaryText uppercase tracking-wider">Deposit Balance</span>
                <div className="text-text font-bold mt-0.5">₹{selectedUser.wallet?.depositBalance}</div>
              </div>
              <div>
                <span className="text-[9px] text-secondaryText uppercase tracking-wider">Winning Balance</span>
                <div className="text-success font-bold mt-0.5">₹{selectedUser.wallet?.winningBalance}</div>
              </div>
              <div>
                <span className="text-[9px] text-secondaryText uppercase tracking-wider">Bonus Balance</span>
                <div className="text-purple-400 font-bold mt-0.5">₹{selectedUser.wallet?.bonusBalance}</div>
              </div>
              <div>
                <span className="text-[9px] text-secondaryText uppercase tracking-wider">Win Rate / Matches</span>
                <div className="text-text mt-0.5">{selectedUser.winRate}% (Wins: {selectedUser.totalWins} / matches: {selectedUser.totalBattles})</div>
              </div>
              <div>
                <span className="text-[9px] text-secondaryText uppercase tracking-wider">Profit Generated</span>
                <div className="text-accent font-bold mt-0.5">₹{selectedUser.profitGenerated.toFixed(2)}</div>
              </div>
              <div>
                <span className="text-[9px] text-secondaryText uppercase tracking-wider">Total Deposited</span>
                <div className="text-success font-bold mt-0.5">₹{selectedUser.depositAmount}</div>
              </div>
              <div>
                <span className="text-[9px] text-secondaryText uppercase tracking-wider">Total Withdrawn</span>
                <div className="text-danger font-bold mt-0.5">₹{selectedUser.withdrawalAmount}</div>
              </div>
            </div>

            <div className="border-t border-border/50 pt-4 mt-2">
              <span className="text-[9px] text-secondaryText uppercase tracking-wider block mb-2">Device Metadata & IP</span>
              <div className="flex flex-col gap-1 text-[11px] font-semibold text-text/80">
                <div>Last Active Device: <span className="text-text">{selectedUser.device}</span></div>
                <div>IP Address: <span className="text-text font-mono">{selectedUser.ipAddress}</span></div>
                <div>Registered: <span className="text-text">{new Date(selectedUser.createdAt).toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* MODAL 3: Wallet Adjustments */}
      <Modal
        isOpen={!!adjustingUser}
        onClose={() => setAdjustingUser(null)}
        title={adjustingUser ? `Adjust Balance: ${adjustingUser.name}` : 'Adjust Wallet'}
      >
        {adjustingUser && (
          <form onSubmit={handleAdjustWalletSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-secondaryText uppercase tracking-wider">Adjustment Action</label>
              <select
                value={adjustType}
                onChange={(e) => setAdjustType(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-primaryBg border border-border rounded-lg text-text outline-none text-sm focus:ring-1 focus:ring-accent focus:border-accent"
              >
                <option value="credit">Credit Balance (+)</option>
                <option value="debit">Deduct Balance (-)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-secondaryText uppercase tracking-wider">Wallet Type</label>
              <select
                value={adjustBalanceType}
                onChange={(e) => setAdjustBalanceType(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-primaryBg border border-border rounded-lg text-text outline-none text-sm focus:ring-1 focus:ring-accent focus:border-accent"
              >
                <option value="DEPOSIT">Deposit Balance</option>
                <option value="WINNING">Winning Balance</option>
                <option value="BONUS">Bonus Balance</option>
              </select>
            </div>

            <Input
              label="Amount (₹)"
              type="number"
              step="any"
              min="0"
              value={adjustAmount}
              onChange={(e) => setAdjustAmount(e.target.value)}
              required
            />

            <div className="flex gap-3 mt-4">
              <Button type="submit" className="flex-1 text-xs uppercase tracking-wider font-bold">
                Apply Settle
              </Button>
              <Button type="button" variant="secondary" onClick={() => setAdjustingUser(null)} className="flex-1 text-xs uppercase tracking-wider font-bold">
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL 4: Manual Dispute Settle */}
      <Modal
        isOpen={!!disputeBattle}
        onClose={() => setDisputeBattle(null)}
        title="Resolve Battle Dispute"
      >
        {disputeBattle && (
          <form onSubmit={handleResolveDispute} className="flex flex-col gap-4 leading-relaxed">
            <p className="text-xs text-secondaryText uppercase tracking-wider font-bold">Manual resolution override for room: <span className="font-mono text-accent">{disputeBattle.id}</span></p>
            
            <div className="flex flex-col gap-1.5 w-full mt-2">
              <label className="text-xs font-semibold text-secondaryText uppercase tracking-wider">Admin Settle Action</label>
              <select
                value={disputeDecision}
                onChange={(e) => setDisputeDecision(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-primaryBg border border-border rounded-lg text-text outline-none text-sm focus:ring-1 focus:ring-accent focus:border-accent"
              >
                <option value="CREATOR_WIN">Declare Creator ({disputeBattle.creator?.name}) as Winner</option>
                <option value="JOINER_WIN">Declare Joiner ({disputeBattle.joiner?.name}) as Winner</option>
                <option value="CANCEL">Cancel Battle and Refund Both Players</option>
              </select>
            </div>

            <div className="flex gap-3 mt-4">
              <Button type="submit" variant="danger" className="flex-1 text-xs uppercase tracking-wider font-bold">
                Settle Outcome
              </Button>
              <Button type="button" variant="secondary" onClick={() => setDisputeBattle(null)} className="flex-1 text-xs uppercase tracking-wider font-bold">
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL 5: Reject Withdrawal Reason */}
      <Modal
        isOpen={!!rejectWithdrawalId}
        onClose={() => setRejectWithdrawalId(null)}
        title="Reject Withdrawal Request"
      >
        {rejectWithdrawalId && (
          <form onSubmit={handleRejectWithdrawal} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-secondaryText uppercase tracking-wider">Reason for Rejection</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                required
                placeholder="Detail reason for refund/rejection..."
                className="w-full px-4 py-2.5 bg-primaryBg border border-border rounded-lg text-text outline-none text-sm focus:ring-1 focus:ring-accent focus:border-accent min-h-[90px]"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <Button type="submit" variant="danger" className="flex-1 text-xs uppercase tracking-wider font-bold">
                Reject request
              </Button>
              <Button type="button" variant="secondary" onClick={() => setRejectWithdrawalId(null)} className="flex-1 text-xs uppercase tracking-wider font-bold">
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </DashboardLayout>
  );
}
