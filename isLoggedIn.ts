import { Request, Response, NextFunction } from 'express';


interface IIsLoggedIn {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}

const isLoggedIn: IIsLoggedIn = async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(201).json({ redirect:'/' });
  }
};

const isNotLoggedIn: IIsLoggedIn = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('이미 로그인 됨.');
  }
};

export { isLoggedIn, isNotLoggedIn };