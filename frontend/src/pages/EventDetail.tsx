import { useParams } from "react-router-dom";
import { PageTitle } from "@/components/PageTitle";

export function EventDetail() {
  const { id } = useParams();

  return <PageTitle>Event {id}</PageTitle>;
}
