import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.send('유저 라우터 get /');
});

router.post('/register', async (req: Request, res: Response) => {
    
})

export default router;