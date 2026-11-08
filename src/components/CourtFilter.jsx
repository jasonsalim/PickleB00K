import { Search, Filter, MapPin } from 'lucide-react'

export default function CourtFilter({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedCity,
  setSelectedCity,
  selectedDate,
  setSelectedDate,
}) {
  const courtTypes = [
    { label: 'All Court Types', value: 'all' },
    { label: 'Indoor A/C ❄️', value: 'Indoor' },
    { label: 'Covered Pavilion ☔', value: 'Covered Outdoor' },
    { label: 'Outdoor Hardcourt ☀️', value: 'Outdoor' },
  ]

  const cities = [
    { label: 'All Metro Manila', value: 'all' },
    { label: 'BGC / Taguig', value: 'Taguig' },
    { label: 'Makati', value: 'Makati' },
    { label: 'Pasig / Ortigas', value: 'Pasig' },
    { label: 'Greenhills', value: 'San Juan' },
    { label: 'QC', value: 'Quezon City' },
    { label: 'Alabang', value: 'Muntinlupa' },
  ]

  // Generate the next 6 days for quick date picking
  const dateOptions = Array.from({ length: 6 }).map((_, index) => {
    const d = new Date()
    d.setDate(d.getDate() + index)
    const iso = d.toISOString().split('T')[0]
    const label =
      index === 0
        ? 'Today'
        : index === 1
        ? 'Tomorrow'
        : d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })
    return { iso, label }
  })

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 mb-6 space-y-4">
      {/* Top Row: Search and Date Selector */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courts (e.g. BGC, air-conditioned, covered, Katipunan)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-pickle-500/20 focus:border-pickle-500 text-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Date Selector Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap mr-1">Date:</span>
          {dateOptions.map(({ iso, label }) => {
            const isSelected = selectedDate === iso
            return (
              <button
                key={iso}
                onClick={() => setSelectedDate(iso)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-pickle-600 text-white shadow-xs shadow-pickle-600/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Middle Row: Metro Manila City Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap mr-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-pickle-600" />
          <span>Area:</span>
        </span>
        {cities.map(({ label, value }) => {
          const isSelected = selectedCity === value
          return (
            <button
              key={value}
              onClick={() => setSelectedCity(value)}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-pickle-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Bottom Row: Court Type Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pt-1">
        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap mr-1">Facility:</span>
        {courtTypes.map(({ label, value }) => {
          const isSelected = selectedType === value
          return (
            <button
              key={value}
              onClick={() => setSelectedType(value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
