import * as React from "react";
import "./Chat.css";
import {Group} from "../Board/Board";
import io from "socket.io-client";
import {CookieWorker} from "../helpers";
import {IMsgProps, Msg} from "../UiComponents/Msg/Msg";
import {BoardRequester} from "../Board/requests/BoardRequester";


interface IChatProps {
    current_group:Group;
    user_name:string;
}

interface IChatState {
    text?:string;
    messages:IMsgProps[];
}

export class Chat extends React.Component<IChatProps, IChatState> {
    constructor(props:IChatProps) {
        super(props);

        this.cookie_worker = new CookieWorker();

        this.socket = io(`http://localhost:3010`, {
            query: {
                group_id: this.props.current_group.id,
                user_id: this.cookie_worker.get("uid"),
                token: this.cookie_worker.get("token"),
                user_name: this.props.user_name
            },
            forceNew: true
        });

        this.state = { messages: [] };
    }
    public componentDidMount():void {
        this.setGroup();

        this.socket.on('new message', ((data:any) => {
            this.setState({
                text: '',
                messages: [...this.state.messages, { user_name: data.user_name, text: data.message, time: data.time, id: data.id }]
            });
        }));
    }

    componentDidUpdate(prevProps:Readonly<IChatProps>, prevState:Readonly<IChatState>, snapshot?:any) {
        if (prevProps.current_group.id !== this.props.current_group.id) {
            this.socket.emit('close');
            this.socket = io(`http://localhost:3010`, {
                query: {
                    group_id: this.props.current_group.id,
                    user_id: this.cookie_worker.get("uid"),
                    token: this.cookie_worker.get("token"),
                    user_name: this.props.user_name
                },
                forceNew: true
            });
            this.socket.on('new message', ((data:any) => {
                if (this.state.messages[this.state.messages.length - 1].id !== data.id) {
                    this.setState({ text: '',
                        messages: [...this.state.messages, {
                            user_name: data.user_name,
                            text: data.message,
                            time: data.time,
                            id: data.id
                        }]
                    });
                }
            }));
            this.setGroup();
        }

        if (this.scroll) {
            this.scrollToBottom();
        }
    }

    componentWillUnmount() {
        this.socket.emit('disconnect');
    }

    public render():React.ReactNode {
        return (
            <div className="container-chat">
                <div className="item-m">
                    {this.state.messages.length > 8 && <div className="load" onClick={this.addMsg}>load more</div>}
                    {this.state.messages.map((msg, ind) =>
                        <Msg
                            key={ind}
                            user_name={msg.user_name}
                            time={msg.time}
                            text={msg.text}
                            id={msg.id}
                        />)
                    }
                    <div ref={this.messagesEndRef}/>
                </div>
                <div className="item-w">
                    <textarea
                        className="msg"
                        name="text"
                        rows={2}
                        value={this.state.text}
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
            this.scroll = true;
        }
    };

    private handleChange = (event:any) => {
        event.preventDefault();
        const value = event.target.value;
        const name = event.target.name;

        this.setState({
            ...this.state,
            [name]: value
        });
    };

    private addMsg = () => {
        this.from = this.state.messages.length;
        this.to = this.state.messages.length + 15;
        this.scroll = false;

        this.requester.getMessagesForGroup(this.props.current_group.id, this.to, this.from)
            .then((data) => {
                const msg:IMsgProps[] = data.map((record:any) => (
                    {
                        user_name: record.user_id,
                        text: record.text,
                        time: record.time,
                        id: record.msg_id
                    }
                ));
                msg.push(...this.state.messages);

                this.setState({ messages: msg });
            });
    };

    private scrollToBottom = () => {
        this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    private setGroup() {
        this.requester.getMessagesForGroup(this.props.current_group.id, this.to)
            .then((data) => {
                const msg:IMsgProps[] = data.map((record:any) => (
                    {
                        user_name: record.user_name,
                        text: record.text,
                        time: record.time,
                        id: record.msg_id
                    }
                ));

                this.setState({ messages: msg });
                this.scrollToBottom();
            });
    }

    private scroll:boolean = true;
    private to:number = 10;
    private from:number | undefined;
    private messagesEndRef:any = React.createRef();
    private cookie_worker:CookieWorker;
    private socket:SocketIOClient.Socket;
    private requester:BoardRequester = new BoardRequester();
}
