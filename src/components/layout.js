import React from "react"
import { Link } from "gatsby"

import { rhythm } from "../utils/typography"
import { IndexHeader } from "./index_header"
import { CvHeader } from "./cv_header"
import { PostHeader } from "./post_header"

class Layout extends React.Component {
  render () {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    const cvPath = `${rootPath}cv/`

    let header
    if (location.pathname === rootPath) {
      header = <IndexHeader title={title} />
    } else if (location.pathname === cvPath) {
      header = <CvHeader title={title} />
    } else {
      header = <PostHeader title={title} />
    }
    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <header>{header}</header>
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()} <Link to='/about'>Ben Straub</Link>.
          Built with ♥ using <a href='https://www.gatsbyjs.org'>Gatsby</a>.
        </footer>
      </div>
    )
  }
}

export default Layout
