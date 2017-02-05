/// <reference path="../node_modules/@types/node/index.d.ts" />
/**
 * Created by gjrwcs on 1/31/2017.
 */
import * as Http from 'http';

import {HtmlHandler} from './htmlResponses';
import {MediaHandler} from './mediaResponses';

const port: number = process.env.PORT || process.env.NODE_PORT || 3000;

const htmlHanlder = new HtmlHandler();
const mediaHandler = new MediaHandler();

const onRequest = (req: Http.IncomingMessage, response: Http.ServerResponse) => {
    console.log(req.url);

    switch (req.url) {
        case '/party.mp4':
            mediaHandler.getParty(req, response);
            break;
        case '/bling.mp3':
            break;
        case '/':
        default:
            return htmlHanlder.getIndex(req, response);
    }
};

Http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1:${port}`);
