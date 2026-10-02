import { redirect } from "next/navigation";

/** "/" opens the dashboard. */
export default function Home() {
  redirect("/dashboard");
}
