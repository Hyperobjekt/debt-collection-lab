const seo = {
  label: "Page Metadata",
  name: "meta",
  widget: "object",
  hint:
    "Page metadata contains page specific values for search engine optimization and social sharing.  If values are not set, the default values set for metadata in the site config will be used.",
  collapsed: true,
  fields: [
    {
      label: "Title",
      name: "title",
      widget: "string",
      hint:
        "this is used for the browser tab, the page name in search results, or when the page is shared on social platforms (<title> tag)",
      required: false,
    },
    {
      label: "Description",
      name: "description",
      widget: "string",
      required: false,
      hint:
        "max 160 characters, this is used as the description in search results or when the page is shared on social platforms",
    },
    {
      label: "Social Image",
      name: "image",
      widget: "image",
      required: false,
      hint: "this is used when the page is shared on social platforms",
    },
    {
      label: "Keywords",
      name: "keywords",
      widget: "string",
      required: false,
    },
  ],
};

export default seo;
