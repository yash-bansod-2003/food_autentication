import { z } from "zod";
import { userValidationSchema } from "@/validators/users.validators.js";
import { restaurantValidationSchema } from "@/validators/restaurants.validator.js";

export type User = z.infer<typeof userValidationSchema>;
export type Restaurant = z.infer<typeof restaurantValidationSchema>;
