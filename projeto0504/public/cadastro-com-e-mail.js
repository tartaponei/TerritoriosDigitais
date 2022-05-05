import {
  onAuthStateChanged,
  getAuth
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js'

//cadastra email e senha do usario
const auth = getAuth()
/*document.addEventListener('DOMContentLoaded', () => {
  localStorage.removeItem('email')
  localStorage.removeItem('senha')
})*/
onAuthStateChanged(auth, user => {
  document
    .getElementById('cadastrar')
    .addEventListener('click', cadastrarUsuario)

  function cadastrarUsuario() {
    const senha1 = document.getElementById('senha').value
    const senha2 = document.getElementById('confirmarSenha').value

    if (senha1 == senha2) {
      const email = document.getElementById('email').value
      const senha = document.getElementById('senha').value

      //localStorage.setItem('email', email)
      //localStorage.setItem('senha', senha)

      firebase
        .auth()
        .createUserWithEmailAndPassword(email, senha)
        .then(userCredential => {
          // criado com sucesso
          const user = userCredential.user
          console.log(user)
          console.log('criado com sucesso!')
          firebase
            .auth()
            .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
              return firebase
                .auth()
                .signInWithEmailAndPassword(email, senha)
                .then(userCredential => {
                  // conectado com sucesso
                  console.log('conectado com sucesso!')

                  onAuthStateChanged(auth, user => {
                    window.location.href = 'cadastro-coleta-de-dados.html'
                  })
                })
                .catch(error => {
                  // falha ao conectar
                  const errorCode = error.code
                  const errorMessage = error.message
                  console.log(`ainda não: ${errorCode} -- ${errorMessage}`)
                })
            })
            .catch(error => {
              // Handle Errors here.
              var errorCode = error.code
              var errorMessage = error.message
              console.log(`ainda não: ${errorCode} -- ${errorMessage}`)
            })
        })
        .catch(
          // falha ao criar
          error => {
            const errorCode = error.code
            const errorMessage = error.message
            const msgErro = document.getElementById('erro')
            console.log(`ainda não: ${errorCode} -- ${errorMessage}`)
          }
        )
    } else {
      const error = document.getElementById('erro')
      error.innerHTML = `Senhas diferentes, favor corrija!`
    }
  }
})
