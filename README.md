<h1 align="center">Nodejs Config Rabbitmq</h1>

Nodejs config api is package to make easier configuration nodejs configuration intergration with rabbitmq.

## Getting started

Lets install nodco-rabbitmq with npm

```bash
npm install --save @musasutisna/nodco-rabbitmq
```

## How to initialize

```js
const nodcoRabbitmqConfig = require('@musasutisna/nodco-rabbitmq');

nodcoRabbitmqConfig(
  {
    host, // string, rabbitmq host
    port, // number, rabitmq port
    username, // string, rabbitmq user username
    password, // string, rabbitmq user password
    vhost, // string, rabbitmq virtual host
    queues, // array, list of queue will be declared
      [
        {
          name, // string, name of queue
          options // object, amqplib option for queue
        }
      ]
    exchanges // array, list of exchange list will be declared
      [
        {
          name, // string, name of exchange
          type, // string, typeof exchange
          options // object, amqplib option for exchange
        }
      ]
  }
)
```

| Method | Type | Description |
|:--|:--|:--|
| `client` | object | A list of RabbitMQ clients that are currently connected. |
| `channel`| object | A list of RabbitMQ channels that are currently open. |
| `connect`| async  | Opens a connection to RabbitMQ. |
| `retries`| async  | Limits message retries using DLX (Dead Letter Exchange) properties. |
| `close`  | async  | Closes all connections that have been established. |

# `connect` Function

The connect function is an asynchronous function that establishes a connection to RabbitMQ. It ensures that the application is connected to the RabbitMQ server, allowing for communication and message processing.

## Syntax

```js
connect(key, cb);
```

## Parameters

| Parameter | Type | Default | Description |
|:--|:--|:--|:--|
| `key` | `object` | N/A | The unique key in the configuration used during initialization to identify the connection configuration. |
| `cb` | `object` | N/A | A callback function that is executed once the connection to RabbitMQ is successfully established. It receives the error (if any) and the connection object as parameters. |

## Example

```js
const configKey = 'myRabbitMQConfig';

connect(configKey, () => {
  console.log('Connected successfully.');
  // Further logic after successful connection can be added here.
});
```

## Use Case

Establishing a connection to RabbitMQ: Use this function when you need to open a connection to the RabbitMQ server and perform operations like message publishing, subscribing to queues, or managing exchanges. The function ensures that the connection is properly initialized using the provided configuration.

# `retries` Function

The `retries` function is an asynchronous function designed to handle message retry logic with a specified limit and optional republishing to another exchange if the limit is reached.

## Syntax

```js
retries(channel, msg, limit = 10, republish = null)
```

## Parameters

| Parameter | Type | Default | Description |
|:--|:--|:--|:--|
| `channel` | `object` | N/A | An open RabbitMQ channel instance used to interact with the broker (e.g., for acknowledging or republishing messages). |
| `msg` | `object` | N/A | The message object received from RabbitMQ, containing the message body, headers, and delivery metadata. |
| `limit` | `number` | `10` | The maximum number of retry attempts allowed before acknowledging or republishing the message. |
| `republish` | `object` | `null` | Optional. Specifies the configuration for republishing messages to another exchange. |

### `republish` Object

If provided, the `republish` parameter should be an object with the following properties:

| Property | Type | Description |
|:--|:--|:--|
| `exchange` | `string` | The name of the target exchange to which the message will be republished. |
| `key` | `string` | The routing key used to republish the message to the target exchange. |

## Example

```js
await retries(
  channel, 
  msg, 
  5, 
  { exchange: 'backup-exchange', key: 'retry-key' }
);
```

In this example:

- The message will be retried up to 5 times.
- If the retry limit is reached, the message will be republished to the `backup-exchange` using the routing key `retry-key`.
- If no `limit` is provided, the function will default to 10 retries. If `republish` is not specified, it will default to `null`.

## Use Case

The `retries` function is ideal for scenarios where you need to limit the number of processing attempts for a message and handle messages that cannot be successfully processed by either:

- Acknowledging them after reaching the retry limit.
- Republishing them to a dead-letter exchange or a fallback mechanism for further investigation.
