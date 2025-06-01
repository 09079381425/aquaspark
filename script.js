document.addEventListener("DOMContentLoaded", function () {
    console.log("App is running on:", window.location.href); // Log URL

    let initialInventory = [
        { id: "emptyStock", name: "Stock of Empty Gallons", quantity: 0 },
        { id: "deliveredGallons", name: "Delivered Gallons", quantity: 0 }
    ];

    function loadInventory() {
        let storedInventory = JSON.parse(localStorage.getItem("inventory"));
        return storedInventory ? storedInventory : initialInventory;
    }

    function saveInventory(inventory) {
        localStorage.setItem("inventory", JSON.stringify(inventory));
    }

    function resetInventory() {
        let inventory = loadInventory();
        let inventoryBody = document.getElementById("inventoryBody");
        if (!inventoryBody) return;

        inventoryBody.innerHTML = "";
        inventory.forEach(item => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td id="${item.id}">${item.quantity}</td>
                <td>
                    <button onclick="editItem('${item.id}')">Edit</button>
                    <button onclick="deleteItem('${item.id}')">Delete</button>
                </td>
            `;
            inventoryBody.appendChild(row);
        });

        updateTotalGallons();
    }

    function login() {
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        if (username === "admin" && password === "1234") {
            document.getElementById("loginPage").style.display = "none";
            document.getElementById("dashboardPage").style.display = "block";
            resetInventory();
        } else {
            document.getElementById("message").innerHTML = "Invalid username or password.";
        }
    }

    function logout() {
        document.getElementById("dashboardPage").style.display = "none";
        document.getElementById("loginPage").style.display = "block";
    }

    function updateTotalGallons() {
        let inventory = loadInventory();
        let total = inventory.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById("totalGallons").innerText = total;
    }

    function editItem(itemId) {
        let newValue = prompt("Enter new quantity:");
        if (newValue !== null && !isNaN(newValue) && newValue.trim() !== "") {
            newValue = parseInt(newValue);
            document.getElementById(itemId).innerText = newValue;

            let inventory = loadInventory();
            let item = inventory.find(i => i.id === itemId);
            if (item) {
                item.quantity = newValue;
                saveInventory(inventory);
            }

            updateTotalGallons();
        }
    }

    function deleteItem(itemId) {
        let inventory = loadInventory();
        let updatedInventory = inventory.filter(item => item.id !== itemId);
        saveInventory(updatedInventory);
        resetInventory(); // Re-render table
    }

    function createItem() {
        let itemName = prompt("Enter new item name:");
        let itemQuantity = prompt("Enter quantity:");
        if (itemName && !isNaN(itemQuantity) && itemQuantity.trim() !== "") {
            itemQuantity = parseInt(itemQuantity);
            let newItem = {
                id: itemName.replace(/\s+/g, "_").toLowerCase(),
                name: itemName,
                quantity: itemQuantity
            };

            let inventory = loadInventory();
            inventory.push(newItem);
            saveInventory(inventory);
            resetInventory();
        }
    }

    function reloadInventory() {
        localStorage.removeItem("inventory");
        resetInventory();
    }

    // Expose functions globally
    window.login = login;
    window.logout = logout;
    window.editItem = editItem;
    window.deleteItem = deleteItem;
    window.createItem = createItem;
    window.reloadInventory = reloadInventory;

    // Initialize inventory on page load
    resetInventory();
});
