const seo = {
  label: "Page Metadata",
  name: "meta",
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
      label: "Description",
      name: "description",
      widget: "text",
      required: false,
    },
    {
      label: "Keywords",
      name: "keywords",
      widget: "text",
      required: false,
    },
    {
      label: "Social Image",
      name: "image",
      widget: "image",
      required: false,
      default: "/images/metaImage.png",
    },
  ],
};

export default seo;
