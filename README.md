# Hilited
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/rpbouman/hilited)

A browser-based code editor with syntax highlighting built on the **CSS Custom Highlight API**.
[Checkout the live demo](https://rpbouman.github.io/hilited/demo/) here: https://rpbouman.github.io/hilited/demo/

---

## The Concept

Most browser-based syntax highlighters work by wrapping tokens in `<span>` elements and applying styles to those. Hilited takes a different approach: the editor stores code as plain text nodes inside a `<code>` element, and syntax colors are applied at the rendering layer using the browser's [CSS Custom Highlight API](https://developer.mozilla.org/en-US/docs/Web/API/Highlight).

With this API, JavaScript registers named `Highlight` objects — each containing a set of `StaticRange` objects — into the browser's `CSS.highlights` registry. CSS then targets those names with `::highlight()` pseudo-elements to apply visual styling, without modifying the DOM. Tokenization (identifying *what* a range is) is therefore decoupled from styling (deciding *how* it looks).

---

## How Highlighting Works

### Tokenization via Regular Expression

Hilited uses a single composite regular expression as its tokenizer. When you configure the editor for a language, you supply one `RegExp` that describes every token type. The engine runs this regex against the full text content in a single pass, collecting all matches and their positions.

Each token type is defined as a [named capturing group](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Named_capturing_group) within the regex. For example:

```js
const regexp = /(?<keyword>SELECT|FROM|WHERE)|(?<string>'[^']*')|(?<number>\d+(\.\d+)?)|(?<whitespace>\s+)|(?<__other__>.)/gsi;
```

When the regex matches, the engine inspects `match.groups` to find which named group captured the text. That group name becomes the token category.

> **Important:** Every character in the input must be consumed by some group. Including a `(?<whitespace>\s+)` group and a catch-all `(?<__other__>.)` ensures the character-offset accounting stays correct. The `__other__` group is also conventionally used to flag unrecognized input.

### From Tokens to Highlights

Each token is represented as a `{ start, end, category }` triple. Hilited maps these back to the `TextNode` objects in the DOM, creates a `StaticRange` for each one, and registers the ranges under a namespaced key in `CSS.highlights`:

```
hilited-{highlighterPrefix}-{tokenName}
```

For example, a `keyword` token in a DuckDB SQL configuration with `highlighterPrefix: "duckdb"` gets registered as `hilited-duckdb-keyword`. The corresponding CSS rule then targets that name via `::highlight(hilited-duckdb-keyword)`.

Hilited only processes tokens visible in the current viewport, and debounces re-highlighting during resize events.

---

## Writing a Highlight Stylesheet

Once tokens are registered in `CSS.highlights`, you style them with the [`::highlight()` pseudo-element](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::highlight):

```css
::highlight(hilited-duckdb-keyword) {
  color: #0066cc;
}

::highlight(hilited-duckdb-string) {
  color: #c0392b;
}

::highlight(hilited-duckdb-number) {
  color: #e67e22;
}

::highlight(hilited-duckdb-multiLineComment),
::highlight(hilited-duckdb-singleLineComment) {
  color: #7f8c8d;
}

::highlight(hilited-duckdb-__other__) {
  text-decoration: spelling-error;
}
```

### Limitations of `::highlight()`

The CSS Custom Highlight API permits only a subset of CSS properties inside `::highlight()`. Properties that affect layout — including `font-weight`, `font-size`, `margin`, and `padding` — are not supported. Permitted properties are limited to those that affect text rendering: `color`, `background-color`, `text-decoration`, `text-shadow`, and `caret-color`, among others.

### Simulating Bold with `text-shadow`

Because `font-weight` is not available inside `::highlight()`, a common workaround is to simulate a heavier appearance using `text-shadow` with sub-pixel offsets:

```css
::highlight(hilited-duckdb-keyword) {
  color: #0066cc;
  text-shadow:
     0.25px  0      0 currentColor,
    -0.25px  0      0 currentColor,
     0       0.25px 0 currentColor,
     0      -0.25px 0 currentColor;
}
```

This casts a faint copy of each glyph a quarter-pixel in each cardinal direction, producing a thicker appearance. It is a workaround with visible limits — it does not produce the same result as a true bold font variant — but it is currently the only option within `::highlight()`.

---

## Building Regular Expressions with RegXpChef

Writing a composite tokenizer regex by hand for a full language grammar can get unwieldy. [RegXpChef](https://github.com/rpbouman/RegXpChef) is a companion tool that helps with this:

- Define each token type as a named, individually-tested pattern.
- Compose them into a single alternation (`|`) in the correct priority order.
- Preview matches interactively against sample input.
- Export the final combined regex ready to use in a Hilited language configuration.

Because Hilited uses the named capture group names from the regex directly as CSS highlight names, keeping your RegXpChef group names consistent with your stylesheet selectors means no intermediate mapping is needed.

---

## Adding a Language

1. **Create the regex** (optionally using RegXpChef). Make sure every character is covered by a named group, and use the `g` and `s` flags.
2. **Choose a `highlighterPrefix`**, e.g. `"hilited-mylang"`.
3. **Write a CSS file** with `::highlight(hilited-mylang-{groupname})` rules for each token category.
4. **Register the configuration** in your samples/language registry:

```js
{
  label: "My Language",
  extensions: "mylang",
  highlighterPrefix: "hilited-mylang",
  styles: "mylang.css",
  regexp: /(?<keyword>if|else|return)|(?<string>"[^"]*")|(?<whitespace>\s+)|(?<__other__>.)/gsi,
  code: `// sample code here`
}
```

5. **Load the CSS** alongside the editor, and instantiate `Hilited` with the matching prefix.

---

## Browser Support

Requires a browser that supports the CSS Custom Highlight API. Check current support at [caniuse.com](https://caniuse.com/mdn-api_highlight).
