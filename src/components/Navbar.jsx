import { Calendar, User, BookmarkCheck, LayoutGrid, MapPin } from 'lucide-react'

export default function Navbar({ activeTab, setActiveTab, reservationCount }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('courts')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pickle-600 via-court-green to-court-blue flex items-center justify-center text-white text-xl shadow-md shadow-pickle-600/20 group-hover:scale-105 transition-transform">
              🏓
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-pickle-700 transition-colors">
                  Pickle<span className="text-pickle-600">Book</span>
                </span>
                <span className="text-base" title="Philippines">🇵🇭</span>
              </div>
              <span className="hidden sm:inline-block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Metro Manila Courts
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('courts')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'courts'
                  ? 'bg-pickle-600 text-white shadow-sm shadow-pickle-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Available Courts</span>
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'reservations'
                  ? 'bg-pickle-600 text-white shadow-sm shadow-pickle-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>My Bookings</span>
              {reservationCount > 0 && (
                <span
                  className={`inline-flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold rounded-full ${
                    activeTab === 'reservations'
                      ? 'bg-white text-pickle-700'
                      : 'bg-pickle-600 text-white'
                  }`}
                >
                  {reservationCount}
                </span>
              )}
            </button>

            {/* Quick Profile Pill */}
            <div className="hidden md:flex items-center gap-2 pl-3 ml-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 text-xs font-bold">
                JS
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-slate-800 leading-tight">Jason Salim</p>
                <p className="text-slate-500 leading-tight">Metro Manila • 3.5</p>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
