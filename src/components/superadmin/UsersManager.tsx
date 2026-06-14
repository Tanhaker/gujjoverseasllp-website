"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import { UserCog, UserMinus, UserCheck, Shield, ShieldAlert, Loader2 } from "lucide-react";

interface UserRow {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'superadmin';
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

export default function UsersManager() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: true });
    if (data) setUsers(data as UserRow[]);
    setLoading(false);
  };

  const toggleStatus = async (id: string, currentStatus: boolean, email: string) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'reactivate'} ${email}?`)) return;
    
    setActionLoading(id);
    const { error } = await supabase.from('users').update({ is_active: !currentStatus }).eq('id', id);
    
    if (!error) {
      // Log action
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('audit_logs').insert({
          user_id: session.user.id,
          action: currentStatus ? 'user.deactivate' : 'user.reactivate',
          target: email
        });
      }
      fetchUsers();
    } else {
      alert(`Error updating user: ${error.message}`);
    }
    setActionLoading(null);
  };

  const promoteUser = async (id: string, email: string) => {
    if (!confirm(`Promote ${email} to SuperAdmin?`)) return;
    setActionLoading(id);
    const { error } = await supabase.from('users').update({ role: 'superadmin' }).eq('id', id);
    if (!error) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('audit_logs').insert({
          user_id: session.user.id,
          action: 'user.promote',
          target: email
        });
      }
      fetchUsers();
    }
    setActionLoading(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <UserCog className="w-5 h-5 text-brand-600" /> Administrative Users
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Last Login</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-500" /></td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No users found.</td></tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${!user.is_active ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">{user.full_name || 'Unnamed User'}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'superadmin' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                        <ShieldAlert className="w-3 h-3" /> SuperAdmin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.is_active ? (
                      <span className="inline-flex items-center gap-1 text-green-600"><UserCheck className="w-4 h-4" /> Active</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600"><UserMinus className="w-4 h-4" /> Deactivated</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    {user.last_login ? format(new Date(user.last_login), 'MMM dd, yyyy HH:mm') : 'Never logged in'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {user.role !== 'superadmin' && (
                        <button 
                          onClick={() => promoteUser(user.id, user.email)}
                          disabled={actionLoading === user.id}
                          className="px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-50"
                        >
                          Promote to Super
                        </button>
                      )}
                      <button 
                        onClick={() => toggleStatus(user.id, user.is_active, user.email)}
                        disabled={actionLoading === user.id}
                        className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors disabled:opacity-50 ${
                          user.is_active 
                            ? 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20' 
                            : 'border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900/30 dark:hover:bg-green-900/20'
                        }`}
                      >
                        {user.is_active ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
