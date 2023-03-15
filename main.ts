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
  const config = dotenv.config({ path: './scripts/sendPubSubMessage/.env' });
  if (config.error) {
    throw config.error;
  }

  const pubsubClient = new PubSub({ projectId: process.env.PUBSUB_PROJECT_ID });

  const program = new Command();
  program
    .argument('<topicName>', 'The name of the topic')
    .argument('<messagesPath>', 'The message to send')
    .parse();
  const topicName = program.args[0];
  const messagesPath = program.args[1];

  const messages = JSON.parse(fs.readFileSync(messagesPath).toString());
  await Promise.all(
    messages.map(async (message: any) => await publishMessage(pubsubClient, topicName, message))
  );
}

main().catch(({ message }) => {
  console.error(message);
  process.exitCode = 1;
});
