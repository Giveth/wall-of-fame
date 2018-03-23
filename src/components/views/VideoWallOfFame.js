import React, { Component } from 'react'
import MediaCard from '../MediaCard'
import firebase from 'firebase';
import { Link } from 'react-router-dom'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';
import { OverlayTrigger, Popover, } from 'react-bootstrap';

import AddNewMediaButton from '../AddNewMediaButton'
import VideoWallOfFameHeader from '../VideoWallOfFameHeader'

class VideoWallOfFame extends Component {

  constructor(props) {
    super(props)

    var _wall = "";
    var _currentweek = moment().format("WW_MM_YYYY")
    var _week = "";
    var _hasMore = true;


    if (!props.match.params.week) {
      _week = _currentweek
    } else {
      _week = props.match.params.week
    }


    if (props.match.params.wall) {
      _wall = props.match.params.wall
    }

    var _ref = null
    var _ref_next = null
    var _ref_prev = null

    if (_wall === "") {
      _ref = firebase.database().ref("GVWOF_v2/").orderByKey().limitToLast(8)
    } else {
      _ref = firebase.database().ref("GVWOF_v2/").orderByChild('week').equalTo(_week)
    }

    this.state = {
      databaseRef: _ref,
      media: [],
      referenceToOldestKey: '',
      hasMore: _hasMore,
      wall: _wall,
      currentweek: _currentweek,
      week: _week,
      previous: null,
      next: null
    }

    _ref.on('value', this.gotData, (err) => { console.log(err) });
  }

  componentWillReceiveProps(newProps) {
    var _week = "";
    var _wall = "";

    if (!newProps.match.params.week) {
      this.state.week = _week = moment().format("WW_MM_YYYY")
    } else {
      this.state.week = _week = newProps.match.params.week
    }

    if (newProps.match.params.wall) {
      _wall = newProps.match.params.wall
    }

    var _ref = null

    if (_wall === "") {
      _ref = firebase.database().ref("GVWOF_v2/").orderByKey().limitToLast(8)
    } else {
      _ref = firebase.database().ref("GVWOF_v2/").orderByChild('week').equalTo(_week)
    }

    _ref.on('value', this.gotData, (err) => { console.log(err) });
  }

  //get the data from the firebase and push them out
  gotData = (data) => {
    this.state.previous = moment().weeks(this.state.week.split("_")[0]).add(-1, "w").format("WW_MM_YYYY")
    this.state.next = moment().weeks(this.state.week.split("_")[0]).add(+1, "w").format("WW_MM_YYYY")

    const videos = data.val()
    let media = []
    for (let key in videos) {
      media.push(videos[key])
    }
    this.setState({ media })
  }

  render() {
    return (
      <div>
        <VideoWallOfFameHeader />
        {this.state.wall !== "" &&
          <center>
            <div className="container">
              <div className="row">
                <div className="col">
                    <Link className="btn-week" to={"/" + this.state.wall + "/" + this.state.next}>Next week</Link>
                </div>
                <div className="col">
                  {this.state.wall.split("_").join(" ")}
                  <br />
                  {this.state.week.split('_')[1] + "/" + this.state.week.split('_')[2]}
                  <br />
                  {"Week: " + this.state.week.split('_')[0]}
                </div>
                <div className="col">
                    <Link className="btn-week" to={"/" + this.state.wall + "/" + this.state.previous}>Previous week</Link>
                </div>
              </div>
            </div>
          </center>
        }

          <div className="container-fluid page-layout reduced-padding" >
            {this.state.media.length ? null : <center>No results..</center>}
            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1024: 3, 1470: 4 }} >
              <Masonry className="video-card" columnsCount={1} gutter="10px" >
                {this.state.media.map((media) => {
                  return (
                    // Load each video from the query into a card
                    <div key={media.id + "_dev"} >
                      <OverlayTrigger key={media.id + "_OverlayTrigger"} rootClose trigger={['click']} placement="top"
                        overlay={
                          <Popover id="popover-trigger-hover-focus" title={media.title}>
                            <strong>Date</strong>: {moment(media.timestamp).format("HH:mm DD-MM-YYYY")}
                            <strong> Week</strong>: {media.week.split("_")[0]}
                            <strong> Wall</strong>: {media.wall.split("_").join(" ")}
                            <br />
                            <strong>Description: </strong><br /> {media.description}
                            <br /> <br />
                            <Link to={"/view/" + media.id}>Link</Link>
                            <br /> <br />
                            <a href={media.src}>Firebase Link</a>
                            <br /> <br />
                            <a href={media.src}>IPFS Link</a>
                          </Popover>
                        }>
                        <div>
                          <MediaCard
                            key={media.id}
                            id={media.id}
                            title={media.title}
                            src={media.src}
                            type={media.type}
                            ipfs={media.ipfs}
                            description={media.description}
                            timestamp={media.timestamp}
                            week={media.week}
                            date={moment(media.timestamp).format("HH:mm DD-MM-YYYY")}
                            muted={true}
                          />
                        </div>

                      </OverlayTrigger>
                    </div>

                  )
                })}
              </Masonry>
            </ResponsiveMasonry>
            <AddNewMediaButton week={this.state.week} wall={this.state.wall}/>
          </div>
      </div>

    )
  }
}

export default VideoWallOfFame