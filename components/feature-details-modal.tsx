"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeatureDetailsModalProps {
  feature: Feature | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeatureDetailsModal({
  feature,
  open,
  onOpenChange,
}: FeatureDetailsModalProps) {
  if (!feature) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#5221e6]/10 text-[#5221e6]">
               <Star className="h-5 w-5" />
            </div>
            <DialogTitle className="text-2xl font-bold">{feature.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="mt-6">
          <div
            className="text-muted-foreground text-lg leading-relaxed prose prose-sm dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: feature.description }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
