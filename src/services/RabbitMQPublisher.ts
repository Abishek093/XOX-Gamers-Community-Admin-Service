  // import amqp from 'amqplib/callback_api';

  // export const publishToQueue = (queueName: string, message: any): Promise<void> => {
  //   return new Promise((resolve, reject) => {
  //     amqp.connect('amqp://localhost', (connectError, connection) => {
  //       if (connectError) {
  //         return reject(connectError)
  //       }
  //       connection.createChannel((channelError, channel)=>{
  //         if(channelError){
  //           return reject(channelError)
  //         }
  //         const messageBuffer = Buffer.from(JSON.stringify(message))
  //         channel.assertQueue(queueName, {durable: true})
  //         channel.sendToQueue(queueName, messageBuffer)
  //         console.log(`Message send to queue ${queueName}: `, message)
  //         resolve()
  //       })
  //     })
  //   })
  // }


  

//Af making the rabbitMQ URL to .env
  import amqp from 'amqplib/callback_api';

  const rabbitmqUrl = `amqp://${process.env.RABBITMQ_HOST || 'localhost'}`;
  
  export const publishToQueue = (queueName: string, message: any): Promise<void> => {
      return new Promise((resolve, reject) => {
          amqp.connect(rabbitmqUrl, (connectError, connection) => {
              if (connectError) {
                  return reject(connectError);
              }
              connection.createChannel((channelError, channel) => {
                  if (channelError) {
                      return reject(channelError);
                  }
                  const messageBuffer = Buffer.from(JSON.stringify(message));
                  channel.assertQueue(queueName, { durable: true });
                  channel.sendToQueue(queueName, messageBuffer);
                  console.log(`Message sent to queue ${queueName}: `, message);
                  resolve();
              });
          });
      });
  };
  

