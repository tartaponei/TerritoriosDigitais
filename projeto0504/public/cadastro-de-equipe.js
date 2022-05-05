import {
  onAuthStateChanged,
  getAuth
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js'

const auth = getAuth()

document.addEventListener('DOMContentLoaded', () => {
  //reconectar()
  mostrarPossiveisIntegrantes()
  adicionarParticipante.addEventListener('click', evt => {
    evt.preventDefault()
    adicionarIntegrante()
  })
  removerParticipante.addEventListener('click', evt => {
    evt.preventDefault()
    removerIntegrante()
  })
  document
    .getElementById('cadastrarEquipe')
    .addEventListener('submit', cadastrarEquipe)
})

function mostrarPossiveisIntegrantes() {
  const colecao = firebase.firestore().collection('usuarios')

  let select = document.getElementsByTagName('select')
  var listaSelect = Array.prototype.slice.call(select)

  listaSelect.forEach(integrante => {
    var listaSelects

    colecao.get().then(listaIntegrantes => {
      listaIntegrantes.forEach(usuario => {
        if (usuario.id != firebase.auth().currentUser.uid) {
          listaSelects += `<option value="${usuario.id}" id="${
            usuario.id
          }" name="${usuario.data().nome}">
        ${usuario.data().nome}
        </option>`
        }
      })

      integrante.innerHTML = listaSelects
    })
  })
}

function removerIntegrante() {
  let contSelect = document.getElementsByTagName('select').length
  let contLabel = document.getElementsByTagName('label').length
  console.log(`contSelect: ${contSelect}  contLabel: ${contLabel}`)
  if (contSelect > 1) {
    document.getElementsByTagName('select')[contSelect - 1].remove()
  }
  if (contLabel > 3) {
    document.getElementsByTagName('label')[contLabel - 1].remove()
  }
}

function adicionarIntegrante() {
  let cont = document.getElementsByTagName('select').length
  console.log(cont)
  document.getElementById('listaParticipantes').innerHTML += `
<label for="integrante${
    cont + 1
  }" class="etiqueta u-label u-text-font " name="integrante${cont + 1}"
>Integrante ${cont + 1}</label
>
<select
id="integrante${cont + 1}"
name="integrante${cont + 1}"
class="bordas u-border-2 u-border-palette-4-base u-custom-border u-custom-font u-grey-5 u-input u-input-rectangle u-radius-8 u-input-3 integrantes"
>
</select>
`
  mostrarPossiveisIntegrantes()
}

function cadastrarEquipe() {
  const uid = firebase.auth().currentUser.uid
  const convitesDB = firebase.firestore().collection('convites')
  const equipesDB = firebase.firestore().collection('equipes')

  const nomeEquipe = document.getElementById('nomeEquipe').value
  const bioEquipe = document.getElementById('bioEquipe').value

  let select = document.getElementsByTagName('select')
  let listaSelect = Array.prototype.slice.call(select)

  console.log(listaSelect)

  let listaIntegrantes = [uid]

  listaSelect.forEach(integrante => {
    const integranteUid = integrante.value
    if (integranteUid != uid) {
      listaIntegrantes.push(integranteUid)
    }
    const convitesDoIntegrantes = convitesDB.doc(integranteUid)

    convitesDoIntegrantes.get().then(listaConvites => {
      if (listaConvites.exists) {
        if (!listaConvites.data().convites.find(element => element == uid)) {
          let listaAntiga = listaConvites.data().convites
          let listaNova = listaAntiga.push(uid)
          console.log(listaAntiga)
          console.log(listaNova)

          const convitesAtualizados = {
            convites: listaNova
          }

          convitesDoIntegrantes.set(convitesAtualizados)
        }
      } else {
        const primeiroConvite = [uid]
        convitesDB
          .doc(integranteUid)
          .set({
            convites: primeiroConvite
          })
          .then(() => {
            console.log('sucessos ao enviar o primeiro convite membro')
          })
          .catch(error => {
            console.log(`falha ao convidar membro: ${error}`)
          })
      }
    })
  })

  console.log(listaIntegrantes)

  const equipe = {
    nome: nomeEquipe,
    descricao: bioEquipe,
    integrantes: listaIntegrantes
  }

  equipesDB
    .doc(uid)
    .set(equipe)
    .then(() => {
      let equipe = { equipe: `${uid}` }
      console.log('sucessos em inscrever a equipe')
      atualizaDados('usuarios', uid, equipe)
    })
    .catch(error => {
      console.log(`falha a ao inscrever a equipe: ${error}`)
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
      console.log('equpe adiciona ao usuario!')
      window.location.href = 'cadastro-de-projeto.html'
    })
    .catch(error => {
      console.error('Erro ao atualizar o documento: ', error)
    })
}
