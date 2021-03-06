import React, { Component } from 'react'
import styled from 'styled-components'
import Head from 'next/head'

import { withI18next } from '../lib/withI18next'
import initFirebase from '../lib/initFirebase'

import MobileNav from '../components/MobileNav'
import MainNav from '../components/MainNav'
import Wall from '../components/Wall'

initFirebase()

const Header = styled.div`
  padding: 2rem;
  margin: 0 auto;
  max-width: 48rem;
`

const Warning = styled.p`
  text-align: center;
  font-family: Quicksand;
`

class App extends Component {
  static async getInitialProps({ query }) {
    return query
  }

  render() {
    const { month } = this.props

    return (
      <div>
        <Head>
          <meta
            property="og:image"
            content="https://fame.giveth.io/static/preview.png"
          />
          <meta property="og:title" content="Giveth Video Wall of Fame" />
          <meta
            property="og:description"
            content="Where the Giveth Unicorns show off their work in the Giveth Galaxy"
          />
        </Head>
        <MobileNav />
        <MainNav />
        <Header>
          <Warning>
            Works best in{' '}
            <a href="https://www.google.com/chrome/">Google Chrome Browser</a>
          </Warning>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#2c0d54"
            viewBox="0 0 881.6 242"
          >
            <defs />
            <title>wall-of-fame-3</title>
            <g id="Layer_2" data-name="Layer 2">
              <g id="Layer_1-2" data-name="Layer 1">
                <g id="Layer_2-2" data-name="Layer 2">
                  <g id="Layer_1-2-2" data-name="Layer 1-2">
                    <g id="logo">
                      <path
                        className="cls-1"
                        d="M242,124c-.24,3.4-.32,6.82-.74,10.2-4.41,35.85-21.13,64.58-50.49,85.61-21.92,15.72-46.67,23-73.62,22.12-31.17-1.07-58-12.67-80.57-34.24a1.24,1.24,0,0,1,0-1.21Q78.73,164.26,121,122.11a3.81,3.81,0,0,1,2.42-1q59.28-.1,118.58,0Z"
                      />
                      <path
                        className="cls-1"
                        d="M124,0c3.32.25,6.65.4,10,.76A119.94,119.94,0,0,1,187.51,20l.32.26L177.5,30.54c-2.25,2.24-4.48,4.5-6.75,6.71a1,1,0,0,1-1,.09,96.74,96.74,0,0,0-53.09-13.06C74.28,26,37.31,56,27.14,97.21c-6.29,25.52-2.79,49.76,10.17,72.64a.93.93,0,0,1,0,.83q-8.46,8.5-16.94,17a2.43,2.43,0,0,1-.25.2c-.53-.82-1.07-1.62-1.58-2.44C4.54,162.81-1.63,138.25.37,111.75A120.73,120.73,0,0,1,100.12,1.92C105.64,1,111.28.7,116.86.12L118,0Z"
                      />
                      <path
                        className="cls-1"
                        d="M185.29,73a21.77,21.77,0,1,1,6.39,15.45A21.77,21.77,0,0,1,185.29,73Z"
                      />
                    </g>
                    <g id="typelogo">
                      <path
                        className="cls-1"
                        d="M361.23,73a5.62,5.62,0,0,0,1,.15A83.72,83.72,0,0,1,416.9,96.64c.37.35.74.71,1,1L406.06,109.5,404.37,108a68,68,0,0,0-24.92-14.69,69.51,69.51,0,0,0-12.32-2.79A70.92,70.92,0,0,0,353.94,90a63.29,63.29,0,0,0-14.07,2.42,67.92,67.92,0,0,0-11.38,4.39A64.32,64.32,0,0,0,314.61,106c-1.64,1.43-3.24,2.88-4.76,4.43a65.17,65.17,0,0,0-8.1,10.11,67,67,0,0,0-5.78,11,64.59,64.59,0,0,0-4.3,14.91,61.28,61.28,0,0,0-.73,6.61c-.17,2.65-.2,5.29-.11,7.92a64.51,64.51,0,0,0,2.11,13.53,67.66,67.66,0,0,0,60,50.39,76.15,76.15,0,0,0,9.79,0,67.37,67.37,0,0,0,52-30.17,66.65,66.65,0,0,0,8.45-18.11c.16-.57.34-1.17.55-1.84h-82.3l17.19-17.31h84.13v1.19A84.47,84.47,0,0,1,377,239.81a85.92,85.92,0,0,1-14.27,1.95,75.74,75.74,0,0,1-12.05-.24,84.45,84.45,0,0,1-74.58-65.65,76.83,76.83,0,0,1-2-15.17,84.52,84.52,0,0,1,78.48-87.44h1.92a5.6,5.6,0,0,0,1-.14Z"
                      />
                      <path
                        className="cls-1"
                        d="M880.88,242H864.06V174.84H813.34v66.95c-.66.2-15.64.26-16.8,0V141h16.77v16.35c.71.2,49.1.27,50.71,0V107.4a2.9,2.9,0,0,1,.72-.09h16.12Z"
                      />
                      <path
                        className="cls-1"
                        d="M711.93,174.73H644.74l-17.19-17.22h65a50.54,50.54,0,0,0-10.87-17.85,49.93,49.93,0,0,0-28.48-15.2,50.77,50.77,0,1,0,27.1,86.26l11.7,11.7c-16.64,17.5-48.25,27.05-77.51,12.38a67.34,67.34,0,1,1,97.49-60Z"
                      />
                      <path
                        className="cls-1"
                        d="M510.57,207.84l58-100.48H587.8a1.77,1.77,0,0,1-.15.31l-77.4,134.05H493.51V107.42h0a.92.92,0,0,1,.33,0h16.29V207.8Z"
                      />
                      <path
                        className="cls-1"
                        d="M745.81,242H729V123.74H709l-9.55-16.34H813.31v16.34H745.79Z"
                      />
                      <path
                        className="cls-1"
                        d="M476.52,242H459.8V141h16.65V241.3A2.35,2.35,0,0,1,476.52,242Z"
                      />
                      <path
                        className="cls-1"
                        d="M468.19,107.31a8.33,8.33,0,1,1-6,2.46A8.33,8.33,0,0,1,468.19,107.31Z"
                      />
                    </g>
                    <g className="cls-2">
                      <path
                        className="cls-1"
                        d="M450,23.38h4.12l6.25,15.76,6.32-15.76h4.19l-7.75,18.94,8.5,20.08,16.07-39.33h4.75L473.64,67.46h-3.88l-9.31-21.95-9.38,21.95h-3.82L428.5,23.07h4.69L449.32,62.4l8.44-20.08Z"
                      />
                    </g>
                    <g className="cls-2">
                      <path
                        className="cls-1"
                        d="M508.67,23.07h3.69L530.8,67.46h-4.63l-5.75-13.88H500.48l-5.7,13.88H490.1Zm10.75,27.07-8.94-21.95-9.07,22Z"
                      />
                      <path
                        className="cls-1"
                        d="M537.18,67.46V23.07h4.38V63.58h25.63v3.88Z"
                      />
                    </g>
                    <g className="cls-2">
                      <path
                        className="cls-1"
                        d="M573.63,67.46V23.07H578V63.58h25.64v3.88Z"
                      />
                    </g>
                    <g className="cls-2">
                      <path
                        className="cls-1"
                        d="M642.23,67.77a18.81,18.81,0,0,1-8.47-1.9,21.11,21.11,0,0,1-6.6-5.07,23,23,0,0,1-4.25-7.22,23.84,23.84,0,0,1-1.5-8.32,22.92,22.92,0,0,1,1.6-8.5,23.42,23.42,0,0,1,4.4-7.19,21.47,21.47,0,0,1,6.63-5,18.69,18.69,0,0,1,8.26-1.85,18.37,18.37,0,0,1,8.47,2,21.46,21.46,0,0,1,6.56,5.16,23.84,23.84,0,0,1,4.22,7.22,23.43,23.43,0,0,1,1.5,8.23,23.53,23.53,0,0,1-6,15.66,21.18,21.18,0,0,1-6.59,4.94A18.75,18.75,0,0,1,642.23,67.77ZM625.79,45.26a20.52,20.52,0,0,0,1.19,7,18.9,18.9,0,0,0,3.37,5.94,16.58,16.58,0,0,0,5.19,4.12,15.28,15.28,0,0,0,13.51-.09A16.63,16.63,0,0,0,654.24,58,19.54,19.54,0,0,0,657.52,52a20.4,20.4,0,0,0-.06-13.73,19,19,0,0,0-3.41-5.91,16.78,16.78,0,0,0-5.19-4.09,14.38,14.38,0,0,0-6.63-1.53,14.55,14.55,0,0,0-6.81,1.59,16.06,16.06,0,0,0-5.19,4.22A19.54,19.54,0,0,0,627,38.51,20.13,20.13,0,0,0,625.79,45.26Z"
                      />
                    </g>
                    <g className="cls-2">
                      <path
                        className="cls-1"
                        d="M671.31,67.46V23.07h29.14v3.87H675.69V43.26h20.88v3.63H675.69V67.46Z"
                      />
                    </g>
                    <g className="cls-2">
                      <path
                        className="cls-1"
                        d="M722.71,67.46V23.07h29.14v3.87H727.09V43.26H748v3.63H727.09V67.46Z"
                      />
                    </g>
                    <g className="cls-2">
                      <path
                        className="cls-1"
                        d="M768.42,23.07h3.69l18.45,44.39h-4.63l-5.75-13.88H760.23l-5.69,13.88h-4.69Zm10.76,27.07-8.94-21.95-9.07,22Z"
                      />
                      <path
                        className="cls-1"
                        d="M836.26,67.46V31l-16.19,28.2h-2.56L801.31,31V67.46h-4.38V23.07h4.51l17.32,30.38L836.2,23.07h4.44V67.46Z"
                      />
                      <path
                        className="cls-1"
                        d="M881.6,63.58v3.88H851.77V23.07H881v3.87H856.15V43h21.69v3.69H856.15V63.58Z"
                      />
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </Header>
        <Warning>
          <p>Received points in Riot? Please add your video below and embed link in your <a href="https://beta.giveth.io/campaigns/5b3d9746329bc64ae74d1424">RewardDAO Milestone</a>!.</p>
          <p>You can report any issues to our <a href="https://github.com/Giveth/wall-of-fame">Github Repo</a>, Thank you for contributing to Giveth!</p>
        </Warning>
        <Wall month={month} />
      </div>
    )
  }
}

export default withI18next(['common', 'navigation'])(App)
