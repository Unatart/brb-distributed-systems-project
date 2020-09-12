import * as React from "react";
import "./Admin.css";
import {Requester} from "../requests/Requester";
import {CookieWorker} from "../helpers";


interface IAdminState {
    service_name?:string;
    method?:string;
    count?:number;
}

export class Admin extends React.PureComponent<{update_handler:() => void;}, IAdminState> {
    public render() {
        return (
            <div className="main">
                <div className="hover-main">
                    <div className="AdminBoard">
                        <div>Service name:</div>
                        <select name="service_name" onChange={this.handleChange}>
                            <option/>
                            <option>AUTH</option>
                            <option>USER</option>
                            <option>GROUP</option>
                            <option>MSG</option>
                        </select>
                        <div>Method:</div>
                        <select name="method" onChange={this.handleChange}>
                            <option/>
                            <option>GET</option>
                            <option>POST</option>
                            <option>PATCH</option>
                            <option>DELETE</option>
                        </select>
                        <div>Number of records:</div>
                        <input className="AdminInput" type="text" name="count" onChange={this.handleChange}/>
                        <input className="submit-btn" type="submit" value="Submit" onClick={this.getStat}/>
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

    private getStat = (event:any) => {
        event.preventDefault();

        const service_name = this.state.service_name === "" ? undefined : this.state.service_name;
        const method = this.state.method === "" ? undefined : this.state.method;

        this.requester.getStat(service_name, method, this.state.count)
            .then((res) => {
                const data = res.map((record:any) => JSON.stringify(record));
                const blob = new Blob([data.join("\n")], {type: "text/plain"});
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `stat_${service_name}_${method}_${new Date().toISOString()}.json`;
                link.href = url;
                link.click();
            });
    }

    private logout = () => {
        this.cookie_worker.deleteAllCookies();
        this.props.update_handler();
    }

    private cookie_worker = new CookieWorker();
    private requester:Requester = new Requester(this.logout)
}
