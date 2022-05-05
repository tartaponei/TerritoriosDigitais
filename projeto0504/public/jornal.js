document.addEventListener('DOMContentLoaded', criarListaDePosts)

var postsExibidos = ''

function mostraPost(postId) {
  console.log(postId)
  localStorage.setItem('postId', postId)
}

function criarListaDePosts() {
  const footer = document.querySelector('footer')
  const carregando = document.createElement('img')
  carregando.setAttribute('id', 'carregando')
  carregando.setAttribute(
    'style',
    'max-width:100vw; width:auto;heigth:auto;position:relative;margin:auto;'
  )
  carregando.setAttribute('src', 'images/loading.gif')

  document.querySelector('main').style.display = 'none'
  document.body.insertBefore(carregando, footer)

  const colecaoJornal = firebase.firestore().collection('jornal')

  colecaoJornal.get().then(listaDePosts => {
    listaDePosts.forEach(post => {
      console.log(post.data())
      postsExibidos += `<div class="bordas u-blog-post u-container-style u-repeater-item u-white u-repeater-item-1">
      <div class=" u-similar-container u-valign-top u-container-layout-1">
        <h4 class="u-blog-control u-text u-text-1">
          <a class="u-post-header-link ${post.id}" onclick="mostraPost('${
        post.id
      }')" >
          ${post.data().titulo}</a>
        </h4>
        <a class="u-post-header-link" onclick="mostraPost('${post.id}')">
          <img
            alt=""
           class="u-blog-control u-expanded-width u-image u-image-default u-image-1 ${
             post.id
           }"
            src="${post.data().imagem}"/>
        </a>
        <div class="u-blog-control u-post-content u-text u-text-2 fr-view ${
          post.id
        }"
          >
        ${post.data().bairro}</div>
        <a
        onclick="mostraPost('${post.id}')"
          class="u-blog-control u-border-2 u-border-palette-1-base u-btn u-btn-rectangle u-button-style u-none u-btn-1"
          >Leia Mais</a>
      </div>
    </div>`
    })
    document.getElementById('carregando').remove()
    document.getElementById('listaDePosts').innerHTML = postsExibidos
    document.querySelector('main').style.display = 'block'
  })
}
/*
capturar o post clicado
colocar na cache
usar na pagina post para exibir
*/
