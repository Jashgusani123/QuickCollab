"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DownloadCloud } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DownloadDesktopDialog = ({ open, onOpenChange }: Props) => {
  const handleDownload = () => {
  const link = document.createElement("a");
  link.href = "https://github.com/Jashgusani123/QuickCollab-Desktop/releases/download/v1.0.0/QuickCollab.exe";
  link.download = "QuickCollab.exe"; // filename user sees
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  onOpenChange(false);
};


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xl border text-black shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <DownloadCloud className="size-5 text-primary" />
            Download Desktop App
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Install QuickCollab for a faster, native desktop experience with
            notifications and better performance.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex gap-2">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button onClick={handleDownload}>
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
