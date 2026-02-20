export interface JwtUser {
  userId: string;
  email: string;
}

export interface JwtRequest {
  user: JwtUser;
}
