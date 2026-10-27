import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileFormProps {
  initialName: string;
  isSaving: boolean;
  onSave: (name: string) => void;
}

export function ProfileForm({
  initialName,
  isSaving,
  onSave,
}: ProfileFormProps) {
  const [name, setName] = useState(initialName);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(name);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-2"
    >
      <Label htmlFor="profile-name">Name</Label>
      <div className="flex gap-2">
        <Input
          id="profile-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          minLength={2}
          maxLength={50}
        />
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
