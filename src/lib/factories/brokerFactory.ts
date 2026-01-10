import configuration from "@/lib/configuration.js";
import { KafkaBroker } from "@/lib/kafka.js";
import { MessageBroker } from "@/types/index.js";

let messageBroker: MessageBroker | null = null;

export const createMessageBrokerFactory = (): MessageBroker => {
  if (!messageBroker) {
    messageBroker = new KafkaBroker({
      clientId: configuration.kafka.clientId,
      brokers: configuration.kafka.brokers,
    });
  }
  return messageBroker;
};
