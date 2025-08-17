#NoTrayIcon

; Espera a janela Overstrike abrir
WinWait, Overstrike
WinActivate, Overstrike
Sleep, 1500

; *** Clica no botão "Adicionar Mods" ***
; Ajuste coordenadas do botão
Click, 1422, 380
Sleep, 1500

; *** Seleciona a pasta Mods ***
; Digita o caminho da pasta Mods do jogo
Send, C:\Games\by Decepticon\Marvels Spider-Man 2\Mods{Enter}
Sleep, 1500

; *** Seleciona todos os mods (Ctrl+A) ***
Send, ^a
Sleep, 1000

; *** Clica no botão "Abrir" ***
Send, {Enter}
Sleep, 2000

; *** Clica no botão "Instalar Todos" ***
; Ajuste coordenadas do botão "Instalar"
Click, 1268, 833
Sleep, 2000

; Se aparecer confirmação, confirma
Send, {Enter}
