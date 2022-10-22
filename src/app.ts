import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import AppDataSource from './data-source';
import apiRouter from './routes';
import 'dotenv/config';
import 'reflect-metadata';

AppDataSource.initialize()
.then(() => {
    console.log('데이터베이스 연결 성공');
})
.catch((error) => console.log(error));

const app: Application = express();

app.use(morgan('dev'));

app.use('/api', apiRouter);

app.get('/test', (req: Request, res: Response, next: NextFunction) => {
    res.send('welcome!');
});

app.listen(3000, () => {
    console.log(`
    ############################################
         Server listening on port: 3000
    #############################################
    `);
});