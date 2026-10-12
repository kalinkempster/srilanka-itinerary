# Sri Lanka, 5–18 December

Kal and Lara's trip site: route map, day-by-day plan, budget tracker and checklist.

Plain HTML, CSS and JavaScript. No build step and no dependencies.

## Files

| File | What it is |
|---|---|
| `index.html` | The page |
| `styles.css` | All styles, including dark mode |
| `app.js` | Trip data (stops, days, budget categories, checklist) and all interactivity |
| `images/` | Photos used on the page |

To change the plan, edit the data near the top of `app.js`: `stops`, `days`, `cats` (budget categories and planned ranges) and `checks` (checklist items).

To add a photo to a day, put the file in `images/` and add `img:"images/your-file.jpg"` to that day in `days`. Days without a photo show a drawn scene.

## Run it locally

Open `index.html` in a browser. That's it.

## Put it online with GitHub and Vercel

1. Create a new repository on GitHub, for example `sri-lanka-2026`.
2. Upload every file in this folder, keeping the `images` folder (on github.com: Add file › Upload files, then drag the folder contents in).
3. On vercel.com, choose Add New › Project and import the repository.
4. Framework preset: **Other**. Leave the build command and output directory empty.
5. Deploy. Vercel gives you a `*.vercel.app` address.

Every later push to the repository redeploys the site automatically.

## Saving data

The budget tracker and checklist save in each browser's local storage. They don't sync between devices or people.

To share with Lara: **Export data** in the budget tracker downloads a `.json` file. She uses **Import data** to load it. Importing replaces what's in her browser.

## Privacy

The page has `noindex` set so search engines skip it, but anyone with the link can open it. Don't put booking references or passport details on it. To lock it down, look at Vercel's Deployment Protection settings for the project.
