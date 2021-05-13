export const title = {
  label: "Title",
  name: "TITLE",
  widget: "string",
  required: true,
};

export const path = {
  label: "Slug (URL path)",
  name: "path",
  widget: "string",
  hint: `Where the page will be created within the site structure.  Be careful changing this, as it could break links to any pages linking here.`,
  required: false,
};

export const name = {
  label: "Page Name",
  name: "name",
  widget: "string",
  hint: `the page name is used to refer to this page within the site (e.g. in the breadcrumb)`,
  required: false,
};

export const body = {
  label: "Body",
  name: "body",
  widget: "markdown",
  default: "",
  required: false,
  hint:
    "WARNING: be careful editing this section.  Modifying imports or unclosed tags may cause build errors.",
};

export const template = {
  label: "Page Template",
  name: "template",
  widget: "hidden",
};

export const embeddedImages = {
  label: "Images",
  name: "embeddedImages",
  widget: "list",
  collapsed: true,
  summary: "{{fields.image}}",
  field: { label: "Image", name: "image", widget: "image" },
};

export const description = {
  label: "Description",
  name: "DESCRIPTION",
  widget: "text",
};

export const linkFields = [
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
