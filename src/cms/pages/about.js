import { embeddedImages, name, body, template, path } from "../partials/fields";
import seo from "../partials/seo";

const page = {
  file: "content/pages/about-us/index.mdx",
  label: "About Us",
  name: "About Us",
  extension: "mdx",
  format: "frontmatter",
  media_folder: "../images",
  public_folder: "../images",
  fields: [seo, path, name, template, embeddedImages, team, body],
};

export default page;
