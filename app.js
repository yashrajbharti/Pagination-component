export class PaginationComponent extends HTMLElement {
  static get observedAttributes() {
    return ["offset", "per-page", "total"];
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

  get offset() {
    return parseInt(this.getAttribute("offset")) || 0;
  }

  set offset(val) {
    this.setAttribute("offset", val);
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

    const maxOffset = (this.totalPages - 1) * perPage;
    const clampedOffset = Math.max(0, Math.min(this.offset, maxOffset));

    if (clampedOffset !== this.offset) {
      this.offset = clampedOffset;
      return;
    }

    const currentPage = Math.floor(this.offset / perPage) + 1;
    const totalPages = this.totalPages;

    const container = this.shadowRoot.querySelector("#pagination");
    container.innerHTML = "";

    const pages = new Set();
    pages.add(1);
    pages.add(totalPages);

    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < totalPages) {
        pages.add(i);
      }
    }

    const sortedPages = Array.from(pages).sort((a, b) => a - b);

    const appendButton = function (label, callback, disabled, title, isActive) {
      const btn = document.createElement("button");
      btn.textContent = label.toString();
      btn.title = title || `Navigate to ${label} page`;

      if (disabled) {
        btn.disabled = true;
      } else if (typeof callback === "function") {
        btn.addEventListener("click", () => {
          callback();
          this.dispatchEvent(
            new CustomEvent("page-change", {
              detail: {
                page: Math.floor(this.offset / this.perPage) + 1,
                offset: this.offset,
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
    }.bind(this);

    // Prev
    appendButton(
      "‹",
      () => {
        this.offset = Math.max(this.offset - perPage, 0);
      },
      currentPage === 1,
      "Previous",
      false
    );

    // Page numbers + ellipsis
    let lastRendered = 0;
    sortedPages.forEach((page) => {
      if (lastRendered && page - lastRendered > 1) {
        appendButton("...", null, true);
      }

      appendButton(
        page,
        () => {
          this.offset = (page - 1) * perPage;
        },
        false,
        `Page ${page}`,
        page === currentPage
      );

      lastRendered = page;
    });

    // Next
    appendButton(
      "›",
      () => {
        const nextOffset = this.offset + perPage;
        this.offset = nextOffset >= total ? this.offset : nextOffset;
      },
      currentPage === totalPages,
      "Next",
      false
    );
  }
}

customElements.define("pagination-component", PaginationComponent);
