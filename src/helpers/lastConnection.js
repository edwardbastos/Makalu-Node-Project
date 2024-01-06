import { usersService } from "../services/index.js";

export const updateLastConnection = async (uid) => {
  const user = await usersService.getUserBy({ _id: uid });
  const result = await usersService.updateUser(uid, {
    last_connection: new Date().toISOString(),
  });

  return result;
};
