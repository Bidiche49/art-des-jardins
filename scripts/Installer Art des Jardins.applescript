on run
	-- Ecran d'accueil
	display dialog "Bienvenue !" & return & return & "Ce programme va installer le site Art des Jardins sur votre Mac." & return & "Cela prend environ 5 minutes." & return & return & "Votre mot de passe Mac sera demande une fois." buttons {"Annuler", "Installer"} default button "Installer" with icon note
	if button returned of result is "Annuler" then return

	-- 1. Verifier git (Xcode CLI tools)
	try
		do shell script "/usr/bin/xcode-select -p"
	on error
		do shell script "/usr/bin/xcode-select --install"
		display dialog "Une fenetre d'installation s'est ouverte." & return & return & "1. Cliquez sur 'Installer'" & return & "2. Attendez la fin" & return & "3. Relancez ce programme" buttons {"OK, j'ai compris"} default button 1 with icon caution
		return
	end try

	-- 2. Installer Node.js si besoin
	try
		do shell script "/usr/local/bin/node --version"
	on error
		do shell script "curl -sL https://nodejs.org/dist/v22.14.0/node-v22.14.0.pkg -o /tmp/node-install.pkg && installer -pkg /tmp/node-install.pkg -target / && rm -f /tmp/node-install.pkg" with administrator privileges
	end try

	-- 3. Installer pnpm si besoin
	try
		do shell script "export PATH=/usr/local/bin:$PATH && pnpm --version"
	on error
		do shell script "export PATH=/usr/local/bin:$PATH && npm install -g pnpm" with administrator privileges
	end try

	-- 4. Telecharger le projet si besoin
	set userHome to POSIX path of (path to home folder)
	set projectDir to userHome & "Desktop/art-des-jardins"

	try
		do shell script "test -d " & quoted form of projectDir
	on error
		do shell script "export PATH=/usr/local/bin:$PATH && git clone --quiet https://github.com/Bidiche49/art-des-jardins.git " & quoted form of projectDir
	end try

	-- 5. Installer les dependances
	do shell script "export PATH=/usr/local/bin:$PATH && cd " & quoted form of projectDir & " && pnpm install --silent"

	-- Succes
	display dialog "Installation terminee !" & return & return & "Le site va s'ouvrir dans votre navigateur." & return & return & "Les prochaines fois, double-cliquez sur :" & return & "Bureau > art-des-jardins > scripts > Art des Jardins.app" buttons {"Lancer le site"} default button 1 with icon note

	-- Lancer le site
	tell application "Terminal"
		activate
		do script "cd " & quoted form of projectDir & " && export PATH=/usr/local/bin:$PATH && (while ! curl -s http://localhost:3001 >/dev/null 2>&1; do sleep 1; done; open http://localhost:3001) & pnpm dev:vitrine"
	end tell
end run
