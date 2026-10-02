export type CardTheme = 'yellow' | 'mint' | 'lavender' | 'peach' | 'sky' | 'cream';

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  theme: CardTheme;
  createdAt: string;
  likes?: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}
