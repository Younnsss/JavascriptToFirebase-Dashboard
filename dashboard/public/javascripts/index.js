document.querySelector('#exit').addEventListener('click', () => {
  console.log('exit');
  localStorage.removeItem('token');
  window.location.href = '/';
})

document.querySelectorAll('#accept').forEach((item) => {
  item.addEventListener('click', () => {
    console.log('accept' + item.value)
    fetch('/api/accept', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
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
    fetch('/api/delete', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // get the attribute "data-button" of item
        id: item.getAttributeNode('eventId').value,
        place: item.getAttributeNode('placeName').value,
        image: item.getAttributeNode('imagePath').value,
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
    var mess = document.querySelector('#placeInput').value
    fetch('/api/valid', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: mess,
      }),
    }).then((response) => {
      response.json().then((data) => (p.innerHTML = data.response))
    })
  })

document.querySelectorAll('#deleteModif').forEach((item) => {
  item.addEventListener('click', () => {
    fetch('/api/deleteModif', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: item.getAttributeNode('modifId').value,
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

document.querySelectorAll('#acceptModif').forEach((item) => {
  item.addEventListener('click', () => {
    fetch('/api/deleteModif', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: item.getAttributeNode('modifId').value,
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

    fetch('/api/acceptModif', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        place: item.getAttributeNode('place').value,
        newData: item.getAttributeNode('newdata').value,
        modif: item.getAttributeNode('modif').value,
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
