import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Grid2X2, MessageSquareQuote, Pause, Play, Rows3, Star } from 'lucide-react';
import { InfiniteSlider } from './infinite-slider';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { DEFAULT_TESTIMONIALS, TESTIMONIALS_SECTION_COPY, type TestimonialItem } from '../../utils/testimonialsConfig';
import './testimonials-6.css';

export interface TestimonialsSectionProps { testimonials?: readonly TestimonialItem[]; onBookAppointment?: () => void }
export function TestimonialsSection({ testimonials = DEFAULT_TESTIMONIALS, onBookAppointment }: TestimonialsSectionProps) {
  const [columnCount, setColumnCount] = useState(() => window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1);
  const [paused, setPaused] = useState(false), [viewAll, setViewAll] = useState(false);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const medium = matchMedia('(min-width: 768px)'), large = matchMedia('(min-width: 1024px)'), motion = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setColumnCount(large.matches ? 3 : medium.matches ? 2 : 1); setReduced(motion.matches); };
    update(); [medium, large, motion].forEach(media => media.addEventListener('change', update));
    return () => [medium, large, motion].forEach(media => media.removeEventListener('change', update));
  }, []);
  const columns = useMemo(() => Array.from({ length: columnCount }, (_, index) => testimonials.filter((_, item) => item % columnCount === index)), [columnCount, testimonials]);
  const hasSamples = testimonials.some(item => item.source === 'Sample Review');
  return <section id={TESTIMONIALS_SECTION_COPY.sectionId} className="reviews-six" aria-labelledby="reviews-six-heading" data-testid="testimonials-section">
    <div className="reviews-six-inner"><header className="reviews-six-heading">
      <span className="reviews-six-badge"><MessageSquareQuote size={13} strokeWidth={1.6} /> CLIENT STORIES</span>
      <h2 id="reviews-six-heading">{TESTIMONIALS_SECTION_COPY.headlineLine1}<br /><span>{TESTIMONIALS_SECTION_COPY.headlineLine2}</span></h2><p>{TESTIMONIALS_SECTION_COPY.supportingDescription}</p>
    </header>
    <div className="reviews-six-toolbar"><span>{hasSamples ? `${testimonials.length} SAMPLE STORIES / DESIGN PREVIEW` : `${testimonials.length} CLIENT STORIES`}</span><div>
      {!viewAll && !reduced && <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? <Play size={13} /> : <Pause size={13} />}{paused ? 'Resume' : 'Pause'}</button>}
      <button type="button" aria-expanded={viewAll} aria-controls="reviews-six-collection" onClick={() => setViewAll(value => !value)}>{viewAll ? <Rows3 size={14} /> : <Grid2X2 size={14} />}{viewAll ? 'Scrolling view' : `View all ${testimonials.length}`}</button>
    </div></div>
    {testimonials.length ? <div id="reviews-six-collection" className={`reviews-six-wall${viewAll ? ' reviews-six-all' : ''}${reduced ? ' reviews-six-reduced' : ''}`} data-lenis-prevent={viewAll ? undefined : true}>
      {viewAll ? <div className="reviews-six-static-grid">{testimonials.map(item => <TestimonialsCard key={item.id} testimonial={item} />)}</div> : columns.filter(column => column.length).map((column, index) => <InfiniteSlider key={`${columnCount}-${index}`} direction="vertical" speed={[30, 42, 34][index]} speedOnHover={[10, 14, 11][index]} reverse={index === 1} paused={paused}>{column.map(item => <TestimonialsCard key={item.id} testimonial={item} />)}</InfiniteSlider>)}
    </div> : <p className="reviews-six-empty">Client stories are coming soon.</p>}
    {hasSamples && <p className="reviews-six-disclosure">Design preview: illustrative reviews with fictional names and sample ratings, not verified customer feedback. Portraits are stock imagery. Replace with approved client reviews before publishing.</p>}
    {onBookAppointment && <footer className="reviews-six-footer"><div><small>YOUR NEXT EXPERIENCE AWAITS</small><p>Ready for your signature look?</p></div><button type="button" onClick={onBookAppointment}>Book an appointment <ArrowRight size={17} /></button></footer>}
    </div>
  </section>;
}
function TestimonialsCard({ testimonial }: { testimonial: TestimonialItem }) {
  const initials = testimonial.clientName.split(' ').slice(0, 2).map(part => part.charAt(0)).join('');
  const sample = testimonial.source === 'Sample Review';
  return <figure className="reviews-six-card" data-review-id={testimonial.id}>
    <div className="reviews-six-card-top"><span className="reviews-six-stars" role="img" aria-label={`${sample ? 'Illustrative rating: ' : ''}${testimonial.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={12} strokeWidth={1.4} fill={index < testimonial.rating ? 'currentColor' : 'none'} aria-hidden="true" />)}</span><span className="reviews-six-source">{sample ? 'SAMPLE' : testimonial.source}</span></div>
    <blockquote>{testimonial.quote}</blockquote>
    <figcaption><Avatar className="reviews-six-avatar">{testimonial.image && <AvatarImage src={testimonial.image} alt="" loading="lazy" />}<AvatarFallback>{initials}</AvatarFallback></Avatar><div><cite>{testimonial.clientName}</cite><span>{testimonial.serviceTag}</span></div></figcaption>
  </figure>;
}
export default TestimonialsSection;
