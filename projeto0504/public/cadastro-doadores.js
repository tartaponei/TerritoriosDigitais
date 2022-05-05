import {
  onAuthStateChanged,
  getAuth
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js'

const auth = getAuth()
document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, user => {
    document.getElementById('enviar').addEventListener('click', evt => {
      evt.preventDefault()
      cadastrarDoador()
    })
  })
})

function cadastrarDoador() {
  const nomeDoador = document.getElementById('nomeDoador').value
  const numeroDoador = document.getElementById('numeroDoador').value
  const descricaoDoador = document.getElementById('descricaoDoador').value
  const db = firebase.firestore()

  const registroDoador = {
    nome: nomeDoador,
    numero: numeroDoador,
    descricao: descricaoDoador,
    data: firebase.firestore.FieldValue.serverTimestamp(),
    id: firebase.auth().currentUser.uid
  }

  firebase
    .firestore()
    .collection('doadores')
    .doc(firebase.auth().currentUser.uid)
    .set(registroDoador)
    .then(() => {
      // sucesso ao escrever no banco de dados
      console.log('sucesso ao cadastrar doador!')
      window.location.reload()
    })
    .catch(error => {
      // falha ao escrever
      var errorCode = error.code
      var errorMessage = error.message
      console.log(`ainda não: ${errorCode} -- ${errorMessage}`)
    })
}
