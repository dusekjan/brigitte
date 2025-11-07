class Modal {
    static instance = null;

    constructor() {
        if (Modal.instance) return Modal.instance;

        this.popupDiv = null;
        Modal.instance = this;
    }

    static show(templateQuery) {
        if (!Modal.instance) {
            Modal.instance = new Modal();
        }
        Modal.instance._show(templateQuery);
    }

    _show(templateQuery) {
        if (this.popupDiv) return;

        // Clone template content
        const template = document.querySelector(templateQuery);
        const popupDiv = document.createElement("div");
        popupDiv.className = "popup";
        popupDiv.append(template.content.cloneNode(true));

        // Add close handler
        const closeBtn = document.createElement("button");
        closeBtn.classList.add("primary", "btn-close");
        closeBtn.textContent = "Zavřít";
        closeBtn.addEventListener("click", () => this.hide());
        popupDiv.append(closeBtn);

        document.body.append(popupDiv);
        document.body.classList.add("has-popup");
        this.popupDiv = popupDiv;

        if (templateQuery.includes("modal-settings")) {
            this._setupDarkMode();
        }
    }

    hide() {
        if (!this.popupDiv || this.popupDiv.classList.contains("closing")) return;

        this.popupDiv.classList.add("closing");

        this.popupDiv.addEventListener("animationend", () => {
            document.body.classList.remove("has-popup");
            this.popupDiv.remove();
            this.popupDiv = null;
        });
    }

    _setupDarkMode() {
        const dark = this.popupDiv.querySelector(".dark-mode");
        dark.checked = localStorage.getItem("dark-mode") != "1";

        dark.addEventListener("change", () => {
            const checked = !dark.checked ? "1" : "0";
            document.body.classList.toggle("dark", checked == "1");
            localStorage.setItem("dark-mode", checked);

            let themeColor = checked == "1" ? "#121212" : "#ffffff";
            document.querySelector("meta[name='theme-color']").setAttribute("content", themeColor);
        });
    }
}

document.querySelector("#brigitte-1y .btn-settings").addEventListener("click", () => {
    Modal.show("#brigitte-1y .modal-settings");
});

document.querySelector("#brigitte-1y .btn-info").addEventListener("click", () => {
    Modal.show("#brigitte-1y .modal-info");
});

document.querySelector("#brigitte-12y .btn-settings").addEventListener("click", () => {
    Modal.show("#brigitte-12y .modal-settings");
});

document.querySelector("#brigitte-12y .btn-info").addEventListener("click", () => {
    Modal.show("#brigitte-12y .modal-info");
});

window.addEventListener("keydown", (event) => {
    if (event.key == "Escape") {
        Modal.instance && Modal.instance.hide();
    }
});
