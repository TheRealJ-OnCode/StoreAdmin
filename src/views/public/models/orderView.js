import OrderModel from "./class/OrderClass";
import { getElement, getAllElement, createElement } from "./helpers/DOM.utils";

export class orderView {
    constructor() {
        this.init();
    }

    init = () => {
        this.socketConfig();
        this.orderContainerClicked();
        this.handleContinueButton();
        this.handleOrderStatus();
        this.handleOrderStatusChanged();
        this.setupSearchInput();
    };


    debounce = (func, delay) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    setupSearchInput = () => {
        const searchInput = getElement("#search-order");
        searchInput.addEventListener("input", this.debounce((event) => {
            const query = event.target.value.trim();
            if (query) {
                OrderModel.searchOrders(query)
                    .then((orders) => {
                        this.renderOrders(orders);
                    })
                    .catch((error) => {
                        console.error("Arama sırasında hata oluştu:", error);
                    });
            } else {
                this.renderOrders([]);
            }
        }, 300));
    };

    renderOrders = (orders) => {
        const orderContainer = getElement(".orders");
        orderContainer.innerHTML = ""; // Mevcut siparişleri temizle
        if (orders.length === 0) {
            orderContainer.innerHTML = "<p>Hiç sipariş bulunamadı.</p>";
            return;
        }
        orders.forEach((order) => {
            const orderElement = document.createElement("div");
            orderElement.className = `order ${order.status}`;
            orderElement.innerHTML = `
                <div class="order-wrapper">
                    <div class="order-general-details">
                        <div class="order-id">${order.orderCode}</div>
                        <div class="order-totalAmount">${order.totalAmount} azn</div>
                    </div>
                    <div class="order-other-details">
                        <div id="show-details">
                            ${this.getOrderStatusMessage(order.status)}
                            <i class="fa-solid fa-chevron-down"></i>
                            <div class="button-wrapper" data-type-orderID="${order.orderCode}">
                                <button class="confirm-order">Tesdiqle</button>
                                <button class="reject-order">Legv et</button>
                            </div>
                        </div>
                    </div>
                </div>
                    <div class="order-full-details">
                        <div class="customer-fullname">
                            ${order.customerInfo.name || ""} ${order.customerInfo.surname || ""}
                        </div>
                        <div class="customer-phone">${order.customerInfo.phone || "Telefon qeyd edilməyib"}</div>
                        <div class="customer-basket">
                            ${this.renderBasketItems(order.items)}
                        </div>
                    </div>
                
            `;
            orderContainer.appendChild(orderElement);
        });
        this.orderContainerClicked();
        this.handleOrderStatus();
        this.handleOrderStatusChanged()
    };

    getOrderStatusMessage = (status) => {
        switch (status) {
            case "Rejected":
                return "Ləğv edildi";
            case "Confirmed":
                return "Qəbul edildi";
            case "Pending":
                return "Sifariş Statusu Təsdiqlənməyib";
            default:
                return "Statusu naməlumdur";
        }
    };

    renderBasketItems = (items) => {
        return items
            .map((item) => {
                const alternativeDetails = item?.alternativeDetails
                    ? `Seçim: ${item.alternativeDetails.value}`
                    : "";
                return `
                    <div class="basket-item">
                        <div class="basket-img">
                            <a href="/product/view?pid=${item.productId}&product_name=${encodeURIComponent(item.name)}" target="_blank">
                                <img src="${item.img}" alt="${item.name}" />
                            </a>
                        </div>
                        <div class="basket-product-details">
                            <div class="name">${item.name}</div>
                            <div class="key">${alternativeDetails}</div>
                            <div class="count">Sayi: ${item.quantity}</div>
                            <div class="price">Qiymeti: ${item.price} azn</div>
                            <div class="total">Toplam: ${item.total} azn</div>
                        </div>
                    </div>
                `;
            })
            .join("");
    };




    handleContinueButton = () => {
        const button = getElement("button#continue");
        const modal = getElement("#event-modal");
        button.addEventListener("click", () => {
            modal.style.display = "none";
        })
    }
    handleOrderStatus = () => {
        const buttons = getAllElement("#show-details");
        buttons.forEach(btn => {
            btn.addEventListener("click", e => {
                if (
                    e.target.classList.contains("reject-order") ||
                    e.target.classList.contains("confirm-order")
                ) return false;
                btn.querySelector(".button-wrapper").classList.toggle("active")
            })
        })
    }

    placeConfirmModal = (status, orderCode, callback) => {
        const changeStatusModal = getElement("#change-status-modal");
        const changeStatusLayout = getElement("#change-status-layout");
        if (getElement("#cr-button-wrapper")) {
            getElement("#cr-button-wrapper").remove()
        }
        let message = `${orderCode} 'lu sifarişi ${status} etmək istərisiniz mi ?`;
        changeStatusModal.style.display = "flex";
        const buttonWrapper = createElement("div", "cr-button-wrapper")
        const okButton = createElement("button", "confirm-btn");
        okButton.textContent = "ok"

        const rejectButton = createElement("button", "reject-btn");
        rejectButton.textContent = "ləğv et"
        okButton.addEventListener("click", () => {
            callback(true)
        });
        rejectButton.addEventListener("click", () => {
            callback(false)
        })
        getElement("#status-text").textContent = message;
        buttonWrapper.append(okButton, rejectButton);
        changeStatusLayout.append(buttonWrapper);

    }
    closeConfirmModal = () => {
        const changeStatusModal = getElement("#change-status-modal");

        changeStatusModal.style.display = "none";
    }

    confirmUserOder = (orderCode) => {
        fetch("/change-order-status", {
            method: "POST",
            body: JSON.stringify({
                orderCode,
                status: "Confirmed"
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    window.location.reload();
                } else {
                    Swal.fire({
                        title: "Xəta baş verdi",
                        icon: "warning",
                        cancelButtonText: "Ok",
                        showCloseButton: true
                    });
                }
            })
            .catch(err => console.log(err))
    }
    rejectUserOrder = (orderCode) => {
        fetch("/change-order-status", {
            method: "POST",
            body: JSON.stringify({
                orderCode,
                status: "Rejected"
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    window.location.reload();
                } else {
                    Swal.fire({
                        title: "Xəta baş verdi",
                        icon: "warning",
                        cancelButtonText: "Ok",
                        showCloseButton: true
                    });
                }
            })

            .catch(err => console.log(err))

    }


    handleOrderStatusChanged = () => {

        const [confirmOrderBtn, rejectOrderBtn] = [getAllElement("button.confirm-order"), getAllElement("button.reject-order")];
        confirmOrderBtn.forEach(confirmBtn => {
            const orderCode = confirmBtn.parentNode.getAttribute("data-type-orderId")
            confirmBtn.addEventListener("click", e => {
                this.placeConfirmModal("qəbul", orderCode, (confirmed) => {
                    if (!confirmed) {
                        return this.closeConfirmModal()
                    }
                    this.confirmUserOder(orderCode)
                })
            })

        })
        rejectOrderBtn.forEach(rejectBtn => {
            const orderCode = rejectBtn.parentNode.getAttribute("data-type-orderId")
            rejectBtn.addEventListener("click", e => {
                this.placeConfirmModal("ləğv", orderCode, (confirmed) => {
                    if (!confirmed) {
                        return this.closeConfirmModal();
                    }
                    this.rejectUserOrder(orderCode)
                })
            })


        })
    }


    orderContainerClicked = () => {
        const orders = getAllElement(".order");
        orders.forEach(order => {
            order.addEventListener("click", e => {
                if (
                    e.target.id === "show-details" ||
                    e.target.classList.contains("reject-order") ||
                    e.target.classList.contains("confirm-order")
                ) return false;

                order.querySelector(".order-full-details").classList.toggle("active");
            });
        });
        document.body.addEventListener("click", this.prepareAudio, { once: true });
    }


    prepareAudio = () => {
        this.notificationSound = new Audio('/sounds/notification.wav');
    };

    socketConfig = () => {
        const socket = io();

        socket.on('new_order', (message) => {

            const notificationElement = getElement("#notifications");
            const newNotification = createElement("li");
            newNotification.textContent = message;
            notificationElement.appendChild(newNotification);

            if (this.notificationSound) {
                this.notificationSound.play().catch(error => console.warn("Ses çalma başarısız oldu:", error));
            }
            fetch("/refresh-orders")
                .then(res => res.json())
                .then(res => {
                    const ordersContainer = getElement(".orders");
                    ordersContainer.innerHTML = '';

                    res.data.forEach(order => {
                        const orderHtml = `
                <div class="order">
                    <div class="order-wrapper">
                        <div class="order-general-details">
                            <div class="order-id">${order.orderCode}</div>
                            <div class="order-totalAmount">${order.totalAmount} azn</div>
                        </div>
                        <div class="order-other-details">
                            <button id="show-details">${order.status} 
                                <i class="fa-solid fa-chevron-down"></i>
                            </button>
                        </div>
                    </div>
                    <div class="order-full-details">
                        <div class="customer-fullname">${order.customerInfo.name} ${order.customerInfo.surname}</div>
                        <div class="customer-phone">${order.customerInfo.phone}</div>
                        <div class="customer-basket">
                            ${order.items.map(item => `
                                <div class="basket-item">
                                    <div class="basket-img">
                                        <a href="/product/view?pid=${item?.productId}&product_name=${item?.name}" target="_blank">
                                            <img src="${item?.img}" alt="${item?.name}">
                                        </a>
                                    </div>
                                    <div class="basket-product-details">
                                        <div class="name">${item?.name}</div>
                                        <div class="count">Sayi: ${item?.quantity}</div>
                                        <div class="price">Qiymeti: ${item?.price} azn</div>
                                        <div class="total">Toplam: ${item?.total} azn</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                </div>
            `;

                        ordersContainer.insertAdjacentHTML("beforeend", orderHtml);
                    });
                    this.orderContainerClicked();

                })

                .catch(err => console.log(err));

        });
    };
}
