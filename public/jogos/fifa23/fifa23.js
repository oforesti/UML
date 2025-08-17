const { ipcRenderer } = require('electron');
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

let gameFolder = '';
let modsFolder = '';
let installing = false;

async function selectGameFolder() {
  gameFolder = await ipcRenderer.invoke('select-folder');
  alert("Pasta do FIFA 23 selecionada: " + gameFolder);
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

  fs.readdirSync(modsFolder).forEach(mod => {
    fs.copySync(path.join(modsFolder, mod), path.join(targetModsFolder, mod), { overwrite: true });
  });

  installing = false;
  alert("Mods do FIFA 23 instalados com sucesso!");
}

function startGame() {
  if (!gameFolder) {
    alert("Selecione a pasta do jogo primeiro!");
    return;
  }

  const exePath = path.join(gameFolder, "FIFA23.exe");
  if (!fs.existsSync(exePath)) {
    alert("Executável FIFA23.exe não encontrado!");
    return;
  }

  spawn(exePath, [], { cwd: gameFolder, detached: true, stdio: 'ignore', windowsHide: true }).unref();
}
