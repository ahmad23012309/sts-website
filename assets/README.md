# Asset Drop Folder

Upload files here through the GitHub web interface. Nothing in this folder is
served to the public — it is a staging area that gets processed into the build.

| Folder | What goes in it |
|---|---|
| `assets/brand/` | Logo files (SVG or AI preferred, PNG accepted), brand guideline documents, favicon source |
| `assets/fleet/` | Vehicle photographs, one subfolder per vehicle, named `make-model-variant` |
| `assets/data/` | Spreadsheets: rate card, fleet list, specifications, route distances, team details |

## How to upload

1. Open https://github.com/ahmad23012309/sts-website
2. Switch to the branch `claude/modest-ptolemy-5alllx`
3. Navigate into the folder you want
4. **Add file → Upload files** — drag in as many files as you like at once
5. **Commit directly to the branch**

There is no five-file limit here, and spreadsheets upload as-is. Raw `.xlsx` and
`.csv` are both fine.

## Naming

Vehicle photographs: `assets/fleet/toyota-yaris-ativ-x/01-front.jpg`.
Numbering controls the gallery order; the first image becomes the card thumbnail.
