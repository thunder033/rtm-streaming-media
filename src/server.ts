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
            return mediaHandler.getParty(req, response);
        case '/bling.mp3':
            return mediaHandler.getBling(req, response);
        case '/bird.mp4':
            return mediaHandler.getBird(req, response);
        case '/client2':
            return htmlHanlder.getClient2(req, response);
        case '/client3':
            return htmlHanlder.getClient3(req, response);
        case '/':
        default:
            return htmlHanlder.getIndex(req, response);
    }
};

Http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1:${port}`);
