import React, { Component } from "react";
import { Link } from "react-router-dom";
// import poster from '../img/giveth.png' // relative path to image
import * as Clipboard from 'clipboard';
import fscreen from 'fscreen';

new Clipboard('.copy-to-clipboard');


class MediaCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: props.src,
      id: props.id,
      type: props.type,
      ipfs: props.ipfs,
      title: props.title,
      timestamp: props.timestamp,
      description: props.description,
      hideTimer: null,
      _overlay: null,
      date: props.date,
      showControls: null,
      disable: props.disable
    };
  }

  onClick = e => {
    fscreen.requestFullscreen(this.refs.vidRef);
    this.refs.vidRef.pause();
    this.refs.vidRef.currentTime = 0;
    this.refs.vidRef.muted = false;
    this.refs.vidRef.play();
  };

  onMouseMove = e => {
    this.triggerMouseMove();
  };

  triggerMouseMove = () => {
    this._overlay.style.opacity = "1";
  };

  handleMouseEnter() {
    this.setState({ showControls: true })
    this.refs.vidRef.play();
  }

  handleMouseLeave() {
    this.refs.vidRef.controls = false;
    this.refs.vidRef.muted = true;
    this._overlay.style.opacity = "0";
  }

  render() {
    const { muted, title, date, description, week, wall, src, id, autoPlay } = this.props
    return (
      <div className="card overview-card">
        <div
          className="VideoWrapper"
          onMouseMove={this.onMouseMove}
          onMouseEnter={this.handleMouseEnter.bind(this)}
          onMouseLeave={this.handleMouseLeave.bind(this)}
        >
          <div
            className="overlayContainer"
            ref={ref => (this._overlay = ref)}
            onMouseMove={this.onMouseMove}
          >
            <div className="title">{title}</div>
            <div className="date"><span className="fa fa-clock-o" aria-hidden="true"></span> {date}</div>
            <div className="description">{description}</div>
            <div className="week-wall-container">
              <div className="week-wall"><span className="fa fa-clock-o" aria-hidden="true"></span> {'WEEK: ' + week.split("_")[0]}</div>
              <div className="week-wall"><span className="fa fa-th-large" aria-hidden="true"></span> {'WALL: ' + wall.split("_").join(' ')}</div>
            </div>
            <div className="watch-button" onClick={this.onClick}>Watch <span className="fa fa-video-camera" aria-hidden="true"></span></div>
            <div className="download-button-container">
              <a href={src} style={{flex: 1, textDecoration: 'none'}}><div className="download-button" style={{marginRight: '1rem'}}>Firebase <span className="fa fa-database" aria-hidden="true"></span></div></a>
              <div style={{flex: 1, textDecoration: 'none'}}>
                <div
                  className="download-button copy-to-clipboard tooltipped tooltipped-s"
                  style={{marginLeft: '1rem'}}
                  data-clipboard-text={"https://fame.giveth.io/view/" + id}
                  aria-label="Copied link to clipboard!"
                >
                  Share <span className="fa fa-share" aria-hidden="true"></span>
                </div>
              </div>
            </div>
          </div>
          <div><video
            ref="vidRef"
            controls={this.state.showControls}
            muted={muted}
            loop
            src={this.state.src}
            onClick={this.onClick}
            autoplay={autoPlay}
          />
          </div>
        </div>
      </div>
    );
  }
}

export default MediaCard;
