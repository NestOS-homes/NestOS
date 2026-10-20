
"use client";

import { useState } from "react";
import { Megaphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type NoticeAudience = "resident" | "staff" | "all";

type SendNoticeModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SendNoticeModal({
  open,
  onClose,
}: SendNoticeModalProps) {
  const [audience, setAudience] =
    useState<NoticeAudience>("resident");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  function handlePublish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !message.trim()) {
      setError("Please enter both a title and a message.");
      return;
    }

    // UI-only for now. Database publishing will be added later.
    console.log("Notice draft:", {
      audience,
      title: title.trim(),
      message: message.trim(),
      status: "published",
    });

    alert("Notice form validated. Database publishing is not connected yet.");

    setTitle("");
    setMessage("");
    setAudience("resident");
    setError("");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="send-notice-title"
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-blue/20 text-[#9aa8ff]">
              <Megaphone className="size-5" />
            </span>
            <div>
              <h2 id="send-notice-title" className="text-lg font-semibold">
                Send Notice
              </h2>
              <p className="text-sm text-muted-foreground">
                Publish an announcement to your property
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close modal"
            onClick={onClose}
          >
            <X />
          </Button>
        </header>

        <form onSubmit={handlePublish}>
          <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5">
            <fieldset className="space-y-2">
              <legend className="mb-2 text-sm font-medium">
                Audience <span className="text-destructive">*</span>
              </legend>

              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    ["resident", "Residents"],
                    ["staff", "Staff"],
                    ["all", "Everyone"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={audience === value}
                    onClick={() => setAudience(value)}
                    className={`rounded-xl border px-3 py-3 text-sm transition-colors ${
                      audience === value
                        ? "border-brand-blue bg-brand-blue/15 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="space-y-2">
              <label htmlFor="notice-title" className="text-sm font-medium">
                Notice title <span className="text-destructive">*</span>
              </label>
              <Input
                id="notice-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Water supply maintenance"
                maxLength={120}
                required
              />
              <p className="text-right text-xs text-muted-foreground">
                {title.length}/120
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="notice-message" className="text-sm font-medium">
                Message <span className="text-destructive">*</span>
              </label>
              <textarea
                id="notice-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write your announcement and any instructions..."
                rows={5}
                maxLength={3000}
                required
                className="w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
              <p className="text-right text-xs text-muted-foreground">
                {message.length}/3000
              </p>
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="rounded-xl border border-border bg-background/60 p-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Publish immediately</p>
              <p className="mt-1">
                The notice is intended for the selected audience.
                Recipient delivery will be connected in a later step.
              </p>
            </div>
          </div>

          <footer className="flex justify-end gap-2 border-t border-border p-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Megaphone className="mr-1 size-4" />
              Publish Notice
            </Button>
          </footer>
        </form>
      </section>
    </div>
  );
}
