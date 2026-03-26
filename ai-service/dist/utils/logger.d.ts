export declare class AppLogger {
    private static logger;
    static log(message: string): void;
    static error(message: string, trace?: any): void;
    static warn(message: string): void;
    static debug(message: string): void;
}
