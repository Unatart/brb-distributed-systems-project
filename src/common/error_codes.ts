export const enum ErrorCodes {
    USER_ALREADY_EXIST= "user already exist",
    INCORRECT_UID = "incorrect uid",
    INCORRECT_PASSWORD = "incorrect password",
    UID_REGEX_MATCH = "uid don't match regex",
    PASSWORD_REGEX_MATCH = "password don't match regex",
    USERNAME_REGEX_MATCH = "username don't match regex",
    USER_NAME_ENGAGED = "this user name already engaged",
    NO_MESSAGES = "no messages found",
    NO_SUCH_SERVICE = "no such service",
    TOKEN_EXPIRED = "token_expired",
    NO_SUCH_USER = "no such user, sign up pls",
    NO_SUCH_GROUP = "no such group",
    REQUIRE_TOKEN_AND_UID = "token and uid required"
}
