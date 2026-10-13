import { notifications, properties } from "@/data/mock/property";
import { getCurrentManager } from "./session";

/** Data the app frame (sidebar + top bar) needs on every page. */
export async function getShellData() {
  const manager = await getCurrentManager();
  return { properties, manager, notifications };
}
