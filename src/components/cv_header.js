import React from "react"
import { Link } from "gatsby"
import { rhythm, scale } from "../utils/typography"

const TitleCharacter = ({ c }) => (
  <li
    style={{
      flexShrink: 1,
      marginBottom: 0,
      textTransform: "uppercase",
    }}
  >
    {c}
  </li>
)

const SubtitleLink = ({ to, children }) => (
  <li>
    <a
      href={to}
      style={{
        boxShadow: `none`,
        textTransform: "uppercase",
        textDecoration: "none",
        color: "#888",
      }}
    >
      {children}
    </a>
  </li>
)

export const CvHeader = ({ title }) => {
  const titleSpans = title
    .replace(" ", "  ")
    .split("")
    .map((c, i) => <TitleCharacter key={i} c={c} />)

  return (
    <div
      style={{
        marginBottom: rhythm(1.5),
        marginTop: 0,
      }}
    >
      <h1
        style={{
          ...scale(1.5),
          marginBottom: 0,
        }}
      >
        <Link
          key='link'
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          <ul
            style={{
              display: `flex`,
              flexBasis: "auto",
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
              margin: 0,
            }}
          >
            {titleSpans}
          </ul>
        </Link>
      </h1>
      <ul
        key='ul'
        style={{
          display: `flex`,
          flexWrap: `wrap`,
          justifyContent: `space-between`,
          listStyle: `none`,
          margin: "0 20px",
          padding: 0,
        }}
      >
        <SubtitleLink key='phone' to='tel:+15034075541'>
          <span role='img' aria-label='phone'>
            📱
          </span>{" "}
          503-407-5541
        </SubtitleLink>
        <SubtitleLink key='talks' to='email:ben@straub.cc'>
          <span role='img' aria-label='email'>
            ✉️
          </span>{" "}
          ben@straub.cc
        </SubtitleLink>
      </ul>
    </div>
  )
}
