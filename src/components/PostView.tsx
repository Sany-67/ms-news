import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/supabase";
import { Helmet } from "react-helmet-async";

export default function PostView() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postId) return;

        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", postId)
          .single();

        if (error) {
          console.error("Error fetching post:", error);
          return;
        }

        setPost(data);

        // Fetch author
        if (data.user_id) {
          const { data: authorData, error: authorError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.user_id)
            .single();

          if (!authorError) {
            setAuthor(authorData);
          }
        }

        // Fetch like count
        const { count, error: likeCountError } = await supabase
          .from("likes")
          .select("*", { count: "exact" })
          .eq("post_id", postId);

        if (!likeCountError) {
          setLikeCount(count || 0);
        }

        // Fetch current user
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        // Check if user has liked this post
        if (currentUser) {
          const { data: likeData, error: likeError } = await supabase
            .from("likes")
            .select("*")
            .eq("post_id", postId)
            .eq("user_id", currentUser.id)
            .single();

          if (!likeError) {
            setIsLiked(!!likeData);
          }
        }
      } catch (err) {
        console.error("Error in fetchPost:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = async () => {
    if (!user || !postId) return;

    setIsLoading(true);

    try {
      if (isLiked) {
        // Unlike the post
        await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        setIsLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
      } else {
        // Like the post
        await supabase.from("likes").insert({
          post_id: postId,
          user_id: user.id,
        });

        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
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
      month: "long",
      day: "numeric",
    });
  };

  const handleExternalLinkClick = () => {
    if (post?.external_url) {
      window.open(post.external_url, "_blank", "noopener,noreferrer");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
        <p className="text-white mb-4">Post not found</p>
        <Button onClick={() => navigate("/")}>Go back home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{post.title || "Post"}</title>
        <meta name="title" content={post.title || "Post"} />
        <meta
          name="description"
          content={post.content || "Check out this post"}
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={post.title || "Post"} />
        <meta
          property="og:description"
          content={post.content || "Check out this post"}
        />
        {post.image_url && (
          <meta property="og:image" content={post.image_url} />
        )}
        <meta property="og:site_name" content="Social Media App" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={window.location.href} />
        <meta name="twitter:title" content={post.title || "Post"} />
        <meta
          name="twitter:description"
          content={post.content || "Check out this post"}
        />
        {post.image_url && (
          <meta name="twitter:image" content={post.image_url} />
        )}
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 text-gray-400 hover:text-white"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to posts
        </Button>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 md:p-8">
          {post.image_url && (
            <div className="mb-6 rounded-md overflow-hidden">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {post.title}
            </h1>
            {post.external_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExternalLinkClick}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Site
              </Button>
            )}
          </div>

          {post.content && (
            <div className="text-gray-300 mb-8 text-lg">{post.content}</div>
          )}

          <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-4">
            <div className="flex items-center">
              {author && (
                <>
                  <img
                    src={
                      author.avatar_url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.id}`
                    }
                    alt={author.display_name || "User"}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="text-white font-medium">
                      {author.display_name || "Anonymous"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {formatDate(post.created_at)}
                    </p>
                  </div>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={!user || isLoading}
              className={`flex items-center gap-2 ${isLiked ? "text-pink-500" : "text-gray-400"}`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-pink-500" : ""}`} />
              <span>{likeCount}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
