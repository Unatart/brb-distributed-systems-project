import {ErrorCodes} from "./error_codes";

interface ICounter {
    readonly timeout_ms:number;
    readonly N:number;
    try:number;
}

export class CircuitBreaker {
    constructor(timeout_ms:number, N:number, private name:string) {
        this.service_counter = {
            timeout_ms: timeout_ms,
            N: N,
            try: 0
        };
    }

    public middleware() {
        if (this.isBlocked()) {
            throw Error(ErrorCodes.SERVICE_BLOCKED);
        }
    }

    public upTry() {
        this.service_counter.try = this.service_counter.try + 1;
        if (this.service_counter.N === this.service_counter.try) {
            setTimeout(() => {
                this.service_counter.try = 0;
            }, this.service_counter.timeout_ms);
        }
    }

    private isBlocked() {
        return this.service_counter.N === this.service_counter.try;
    }

    public service_counter:ICounter;
}
