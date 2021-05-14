import { graphql } from "gatsby";
import Page from "gatsby-theme-hypercore/src/templates/page";

export default Page;

export const pageQuery = graphql`
  query GalleryQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        meta {
          title
          description
          keywords
          image {
            childImageSharp {
              gatsbyImageData(
                transformOptions: { fit: COVER, cropFocus: CENTER }
                width: 1200
                height: 630
              )
            }
          }
          isBlogPost
        }
        embeddedImages {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
        gallery {
          author
          alt
          caption
          thumbnail: image {
            childImageSharp {
              gatsbyImageData(height: 350)
            }
          }
          full: image {
            childImageSharp {
              gatsbyImageData(layout: FULL_WIDTH)
            }
          }
          order
        }
      }
    }
  }
`;
