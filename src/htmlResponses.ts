/**
 * Created by Greg on 2/5/2017.
 */
import * as fs from 'fs';
import * as Http from 'http';

export class HtmlHandler {
    private index: Buffer;
    private client2: Buffer;
    private client3: Buffer;
    
    constructor() {
        this.index = fs.readFileSync(`${__dirname}/../client/client.html`);
        this.client2 = fs.readFileSync(`${__dirname}/../client/client2.html`);
        this.client3 = fs.readFileSync(`${__dirname}/../client/client3.html`);
    }

    public getIndex(request: Http.IncomingMessage, response: Http.ServerResponse) {
        this.getPage(this.index, response);
    }

    public getClient2(request: Http.IncomingMessage, response: Http.ServerResponse) {
        this.getPage(this.client2, response);
    }

    public getClient3(request: Http.IncomingMessage, response: Http.ServerResponse) {
        this.getPage(this.client3, response);
    }

    private getPage(page: Buffer, response: Http.ServerResponse): void {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(page);
        response.end();
    }
}
