on run
	set projectDir to (POSIX path of (path to home folder)) & "Desktop/art-des-jardins/"

	tell me to activate

	-- 1. Git
	try
		do shell script "/usr/bin/xcode-select -p"
	on error
		display dialog "Des outils doivent etre installes." & return & return & "Une fenetre va s'ouvrir : cliquez 'Installer'." & return & "Quand c'est fini, relancez cette app." buttons {"Annuler", "OK"} default button "OK" cancel button "Annuler" with icon note
		do shell script "/usr/bin/xcode-select --install"
		return
	end try

	-- 2. Node.js
	try
		do shell script "/usr/local/bin/node --version"
	on error
		display notification "Installation de Node.js..." with title "Art des Jardins"
		try
			do shell script "curl -sL https://nodejs.org/dist/v22.14.0/node-v22.14.0.pkg -o /tmp/node-install.pkg && installer -pkg /tmp/node-install.pkg -target / && rm -f /tmp/node-install.pkg" with administrator privileges
		on error errMsg
			if errMsg contains "User canceled" then return
			tell me to activate
			display dialog "Erreur Node.js : " & errMsg buttons {"OK"} with icon stop
			return
		end try
	end try

	-- 3. pnpm
	try
		do shell script "export PATH=/usr/local/bin:$PATH && pnpm --version"
	on error
		display notification "Installation de pnpm..." with title "Art des Jardins"
		try
			do shell script "export PATH=/usr/local/bin:$PATH && npm install -g pnpm" with administrator privileges
		on error errMsg
			if errMsg contains "User canceled" then return
			tell me to activate
			display dialog "Erreur pnpm : " & errMsg buttons {"OK"} with icon stop
			return
		end try
	end try

	-- 4. Cloner le projet
	try
		do shell script "test -d " & quoted form of projectDir
	on error
		display notification "Telechargement du site..." with title "Art des Jardins"
		try
			do shell script "export PATH=/usr/local/bin:$PATH && git clone --quiet https://github.com/Bidiche49/art-des-jardins.git " & quoted form of projectDir
		on error errMsg
			tell me to activate
			display dialog "Erreur telechargement : " & errMsg buttons {"OK"} with icon stop
			return
		end try
	end try

	-- Demarrer le site
	my startAndShow(projectDir)

	-- Boucle de controle
	repeat
		tell me to activate
		set userChoice to button returned of (display dialog "Le site Art des Jardins est en ligne !" & return & return & "http://localhost:3001" buttons {"Relancer", "Arreter"} default button "Arreter" with icon note)

		if userChoice is "Arreter" then
			my stopServer()
			exit repeat
		else
			my stopServer()
			delay 1
			my startAndShow(projectDir)
		end if
	end repeat
end run

on startAndShow(projectDir)
	display notification "Preparation du site (peut prendre 1-2 min)..." with title "Art des Jardins"

	-- Lancer le script entierement en arriere-plan (ne bloque pas l'app)
	do shell script "bash " & quoted form of (projectDir & "scripts/start-server.sh") & " >/dev/null 2>&1 &"

	-- Attendre que le serveur soit pret (max 3 min pour premier install)
	repeat 180 times
		-- Verifier les erreurs de setup
		try
			set statusContent to do shell script "cat /tmp/art-des-jardins.status 2>/dev/null"
			if statusContent starts with "error:" then
				set errDetail to text 7 thru -1 of statusContent
				tell me to activate
				display dialog "Erreur : " & errDetail & return & return & "Details dans /tmp/art-des-jardins.log" buttons {"OK"} with icon stop
				return
			end if
		end try

		-- Verifier si le serveur repond
		try
			do shell script "curl -s -o /dev/null -m 2 http://localhost:3001"
			exit repeat
		end try
		delay 1
	end repeat

	my openBrowser()
end startAndShow

on stopServer()
	try
		do shell script "lsof -ti:3001 | xargs kill 2>/dev/null; rm -f /tmp/art-des-jardins.pid /tmp/art-des-jardins.status"
	end try
	delay 1
end stopServer

on openBrowser()
	try
		do shell script "open -a 'Google Chrome' http://localhost:3001 2>/dev/null || open -a 'Safari' http://localhost:3001 2>/dev/null || open http://localhost:3001"
	end try
end openBrowser
