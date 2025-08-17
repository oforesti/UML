#NoTrayIcon

; Aguarda a janela do Overstrike abrir
WinWait, Overstrike
WinActivate, Overstrike
Sleep, 1000

; Aqui vão os cliques exatos:
; Abre o menu Mods
Send, !m
Sleep, 500

; Seleciona "Instalar todos os mods"
Send, a
Sleep, 500

; Confirma se pedir confirmação
Send, {Enter}
Sleep, 500
