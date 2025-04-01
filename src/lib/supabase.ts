import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabaseUrl = "https://gmbcxwdqnwihtxhhhfyv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtYmN4d2RxbndpaHR4aGhoZnl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MzQwNjQsImV4cCI6MjA1NjMxMDA2NH0.Dnm6pw1z3CnW4DlPCPDLcvvUYtKgp_UIifQAEE34NIQ";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

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
