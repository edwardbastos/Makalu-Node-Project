export default class UserDto {
  static getTokenDTOFrom = (user) => {
    const { _id, role, cart, email, firstName, lastName, documents } = user;
    
    // Verifica si documents está definido y tiene una propiedad 'length'
    const isPremium = documents && documents.length >= 5;

    return {
      name: `${firstName} ${lastName}`,
      id: _id,
      role: user.role,
      cart: user.cart,
      email: user.email,
      isPremium: isPremium,
    };
  };
}
