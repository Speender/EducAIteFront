import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

const sourceTypeOptions = [
  { label: "Manual", value: "0" },
  { label: "Note", value: "1" },
  { label: "Document", value: "2" },
];

type CreateSubDeckDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: {
    title: string;
    description: string;
    sourceType: number;
  }) => Promise<void>;
};

export function CreateSubDeckDialog({
  open,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: CreateSubDeckDialogProps) {
  const isMobile = useIsMobileViewport();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sourceType, setSourceType] = useState("0");

  useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      setSourceType("0");
    }
  }, [open]);

  async function handleSubmit() {
    await onSubmit({
      title,
      description,
      sourceType: Number(sourceType),
    });
  }

  const content = (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="subdeck-title" className="text-sm text-muted-foreground">
          Subdeck title
        </label>
        <Input
          id="subdeck-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Example: SQL joins"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subdeck-source-type" className="text-sm text-muted-foreground">
          Source type
        </label>
        <Select value={sourceType} onValueChange={setSourceType}>
          <SelectTrigger id="subdeck-source-type">
            <SelectValue placeholder="Select source type" />
          </SelectTrigger>
          <SelectContent>
            {sourceTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subdeck-description" className="text-sm text-muted-foreground">
          Description
        </label>
        <Textarea
          id="subdeck-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the focus of this subdeck."
          className="min-h-28"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!title.trim() || isSubmitting}
          className="bg-[#00CEC8] text-black hover:bg-[#34e5df]"
        >
          {isSubmitting ? <Spinner data-icon="inline-start" /> : <PlusIcon data-icon="inline-start" />}
          Create subdeck
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="dark bg-background text-foreground">
          <DrawerHeader>
            <DrawerTitle>Create subdeck</DrawerTitle>
            <DrawerDescription>Add a new subdeck inside the current major deck.</DrawerDescription>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark max-w-lg bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Create subdeck</DialogTitle>
          <DialogDescription>Add a new subdeck inside the current major deck.</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.innerWidth < 768;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isMobile;
}
