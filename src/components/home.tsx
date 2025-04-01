import React, { useState } from "react";
import { motion } from "framer-motion";
import SparklesShowcase from "./SparklesShowcase";
import { SparklesCore } from "./ui/sparkles";
import { Button } from "./ui/button";
import { ArrowDown, Github, Star, Plus, Heart } from "lucide-react";
import PostUploadDialog from "./PostUploadDialog";
import AllPosts from "./AllPosts";
import LikedPosts from "./LikedPosts";
import AuthButton from "./AuthButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { getCurrentUser } from "@/lib/supabase";
import ErrorBoundary from "./ErrorBoundary";

const HomePage = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <SparklesCore
            id="hero-sparkles"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={70}
            className="w-full h-full"
            particleColor="#FFFFFF"
            speed={0.8}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              SparklesCore
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            A beautiful particle animation component for creating engaging UI
            experiences with customizable properties
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </Button>
            <AuthButton />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8"
        >
          <ArrowDown className="h-8 w-8 text-white animate-bounce" />
        </motion.div>
      </section>

      {/* Community Posts Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8 flex flex-col md:flex-row justify-between items-center"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center md:text-left">
                Community Posts
              </h2>
              <p className="text-gray-400 max-w-2xl text-center md:text-left">
                Share and discover amazing particle effect implementations
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <Button
                onClick={async () => {
                  try {
                    const user = await getCurrentUser();
                    if (user) {
                      setUploadDialogOpen(true);
                    } else {
                      alert("Please sign in to upload a post");
                    }
                  } catch (error) {
                    console.error("Error checking user:", error);
                    alert("There was an error. Please try again.");
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Upload Post
              </Button>
            </div>
          </motion.div>

          <ErrorBoundary
            fallback={
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">
                  Failed to load posts. Please try again later.
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Refresh
                </Button>
              </div>
            }
          >
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-8"
            >
              <TabsList className="bg-gray-900/50 border border-gray-800">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-indigo-600"
                >
                  All Posts
                </TabsTrigger>
                <TabsTrigger
                  value="liked"
                  className="data-[state=active]:bg-indigo-600"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Liked Posts
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-6">
                <AllPosts />
              </TabsContent>
              <TabsContent value="liked" className="mt-6">
                <LikedPosts />
              </TabsContent>
            </Tabs>
          </ErrorBoundary>

          <PostUploadDialog
            open={uploadDialogOpen}
            onOpenChange={setUploadDialogOpen}
            onPostUploaded={() => {
              // Refresh posts after upload
              setActiveTab("all");
            }}
          />
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Interactive Demo
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Customize and explore different particle effects
            </p>
          </motion.div>

          <SparklesShowcase />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Key Features
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Create stunning visual effects with our highly customizable
              particle system
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6"
              >
                <div className="bg-indigo-500/20 p-3 rounded-full w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Developers Say
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join hundreds of developers using SparklesCore in their projects
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="text-white font-medium">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <SparklesCore
            id="cta-sparkles"
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={40}
            className="w-full h-full"
            particleColor="#4F46E5"
            speed={0.5}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to add some sparkle to your project?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Get started with SparklesCore today and create engaging UI
              experiences
            </p>
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8"
            >
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-950 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white">SparklesCore</h3>
              <p className="text-gray-400 mt-2">
                Beautiful particle animations for your UI
              </p>
            </div>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Documentation
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Examples
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} SparklesCore. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Sample data
const features = [
  {
    title: "Customizable Particles",
    description:
      "Adjust particle size, color, density, and animation speed to match your design needs.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-indigo-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    title: "Three Animation Styles",
    description:
      "Choose from standard overlay, fullscreen background, or colorful themed particles.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-indigo-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
  },
  {
    title: "Smooth Transitions",
    description:
      "Framer Motion integration provides smooth opacity transitions when particles load.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-indigo-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
];

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Frontend Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    rating: 5,
    text: "SparklesCore has completely transformed our landing page. The customization options are incredible and it was so easy to implement.",
  },
  {
    name: "Sarah Chen",
    role: "UI Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    rating: 5,
    text: "As a designer, I love how I can match the particle effects to our brand colors. The animations are smooth and not resource-intensive.",
  },
  {
    name: "Michael Rodriguez",
    role: "Product Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    rating: 4,
    text: "Our users have been giving great feedback about the new particle effects. It adds that extra touch of polish to our application.",
  },
];

export default HomePage;
