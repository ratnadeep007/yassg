import { Request, Response } from 'express';

export function get(req: Request, res: Response) {
    res.send({'message': 'hello from api'});
}

export function post(req: Request, res: Response) {
    res.send({'message': 'hello'});
}