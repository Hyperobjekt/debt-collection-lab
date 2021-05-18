import seo from "../partials/seo";
import { embeddedImages, name, body, template, path } from "../partials/fields";

const galleryImages = {
  label: "Gallery Images",
  name: "gallery",
  widget: "list",
  summary: "{{fields.caption}}",
  fields: [
    { label: "Attribution", name: "author", widget: "string" },
    { label: "Caption", name: "caption", widget: "text" },
    { label: "Image", name: "image", widget: "image" },
    {
      label: "Alternate Text",
      name: "alt",
      widget: "string",
      hint:
        "this text is provided to users who use a screen reader when focusing on the image.",
    },
    { label: "Order", name: "order", widget: "number", value_type: "int" },
  ],
};

const page = {
  file: "content/pages/arts-and-storytelling.mdx",
  label: "Art & Storytelling",
  name: "Art & Storytelling",
  extension: "mdx",
  format: "frontmatter",
  media_folder: "../images",
  public_folder: "../images",
  fields: [seo, path, name, template, embeddedImages, galleryImages, body],
};

export default page;
