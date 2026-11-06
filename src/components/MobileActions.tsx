import { SALON_LOCATION_CONFIG as salon } from '../utils/contactConfig';
export function MobileActions({ onBook }: { onBook: () => void }) {
  return <nav aria-label="Quick salon actions" className="mobile-actions">
    <button type="button" onClick={onBook}>Book appointment</button>
    {salon.whatsapp && <a href={'https://wa.me/' + salon.whatsapp.replace(/\D/g, '')} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
    {salon.phone && <a href={'tel:' + salon.phone}>Call</a>}
  </nav>;
}
