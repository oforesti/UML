const { ipcRenderer } = require('electron');

// Mostra tela inicial depois do splash
setTimeout(() => {
  document.getElementById('splash').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
}, 2500);

function openGame(game) {
  // Aqui vamos carregar a página específica do jogo
  if (game === 'spiderman') {
    window.location.href = "spiderman.html";
  } else if (game === 'gta') {
    window.location.href = "gta.html";
  } else if (game === 'fifa') {
    window.location.href = "fifa.html";
  }
}
