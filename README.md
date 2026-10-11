# Señor Valentin Tacos

A static promotional website for a taco business featuring a landing page, menu pages, story/about content, location/schedule details, and a browser-based menu editor.

## Current status

- Frontend-only project (HTML/CSS/JavaScript) with no backend or database.
- `js/main.js` drives truck schedule/location behavior on `index.html` and `location.html`.
- `menu-editor.html` and `js/landing.js` manage “Today’s Menu” content and visibility on the landing page.
- Menu edits are saved in browser localStorage (`valentin.menu.items.v1`) and are local to that browser/device (not shared server-side or cross-device).

## Project structure

- `index.html` — landing page with hero banner, location status, CTA buttons, and Today’s Menu
- `menu.html` — menu page with featured food and item layout
- `story.html` — brand story/about page
- `location.html` — current/next stop display, scheduled event list, and map
- `menu-editor.html` — edit interface for menu item fields and landing-page visibility checkboxes
- `css/styles.css` — global site styling and responsive layout
- `js/main.js` — schedule logic, current/next stop detection, and map update behavior
- `js/landing.js` — menu item sanitize/load/save/render logic for landing page + menu editor
- `images/` — banner, avatar, and food photography

## Business logic

The site uses a JavaScript `schedule` array in `js/main.js` to determine:

- the current active event stop if we are operating today
- otherwise, the next upcoming public stop
- the correct date range for each stop
- the address and hours for the selected stop
- the map destination for the selected location

The landing and location pages both read from this data so the site stays synchronized.

`js/landing.js` powers menu behavior:

- loads menu items (defaults or saved values),
- sanitizes user-edited item fields,
- renders only items where `showOnLanding === true` in Today’s Menu,
- supports add/remove/edit/save flow in `menu-editor.html`.

## Location data model

Each stop object includes:

- `name`
- `address`
- `start`
- `end`
- `hours`
- `lat`
- `lon`

The date fields are expected in `YYYY-MM-DD` format.

## Recent updates (most recent coding-agent session)

- Resolved a menu-visibility issue where unchecking an item in `menu-editor.html` could fail to keep it off the landing page.
- Root cause: `loadItems()` in `js/landing.js` treated storage values that sanitized to an empty array as invalid/missing and replaced them with `DEFAULT_MENU_ITEMS`, which could undo intentional empty/unchecked states.
- Updated `loadItems()` behavior to:
  - use defaults only when storage key is absent (`saved === null`),
  - treat non-array JSON as invalid and fall back to defaults,
  - keep a valid saved empty array as empty,
  - fall back to defaults when a non-empty malformed array sanitizes to no valid items,
  - preserve saved `showOnLanding: false` values.
- Validation from that session included:
  - `node --check js/landing.js`
  - Node VM checks for missing storage, saved empty arrays, malformed arrays, preserved unchecked flags, and save/reload visibility where only checked items remained visible.

## Current behavior

- If a scheduled stop is active today, the site shows it as the current location.
- If the business is closed, the site shows the next upcoming public stop.
- Clicking a stop on the location page updates the map destination and Google Maps link.
- On the landing page, Today’s Menu only shows items marked to display in the editor.
- Menu editor settings persist locally in the browser and are not shared across devices.

## Contact info

- Phone: (417) 505-8848
- Facebook: https://www.facebook.com/profile.php?id=61554289633413
- Email: ericvalentin1212@gmail.com

## Credits

Proudly built by S&A Thomure Enterprises LLC
Website: https://thomureapiaries.com

## Notes for future edits

When updating the site later, the main content points to edit are:

1. `js/main.js` for schedule, dates, addresses, and hours
2. `index.html` for homepage hero and callout copy
3. `menu.html` for menu items and pricing
4. `story.html` for business story content
5. `menu-editor.html` and `js/landing.js` for Today’s Menu editor/visibility behavior
6. `css/styles.css` for design and spacing adjustments
7. `images/` for visual assets

## Deployment

This project is a static HTML/CSS/JS site. It can be hosted on GitHub Pages, Netlify, or any static host without additional build steps.

## GitHub migration note

This repo was intended to be kept clean and easy to maintain. Avoid uploading editor metadata, caches, virtual environment folders, or temporary local files.
