import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, googleProvider } from '../firebase/config'
import { useStore } from '../store/useStore'
import {
  Eye, EyeOff, Mail, Lock, Heart, Activity, Shield, Zap,
  Sparkles, ArrowRight, Copy, CheckCheck,
} from 'lucide-react'

const DEMO_EMAIL = 'demo@medisync.com'
const DEMO_PASSWORD = 'Demo@1234'

export default function Login() {
  const navigate = useNavigate()
  const setUser = useStore((s) => s.setUser)
  const setAuthenticated = useStore((s) => s.setAuthenticated)

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      let cred
      if (mode === 'login') {
        cred = await signInWithEmailAndPassword(auth, email, password)
      } else {
        cred = await createUserWithEmailAndPassword(auth, email, password)
      }
      setUser({ uid: cred.user.uid, email: cred.user.email, displayName: cred.user.displayName, photoURL: cred.user.photoURL })
      setAuthenticated(true)
      navigate('/dashboard')
    } catch {
      setError('Invalid credentials. Use the Demo Account below to explore.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      setUser({ uid: cred.user.uid, email: cred.user.email, displayName: cred.user.displayName, photoURL: cred.user.photoURL })
      setAuthenticated(true)
      navigate('/dashboard')
    } catch {
      setError('Google sign-in failed. Use the Demo Account instead.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = () => {
    setDemoLoading(true)
    setTimeout(() => {
      setAuthenticated(true)
      setUser({ uid: 'demo-uid', email: DEMO_EMAIL, displayName: 'Prajwal Mulik', photoURL: null })
      navigate('/dashboard')
    }, 800)
  }

  const copyCredentials = async () => {
    await navigator.clipboard.writeText(`Email: ${DEMO_EMAIL}\nPassword: ${DEMO_PASSWORD}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* ── Left hero panel ── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col"
        style={{ background: 'linear-gradient(145deg, #0f0a2e 0%, #1a0845 40%, #0d1a4a 100%)' }}
      >
        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div className="absolute w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(108,71,255,0.4) 0%, transparent 65%)', top: '-120px', left: '-120px' }}
            animate={{ scale: [1, 1.12, 1], x: [0, 25, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div className="absolute w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 65%)', bottom: '-80px', right: '-80px' }}
            animate={{ scale: [1, 1.15, 1], y: [0, -25, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <motion.div className="absolute w-[280px] h-[280px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.25) 0%, transparent 65%)', top: '45%', left: '55%' }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col h-full p-12 justify-between">
          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl grad-bg flex items-center justify-center glow-purple flex-shrink-0">
              <Heart size={20} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-xl text-white tracking-tight">MediSync</span>
              <p className="text-[10px] text-purple-300/70 uppercase tracking-widest leading-none">Healthcare Platform</p>
            </div>
          </motion.div>

          {/* Hero text */}
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <p className="text-purple-300 text-sm font-semibold uppercase tracking-widest mb-3">B2B Healthcare SaaS</p>
              <h1 className="font-display font-bold text-[52px] leading-[1.1] text-white">
                Healthcare<br />
                <span className="grad-text">Intelligence</span><br />
                at Scale
              </h1>
              <p className="mt-5 text-slate-400 text-base leading-relaxed max-w-[340px]">
                Real-time patient monitoring, predictive analytics, and seamless care coordination — built for modern hospitals.
              </p>
            </motion.div>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Activity, label: 'Real-time Vitals', desc: 'Live monitoring', color: '#06b6d4' },
                { icon: Shield, label: 'HIPAA Compliant', desc: '256-bit encrypted', color: '#6c47ff' },
                { icon: Zap, label: 'AI Diagnostics', desc: 'ML-powered insights', color: '#f43f5e' },
                { icon: Heart, label: '12k+ Patients', desc: 'Across 48 hospitals', color: '#10b981' },
              ].map((f, i) => (
                <motion.div key={f.label}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="rounded-2xl p-4 card-hover"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5"
                    style={{ background: `${f.color}22`, border: `1px solid ${f.color}40` }}>
                    <f.icon size={15} style={{ color: f.color }} />
                  </div>
                  <p className="text-white text-sm font-semibold">{f.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex gap-8 pt-4 border-t border-white/10">
            {[
              { val: '99.9%', label: 'Uptime SLA' },
              { val: '<200ms', label: 'Response' },
              { val: 'SOC2', label: 'Certified' },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display font-bold text-2xl grad-text">{s.val}</p>
                <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-[48%] flex items-center justify-center p-6 lg:p-10 bg-[#fafbff] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile brand */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl grad-bg flex items-center justify-center glow-purple">
              <Heart size={18} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-gray-900">MediSync</span>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-none">Healthcare Platform</p>
            </div>
          </div>

          {/* ★ DEMO ACCOUNT CARD — prominent at top ★ */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #ede9fe 0%, #e0f2fe 100%)',
              border: '1.5px solid #c4b5fd',
            }}
          >
            <div className="px-5 pt-4 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg grad-bg flex items-center justify-center">
                  <Sparkles size={13} className="text-white" />
                </div>
                <span className="text-[#5b21b6] font-bold text-sm">Try Demo Account</span>
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6c47ff] text-white uppercase tracking-wide">Free</span>
              </div>
              <p className="text-[#6d28d9]/80 text-xs leading-relaxed">
                Explore all features instantly — no Firebase setup needed.
              </p>
            </div>
            <div className="px-5 py-3 mx-4 mb-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(108,71,255,0.15)' }}>
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider w-16">Email</span>
                    <span className="text-xs font-semibold text-gray-700 truncate">{DEMO_EMAIL}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider w-16">Password</span>
                    <span className="text-xs font-semibold text-gray-700">{DEMO_PASSWORD}</span>
                  </div>
                </div>
                <button onClick={copyCredentials}
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105"
                  style={{ background: copied ? '#dcfce7' : '#ede9fe', border: '1px solid', borderColor: copied ? '#bbf7d0' : '#c4b5fd' }}
                  title="Copy credentials"
                >
                  {copied
                    ? <CheckCheck size={13} className="text-green-600" />
                    : <Copy size={13} className="text-[#6c47ff]" />}
                </button>
              </div>
            </div>
            <div className="px-4 pb-4">
              <motion.button
                onClick={handleDemo}
                disabled={demoLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full grad-bg rounded-xl py-3 text-white font-bold text-sm flex items-center justify-center gap-2 glow-purple disabled:opacity-70"
              >
                {demoLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="30 70" />
                    </svg>
                    Opening Demo...
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    Open Demo Account
                    <ArrowRight size={15} />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs font-medium">or sign in with your account</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Auth card */}
          <div className="card-elevated rounded-3xl p-6">
            {/* Tab toggle */}
            <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: '#f0f3ff' }}>
              {(['login', 'signup'] as const).map((m) => (
                <button key={m} onClick={() => { setMode(m); setError('') }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-250 ${
                    mode === m ? 'grad-bg text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {m === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={mode}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
              >
                <h2 className="font-display font-bold text-2xl text-gray-900 mb-1">
                  {mode === 'login' ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="text-gray-500 text-sm mb-5">
                  {mode === 'login' ? 'Sign in to your healthcare dashboard' : 'Join the MediSync platform today'}
                </p>

                <form onSubmit={handleAuth} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="doctor@hospital.com" required
                        className="input-ring w-full bg-[#f8faff] border border-[#e2e8f0] text-gray-900 placeholder-gray-400 rounded-xl pl-10 pr-4 py-2.5 text-sm"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                      {mode === 'login' && (
                        <span className="text-xs text-[#6c47ff] cursor-pointer hover:underline font-medium">Forgot?</span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPass ? 'text' : 'password'} value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" required
                        className="input-ring w-full bg-[#f8faff] border border-[#e2e8f0] text-gray-900 placeholder-gray-400 rounded-xl pl-10 pr-11 py-2.5 text-sm"
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-xs font-medium">
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.button type="submit" disabled={loading}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full grad-bg rounded-xl py-3 text-white font-bold text-sm glow-purple disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="30 70" />
                        </svg>
                        Processing...
                      </span>
                    ) : mode === 'login' ? 'Sign In' : 'Create Account'}
                  </motion.button>
                </form>

                {/* Or */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-gray-400 text-xs">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Google */}
                <motion.button onClick={handleGoogle} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2.5 text-gray-700 text-sm font-semibold flex items-center justify-center gap-3 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="text-center text-gray-400 text-xs mt-5">
            By continuing you agree to our{' '}
            <span className="text-[#6c47ff] cursor-pointer hover:underline font-medium">Terms</span>
            {' '}&amp;{' '}
            <span className="text-[#6c47ff] cursor-pointer hover:underline font-medium">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
