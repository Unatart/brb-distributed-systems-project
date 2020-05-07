import {CommonDbManager} from "../../common/common_manager";
import {Auth} from "./entity";
import {TokenGenerator, TokenBase} from "ts-token-generator";
import {ErrorCodes} from "../../common/error_codes";
import {createDate} from "../../helpers";

export class AuthManager extends CommonDbManager<Auth> {
    public async create(body:any) {
        const session = await this.repository.create({
            user_id: body.user_id,
            token: this.token_gen.generate(),
            expires: createDate(true)
        });

        return await this.repository.save(session);
    }

    public async update(id:string) {
        const session = await this.repository.findOne({ where: { user_id: id }});

        if (session) {
            await this.repository.merge(session, {
                token: this.token_gen.generate(),
                expires: createDate(true),
            });
            return await this.repository.save(session);
        }

        throw Error(ErrorCodes.NO_SUCH_USER);
    }

    public async checkAndUpdate(id:string, token:string) {
        const session = await this.repository.findOne({ where: { user_id: id, token: token }});

        if (session) {
            if (!this.checkTime(session.expires)) {
                throw Error(ErrorCodes.TOKEN_EXPIRED);
            }

            await this.repository.merge(session, {
                token: this.token_gen.generate(),
                expires: createDate(true),
            });
            return await this.repository.save(session);
        }

        throw Error(ErrorCodes.NO_SUCH_USER);
    }

    public async serviceCreate(key:string, secret:string) {
        const session = await this.repository.findOne({ where: { service_key: key, service_secret: secret } });
        if (session) {
            await this.repository.merge(session, {
                token: this.token_gen.generate(),
                expires: createDate(true),
            });
            return await this.repository.save(session);
        }

        throw Error(ErrorCodes.NO_SUCH_SERVICE);
    }

    public async serviceCheck(key:string, secret:string, token:string) {
        const session = await this.repository.findOne({
            where: {
                service_key: key,
                service_secret: secret,
                token: token
            }
        });

        if (session) {
            if (this.checkTime(session.expires)) {
                return session;
            }

            throw Error(ErrorCodes.TOKEN_EXPIRED);
        }

        throw Error(ErrorCodes.NO_SUCH_SERVICE);
    }

    public async serviceUpdate(key:string, secret:string) {
        const session = await this.repository.findOne({ where: { service_key: key, service_secret: secret } });
        if (session) {
            if (!this.checkTime(session.expires)) {
                throw Error(ErrorCodes.TOKEN_EXPIRED);
            }
            await this.repository.merge(session, {
                token: this.token_gen.generate(),
                expires: createDate(true),
            });
            return await this.repository.save(session);
        }

        throw Error(ErrorCodes.NO_SUCH_SERVICE);
    }

    private checkTime(expires:string) {
        const curr_d = new Date(createDate());
        const d = new Date(expires);
        return curr_d.getTime() < d.getTime();
    }

    private token_gen = new TokenGenerator({ bitSize: 512, baseEncoding: TokenBase.BASE62 });
}
