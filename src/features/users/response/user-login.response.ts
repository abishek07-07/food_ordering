export class UserLoginResponse {
  users: Users;
  accessToken: string;
}

export class Users {
  firstName: string;
  lastName: string;
  email: string;
  middleName: string;
  slug: string;
}
