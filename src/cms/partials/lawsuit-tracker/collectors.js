const collectors = {
  label: "Top collectors",
  name: "collectors",
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
      widget: "string",
      required: false,
    },
  ],
};

export default collectors;
