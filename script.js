// Get DOM elements
const loginForm = document.getElementById("loginForm");
const inventorySystem = document.getElementById("inventorySystem");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");

const addItemBtn = document.getElementById("addItemBtn");
const updateItemBtn = document.getElementById("updateItemBtn");
const itemNameInput = document.getElementById("itemName");
const itemQuantityInput = document.getElementById("itemQuantity");
const categoryCheckboxes = document.querySelectorAll(".category-container input");
const inventoryList = document.getElementById("inventory");
const categoryFilter = document.getElementById("categoryFilter");

let editingIndex = null; // Store the index of the item being edited
let inventory = JSON.parse(localStorage.getItem("inventory")) || []; // Load inventory from localStorage

// Dummy login credentials
const dummyEmail = "admin@example.com";
const dummyPassword = "password123";

// Function to render the inventory list with filtering
function renderInventory(filterCategory = "all") {
    inventoryList.innerHTML = "";

    const filteredInventory = filterCategory === "all" ?
        inventory :
        inventory.filter(item => item.categories.includes(filterCategory));

    filteredInventory.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
      <span>${item.name} (x${item.quantity}) - ${item.categories.join(", ")}</span>
      <button class="edit-btn" onclick="editItem(${index})">Edit</button>
      <button class="delete-btn" onclick="deleteItem(${index})">Delete</button>
    `;
        inventoryList.appendChild(listItem);
    });
}

// Function to add an item to the inventory
function addItem() {
    const itemName = itemNameInput.value.trim();
    const itemQuantity = itemQuantityInput.value.trim();

    // Get selected categories
    const selectedCategories = [];
    categoryCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedCategories.push(checkbox.value);
        }
    });

    if (itemName === "" || itemQuantity === "" || selectedCategories.length === 0) {
        alert("Please fill in all fields and select at least one category.");
        return;
    }

    // Add item to the inventory array
    inventory.push({
        name: itemName,
        quantity: itemQuantity,
        categories: selectedCategories
    });

    // Save updated inventory to localStorage
    localStorage.setItem("inventory", JSON.stringify(inventory));

    // Render the updated inventory
    renderInventory();

    // Clear input fields and category checkboxes after adding the item
    itemNameInput.value = "";
    itemQuantityInput.value = "";
    categoryCheckboxes.forEach(checkbox => checkbox.checked = false);
}

// Function to delete an item
function deleteItem(index) {
    inventory.splice(index, 1); // Remove item from the array
    localStorage.setItem("inventory", JSON.stringify(inventory)); // Save to localStorage
    renderInventory(); // Re-render the inventory
}

// Function to edit an item
function editItem(index) {
    const item = inventory[index];
    itemNameInput.value = item.name;
    itemQuantityInput.value = item.quantity;
    categoryCheckboxes.forEach(checkbox => checkbox.checked = item.categories.includes(checkbox.value));

    // Swap buttons for editing
    addItemBtn.style.display = "none";
    updateItemBtn.style.display = "inline-block";

    // Set the index of the item being edited
    editingIndex = index;
}

// Function to update an item
function updateItem() {
    const itemName = itemNameInput.value.trim();
    const itemQuantity = itemQuantityInput.value.trim();

    // Get selected categories
    const selectedCategories = [];
    categoryCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedCategories.push(checkbox.value);
        }
    });

    if (itemName === "" || itemQuantity === "" || selectedCategories.length === 0) {
        alert("Please fill in all fields and select at least one category.");
        return;
    }

    // Update the inventory item
    inventory[editingIndex] = {
        name: itemName,
        quantity: itemQuantity,
        categories: selectedCategories
    };

    // Save updated inventory to localStorage
    localStorage.setItem("inventory", JSON.stringify(inventory));

    // Render the updated inventory
    renderInventory();

    // Clear input fields and category checkboxes after updating the item
    itemNameInput.value = "";
    itemQuantityInput.value = "";
    categoryCheckboxes.forEach(checkbox => checkbox.checked = false);

    // Reset the form
    addItemBtn.style.display = "inline-block";
    updateItemBtn.style.display = "none";

    // Reset editing index
    editingIndex = null;
}

// Function to handle login
function handleLogin() {
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    if (email === dummyEmail && password === dummyPassword) {
        // Hide login form and show inventory system
        loginForm.style.display = "none";
        inventorySystem.style.display = "block";
        loginError.textContent = ""; // Clear any previous error message
    } else {
        loginError.textContent = "Invalid email or password.";
    }
}

// Function to handle logout
function handleLogout() {
    // Show login form and hide inventory system
    loginForm.style.display = "block";
    inventorySystem.style.display = "none";
}

// Event listeners
loginBtn.addEventListener("click", handleLogin);
logoutBtn.addEventListener("click", handleLogout);

addItemBtn.addEventListener("click", addItem);
updateItemBtn.addEventListener("click", updateItem);
categoryFilter.addEventListener("change", (e) => renderInventory(e.target.value));

// Initial render of inventory
renderInventory();