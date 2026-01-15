import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface NewWordData {
  original: string;
  translation: string;
}

interface AddWordFormProps {
  onSubmit: (data: NewWordData) => void;
  onCancel: () => void;
  className?: string;
}

export function AddWordForm({ onSubmit, onCancel, className }: AddWordFormProps) {
  const [formData, setFormData] = useState<NewWordData>({
    original: "",
    translation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.original.trim() || !formData.translation.trim()) return;
    onSubmit(formData);
  };

  return (
    <Card className={cn("w-full border-none shadow-none bg-background dark text-foreground", className)}>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 px-0 pt-4">
          
          {/* Original Word */}
          <div className="space-y-2">
            <Label htmlFor="original" className="text-sm font-medium text-muted-foreground">
              Word or Phrase
            </Label>
            <Input
              id="original"
              placeholder="e.g., Bonjour"
              value={formData.original}
              onChange={(e) => setFormData({ ...formData, original: e.target.value })}
              className="h-11 rounded-xl bg-secondary/30 border-transparent focus-visible:border-primary/50 text-base text-foreground"
              required
            />
          </div>

          {/* Translation */}
          <div className="space-y-2">
            <Label htmlFor="translation" className="text-sm font-medium text-muted-foreground">
              Translation
            </Label>
            <Input
              id="translation"
              placeholder="e.g., Hello"
              value={formData.translation}
              onChange={(e) => setFormData({ ...formData, translation: e.target.value })}
              className="h-11 rounded-xl bg-secondary/30 border-transparent focus-visible:border-primary/50 text-base text-foreground"
              required
            />
          </div>

        </CardContent>

        <CardFooter className="flex flex-col gap-3 px-0 pt-8">
          <Button 
            type="submit" 
            className="w-full h-11 rounded-xl text-base font-semibold shadow-sm"
            disabled={!formData.original.trim() || !formData.translation.trim()}
          >
            Save to Dictionary
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
