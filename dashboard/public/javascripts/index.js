document.querySelectorAll('#accept').forEach((item) => {
  item.addEventListener('click', () => {
    console.log('accept' + item.value)
    fetch('/api/accept', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: item.value,
      }),
    })
      .then((response) => {
        if (response.status == 200) {
          console.log('OK')
        } else {
          console.log('KO')
        }
      })
      .then((data) => console.log(data))
      .catch((error) => console.error(error))
  })
})

document.querySelectorAll('#delete').forEach((item) => {
  item.addEventListener('click', () => {
    console.log('delete' + item.value)
    fetch('/api/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: item.value,
      }),
    })
      .then((response) => {
        if (response.status == 200) {
          console.log('OK')
        } else {
          console.log('KO')
        }
      })
      .then((data) => console.log(data))
      .catch((error) => console.error(error))
  })
})

document
  .querySelector('#generatePlaces')
  .addEventListener('click', function () {
    var p = document.querySelector('#places')
    var mess = document.querySelector('#placeInput').value;
    fetch('/api/valid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: mess,
      }),
    }).then((response) => {
      response.json().then((data) => (p.innerHTML = data.response))
    })
  })
