var form_login = document.querySelector(".login_Form");
var form_register = document.querySelector(".register_Form");
var container_login_register = document.querySelector(".container-login-register");
var back_box_login = document.querySelector(".back-box-login");
var back_box_register = document.querySelector(".back-box-register");
window.addEventListener("resize", anchoPage);

function anchoPage(){

    if (window.innerWidth > 850){
        form_login.style.display = "block";
        container_login_register.style.left = "10px";
        form_register.style.display = "none";
        back_box_register.style.opacity = "1";
        back_box_login.style.opacity = "0";
    }else{
        form_login.style.display = "block";
        container_login_register.style.left = "0px";
        form_register.style.display = "none";
        back_box_register.style.display = "block";
        back_box_login.style.display = "none";
    }
}

anchoPage();

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  const response = await fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  if (response.status === 200) {
    window.location = "/profile";
  }
});

async function restorePassword() {
  Swal.fire({
    text: "Ingresa tu email para restablecer tu contraseña",
    input: "text",
    inputValidator: (value) => {
      if (!value) {
        return "Necesitas escribir tu email para restablecer tu contraseña";
      }
    },
  }).then(async (result) => {
    try {
      if (result.value) {
        const email = result.value;
        const response = await fetch("/api/sessions/passwordRestoreRequest", {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        Swal.fire({
          icon: "success",
          text: "Si el email existe en nuestra base de datos, se enviará un email para restablecer tu contraseña",
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
}






