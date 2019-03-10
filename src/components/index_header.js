import React from "react"
import { Link } from "gatsby"
import { rhythm, scale } from "../utils/typography"

export  const IndexHeader = ({title}) => (
  <h1
    style={{
      ...scale(1.5),
      marginBottom: rhythm(1.5),
      marginTop: 0,
    }}
  >
    <Link
      style={{
        boxShadow: `none`,
        textDecoration: `none`,
        color: `inherit`,
      }}
      to={`/`}
    >
      {title}
    </Link>
  </h1>
)