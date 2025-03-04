import express, { Router, Request, Response } from "express";
import cookieJwtAuth from "../middleware/cookieJwtAuth";
import { accountLogin, auth, create, count, accountActivate } from "../controllers/account";

const accountRouter: Router = express.Router();

accountRouter.route('/login')
    .get(cookieJwtAuth, auth)
    .post(accountLogin);

// Returns a count of registered accounts
accountRouter.route('/count') 
    .get(count);

accountRouter.route('/create')
    .post(create);

accountRouter.route('/activate/:token')
    .post(accountActivate);

accountRouter.route('/logout')
    .get(cookieJwtAuth, (req: Request, res: Response) =>{
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
        res.send('Logged out successfully');
    });

export default accountRouter;