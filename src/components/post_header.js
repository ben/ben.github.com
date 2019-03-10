import React from "react"
import { Link } from "gatsby"

export  const PostHeader = ({title}) => (
  <h3
    style={{
      fontFamily: `Montserrat, sans-serif`,
      marginTop: 0,
    }}
  >
    <Link
      style={{
        boxShadow: `none`,
        textDecoration: `none`,
        color: `inherit`,
        textTransform: 'uppercase',
      }}
      to={`/`}
    >
      {title}
    </Link>
  </h3>
)