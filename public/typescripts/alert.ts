export class Alerter {

    constructor(message: string) {
        this.greeting = message;
    }

    greeting: string;
    greet(){
        return "dedede" + this.greeting;
    }
}