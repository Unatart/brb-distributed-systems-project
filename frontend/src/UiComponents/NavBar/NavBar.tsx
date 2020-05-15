import React from "react"
import {Link} from "react-router-dom";
import "./NavBar.css";

interface INavBarProps {
    auth: boolean;
}

export function Navbar(props: INavBarProps):JSX.Element {
    if (props.auth) {
        return (
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
            </ul>
        );
    }

    return (
        <ul>
            <li>
                <Link to="/sign_in">Sign in</Link>
            </li>
            <li>
                <Link to="/sign_up">Sign up</Link>
            </li>
        </ul>
    );
}
