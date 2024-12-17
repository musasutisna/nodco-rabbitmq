const amqp = require('amqplib');

/**
 * Create a new configuration rabbitmq.
 *
 * @param   object
 * @return  object
 */
module.exports = function nodcoRabbitmqConfig(config) {
  /**
   * RABBITMQ client
   */
  const client = {};

  /**
   * RABBITMQ channel
   */
  const channel = {};

  /**
   * Start database connection.
   *
   * @param   string
   * @param   callback
   * @return  void
   */
  async function connect(key, cb) {
    try {
      const option = config[key];

      const rabbitClient = await amqp.connect(
        `amqp://${option.username}:${option.password}@${option.host}:${option.port}${option.vhost}`
      );

      const rabbitChannel = await rabbitClient.createChannel();

      client[key] = rabbitClient;
      channel[key] = rabbitChannel;

      if (option.queues) {
        for (var queue of option.queues) {
          await rabbitChannel.assertQueue(
            queue.name,
            queue.options
          );

          console.log(`rabbitmq queue "${queue.name}"`);
        }
      }

      if (option.exchanges) {
        for (var exchange of option.exchanges) {
          await rabbitChannel.assertExchange(
            exchange.name,
            exchange.type,
            exchange.options
          );

          console.log(`rabbitmq exchange "${exchange.name}"`);

          if (exchange.routes) {
            for (var route of exchange.routes) {
              await rabbitChannel.bindQueue(
                route.queue,
                exchange.name,
                route.key
              );

              console.log(`rabbitmq bind queue "${exchange.name}:${route.queue}:${route.key}"`);
            }
          }
        }
      }

      console.log(`rabbitmq connected "${key}"`);

      if (cb) cb();
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }

  /**
   * Close all connection.
   *
   * @return  void
   */
  async function close() {
    for (var key in config) {
      await client[key].close();

      console.log(`rabbitmq disconnect "${key}"`);
    }
  }

  return {
    client,
    channel,
    connect,
    close
  };
};
