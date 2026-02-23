import Cocoa
import CoreText

// MARK: - Theme (palette olive Art des Jardins)

private enum Theme {
    static let primary     = NSColor(srgbRed: 0.341, green: 0.420, blue: 0.231, alpha: 1) // #576b3b
    static let primaryDark = NSColor(srgbRed: 0.239, green: 0.298, blue: 0.161, alpha: 1) // #3d4c29
    static let logBg       = NSColor(srgbRed: 0.976, green: 0.980, blue: 0.969, alpha: 1) // #f9faf7
    static let text        = NSColor(srgbRed: 0.20, green: 0.20, blue: 0.20, alpha: 1)

    static let monoFont  = NSFont.monospacedSystemFont(ofSize: 11, weight: .regular)

    // Cormorant Garamond (meme police que le header du site vitrine)
    static let serifFont: NSFont = {
        // Charger depuis le bundle Resources
        if let bundlePath = Bundle.main.url(forResource: "CormorantGaramond-Bold", withExtension: "ttf") {
            CTFontManagerRegisterFontsForURL(bundlePath as CFURL, .process, nil)
        }
        return NSFont(name: "Cormorant Garamond Bold", size: 24)
            ?? NSFont(name: "CormorantGaramond-Bold", size: 24)
            ?? NSFont(name: "Georgia-Bold", size: 22)
            ?? NSFont.boldSystemFont(ofSize: 22)
    }()
}

// MARK: - App Delegate

class AppDelegate: NSObject, NSApplicationDelegate {

    private var window: NSWindow!
    private var logoView: NSImageView!
    private var statusDot: NSView!
    private var statusLabel: NSTextField!
    private var logTextView: NSTextView!
    private var openButton: NSButton!
    private var restartButton: NSButton!
    private var stopButton: NSButton!
    private var shareButton: NSButton!

    private var serverProcess: Process?
    private var serverReady = false

    // ~/art-des-jardins (PAS ~/Desktop — evite les popups de permission TCC)
    private let projectPath = NSHomeDirectory() + "/art-des-jardins"

    private var shellEnv: [String: String] {
        var env = ProcessInfo.processInfo.environment
        env["PATH"] = "/usr/local/bin:/opt/homebrew/bin:" + (env["PATH"] ?? "/usr/bin:/bin")
        return env
    }

    // MARK: Lifecycle

    func applicationDidFinishLaunching(_ n: Notification) {
        buildUI()
        DispatchQueue.global(qos: .userInitiated).async { self.setup() }
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { true }

    func applicationWillTerminate(_ n: Notification) { killServer() }

    // MARK: UI

    private func buildUI() {
        let W: CGFloat = 560, H: CGFloat = 500

        window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: W, height: H),
            styleMask: [.titled, .closable, .miniaturizable],
            backing: .buffered, defer: false
        )
        window.title = "Art des Jardins"
        window.center()
        window.isReleasedWhenClosed = false
        // Forcer le mode clair (le site est clair, les boutons doivent etre visibles)
        window.appearance = NSAppearance(named: .aqua)
        window.backgroundColor = .white

        let v = window.contentView!
        let m: CGFloat = 24

        // -- Title bar --
        logoView = NSImageView(frame: NSRect(x: m, y: H - 52, width: 28, height: 28))
        logoView.imageScaling = .scaleProportionallyUpOrDown
        v.addSubview(logoView)
        loadLogo()

        let title = NSTextField(labelWithString: "Art des Jardins")
        title.frame = NSRect(x: m + 36, y: H - 55, width: 300, height: 32)
        title.font = Theme.serifFont
        title.textColor = Theme.primary
        v.addSubview(title)

        let sep = NSBox(frame: NSRect(x: m, y: H - 68, width: W - 2*m, height: 1))
        sep.boxType = .separator
        v.addSubview(sep)

        // -- Status --
        statusDot = NSView(frame: NSRect(x: m, y: H - 90, width: 10, height: 10))
        statusDot.wantsLayer = true
        statusDot.layer?.cornerRadius = 5
        statusDot.layer?.backgroundColor = NSColor.systemOrange.cgColor
        v.addSubview(statusDot)

        statusLabel = NSTextField(labelWithString: "Démarrage...")
        statusLabel.frame = NSRect(x: m + 18, y: H - 95, width: W - 2*m - 18, height: 20)
        statusLabel.font = .systemFont(ofSize: 13, weight: .medium)
        statusLabel.textColor = .secondaryLabelColor
        v.addSubview(statusLabel)

        // -- Log area --
        let logTop = H - 108
        let logBot: CGFloat = 60
        let scroll = NSScrollView(frame: NSRect(x: m, y: logBot, width: W - 2*m, height: logTop - logBot))
        scroll.hasVerticalScroller = true
        scroll.autohidesScrollers = false
        scroll.borderType = .noBorder
        scroll.wantsLayer = true
        scroll.layer?.cornerRadius = 8
        scroll.layer?.borderWidth = 1
        scroll.layer?.borderColor = NSColor.separatorColor.cgColor

        let cw = scroll.contentSize.width
        logTextView = NSTextView(frame: NSRect(x: 0, y: 0, width: cw, height: 0))
        logTextView.minSize = NSSize(width: 0, height: scroll.contentSize.height)
        logTextView.maxSize = NSSize(width: CGFloat.greatestFiniteMagnitude, height: CGFloat.greatestFiniteMagnitude)
        logTextView.isEditable = false
        logTextView.isSelectable = true
        logTextView.backgroundColor = Theme.logBg
        logTextView.font = Theme.monoFont
        logTextView.textColor = Theme.text
        logTextView.textContainerInset = NSSize(width: 10, height: 10)
        logTextView.isVerticallyResizable = true
        logTextView.isHorizontallyResizable = false
        logTextView.autoresizingMask = [.width]
        logTextView.textContainer?.containerSize = NSSize(width: cw, height: CGFloat.greatestFiniteMagnitude)
        logTextView.textContainer?.widthTracksTextView = true
        scroll.documentView = logTextView
        v.addSubview(scroll)

        // -- Buttons (style vert olive — attributedTitle pour forcer la couleur) --
        openButton = NSButton(frame: NSRect(x: m, y: 16, width: 140, height: 32))
        openButton.bezelStyle = .rounded
        openButton.bezelColor = Theme.primary
        openButton.attributedTitle = styledTitle("Ouvrir le site", color: .white)
        openButton.target = self
        openButton.action = #selector(openSite)
        openButton.isEnabled = false
        v.addSubview(openButton)

        restartButton = NSButton(frame: NSRect(x: m + 152, y: 16, width: 100, height: 32))
        restartButton.bezelStyle = .rounded
        restartButton.attributedTitle = styledTitle("Relancer", color: Theme.primary)
        restartButton.target = self
        restartButton.action = #selector(restart)
        restartButton.isEnabled = false
        v.addSubview(restartButton)

        shareButton = NSButton(frame: NSRect(x: m + 264, y: 16, width: 150, height: 32))
        shareButton.bezelStyle = .rounded
        shareButton.attributedTitle = styledTitle("Envoie les logs ici", color: Theme.primaryDark, size: 11)
        shareButton.target = self
        shareButton.action = #selector(shareLogs)
        v.addSubview(shareButton)

        stopButton = NSButton(frame: NSRect(x: W - m - 90, y: 16, width: 90, height: 32))
        stopButton.bezelStyle = .rounded
        stopButton.attributedTitle = styledTitle("Arrêter", color: Theme.primaryDark)
        stopButton.target = self
        stopButton.action = #selector(stop)
        v.addSubview(stopButton)

        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
    }

    // MARK: Setup Flow

    private func setup() {
        log("=== Art des Jardins ===\n\n")

        // Migration depuis l'ancien emplacement ~/Desktop
        migrateFromDesktop()

        // 1. Git (Xcode CLI Tools)
        setStatus("Vérification de Git...", color: .systemOrange)
        log("> Vérification de Git...\n")
        if shell("which git").status != 0 {
            log("  Xcode Command Line Tools sont requis.\n")
            log("  Une fenêtre va apparaître — cliquez Installer.\n")
            log("  Relancez l'app une fois terminé.\n")
            shell("/usr/bin/xcode-select --install")
            setStatus("Installez Xcode CLT puis relancez", color: .systemOrange)
            return
        }
        log("  OK\n\n")

        // 2. Node.js
        setStatus("Vérification de Node.js...", color: .systemOrange)
        log("> Vérification de Node.js...\n")
        if shell("which node").status != 0 {
            log("  Installation de Node.js (mot de passe admin requis)...\n")
            if !runWithAdmin("curl -sL https://nodejs.org/dist/v22.14.0/node-v22.14.0.pkg -o /tmp/node-install.pkg && installer -pkg /tmp/node-install.pkg -target / && rm -f /tmp/node-install.pkg") {
                setStatus("Erreur installation Node.js", color: .systemRed)
                log("  ECHEC\n")
                setButtons(open: false, restart: true)
                return
            }
        }
        let nodeVer = shell("node --version").output.trim()
        log("  Node.js \(nodeVer)\n\n")

        // 3. pnpm
        setStatus("Vérification de pnpm...", color: .systemOrange)
        log("> Vérification de pnpm...\n")
        if shell("which pnpm").status != 0 {
            log("  Installation de pnpm...\n")
            if !runWithAdmin("export PATH=/usr/local/bin:/opt/homebrew/bin:$PATH && npm install -g pnpm") {
                setStatus("Erreur installation pnpm", color: .systemRed)
                log("  ECHEC\n")
                setButtons(open: false, restart: true)
                return
            }
        }
        let pnpmVer = shell("pnpm --version").output.trim()
        log("  pnpm \(pnpmVer)\n\n")

        // 4. Clone
        if !FileManager.default.fileExists(atPath: projectPath) {
            setStatus("Téléchargement du site...", color: .systemOrange)
            log("> Clonage du projet...\n")
            let r = shellStream("git clone https://github.com/Bidiche49/art-des-jardins.git '\(projectPath)'")
            if r != 0 {
                setStatus("Erreur téléchargement", color: .systemRed)
                log("  ECHEC\n")
                setButtons(open: false, restart: true)
                return
            }
            log("  OK\n\n")
            loadLogo()
        }

        startServer()
    }

    private func migrateFromDesktop() {
        let oldPath = NSHomeDirectory() + "/Desktop/art-des-jardins"
        let fm = FileManager.default
        guard fm.fileExists(atPath: oldPath), !fm.fileExists(atPath: projectPath) else { return }
        log("> Migration depuis ~/Desktop/art-des-jardins...\n")
        do {
            try fm.moveItem(atPath: oldPath, toPath: projectPath)
            log("  Déplacé vers ~/art-des-jardins\n\n")
        } catch {
            log("  Migration impossible, un nouveau clone sera fait.\n\n")
        }
    }

    private func startServer() {
        // git pull
        setStatus("Mise à jour...", color: .systemOrange)
        log("> Mise à jour (git pull)...\n")
        shell("cd '\(projectPath)' && git pull --quiet")
        log("  OK\n\n")

        // pnpm install (streaming pour voir la progression)
        setStatus("Installation des dépendances...", color: .systemOrange)
        log("> Installation des dépendances...\n")
        let installSt = shellStream("cd '\(projectPath)' && pnpm install")
        if installSt != 0 {
            setStatus("Erreur installation dépendances", color: .systemRed)
            log("\n  ECHEC — pnpm install a échoué\n")
            setButtons(open: false, restart: true)
            return
        }
        log("  OK\n\n")

        // Kill old server THEN clean cache
        log("> Nettoyage...\n")
        shell("lsof -ti:3000 | xargs kill 2>/dev/null")
        Thread.sleep(forTimeInterval: 1)
        shell("rm -rf '\(projectPath)/apps/vitrine/.next'")
        log("  OK\n\n")

        // Start Next.js — exactement comme en manuel : pnpm next dev -H 0.0.0.0
        setStatus("Démarrage du serveur...", color: .systemOrange)
        log("> Démarrage de Next.js...\n\n")

        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/bin/bash")
        process.arguments = ["-c", "cd '\(projectPath)/apps/vitrine' && exec pnpm next dev -H 0.0.0.0"]
        process.environment = shellEnv

        let pipe = Pipe()
        process.standardOutput = pipe
        process.standardError = pipe

        pipe.fileHandleForReading.readabilityHandler = { [weak self] handle in
            let data = handle.availableData
            guard !data.isEmpty, let str = String(data: data, encoding: .utf8) else { return }
            self?.appendLog(self?.cleanAnsi(str) ?? str)
        }

        do {
            try process.run()
            serverProcess = process
        } catch {
            log("  ERREUR: \(error.localizedDescription)\n")
            setStatus("Erreur démarrage serveur", color: .systemRed)
            setButtons(open: false, restart: true)
            return
        }

        // Poll for readiness
        for i in 0..<180 {
            if shell("curl -s -o /dev/null -m 2 http://localhost:3000").status == 0 {
                log("\n  Serveur prêt !\n")
                serverReady = true
                setStatus("En ligne — http://localhost:3000", color: .systemGreen)
                setButtons(open: true, restart: true)
                openBrowser()
                return
            }
            if !process.isRunning {
                log("\n  Le serveur s'est arrêté de façon inattendue.\n")
                setStatus("Le serveur s'est arrêté", color: .systemRed)
                setButtons(open: false, restart: true)
                return
            }
            if i == 30 {
                log("  (première compilation, ça peut prendre 1-2 min...)\n")
            }
            Thread.sleep(forTimeInterval: 1)
        }

        log("\n  Timeout — le serveur n'a pas demarre en 3 minutes.\n")
        setStatus("Timeout", color: .systemRed)
        setButtons(open: false, restart: true)
    }

    // MARK: Shell Helpers

    private struct ShellResult {
        let status: Int32
        let output: String
    }

    @discardableResult
    private func shell(_ command: String) -> ShellResult {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/bin/bash")
        process.arguments = ["-c", command]
        process.environment = shellEnv

        let pipe = Pipe()
        process.standardOutput = pipe
        process.standardError = pipe

        do { try process.run() } catch { return ShellResult(status: -1, output: error.localizedDescription) }

        let data = pipe.fileHandleForReading.readDataToEndOfFile()
        process.waitUntilExit()
        return ShellResult(status: process.terminationStatus, output: String(data: data, encoding: .utf8) ?? "")
    }

    private func shellStream(_ command: String) -> Int32 {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: "/bin/bash")
        process.arguments = ["-c", command]
        process.environment = shellEnv

        let pipe = Pipe()
        process.standardOutput = pipe
        process.standardError = pipe

        pipe.fileHandleForReading.readabilityHandler = { [weak self] handle in
            let data = handle.availableData
            guard !data.isEmpty, let str = String(data: data, encoding: .utf8) else { return }
            self?.appendLog(self?.cleanAnsi(str) ?? str)
        }

        do { try process.run() } catch { return -1 }
        process.waitUntilExit()
        pipe.fileHandleForReading.readabilityHandler = nil
        return process.terminationStatus
    }

    private func runWithAdmin(_ command: String) -> Bool {
        let escaped = command
            .replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "\"", with: "\\\"")
        let source = "do shell script \"\(escaped)\" with administrator privileges"

        var success = false
        let sem = DispatchSemaphore(value: 0)
        DispatchQueue.main.async {
            let script = NSAppleScript(source: source)!
            var err: NSDictionary?
            script.executeAndReturnError(&err)
            success = (err == nil)
            sem.signal()
        }
        sem.wait()
        return success
    }

    // MARK: Actions

    @objc private func openSite() {
        guard serverReady else { return }
        openBrowser()
    }

    @objc private func restart() {
        serverReady = false
        setButtons(open: false, restart: false)
        DispatchQueue.global(qos: .userInitiated).async {
            self.log("\n=== Relancé ===\n\n")
            self.killServer()
            Thread.sleep(forTimeInterval: 1)
            self.startServer()
        }
    }

    @objc private func shareLogs() {
        let logs = logTextView.string
        guard !logs.isEmpty else { return }

        // Toujours copier dans le presse-papier
        NSPasteboard.general.clearContents()
        NSPasteboard.general.setString(logs, forType: .string)

        // Tronquer pour l'URL (les logs complets sont dans le presse-papier)
        let maxLen = 3000
        let logsForUrl = logs.count > maxLen
            ? "...(tronqué, logs complets dans le presse-papier)\n" + String(logs.suffix(maxLen))
            : logs
        let encoded = logsForUrl.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""

        // 1. WhatsApp
        if NSWorkspace.shared.urlForApplication(withBundleIdentifier: "net.whatsapp.WhatsApp") != nil,
           let url = URL(string: "whatsapp://send?phone=33783000713&text=" + encoded) {
            NSWorkspace.shared.open(url)
            return
        }

        // 2. Messages
        if NSWorkspace.shared.urlForApplication(withBundleIdentifier: "com.apple.MobileSMS") != nil,
           let url = URL(string: "sms:+33783000713&body=" + encoded) {
            NSWorkspace.shared.open(url)
            return
        }

        // 3. Mail
        if let mailService = NSSharingService(named: .composeEmail) {
            mailService.recipients = ["nicolazictardy@gmail.com"]
            mailService.subject = "Art des Jardins — Logs"
            mailService.perform(withItems: [logs])
            return
        }

        // 4. Presse-papier + alerte
        let alert = NSAlert()
        alert.messageText = "Logs copiés !"
        alert.informativeText = "Envoie-moi ça par mail ou WhatsApp si t'as un bug :\n\n• WhatsApp : +33 7 83 00 07 13\n• Mail : nicolazictardy@gmail.com\n\n(Les logs sont dans le presse-papier, il suffit de coller)"
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.runModal()
    }

    @objc private func stop() {
        killServer()
        log("\n=== Arrêté ===\n")
        setStatus("Arrêté", color: .systemGray)
        NSApp.terminate(nil)
    }

    // MARK: Helpers

    private func killServer() {
        serverProcess?.terminate()
        serverProcess = nil
        shell("lsof -ti:3000 | xargs kill 2>/dev/null")
    }

    private func openBrowser() {
        guard let url = URL(string: "http://localhost:3000") else { return }
        DispatchQueue.main.async {
            // Chrome en priorite, puis Safari, puis navigateur par defaut
            let browsers = ["com.google.Chrome", "com.apple.Safari"]
            for bundleId in browsers {
                if let appUrl = NSWorkspace.shared.urlForApplication(withBundleIdentifier: bundleId) {
                    NSWorkspace.shared.open([url], withApplicationAt: appUrl, configuration: NSWorkspace.OpenConfiguration())
                    return
                }
            }
            NSWorkspace.shared.open(url)
        }
    }

    private func loadLogo() {
        let path = projectPath + "/apps/vitrine/public/images/logo-leaf.png"
        guard let img = NSImage(contentsOfFile: path) else { return }
        DispatchQueue.main.async { self.logoView.image = img }
    }

    private func styledTitle(_ text: String, color: NSColor, size: CGFloat = 13) -> NSAttributedString {
        NSAttributedString(string: text, attributes: [
            .foregroundColor: color,
            .font: NSFont.systemFont(ofSize: size, weight: .medium)
        ])
    }

    private func cleanAnsi(_ text: String) -> String {
        text.replacingOccurrences(of: "\u{1B}\\[[0-9;]*[A-Za-z]", with: "", options: .regularExpression)
            .replacingOccurrences(of: "\r\n", with: "\n")
            .replacingOccurrences(of: "\r", with: "\n")
    }

    private func log(_ message: String) { appendLog(message) }

    private func appendLog(_ text: String) {
        DispatchQueue.main.async {
            let attrs: [NSAttributedString.Key: Any] = [
                .font: Theme.monoFont,
                .foregroundColor: Theme.text
            ]
            self.logTextView.textStorage?.append(NSAttributedString(string: text, attributes: attrs))
            self.logTextView.scrollToEndOfDocument(nil)
        }
    }

    private func setStatus(_ text: String, color: NSColor) {
        DispatchQueue.main.async {
            self.statusLabel.stringValue = text
            self.statusDot.layer?.backgroundColor = color.cgColor
        }
    }

    private func setButtons(open: Bool, restart: Bool) {
        DispatchQueue.main.async {
            self.openButton.isEnabled = open
            self.restartButton.isEnabled = restart
        }
    }
}

// MARK: - String Extension

private extension String {
    func trim() -> String { trimmingCharacters(in: .whitespacesAndNewlines) }
}

// MARK: - Entry Point

let app = NSApplication.shared
app.setActivationPolicy(.regular)
let delegate = AppDelegate()
app.delegate = delegate
NSApp.activate(ignoringOtherApps: true)
app.run()
