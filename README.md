# 🚀 Pagination UI `<pagination-component>`

A lightweight, reusable, framework-independent pagination component built using Web Components (Custom Elements + Shadow DOM). Easily integrates into any HTML/JS app with no external dependencies.


![Pagination](https://github.com/user-attachments/assets/9983ec41-326e-4ab1-b879-f11db7d2a59b)

---

## Description

`<pagination-component>` is a lightweight, reusable Web Component that provides navigational pagination controls for paginated data views. It is framework-agnostic and can be used with any frontend stack including plain HTML/JS, React, Vue, Svelte, etc.

This component supports dynamic page ranges, ellipses for skipped blocks, and emits navigation events to allow integration with your data-fetching or UI update logic.

[NPM Link](https://www.npmjs.com/package/pagination-webcomponent)

---

## 📦 Features

* 🔌 Native Web Component (no framework needed)
* 📐 Supports page ranges, previous/next, ellipsis
* 💡 Emits a `page-change` event with all pagination info
* 🎨 Styleable via CSS variables
* ♻️ Reusable across frameworks (React, Vue, Svelte, etc.)
* 🧠 Auto-handles large lists and intelligent rendering

---

## Live Demo

🔗 CodePen: [https://codepen.io/driftblaze/pen/gbaYvpG](https://codepen.io/driftblaze/pen/gbaYvpG)

---

## Installation

### Option 1: NPM Package

```zsh
npm i pagination-webcomponent
```

then import as

```js
import ('pagination-webcomponent')
```

### Option 2: Unpkg

```js
<script type="module" src="https://unpkg.com/pagination-webcomponent"></script>
```

### Option 3: Module Import

```js
import './PaginationComponent.js';
```

### Option 4: HTML Script Tag

```html
<script type="module" src="/path/to/PaginationComponent.js"></script>
```

---

## Usage Example

```html
<pagination-component
  current="0"
  per-page="10"
  total="100"
></pagination-component>

<script>
  const pagination = document.querySelector('pagination-component');
  pagination.addEventListener('page-change', (e) => {
    console.log('New offset:', e.detail.offset);
    // Fetch data using e.detail.offset and e.detail.limit
  });
</script>
```

---

## Attributes

| Attribute  | Type   | Required | Description                               |
| ---------- | ------ | -------- | ----------------------------------------- |
| `current`  | Number | ✅        | The current offset (e.g., 0, 10, 20, ...) |
| `per-page` | Number | ✅        | Number of items per page                  |
| `total`    | Number | ✅        | Total number of items                     |

*All attributes are reflected and can be dynamically updated.*

---

## Events

### `page-change`

Dispatched whenever the user changes the page.

#### Payload

```ts
{
  "offset": Number,      // New offset (e.g., 30)
  "limit": Number,       // Items per page (e.g., 10)
  "total": Number,       // Total items (e.g., 100)
  "totalPages": Number   // Derived total pages (e.g., 10)
}
```

---

## Styling

The component is styled via Shadow DOM and accepts the following CSS custom properties:

| CSS Variable                     | Description                        |
| -------------------------------- | ---------------------------------- |
| `--md-sys-color-background`      | Button background                  |
| `--md-sys-color-on-surface`      | Button text color                  |
| `--md-sys-color-outline`         | Button border color                |
| `--md-sys-color-inverse-primary` | Button hover and active background |
| `--md-sys-color-primary`         | Active page border and text        |

To override them:

```css
pagination-component {
  --md-sys-color-background: white;
  --md-sys-color-primary: #6366f1;
}
```

---

## Accessibility

* Uses native `<button>` elements
* Includes appropriate `disabled` states
* Fully keyboard navigable

---

## License

[MIT License © 2025](LICENSE)

## Maintainer

This component is maintained by [Yash Raj Bharti](https://github.com/yashrajbharti).
