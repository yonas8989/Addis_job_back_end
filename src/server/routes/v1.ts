import { Application, Request, Response } from "express";


/**
 * Route based on the version of the API
 * @param {Application} app
 * @returns {}
 */
export default (app: Application) => {
    // Test route
    app.get('/api/v1/test', (req: Request, res: Response) => {
        res.status(200).json({
            status: 'success',
            message: 'API v1 is working'
        });
    });
};