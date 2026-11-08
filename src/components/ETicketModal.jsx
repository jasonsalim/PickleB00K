import { X, Printer, Calendar, Clock, MapPin, User, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'

export default function ETicketModal({ reservation, onClose }) {
  if (!reservation) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden print:shadow-none print:border-none print:max-w-none">
        {/* Ticket Top Ribbon */}
        <div className="bg-gradient-to-r from-pickle-700 via-court-green to-court-blue p-6 text-white text-center relative print:bg-slate-900">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors print:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Official Court Pass • PickleBook PH</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">{reservation.courtName}</h2>
          <p className="text-white/80 text-xs mt-1 flex items-center justify-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{reservation.courtCity || 'Metro Manila'}</span>
          </p>
        </div>

        {/* Notched ticket divider */}
        <div className="relative flex items-center justify-between px-2 bg-slate-50 border-y border-dashed border-slate-300 py-2">
          <div className="w-4 h-8 bg-slate-900/70 rounded-r-full -ml-2 print:hidden" />
          <div className="flex-1 text-center font-mono text-xs font-bold tracking-widest text-slate-500 uppercase">
            PASS #{reservation.id}
          </div>
          <div className="w-4 h-8 bg-slate-900/70 rounded-l-full -mr-2 print:hidden" />
        </div>

        {/* Ticket Details Body */}
        <div className="p-6 space-y-5 bg-white">
          {/* Date & Time Highlights */}
          <div className="grid grid-cols-2 gap-3 bg-pickle-50/70 p-3.5 rounded-2xl border border-pickle-200">
            <div>
              <span className="text-[10px] text-pickle-800 uppercase font-bold tracking-wider block">Date</span>
              <span className="text-sm font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
                <Calendar className="w-4 h-4 text-pickle-600 shrink-0" />
                <span>{reservation.date}</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-pickle-800 uppercase font-bold tracking-wider block">Time Slot</span>
              <span className="text-sm font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
                <Clock className="w-4 h-4 text-court-blue shrink-0" />
                <span className="truncate">{reservation.timeSlot}</span>
              </span>
            </div>
          </div>

          {/* Player & Match Info */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Reserved For</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{reservation.playerName}</span>
              <span className="text-[11px] text-slate-500">{reservation.playerPhone}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Format & Add-ons</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{reservation.matchType}</span>
              <span className="text-[11px] text-slate-500">
                {reservation.paddleRentalCount > 0 ? `${reservation.paddleRentalCount} Paddles` : 'No Paddles'}{' '}
                {reservation.ballRental ? '• Balls Incl.' : ''}
              </span>
            </div>
          </div>

          {/* Payment Status Bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Amount</span>
              <span className="text-lg font-black text-pickle-700">₱{reservation.totalPrice.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{reservation.paymentMethod ? `Paid via ${reservation.paymentMethod}` : 'Confirmed'}</span>
              </span>
            </div>
          </div>

          {/* Court Rules Check-in */}
          <div className="text-[11px] text-slate-500 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="font-bold text-slate-700">Important Court Guidelines:</p>
            <p>• Arrive at least 10 minutes before your booked time slot.</p>
            <p>• Clean, non-marking indoor court shoes required on all courts.</p>
            <p>• Present this e-ticket or Pass #{reservation.id} to the court receptionist.</p>
          </div>

          {/* Action Buttons (Hidden when printing) */}
          <div className="flex items-center gap-3 pt-2 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF Pass</span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-5 border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

