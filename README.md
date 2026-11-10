# Fruit Search

A predictive search box built with vanilla JavaScript, presented as a small portfolio case study.
No framework, no build step, no dependencies.

## Features

- Ranks prefix matches ahead of other matches
- Highlights the matched text using DOM nodes (no `innerHTML`)
- Full keyboard support: Arrow keys, Enter, Escape
- ARIA combobox pattern with a live status message for screen readers
- Light and dark themes, responsive layout

## Run locally

1. Open the folder in VS Code.
2. Install the recommended extensions when prompted.
3. Right-click `index.html` and choose **Open with Live Server**.

You can also open `index.html` directly in a browser.

## Project structure

```
fruit-search/
├── index.html        Page content and case study
├── css/styles.css    Design tokens, layout, themes
├── js/data.js        Fruit list
└── js/main.js        Ranking, rendering, events, theme toggle
```

## Before publishing

Replace the placeholder name and the GitHub, LinkedIn and email links in `index.html`.
