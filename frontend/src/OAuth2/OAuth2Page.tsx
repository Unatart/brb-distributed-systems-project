import * as React from "react";
import {CookieWorker} from "../helpers";
import "./OAuth2Page.css";

export class OAuth2Page extends React.Component {
    public render() {
        return (
            <div className="oauth-area">
                <button className="access" type='submit' onClick={this.handleSubmit}>Provide access</button>
            </div>
        );
    }

    private handleSubmit = () => {
        const getQueryVariable = (variable:string) => {
            const query = window.location.href;
            let vars = query.split("&");
            for (let i = 0; i < vars.length; i++) {
                let pair = vars[i].split("=");
                if (pair[0].indexOf(variable) !== -1) {
                    return pair[1];
                }
            }
            return false;
        };
        const redirect_url = getQueryVariable("redirect_url");
        const client_id = getQueryVariable("client_id");
        const client_secret = getQueryVariable("client_secret");
        if (redirect_url && client_id && client_secret) {
            const user_id = this.cookie_worker.get("uid");
            const token = this.cookie_worker.get("token");
            if (user_id && token) {
                fetch("http://localhost:3000/oauth", {
                    method: "post",
                    mode: 'cors',
                    credentials: "include",
                    headers: {
                        "Access-Control-Allow-Credentials": "true",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer <" + token + ">"
                    },
                    body: JSON.stringify({
                        user_id: user_id,
                        client_id: client_id,
                        client_secret: client_secret
                    })
                }).then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    }
                })
                    .then((body) => {
                        console.log(body);
                        window.location.replace(redirect_url + "/?code=" + body.code);
                    })
                    .catch((error) => alert(error));
            } else {
                alert("U must authorize firstly");
            }
        } else {
            alert("Set redirect url, client id and client secret");
        }
    }

    private cookie_worker = new CookieWorker();
}
