/**
 * Created by Greg on 2/5/2017.
 */
import * as fs from 'fs';
import * as Http from 'http';

export class HtmlHandler {
    private index: Buffer;
    
    constructor() {
        this.index = fs.readFileSync(`${__dirname}/../client/client.html`);
    }

    public getIndex(request: Http.IncomingMessage, response: Http.ServerResponse) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(this.index);
        response.end();
    }
}
