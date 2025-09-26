import { UserRole } from "src/enum/User-Role";

export class CreateUserDto {

    username: string;

    password: string;

    role: UserRole
}
