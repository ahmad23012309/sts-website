import type { SketchfabModel } from "./types";

/**
 * Sketchfab models, keyed by vehicle slug.
 *
 * Chosen by the client from Sketchfab and recorded here by model id. The id is
 * the 32-character suffix of the model's own URL, which is why the links can be
 * read without reaching Sketchfab.
 *
 * `authorName` and `license` are null on every entry because this environment
 * cannot reach Sketchfab to fetch them. The viewer handles that by leaving the
 * player's own information bar switched on, so each model is credited to its
 * author by Sketchfab itself. Running `npm run sketchfab:apply` from a machine
 * that can reach Sketchfab fills these in and the credit becomes ours.
 *
 * Accuracy is "representative" throughout: these are the right body styles, not
 * the exact Pakistani-market trims, and the viewer says so beneath the model.
 */
const representative = (
  slug: string,
  uid: string,
  title: string,
): SketchfabModel => ({
  uid,
  title,
  modelUrl: `https://sketchfab.com/3d-models/${slug}-${uid}`,
  authorName: null,
  authorUrl: null,
  license: null,
  accuracy: "representative",
});

const prado = representative(
  "toyota-land-crusier-prado-2021",
  "b7df62bb069c44a18cebdeaec1d41a03",
  "Toyota Land Crusier Prado 2021",
);

export const models3d: Record<string, SketchfabModel> = {
  "toyota-hiace": representative(
    "toyota-hiace-passenger-van-l2h3-glx-2020",
    "ec15323d57f04ba4976f0e758298b25c",
    "Toyota Hiace Passenger Van L2H3 GLX 2020",
  ),
  "toyota-prado-txl": prado,
  "toyota-prado-tx": prado,
  "toyota-fortuner-g": representative(
    "toyota-fortuner-2021",
    "7c6a3dc9a04f45658d1289cfd20accd7",
    "Toyota Fortuner 2021",
  ),
  "toyota-land-cruiser-axg": representative(
    "2022-toyota-land-cruiser-300-vxr",
    "3dfcd7904cdb4e52afa3ce59fa59e1a5",
    "2022 Toyota Land Cruiser 300 VX.R",
  ),
  "kia-sportage-awd": representative(
    "kia-sportage-interior-2019",
    "c55735b0036d4c2d998bb8f9414a50c6",
    "Kia Sportage Interior 2019",
  ),
  "toyota-corolla-altis": representative(
    "toyota-corolla-altis-2018",
    "11fa3ac64ef64cc0a6208e54d792f2d3",
    "Toyota Corolla Altis 2018",
  ),
  "honda-civic-oriel": representative(
    "2016-honda-civic-sedan",
    "1c8146e84c7a43068eed475db016ef5e",
    "2016 Honda Civic Sedan",
  ),
  "daihatsu-copen-robe": representative(
    "2020-daihatsu-copen-gr-sport",
    "2552efba1add4dfdab4378edc128d768",
    "2020 Daihatsu Copen GR Sport",
  ),
  "kia-sorento-awd": representative(
    "kia-sorento-2021",
    "3f3c0aab11124020ae0cf045361f241c",
    "Kia Sorento 2021",
  ),
  "gwm-haval-h6-hev": representative(
    "haval-h6-unsub",
    "f7752aeb48ed4c8e861db51ffbae1bc1",
    "Haval H6",
  ),
};
