export type User = {
  id?: string;
  username: string;
  email: string;
  password: string;
  pin?: string;
  isVerified?: boolean;
};
class UserStore {
  async index(): Promise<User[]> {
    return [];
  }
  async create(user: User): Promise<void> {}
  async authenticate(): Promise<User[]> {
    return [];
  }
}
