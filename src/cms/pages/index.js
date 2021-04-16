import home from "./home";
import about from "./about";
import lawsuitTracker from "./lawsuit-tracker";
import storytelling from "./storytelling";

const pages = {
  name: "pages",
  label: "Pages",
  extension: "mdx",
  format: "frontmatter",
  editor: {
    preview: false,
  },
  files: [home, about, lawsuitTracker, storytelling],
};

export default pages;
