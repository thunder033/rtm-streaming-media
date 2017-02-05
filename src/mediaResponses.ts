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
        const filePath: string = path.resolve(__dirname, '../client/party.mp4');

        fs.stat(filePath, (err: ErrnoException, stats: fs.Stats) => {
            // If the media file doesn't exist, throw an error
            if (err) {
                if (err.code === 'ENONET') {
                    response.writeHead(404);
                }
                return response.end(err);
            }

            // Get the range of bytes to return to the stream
            const range: string = request.headers.range;

            if (!range) {
               return response.writeHead(416);
            }

            const positions: string[] = range.replace(/bytes=/, '').split('-');

            let start: number = parseInt(positions[0], 10);

            const total: number = stats.size;
            const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

            if (start > end) {
                start = end - 1;
            }

            const chunkSize: number = (end - start) + 1;

            response.writeHead(206, {
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Range': `bytes ${start}-${end}/${total}`,
                'Content-Type': 'video/mp4',
            });

            const stream: Stream = fs.createReadStream(filePath, {start, end});

            stream.on('open', () => {
                stream.pipe(response);
            });

            stream.on('error', (streamErr) => {
                response.end(streamErr);
            });

            return stream;
        });
    }
}
