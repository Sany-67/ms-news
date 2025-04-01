import React, { useState } from "react";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import { Settings, RefreshCw, Palette } from "lucide-react";

interface CustomizationPanelProps {
  particleSize?: number;
  setParticleSize?: (size: number) => void;
  particleColor?: string;
  setParticleColor?: (color: string) => void;
  particleDensity?: number;
  setParticleDensity?: (density: number) => void;
  speed?: number;
  setSpeed?: (speed: number) => void;
  className?: string;
}

const CustomizationPanel = ({
  particleSize = 1,
  setParticleSize = () => {},
  particleColor = "#FFFFFF",
  setParticleColor = () => {},
  particleDensity = 100,
  setParticleDensity = () => {},
  speed = 1,
  setSpeed = () => {},
  className,
}: CustomizationPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const predefinedColors = [
    { name: "White", value: "#FFFFFF" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Green", value: "#10B981" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Yellow", value: "#F59E0B" },
  ];

  return (
    <div
      className={cn(
        "bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg p-4 w-full max-w-[350px] text-white",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-white/70" />
          <h3 className="font-medium">Customize Particles</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white/70 hover:text-white transition-colors"
        >
          {isExpanded ? "−" : "+"}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="particle-size" className="text-sm text-white/90">
                Particle Size
              </Label>
              <span className="text-xs text-white/70">
                {particleSize.toFixed(1)}
              </span>
            </div>
            <Slider
              id="particle-size"
              min={0.1}
              max={3}
              step={0.1}
              value={[particleSize]}
              onValueChange={(value) => setParticleSize(value[0])}
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="particle-density"
                className="text-sm text-white/90"
              >
                Particle Density
              </Label>
              <span className="text-xs text-white/70">{particleDensity}</span>
            </div>
            <Slider
              id="particle-density"
              min={10}
              max={1200}
              step={10}
              value={[particleDensity]}
              onValueChange={(value) => setParticleDensity(value[0])}
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="animation-speed"
                className="text-sm text-white/90"
              >
                Animation Speed
              </Label>
              <span className="text-xs text-white/70">{speed.toFixed(1)}</span>
            </div>
            <Slider
              id="animation-speed"
              min={0.1}
              max={5}
              step={0.1}
              value={[speed]}
              onValueChange={(value) => setSpeed(value[0])}
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="particle-color"
              className="text-sm text-white/90 flex items-center gap-2"
            >
              <Palette className="h-4 w-4" />
              Particle Color
            </Label>
            <div className="flex gap-2">
              <Select value={particleColor} onValueChange={setParticleColor}>
                <SelectTrigger className="w-full bg-black/50 border-white/20">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  {predefinedColors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color.value }}
                        />
                        <span>{color.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={particleColor}
                  onChange={(e) => setParticleColor(e.target.value)}
                  className="w-10 h-10 p-1 bg-transparent border-white/20"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setParticleSize(1);
                setParticleColor("#FFFFFF");
                setParticleDensity(100);
                setSpeed(1);
              }}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Reset to defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizationPanel;
