export default class UserDto {
  static getTokenDTOFrom = (user) => {
    const { _id, role, cart, email, firstName, lastName, documents } = user;
    if (user.documents.length >= 5) {
      user.isPremium = true;
    } else {
      user.isPremium = false;
    }
    return {
      name: `${firstName} ${lastName}`,
      id: _id,
      role: user.role,
      cart: user.cart,
      email: user.email,
      isPremium: user.isPremium,
    };
  };
}
