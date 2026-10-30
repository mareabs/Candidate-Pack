# HomeToGo Group candidate pack

A book-style website for candidates: one book per company (HomeToGo, Smoobu, Interhome, SECRA). Pages turn sideways, fit the screen without scrolling, and work best on a phone.

## Put it online with GitHub Pages (first time)

You need a GitHub repository that is **public**. GitHub only publishes websites from private repositories on paid plans.

**1. Make the repository public**
1. Open your repository on github.com and click **Settings** (top right of the repository, the gear icon).
2. Stay on **General** and scroll to the very bottom, to **Danger Zone**.
3. Click **Change visibility**, then **Change to public**, and confirm. GitHub may ask you to type the repository name.

**2. Upload the files**
1. Unzip `candidate-pack-book.zip` on your computer and open the `candidate-pack-book` folder. Inside you should see `index.html`, `builder.html`, `README.md` and an `assets` folder.
2. On GitHub, go to the repository's main page (click its name at the top).
3. Click **Add file → Upload files**.
4. Select everything **inside** the `candidate-pack-book` folder (on a Mac: open the folder, press Cmd + A) and drag it into the upload box. Include the `assets` folder; GitHub keeps the folders inside it.
5. Scroll down and click **Commit changes**.

Check: the repository's main page should now list `index.html` and `assets` directly, not inside another folder. If you see only a folder called `candidate-pack-book`, or a `.zip` file, delete those and upload again.

**3. Switch on Pages**
1. Go to **Settings → Pages** (left menu, under "Code and automation").
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Under **Branch**, choose **main** and **/ (root)**, then click **Save**.
4. Wait one or two minutes and refresh the page. A box appears at the top: "Your site is live at `https://<your-username>.github.io/<repository-name>/`". Click **Visit site**.

You'll see the company picker. That address is your site.

## Send a candidate their book

Open `https://<your-username>.github.io/<repository-name>/builder.html`, fill in the form and click **Copy link**. Empty fields fall back to neutral wording.

The link looks like this:

```
https://<your-username>.github.io/<repository-name>/?e=smoobu&name=Anna&hm=Jan%20Meier&recruiter=Issy
```

Use first names only. Anything in the link can be read by whoever has it.

## Change the text later

All text lives in `assets/js/content.js`. To change it:

1. On GitHub, open `assets` → `js` → `content.js`.
2. Click the pencil icon (Edit), make the change, then click **Commit changes**.
3. The site updates within a minute or two. Refresh it to check.

Each page has a fixed size, like a printed page, so text has a length budget. The comments in `content.js` show the rough limit for each field. After editing, look at the page on your phone to check nothing is cut off at the bottom.

To swap a photo, upload a new image into `assets/img` with the same file name. Landscape photos around 1400 pixels wide work best.

## Companies

- `"status": "draft"` shows a yellow "not ready for candidates" banner. SECRA is draft until its benefits are confirmed.
- To add a company, copy an existing block in `entities` in `content.js`, give it a new short id (lowercase, no spaces) and change the text and photos. It appears in the picker and the link builder automatically.

## PDF version

Open a book in Chrome, press Ctrl/Cmd + P and choose **Save as PDF**, with **Background graphics** on. You get one phone-sized page per book page.

## How it behaves

- **Phones:** swipe left or right and the page follows your finger. Tapping the right edge also turns it.
- **Computers:** arrow buttons, the dots, arrow keys, mouse wheel or trackpad.
- Screen readers announce each page. People who set "reduce motion" get a fade instead of the page turn.

## Before candidates see it

- [ ] Confirm the GetAway Group and Doppelgänger lines with Comms.
- [ ] Align the leadership principle one-liners with the official definitions.
- [ ] Get SECRA's benefits from People Ops, replace the bracketed text, then set `status: "ready"`.
- [ ] Check the Interhome benefits by country.
- [ ] Decide whether Smoobu candidates see the Group interview journey or Smoobu's own process.
- [ ] Confirm the photos, logos and 3D icons are cleared for external use.
- [ ] Add careers and LinkedIn links in each `links` block.
