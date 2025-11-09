import fs from 'fs';
import path from 'path';
import { UserDto } from "../types/user.dto";

const DB_FILE = path.join(__dirname, 'users.json');
let index: UserDto[] = [];

export const loadUsers = async (): Promise<void> => {
  try {
    await fs.promises.access(DB_FILE);
    const data = await fs.promises.readFile(DB_FILE, 'utf-8');
    index = JSON.parse(data);
  } catch (error) {
    index = [];
  }
};

export const saveUsers = async (): Promise<void> => {
  try {
    await fs.promises.writeFile(DB_FILE, JSON.stringify(index, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

export const getUsers = async (): Promise<UserDto[]> => {
  await loadUsers();
  return index;
};

export const setUsers = async (newUsers: UserDto[]): Promise<void> => {
  index = newUsers;
  await saveUsers();
};

(async () => {
  await loadUsers();
})();