"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import { ShieldAlert, CheckCircle, XCircle, Ban, Unlock } from "lucide-react";

interface LoginAttempt {
  id: string;
  email: string;
  ip_address: string;
  success: boolean;
  timestamp: string;
}

interface BlockedIp {
  id: string;
  ip_address: string;
  reason: string;
  blocked_at: string;
}

export default function LoginAttemptsManager() {
  const [attempts, setAttempts] = useState<LoginAttempt[]>([]);
  const [blockedIps, setBlockedIps] = useState<BlockedIp[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'attempts' | 'blocked'>('attempts');
  
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'attempts') {
      const { data } = await supabase.from('login_attempts').select('*').order('timestamp', { ascending: false }).limit(50);
      if (data) setAttempts(data);
    } else {
      const { data } = await supabase.from('blocked_ips').select('*').order('blocked_at', { ascending: false });
      if (data) setBlockedIps(data);
    }
    setLoading(false);
  };

  const blockIp = async (ip: string) => {
    if (!confirm(`Are you sure you want to block IP ${ip}?`)) return;
    setActionLoading(ip);
    
    const { data: { session } } = await supabase.auth.getSession();
    
    const { error } = await supabase.from('blocked_ips').insert({
      ip_address: ip,
      reason: 'Manually blocked from login attempts dashboard',
      blocked_by: session?.user?.id
    });
    
    if (!error && session?.user) {
      await supabase.from('audit_logs').insert({
        user_id: session.user.id,
        action: 'ip.block',
        target: ip
      });
      alert(`IP ${ip} blocked successfully.`);
    } else {
      alert(`Could not block IP or IP is already blocked.`);
    }
    setActionLoading(null);
  };

  const unblockIp = async (id: string, ip: string) => {
    if (!confirm(`Unblock IP ${ip}?`)) return;
    setActionLoading(id);
    
    const { error } = await supabase.from('blocked_ips').delete().eq('id', id);
    if (!error) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('audit_logs').insert({
          user_id: session.user.id,
          action: 'ip.unblock',
          target: ip
        });
      }
      fetchData();
    }
    setActionLoading(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => setActiveTab('attempts')}
          className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'attempts' ? 'border-brand-500 text-brand-600 bg-brand-50/50 dark:bg-brand-900/10' : 'border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
        >
          Recent Login Attempts
        </button>
        <button 
          onClick={() => setActiveTab('blocked')}
          className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'blocked' ? 'border-red-500 text-red-600 bg-red-50/50 dark:bg-red-900/10' : 'border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
        >
          Blocked IPs
        </button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading...</div>
        ) : activeTab === 'attempts' ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Status</th>
                <th className="p-4">Email Attempted</th>
                <th className="p-4">IP Address</th>
                <th className="p-4 text-right">Timestamp</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {attempts.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No attempts found.</td></tr>
              ) : attempts.map((attempt) => (
                <tr key={attempt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    {attempt.success ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" /> Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        <XCircle className="w-3.5 h-3.5" /> Failed
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-medium text-slate-900 dark:text-slate-300">
                    {attempt.email || 'Unknown'}
                  </td>
                  <td className="p-4 font-mono text-sm text-slate-500">
                    {attempt.ip_address || '127.0.0.1'}
                  </td>
                  <td className="p-4 text-sm text-slate-500 text-right">
                    {format(new Date(attempt.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => blockIp(attempt.ip_address)}
                      disabled={actionLoading === attempt.ip_address}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/30 disabled:opacity-50"
                    >
                      <Ban className="w-3.5 h-3.5" /> Block IP
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-red-50 dark:bg-red-950/20 border-b border-red-100 dark:border-red-900/30 text-sm font-semibold text-red-800 dark:text-red-400 uppercase tracking-wider">
                <th className="p-4">Blocked IP</th>
                <th className="p-4">Reason</th>
                <th className="p-4 text-right">Blocked At</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {blockedIps.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">No blocked IPs.</td></tr>
              ) : blockedIps.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-mono text-sm text-slate-900 dark:text-white font-bold">
                    {b.ip_address}
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {b.reason || 'No reason specified'}
                  </td>
                  <td className="p-4 text-sm text-slate-500 text-right">
                    {format(new Date(b.blocked_at), 'MMM dd, yyyy HH:mm:ss')}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => unblockIp(b.id, b.ip_address)}
                      disabled={actionLoading === b.id}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 dark:border-emerald-900/50 dark:hover:bg-emerald-900/30 disabled:opacity-50"
                    >
                      <Unlock className="w-3.5 h-3.5" /> Unblock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
