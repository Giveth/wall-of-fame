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
      media: []
    };
  }

  //After the connect, what the state will do--gotdata
  componentDidMount() {
    this.state.databaseRef.on("value", this.gotData, this.errData);
  }

  //get the data from the firebase and push them out
  gotData = data => {
    var newMedia = [];

    const mediadata = data.val();
    if (!mediadata) return;

    newMedia.push({
      id: this.state.id,
      title: mediadata.title,
      src: mediadata.src,
      type: mediadata.type,
      ipfs: mediadata.ipfs,
      description: mediadata.description,
      timestamp: mediadata.timestamp,
      week: mediadata.week
    });

    this.setState({ media: newMedia });
  };

  errData = err => {
    console.log(err);
  };

  render() {
    if (this.state.media.length > 0) {
      return (
        <div id="media-campaigns-view">
          <div className="container-fluid col-lg-6 col-md-auto reduced-padding  page-layout one-card ">
            <h1>{this.state.media[0].title}</h1>
            <MediaCard
              key={this.state.media[0].id}
              id={this.state.media[0].id}
              title={this.state.media[0].title}
              src={this.state.media[0].src}
              type={this.state.media[0].type}
              ipfs={this.state.media[0].ipfs}
              description={this.state.media[0].description}
              timestamp={this.state.media[0].timestamp}
              week={this.state.media[0].week}
              autoplay="true"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div id="media-campaigns-view">
          <div className="container-fluid page-layout reduced-padding">
            <div className="card-columns">
              <p className="text-center">Loading or empty...</p>
            </div>
            <AddNewMediaButton week={this.state.week} />
          </div>
        </div>
      );
    }
  }
}

export default CampaignsVideosViewer;
