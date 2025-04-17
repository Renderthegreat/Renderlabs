export interface DB {
    users: {
        id: number;
        name: string;
        email: string;
        password: string;
        token: string;
        created_at: Date;
    };
    captchas: {
        id: number,
        key: string,
        svg: string,
        expires_at: Date
    };
};