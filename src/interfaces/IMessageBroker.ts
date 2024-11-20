import { isBlockedStatus } from "../entities/Types";

export interface IMessageBroker{
    // publishUserCreationMessage(userData: PublishUserData): Promise<void>
    publishUserBlockedMessage(userData: isBlockedStatus): Promise<void>

}