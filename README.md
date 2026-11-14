# Endow Crafts website

Live at **https://endowcrafts.online** (GitHub Pages). Built & designed by Abdul Wajid.

## Updating content (no coding needed)

Open a file on GitHub, click the pencil icon, edit, then **Commit changes**. The site updates in 1–2 minutes.

| To change… | Edit |
|---|---|
| Gallery pieces & featured products | `content/gallery.json` — each piece has a title, image, categories, material, description, options and occasion. Set `"featured": true` to show it in **Featured Pieces**. |
| Customer reviews | `content/testimonials.json` — add real reviews and set `"placeholder": false`. The reviews section stays hidden until at least one real review exists. |
| Founder photo | Upload the photo to `images/` (e.g. `images/founder.webp`, portrait), then set `"founder_photo": "images/founder.webp"` in `content/settings.json`. |
| Google Analytics | Put your GA4 ID (e.g. `G-AB12CD34EF`) in `"google_analytics_id"` in `content/settings.json`. |
| Founder story text | In `index.html`, search for `Meet the founder`. |

**Gallery categories:** `personal`, `corporate`, `events`, `qatar`, `accessories`, `cricut`, `seasonal`, `kids`.

**Photos:** use `.webp` or `.jpg`, about 1400px wide, under 300 KB. Upload them to `images/` and refer to them as `images/your-photo.webp`.

## Structure

- `index.html`: the page
- `assets/css/style.css`: design (colours are defined at the top)
- `assets/js/main.js`: animations, gallery, lightbox, enquiry forms
- `content/`: editable content
- `images/`: photos (`images/sm/` holds smaller copies for phones)
- `Endow_Crafts_brand_intro_commercial.mp4` / `.webm`: hero film
- `.nojekyll`: tells GitHub Pages to publish the files as they are
