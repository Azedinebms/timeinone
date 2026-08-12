import {
  redirect,
} from "next/navigation";

export default function CalendarPage() {
  const currentYear =
    new Date().getFullYear();

  redirect(
    `/calendar/${currentYear}`,
  );
}