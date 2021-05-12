const entry = {
  label: "Lawsuits By Year",
  name: "lawsuits",
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
      label: "Pandemic Comparison",
      name: "PANDEMIC_COMPARISON",
      widget: "text",
      hint:
        "This description is only shown when there is more than one year of data available.",
    },
    {
      label: "Footnote",
      name: "FOOTNOTE",
      widget: "string",
    },
  ],
};

export default entry;
