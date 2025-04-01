import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface PostUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostUploaded: () => void;
}

export default function PostUploadDialog({
  open,
  onOpenChange,
  onPostUploaded,
}: PostUploadDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);

    try {
      const user = await getCurrentUser();

      if (!user) {
        setError("You must be logged in to upload a post");
        return;
      }

      if (!title.trim()) {
        setError("Title is required");
        return;
      }

      const { error: uploadError } = await supabase.from("posts").insert({
        user_id: user.id,
        title,
        content,
        image_url: imageUrl,
      });

      if (uploadError) {
        throw uploadError;
      }

      setTitle("");
      setContent("");
      setImageUrl("");
      onOpenChange(false);
      onPostUploaded();
    } catch (err) {
      console.error("Error uploading post:", err);
      setError("Failed to upload post. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Upload New Post
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="bg-gray-800 border-gray-700"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter post content"
              className="bg-gray-800 border-gray-700 min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Post"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
