import {CookieWorker} from "../../helpers";

export class BoardRequester {
    public getInfo():Promise<any> {
        return fetch(`http://localhost:3001/users/${this.uid}/?user_id=${this.uid}`,
            {
                method: 'GET',
                mode: 'cors',
                credentials: "include",
                headers: {
                    "Access-Control-Allow-Credentials": "true",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer <" + this.token + ">"
                }
            }
        ).then((res) => {
            if (res.status === 401) {
                this.cookie_worker.deleteAllCookies();
            }
            return res.json();
        })
    }

    public updateInfo(body:any) {
        return fetch(`http://localhost:3001/users/${this.uid}/?user_id=${this.uid}`,
            {
                method: 'PATCH',
                mode: 'cors',
                credentials: "include",
                headers: {
                    "Access-Control-Allow-Credentials": "true",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer <" + this.token + ">"
                },
                body: body
            });
    }

    public findContact(body:any) {
        return fetch(`http://localhost:3003/groups/?user_id=${this.uid}`,
            {
                method: 'POST',
                mode: 'cors',
                credentials: "include",
                headers: {
                    "Access-Control-Allow-Credentials": "true",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer <" + this.token + ">"
                },
                body: body
            })
            .then((res) => {
                if (res.status === 401) {
                    this.cookie_worker.deleteAllCookies();
                }
                return res.json();
            });
    }

    public getUserParticipantGroup() {
        return fetch(`http://localhost:3003/groups/${this.uid}/?user_id=${this.uid}`,
            {
                method: 'GET',
                mode: 'cors',
                credentials: "include",
                headers: {
                    "Access-Control-Allow-Credentials": "true",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer <" + this.token + ">"
                }
            })
            .then((res) => {
                if (res.status === 401) {
                    this.cookie_worker.deleteAllCookies();
                }
                return res.json();
            });
    }

    public getMessagesForGroup(group_id:string, to:number, from?:number) {
        return fetch(`http://localhost:3002/msg/${group_id}/?user_id=${this.uid}&to=${to}&from=${from}`,
            {
                method: "GET",
                mode: 'cors',
                credentials: "include",
                headers: {
                    "Access-Control-Allow-Credentials": "true",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer <" + this.token + ">"
                }
            })
            .then((res) => {
                if (res.status === 401) {
                    this.cookie_worker.deleteAllCookies();
                }
                return res.json();
            })
    }

    private cookie_worker = new CookieWorker();
    private uid = this.cookie_worker.get("uid");
    private token = this.cookie_worker.get("token");
}
