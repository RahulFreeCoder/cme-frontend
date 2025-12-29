import { Star, MapPin, Clock, Calendar } from 'lucide-react';
import  ImageWithFallback  from './ImageWithFallback';
import { DOCTOR_PROFILE_TEXT as TEXT } from "./constants/doctorProfile.constants";

export default function DoctorCard({ doctor, onViewProfile }) {
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-blue-100 overflow-hidden">
      <ImageWithFallback
        src={doctor.imageUrl}
        alt={doctor.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-gray-900 mb-1">{doctor.name}</h3>
        <p className="text-blue-600 mb-3">{doctor.specialty}</p>
        
        <div className="flex items-center gap-1 mb-4">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-gray-900">{doctor.rating}</span>
          <span className="text-gray-500">({doctor.reviewCount} )</span>
        </div>

        <div className="flex flex-col gap-2 text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>{doctor.experience} {TEXT.EXPERIENCE.YEARS}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>{doctor.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-blue-600">{doctor.availability}</span>
          </div>
        </div>

        <div className="border-t border-blue-100 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-500"> {TEXT.LABELS.FEE}</p>
              <p className="text-blue-600">{TEXT.LABELS.CURRENCY} {doctor.consultationFee}</p>
            </div>
          </div>
          <button 
            onClick={() => onViewProfile(doctor)}
            className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            {TEXT.SECTIONS.VIEW_PROFILE}
          </button>
        </div>
      </div>
    </div>
  );
}
