/**
 * Maps Supabase auth error messages/codes to user-friendly strings.
 * Never expose raw Supabase errors to the UI — they can reveal
 * internal details like table names or field constraints.
 */

const AUTH_ERROR_MAP: Record<string, string> = {
  // Sign in errors
  "Invalid login credentials": "Incorrect email or password.",
  "Email not confirmed": "Please check your email and confirm your account first.",
  "User not found": "No account found with that email.",
  "Invalid email or password": "Incorrect email or password.",
  // Sign up errors
  "User already registered": "An account with this email already exists. Try signing in.",
  "Password should be at least 6 characters": "Password must be at least 6 characters.",
  "Signup requires a valid password": "Please enter a valid password (min. 6 characters).",
  "Email address is invalid": "Please enter a valid email address.",
  // Rate limiting
  "Email rate limit exceeded": "Too many attempts. Please wait a few minutes and try again.",
  "over_email_send_rate_limit": "Too many requests. Please wait a minute before trying again.",
  // Network / server
  "Failed to fetch": "Network error — check your connection and try again.",
  "AuthRetryableFetchError": "Connection issue — please try again.",
};

/**
 * Returns a safe, user-friendly error message for a Supabase auth error.
 * Falls back to a generic message if the error is unknown.
 */
export function friendlyAuthError(err: unknown): string {
  if (err instanceof Error) {
    // Try exact match first
    if (AUTH_ERROR_MAP[err.message]) {
      return AUTH_ERROR_MAP[err.message];
    }
    // Try partial match for Supabase error code patterns
    for (const [pattern, friendly] of Object.entries(AUTH_ERROR_MAP)) {
      if (err.message.toLowerCase().includes(pattern.toLowerCase())) {
        return friendly;
      }
    }
  }
  // Never expose raw error details in production
  if (process.env.NODE_ENV === "development" && err instanceof Error) {
    return `[dev] ${err.message}`;
  }
  return "Something went wrong. Please try again.";
}
