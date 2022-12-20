import { Request, Response } from 'express';

export function get(req: Request, res: Response) {
    res.sendStatus(501);
    res.send({'error': 'not implemented'});
}

export function post(req: Request, res: Response) {
    res.sendStatus(501);
    res.send({'error': 'not implemented'});
}

export function patch(req: Request, res: Response) {
    res.sendStatus(501);
    res.send({'error': 'not implemented'});
}

export function del(req: Request, res: Response) {
    res.sendStatus(501);
    res.send({'error': 'not implemented'});
}