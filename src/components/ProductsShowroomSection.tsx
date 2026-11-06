import React, { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, ChevronLeft, ChevronRight, Expand, Grid2X2, Leaf, List, Minus, Package, Plus, RotateCcw, Scissors, ShoppingBag, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { CATEGORY_LABELS, SHOWROOM_PRODUCTS, cartSubtotal, formatMoney, isOrderable, normalizeCart, orderInquiryUrl, type CartLine, type Category } from '../utils/showroomCatalog';
import { TOUR_STOPS } from '../utils/showroomNavigation';
import { setSmoothScrollLocked } from '../utils/smoothScroll';
import type { CameraCommand, ShowroomFailure } from './showroom/VirtualShowroom';
import './ProductsShowroomSection.css';

const loadVirtualShowroom = () => import('./showroom/VirtualShowroom');
class SceneBoundary extends React.Component<{ children: React.ReactNode; onFailure: (reason: ShowroomFailure) => void }, { failed: boolean }> {
  state = { failed: false }; static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { console.error('Showroom failed to load', error); this.props.onFailure(/(?:webgl|graphics).*context|webgl.*(?:support|available)/i.test(error.message) ? 'unsupported' : 'load-error'); }
  render() { return this.state.failed ? null : this.props.children; }
}
const ICONS = { all: Grid2X2, hair: Scissors, beard: Sparkles, skin: Leaf, styling: SlidersHorizontal, combos: Package };
const STORAGE = 'sandy-showroom-basket-v2';
function initialCart() { try { return normalizeCart(JSON.parse(sessionStorage.getItem(STORAGE) || '[]')); } catch { return []; } }

export function ProductsShowroomSection() {
  const [open, setOpen] = useState(false), [listFirst, setListFirst] = useState(false);
  const [cart, setCart] = useState<CartLine[]>(initialCart);
  useEffect(() => { try { sessionStorage.setItem(STORAGE, JSON.stringify(cart)); } catch { /* session storage may be disabled */ } }, [cart]);
  return <section id="products" className="boutique-entry" aria-labelledby="boutique-heading">
    <div className="boutique-entry-copy"><span className="boutique-eyebrow">OUR PRODUCTS / THE SANDY COLLECTION</span>
      <h2 id="boutique-heading">STEP INSIDE.<br /><em>EXPLORE THE CRAFT.</em></h2>
      <p>Discover grooming essentials in an immersive virtual boutique.</p>
      <div className="boutique-entry-actions"><button className="boutique-primary" onClick={() => { setListFirst(false); setOpen(true); }}>Enter the showroom <ArrowRight size={18} /></button>
        <button className="boutique-text-button" onClick={() => { setListFirst(true); setOpen(true); }}>Explore products <List size={17} /></button></div>
      <div className="boutique-entry-meta"><span>01 / EXPLORE IN 3D</span><span>02 / DISCOVER YOUR ROUTINE</span></div>
    </div>
    <button className="boutique-entry-visual" onClick={() => { setListFirst(false); setOpen(true); }} aria-label="Enter the virtual grooming boutique">
      <img className="boutique-render-preview" src="/assets/showroom/boutique-preview.webp" alt="Preview of the interactive 3D grooming boutique" loading="lazy" width={1280} height={720} />
      <span className="boutique-visual-caption">A NEW PERSPECTIVE ON GROOMING <ArrowUp size={19} /></span>
    </button>
    <p className="boutique-demo-note">Build your grooming basket. Product imagery is AI-created; the salon will confirm the available brands, prices and sizes.</p>
    {open && createPortal(<ShowroomDialog listFirst={listFirst} cart={cart} setCart={setCart} onClose={() => setOpen(false)} />, document.body)}
  </section>;
}

function ShowroomDialog({ listFirst, cart, setCart, onClose }: { listFirst: boolean; cart: CartLine[]; setCart: React.Dispatch<React.SetStateAction<CartLine[]>>; onClose: () => void }) {
  const productClickTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(productClickTimer.current), []);
  const basketTarget = useRef<HTMLButtonElement>(null);
  const flightSerial = useRef(0);
  const [flights, setFlights] = useState<{ key: number; id: string; origin: { x: number; y: number } }[]>([]);
  const dialog = useRef<HTMLDialogElement>(null), panel = useRef<HTMLElement>(null);
  const lastProductTrigger = useRef<HTMLElement>(null);
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [selected, setSelected] = useState<string | null>(null), [hover, setHover] = useState<string | null>(null);
  const [view, setView] = useState<'scene' | 'list'>(listFirst ? 'list' : 'scene');
  const [cartOpen, setCartOpen] = useState(false), [quantity, setQuantity] = useState(1);
  const [imageZoom, setImageZoom] = useState(false);
  const [mode, setMode] = useState<'tour' | 'free'>('tour'), [stop, setStop] = useState(0);
  const [ready, setReady] = useState(false), [failed, setFailed] = useState<ShowroomFailure | null>(null), [full, setFull] = useState(false);
  const [slow, setSlow] = useState(false), [attempt, setAttempt] = useState(0);
  const VirtualShowroom = useMemo(() => lazy(loadVirtualShowroom), [attempt]);
  const [notice, setNotice] = useState(''), [command, setCommand] = useState<CameraCommand>({ serial: 0 });
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 3500); return () => clearTimeout(timer); }, [notice, cart]);
  const [reduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const issue = useCallback((next: Omit<CameraCommand, 'serial'>) => setCommand(previous => ({ ...next, serial: previous.serial + 1 })), []);
  const failure = useCallback((reason: ShowroomFailure) => { setFailed(reason); setReady(false); setView('list'); }, []);
  const sceneReady = useCallback(() => { setReady(true); setSlow(false); }, []);
  const startScene = () => { setSelected(null); setCartOpen(false); setFailed(null); setReady(false); setSlow(false); setAttempt(value => value + 1); issue({ stop }); setView('scene'); };
  const hoverProduct = useCallback((id: string | null) => setHover(previous => previous === id ? previous : id), []);
  const chooseProduct = useCallback((id: string, productPosition?: [number, number, number]) => {
    if (!panel.current?.contains(document.activeElement)) lastProductTrigger.current = document.activeElement as HTMLElement;
    setCategory(current => current === 'all' || SHOWROOM_PRODUCTS.find(p => p.id === id)?.category === current ? current : 'all');
    setSelected(id); setImageZoom(false); setQuantity(1); setCartOpen(false); setHover(null); issue({ productId: id, productPosition });
  }, [issue]);
  const closeProduct = () => { setSelected(null); issue({ restore: true }); requestAnimationFrame(() => lastProductTrigger.current?.isConnected && lastProductTrigger.current.focus()); };
  const product = SHOWROOM_PRODUCTS.find(p => p.id === selected);
  const visibleProducts = SHOWROOM_PRODUCTS.filter(p => category === 'all' || p.category === category);
  const wheelNavigation = useRef(-Infinity);
  const swipeNavigation = useRef(-Infinity);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const browseProduct = useCallback((direction: number) => {
    const products = SHOWROOM_PRODUCTS.filter(p => category === 'all' || p.category === category);
    if (!selected || products.length < 2) return;
    const index = products.findIndex(p => p.id === selected);
    chooseProduct(products[(index + direction + products.length) % products.length].id);
  }, [selected, category, chooseProduct]);
  useEffect(() => {
    const element = dialog.current;
    if (!element || !selected || imageZoom) return;
    let accumulated = 0, lastEvent = 0;
    const wheel = (event: WheelEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.boutique-image-button, .boutique-canvas')) return;
      if (event.ctrlKey) return;
      event.preventDefault(); event.stopPropagation();
      const now = performance.now();
      if (now - wheelNavigation.current < 750) return;
      if (now - lastEvent > 180) accumulated = 0;
      lastEvent = now;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      accumulated += delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      if (Math.abs(accumulated) < 70) return;
      wheelNavigation.current = now; browseProduct(accumulated > 0 ? 1 : -1); accumulated = 0;
    };
    element.addEventListener('wheel', wheel, { passive: false, capture: true });
    return () => element.removeEventListener('wheel', wheel, true);
  }, [selected, imageZoom, browseProduct]);
  const categories = (Object.keys(CATEGORY_LABELS) as (Category | 'all')[]).filter(c => c === 'all' || SHOWROOM_PRODUCTS.some(p => p.category === c));
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  const orderUrl = orderInquiryUrl(cart);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement, element = dialog.current!;
    const previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; setSmoothScrollLocked(true);
    element.showModal();
    const change = () => setFull(document.fullscreenElement === element); document.addEventListener('fullscreenchange', change);
    return () => { document.removeEventListener('fullscreenchange', change); element.close(); document.body.style.overflow = previousOverflow; setSmoothScrollLocked(false); previous?.focus(); };
  }, []);
  useEffect(() => { if ((selected || cartOpen) && !panel.current?.contains(document.activeElement)) panel.current?.focus(); }, [selected, cartOpen]);
  useEffect(() => {
    if (view !== 'scene' || ready || failed) return;
    // A slow module download is not evidence that the browser lacks 3D support.
    const timeout = window.setTimeout(() => setSlow(true), 30000); return () => clearTimeout(timeout);
  }, [view, ready, failed, attempt]);
  const goStop = (index: number) => { const next = (index + TOUR_STOPS.length) % TOUR_STOPS.length; setStop(next); setSelected(null); issue({ stop: next }); };
  const changeCategory = (next: Category | 'all') => {
    setCategory(next); setSelected(null); const index = { all: 0, hair: 2, beard: 3, skin: 1, styling: 4, combos: 1 }[next];
    setStop(index); issue({ stop: index });
  };
  const addToBasket = (id: string, amount = 1, origin?: { x: number; y: number }) => {
    const source = panel.current?.querySelector('.boutique-detail-image')?.getBoundingClientRect();
    const start = origin || (source ? { x: source.x + source.width / 2, y: source.y + source.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight / 2 });
    setFlights(previous => [...previous.slice(-5), { key: ++flightSerial.current, id, origin: start }]);
    setCart(lines => normalizeCart([...lines, { productId: id, quantity: amount }]));
    setNotice(SHOWROOM_PRODUCTS.find(p => p.id === id)!.name + ' added to your basket.');
  };
  const updateQuantity = (id: string, amount: number) => setCart(lines => normalizeCart(lines.map(line => line.productId === id ? { ...line, quantity: Math.max(0, Math.min(99, line.quantity + amount)) } : line).filter(line => line.quantity > 0)));
  const toggleFullscreen = async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await dialog.current?.requestFullscreen(); } catch { setNotice('Fullscreen is unavailable in this browser. The showroom remains usable here.'); }
  };
  return <dialog ref={dialog} className="boutique-dialog" aria-label="Sandy virtual grooming boutique" data-lenis-prevent onCancel={event => {
    event.preventDefault(); if (selected) closeProduct(); else if (cartOpen) setCartOpen(false); else onClose();
  }}>
    <div className="boutique-shell">
      {view === 'scene' && !failed && <SceneBoundary key={attempt} onFailure={failure}><Suspense fallback={null}><VirtualShowroom category={category} command={command} free={mode === 'free' && !selected && !cartOpen} reduced={reduced} lowQuality={attempt > 0 || window.innerWidth < 768}
        onAdd={(id, origin) => addToBasket(id, 1, origin)} onSelect={chooseProduct} onHover={hoverProduct} onReady={sceneReady} onFailure={failure} onTourStop={goStop} /></Suspense></SceneBoundary>}
      {view === 'scene' && !ready && !failed && <div className="boutique-loading" role="status"><strong>SANDY</strong><span>{slow ? 'STILL LOADING — YOU CAN BROWSE PRODUCTS WHILE YOU WAIT' : 'PREPARING YOUR EXPERIENCE'}</span><i /><button onClick={() => setView('list')}>Browse the product list</button>{slow && <button onClick={startScene}>Retry in lightweight 3D</button>}</div>}
      <div className="boutique-top-controls"><button className="boutique-pill" onClick={onClose}><X size={17} /> Exit showroom</button>
        <div><button className="boutique-pill" onClick={() => { if (view === 'list') startScene(); else { setSelected(null); setCartOpen(false); setView('list'); setReady(false); } }}><List size={17} /> {view === 'scene' ? 'Product list' : failed ? 'Retry 3D' : 'Return to 3D'}</button>
        <button data-basket-target className="boutique-pill" onClick={() => { if (selected) closeProduct(); setCartOpen(!cartOpen); }} aria-expanded={cartOpen}><ShoppingBag size={17} /> Basket <span className="boutique-count">{count}</span></button></div></div>
      <nav className="boutique-categories" aria-label="Product categories">{categories.map(c => { const Icon = ICONS[c]; return <button key={c} aria-pressed={category === c} onClick={() => changeCategory(c)}><Icon size={22} strokeWidth={1.4} /><span>{CATEGORY_LABELS[c]}</span></button>; })}</nav>
      {view === 'list' && <div className="boutique-list" data-lenis-prevent><span className="boutique-eyebrow">THE VIRTUAL COLLECTION</span><h2>{CATEGORY_LABELS[category]}</h2>
        <p>{failed === 'unsupported' ? 'Your browser could not start WebGL 2. Try another browser or enable graphics acceleration, then choose Retry 3D.' : failed === 'context-lost' ? 'The browser interrupted the 3D graphics session. Choose Retry 3D to reopen a lighter showroom.' : failed === 'load-error' ? 'The showroom could not finish loading. Choose Retry 3D, or refresh the page if the problem continues.' : 'Explore at your own pace. Choose a product for details.'}</p>
        <p className="boutique-concept-label">Curated grooming essentials / Select to discover</p>
        <ul>{visibleProducts.map(p => <li key={p.id}><button className="boutique-card-details" onClick={event => { clearTimeout(productClickTimer.current); if (event.detail === 0) chooseProduct(p.id); else productClickTimer.current = setTimeout(() => chooseProduct(p.id), 340); }} onDoubleClick={event => { clearTimeout(productClickTimer.current); addToBasket(p.id, 1, { x: event.clientX, y: event.clientY }); }}><div className="boutique-card-photo"><img src={p.image} alt={p.name} loading="lazy" decoding="async" /></div><span><small>{CATEGORY_LABELS[p.category]}</small><strong>{p.name}</strong><em>{isOrderable(p) ? formatMoney(p.pricePaise!) : 'Price on request'}</em></span></button><button className="boutique-card-add" aria-label={'Add ' + p.name + ' to basket'} onClick={() => addToBasket(p.id)}><Plus size={17} /> Add to basket</button></li>)}</ul>
      </div>}
      {view === 'scene' && ready && <>
        <div className="boutique-scene-label"><span>THE SANDY COLLECTION</span><strong>{CATEGORY_LABELS[category]}</strong><small>SELECT A PRODUCT / BUILD YOUR ROUTINE</small></div>
        {hover && !selected && !cartOpen && <div className="boutique-tooltip" role="status">{SHOWROOM_PRODUCTS.find(p => p.id === hover)?.name}<span>Double-click to add / Click to explore ↗</span></div>}
        <div className="boutique-bottom-controls"><div className="boutique-instructions">Drag to look around<br /><span>{mode === 'free' ? 'Tap the floor to move · W A S D on desktop' : 'Choose a tour stop or select a product'}</span></div>
          <div className="boutique-navigation"><div className="boutique-mode"><button aria-pressed={mode === 'tour'} onClick={() => { setMode('tour'); goStop(stop); }}>Guided tour</button><button aria-pressed={mode === 'free'} onClick={() => setMode('free')}>Free explore</button></div>
          {mode === 'tour' ? <div className="boutique-tour"><button aria-label="Previous tour stop" onClick={() => goStop(stop - 1)}><ChevronLeft size={20} /></button><span><small>0{stop + 1} / 05</small>{TOUR_STOPS[stop].label}</span><button aria-label="Next tour stop" onClick={() => goStop(stop + 1)}><ChevronRight size={20} /></button></div> : <div className="boutique-move"><button aria-label="Turn left" onClick={() => issue({ turn: .35 })}><ArrowLeft size={19} /></button><button aria-label="Move forward" onClick={() => issue({ move: 1.1 })}><ArrowUp size={19} /></button><button aria-label="Move backward" onClick={() => issue({ move: -1.1 })}><ArrowDown size={19} /></button><button aria-label="Turn right" onClick={() => issue({ turn: -.35 })}><ArrowRight size={19} /></button></div>}</div>
          <div className="boutique-utilities"><button aria-label="Zoom showroom in" title="Zoom in" onClick={() => issue({ zoom: -8 })}><Plus size={19} /></button><button aria-label="Zoom showroom out" title="Zoom out" onClick={() => issue({ zoom: 8 })}><Minus size={19} /></button><button aria-label="Reset camera" title="Reset camera" onClick={() => goStop(0)}><RotateCcw size={19} /></button>{document.fullscreenEnabled && <button aria-label={full ? 'Exit fullscreen' : 'Enter fullscreen'} onClick={toggleFullscreen}><Expand size={19} /></button>}</div>
        </div>
      </>}
      {product && <section className="boutique-panel" ref={panel} tabIndex={-1} aria-label={`${product.name} details`} data-lenis-prevent onKeyDown={event => { if (!event.defaultPrevented && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) { event.preventDefault(); browseProduct(event.key === 'ArrowRight' ? 1 : -1); } }}>
        <button className="boutique-panel-back" onClick={closeProduct}><ArrowLeft size={17} /> Back to showroom</button>
        <div key={product.id} className="boutique-product-transition">
        <button className="boutique-image-button" onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); browseProduct(event.key === 'ArrowRight' ? 1 : -1); } }} onTouchStart={event => { const t = event.touches[0]; swipeStart.current = { x: t.clientX, y: t.clientY }; }} onTouchEnd={event => { const start = swipeStart.current; swipeStart.current = null; if (!start) return; const t = event.changedTouches[0], dx = t.clientX - start.x, dy = t.clientY - start.y; if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3) { swipeNavigation.current = performance.now(); browseProduct(dx < 0 ? 1 : -1); } }} onClick={event => { if (performance.now() - swipeNavigation.current < 450) return; clearTimeout(productClickTimer.current); if (event.detail === 0) setImageZoom(true); else productClickTimer.current = setTimeout(() => setImageZoom(true), 340); }} onDoubleClick={event => { clearTimeout(productClickTimer.current); addToBasket(product.id, 1, { x: event.clientX, y: event.clientY }); }} aria-label={`Enlarge ${product.name} image`}><img className="boutique-detail-image" src={product.image} alt={product.name} decoding="async" /><span><Expand size={15} /> View close-up</span></button>
        <p className="boutique-browse-hint">Scroll over the product to explore / Swipe or use arrow keys</p>
        <div className="boutique-product-pager"><button aria-label="Previous product" onClick={() => browseProduct(-1)}><ChevronLeft size={18} /></button><span>{visibleProducts.findIndex(p => p.id === product.id) + 1} / {visibleProducts.length} PRODUCTS</span><button aria-label="Next product" onClick={() => browseProduct(1)}><ChevronRight size={18} /></button></div>
        <span className="boutique-eyebrow">{CATEGORY_LABELS[product.category]} / THE COLLECTION</span><h2>{product.name}</h2><p>{product.description}</p>
        {product.size && <p>Size: {product.size}</p>}
        <div className="boutique-product-status">{isOrderable(product) ? <><strong>{formatMoney(product.pricePaise!)}</strong><span>Available</span></> : <><strong>Enquiry only</strong><span>Price and availability awaiting salon confirmation.</span></>}</div>
        {product.demo && <p className="boutique-concept-label">AI-created product presentation. Ask the salon for the available brand and specifications.</p>}
        <div className="boutique-quantity"><button aria-label="Decrease selected quantity" disabled={quantity <= 1} onClick={() => setQuantity(q => q - 1)}><Minus size={17} /></button><output aria-label="Selected quantity">{quantity}</output><button aria-label="Increase selected quantity" disabled={quantity >= 99} onClick={() => setQuantity(q => q + 1)}><Plus size={17} /></button><span className="boutique-quantity-label">Quantity</span></div>
        <button className="boutique-primary" onClick={() => addToBasket(product.id, quantity)}><ShoppingBag size={17} /> Add to basket</button>
        <p className="boutique-basket-hint">Save your favourites. Confirm products and pricing with our team.</p></div>
      </section>}
      {imageZoom && product && <ProductImageZoom product={product} onClose={() => setImageZoom(false)} />}
      {cartOpen && <section className="boutique-panel boutique-cart" ref={panel} tabIndex={-1} aria-label="Your grooming basket" data-lenis-prevent>
        <div className="boutique-panel-title"><h2>Your basket ({count})</h2><button aria-label="Close basket" onClick={() => setCartOpen(false)}><X size={20} /></button></div>
        {cart.length ? <><ul>{cart.map(line => { const p = SHOWROOM_PRODUCTS.find(p => p.id === line.productId)!; return <li key={p.id}><img src={p.image} alt={p.name} /><div><strong>{p.name}</strong><span>{isOrderable(p) ? formatMoney(p.pricePaise!) : 'Price on request'}</span><div className="boutique-quantity"><button aria-label={`Decrease ${p.name} quantity`} onClick={() => updateQuantity(p.id, -1)}><Minus size={14} /></button><output>{line.quantity}</output><button aria-label={`Increase ${p.name} quantity`} disabled={line.quantity >= 99} onClick={() => updateQuantity(p.id, 1)}><Plus size={14} /></button><button aria-label={`Remove ${p.name}`} onClick={() => setCart(lines => lines.filter(l => l.productId !== p.id))}><X size={14} /></button></div></div></li>; })}</ul>
        <div className="boutique-subtotal"><span>{count} selected {count === 1 ? 'item' : 'items'}</span><strong>{cart.every(line => isOrderable(SHOWROOM_PRODUCTS.find(p => p.id === line.productId)!)) ? formatMoney(cartSubtotal(cart)) : 'Quote on request'}</strong></div>
        {orderUrl ? <a className="boutique-primary" href={orderUrl} target="_blank" rel="noreferrer">Enquire on WhatsApp <ArrowRight size={17} /></a> : <p className="boutique-concept-label">Your basket is saved for this visit. Show it to our salon team to confirm products and pricing.</p>}
        <button className="boutique-text-button" onClick={() => setCart([])}>Clear basket</button></> : <div className="boutique-cart-empty"><ShoppingBag size={40} strokeWidth={1} /><h3>Your routine starts here.</h3><p>Choose the essentials you love. Add products from the shelves or explore the collection.</p><button className="boutique-primary" onClick={() => { setCartOpen(false); setView('list'); }}>Explore the collection <ArrowRight size={17} /></button></div>}
      </section>}
      {!cartOpen && !selected && <button ref={basketTarget} className="boutique-mini-basket" onClick={() => setCartOpen(true)} aria-label={'Open basket, ' + count + ' items'}><span className="boutique-mini-icon"><ShoppingBag size={22} /><b>{count}</b></span><span><strong>Your grooming basket</strong><small>{count ? count + ' items selected' : 'Your favourites, all together'}</small></span><span className="boutique-mini-thumbs">{cart.slice(0, 3).map(line => <img key={line.productId} src={SHOWROOM_PRODUCTS.find(p => p.id === line.productId)!.image} alt="" />)}</span><ChevronRight size={17} /></button>}
      {flights.map(flight => <BasketFlight key={flight.key} image={SHOWROOM_PRODUCTS.find(p => p.id === flight.id)!.image} origin={flight.origin} target={() => basketTarget.current || dialog.current?.querySelector('[data-basket-target]') as HTMLElement | null} reduced={reduced} onDone={() => setFlights(previous => previous.filter(item => item.key !== flight.key))} />)}
      <div className="boutique-announcement" role="status" aria-live="polite">{notice && <><Check size={15} />{notice}<button aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={15} /></button></>}</div>
    </div>
  </dialog>;
}

function ProductImageZoom({ product, onClose }: { product: typeof SHOWROOM_PRODUCTS[number]; onClose: () => void }) {
  const [zoom, setZoom] = useState(1);
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const previous = document.activeElement as HTMLElement; const element = ref.current!; element.showModal(); return () => { element.close(); previous?.isConnected && previous.focus(); }; }, []);
  return <dialog ref={ref} className="boutique-zoom" aria-label={`${product.name} close-up`} onCancel={event => { event.preventDefault(); event.stopPropagation(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <button className="boutique-zoom-close" onClick={onClose} aria-label="Close product close-up"><X size={23} /></button>
    <div className="boutique-zoom-tools"><button aria-label="Zoom out" disabled={zoom <= 1} onClick={() => setZoom(z => Math.max(1, z - .5))}><Minus size={18} /></button><output>{Math.round(zoom * 100)}%</output><button aria-label="Zoom in" disabled={zoom >= 3} onClick={() => setZoom(z => Math.min(3, z + .5))}><Plus size={18} /></button><button onClick={() => setZoom(1)}>Reset</button></div>
    <figure><div className="boutique-zoom-viewport"><img src={product.imageFull || product.image} alt={product.name + ', high-resolution close-up'} style={{ width: 500 * zoom, maxWidth: 'none', height: 'auto' }} /></div><figcaption><strong>{product.name}</strong><span>AI-created collection imagery / Scroll to explore the close-up</span></figcaption></figure>
  </dialog>;
}

function BasketFlight({ image, origin, target, reduced, onDone }: { image: string; origin: { x: number; y: number }; target: () => HTMLElement | null; reduced: boolean; onDone: () => void }) {
  const ref = useRef<HTMLImageElement>(null);
  const done = useRef(onDone); done.current = onDone;
  useEffect(() => {
    const element = ref.current!, basket = target();
    if (!basket) { done.current(); return; }
    const bounds = basket.getBoundingClientRect();
    const dx = bounds.x + Math.min(38, bounds.width / 2) - origin.x;
    const dy = bounds.y + bounds.height / 2 - origin.y;
    const animation = element.animate(reduced ? [{ opacity: .8 }, { opacity: 0 }] : [
      { transform: 'translate(-50%, -50%) scale(1) rotate(-8deg)', opacity: 1, offset: 0 },
      { transform: 'translate(calc(-50% + ' + dx * .4 + 'px), calc(-50% + ' + (dy * .3 - 100) + 'px)) scale(1.15) rotate(8deg)', opacity: 1, offset: .42 },
      { transform: 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px)) scale(.15) rotate(0deg)', opacity: .1, offset: 1 },
    ], { duration: reduced ? 120 : 760, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' });
    animation.onfinish = () => {
      basket.animate(reduced ? [{ opacity: .65 }, { opacity: 1 }] : [{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(5px) scale(.96)', offset: .35 }, { transform: 'translateY(-3px) scale(1.035)', offset: .7 }, { transform: 'translateY(0) scale(1)' }], { duration: reduced ? 120 : 380, easing: 'ease-out' });
      done.current();
    };
    return () => animation.cancel();
  }, []);
  return <img ref={ref} src={image} alt="" aria-hidden="true" className="boutique-basket-flight" style={{ left: origin.x, top: origin.y }} />;
}
