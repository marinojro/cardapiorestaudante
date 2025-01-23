const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

//abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex"
})

//se clicar no modal fecha
cartModal.addEventListener("click", function (e) {
    if (e.target === cartModal) // Clicou fora do conteúdo?
        cartModal.style.display = "none" // Fecha o modal.
})

//fechar ao clicar no botão FECHAR do modal
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function (e) {
    let parentButton = e.target.closest(".add-to-cart-btn")
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})


function addToCart(name, price) {

    //a função find percorre por todo array cart, e verifica se a name já existir dentre do array
    const existingItem = cart.find(item => item.name === name)

    //se o item já existe na lista, adiciona apenas a quantidade + 1
    if (existingItem) {
        existingItem.quantity += 1;
        return;
    }

    //ao clicar no botão add cart, chama essa função e adicionar no array cart as propriedades
    cart.push({
        name,
        price,
        quantity: 1,
    })

    updateCartModal();
}

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;


    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div> 

                <button class="close-btn" data-name="${item.name}">Remover</button>

        </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    cartCounter.innerHTML = cart.length;

}

//função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("close-btn")) {
        const name = event.target.getAttribute("data-name")
        removeItemsCart(name);
    }
})

function removeItemsCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        const item = cart[index];
        if (item.quantity > 1) {
            item.quantity -= 1; // Diminui a quantidade
            updateCartModal(); // Atualiza o carrinho na tela
            return;
        }

        cart.splice(index, 1); // Remove o item completamente
        updateCartModal(); // Atualiza o carrinho na tela
    }
}

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

})

//Finalizar pedido
checkoutBtn.addEventListener("click", function () {

    const IsOpen = checkRestaurantOpen();
    if (!IsOpen) {
        Toastify({
            text: "Restaurante está fechado",
            duration: 3000,
            destination: "",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
            onClick: function () { } // Callback after click
        }).showToast();
    }

    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //Enviar o pedido para a api do whatsapp
    const cardItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price}`
        )
    }).join("")
    const message = encodeURIComponent(cardItems)
    const phone = "18997583456"
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_black ")

    cart = [];
    addressInput.value = "";
    updateCartModal();

})


function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
    //true = restaurante está aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}
