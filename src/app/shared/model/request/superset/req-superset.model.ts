export class ReqSuperset {
    password: string;
    provider: string;
    refresh: boolean;
    username: string;

    constructor() {
        this.password = "";
        this.provider = "db";
        this.refresh = true;
        this.username = "";
    }
}