import React, { Component } from "react";
import styled from 'styled-components';
import moment from 'moment';
import fscreen from 'fscreen'
import * as Clipboard from 'clipboard';

import { Flex, Box } from 'grid-styled';
import { Tooltip } from './Tooltip';
import { Button, ButtonLink } from './Button';

const Container = styled.div`
  box-shadow: 1px 1px 10px 0 rgba(0,0,0,.25);
`

const Video = styled.video`
  margin-bottom: -5px;
  width: 100%;
`

const Title = styled.p`
  margin: 0;
  font-family: Quicksand;
  font-weight: 600;
  font-size: 18px;
  color: #2c0d53;
`

const Date = styled.p`
  margin: 0;
  margin-bottom: .5rem;
  font-family: Quicksand;
  font-size: 12px;
  color: #2c0d53;
`

const Description = styled.p`
  margin: 0;
  font-family: Quicksand;
  font-size: 14px;
  color: #2c0d53;
`

const Items = styled.p`
  margin: 0;
  margin-top: .5rem;
  font-family: Quicksand;
  font-weight: 600;
  font-size: 14px;
  color: #2c0d53;
`

class MediaCard extends Component {
  componentDidMount() {
    new Clipboard('.copy-to-clipboard');
  }

  handleMouseEnter() {
    this.video.play()
  }

  handleMouseLeave() {
    this.video.controls = false;
    if (!window.screenTop && !window.screenY) {
      this.video.muted = true;
    }
  }

  watchVideo() {
    fscreen.requestFullscreen(this.video);
    this.video.pause();
    this.video.currentTime = 0;
    this.video.muted = false;
    this.video.play();
  };

  handleDelete() {
    const web3 = window.web3

    if (!web3) {
      return alert('No injected web3 instance was detected - Please install e.g. MetaMask')
    }

    const { id } = this.props
    
    web3.personal.sign(web3.toHex(id),web3.eth.defaultAccount, (err, res) => {
      if (res) {
        fetch(location.origin + `/api/delete?videoId=${id}&signedMsg=${res}`)
          .then(function(res) {
            res.ok ? alert('Succesfully deleted video') : alert('Something went wrong with deleting your video')
          })
      }
    })
  }

  render() {
    const { src, title, description, wall, wallet, social, timestamp, id } = this.props;
    const date = moment(timestamp).format('HH:mm DD-MM-YYYY');
    const olderThanOneDay = !!moment().diff(moment(timestamp), 'days')

    const metaMaskAddress = window.web3 ? web3.eth.defaultAccount : false

    return (
      <Container
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
      >
        <Video src={src} muted innerRef={(ref) => this.video = ref} />
        <Box p={3}>
          <Title>{title || 'No title'}</Title>
          <Date><span className="fa fa-clock-o" aria-hidden="true" /> {date}</Date>
          <Description>{description || 'No description'}</Description>
          {wall && <Items><span className="fa fa-th-large" aria-hidden="true" /> WALL: {wall.split('_').join(' ')}</Items>}
          {social && <Items><span className="fa fa-user" aria-hidden="true" /> SOCIAL: {social}</Items>}
          {wallet && <Items><span className="fa fa-address-card" aria-hidden="true" /> WALLET: {wallet}</Items>}
          <Box mt={3}>
            <Button color="#2c0d54" bgcolor="white" onClick={this.watchVideo.bind(this)}>
              WATCH <span className="fa fa-video-camera" aria-hidden="true" />
            </Button>
            <Flex mt={2} mb={2}>
              <ButtonLink href={src} width="100%" mr={1} color="#2c0d54" bgcolor="white">
                FIREBASE <span className="fa fa-database" aria-hidden="true" />
              </ButtonLink>
              <Tooltip width="100%" ml={1} bgcolor="#2c0d54" message="Copied link to clipboard!">
                <Button className="copy-to-clipboard" color="#2c0d54" bgcolor="white" data-clipboard-text={location.origin + "/view/" + id}>
                  SHARE <span className="fa fa-share" aria-hidden="true" />
                </Button>
              </Tooltip>
            </Flex>
            {(!olderThanOneDay && wallet === metaMaskAddress) && <Button onClick={this.handleDelete.bind(this)} color="red" bgcolor="white">
              DELETE <span className="fa fa-trash" aria-hidden="true" />
            </Button>}
          </Box>
        </Box>
      </Container>
    )
  }
}

export default MediaCard;
