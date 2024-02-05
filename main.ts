#! /usr/bin/env node
import fs from 'fs';

import { PubSub } from '@google-cloud/pubsub';
import { Command } from 'commander';
import dotenv from 'dotenv';

async function publishMessage(pubsubClient: PubSub, topicName: string, message: string) {
  const messageId = await pubsubClient
    .topic(`projects/${process.env.PUBSUB_PROJECT_ID}/topics/${topicName}`)
    .publishMessage({ json: message });
  console.log(`Message ${messageId} published`);
}

async function main() {
  const program = new Command();
  program
    .option('--env <path>', 'The path to the .env file')
    .option('-q, --quiet', 'quiet mode')
    .argument('<topicName>', 'The name of the topic')
    .argument('<messagesPath>', 'The message to send')
    .parse();
  const dotenvPath = program.opts().env || './.env';
  const config = dotenv.config({ path: dotenvPath });
  if (config.error) {
    throw config.error;
  }
  const { PUBSUB_PROJECT_ID, PUBSUB_EMULATOR_HOST } = process.env;
  const topicName = program.args[0];
  const messagesPath = program.args[1];
  if (!program.opts().quiet) {
    console.dir({ PUBSUB_PROJECT_ID, PUBSUB_EMULATOR_HOST, topicName });
  }

  const pubsubClient = new PubSub({ projectId: process.env.PUBSUB_PROJECT_ID });

  const messages = JSON.parse(fs.readFileSync(messagesPath).toString());
  await Promise.allSettled(
    messages.map(async (message: any) => await publishMessage(pubsubClient, topicName, message))
  ).then(() => {
    console.log('Messages sent :', messages.length);
  });
}

main().catch(({ message }) => {
  console.error(message);
  process.exitCode = 1;
});
