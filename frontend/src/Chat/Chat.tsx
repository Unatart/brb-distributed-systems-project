import * as React from "react";
import "./Chat.css";
import {Group} from "../Board/Board";
import io from "socket.io-client";
import {CookieWorker} from "../helpers";

interface IChatProps {
    current_group:Group;
}

interface IChatState {
    text?:string;

    messages:string[];
}

export class Chat extends React.Component<IChatProps, IChatState> {
    constructor(props:IChatProps) {
        super(props);

        this.cookie_worker = new CookieWorker();

        this.socket = io(`http://localhost:3010`, {
            query: {
                group_id: this.props.current_group.id,
                uid: this.cookie_worker.get("uid"),
                token: this.cookie_worker.get("token")
            },
            forceNew: true
        });

        this.state = { messages: [] };
    }

    public componentDidMount():void {
        this.socket.on('new message', ((data:any) => {
            this.setState({ text: '', messages: [...this.state.messages, data.message] });
        }));
    }

    public render():React.ReactNode {
        return (
            <div className="container-chat">
                <div className="item-m">
                    {this.state.messages.map((msg, ind) => <div className="text" key={ind}>{msg}</div>)}
                </div>
                <div className="item-w">
                    <textarea
                        className="msg"
                        name="text"
                        rows={2}
                        placeholder='Start messaging here'
                        onChange={this.handleChange}
                        onKeyUp={this.sendMsg}
                    />
                </div>
            </div>
        );
    }

    private sendMsg = (event:any) => {
        event.preventDefault();
        if (event.keyCode === 13) {
            this.socket.emit('new message', this.state.text);
        }
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

    private cookie_worker:CookieWorker;
    private socket:SocketIOClient.Socket;
}
