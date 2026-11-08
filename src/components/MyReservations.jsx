import { Calendar, Clock, MapPin, Trash2, CheckCircle2, AlertCircle, Ticket } from 'lucide-react'

export default function MyReservations({ reservations, onCancelReservation, onBrowseCourts, onViewTicket }) {
  if (reservations.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-200 text-center max-w-xl mx-auto shadow-sm">
        <div className="w-16 h-16 bg-pickle-100 text-pickle-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
          🏓
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Court Reservations Yet</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          You don't have any court bookings in Metro Manila scheduled yet. Browse available courts in BGC, Makati, Pasig, Greenhills, and more!
        </p>
        <button
          onClick={onBrowseCourts}
          className="mt-6 py-3 px-6 bg-pickle-600 hover:bg-pickle-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-pickle-600/20 cursor-pointer"
        >
          Browse Available Courts
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900">My Court Reservations 🇵🇭</h2>
          <p className="text-sm text-slate-500">
            View your upcoming court bookings, print digital passes, or cancel matches.
          </p>
        </div>
        <span className="self-start sm:self-auto px-3 py-1 bg-pickle-100 text-pickle-800 text-xs font-bold rounded-full">
          {reservations.filter((r) => r.status === 'Confirmed').length} Active Bookings
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reservations.map((res) => {
          const isCancelled = res.status === 'Cancelled'

          return (
            <div
              key={res.id}
              className={`bg-white rounded-2xl p-5 border transition-all shadow-xs flex flex-col justify-between ${
                isCancelled
                  ? 'border-slate-200 opacity-60 bg-slate-50/50'
                  : 'border-slate-200 hover:border-pickle-300 hover:shadow-md'
              }`}
            >
              <div>
                {/* Header with status badge & ID */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    PASS #{res.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                      isCancelled
                        ? 'bg-red-100 text-red-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isCancelled ? (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        <span>Cancelled</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Confirmed</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Court & Date Info */}
                <div className="mt-3">
                  <h3 className="text-lg font-bold text-slate-900">{res.courtName}</h3>
                  <span className="inline-block text-xs font-medium text-pickle-700">
                    {res.courtCity || 'Metro Manila'} • {res.courtType}
                  </span>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-pickle-600 shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">{res.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-court-blue shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">{res.timeSlot}</span>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-slate-600">
                    <span className="px-2 py-0.5 bg-slate-100 rounded-md font-medium">
                      {res.matchType}
                    </span>
                    {res.paymentMethod && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-medium border border-blue-200">
                        {res.paymentMethod}
                      </span>
                    )}
                    {res.includeCoach && (
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-medium border border-indigo-200">
                        Coach Added
                      </span>
                    )}
                    {res.paddleRentalCount > 0 && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md font-medium border border-amber-200">
                        {res.paddleRentalCount} Paddles
                      </span>
                    )}
                    {res.ballRental && (
                      <span className="px-2 py-0.5 bg-pickle-50 text-pickle-700 rounded-md font-medium border border-pickle-200">
                        Balls
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Total Paid</span>
                  <span className="text-base font-extrabold text-slate-900">₱{res.totalPrice.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  {!isCancelled && (
                    <>
                      <button
                        onClick={() => onViewTicket(res)}
                        className="flex items-center gap-1 text-xs bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shadow-xs"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>View Pass</span>
                      </button>

                      <button
                        onClick={() => onCancelReservation(res.id)}
                        className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
                        title="Cancel Booking"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
