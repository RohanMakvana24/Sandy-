import { useEffect } from 'react';
import { scrollToTarget } from '../utils/smoothScroll';
export function AppointmentModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => { if (isOpen) { onClose(); scrollToTarget('booking', { offset: -84 }); } }, [isOpen, onClose]);
  return null;
}
