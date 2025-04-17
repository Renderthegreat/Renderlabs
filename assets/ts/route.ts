/*
 * Server side only!
 */
import { ManagerEvent, ManagerEventType, validateEventFormat } from "~/assets/ts/manager";
import { sql, Kysely, PostgresDialect } from "kysely";
import { db, pool } from "~/assets/ts/db";
import bcrypt from "bcrypt";
import { randomBytes, createCipheriv, createDecipheriv, scryptSync } from 'crypto';
import svgCaptcha from 'svg-captcha';
import { atob } from "buffer";
import { date } from "valibot";

const encryptionKey = randomBytes(32);
const iv = randomBytes(16);

export function encrypt(data: string) {
    const cipher = createCipheriv('aes-256-cbc', encryptionKey, iv);
    let encrypted = cipher.update(data, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return { data: encrypted, iv: iv.toString('hex') };
};
export function decrypt(encryptedData: string, ivHex: string) {
    const decipher = createDecipheriv('aes-256-cbc', encryptionKey, Buffer.from(ivHex, 'hex'));

    let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
};

export function validateCaptchaValidator(data: string, ivHex: string) {
    const decrypted = decrypt(data, ivHex);
    const expireTime = new Date(decrypted);
    if (new Date > expireTime) {
        return new ManagerEvent(ManagerEventType.OPERATION_FAILURE, {
            "status": 410,
            "description": "auth.captcha.validator_expired"
        });
    };
    return null;
};

export async function route(event: ManagerEvent): Promise<ManagerEvent> {
    const badRequest = (error: string | undefined) => {
        return new ManagerEvent(ManagerEventType.OPERATION_FAILURE, {
            "status": 400,
            "description": "bad_request",
            "error": error
        });
    };
    const serverError = new ManagerEvent(ManagerEventType.OPERATION_FAILURE, {
        "status": 500,
        "description": "server_error"
    });
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const validation = validateEventFormat({ eventType: event.eventType, parameters: event.parameters });
    if (!validation.success) {
        return badRequest(validation.error);
    };
    try {
        switch (event.eventType) {
            case ManagerEventType.CLIENT_INIT: {
                return new ManagerEvent(ManagerEventType.OPERATION_SUCCESS, {});
            };
            case ManagerEventType.ACCOUNT_LOGIN: {
                let query;
                if (event.parameters["email"] && event.parameters["password"]) {
                    query = db.selectFrom("users")
                        .selectAll()
                        .where("users.email", '=', event.parameters["email"]);
                } else if (event.parameters["token"]) {
                    query = db.selectFrom("users")
                        .selectAll()
                        .where("users.token", '=', event.parameters["token"]);
                } else {
                    return badRequest("Uncaught error");
                };
                const user = await query.executeTakeFirst();
                if (!user) {
                    return new ManagerEvent(ManagerEventType.OPERATION_FAILURE, {
                        "status": 401,
                        "description": "auth.invalid_credentials"
                    });
                };
                const isPasswordCorrect = bcrypt.compareSync(event.parameters["password"], user.password);
                if (!isPasswordCorrect) {
                    return new ManagerEvent(ManagerEventType.OPERATION_FAILURE, {
                        "status": 401,
                        "description": "auth.invalid_credentials"
                    });
                };
                return new ManagerEvent(ManagerEventType.OPERATION_SUCCESS, {
                    "status": 200,
                    "token": user.token,
                    "id": user.id,
                    "created_at": user.created_at
                })
            };
            case ManagerEventType.ACCOUNT_CREATE: {
                const { username, email, password, validator } = event.parameters;

                const validCaptchaValidator = validateCaptchaValidator(validator["data"], validator["iv"]);
                if (validCaptchaValidator) {
                    return validCaptchaValidator;
                };

                const existingUser = await db.selectFrom("users")
                    .where((eb) => eb.or([
                        eb("users.email", "=", email),
                        eb("users.name", "=", username)
                    ]))
                    .executeTakeFirst();
                if (existingUser) {
                    return new ManagerEvent(ManagerEventType.OPERATION_FAILURE, {
                        "status": 409,
                        "description": "auth.user_already_exists"
                    });
                };
                const id = (await db.selectFrom("users")
                    .selectAll()
                    .execute()).length + 1;

                const hashedPassword = bcrypt.hashSync(password, salt);

                const token = randomBytes(16).toString("hex");

                await db.insertInto("users")
                    .values({
                        id: id,
                        name: username,
                        password: hashedPassword,
                        token: token,
                        email: email,
                        created_at: new Date()
                    })
                    .execute();

                // Return success
                return new ManagerEvent(ManagerEventType.OPERATION_SUCCESS, {
                    "status": 201,
                    "description": "auth.account_created",
                    "token": token
                });
            };
            case ManagerEventType.GENERATE_CAPTCHA: {
                const captcha = svgCaptcha.create({ size: 8 });
                const expireTime = (new Date());
                const id = Math.round(Math.random() * 1000000);
                expireTime.setMinutes(expireTime.getMinutes() + 5);
                await db.insertInto("captchas")
                    .values({
                        "id": id,
                        "svg": captcha.data,
                        "key": btoa(captcha.text),
                        "expires_at": expireTime
                    })
                    .execute();
                return new ManagerEvent(ManagerEventType.OPERATION_SUCCESS, {
                    "svg": captcha.data,
                    "id": id
                });
            };
            case ManagerEventType.VALIDATE_CAPTCHA: {
                const { id, key } = event.parameters;

                const captcha = await db.selectFrom("captchas")
                    .selectAll()
                    .where("id", "=", id)
                    .executeTakeFirst();
                if (!captcha) {
                    return new ManagerEvent(ManagerEventType.OPERATION_FAILURE, {
                        "status": 404,
                        "description": "auth.captcha.not_found"
                    });
                };

                if (captcha["expires_at"] < new Date()) {
                    return new ManagerEvent(ManagerEventType.OPERATION_FAILURE, {
                        "status": 410,
                        "description": "auth.captcha.time_expired"
                    });
                };

                if (captcha["key"] != key) {
                    return new ManagerEvent(ManagerEventType.OPERATION_FAILURE, {
                        "status": 403,
                        "description": "auth.captcha.invalid_key"
                    });
                };

                const capchaValidator = encrypt(captcha["expires_at"].toString());

                return new ManagerEvent(ManagerEventType.OPERATION_SUCCESS, {
                    "captcha": capchaValidator
                });
            };
            default: {
                return new ManagerEvent(ManagerEventType.OPERATION_FAILURE, {
                    "status": 404,
                    "description": "command_not_found"
                });
            };
        };
    } catch (error) {
        console.error(error);
        return serverError;
    };
};