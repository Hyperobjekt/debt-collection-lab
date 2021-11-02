import { embeddedImages, name, body, template, path } from "../partials/fields";
import seo from "../partials/seo";
import primaryTeam from "../partials/primaryTeam";
import secondaryTeam from "../partials/secondaryTeam";


const page = {
  file: "content/pages/about-us.mdx",
  label: "About Us",
  name: "About Us",
  extension: "mdx",
  format: "frontmatter",
  media_folder: "./images",
  public_folder: "./images",
  fields: [seo, path, name, template, embeddedImages, primaryTeam, secondaryTeam, body],
};

export default page;
