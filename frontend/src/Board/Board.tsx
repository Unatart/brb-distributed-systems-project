import * as React from "react";
import "./Board.css";
import {CookieWorker} from "../helpers";

interface IBoardState {
    name?:string;
    email?:string;
}

export class Board extends React.Component<{}, IBoardState> {
    public state:IBoardState = {}
    public componentDidMount() {
        const uid = this.cookie_worker.get("uid");
        fetch(`http://localhost:3001/users/${uid}/?user_id=${uid}`,
            {
                method: 'GET',
                mode: 'cors',
                credentials: "include",
                headers: {
                    "Access-Control-Allow-Credentials": "true",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer <" + this.cookie_worker.get("token") + ">"
                }
            }
        )
            .then((res) => {
                if (res.status === 401) {
                    this.cookie_worker.deleteAllCookies();
                }
                return res.json()
            })
            .then((data) => {
                console.log(data);
                this.setState({
                    name: data.name,
                    email: data.email
                })
            })
    }

    public render() {
        return (
            <div className="main">
                <div className="hover-main">
                    <div className="container">
                        <div className="item-a">
                            <div className="text">Username:</div>
                            <input type="text" name="name" placeholder={this.state.name} onKeyUp={this.updateInfo} onChange={this.handleChange}/>
                            <div className="text">E-mail:</div>
                            <input type="text" name="email" placeholder={this.state.email || "yours@mail.com"} onKeyUp={this.updateInfo} onChange={this.handleChange}/>
                        </div>
                        <div className="item-b">
                            <div className="text">Contact</div>
                            <div className="text">Contact</div>
                            <div className="text">Contact</div>
                            <div className="text">Contact</div>
                            <div className="text">Contact</div>
                            <div className="text">Contact</div>
                            <div className="text">Contact</div>
                            <div className="text">Contact</div>
                            <div className="text">Contact</div>
                            <div className="text">Contact</div>
                            <div className="text">Contact</div>
                        </div>
                        <div className="item-c">
                            <p className="ready_msg">Hello, Marie!</p>
                            <p className="ready_msg">Ola, Brian :D</p>
                            <p className="ready_msg">How was the lecture today?</p>
                            <p className="ready_msg">It was good, we are studying Algebra now.</p>
                            <p className="ready_msg">Brian writing new message...</p>
                        </div>
                        <div className="item-d"/>
                        <div className="item-g">
                            <textarea className="msg" rows={2} placeholder='Start messaging here' onKeyUp={this.updateInfo} onChange={this.handleChange}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private handleChange = (event:any) => {
        event.preventDefault();
        const value = event.target.value;
        const name = event.target.name;

        this.setState({
            ...this.state,
            [name]: value
        });
    }

    private updateInfo = (event:any) => {
        event.preventDefault();
        if (event.keyCode === 13) {
            const uid = this.cookie_worker.get("uid");
            fetch(`http://localhost:3001/users/${uid}/?user_id=${uid}`,
                {
                    method: 'PATCH',
                    mode: 'cors',
                    credentials: "include",
                    headers: {
                        "Access-Control-Allow-Credentials": "true",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer <" + this.cookie_worker.get("token") + ">"
                    },
                    body: JSON.stringify({
                        name: this.state.name,
                        email: this.state.email
                    })
                }
            )
        }
    }

    private cookie_worker = new CookieWorker();
}
