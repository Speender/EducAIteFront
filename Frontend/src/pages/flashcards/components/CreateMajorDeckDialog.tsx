import { useEffect, useState } from "react";
import { PlusIcon, SaveIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

type CreateMajorDeckDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  mode?: "create" | "edit";
  initialValues?: {
    title: string;
    description?: string;
    studentCourseSqid?: string | null;
  } | null;
  courses: Array<{ value: string; label: string }>;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: { title: string; description: string; studentCourseSqid: string | null }) => Promise<void>;
};

export function CreateMajorDeckDialog({
  open,
  isSubmitting,
  mode = "create",
  initialValues = null,
  courses,
  onOpenChange,
  onSubmit,
}: CreateMajorDeckDialogProps) {
  const isMobile = useIsMobileViewport();
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [selectedCourseSqid, setSelectedCourseSqid] = useState<string>(
    initialValues?.studentCourseSqid ?? (mode === "edit" ? "__overall__" : ""),
  );

  async function handleSubmit() {
    await onSubmit({
      title,
      description,
      studentCourseSqid: selectedCourseSqid === "__overall__" ? null : selectedCourseSqid,
    });
  }

  const content = (
    <Card className="border-none bg-transparent py-0 shadow-none ring-0">
      <CardHeader className="px-0">
        <CardTitle>{mode === "edit" ? "Edit deck" : "Create major deck"}</CardTitle>
        <CardDescription>
          {mode === "edit"
            ? "Update this workspace deck name and description."
            : "Create a top-level workspace deck, then add subdecks for focused practice."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        <div className="flex flex-col gap-2">
          <label htmlFor="major-deck-title" className="text-sm text-muted-foreground">
            Title
          </label>
          <Input
            id="major-deck-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Example: Database Systems"
          />
        </div>
        {mode === "create" ? (
          <div className="flex flex-col gap-2">
            <label htmlFor="major-deck-course" className="text-sm text-muted-foreground">
              Associated course
            </label>
            <Select value={selectedCourseSqid} onValueChange={setSelectedCourseSqid}>
              <SelectTrigger id="major-deck-course">
                <SelectValue placeholder="Choose a course context" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__overall__">No course / Overall deck</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.value} value={course.value}>
                    {course.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
        <div className="flex flex-col gap-2">
          <label htmlFor="major-deck-description" className="text-sm text-muted-foreground">
            Description
          </label>
          <Textarea
            id="major-deck-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe how this major deck should be organized."
            className="min-h-32"
          />
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2 border-none bg-transparent px-0">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!title.trim() || (mode === "create" && !selectedCourseSqid) || isSubmitting}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSubmitting ? (
            <Spinner data-icon="inline-start" />
          ) : mode === "edit" ? (
            <SaveIcon data-icon="inline-start" />
          ) : (
            <PlusIcon data-icon="inline-start" />
          )}
          {mode === "edit" ? "Save changes" : "Create deck"}
        </Button>
      </CardFooter>
    </Card>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="dark bg-background text-foreground">
          <DrawerHeader>
            <DrawerTitle>{mode === "edit" ? "Edit deck" : "Create major deck"}</DrawerTitle>
            <DrawerDescription>{mode === "edit" ? "Update this workspace deck." : "Add a new top-level workspace deck."}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark max-w-xl bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit deck" : "Create major deck"}</DialogTitle>
          <DialogDescription>{mode === "edit" ? "Update this workspace deck." : "Add a new top-level workspace deck."}</DialogDescription>
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
