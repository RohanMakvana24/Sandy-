# Virtual grooming boutique

`ProductsShowroomSection` is mounted after Our Barbers. It owns the modal, accessible product list, product detail panel and session cart. `VirtualShowroom` is dynamically imported only after Enter; React Three Fiber owns the renderer and demand-driven frame loop. Switching to the list or exiting unmounts the renderer. `buildEnvironment` makes the room with actual Three.js geometry; no panorama or generated background replaces the room.

## Salon configuration required

Edit `src/utils/showroomCatalog.ts`. The default eight products are explicitly labelled concept packaging, have no prices or asserted availability, and cannot be purchased. Replace them with approved product names, descriptions, photographs, volume/size, integer `pricePaise`, `stockStatus: 'available'`, `purchasable: true` and `demo: false` to enable Add to cart. Generic procedural shapes currently support pump bottles, droppers, jars, tubes and sprays. Optional model/texture URLs are reserved catalogue fields; a custom GLB loader must be connected if official models are supplied.

No real catalogue, product models, ingredient data, stock feed, payment backend or verified WhatsApp account was provided. `SHOWROOM_ORDER_CONTACT` therefore stays disabled. Set its `verified` flag and official Indian WhatsApp number only after salon confirmation. WhatsApp generates a draft enquiry; it never sends a message or claims payment/order completion. Cart values are revalidated against the current catalogue on session restore and calculations use integer paise. The current demo experience deliberately has an empty cart rather than invented prices.

## Controls and safety

- Five curated tour stops, Previous/Next and selectable floor rings.
- Free explore: drag/touch to look, tap floor to move, W/A/S/D while the canvas has focus, or use onscreen movement/turn buttons.
- Camera stays at 2.15m eye height, inside conservative room/shelf boundaries, outside a 2.15m island collision circle. Automated paths route around the island. Movement uses substeps so a long frame cannot tunnel through it.
- Categories focus their associated shelves and dim other interactive products without removing geometry. Matching products can be selected in 3D or from the semantic product list.
- Product focus saves/restores the previous view. Native modal dialog traps focus, Escape closes details/cart first, Exit restores the entry button. Reduced motion makes automated viewpoint changes immediate.
- Fullscreen appears only if supported. WebGL initialization errors, context loss and module/scene failures have distinct explanations and an enabled lightweight Retry 3D action. After 30 seconds a slow load offers list browsing and retry without incorrectly claiming the device lacks 3D support.
- Canvas fallback content is deliberately passive. Fiber mounts it as canvas children even in WebGL-capable browsers, so mounting an effect there to report failure incorrectly disables a working scene. Actual context-creation errors are handled by the scene boundary instead.

## Rendering budget

One renderer, lazy initialization, DPR 1 on mobile / lightweight retry and capped 1.5 on desktop, demand rendering, hidden-tab suspension, no postprocessing, one shadow-casting spotlight on desktop. Mobile/lightweight mode disables shadows, antialiasing and the generated environment cubemap. Graphics power preference uses the browser default. Fixed architecture is merged by material, bottles and greenery are instanced. Procedural texture generation is deterministic. GPU geometry/materials/textures and environment targets are disposed on unmount; input and visibility listeners are removed. The Fiber dependency currently emits a Three.Clock deprecation warning with Three r187; this does not affect rendering.

Reference architecture: symmetrical dark room, three illuminated arches per side, olive cabinetry, a stone-topped ribbed circular island, suspended ring light, restrained greenery and terrazzo floor. Shelf rows contain decorative generic bottles; the foreground products and selected shelf products are interactive.

Run `npm run lint`, `npm run build`, and `npx tsx --test src/utils/showroom.test.ts src/utils/navigation.test.ts`.

Validated with 23 passing tests across showroom, navigation, wedding and contact utilities, TypeScript and production build. Browser checks covered live 3D hover/click, product focus/return, tour/free controls, modal exit/unmount, desktop/mobile categories and details, a browser-only priced catalogue fixture for add/quantity/subtotal/remove/clear/session persistence, 320px touch browsing with WebGL disabled, and integration on the existing full website. No runtime errors were observed. Build retains the existing Vite configuration/bundle-size advisories. Performance was checked functionally in desktop Chromium, not benchmarked on physical low-end phones.

Recovery regression checked in PC-sized Chromium: supported WebGL opens normally, a forced context loss reports its specific reason, lightweight retry creates a working new canvas, a held module download remains loading after 30 seconds with accessible list browsing, and disabled WebGL reports the actual unsupported context instead of a generic failure.

Implementation references: https://threejs.org/docs/ and https://r3f.docs.pmnd.rs/ .
