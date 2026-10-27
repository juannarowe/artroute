import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RejectEventDialogProps {
  eventTitle: string;
  disabled: boolean;
  onConfirm: (note: string) => void;
}

export function RejectEventDialog({
  eventTitle,
  disabled,
  onConfirm,
}: RejectEventDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState("");

  function handleConfirm() {
    onConfirm(note);
    setIsOpen(false);
    setNote("");
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" disabled={disabled}>
          Reject
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject “{eventTitle}”</DialogTitle>
          <DialogDescription>
            The creator will see this note in My Events.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="rejection-note">Note (optional)</Label>
          <Textarea
            id="rejection-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="e.g. Please add an image of the works"
          />
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={handleConfirm}>
            Reject event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
