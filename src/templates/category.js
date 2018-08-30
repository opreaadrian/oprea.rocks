import React, { Component } from 'react'
import * as PropTypes from 'prop-types'
import Img from 'gatsby-image'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import Post from '../components/post'
import Sidebar from '../components/sidebar'
import PaginationLink from '../components/paginationLink'

const propTypes = {
  data: PropTypes.object.isRequired,
}

class CategoryPage extends Component {
  render() {
    const pathContext = this.props.pathContext
    const recommendationEdges = this.props.data.recommendations.edges
    const issueEdges = this.props.data.issues.edges
    const categoryEdges = this.props.data.categories.edges
    const author = this.props.data.author
    const pageContents = this.props.data.pageContents
    const { category } = this.props.pathContext.additionalContext

    return (
      <section className="page cf">
        <Helmet
          title={`oprea.rocks | Articles published under ${category.title}`}
          meta={[
            {
              name: 'description',
              content: `This is the archive page containing all the articles published under ${
                category.title
              } category.`,
            },
            { name: 'keywords', content: pageContents.keywords },
          ]}
        />
        <section className="main-content">
          <h2>
            Articles published under the{' '}
            <Link className="accent-color" to={`/blog/${category.permalink}`}>
              {category.title}
            </Link>{' '}
            category
          </h2>
          {pathContext.group.map(({ node }) => (
            <Post node={node} key={node.id} />
          ))}
          <div className="blog-pagination">
            <PaginationLink
              test={pathContext.first}
              url={`/${pathContext.pathPrefix}/${
                pathContext.index - 1 == 1 ? '' : pathContext.index - 1
              }`}
              text="&larr; Previous Page"
            />
            <PaginationLink
              test={pathContext.last}
              url={`/${pathContext.pathPrefix}/${pathContext.index + 1}`}
              text="Next Page &rarr;"
            />
          </div>
        </section>
        <Sidebar
          categories={categoryEdges}
          author={author}
          recommendations={recommendationEdges}
          issues={issueEdges}
        />
      </section>
    )
  }
}

CategoryPage.propTypes = propTypes

export default CategoryPage

export const pageQuery = graphql`
  query CategoryPageQuery {
    categories: allContentfulCategory {
      edges {
        node {
          id
          title
          permalink
        }
      }
    }
    pageContents: contentfulPage(identifier: { eq: "blog" }) {
      title
      description
      keywords
      content {
        childMarkdownRemark {
          html
        }
      }
      author {
        name
        about {
          childMarkdownRemark {
            html
          }
        }
        twitter
        medium
        github
        youtube
      }
    }

    recommendations: allContentfulResource(limit: 5) {
      edges {
        node {
          id
          title
          permalink
          type
          description {
            childMarkdownRemark {
              excerpt(pruneLength: 300)
              timeToRead
            }
          }
          url
          image {
            resolutions(width: 100) {
              ...GatsbyContentfulResolutions
            }
          }
        }
      }
    }

    author: contentfulAuthor {
      name
      about {
        childMarkdownRemark {
          html
        }
      }
    }

    issues: allContentfulIssue(
      limit: 4
      sort: { fields: [publishedOn], order: DESC }
    ) {
      edges {
        node {
          id
          title
          permalink
          publishedOn(formatString: "MMMM DD, YYYY")
        }
      }
    }
  }
`
