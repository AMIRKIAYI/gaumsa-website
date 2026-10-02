export type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'leader';
  avatar?: string;
};

export type Message = {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
};

export type Surah = {
  id: number;
  name: string;
  englishName: string;
  revelationType: string;
  verses: number;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
};

export type PrayerTime = {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
};

export type Activity = {
  id: string;
  title: string;
  category: 'mentorship' | 'daawa' | 'education' | 'community' | 'sports' | 'social';
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  coordinator: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  maxParticipants?: number;
  currentParticipants?: number;
};

export type Leader = {
  id: string;
  name: string;
  position: string;
  positionArabic: string;
  description: string;
  image?: string;
  email?: string;
  phone?: string;
  year: string;
  department: string;
  quote?: string;
  order: number;
};