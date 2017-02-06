/**
 * Created by Greg on 2/5/2017.
 */
import * as fs from 'fs';
import * as Http from 'http';
import * as path from 'path';
import ErrnoException = NodeJS.ErrnoException;
import {Stream} from "stream";

export class MediaHandler {

    public getParty(request: Http.IncomingMessage, response: Http.ServerResponse): void {
        this.getStream('party.mp4', request, response);
    }

    public getBird(request: Http.IncomingMessage, response: Http.ServerResponse): void {
        this.getStream('bird.mp4', request, response);
    }

    public getBling(request: Http.IncomingMessage, response: Http.ServerResponse): void {
        this.getStream('bling.mp3', request, response);
    }

    /**
     * Get byte range
     * @param filePath: the location of the file
     * @param rangeIn: a range header
     * @returns {Promise<[number]>} [start, end, total]
     */
    private getByteRange(filePath: string, rangeIn: string): Promise<number[]> {
        return new Promise((resolve, reject) => {
            fs.stat(filePath, (err: ErrnoException, stats: fs.Stats) => {
                // If the media file doesn't exist, throw an error
                if (err) {
                    reject(err);
                }

                const positions: string[] = rangeIn.replace(/bytes=/, '').split('-');

                let start: number = parseInt(positions[0], 10);

                const total: number = stats.size;
                const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

                if (start > end) {
                    start = end - 1;
                }

                resolve([start, end, total]);
            });
        });
    }

    /**
     * Get the MIME type for a given file
     * @param {string} fileName
     * @returns {string}
     */
    private getContentType(fileName: string): string {
        const CONTENT_TYPES = {
            mp3: 'audio/mpeg',
            mp4: 'video/mp4',
        };

        const extension: string = fileName.split('.').pop();

        return CONTENT_TYPES[extension];
    }

    /**
     * Respond with the stream at the file path
     * @param {string} fileName
     * @param {Http.IncomingMessage} request
     * @param {Http.ServerResponse} response
     */
    private getStream(fileName: string, request: Http.IncomingMessage, response: Http.ServerResponse): void {
        const filePath: string = path.resolve(__dirname, `../client/${fileName}`);

        if (!request.headers.range) {
            response.writeHead(416);
            return response.end('Invalid Range');
        }

        this.getByteRange(filePath, request.headers.range).then((range) => {
            const [start, end, total] = range;

            const chunkSize: number = (end - start) + 1;

            response.writeHead(206, {
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Range': `bytes ${start}-${end}/${total}`,
                'Content-Type': this.getContentType(filePath),
            });

            const stream: Stream = fs.createReadStream(filePath, {start, end});

            stream.on('open', () => {
                stream.pipe(response);
            });

            stream.on('error', (streamErr) => {
                response.end(streamErr);
            });

            return stream;
        }, (err) => {
            if (err.code === 'ENONET') {
                response.writeHead(404);
            }
            return response.end(err);
        });
    }
}
