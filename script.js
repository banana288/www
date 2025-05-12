document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close-button');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const popupMessage = document.getElementById('popup-message');
    let cart = [];

    // Function to update the cart display
    function updateCartDisplay() {
        cartItemsList.innerHTML = ''; // Clear the cart display
        let total = 0;

        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${item.name}</span>
                <span>${item.price} рублей</span>
                <button class="remove-from-cart" data-name="${item.name}">Удалить</button>
            `;
            cartItemsList.appendChild(listItem);
            total += item.price;
        });

        cartTotalElement.textContent = total;
        attachRemoveListeners(); // Attach event listeners to remove buttons
    }

    // Function to attach event listeners to remove buttons
    function attachRemoveListeners() {
        const removeButtons = document.querySelectorAll('.remove-from-cart');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.dataset.name;
                cart = cart.filter(item => item.name !== itemName); // Remove the item from the cart
                updateCartDisplay(); // Update the display
            });
        });
    }

    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceCard = this.closest('.service-card');
            const serviceName = serviceCard.dataset.name;
            const servicePrice = parseInt(serviceCard.dataset.price);

            // Check if the service is already in the cart
            const existingItem = cart.find(item => item.name === serviceName);

            if (existingItem) {
                alert('Эта услуга уже добавлена в корзину.');
                return;
            }

            // Add the service to the cart
            cart.push({ name: serviceName, price: servicePrice });
            updateCartDisplay();
        });
    });

    // Open the cart modal
    cartButton.addEventListener('click', function() {
        cartModal.style.display = 'block';
        updateCartDisplay();
    });

    // Close the cart modal
    closeButton.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });

    // Close the modal if the user clicks outside of it
    window.addEventListener('click', function(event) {
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Checkout functionality
    checkoutButton.addEventListener('click', function() {
      cart = [];
      updateCartDisplay();
      cartModal.style.display = 'none';
      popupMessage.style.display = 'block';
      setTimeout(function() {
        popupMessage.style.display = 'none';
      }, 3000);

    });


});
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('appointment-form');
    const fioInput = document.getElementById('fio');
    const emailInput = document.getElementById('email');
    const fioError = document.getElementById('fio-error');
    const emailError = document.getElementById('email-error');

    form.addEventListener('submit', function(event) {
        let isValid = true;

        // Validate FIO (first letter of each word must be capitalized)
        const fioValue = fioInput.value.trim();
        if (fioValue === "") {
            fioError.textContent = "Пожалуйста, введите ФИО.";
            isValid = false;
        } else {
            const words = fioValue.split(' ');
            let isCapitalized = true;
            for (let i = 0; i < words.length; i++) {
                if (words[i].length > 0 && words[i][0] !== words[i][0].toUpperCase()) {
                    isCapitalized = false;
                    break;
                }
            }
            if (!isCapitalized) {
                fioError.textContent = "ФИО должно начинаться с заглавной буквы.";
                isValid = false;
            } else {
                fioError.textContent = "";
            }
        }

        // Validate email (must contain "@")
        const emailValue = emailInput.value.trim();
        if (emailValue === "") {
            emailError.textContent = "Пожалуйста, введите адрес электронной почты.";
            isValid = false;
        } else if (!emailValue.includes('@')) {
            emailError.textContent = "Адрес электронной почты должен содержать символ '@'.";
            isValid = false;
        } else {
            emailError.textContent = "";
        }

        if (!isValid) {
            event.preventDefault(); // Prevent form submission if there are errors
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const visitorCountElement = document.getElementById('visitor-count');
    let visitorCount = localStorage.getItem('visitorCount');

    if (visitorCount === null) {
        // Первый визит
        visitorCount = 1;
    } else {
        // Не первый визит
        visitorCount = parseInt(visitorCount) + 1;
    }

    localStorage.setItem('visitorCount', visitorCount);
    visitorCountElement.textContent = visitorCount;
});
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedbackForm');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращаем стандартную отправку формы

        // Получаем данные из формы
        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;
        const photo = document.getElementById('photo').files[0]; // Получаем файл

        // ** Здесь будет логика отправки данных на сервер.  Замените этот код на вашу логику! **
        // Например, отправка данных с помощью fetch API:
        const formData = new FormData();
        formData.append('name', name);
        formData.append('message', message);
        if (photo) {
            formData.append('photo', photo);
        }


        fetch('/submit-feedback', { // Замените '/submit-feedback' на ваш URL обработчика
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // Если отправка успешна, показываем сообщение об успехе
                successMessage.style.display = 'block';
                // Очищаем форму (необязательно)
                form.reset();
            } else {
                // Обработка ошибок отправки
                alert('Произошла ошибка при отправке отзыва.');
                console.error('Ошибка при отправке:', response.status, response.statusText);
            }
        })
        .catch(error => {
            // Обработка ошибок сети или других ошибок
            alert('Произошла ошибка при отправке отзыва.');
            console.error('Ошибка:', error);
        });



        //  **  Закомментированный  пример с  `alert`  для простого тестирования (удалите, когда реализуете отправку на сервер): **
        // alert('Отзыв отправлен!\nИмя: ' + name + '\nСообщение: ' + message + (photo ? '\nФото: ' + photo.name : ''));
        // successMessage.style.display = 'block';
        // form.reset(); // Очистка формы
    });
});
