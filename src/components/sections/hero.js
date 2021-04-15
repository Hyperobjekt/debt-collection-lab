import { styled, withStyles } from '@material-ui/core'
import React from 'react'
import { Block } from '.'

const HeroBlock = withStyles({
  root: { 
    minHeight: `66vh`,
    display: "flex",
    justifyContent: "stretch",
    alignItems: "stretch"
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})(Block)

const Hero = (props) => {
  return (
    <HeroBlock bgcolor="primary.main" {...props} />
  )
}

export default Hero
