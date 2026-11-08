import { Clock, Star, MapPin, ChevronRight } from 'lucide-react'

export default function CourtCard({ court, onSelectCourt, availableSlotCount, selectedDate }) {
  const typeBadgeColors = {
    Indoor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Outdoor: 'bg-amber-100 text-amber-800 border-amber-200',
    'Covered Outdoor': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  }

  const badgeColor = typeBadgeColors[court.type] || 'bg-slate-100 text-slate-800 border-slate-200'

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-pickle-400/60 transition-all duration-300 flex flex-col group">
      {/* Image Container with Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={court.image}
          alt={court.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className={`px-2.5 py-1 text-xs font-bold rounded-full border shadow-xs backdrop-blur-md ${badgeColor}`}>
            {court.type === 'Indoor' ? 'Indoor A/C ❄️' : court.type === 'Covered Outdoor' ? 'Covered Pavilion ☔' : 'Outdoor ☀️'}
          </span>
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md text-amber-300 text-xs font-bold px-2 py-1 rounded-full border border-white/10 shadow-xs">
            <Star className="w-3 h-3 fill-amber-300" />
            <span>{court.rating}</span>
            <span className="text-white/60 text-[10px]">({court.reviewCount})</span>
          </div>
        </div>

        {/* Price Tag in Bottom Left of Image */}
        <div className="absolute bottom-3 left-3 text-white">
          <p className="text-xs font-medium text-white/80">Hourly Rate</p>
          <p className="text-xl font-extrabold text-white">
            ₱{court.hourlyRate.toLocaleString()} <span className="text-xs font-normal text-white/80">/ hr</span>
          </p>
        </div>

        {/* Available slots indicator */}
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/90 text-white px-2.5 py-1 rounded-full backdrop-blur-xs">
            <Clock className="w-3 h-3" />
            <span>{availableSlotCount} slots open</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location Badge */}
          <div className="flex items-center gap-1 text-xs font-semibold text-pickle-700 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{court.city}</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-pickle-700 transition-colors">
            {court.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {court.description}
          </p>

          {/* Quick Specifications */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px] font-medium uppercase">Surface</span>
              <span className="font-semibold text-slate-800 truncate block">{court.surface}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-medium uppercase">Lighting</span>
              <span className="font-semibold text-slate-800 truncate block">{court.lighting}</span>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {court.features.map((feature) => (
              <span
                key={feature}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <button
            onClick={() => onSelectCourt(court)}
            className="w-full py-2.5 px-4 bg-pickle-600 hover:bg-pickle-700 active:scale-[0.98] text-white font-semibold rounded-xl text-sm shadow-sm shadow-pickle-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-md"
          >
            <span>Book Court (₱{court.hourlyRate.toLocaleString()})</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
