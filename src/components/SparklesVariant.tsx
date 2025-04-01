import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { motion } from "framer-motion";

// Import the SparklesCore component directly
// Note: We're importing the component directly from the file
import { SparklesCore } from "./ui/sparkles";

interface SparklesVariantProps {
  title?: string;
  description?: string;
  variant?: "standard" | "fullscreen" | "colorful";
  initialConfig?: {
    background?: string;
    minSize?: number;
    maxSize?: number;
    particleDensity?: number;
    particleColor?: string;
    speed?: number;
  };
  onConfigChange?: (config: any) => void;
}

const SparklesVariant = ({
  title = "Sparkles Effect",
  description = "A beautiful particle animation that creates a sparkling effect",
  variant = "standard",
  initialConfig = {
    background: "transparent",
    minSize: 0.4,
    maxSize: 1,
    particleDensity: 100,
    particleColor: "#FFFFFF",
    speed: 1,
  },
  onConfigChange = () => {},
}: SparklesVariantProps) => {
  const [config, setConfig] = useState(initialConfig);

  const handleConfigChange = (newConfig: any) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    onConfigChange(updatedConfig);
  };

  const renderVariant = () => {
    switch (variant) {
      case "standard":
        return (
          <div className="h-[300px] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
            <h1 className="text-4xl font-bold text-center text-white relative z-20">
              {title}
            </h1>
            <div className="w-full h-40 relative">
              {/* Gradients */}
              <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
              <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
              <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
              <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

              {/* Core component */}
              <SparklesCore
                background={config.background}
                minSize={config.minSize}
                maxSize={config.maxSize}
                particleDensity={config.particleDensity}
                className="w-full h-full"
                particleColor={config.particleColor}
                speed={config.speed}
              />

              {/* Radial Gradient to prevent sharp edges */}
              <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
            </div>
          </div>
        );
      case "fullscreen":
        return (
          <div className="h-[300px] relative w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden rounded-md">
            <div className="w-full absolute inset-0 h-full">
              <SparklesCore
                id="tsparticlesfullpage"
                background={config.background}
                minSize={config.minSize}
                maxSize={config.maxSize}
                particleDensity={config.particleDensity}
                className="w-full h-full"
                particleColor={config.particleColor}
                speed={config.speed}
              />
            </div>
            <h1 className="text-4xl font-bold text-center text-white relative z-20">
              {title}
            </h1>
          </div>
        );
      case "colorful":
        return (
          <div className="h-[300px] relative w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
            <div className="w-full absolute inset-0 h-full">
              <SparklesCore
                id="tsparticlescolorful"
                background={config.background}
                minSize={config.minSize}
                maxSize={config.maxSize}
                particleDensity={config.particleDensity}
                className="w-full h-full"
                particleColor={config.particleColor}
                speed={config.speed}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-4 relative z-20">
              <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                {title}
              </h1>
              <p className="text-neutral-300 cursor-default text-center">
                {description}
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="w-full bg-background border-border">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{renderVariant()}</CardContent>
      </Card>
    </motion.div>
  );
};

export default SparklesVariant;
