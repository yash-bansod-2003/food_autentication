import { MessageBroker } from "@/types/index.js";
import { Kafka, Producer, Partitioners } from "kafkajs";

export class KafkaBroker implements MessageBroker {
  private readonly producer: Producer;

  constructor({ clientId, brokers }: { clientId: string; brokers: string[] }) {
    const kafka = new Kafka({
      clientId,
      brokers,
    });
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
