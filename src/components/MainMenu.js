import React, { Component } from "react";
import { Link } from "react-router-dom";

class MainMenu extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top navbar-color">
        <a className="navbar-brand" href="https://giveth.io/">
          <img
            src="https://d33wubrfki0l68.cloudfront.net/fda56da65c9ace3f4ce449bc018a1abc6cc9dfd4/0274d/assets/giveth-typelogo-white.svg"
            width="100px"
            height="auto"
            alt=""
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <a className="nav-link" href="https://giveth.io/#communities">
                Platform
              </a>
            </li>
            <li className="nav-item">
              
              <a className="nav-link" href="https://giveth.io/#dac">
                Community
              </a>
            </li>
            <li className="nav-item">
              
              <a className="nav-link" href="https://giveth.io/#developers-corner">
                Developers
              </a>
            </li>
            <li className="nav-item">
              
              <a className="nav-link" href="https://giveth.io/#unicorn-dac">
                Unicorns
              </a>
            </li>
            <li className="nav-item">
              
              <a className="nav-link" href="https://wiki.giveth.io">
                Wiki
              </a>
            </li>
          </ul>
          <a className="main-buttons" href="https://giveth.io/join/" style={{textDecoration: "none", color: "white"}}>
            Join
          </a>
          <a className="main-buttons" href="https://giveth.io/donate/" style={{textDecoration: "none", color: "white"}}>
            Donate
          </a>
        </div>
      </nav>
    );
  }
}

export default MainMenu;
