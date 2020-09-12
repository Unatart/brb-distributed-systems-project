import * as React from "react";
import {Home} from "./Home/Home";
import {HashRouter, Route, Switch} from "react-router-dom";
import {CookieWorker} from "./helpers";
import {AuthWithHistory} from "./Auth/Auth";
import {BoardWithHistory} from "./Board/Board";
import {OAuth2Page} from "./OAuth2/OAuth2Page";
import {Admin} from "./Admin/Admin";

interface IAppState {
    is_auth:boolean;
}

export class App extends React.Component<{}, IAppState> {
    public state = { is_auth: false };

    public componentDidMount():void {
        this.checkCookie();
    }

    public render() {
        return (
            <HashRouter>
                <Switch>
                    <Route exact path="/">{this.state.is_auth
                        ? <BoardWithHistory update_handler={this.checkCookie}/>
                        : <Home/>
                    }</Route>
                    <Route path="/sign_in"><AuthWithHistory sign_in={true} update_handler={this.checkCookie}/></Route>
                    <Route path="/sign_up"><AuthWithHistory sign_in={false} update_handler={this.checkCookie}/></Route>
                    <Route path="/oauth"><OAuth2Page/></Route>
                    {this.cookie_worker.get("is_admin") && <Route path="/admin"><Admin update_handler={this.checkCookie}/></Route>}
                </Switch>
            </HashRouter>
        );
    }

    private checkCookie = () => {
        if (this.cookie_worker.get("uid")) {
            this.setState({ is_auth: true });
            return;
        }
        this.setState({ is_auth: false });
    }

    private cookie_worker = new CookieWorker();
}
