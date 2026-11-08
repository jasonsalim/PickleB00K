import { useState, useEffect } from 'react'
import { QrCode, Clock, ShieldCheck, CheckCircle2, ArrowLeft, Copy, Check } from 'lucide-react'

export default function PaymentModal({ bookingData, onClose, onPaymentSuccess }) {
  const isGCash = bookingData.paymentMethod.toLowerCase().includes('gcash')
  const [copied, setCopied] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(300) // 5 minutes timer
  const [isProcessing, setIsProcessing] = useState(false)
  const [refNumber] = useState(() => `PH-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`)

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const handleCopyRef = () => {
    navigator.clipboard?.writeText(refNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirmPaid = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      onPaymentSuccess({
        ...bookingData,
        paymentRef: refNumber,
        paymentStatus: 'Paid',
      })
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Gateway Brand Header */}
        <div
          className={`p-6 text-white text-center relative ${
            isGCash
              ? 'bg-gradient-to-r from-blue-600 to-sky-600'
              : 'bg-gradient-to-r from-emerald-700 to-teal-800'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
            {isGCash ? 'GCash QR Payment' : 'Maya Digital Payment'}
          </div>
          <h2 className="text-2xl font-black">
            ₱{bookingData.totalPrice.toLocaleString()}
          </h2>
          <p className="text-white/80 text-xs mt-0.5">
            Merchant: <strong>PickleBook Philippines Inc.</strong>
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full text-xs font-mono font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Expires in: {formatTimer(secondsLeft)}</span>
          </div>
        </div>

        {/* Payment Body */}
        <div className="p-6 space-y-5 text-center">
          {/* Simulated QR Code Box */}
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center">
            {/* Realistic QR placeholder graphic */}
            <div className="relative p-3 bg-white rounded-xl shadow-md border border-slate-200">
              <svg
                className="w-40 h-40 text-slate-900"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                {/* QR Pattern Corners */}
                <rect x="5" y="5" width="25" height="25" rx="3" fill="#1e293b" />
                <rect x="10" y="10" width="15" height="15" fill="#ffffff" />
                <rect x="14" y="14" width="7" height="7" fill="#0284c7" />

                <rect x="70" y="5" width="25" height="25" rx="3" fill="#1e293b" />
                <rect x="75" y="10" width="15" height="15" fill="#ffffff" />
                <rect x="79" y="14" width="7" height="7" fill="#0284c7" />

                <rect x="5" y="70" width="25" height="25" rx="3" fill="#1e293b" />
                <rect x="10" y="75" width="15" height="15" fill="#ffffff" />
                <rect x="14" y="79" width="7" height="7" fill="#0284c7" />

                {/* Simulated center logo */}
                <circle cx="50" cy="50" r="14" fill="#10b981" />
                <text x="50" y="54" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#ffffff">🏓</text>

                {/* Data blocks */}
                <rect x="35" y="10" width="5" height="5" />
                <rect x="45" y="10" width="5" height="5" />
                <rect x="55" y="10" width="5" height="5" />
                <rect x="35" y="25" width="5" height="5" />
                <rect x="45" y="25" width="5" height="5" />
                <rect x="55" y="25" width="5" height="5" />
                <rect x="10" y="45" width="5" height="5" />
                <rect x="25" y="45" width="5" height="5" />
                <rect x="75" y="45" width="5" height="5" />
                <rect x="85" y="45" width="5" height="5" />
                <rect x="35" y="70" width="5" height="5" />
                <rect x="45" y="70" width="5" height="5" />
                <rect x="55" y="70" width="5" height="5" />
                <rect x="70" y="70" width="5" height="5" />
                <rect x="85" y="70" width="5" height="5" />
                <rect x="75" y="85" width="5" height="5" />
              </svg>
              <div className="mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Scan with {isGCash ? 'GCash App' : 'Maya App'}
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3">
              Scan this QR code using your {isGCash ? 'GCash' : 'Maya'} app to complete payment.
            </p>
          </div>

          {/* Reference Info */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Reference Number</span>
              <span className="font-mono font-bold text-slate-800">{refNumber}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyRef}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded-lg text-[11px] font-medium cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Action Button */}
          <button
            onClick={handleConfirmPaid}
            disabled={isProcessing}
            className={`w-full py-3.5 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
              isGCash
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying Payment...</span>
              </div>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulate "I Have Paid" (Instant Confirm)</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-slate-400">
            For testing: Click above to instantly verify and confirm your court booking!
          </p>
        </div>
      </div>
    </div>
  )
}

