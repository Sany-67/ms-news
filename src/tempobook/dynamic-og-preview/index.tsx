import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sampleImages = [
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
  "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
  "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&q=80",
  "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=800&q=80",
];

export default function DynamicOGPreview() {
  const [title, setTitle] = useState("Amazing Post Title");
  const [content, setContent] = useState(
    "This is an example post with dynamic Open Graph metadata for social media sharing.",
  );
  const [imageUrl, setImageUrl] = useState(sampleImages[0]);
  const [customImageUrl, setCustomImageUrl] = useState("");

  const handleImageSelect = (url: string) => {
    setImageUrl(url);
  };

  const handleCustomImageSubmit = () => {
    if (customImageUrl.trim()) {
      setImageUrl(customImageUrl.trim());
    }
  };

  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{title || "Post"}</title>
        <meta name="title" content={title || "Post"} />
        <meta name="description" content={content || "Check out this post"} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={title || "Post"} />
        <meta
          property="og:description"
          content={content || "Check out this post"}
        />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta property="og:site_name" content="Social Media App" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={currentUrl} />
        <meta name="twitter:title" content={title || "Post"} />
        <meta
          name="twitter:description"
          content={content || "Check out this post"}
        />
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          Dynamic OG Preview
        </h1>
        <p className="text-gray-300 mb-8">
          Edit the post details below to see how they would appear when shared
          on social media platforms. The Open Graph meta tags will update in
          real-time.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">
              Edit Post Details
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white mb-2 block">
                  Post Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-white mb-2 block">
                  Post Content
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                />
              </div>

              <div>
                <Label className="text-white mb-2 block">Post Image</Label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {sampleImages.map((url) => (
                    <div
                      key={url}
                      className={`relative cursor-pointer rounded-md overflow-hidden border-2 ${imageUrl === url ? "border-indigo-500" : "border-transparent"}`}
                      onClick={() => handleImageSelect(url)}
                    >
                      <img
                        src={url}
                        alt="Sample"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Or enter custom image URL"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Button
                    onClick={handleCustomImageSubmit}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Set
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Preview</h2>
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="bg-gray-800 text-gray-300">
                <TabsTrigger value="preview">Link Preview</TabsTrigger>
                <TabsTrigger value="meta">Meta Tags</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="mt-4">
                <Card className="bg-white overflow-hidden">
                  {imageUrl && (
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1">
                      {window.location.origin}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {title || "Post"}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {content || "Check out this post"}
                    </p>
                  </div>
                </Card>
                <div className="mt-4 text-gray-400 text-sm">
                  <p>
                    Note: This is a simplified preview. Actual appearance may
                    vary across different platforms.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="meta" className="mt-4">
                <div className="bg-gray-800 p-4 rounded-md overflow-auto">
                  <pre className="text-green-400 text-xs whitespace-pre-wrap">
                    {`<meta name="title" content="${title || "Post"}" />
<meta name="description" content="${content || "Check out this post"}" />

<meta property="og:type" content="article" />
<meta property="og:url" content="${currentUrl}" />
<meta property="og:title" content="${title || "Post"}" />
<meta property="og:description" content="${content || "Check out this post"}" />
${imageUrl ? `<meta property="og:image" content="${imageUrl}" />` : ""}
<meta property="og:site_name" content="Social Media App" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="${currentUrl}" />
<meta name="twitter:title" content="${title || "Post"}" />
<meta name="twitter:description" content="${content || "Check out this post"}" />
${imageUrl ? `<meta name="twitter:image" content="${imageUrl}" />` : ""}`}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>

            <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-md p-4">
              <h3 className="text-indigo-300 font-medium mb-2">How it works</h3>
              <p className="text-indigo-200 text-sm">
                When a user shares a link to your post, social media platforms
                will scrape these meta tags to generate a rich preview card. The
                dynamic meta tags ensure that each post displays its own title,
                description, and image.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
