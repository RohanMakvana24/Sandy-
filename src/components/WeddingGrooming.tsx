import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Heart, Sparkles, Users, Scissors, CalendarDays } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getKolkataDateString } from '../utils/bookingConfig';
import { WEDDING_EVENTS, WEDDING_SERVICES, WEDDING_CONFIG, validateWeddingRequest, buildWeddingInquiryUrl, type WeddingRequest, type WeddingErrors } from '../utils/weddingConfig';
import './WeddingGrooming.css';

gsap.registerPlugin(ScrollTrigger);

export function WeddingGrooming() {
  const section = useRef<HTMLElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const review = useRef<HTMLDivElement>(null);
  const [request, setRequest] = useState<WeddingRequest>({
    event: 'Wedding', party: 'solo', partySize: 2, services: ['hair', 'beard'],
    eventDate: '', groomingDate: '', name: '', mobile: '', notes: '',
  });
  const [errors, setErrors] = useState<WeddingErrors>({});
  const [reviewed, setReviewed] = useState(false);
  const today = getKolkataDateString();

  function update<K extends keyof WeddingRequest>(key: K, value: WeddingRequest[K]) {
    setRequest(previous => ({ ...previous, [key]: value }));
    setErrors(previous => ({ ...previous, [key]: undefined }));
    setReviewed(false);
  }

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-wedding-reveal]', { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.1,
        ease: 'power3.out', scrollTrigger: { trigger: section.current, start: 'top 82%', once: true } });
    }, section);
    return () => ctx.revert();
  }, []);

  useEffect(() => { if (reviewed) review.current?.focus(); }, [reviewed]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validateWeddingRequest(request);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setReviewed(false);
      const first = Object.keys(nextErrors)[0];
      form.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    setReviewed(true);
  }

  const count = request.party === 'solo' ? 1 : request.partySize;
  const chosenServices = WEDDING_SERVICES.filter(service => request.services.includes(service.id));
  const url = reviewed ? buildWeddingInquiryUrl(request) : null;
  const fieldError = (key: keyof WeddingRequest) => errors[key] ? <p id={`wedding-${key}-error`} className="wedding-error">{errors[key]}</p> : null;
  const inputA11y = (key: keyof WeddingRequest) => ({ 'aria-invalid': !!errors[key], 'aria-describedby': errors[key] ? `wedding-${key}-error` : undefined, 'data-field': key });

  return <section id="wedding" ref={section} className="wedding-section" aria-labelledby="wedding-title">
    <div className="wedding-inner">
      <header className="wedding-header" data-wedding-reveal>
        <div><p className="wedding-eyebrow"><span /> MADE FOR YOUR MOMENT</p>
          <h2 id="wedding-title">THE GROOM<br /><span>EXPERIENCE.</span></h2></div>
        <p className="wedding-intro">For the vows. The photographs.<br /> And every moment you’ll remember.<span>Wedding grooming, thoughtfully planned around you.</span></p>
      </header>

      <div className="wedding-layout">
        <aside className="wedding-editorial" data-wedding-reveal>
          <div className="wedding-photo">
            <img src="/assets/wedding/groom-editorial.webp" alt="AI-created style inspiration: groom with a tailored haircut and sculpted beard, wearing an ivory sherwani" loading="lazy" decoding="async" width="1200" height="1500" />
            <span className="wedding-photo-label">THE SANDY WEDDING EDIT</span>
            <div className="wedding-photo-caption"><span>LOOK YOURSELF. AT YOUR BEST.</span><p>A big day.<br />An unforgettable look.</p></div>
          </div>
          <div className="wedding-editorial-bottom"><span>RAJKOT / GROOM & CREW</span><span>AI style inspiration</span></div>
          <div className="wedding-promise"><Scissors size={18} /><p>Your look, your people, your occasion.<br /><span>Tell us the plan. We’ll help shape the details.</span></p></div>
        </aside>

        <form ref={form} className="wedding-form" onSubmit={submit} noValidate data-wedding-reveal>
          <div className="wedding-form-top"><span>YOUR WEDDING RITUAL</span><span>PLAN · PERSONALISE · REQUEST</span></div>
          <fieldset className="wedding-fieldset">
            <legend><span>01</span> Choose your moment</legend>
            <div className="wedding-occasions">{WEDDING_EVENTS.map(occasion => <button key={occasion} type="button" aria-pressed={request.event === occasion} onClick={() => update('event', occasion)}>
              {occasion === 'Wedding' ? <Heart size={17} /> : <Sparkles size={17} />}<span>{occasion}</span>
            </button>)}</div>
            <div className="wedding-party" role="group" aria-label="Who is this for?">
              <button type="button" aria-pressed={request.party === 'solo'} onClick={() => update('party', 'solo')}><span className="wedding-radio" />Just the groom</button>
              <button type="button" aria-pressed={request.party === 'crew'} onClick={() => update('party', 'crew')}><span className="wedding-radio" /><Users size={15} />Groom + crew</button>
            </div>
            {request.party === 'crew' && <label className="wedding-crew-label" htmlFor="wedding-partySize">People, including the groom
              <select id="wedding-partySize" {...inputA11y('partySize')} value={request.partySize} onChange={event => update('partySize', Number(event.target.value))}>
                {Array.from({ length: WEDDING_CONFIG.maxPartySize - 1 }, (_, index) => index + 2).map(size => <option key={size} value={size}>{size} people</option>)}
              </select>{fieldError('partySize')}
            </label>}
          </fieldset>

          <fieldset className="wedding-fieldset">
            <legend><span>02</span> Make it your ritual</legend>
            <p className="wedding-field-note">Pick what you have in mind. We’ll personalise the package together.</p>
            <div className="wedding-service-list">{WEDDING_SERVICES.map((service, index) => {
              const selected = request.services.includes(service.id);
              return <label key={service.id} className={`wedding-service ${selected ? 'is-selected' : ''}`}>
                <input type="checkbox" data-field={index === 0 ? 'services' : undefined} aria-describedby={errors.services ? 'wedding-services-error' : undefined} aria-invalid={!!errors.services} checked={selected}
                  onChange={() => update('services', selected ? request.services.filter(id => id !== service.id) : [...request.services, service.id])} />
                <span className="wedding-check" aria-hidden="true">{selected && <Check size={13} />}</span>
                <span><strong>{service.name}</strong><small>{service.detail}</small></span>
              </label>;
            })}</div>{fieldError('services')}
          </fieldset>

          <fieldset className="wedding-fieldset wedding-details-fieldset">
            <legend><span>03</span> Let’s plan the details</legend>
            <div className="wedding-input-grid">
              <label htmlFor="wedding-eventDate"><CalendarDays size={13} /> Event date <span aria-hidden="true">*</span>
                <input id="wedding-eventDate" type="date" required min={today} value={request.eventDate} {...inputA11y('eventDate')} onChange={event => update('eventDate', event.target.value)} />{fieldError('eventDate')}</label>
              <label htmlFor="wedding-groomingDate">Preferred grooming date <span aria-hidden="true">*</span>
                <input id="wedding-groomingDate" type="date" required min={today} max={request.eventDate || undefined} value={request.groomingDate} {...inputA11y('groomingDate')} onChange={event => update('groomingDate', event.target.value)} />{fieldError('groomingDate')}</label>
              <label htmlFor="wedding-name">Your name <span aria-hidden="true">*</span>
                <input id="wedding-name" type="text" autoComplete="name" required maxLength={100} placeholder="Full name" value={request.name} {...inputA11y('name')} onChange={event => update('name', event.target.value)} />{fieldError('name')}</label>
              <label htmlFor="wedding-mobile">Mobile number <span aria-hidden="true">*</span>
                <input id="wedding-mobile" type="tel" autoComplete="tel" inputMode="tel" required maxLength={18} placeholder="Your 10-digit number" value={request.mobile} {...inputA11y('mobile')} onChange={event => update('mobile', event.target.value)} />{fieldError('mobile')}</label>
              <label className="wedding-notes" htmlFor="wedding-notes">Anything you’d like us to know? <span>(optional)</span>
                <textarea id="wedding-notes" rows={2} maxLength={1000} placeholder="Your outfit, a look you love, or plans for your crew…" value={request.notes} onChange={event => update('notes', event.target.value)} /></label>
            </div>
          </fieldset>

          <div className="wedding-summary" aria-live="polite"><span>YOUR PLAN</span><p>{request.event} <i>/</i> {count} {count === 1 ? 'person' : 'people'} <i>/</i> {chosenServices.length} services</p><small>Personalised package · Quote on consultation</small></div>
          <button type="submit" className="wedding-submit">Review wedding request <ArrowUpRight size={19} /></button>
          <p className="wedding-disclaimer">No payment required. Your dates and package are confirmed personally by the salon.</p>

          {reviewed && url && <div ref={review} tabIndex={-1} className="wedding-review" aria-label="Review your wedding inquiry">
            <p><Check size={17} /> Your inquiry is ready, {request.name.trim()}.</p>
            <dl><div><dt>Occasion</dt><dd>{request.event} · {request.eventDate}</dd></div><div><dt>Grooming date</dt><dd>{request.groomingDate}</dd></div><div><dt>For</dt><dd>{request.party === 'solo' ? 'Just the groom' : `Groom + crew · ${count} people`}</dd></div><div><dt>Services</dt><dd>{chosenServices.map(service => service.name).join(', ')}</dd></div></dl>
            <a href={url} target="_blank" rel="noopener noreferrer">Open WhatsApp inquiry <ArrowUpRight size={17} /></a>
            <small>Opens a prepared message. Send it in WhatsApp to request a quote and availability.</small>
          </div>}
        </form>
      </div>
    </div>
  </section>;
}
