import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
export function DeferredScene({ children }: { children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [enabled, setEnabled] = useState(() => !matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setReady(true); observer.disconnect(); } }, { rootMargin: '200px' });
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  const preview = <div className="scene-preview"><span aria-hidden="true" className="scene-preview-monogram">S.</span><p>Precision. Style. Confidence.</p>{!enabled && <button type="button" onClick={() => setEnabled(true)}>Explore interactive 3D</button>}</div>;
  return <div ref={host} className="deferred-scene">{ready && enabled ? <SceneBoundary fallback={preview}><Suspense fallback={preview}>{children}</Suspense></SceneBoundary> : preview}</div>;
}
