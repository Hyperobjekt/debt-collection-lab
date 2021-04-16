import seo from "../partials/seo";

const page = {
  file: "content/pages/arts-and-storytelling.mdx",
  label: "Art & Storytelling",
  name: "Art & Storytelling",
  extension: "mdx",
  format: "frontmatter",
  fields: [
    {
      label: "Title",
      name: "title",
      widget: "string",
      default: "",
      required: false,
    },
    {
      label: "Body",
      name: "body",
      widget: "markdown",
      default: "",
      required: false,
    },
    seo,
  ],
};

export default page;
