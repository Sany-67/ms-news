import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/supabase";
import { CardSpotlightPost } from "./ui/card-spotlight-post";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string | null;
    image_url: string | null;
    created_at: string;
    user_id: string;
  };
  onLikeChange?: () => void;
}

export default function PostCard({ post, onLikeChange }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          // Check if the user has liked this post
          const { data, error } = await supabase
            .from("likes")
            .select("*")
            .eq("post_id", post.id)
            .eq("user_id", currentUser.id)
            .single();

          if (!error) {
            setIsLiked(!!data);
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    const fetchLikeCount = async () => {
      try {
        const { count, error } = await supabase
          .from("likes")
          .select("*", { count: "exact" })
          .eq("post_id", post.id);

        if (!error) {
          setLikeCount(count || 0);
        }
      } catch (err) {
        console.error("Error fetching like count:", err);
      }
    };

    const fetchAuthor = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", post.user_id)
          .single();

        if (!error) {
          setAuthor(data);
        }
      } catch (err) {
        console.error("Error fetching author data:", err);
      }
    };

    fetchUser();
    fetchLikeCount();
    fetchAuthor();
  }, [post.id, post.user_id]);

  const handleLike = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      if (isLiked) {
        // Unlike the post
        await supabase
          .from("likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user.id);

        setIsLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
      } else {
        // Like the post
        await supabase.from("likes").insert({
          post_id: post.id,
          user_id: user.id,
        });

        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }

      if (onLikeChange) {
        onLikeChange();
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <CardSpotlightPost className="overflow-hidden">
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6 transition-all hover:border-gray-700 relative z-10">
        {post.image_url && (
          <div className="mb-4 rounded-md overflow-hidden">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
          </div>
        )}
        <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
        {post.content && <p className="text-gray-300 mb-4">{post.content}</p>}

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            {author && (
              <>
                <img
                  src={
                    author.avatar_url ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.id}`
                  }
                  alt={author.display_name || "User"}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-gray-400 text-sm">
                  {author.display_name || "Anonymous"} •{" "}
                  {formatDate(post.created_at)}
                </span>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={!user || isLoading}
            className={`flex items-center gap-1 ${isLiked ? "text-pink-500" : "text-gray-400"}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-pink-500" : ""}`} />
            <span>{likeCount}</span>
          </Button>
        </div>
      </div>
    </CardSpotlightPost>
  );
}
