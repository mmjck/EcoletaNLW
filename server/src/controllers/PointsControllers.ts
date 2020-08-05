import knex from '../database/connection'
import { Request, Response } from 'express'
class PointsControllers {
    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()))




        try {

            const points = await knex('points')
                .join('point_items', 'items.id', '=', 'point_items.item_id')
                .where('point_items.item_id', parsedItems)
                .where('city', String(city))
                .where('uf', String(uf))
                .distinct()
                .select('points.*')

            return response.json(points)

        } catch (error) {
            return response.status(400).json({ message: 'error' })
        }
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        try {
            const point = await knex('points').where('id', id).first();
            if (!point) {
                return response.status(400).json({ message: 'point not found' })
            }

            const items = await knex('items')
                .join('point_items', 'items.id', '=', 'point_items.item_id')
                .where('point_items.item_id', id)


            return response.json({ point, items })
        } catch (error) {
            console.log(error)
            return response.status(400).json({ message: 'error' })
        }
    }

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsaap,
            latitude,
            longitude,
            city,
            uf,
            items,
        } = request.body;


        const points = {
            image: 'https://images.unsplash.com/photo-1596463097767-79a39851a776?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=200',
            name,
            email,
            whatsaap,
            latitude,
            longitude,
            city,
            uf,
        }
        const trx = await knex.transaction()


        try {
            const insertedIds = await trx('points').insert(points)

            const point_id = insertedIds[0];
            const pointItems = items.map((item_id: number) => {
                return {
                    item_id,
                    point_id
                }
            })

            await trx('point_items').insert(pointItems)
            await trx.commit()

            return response.json({
                ...points,
                id: point_id
            })
        } catch (error) {
            return response.json({ error })
        }

    }
}


export default PointsControllers;
