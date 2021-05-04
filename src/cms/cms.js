import CMS from "netlify-cms-app";
import pages from "./pages";
import config from "./config";

window.CMS_MANUAL_INIT = true;

CMS.init({
  config: {
    load_config_file: false,
    // local_backend: true,
    backend: {
      name: "git-gateway",
      repo: "Hyperobjekt/debt-collection-lab",
      branch: "main",
    },
    media_folder: "/static/images",
    public_folder: "/images",
    collections: [config, pages],
  },
});
