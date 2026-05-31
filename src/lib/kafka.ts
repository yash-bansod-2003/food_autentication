import { MessageBroker } from "@/types/index.js";
import { Kafka, Producer, Partitioners, KafkaConfig } from "kafkajs";

interface KafkaBrokerConfig {
  clientId: string;
  brokers: string[];
  ssl?: {
    ca?: string;
    cert?: string;
    key?: string;
  };
}

export class KafkaBroker implements MessageBroker {
  private readonly producer: Producer;

  constructor({ clientId, brokers, ssl }: KafkaBrokerConfig) {
    const kafkaConfig: KafkaConfig = {
      clientId,
      brokers,
    };

    if (ssl) {
      kafkaConfig.ssl = {
        rejectUnauthorized: false,
        ca: ssl.ca,
        cert: ssl.cert,
        key: ssl.key,
      };
    }

    const kafka = new Kafka(kafkaConfig);
    this.producer = kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });
  }

  async connect(): Promise<void> {
    await this.producer.connect();
  }

  async disconnect(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect();
    }
  }

  async sendMessage(topic: string, message: string): Promise<void> {
    if (!this.producer) {
      throw new Error("Producer is not initialized");
    }
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });
  }
}
