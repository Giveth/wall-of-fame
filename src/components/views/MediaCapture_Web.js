import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase";
import RecordRTC from "recordrtc";
import GoBackButton from "../GoBackButton";
import currentWeekNumber from "current-week-number";
import { DropdownButton, MenuItem } from "react-bootstrap";

function hasGetUserMedia() {
  return !!(
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  );
}

class MediaCapture_Web extends Component {
  constructor(props) {
    super(props);

    var _wall = "";
    var date = new Date();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var _week = currentWeekNumber() + "_" + month + "_" + year;

    if (props.match.params.wall != null) {
      _wall = props.match.params.wall;
    }

    this.state = {
      file: null,
      src: null,
      blob: null,
      isVideo: false,
      isImage: false,
      upload: false,
      uploading: false,
      uploadSuccess: false,
      media: null,
      recording: false,
      isRecording: false,
      ipfsId: "",
      isScreenSharing: false,
      isCamera: false,
      isExtensionInstalled: true,
      stream: null,
      screenStream: null,
      cameraStream: null,
      mixedStream: null,
      title: "",
      description: "",
      week: _week,
      wall: _wall,
      social: "",
      wallet: "",
    };

    this.uploadFile = this.uploadFile.bind(this);
    // this.uploadRecording = this.uploadRecording.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.upload = this.upload.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.getScreenSharing = this.getScreenSharing.bind(this);
    this.getBoth = this.getBoth.bind(this);
    this.selectType = this.selectType.bind(this);
    this.stopAll = this.selectType.bind(this);
  }

  componentDidMount() {
    if (!hasGetUserMedia()) {
      alert(
        "Your browser cannot stream from your webcam. Please switch to Chrome or Firefox."
      );
      return;
    }
  }

  handleFile(event) {
    this.setState({ isRecording: false });
    this.setState({
      file: event.target.files[0],
      src: URL.createObjectURL(event.target.files[0])
    });
    if (event.target.files[0].type.includes("video")) {
      this.setState({
        isVideo: true,
        isImage: false,
        upload: true
      });
    } else if (event.target.files[0].type.includes("image")) {
      this.setState({
        isVideo: false,
        isImage: true,
        upload: true
      });
    }
  }

  startRecord() {
    var self = this;

    window.setSrcObject(
      self.state.stream.getMixedStream(),
      document.querySelector("video")
    );

    self.setState(
      {
        recordVideo: RecordRTC(this.state.stream.getMixedStream(), {
          type: "video",
          previewStream: function(s) {
            document.querySelector("video").muted = true;
            window.setSrcObject(s, document.querySelector("video"));
          }
        })
      },
      function() {
        self.state.recordVideo.startRecording();
      }
    );

    // window.setSrcObject(_stream, document.querySelector('video'));
    this.setState({ recording: true, isRecording: true });
  }

  stopRecord() {
    this.setState({ recording: false });
    this.setState({ upload: true });
    this.state.recordVideo.stopRecording(() => {
      this.setState({
        src: window.URL.createObjectURL(this.state.recordVideo.blob),
        blob: this.state.recordVideo.blob
      });
      RecordRTC.writeToDisk();
    });
  }

  upload() {
    if (this.state.isRecording) {
      let reader = new FileReader();
      reader.onloadend = () => this.saveToIpfs(reader);
      reader.readAsArrayBuffer(this.state.blob);
      //this.uploadRecording();
    } else {
      //this.uploadFile();

      let reader = new FileReader();
      reader.onloadend = () => this.saveToIpfs(reader);
      reader.readAsArrayBuffer(this.state.file);
    }
  }

  saveToIpfs = reader => {
    this.uploadFile();

    // const ipfs = new window.IpfsApi("35.188.240.194", "443", {
    //   protocol: "https"
    // });
    // const buffer = Buffer.from(reader.result);
    // ipfs
    //   .add(buffer)
    //   .then(response => {
    //     //if (err) { console.log(err); return}
    //     this.setState({ ipfsId: response[0].hash });
    //     if (this.state.isRecording) {
    //       this.uploadRecording();
    //     } else {
    //       this.uploadFile();
    //     }
    //   })
    //   .catch(error => {
    //     if (this.state.isRecording) {
    //       this.uploadRecording();
    //     } else {
    //       this.uploadFile();
    //     }
    //   });
  };

  arrayBufferToString = arrayBuffer => {
    return String.fromCharCode.apply(null, new Uint16Array(arrayBuffer));
  };

  uploadFile() {
    var self = this;
    var title = this.state.title;
    var description = this.state.description;
    var wall = this.state.wall;
    var social = this.state.social;
    var wallet = this.state.wallet;
    var week = this.state.week;
    var timestamp = Date.now();

    if ([title, description, wall, social, wallet].filter((element) => !element).length) {
      return alert("You're missing a field! Please check again.")
    }

    var storageRef = firebase
      .storage()
      .ref("/GVWOF_v2/" + week + "/" + title);
    var self = this;

    this.setState({ uploading: true }, function() {
      storageRef.put(self.state.blob || self.state.file).then(snapshot => {
        var _type = "";
        if (self.state.isImage) {
          _type = "image";
        } else {
          _type = "video";
        }

        storageRef.getDownloadURL().then(url => {
          firebase
            .database()
            .ref("GVWOF_v2/")
            .push(
              {
                src: url,
                title: title,
                description: description,
                type: _type,
                timestamp: timestamp,
                week: week,
                wall: wall,
                social: social,
                wallet: wallet,
                ipfs: "http://35.188.240.194:8080/ipfs/" + self.state.ipfsId
              },
              function() {
                if (self.state.cameraStream) {
                  self.state.cameraStream.stop();
                  self.setState({ cameraStream: null });
                }
                if (self.state.screenStream) {
                  self.state.screenStream.stop();
                  self.setState({ screenStream: null });
                }
                self.setState({
                  file: null,
                  src: null,
                  isVideo: false,
                  isImage: false,
                  upload: false,
                  uploading: false,
                  uploadSuccess: true
                });
                self.props.history.goBack();
              }
            );
        });
      });
    });
  }

  // uploadRecording() {
  //   // Create a root reference
  //   var self = this;
  //   var title = this.state.title;
  //   var description = this.state.description;
  //   var wall = this.state.wall;
  //   var social = this.state.social;
  //   var wallet = this.state.wallet;
  //   var week = this.state.week;
  //   var timestamp = Date.now();

  //   if ([title, description, wall, social, wallet].filter((element) => !element).length) {
  //     return alert("You're missing a field! Please check again.")
  //   }

  //   var storageRef = firebase
  //     .storage()
  //     .ref("/GVWOF_v2/" + week + "/" + title);

  //   this.setState({ uploading: true });

  //   storageRef.put(this.state.blob).then(snapshot => {
  //     var _type = "";
  //     if (this.state.isImage) {
  //       _type = "image";
  //     } else {
  //       _type = "video";
  //     }

  //     storageRef.getDownloadURL().then(url => {
  //       firebase
  //         .database()
  //         .ref("GVWOF_v2/")
  //         .push(
  //           {
  //             src: url,
  //             title: title,
  //             description: description,
  //             type: _type,
  //             timestamp: timestamp,
  //             week: week,
  //             wall: wall,
  //             social: social,
  //             wallet: wallet,
  //             ipfs: "http://35.188.240.194:8080/ipfs/" + self.state.ipfsId
  //           },
  //           function() {
  //             self.setState({
  //               file: null,
  //               src: null,
  //               isVideo: false,
  //               isImage: false,

  //               upload: false,
  //               uploading: false,
  //               uploadSuccess: true
  //             });

  //             if (self.state.cameraStream) {
  //               self.state.cameraStream.stop();
  //               self.setState({ cameraStream: null });
  //             }

  //             if (self.state.screenStream) {
  //               self.state.screenStream.stop();
  //               self.setState({ screenStream: null });
  //             }

  //             self.props.history.goBack();
  //           }
  //         );
  //     });
  //   });
  // }

  handleCheckBoxChange(event) {
    var self = this;
    var value = event.target.value;
    if (self.state.cameraStream) {
      self.state.cameraStream.stop();
    }
    if (self.state.screenStream) {
      self.state.screenStream.stop();
    }

    if (self.state.stream) {
      this.state.stream.releaseStreams();
      this.setState(
        {
          stream: null
        },
        function() {
          switch (value) {
            case "ScreenSharing":
              if (self.state.isScreenSharing) {
                self.setState(
                  { isScreenSharing: false, isVideo: true },
                  function() {
                    self.selectType();
                  }
                );
              } else {
                self.setState(
                  { isScreenSharing: true, isVideo: true },
                  function() {
                    self.selectType();
                  }
                );
              }
              break;
            case "Camera":
              if (self.state.isCamera) {
                self.setState({ isCamera: false, isVideo: true }, function() {
                  self.selectType();
                });
              } else {
                self.setState({ isCamera: true, isVideo: true }, function() {
                  self.selectType();
                });
              }
              break;
            default:
              break;
          }
        }
      );
    } else {
      switch (event.target.value) {
        case "ScreenSharing":
          if (this.state.isScreenSharing) {
            this.setState(
              { isScreenSharing: false, isVideo: true },
              function() {
                self.selectType();
              }
            );
          } else {
            this.setState({ isScreenSharing: true, isVideo: true }, function() {
              self.selectType();
            });
          }
          break;
        case "Camera":
          if (this.state.isCamera) {
            this.setState({ isCamera: false, isVideo: true }, function() {
              this.selectType();
            });
          } else {
            this.setState({ isCamera: true, isVideo: true }, function() {
              this.selectType();
            });
          }
          break;
        default:
          break;
      }
    }
  }

  selectType() {
    if (this.state.isScreenSharing && this.state.isCamera) {
      this.getBoth();
    } else if (this.state.isScreenSharing && !this.state.isCamera) {
      this.detectExtension(this)
    } else if (!this.state.isScreenSharing && this.state.isCamera) {
      this.getCamera();
    }
  }

  getScreenSharing() {
    var self = this;
    window.getScreenId(function(error, sourceId, screen_constraints) {
      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then(function(audioStream) {
          if (error) {
            console.log(error);
            return;
          }
          navigator.getUserMedia =
            navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
          navigator.mediaDevices
            .getUserMedia(screen_constraints)
            .then(function(_screenStream) {
              _screenStream.fullcanvas = true;
              _screenStream.width = window.screen.width; // or 3840
              _screenStream.height = window.screen.height; // or 2160

              self.setState(
                {
                  screenStream: _screenStream,
                  stream: new window.MultiStreamsMixer([
                    _screenStream,
                    audioStream
                  ])
                },
                function() {
                  self.state.stream.frameInterval = 1;
                  self.state.stream.startDrawingFrames();
                  window.setSrcObject(
                    self.state.stream.getMixedStream(),
                    document.querySelector("video")
                  );
                }
              );
            });
        });
    });
  }

  getCamera() {
    var self = this;
    captureUserMedia(stream => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(function(_cameraStream) {
          //_cameraStream.width = 640;
          //_cameraStream.height = 480;
          self.setState(
            {
              cameraStream: _cameraStream,
              stream: new window.MultiStreamsMixer([_cameraStream])
            },
            function() {
              self.state.stream.frameInterval = 1;
              self.state.stream.startDrawingFrames();
              window.setSrcObject(
                self.state.stream.getMixedStream(),
                document.querySelector("video")
              );
            }
          );
        });
    });
  }

  getBoth() {
    var self = this;
    captureUserMedia(stream => {
      window.getScreenId(function(error, sourceId, screen_constraints) {
        navigator.mediaDevices
          .getUserMedia(screen_constraints)
          .then(function(screenStream) {
            navigator.mediaDevices
              .getUserMedia({ video: true, audio: true })
              .then(function(cameraStream) {
                screenStream.fullcanvas = true;
                screenStream.width = window.screen.width; // or 3840
                screenStream.height = window.screen.height; // or 2160

                cameraStream.width = 320;
                cameraStream.height = 240;
                cameraStream.top = screenStream.height - cameraStream.height;
                cameraStream.left = screenStream.width - cameraStream.width;

                self.setState(
                  {
                    cameraStream: cameraStream,
                    screenStream: screenStream,
                    stream: new window.MultiStreamsMixer([
                      screenStream,
                      cameraStream
                    ])
                  },
                  function() {
                    self.state.stream.frameInterval = 1;
                    self.state.stream.startDrawingFrames();
                    window.setSrcObject(
                      self.state.stream.getMixedStream(),
                      document.querySelector("video")
                    );
                  }
                );
              });
          });
      });
    });
  }

  detectExtension(self) {
    if (!!navigator.mozGetUserMedia) return;

    var extensionid = "ajhifddimkapgcifgcodmmfdlknahffk";

    var image = document.createElement("img");
    image.src = "chrome-extension://" + extensionid + "/icon.png";
    image.onload = function() {
      self.getScreenSharing();
      //DetectRTC.screen.chromeMediaSource = 'screen';
      
      // window.postMessage("are-you-there", "*");
      // setTimeout(function() {
      //   //if (!DetectRTC.screen.notInstalled) {
      //   //callback('installed-enabled');
      //   //alert('Not Installed')
      //   //}
      // }, 2000);
    };
    image.onerror = function() {
      //DetectRTC.screen.notInstalled = true;
      //callback('not-installed');
      self.setState({ isExtensionInstalled: false });
    };
  }

  onChangeTitle(event) {
    this.setState({ title: event.target.value });
  }

  onChangeDescription(event) {
    this.setState({ description: event.target.value });
  }

  onChangeSocialHandle(event) {
    this.setState({ social: event.target.value });
  }

  onChangeWallet(event) {
    this.setState({ wallet: event.target.value });
  }

  render() {
    const history = this.props.history;
    return (
      <div className="container-fluid page-layout">
        <div className="row justify-content-md-center">
          <div className="col-md-auto">
            <GoBackButton history={history} />
            <h1>Upload a new video or picture</h1>
            <div
              className="alert alert-danger"
              role="alert"
              style={{
                display: this.state.isExtensionInstalled ? "none" : "block"
              }}
            >
              <strong>You need to install this </strong>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk"
                className="alert-link"
              > Chrome extension </a>
               and reload
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
                  RewardDAO
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

            <div className="form-group">
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="cameraCheckBox"
                    value="Camera"
                    onChange={this.handleCheckBoxChange}
                  />
                  Camera
                </label>
              </div>
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="screenSharingCheckBox"
                    value="ScreenSharing"
                    onChange={this.handleCheckBoxChange}
                  />
                  Screen sharing
                </label>
              </div>
            </div>

            <div className="form-group">
              <video
                id="video"
                width="640"
                loop
                controls
                autoPlay
                muted
                style={{ display: this.state.isVideo ? "block" : "none" }}
                src={this.state.src}
              />
              <img
                src={this.state.src}
                style={{ display: this.state.isImage ? "block" : "none" }}
                className="img-responsive"
                alt=""
                width="240"
              />
            </div>
            
            {this.state.isVideo && (<div className="form-group">
              <button
                className="btn btn-success"
                onClick={this.startRecord}
                style={{ display: this.state.recording ? "none" : "block" }}
              >
                Start Record
              </button>
              <button
                className="btn btn-danger"
                onClick={this.stopRecord}
                style={{ display: this.state.recording ? "block" : "none" }}
              >
                Stop Record
              </button>
            </div>)}
           

            <div
              className="form-group"
              style={{ display: this.state.upload ? "block" : "none" }}
            >
              <button
                type="button"
                className="btn btn-success"
                onClick={this.upload}
              >
                {this.state.uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            {this.state.uploadSuccess && <div style={{marginBottom: '1rem', color: 'green'}}>Video successfully uploaded!</div>}
            <div className="form-group">
              <input
                type="file"
                accept="image/*;video/*"
                onChange={this.handleFile}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// handle user media capture
export function captureUserMedia(callback) {
  var params = { audio: true, video: true };

  navigator.getUserMedia(params, callback, error => {
    alert(JSON.stringify(error));
  });
}

export default MediaCapture_Web;

MediaCapture_Web.propTypes = {
  history: PropTypes.object.isRequired
};
