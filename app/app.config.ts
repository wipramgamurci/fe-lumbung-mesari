export default defineAppConfig({
  ui: {
    colors: {
      primary: "green",
      neutral: "slate",
    },
    card: {
      slots: {
        // UCard v4 uses the `root` slot. Larger radius + subtle shadow to match
        // the design reference. In dark mode, lift the card above the page
        // (elevated) instead of sitting darker than the background.
        root: "rounded-2xl shadow-sm dark:bg-elevated dark:ring-elevated",
      },
    },
  },
});
