import React, { Component } from 'react'
//import { Link } from 'react-router-dom'

class VideoWallOfFameHeader extends Component {
    render() {
        return (
            <div id="wall-of-fame-header">
                <div className="vertical-align">
                    <center>
                        <h3>Together we will save the world!</h3>
                        <div>
                            <a className="btn btn-success" href="https://giveth.slack.com/" target="_blank" rel="noopener noreferrer">
                                <i className="fa fa-slack"></i>
                                &nbsp;Join Giveth
                        </a>
                        </div>
                    </center>
                </div>
            </div>
        )
    }
}

export default VideoWallOfFameHeader;