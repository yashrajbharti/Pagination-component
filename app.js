export class PaginationComponent extends HTMLElement {
  static get observedAttributes() {
    return ["current", "per-page", "total"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        div {
          text-align: center;
          margin-block-start: 40px;
          margin-block-end: 50px;
        }
        button {
          padding: 10px 15px;
          margin: 5px 5px;
          border: none;
          background: var(--md-sys-color-background);
          color: var(--md-sys-color-on-surface);
          cursor: pointer;
          border: 2px solid var(--md-sys-color-outline);
          border-radius: 12px;
          font-size: 14px;
        }
        button:hover:not(:disabled) {
          background: var(--md-sys-color-inverse-primary);
        }
        button:disabled {
          cursor: default;
          opacity: 0.3;
        }
        button.active {
          background: var(--md-sys-color-inverse-primary);
          border-color: var(--md-sys-color-primary);
          font-weight: bold;
        }
      </style>
      <div id="pagination"></div>
    `;
  }

  attributeChangedCallback() {
    this.render();
  }

  get current() {
    return parseInt(this.getAttribute("current")) || 0;
  }

  set current(val) {
    this.setAttribute("current", val);
  }

  get perPage() {
    return parseInt(this.getAttribute("per-page")) || 10;
  }

  get total() {
    return parseInt(this.getAttribute("total")) || 0;
  }

  get totalPages() {
    return Math.ceil(this.total / this.perPage);
  }

  render() {
    const perPage = this.perPage;
    const total = this.total;

    if (perPage <= 0 || total <= 0) return;

    const currentPage = Math.floor(this.current / perPage) + 1;
    const totalPages = this.totalPages;
    const container = this.shadowRoot.querySelector("#pagination");
    container.innerHTML = "";

    let lastWasEllipsis = false;

    const appendButton = (
      label,
      callback = null,
      disabled = false,
      title = label,
      isActive = false
    ) => {
      if (label === "..." && lastWasEllipsis) return;
      const btn = document.createElement("button");
      btn.textContent = label;
      if (title) btn.title = `Navigate to ${title} page`;
      if (disabled) {
        btn.disabled = true;
      } else if (callback) {
        btn.addEventListener("click", () => {
          callback();
          this.dispatchEvent(
            new CustomEvent("page-change", {
              detail: {
                offset: this.current,
                limit: this.perPage,
                total: this.total,
                totalPages: this.totalPages,
              },
              bubbles: true,
              composed: true,
            })
          );
        });
      }
      if (isActive) btn.classList.add("active");
      container.appendChild(btn);
      lastWasEllipsis = label === "...";
    };

    // Prev
    appendButton(
      "‹",
      () => {
        this.current = Math.max(this.current - perPage, 0);
      },
      currentPage === 1,
      "previous"
    );

    // First + ellipsis
    if (currentPage > 2) {
      appendButton("1", () => (this.current = 0));
      if (currentPage > 3) appendButton("...");
    }

    // Middle neighbors
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i >= 1 && i <= totalPages) {
        appendButton(
          i.toString(),
          () => (this.current = (i - 1) * perPage),
          false,
          `Page ${i}`,
          i === currentPage
        );
      }
    }

    // Ellipsis + end
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) appendButton("...");
      appendButton(
        totalPages.toString(),
        () => (this.current = (totalPages - 1) * perPage)
      );
    }

    // Next
    appendButton(
      "›",
      () => {
        const next = this.current + perPage;
        this.current = next >= total ? this.current : next;
      },
      currentPage === totalPages,
      "next"
    );
  }
}

customElements.define("pagination-component", PaginationComponent);
