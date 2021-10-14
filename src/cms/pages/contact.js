import { name, body, path } from "../partials/fields";
import seo from "../partials/seo";

const page = {
  file: "content/pages/contact-us.mdx",
  label: "Contact Us",
  name: "Contact Us",
  extension: "mdx",
  format: "frontmatter",
  media_folder: "./images",
  public_folder: "./images",
  fields: [seo, path, name, body],
};

export default page;
