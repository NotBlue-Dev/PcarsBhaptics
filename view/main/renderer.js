const { ipcRenderer } = require('electron');
const fs = require('fs');

const path = require('path');

// electron

const replaceText = (selector, text, color) => {
  const element = document.querySelector(selector);
  element && (element.innerText = text);
  element && color && (element.style.color = color);
};

const logInElement = (console, element) => {
  if (!console) {
    console = {};
  }
  console.log = function (message, register = true) {
    register && ipcRenderer.send('log', message);
    const d = new Date();
    const n = d.toLocaleTimeString();
    if (typeof message === 'object') {
      element.innerHTML += `${JSON && JSON.stringify ? JSON.stringify(message) : String(message)}<br />`;
    } else {
      element.innerHTML += `[${n}] ${message}<br />`;
    }
  };
};

window.addEventListener('DOMContentLoaded', () => {
  logInElement(console, document.getElementById('logging'));

  const optionsElement = document.getElementById('opts');
  optionsElement && optionsElement.addEventListener('click', () => {
    window.location.href = '../settings/index.html';
  });

  fs.readFile(path.join(__dirname, '../../package.json'), 'utf8', (err, data) => {
    replaceText('#appversion', JSON.parse(data).version);
  });

  const closeElement = document.getElementById('close');
  closeElement && closeElement.addEventListener('click', () => {
    ipcRenderer.send('close')
  });

  ipcRenderer.on('tact-device-connecting', () => {
    console.log('Connecting…');
  });

  ipcRenderer.on('tact-device-connected', (arg) => {
    const name = arg.name || 'Haptic';
    console.log(`Connected to ${name}`);
    replaceText('#statusHaptic', 'Running and ready to go', '#00D832');
  });

  ipcRenderer.on('tact-device-disconnected', () => {
    console.log('/!\\ Disconnected');
    replaceText('#statusHaptic', 'Not Running !', '#FFBB00');
  });

  ipcRenderer.on('tact-device-fileLoaded', (event, arg) => {
    console.log(`File loaded ${arg}`);
  });

  ipcRenderer.on('data-updated', (event, arg) => {
    replaceText('#statusHaptic', arg.statusHaptic ? 'Running and ready to go' : 'Not Running !', arg.statusHaptic ? '#00D832' : '#FFBB00');
    arg.logs.forEach((message) => console.log(message, false));
  });

  ipcRenderer.send('get-data');
});
