require([
  'esri/config',
  'esri/Map',
  'esri/views/MapView',
  'esri/Graphic',
  'esri/layers/GraphicsLayer',
  'esri/widgets/Search'
], function (esriConfig, Map, MapView, Graphic, GraphicsLayer, Search) {
  esriConfig.apiKey =
    'AAPK56e470581c2641bd8e214bc492af486eKvI9xaPd6JB98_O0b9KAJQ_WNmyNyfcEgw3AigzSMqpfS-AIeDoHvrBw_JRKXUov'

  const map = new Map({
    basemap: 'arcgis-dark-gray' //Basemap layer service
  })

  const view = new MapView({
    container: 'viewDiv',
    map: map,
    center: [-43.55807, -22.71218], //Longitude, latitude
    zoom: 11
  })
  view.popup.collapseEnabled = false
  view.popup.set('dockOptions', {})

  //recuperar problemas e exibir no mapa
  firebase
    .firestore()
    .collection('verificarProblemas')
    .where('categoria', '==', 'Enchentes Queimados')
    .get()
    .then(listaProblemas => {
      listaProblemas.forEach(problema => {
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
        console.log(graficoProblema)
        view.graphics.add(graficoProblema)
      })
    })
})
