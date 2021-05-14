const team = {
  label: "Team",
  name: "team",
  widget: "list",
  fields: [
    {
      label: "Name",
      name: "name",
      widget: "string",
      required: false,
    },
    {
      label: "Title",
      name: "title",
      widget: "string",
      required: false,
    },
    {
      label: "Photo",
      name: "image",
      widget: "image",
      required: false,
    },
    {
      label: "Bio",
      name: "bio",
      widget: "text",
      required: false,
    },
  ],
};

export default team;
