import home from "./home";
import about from "./about";
import storytelling from "./storytelling";

const pages = {
  name: "pages",
  label: "Pages",
  extension: "mdx",
  format: "frontmatter",
  editor: {
    preview: false,
  },
  files: [home, about, storytelling],
};

export default pages;
