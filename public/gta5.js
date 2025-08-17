const { ipcRenderer } = require('electron');
const fs = require('fs-extra');
const path = require('path');
const { spawn, execFile } = require('child_process');

let gameFolder = '';
let modsFolder = '';
let installing = false;

async function selectGameFolder() {
  gameFolder = await ipcRenderer.invoke('select-folder');
  alert("Pasta do jogo selecionada: " + gameFolder);
}

async function selectModsFolder() {
  modsFolder = await ipcRenderer.invoke('select-folder');
  alert("Pasta de mods selecionada: " + modsFolder);

  const mods = fs.readdirSync(modsFolder);
  const list = document.getElementById('mods-list');
  list.innerHTML = '';

  mods.forEach(mod => {
    const div = document.createElement('div');
    div.className = "mod-item";
    div.innerHTML = `🟡 Pendente: <strong>${mod}</strong>`;
    list.appendChild(div);
  });
}

async function installMods() {
  if (!gameFolder || !modsFolder) {
    alert("Selecione a pasta do jogo e a pasta de mods primeiro!");
    return;
  }

  installing = true;
  const targetModsFolder = path.join(gameFolder, "Mods");
  fs.ensureDirSync(targetModsFolder);

  const mods = fs.readdirSync(modsFolder);
  const listItems = document.querySelectorAll('#mods-list .mod-item');

  mods.forEach((mod, index) => {
    try {
      fs.copySync(path.join(modsFolder, mod), path.join(targetModsFolder, mod), { overwrite: true });
      listItems[index].innerHTML = `✅ Copiado: <strong>${mod}</strong>`;
    } catch (err) {
      listItems[index].innerHTML = `⚠️ Erro: <strong>${mod}</strong>`;
      listItems[index].title = err.message;
    }
  });

  installing = false;
  alert("Mods instalados com sucesso!");
}

function startGame() {
  if (installing) {
    alert("Aguarde a instalação terminar!");
    return;
  }

  if (!gameFolder) {
    alert("Selecione a pasta do jogo primeiro!");
    return;
  }

  const exePath = path.join(gameFolder, "GTA5.exe");
  if (!fs.existsSync(exePath)) {
    alert("Executável GTA5.exe não encontrado!");
    return;
  }

  spawn(exePath, [], {
    cwd: gameFolder,
    detached: true,
    stdio: 'ignore',
    windowsHide: true
  }).unref();
}
