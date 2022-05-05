let longLat, uid
let arquivoImagem = [],
  listaUrlImagens = []

require([
  'esri/config',
  'esri/Map',
  'esri/views/MapView',
  'esri/widgets/Search'
], (esriConfig, Map, MapView, Search) => {
  esriConfig.apiKey =
    'AAPK56e470581c2641bd8e214bc492af486eKvI9xaPd6JB98_O0b9KAJQ_WNmyNyfcEgw3AigzSMqpfS-AIeDoHvrBw_JRKXUov'

  const map = new Map({
    basemap: 'arcgis-dark-gray' // Basemap layer service
  })
  const view = new MapView({
    container: 'viewDiv', // Div element
    map: map,
    center: [-43.55794, -22.71301], // Longitude, latitude
    zoom: 14 // Zoom level
  })

  const search = new Search({
    //Add Search widget
    view: view
  })

  view.ui.add(search, 'bottom-right')
  search.watch('results', res => {
    let centro = res[0].results[0].extent.center
    longLat = formatLongLat(centro)
    console.log(longLat)
  })
})

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

document.addEventListener('DOMContentLoaded', () => {
  const auth = getAuth()
  exibirBairros()
  exibirCategorias()
  onAuthStateChanged(auth, user => {
    document.getElementById('imagensProblema').addEventListener('change', e => {
      arquivoImagem = []
      for (let item in e.target.files) {
        !isNaN(parseInt(item))
          ? arquivoImagem.push(capturarArquivo(e, item))
          : ''
      }
    })
    document
      .querySelector('#formularioProblema')
      .addEventListener('submit', event => {
        if (!longLat) {
          event.preventDefault()
          return alert('favor escolher localização')
        }
        event.preventDefault()
        const storage = getStorage()
        arquivoImagem.forEach(imagem => {
          const referenciaBD = ref(
            storage,
            `/imagensProblemas/${
              document.querySelector('#tituloProblema').value
            }/${imagem.nome}`
          )
          uploadBytes(referenciaBD, imagem.arquivo).then(snapshot => {
            getDownloadURL(referenciaBD).then(url => {
              listaUrlImagens.push(url)
              if (arquivoImagem.indexOf(imagem) == arquivoImagem.length - 1) {
                enviarProblema()
              }
            })
          })
        })
      })
  })
})

async function enviarProblema() {
  carregando()
  let problema = {
    titulo: document.querySelector('#tituloProblema').value,
    enderecoMapa: longLat,
    bairro: document.querySelector('#bairroProblema').value,
    categoria: document.querySelector('#categoriaProblema').value,
    descricao: document.querySelector('#descricaoProblema').value,
    imagens: Array.from(listaUrlImagens),
    autor: firebase.auth().currentUser.uid
  }

  firebase
    .firestore()
    .collection('verificarProblemas')
    .doc()
    .set(problema)
    .then(() => {
      window.location.reload()
      document.querySelector('.modal-body').innerHTML =
        '<h1>Enviado com sucesso!</h1>'
      setTimeout(enviado, 3000)
    })
    .catch(error => {
      console.error('Erro ao escrever o documento: ', error)
    })
}

function carregando() {
  const carregando = document.createElement('img')
  carregando.setAttribute('id', 'carregando')
  carregando.setAttribute(
    'style',
    'max-width:100%; width:auto;heigth:auto;position:relative;margin:auto;'
  )
  carregando.setAttribute('src', 'images/loading.gif')
  document.querySelector('.modal-body').innerHTML = ''
  document.querySelector('.modal-body').appendChild(carregando)
  document.querySelector('#dv-modal').style.display = 'Block'
  document.body.style.overflow = 'hidden'
}

function enviado() {
  longLat = []
  listaUrlImagens = []
  document.querySelector('#tituloProblema').value = ''
  document.querySelector('#bairroProblema').value = ''
  document.querySelector('#categoriaProblema').value = ''
  document.querySelector('#descricaoProblema').value = ''
  document.querySelector('#imagensProblema').value = ''

  document.getElementById('dv-modal').style.display = 'none'
  document.body.style.overflow = 'initial'
}

function formatLongLat(obj) {
  let long = Math.round(obj.longitude * 100000) / 100000
  let lat = Math.round(obj.latitude * 100000) / 100000

  return [long, lat]
}

function exibirBairros() {
  const colecao = firebase.firestore().collection('bairros').get()

  const listaBairro = document.querySelector('#bairroProblema')
  let listaComBairros

  colecao.then(listaDeBairros => {
    listaDeBairros.forEach(bairro => {
      listaComBairros += `<option value="${bairro.id}" >${bairro.id}</option>`
    })
    listaBairro.innerHTML = listaComBairros
  })
}

function exibirCategorias() {
  const colecao = firebase.firestore().collection('categoria').get()

  const listaCategoria = document.querySelector('#categoriaProblema')
  let listaComCategoria

  colecao.then(listaDeCategoria => {
    listaDeCategoria.forEach(categoria => {
      listaComCategoria += `<option value="${categoria.id}">${categoria.id}</option>`
    })
    listaCategoria.innerHTML = listaComCategoria
  })
}

function capturarArquivo(evt, pos) {
  let arq = evt.target.files.item(pos)
  let nome = arq.name
  return { nome: nome, arquivo: arq }
}
