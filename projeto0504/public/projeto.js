import {
  getAuth,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js'

let projetoUsuario
let dadosEquipe, dadosProjeto, listaIntegrantes
const auth = getAuth()

const footer = document.querySelector('footer')
const carregando = document.createElement('img')
carregando.setAttribute('id', 'carregando')
carregando.setAttribute(
  'style',
  'max-width:100vw; width:auto;heigth:auto;position:relative;margin:auto;'
)
carregando.setAttribute('src', 'images/loading.gif')
document.body.insertBefore(carregando, footer)

document.addEventListener('DOMContentLoaded', () => {
  let nomeProjeto = document.querySelector('#nomeProjeto')
  let nomeEquipe = document.querySelector('#nomeEquipe')
  let descricaoProjeto = document.querySelector('#descricaoProjeto')
  let listaMembros = document.querySelector('#listaMembros')
  let powerPoint = document.querySelector('#areaPowerPoint')
  let areaImgProjeto = document.querySelector('#areaImgProjeto')

  document.querySelector('main').style.display = 'none'
  //a tela esta com o gif carregando
  // verificar
  onAuthStateChanged(auth, user => {
    if (user) {
      let equipeBuscada = decodeURI(location.search.substring(1).split('&')[0])
      if (equipeBuscada) {
        //fazer pagina baseado no link
        let btnZap = document.querySelector('#enviarZap')
        firebase
          .firestore()
          .collection('equipes')
          .where('nome', '==', `${equipeBuscada}`)
          .get()
          .then(equipeEncontrada => {
            //encontrei a equipe do link
            equipeEncontrada.forEach(equipe => {
              firebase
                .firestore()
                .collection('equipes')
                .doc(equipe.id)
                .get()
                .then(equipeAchada => {
                  let equipe = equipeAchada.data()
                  nomeEquipe.innerHTML = equipe.nome
                  if (equipe.integrantes[0]) {
                    equipe.integrantes.forEach(mebroEquipe => {
                      firebase
                        .firestore()
                        .collection('usuarios')
                        .doc(mebroEquipe)
                        .get()
                        .then(membroAchado => {
                          let membro = membroAchado.data()
                          membro.personalidade
                            ? (listaMembros.innerHTML += `
                        <div class="membros">
                          <div class="imgPerfilMembro">
                            <img src="${membro.imagemPerfil}" alt="" />
                          </div>
                          <div class="infoMembro">
                            <p>${membro.nome}</p>
                            <p>${membro.personalidade}</p>
                          </div>
                        </div>`)
                            : (listaMembros.innerHTML += `
                        <div class="membros">
                          <div class="imgPerfilMembro">
                            <img src="${membro.imagemPerfil}" alt="" />
                          </div>
                          <div class="infoMembro">
                            <p>${membro.nome}</p>
                          </div>
                        </div>`)
                        })
                    })
                  } else {
                    document.querySelector('#equipeProjeto').remove()
                  }
                  btnZap.addEventListener('click', () => {
                    let mensagem = document.querySelector('#msgZap').value
                    let msgFinal = encodeURI(mensagem)

                    let comentario = {
                      eviadoPor: `${user.uid}`,
                      texto: mensagem
                    }
                    firebase
                      .firestore()
                      .collection('comentarios')
                      .doc()
                      .set(comentario)
                      .then(() => {
                        window.open(
                          `https://wa.me/${equipe.contato}?text=${msgFinal}`
                        )
                      })
                  })
                })
              firebase
                .firestore()
                .collection('projetos')
                .doc(equipe.id)
                .get()
                .then(projetoAchado => {
                  let projeto = projetoAchado.data()
                  nomeProjeto.innerHTML = projeto.nome
                  descricaoProjeto.innerHTML = projeto.descricao
                  areaImgProjeto.innerHTML = `<img id="imgProjeto" src="${projeto.imagem}" alt="">`

                  if (projeto.powerPoint) {
                    powerPoint.innerHTML = projeto.powerPoint.replace(
                      'iframe',
                      'iframe id="powerPoint"'
                    )
                  } else {
                    document.getElementById('areaPowerPoint').remove()
                  }

                  let pontosIniciais
                  let exibirPontosDepois =
                    document.getElementById('pontosDepois')
                  let exibirPontosAtuais =
                    document.getElementById('pontosAtuais')

                  firebase
                    .firestore()
                    .collection('usuarios')
                    .doc(user.uid)
                    .get()
                    .then(usuarioAchado => {
                      let usuario = usuarioAchado.data()
                      //

                      if (usuario.votosFeitos) {
                        if (usuario.votosFeitos[`${equipe.id}`]) {
                          //se eu já tiver votado nessa equipe
                          bloqueiaVotos()
                        }
                      }

                      pontosIniciais = usuario.pontos
                      exibirPontosAtuais.innerText = pontosIniciais

                      document
                        .getElementById('quantidadeDeVotos')
                        .addEventListener('input', evt => {
                          let exibeCusto = document.getElementById('exibeCusto')
                          let exibeQuantidadeDeVotos = document.getElementById(
                            'exibeQuantidadeDeVotos'
                          )
                          exibeQuantidadeDeVotos.innerText = evt.target.value
                          evt.target.value == 0
                            ? (exibeCusto.innerText = '0')
                            : (exibeCusto.innerText = 2 ** evt.target.value)
                          exibirPontosDepois.innerText =
                            pontosIniciais - parseInt(exibeCusto.innerText)

                          if (pontosIniciais - 2 ** evt.target.value < 0) {
                            document
                              .getElementById('enviarVoto')
                              .setAttribute('disabled', 'true')
                            document
                              .getElementById('enviarVoto')
                              .setAttribute('style', 'color: #f0f6f0')
                          } else {
                            document
                              .getElementById('enviarVoto')
                              .removeAttribute('disabled')
                            document
                              .getElementById('enviarVoto')
                              .setAttribute('style', 'color: #222323')
                          }
                        })

                      document
                        .getElementById('enviarVoto')
                        .addEventListener('click', () => {
                          document
                            .getElementById('enviarVoto')
                            .setAttribute('disabled', 'true')
                          document
                            .getElementById('enviarVoto')
                            .setAttribute('style', 'color: #f0f6f0')

                          if (
                            document.getElementById('quantidadeDeVotos')
                              .value >= 1
                          ) {
                            let quantidadeDeVotos =
                              document.getElementById('quantidadeDeVotos').value
                            let custoVotos =
                              2 **
                              document.getElementById('quantidadeDeVotos').value
                            let listaVotosAntigos
                            let NovosPontos = usuario.pontos - custoVotos

                            if (pontosIniciais >= custoVotos) {
                              if (usuario.votosFeitos) {
                                //se eu já tiver votado nessa equipe
                                listaVotosAntigos = usuario.votosFeitos
                                listaVotosAntigos[`${equipe.id}`] = `${
                                  document.querySelector('#quantidadeDeVotos')
                                    .value
                                }`
                                console.log(listaVotosAntigos)
                                //colocar na lista de já votados
                                let novaListaVotos = listaVotosAntigos
                                //diminuir os pontos
                                let atualizacoes = {
                                  pontos: NovosPontos,
                                  votosFeitos: novaListaVotos
                                }
                                firebase
                                  .firestore()
                                  .collection('usuarios')
                                  .doc(user.uid)
                                  .update(atualizacoes)
                                  .then(() => {
                                    //atualizar a qauntidade de votos da equipe
                                    firebase
                                      .firestore()
                                      .collection('votos')
                                      .doc(equipe.id)
                                      .update({
                                        votos:
                                          firebase.firestore.FieldValue.increment(
                                            quantidadeDeVotos
                                          )
                                      })
                                      .then(() => {
                                        window.location.reload()
                                      })
                                  })
                              }
                            }
                          }
                        })
                    })
                  //-------------------------------------------------------------------------
                  abrirPagina() //mostra a pagina dnv
                  //-------------------------------------------------------------------------
                })
            })
          })
          .catch(error => {
            console.log('Erro ao pegar o documento:', error)
          })
      } else {
        //------------------------- procurar o meu projeto -----------------------------
        bloqueiaVotos()
        firebase
          .firestore()
          .collection('usuarios')
          .doc(user.uid)
          .get()
          .then(usuario => {
            console.log(usuario.data())

            if (usuario.exists) {
              let equipeUsuario = usuario.data().equipe
              let projetoUsuario = usuario.data().projeto
              if (usuario.data().equipe && usuario.data().projeto) {
                console.log(1)
                //o usuario possui uma equipe e projeto
                console.log(equipeUsuario)
                //mostrando os dados do projeto
                firebase
                  .firestore()
                  .collection('projetos')
                  .doc(projetoUsuario)
                  .get()
                  .then(projetoAchado => {
                    let projeto = projetoAchado.data()
                    console.log(projeto)
                    nomeProjeto.innerHTML = projeto.nome
                    descricaoProjeto.innerHTML = projeto.descricao
                    areaImgProjeto.innerHTML = `<img id="imgProjeto" src="${projeto.imagem}" alt="">`

                    powerPoint.innerHTML = projeto.powerPoint.replace(
                      'iframe',
                      'iframe id="powerPoint"'
                    )
                  })
                //mostrando os dados da equipe
                firebase
                  .firestore()
                  .collection('equipes')
                  .doc(equipeUsuario)
                  .get()
                  .then(equipeAchada => {
                    let equipe = equipeAchada.data()
                    console.log(equipe)
                    nomeEquipe.innerHTML = equipe.nome

                    equipe.integrantes.forEach(mebroEquipe => {
                      console.log(mebroEquipe)
                      firebase
                        .firestore()
                        .collection('usuarios')
                        .doc(mebroEquipe)
                        .get()
                        .then(membroAchado => {
                          let membro = membroAchado.data()
                          console.log(membro)
                          listaMembros.innerHTML += `
                          <div class="membros">
                          <div class="imgPerfilMembro">
                            <img src="${membro.imagemPerfil}" alt="" />
                          </div>
                          <div class="infoMembro">
                            <p>${membro.nome}</p>
                            <p>${membro.personalidade}</p>
                          </div>
                        </div>`
                        })
                    })
                    abrirPagina() //mostra a pagina dnv
                  })
              } else {
                if (usuario.data().equipe) {
                  //o usuario possui só equipe
                  if (usuario.data().equipe == usuario.id) {
                    //se ele é o criador da equipe
                    window.location.href = 'cadastro-de-projeto.html'
                  }
                  if (usuario.data().equipe != usuario.id) {
                    //se ele NÃO é o criador da equipe
                    let modalText = document.querySelector(
                      '.modal-body div.u-align-left'
                    )
                    modalText.innerHTML = `<p style="text-align: justify;font-size: 1.55rem; font-weight: 600;">Fale com o criador da sua equipe para criar um projeto pra vocês!</p><br /><a href="mapa.html" class="u-border-none u-btn modal-btn modal-btn-1 u-button-style u-hover-palette-2-dark-1 u-palette-2-base"><h1>&nbsp;Volte para o mapa!</h1></a>`
                    abrirModal()
                  }
                } else {
                  //se ele NÃO tem equipe
                  firebase
                    .firestore()
                    .collection('convites')
                    .doc(user.uid)
                    .get()
                    .then(listaConvites => {
                      let convites = listaConvites.data().convites
                      console.log(convites)
                      document.querySelector('main').innerHTML =
                        '<p id="tituloPag"> seus convites de equipe</p>'
                      convites.forEach(equipe => {
                        //criar lista de convite
                        //mostrar essa lista na tela
                        console.log(equipe)
                        firebase
                          .firestore()
                          .collection('equipes')
                          .doc(equipe)
                          .get()
                          .then(dado => {
                            if (dado.exists) {
                              let nomeEquipe = dado.data().nome
                              document.querySelector(
                                'main'
                              ).innerHTML += `<div class="conviteLista" id="${equipe}">
                          <div class="nomeEquipe"><p>${nomeEquipe}</p></div>
                          <button class="botaoLista aceitar">aceitar convite</button>
                          <button class="botaoLista recusar">recusar convite</button>
                        </div>`
                              document
                                .querySelector('.botaoLista.aceitar')
                                .addEventListener('click', evt => {
                                  let equipeClicada =
                                    evt.target.parentElement.id

                                  let atualizaEquipe = {
                                    equipe: equipeClicada,
                                    projeto: equipeClicada
                                  }

                                  evt.target.parentElement.remove()

                                  atualizaDados(
                                    'usuarios',
                                    user.uid,
                                    atualizaEquipe
                                  )
                                })
                              document
                                .querySelector('.botaoLista.recusar')
                                .addEventListener('click', evt => {
                                  evt.target.parentElement.remove()
                                  let equipeClicada =
                                    evt.target.parentElement.id

                                  //para cada equipe na tela eu coloco o id deel na lista e envio a lista

                                  let novaLista = { convites: [] }
                                  document
                                    .querySelectorAll('.conviteLista')
                                    .forEach((node, pos) => {
                                      novaLista.convites.push(node.id)
                                    })

                                  enviarDados('convites', user.uid, novaLista)
                                })
                            }
                          })
                      })
                      abrirPagina()
                    })
                }
              }
            } else {
              console.log('Não encontrei o usuario!')
            }
          })
          .catch(error => {
            console.log('Erro ao pegar o documento:', error)
          })
      }
    } else {
      window.location.href = 'cadastro.html'
    }
  })
})

async function lerDados(nomeColecao, nomeDocumento) {
  firebase
    .firestore()
    .collection(nomeColecao)
    .doc(nomeDocumento)
    .get()
    .then(async dado => {
      if (dado.exists) {
        console.log('Document data:', dado.data())
        return dado.data()
      } else {
        // doc.data() will be undefined in this case
        console.log('Não encontrei o documento!')
      }
    })
    .catch(async error => {
      console.log('Erro ao pegar o documento:', error)
    })
}

function abrirPagina() {
  document.getElementById('carregando').remove()
  document.querySelector('main').style.display = 'block'
}

function abrirModal() {
  document.getElementById('dv-modal').style.display = 'Block'
  document.body.style.overflow = 'hidden'
}

function fecharModal() {
  document.getElementById('dv-modal').style.display = 'none'
  document.body.style.overflow = 'initial'
}

function atualizaDados(nomeColecao, nomeDocumento, documento) {
  firebase
    .firestore()
    .collection(nomeColecao)
    .doc(nomeDocumento)
    .update(documento)
    .then(doc => {
      window.location.reload()
    })
    .catch(error => {
      console.error('Erro ao atualizar o documento: ', error)
    })
}

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

function bloqueiaVotos() {
  document.getElementById('areaVoto').remove()
}
