on run
	set projectDir to (POSIX path of (path to home folder)) & "Desktop/art-des-jardins/"

	-- 1. Verifier git (Xcode CLI tools)
	try
		do shell script "/usr/bin/xcode-select -p"
	on error
		display dialog "Bienvenue !" & return & return & "On va d'abord installer quelques outils." & return & "Cliquez sur 'Installer' dans la fenetre qui va s'ouvrir, attendez la fin, puis relancez cette app." buttons {"OK"} default button 1 with icon note
		do shell script "/usr/bin/xcode-select --install"
		return
	end try

	-- 2. Installer Node.js si besoin
	try
		do shell script "/usr/local/bin/node --version"
	on error
		display dialog "Premiere installation detectee." & return & return & "Installation de Node.js en cours..." & return & "Votre mot de passe Mac va etre demande." buttons {"Continuer"} default button 1 with icon note
		do shell script "curl -sL https://nodejs.org/dist/v22.14.0/node-v22.14.0.pkg -o /tmp/node-install.pkg && installer -pkg /tmp/node-install.pkg -target / && rm -f /tmp/node-install.pkg" with administrator privileges
	end try

	-- 3. Installer pnpm si besoin
	try
		do shell script "export PATH=/usr/local/bin:$PATH && pnpm --version"
	on error
		display dialog "Installation de pnpm..." buttons {"OK"} default button 1 giving up after 2 with icon note
		do shell script "export PATH=/usr/local/bin:$PATH && npm install -g pnpm" with administrator privileges
	end try

	-- 4. Cloner le projet si besoin
	try
		do shell script "test -d " & quoted form of projectDir
	on error
		display dialog "Telechargement du projet..." & return & "(1-2 minutes)" buttons {"OK"} default button 1 giving up after 2 with icon note
		do shell script "export PATH=/usr/local/bin:$PATH && git clone --quiet https://github.com/Bidiche49/art-des-jardins.git " & quoted form of projectDir
	end try

	-- 5. Lancer le script qui gere tout (update + serveur + navigateur)
	tell application "Terminal"
		activate
		do script "bash " & quoted form of (projectDir & "scripts/run-vitrine.sh")
	end tell
end run
