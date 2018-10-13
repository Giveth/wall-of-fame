import React, { Component } from 'react'
import firebase from 'firebase'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import moment from 'moment'
import styled from 'styled-components'

import { Box } from 'grid-styled'
import MediaCard from './MediaCard'
import { Button } from './Button'

import { Link } from '../routes'

const Container = styled.div`
  padding: 2rem;
  margin: 0 auto;
  max-width: 48rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Text = styled.p`
  margin: 0;
  font-family: Quicksand;
  font-weight: 600;
  font-size: 28px;
  color: #2c0d54;
`

const UploadButton = styled.button`
  z-index: 10000;
  background-color: #2c0d54;
  padding: 0;
  border-radius: 50%;
  margin: 0;
  top: auto;
  right: 3%;
  bottom: 3%;
  left: auto;
  position: fixed;
  border: 3px solid #f5f5f5;
  display: flex;
  cursor: pointer;
  &:hover {
    border: 3px solid #2c0d54;
  }
`

class Wall extends Component {
  constructor(props) {
    super(props)

    this.state = {
      media: [],
      currentMedia: [],
      wall: '',
      month: props.month || moment().format('MM_YYYY'),
      previous: null,
      next: null,
    }
  }

  componentDidMount() {
    const ref = firebase.database().ref('GVWOF_v2/')
    ref.on('value', this.gotData, err => console.log(err))
  }

  gotData = data => {
    const mediaData = data.val()

    const media = []
    for (let key in mediaData) {
      const video = mediaData[key]
      video.month = moment(video.timestamp).format('MM_YYYY')
      video.monthYear = Number(moment(video.timestamp).format('YYYYMM'))
      video.id = key
      media.push(video)
    }
    // console.log(media.length)
    media.sort((a, b) => {
      return b.monthYear - a.monthYear
    })

    // console.log(media)

    let cache
    let counter = -1
    let mediaList = []
    media.forEach(video => {
      const timestamp = video.monthYear
      if (timestamp === cache) {
        mediaList[counter].push(video)
      } else {
        mediaList.push([video])
        counter++
      }
      cache = timestamp
    })

    // console.log(mediaList)

    let index, previous, next
    mediaList.forEach((list, idx) => {
      if (previous || next) {
        return
      }
      list.forEach(video => {
        if (video.month === this.state.month) {
          index = idx
          previous = mediaList[idx + 1] ? mediaList[idx + 1][0].month : null
          next = mediaList[idx - 1] ? mediaList[idx - 1][0].month : null
        }
      })
    })

    if (!index) {
      index = 0
      previous = mediaList[1] ? mediaList[1][0].month : null
      this.state.month = mediaList[0][0].month
    }

    // console.log(mediaList)

    this.setState({
      media: mediaList,
      currentMedia: this.state.wall
        ? mediaList[index].filter(video => video.wall === this.state.wall)
        : mediaList[index],
      previous,
      next,
    })
  }

  componentWillReceiveProps(newProps) {
    var month = newProps.month || moment().format('MM_YYYY')
    var wall = ''

    let index, next, previous
    const media = this.state.media
    media.forEach((list, idx) => {
      list.forEach(video => {
        if (video.month === month) {
          index = idx
          previous = media[idx + 1] ? media[idx + 1][0].month : null
          next = media[idx - 1] ? media[idx - 1][0].month : null
        }
      })
    })

    if (newProps.month) {
      this.setState({
        currentMedia: this.state.wall
          ? this.state.media[index].filter(
              video => video.wall === this.state.wall
            )
          : this.state.media[index],
        next,
        previous,
        month,
        wall,
      })
    }
  }

  render() {
    const { currentMedia, month, next, previous } = this.state
    const date = month.split('_')

    return (
      <div>
        <Container>
          {next ? (
            <Link route={`/month/${next}`}>
              <Button color="#2c0d54" bgcolor="white">
                NEXT MONTH
              </Button>
            </Link>
          ) : (
            <Box width="125px" />
          )}
          <Text>
            MONTH {date[0]} - {date[1]}
          </Text>
          {previous ? (
            <Link route={`/month/${previous}`}>
              <Button color="#2c0d54" bgcolor="white">
                PREVIOUS MONTH
              </Button>
            </Link>
          ) : (
            <Box width="162px" />
          )}
        </Container>
        <ResponsiveMasonry
          columnsCountBreakPoints={{
            350: 1,
            750: 2,
            900: 2,
            1024: 3,
            1470: 3,
          }}
        >
          <Masonry gutter=".5rem">
            {currentMedia ? (
              currentMedia.map(props => (
                <div style={{ bottom: '-5px' }}>
                  <MediaCard {...props} />
                </div>
              ))
            ) : (
              <div />
            )}
          </Masonry>
        </ResponsiveMasonry>
        <Link route="/upload">
          <UploadButton>
            <svg
              className="svgIcon"
              width="48px"
              height="48px"
              viewBox="0 0 48 48"
            >
              <path
                d="M38 26H26v12h-4V26H10v-4h12V10h4v12h12v4z"
                fill="white"
              />
            </svg>
          </UploadButton>
        </Link>
      </div>
    )
  }
}

export default Wall
