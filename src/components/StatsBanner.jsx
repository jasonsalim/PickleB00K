import { Clock, ShieldCheck, Trophy, Sparkles, MapPin } from 'lucide-react'

export default function StatsBanner({ totalCourts, activeBookingsCount }) {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden mb-8 border border-slate-700/50">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-pickle-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-court-blue/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pickle-500/20 border border-pickle-400/30 text-pickle-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Philippines • Metro Manila Pickleball Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Book Your Court in the Philippines 🇵🇭
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl">
            Reserve premier pickleball courts across BGC, Makati, Pasig, Greenhills, and Alabang. Choose air-conditioned indoor facilities to beat the tropical heat or rain-proof covered pavilions.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-xs">
            <p className="text-2xl sm:text-3xl font-extrabold text-pickle-400">{totalCourts}</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Courts in NCR</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-xs">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">6AM - 10PM</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Daily Hours</p>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-xs">
            <p className="text-2xl sm:text-3xl font-extrabold text-pickle-400">
              ₱380<span className="text-sm font-normal text-slate-400">/hr+</span>
            </p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Rates From</p>
          </div>
        </div>
      </div>
    </div>
  )
}
