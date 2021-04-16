const MENU_LINK = [
  {
    label: "name",
    name: "name",
    widget: "string",
  },
  {
    label: "link",
    name: "link",
    widget: "string",
  },
];

const page = {
  file: "config/metadata.json",
  label: "Metadata",
  name: "Metadata",
  editor: {
    preview: false,
  },
  fields: [
    {
      label: "title",
      name: "title",
      widget: "string",
      default: "",
      required: true,
    },
    {
      label: "description",
      name: "description",
      widget: "string",
      default: "",
      required: true,
    },
    {
      label: "keywords",
      name: "keywords",
      widget: "string",
      default: "",
      required: true,
    },
    {
      label: "image",
      name: "image",
      widget: "image",
      default: "",
      required: true,
    },
    {
      label: "logo",
      name: "logo",
      widget: "image",
      default: "",
      required: true,
    },
    {
      label: "icon",
      name: "icon",
      widget: "image",
      default: "",
      required: true,
    },
    {
      label: "navigation",
      name: "menuLinks",
      widget: "list",
      fields: [
        ...MENU_LINK,
        {
          label: "Sub Menu",
          name: "subMenu",
          widget: "list",
          fields: MENU_LINK,
        },
      ],
    },
    {
      label: "social",
      name: "social",
      widget: "object",
      fields: [
        {
          label: "email",
          name: "email",
          widget: "string",
        },
        {
          label: "twitter",
          name: "twitter",
          widget: "string",
        },
        {
          label: "facebook",
          name: "facebook",
          widget: "string",
        },
      ],
    },
  ],
};

export default page;
