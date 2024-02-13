import { Request, Response, NextFunction}from "express";

interface AsyncExpressMiddleware {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}


const errorHandler= (func:AsyncExpressMiddleware) => {
  return (req: Request, res: Response, next: NextFunction) =>{
    func(req, res, next).catch(next)
  }
}

export default  errorHandler;