import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js'

//cadastrar com google

document.addEventListener('DOMContentLoaded', () => {
  const auth = getAuth()
  signOut(auth).catch(error => {
    console.log(error)
  })
  document
    .getElementById('cadastrarGoogle')
    .addEventListener('click', conectarComGoogle)
})

function conectarComGoogle() {
  const auth = getAuth()
  auth.languageCode = 'pt-br'
  const provider = new GoogleAuthProvider()
  signInWithPopup(auth, provider)
    .then(result => {
      onAuthStateChanged(auth, user => {
        window.location.replace('cadastro-coleta-de-dados.html')
      })
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.email
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      console.log(`falha ao conectar: 
      ${errorCode} --
      ${errorMessage} --
      ${email} -- 
      ${credential}`)
      // ...
    })
}
