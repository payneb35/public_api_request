const gallery = document.querySelector('.gallery');

function fetchUsers() {
    return fetch("https://randomuser.me/api/?results=12")
        .then(checkStatus)
        .then(res => res.json())
        .then(data => data = data.results)
        .then(users => {
            for (let i = 0; i < users.length; i++) {
                generateGalleryHTML(users[i])
            };
        })
        .catch(error => console.log('Looks like there was a problem', error))
}

fetchUsers();

function generateGalleryHTML(user) {
    const html = `
                <div class="card">
                <div class="card-img-container">
                <img class="card-img" src="${user.picture.large}" alt="profile picture">
                </div>
                <div class="card-info-container">
                <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="card-text">${user.email}</p>
                <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
                </div>
                </div>
                `;
    gallery.insertAdjacentHTML('beforeend', html);
}

function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response); 
    } else {
        return Promise.reject(new Error(response.statusText)); 
    }
  }