import {ApiAiClient} from "api-ai-javascript";
import {Actor} from "./Actor";
import {Teller} from "./Teller";

export class AI {
    public client: ApiAiClient;

    constructor() {
        this.client = new ApiAiClient({accessToken: 'e4c4b1b341564d989a4ef6ccc236a579\n'});

    }

    findIntend(input: string, resultFunc: (result: string) => void) {
        this.client.textRequest(input)
            .then((response) => {
                console.log(response);
                resultFunc(response.result.action);
            })
            .catch((error) => {
                console.log(error);
            });
    }
}