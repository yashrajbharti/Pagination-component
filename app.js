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
      background: var(--pagination-background);
      color: var(--pagination-text);
      cursor: pointer;
      border: 2px solid var(--pagination-border);
      border-radius: 12px;
      font-size: 14px;
    }
    button:hover:not(:disabled) {
      background: var(--pagination-hover);
    }
    button:disabled {
      cursor: default;
      opacity: 0.3;
    }
    button.active {
      background: var(--pagination-hover);
      border-color: var(--pagination-active-border);
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
    const parsed = parseInt(val) || 0;
    const maxOffset = Math.max((this.totalPages - 1) * this.perPage, 0);
    const clamped = Math.max(0, Math.min(parsed, maxOffset));
    this.setAttribute("offset", clamped);
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
  getPaginationItems(currentPage, totalPages) {
    let maxButtons = 5; // fixed visible items (first + last + up to 5 middle)
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const firstPage = 1;
    const lastPage = totalPages;

    const pages = [firstPage];
    const remainingSlots = maxButtons - 2; // minus first + last

    let start = currentPage - Math.floor(remainingSlots / 2);
    let end = currentPage + Math.floor(remainingSlots / 2);

    if (start < 2) {
      start = 2;
      end = start + remainingSlots - 1;
    }

    if (end > totalPages - 1) {
      end = totalPages - 1;
      start = end - remainingSlots + 1;
    }

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    pages.push(lastPage);

    return pages;
  }

  render() {
    const perPage = this.perPage;
    const total = this.total;
    if (perPage <= 0 || total <= 0) return;

    const maxOffset = Math.max((this.totalPages - 1) * perPage, 0);
    const clampedOffset = Math.max(0, Math.min(this.offset, maxOffset));
    if (clampedOffset !== this.offset) {
      this.offset = clampedOffset;
      return;
    }

    const currentPage = Math.floor(this.offset / perPage) + 1;
    const totalPages = this.totalPages;
    const container = this.shadowRoot.querySelector("#pagination");
    container.innerHTML = "";

    const appendButton = function (label, callback, disabled, title, isActive) {
      const btn = document.createElement("button");
      btn.textContent = label.toString();
      btn.title = title || `Go to page ${label}`;

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

    // Prev button
    appendButton(
      "‹",
      () => {
        this.offset = Math.max(this.offset - perPage, 0);
      },
      currentPage === 1,
      "Previous"
    );

    // Core pagination items
    const maxPageButtons = 5;
    const items = this.getPaginationItems(
      currentPage,
      totalPages,
      maxPageButtons
    );
    items.forEach((p) => {
      if (p === "...") {
        appendButton("...", null, true);
      } else {
        appendButton(
          p,
          () => {
            this.offset = (p - 1) * perPage;
          },
          false,
          `Page ${p}`,
          p === currentPage
        );
      }
    });

    // Next button
    appendButton(
      "›",
      () => {
        const next = this.offset + perPage;
        this.offset = next >= total ? this.offset : next;
      },
      currentPage === totalPages,
      "Next"
    );
  }
}

customElements.define("pagination-component", PaginationComponent);
