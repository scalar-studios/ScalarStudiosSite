# Scalar Studios Website
Official website source for Scalar Studios.

This project is a lightweight static site built with plain HTML, CSS, and JavaScript, plus a small amount of Markdown rendering for project/mod previews.

## What This Site Includes
- Main landing page and quick links to active projects
- Mods and modpacks pages
- Wiki index and dedicated wiki pages
- Social and external pages
- Shared custom navbar component for consistent navigation

## Tech Stack
- HTML (page structure)
- CSS (site styling, cards, wiki layouts)
- Vanilla JavaScript (shared components and small interactive features)
- `md-block` web component for rendering selected external README content

## Project Structure
Key files and folders:
- `index.html`: homepage
- `projects.html`: software project list
- `mods.html`: mod and modpack page
- `wikis.html`: wiki landing page
- `wikis/`: individual wiki documents
- `styles/`: shared stylesheets (`styles.css`, `image_card.css`, `markdown_frame.css`, `wiki_doc.css`, etc.)
- `scripts/`: reusable JavaScript (`headerFooterManager.js`, wiki helpers, image carousel)
- `images/`: local static assets


## Editing Notes
- Keep shared visual rules in `styles/styles.css` where possible.
- Use component-specific CSS files for scoped styles (`image_card.css`, `markdown_frame.css`, `wiki_doc.css`).
- Reuse shared HTML patterns (image cards, project cards, wiki sections) for consistency.
- Keep JavaScript small and focused; this repo intentionally avoids heavy frameworks.

And no, we are definitely not hiding anything suspicious in here... probably.