import React, { useState } from 'react';
import { Quote, MapPin, Briefcase } from 'lucide-react';
import type { Alumni } from '../../data/partners';

interface AlumniCardProps {
  alumni: Alumni;
}

const AlumniCard: React.FC<AlumniCardProps> = ({ alumni }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 relative">
      {/* Quote Mark Decoration */}
      <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote className="h-16 w-16 text-gau-msa-primary" />
      </div>

      <div className="p-8 relative">
        {/* Profile Photo & Info */}
        <div className="flex items-center space-x-4 mb-6">
          {/* Profile Photo */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-gau-msa-primary/20 group-hover:ring-gau-msa-primary/40 transition-all duration-300 shadow-lg">
              {!imageError ? (
                <img
                  src={alumni.photoUrl}
                  alt={alumni.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              ) : (
                // Fallback: initials
                <div className="w-full h-full bg-gradient-to-br from-gau-msa-primary to-gau-msa-secondary flex items-center justify-center text-white font-bold text-2xl">
                  {alumni.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
              )}
            </div>
            {/* Verified Badge */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>

          {/* Name & Role */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 text-lg truncate">{alumni.name}</h3>
            <p className="text-sm text-gau-msa-primary font-medium">{alumni.role}</p>
            <div className="flex items-center text-xs text-gray-400 mt-1">
              <Briefcase className="h-3 w-3 mr-1" />
              <span className="truncate">{alumni.position}</span>
            </div>
          </div>
        </div>

        {/* Position Badge */}
        <div className="inline-block bg-gau-msa-gold/20 text-gau-msa-primary px-3 py-1 rounded-full text-xs font-semibold mb-4">
          {alumni.position}
        </div>

        {/* Quote */}
        <p className="text-gray-600 text-sm leading-relaxed italic mb-4 relative">
          "{alumni.quote}"
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-400">
            <div className="w-2 h-2 rounded-full bg-gau-msa-gold mr-2"></div>
            {alumni.year}
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <MapPin className="h-3 w-3 mr-1" />
            Garissa, Kenya
          </div>
        </div>
      </div>

      {/* Bottom Gradient Bar */}
      <div className="h-1 bg-gradient-to-r from-gau-msa-primary via-gau-msa-gold to-gau-msa-secondary"></div>
    </div>
  );
};

export default AlumniCard;