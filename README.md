# Send pubSub messages

This script used for sending pubSub messages to a pubSub server

## How

### Install

- from sources:

```bash
npm install
npm run build
npm link
```

- from NPM:

```bash
npm install -g @elmy-oss/send-message-cli
```

### Run

```bash
send-message --env=.env.beta <topicName> <path/to/message-list.json>
```

## Config

Copy the `.env.sample` to `.env` and add your pubSub server informations
