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
| client | object | List of rabbitmq client have been connected. |
| channel | object | List of rabbitmq channel have been opened. |
| connect | async | Open connection to rabbitmq. |
| close | async | Close all connection have been made. |

<br/>

```js
connect(
  key, // the unique key in config we have on initialize
  cb // function callback will be call after connected successful
)

close(
  // no arguments
)
```
