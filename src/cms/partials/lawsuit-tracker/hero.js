const hero = {
  label: "Hero",
  name: "hero",
  widget: "object",
  collapsed: true,
  fields: [
    {
      label: "Stats",
      name: "STATS",
      widget: "list",
      max: 3,
      summary: "{{fields.id}}",
      fields: [
        {
          label: "Metric",
          name: "id",
          widget: "select",
          options: [
            { label: "Lawsuit Total", value: "lawsuits" },
            { label: "% No Representation", value: "no_rep_percent" },
            {
              label: "% Default Judgments",
              value: "default_judgement_percent",
            },
            {
              label: "Default Judgments Total",
              value: "default_judgement",
            },
          ],
        },
        { label: "Description", name: "description", widget: "string" },
      ],
      required: true,
    },
  ],
};

export default hero;
