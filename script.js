document.addEventListener('DOMContentLoaded', function () {
    const cardNumber = document.getElementById('card-number');
    const expiryDate = document.getElementById('expiry-date');
    const cvv = document.getElementById('cvv');
    const saveCard = document.getElementById('save-card');
    const payButton = document.getElementById('pay-button');
    const paymentSection = document.getElementById('payment-section');
    const thankYouPage = document.getElementById('thank-you-page');
    const cardPaymentForm = document.getElementById('card-payment-form');
    const codPaymentForm = document.getElementById('cod-payment-form');
    const paymentMethodInputs = document.querySelectorAll('input[name="payment-method"]');
    const orderItemsContainer = document.getElementById('order-items');
    const orderSummary = document.getElementById('order-summary');

    // Coupon code elements
    const discountCodeInput = document.getElementById('discount-code');
    const applyButton = document.getElementById('apply-button');
    const couponMessage = document.getElementById('coupon-message');
    const couponDiscount = document.getElementById('coupon-discount');
    const couponAmount = document.getElementById('coupon-amount');

    // JSON data
    const checkoutData = {
        "checkout_id": "c456d2e7-45b3-492a-bdd3-8d8d234a670e",
        "created_at": "2024-08-13T12:34:56Z",
        "customer": {
            "customer_id": "123456",
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "phone": "+1234567890",
            "shipping_address": {
                "address_id": "654321",
                "first_name": "John",
                "last_name": "Doe",
                "company": "Example Corp",
                "address_line1": "123 Main St",
                "address_line2": "Apt 4B",
                "city": "New York",
                "state": "NY",
                "postal_code": "10001",
                "country": "USA"
            },
            "billing_address": {
                "address_id": "654322",
                "first_name": "John",
                "last_name": "Doe",
                "company": "Example Corp",
                "address_line1": "123 Main St",
                "address_line2": "Apt 4B",
                "city": "New York",
                "state": "NY",
                "postal_code": "10001",
                "country": "USA"
            }
        },
        "cart": {
            "items": [
                {
                    "item_id": "prod_001",
                    "product_name": "Wireless Headphones",
                    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0N-LE1lEgGVbdP5y4qp-p0QZEII-5MRyi3g&s",
                    "quantity": 1,
                    "price": 99.99,
                    "discount": {
                        "type": "percentage",
                        "value": 10,
                        "applied_value": 9.999
                    },
                    "tax": {
                        "type": "percentage",
                        "value": 8.875,
                        "applied_value": 8.8781
                    },
                    "total_price": 98.8691
                },
                {
                    "item_id": "prod_002",
                    "product_name": "Bluetooth Speaker",
                    "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkzm330_QXVLpQJnT6jKW3ixSYYI9Vka9t6Q&s",
                    "quantity": 1,
                    "price": 49.99,
                    "discount": {
                        "type": "percentage",
                        "value": 5,
                        "applied_value": 2.4995
                    },
                    "tax": {
                        "type": "percentage",
                        "value": 8.875,
                        "applied_value": 4.212
                    },
                    "total_price": 51.7025
                }
            ],
            "subtotal": 149.99,
            "discounts": 22.4975,
            "shipping": 10.00,
            "tax": 18.347,
            "total": 155.8395
        }
    };

    // Function to update the order summary details
    let finalTotal = 0;
    function updateOrderSummary() {
        let subtotal = 0;
        let totalDiscounts = 0;
        let totalTax = 0;
        let totalShipping = checkoutData.cart.shipping;
        let totalDiscount = 0;

        orderItemsContainer.innerHTML = '';
        checkoutData.cart.items.forEach(item => {
            const itemTotal = item.price * item.quantity - item.discount.applied_value + item.tax.applied_value;
            // subtotal += item.price * item.quantity;
            subtotal += itemTotal;
            totalDiscounts += item.discount.applied_value;
            totalTax += item.tax.applied_value;

            const itemElement = document.createElement('div');
            itemElement.classList.add('flex', 'justify-between', 'items-center');
            itemElement.innerHTML = `
                <div class="flex items-center">
                    <img src="${item.product_image}" alt="${item.product_name}" class="w-14 h-14 rounded">
                    <div class="ml-4">
                        <p>${item.product_name}</p>
                    </div>
                </div>
                <div>
                    <p>$${itemTotal.toFixed(2)}</p>
                    <p class="text-gray-400">Qty: ${item.quantity}</p>
                </div>
            `;
            orderItemsContainer.appendChild(itemElement);
        });

        // Calculate total discount, tax, and final total
        const finalSubtotal = subtotal - totalDiscounts;
        finalTotal = finalSubtotal + totalShipping + totalTax - totalDiscount;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('discounts').textContent = `-$${totalDiscounts.toFixed(2)}`;
        document.getElementById('shipping').textContent = `$${totalShipping.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${totalTax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${finalTotal.toFixed(2)}`;
    }

    // Render order items on page load
    updateOrderSummary();

    // Toggle payment forms based on the selected payment method
    paymentMethodInputs.forEach(input => {
        input.addEventListener('change', function () {
            if (this.value === 'card') {
                cardPaymentForm.classList.remove('hidden');
                codPaymentForm.classList.add('hidden');
            } else {
                cardPaymentForm.classList.add('hidden');
                codPaymentForm.classList.remove('hidden');
            }
        });
    });

    // Function to validate coupon code input
    function validateCouponCodeInput() {
        if (discountCodeInput.value.trim() !== '') {
            applyButton.classList.remove('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
            applyButton.classList.add('bg-blue-500', 'text-white', 'cursor-pointer');
            applyButton.disabled = false;
        } else {
            applyButton.classList.add('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
            applyButton.classList.remove('bg-blue-500', 'text-white', 'cursor-pointer');
            applyButton.disabled = true;
        }
    }

    // Attach event listener to coupon code input for validation
    discountCodeInput.addEventListener('input', validateCouponCodeInput);

    // Function to apply coupon code
    function applyCoupon() {
        const enteredCode = discountCodeInput.value.trim().toLowerCase();
        const couponAmountValue = 5; // Coupon amount

        if (enteredCode === 'marmeto') {
            couponMessage.classList.remove('hidden');
            couponDiscount.classList.remove('hidden');
            couponAmount.textContent = `-$${couponAmountValue.toFixed(2)}`;

            // Apply coupon discount
            // checkoutData.cart.total -= couponAmountValue;
            finalTotal -= couponAmountValue;

            // Update total after coupon
            // document.getElementById('total').textContent = `$${checkoutData.cart.total.toFixed(2)}`;
            document.getElementById('total').textContent = `$${finalTotal.toFixed(2)}`;
        } else {
            alert('Invalid coupon code');
        }
    }

    // Apply button event listener
    applyButton.addEventListener('click', applyCoupon);

    // Session storage logic for saving card details
    function saveCardDetails() {
        if (saveCard.checked) {
            sessionStorage.setItem('cardNumber', cardNumber.value);
            sessionStorage.setItem('expiryDate', expiryDate.value);
            sessionStorage.setItem('cvv', cvv.value);
        }
    }

    // Populate card details from session storage on page load
    function populateCardDetails() {
        const savedCardNumber = sessionStorage.getItem('cardNumber');
        const savedExpiryDate = sessionStorage.getItem('expiryDate');
        const savedCvv = sessionStorage.getItem('cvv');

        if (savedCardNumber) {
            cardNumber.value = savedCardNumber;
        }
        if (savedExpiryDate) {
            expiryDate.value = savedExpiryDate;
        }
        if (savedCvv) {
            cvv.value = savedCvv;
        }
    }

    // Call the populate function on page load
    populateCardDetails();

    // Attach event listener to save card checkbox
    saveCard.addEventListener('change', saveCardDetails);

    // Pay button event listener
    payButton.addEventListener('click', function () {
        paymentSection.classList.add('hidden');
        orderSummary.classList.add('hidden');
        thankYouPage.classList.remove('hidden');
        document.getElementById('thankyou').textContent = `Thank You, ${checkoutData.customer.first_name}!`
        document.getElementById('order-id').textContent = `#${checkoutData.checkout_id}`;
        const shippingAddress = checkoutData.customer.shipping_address;
        document.getElementById('shipping-address').innerHTML = `
            ${shippingAddress.first_name} ${shippingAddress.last_name}<br>
            ${shippingAddress.address_line1}<br>
            ${shippingAddress.address_line2}<br>
            ${shippingAddress.city}<br>
            ${shippingAddress.state} ${shippingAddress.postal_code}<br>
            ${shippingAddress.country}
        `;
        const billingAddress = checkoutData.customer.billing_address;
        document.getElementById('billing-address').innerHTML = `
            ${billingAddress.first_name} ${billingAddress.last_name}<br>
            ${billingAddress.address_line1}<br>
            ${billingAddress.address_line2}<br>
            ${billingAddress.city}<br>
            ${billingAddress.state} ${billingAddress.postal_code}<br>
            ${billingAddress.country}
        `;
    });

});
