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
  isSignedUp?: boolean;
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

export const events: VolunteerEvent[] = [
  {
    id: "1",
    title: "Food Bank Saturday",
    organization: "Community Cares Food",
    location: "Evansville, IN",
    date: "2026-02-28",
    time: "9:00 AM - 1:00 PM",
    spotsLeft: 8,
    totalSpots: 20,
    category: "Food & Hunger",
    matchPercent: 95,
    distance: "2.3 mi",
    image: "🥫",
    description: "Help sort and distribute food to families in need at the community food bank.",
    lat: 37.9716,
    lng: -87.5711,
    isSignedUp: true,
  },
  {
    id: "2",
    title: "Park Cleanup Day",
    organization: "Green Evansville",
    location: "Evansville, IN",
    date: "2026-03-01",
    time: "8:00 AM - 12:00 PM",
    spotsLeft: 15,
    totalSpots: 30,
    category: "Environment",
    matchPercent: 88,
    distance: "1.1 mi",
    image: "🌳",
    description: "Join us for a community park cleanup. Supplies provided.",
    lat: 37.9748,
    lng: -87.5580,
  },
  {
    id: "3",
    title: "Habitat for Humanity",
    organization: "Habitat for Humanity",
    location: "Evansville, IN",
    date: "2026-03-05",
    time: "7:00 AM - 3:00 PM",
    spotsLeft: 5,
    totalSpots: 15,
    category: "Housing",
    matchPercent: 91,
    distance: "2.5 mi",
    image: "🏠",
    description: "Help build affordable housing for families in need.",
    lat: 37.9690,
    lng: -87.5550,
  },
  {
    id: "4",
    title: "Animal Shelter",
    organization: "Vanderburgh Humane Society",
    location: "Evansville, IN",
    date: "2026-03-07",
    time: "10:00 AM - 2:00 PM",
    spotsLeft: 10,
    totalSpots: 12,
    category: "Animals",
    matchPercent: 83,
    distance: "3.0 mi",
    image: "🐕",
    description: "Walk dogs, socialize cats, and help with shelter maintenance.",
    lat: 37.9820,
    lng: -87.5450,
  },
  {
    id: "5",
    title: "Youth Mentoring",
    organization: "Big Brothers Big Sisters",
    location: "Evansville, IN",
    date: "2026-03-10",
    time: "3:00 PM - 5:00 PM",
    spotsLeft: 3,
    totalSpots: 10,
    category: "Education",
    matchPercent: 76,
    distance: "5.6 mi",
    image: "📚",
    description: "Mentor local youth through academic and personal development activities.",
    lat: 37.9650,
    lng: -87.5800,
  },
  {
    id: "6",
    title: "Senior Center Visit",
    organization: "Evansville Senior Care",
    location: "Evansville, IN",
    date: "2026-03-12",
    time: "1:00 PM - 4:00 PM",
    spotsLeft: 12,
    totalSpots: 20,
    category: "Elderly Care",
    matchPercent: 80,
    distance: "4.2 mi",
    image: "🤝",
    description: "Spend time with seniors - play games, read, or just have a chat.",
    lat: 37.9780,
    lng: -87.5620,
  },
  {
    id: "7",
    title: "River Cleanup",
    organization: "Ohio River Foundation",
    location: "Evansville, IN",
    date: "2026-03-15",
    time: "8:00 AM - 11:00 AM",
    spotsLeft: 20,
    totalSpots: 40,
    category: "Environment",
    matchPercent: 85,
    distance: "3.8 mi",
    image: "🌊",
    description: "Help clean up the Ohio River banks and protect local wildlife.",
    lat: 37.9600,
    lng: -87.5900,
  },
  {
    id: "8",
    title: "Literacy Workshop",
    organization: "Read to Succeed",
    location: "Evansville, IN",
    date: "2026-03-18",
    time: "4:00 PM - 6:00 PM",
    spotsLeft: 6,
    totalSpots: 8,
    category: "Education",
    matchPercent: 72,
    distance: "2.1 mi",
    image: "📖",
    description: "Help children improve their reading skills through fun activities.",
    lat: 37.9730,
    lng: -87.5680,
  },
];

export const badges: Badge[] = [
  { id: "1", name: "First Time", icon: "🎯", color: "#2D8CFF", earned: true, verified: true },
  { id: "2", name: "Habitat Build", subtitle: "Community Star", icon: "🏠", color: "#FF8C42", earned: true, verified: true },
  { id: "3", name: "Youth Mentoring", icon: "📚", color: "#E74C3C", earned: true, verified: false },
  { id: "4", name: "Animal Shelter", icon: "🐕", color: "#27AE60", earned: true, verified: true },
  { id: "5", name: "Food Drive Hero", icon: "🥫", color: "#F39C12", earned: false, verified: false },
  { id: "6", name: "100 Hour Club", icon: "⭐", color: "#6C5CE7", earned: false, verified: false },
];

export const volunteerStats: VolunteerStats = {
  totalHours: 47.5,
  sessions: 12,
  impactPoints: 1188,
  monthlyHours: [
    { month: "Jul", hours: 6 },
    { month: "Aug", hours: 8 },
    { month: "Sep", hours: 5 },
    { month: "Oct", hours: 10 },
    { month: "Nov", hours: 7 },
    { month: "Dec", hours: 4 },
    { month: "Jan", hours: 3 },
    { month: "Feb", hours: 4.5 },
  ],
};

export const milestones: Milestone[] = [
  { label: "First Volunteer Session", progress: 100, icon: "🎯" },
  { label: "10 Hours Volunteered", progress: 100, icon: "⏰" },
  { label: "25 Hours Volunteered", progress: 100, icon: "🏅" },
  { label: "50 Hours Volunteered", progress: 95, icon: "🏆" },
  { label: "Community Leader", progress: 60, icon: "👑" },
  { label: "100 Hour Club", progress: 47, icon: "⭐" },
];

export const categories = [
  "All",
  "Food & Hunger",
  "Environment",
  "Housing",
  "Animals",
  "Education",
  "Elderly Care",
];
