import seo from "../partials/seo";
import { embeddedImages, name, body, template, path } from "../partials/fields";

const galleryImages = {
  label: "Gallery Images",
  name: "galleryImages",
  widget: "list",
  summary: "{{fields.image}}",
  field: { label: "Image", name: "image", widget: "image" },
};

const page = {
  file: "content/pages/arts-and-storytelling/index.mdx",
  label: "Art & Storytelling",
  name: "Art & Storytelling",
  extension: "mdx",
  format: "frontmatter",
  media_folder: "../images",
  public_folder: "../images",
  fields: [seo, path, name, template, embeddedImages, galleryImages, body],
};

export default page;
