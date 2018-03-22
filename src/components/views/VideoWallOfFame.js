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

    if (_ref_next && _ref_prev) {

    }
  }

  componentDidMount() {
    if (this.state.wall !== "") {
      var _previus = moment().weeks(this.state.week.split("_")[0]).add(-1, "w").format("WW_MM_YYYY")
      var _next = moment().weeks(this.state.week.split("_")[0]).add(+1, "w").format("WW_MM_YYYY")
      firebase.database().ref("GVWOF_v2/").orderByChild('week').endAt(_previus).on('value', this.getPreviousWeek)
      firebase.database().ref("GVWOF_v2/").orderByChild('week').startAt(_next).on('value', this.getNextWeek)
    }
  }


  getPreviousWeek = (data) => {

    var mediadata = data.val()

    console.log(mediadata)

    if (!mediadata || mediadata === null || !this.state) {
      this.setState({
        previous: null
      })
      return
    }


    var keys = Object.keys(data.val());
    console.log(keys.reverse())

    for (var i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (!mediadata[k] || !this.state)
        continue;

      if (mediadata[k].wall === this.state.wall) {
        console.log(mediadata[k].week)
        this.setState({
          previous: mediadata[k].week
        })
        return;
      }
    }

    this.setState({
      previous: null
    })


  }

  getNextWeek = (data) => {
    var mediadata = data.val()
    console.log(mediadata)

    if (!mediadata || mediadata === null || !this.state) {
      this.setState({
        next: null
      })
      return
    }

    var keys = Object.keys(data.val());
    console.log(keys)

    for (var i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (mediadata[k].wall === this.state.wall) {
        console.log(mediadata[k].week)
        this.setState({
          next: mediadata[k].week
        })
        return;
      }
    }

    this.setState({
      next: null
    })

  }

  componentWillReceiveProps(newProps) {
    var _week = "";
    var _wall = "";

    if (!newProps.match.params.week) {
      _week = moment().format("WW_MM_YYYY")
    } else {
      _week = newProps.match.params.week
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

    this.setState({ wall: _wall, week: _week, databaseRef: _ref, media: [] }, function () {
      _ref.on('value', this.gotData, (err) => { console.log(err) });

      var _previus = moment().weeks(_week.split("_")[0]).add(-1, "w").format("WW_MM_YYYY")
      var _next = moment().weeks(_week.split("_")[0]).add(+1, "w").format("WW_MM_YYYY")

      firebase.database().ref("GVWOF_v2/").orderByChild('week').endAt(_previus).on('value', this.getPreviousWeek.bind(this))
      firebase.database().ref("GVWOF_v2/").orderByChild('week').startAt(_next).on('value', this.getNextWeek.bind(this))

    })


  }

  //get the data from the firebase and push them out
  gotData = (data) => {
    var newMedia = this.state.media

    const mediadata = data.val();

    console.log(mediadata)

    if (!mediadata)
      return

    var keys = Object.keys(mediadata).reverse()
    if (newMedia.length !== 0) {
      keys = Object.keys(mediadata).reverse().slice(1);
    }


    if (keys.length < 5) {
      this.setState({ hasMore: false });
    }

    var _referenceToOldestKey = Object.keys(mediadata)[0];

    for (var i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (mediadata[k].wall === this.state.wall || this.state.wall === '') {
        newMedia.push({
          id: keys[i],
          title: mediadata[k].title,
          src: mediadata[k].src,
          type: mediadata[k].type,
          ipfs: mediadata[k].ipfs,
          description: mediadata[k].description,
          timestamp: mediadata[k].timestamp,
          wall: mediadata[k].wall,
          week: mediadata[k].week,
        });
      }
    }


    this.setState({
      media: newMedia,
      referenceToOldestKey: _referenceToOldestKey
    }, function () {
      if (newMedia.length === 0 && keys.length >= 5) {
        this.loadItems()
      }
    });



  }

  loadItems() {
    if (this.state.wall === "") {
      //firebase.database().ref("GVWOF_v2/").orderByKey().limitToLast(6).endAt(this.state.referenceToOldestKey).on('value', this.gotData.bind(this), (err) => { console.log(err) });
    }
  }


  render() {
    const loader = <center><div className="loader">No more results...</div>  </center>;

    return (
      <div>

        <VideoWallOfFameHeader />

        {this.state.wall !== "" &&
          <center>
            <div className="container">
              <div className="row">
                <div className="col">
                  {this.state.next &&
                    <Link className="btn-week" to={"/" + this.state.wall + "/" + this.state.next}>Next week</Link>
                  }
                </div>
                <div className="col">
                  {this.state.wall.split("_").join(" ")}
                  <br />
                  {this.state.week.split('_')[1] + "/" + this.state.week.split('_')[2]}
                  <br />
                  {"Week: " + this.state.week.split('_')[0]}
                </div>
                <div className="col">
                  {this.state.previous &&
                    <Link className="btn-week" to={"/" + this.state.wall + "/" + this.state.previous}>Previous week</Link>
                  }
                </div>
              </div>
            </div>
          </center>
        }

          <div className="container-fluid page-layout reduced-padding" >

            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1024: 3, 1470: 3 }} >
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