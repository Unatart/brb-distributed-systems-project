import * as React from "react";
import {Home} from "./Home/Home";
import {HashRouter, Route, Switch} from "react-router-dom";
import {CookieWorker} from "./helpers";
import {AuthWithHistory} from "./Auth/Auth";
import {Board} from "./Board/Board";

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
                    <Route exact path="/">
                        {this.state.is_auth ? <Board/> : <Home/>}
                    </Route>
                    <Route path="/sign_in"><AuthWithHistory sign_in={true} update_handler={this.checkCookie}/></Route>
                    <Route path="/sign_up"><AuthWithHistory sign_in={false} update_handler={this.checkCookie}/></Route>
                    <Route path="/oauth"><Home/></Route>
                </Switch>
            </HashRouter>
        );
    }

    private checkCookie = () => {
        if (this.cookie_worker.get("uid")) {
            this.setState({ is_auth: true });
        }
    }

    private cookie_worker = new CookieWorker();
}