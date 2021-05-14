import { embeddedImages, name, body, path } from "../partials/fields";
import seo from "../partials/seo";

const page = {
  file: "content/pages/index.mdx",
  label: "Home",
  name: "Home",
  extension: "mdx",
  format: "frontmatter",
  media_folder: "./images",
  public_folder: "./images",
  fields: [seo, path, name, embeddedImages, body],
};

export default page;
