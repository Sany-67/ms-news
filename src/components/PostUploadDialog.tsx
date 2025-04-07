import React, { useState, useCallback } from "react";
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
import { Loader2, Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

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
  const [externalUrl, setExternalUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null);

  const uploadToCloudinary = async (file: File) => {
    setIsImageUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "msboy";
      const uploadPreset =
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ml_default";
      // Don't include API key in form data, it's not needed for unsigned uploads

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary configuration is missing");
      }

      // Check file size - limit to 10MB
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size exceeds 10MB limit");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("cloud_name", cloudName);
      // No need to include API key in form data for client-side uploads

      // Show progress updates
      const updateProgress = () => {
        const progress = Math.floor(Math.random() * 30) + 70; // Simulate progress between 70-100%
        setUploadProgress(progress);
      };
      const progressInterval = setInterval(updateProgress, 500);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Cloudinary error response:", errorData);
        throw new Error(
          `Upload failed: ${errorData.error?.message || response.statusText}`,
        );
      }

      const data = await response.json();
      setCloudinaryUrl(data.secure_url);
      setImageUrl(data.secure_url); // Set the image URL to the Cloudinary URL
      return data.secure_url;
    } catch (err: any) {
      console.error("Error uploading to Cloudinary:", err);
      setError(`Failed to upload image: ${err?.message || "Unknown error"}`);
      return null;
    } finally {
      setIsImageUploading(false);
      setUploadProgress(100);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      await uploadToCloudinary(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    setFile(null);
    setCloudinaryUrl(null);
    setImageUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);

    try {
      const user = await getCurrentUser();

      if (!user) {
        setError("You must be logged in to upload a post");
        setIsUploading(false);
        return;
      }

      if (!title.trim()) {
        setError("Title is required");
        setIsUploading(false);
        return;
      }

      // Use the Cloudinary URL if available, otherwise use the manually entered URL
      const finalImageUrl = cloudinaryUrl || imageUrl.trim() || null;

      // Prepare post data
      const postData = {
        user_id: user.id,
        title: title.trim(),
        content: content.trim() || null,
        image_url: finalImageUrl,
        external_url: externalUrl.trim() || null,
      };

      // Log the data being sent to help with debugging
      console.log("Sending post data to Supabase:", postData);

      const { data, error: uploadError } = await supabase
        .from("posts")
        .insert(postData)
        .select();

      if (uploadError) {
        console.error("Supabase error:", uploadError);
        if (uploadError.code === "23502") {
          setError("Missing required fields. Please check your input.");
        } else if (uploadError.code === "23505") {
          setError("A post with this title already exists.");
        } else if (uploadError.code === "42P01") {
          setError("Database table not found. Please contact support.");
        } else {
          setError(`Error: ${uploadError.message || "Unknown error occurred"}`);
        }
        setIsUploading(false);
        return;
      }

      console.log("Post uploaded successfully:", data);

      // Reset form and close dialog
      setTitle("");
      setContent("");
      setImageUrl("");
      setExternalUrl("");
      setFile(null);
      setCloudinaryUrl(null);
      onOpenChange(false);
      onPostUploaded();
    } catch (err: any) {
      console.error("Error uploading post:", err);
      setError(`Failed to upload post: ${err?.message || "Unknown error"}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-gradient-to-b from-gray-900 to-gray-950 text-white border border-indigo-500/30 max-h-[90vh] overflow-y-auto rounded-xl shadow-xl shadow-indigo-500/10 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-800/40">
        <DialogHeader className="pb-2 border-b border-indigo-500/20">
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Create New Post
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {error && (
            <div className="text-red-400 text-sm p-3 bg-red-500/10 rounded-lg border border-red-500/20 animate-pulse">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-indigo-200 font-medium">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="bg-gray-800/80 border-indigo-500/30 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all duration-200 rounded-lg"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content" className="text-indigo-200 font-medium">
              Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter post content"
              className="bg-gray-800/80 border-indigo-500/30 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all duration-200 rounded-lg min-h-[120px] resize-none"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-indigo-200 font-medium">Upload Image</Label>
            <div
              {...getRootProps()}
              className={`p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${isDragActive ? "border-indigo-400 bg-indigo-500/20 scale-[1.02]" : "border-indigo-500/40 bg-gray-800/50 hover:border-indigo-400 hover:bg-indigo-500/10"}`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  {cloudinaryUrl ? (
                    <div className="relative w-full h-48 group">
                      <img
                        src={cloudinaryUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg shadow-md transition-all duration-300 group-hover:brightness-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500 hover:bg-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-4 px-6 bg-indigo-500/10 rounded-lg w-full">
                      <Loader2 className="h-6 w-6 animate-spin text-indigo-400 mb-1" />
                      <span className="text-indigo-200 text-center">
                        Uploading {file.name}...
                      </span>
                      <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-indigo-300/70">
                        {uploadProgress}%
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-6 text-indigo-300 transition-transform duration-300 hover:scale-105">
                  <div className="p-4 rounded-full bg-indigo-500/10 mb-2">
                    <Upload className="h-8 w-8 text-indigo-400" />
                  </div>
                  <p className="text-center">
                    <span className="font-medium">Click to upload</span> or drag
                    and drop
                  </p>
                  <p className="text-xs text-indigo-400/80">
                    JPEG, PNG, GIF (Max 10MB)
                  </p>
                </div>
              )}
            </div>
            <div className="mt-3">
              <Label htmlFor="imageUrl" className="text-indigo-200 font-medium">
                Or enter image URL
              </Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="bg-gray-800/80 border-indigo-500/30 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all duration-200 rounded-lg mt-1"
                type="url"
                disabled={!!cloudinaryUrl}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="externalUrl"
              className="text-indigo-200 font-medium"
            >
              Website URL (optional)
            </Label>
            <Input
              id="externalUrl"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://example.com"
              className="bg-gray-800/80 border-indigo-500/30 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all duration-200 rounded-lg"
              type="url"
            />
          </div>
          <DialogFooter className="pt-2 border-t border-indigo-500/20 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-indigo-500/30 text-indigo-200 hover:bg-indigo-500/10 hover:border-indigo-400 transition-all duration-200"
            >
              <span>Cancel</span>
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 rounded-lg"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Share Post</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
