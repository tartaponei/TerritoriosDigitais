import {
  getAuth,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js'

function enviarDados(nomeColecao, nomeDocumento, documento) {
  firebase
    .firestore()
    .collection(nomeColecao)
    .doc(nomeDocumento)
    .set(documento)
    .then(() => {
      console.log('upado com sucesso!')
    })
    .catch(error => {
      console.error('Erro ao escrever o documento: ', error)
    })
}

function pegarDados(nomeColecao, nomeDocumento) {
  firebase
    .firestore()
    .collection(nomeColecao)
    .doc(nomeDocumento)
    .get()
    .then(dado => {
      if (dado.exists) {
        return dado.data()
      } else {
        // doc.data() will be undefined in this case
        console.log('Não encontrei o documento!')
      }
    })
    .catch(error => {
      console.log('Erro ao pegar o documento:', error)
    })
}

function pegarColecao(nomeColecao) {
  firebase
    .firestore()
    .collection(nomeColecao)
    .get()
    .then(listaColecao => {
      if (listaColecao.exists) {
        return listaColecao
      } else {
        // doc.data() will be undefined in this case
        console.log('Não encontrei a coleção!')
      }
    })
    .catch(error => {
      console.log('Erro ao pegar a coleção:', error)
    })
}

function atualizaDados(nomeColecao, nomeDocumento, documento) {
  firebase
    .firestore()
    .collection(nomeColecao)
    .doc(nomeDocumento)
    .update(documento)
    .then(() => {
      console.log('atualizado com sucesso!')
    })
    .catch(error => {
      console.error('Erro ao atualizar o documento: ', error)
    })
}

let problemas

require([
  'esri/config',
  'esri/Map',
  'esri/views/MapView',
  'esri/Graphic',
  'esri/widgets/Search'
], function (esriConfig, Map, MapView, Graphic, Search) {
  esriConfig.apiKey =
    'AAPK56e470581c2641bd8e214bc492af486eKvI9xaPd6JB98_O0b9KAJQ_WNmyNyfcEgw3AigzSMqpfS-AIeDoHvrBw_JRKXUov'
  var area = []

  const map = new Map({
    basemap: 'arcgis-dark-gray' //Basemap layer service
  })

  const view = new MapView({
    container: 'viewDiv',
    map: map,
    center: [-43.55807, -22.71218], //Longitude, latitude
    zoom: 13
  })
  view.popup.collapseEnabled = false
  view.popup.set('dockOptions', {
    breakpoint: false,
    buttonEnabled: false,
    position: 'top-right'
  })

  //recuperar problemas e exibir no mapa

  exibirTudo()

  //contruir a lista de filtros possiveis
  let lista = []

  firebase
    .firestore()
    .collection('bairros')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        lista.push(`${doc.id}`)
      })
      const select = document.createElement('select', '')
      select.setAttribute('class', 'esri-widget esri-select')
      select.setAttribute(
        'style',
        "width: 150px; font-family: 'Avenir Next W00'; font-size: 1em;border-radius: 5px;background-color: #f0f6f0;"
      )

      lista.forEach(function (p) {
        const option = document.createElement('option')
        option.value = p
        option.innerHTML = p
        select.appendChild(option)
      })

      view.ui.add(select, 'top-left')

      select.addEventListener('change', function (event) {
        view.graphics.removeAll()
        exibirSe(event.target.value)
      })
    })

  const search = new Search({
    //Add Search widget
    view: view
  })
  //adiciona a barra de pesquisa no mapa
  view.ui.add(search, 'top-left')

  // Listen for category changes and find places
  //adiciona a função que cria areas baseado nos pontos clicados no mapa

  function exibirSe(condicao) {
    firebase
      .firestore()
      .collection('verificarProblemas')
      .get()
      .then(listaProblemas => {
        problemas = listaProblemas
        problemas.forEach(problema => {
          if (problema.data().bairro == condicao) {
            const point = {
              //Create a point
              type: 'point',
              longitude: problema.data().enderecoMapa[0],
              latitude: problema.data().enderecoMapa[1]
            }
            const simpleMarkerSymbol = {
              type: 'simple-marker',
              color: [226, 119, 40], // Orange
              outline: {
                color: [255, 255, 255], // White
                width: 1
              }
            }
            const popupTemplate = {
              title: '{Name}',
              content: '{Description}'
            }
            const attributes = {
              Name: `${problema.data().titulo}`,
              Description: problema.data().imagens[0]
                ? `<img src="${problema.data().imagens[0]}"><br><a href="${
                    problema.data().imagens[0]
                  }" style="text-decoration:underline; color: #e759ff">ver imagem</a><br><br>${
                    problema.data().descricao
                  }`
                : `${problema.data().descricao}`
            }

            const graficoProblema = new Graphic({
              geometry: point,
              symbol: simpleMarkerSymbol,

              attributes: attributes,
              popupTemplate: popupTemplate
            })
            view.graphics.add(graficoProblema)
          }
        })
      })
  }

  function exibirTudo() {
    firebase
      .firestore()
      .collection('verificarProblemas')
      .get()
      .then(listaProblemas => {
        problemas = listaProblemas
        problemas.forEach(function (problema) {
          if (problema.categoria != 'Enchentes Queimados') {
            const point = {
              //Create a point
              type: 'point',
              longitude: problema.data().enderecoMapa[0],
              latitude: problema.data().enderecoMapa[1]
            }
            const simpleMarkerSymbol = {
              type: 'simple-marker',
              color: [226, 119, 40], // Orange
              outline: {
                color: [255, 255, 255], // White
                width: 1
              }
            }
            const popupTemplate = {
              title: '{Name}',
              content: '{Description}'
            }
            const attributes = {
              Name: `${problema.data().titulo}`,
              Description: problema.data().imagens[0]
                ? `<img src="${problema.data().imagens[0]}"><br><a href="${
                    problema.data().imagens[0]
                  }" style="text-decoration:underline; color: #e759ff">ver imagem</a><br><br>${
                    problema.data().descricao
                  }`
                : `${problema.data().descricao}`
            }
            const graficoProblema = new Graphic({
              geometry: point,
              symbol: simpleMarkerSymbol,

              attributes: attributes,
              popupTemplate: popupTemplate
            })
            view.graphics.add(graficoProblema)
          }
        })
      })
  }
})
