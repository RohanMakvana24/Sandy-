# Wedding grooming section

`groom-editorial.webp` is a fictional AI-generated groom portrait, not an
actual customer. Generated with the built-in image_gen tool; prompt and
source provenance are saved in `scripts/wedding-image-prompt.json`.

The section is `src/components/WeddingGrooming.tsx` and is placed before
regular appointment booking. Events, services, crew limit, validation and
WhatsApp draft generation are in `src/utils/weddingConfig.ts`.

Pricing is quote-based. Dates are requests, not live availability or confirmed
reservations. No request is stored, sent automatically, or charged. Customers
review their choices, open WhatsApp, then choose whether to send the message.

The configured destination is the publicly listed Mavdi business phone
`+91 91291 76876`. The salon must confirm that this number accepts WhatsApp
inquiries before launch. Change `WEDDING_CONFIG.whatsappNumber` if needed.
Public phone listing: https://magicpin.in/Rajkot/Mavdi/Restaurant/Sandy-Mens-Salon/store/1b7b515
