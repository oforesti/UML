const { ipcRenderer } = require('electron');
const fs = require('fs-extra');
const path = require('path');
const { spawn, execFile } = require('child_process');

let gameFolder = '';
let modsFolder = '';
let installing = false;

function goBack() {
  if (installing) {
    alert("Aguarde a instalação terminar antes de voltar!");
    return;
  }
  window.location.href = "index.html";
}

async function selectGameFolder() {
  gameFolder = await ipcRenderer.invoke('select-folder');
  alert("Pasta do jogo selecionada: " + gameFolder);
}

async function selectModsFolder() {
  modsFolder = await ipcRenderer.invoke('select-folder');
  alert("Pasta de mods selecionada: " + modsFolder);

  // Lista os mods na interface
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

  // Copia mods para a pasta Mods
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

  // Exibe status no app
  const status = document.createElement('div');
  status.id = "status-bar";
  status.innerHTML = "⏳ Abrindo Overstrike...";
  document.getElementById('mods-list').appendChild(status);

  // Caminho do Overstrike
  const overstrikePath = path.join(__dirname, '..', 'Overstrike.exe');
  console.log("🔹 Iniciando Overstrike:", overstrikePath);

  // Abre o Overstrike visível
  spawn(overstrikePath, [], {
    cwd: gameFolder,
    detached: true,
    stdio: 'ignore',
    windowsHide: false // precisa ser visível para AutoHotkey clicar
  }).unref();

  // Caminho do AutoHotkey e script
  const ahkScriptPath = path.join(__dirname, 'auto_click_coords.ahk');
  const ahkExe = "AutoHotkey.exe"; // se não estiver no PATH, usar caminho completo

  // Aguarda Overstrike abrir e chama o AHK
  setTimeout(() => {
    console.log("🔹 Executando AutoHotkey...");
    console.log("🔹 Caminho script AHK:", ahkScriptPath);

    execFile(ahkExe, [ahkScriptPath], { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Erro ao iniciar AHK:", error.message);
        status.innerHTML = "❌ Erro ao iniciar o AutoHotkey. Veja o console.";
      } else {
        console.log("✅ AutoHotkey iniciado com sucesso");
        status.innerHTML = "⏳ AutoHotkey está instalando os mods... NÃO mexa no Overstrike!";
      }
    });
  }, 5000);

  // Finaliza (provisório: tempo estimado)
  setTimeout(() => {
    status.innerHTML = "✅ Instalação finalizada! Agora clique em Iniciar Jogo.";
    installing = false;
  }, 45000);
}

function startGame() {
  if (installing) {
    alert("Aguarde a instalação terminar antes de iniciar o jogo!");
    return;
  }

  if (!gameFolder) {
    alert("Selecione a pasta do jogo primeiro!");
    return;
  }

  const exePath = path.join(gameFolder, "Spider-Man2.exe");
  if (!fs.existsSync(exePath)) {
    alert("Executável do jogo não encontrado!");
    return;
  }

  spawn(exePath, [], {
    cwd: gameFolder,
    detached: true,
    stdio: 'ignore',
    windowsHide: true
  }).unref();
}

function restoreTOC() {
  if (!gameFolder) {
    alert("Selecione a pasta do jogo primeiro!");
    return;
  }

  const tocBak = path.join(gameFolder, "toc.BAK");
  const toc = path.join(gameFolder, "toc");

  if (fs.existsSync(tocBak)) {
    fs.copySync(tocBak, toc, { overwrite: true });
    alert("TOC restaurado!");
  } else {
    alert("Backup toc.BAK não encontrado.");
  }
}
