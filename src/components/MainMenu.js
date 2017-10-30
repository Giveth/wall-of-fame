import React, { Component } from 'react'
import { Link } from 'react-router-dom'


class MainMenu extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark">
                <Link className="navbar-brand" to="/">Giveth - WALL OF FAME</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
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
            </nav>
        )
    }
}

export default MainMenu;
