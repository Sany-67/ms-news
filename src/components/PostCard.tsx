import React, { useState, useEffect } from "react";
import {
  Heart,
  ExternalLink,
  Share2,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/supabase";
import { CardSpotlightPost } from "./ui/card-spotlight-post";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "./ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

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
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);
  const [postUrl, setPostUrl] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

    // Fetch post URL if available
    const fetchPostUrl = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("external_url")
          .eq("id", post.id)
          .single();

        if (!error && data?.external_url) {
          setPostUrl(data.external_url);
        }
      } catch (err) {
        console.error("Error fetching post URL:", err);
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
    fetchPostUrl();
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

  const handleCardClick = () => {
    if (post.id) {
      navigate(`/post/${post.id}`);
    }
  };

  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (postUrl) {
      window.open(postUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Create a shareable URL for the post
    const shareUrl = `${window.location.origin}/post/${post.id}`;

    // Use Web Share API if available
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.content || "Check out this post!",
          url: shareUrl,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
          // Fallback to clipboard copy
          copyToClipboard(shareUrl);
        });
    } else {
      // Fallback to clipboard copy
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Link copied to clipboard",
          description: "You can now share it with others",
          duration: 3000,
        });
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast({
          title: "Failed to copy link",
          description: "Please try again",
          variant: "destructive",
          duration: 3000,
        });
      });
  };

  const handleDeletePost = async () => {
    if (!user || user.id !== post.user_id) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase.from("posts").delete().eq("id", post.id);

      if (error) throw error;

      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted",
        duration: 3000,
      });

      // Refresh the posts list
      if (onLikeChange) onLikeChange();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error deleting post",
        description: "Please try again later",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <CardSpotlightPost
        className="overflow-hidden cursor-pointer"
        onClick={handleCardClick}
      >
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
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold text-white">{post.title}</h3>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShareClick}
                className="text-gray-400 hover:text-white"
                title="Share post"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              {postUrl && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleExternalLinkClick}
                  className="text-gray-400 hover:text-white"
                  title="Visit external site"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
              {user && user.id === post.user_id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white"
                      title="More options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-gray-800 border-gray-700 text-white"
                  >
                    <DropdownMenuItem
                      className="text-red-400 hover:text-red-300 cursor-pointer focus:bg-gray-700 focus:text-red-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-900 border border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-700 text-white hover:bg-gray-800 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeletePost}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
