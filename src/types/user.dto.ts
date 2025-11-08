export interface UserDto {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export interface CreateUserDto {
  username: string;
  age: number;
  hobbies: string[];
}