const primaryTeam = {
  label: "Primary Team",
  name: "primaryTeam",
  widget: "list",
  fields: [
    {
      label: "Name",
      name: "name",
      widget: "string",
      required: false,
    },
    {
      label: "Role",
      name: "role",
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
      label: "Bio",
      name: "bio",
      widget: "text",
      required: false,
    },
    {
      label: "Headshot",
      name: "headshot",
      widget: "image",
      required: false,
    },
    {
      label: "Headshot Thumbnail",
      name: "headshot_thumbnail",
      widget: "image",
      required: false,
    },
  ],
};

export default primaryTeam;
