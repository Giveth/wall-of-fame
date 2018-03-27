import React, { Component } from "react";
import MediaCard from "../MediaCard";
import firebase from "firebase";
import { Link } from "react-router-dom";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import InfiniteScroll from "react-infinite-scroller";
import moment from "moment";
import { OverlayTrigger, Popover } from "react-bootstrap";

import AddNewMediaButton from "../AddNewMediaButton";
import VideoWallOfFameHeader from "../VideoWallOfFameHeader";

class VideoWallOfFame extends Component {
  constructor(props) {
    super(props)

    var _wall = "";
    var _currentweek = moment().format("WW_MM_YYYY")
    var _week = "";

    if (!props.match.params.week) {
      _week = _currentweek
    } else {
      _week = props.match.params.week
    }

    if (props.match.params.wall) {
      _wall = props.match.params.wall
    }

    this.state = {
      media: [],
      currentMedia: [],
      wall: _wall,
      currentweek: _currentweek,
      week: _week,
      previous: null,
      next: null,
    }
  }

  componentDidMount() {
    const ref = firebase.database().ref("GVWOF_v2/")
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
      previous = mediaList[1][0].week
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
    var week = "";
    var wall = "";

    if (!newProps.match.params.week) {
      week = moment().format("WW_MM_YYYY")
    } else {
      week = newProps.match.params.week
    }

    if (newProps.match.params.wall) {
      wall = newProps.match.params.wall
    }

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

    this.setState({
      currentMedia: this.state.wall ? this.state.media[index].filter((video) => video.wall === this.state.wall) : this.state.media[index],
      next,
      previous,
      week,
      wall
    })
  }

  render() {
    const loader = (
      <center>
        <div className="loader">No more results...</div>{" "}
      </center>
    );
    const date = this.state.week.split("_")
    const { next, previous } = this.state
    return (
      <div>
        {/**Hiding the Header 
        <VideoWallOfFameHeader />
        **/}

        <div className="weekNav">
          <div className={next ? "next-prev-button" : 'set-width'}>
            {next && (<Link to={next} style={{color: 'white', textDecoration: 'none'}}>Next week</Link>)}
          </div>
          <div style={{fontSize: '28px', fontWeight: '700', color: '#2c0d54'}}>{"WEEK " + date[0] + ' - ' + date[2]}</div>
          <div className={previous ? "next-prev-button" : 'set-width'}>
            {previous && (<Link to={previous} style={{color: 'white', textDecoration: 'none'}}>Previous week</Link>)}
          </div>
        </div>

        <div className="container-fluid">
          <ResponsiveMasonry
            columnsCountBreakPoints={{
              350: 1,
              750: 2,
              900: 3,
              1024: 3,
              1470: 3
            }}
          >
            <Masonry className="video-card" columnsCount={1} gutter="10px">
              {this.state.currentMedia && this.state.currentMedia.map(media => {
                return (
                  // Load each video from the query into a card
                  <div key={media.id + "_dev"}>
                    {/* <OverlayTrigger
                      key={media.id + "_OverlayTrigger"}
                      rootClose
                      trigger={["click"]}
                      placement="top"
                      overlay={
                        <Popover
                          id="popover-trigger-hover-focus"
                          title={media.title}
                        >
                          <strong>Date</strong>:{" "}
                          {moment(media.timestamp).format("HH:mm DD-MM-YYYY")}
                          <strong> Week</strong>: {media.week.split("_")[0]}
                          <strong> Wall</strong>:{" "}
                          {media.wall.split("_").join(" ")}
                          <br />
                          <strong>Description: </strong>
                          <br /> {media.description}
                          <br /> <br />
                          <Link to={"/view/" + media.id}>Link</Link>
                          <br /> <br />
                          <a href={media.src}>Firebase Link</a>
                          <br /> <br />
                          <a href={media.src}>IPFS Link</a>
                        </Popover>
                      }
                    > */}
                      <div>
                        <MediaCard
                          {...media}
                          date={moment(media.timestamp).format(
                            "HH:mm DD-MM-YYYY"
                          )}
                          muted={true}
                          autoPlay
                          showControls={false}
                        />
                      </div>
                    {/* </OverlayTrigger> */}
                  </div>
                );
              })}
            </Masonry>
          </ResponsiveMasonry>

          <AddNewMediaButton week={this.state.week} wall={this.state.wall} />
        </div>
      </div>
    );
  }
}

export default VideoWallOfFame;
