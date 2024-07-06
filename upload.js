const loginForm = document.getElementById('login-form');
const carForm = document.getElementById('car-form');
const carModelInput = document.getElementById('car-model');
const exShowroomPriceInput = document.getElementById('ex-showroom-price');
const onRoadPriceInput = document.getElementById('on-road-price');
const carCategoryInput = document.getElementById('car-category');
const carImageInput = document.getElementById('car-image');
const adminTableBody = document.querySelector('#admin-table tbody');
const employeeTableBody = document.querySelector('#employee-table tbody');
const adminSearch = document.getElementById('admin-search');
const employeeSearch = document.getElementById('employee-search');

let carData = JSON.parse(localStorage.getItem('carData')) || [];

const users = {
    "admin@silverstar.com": "admin123",
    "intern@silverstar.com": "intern123"
};

// Function to authenticate users
function authenticate(email, password) {
    return users[email] === password;
}

// Function to show the correct portal
function showPortal(email) {
    document.getElementById('login-portal').classList.add('hidden');
    if (email === "admin@silverstar.com") {
        document.getElementById('admin-portal').classList.remove('hidden');
    } else if (email === "intern@silverstar.com") {
        document.getElementById('employee-portal').classList.remove('hidden');
    }
}

// Function to add or update a car
function addOrUpdateCar(model, exShowroomPrice, onRoadPrice, category, image) {
    const existingCarIndex = carData.findIndex(car => car.model === model);
    const difference = onRoadPrice - exShowroomPrice;

    if (existingCarIndex !== -1) {
        carData[existingCarIndex] = { model, exShowroomPrice, onRoadPrice, difference, category, image };
    } else {
        carData.push({ model, exShowroomPrice, onRoadPrice, difference, category, image });
    }

    localStorage.setItem('carData', JSON.stringify(carData));
    updateTables();
}

// Function to delete a car
function deleteCar(model) {
    carData = carData.filter(car => car.model !== model);
    localStorage.setItem('carData', JSON.stringify(carData));
    updateTables();
}

// Function to filter cars
function filterCars(searchTerm, tableBody) {
    tableBody.innerHTML = '';
    carData.filter(car => car.model.toLowerCase().includes(searchTerm.toLowerCase()))
        .forEach(car => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${car.model}</td>
                <td>${car.exShowroomPrice}</td>
                <td>${car.onRoadPrice}</td>
                <td>${car.difference}</td>
                <td>${car.category}</td>
                <td><img src="${car.image}" alt="${car.model}"></td>
                ${tableBody === adminTableBody ? `<td><button onclick="deleteCar('${car.model}')">Delete</button></td>` : ''}
            `;
            tableBody.appendChild(row);
        });
}

// Function to update the tables
function updateTables() {
    filterCars(adminSearch.value, adminTableBody);
    filterCars(employeeSearch.value, employeeTableBody);
}

// Event listener for the login form
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (authenticate(email, password)) {
        showPortal(email);
        updateTables();
    } else {
        alert('Invalid credentials');
    }
});

// Event listener for the car form
carForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const model = carModelInput.value;
    const exShowroomPrice = parseFloat(exShowroomPriceInput.value);
    const onRoadPrice = parseFloat(onRoadPriceInput.value);
    const category = carCategoryInput.value;
    const imageFile = carImageInput.files[0];

    const reader = new FileReader();
    reader.onload = function(e) {
        const image = e.target.result;
        addOrUpdateCar(model, exShowroomPrice, onRoadPrice, category, image);
        carForm.reset();
    };
    reader.readAsDataURL(imageFile);
});

// Event listeners for the search inputs
adminSearch.addEventListener('input', () => filterCars(adminSearch.value, adminTableBody));
employeeSearch.addEventListener('input', () => filterCars(employeeSearch.value, employeeTableBody));

// Initial table update
updateTables();
