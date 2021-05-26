//Selecting necessary DOM elements
const gallery = document.querySelector('.gallery');
const body = document.querySelector('body');
const searchContainer = document.querySelector('.search-container');

//Creating an empty array to add data retrieved from API call
let employeeProfiles = [];  

//Adding search bar
const searchBarHTML = `
                    <form action="#" method="get">
                    <input type="search" id="search-input" class="search-input" placeholder="Search...">
                    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                    </form>
                    `;
searchContainer.insertAdjacentHTML('beforeend', searchBarHTML); 
const searchInput = document.querySelector('.search-input');
const searchSubmit = document.querySelector('.search-submit');

//Adding event listeners to handle searching functionality
searchSubmit.addEventListener('click', searchEmployees);
searchInput.addEventListener('input', searchEmployees);

//Fetching 12 random profiles to use and generating the profile cards
fetch("https://randomuser.me/api/?results=12&nat=us")
    .then(checkStatus)
    .then(res => res.json())
    .then(data => data = data.results)
    .then(users => {
        for (let i = 0; i < users.length; i++) {
            generateGalleryHTML(users[i], i, users);
            employeeProfiles.push(users[i]);
        };
    })
    .catch(error => console.log('Looks like there was a problem', error))

//This function generates the html for each profile card and adds it to the document
function generateGalleryHTML(employee, index, employees) {
    const html = `
                <div class="card" id="${index}">
                <div class="card-img-container">
                <img class="card-img" src="${employee.picture.large}" alt="profile picture">
                </div>
                <div class="card-info-container">
                <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="card-text">${employee.email}</p>
                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
                </div>
                </div>
                `;
    gallery.insertAdjacentHTML('beforeend', html);
    const lastEmployee = gallery.lastElementChild;
    lastEmployee.addEventListener('click', () => {
        generateModalHTML(employee);
        handleModalWindow(employees, index);
    });
}

//This function creates the html for the modal windows and formats them correctly
function generateModalHTML(employee) {
    const regexBirthday = `${employee.dob.date}`.slice(0, 10);
    const birthday = regexBirthday.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$2/$3/$1');
    const phone = `${employee.phone}`.slice(0, 5) + ` ` + `${employee.phone}`.slice(6, )
    const html = `
                <div class="modal-container">
                <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="modal-text">${employee.email}</p>
                <p class="modal-text cap">${employee.location.city}</p>
                <hr>
                <p class="modal-text">${phone}</p>
                <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
                <p class="modal-text">Birthday: ${birthday}</p>
                </div>
                </div>

                <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
                </div>
                `;
    body.insertAdjacentHTML('beforeend', html);
}

//This function handles the buttons in the modal window (closing, previous, and next)
function handleModalWindow(employees, employeeIndex) {
    const closeButton = document.querySelector('button.modal-close-btn');
    const prevButton = document.querySelector('button.modal-prev')
    const nextButton = document.querySelector('button.modal-next')
    const modalContainerDiv = document.querySelector('div.modal-container');
    closeButton.addEventListener('click', () => {
        modalContainerDiv.remove();
    });
    if (employeeIndex > 0) {
        prevButton.addEventListener('click', () => {
            modalContainerDiv.remove();
            generateModalHTML(employees[employeeIndex - 1]);
            handleModalWindow(employees, employeeIndex - 1)
        });
    } else {
        prevButton.remove();
    }
    if (employeeIndex < employees.length - 1) {
        nextButton.addEventListener('click', () => {
            modalContainerDiv.remove();
            generateModalHTML(employees[employeeIndex + 1]);
            handleModalWindow(employees, employeeIndex + 1)
        });
    } else {
        nextButton.remove();
    }
}

//This function uses the search input to search for matching employee names
function searchEmployees() {
    const modalWindows = document.querySelectorAll('.modal-container');
    modalWindows.forEach(window => window.remove());
    gallery.innerHTML = '';
    let searchText = document.querySelector('.search-input').value;
    let searchedNames = [];
    for (let i = 0; i < employeeProfiles.length; i++) {
        const name = `${employeeProfiles[i].name.first} ${employeeProfiles[i].name.last}`.toLowerCase();
        if (name.includes(searchText.toLowerCase())){
            searchedNames.push(employeeProfiles[i]);
        }
    }
    if (searchedNames.length > 0) {
        for (let i = 0; i < searchedNames.length; i++) {
            generateGalleryHTML(searchedNames[i], i, searchedNames);
        }
    } else {
        gallery.innerHTML = '<h2 class="notfound">No results found! Try again!</h2>'
    }
}

//This function ensures the fetch was successful
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response); 
    } else {
        return Promise.reject(new Error(response.statusText)); 
    }
  }