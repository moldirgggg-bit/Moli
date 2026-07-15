export interface RSVPResponse {
  name: string;
  phone: string;
  status: 'will_attend' | 'cannot_attend';
  timestamp: string;
}

export const IMAGES = {
  COUPLE_BOUTONNIERE: '/src/assets/images/couple_boutonniere_1784137755907.jpg',
  COUPLE_HANDS_BOUQUET: '/src/assets/images/couple_hands_bouquet_1784137775075.jpg',
  WEDDING_RINGS: '/src/assets/images/wedding_rings_gold_1784137792299.jpg',
};

export const MUSIC_URL = 'https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3'; // Royalty-free beautiful wedding piano track
