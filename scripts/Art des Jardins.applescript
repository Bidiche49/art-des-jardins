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
		display dialog "Premiere installation." & return & "Votre mot de passe Mac va etre demande." buttons {"Continuer"} default button 1 with icon note
		do shell script "curl -sL https://nodejs.org/dist/v22.14.0/node-v22.14.0.pkg -o /tmp/node-install.pkg && installer -pkg /tmp/node-install.pkg -target / && rm -f /tmp/node-install.pkg" with administrator privileges
	end try

	-- 3. Installer pnpm si besoin
	try
		do shell script "export PATH=/usr/local/bin:$PATH && pnpm --version"
	on error
		do shell script "export PATH=/usr/local/bin:$PATH && npm install -g pnpm" with administrator privileges
	end try

	-- 4. Cloner le projet si besoin
	try
		do shell script "test -d " & quoted form of projectDir
	on error
		display dialog "Telechargement du site..." & return & "(1-2 minutes)" buttons {"OK"} default button 1 giving up after 2 with icon note
		do shell script "export PATH=/usr/local/bin:$PATH && git clone --quiet https://github.com/Bidiche49/art-des-jardins.git " & quoted form of projectDir
	end try

	-- 5. Demarrer le serveur en arriere-plan
	my startServer(projectDir)

	-- 6. Attendre que le serveur soit pret
	my waitForServer()

	-- 7. Ouvrir le navigateur
	my openBrowser()

	-- 8. Boucle de controle
	repeat
		set userChoice to button returned of (display dialog "Le site Art des Jardins est en ligne." & return & return & "Adresse : http://localhost:3001" buttons {"Relancer", "Arreter"} default button "Arreter" with icon note)

		if userChoice is "Arreter" then
			my stopServer()
			exit repeat
		else
			my stopServer()
			delay 1
			my startServer(projectDir)
			my waitForServer()
			my openBrowser()
		end if
	end repeat
end run

on startServer(projectDir)
	do shell script "bash " & quoted form of (projectDir & "scripts/start-server.sh")
end startServer

on stopServer()
	try
		do shell script "lsof -ti:3001 | xargs kill 2>/dev/null; rm -f /tmp/art-des-jardins.pid /tmp/art-des-jardins.log"
	end try
end stopServer

on waitForServer()
	repeat 30 times
		try
			do shell script "curl -s -o /dev/null http://localhost:3001"
			exit repeat
		end try
		delay 1
	end repeat
end waitForServer

on openBrowser()
	try
		do shell script "open -a 'Google Chrome' http://localhost:3001 2>/dev/null || open -a 'Safari' http://localhost:3001 2>/dev/null || open http://localhost:3001"
	end try
end openBrowser
