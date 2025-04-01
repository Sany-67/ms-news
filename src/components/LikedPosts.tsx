import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/supabase";
import PostCard from "./PostCard";
import { Loader2 } from "lucide-react";

export default function LikedPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLikedPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = await getCurrentUser();

      if (!user) {
        setError("You must be logged in to view liked posts");
        setPosts([]);
        setLoading(false);
        return;
      }

      // Get all likes for the current user
      const { data: likes, error: likesError } = await supabase
        .from("likes")
        .select("post_id")
        .eq("user_id", user.id);

      if (likesError) throw likesError;

      if (!likes || likes.length === 0) {
        setPosts([]);
        setLoading(false);
        return;
      }

      // Get all posts that the user has liked
      const postIds = likes.map((like) => like.post_id);
      const { data: likedPosts, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .in("id", postIds)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      setPosts(likedPosts || []);
    } catch (err) {
      console.error("Error fetching liked posts:", err);
      setError("Failed to load liked posts. Please try again.");
      setPosts([]); // Set empty array to prevent undefined errors
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">You haven't liked any posts yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onLikeChange={fetchLikedPosts} />
      ))}
    </div>
  );
}
