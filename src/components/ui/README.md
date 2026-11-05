# Shared UI components

The existing project already supports React, TypeScript and Tailwind CSS 4. No CLI reset or framework scaffolding is needed. Reusable primitives live in `src/components/ui`; global styles stay in `src/index.css`, with component-specific styles adjacent to the component. This keeps the supplied testimonials-6, Avatar and InfiniteSlider pattern reusable.

The existing `@/` alias points at the repository root, not `src`. Relative imports here preserve existing aliases elsewhere. `src/lib/utils.ts` supplies clsx/tailwind-merge `cn`. Avatar uses the supplied Radix primitive. InfiniteSlider uses measured native Web Animations and supports direction, hover speed, reversal, focus pause, offscreen/tab suspension, reduced motion and cleanup.

The original TestimonialsSection import re-exports testimonials-6, retaining `#testimonials`, data overrides and the booking callback. All items are redistributed across three desktop/two tablet/one mobile columns. View all shows one static copy of every review. Animation clones are aria-hidden and inert.

`src/utils/reviewSamples.ts` contains 50 fictional sample reviews, labelled on every card and in a section disclosure. They are not verified endorsements or Google reviews. Replace with approved quotations, attribution, ratings and permitted portraits before publication. Stock portraits are illustrative, not photographs of the depicted reviewers.
