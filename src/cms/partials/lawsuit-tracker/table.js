const entry = {
  label: "Lawsuits Table",
  name: "table",
  widget: "object",
  collapsed: true,
  fields: [
    {
      label: "Title",
      name: "TITLE",
      widget: "string",
      required: true,
    },
    {
      label: "Description",
      name: "DESCRIPTION",
      widget: "text",
    },
    {
      label: "Footnote",
      name: "FOOTNOTE",
      default: "",
      widget: "string",
    },
  ],
};

export default entry;
