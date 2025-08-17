#NoTrayIcon

; Espera a janela do Overstrike abrir
WinWait, Overstrike
WinActivate, Overstrike
Sleep, 1000

; Aqui simulamos os cliques certos do Overstrike
; Exemplo: abrir menu Mods
Send, !m
Sleep, 500

; Exemplo: instalar todos os mods
Send, a
Sleep, 500

; Confirma se pedir (Enter)
Send, {Enter}
