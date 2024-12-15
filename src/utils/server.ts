import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import { queryParser } from "express-query-parser";

import userRoutes from "../routes/userRoutes";
import trackRoutes from "../routes/trackRoutes";
import artistRoutes from "../routes/artistRoutes";
import albumRoutes from "../routes/albumRoutes";
import favoriteRoutes from "../routes/favoriteRoutes";

function createServer(): Express {
    const app = express();

    // Middleware
    app.use(morgan('dev'));
    app.use(cors());
    
    // Parsing middleware
    app.use(express.json({ limit: "1000mb" }));
    app.use(express.urlencoded({ extended: true })); 
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(
        queryParser({
            parseNull: true,
            parseBoolean: true,
            parseNumber: true,
            parseUndefined: true,
        })
    );

    // Routes
    app.use('/api/v1', userRoutes);
    app.use('/api/v1', trackRoutes);
    app.use('/api/v1', artistRoutes);
    app.use('/api/v1', albumRoutes);
    app.use('/api/v1', favoriteRoutes);
    
    // Health check route
    app.get('/ping', (_req: Request, res: Response) => {
        res.status(200).send('Up');
    });

    return app;
}

export default createServer;