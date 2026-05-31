import { z } from "zod";
import { userValidationSchema } from "@/validators/users.validators";
import { restaurantValidationSchema } from "@/validators/restaurants.validator";

export type User = z.infer<typeof userValidationSchema>;
export type Restaurant = z.infer<typeof restaurantValidationSchema>;

export interface ResponseWithMetadata<T> {
  meta?: {
    total: number;
    page: number;
    per_page: number;
  };
  data: T;
  success?: boolean;
}

export interface MessageBroker {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendMessage(topic: string, message: string): Promise<void>;
}

type EVENT_TYPE = "user.created" | "user.updated";

export interface ProducerMeta {
  service: string;
  version: string;
}

export interface MessageBrokerEvent<T = unknown> {
  event_id: string;
  event_type: EVENT_TYPE;
  event_version: string;
  occurred_at: string;
  producer: ProducerMeta;
  partition_key: string;
  data: T;
}
