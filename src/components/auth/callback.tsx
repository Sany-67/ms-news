import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data?.session?.user) {
          // Check if user exists in the users table
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.session.user.id)
            .single();

          // If user doesn't exist, create a new user record
          if (!userData && !userError) {
            await supabase.from("users").insert({
              id: data.session.user.id,
              email: data.session.user.email,
              display_name: data.session.user.user_metadata?.full_name || null,
              avatar_url: data.session.user.user_metadata?.avatar_url || null,
            });
          }
        }

        // Redirect to home page
        navigate("/");
      } catch (err) {
        console.error("Error during auth callback:", err);
        setError("Authentication failed. Please try again.");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">
            Authentication Error
          </h2>
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-white">Completing authentication...</p>
      </div>
    </div>
  );
}
