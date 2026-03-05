export interface VolunteerEvent {
  id: string;
  title: string;
  organization: string;
  location: string;
  date: string;
  time: string;
  spotsLeft: number;
  totalSpots: number;
  category: string;
  matchPercent: number;
  distance: string;
  image: string;
  description: string;
  lat: number;
  lng: number;
}

export interface Badge {
  id: string;
  name: string;
  subtitle?: string;
  icon: string;
  color: string;
  earned: boolean;
  verified: boolean;
}

export interface Milestone {
  label: string;
  progress: number;
  icon: string;
}

export interface VolunteerStats {
  totalHours: number;
  sessions: number;
  impactPoints: number;
  monthlyHours: { month: string; hours: number }[];
}

export interface UserProfile {
  name: string;
  bio: string;
  avatar: string;
  interests: string[];
  availability: string[];
  skills: string[];
  distancePref: number;
  onboardingComplete: boolean;
  totalHours: number;
  impactPoints: number;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  logoUrl: string | null;
  website: string | null;
  verified: boolean;
}

export interface UserPreferences {
  showProfile: boolean;
  showHours: boolean;
  newsletter: boolean;
  notifNewEvents: boolean;
  notifReminders: boolean;
  notifUpdates: boolean;
  notifMessages: boolean;
}

export interface DbEvent {
  id: string;
  organizationId: string;
  organizationName: string;
  title: string;
  description: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  eventDate: string;
  eventTime: string;
  durationHours: number;
  totalSpots: number;
  spotsRemaining: number;
  imageUrl: string | null;
  tags: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
  icon: string;
}
