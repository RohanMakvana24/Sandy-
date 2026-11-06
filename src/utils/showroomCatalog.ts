import { SALON_LOCATION_CONFIG } from './contactConfig';
export type Category = 'hair' | 'beard' | 'skin' | 'styling' | 'combos';
export type ProductShape = 'pump' | 'dropper' | 'jar' | 'tube' | 'spray';
export interface GroomingProduct {
  id: string; name: string; slug: string; category: Category; description: string;
  pricePaise: number | null; currency: 'INR'; size?: string; image: string; imageFull?: string;
  modelUrl?: string; textureUrl?: string; stockStatus: 'unknown' | 'available' | 'unavailable';
  purchasable: boolean; demo: boolean; shape: ProductShape; color: string;
}
export const CATEGORY_LABELS: Record<Category | 'all', string> = {
  all: 'All products', hair: 'Hair care', beard: 'Beard care', skin: 'Skin care', styling: 'Styling', combos: 'Combos',
};
export function productThumbnail(shape: ProductShape, color: string, name = 'Grooming care') {
  const jar = shape === 'jar';
  const escape = (value: string) => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]!));
  const words = name.toUpperCase().split(' '), first = escape(words.slice(0, -1).join(' ')), last = escape(words.at(-1)!);
  const labelY = jar ? 244 : 190;
  const body = shape === 'tube' ? '<path d="M139 96h122l-13 243q-48 17-96 0z" fill="url(#body)"/><rect x="149" y="336" width="102" height="27" rx="6" fill="url(#cap)"/><path d="M139 100h122" stroke="#aaa68f" stroke-width="5"/>' : `<rect x="${jar ? 95 : 143}" y="${jar ? 219 : 122}" width="${jar ? 210 : 114}" height="${jar ? 139 : 236}" rx="${jar ? 22 : 24}" fill="url(#body)"/><rect x="${jar ? 91 : 166}" y="${jar ? 203 : 80}" width="${jar ? 218 : 68}" height="${jar ? 36 : 55}" rx="8" fill="url(#cap)"/>`;
  const top = shape === 'pump' ? '<rect x="190" y="52" width="20" height="37" rx="4" fill="#aaa58e"/><path d="M176 54h84v12h-56v11h-28z" fill="#22241f"/>' : shape === 'dropper' ? '<rect x="178" y="45" width="44" height="45" rx="18" fill="#1b1d19"/>' : shape === 'spray' ? '<rect x="183" y="57" width="34" height="28" rx="5" fill="#1b1d19"/><circle cx="200" cy="67" r="3" fill="#b0ac99"/>' : '';
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 440"><defs><linearGradient id="body"><stop stop-color="${color}"/><stop offset=".27" stop-color="${color}"/><stop offset=".45" stop-color="#a6a58e"/><stop offset=".6" stop-color="${color}"/><stop offset="1" stop-color="#22251e"/></linearGradient><linearGradient id="cap"><stop stop-color="#11130f"/><stop offset=".45" stop-color="#4a4d41"/><stop offset="1" stop-color="#10120f"/></linearGradient><radialGradient id="bg"><stop stop-color="#ebe4d4"/><stop offset="1" stop-color="#c8c1af"/></radialGradient><filter id="s"><feGaussianBlur stdDeviation="8"/></filter></defs><rect width="400" height="440" rx="16" fill="url(#bg)"/><ellipse cx="200" cy="370" rx="${jar ? 114 : 76}" ry="12" opacity=".2" fill="#171819" filter="url(#s)"/>${body}${top}<rect x="${jar ? 111 : 147}" y="${labelY}" width="${jar ? 178 : 106}" height="${jar ? 89 : 114}" rx="2" fill="#f1eadb"/><g text-anchor="middle" fill="#24271f"><text x="200" y="${labelY + 22}" font-family="sans-serif" font-size="7" letter-spacing="2">THE COLLECTION</text><path d="M177 ${labelY + 32}h46" stroke="#77795B"/><text x="200" y="${labelY + 51}" font-family="Georgia,serif" font-size="${jar ? 17 : 13}">${first}</text><text x="200" y="${labelY + 69}" font-family="Georgia,serif" font-size="${jar ? 17 : 13}">${last}</text></g><text x="200" y="412" text-anchor="middle" font-family="sans-serif" font-size="9" letter-spacing="2" fill="#535648">CONCEPT PACKAGING</text></svg>`)}`;
}
const demo = (id: string, name: string, category: Category, shape: ProductShape, color: string, description: string): GroomingProduct => ({
  id, name, slug: id, category, shape, color, description, pricePaise: null, currency: 'INR',
  stockStatus: 'unknown', purchasable: false, demo: true, image: `/assets/showroom/products/${id}.webp`, imageFull: `/assets/showroom/products/${id}.png`,
});
// Concept catalogue only. Replace with salon-approved products, images, sizes and verified prices.
export const SHOWROOM_PRODUCTS: GroomingProduct[] = [
  demo('daily-shampoo', 'Daily shampoo', 'hair', 'pump', '#292c26', "Start your routine with a fresh wash. Explore this daily shampoo presentation and ask our team for a formula suited to your hair."),
  demo('hair-serum', 'Hair serum', 'hair', 'dropper', '#77795B', "The finishing touch for your hair-care routine. Ask our stylist about a serum suited to your hair texture."),
  demo('beard-oil', 'Beard oil', 'beard', 'dropper', '#34362b', "A considered addition to your beard-care routine. Discuss your preferred finish and fragrance with the salon."),
  demo('beard-balm', 'Beard balm', 'beard', 'jar', '#171819', "A compact beard-care essential for your grooming shelf. Ask the team about available balm options."),
  demo('face-cleanser', 'Face cleanser', 'skin', 'tube', '#E8DDC8', "Make cleansing part of your grooming ritual. Our team can help you choose from the available collection."),
  demo('styling-clay', 'Styling clay', 'styling', 'jar', '#77795B', "Shape your signature look. Ask your stylist about hold, finish and the right styling clay for you."),
  demo('finishing-spray', 'Finishing spray', 'styling', 'spray', '#171819', "Complete your styling routine. Explore finishing options with your stylist before choosing."),
  demo('grooming-cream', 'Grooming cream', 'styling', 'tube', '#77795B', "An everyday styling essential. Speak with the team about a cream suited to your look."),
];
// Intentionally unset: a public telephone listing does not establish a verified WhatsApp account.
export const SHOWROOM_ORDER_CONTACT: { verified: boolean; whatsappNumber: string } = { verified: !!SALON_LOCATION_CONFIG.whatsapp, whatsappNumber: SALON_LOCATION_CONFIG.whatsapp.replace(/\D/g, '') };
export type CartLine = { productId: string; quantity: number };
export const isOrderable = (p: GroomingProduct) => !p.demo && p.purchasable && p.stockStatus === 'available' && Number.isSafeInteger(p.pricePaise) && p.pricePaise! >= 0;
export const formatMoney = (paise: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(paise / 100);
export function normalizeCart(input: unknown, catalog = SHOWROOM_PRODUCTS): CartLine[] {
  if (!Array.isArray(input)) return [];
  const merged = new Map<string, number>();
  for (const line of input) {
    const product = catalog.find(p => p.id === line?.productId);
    if (!product || !Number.isInteger(line.quantity) || line.quantity <= 0) continue;
    merged.set(product.id, Math.min(99, (merged.get(product.id) || 0) + line.quantity));
  }
  return [...merged].map(([productId, quantity]) => ({ productId, quantity }));
}
export function cartSubtotal(lines: CartLine[], catalog = SHOWROOM_PRODUCTS) {
  return normalizeCart(lines, catalog).reduce((total, line) => { const p = catalog.find(p => p.id === line.productId)!; return total + (isOrderable(p) ? p.pricePaise! * line.quantity : 0); }, 0);
}
export function orderInquiryUrl(lines: CartLine[], catalog = SHOWROOM_PRODUCTS, contact = SHOWROOM_ORDER_CONTACT) {
  const valid = normalizeCart(lines, catalog);
  if (!valid.length || !contact.verified || !/^91[6-9]\d{9}$/.test(contact.whatsappNumber)) return null;
  const rows = valid.map(line => { const p = catalog.find(p => p.id === line.productId)!; return `${p.name} × ${line.quantity} — ${isOrderable(p) ? formatMoney(p.pricePaise!) + ' each' : 'Price on request'}`; });
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(`Hello Sandy Men's Salon,\n\nI would like to enquire about these grooming products:\n${rows.join('\n')}\n\nPrices and availability: please confirm with the salon.\nPlease confirm availability, final price, and how I can purchase these products.\nThank you.`)}`;
}
