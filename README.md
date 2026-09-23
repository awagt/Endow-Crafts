# Endow Crafts website

One-page website for **Endow Crafts** (registered under Q Express Trading, Qatar).
Hosted free on **GitHub Pages**. Content is edited without code in **Pages CMS** (https://app.pagescms.org).

---

## 1. Put the site online (one-time, ~15 minutes)

1. **Create a GitHub account** for the business at https://github.com (e.g. `endowcrafts`).
2. **Create a repository**: click **+ → New repository**, name it `endowcrafts` (or anything), set it to **Public**, and click **Create repository**.
3. **Upload the files — they must sit at the top level, not inside a folder.**
   - Unzip the download, then **open the unzipped folder** so you can see `index.html`, `_data`, `assets` and the other files.
   - Select **everything inside it** (Ctrl+A on Windows, Cmd+A on Mac) and drag those items onto the GitHub upload page. Don't drag the folder itself.
   - Click **Commit changes**.
   - **Check:** on the repository's main page you should see `_data`, `assets`, `images`, `index.html` and `_config.yml` straight away, without clicking into another folder. If you see only one folder name, the files are one level too deep. Start again with a fresh repository.
   - **The `.pages.yml` file is hidden** on Mac and Windows, so it's easy to miss. If it isn't in the repository after uploading, click **Add file → Create new file**, name it `.pages.yml` (with the dot), paste in the contents of `pages-cms-config.txt`, and commit.
4. **Turn on GitHub Pages**: repository **Settings → Pages**. Under *Build and deployment* choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
5. After 1–2 minutes the site is live at `https://<github-username>.github.io/<repository-name>/`. The address appears at the top of **Settings → Pages**.

## 2. Set up the editing dashboard (one-time)

1. Go to https://app.pagescms.org and click **Sign in with GitHub** (use the business GitHub account).
2. When asked, **install the Pages CMS GitHub App** and give it access to this repository.
3. Open the repository. The menu on the left (Contact & settings, Homepage, Portfolio, Services…) comes from `.pages.yml`.
4. **Give the owner access**: in Pages CMS, open the repository's **Collaborators** settings and invite the owner's email. She does not need a GitHub account; she signs in from the email invitation.

## 3. Optional: your own domain (e.g. www.endowcrafts.com)

1. Buy the domain from any registrar.
2. In GitHub: **Settings → Pages → Custom domain**, enter the domain and save. Follow GitHub's DNS instructions at the registrar, then tick **Enforce HTTPS** once it's available.
3. In `_config.yml`, set `url: "https://www.endowcrafts.com"` so the sitemap uses the right address.

## How it's built

| Where | What |
|---|---|
| `_data/*.yml` | **All content**: text, photos, portfolio, services, testimonials, contact details. Pages CMS edits these files. |
| `images/` | Uploaded photos. |
| `index.html` | Page layout (a Jekyll template that reads `_data`). If the content files can't be found, the page shows a red "Setup problem" bar at the top. |
| `assets/css/site.css` | Design: colours, fonts, spacing. Colours are defined once at the top. |
| `assets/js/site.js` | Filters, lightbox, forms, and the illustrated placeholders shown until real photos are uploaded. |
| `.pages.yml` | Pages CMS dashboard layout: menu items, field labels, help text. `pages-cms-config.txt` is a visible copy, for pasting if the hidden file gets missed. |

- **Photos**: any image field left empty shows an illustrated "PHOTO PLACEHOLDER" graphic, so the site never shows broken images.
- **Forms** check what the visitor typed, then open WhatsApp with the enquiry filled in (sent to the WhatsApp number in *Contact & settings*). GitHub Pages can't send email by itself. To also receive form emails, connect a form service such as Formspree inside `handleSubmit` in `assets/js/site.js`.
- **Every change is a commit**, so any earlier version can be restored from the repository's history.
