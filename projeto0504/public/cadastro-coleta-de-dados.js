import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js'
import {
  onAuthStateChanged,
  getAuth
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js'

const storage = getStorage()
const auth = getAuth()
let imagemPerfil

onAuthStateChanged(auth, user => {
  document.getElementById('imagemPerfil').addEventListener('change', e => {
    imagemPerfil = capturarArquivo(e)
  })
  document.getElementById('formulario').addEventListener('submit', event => {
    event.preventDefault()
    enviarDados()
  })
})

function capturarArquivo(evt) {
  let arq = evt.target.files.item(0)
  console.log(arq)
  let nome = arq.name
  return { nome: nome, arquivo: arq }
}

function enviarDados() {
  const auth = getAuth()
  const user = auth.currentUser
  console.log(`o email conectado é : ${user.email}`)
  onAuthStateChanged(auth, user => {
    if (user) {
      const db = firebase.firestore()
      const uid = user.uid
      const referenciaImagemPerfil = ref(storage, `${uid}/imagemPerfil/${uid}`)

      uploadBytes(referenciaImagemPerfil, imagemPerfil.arquivo).then(
        snapshot => {
          getDownloadURL(referenciaImagemPerfil).then(url => {
            imagemPerfil.link = url

            console.log(imagemPerfil.link)

            const nomeDeUsuario = document.getElementById('nome').value
            const bairro = document.getElementById('bairro').value
            const personalidade = document.getElementById('personalidade').value
            const telefone = document.getElementById('telefone').value
            const objetivo = document.getElementById('objetivo').value

            const usuario = {
              imagemPerfil: imagemPerfil.link,
              nome: nomeDeUsuario,
              bairro: bairro,
              personalidade: personalidade,
              telefone: telefone,
              objetivo: objetivo,
              pontos: 32,
              votosFeitos: {}
            }

            db.collection('usuarios')
              .doc(uid)
              .set(usuario)
              .then(() => {
                // sucesso ao escrever no banco de dados
                console.log('sucesso ao escrever no banco de dados!')
                window.location.href = 'mapa.html'
              })
              .catch(error => {
                // falha ao escrever
                var errorCode = error.code
                var errorMessage = error.message
                console.log(`ainda não: ${errorCode} -- ${errorMessage}`)
              })
          })
        }
      )
    }
  })
}
