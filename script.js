document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
            e.preventDefault();
            document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const productCards = document.querySelectorAll(".product-card");

    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:none;justify-content:center;align-items:center;z-index:9999;cursor:pointer;";

    const lightboxImg = document.createElement("img");
    lightboxImg.style.maxWidth = "80%";
    lightboxImg.style.maxHeight = "80%";
    lightboxImg.style.borderRadius = "10px";
    lightboxImg.style.boxShadow = "0 0 20px #bc13fe";

    lightbox.appendChild(lightboxImg);
    document.body.appendChild(lightbox);

    lightbox.addEventListener("click", () => {
        lightbox.style.display = "none";
    });

    productCards.forEach(card => {
        const img = card.querySelector("img");
        if (img) {
            img.style.cursor = "pointer";
            img.addEventListener("click", () => {
                lightboxImg.src = img.src;
                lightbox.style.display = "flex";
            });
        }
    });
});

function getCart() {
    return JSON.parse(localStorage.getItem("viwewaveCart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("viwewaveCart", JSON.stringify(cart));
}

function updateCartUI() {
    const cart = getCart();

    const cartItemsList = document.getElementById("cartItemsList");
    const emptyMessage = document.querySelector(".empty-cart");
    const subtotalEl = document.getElementById("cartSubtotal");
    const totalEl = document.getElementById("cartTotal");
    const checkoutBtn = document.querySelector(".checkout-button");

    let total = 0;

    if (!cartItemsList) return;

    cartItemsList.innerHTML = "";

    if (cart.length === 0) {
        if (emptyMessage) emptyMessage.style.display = "block";
        if (checkoutBtn) {
            checkoutBtn.style.pointerEvents = "none";
            checkoutBtn.style.opacity = "0.4";
        }
    } else {
        if (emptyMessage) emptyMessage.style.display = "none";
        if (checkoutBtn) {
            checkoutBtn.style.pointerEvents = "auto";
            checkoutBtn.style.opacity = "1";
        }

        cart.forEach((item, index) => {
            total += item.price * item.qty;

            const itemRow = document.createElement("div");
            itemRow.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 12px; margin-bottom: 10px; background: var(--surface-soft); border: 1px solid var(--border); border-radius: 8px;";
            itemRow.innerHTML = `
                <div>
                    <span style="font-weight: bold; color: var(--text);">${item.name}</span>
                    <span style="color: var(--soft-text); margin-left: 10px;">x${item.qty}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="color: var(--accent); font-weight: bold;">R${item.price * item.qty}</span>
                    <button class="remove-item-btn" data-index="${index}" style="min-height: 28px; padding: 2px 8px; background: transparent; color: var(--accent); border-color: var(--accent); font-size: 0.8rem; cursor: pointer;">Remove</button>
                </div>
            `;
            cartItemsList.appendChild(itemRow);
        });
    }

    if (subtotalEl) subtotalEl.innerHTML = `Subtotal: R${total}`;
    if (totalEl) totalEl.innerHTML = `Total: R${total}`;

    document.querySelectorAll(".remove-item-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = e.target.dataset.index;
            let currentCart = getCart();
            currentCart.splice(idx, 1);
            saveCart(currentCart);
            updateCartUI();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".add-to-cart");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const name = button.dataset.name;
            const price = Number(button.dataset.price);
            if (!name || !price) return;

            let cart = getCart();
            const existing = cart.find(i => i.name === name);

            if (existing) existing.qty += 1;
            else cart.push({ name, price, qty: 1 });

            saveCart(cart);

            button.textContent = "Added ✔";
            button.style.background = "#9d00ff";

            setTimeout(() => {
                button.textContent = "Add to Cart";
                button.style.background = "#bc13fe";
            }, 1000);

            alert(`${name} added to cart 🛒`);
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const checkoutForm = document.querySelector("#checkout form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Order placed successfully! 📦 Thank you for shopping with ViweWave!");
            localStorage.removeItem("viwewaveCart");
            window.location.href = "index.html"; 
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const enquiryForm = document.getElementById("enquiryForm");

    if (enquiryForm) {
        enquiryForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const fullName = document.getElementById("fullName").value.trim();
            const email = document.getElementById("email").value.trim();
            const enquiryType = document.getElementById("enquiryType").value;
            const subject = document.getElementById("subject").value.trim();
            const message = document.getElementById("message").value.trim();

            const nameError = document.getElementById("nameError");
            const emailError = document.getElementById("emailError");
            const typeError = document.getElementById("typeError");
            const subjectError = document.getElementById("subjectError");
            const messageError = document.getElementById("messageError");
            const successMessage = document.getElementById("successMessage");

            nameError.textContent = "";
            emailError.textContent = "";
            typeError.textContent = "";
            subjectError.textContent = "";
            messageError.textContent = "";
            successMessage.textContent = "";

            let isValid = true;

            if (fullName.length < 3) {
                nameError.textContent = "Name must be at least 3 characters long.";
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                emailError.textContent = "Please enter a valid email address.";
                isValid = false;
            }

            if (!enquiryType) {
                typeError.textContent = "Please select an enquiry option.";
                isValid = false;
            }

            if (subject.length < 4) {
                subjectError.textContent = "Subject must be at least 4 characters long.";
                isValid = false;
            }

            if (message.length < 10) {
                messageError.textContent = "Your message must be at least 10 characters long.";
                isValid = false;
            }

            if (isValid) {
                successMessage.style.color = "#0050b3";
                successMessage.textContent = "Processing your enquiry... 💖";

                setTimeout(() => {
                    let customResponse = "";

                    if (enquiryType === "stock") {
                        customResponse = `Thank you, ${fullName}! We've received your request about stock availability. A team member will check our warehouse inventory and email you at ${email} shortly. ✨`;
                    } else if (enquiryType === "sourcing") {
                        customResponse = `Hi ${fullName}! Custom group orders take extra care. We've queued your sourcing details and will reach out regarding costs and order processing within 48 hours. 📦`;
                    } else if (enquiryType === "volunteer") {
                        customResponse = `You are amazing, ${fullName}! 💜 Thanks for wanting to volunteer at our upcoming events. Keep an eye on your inbox (${email}) for orientation steps!`;
                    }

                    successMessage.style.color = "#ff007f";
                    successMessage.textContent = customResponse;
                    enquiryForm.reset();

                }, 1500);
            }
        });
    }
});

window.addEventListener("load", () => {
    updateCartUI();
    console.log("ViweWave JS Loaded ✔");
});

document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("contactName").value.trim();
            const email = document.getElementById("contactEmail").value.trim();
            const message = document.getElementById("contactMessage").value.trim();

            const nameError = document.getElementById("contactNameError");
            const emailError = document.getElementById("contactEmailError");
            const messageError = document.getElementById("contactMessageError");
            const successMessage = document.getElementById("contactSuccessMessage");

            nameError.textContent = "";
            emailError.textContent = "";
            messageError.textContent = "";
            successMessage.textContent = "";

            let isValid = true;

            if (name.length < 3) {
                nameError.textContent = "Name must be at least 3 characters long.";
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                emailError.textContent = "Please enter a valid email address.";
                isValid = false;
            }

            if (message.length < 10) {
                messageError.textContent = "Your message must be at least 10 characters long.";
                isValid = false;
            }

            if (isValid) {
                successMessage.style.color = "#0050b3";
                successMessage.textContent = "Sending your message... 💖";

                setTimeout(() => {
                    successMessage.style.color = "#ff007f";
                    successMessage.textContent = `Thank you, ${name}! Your message has been compiled successfully and sent to our team. We will get back to you at ${email} shortly! 🌟`;
                    contactForm.reset();
                }, 1500);
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("productSearch");
    
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const productCards = document.querySelectorAll(".product-card");

            productCards.forEach(card => {
               
                const productTitle = card.querySelector("h3") || card.querySelector("p");
                const textContent = productTitle ? productTitle.textContent.toLowerCase() : "";

                
                if (textContent.includes(searchTerm)) {
                    card.style.display = ""; 
                } else {
                    card.style.display = "none";
                }
            });
        });
    }
});