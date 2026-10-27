import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EVENT_CATEGORIES } from "@/lib/categories";
import { formatCategory } from "@/lib/format";
import type { CreateEventInput } from "@/types/event";

interface EventFormProps {
  onSubmit: (values: CreateEventInput) => void;
  isSubmitting: boolean;
  errorMessage?: string;
}

const emptyForm = {
  title: "",
  venue: "",
  address: "",
  lat: "",
  lng: "",
  date: "",
  category: EVENT_CATEGORIES[0],
  description: "",
  price: "0",
  image: "",
  externalLink: "",
};

type FormValues = typeof emptyForm;

export function EventForm({
  onSubmit,
  isSubmitting,
  errorMessage,
}: EventFormProps) {
  const [values, setValues] = useState<FormValues>(emptyForm);

  function updateField(field: keyof FormValues, value: string) {
    setValues({ ...values, [field]: value });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      title: values.title,
      venue: values.venue,
      address: values.address,
      lat: Number(values.lat),
      lng: Number(values.lng),
      date: new Date(values.date).toISOString(),
      category: values.category,
      description: values.description,
      price: Number(values.price),
      image: values.image || undefined,
      externalLink: values.externalLink || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={values.title}
          onChange={(event) => updateField("title", event.target.value)}
          required
          minLength={2}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="venue">Gallery / venue</Label>
        <Input
          id="venue"
          value={values.venue}
          onChange={(event) => updateField("venue", event.target.value)}
          required
          minLength={2}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={values.address}
          onChange={(event) => updateField("address", event.target.value)}
          required
          minLength={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="lat">Latitude</Label>
          <Input
            id="lat"
            type="number"
            step="any"
            min={-90}
            max={90}
            value={values.lat}
            onChange={(event) => updateField("lat", event.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lng">Longitude</Label>
          <Input
            id="lng"
            type="number"
            step="any"
            min={-180}
            max={180}
            value={values.lng}
            onChange={(event) => updateField("lng", event.target.value)}
            required
          />
        </div>
      </div>
      <p className="-mt-2 text-xs text-muted-foreground">
        Tip: in Google Maps, right-click the place and copy the coordinates.
      </p>

      <div className="flex flex-col gap-2">
        <Label htmlFor="date">Date and time</Label>
        <Input
          id="date"
          type="datetime-local"
          value={values.date}
          onChange={(event) => updateField("date", event.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={values.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            {EVENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {formatCategory(category)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Price (€, 0 = free)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min={0}
            value={values.price}
            onChange={(event) => updateField("price", event.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
          required
          minLength={10}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="image">Image URL (optional)</Label>
        <Input
          id="image"
          type="url"
          value={values.image}
          onChange={(event) => updateField("image", event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="externalLink">External link (optional)</Label>
        <Input
          id="externalLink"
          type="url"
          value={values.externalLink}
          onChange={(event) => updateField("externalLink", event.target.value)}
        />
      </div>

      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Submit for review"}
      </Button>
    </form>
  );
}
