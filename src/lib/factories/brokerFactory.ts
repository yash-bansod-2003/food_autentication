import configuration from "@/lib/configuration";
import { KafkaBroker } from "@/lib/kafka";
import { MessageBroker } from "@/types/index";

let messageBroker: MessageBroker | null = null;

export const createMessageBrokerFactory = (): MessageBroker => {
  if (!messageBroker) {
    messageBroker = new KafkaBroker({
      clientId: configuration.kafka.clientId,
      brokers: configuration.kafka.brokers,
      ssl: configuration.kafka.ssl,
    });
  }
  return messageBroker;
};
