/*
 * Server side only!
 */
import { ManagerEvent, ManagerEventType } from "~/assets/ts/manager";
import { sql, Kysely, PostgresDialect } from "kysely";
import { db, pool } from "~/assets/ts/db";
import bcrypt from "bcrypt";
import { randomBytes, createCipheriv, createDecipheriv, scryptSync } from 'crypto';
import svgCaptcha from 'svg-captcha';

const encryptionKey = randomBytes(32);
const iv = randomBytes(16);

export function encrypt(data: string) {
    const cipher = createCipheriv('aes-256-cbc', encryptionKey, iv);
    let encrypted = cipher.update(data, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: encrypted, iv: iv.toString('hex') };
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
            "description": "Captcha validator has expired"
        });
    };
    return null;
};

export function validateParameters(type: ManagerEventType, parameters: any) {

};

export async function route(event: ManagerEvent) {
    const badRequest = new ManagerEvent(ManagerEventType.OPERATION_FAILURE, {
        "status": 400,
        "description": "Bad request"
    });
    const serverError = new ManagerEvent(ManagerEventType.OPERATION_FAILURE, {
        "status": 500,
        "description": "Server error"
    });
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    try {
        switch (event.eventType) {
            case ManagerEventType.CLIENT_INIT: {
                return new ManagerEvent(ManagerEventType.OPERATION_SUCCESS, {});
            };
            case ManagerEventType.ACCOUNT_LOGIN: {
                let query;
                if (event.parameters["username"] && event.parameters["password"]) {
                    query = db.selectFrom("users")
                        .where("users.name", '=', event.parameters["username"])
                        .executeTakeFirst;
                } else if (event.parameters["token"]) {
                    query = db.selectFrom("users")
                        .where("users.token", '=', event.parameters["token"])
                        .executeTakeFirst;
                } else {
                    return badRequest;
                };

                const user = await query() as any;
                if (!user) {
                    return new ManagerEvent(ManagerEventType.OPERATION_FAILURE, {
                        "status": 401,
                        "description": "Invalid credentials"
                    });
                };
                const isPasswordCorrect = bcrypt.compareSync(event.parameters["password"], user.password);
                if (!isPasswordCorrect) {
                    return new ManagerEvent(ManagerEventType.OPERATION_FAILURE, {
                        "status": 401,
                        "description": "Invalid credentials"
                    });
                };
            };
            case ManagerEventType.ACCOUNT_CREATE: {
                const { username, email, password, captcha_validator } = event.parameters;

                if (!username || !password || !captcha_validator) {
                    return badRequest;
                };

                const validCaptchaValidator = validateCaptchaValidator(captcha_validator["data"], captcha_validator["captcha_validator.iv"]);
                if (validCaptchaValidator) {
                    return validCaptchaValidator;
                };

                await db.updateTable("stats")
                    .set("stats.user_count", (await sql<number>`user_count + 1`.execute(db)).rows[0])
                    .execute();
                const id = (await sql<number>`user_count`.execute(db)).rows[0];
                const existingUser = await db.selectFrom("users")
                    .where((eb) => eb.or([
                        eb("users.email", "=", email),
                        eb("users.name", "=", username)
                    ]))
                    .executeTakeFirst();
                if (existingUser) {
                    return new ManagerEvent(ManagerEventType.OPERATION_FAILURE, {
                        "status": 409,
                        "description": "User already exists"
                    });
                };

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
                    "description": "Account created successfully",
                    "token": token
                });
            };
            case ManagerEventType.GENERATE_CAPTCHA: {
                const captcha = svgCaptcha.create();
                const expireTime = (new Date());
                const id = Math.round(Math.random() * 1000000);
                expireTime.setMinutes(expireTime.getMinutes() + 5);
                await db.insertInto("capchas")
                    .values({
                        "id": id,
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

                const captcha = await db.selectFrom("capchas")
                    .where("id", "=", id)
                    .executeTakeFirst() as any;
                if (!captcha) {
                    return new ManagerEvent(ManagerEventType.OPERATION_FAILURE, {
                        "status": 404,
                        "description": "Captcha not found"
                    });
                };

                if (new Date(captcha["expires_at"]) < new Date()) {
                    return new ManagerEvent(ManagerEventType.OPERATION_FAILURE, {
                        "status": 410,
                        "description": "Captcha has expired"
                    });
                };

                if (atob(captcha["key"]) !== key) {
                    return new ManagerEvent(ManagerEventType.OPERATION_FAILURE, {
                        "status": 403,
                        "description": "Invalid captcha key"
                    });
                };

                const capchaValidator = encrypt(captcha["expires_at"]);

                return new ManagerEvent(ManagerEventType.OPERATION_SUCCESS, {
                    "captcha": capchaValidator
                });
            };
            default: {
                return new ManagerEvent(ManagerEventType.OPERATION_FAILURE, {
                    "status": 404,
                    "description": "API not found"
                });
            };
        };
    } catch (error) {
        console.error(error);
        return serverError;
    };
};