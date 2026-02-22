import { useState, useEffect, useRef } from 'react'
import Alert90s from 'alert90s'
import 'alert90s/dist/alert90s.min.js' 
import './App.css'

function CodeBlock({ title, code }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      Alert90s.fire({
        position: 'top-end',
        title: 'COPIED TO CLIPBOARD',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
        toast: true // You can style this as a mini-alert if you want 90s style fast notifications
      });
    });
  };

  return (
    <div className="code-block">
      <div className="code-header">
        {title && <h3>{title}</h3>}
        <button className="copy-btn" onClick={handleCopy}>
          COPY
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('alerts');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const themeToggleRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    const sections = document.querySelectorAll('.doc-section');
    sections.forEach((s) => observer.observe(s));

    return () => {
      sections.forEach((s) => observer.unobserve(s));
    };
  }, []);

  useEffect(() => {
    // Configure default alert theme tracking
    window.alert90sTheme = 'light';
    const originalFire = Alert90s.fire;
    Alert90s.fire = (opts) => originalFire.call(Alert90s, { theme: window.alert90sTheme, ...opts });
    const originalShow = Alert90s.show;
    Alert90s.show = (opts) => originalShow.call(Alert90s, { theme: window.alert90sTheme, ...opts });

    if (themeToggleRef.current && !themeToggleRef.current.hasChildNodes()) {
      Alert90s.renderThemeToggle('#docs-theme-toggle', {
        width: '120px',
        onChange: (isDark) => {
          window.alert90sTheme = isDark ? 'dark' : 'light';
          if (isDark) document.body.classList.add('dark');
          else document.body.classList.remove('dark');
        }
      });
    }
  }, []);

  const showBasic = () => {
    Alert90s.fire({
      title: "CONNECTION ESTABLISHED",
      text: "Welcome to the Alert90s documentation!",
      icon: "success"
    });
  };

  const showThreeButtons = () => {
    Alert90s.fire({
      title: "OVERWRITE CONFIG.SYS?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "YES",
      denyButtonText: `NO, KEEP OLD`
    }).then((result) => {
      if (result.isConfirmed) {
        Alert90s.fire("SAVED!", "System will reboot to apply changes.", "success");
      } else if (result.isDenied) {
        Alert90s.fire("ABORTED", "Keeping old configuration.", "info");
      }
    });
  };

  const showAjax = () => {
    Alert90s.fire({
      title: "ENTER GITHUB USERNAME",
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "AUTHENTICATE",
      showLoaderOnConfirm: true,
      preConfirm: async (login) => {
        try {
          const githubUrl = `https://api.github.com/users/${login}`;
          const response = await fetch(githubUrl);
          if (!response.ok) {
            return Alert90s.showValidationMessage(`
               ERROR: ${JSON.stringify(await response.json())}
            `);
          }
          return response.json();
        } catch (error) {
          Alert90s.showValidationMessage(`
            CONNECTION FAILED: ${error}
          `);
        }
      },
      allowOutsideClick: () => !Alert90s.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Alert90s.fire({
          title: `USER: ${result.value.login}`,
          text: "Acess Granted.",
          imageUrl: result.value.avatar_url,
          imageWidth: 200,
          imageHeight: 200
        });
      }
    });
  };

  const showTimer = () => {
    let timerInterval;
    Alert90s.fire({
      title: "DIALING MODEM...",
      html: "Connecting in <b></b> ms.",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Alert90s.showLoading();
        const timer = Alert90s.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Alert90s.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    });
  };

  const showColors = () => {
    Alert90s.fire({
      title: "MATRIX MODE",
      text: "Custom styling applied.",
      icon: "success",
      background: "#1a2e05",
      color: "#bef264",
      titleColor: "#4ade80",
      iconColor: "#84cc16",
      confirmButtonColor: "#84cc16",
      confirmButtonText: "WAKE UP"
    });
  };

  const showHtml = () => {
    Alert90s.fire({
      title: "<strong>DOWNLOAD <u>COMPLETE</u></strong>",
      icon: "info",
      html: `
        File <b>DOOM_SHAREWARE.ZIP</b> has been downloaded.
        <br/><br/>
        Check your <a href="#" autofocus>C:\\DOWNLOADS</a> folder to extract.
      `,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'INSTALL',
      cancelButtonText: 'DELETE',
    });
  };

  const showFooter = () => {
    Alert90s.fire({
      icon: "error",
      title: "DISK READ ERROR",
      text: "Sector 4 is corrupted. Data loss imminent.",
      footer: '<a href="#">RUN SCANDISK.EXE NOW?</a>'
    });
  };

  const showPosition = () => {
    Alert90s.fire({
      position: "top-end",
      icon: "success",
      title: "VIRUS DEFINITIONS UPDATED",
      showConfirmButton: false,
      timer: 1500
    });
  };

  const showAnimate = () => {
    Alert90s.fire({
      title: "ACCESS GRANTED",
      text: "Entering Mainframe...",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      }
    });
  };

  const showPromiseChain = () => {
    Alert90s.fire({
      title: "FORMAT C: ?",
      text: "ALL DATA WILL BE DESTROYED!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "PROCEED"
    }).then((result) => {
      if (result.isConfirmed) {
        Alert90s.fire({
          title: "FORMAT COMPLETE",
          text: "Disk C: is now empty. Please insert DOS diskette.",
          icon: "success"
        });
      }
    });
  };

  const showCustomImage = () => {
    Alert90s.fire({
      title: "WINAMP.EXE",
      text: "It really whips the llama's ass!",
      imageUrl: "https://placeholder.pics/svg/400x200",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Retro application banner"
    });
  };

  const showDraggable = () => {
    Alert90s.fire({
      title: "FILE MANAGER",
      text: "Drag this window by the header bar.",
      icon: "info",
      draggable: true
    });
  };

  const showRtl = () => {
    Alert90s.fire({
      title: "هل تريد الاستمرار؟",
      text: "يتم تحميل النظام الآن...",
      icon: "question",
      iconHtml: "؟",
      confirmButtonText: "نعم",
      cancelButtonText: "لا",
      showCancelButton: true,
      showCloseButton: true,
      dir: 'rtl'
    });
  };

  const showToast = () => {
    Alert90s.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "File Saved Successfully",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  };

  const showToastBottom = () => {
    Alert90s.fire({
      toast: true,
      position: "bottom-end",
      icon: "error",
      title: "فشل الاتصال",
      text: "حدث خطأ غير معروف.",
      showConfirmButton: false,
      showCloseButton: true,
      dir: 'rtl',
      timer: 5000
    });
  };

  const showToastInfo = () => {
    Alert90s.fire({
      toast: true,
      position: "top-start",
      icon: "info",
      title: "System Update",
      text: "Version 2.0 is now available.",
      showConfirmButton: false,
      showCloseButton: true,
      timer: 4000
    });
  };

  const showToastWarning = () => {
    Alert90s.fire({
      toast: true,
      position: "bottom",
      icon: "warning",
      title: "Low Battery",
      text: "Please connect PC to charger.",
      showConfirmButton: false,
      timer: 3500,
      background: "#fef08a",
      color: "#854d0e"
    });
  };

  return (
    <div className="container">
      <header className="header">
        <div className="header-title-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <img src="/alert90s.webp" alt="Alert90s Logo" className="header-logo" />
          <h1>Alert90s Documentation</h1>
          <div id="docs-theme-toggle" ref={themeToggleRef} style={{ marginLeft: "auto" }}></div>
        </div>
        <p><marquee scrollamount="10" scrolldelay="0">A "Neo Brutalism 90s" style JS alert library. Completely standalone and dependency-free.</marquee></p>
        <div className="install-box">
          <code>npm install alert90s</code>
        </div>
        <div className="support-links">
          <a href="https://saweria.co/adewanggar" target="_blank" rel="noopener noreferrer" className="support-btn saweria">Support via Saweria</a>
          <a href="https://ko-fi.com/adewanggar" target="_blank" rel="noopener noreferrer" className="support-btn kofi">Support via Ko-fi</a>
          <a href="https://www.dewangga.site/" target="_blank" rel="noopener noreferrer" className="support-btn portfolio">Portfolio Website</a>
        </div>
      </header>
      
      <div className="layout">
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsSidebarOpen(true)}
        >
          MENU
        </button>
        
        {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

        <nav className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)}>X</button>
          <ul onClick={(e) => {
            if(e.target.tagName === 'A') setIsSidebarOpen(false);
          }}>
            <li><a href="#installation" className={activeSection === 'installation' ? 'active' : ''}>Installation</a></li>
            <li><a href="#usage" className={activeSection === 'usage' ? 'active' : ''}>Usage</a></li>
            <li><a href="#examples" className={activeSection === 'examples' ? 'active' : ''}>Examples</a></li>
            <li><a href="#configuration" className={activeSection === 'configuration' ? 'active' : ''}>Configuration Params</a></li>
            <li><a href="#buttons" className={activeSection === 'buttons' ? 'active' : ''}>Handling Buttons</a></li>
            <li><a href="#css-buttons" className={activeSection === 'css-buttons' ? 'active' : ''}>CSS Buttons</a></li>
            <li><a href="#tooltips" className={activeSection === 'tooltips' ? 'active' : ''}>Tooltips / Popovers</a></li>
            <li><a href="#dismissals" className={activeSection === 'dismissals' ? 'active' : ''}>Handling Dismissals</a></li>
            <li><a href="#icons" className={activeSection === 'icons' ? 'active' : ''}>Icons</a></li>
            <li><a href="#inputs" className={activeSection === 'inputs' ? 'active' : ''}>Input Types</a></li>
            <li><a href="#methods" className={activeSection === 'methods' ? 'active' : ''}>Methods</a></li>
          </ul>
        </nav>

        <main className="content">
          <section id="installation" className="doc-section">
            <h2>Installation</h2>
            <p>You can install Alert90s via npm or include it directly in your HTML.</p>
            <CodeBlock title="npm" code={`npm install alert90s`} />
            <CodeBlock title="CDN / HTML" code={`<script src="https://unpkg.com/alert90s/dist/alert90s.min.js"></script>`} />
          </section>

          <section id="usage" className="doc-section">
            <h2>Usage</h2>
            <p>If using a module bundler, import the library first.</p>
            <CodeBlock 
              code={`import Alert90s from 'alert90s';

// Display a simple alert
Alert90s.fire('Hello world!');`} 
            />
          </section>

          <section id="examples" className="doc-section">
            <h2>Examples</h2>
            
            <div className="tab-container">
              <button 
                className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`} 
                onClick={() => setActiveTab('alerts')}
              >
                Alerts
              </button>
              <button 
                className={`tab-btn ${activeTab === 'toasts' ? 'active' : ''}`} 
                onClick={() => setActiveTab('toasts')}
              >
                Toasts
              </button>
              <button 
                className={`tab-btn ${activeTab === 'loaders' ? 'active' : ''}`} 
                onClick={() => setActiveTab('loaders')}
              >
                Loaders
              </button>
              <button 
                className={`tab-btn ${activeTab === 'inputs' ? 'active' : ''}`} 
                onClick={() => setActiveTab('inputs')}
              >
                Inputs
              </button>
            </div>

            {activeTab === 'alerts' && (
              <div className="grid">
                <div className="card">
                  <h3>Basic Message</h3>
                  <button onClick={showBasic}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  text: "CONNECTION ESTABLISHED.",
  showConfirmButton: true
});`} />
                </div>

                <div className="card">
                  <h3>Error + Footer</h3>
                  <button onClick={showFooter}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  icon: "error",
  title: "DISK READ ERROR",
  text: "Sector 4 is corrupted.",
  footer: '<a href="#">RUN SCANDISK.EXE NOW?</a>'
});`} />
                </div>

                <div className="card">
                  <h3>HTML Content</h3>
                  <button onClick={showHtml}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  title: "<strong>DOWNLOAD <u>COMPLETE</u></strong>",
  icon: "info",
  html: "File <b>DOOM.ZIP</b> downloaded.",
  showCloseButton: true,
  showCancelButton: true,
  confirmButtonText: 'INSTALL',
  cancelButtonText: 'DELETE'
});`} />
                </div>

                <div className="card">
                  <h3>Three Buttons</h3>
                  <button onClick={showThreeButtons}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  title: "OVERWRITE CONFIG.SYS?",
  showDenyButton: true,
  showCancelButton: true,
  confirmButtonText: "YES",
  denyButtonText: "NO, KEEP OLD"
}).then((result) => {
  // result.isConfirmed / result.isDenied
});`} />
                </div>

                <div className="card">
                  <h3>Position & Timer</h3>
                  <button onClick={showPosition}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  position: "top-end",
  icon: "success",
  title: "VIRUS DEFINITIONS UPDATED",
  showConfirmButton: false,
  timer: 1500
});`} />
                </div>

                <div className="card">
                  <h3>Animate.css</h3>
                  <button onClick={showAnimate}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  title: "ACCESS GRANTED",
  showClass: {
    popup: "animate__animated animate__fadeInUp"
  },
  hideClass: {
    popup: "animate__animated animate__fadeOutDown"
  }
});`} />
                </div>

                <div className="card">
                  <h3>Promise Chain</h3>
                  <button onClick={showPromiseChain}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  title: "FORMAT C: ?",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "PROCEED"
}).then((result) => {
  if (result.isConfirmed) {
    Alert90s.fire("FORMAT COMPLETE");
  }
});`} />
                </div>

                <div className="card">
                  <h3>Custom Image</h3>
                  <button onClick={showCustomImage}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  title: "WINAMP.EXE",
  imageUrl: "https://placeholder.pics/svg/400x200",
  imageWidth: 400,
  imageHeight: 200,
  imageAlt: "Retro application banner"
});`} />
                </div>

                <div className="card">
                  <h3>Auto Close Timer</h3>
                  <button onClick={showTimer}>Try me!</button>
                  <CodeBlock code={`let timerInterval;
Alert90s.fire({
  title: "DIALING MODEM...",
  timer: 2000,
  timerProgressBar: true,
  didOpen: () => {
    Alert90s.showLoading();
  }
});`} />
                </div>

                <div className="card">
                  <h3>Draggable Modal</h3>
                  <button onClick={showDraggable}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  title: "FILE MANAGER",
  text: "Drag this window by the header bar.",
  icon: "info",
  draggable: true
});`} />
                </div>

                <div className="card">
                  <h3>Rtl Language</h3>
                  <button onClick={showRtl}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  title: "هل تريد الاستمرار؟",
  icon: "question",
  iconHtml: "؟",
  confirmButtonText: "نعم",
  cancelButtonText: "لا",
  dir: 'rtl'
});`} />
                </div>

                <div className="card">
                  <h3>Ajax Request & Input</h3>
                  <button onClick={showAjax}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  input: "text",
  showLoaderOnConfirm: true,
  preConfirm: async (login) => {
    // API Call & validation logic
  },
  allowOutsideClick: () => !Alert90s.isLoading()
});`} />
                </div>

                <div className="card">
                  <h3>Custom Colors</h3>
                  <button onClick={showColors}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  title: "MATRIX MODE",
  background: "#1a2e05",
  color: "#bef264",
  titleColor: "#4ade80"
});`} />
                </div>
              </div>
            )}

            {activeTab === 'toasts' && (
              <div className="grid">
                <div className="card">
                  <h3>Toast Notification</h3>
                  <button onClick={showToast}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  toast: true,
  position: "top-end",
  icon: "success",
  title: "File Saved",
  showConfirmButton: false,
  timer: 3000
});`} />
                </div>

                <div className="card">
                  <h3>Toast Bottom RTL</h3>
                  <button onClick={showToastBottom}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  toast: true,
  position: "bottom-end",
  icon: "error",
  title: "فشل الاتصال",
  showConfirmButton: false,
  showCloseButton: true,
  dir: 'rtl'
});`} />
                </div>

                <div className="card">
                  <h3>Toast Top Start</h3>
                  <button onClick={showToastInfo}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  toast: true,
  position: "top-start",
  icon: "info",
  title: "System Update",
  text: "v2.0 available.",
  showCloseButton: true,
  showConfirmButton: false,
});`} />
                </div>

                <div className="card">
                  <h3>Toast Bottom Center</h3>
                  <button onClick={showToastWarning}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  toast: true,
  position: "bottom",
  icon: "warning",
  title: "Low Battery",
  background: "#fef08a",
  color: "#854d0e",
  showConfirmButton: false,
});`} />
                </div>

                <div className="card">
                  <h3>Spam Toasts (Stacking Test)</h3>
                  <button onClick={() => {
                    for(let i = 0; i < 5; i++) {
                      setTimeout(() => {
                        Alert90s.fire({
                          toast: true,
                          position: "top-end",
                          icon: "success",
                          title: `Download ${i+1}/5 Complete`,
                          showConfirmButton: false,
                          timer: 3000
                        });
                      }, i * 400);
                    }
                  }}>SPAM TOASTS</button>
                  <CodeBlock code={`for(let i = 0; i < 5; i++) {
  setTimeout(() => {
    Alert90s.fire({
      toast: true,
      position: "top-end",
      title: \`Download \${i+1}/5 Complete\`
    });
  }, i * 400);
}`} />
                </div>
              </div>
            )}

            {activeTab === 'loaders' && (
              <div className="grid">
                <div className="card">
                  <h3>Hourglass (Default)</h3>
                  <button onClick={() => {
                    Alert90s.fire({
                      title: "DOWNLOADING...",
                      loaderType: "hourglass",
                      didOpen: () => Alert90s.showLoading()
                    });
                    setTimeout(() => Alert90s.hideLoading(), 3000);
                  }}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  title: "DOWNLOADING...",
  loaderType: "hourglass",
  didOpen: () => Alert90s.showLoading()
});`} />
                </div>

                <div className="card">
                  <h3>ASCII Spinner</h3>
                  <button onClick={() => {
                    Alert90s.fire({
                      title: "CONNECTING TO BBS...",
                      loaderType: "ascii",
                      didOpen: () => Alert90s.showLoading()
                    });
                    setTimeout(() => Alert90s.hideLoading(), 3000);
                  }}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  title: "CONNECTING TO BBS...",
  loaderType: "ascii",
  didOpen: () => Alert90s.showLoading()
});`} />
                </div>

                <div className="card">
                  <h3>Blinking Text</h3>
                  <button onClick={() => {
                    Alert90s.fire({
                      title: "INITIALIZING DEVICE...",
                      loaderType: "blinking",
                      didOpen: () => Alert90s.showLoading()
                    });
                    setTimeout(() => Alert90s.hideLoading(), 3000);
                  }}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  title: "INITIALIZING DEVICE...",
  loaderType: "blinking",
  didOpen: () => Alert90s.showLoading()
});`} />
                </div>

                <div className="card">
                  <h3>Progress Bar</h3>
                  <button onClick={() => {
                    Alert90s.fire({
                      title: "INSTALLING DOOM.EXE...",
                      loaderType: "progress",
                      didOpen: () => Alert90s.showLoading()
                    });
                    setTimeout(() => Alert90s.hideLoading(), 3000);
                  }}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  title: "INSTALLING DOOM.EXE...",
  loaderType: "progress",
  didOpen: () => Alert90s.showLoading()
});`} />
                </div>
              </div>
            )}

            {activeTab === 'inputs' && (
              <div className="grid">
                <div className="card">
                  <h3>Select Dropdown</h3>
                  <button onClick={() => {
                    Alert90s.fire({
                      title: "SELECT DRIVE",
                      input: "select",
                      inputPlaceholder: "-- Choose a Drive --",
                      inputOptions: {
                        'A:': 'Floppy Disk (A:)',
                        'C:': 'Local Disk (C:)',
                        'D:': 'CD-ROM (D:)'
                      }
                    }).then(res => {
                       if (res.isConfirmed) Alert90s.fire("Selected:", res.value || "None", "success");
                    });
                  }}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  title: "SELECT DRIVE",
  input: "select",
  inputPlaceholder: "-- Choose a Drive --",
  inputOptions: {
    'A:': 'Floppy Disk (A:)',
    'C:': 'Local Disk (C:)',
    'D:': 'CD-ROM (D:)'
  }
})`} />
                </div>

                <div className="card">
                  <h3>Radio Buttons</h3>
                  <button onClick={() => {
                    Alert90s.fire({
                      title: "CHOOSE DIFFICULTY",
                      input: "radio",
                      inputOptions: {
                        'easy': 'I\'m too young to die.',
                        'medium': 'Hurt me plenty.',
                        'hard': 'Ultra-Violence.'
                      },
                      inputValue: 'medium'
                    }).then(res => {
                       if (res.isConfirmed) Alert90s.fire("Difficulty:", res.value || "None", "info");
                    });
                  }}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  title: "CHOOSE DIFFICULTY",
  input: "radio",
  inputOptions: {
    'easy': "I'm too young to die.",
    'medium': "Hurt me plenty.",
    'hard': "Ultra-Violence."
  },
  inputValue: 'medium'
})`} />
                </div>

                <div className="card">
                  <h3>Checkbox</h3>
                  <button onClick={() => {
                    Alert90s.fire({
                      title: "TERMS OF SERVICE",
                      text: "Do you agree to surrender your soul to the machine?",
                      input: "checkbox",
                      inputPlaceholder: "I agree.",
                      inputValue: false
                    }).then(res => {
                       if (res.isConfirmed) Alert90s.fire("Status", res.value ? "AGREED" : "DECLINED", "warning");
                    });
                  }}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  title: "TERMS OF SERVICE",
  input: "checkbox",
  inputPlaceholder: "I agree.",
  inputValue: false
})`} />
                </div>

                <div className="card">
                  <h3>Toggle Switch</h3>
                  <button onClick={() => {
                    Alert90s.fire({
                      title: "SYSTEM SETTINGS",
                      input: "toggle",
                      inputPlaceholder: "Enable Turbo Mode",
                      inputValue: true
                    }).then(res => {
                       if (res.isConfirmed) Alert90s.fire("Turbo Mode", res.value ? "ON" : "OFF", "success");
                    });
                  }}>Try me!</button>
                  <CodeBlock code={`Alert90s.fire({
  title: "SYSTEM SETTINGS",
  input: "toggle",
  inputPlaceholder: "Enable Turbo Mode",
  inputValue: true
})`} />
                </div>
              </div>
            )}
          </section>

          <section id="configuration" className="doc-section">
            <h2>Configuration Params</h2>
            <p>Pass an object to <code>Alert90s.fire()</code> to customize the alert.</p>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Option</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>title</td><td>String</td><td>''</td><td>The title of the alert.</td></tr>
                  <tr><td>text / message</td><td>String</td><td>''</td><td>The message body.</td></tr>
                  <tr><td>html</td><td>String</td><td>''</td><td>A custom HTML description.</td></tr>
                  <tr><td>input</td><td>String</td><td>null</td><td>'text', 'password', 'textarea', 'select', 'radio', 'checkbox', 'toggle'.</td></tr>
                  <tr><td>inputPlaceholder</td><td>String</td><td>''</td><td>Placeholder text or label for checkbox/toggle.</td></tr>
                  <tr><td>inputValue</td><td>String/Bool</td><td>''</td><td>Initial value or checked state.</td></tr>
                  <tr><td>inputOptions</td><td>Object</td><td>{`{}`}</td><td>Object mapping <code>{`{value: 'Label'}`}</code> for select/radio.</td></tr>
                  <tr><td>inputAttributes</td><td>Object</td><td>{`{}`}</td><td>Custom HTML attributes for the input element.</td></tr>
                  <tr><td>imageUrl</td><td>String</td><td>''</td><td>URL for an image to display.</td></tr>
                  <tr><td>timer</td><td>Number</td><td>null</td><td>Auto close timer in milliseconds.</td></tr>
                  <tr><td>timerProgressBar</td><td>Boolean</td><td>false</td><td>Show progress bar for timer.</td></tr>
                  <tr><td>toast</td><td>Boolean</td><td>false</td><td>Show the alert as a non-blocking toast.</td></tr>
                  <tr><td>loaderType</td><td>String</td><td>'hourglass'</td><td>Type of loader: 'hourglass', 'ascii', 'blinking', 'progress'.</td></tr>
                  <tr><td>background</td><td>String</td><td>''</td><td>Custom background color.</td></tr>
                  <tr><td>color</td><td>String</td><td>''</td><td>Custom text color.</td></tr>
                  <tr><td>dir</td><td>String</td><td>'auto'</td><td>Text direction ('rtl' or 'ltr').</td></tr>
                  <tr><td>position</td><td>String</td><td>'center'</td><td>Position: 'top', 'top-end', 'bottom', etc.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="buttons" className="doc-section">
            <h2>Handling Buttons</h2>
            <p>Alert90s supports up to three buttons: Confirm, Deny, and Cancel.</p>
            <div className="card">
              <h3>Three Buttons Example</h3>
              <button onClick={showThreeButtons}>Try me!</button>
              <CodeBlock code={`Alert90s.fire({
  title: "OVERWRITE CONFIG.SYS?",
  showDenyButton: true,
  showCancelButton: true,
  confirmButtonText: "YES",
  denyButtonText: "NO",
  cancelButtonText: "CANCEL"
}).then((result) => {
  if (result.isConfirmed) {
    Alert90s.fire("Confirmed!");
  } else if (result.isDenied) {
    Alert90s.fire("Denied!");
  }
});`} />
            </div>
          </section>

          <section id="css-buttons" className="doc-section">
            <h2>CSS-only Buttons</h2>
            <p>Alert90s ships with a standalone CSS button library. Just add the classes to your own <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code> elements!</p>
            
            <h3>Base Example</h3>
            <div className="card" style={{background: '#e2e8f0'}}>
              <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center'}}>
                <button className="btn90s">Base Button</button>
              </div>
              <CodeBlock code={`<button class="btn90s">Base Button</button>`} />
            </div>

            <h3>Color Variants</h3>
            <div className="card" style={{background: '#e2e8f0'}}>
              <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center'}}>
                <button className="btn90s primary">Primary</button>
                <button className="btn90s success">Success</button>
                <button className="btn90s warning">Warning</button>
                <button className="btn90s danger">Danger</button>
                <button className="btn90s dark">Dark</button>
              </div>
              <CodeBlock code={`<button class="btn90s primary">Primary</button>
<button class="btn90s success">Success</button>
<button class="btn90s warning">Warning</button>
<button class="btn90s danger">Danger</button>
<button class="btn90s dark">Dark</button>`} />
            </div>

            <h3>Sizes</h3>
            <div className="card" style={{background: '#e2e8f0'}}>
              <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'}}>
                <button className="btn90s sm primary">Small</button>
                <button className="btn90s warning">Default</button>
                <button className="btn90s lg danger">Large Size</button>
              </div>
              <CodeBlock code={`<button class="btn90s sm primary">Small</button>
<button class="btn90s warning">Default</button>
<button class="btn90s lg danger">Large Size</button>`} />
            </div>
          </section>

          <section id="tooltips" className="doc-section">
            <h2>Tooltips / Popovers</h2>
            <p>Alert90s includes a lightweight, neo-brutalist tooltip library built-in. Just add <code>data-alert90s-tooltip="Message"</code> to any element!</p>
            
            <div className="card" style={{background: '#e2e8f0'}}>
              <h3>Hover over these buttons</h3>
              <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem'}}>
                <button className="btn90s primary" data-alert90s-tooltip="I appear on top!" data-alert90s-position="top">Top Tooltip</button>
                <button className="btn90s danger" data-alert90s-tooltip="I appear on the bottom!" data-alert90s-position="bottom" data-alert90s-color="pink">Bottom</button>
                <button className="btn90s warning" data-alert90s-tooltip="I'm on the left side" data-alert90s-position="left" data-alert90s-color="base">Left</button>
                <button className="btn90s success" data-alert90s-tooltip="I'm on the right side with a lot of text so you can see how it wraps beautifully in this neo brutalist box!" data-alert90s-position="right" data-alert90s-color="cyan">Right</button>
              </div>
              <CodeBlock code={`<!-- Basic Tooltip (Top default) -->
<button data-alert90s-tooltip="I appear on top!">Hover Me</button>

<!-- Positions (top, bottom, left, right) -->
<button data-alert90s-tooltip="Bottom side!" data-alert90s-position="bottom">Hover</button>

<!-- Colors (yellow, cyan, pink, base, dark) -->
<button data-alert90s-tooltip="Cyan Tooltip" data-alert90s-color="cyan">Hover</button>`} />
            </div>
            <p style={{marginTop: '1.5rem'}}>
              <strong>Note:</strong> Tooltips are initialized automatically on page load. 
              If you load dynamic content later, call <code>Alert90s.initTooltips()</code> to initialize them.
            </p>
          </section>

          <section id="dismissals" className="doc-section">
            <h2>Handling Dismissals</h2>
            <p>You can check the <code>dismiss</code> property on the result object to know how the alert was closed.</p>
            <CodeBlock code={`Alert90s.fire({
  title: "Close me in different ways",
  showCancelButton: true,
  showCloseButton: true,
  timer: 5000
}).then((result) => {
  if (result.isDismissed) {
    console.log("Dismissed by:", result.dismiss); 
    // Values: 'cancel', 'backdrop', 'close', 'timer'
  }
});`} />
          </section>

          <section id="icons" className="doc-section">
            <h2>Icons</h2>
            <p>Alert90s comes with 5 built-in icons: <code>success</code>, <code>error</code>, <code>warning</code>, <code>info</code>, and <code>question</code>.</p>
            <div className="icon-grid">
              <div className="icon-item" onClick={() => Alert90s.fire({icon: 'success', title: 'Success'})}>Success</div>
              <div className="icon-item" onClick={() => Alert90s.fire({icon: 'error', title: 'Error'})}>Error</div>
              <div className="icon-item" onClick={() => Alert90s.fire({icon: 'warning', title: 'Warning'})}>Warning</div>
              <div className="icon-item" onClick={() => Alert90s.fire({icon: 'info', title: 'Info'})}>Info</div>
              <div className="icon-item" onClick={() => Alert90s.fire({icon: 'question', title: 'Question'})}>Question</div>
            </div>
          </section>

          <section id="inputs" className="doc-section">
            <h2>Input Types</h2>
            <p>You can add input fields directly to the alert and handle them asynchronously.</p>
            <div className="card">
              <h3>AJAX Input Example</h3>
              <button onClick={showAjax}>Try me!</button>
              <CodeBlock code={`Alert90s.fire({
  title: "ENTER GITHUB USERNAME",
  input: "text",
  showLoaderOnConfirm: true,
  preConfirm: async (login) => {
    // Return a promise or value
    return fetch(\`https://api.github.com/users/\${login}\`)
      .then(response => response.json());
  }
}).then((result) => {
  if (result.isConfirmed) {
    console.log(result.value);
  }
});`} />
            </div>
          </section>

          <section id="methods" className="doc-section">
            <h2>Methods</h2>
            <ul className="methods-list">
              <li><code>Alert90s.fire(options)</code> / <code>Alert90s.show(options)</code>: Opens the alert.</li>
              <li><code>Alert90s.showLoading()</code>: Shows the loading spinner and hides buttons.</li>
              <li><code>Alert90s.hideLoading()</code>: Hides the loading spinner and restores buttons.</li>
              <li><code>Alert90s.showValidationMessage(message)</code>: Shows a validation error message above the buttons.</li>
              <li><code>Alert90s.resetValidationMessage()</code>: Hides the validation error message.</li>
              <li><code>Alert90s.getPopup()</code>: Returns the DOM element of the current popup.</li>
              <li><code>Alert90s.getTimerLeft()</code>: Returns the remaining time of the auto-close timer in milliseconds.</li>
            </ul>
          </section>

        </main>
      </div>
      
      <footer className="footer">
        <p>Built with Neo Brutalism 90s vibes.</p>
        <p>
          Created by <a href="https://www.dewangga.site/" target="_blank" rel="noopener noreferrer" style={{color: '#ff90e8', textDecoration: 'none', borderBottom: '3px solid #ff90e8', paddingBottom: '2px', transition: 'color 0.2s', display: 'inline-block'}}>Alfansyah Dewangga Rizqita</a>
        </p>
      </footer>
    </div>
  )
}

export default App
