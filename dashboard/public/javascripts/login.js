window.onload = function () {
  console.log('test')
  if (localStorage.getItem('token') != null) {
    authenticate()
  }
}

document.querySelector('#submit').addEventListener('click', () => {
  fetch('/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pseudo: document.querySelector('#pseudo').value,
      password: document.querySelector('#pass').value,
    }),
  }).then((response) => {
    response.json().then((data) => {
      if (data.token) {
        localStorage.setItem('token', data.token)
        authenticate()
      } else {
        console.log('Error')
      }
    })
  })
})

function authenticate() {
  fetch('/dashboard', {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    method: 'GET',
  })
    .then(function (response) {
      return response.text()
    })
    .then(function (text) {
      var el = document.createElement('html')
      el.innerHTML = text
      document.querySelectorAll('script').forEach(function (el) {
        el.remove()
      })

      document.body.innerHTML = text
      var my_awesome_script = document.createElement('script')
      my_awesome_script.setAttribute('src', el.querySelector('script').src)
      document.head.appendChild(my_awesome_script)
      document.querySelector('title').innerText = el.querySelector(
        'title',
      ).innerText

      window.history.pushState(null, '', '/dashboard')
    })
    .catch(function (error) {
      console.error(error)
    })
}
