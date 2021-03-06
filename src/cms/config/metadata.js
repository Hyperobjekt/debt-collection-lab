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
  media_folder: "/static/images",
  public_folder: "/images",
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
      label: "Site URL",
      name: "siteUrl",
      widget: "string",
      required: true,
    },
    {
      label: "Copyright notice",
      name: "copyright",
      widget: "string",
      required: false,
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
      widget: "list",
      fields: [
        {
          label: "Service",
          name: "name",
          widget: "string",
        },
        {
          label: "Account / Email",
          name: "value",
          widget: "string",
        },
      ],
    },
  ],
};

export default page;
