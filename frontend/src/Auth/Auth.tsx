import * as React from "react";
import "./Auth.css";
import "../Home/Home.css";
import {Link, useHistory} from "react-router-dom";
import {Navbar} from "../UiComponents/NavBar/NavBar";
import {CookieWorker} from "../helpers";

interface IAuthProps {
    sign_in:boolean;
    update_handler:() => void;
}

interface IAuthFullProps extends IAuthProps {
    history:any;
}

interface IAuthState {
    username:string,
    password:string,
    error?:string;
    groups?:string;
}

export class Auth extends React.Component<IAuthFullProps, IAuthState> {
    public state:IAuthState = {
        username: "",
        password: "",
        error: undefined
    };

    public render() {
        return (
            <>
                <div className="main">
                    <Navbar auth={true}/>
                    <div className="hover-main">
                        <form className="auth-form">
                            <input name="username" type="text" placeholder='Username' required={true} onChange={this.handleChange}/>
                            <input name='password' type='password' placeholder='Password' required={true} onChange={this.handleChange}/>
                            <input className='submit-btn' type='submit' value={this.props.sign_in ? "Sign in" : "Sign up"} onClick={this.handleSubmit}/>
                            <Link className="link" to={this.props.sign_in ? "/sign_up" : "/sign_in"}>{this.props.sign_in ? "Sign up" : "Sign in"}</Link>
                        </form>
                    </div>
                </div>
            </>
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

    private handleSubmit = (event:any) => {
        event.preventDefault();
        if (this.state.username && this.state.password) {
            if (this.props.sign_in) {
                return fetch("http://localhost:3000/auth/user/login", {
                    method: 'POST',
                    mode: 'cors',
                    credentials: "include",
                    headers: {
                        "Access-Control-Allow-Credentials": "true",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({name: this.state.username, password: this.state.password})
                })
                    .then((response) => response.json())
                    .then((data) => this.setData(data));
            }

            return fetch("http://localhost:3000/auth/user/", {
                method: 'POST',
                mode: 'cors',
                credentials: "include",
                headers: {
                "Access-Control-Allow-Credentials": "true",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name: this.state.username, password: this.state.password})
            })
                .then((response) => response.json())
                .then((data) => this.setData(data));
        }

        this.setState({error: "You must fill in the fields above."});
    }

    private setData(data:any) {
        this.cookie_worker.set("uid", data.user_id);
        this.cookie_worker.set("token", data.token);
        this.cookie_worker.set("expires", data.expires);
        this.props.history.push("/");
        this.props.update_handler();
    }

    private cookie_worker = new CookieWorker();

}

export function AuthWithHistory(props:IAuthProps) {
    let history = useHistory();

    return (
        <Auth history={history} {...props}/>
    );
}
