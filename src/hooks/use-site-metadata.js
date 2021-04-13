import { useStaticQuery, graphql } from "gatsby";
export const useSiteMetadata = () => {
  const { site } = useStaticQuery(
    graphql`
      query SiteMetaData {
        site {
          siteMetadata {
            siteUrl
            title
            description
            keywords
            image
            logo
            icon
            menuLinks {
              name
              link
            }
            social {
              email
              twitter
              facebook
            }
          }
        }
      }
    `
  );
  return site.siteMetadata;
};
