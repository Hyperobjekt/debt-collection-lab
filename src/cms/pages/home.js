import seo from "../partials/seo";

const page = {
  file: "content/pages/index.mdx",
  label: "Home",
  name: "Home",
  fields: [
    {
      label: "Type",
      name: "type",
      widget: "hidden",
      default: "page",
    },
    {
      label: "Title",
      name: "title",
      widget: "string",
      default: "",
      required: false,
    },
    seo,
  ],
};

export default page;
