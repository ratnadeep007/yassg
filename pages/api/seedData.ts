import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function get(req: Request, res: Response) {
    await prisma.pageData.create({
        data: {
            brand: 'SkyLab',
            menus: '[{"name":"Home","link":"/"},{"name":"Contact","link":"/contact"},{"name":"About Us","link":"/about"}]'
        }
    });
    res.send({'message': 'done seeding!'});
}