noremap j h
noremap k gj
noremap i gk
noremap H I
noremap h i

nmap K <C-d>zz
nmap I <C-u>zz


map L $
map J ^

nmap d<Cr> 'di
nmap y<Cr> 'yi
nmap v<Cr> 'vi
nmap c<Cr> 'ci

nmap dw diw
nmap yw yiw
nmap vw viw
nmap cw ciw

exmap foldAll obcommand editor:fold-all
nmap zM :foldAll
exmap unfoldAll obcommand editor:unfold-all
nmap zR :unfoldAll
exmap toggleFold obcommand editor:toggle-fold
nmap za :toggleFold
imap <C-s> <Esc>
