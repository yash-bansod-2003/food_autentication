export class CreateUserDto {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  restaurantId: number;
}

export class UpdateUserDto {
  firstname: string;
  lastname: string;
  age: number;
  restaurantId: number;
}

export class LoginUserDto {
  email: string;
  password: string;
}
