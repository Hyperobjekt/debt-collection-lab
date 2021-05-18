import home from "./home";
import about from "./about";
import storytelling from "./storytelling";
import lawsuitTracker from "./lawsuit-tracker";
import contact from "./contact";

const pages = {
  name: "pages",
  label: "Pages",
  extension: "mdx",
  format: "frontmatter",
  editor: {
    preview: false,
  },
  files: [home, about, storytelling, lawsuitTracker, contact],
};

export default pages;
