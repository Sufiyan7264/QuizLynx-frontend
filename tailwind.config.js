/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}"
  ],
  darkMode: 'class',
  theme: {
    
    extend: {
      colors: {
        // Semantic tokens that map to css variables in styles.css
        text: "var(--color-text)",
        primary: "var(--color-primary)",
        'primary-foreground': "var(--color-primary-foreground)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        icon: "var(--icon-filter)",
        danger: "var(--color-danger)",
        bg: "var(--color-bg)",
        label: "var(--label-color)",
        surface: "var(--color-surface)",
        'muted-text': "var(--color-muted-text)",
        border: "var(--color-border)",
        glass: "var(--color-glass)",
        "border-hover": "var(--color-border-hover)",
       "option-hover": "var(--color-option-hover)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial"],
        display: ["Poppins", "Inter", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        'card': '0 6px 18px rgba(15, 23, 42, 0.06)',
        'card-dark': '0 8px 24px rgba(2,6,23,0.6)',
        'focus-ring': '0 0 0 4px rgba(99,102,241,0.12)', // for primary focus
      },
      borderRadius: {
        'xl': '1rem',
      },
      transitionProperty: {
        'colors': 'color, background-color, border-color, fill, stroke',
        'height': 'height, max-height'
      },
    },
  },
  plugins: [],
}
