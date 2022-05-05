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

const auth = getAuth()
const storage = getStorage()
const db = firebase.firestore()
let design, uid

onAuthStateChanged(auth, user => {
  cadastrarProjeto.addEventListener('submit', () => {
    enviarProjeto()
  })

  //capturando o aquivo der imagens e o nome dele quando a pessoa upar na pagina

  document.getElementById('imagemProjeto').addEventListener('change', e => {
    design = capturarArquivo(e)
  })
  //capturando o aquivo dos codigos e o nome dele quando a pessoa upar na pagina
  uid = user.uid
})

// pasta é o nome da pasta no banco de dados, sempre sera o uid do ususario, nome é como o arquivo sera salvo no banco, semrpe sera o mesmo nome do aqruqivo no computador do ususario, arquivo é o proprio documento que sera upado

function capturarArquivo(evt) {
  let arq = evt.target.files.item(0)
  console.log(arq)
  let nome = arq.name
  return { nome: nome, arquivo: arq }
}

async function salvarArquivosNoBanco(pasta, obj) {
  const storage = getStorage()
  const referenciaBD = ref(storage, `${pasta}/${obj.nome}`)
  uploadBytes(referenciaBD, obj.arquivo).then(snapshot => {
    getDownloadURL(referenciaBD).then(url => {
      obj.link = url
      console.log(obj.link)
      console.log(`sucesso ao enviar ${snapshot.ref.name} para o storage`)
      return url
    })
  })
}

async function enviarProjeto() {
  const footer = document.querySelector('footer')
  const carregando = document.createElement('img')
  carregando.setAttribute('id', 'carregando')
  carregando.setAttribute(
    'style',
    'max-width:100vw; width:auto;heigth:auto;position:relative;margin:auto;'
  )
  carregando.setAttribute('src', 'images/loading.gif')
  document.querySelector('section').style.display = 'none'
  document.body.insertBefore(carregando, footer)

  const nomeProjeto = document.getElementById('nomeProjeto').value
  const descricaoProjeto = document.getElementById('descricaoProjeto').value
  const powerPoint = document.getElementById('codigos').value
  const referenciaImagens = ref(storage, `${uid}/imagens/${design.nome}`)

  uploadBytes(referenciaImagens, design.arquivo).then(snapshot => {
    //upando as imagens do projeto
    getDownloadURL(referenciaImagens).then(url => {
      design.link = url
      console.log(design.link)
      console.log(`sucesso ao enviar ${snapshot.ref.name} para o storage`)

      //--------------------------
      const projeto = {
        nome: nomeProjeto,
        descricao: descricaoProjeto,
        imagem: design.link,
        powerPoint: powerPoint
      }
      db.collection('projetos')
        .doc(uid)
        .set(projeto)
        .then(() => {
          let projeto = { projeto: `${uid}` }
          console.log('sucessos em inscrever a equipe')
          firebase
            .firestore()
            .collection('usuarios')
            .doc(uid)
            .update(projeto)
            .then(() => {
              db.collection('votos')
                .doc(uid)
                .set({ votos: 0 })
                .then(() => {
                  console.log('projeto adiciona ao usuario!')
                  atualizaDados('equipes', uid, projeto)
                })
            })
        })
        .catch(error => {
          // falha ao escrever
          var errorCode = error.code
          var errorMessage = error.message
          console.log(`ainda não: ${errorCode} -- ${errorMessage}`)
        })
    })
  })
}

function atualizaDados(nomeColecao, nomeDocumento, documento) {
  firebase
    .firestore()
    .collection(nomeColecao)
    .doc(nomeDocumento)
    .update(documento)
    .then(() => {
      console.log(documento)
      console.log('projeto adiciona ao usuario!')
      window.location.href = 'projeto.html'
    })
    .catch(error => {
      console.error('Erro ao atualizar o documento: ', error)
    })
}
