export interface DB {
    users: {
        id: number;
        name: string;
        email: string;
        password: string;
        token: string;
        created_at: Date;
    };
    capchas: {
        id: number,
        key: string,
        expires_at: Date
    };
    stats: {
        user_count: number,
        last_updated: Date
    };
};