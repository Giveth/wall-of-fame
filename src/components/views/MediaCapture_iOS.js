import React, { Component } from 'react';
import PropTypes from 'prop-types'
import firebase from 'firebase';
import GoBackButton from '../GoBackButton'
import currentWeekNumber from 'current-week-number'


class MediaCapture_iOS extends Component {

    constructor(props) {
        super(props);

        var _week;
        var date = new Date();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        if(props.match.params.week != null ){
            _week = props.match.params.week;
          }else{
            _week = currentWeekNumber() + "_" + month + "_" + year;
          }

        this.state = {
            file: null,
            src: null,
            isVideo: false,
            isImage: false,
            showInput: true,
            upload: false,
            uploading: false,
            uploadSuccess: false,
            media: null,            
            title: "",
            description: "",
            week: _week,
            social: "",
            wallet: "",
            wall: "",
        };

        this.uploadFile = this.uploadFile.bind(this);
        this.handleFile = this.handleFile.bind(this);

    }

    handleFile(event) {
        this.setState({
            file: event.target.files[0],
            src: URL.createObjectURL(event.target.files[0])
        });
        if (event.target.files[0].type.includes('video')) {
            this.setState({
                isVideo: true,
                isImage: false,
                showInput: false,
                upload: true
            });
        } else if (event.target.files[0].type.includes('image')) {
            this.setState({
                isVideo: false,
                isImage: true,
                showInput: false,
                upload: true
            });
        }
    }

    uploadFile() {
        var timestamp = Date.now();
        var title = this.state.title;
        var description = this.state.description;
        // Create a root reference

        var week = currentWeekNumber();
        if ( week % 2 !== 0)
            week =  week - 1

        var storageRef = firebase.storage().ref('/GVWOF/' + this.state.week + '/' + title);
        

        var name = title;
        this.setState({ upload: false, uploading: true });
        storageRef.put(this.state.file).then((snapshot) => {
            var _type = '';
            if(this.state.isImage){
                _type = 'image'
            }else{
                _type = 'video'
            }


            
            storageRef.getDownloadURL().then((url) => {

                firebase.database().ref("GVWOF/" + this.state.week).push({
                    src: url,
                    name: name,
                    type: _type,
                    description: description,
                    timestamp: timestamp,
                    week: this.state.week,
                    wall: this.state.wall,
                    wallet: this.state.wallet,
                    social: this.state.social,
                });
            });

            this.setState({
                file: null,
                src: null,
                isVideo: false,
                isImage: false,
                showInput: true,
                upload: false,
                uploading: false,
                uploadSuccess: true
            });

            this.props.history.goBack();
        });
    }

    onChangeTitle(event) {
        this.setState({ title: event.target.value });
    }

    onChangeDescription(event) {
        this.setState({ description: event.target.value });
    }

    onChangeSocialHandle(event) {
        this.setState({ description: event.target.value });
    }

    onChangeWallet(event) {
        this.setState({ description: event.target.value });
    }

    render() {
        const history = this.props.history
        var mediaContent = null;
        if (this.state.isVideo) {
            mediaContent = <video controls autoPlay muted loop src={this.state.src} />;
        } else if (this.state.isImage) {
            mediaContent = <img src={this.state.src} className="img-responsive" alt="" width="240" />
        }

        return (
            <div className="container-fluid page-layout">
                <div className="row justify-content-md-center">
                    <div className="col-md-auto">
                        <GoBackButton history={history} />
                        <h1>Upload a new video or picture</h1>
                        {this.state.uploading ? <div>Uploading...</div> : null}
                        <div className="form-group">
                            <button type="button" style={{ display: this.state.upload ? 'block' : 'none' }} className="btn btn-success" onClick={this.uploadFile}>
                                Upload
                            </button>
                        </div>
                        <div className="form-group">
                            <label>Title:</label>
                            <input
                                className="form-control"
                                name="title"
                                id="title-input"
                                type="text"
                                value={this.state.title}
                                onChange={this.onChangeTitle.bind(this)}
                                placeholder="E.g. Climate change."
                            />
                        </div>
                        <div className="form-group">
                            <label>Description:</label>
                            <input
                                className="form-control"
                                name="description"
                                id="description-input"
                                type="text"
                                value={this.state.description}
                                onChange={this.onChangeDescription.bind(this)}
                                placeholder="Description of Climate change."
                            />
                        </div>
                        <div className="form-group">
                        <label>Slack/Riot handle:</label>
                        <input
                            className="form-control"
                            name="description"
                            id="description-input"
                            type="text"
                            value={this.state.social}
                            onChange={this.onChangeSocialHandle.bind(this)}
                            placeholder="What's your name on Slack/Riot.im?"
                        />
                        </div>
                        <div className="form-group">
                        <label>Public wallet address (Metamask, MEW,...)</label>
                        <input
                            className="form-control"
                            name="description"
                            id="description-input"
                            type="text"
                            value={this.state.wallet}
                            onChange={this.onChangeWallet.bind(this)}
                            placeholder="Provide wallet address to e.g. get rewarded"
                        />
                        </div>
                        <div className="form-check form-check-inline">
                        <div className="form-check form-check-inline">
                        <label className="form-check-label">
                            <input
                            className="form-check-input"
                            type="radio"
                            name="inlineRadioOptions"
                            id="inlineRadio2"
                            onChange={e => {
                                e.target.checked
                                ? this.setState({ wall: "Reward_DAO" })
                                : null;
                            }}
                            checked={this.state.wall === "Reward_DAO"}
                            />
                            Reward DAO
                        </label>
                        </div>
                        <div className="form-check form-check-inline">
                        <label className="form-check-label">
                            <input
                            className="form-check-input"
                            type="radio"
                            name="inlineRadioOptions"
                            id="inlineRadio3"
                            onChange={e => {
                                e.target.checked
                                ? this.setState({ wall: "Regular_Rewards" })
                                : null;
                            }}
                            checked={this.state.wall === "Regular_Rewards"}
                            />
                            Regular Rewards
                        </label>
                        </div>
                    </div>
                        <div className="form-group" >
                            {mediaContent}
                        </div>
                        <div className="form-group" style={{ display: this.state.showInput ? 'block' : 'none' }}>
                            <input type="file" accept="image/*;video/*" onChange={this.handleFile} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MediaCapture_iOS;

MediaCapture_iOS.propTypes = {
    history: PropTypes.object.isRequired,
}