import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    "html, body": {
      backgroundColor: "#070b12",
      color: "#e8f0fe",
      fontFamily: "'DM Sans', sans-serif",
      minHeight: "100vh",
    },
    body: {
      backgroundImage: `
        radial-gradient(circle at 15% 15%, rgba(167,139,250,0.07) 0%, transparent 55%),
        radial-gradient(circle at 85% 75%, rgba(236,72,153,0.06) 0%, transparent 50%),
        linear-gradient(rgba(167,139,250,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(167,139,250,0.03) 1px, transparent 1px)
      `,
      backgroundSize: "100% 100%, 100% 100%, 52px 52px, 52px 52px",
      backgroundAttachment: "fixed",
    },
    "*::selection": { backgroundColor: "rgba(167,139,250,0.12)", color: "#e8f0fe" },
  },

  theme: {
    tokens: {
      colors: {
        bg:              { value: "#070b12" },
        "bg.2":          { value: "#0c1220" },
        surface:         { value: "#111827" },
        "surface.2":     { value: "#16202f" },
        "surface.3":     { value: "#1c2b40" },

        accent:          { value: "#a78bfa" },
        "accent.2":      { value: "#ec4899" },
        "accent.dim":    { value: "rgba(167, 139, 250, 0.12)" },
        "accent.border": { value: "rgba(167, 139, 250, 0.28)" },

        danger:          { value: "#f43f5e" },
        "danger.dim":    { value: "rgba(244, 63, 94, 0.10)" },
        "danger.border": { value: "rgba(244, 63, 94, 0.30)" },

        success:         { value: "#10d9a0" },

        "text.1":        { value: "#e8f0fe" },
        "text.2":        { value: "#94aece" },
        "text.3":        { value: "#6080a8" },

        border:          { value: "rgba(255,255,255,0.09)" },
        "border.2":      { value: "rgba(255,255,255,0.15)" },

        "box.blue":      { value: "#3b82f6" },
        "box.red":       { value: "#f43f5e" },
      },

      fonts: {
        display: { value: `'Space Grotesk', sans-serif` },
        body:    { value: `'DM Sans', sans-serif` },
      },

      fontSizes: {
        "display.hero": { value: "54px" },
        "display.lg":   { value: "38px" },
        "display.md":   { value: "22px" },
        "display.sm":   { value: "20px" },
        "display.xs":   { value: "17px" },
        "body.lg":      { value: "16px" },
        "body.md":      { value: "14px" },
        "body.sm":      { value: "13px" },
        "body.xs":      { value: "12px" },
        label:          { value: "11px" },
        "label.xs":     { value: "10px" },
      },

      lineHeights: {
        hero:    { value: "1.08" },
        tight:   { value: "1.1" },
        normal:  { value: "1.4" },
        relaxed: { value: "1.65" },
      },

      letterSpacings: {
        hero:   { value: "-1.8px" },
        title:  { value: "-0.4px" },
        wide:   { value: "0.5px" },
        wider:  { value: "0.8px" },
        widest: { value: "1.2px" },
      },

      radii: {
        sm:   { value: "8px" },
        md:   { value: "14px" },
        lg:   { value: "20px" },
        xl:   { value: "26px" },
        pill: { value: "100px" },
      },

      shadows: {
        "glow.accent":  { value: "0 0 16px rgba(167,139,250,0.35)" },
        "glow.button":  { value: "0 12px 36px rgba(167,139,250,0.4)" },
        "glow.card":    { value: "0 0 0 1px #a78bfa, 0 0 40px rgba(167,139,250,0.15), inset 0 0 30px rgba(167,139,250,0.04)" },
        "glow.pip":     { value: "0 0 8px rgba(167,139,250,0.7)" },
        "glow.pip.red": { value: "0 0 8px rgba(244,63,94,0.7)" },
        "glow.dot":     { value: "0 0 6px #10d9a0" },
        navbar:         { value: "inset 0 -1px 0 rgba(255,255,255,0.055)" },
      },
    },

    semanticTokens: {
      colors: {
        // Override Chakra's default light-mode bg/fg so globalCss resolves dark
        bg:           { value: "#070b12" },
        fg:           { value: "#e8f0fe" },
        "ui.bg":      { value: "{colors.bg}" },
        "ui.surface": { value: "{colors.surface}" },
        "ui.text":    { value: "{colors.text.1}" },
        "ui.muted":   { value: "{colors.text.2}" },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
export default system;
