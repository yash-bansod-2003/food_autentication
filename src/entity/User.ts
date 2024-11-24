import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Restaurant } from "./Restaurant";
import { RefreshToken } from "./RefreshToken";
import { ROLES } from "@/lib/constants";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ enum: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER], default: "user" })
  role: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.users)
  restaurant: Restaurant;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
}
