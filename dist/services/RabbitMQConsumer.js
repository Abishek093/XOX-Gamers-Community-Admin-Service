"use strict";
// import amqp from 'amqplib/callback_api';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeQueue = void 0;
// export const consumeQueue = (queueName: string, callback: (message: any) => void): void => {
//   console.log("queueName",queueName, "message")
//   amqp.connect('amqp://localhost', (connectError, connection) => {
//     if (connectError) {
//       throw connectError;
//     }
//     connection.createChannel((channelError, channel) => {
//       console.log("channel",channel.connection)
//       if (channelError) {
//         throw channelError;
//       }
//       channel.assertQueue(queueName, { durable: true });
//       channel.consume(queueName, (msg) => {
//         if (msg !== null) {
//           const messageContent = JSON.parse(msg.content.toString());
//           console.log("messageContent",messageContent)
//           callback(messageContent);
//           channel.ack(msg);
//         }
//       });
//       connection.on('close', () => {
//         console.log('Connection to RabbitMQ closed');
//       });
//       connection.on('error', (err) => {
//         console.error('RabbitMQ connection error:', err);
//       });
//     });
//   });
// };
const callback_api_1 = __importDefault(require("amqplib/callback_api"));
const consumeQueue = (queueName, callback) => {
    console.log(`Attempting to connect to RabbitMQ and consume from queue: ${queueName}`);
    callback_api_1.default.connect('amqp://localhost', (connectError, connection) => {
        if (connectError) {
            console.error('Failed to connect to RabbitMQ:', connectError);
            return;
        }
        console.log('Successfully connected to RabbitMQ');
        connection.createChannel((channelError, channel) => {
            if (channelError) {
                console.error('Failed to create channel:', channelError);
                return;
            }
            console.log('Successfully created channel');
            channel.assertQueue(queueName, { durable: true }, (assertError, assertOk) => {
                if (assertError) {
                    console.error('Failed to assert queue:', assertError);
                    return;
                }
                console.log(`Queue ${queueName} asserted successfully`);
                channel.consume(queueName, (msg) => {
                    if (msg !== null) {
                        console.log(`Received message from queue ${queueName}`);
                        const messageContent = JSON.parse(msg.content.toString());
                        console.log('Message content:', messageContent);
                        callback(messageContent);
                        channel.ack(msg);
                    }
                }, { noAck: false });
            });
            channel.on('error', (err) => {
                console.error('Channel error:', err);
            });
            channel.on('close', () => {
                console.log('Channel closed');
            });
        });
        connection.on('error', (err) => {
            console.error('RabbitMQ connection error:', err);
        });
        connection.on('close', () => {
            console.log('RabbitMQ connection closed');
        });
    });
};
exports.consumeQueue = consumeQueue;
