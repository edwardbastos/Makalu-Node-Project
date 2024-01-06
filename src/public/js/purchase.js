const ticket = document.getElementById("ticket");
const finish = document.getElementById("finish");

const ticketResponse = async () => {
  const user = await fetch("/api/sessions/current", {
    method: "GET",
  }).then((response) => response.json());
  const idCart = user.payload.cart;
  const response = await fetch(`/api/carts/${idCart}/purchase`, {
    method: "GET",
  }).then((response) => response.json());
  const data = response.payload;

  if (data) {
    ticket.innerHTML = `<h4>Ticket: ${data.code}</h4>
                        <p>Usuario: ${user.payload.name}</p>
                        <p>Email: ${data.purchaser}</p>
                        <p>Fecha: ${data.purchase_datetime}</p>
                        <p>Productos:</p>
                       <table class="table">
                       <thead>
                      <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Precio unitario</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${data.products
                        .map((product) => {
                          return `<tr>
                                    <td>${product.product.title}</td>
                                    <td>$ ${product.product.price}</td>
                                    <td>${product.quantity}</td>
                                    <td>$ ${
                                      product.quantity * product.product.price
                                    }</td>
                                  </tr>`;
                        })
                        .join("")}
                        <tr>
                        <td></td><td></td><td><strong>Total</strong></td><td><strong>$ ${
                          data.amount
                        }</strong></td>
                        </tr>
                        
                    </tbody>
                    </table>
                   `;
  }
  finish.addEventListener("click", async () => {
    Swal.fire({
      icon: "success",
      title: "Gracias por tu compra!",
      text: "Se envió un correo con los detalles de su compra.",
      confirmButtonText: "Ok",
    }).then(async () => {
      const deleteCart = await fetch(`/api/carts/${idCart}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      ticket.innerHTML = "";
      window.location.href = "/products";
    });
  });
};

ticketResponse();
