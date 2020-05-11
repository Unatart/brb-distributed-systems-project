import React from "react"
import "./NavBar.css";

export function Navbar():JSX.Element {
    return (
        <ul>
            <li>
                <a>Sign in</a>
            </li>
            <li>
                <a>Sign out</a>
            </li>
        </ul>
    );
}
