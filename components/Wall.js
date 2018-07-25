import React, { Component } from "react";
import firebase from "firebase";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import moment from "moment";
import styled from 'styled-components';

import { Box } from 'grid-styled';
import MediaCard from './MediaCard';
import { Button } from './Button';

import { Link } from '../routes';

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
      wall: "",
      week: props.week || moment().format("WW_MM_YYYY"),
      previous: null,
      next: null,
    }
  }

  componentDidMount() {
    const ref = firebase.database().ref("GVWOF_v2/");
    ref.on('value', this.gotData, (err) => console.log(err));
  }

  gotData = (data) => {
    const mediaData = data.val()

    const media = []
    for (let key in mediaData) {
      const video = mediaData[key]
      const date = video.week.split('_')
      video.weekYear = date[2] + date[0]
      video.id = key
      media.push(video)
    }
    media.sort((a, b) => {
      return b.weekYear - a.weekYear
    })

    let cache
    let counter = -1
    let mediaList = []
    media.forEach((video) => {
      const timestamp = video.weekYear
      if (timestamp === cache) {
        mediaList[counter].push(video)
      } else {
        mediaList.push([video])
        counter++
      }
      cache = timestamp
    })

    let index, previous, next
    mediaList.forEach((list, idx) => {
      if (previous || next) {
        return
      }
      list.forEach((video) => {
        if (video.week === this.state.week) {
          index = idx
          previous = mediaList[idx + 1] ? mediaList[idx + 1][0].week : null
          next = mediaList[idx - 1] ? mediaList[idx - 1][0].week : null
        }
      })
    })

    if (!index) {
      index = 0
      previous = mediaList[1] ? mediaList[1][0].week : null
      this.state.week = mediaList[0][0].week
    }

    this.setState({
      media: mediaList,
      currentMedia: this.state.wall ? mediaList[index].filter((video) => video.wall === this.state.wall) : mediaList[index],
      previous,
      next,
    })
  }

  componentWillReceiveProps(newProps) {
    var week = newProps.week || moment().format("WW_MM_YYYY");
    var wall = "";

    let index, next, previous
    const media = this.state.media
    media.forEach((list, idx) => {
      list.forEach((video) => {
        if (video.week === week) {
          index = idx
          previous = media[idx + 1] ? media[idx + 1][0].week : null
          next = media[idx - 1] ? media[idx - 1][0].week : null
        }
      })
    })

    if (newProps.week) {
      this.setState({
        currentMedia: this.state.wall ? this.state.media[index].filter((video) => video.wall === this.state.wall) : this.state.media[index],
        next,
        previous,
        week,
        wall
      })
    }
  }

  render() {
    const { media, currentMedia, week, next, previous } = this.state;
    const date = week.split("_");
    return (
      <div>
        <Container>
          {next ?
            <Link route={`/week/${next}`}>
              <Button color="#2c0d54" bgcolor="white">NEXT WEEK</Button>
            </Link> : <Box width="125px" />
          }
          <Text>WEEK {date[0]} - {date[2]}</Text>
          {previous ?
            <Link route={`/week/${previous}`}>
              <Button color="#2c0d54" bgcolor="white">PREVIOUS WEEK</Button>
            </Link> : <Box width="162px" />
          }
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
            {currentMedia ? currentMedia.map((props) => <div style={{bottom: '-5px'}} >
              <MediaCard {...props} />
            </div>) : <div />}
          </Masonry>
        </ResponsiveMasonry>
        <Link route="/upload">
          <UploadButton>
            <svg className="svgIcon" width="48px" height="48px" viewBox="0 0 48 48"><path d="M38 26H26v12h-4V26H10v-4h12V10h4v12h12v4z" fill="white"></path></svg>
          </UploadButton>
        </Link>
      </div>
    )
  }
}

export default Wall;
