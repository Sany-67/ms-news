import React, { useState } from "react";
import { motion } from "framer-motion";
import SparklesVariant from "./SparklesVariant";
import CustomizationPanel from "./CustomizationPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Info, Sparkles, Zap } from "lucide-react";

interface SparklesConfig {
  background: string;
  minSize: number;
  maxSize: number;
  particleDensity: number;
  particleColor: string;
  speed: number;
}

const SparklesShowcase = () => {
  const [standardConfig, setStandardConfig] = useState<SparklesConfig>({
    background: "transparent",
    minSize: 0.4,
    maxSize: 1,
    particleDensity: 100,
    particleColor: "#FFFFFF",
    speed: 1,
  });

  const [fullscreenConfig, setFullscreenConfig] = useState<SparklesConfig>({
    background: "transparent",
    minSize: 0.6,
    maxSize: 1.4,
    particleDensity: 100,
    particleColor: "#FFFFFF",
    speed: 1,
  });

  const [colorfulConfig, setColorfulConfig] = useState<SparklesConfig>({
    background: "transparent",
    minSize: 0.6,
    maxSize: 1.4,
    particleDensity: 100,
    particleColor: "#00ff00",
    speed: 0.5,
  });

  const [activeTab, setActiveTab] = useState("standard");
  const [activeConfig, setActiveConfig] =
    useState<SparklesConfig>(standardConfig);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    switch (value) {
      case "standard":
        setActiveConfig(standardConfig);
        break;
      case "fullscreen":
        setActiveConfig(fullscreenConfig);
        break;
      case "colorful":
        setActiveConfig(colorfulConfig);
        break;
      default:
        setActiveConfig(standardConfig);
    }
  };

  const handleConfigChange = (config: SparklesConfig) => {
    switch (activeTab) {
      case "standard":
        setStandardConfig(config);
        break;
      case "fullscreen":
        setFullscreenConfig(config);
        break;
      case "colorful":
        setColorfulConfig(config);
        break;
    }
    setActiveConfig(config);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <header className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-indigo-400" />
              SparklesCore
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-gray-300 max-w-3xl mx-auto"
          >
            A customizable particle animation component that creates beautiful
            sparkling effects for your UI. Perfect for hero sections,
            backgrounds, or interactive elements.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Tabs
              defaultValue="standard"
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger
                  value="standard"
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Standard
                </TabsTrigger>
                <TabsTrigger
                  value="fullscreen"
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Fullscreen
                </TabsTrigger>
                <TabsTrigger
                  value="colorful"
                  className="flex items-center gap-2"
                >
                  <Info className="h-4 w-4" />
                  Colorful
                </TabsTrigger>
              </TabsList>

              <TabsContent value="standard">
                <SparklesVariant
                  title="Standard Overlay"
                  description="A beautiful particle animation that overlays on top of content"
                  variant="standard"
                  initialConfig={standardConfig}
                  onConfigChange={handleConfigChange}
                />
              </TabsContent>

              <TabsContent value="fullscreen">
                <SparklesVariant
                  title="Fullscreen Background"
                  description="A fullscreen particle animation that works as a background"
                  variant="fullscreen"
                  initialConfig={fullscreenConfig}
                  onConfigChange={handleConfigChange}
                />
              </TabsContent>

              <TabsContent value="colorful">
                <SparklesVariant
                  title="Colorful Themed"
                  description="A colorful particle animation with custom theming"
                  variant="colorful"
                  initialConfig={colorfulConfig}
                  onConfigChange={handleConfigChange}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <CustomizationPanel
              particleSize={activeConfig.minSize}
              setParticleSize={(size) =>
                handleConfigChange({
                  ...activeConfig,
                  minSize: size,
                  maxSize: size * 2,
                })
              }
              particleColor={activeConfig.particleColor}
              setParticleColor={(color) =>
                handleConfigChange({ ...activeConfig, particleColor: color })
              }
              particleDensity={activeConfig.particleDensity}
              setParticleDensity={(density) =>
                handleConfigChange({
                  ...activeConfig,
                  particleDensity: density,
                })
              }
              speed={activeConfig.speed}
              setSpeed={(speed) =>
                handleConfigChange({ ...activeConfig, speed: speed })
              }
            />
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Implementation Example
          </h2>
          <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto text-sm text-gray-300">
            <code>{`import { SparklesCore } from "@/components/ui/sparkles";

export function MyComponent() {
  return (
    <div className="relative w-full h-screen">
      <SparklesCore
        background="transparent"
        minSize={${activeConfig.minSize}}
        maxSize={${activeConfig.maxSize}}
        particleDensity={${activeConfig.particleDensity}}
        className="w-full h-full"
        particleColor="${activeConfig.particleColor}"
        speed={${activeConfig.speed}}
      />
      <h1 className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white z-10">
        Your Content Here
      </h1>
    </div>
  );
}`}</code>
          </pre>
        </div>

        <footer className="text-center text-gray-400 text-sm py-8">
          <p>
            SparklesCore uses tsparticles and Framer Motion for smooth
            animations
          </p>
        </footer>
      </motion.div>
    </div>
  );
};

export default SparklesShowcase;
