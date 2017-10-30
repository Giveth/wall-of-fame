import React, { Component } from 'react'

class MediaCard extends Component {

    constructor(props) {
        super(props)
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
            date: new Date(props.timestamp).toString()
        }
    }

    onClick = e => {
        console.log("on click")
    }

    onMouseMove = e => {
        this.triggerMouseMove();
    }

    triggerMouseMove = () => {
        this._overlay.style.opacity = "1";

        if (this.hideTimer)
            clearTimeout(this.hideTimer);
        this.hideTimer = setTimeout(() => {

            if (this._overlay) {
                this._overlay.style.opacity = "0";
            }
        }, 1000);
    }


    render() {

        return (
            <div className="card overview-card">
                <div className="VideoWrapper" onMouseMove={this.onMouseMove}>
                    <div className="overlayContainer" ref={ref => this._overlay = ref} onMouseMove={this.onMouseMove} >
                        <div>
                            <h4 className="overlayTitle">{this.props.title}</h4>
                        </div>
                    </div>
                    <video controls autoPlay muted loop src={this.state.src} className="card-img .embed-responsive-item" />
                </div>
            </div>
        )
    }
}

export default MediaCard

