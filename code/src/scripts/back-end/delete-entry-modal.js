import axios from "axios";

import { delegateEventHandler } from "#fe/utils";

const modal = document.querySelector("[data-modal]");
const tplId = "delete-entry";
const modalTemplate = document.querySelector(`[data-tpl-id='${tplId}']`);
const modalTemplateContent = document.importNode(modalTemplate.content, true);

const displayDeleteItemModal = (e) => {
    while (modal.firstChild) {
        modal.removeChild(modal.firstChild);
    }
    modal.dataset.modal = tplId;
    modal.append(modalTemplateContent.cloneNode(true));
    modal.showModal();

    modal.querySelector("[data-delete-item]").dataset.deleteItem = e.currentTarget.dataset.deleteUrl;
    modal.querySelector("[data-modal-item-name]").textContent = e.currentTarget.dataset.deleteName;
};

delegateEventHandler(modal, "click", "[data-delete-item]", async (e) => {
    if (!modal.open || e.currentTarget.dataset.modal !== tplId) {
        return;
    }

    modal.setAttribute("inert", "");

    const errorMessageModal = modal.querySelector("[data-error-modal]");

    await axios
        .delete(e.target.dataset.deleteItem)
        .then(() => {
            window.location.reload();
        })
        .catch((error) => {
            errorMessageModal.textContent = error.response?.data?.error || "Erreur";
            errorMessageModal.classList.remove("hidden");
            modal.removeAttribute("inert");
        });
});

document.querySelectorAll('[data-modal-id="delete-entry"]').forEach((item) => {
    item.addEventListener("click", displayDeleteItemModal);
});
