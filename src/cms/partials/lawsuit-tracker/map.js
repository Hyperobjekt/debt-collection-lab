const entry = {
  label: "Lawsuits Map",
  name: "map",
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
      label: "Legend Label",
      name: "LABEL",
      widget: "string",
      required: true,
    },
    {
      label: "Footnote",
      name: "FOOTNOTE",
      widget: "string",
      required: false,
    },
  ],
};

export default entry;
