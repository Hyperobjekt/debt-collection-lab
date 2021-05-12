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
      summary: "{{fields.id}}",
      fields: [
        { label: "Stat ID", name: "id", widget: "string" },
        { label: "Description", name: "description", widget: "string" },
      ],
      required: true,
    },
  ],
};

export default hero;
