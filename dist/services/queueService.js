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
Object.defineProperty(exports, "__esModule", { value: true });
exports.startQueueConsumer = void 0;
const RabbitMQConsumer_1 = require("./RabbitMQConsumer");
const UserRepository_1 = require("../repositories/UserRepository");
const UserInteractor_1 = require("../interactors/UserInteractor");
const startQueueConsumer = () => {
    const userRepository = new UserRepository_1.UserRepository();
    const userInteractor = new UserInteractor_1.UserInteractor(userRepository);
    (0, RabbitMQConsumer_1.consumeQueue)('admin-service-create-user', (userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('userData', userData);
            yield userInteractor.createUser(userData);
        }
        catch (error) {
            console.error("Failed to create user:", error);
        }
    }));
    // consumeQueue('content-service-update-user', async (userData) => {
    //   try {
    //     console.log('userData', userData)
    //     await userInteractor.updateUser(userData);
    //   } catch (error) {
    //     console.error("Failed to create user:", error);
    //   }
    // });
    // consumeQueue('content-service-update-profile-image', async (userData) => {
    //   try {
    //     console.log('userData', userData)
    //     await userInteractor.updateProfileImage(userData);
    //   } catch (error) {
    //     console.error("Failed to create user:", error);
    //   }
    // });
};
exports.startQueueConsumer = startQueueConsumer;
