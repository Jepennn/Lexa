import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Book, Globe, Star, Heart, Zap, GraduationCap, Flag, Bookmark } from "lucide-react";

export interface NewDictionaryData {
  name: string;
  description: string;
  color: string;
  icon: string;
}

interface AddDictionaryFormProps {
  onSubmit: (data: NewDictionaryData) => void;
  onCancel: () => void;
  className?: string;
}

const COLOR_OPTIONS = [
  { value: "bg-orange-500", label: "Orange" },
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-emerald-500", label: "Emerald" },
  { value: "bg-purple-500", label: "Purple" },
  { value: "bg-pink-500", label: "Pink" },
  { value: "bg-red-500", label: "Red" },
  { value: "bg-indigo-500", label: "Indigo" },
  { value: "bg-yellow-500", label: "Yellow" },
];

const ICON_OPTIONS = [
  { value: "book", label: "Book", component: Book },
  { value: "globe", label: "Globe", component: Globe },
  { value: "graduation", label: "Graduation", component: GraduationCap },
  { value: "star", label: "Star", component: Star },
  { value: "heart", label: "Heart", component: Heart },
  { value: "zap", label: "Zap", component: Zap },
  { value: "flag", label: "Flag", component: Flag },
  { value: "bookmark", label: "Bookmark", component: Bookmark },
];

export function AddDictionaryForm({ onSubmit, onCancel, className }: AddDictionaryFormProps) {
  const [formData, setFormData] = useState<NewDictionaryData>({
    name: "",
    description: "",
    color: "bg-blue-500",
    icon: "book",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  return (
    <Card className={cn("w-full border-none shadow-none bg-background", className)}>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 px-0 pt-4">
          
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground/80">
              Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., French Verbs"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-11 rounded-xl bg-secondary/30 border-transparent focus-visible:border-primary/50 text-base text-foreground"
              required
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground/80">
              Description <span className="text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="What's inside this collection?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[80px] rounded-xl bg-secondary/30 border-transparent focus-visible:border-primary/50 resize-none text-sm text-foreground"
            />
          </div>

          {/* Icon Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground/80">Icon</Label>
            <div className="flex flex-wrap gap-3">
              {ICON_OPTIONS.map((icon) => {
                const IconComponent = icon.component;
                return (
                  <button
                    key={icon.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: icon.value })}
                    className={cn(
                      "flex items-center justify-center h-10 w-10 rounded-xl transition-all border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary",
                      formData.icon === icon.value 
                        ? "bg-secondary border-primary/50 text-primary shadow-sm ring-2 ring-primary/20" 
                        : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                    aria-label={`Select ${icon.label} icon`}
                  >
                    <IconComponent className="size-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground/80">Theme Color</Label>
            <div className="flex flex-wrap gap-3">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={cn(
                    "h-8 w-8 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary",
                    color.value,
                    formData.color === color.value ? "scale-110 ring-2 ring-offset-2 ring-offset-background ring-foreground/20" : "hover:scale-105 opacity-80 hover:opacity-100"
                  )}
                  aria-label={`Select ${color.label} color`}
                >
                  {formData.color === color.value && (
                    <span className="flex items-center justify-center h-full w-full">
                      <Check className="w-4 h-4 text-white drop-shadow-md" strokeWidth={3} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

        </CardContent>

        <CardFooter className="flex flex-col gap-3 px-0 pt-8">
          <Button 
            type="submit" 
            className="w-full h-11 rounded-xl text-base font-semibold shadow-sm"
            disabled={!formData.name.trim()}
          >
            Create Dictionary
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onCancel}
            className="w-full h-11 rounded-xl text-base font-medium bg-card hover:bg-card/80 border border-border/40 text-foreground"
          >
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
