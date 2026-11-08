import { useState } from 'react'
import { X, Calendar, Clock, CheckCircle2, UserCheck } from 'lucide-react'
import { TIME_SLOTS, PAYMENT_METHODS } from '../data/courtsData'
import PaymentModal from './PaymentModal'

export default function BookingModal({ court, selectedDate, existingReservations, onClose, onConfirmBooking }) {
  const [selectedSlot, setSelectedSlot] = useState('')
  const [matchType, setMatchType] = useState('Doubles (4 Players)')
  const [paddleCount, setPaddleCount] = useState(0)
  const [ballRental, setBallRental] = useState(false)
  const [includeCoach, setIncludeCoach] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('gcash')
  const [name, setName] = useState('Jason Salim')
  const [email, setEmail] = useState('jason.salim@gmail.com')
  const [phone, setPhone] = useState('0917 892 1435')
  
  // Payment step modal trigger
  const [showPaymentGateway, setShowPaymentGateway] = useState(false)
  const [pendingBookingData, setPendingBookingData] = useState(null)

  // Success state
  const [isSuccess, setIsSuccess] = useState(false)
  const [confirmedReservation, setConfirmedReservation] = useState(null)

  // Determine which slots are already booked for this court on this date
  const bookedSlots = existingReservations
    .filter((r) => r.courtId === court.id && r.date === selectedDate && r.status !== 'Cancelled')
    .map((r) => r.timeSlot)

  // Calculations in Philippine Pesos
  const courtFee = court.hourlyRate
  const paddleFee = paddleCount * 100 // ₱100 per paddle
  const ballFee = ballRental ? 150 : 0 // ₱150 for 3 balls
  const coachFee = includeCoach ? 500 : 0 // ₱500/hr for certified coach
  const totalPrice = courtFee + paddleFee + ballFee + coachFee

  const selectedPaymentObj = PAYMENT_METHODS.find((p) => p.id === paymentMethod) || PAYMENT_METHODS[0]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedSlot) return

    const bookingPayload = {
      id: `PH-${Math.floor(1000 + Math.random() * 9000)}`,
      courtId: court.id,
      courtName: court.name,
      courtCity: court.city,
      courtType: court.type,
      date: selectedDate,
      timeSlot: selectedSlot,
      playerName: name,
      playerEmail: email,
      playerPhone: phone,
      matchType,
      paddleRentalCount: paddleCount,
      ballRental,
      includeCoach,
      paymentMethod: selectedPaymentObj.name,
      totalPrice,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    }

    // If digital wallet (GCash or Maya), open the interactive payment gateway!
    if (paymentMethod === 'gcash' || paymentMethod === 'maya') {
      setPendingBookingData(bookingPayload)
      setShowPaymentGateway(true)
    } else {
      // Cash at front desk or card: confirm directly
      onConfirmBooking(bookingPayload)
      setConfirmedReservation(bookingPayload)
      setIsSuccess(true)
    }
  }

  // Handle successful gateway payment
  const handlePaymentSuccess = (finalBooking) => {
    setShowPaymentGateway(false)
    onConfirmBooking(finalBooking)
    setConfirmedReservation(finalBooking)
    setIsSuccess(true)
  }

  // Gateway Modal Overlay
  if (showPaymentGateway && pendingBookingData) {
    return (
      <PaymentModal
        bookingData={pendingBookingData}
        onClose={() => setShowPaymentGateway(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    )
  }

  // Final Confirmation Receipt
  if (isSuccess && confirmedReservation) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center">
          <div className="w-16 h-16 bg-pickle-100 text-pickle-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="inline-block px-3 py-1 bg-pickle-100 text-pickle-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
            Booking Confirmed! 🇵🇭
          </span>
          <h2 className="text-2xl font-black text-slate-900">Mabuhay! You're All Set! 🏓</h2>
          <p className="text-sm text-slate-500 mt-1">
            Receipt sent to {confirmedReservation.playerEmail}. You can view or print your digital pass anytime in "My Bookings".
          </p>

          <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Pass Code:</span>
              <span className="font-mono font-bold text-slate-900">{confirmedReservation.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Court:</span>
              <span className="font-semibold text-slate-800">{confirmedReservation.courtName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="font-semibold text-slate-800">{confirmedReservation.courtCity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date:</span>
              <span className="font-semibold text-slate-800">{confirmedReservation.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Time Slot:</span>
              <span className="font-semibold text-slate-800">{confirmedReservation.timeSlot}</span>
            </div>
            {confirmedReservation.includeCoach && (
              <div className="flex justify-between text-indigo-700 font-semibold">
                <span>Coach:</span>
                <span>Certified Coach Added</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Via:</span>
              <span className="font-semibold text-pickle-700">{confirmedReservation.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm">
              <span className="text-slate-700">Total Paid:</span>
              <span className="text-pickle-700 font-extrabold">₱{confirmedReservation.totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer shadow-md"
          >
            Done & View My Bookings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pickle-500/20 text-pickle-300 border border-pickle-400/30 mb-2">
            {court.city}
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white">{court.name}</h2>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-pickle-400" />
              <span>{selectedDate}</span>
            </span>
            <span>•</span>
            <span className="text-pickle-300 font-bold">₱{court.hourlyRate.toLocaleString()} / hour</span>
            <span>•</span>
            <span>{court.type === 'Indoor' ? 'Air-Conditioned' : court.type}</span>
          </div>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Step 1: Time Slot Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>1. Choose Time Slot (Philippine Time)</span>
              <span className="text-[11px] font-normal text-slate-500 lowercase">
                ({TIME_SLOTS.length - bookedSlots.length} available)
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isBooked = bookedSlots.includes(slot)
                const isSelected = selectedSlot === slot

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-2.5 text-xs font-medium rounded-xl border text-center transition-all cursor-pointer ${
                      isBooked
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-pickle-600 text-white border-pickle-600 shadow-sm shadow-pickle-600/30 font-bold scale-[1.02]'
                        : 'bg-white hover:bg-pickle-50 text-slate-700 border-slate-200 hover:border-pickle-300'
                    }`}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
            {!selectedSlot && (
              <p className="text-xs text-amber-600 mt-2 font-medium">
                * Please select an available time slot above.
              </p>
            )}
          </div>

          {/* Step 2: Match Details & Add-ons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                2. Match Format
              </label>
              <select
                value={matchType}
                onChange={(e) => setMatchType(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:outline-hidden"
              >
                <option value="Doubles (4 Players)">Doubles (4 Players)</option>
                <option value="Singles (2 Players)">Singles (2 Players)</option>
                <option value="Solo Practice / Drills">Solo Practice / Drills</option>
              </select>

              {/* Coach Addon Checkbox */}
              <label className="mt-3 flex items-center gap-2 p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCoach}
                  onChange={(e) => setIncludeCoach(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-indigo-900 block">Add Certified Coach (+₱500/hr)</span>
                  <span className="text-[10px] text-indigo-700">1-on-1 dinking drills and game strategy</span>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Equipment Rentals
              </label>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span>Paddle Rental (₱100 ea)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPaddleCount(Math.max(0, paddleCount - 1))}
                      className="w-6 h-6 rounded-md bg-slate-200 hover:bg-slate-300 flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold w-4 text-center">{paddleCount}</span>
                    <button
                      type="button"
                      onClick={() => setPaddleCount(Math.min(4, paddleCount + 1))}
                      className="w-6 h-6 rounded-md bg-slate-200 hover:bg-slate-300 flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <label className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl border border-slate-200 cursor-pointer">
                  <span>Pickleball Can (3 balls +₱150)</span>
                  <input
                    type="checkbox"
                    checked={ballRental}
                    onChange={(e) => setBallRental(e.target.checked)}
                    className="w-4 h-4 text-pickle-600 rounded-sm focus:ring-pickle-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method (Philippines) */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              3. Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PAYMENT_METHODS.map((pm) => {
                const isSelected = paymentMethod === pm.id
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-pickle-600 bg-pickle-50/70 shadow-xs ring-2 ring-pickle-600/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{pm.name}</span>
                        {pm.badge && (
                          <span className="text-[9px] bg-pickle-200 text-pickle-800 px-1.5 py-0.2 rounded-full font-bold">
                            {pm.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{pm.subtitle}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 4: Player Information */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              4. Contact Information
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="block text-[11px] text-slate-500 font-medium mb-1">Full Name</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs focus:outline-hidden"
                />
              </div>
              <div>
                <span className="block text-[11px] text-slate-500 font-medium mb-1">Email Address</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs focus:outline-hidden"
                />
              </div>
              <div>
                <span className="block text-[11px] text-slate-500 font-medium mb-1">PH Mobile (09XX)</span>
                <input
                  type="tel"
                  required
                  placeholder="0917-XXX-XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Pricing Breakdown Summary */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Court Reservation Fee (1 hr):</span>
              <span className="font-semibold">₱{courtFee.toLocaleString()}</span>
            </div>
            {paddleCount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Paddles ({paddleCount} × ₱100):</span>
                <span className="font-semibold">₱{paddleFee.toLocaleString()}</span>
              </div>
            )}
            {ballRental && (
              <div className="flex justify-between text-slate-600">
                <span>Pickleball Can:</span>
                <span className="font-semibold">₱{ballFee.toLocaleString()}</span>
              </div>
            )}
            {includeCoach && (
              <div className="flex justify-between text-indigo-700 font-semibold">
                <span>Certified Coach (1 hr):</span>
                <span>₱{coachFee.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
              <span>Total Amount ({selectedPaymentObj.name}):</span>
              <span className="text-pickle-700 text-base font-extrabold">₱{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Footer Submit Button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold rounded-xl text-sm transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedSlot}
              className={`flex-1 py-3 px-6 font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                selectedSlot
                  ? 'bg-pickle-600 hover:bg-pickle-700 text-white shadow-pickle-600/30'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>Proceed to {selectedPaymentObj.name} (₱{totalPrice.toLocaleString()})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
