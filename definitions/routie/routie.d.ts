interface Route {
    constructor(path: string, name: string): Route;
    addHandler(fn: Function): void;
    removeHandler(fn: Function): void;
    run(params: any): void;
    match(path: string, params: any): boolean;
    toURL(params: any): string;
}

declare function routie(path: string): void;
declare function routie(path: string, fn: Function): void;
declare function routie(routes: { [key: string]: Function }): void;
