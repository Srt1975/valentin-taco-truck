# Señor Valentin Tacos

A static promotional website for a taco business featuring a home page, menu, story/about page, and a location/schedule page with dynamic stop information.

## Project structure

- `index.html` — home page with hero banner, location status, CTA buttons, and menu teaser
- `menu.html` — menu page with featured food and item layout
- `story.html` — brand story/about page
- `location.html` — current/next stop display, scheduled event list, and map
- `css/styles.css` — global site styling and responsive layout
- `js/main.js` — schedule logic, current/next stop detection, and map update behavior
- `images/` — banner, avatar, and food photography

## Business logic

The site uses a JavaScript `schedule` array in `js/main.js` to determine:

- the current active event stop if we are operating today
- otherwise, the next upcoming public stop
- the correct date range for each stop
- the address and hours for the selected stop
- the map destination for the selected location

The homepage and location page both read from this data so the site stays synchronized.

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

## Current behavior

- If a scheduled stop is active today, the site shows it as the current location.
- If the business is closed, the site shows the next public stop.
- Clicking a stop on the location page updates the embedded map and Google Maps link.
- The site uses direct Google Maps links instead of an embedded iframe-only approach for reliability.

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
5. `css/styles.css` for design and spacing adjustments
6. `images/` for visual assets

## Deployment

This project is a static HTML/CSS/JS site. It can be hosted on GitHub Pages, Netlify, or any static host without additional build steps.

## GitHub migration note

This repo was intended to be kept clean and easy to maintain. Avoid uploading editor metadata, caches, virtual environment folders, or temporary local files.
