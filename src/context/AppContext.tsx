"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { UserProfile, AppNotification, VolunteerEvent } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import {
  getProfile,
  updateProfile as dbUpdateProfile,
} from "@/lib/supabase/queries/profiles";
import {
  getUserSignupIds,
  signUpForEvent,
  cancelSignup,
} from "@/lib/supabase/queries/signups";
import {
  getNotifications,
  markAllNotificationsRead,
  createNotification,
} from "@/lib/supabase/queries/notifications";
import { events as localEvents } from "@/lib/data";

const DEFAULT_PROFILE: UserProfile = {
  name: "Volunteer",
  bio: "Passionate about making a difference in the community.",
  avatar: "🙋",
  interests: ["Food & Hunger", "Environment"],
  availability: [],
  skills: [],
  distancePref: 25,
  onboardingComplete: false,
  totalHours: 0,
  impactPoints: 0,
};

interface AppContextValue {
  // Sign-up state
  signedUpIds: Set<string>;
  toggleSignUp: (id: string, eventTitle?: string) => void;
  isSignedUp: (id: string) => boolean;

  // User profile
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  saveUserProfile: (profile: Partial<UserProfile>) => Promise<void>;

  // Notifications
  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => void;
  addNotification: (n: Omit<AppNotification, "id" | "timestamp" | "read">) => void;

  // Selected event (for detail sheet)
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;

  // Auth
  isAuthenticated: boolean;
  userId: string | null;
  login: () => void;
  logout: () => void;

  // Hydration
  hydrated: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [signedUpIds, setSignedUpIds] = useState<Set<string>>(new Set());
  const [userProfile, setUserProfileState] = useState<UserProfile>(DEFAULT_PROFILE);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Listen to Supabase auth state changes
  useEffect(() => {
    const supabase = createClient();

    // Check current session first
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await handleUserLogin(session.user.id);
      } else {
        // Fall back to localStorage for guests
        loadFromLocalStorage();
      }
      setHydrated(true);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await handleUserLogin(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        setUserId(null);
        setUserProfileState(DEFAULT_PROFILE);
        setSignedUpIds(new Set());
        setNotifications([]);
        loadFromLocalStorage();
      }
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleUserLogin(uid: string) {
    setIsAuthenticated(true);
    setUserId(uid);

    // Load profile
    const profile = await getProfile(uid);
    if (profile) {
      setUserProfileState(profile);
    }

    // Load sign-up IDs
    const ids = await getUserSignupIds(uid);
    setSignedUpIds(new Set(ids));

    // Load notifications
    const notifs = await getNotifications(uid);
    setNotifications(notifs);
  }

  function loadFromLocalStorage() {
    try {
      const storedIds = localStorage.getItem("hh_signedUpIds");
      if (storedIds) setSignedUpIds(new Set(JSON.parse(storedIds)));

      const storedProfile = localStorage.getItem("hh_userProfile");
      if (storedProfile) setUserProfileState(JSON.parse(storedProfile));
    } catch {
      // ignore parse errors
    }
  }

  // Persist to localStorage for guests
  useEffect(() => {
    if (!hydrated || isAuthenticated) return;
    localStorage.setItem("hh_signedUpIds", JSON.stringify([...signedUpIds]));
  }, [signedUpIds, hydrated, isAuthenticated]);

  useEffect(() => {
    if (!hydrated || isAuthenticated) return;
    localStorage.setItem("hh_userProfile", JSON.stringify(userProfile));
  }, [userProfile, hydrated, isAuthenticated]);

  const toggleSignUp = useCallback(
    async (id: string, eventTitle?: string) => {
      // Find title from local events if not provided
      const localEvent = localEvents.find((e) => e.id === id);
      const title = eventTitle ?? localEvent?.title ?? "Event";

      const alreadySignedUp = signedUpIds.has(id);

      if (isAuthenticated && userId) {
        // Optimistic update first
        setSignedUpIds((prev) => {
          const next = new Set(prev);
          alreadySignedUp ? next.delete(id) : next.add(id);
          return next;
        });

        if (alreadySignedUp) {
          await cancelSignup(userId, id);
        } else {
          const result = await signUpForEvent(userId, id);
          if (result.success) {
            await createNotification(
              userId,
              `Signed up for ${title}!`,
              `You're confirmed. We'll remind you before the event.`,
              "✅"
            );
            setNotifications((prev) => [
              {
                id: `n-${Date.now()}`,
                title: `Signed up for ${title}!`,
                body: "You're confirmed. We'll remind you before the event.",
                timestamp: new Date(),
                read: false,
                icon: "✅",
              },
              ...prev,
            ]);
          } else {
            // Revert on failure
            setSignedUpIds((prev) => {
              const next = new Set(prev);
              next.delete(id);
              return next;
            });
          }
        }
      } else {
        // Guest mode — localStorage only
        setSignedUpIds((prev) => {
          const next = new Set(prev);
          if (alreadySignedUp) {
            next.delete(id);
          } else {
            next.add(id);
            setNotifications((ns) => [
              {
                id: `n-${Date.now()}`,
                title: `Signed up for ${title}!`,
                body: "Create an account to track your hours.",
                timestamp: new Date(),
                read: false,
                icon: "✅",
              },
              ...ns,
            ]);
          }
          return next;
        });
      }
    },
    [signedUpIds, isAuthenticated, userId]
  );

  const isSignedUp = useCallback(
    (id: string) => signedUpIds.has(id),
    [signedUpIds]
  );

  const setUserProfile = useCallback((profile: UserProfile) => {
    setUserProfileState(profile);
  }, []);

  const saveUserProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      setUserProfileState((prev) => ({ ...prev, ...updates }));

      if (isAuthenticated && userId) {
        const dbUpdates: Parameters<typeof dbUpdateProfile>[1] = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
        if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
        if (updates.interests !== undefined) dbUpdates.interests = updates.interests;
        if (updates.availability !== undefined) dbUpdates.availability = updates.availability;
        if (updates.skills !== undefined) dbUpdates.skills = updates.skills;
        if (updates.distancePref !== undefined) dbUpdates.distance_pref = updates.distancePref;
        if (updates.onboardingComplete !== undefined)
          dbUpdates.onboarding_complete = updates.onboardingComplete;
        await dbUpdateProfile(userId, dbUpdates);
      }
    },
    [isAuthenticated, userId]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(async () => {
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
    if (isAuthenticated && userId) {
      await markAllNotificationsRead(userId);
    }
  }, [isAuthenticated, userId]);

  const addNotification = useCallback(
    async (n: Omit<AppNotification, "id" | "timestamp" | "read">) => {
      setNotifications((ns) => [
        { ...n, id: `n-${Date.now()}`, timestamp: new Date(), read: false },
        ...ns,
      ]);
      if (isAuthenticated && userId) {
        await createNotification(userId, n.title, n.body, n.icon);
      }
    },
    [isAuthenticated, userId]
  );

  const login = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  }, []);

  return (
    <AppContext.Provider
      value={{
        signedUpIds,
        toggleSignUp,
        isSignedUp,
        userProfile,
        setUserProfile,
        saveUserProfile,
        notifications,
        unreadCount,
        markAllRead,
        addNotification,
        selectedEventId,
        setSelectedEventId,
        isAuthenticated,
        userId,
        login,
        logout,
        hydrated,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppContextProvider");
  return ctx;
}
