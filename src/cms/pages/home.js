import seo from "../partials/seo";

const page = {
  file: "content/pages/index.mdx",
  label: "Home",
  name: "Home",
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
