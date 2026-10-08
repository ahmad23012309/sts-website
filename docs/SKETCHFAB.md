# 3D Models

Every vehicle page can carry an interactive 3D model embedded from Sketchfab.
The viewer, the credit line and the `/attributions` page are built and working.
What is missing is the models themselves.

## How a model reaches the site

1. Choose a model on Sketchfab and copy its page URL.
2. Add it to `assets/data/sketchfab-models.json` against the vehicle's slug:

   ```json
   {
     "toyota-coaster": {
       "url": "https://sketchfab.com/3d-models/some-coaster-0123456789abcdef0123456789abcdef",
       "accuracy": "representative"
     }
   }
   ```

3. Run `npm run sketchfab:apply`.

That fetches each model's real title, author, author profile and licence from
the Sketchfab API and writes `apps/web/src/lib/cms/models3d.ts`. The vehicle
picks it up automatically; nothing in the fleet data is touched.

Titles, authors and licences are fetched rather than typed in on purpose.
Nearly every model on Sketchfab requires its author to be credited wherever it
appears, and a credit copied by hand is a credit that eventually goes wrong.

### Finding candidates

`npm run sketchfab:search` reads the fleet from the site's own data, queries
Sketchfab for each vehicle twice — once for the exact variant, once for the
bare model — and writes everything it finds to
`assets/data/sketchfab-candidates.json` with the author, licence, face count
and like count of each.

It never picks one. Model quality varies enormously, and the wrong body shape
on a vehicle page is worse than no model at all, so a person chooses from the
list.

## accuracy: exact or representative

Set `accuracy` to `exact` only when the model really is that variant.
Otherwise leave it as `representative`, and the viewer prints a line saying the
model shows the body style and the vehicle supplied is the one in the
photographs.

This matters for this fleet. Toyota Coaster, Hiace, Prado, Land Cruiser, Civic,
Corolla and Fortuner are common enough that good models exist. Changan Karvaan
Plus, Jaecoo J5, Suzuki XBEE and the Pakistani Yaris ATIV X are market-specific
and almost certainly have none, so they will either take a representative model
or stay on photographs. A vehicle with no model is not a gap in the page: the
viewer simply does not appear and the gallery takes its place.

## Why the player is not loaded on sight

The Sketchfab player pulls several megabytes of script, geometry and textures.
Loading that automatically would undo the performance work everywhere else on
the site, for a feature most visitors will not use. The vehicle photograph is
shown with a "View in 3D" control over it, and the player is mounted only when
that is pressed.

## Network access

`sketchfab.com` and `api.sketchfab.com` must be reachable for the two scripts
to run. If this environment's network policy blocks them, add both under
Allowed domains in the environment's network settings, or run the scripts on a
machine that can reach Sketchfab and commit the result — the output is plain
source, so either route ends in the same place.
