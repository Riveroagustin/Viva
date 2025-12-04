let arrUsuarios = [
  {
    id: 1,
    email: "admin@admin.com",
    user: "Admin",
    pass: "123",
    habilitado: true,
  },
  {
    id: 2,
    email: "rivero@rivero.com",
    user: "rivero",
    pass: "123",
    habilitado: false,
  },
  {
    id: 3,
    email: "1",
    user: "rivero",
    pass: "1",
    habilitado: true,
  },
];

/**Me traigo todos los usuarios que esten registrados en el localStorage  pero al guardarlo como un array debo recorrerlo*/
usuariosRegistrados().forEach((usuario) => {
  arrUsuarios.push(usuario);
});

console.log(arrUsuarios);

function validarCampos() {
  const email = document.getElementById("id_mail").value;
  const pass = document.getElementById("id_pass").value;
  const campoUsuario = document.getElementById("id_usuario");
  if (email.length < 1) {
    mostrarError("El campo de email no puede estar vacio.");
    return false;
  }
  /**Pregunto si el campo de usuario existe, en el caso que exista verifico que no este vacio */
  if (campoUsuario && campoUsuario.value.length < 1) {
    mostrarError("El campo de usuario no puede estar vacio.");
    return false;
  }

  if (pass.length < 1) {
    mostrarError("El campo de contraseña no puede estar vacio.");
    return false;
  }
  if (login) {
    return validarUsuario({ email, pass });
  } else {
    registrarUsuario(email, campoUsuario.value, pass);
  }
}

function validarUsuario({ email, pass }) {
  const usuario = buscaUsuario(email);

  if (!usuario) {
    mostrarError("El usuario no existe.");
    return false;
  }

  if (pass != usuario.pass) {
    mostrarError("Revise la contraseña.");
    return false;
  }

  if (!usuario.habilitado) {
    mostrarError("El usuario no esta habilitado.");
    return false;
  }
  ocultarError();

  return true;
}

function buscaUsuario(email) {
  return arrUsuarios.find((x) => x.email === email);
}

function mostrarError(err) {
  const errElement = document.getElementById("id_err");
  errElement.textContent = err;
  console.log(errElement);
  errElement.style.display = "block";
  /**Agregue un temporizador para ocultar el error */
  setTimeout(() => {
    ocultarError();
  }, 2000);
}

function ocultarError() {
  const errElement = document.getElementById("id_err");
  errElement.style.display = "none";
}

const btnLogin = document.getElementById("btn_login");

btnLogin.addEventListener("click", () => {
  if (validarCampos()) {
    window.location.href = "pages/bienvenida.html";
  }
});

let login = true;

const btnRegistrar = document.getElementById("id_registrar");

btnRegistrar.addEventListener("click", () => {
  login = !login;
  /**Me traigo el formulario para poder resetearlo y ademas oculto el error si llega haber */
  ocultarError();
  const formulario = document.getElementById("form_login");
  formulario.reset();

  const sub = document.getElementById("id_subtitulo");
  const cont = document.getElementById("id_contenido");
  const usuarioDiv = document.getElementById("id_userDiv");
  if (!login) {
    sub.textContent = "Registrarse";
    btnLogin.textContent = "Registrar";
    cont.textContent = "¿Ya tienes cuenta?";
    btnRegistrar.textContent = "Ingresar";
    usuarioDiv.innerHTML = `<input type="text" id="id_usuario" placeholder="Usuario"> <br>`;
  } else {
    sub.textContent = "Iniciar Sesión";
    btnLogin.textContent = "Ingresar";
    cont.textContent = "¿No tienes cuenta?";
    btnRegistrar.textContent = "Ingresar";
    /*Utilizo el while para recorrer el div padre y eliminar el imput y el br que agregue*/
    while (usuarioDiv.firstChild) {
      usuarioDiv.removeChild(usuarioDiv.firstChild);
    }
  }
});

function registrarUsuario(email, user, pass) {
  console.log(user);
  const usuario = buscaUsuario(email);
  if (usuario) {
    mostrarError("El email ya se encuentra registrado");
  }

  const nuevoID = arrUsuarios.reduce((prev, cur) =>
    cur.id > prev.id ? cur : prev
  );
  console.log(nuevoID.id);
  const userInput = {
    id: nuevoID.id + 1,
    email: email,
    user: user,
    pass: pass,
    habilitado: true,
  };
  /**Al guardar los usuarios con una unica clave (usuarios)
   * me traigo el arr que tenia guardado para agregar el nuevo registro
   * Entonces al momento de guardar se guarda el nuevo arr y NO se sobrescribe
   */
  let nuevoArrUser = [];
  usuariosRegistrados().forEach((usuario) => {
    nuevoArrUser.push(usuario);
  });

  nuevoArrUser.push(userInput);

  let cadena = JSON.stringify(nuevoArrUser);

  //guardarlo con LocalStorage
  if (typeof Storage !== "undefined") {
    localStorage.setItem("usuarios", cadena);
    location.reload();
  }
  alert("Registro exitoso!");
}

function usuariosRegistrados() {
  try {
    {
      let nuevosUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      return nuevosUsuarios;
    }
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
}
