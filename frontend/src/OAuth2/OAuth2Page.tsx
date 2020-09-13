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
        };
        const redirect_url = getQueryVariable("redirect_url");
        const app_id = getQueryVariable("app_id");
        const app_secret = getQueryVariable("app_secret");
        if (redirect_url && app_id && app_secret) {
            const user_id = this.cookie_worker.get("uid");
            const token = this.cookie_worker.get("token");
            if (user_id && token) {
                fetch(`http://localhost:3005/oauth/?user_id=${user_id}`, {
                    method: "post",
                    mode: 'cors',
                    credentials: "include",
                    headers: {
                        "Access-Control-Allow-Credentials": "true",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer <" + token + ">"
                    },
                    body: JSON.stringify({
                        app_id: app_id,
                        app_secret: app_secret
                    })
                }).then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    }
                })
                    .then((body) => window.location.replace(redirect_url + "/?code=" + body.code))
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
