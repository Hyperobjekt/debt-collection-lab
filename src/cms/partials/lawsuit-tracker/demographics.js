const entry = {
  label: "Demographics Chart",
  name: "demographics",
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
      label: "Breakdown Title",
      name: "BREAKDOWN_TITLE",
      widget: "string",
      required: true,
    },
    {
      label: "Breakdown Label",
      name: "BREAKDOWN_LABEL",
      widget: "string",
      required: true,
    },
    {
      label: "Chart Title (Counts by Tract Racial Majority)",
      name: "COUNT_CHART_TITLE",
      widget: "string",
      required: true,
    },
    {
      label: "Chart Tooltip (Counts by Tract Racial Majority)",
      name: "COUNT_CHART_TOOLTIP",
      widget: "string",
      required: true,
    },
    {
      label: "Chart Title (Proportion by Racial/Ethnic Group)",
      name: "PROPORTION_CHART_TITLE",
      widget: "string",
      required: true,
    },
    {
      label: "Chart Tooltip (Proportion by Racial/Ethnic Group)",
      name: "PROPORTION_CHART_TOOLTIP",
      widget: "string",
      required: true,
    },
    {
      label: "Footnote",
      name: "FOOTNOTE",
      widget: "string",
    },
  ],
};

export default entry;
