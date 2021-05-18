import { graphql, useStaticQuery } from "gatsby";
import { useLocation } from "@reach/router";

/**
 * Returns true if the current page has a light header
 */
export default function useLightPages() {
  const location = useLocation();
  const data = useStaticQuery(graphql`
    query HeaderQuery {
      allMdx(filter: { frontmatter: { lightHeader: { eq: true } } }) {
        nodes {
          slug
        }
      }
    }
  `);
  // remove any trailing slashes on current page if it is not the home page
  const currentPage =
    location.pathname.length > 1
      ? location.pathname.replace(/\/$/, "")
      : location.pathname;
  const lightPages = data.allMdx.nodes.map((d) => "/" + d.slug);
  return lightPages.indexOf(currentPage) > -1;
}
