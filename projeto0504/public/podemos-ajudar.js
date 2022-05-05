import {
  onAuthStateChanged,
  getAuth
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js'

const auth = getAuth()
document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, user => {
    document.getElementById('enviar').addEventListener('click', evt => {
      evt.preventDefault()
      cadastrarPedido()
    })
  })
})

function cadastrarPedido() {
  const nomeAjuda = document.getElementById('nomeAjuda').value
  const numeroAjuda = document.getElementById('numeroAjuda').value
  const descricaoAjuda = document.getElementById('descricaoAjuda').value
  const registroAjuda = {
    nome: nomeAjuda,
    numero: numeroAjuda,
    descricao: descricaoAjuda,
    data: firebase.firestore.FieldValue.serverTimestamp(),
    id: firebase.auth().currentUser.uid
  }

  firebase
    .firestore()
    .collection('pedidosDeAjuda')
    .doc(firebase.auth().currentUser.uid)
    .set(registroAjuda)
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
