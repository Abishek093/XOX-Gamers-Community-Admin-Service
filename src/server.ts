import dotenv from 'dotenv'
dotenv.config()
import express, { NextFunction, Request, Response } from 'express'
import { createServer } from 'http'
import connectDB from './frameworks-and-drivers/database/db'
import CustomError from './utils/CustomError' 
import { handleResponse } from './utils/ResponseHandler' 
import { ErrorRequestHandler } from 'express';
import fs from 'fs';
import adminRouter from './routes/AdminRoutes'
import { startQueueConsumer } from './services/queueService' 


const app = express()
const server = createServer(app)
const PORT = process.env.PORT || 304
app.use(express.json());
app.use('/api/admin', adminRouter)


function logErrorToFile(err: CustomError) {
    const log = `
    ===============================
    Date: ${new Date().toISOString()}
    Status Code: ${err.statusCode}
    Error Message: ${err.message}
    Stack Trace: ${err.stack}  // This includes file and line numbers
    ===============================\n\n`;

    fs.appendFile('server-errors.log', log, (error) => {
        if (error) console.error('Failed to write error log', error);
    });

    console.error(log);
}

app.use(((err: CustomError, req, res, next) => {
    const statusCode = err.statusCode || 500;

    if (statusCode >= 400 && statusCode < 500) {
        console.log("if condition in server", err.message)
        handleResponse(res, statusCode, err.message); 
    } else if (statusCode >= 500) {
        logErrorToFile(err);  
        handleResponse(res, statusCode, 'Something went wrong, please try again later.');
    }
}) as ErrorRequestHandler);


connectDB().then(() => {
    startQueueConsumer();
    server.listen(PORT, () => {
        console.log(`Admin service server running on http://localhost:${PORT}`);
    });
});