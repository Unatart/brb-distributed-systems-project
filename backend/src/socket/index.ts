import {logInfo} from "../common/logger";
import * as request from "request-promise";
import {host} from "../common/host_config";
import {ErrorCodes} from "../common/error_codes";
import {createDate} from "../helpers";

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io
    .use(function(socket, next){
        if (socket.handshake.query && socket.handshake.query.token && socket.handshake.query.user_id){
            return request({
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
                uri: `http://localhost:${host.AUTH.port}/auth/user/${socket.handshake.query.user_id}/?token=${socket.handshake.query.token}`
            })
                .then(() => {
                    logInfo('authentication passed');
                    return next();
                })
                .catch(() => next(new Error(ErrorCodes.ERROR_403)));
        } else {
            next(new Error(ErrorCodes.ERROR_403));
        }
    })
    .on('connection', (socket) => {
        const group_id = socket.handshake.query.group_id;
        const user_name = socket.handshake.query.user_name;
        const user_id = socket.handshake.query.user_id;
        const token = socket.handshake.query.token;

        logInfo(`USER NAME AND ID: ${user_name}, ${user_id}.`);

        socket.join(group_id);
        logInfo(`NEW GROUP: ${group_id}.`);

        socket.on('new message', (data) => {
            logInfo(`Msg from ${user_id}: ${data}.`);
            const time = createDate();
            request({
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': `bearer<${token}>` },
                uri: `http://localhost:${host.MSG.port}/msg/?user_id=${user_id}`,
                body: JSON.stringify({
                    group_id: group_id,
                    user_id: user_id,
                    text: data,
                    time: time
                })
            }).then((result) => io.to(group_id).emit('new message', { message: data, user_name: user_name, time: time, id: result.msg_id }))
        });

        socket.on('close', () => {
            logInfo(`${user_name} has disconnected.`);
            // socket.connection.close
        });
});

http.listen(host.SOCKET.port, () => {
    logInfo(`Socket up and listening port №${host.SOCKET.port}.`)
});
