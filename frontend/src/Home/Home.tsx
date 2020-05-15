import * as React from "react";
import {Navbar} from "../UiComponents/NavBar/NavBar";
import "./Home.css"


export class Home extends React.Component {
    public render() {
        return (
            <>
                <div className="main">
                    <Navbar auth={false}/>
                    <div className="hover-main">
                        <div className="center">
                            <p className="name">BRB chat</p>
                            <p className="left">Hello, Marie!</p>
                            <p className="right">Ola, Brian :D</p>
                            <p className="left">How was the lecture today?</p>
                            <p className="right">It was good, we are studying Algebra now.</p>
                            <p className="left-writing">Brian writing new message...</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
