import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Provide default values for development environment
const finalSupabaseUrl = supabaseUrl || "https://your-project-id.supabase.co";
const finalSupabaseAnonKey = supabaseAnonKey || "your-anon-key";

export const supabase = createClient<Database>(
  finalSupabaseUrl,
  finalSupabaseAnonKey,
);

export async function getCurrentUser() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      return null;
    }

    return session?.user;
  } catch (err) {
    console.error("Failed to fetch current user:", err);
    return null;
  }
}

export async function signIn() {
  try {
    return await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  } catch (err) {
    console.error("Failed to sign in:", err);
    return { error: { message: "Failed to sign in. Please try again." } };
  }
}

export async function signOut() {
  try {
    return await supabase.auth.signOut();
  } catch (err) {
    console.error("Failed to sign out:", err);
    return { error: { message: "Failed to sign out. Please try again." } };
  }
}
