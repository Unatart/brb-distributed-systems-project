import {CommonDbManager} from "../../common/common_manager";
import {ThirdApp} from "./entity";
import {createDate} from "../../helpers";
import {TokenBase, TokenGenerator} from "ts-token-generator";
import {ErrorCodes} from "../../common/error_codes";


export class GatewayManager extends CommonDbManager<ThirdApp> {
    public async checkRegistration(app_id:string, app_secret:string) {
        return await this.repository.findOne({ where: { app_id, app_secret }});
    }

    public async createCode(user_id:string, app_id:string, app_secret:string) {
        const find_one =  await this.repository.findOne({where: {app_id, code: null}});
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
        const find_same = await this.repository.findOne({where: {code, app_id, app_secret }});
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
        const find_same = await this.repository.findOne({where: {refresh_token, app_id, app_secret}});
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
        const find_same = await this.repository.findOne({where: {user_id, app_id, token}});
        if (find_same) {
            return find_same;
        }

        throw Error(ErrorCodes.INCORRECT_AUTHORIZATION);
    }

    private checkTime(expires:string) {
        const curr_d = new Date(createDate());
        const d = new Date(expires);
        return curr_d.getTime() < d.getTime();
    }

    private token_gen = new TokenGenerator({ bitSize: 512, baseEncoding: TokenBase.BASE62 });
}
