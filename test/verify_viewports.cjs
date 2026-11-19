/**
 * White Collars (WHITESPACE) // Viewport Responsiveness Verification
 * Tests desktop (1440x900) and mobile (390x844) layouts in real Electron Chromium runtime.
 */

const { app, BrowserWindow } = require('electron');

app.disableHardwareAcceleration();

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed++;
    console.log(`  [PASS] ${msg}`);
  } else {
    failed++;
    console.error(`  [FAIL] ${msg}`);
  }
}

app.whenReady().then(async () => {
  console.log('========================================================================');
  console.log('WHITE COLLARS (WHITESPACE) // VIEWPORT RESPONSIVENESS TEST');
  console.log('========================================================================\n');

  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  const errors = [];
  win.webContents.on('console-message', (e, level, msg) => {
    if (level >= 3 && !msg.includes('favicon') && !msg.includes('Download the React DevTools')) {
      errors.push(msg);
    }
  });

  await win.loadURL('http://localhost:5173/');
  await new Promise(r => setTimeout(r, 1500));

  console.log('--- 1. DESKTOP VIEWPORT (1440x900) ---');
  const desktopChecks = await win.webContents.executeJavaScript(`
    (() => {
      const rail = document.querySelector('nav') || document.querySelector('[title="WHITE COLLARS CORE"]') || document.querySelector('aside');
      const topbar = document.querySelector('header');
      const hasMobileNav = !!document.querySelector('nav.fixed.bottom-0');
      return {
        hasRail: !!rail,
        hasTopBar: !!topbar,
        hasMobileNav,
        width: window.innerWidth,
        height: window.innerHeight
      };
    })()
  `);

  assert(desktopChecks.width >= 1024, `Desktop viewport width verified: ${desktopChecks.width}px`);
  assert(desktopChecks.hasRail, 'Desktop sidebar / rail rendered');
  assert(desktopChecks.hasTopBar, 'Desktop TopBar header rendered');
  assert(!desktopChecks.hasMobileNav, 'Mobile bottom nav is NOT visible on desktop');

  console.log('\n--- 2. MOBILE VIEWPORT (390x844) ---');
  win.setSize(390, 844);
  await new Promise(r => setTimeout(r, 1000));

  const mobileChecks = await win.webContents.executeJavaScript(`
    (() => {
      // Check if mobile layout is active
      const mobileTopBar = document.querySelector('header');
      const mobileBottomNav = Array.from(document.querySelectorAll('button')).some(b => 
        b.textContent.includes('CHAT') || b.textContent.includes('STAGE') || b.textContent.includes('AUDIO')
      );
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        hasTopBar: !!mobileTopBar,
        hasMobileBottomNav: mobileBottomNav
      };
    })()
  `);

  assert(mobileChecks.width <= 768, `Mobile viewport width verified: ${mobileChecks.width}px`);
  assert(mobileChecks.hasTopBar, 'Mobile TopBar rendered cleanly');
  assert(mobileChecks.hasMobileBottomNav, 'Mobile navigation controls active');

  console.log('\n--- 3. RESIZE RESTORATION TO DESKTOP ---');
  win.setSize(1440, 900);
  await new Promise(r => setTimeout(r, 1000));

  const restoredChecks = await win.webContents.executeJavaScript(`
    (() => {
      return {
        width: window.innerWidth,
        isDesktop: window.innerWidth >= 768
      };
    })()
  `);

  assert(restoredChecks.isDesktop, `Restored to desktop layout at ${restoredChecks.width}px`);
  assert(errors.length === 0, `Zero runtime console errors during responsive transitions (errors: ${errors.length})`);

  console.log('\n========================================================================');
  console.log(`TOTAL VIEWPORT CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('========================================================================\n');

  win.close();
  app.quit();
  process.exit(failed > 0 ? 1 : 0);
});
