import React, { Component } from 'react'
import * as PropTypes from 'prop-types'
import Img from 'gatsby-image'
import Link from 'gatsby-link'
import { Button, Icon } from 'semantic-ui-react'
import Post from '../components/post'
import Sidebar from '../components/sidebar'

import 'semantic-ui-css/components/button.css'
import 'semantic-ui-css/components/icon.css'

import './index.scss'

const propTypes = {
  data: PropTypes.object.isRequired,
}

class IndexPage extends Component {
  render() {
    const categoryEdges = this.props.data.categories.edges
    const postEdges = this.props.data.posts.edges
    const recommendationEdges = this.props.data.recommendations.edges
    const issueEdges = this.props.data.issues.edges
    const author = this.props.data.author

    return (
      <section className="page cf">
        <section className="main-content">
          {postEdges.map(({ node }) => <Post node={node} key={node.id} />)}
          <footer>
            <Button as={Link} size="huge" color="green" to="/blog">
              <Icon name="book" /> Read more on the blog
            </Button>
          </footer>
        </section>
        <Sidebar
          author={author}
          recommendations={recommendationEdges}
          issues={issueEdges}
          categories={categoryEdges}
        />
      </section>
    )
  }
}

IndexPage.propTypes = propTypes

export default IndexPage

export const pageQuery = graphql`
  query IndexPageQuery {
    categories: allContentfulCategory {
      edges {
        node {
          id
          title
          permalink
        }
      }
    }
    posts: allContentfulArticle(
      limit: 5
      sort: { fields: [publishedOn], order: DESC }
    ) {
      edges {
        node {
          id
          title
          publishedOn(formatString: "MMMM DD, YYYY")
          permalink
          categories {
            id
            title
            permalink
          }
          content {
            childMarkdownRemark {
              excerpt(pruneLength: 300)
              timeToRead
            }
          }
          author {
            name
            twitter
          }
          postVideo
          postImage {
            title
            resolutions {
              width
              height
              src
              srcSet
            }
          }
        }
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
