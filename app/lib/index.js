
'use strict';

const path = require('path');
const open = require('open');
const {
  app,
  ipcMain,
  BrowserWindow
} = require('electron');
const Menus = require('./menus.js');

let menus;


app.on('ready', () => {
  const iconPath = path.join(app.getAppPath(), 'lib/assets/icons/icon-96x96.png');
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    iconPath,
    autoHideMenuBar: true,

    webPreferences: {
      partition: 'persist:whatsapp',
      preload: path.join(__dirname, 'browser', 'index.js'),
      nodeIntegration: false,
      zoomFactor: 0.85
    }
  });
  menus = new Menus(iconPath);
  menus.register(window);

  window.on('page-title-updated', (event, title) => window.webContents.send('page-title', title));

  ipcMain.on('nativeNotificationClick', (event) => {
    window.show();
    window.focus();
  });

  window.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    open(url, (err) => {
      if (err) {
        console.error(`exec error: ${err.message}`);
      }
    });
  });

  window.webContents.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36');
  window.loadURL('https://web.whatsapp.com/');

 // if (process.env.WEB_DEBUG) {
    window.openDevTools();
 // }
});
