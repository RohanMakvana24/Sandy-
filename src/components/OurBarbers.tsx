import React, { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BARBERS } from '../utils/barbers';
import './OurBarbers.css';

const Lanyard = lazy(() => import('./Lanyard'));
gsap.registerPlugin(ScrollTrigger);

class CardBoundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function BarberLanyard({ barber, active }: { barber: typeof BARBERS[number]; active: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [back, setBack] = useState(false);

  useEffect(() => {
    if (!active || !host.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReady(true); observer.disconnect(); }
    }, { rootMargin: '150px' });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, [active]);

  useLayoutEffect(() => {
    const node = host.current;
    if (!node) return;
    const onFailure = () => setFailed(true);
    node.addEventListener('lanyard-error', onFailure);
    return () => node.removeEventListener('lanyard-error', onFailure);
  }, []);

  const preview = <div className="barber-static"><span className="barber-static-strap" /><img src={back ? barber.backImage : barber.frontImage} alt={`${barber.name}, ${back ? 'back' : 'front'} of temporary profile card`} /></div>;

  return <article className="barber-artist" aria-label={`${barber.name}, temporary profile`}>
    <div ref={host} className="barber-stage">
      {ready && active && !failed ? <CardBoundary fallback={preview}><Suspense fallback={preview}>
        <Lanyard frontImage={barber.frontImage} backImage={barber.backImage} strapImage={barber.strapImage}
          imageFit="cover" cardColor="#171819" orientation="portrait" finish="glossy"
          cornerRadius={0.3} size={0.72} anchor="center" strapLength={0.4} strapColor="#77795B"
          strapWidth={0.65} metal="silver" gravity={1} damping={0.65} elasticity={0.35}
          breeze={0} interactive intro={false} className="barber-lanyard" style={undefined} />
      </Suspense></CardBoundary> : preview}
    </div>
    <div className="barber-caption"><span>0{barber.displayOrder} / THE ARTIST</span><h3>{barber.name}</h3><p>{barber.role}</p></div>
    <details className="barber-details"><summary>View profile & card details</summary>
      <p>AI-created portrait for preview. Real staff name and role await approval.</p>
      <p>{barber.specialties.join(' · ')}. {barber.experience}.</p>
      <button type="button" onClick={() => setBack(value => !value)}>Show {back ? 'front' : 'back'} artwork</button>
      <img src={back ? barber.backImage : barber.frontImage} alt={`${barber.name} ${back ? 'back' : 'front'} artwork`} loading="lazy" />
    </details>
  </article>;
}

export function OurBarbers() {
  const section = useRef<HTMLElement>(null);
  const [mobile, setMobile] = useState(() => window.innerWidth < 640);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const small = window.matchMedia('(max-width: 639px)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setMobile(small.matches); setReduced(motion.matches); };
    update(); small.addEventListener('change', update); motion.addEventListener('change', update);
    return () => { small.removeEventListener('change', update); motion.removeEventListener('change', update); };
  }, []);

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-barber-reveal]', { y: 24, opacity: 0, duration: 0.9, stagger: 0.12,
        ease: 'power3.out', scrollTrigger: { trigger: section.current, start: 'top 82%', once: true } });
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return <section id="barbers" ref={section} className="our-barbers" aria-labelledby="barbers-heading">
    <div className="barbers-inner">
      <header className="barbers-heading">
        <p className="barbers-eyebrow" data-barber-reveal>THE ARTISTS BEHIND THE CRAFT</p>
        <h2 id="barbers-heading" data-barber-reveal>MEET OUR<br /><span>MASTER</span> BARBERS.</h2>
        <div className="barbers-intro" data-barber-reveal><p>Precision in every detail. Passion behind every cut.</p><span>DRAG TO EXPLORE · CLICK TO FLIP</span></div>
      </header>
      {mobile && <nav className="barbers-picker" aria-label="Choose barber">{BARBERS.map((barber, index) => <button key={barber.id} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>0{barber.displayOrder}</button>)}</nav>}
      <div className="barbers-gallery" data-barber-reveal>{BARBERS.map((barber, index) => <div key={barber.id} hidden={mobile && selected !== index}>
        <BarberLanyard barber={barber} active={!reduced && (!mobile || selected === index)} />
      </div>)}</div>
      <p className="barbers-note">THE TEAM COLLECTION / RAJKOT<span>AI portrait previews · Real artist details coming soon</span></p>
    </div>
  </section>;
}
