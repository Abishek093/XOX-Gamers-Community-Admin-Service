"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBroker = void 0;
const opossum_1 = __importDefault(require("opossum"));
const RabbitMQPublisher_1 = require("../services/RabbitMQPublisher");
const CustomError_1 = __importDefault(require("../utils/CustomError"));
// import { PublishProfileImageUpdate, PublishUserData, userMessageToAdminService } from "../entities/Types";
const circuitBreakerOptions = {
    timeout: 5000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000,
};
class MessageBroker {
    constructor() {
        this.circuitBreaker = new opossum_1.default((message, queueName) => __awaiter(this, void 0, void 0, function* () {
            yield (0, RabbitMQPublisher_1.publishToQueue)(queueName, message);
        }), circuitBreakerOptions);
        this.circuitBreaker.fallback((message, queueName) => {
            console.error(`Fallback triggered for queue ${queueName}. Message:`, message);
        });
    }
    publishUserBlockedMessage(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.all([
                    this.circuitBreaker.fire(userData, 'user-service-block-user'),
                    this.circuitBreaker.fire(userData, 'content-service-block-user')
                ]);
            }
            catch (error) {
                throw new CustomError_1.default('Error publishing user blocked message: ' + (error instanceof Error || error instanceof CustomError_1.default ? error.message : "Unknown error"), 500);
            }
        });
    }
}
exports.MessageBroker = MessageBroker;
