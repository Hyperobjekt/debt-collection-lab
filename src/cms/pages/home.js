// import seo from "@/cms/partials/seo";

const page = {
  file: "content/pages/index.mdx",
  label: "Home",
  name: "Home",
  fields: [
    {
      label: "Layout",
      name: "layout",
      widget: "hidden",
      default: "contact",
    },
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
    // seo,
  ],
};

export default page;
