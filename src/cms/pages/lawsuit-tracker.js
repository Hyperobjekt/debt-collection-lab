import { description, linkFields, title } from "../partials/fields";
import {
  collectors,
  demographics,
  hero,
  lawsuits,
  map,
  table,
} from "../partials/lawsuit-tracker";

const page = {
  file: "content/lawsuit-tracker/index.json",
  label: "Debt Collection Tracker",
  name: "Debt Collection Tracker",
  extension: "json",
  format: "json",
  fields: [
    {
      label: "Tracker Home",
      name: "index",
      widget: "object",
      fields: [
        {
          label: "Hero",
          name: "hero",
          collapsed: true,
          widget: "object",
          fields: [
            { label: "First Line", name: "FIRST_LINE", widget: "string" },
            { label: "Second Line", name: "SECOND_LINE", widget: "string" },
          ],
        },
        {
          label: "About Section",
          name: "about",
          collapsed: true,
          widget: "object",
          fields: [
            title,
            description,
            {
              label: "links",
              name: "LINKS",
              widget: "list",
              fields: linkFields,
              required: false,
            },
          ],
        },
        {
          label: "Table Section",
          name: "table",
          collapsed: true,
          widget: "object",
          fields: [title, description],
        },
        {
          label: "Additional Info Section",
          name: "additional",
          collapsed: true,
          widget: "object",
          fields: [title, description],
        },
      ],
    },
    {
      label: "State Pages",
      name: "state",
      widget: "object",
      fields: [hero, collectors, lawsuits, map, table, demographics],
    },
    {
      label: "County Pages",
      name: "county",
      widget: "object",
      fields: [hero, collectors, lawsuits, map, table, demographics],
    },
    {
      label: "Table Strings",
      name: "table",
      collapsed: true,
      widget: "object",
      fields: [
        { label: "Last Updated", name: "LAST_UPDATED", widget: "string" },
        { label: "Top Counties Limit", name: "TOP_LIMIT", widget: "string" },
        {
          label: "North Dakota Note",
          name: "NORTH_DAKOTA_NOTE",
          widget: "string",
        },
        { label: "Texas Note", name: "TEXAS_NOTE", widget: "string" },
        { label: "Counties Note", name: "COUNTIES_NOTE", widget: "string" },
        { label: "Tracts Note", name: "TRACTS_NOTE", widget: "string" },
        { label: "Zips Note", name: "ZIPS_NOTE", widget: "string" },
        { label: "States Note", name: "STATES_NOTE", widget: "string" },
        { label: "No Results", name: "NO_RESULTS", widget: "string" },
        { label: "View Report Link", name: "REPORT_LINK", widget: "string" },
      ],
    },
  ],
};

export default page;
