// para RealTimeProducts
//   socket.on("addProduct", async (obj) => {
//     await prodManager.addProduct(obj);
//     const listProducts = await prodManager.getProducts({});
//     socketServer.emit("sendProducts", listProducts);
//   });

//   socket.on("deleteProduct", async (id) => {
//     await prodManager.deleteProduct(id);
//     const listProducts = await prodManager.getProducts({});
//     socketServer.emit("sendProducts", listProducts);
//   });
//   socket.on("disconnect", () => {
//     console.log("Cliente desconectado");
//   });
//   socket.on("newUser", (usuario) => {
//     console.log("usuario", usuario);
//     socket.broadcast.emit("broadcast", usuario);
//   });
//   const listProducts = await prodManager.getProducts();
//   socketServer.emit("sendProducts", listProducts);

//ex chat
//   socket.on("message", async (info) => {
//     // Guardar el mensaje utilizando el MessagesManager
//     console.log(info);
//     await chatManager.createMessage(info);
//     // Emitir el mensaje a todos los clientes conectados
//     socketServer.emit("chat", await chatManager.getMessages());
//   });
