import { IMessageBroker } from "../interfaces/IMessageBroker"; 
import CircuitBreaker from "opossum";
import { publishToQueue } from "../services/RabbitMQPublisher";
import { isBlockedStatus } from "../entities/Types";
import CustomError from "../utils/CustomError";
// import { PublishProfileImageUpdate, PublishUserData, userMessageToAdminService } from "../entities/Types";

const circuitBreakerOptions = {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
};

export class MessageBroker implements IMessageBroker {
  private circuitBreaker;

  constructor() {
    this.circuitBreaker = new CircuitBreaker(async (message: any, queueName: string) => {
      await publishToQueue(queueName, message);
    }, circuitBreakerOptions);

    this.circuitBreaker.fallback((message: any, queueName: string) => {
      console.error(`Fallback triggered for queue ${queueName}. Message:`, message);
    });
  }

  async publishUserBlockedMessage(userData: isBlockedStatus): Promise<void> {
    try {
        await Promise.all([
            this.circuitBreaker.fire(userData, 'user-service-block-user'),
            this.circuitBreaker.fire(userData, 'content-service-block-user')
        ]);
    } catch (error) {
        throw new CustomError('Error publishing user blocked message: ' + (error instanceof Error || error instanceof CustomError ? error.message : "Unknown error"), 500);
    }
}

}
