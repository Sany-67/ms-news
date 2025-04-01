import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { signIn, signOut, getCurrentUser, supabase } from "@/lib/supabase";
import { LogIn, LogOut, User } from "lucide-react";
import SignUpDialog from "./auth/SignUpDialog";

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser || null);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Set up auth state listener
    let authListener;
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user || null);
        },
      );
      authListener = data;
    } catch (error) {
      console.error("Error setting up auth listener:", error);
    }

    return () => {
      if (authListener?.subscription) {
        try {
          authListener.subscription.unsubscribe();
        } catch (error) {
          console.error("Error unsubscribing from auth listener:", error);
        }
      }
    };
  }, []);

  const handleSignIn = async () => {
    await signIn();
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="border-white/20 text-white hover:bg-white/10"
      >
        <User className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleSignOut}
        className="border-white/20 text-white hover:bg-white/10"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => (window.location.href = "/login")}
        className="border-white/20 text-white hover:bg-white/10"
      >
        <LogIn className="h-4 w-4 mr-2" />
        Log In
      </Button>
      <SignUpDialog
        trigger={
          <Button
            variant="default"
            size="sm"
            className="bg-white text-black hover:bg-white/90"
          >
            Sign Up
          </Button>
        }
      />
    </div>
  );
}
