import React, { Component } from 'react'
import firebase from 'firebase';

//import { Link } from 'react-router-dom'

class VideoWallOfFameHeader extends Component {

    constructor() {
        super()

       var _ref = firebase.database().ref("GVWOF_v2/").orderByKey().limitToLast(1)

        this.state = {
            databaseRef: _ref,
            media:[],
            src:""
        }

        _ref.on('value', this.gotData, (err) => { console.log(err) });

    }

    //get the data from the firebase and push them out
    gotData = (data) => {
        var newMedia = this.state.media
        const mediadata = data.val();
        console.log(mediadata)

        if (!mediadata)
            return

        var keys = Object.keys(mediadata)

        for (var i = 0; i < keys.length; i++) {
            const k = keys[i];

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


        this.setState({
            src: newMedia[0].src
        });



    }


    render() {
        return (
            <div id="wall-of-fame-header">
                <div>
                    <video className="VideoHeader" autoPlay muted loop src={this.state.src} />
                </div>
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