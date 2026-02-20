# Art des Jardins

Digitalisation d'une entreprise de paysage (Angers) — Site vitrine SEO, app mobile Flutter, API REST.

---

## Tester le site vitrine sur ton Mac

### Installation automatique (recommande)

Tu as recu un fichier `installer.sh` par mail. Pour l'executer :

1. Enregistre le fichier sur ton **Bureau**
2. Ouvre l'application **Terminal** (cherche "Terminal" dans Spotlight avec `Cmd + Espace`)
3. Copie-colle cette ligne et appuie sur `Entree` :

```
bash ~/Desktop/installer.sh
```

4. Suis les instructions a l'ecran (ca installe tout : git, Node.js, le projet)

> **Note :** a la premiere etape, une fenetre peut s'ouvrir pour installer les "outils de developpement". Clique sur **Installer**, attends que ca finisse, puis relance le script.

### Lancer le site

Double-clique sur le fichier :

```
Bureau > art-des-jardins > scripts > lancer-site.command
```

Puis ouvre **http://localhost:3001** dans Safari ou Chrome.

> Si macOS affiche "impossible d'ouvrir car le developpeur n'est pas identifie" :
> clic droit sur le fichier > **Ouvrir** > confirme.

### Mettre a jour le site (quand j'ai fait des modifs)

Double-clique sur :

```
Bureau > art-des-jardins > scripts > mise-a-jour.command
```

Ca recupere automatiquement les derniers changements et relance le site.

### Arreter le site

Ferme la fenetre du Terminal, ou appuie sur `Ctrl + C`.

---

## En cas de probleme

| Probleme | Solution |
|----------|----------|
| "developpeur non identifie" | Clic droit sur le fichier > **Ouvrir** |
| `command not found: pnpm` | Relance `installer.sh` |
| `command not found: node` | Relance `installer.sh` |
| "No such file or directory" | Verifie que le dossier **art-des-jardins** est bien sur le Bureau |
| Le site ne s'affiche pas | Verifie que le Terminal affiche "started server on 0.0.0.0:3001" |
| Les images ne s'affichent pas | Normal en local, elles seront visibles sur le vrai site |

---

## Pour les developpeurs

```bash
pnpm install          # Installer les dependances
pnpm dev:vitrine      # Site vitrine (localhost:3001)
pnpm dev:api          # Backend API
pnpm build            # Build production

# App mobile (Flutter)
cd apps/mobile && flutter run
```
