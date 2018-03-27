import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "./../img/wall-of-fame-logo-new.svg";

class MainMenu extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark mainNav">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Giveth logo" width="250px" height="auto" className="navLogo" />
        </Link>

        {/*
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
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/Giveth_Daily">Giveth Daily</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/Reward_DAO">Reward DAO</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/Regular_Rewards">Regular rewards</Link>
                        </li>
                    </ul>
                </div> 
        */}
      </nav>
    );
  }
}

export default MainMenu;
