/*
 * Makes Clerk's sign-in and account screens match the NestOS dark theme.
 * Colours here mirror the ones in globals.css.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: "#ec3a8d",
    colorPrimaryForeground: "#ffffff",
    colorBackground: "#1b1b21",
    colorForeground: "#f8f8fb",
    colorMuted: "#26262e",
    colorMutedForeground: "#9a9aa5",
    colorNeutral: "#ffffff",
    colorInput: "#16161b",
    colorInputForeground: "#f8f8fb",
    colorBorder: "#34343e",
    colorRing: "#6c7bff",
    colorDanger: "#ff6868",
    colorSuccess: "#44e7a7",
    colorShadow: "rgba(0, 0, 0, 0.6)",
    colorModalBackdrop: "rgba(5, 5, 8, 0.75)",
    fontFamily: "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif",
    borderRadius: "0.75rem",
  },
  options: {
    logoPlacement: "none" as const, // our own NestOS logo is shown on the page instead
    socialButtonsVariant: "blockButton" as const,
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full max-w-none rounded-[20px] border border-border shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]",
  },
};
