const { ipcRenderer } = require('electron');
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

let gameFolder = '';
let modsFolder = '';

async function selectGameFolder() {
  gameFolder = await ipcRenderer.invoke('select-folder');
  alert("Pasta do Valheim selecionada: " + gameFolder);
}

async function selectModsFolder() {
  modsFolder = await ipcRenderer.invoke('select-folder');
  alert("Pasta de mods selecionada: " + modsFolder);
}

async function installMods() {
  if (!gameFolder || !modsFolder) {
    alert("Selecione as pastas primeiro!");
    return;
  }

  const targetModsFolder = path.join(gameFolder, "BepInEx/plugins");
  fs.ensureDirSync(targetModsFolder);

  fs.readdirSync(modsFolder).forEach(mod => {
    fs.copySync(path.join(modsFolder, mod), path.join(targetModsFolder, mod), { overwrite: true });
  });

  alert("Mods do Valheim instalados com sucesso!");
}

function startGame() {
  if (!gameFolder) {
    alert("Selecione a pasta do jogo primeiro!");
    return;
  }

  const exePath = path.join(gameFolder, "valheim.exe");
  if (!fs.existsSync(exePath)) {
    alert("Executável valheim.exe não encontrado!");
    return;
  }

  spawn(exePath, [], { cwd: gameFolder, detached: true, stdio: 'ignore', windowsHide: true }).unref();
}
