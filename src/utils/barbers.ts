// Replace these explicitly temporary identities with approved staff information.
export const BARBERS = [1, 2, 3, 4].map((displayOrder) => {
  const number = String(displayOrder).padStart(2, '0');
  return {
    id: `artist-${number}`,
    name: `Artist ${number}`,
    role: 'Barber profile coming soon',
    specialties: ['Specialties to be confirmed'],
    experience: 'Details awaiting confirmation',
    portrait: `/barbers/portrait-${number}.webp`,
    frontImage: `/barbers/artist-${number}-front.svg`,
    backImage: `/barbers/artist-${number}-back.svg`,
    strapImage: undefined,
    displayOrder,
  };
});
