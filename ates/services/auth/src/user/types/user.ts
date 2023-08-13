export interface NewUserData {
  login: string;
  password: string;
  name: string;
  email: string;
  role: string;
}

export interface User {
  id: string;
  login: string;
  password: string;
  name: string;
  email: string;
  role: string;
}
