import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js'
import {
  getAuth,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js'

//quand ocarregar os elementos da pagina
//conectando com o firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCagUfQ8dL6Rz6iWvxX_Oen22IE-9fuuiA',
  authDomain: 'projeto-territorios.firebaseapp.com',
  databaseURL: 'https://projeto-territorios-default-rtdb.firebaseio.com',
  projectId: 'projeto-territorios',
  storageBucket: 'projeto-territorios.appspot.com',
  messagingSenderId: '383151753659',
  appId: '1:383151753659:web:62a7779c499bf789ca9c9e'
}
//iniciando o firebase
let uid
const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth()
document.addEventListener('DOMContentLoaded', function () {
  if (
    window.location.href.split(`/`)[
      window.location.href.split(`/`).length - 1
    ] != 'cadastro.html'
  ) {
    document.body.innerHTML += criarModal()
    document
      .querySelector('#fecharModal')
      .addEventListener('click', fecharModal)
  }
  try {
    let app = firebase.app()
    let features = [
      'auth',
      'database',
      'firestore',
      'functions',
      'messaging',
      'storage',
      'analytics',
      'remoteConfig',
      'performance'
    ].filter(feature => typeof app[feature] === 'function')
    console.log(`Firebase SDK carregado com ${features.join(', ')}`)

    //quando encontrar o usuario

    onAuthStateChanged(auth, user => {
      if (user) {
        //se o ususario já estiver conectado
        uid = user.uid
        if (document.querySelector('#btnLoginPc')) {
          document.querySelector('#btnLoginPc').href = 'perfil.html'
          document.querySelector('#btnLoginPc').innerHTML = 'Meu Perfil' //se estiver no PC
        }

        if (document.querySelector('#btnLoginCell')) {
          //se estiver no celular
          document.querySelector('#btnLoginCell').href = 'perfil.html'
          document.querySelector('#btnLoginCell').innerHTML = 'Meu Perfil'
        }
        if (
          window.location.href
            .split(`/`)
            [window.location.href.split(`/`).length - 1].toUpperCase() ==
          'MAPA.HTML' //se esiver na aba do mapa
        ) {
          document
            .getElementById('botoes')
            .setAttribute('style', 'display:none')

          firebase
            .firestore()
            .collection('usuarios')
            .doc(uid)
            .get()
            .then(user => {
              let projeto = document.querySelector('#projeto').parentElement
              if (user.data().equipe) {
                //se tenho uma equipe
                if (user.data().projeto) {
                  //se eu tenho um projeto
                  document
                    .getElementById('botoes')
                    .setAttribute('style', 'display:grid')
                } else {
                  //se NÃO tenho um projeto
                  document
                    .getElementById('botoes')
                    .setAttribute('style', 'display:grid')
                }
              } else {
                //se NÃO tenho uma equipe
                projeto.href = 'cadastro-de-equipe.html'
                document
                  .getElementById('botoes')
                  .setAttribute('style', 'display:grid')
              }
            })
        }
        //checar a lista de convites que ele possui
      } else {
        //se o ususario não estiver conectado
        if (
          //e se a pagina não for a de cadastro nem a inicial
          window.location.href
            .split(`/`)
            [window.location.href.split(`/`).length - 1].toUpperCase() !=
            'CADASTRO.HTML' &&
          window.location.href
            .split(`/`)
            [window.location.href.split(`/`).length - 1].toUpperCase() !=
            'PAGINA-INICIAL.HTML' &&
          window.location.href.split(`/`)[
            window.location.href.split(`/`).length - 1
          ] != ''
        ) {
          //recomenda a pessoa a se inscrever
          abrirModal()
        }
      }
    })
  } catch (e) {
    console.error(`${e}`)
    console.log('Erro ao carregar o Firebase SDK, confira o console.')
  }
})

//setando persistencia de usuarios (se vai ou não permanecer logado com sua conta)

definirPersistencia()

function definirPersistencia() {
  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      var provider = new firebase.auth.GoogleAuthProvider()
    })
    .catch(error => {
      // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message
    })
}

function criarModal() {
  let elemento = `
  <div id="dv-modal" class="modal">
    <div class="modal-content">
      <div class="modal-body">
        <div class="u-align-left">
            <h2 class="u-text u-text-1" style="margin:0px;font-size: 1.3rem; ">
              Quer</br>
              produzir</br>
              tecnologias</br>
              para o seu bairro?
            </h2>
            <p style="font-size: 1.05rem; font-weight: 600;"> Territórios Digitais é um laboratório para a criação de aplicativos de interesse público! Visando a experimentação de linguagens digitais, com a demonstração de técnicas de programação e de 
              <span style="font-style: italic">design thinking</span>.
            </p>
            <a href="cadastro.html" class="u-border-none u-btn modal-btn modal-btn-1 u-button-style u-hover-palette-2-dark-1 u-palette-2-base">
              <h1>&nbsp;Participe!</h1>
            </a>
            <a id="fecharModal" data-page-id="195114430" class="u-border-none modal-btn modal-btn-2 u-btn u-button-style u-hover-palette-1-dark-1">
              <h1>&nbsp;Agora não :(</h1>
            </a>
        </div>
      </div>
    </div>
  </div>
  `
  return elemento
}

function abrirModal() {
  document.getElementById('dv-modal').style.display = 'Block'
  document.body.style.overflow = 'hidden'
}

function fecharModal() {
  document.getElementById('dv-modal').style.display = 'none'
  document.body.style.overflow = 'initial'
}

function exibeNotificacoes() {
  const footer = document.querySelector('footer')
  const imgFloat = document.createElement('img')
  imgFloat.setAttribute('class', 'notificacoes')
  imgFloat.setAttribute('src', 'images/6.png')
  document.body.insertBefore(imgFloat, footer)
}

function mostrarConvites() {
  let idEquipe
  firebase
    .firestore()
    .collection('convites')
    .doc(uid)
    .get()
    .then(listaConvites => {
      if (listaConvites.exists) {
        console.log(listaConvites)
        console.log(listaConvites.data())

        listaConvites.data().convites.forEach(convite => {
          console.log(convite)
          let idEquipe = convite
          firebase
            .firestore()
            .collection('equipe')
            .doc(idEquipe)
            .get()
            .then(() => {
              //atualizar meu perfil colocando minha equipe
            })
        })
      } else {
        console.log('não achei nenhuma lista de convites!')
      }
    })
    .catch(error => {
      console.log('Erro ao pegar o documento:', error)
    })
}

function atualizaDados(nomeColecao, nomeDocumento, documento) {
  firebase
    .firestore()
    .collection(nomeColecao)
    .doc(nomeDocumento)
    .update(documento)
    .then(doc => {
      console.log(doc.data())
      console.log('projeto adiciona ao usuario!')
      window.location.href = 'projeto.html'
    })
    .catch(error => {
      console.error('Erro ao atualizar o documento: ', error)
    })
}
