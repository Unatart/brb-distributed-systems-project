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
            if (session.app_id) {
                throw Error(ErrorCodes.THIRD_PARTY_NOT_ALLOWED);
            }

            if (this.checkTime(session.expires)) {
                await this.repository.merge(session, {
                    expires: createDate(true),
                });
                return await this.repository.save(session);
            }

            throw Error(ErrorCodes.TOKEN_EXPIRED);
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
                await this.repository.merge(session, {
                    expires: createDate(true),
                });
                return await this.repository.save(session);
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

    public async createCode(user_id:string, app_id:string, app_secret:string, token:string) {
        const find_one =  await this.repository.findOne({where: {user_id: user_id, token:token, code: null}});
        if (find_one) {
            const session = {
                user_id: user_id,
                app_id: app_id,
                app_secret: app_secret,
                code: this.token_gen.generate()
            };

            const session_res = await this.repository.create(session);
            return await this.repository.save(session_res);
        }
    }

    public async createTokenForCode(code:string, app_id:string, app_secret:string) {
        const find_same = await this.repository.findOne({where: {code: code, app_id: app_id, app_secret: app_secret}});
        if (find_same) {
            await this.repository.merge(find_same, {
                token: this.token_gen.generate(),
                refresh_token: this.token_gen.generate(),
                expires: createDate(true),
            });
            return await this.repository.save(find_same);
        }
    }

    public async refreshTokenForCode(app_id:string, app_secret:string, refresh_token:string) {
        const find_same = await this.repository.findOne({where: {refresh_token: refresh_token, app_id: app_id, app_secret: app_secret}});
        if (find_same) {
            await this.repository.merge(find_same, {
                token: this.token_gen.generate(),
                refresh_token: this.token_gen.generate(),
                expires: createDate(true),
            });
            return await this.repository.save(find_same);
        }
    }

    public async checkForOauth(user_id:string, app_id:string, token:string) {
        const find_same = await this.repository.findOne({where: {user_id: user_id, app_id: app_id, token: token}});
        if (find_same) {
            return find_same;
        }

        throw Error(ErrorCodes.INCORRECT_AUTHORIZATION);
    }

    private checkTime(expires:string) {
        const curr_d = new Date(createDate());
        const d = new Date(expires);
        console.log(curr_d, d);
        return curr_d.getTime() < d.getTime();
    }

    private token_gen = new TokenGenerator({ bitSize: 512, baseEncoding: TokenBase.BASE62 });
}
