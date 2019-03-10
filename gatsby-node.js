const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                slug
                draft
                noindex
              }
            }
          }
        }
      }
    `
  )
  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })

  return null
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const {draft, noindex} = node.frontmatter
    createNodeField({
      name: 'noindex',
      node,
      value: noindex || (draft && !process.env.DRAFTS)
    })

    let value = createFilePath({ node, getNode })
    if (node.frontmatter.slug) {
      value = node.frontmatter.slug
    } else if (node.frontmatter.date) {
      const date = new Date(node.frontmatter.date)
      const year = date.getFullYear()
      const month = ('0' + (date.getMonth() + 1)).slice(-2)
      const day = ('0' + date.getDate()).slice(-2)
      value = `/${year}/${month}/${day}${value}`
    }
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
