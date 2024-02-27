export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface DummyUsersResponse {
  limit: number;
  skip: number;
  total: number;
  users: User[];
}
