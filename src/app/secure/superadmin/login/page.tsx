'use client'

import { useState } from 'react'
import { login, enrollMfa, verifyMfa } from './actions'
import { ShieldCheck, Lock, QrCode } from 'lucide-react'

export default function SuperAdminLoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // MFA State
  const [mfaRequired, setMfaRequired] = useState(false)
  const [mfaAction, setMfaAction] = useState<'enroll' | 'verify' | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [factorId, setFactorId] = useState<string | null>(null)

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setLoading(true)
    setError(null)
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.mfaRequired) {
      setMfaRequired(true)
      setFactorId(result.factorId || null)
      if (result.enroll) {
        setMfaAction('enroll')
        // Trigger enrollment
        const enrollResult = await enrollMfa()
        if (enrollResult.error) {
          setError(enrollResult.error)
        } else {
          setQrCode(enrollResult.qrCode || null)
          setFactorId(enrollResult.factorId || null)
        }
      } else {
        setMfaAction('verify')
      }
      setLoading(false)
    }
  }

  async function handleMfaSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setLoading(true)
    setError(null)
    const result = await verifyMfa(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white mb-4 border border-purple-500/20 shadow-lg shadow-purple-500/10 overflow-hidden">
              <img src="/logo.jpg" alt="GujjOverseas LLP Logo" className="h-full w-full object-cover scale-110" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">SuperAdmin Portal</h1>
            <p className="text-slate-400 text-sm">
              Elevated Privileges Required
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          {!mfaRequired ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder-slate-600"
                  placeholder="superadmin@gujjoverseasllp.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder-slate-600"
                  placeholder="••••••••"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl text-white bg-purple-600 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Sign In to SuperAdmin
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleMfaSubmit} className="space-y-6">
              {mfaAction === 'enroll' && qrCode && (
                <div className="mb-6 text-center">
                  <p className="text-sm text-slate-300 mb-4">Scan this QR code with your authenticator app (e.g. Google Authenticator).</p>
                  <div className="bg-white p-4 rounded-xl inline-block" dangerouslySetInnerHTML={{ __html: qrCode }} />
                </div>
              )}
              {mfaAction === 'verify' && (
                <div className="mb-6 text-center">
                  <QrCode className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-sm text-slate-300">Enter the 6-digit code from your authenticator app.</p>
                </div>
              )}
              <input type="hidden" name="factorId" value={factorId || ''} />
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Authenticator Code</label>
                <input
                  type="text"
                  name="code"
                  required
                  pattern="[0-9]{6}"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder-slate-600 tracking-[0.5em] text-center text-lg font-mono"
                  placeholder="123456"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl text-white bg-purple-600 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Verify & Continue</>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-xs text-slate-500">
            Protected by Supabase Auth & MFA.
          </div>
        </div>
      </div>
    </div>
  )
}
