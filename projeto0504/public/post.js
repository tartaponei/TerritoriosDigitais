document.addEventListener('DOMContentLoaded', () => {
  //reconectar()
  const idNoticia = localStorage.getItem('PostId')

  const colecaoJornal = firebase.firestore().collection('jornal')

  colecaoJornal
    .doc(idNoticia)
    .get()
    .then(post => {
      console.log(post)
      if (post.exists) {
        let infoPost = post.data()
        console.log(post.data())
        let timestamp = infoPost.data.seconds
        console.log(timestamp)
        let date = new Date(timestamp * 1000)
        let dataFormatada =
          date.getDate().toString().padStart(2, '0') +
          '/' +
          (date.getMonth() + 1).toString().padStart(2, '0') +
          '/' +
          date.getFullYear() +
          ' às ' +
          date.getHours().toString().padStart(2, '0') +
          ':' +
          date.getMinutes().toString().padStart(2, '0') +
          ':' +
          date.getSeconds().toString().padStart(2, '0')

        document.getElementsByTagName(
          'title'
        )[0].innerHTML = `territorios digitais - ${post.data().titulo}`
        console.log('dados do post:', post.data())
        document.getElementById('tituloPost').innerHTML = infoPost.titulo
        document.getElementById('imagemPost').src = infoPost.imagem
        document.getElementById('descricaoPost').innerHTML = infoPost.descricao
        document.getElementById(
          'dataPost'
        ).innerHTML = `${infoPost.bairro} - ${dataFormatada}`
      } else {
        // doc.data() will be undefined in this case
        console.log('não pude encotrar essa pagina')
      }
    })
    .catch(error => {
      console.log('Error ao pegar o documento: ', error)
    })
})

function reconectar() {
  let email = localStorage.email
  let senha = localStorage.senha
  firebase
    .auth()
    .signInWithEmailAndPassword(email, senha)
    .then(userCredential => {
      // conectado com sucesso
      const user = userCredential.user
      console.log('conectado com sucesso!')
      const auth = getAuth()
      onAuthStateChanged(auth, user => {
        console.log(firebase.auth().currentUser.uid)
      })
    })
}
