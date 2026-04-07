declare const _default: () => {
    env: string;
    port: number;
    allowedOrigins: string[];
    database: {
        url: string | undefined;
    };
    redis: {
        host: string | undefined;
        port: number;
        url: string | undefined;
        disable: boolean;
    };
    jwt: {
        accessSecret: string;
        refreshSecret: string;
    };
    throttler: {
        ttl: number;
        limit: number;
        authLimit: number;
        disable: boolean;
    };
};
export default _default;
