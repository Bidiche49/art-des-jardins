on run
	set projectDir to (POSIX path of (path to home folder)) & "Desktop/art-des-jardins/"

	tell me to activate

	-- 1. Git
	try
		do shell script "/usr/bin/xcode-select -p"
	on error
		display dialog "Etape 1/4 : Installation des outils de base." & return & return & "Une fenetre va s'ouvrir." & return & "Cliquez 'Installer', attendez la fin, puis relancez cette app." buttons {"OK"} default button 1 with icon note
		do shell script "/usr/bin/xcode-select --install"
		return
	end try

	-- 2. Node.js
	try
		do shell script "/usr/local/bin/node --version"
	on error
		tell me to activate
		display dialog "Etape 2/4 : Installation de Node.js." & return & "Votre mot de passe Mac va etre demande." buttons {"Continuer"} default button 1 with icon note
		try
			do shell script "curl -sL https://nodejs.org/dist/v22.14.0/node-v22.14.0.pkg -o /tmp/node-install.pkg && installer -pkg /tmp/node-install.pkg -target / && rm -f /tmp/node-install.pkg" with administrator privileges
		on error errMsg
			display dialog "Erreur installation Node.js :" & return & errMsg buttons {"OK"} default button 1 with icon stop
			return
		end try
	end try

	-- 3. pnpm
	try
		do shell script "export PATH=/usr/local/bin:$PATH && pnpm --version"
	on error
		try
			do shell script "export PATH=/usr/local/bin:$PATH && npm install -g pnpm" with administrator privileges
		on error errMsg
			tell me to activate
			display dialog "Erreur installation pnpm :" & return & errMsg buttons {"OK"} default button 1 with icon stop
			return
		end try
	end try

	-- 4. Cloner le projet
	try
		do shell script "test -d " & quoted form of projectDir
	on error
		tell me to activate
		display dialog "Etape 4/4 : Telechargement du site..." & return & "(1-2 minutes)" buttons {"Telecharger"} default button 1 with icon note
		try
			do shell script "export PATH=/usr/local/bin:$PATH && git clone --quiet https://github.com/Bidiche49/art-des-jardins.git " & quoted form of projectDir
		on error errMsg
			tell me to activate
			display dialog "Erreur telechargement :" & return & errMsg buttons {"OK"} default button 1 with icon stop
			return
		end try
	end try

	-- Demarrer le site
	my startAndShow(projectDir)

	-- Boucle de controle
	repeat
		tell me to activate
		set userChoice to button returned of (display dialog "Le site Art des Jardins est en ligne !" & return & return & "Adresse : http://localhost:3001" & return & return & "Cliquez Arreter quand vous avez fini." buttons {"Relancer", "Arreter"} default button "Arreter" with icon note)

		if userChoice is "Arreter" then
			my stopServer()
			tell me to activate
			display dialog "Site arrete. A bientot !" buttons {"OK"} default button 1 giving up after 3 with icon note
			exit repeat
		else
			my stopServer()
			delay 1
			my startAndShow(projectDir)
		end if
	end repeat
end run

on startAndShow(projectDir)
	tell me to activate
	display dialog "Demarrage du site..." & return & "(30 secondes environ)" buttons {"OK"} default button 1 giving up after 2 with icon note

	try
		do shell script "bash " & quoted form of (projectDir & "scripts/start-server.sh")
	on error errMsg
		tell me to activate
		display dialog "Erreur demarrage :" & return & errMsg buttons {"OK"} default button 1 with icon stop
		return
	end try

	-- Attendre que le serveur reponde
	repeat 60 times
		try
			do shell script "curl -s -o /dev/null http://localhost:3001"
			exit repeat
		end try
		delay 1
	end repeat

	my openBrowser()
end startAndShow

on stopServer()
	try
		do shell script "lsof -ti:3001 | xargs kill 2>/dev/null; rm -f /tmp/art-des-jardins.pid"
	end try
	delay 1
end stopServer

on openBrowser()
	try
		do shell script "open -a 'Google Chrome' http://localhost:3001 2>/dev/null || open -a 'Safari' http://localhost:3001 2>/dev/null || open http://localhost:3001"
	end try
end openBrowser
