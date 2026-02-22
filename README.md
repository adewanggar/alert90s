# Alert90s

A "Neo Brutalism 90s" style JavaScript alert library. Completely standalone and dependency-free (CSS is injected automatically).

Heavily inspired by **SweetAlert2**. It supports many of the same API signatures (Promises, Inputs, PreConfirm, Timers, RTL), making it practically a drop-in UI replacement for existing projects that want a brutalist 90s makeover, just using the `Alert90s` object instead!

## Installation

You can install it via npm:

```bash
npm install alert90s
```

Or just include the built file in your project:

```html
<script src="path/to/alert90s.min.js"></script>
```

## Usage

If using a bundler (Webpack, Vite, Rollup):

```javascript
import Alert90s from "alert90s";

// Basic Message
Alert90s.show("Any fool can use a computer");
```

If using via `<script>` tag, the library automatically registered on the global `window` object as `Alert90s` and `Swal`.

## Examples

### 1. Promises & Deny Buttons

```javascript
Alert90s.fire({
  title: "Do you want to save the changes?",
  showDenyButton: true,
  showCancelButton: true,
  confirmButtonText: "Save",
  denyButtonText: `Don't save`,
}).then((result) => {
  if (result.isConfirmed) {
    Alert90s.fire("Saved!", "", "success");
  } else if (result.isDenied) {
    Alert90s.fire("Changes are not saved", "", "info");
  }
});
```

### 2. AJAX Requests & Inputs

```javascript
Alert90s.fire({
  title: "Submit your Github username",
  input: "text",
  inputAttributes: {
    autocapitalize: "off",
  },
  showCancelButton: true,
  confirmButtonText: "Look up",
  showLoaderOnConfirm: true,
  preConfirm: async (login) => {
    try {
      const response = await fetch(`https://api.github.com/users/${login}`);
      if (!response.ok) {
        return Alert90s.showValidationMessage(
          `${JSON.stringify(await response.json())}`,
        );
      }
      return response.json();
    } catch (error) {
      Alert90s.showValidationMessage(`Request failed: ${error}`);
    }
  },
  allowOutsideClick: () => !Alert90s.isLoading(),
}).then((result) => {
  if (result.isConfirmed) {
    Alert90s.fire({ title: `Avatar`, imageUrl: result.value.avatar_url });
  }
});
```

### 3. RTL Support

```javascript
Alert90s.fire({
  title: "هل تريد الاستمرار؟",
  icon: "question",
  iconHtml: "؟",
  confirmButtonText: "نعم",
  cancelButtonText: "لا",
  showCancelButton: true,
  showCloseButton: true,
  dir: "rtl",
});
```

### 4. Custom Animate.css Animations

```javascript
Alert90s.fire({
  title: "Custom animation with Animate.css",
  showClass: { popup: "animate__animated animate__fadeInUp" },
  hideClass: { popup: "animate__animated animate__fadeOutDown" },
});
```

### 5. Toast Notification

```javascript
Alert90s.fire({
  toast: true,
  position: "top-end",
  icon: "success",
  title: "Saved successfully",
  showConfirmButton: false,
  timer: 3000,
});
```

## CSS-only Buttons

Alert90s also ships with a standalone CSS button library. Just add the classes to your own `<button>` or `<a>` elements for an instant neo-brutalist feel!

```html
<!-- Base Button -->
<button class="btn90s">Base Button</button>

<!-- Color Variants -->
<button class="btn90s primary">Primary</button>
<button class="btn90s success">Success</button>
<button class="btn90s warning">Warning</button>
<button class="btn90s danger">Danger</button>
<button class="btn90s dark">Dark</button>

<!-- Sizes -->
<button class="btn90s sm primary">Small</button>
<button class="btn90s lg danger">Large</button>
```

## Tooltips / Popovers

Alert90s includes a lightweight, built-in tooltip library that styles any element with a `data-alert90s-tooltip` attribute.

```html
<!-- Basic (Top default) -->
<button data-alert90s-tooltip="I appear on top!">Hover Me</button>

<!-- Positions (top, bottom, left, right) -->
<button data-alert90s-tooltip="Bottom side!" data-alert90s-position="bottom">
  Hover
</button>

<!-- Colors (yellow, cyan, pink, base, dark) -->
<button data-alert90s-tooltip="Cyan Tooltip" data-alert90s-color="cyan">
  Hover
</button>
```

**Note:** Tooltips initialize automatically on `DOMContentLoaded`. If you load dynamic content later, call `Alert90s.initTooltips()` to initialize them.

## Support

If you find this project useful, you can support its development:

- [Saweria](https://saweria.co/adewanggar)
- [Ko-fi](https://ko-fi.com/adewanggar)

If you'd like to collaborate or just say hi, visit my [Portfolio Website](https://www.dewangga.site/).

## Advanced Options

| Option            | Type     | Default     | Description                                                                                               |
| ----------------- | -------- | ----------- | --------------------------------------------------------------------------------------------------------- |
| background        | String   | ''          | Custom background color for the modal.                                                                    |
| color             | String   | ''          | Custom text color for the modal body.                                                                     |
| titleColor        | String   | ''          | Custom title color.                                                                                       |
| iconColor         | String   | ''          | Custom icon color (including SVG stroke).                                                                 |
| title             | String   | ''          | The title of the alert. Supports HTML.                                                                    |
| text/message      | String   | ''          | The message body of the alert.                                                                            |
| html              | String   | ''          | A custom HTML description for the alert.                                                                  |
| icon              | String   | ''          | Standard icons: `warning`, `error`, `info`, `success`, `question`                                         |
| iconHtml          | String   | ''          | Custom HTML string for the icon.                                                                          |
| footer            | String   | ''          | Custom HTML for the footer section.                                                                       |
| imageUrl          | String   | ''          | URL for an image to display.                                                                              |
| input             | String   | null        | Generate an input: `'text'`, `'password'`, `'textarea'`, `'select'`, `'radio'`, `'checkbox'`, `'toggle'`. |
| inputPlaceholder  | String   | ''          | Placeholder text or label for `checkbox`/`toggle`.                                                        |
| inputValue        | String   | ''          | Initial value or checked state (for boolean inputs).                                                      |
| inputOptions      | Object   | {}          | Object mapping `{value: 'Label'}` for `select`/`radio`.                                                   |
| inputAttributes   | Object   | {}          | Custom HTML attributes for the input element.                                                             |
| dir               | String   | 'auto'      | Text direction. Set `rtl` for Arabic/Hebrew.                                                              |
| position          | String   | 'center'    | `top`, `top-end`, `bottom-start`, etc.                                                                    |
| timer             | Number   | null        | Auto close timer in milliseconds.                                                                         |
| timerProgressBar  | Boolean  | false       | Display progress bar at the bottom.                                                                       |
| toast             | Boolean  | false       | Display the alert as a non-blocking toast notification.                                                   |
| loaderType        | String   | 'hourglass' | Type of loader: `hourglass`, `ascii`, `blinking`, `progress`.                                             |
| draggable         | Boolean  | false       | Allow moving the modal dragging its header.                                                               |
| showDenyButton    | Boolean  | false       | Show the third middle deny button.                                                                        |
| preConfirm        | Function | null        | Async function executed before confirm executes.                                                          |
| allowOutsideClick | Function | null        | Async function executed before confirm executes.                                                          |

## Methods

- `Alert90s.fire(options)` or `Alert90s.show(options)`
- `Alert90s.showLoading()` / `Alert90s.hideLoading()`
- `Alert90s.showValidationMessage(message)` / `Alert90s.resetValidationMessage()`
- `Alert90s.getTimerLeft()`
- `Alert90s.getPopup()`
- `Alert90s.initTooltips()`
- `Alert90s.destroyTooltips()`

## License

MIT

# alert90s
