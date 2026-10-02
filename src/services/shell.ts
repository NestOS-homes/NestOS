import { manager, notifications, properties } from "@/data/mock/property";

/** Data the app frame (sidebar + top bar) needs on every page. */
export async function getShellData() {
  return { properties, manager, notifications };
}
