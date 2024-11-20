"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const db_1 = __importDefault(require("./frameworks-and-drivers/database/db"));
const ResponseHandler_1 = require("./utils/ResponseHandler");
const fs_1 = __importDefault(require("fs"));
const AdminRoutes_1 = __importDefault(require("./routes/AdminRoutes"));
const queueService_1 = require("./services/queueService");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const PORT = process.env.PORT || 304;
app.use(express_1.default.json());
app.use('/api/admin', AdminRoutes_1.default);
function logErrorToFile(err) {
    const log = `
    ===============================
    Date: ${new Date().toISOString()}
    Status Code: ${err.statusCode}
    Error Message: ${err.message}
    Stack Trace: ${err.stack}  // This includes file and line numbers
    ===============================\n\n`;
    fs_1.default.appendFile('server-errors.log', log, (error) => {
        if (error)
            console.error('Failed to write error log', error);
    });
    console.error(log);
}
app.use(((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    if (statusCode >= 400 && statusCode < 500) {
        console.log("if condition in server", err.message);
        (0, ResponseHandler_1.handleResponse)(res, statusCode, err.message);
    }
    else if (statusCode >= 500) {
        logErrorToFile(err);
        (0, ResponseHandler_1.handleResponse)(res, statusCode, 'Something went wrong, please try again later.');
    }
}));
(0, db_1.default)().then(() => {
    (0, queueService_1.startQueueConsumer)();
    server.listen(PORT, () => {
        console.log(`Admin service server running on http://localhost:${PORT}`);
    });
});
