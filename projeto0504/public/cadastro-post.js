import {
  onAuthStateChanged,
  getAuth
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js'

const auth = getAuth()

onAuthStateChanged(auth, user => {
  console.log(firebase.auth().currentUser.uid)
})

document.getElementById('enviar').addEventListener('click', evt => {
  evt.preventDefault()
  enviarPost()
})

//reconectar()

function enviarPost() {
  const tituloDB = document.getElementById('titulo').value
  const subtituloDB = document.getElementById('subtitulo').value
  const bairroDB = document.getElementById('bairro').value
  const imagemDB = document.getElementById('imagem').value
  const descricaoDB = document.getElementById('descricao').value
  const db = firebase.firestore()

  const post = {
    titulo: tituloDB,
    subtitulo: subtituloDB,
    bairro: bairroDB,
    imagem: imagemDB,
    descricao: descricaoDB,
    data: firebase.firestore.FieldValue.serverTimestamp()
  }

  db.collection('jornal')
    .doc()
    .set(post)
    .then(() => {
      // sucesso ao escrever no banco de dados
      console.log('sucesso ao enviar post!')
      window.location.reload()
    })
    .catch(error => {
      // falha ao escrever
      var errorCode = error.code
      var errorMessage = error.message
      console.log(`ainda não: ${errorCode} -- ${errorMessage}`)
    })
}

function reconectar() {
  let email = localStorage.email
  let senha = localStorage.senha
  firebase
    .auth()
    .signInWithEmailAndPassword(email, senha)
    .then(userCredential => {
      // conectado com sucesso
      const user = userCredential.user
      console.log('conectado com sucesso!')
    })
}
