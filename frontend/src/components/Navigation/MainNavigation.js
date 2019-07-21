import React from 'react'
import { NavLink } from 'react-router-dom'

import './MainNavigation.css';

function MainNavigation(props) {
    return (
        <header className="main-navigation">
            <div className="main-navigation__logo">
                <h1>EventHandly</h1>
            </div>
            <nav className="main_navigation__item">
                <ul>
                <li><NavLink to="/auth">Authenticate</NavLink></li>
                    <li><NavLink to="/events">Events</NavLink></li>
                    <li><NavLink to="/bookings">Bookings</NavLink></li>
                </ul>
            </nav>
        </header>
    )
}

export default MainNavigation;