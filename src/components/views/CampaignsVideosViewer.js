import React, { Component } from "react";
import MediaCard from "../MediaCard";
import AddNewMediaButton from "../AddNewMediaButton";
import firebase from "firebase";

class CampaignsVideosViewer extends Component {
  constructor(props) {
    super(props);

    var _week = props.match.params.week;
    var _id = props.match.params.id;

    var _video_ref = "GVWOF_v2/" + _id;

    this.state = {
      databaseRef: firebase.database().ref(_video_ref),
      id: _id,
      media: null
    };
  }

  //After the connect, what the state will do--gotdata
  componentDidMount() {
    this.state.databaseRef.on("value", this.gotData, this.errData);
  }

  //get the data from the firebase and push them out
  gotData = data => {
    const mediadata = data.val();
    if (!mediadata) return;
    this.setState({ media: mediadata });
  };

  errData = err => {
    console.log(err);
  };

  render() {
    const media = this.state.media
    if (media) {
      return (
        <div id="media-campaigns-view" className="space-top">
          <div className="container-fluid col-lg-6 col-md-auto reduced-padding  page-layout one-card ">
            <h1>{media.title}</h1>
            <MediaCard
              {...media}
              autoplay="true"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-top">
          <center>
            <p className="text-center">Loading or empty...</p>
          </center>
        </div>
      );
    }
  }
}

export default CampaignsVideosViewer;
