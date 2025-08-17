const { ipcRenderer } = require('electron');
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

// Opcional: lidar com ZIPs (instale com: npm i extract-zip)
let extractZip;
try { extractZip = require('extract-zip'); } catch (_) { extractZip = null; }

let gameFolder = '';
let modsFolder = '';
let installing = false;

async function selectGameFolder() {
  gameFolder = await ipcRenderer.invoke('select-folder');
  alert('Pasta do jogo selecionada: ' + gameFolder);
}

async function selectModsFolder() {
  modsFolder = await ipcRenderer.invoke('select-folder');
  alert('Pasta de mods (origem) selecionada: ' + modsFolder);

  const list = document.getElementById('mods-list');
  list.innerHTML = '';

  if (!modsFolder) return;
  const entries = fs.readdirSync(modsFolder);

  entries.forEach(item => {
    const div = document.createElement('div');
    div.className = 'mod-item';
    div.innerHTML = `🟡 Pendente: <strong>${item}</strong>`;
    list.appendChild(div);
  });
}

async function installMods() {
  if (!gameFolder || !modsFolder) {
    alert('Selecione a pasta do jogo e a pasta de mods primeiro!');
    return;
  }

  installing = true;
  const targetModsFolder = path.join(gameFolder, 'Mods');
  fs.ensureDirSync(targetModsFolder);

  const sources = fs.readdirSync(modsFolder);
  const listItems = document.querySelectorAll('#mods-list .mod-item');

  for (let i = 0; i < sources.length; i++) {
    const item = sources[i];
    const srcPath = path.join(modsFolder, item);
    const destPath = path.join(targetModsFolder, item.replace(/\.zip$/i, ''));

    try {
      const stat = fs.statSync(srcPath);

      if (stat.isDirectory()) {
        // Copia pasta de mod diretamente
        fs.copySync(srcPath, path.join(targetModsFolder, item), { overwrite: true });
      } else if (/\.zip$/i.test(item)) {
        if (!extractZip) throw new Error('Arquivo ZIP detectado, mas a dependência "extract-zip" não está instalada. Rode: npm i extract-zip');
        fs.ensureDirSync(destPath);
        await extractZip(srcPath, { dir: destPath });
      } else if (/\.dll$/i.test(item)) {
        // Alguns mods são DLLs soltas: colocamos direto em Mods/ (normalmente não é o ideal, mas ajuda)
        fs.copyFileSync(srcPath, path.join(targetModsFolder, item));
      } else {
        // Qualquer outro arquivo solto -> cria uma pasta com o nome base
        const base = path.parse(item).name;
        const baseDir = path.join(targetModsFolder, base);
        fs.ensureDirSync(baseDir);
        fs.copyFileSync(srcPath, path.join(baseDir, path.basename(item)));
      }

      listItems[i].innerHTML = `✅ Instalado: <strong>${item}</strong>`;
    } catch (err) {
      listItems[i].innerHTML = `⚠️ Erro: <strong>${item}</strong>`;
      listItems[i].title = err.message;
      console.error('Falha ao instalar', item, err);
    }
  }

  installing = false;
  alert('Mods instalados com sucesso!');
}

function startGame() {
  if (installing) {
    alert('Aguarde a instalação terminar!');
    return;
  }
  if (!gameFolder) {
    alert('Selecione a pasta do jogo primeiro!');
    return;
  }

  // Preferir SMAPI se existir
  const smapiExe = path.join(gameFolder, 'StardewModdingAPI.exe');
  const vanillaExe = path.join(gameFolder, 'Stardew Valley.exe');

  let exePath = '';
  if (fs.existsSync(smapiExe)) {
    exePath = smapiExe;
  } else if (fs.existsSync(vanillaExe)) {
    exePath = vanillaExe;
  } else {
    alert('Executável do Stardew não encontrado! Verifique se SMAPI ou o jogo estão corretamente instalados.');
    return;
  }

  try {
    spawn(exePath, [], {
      cwd: gameFolder,
      detached: true,
      stdio: 'ignore',
      windowsHide: true
    }).unref();
  } catch (err) {
    alert('Falha ao iniciar o jogo: ' + err.message);
  }
}

// Expor as funções no escopo global (para os botões do HTML)
window.selectGameFolder = selectGameFolder;
window.selectModsFolder = selectModsFolder;
window.installMods = installMods;
window.startGame = startGame;