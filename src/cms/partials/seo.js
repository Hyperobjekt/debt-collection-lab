const seo = {
  label: "SEO Settings",
  name: "seo",
  widget: "object",
  collapsed: true,
  fields: [
    {
      label: "Title",
      name: "title",
      widget: "string",
      required: false,
    },
    {
      label: "Meta Description",
      name: "description",
      widget: "text",
      required: false,
    },
    {
      label: "Meta Keywords",
      name: "keywords",
      widget: "text",
      required: false,
    },
    {
      label: "Image",
      name: "image",
      widget: "image",
      required: false,
      default: "/images/metaImage.png",
    },
  ],
};

export default seo;
