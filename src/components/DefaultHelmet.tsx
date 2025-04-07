import React from "react";
import { Helmet } from "react-helmet-async";

export default function DefaultHelmet() {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>Social Media App</title>
      <meta name="title" content="Social Media App" />
      <meta
        name="description"
        content="Share and discover content with our social media platform"
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.origin} />
      <meta property="og:title" content="Social Media App" />
      <meta
        property="og:description"
        content="Share and discover content with our social media platform"
      />
      <meta
        property="og:image"
        content="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=80"
      />
      <meta property="og:site_name" content="Social Media App" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={window.location.origin} />
      <meta name="twitter:title" content="Social Media App" />
      <meta
        name="twitter:description"
        content="Share and discover content with our social media platform"
      />
      <meta
        name="twitter:image"
        content="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=80"
      />
    </Helmet>
  );
}
