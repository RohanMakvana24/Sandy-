# Salon launch configuration

Create .env.local using .env.example. Set VITE_SALON_PHONE and VITE_SALON_WHATSAPP to owner-approved international numbers (for example +91 followed by the ten-digit mobile number). Restart the dev server after changing environment values and rebuild for production. Both appointment and wedding requests share this contact configuration. Empty contacts hide Call/WhatsApp quick actions and disable online requests.

Confirm the address, landmark, Instagram, email and weekday/weekend hours in src/utils/contactConfig.ts with the salon owner. Update index.html structured address if the location changes. Existing contact details other than the removed placeholder phone still need owner approval.

Add approved startingPriceINR and durationMinutes to services in src/utils/servicesKinematics.ts. Until supplied, the page asks customers to confirm price/duration with the salon.

Replace sample reviews in src/utils/reviewSamples.ts with approved customer reviews. Production deliberately defaults to no sample reviews; supply genuine reviews through TestimonialsSection's testimonials prop. Development keeps the clearly disclosed design preview.

The share image is public/salon-share.png. When the production domain is known, use its absolute URL in og:image and twitter:image, and add canonical/og:url metadata in index.html. No production domain has been assumed.

Validation: npm test, npm run lint, npm run build. For a production smoke test: npm run preview -- --port 4173.

Showroom update: all eight collection previews can now be saved to a session basket, even while pricing is pending. Generated transparent packshots and originals live in public/assets/showroom/products; prompt provenance is in scripts/showroom-product-prompts.json. Approve product names, depicted pack sizes, real stock and pricing before launch. The basket is an inquiry list, not a confirmed purchase.
