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
const STORAGE = 'sandy-showroom-cart-v1';
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
    <p className="boutique-demo-note">Virtual concept collection. Official products, prices and availability will be confirmed by the salon.</p>
    {open && createPortal(<ShowroomDialog listFirst={listFirst} cart={cart} setCart={setCart} onClose={() => setOpen(false)} />, document.body)}
  </section>;
}

function ShowroomDialog({ listFirst, cart, setCart, onClose }: { listFirst: boolean; cart: CartLine[]; setCart: React.Dispatch<React.SetStateAction<CartLine[]>>; onClose: () => void }) {
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
  const [reduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const issue = useCallback((next: Omit<CameraCommand, 'serial'>) => setCommand(previous => ({ ...next, serial: previous.serial + 1 })), []);
  const failure = useCallback((reason: ShowroomFailure) => { setFailed(reason); setReady(false); setView('list'); }, []);
  const sceneReady = useCallback(() => { setReady(true); setSlow(false); }, []);
  const startScene = () => { setSelected(null); setCartOpen(false); setFailed(null); setReady(false); setSlow(false); setAttempt(value => value + 1); issue({ stop }); setView('scene'); };
  const hoverProduct = useCallback((id: string | null) => setHover(previous => previous === id ? previous : id), []);
  const chooseProduct = useCallback((id: string) => {
    lastProductTrigger.current = document.activeElement as HTMLElement;
    setCategory(current => current === 'all' || SHOWROOM_PRODUCTS.find(p => p.id === id)?.category === current ? current : 'all');
    setSelected(id); setQuantity(1); setCartOpen(false); setHover(null); issue({ productId: id });
  }, [issue]);
  const closeProduct = () => { setSelected(null); issue({ restore: true }); requestAnimationFrame(() => lastProductTrigger.current?.isConnected && lastProductTrigger.current.focus()); };
  const product = SHOWROOM_PRODUCTS.find(p => p.id === selected);
  const visibleProducts = SHOWROOM_PRODUCTS.filter(p => category === 'all' || p.category === category);
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
  useEffect(() => { if (selected || cartOpen) panel.current?.focus(); }, [selected, cartOpen]);
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
  const updateQuantity = (id: string, amount: number) => setCart(lines => normalizeCart(lines.map(line => line.productId === id ? { ...line, quantity: Math.max(0, Math.min(99, line.quantity + amount)) } : line).filter(line => line.quantity > 0)));
  const toggleFullscreen = async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await dialog.current?.requestFullscreen(); } catch { setNotice('Fullscreen is unavailable in this browser. The showroom remains usable here.'); }
  };
  return <dialog ref={dialog} className="boutique-dialog" aria-label="Sandy virtual grooming boutique" data-lenis-prevent onCancel={event => {
    event.preventDefault(); if (selected) closeProduct(); else if (cartOpen) setCartOpen(false); else onClose();
  }}>
    <div className="boutique-shell">
      {view === 'scene' && !failed && <SceneBoundary key={attempt} onFailure={failure}><Suspense fallback={null}><VirtualShowroom category={category} command={command} free={mode === 'free' && !selected && !cartOpen} reduced={reduced} lowQuality={attempt > 0 || window.innerWidth < 768}
        onSelect={chooseProduct} onHover={hoverProduct} onReady={sceneReady} onFailure={failure} onTourStop={goStop} /></Suspense></SceneBoundary>}
      {view === 'scene' && !ready && !failed && <div className="boutique-loading" role="status"><strong>SANDY</strong><span>{slow ? 'STILL LOADING — YOU CAN BROWSE PRODUCTS WHILE YOU WAIT' : 'PREPARING YOUR EXPERIENCE'}</span><i /><button onClick={() => setView('list')}>Browse the product list</button>{slow && <button onClick={startScene}>Retry in lightweight 3D</button>}</div>}
      <div className="boutique-top-controls"><button className="boutique-pill" onClick={onClose}><X size={17} /> Exit showroom</button>
        <div><button className="boutique-pill" onClick={() => { if (view === 'list') startScene(); else { setSelected(null); setCartOpen(false); setView('list'); setReady(false); } }}><List size={17} /> {view === 'scene' ? 'Product list' : failed ? 'Retry 3D' : 'Return to 3D'}</button>
        <button className="boutique-pill" onClick={() => { if (selected) closeProduct(); setCartOpen(!cartOpen); }} aria-expanded={cartOpen}><ShoppingBag size={17} /> Cart <span className="boutique-count">{count}</span></button></div></div>
      <nav className="boutique-categories" aria-label="Product categories">{categories.map(c => { const Icon = ICONS[c]; return <button key={c} aria-pressed={category === c} onClick={() => changeCategory(c)}><Icon size={22} strokeWidth={1.4} /><span>{CATEGORY_LABELS[c]}</span></button>; })}</nav>
      {view === 'list' && <div className="boutique-list" data-lenis-prevent><span className="boutique-eyebrow">THE VIRTUAL COLLECTION</span><h2>{CATEGORY_LABELS[category]}</h2>
        <p>{failed === 'unsupported' ? 'Your browser could not start WebGL 2. Try another browser or enable graphics acceleration, then choose Retry 3D.' : failed === 'context-lost' ? 'The browser interrupted the 3D graphics session. Choose Retry 3D to reopen a lighter showroom.' : failed === 'load-error' ? 'The showroom could not finish loading. Choose Retry 3D, or refresh the page if the problem continues.' : 'Explore at your own pace. Choose a product for details.'}</p>
        <p className="boutique-concept-label">Concept packaging · Official catalogue pending</p>
        <ul>{visibleProducts.map(p => <li key={p.id}><button onClick={() => chooseProduct(p.id)}><img src={p.image} alt={`${p.name}, concept packaging`} /><span><small>{CATEGORY_LABELS[p.category]}</small><strong>{p.name}</strong><em>{isOrderable(p) ? formatMoney(p.pricePaise!) : 'Details awaiting confirmation'}</em></span><ArrowRight size={18} /></button></li>)}</ul>
      </div>}
      {view === 'scene' && ready && <>
        <div className="boutique-scene-label"><span>THE SANDY COLLECTION</span><strong>{CATEGORY_LABELS[category]}</strong><small>Virtual concept showroom</small></div>
        {hover && !selected && !cartOpen && <div className="boutique-tooltip" role="status">{SHOWROOM_PRODUCTS.find(p => p.id === hover)?.name}<span>Select to explore ↗</span></div>}
        <div className="boutique-bottom-controls"><div className="boutique-instructions">Drag to look around<br /><span>{mode === 'free' ? 'Tap the floor to move · W A S D on desktop' : 'Choose a tour stop or select a product'}</span></div>
          <div className="boutique-navigation"><div className="boutique-mode"><button aria-pressed={mode === 'tour'} onClick={() => { setMode('tour'); goStop(stop); }}>Guided tour</button><button aria-pressed={mode === 'free'} onClick={() => setMode('free')}>Free explore</button></div>
          {mode === 'tour' ? <div className="boutique-tour"><button aria-label="Previous tour stop" onClick={() => goStop(stop - 1)}><ChevronLeft size={20} /></button><span><small>0{stop + 1} / 05</small>{TOUR_STOPS[stop].label}</span><button aria-label="Next tour stop" onClick={() => goStop(stop + 1)}><ChevronRight size={20} /></button></div> : <div className="boutique-move"><button aria-label="Turn left" onClick={() => issue({ turn: .35 })}><ArrowLeft size={19} /></button><button aria-label="Move forward" onClick={() => issue({ move: 1.1 })}><ArrowUp size={19} /></button><button aria-label="Move backward" onClick={() => issue({ move: -1.1 })}><ArrowDown size={19} /></button><button aria-label="Turn right" onClick={() => issue({ turn: -.35 })}><ArrowRight size={19} /></button></div>}</div>
          <div className="boutique-utilities"><button aria-label="Reset camera" title="Reset camera" onClick={() => goStop(0)}><RotateCcw size={19} /></button>{document.fullscreenEnabled && <button aria-label={full ? 'Exit fullscreen' : 'Enter fullscreen'} onClick={toggleFullscreen}><Expand size={19} /></button>}</div>
        </div>
      </>}
      {product && <section className="boutique-panel" ref={panel} tabIndex={-1} aria-label={`${product.name} details`} data-lenis-prevent>
        <button className="boutique-panel-back" onClick={closeProduct}><ArrowLeft size={17} /> Back to showroom</button>
        <button className="boutique-image-button" onClick={() => setImageZoom(true)} aria-label={`Enlarge ${product.name} image`}><img className="boutique-detail-image" src={product.image} alt={`${product.name}, concept packaging`} /><span><Expand size={15} /> View close-up</span></button>
        <div className="boutique-product-pager"><button aria-label="Previous product" onClick={() => { const index = visibleProducts.findIndex(p => p.id === product.id); chooseProduct(visibleProducts[(index - 1 + visibleProducts.length) % visibleProducts.length].id); }}><ChevronLeft size={18} /></button><span>{visibleProducts.findIndex(p => p.id === product.id) + 1} / {visibleProducts.length} PRODUCTS</span><button aria-label="Next product" onClick={() => { const index = visibleProducts.findIndex(p => p.id === product.id); chooseProduct(visibleProducts[(index + 1) % visibleProducts.length].id); }}><ChevronRight size={18} /></button></div>
        <span className="boutique-eyebrow">{CATEGORY_LABELS[product.category]} / {product.demo ? 'CONCEPT PREVIEW' : 'THE COLLECTION'}</span><h2>{product.name}</h2><p>{product.description}</p>
        {product.size && <p>Size: {product.size}</p>}
        <div className="boutique-product-status">{isOrderable(product) ? <><strong>{formatMoney(product.pricePaise!)}</strong><span>Available</span></> : <><strong>Enquiry only</strong><span>Price and availability awaiting salon confirmation.</span></>}</div>
        {product.demo && <p className="boutique-concept-label">Generic concept packaging. This product is not confirmed as sold by Sandy Men's Salon.</p>}
        {isOrderable(product) ? <><div className="boutique-quantity"><button aria-label="Decrease selected quantity" disabled={quantity <= 1} onClick={() => setQuantity(q => q - 1)}><Minus size={17} /></button><output aria-label="Selected quantity">{quantity}</output><button aria-label="Increase selected quantity" disabled={quantity >= 99} onClick={() => setQuantity(q => q + 1)}><Plus size={17} /></button></div>
          <button className="boutique-primary" onClick={() => { setCart(lines => normalizeCart([...lines, { productId: product.id, quantity }])); setNotice(`${product.name} added to cart.`); }}><Plus size={17} /> Add to cart</button></> : <button className="boutique-primary" disabled>Official catalogue coming soon</button>}
      </section>}
      {imageZoom && product && <ProductImageZoom product={product} onClose={() => setImageZoom(false)} />}
      {cartOpen && <section className="boutique-panel boutique-cart" ref={panel} tabIndex={-1} aria-label="Your shopping cart" data-lenis-prevent>
        <div className="boutique-panel-title"><h2>Your cart ({count})</h2><button aria-label="Close cart" onClick={() => setCartOpen(false)}><X size={20} /></button></div>
        {cart.length ? <><ul>{cart.map(line => { const p = SHOWROOM_PRODUCTS.find(p => p.id === line.productId)!; return <li key={p.id}><img src={p.image} alt={p.name} /><div><strong>{p.name}</strong><span>{formatMoney(p.pricePaise!)}</span><div className="boutique-quantity"><button aria-label={`Decrease ${p.name} quantity`} onClick={() => updateQuantity(p.id, -1)}><Minus size={14} /></button><output>{line.quantity}</output><button aria-label={`Increase ${p.name} quantity`} disabled={line.quantity >= 99} onClick={() => updateQuantity(p.id, 1)}><Plus size={14} /></button><button aria-label={`Remove ${p.name}`} onClick={() => setCart(lines => lines.filter(l => l.productId !== p.id))}><X size={14} /></button></div></div></li>; })}</ul>
        <div className="boutique-subtotal"><span>Subtotal</span><strong>{formatMoney(cartSubtotal(cart))}</strong></div>
        {orderUrl ? <a className="boutique-primary" href={orderUrl} target="_blank" rel="noreferrer">Enquire on WhatsApp <ArrowRight size={17} /></a> : <p className="boutique-concept-label">Order enquiries will be available after the salon confirms its official contact. Online payment is not available.</p>}
        <button className="boutique-text-button" onClick={() => setCart([])}>Clear cart</button></> : <div className="boutique-cart-empty"><ShoppingBag size={40} strokeWidth={1} /><h3>Your routine starts here.</h3><p>The official product catalogue is being prepared. Preview the collection and return when products are available.</p><button className="boutique-primary" onClick={() => { setCartOpen(false); setView('list'); }}>Explore the collection <ArrowRight size={17} /></button></div>}
      </section>}
      <div className="boutique-announcement" role="status" aria-live="polite">{notice && <><Check size={15} />{notice}<button aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={15} /></button></>}</div>
    </div>
  </dialog>;
}

function ProductImageZoom({ product, onClose }: { product: typeof SHOWROOM_PRODUCTS[number]; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const previous = document.activeElement as HTMLElement; const element = ref.current!; element.showModal(); return () => { element.close(); previous?.isConnected && previous.focus(); }; }, []);
  return <dialog ref={ref} className="boutique-zoom" aria-label={`${product.name} close-up`} onCancel={event => { event.preventDefault(); event.stopPropagation(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <button className="boutique-zoom-close" onClick={onClose} aria-label="Close product close-up"><X size={23} /></button>
    <figure><img src={product.image} alt={`${product.name}, enlarged concept packaging`} /><figcaption><strong>{product.name}</strong><span>Concept packaging · Official product imagery pending</span></figcaption></figure>
  </dialog>;
}
