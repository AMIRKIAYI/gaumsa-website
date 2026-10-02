import React, { useState } from 'react';
import type { Partner } from '../../data/partners';

interface PartnerLogoProps {
  partner: Partner;
}

const PartnerLogo: React.FC<PartnerLogoProps> = ({ partner }) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <a
      href={partner.website || '#'}
      target={partner.website ? '_blank' : '_self'}
      rel="noopener noreferrer"
      className="group flex-shrink-0 flex items-center justify-center h-20 w-40 mx-6 hover:scale-110 transition-transform duration-300"
      title={partner.name}
    >
      {!imageError ? (
        <img
          src={partner.logoUrl}
          alt={partner.name}
          style={{ maxHeight: '100%', maxWidth: '100%', width: 'auto', height: 'auto', objectFit: 'contain' }}
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gau-msa-primary to-gau-msa-secondary flex items-center justify-center text-white font-bold text-sm">
          {getInitials(partner.name)}
        </div>
      )}
    </a>
  );
};

export default PartnerLogo;