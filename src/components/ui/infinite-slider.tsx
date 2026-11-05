import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface InfiniteSliderProps {
  children: ReactNode; className?: string; direction?: 'vertical' | 'horizontal';
  speed?: number; speedOnHover?: number; reverse?: boolean; paused?: boolean;
}

/** A measured, seamless loop. The second copy is hidden from assistive technology. */
export function InfiniteSlider({ children, className, direction = 'horizontal', speed = 30, speedOnHover = 15, reverse = false, paused = false }: InfiniteSliderProps) {
  const host = useRef<HTMLDivElement>(null), group = useRef<HTMLDivElement>(null), track = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);
  const [hovered, setHovered] = useState(false), [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false), [tabVisible, setTabVisible] = useState(!document.hidden);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const vertical = direction === 'vertical';
  const shouldPause = paused || !visible || !tabVisible || focused || reduced;
  const settings = useRef({ shouldPause, hovered, speed, speedOnHover }); settings.current = { shouldPause, hovered, speed, speedOnHover };

  useEffect(() => {
    const node = host.current!, media = matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting)); observer.observe(node);
    const visibility = () => setTabVisible(!document.hidden), motion = () => setReduced(media.matches);
    document.addEventListener('visibilitychange', visibility); media.addEventListener('change', motion);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); media.removeEventListener('change', motion); };
  }, []);
  useEffect(() => {
    const content = group.current!, moving = track.current!;
    const resize = () => {
      const distance = vertical ? content.offsetHeight : content.offsetWidth;
      if (!distance || reduced) { animation.current?.cancel(); animation.current = null; return; }
      const previousProgress = animation.current?.currentTime ? Number(animation.current.currentTime) / (Number(animation.current.effect?.getTiming().duration) || 1) % 1 : 0;
      animation.current?.cancel();
      const duration = distance / Math.max(1, speed) * 1000;
      const end = vertical ? `translate3d(0, -${distance}px, 0)` : `translate3d(-${distance}px, 0, 0)`;
      const next = moving.animate([{ transform: 'translate3d(0,0,0)' }, { transform: end }], { duration, iterations: Infinity, easing: 'linear', direction: reverse ? 'reverse' : 'normal' });
      next.currentTime = previousProgress * duration;
      next.playbackRate = settings.current.hovered ? Math.max(0, settings.current.speedOnHover) / Math.max(1, settings.current.speed) : 1;
      if (settings.current.shouldPause) next.pause(); animation.current = next;
    };
    resize(); const observer = new ResizeObserver(resize); observer.observe(content);
    return () => { observer.disconnect(); animation.current?.cancel(); animation.current = null; };
  }, [vertical, speed, reverse, reduced, children]);
  useEffect(() => {
    if (!animation.current) return;
    animation.current.playbackRate = hovered ? Math.max(0, speedOnHover) / Math.max(1, speed) : 1;
    if (shouldPause) animation.current.pause(); else animation.current.play();
  }, [shouldPause, hovered, speed, speedOnHover]);

  return <div ref={host} className={cn('reviews-slider', vertical && 'reviews-slider-vertical', className)} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div ref={track} className="reviews-slider-track"><div ref={group} className="reviews-slider-group">{children}</div>{!reduced && <div className="reviews-slider-group" aria-hidden="true" inert>{children}</div>}</div>
  </div>;
}
