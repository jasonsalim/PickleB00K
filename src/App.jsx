import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import StatsBanner from './components/StatsBanner'
import CourtFilter from './components/CourtFilter'
import CourtCard from './components/CourtCard'
import BookingModal from './components/BookingModal'
import MyReservations from './components/MyReservations'
import ETicketModal from './components/ETicketModal'
import { COURTS_DATA, INITIAL_RESERVATIONS, TIME_SLOTS } from './data/courtsData'

export default function App() {
  // Navigation tab state: 'courts' or 'reservations'
  const [activeTab, setActiveTab] = useState('courts')

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0])

  // Modals state
  const [selectedCourtForBooking, setSelectedCourtForBooking] = useState(null)
  const [selectedReservationForTicket, setSelectedReservationForTicket] = useState(null)

  // Reservations state with localStorage persistence
  const [reservations, setReservations] = useState(() => {
    try {
      const saved = localStorage.getItem('picklebook_ph_reservations')
      if (!saved) return INITIAL_RESERVATIONS
      const parsed = JSON.parse(saved)
      return parsed.map((r) =>
        r.playerName === 'Juan Dela Cruz' ? { ...r, playerName: 'Jason Salim', playerEmail: 'jason.salim@gmail.com' } : r
      )
    } catch {
      return INITIAL_RESERVATIONS
    }
  })

  // Save reservations to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('picklebook_ph_reservations', JSON.stringify(reservations))
    } catch (e) {
      console.error('Failed to save to localStorage', e)
    }
  }, [reservations])

  // Filter courts based on search query, city, and court type
  const filteredCourts = COURTS_DATA.filter((court) => {
    const matchesCity =
      selectedCity === 'all' || court.city.toLowerCase().includes(selectedCity.toLowerCase())
    const matchesType = selectedType === 'all' || court.type === selectedType
    const matchesSearch =
      court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.surface.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCity && matchesType && matchesSearch
  })

  // Helper to count available slots for a given court on the selected date
  const getAvailableSlotCount = (courtId) => {
    const booked = reservations.filter(
      (r) => r.courtId === courtId && r.date === selectedDate && r.status !== 'Cancelled'
    ).length
    return Math.max(0, TIME_SLOTS.length - booked)
  }

  // Handle booking confirmation
  const handleConfirmBooking = (newBooking) => {
    setReservations((prev) => [newBooking, ...prev])
  }

  // Handle cancellation
  const handleCancelReservation = (reservationId) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      setReservations((prev) =>
        prev.map((r) => (r.id === reservationId ? { ...r, status: 'Cancelled' } : r))
      )
    }
  }

  const activeReservationsCount = reservations.filter((r) => r.status === 'Confirmed').length

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reservationCount={activeReservationsCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'courts' && (
          <>
            {/* Facility & Stats Hero */}
            <StatsBanner
              totalCourts={COURTS_DATA.length}
              activeBookingsCount={activeReservationsCount}
            />

            {/* Filter, City, and Date Bar */}
            <CourtFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            {/* Court Grid Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Metro Manila Courts ({filteredCourts.length})
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Availability for <strong className="text-slate-800">{selectedDate}</strong> (PHT)
              </span>
            </div>

            {/* Courts Grid */}
            {filteredCourts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourts.map((court) => (
                  <CourtCard
                    key={court.id}
                    court={court}
                    selectedDate={selectedDate}
                    availableSlotCount={getAvailableSlotCount(court.id)}
                    onSelectCourt={(c) => setSelectedCourtForBooking(c)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <p className="text-3xl mb-2">🔍</p>
                <h3 className="text-lg font-bold text-slate-800">Walang nahanap na court</h3>
                <p className="text-sm text-slate-500 mt-1">
                  No courts match your search filter. Try resetting filters or choosing "All Metro Manila".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedType('all')
                    setSelectedCity('all')
                  }}
                  className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </>
        )}

        {/* My Reservations View */}
        {activeTab === 'reservations' && (
          <MyReservations
            reservations={reservations}
            onCancelReservation={handleCancelReservation}
            onBrowseCourts={() => setActiveTab('courts')}
            onViewTicket={(res) => setSelectedReservationForTicket(res)}
          />
        )}
      </main>

      {/* Booking Modal */}
      {selectedCourtForBooking && (
        <BookingModal
          court={selectedCourtForBooking}
          selectedDate={selectedDate}
          existingReservations={reservations}
          onClose={() => setSelectedCourtForBooking(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* E-Ticket Modal */}
      {selectedReservationForTicket && (
        <ETicketModal
          reservation={selectedReservationForTicket}
          onClose={() => setSelectedReservationForTicket(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <span>🏓 PickleBook Philippines 🇵🇭</span>
            <span className="text-slate-400 font-normal">| Premier Pickleball Booking Hub</span>
          </div>
          <div className="flex items-center gap-6 text-slate-500">
            <span>Hours: 6:00 AM - 10:00 PM Daily</span>
            <span>•</span>
            <span>GCash, Maya & Cash Accepted</span>
          </div>
          <p>© {new Date().getFullYear()} PickleBook PH. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
