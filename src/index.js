import './styles.css';

class Alert90s {
  static getOptions() {
    return this.currentOptions || {};
  }
  static getPopup() {
    return this.currentPopup || null;
  }
  static getTimerLeft() {
    if (!this.timerEnd) return undefined;
    const left = this.timerEnd - Date.now();
    return left > 0 ? left : 0;
  }
  static isLoading() {
    const popup = this.getPopup();
    if (!popup) return false;
    // Check if buttons are hidden and loader is present
    const actions = popup.querySelector('.alert90s-actions');
    const loader = popup.querySelector('.alert90s-loader');
    return (actions && actions.style.display === 'none') || !!loader;
  }
  static showLoading() {
    const popup = this.getPopup();
    if (popup) {
      const actions = popup.querySelector('.alert90s-actions');
      if (actions) actions.style.display = 'none'; // hide buttons
      
      let loader = popup.querySelector('.alert90s-loader');
      if (!loader) {
        loader = document.createElement('div');
        loader.className = 'alert90s-loader';
        
        const type = (Alert90s.currentOptions && Alert90s.currentOptions.loaderType) || 'hourglass';
        if (type === 'ascii') {
          loader.innerHTML = '<div class="alert90s-spinner ascii"></div>';
        } else if (type === 'blinking') {
          loader.innerHTML = '<div class="alert90s-spinner blinking">LOADING<span class="cursor">_</span></div>';
        } else if (type === 'progress') {
          loader.innerHTML = '<div class="alert90s-spinner progress"></div>';
        } else if (type === 'segmented') {
          // Build 10-segment SVG progress bar
          const segs = [];
          for (let i = 1; i <= 10; i++) {
            const x = 5 + (i - 1) * 29;
            segs.push(`<g class="a90s-seg-${i}"><rect class="a90s-fl-${i}" x="${x}" y="6" width="25" height="28" fill="#ff6b35"/><rect x="${x}" y="6" width="25" height="28" fill="url(#a90s-dither)"/><rect x="${x}" y="6" width="25" height="28" fill="none" stroke="#000" stroke-width="2"/></g>`);
          }
          const pctTexts = [];
          for (let i = 0; i <= 10; i++) {
            pctTexts.push(`<text x="295" y="55" class="a90s-txt-${i * 10}" text-anchor="end" font-size="14" font-weight="bold" fill="#000">${i * 10}%</text>`);
          }
          loader.innerHTML = `<div class="alert90s-spinner segmented"><svg viewBox="0 0 300 60" width="300" height="60"><defs><pattern id="a90s-dither" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0,0 h2 v2 h-2 Z M2,2 h2 v2 h-2 Z" fill="#000" opacity="0.3"/></pattern></defs><rect x="0" y="0" width="300" height="40" fill="#fff" stroke="#000" stroke-width="3" rx="0"/>${segs.join('')}${pctTexts.join('')}</svg></div>`;
        } else {
          loader.innerHTML = '<div class="alert90s-spinner hourglass">⏳</div>';
        }
        
        // Insert loader where actions were
        if (actions && actions.parentNode) {
          actions.parentNode.insertBefore(loader, actions);
        } else {
          popup.querySelector('.alert90s-body').appendChild(loader);
        }
      }
    }
  }
  static hideLoading() {
    const popup = this.getPopup();
    if (popup) {
      const actions = popup.querySelector('.alert90s-actions');
      if (actions) actions.style.display = ''; // restore buttons
      
      const loader = popup.querySelector('.alert90s-loader');
      if (loader) loader.remove();
    }
  }
  static showValidationMessage(message) {
    const popup = this.getPopup();
    if (popup) {
      let valEl = popup.querySelector('.alert90s-validation-message');
      if (!valEl) {
        valEl = document.createElement('div');
        valEl.className = 'alert90s-validation-message';
        // Insert validation message before actions
        const actions = popup.querySelector('.alert90s-actions');
        if (actions && actions.parentNode) {
          actions.parentNode.insertBefore(valEl, actions);
        } else {
          popup.querySelector('.alert90s-body').appendChild(valEl);
        }
      }
      valEl.innerHTML = message;
      valEl.style.display = 'block';
    }
  }
  static resetValidationMessage() {
    const popup = this.getPopup();
    if (popup) {
      const valEl = popup.querySelector('.alert90s-validation-message');
      if (valEl) valEl.style.display = 'none';
    }
  }

  static getToastContainer(position) {
    const containerClass = `alert90s-toast-container alert90s-toast-${position}`;
    let container = document.querySelector(`.${containerClass.replace(/ /g, '.')}`);
    if (!container) {
      container = document.createElement('div');
      container.className = containerClass;
      document.body.appendChild(container);
    }
    return container;
  }

  static fire(options = {}) {
    return this.show(options);
  }

  static show(options = {}) {
    return new Promise((resolve) => {
      if (typeof options === 'string') {
        options = { title: options };
      }
      this.currentOptions = options;
      
      const config = {
        title: options.title !== undefined ? options.title : '',
        text: options.message || options.text || '',
        html: options.html || '',
        icon: options.type || options.icon || '', 
        iconHtml: options.iconHtml || '',
        
        // Buttons
        showConfirmButton: options.showConfirmButton !== false,
        showCancelButton: options.showCancelButton || false,
        showDenyButton: options.showDenyButton || false,
        showCloseButton: options.showCloseButton !== undefined ? options.showCloseButton : true,
        loaderType: options.loaderType || 'hourglass',
        
        confirmButtonText: options.confirmText || options.confirmButtonText || 'OK',
        cancelButtonText: options.cancelText || options.cancelButtonText || 'Cancel',
        denyButtonText: options.denyText || options.denyButtonText || 'No',
        
        confirmButtonColor: options.confirmButtonColor || '',
        cancelButtonColor: options.cancelButtonColor || '',
        denyButtonColor: options.denyButtonColor || '',

        // Custom Styles
        background: options.background || '',
        color: options.color || '',
        titleColor: options.titleColor || '',
        iconColor: options.iconColor || '',

        confirmButtonAriaLabel: options.confirmButtonAriaLabel || '',
        cancelButtonAriaLabel: options.cancelButtonAriaLabel || '',
        denyButtonAriaLabel: options.denyButtonAriaLabel || '',
        
        focusConfirm: options.focusConfirm !== false,
        
        // Advanced content
        footer: options.footer || '',
        imageUrl: options.imageUrl || '',
        imageWidth: options.imageWidth || null,
        imageHeight: options.imageHeight || null,
        imageAlt: options.imageAlt || '',
        
        // Input
        input: options.input || null,
        inputPlaceholder: options.inputPlaceholder || '',
        inputValue: options.inputValue || '',
        inputOptions: options.inputOptions || {},
        inputAttributes: options.inputAttributes || {},
        showLoaderOnConfirm: options.showLoaderOnConfirm || false,
        preConfirm: options.preConfirm || null,
        
        // Behavior
        toast: options.toast || false,
        draggable: options.draggable || false,
        position: options.position || (options.toast ? 'top-end' : 'center'),
        allowOutsideClick: options.allowOutsideClick !== undefined ? options.allowOutsideClick : true,
        
        // Display options
        dir: options.dir || 'auto', // 'rtl', 'ltr', 'auto'
        theme: options.theme || 'light', // 'light', 'dark', 'auto'
        
        // Animations
        showClass: options.showClass || { popup: 'alert90s-pop-in' },
        hideClass: options.hideClass || { popup: 'alert90s-fade-out' },

        // Timers
        timer: options.timer || null,
        timerProgressBar: options.timerProgressBar || false,

        // Callbacks
        didOpen: options.didOpen || null,
        willClose: options.willClose || null,
      };

      // Create overlay (only for non-toasts)
      let overlay = null;
      if (!config.toast) {
        overlay = document.createElement('div');
        overlay.className = `alert90s-overlay alert90s-pos-${config.position}`;
        
        // Handle allowOutsideClick
        overlay.addEventListener('mousedown', (e) => {
          if (e.target === overlay) {
            const allow = typeof config.allowOutsideClick === 'function' ? config.allowOutsideClick() : config.allowOutsideClick;
            if (allow) {
               finish({ isConfirmed: false, isDenied: false, isDismissed: true, dismiss: 'backdrop' });
            }
          }
        });
      }

      // Create Box
      const box = document.createElement('div');
      box.className = 'alert90s-box';
      if (config.toast) box.classList.add('alert90s-toast');
      
      let resolvedTheme = config.theme;
      if (resolvedTheme === 'auto') {
        resolvedTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      if (resolvedTheme === 'dark') {
        box.classList.add('alert90s-dark');
      }
      
      // RTL support
      if (document.dir === 'rtl' || config.dir === 'rtl' || config.position.includes('start')) {
        box.setAttribute('dir', config.dir === 'auto' ? (document.dir || 'ltr') : config.dir);
      } else {
        box.setAttribute('dir', config.dir);
      }

      // Apply custom show classes
      if (config.showClass.popup) {
        if (config.showClass.popup !== 'alert90s-pop-in') {
          box.style.animation = 'none';
          box.className = `alert90s-box ${config.showClass.popup}`;
        }
      }

      // Custom styling for Box
      if (config.background) box.style.backgroundColor = config.background;
      if (config.color) box.style.color = config.color;

      if (config.draggable) {
        box.classList.add('is-draggable');
      }

      if (!config.toast) {
        // Only assign currentPopup for Modal Alerts (singleton pattern)
        this.currentPopup = box;
      }

      const bodyContainer = document.createElement('div');
      bodyContainer.className = 'alert90s-body';

      // Header
      const header = document.createElement('div');
      header.className = 'alert90s-header';
      if (config.draggable) header.classList.add('draggable');
      
      let closeButtonHtml = '';
      if (config.showCloseButton) {
        closeButtonHtml = `
          <button class="alert90s-close-btn" id="alert90s-close" aria-label="Close">
            <span>&#10005;</span>
          </button>
        `;
      }

      header.innerHTML = `
        <div class="alert90s-header-left">
          <div class="alert90s-header-dot"></div>
          <div class="alert90s-header-dot"></div>
          <div class="alert90s-header-dot"></div>
        </div>
        <div class="alert90s-header-right">
          <span class="alert90s-header-title">SYS.REQ</span>
          ${closeButtonHtml}
        </div>
      `;

      // Draggable Logic
      if (config.draggable) {
        let isDragging = false;
        let startX, startY, initialBoxX, initialBoxY;

        header.addEventListener('mousedown', (e) => {
          if (e.target.closest('#alert90s-close')) return;
          isDragging = true;
          startX = e.clientX;
          startY = e.clientY;
          const rect = box.getBoundingClientRect();
          box.style.transform = 'none';
          box.style.animation = 'none';
          initialBoxX = rect.left;
          initialBoxY = rect.top;
          box.style.left = initialBoxX + 'px';
          box.style.top = initialBoxY + 'px';
          box.style.margin = '0'; 
          document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
          if (!isDragging) return;
          box.style.left = (initialBoxX + (e.clientX - startX)) + 'px';
          box.style.top = (initialBoxY + (e.clientY - startY)) + 'px';
        });

        document.addEventListener('mouseup', () => {
          if (isDragging) {
            isDragging = false;
            document.body.style.userSelect = '';
          }
        });
      }

      // Progress Bar
      let progressBarEl = null;
      if (config.timer && config.timerProgressBar) {
        progressBarEl = document.createElement('div');
        progressBarEl.className = 'alert90s-progress-bar';
        progressBarEl.style.animationDuration = `${config.timer}ms`;
        box.appendChild(progressBarEl);
      }

      // Image
      if (config.imageUrl) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'alert90s-image-container';
        const img = document.createElement('img');
        img.src = config.imageUrl;
        if (config.imageAlt) img.alt = config.imageAlt;
        
        let containerStyle = '';
        if (config.imageWidth) containerStyle += `width: ${config.imageWidth}px; max-width: 100%; `;
        if (config.imageHeight) containerStyle += `height: ${config.imageHeight}px; `;
        if (containerStyle) imgContainer.setAttribute('style', containerStyle);
        
        imgContainer.appendChild(img);
        bodyContainer.appendChild(imgContainer);
      }

      // Icon
      if (config.icon) {
        const iconWrapper = document.createElement('div');
        const typeClass = config.icon === 'error' ? 'danger' : config.icon;
        iconWrapper.className = `alert90s-icon ${typeClass}`;
        
        let iconHTML = '';
        if (config.iconHtml) {
          iconHTML = `<div class="alert90s-icon-custom">${config.iconHtml}</div>`;
        } else if (config.icon === 'warning') {
          iconHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
        } else if (config.icon === 'danger' || config.icon === 'error') {
          iconHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        } else if (config.icon === 'info') {
          iconHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
        } else if (config.icon === 'success') {
          iconHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
        } else if (config.icon === 'question') {
           iconHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
        }
        
        iconWrapper.innerHTML = iconHTML;
        
        // Custom icon color
        if (config.iconColor) {
          iconWrapper.style.color = config.iconColor;
          iconWrapper.style.borderColor = config.iconColor;
          // Also set SVG stroke if it's not custom HTML
          if (!config.iconHtml) {
             const svg = iconWrapper.querySelector('svg');
             if (svg) svg.style.stroke = config.iconColor;
          }
        }
        
        if (iconHTML) bodyContainer.appendChild(iconWrapper);
      }

      // Title and Content Wrapper
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'alert90s-content-wrapper';

      // Title
      if (config.title) {
        const titleEl = document.createElement('h2');
        titleEl.className = 'alert90s-title';
        titleEl.innerHTML = config.title;
        if (config.titleColor) titleEl.style.color = config.titleColor;
        contentWrapper.appendChild(titleEl);
      }

      // Content (Text/HTML)
      if (config.html) {
        const htmlEl = document.createElement('div');
        htmlEl.className = 'alert90s-html';
        htmlEl.innerHTML = config.html;
        if (config.color) htmlEl.style.color = config.color;
        contentWrapper.appendChild(htmlEl);
      } else if (config.text) {
        const messageEl = document.createElement('p');
        messageEl.className = 'alert90s-message';
        messageEl.textContent = config.text;
        if (config.color) messageEl.style.color = config.color;
        contentWrapper.appendChild(messageEl);
      }

      if (config.title || config.html || config.text) {
        bodyContainer.appendChild(contentWrapper);
      }

      if (config.toast && config.showCloseButton) {
        const toastClose = document.createElement('button');
        toastClose.className = 'alert90s-toast-close';
        toastClose.innerHTML = '<span>&#10005;</span>';
        toastClose.onclick = () => finish({ isConfirmed: false, isDenied: false, isDismissed: true, dismiss: 'close' });
        bodyContainer.appendChild(toastClose);
      }

      // Input form
      let inputEl = null;

      if (config.input) {
        const inputContainer = document.createElement('div');
        inputContainer.className = 'alert90s-input-container';

        if (config.input === 'select') {
          inputEl = document.createElement('select');
          inputEl.className = 'alert90s-input alert90s-select';
          if (config.inputPlaceholder) {
            const defaultOpt = document.createElement('option');
            defaultOpt.value = '';
            defaultOpt.textContent = config.inputPlaceholder;
            defaultOpt.disabled = true;
            defaultOpt.selected = true;
            inputEl.appendChild(defaultOpt);
          }
          for (const [val, text] of Object.entries(config.inputOptions)) {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = text;
            if (val === config.inputValue) opt.selected = true;
            inputEl.appendChild(opt);
          }
          inputContainer.appendChild(inputEl);
        } else if (config.input === 'radio') {
          const radioGroup = document.createElement('div');
          radioGroup.className = 'alert90s-radio-group';
          for (const [val, text] of Object.entries(config.inputOptions)) {
            const label = document.createElement('label');
            label.className = 'alert90s-radio-label';
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'alert90s-radio';
            radio.value = val;
            if (val === config.inputValue) radio.checked = true;
            const span = document.createElement('span');
            span.textContent = text;
            label.appendChild(radio);
            label.appendChild(span);
            radioGroup.appendChild(label);
          }
          inputEl = radioGroup; // Parent serves as reference
          inputContainer.appendChild(radioGroup);
        } else if (config.input === 'checkbox' || config.input === 'toggle') {
          const label = document.createElement('label');
          label.className = config.input === 'toggle' ? 'alert90s-toggle-label' : 'alert90s-checkbox-label';
          inputEl = document.createElement('input');
          inputEl.type = 'checkbox';
          inputEl.checked = !!config.inputValue;
          
          if (config.input === 'toggle') {
             const slider = document.createElement('div');
             slider.className = 'alert90s-toggle-slider';
             label.appendChild(inputEl);
             label.appendChild(slider);
             if (config.inputPlaceholder) {
                const span = document.createElement('span');
                span.textContent = config.inputPlaceholder;
                label.appendChild(span);
             }
          } else {
             // SVG Brutalist Checkbox
             const svgNS = 'http://www.w3.org/2000/svg';
             const svg = document.createElementNS(svgNS, 'svg');
             svg.setAttribute('class', 'alert90s-cb-svg');
             svg.setAttribute('viewBox', '0 0 100 100');
             svg.setAttribute('width', '36');
             svg.setAttribute('height', '36');
             const shadow = document.createElementNS(svgNS, 'rect');
             shadow.setAttribute('class', 'cb-shadow');
             shadow.setAttribute('x', '12'); shadow.setAttribute('y', '12');
             shadow.setAttribute('width', '80'); shadow.setAttribute('height', '80');
             shadow.setAttribute('fill', '#000000');
             const box = document.createElementNS(svgNS, 'rect');
             box.setAttribute('class', 'cb-box');
             box.setAttribute('x', '4'); box.setAttribute('y', '4');
             box.setAttribute('width', '80'); box.setAttribute('height', '80');
             box.setAttribute('fill', '#e4e0d7'); box.setAttribute('stroke', '#000000');
             box.setAttribute('stroke-width', '8');
             const check = document.createElementNS(svgNS, 'path');
             check.setAttribute('class', 'cb-check');
             check.setAttribute('d', 'M 22 48 L 40 68 L 82 20');
             check.setAttribute('fill', 'none'); check.setAttribute('stroke', '#ff6b35');
             check.setAttribute('stroke-width', '14'); check.setAttribute('stroke-linecap', 'square');
             check.setAttribute('stroke-linejoin', 'miter');
             svg.appendChild(shadow); svg.appendChild(box); svg.appendChild(check);
             const span = document.createElement('span');
             span.className = 'alert90s-cb-text';
             span.textContent = config.inputPlaceholder || 'Check me';
             label.appendChild(inputEl);
             label.appendChild(svg);
             label.appendChild(span);
          }
          inputContainer.appendChild(label);
        } else if (config.input === 'textarea') {
          inputEl = document.createElement('textarea');
          inputEl.className = 'alert90s-input';
          if (config.inputPlaceholder) inputEl.placeholder = config.inputPlaceholder;
          if (config.inputValue) inputEl.value = config.inputValue;
          inputContainer.appendChild(inputEl);
        } else {
          inputEl = document.createElement('input');
          inputEl.type = config.input;
          inputEl.className = 'alert90s-input';
          if (config.inputPlaceholder) inputEl.placeholder = config.inputPlaceholder;
          if (config.inputValue) inputEl.value = config.inputValue;
          inputContainer.appendChild(inputEl);
        }
        
        // Apply custom attributes (for non-grouped inputs)
        if (config.inputAttributes && inputEl && !['radio'].includes(config.input)) {
          for (const [key, val] of Object.entries(config.inputAttributes)) {
            inputEl.setAttribute(key, val);
          }
        }
        
        bodyContainer.appendChild(inputContainer);
      }

      // Actions
      const actions = document.createElement('div');
      actions.className = 'alert90s-actions';

      let confirmBtnRef = null;
      let timerIntervalObj = null;

      const finish = (resultObj) => {
        if (timerIntervalObj) clearTimeout(timerIntervalObj);
        if (config.willClose) config.willClose();
        
        box.style.animation = 'none';
        
        if (config.hideClass.popup === 'alert90s-fade-out') {
           box.style.animation = 'alert90s-fade-out 0.2s forwards';
           if (overlay) {
             overlay.style.transition = 'opacity 0.2s';
             overlay.style.opacity = '0';
           }
        } else {
           box.className = `alert90s-box ${config.hideClass.popup}`;
        }
        
        setTimeout(() => {
          if (config.toast) {
            if (box.parentNode) {
              box.parentNode.removeChild(box);
            }
          } else {
            if (overlay && document.body.contains(overlay)) {
              document.body.removeChild(overlay);
            }
          }
          resolve(resultObj);
        }, 200);
      };

      // Handler for Confirm to support preConfirm and input
      const handleConfirm = async () => {
        let val = true;
        
        if (config.input === 'radio') {
           const checked = inputEl.querySelector('input[type="radio"]:checked');
           val = checked ? checked.value : null;
        } else if (config.input === 'checkbox' || config.input === 'toggle') {
           val = inputEl.checked;
        } else if (inputEl) {
           val = inputEl.value;
        }

        if (config.preConfirm) {
          Alert90s.resetValidationMessage();
          if (config.showLoaderOnConfirm) {
            Alert90s.showLoading();
          }
          try {
            const preConfirmResult = await Promise.resolve(config.preConfirm(val));
            if (preConfirmResult === false) {
               Alert90s.hideLoading();
               return; // Prevent closing
            }
            if (preConfirmResult !== undefined && preConfirmResult !== val) {
               val = preConfirmResult;
            }
            // Check if a validation error was shown during preConfirm
            const valEl = box.querySelector('.alert90s-validation-message');
            if (valEl && valEl.style.display === 'block') {
               Alert90s.hideLoading();
               return; // Prevent closing
            }
          } catch (error) {
            Alert90s.showValidationMessage(`Request failed: ${error}`);
            Alert90s.hideLoading();
            return; // Prevent closing
          }
        }
        
        finish({ isConfirmed: true, isDenied: false, isDismissed: false, value: val });
      };

      if (config.showCancelButton) {
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'alert90s-button cancel';
        cancelBtn.innerHTML = config.cancelButtonText;
        if (config.cancelButtonAriaLabel) cancelBtn.setAttribute('aria-label', config.cancelButtonAriaLabel);
        if (config.cancelButtonColor) cancelBtn.style.backgroundColor = config.cancelButtonColor;
        cancelBtn.onclick = () => finish({ isConfirmed: false, isDenied: false, isDismissed: true, dismiss: 'cancel' });
        actions.appendChild(cancelBtn);
      }

      if (config.showDenyButton) {
        const denyBtn = document.createElement('button');
        denyBtn.className = 'alert90s-button deny';
        denyBtn.innerHTML = config.denyButtonText;
        if (config.denyButtonAriaLabel) denyBtn.setAttribute('aria-label', config.denyButtonAriaLabel);
        if (config.denyButtonColor) denyBtn.style.backgroundColor = config.denyButtonColor;
        denyBtn.onclick = () => finish({ isConfirmed: false, isDenied: true, isDismissed: false });
        actions.appendChild(denyBtn);
      }

      if (config.showConfirmButton) {
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'alert90s-button confirm';
        confirmBtn.innerHTML = config.confirmButtonText;
        if (config.confirmButtonAriaLabel) confirmBtn.setAttribute('aria-label', config.confirmButtonAriaLabel);
        if (config.confirmButtonColor) confirmBtn.style.backgroundColor = config.confirmButtonColor;
        confirmBtn.onclick = handleConfirm;
        actions.appendChild(confirmBtn);
        confirmBtnRef = confirmBtn;
      }

      if (config.showCancelButton || config.showDenyButton || config.showConfirmButton) {
        bodyContainer.appendChild(actions);
      }

      // Footer
      if (config.footer) {
        const footerEl = document.createElement('div');
        footerEl.className = 'alert90s-footer';
        footerEl.innerHTML = config.footer;
        bodyContainer.appendChild(footerEl);
      }

      // Assemble
      box.appendChild(header);
      box.appendChild(bodyContainer);
      
      if (config.toast) {
        const container = Alert90s.getToastContainer(config.position);
        
        // Setup initial animation specifically for toast
        box.style.animation = 'alert90s-toast-slide-in 0.3s ease-out';
        
        container.appendChild(box);
      } else {
        overlay.appendChild(box);
      }

      if (config.showCloseButton && !config.toast) {
        const closeBtn = header.querySelector('#alert90s-close');
        if (closeBtn) {
          closeBtn.onclick = () => finish({ isConfirmed: false, isDenied: false, isDismissed: true, dismiss: 'close' });
        }
      }

      // Append to body (if it's not a toast)
      if (!config.toast) {
        document.body.appendChild(overlay);
      }

      // Focus
      if (config.focusConfirm && confirmBtnRef) {
        setTimeout(() => { 
          // If input is present, sweetalert focuses input first
          if (inputEl) inputEl.focus();
          else confirmBtnRef.focus(); 
        }, 50);
      }

      // User hooks & timers
      if (config.didOpen) {
        setTimeout(() => { config.didOpen(); }, 0);
      }

      if (config.timer) {
        this.timerEnd = Date.now() + config.timer;
        timerIntervalObj = setTimeout(() => {
          finish({ isConfirmed: false, isDenied: false, isDismissed: true, dismiss: 'timer' });
        }, config.timer);
      }
    });
  }

  // --- Tooltip / Popover Management ---
  static initTooltips() {
    if (this._tooltipsInitialized) return;
    this._tooltipsInitialized = true;

    this._tooltipEl = document.createElement('div');
    this._tooltipEl.className = 'alert90s-tooltip';
    document.body.appendChild(this._tooltipEl);

    document.addEventListener('mouseover', this._handleTooltipMouseOver.bind(this));
    document.addEventListener('mouseout', this._handleTooltipMouseOut.bind(this));
    
    // Support focus for accessibility / keyboard navigation
    document.addEventListener('focusin', this._handleTooltipMouseOver.bind(this));
    document.addEventListener('focusout', this._handleTooltipMouseOut.bind(this));
  }

  static _handleTooltipMouseOver(e) {
    const target = e.target.closest('[data-alert90s-tooltip]');
    if (!target) return;

    const message = target.getAttribute('data-alert90s-tooltip');
    if (!message) return;

    const position = target.getAttribute('data-alert90s-position') || 'top';
    const colorClass = target.getAttribute('data-alert90s-color') || 'yellow'; // yellow, cyan, pink, base

    this._tooltipEl.innerHTML = message;
    
    // Reset classes
    this._tooltipEl.className = `alert90s-tooltip pos-${position} c-${colorClass} show`;

    const targetRect = target.getBoundingClientRect();
    const tooltipRect = this._tooltipEl.getBoundingClientRect();
    const offset = 10; // Distance from element

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = targetRect.top - tooltipRect.height - offset;
        left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom':
        top = targetRect.bottom + offset;
        left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
        left = targetRect.left - tooltipRect.width - offset;
        break;
      case 'right':
        top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
        left = targetRect.right + offset;
        break;
    }

    // Boundary constraints (prevent off-screen)
    if (left < offset) left = offset;
    if (top < offset) top = offset;
    if (left + tooltipRect.width > window.innerWidth - offset) {
      left = window.innerWidth - tooltipRect.width - offset;
    }

    this._tooltipEl.style.top = `${top + window.scrollY}px`;
    this._tooltipEl.style.left = `${left + window.scrollX}px`;
  }

  static _handleTooltipMouseOut(e) {
    const target = e.target.closest('[data-alert90s-tooltip]');
    if (!target) return;
    
    // Small delay to prevent flickering if moving inside the element
    setTimeout(() => {
        if (!this._tooltipEl.matches(':hover') && !target.matches(':hover') && !target.contains(document.activeElement)) {
             this._tooltipEl.classList.remove('show');
        }
    }, 10);
  }

  /**
   * Renders a Neo-Brutalist Theme Switcher into a target container.
   * Useful for documentations or retro-styled portfolios.
   */
  static renderThemeToggle(selector, options = {}) {
    const el = document.querySelector(selector);
    if (!el) return null;

    const width = options.width || "100%";
    const isDark = options.isDark || false;

    const svgHtml = `
      <label class="alert90s-theme-wrapper" aria-label="Neo Brutalist Theme Switcher" style="width: ${width}; height: auto; aspect-ratio: 5 / 2;">
          <input type="checkbox" class="alert90s-theme-checkbox" ${isDark ? 'checked' : ''} />
          
          <svg viewBox="0 0 300 120" style="width: 100%; height: 100%; overflow: visible;">
              <!-- HARD OFFSET SHADOW -->
              <rect class="alert90s-theme-track-shadow" x="18" y="18" width="280" height="100" />
              <!-- MAIN TRACK -->
              <rect class="alert90s-theme-track-base" x="10" y="10" width="280" height="100" />

              <!-- DECORATIVE 90S UI ELEMENTS -->
              <g class="alert90s-theme-deco-elements" stroke="#000" stroke-width="2">
                  <circle cx="25" cy="25" r="4" fill="#FFF" />
                  <line x1="23" y1="23" x2="27" y2="27" />
                  <circle cx="275" cy="25" r="4" fill="#FFF" />
                  <line x1="273" y1="27" x2="277" y2="23" />
                  <circle cx="25" cy="95" r="4" fill="#FFF" />
                  <line x1="23" y1="95" x2="27" y2="95" />
                  <circle cx="275" cy="95" r="4" fill="#FFF" />
                  <line x1="275" y1="93" x2="275" y2="97" />
                  
                  <line x1="120" y1="20" x2="120" y2="35" stroke-width="3" />
                  <line x1="128" y1="20" x2="128" y2="35" stroke-width="5" />
                  <line x1="138" y1="20" x2="138" y2="35" stroke-width="2" />
                  <line x1="145" y1="20" x2="145" y2="35" stroke-width="6" />
              </g>

              <!-- DAY / NIGHT TEXT -->
              <text class="alert90s-theme-text-label alert90s-theme-text-night" x="40" y="75">NIGHT</text>
              <text class="alert90s-theme-text-label alert90s-theme-text-day" x="190" y="75">DAY</text>

              <!-- NEON DECORATIVE STICKER -->
              <rect class="alert90s-theme-deco-accent" x="120" y="85" width="60" height="15" stroke="#000" stroke-width="3" />
              <text x="125" y="96" font-size="10" font-weight="bold" fill="#000" font-family="sans-serif">SYS.UI</text>

              <!-- SLIDING THUMB GROUP -->
              <g class="alert90s-theme-thumb-group">
                  <!-- Thumb Shadow -->
                  <rect class="alert90s-theme-thumb-shadow" x="23" y="23" width="80" height="80" />
                  <!-- Thumb Body -->
                  <rect class="alert90s-theme-thumb-body" x="15" y="15" width="80" height="80" />
                  
                  <!-- SUN ICON -->
                  <g class="alert90s-theme-icon-sun">
                      <rect x="40" y="40" width="30" height="30" fill="#facc15" stroke="#000" stroke-width="4" />
                      <rect x="48" y="48" width="14" height="14" fill="#ef4444" stroke="#000" stroke-width="2" />
                      <rect x="50" y="20" width="10" height="10" fill="#ef4444" stroke="#000" stroke-width="4" />
                      <rect x="50" y="80" width="10" height="10" fill="#ef4444" stroke="#000" stroke-width="4" />
                      <rect x="20" y="50" width="10" height="10" fill="#ef4444" stroke="#000" stroke-width="4" />
                      <rect x="80" y="50" width="10" height="10" fill="#ef4444" stroke="#000" stroke-width="4" />
                      <rect x="25" y="25" width="10" height="10" fill="#facc15" stroke="#000" stroke-width="4" />
                      <rect x="75" y="25" width="10" height="10" fill="#facc15" stroke="#000" stroke-width="4" />
                      <rect x="25" y="75" width="10" height="10" fill="#facc15" stroke="#000" stroke-width="4" />
                      <rect x="75" y="75" width="10" height="10" fill="#facc15" stroke="#000" stroke-width="4" />
                  </g>

                  <!-- MOON ICON -->
                  <g class="alert90s-theme-icon-moon">
                      <path fill="#000" transform="translate(3, 3)" d="M 60 30 v -5 h 10 v 5 h 5 v 10 h 5 v 30 h -5 v 10 h -5 v 5 h -10 v -5 h -5 v -5 h 5 v -5 h 5 v -20 h -5 v -5 h -5 v -10 h 5 v -5 Z" />
                      <path fill="#00FFFF" stroke="#000" stroke-width="3" stroke-linejoin="miter" d="M 60 30 v -5 h 10 v 5 h 5 v 10 h 5 v 30 h -5 v 10 h -5 v 5 h -10 v -5 h -5 v -5 h 5 v -5 h 5 v -20 h -5 v -5 h -5 v -10 h 5 v -5 Z" />
                      <rect x="70" y="40" width="5" height="5" fill="#FFFFFF" opacity="0.8" />
                      <rect x="65" y="70" width="5" height="5" fill="#FFFFFF" opacity="0.8" />
                  </g>
              </g>
          </svg>
      </label>
    `;

    el.innerHTML = svgHtml;
    const checkbox = el.querySelector('.alert90s-theme-checkbox');
    
    checkbox.addEventListener('change', (e) => {
       if (typeof options.onChange === 'function') {
           options.onChange(e.target.checked);
       }
    });

    return el;
  }
}

export default Alert90s;
// Make it globally available on window if not using module bundler
if (typeof window !== 'undefined') {
  window.Alert90s = Alert90s;
  // Auto-init tooltips on DOM load for drop-in usage
  document.addEventListener('DOMContentLoaded', () => {
    Alert90s.initTooltips();
  });
}
