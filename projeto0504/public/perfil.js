import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js'

firebase.auth().onAuthStateChanged(user => {
  const db = firebase.firestore()
  let uid = user.uid
  const usuario = db.collection('usuarios').doc(uid)

  usuario
    .get()
    .then(doc => {
      if (doc.exists) {
        const user = doc.data()
        console.log(doc.data())
        document.getElementById('nomeUsuario').innerHTML = user.nome
        document.getElementById('personalidade').innerHTML = user.personalidade
        document.getElementById('objetivo').innerHTML = user.objetivo
        document.getElementById('imgPerfil').src = `${user.imagemPerfil}`

        if (user.projeto) {
          //se tiver projeto muda a descrição
        } else {
          let projetoInfo = document.querySelector('.projetoDiv')
          projetoInfo.setAttribute('style', 'display: none;')
        }
      } else {
        console.log('No such document!')
      }
    })
    .catch(error => {
      console.log('Error getting document:', error)
    })
})
