let jsonData;
let displayedFields = [];

// Step 1: Select File
document.getElementById('file-input').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            jsonData = JSON.parse(e.target.result);
            showStep(2);
        };
        reader.readAsText(file);
    }
});

// Step 2: Specify Format
document.getElementById('file-type').addEventListener('change', function () {
    showStep(3);
});

// Step 3: Display Handling
document.getElementById('display-options-button').addEventListener('click', function () {
    fetchAndDisplayDataFields();
});

// Utility function: Fetch and display data fields based on format, encoding, and delimiter
function fetchAndDisplayDataFields() {
    const fileFormat = document.getElementById('file-type').value;

    // Populate the available fields list
    populateFieldsList('available-fields', getAllFields());

    // Ensure displayed fields are empty initially
    displayedFields = [];

    // Display the empty table initially
    displayData();
}

// Display Data
document.getElementById('display-data-button').addEventListener('click', function () {
    displayData();
});

// Utility function: Show/hide steps
function showStep(step) {
    for (let i = 1; i <= 3; i++) {
        const stepElement = document.getElementById(`step-${i}`);
        stepElement.style.display = i === step ? 'block' : 'none';
    }
}

// Utility function: Get all available fields
function getAllFields() {
    return Object.values(jsonData.products)
        .flatMap(product => Object.keys(product))
        .filter((value, index, self) => self.indexOf(value) === index);
}

// Display Data
function displayData() {
    const tableHeader = document.getElementById('table-header');
    const tableBody = document.getElementById('table-body');

    // Clear the table
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    // Get all available fields
    const allFields = getAllFields();

    available = Array.from(document.getElementById('available-fields').options).map(option => option.value);

    // Populate the available fields list
    populateFieldsList('available-fields', available);

    // Get the selected fields to be displayed
    displayedFields = Array.from(document.getElementById('displayed-fields').options).map(option => option.value);

    // Display table header
    displayedFields.forEach(field => {
        const th = document.createElement('th');
        th.textContent = field;
        tableHeader.appendChild(th);
    });

    // Display table data ordered by descending popularity
    const sortedProducts = Object.values(jsonData.products).sort((a, b) => b.popularity - a.popularity);

    sortedProducts.forEach(product => {
        const tr = document.createElement('tr');
        displayedFields.forEach(field => {
            const td = document.createElement('td');
            td.textContent = product[field] || ''; // Handle the case where the field is not available in the record
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });

    showStep(3);
}

function cancelSelection() {
    // Reset the file input
    document.getElementById('file-input').value = '';

    // Reset other form elements and go back to Step 1
    showStep(1);

    // Clear jsonData and displayedFields
    jsonData = undefined;
    displayedFields = [];

    // Clear table header and body
    const tableHeader = document.getElementById('table-header');
    const tableBody = document.getElementById('table-body');
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    // Clear local storage
    localStorage.clear();
}





// Utility function: Populate fields in a select element
function populateFieldsList(selectId, fields) {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = '';
    fields.forEach(field => {
        const option = document.createElement('option');
        option.value = field;
        option.text = capitalizeFirstLetter(field);
        selectElement.appendChild(option);
    });
}

// Utility function: Move selected options between two select elements

function moveFields(sourceId, destinationId) {

    const source = document.getElementById(sourceId);
    const destination = document.getElementById(destinationId);

    const selectedOptions = Array.from(source.selectedOptions);
    selectedOptions.forEach(option => {
        const clonedOption = option.cloneNode(true);
        destination.add(clonedOption);
        source.remove(option.index);
    });

    // Update the displayedFields array based on the current options in 'fields to be displayed'
    displayedFields = Array.from(document.getElementById('displayed-fields').options).map(option => option.value);

    // Update the available fields list based on all fields minus the displayed fields
    const allFields = getAllFields();
    const availableFields = allFields.filter(field => !displayedFields.includes(field));

    // Clear and repopulate both lists to ensure correct order
    populateFieldsList('available-fields', availableFields);
    populateFieldsList('displayed-fields', displayedFields);

    // Trigger the displayData function after moving fields
    //displayData();
}

// Utility function: Capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
