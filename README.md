# News

**News** ist eine kleine Vue 3 Web-App, die mehrere RSS-Feeds bündelt und als modernes Newsboard darstellt.

## Was die App macht

- Lädt News aus mehreren RSS-Feeds über eine Proxy-API
- Zeigt News-Karten mit Bild, Titel, Quelle und kurzer Zusammenfassung an
- Sortiert die Einträge nach Aktualität
- Speichert Feed-Einstellungen und gecachte Artikel lokal im Browser
- Unterstützt Pull-to-Refresh auf Mobilgeräten
- Bietet eine Einstellungsseite zur Verwaltung von Quellen

## Bedienung

### Startseite

- Scrollen Sie durch die gesammelten News-Beiträge
- Tippen/Klicken Sie auf eine Karte, um den Artikel in einem neuen Tab zu öffnen
- Ziehen Sie auf Mobilgeräten nach unten, um den Feed manuell zu aktualisieren
- Wenn Sie weiter nach unten scrollen, erscheint ein Button zum schnellen Zurück nach oben

### Einstellungen

- Aktivieren oder deaktivieren Sie einzelne Feed-Quellen
- Entfernen Sie Feeds, die Sie nicht mehr verfolgen möchten
- Fügen Sie neue News-Quellen mit Name, RSS-URL und Farbe hinzu
- Laden Sie alle Feeds manuell neu
- Löschen Sie den App-Cache und erzwingen Sie ein Reset

## Technische Details

- Framework: Vue 3
- Routing: Vue Router
- State-Management: Pinia
- Styling: Tailwind CSS
- RSS-Aufbereitung: browserseitige XML-Verarbeitung

## Voraussetzung

- Node.js 20 oder neuer, oder Node.js 22+

## Lokale Entwicklung

```sh
npm install
npm run dev
```

Die App läuft dann standardmäßig unter `http://localhost:5173`.

## Build und Produktion

```sh
npm run build
```

Optionales Deployment-Skript:

```sh
npm run deploy
```

> Das Deployment-Skript ist für eine spezifische Zielumgebung konfiguriert. Prüfen Sie die Route und passen Sie sie bei Bedarf an.

## Konfiguration der Feed-API

Die App ruft RSS-Feeds über einen Proxy aus `src/services/feedService.ts` ab. Standardmäßig verwendet sie den Basis-Pfad `/api`.

Wenn Sie eine eigene Backend-API nutzen, setzen Sie in Ihrer Umgebung die Variable:

```sh
VITE_API_BASE_URL=https://example.com/api
```

## Vorinstallierte Feeds

Im Projekt sind bereits zwei Feed-Quellen konfiguriert:

- `t3n` (`https://t3n.de/rss.xml`)
- `inside-it.ch` (`https://www.inside-it.ch/rss.xml`)

## Dateistruktur (wichtigste Dateien)

- `src/App.vue` – Hauptlayout und globale Navigation
- `src/views/HomeView.vue` – News-Feed und Pull-to-Refresh
- `src/views/SettingsView.vue` – Feed-Verwaltung
- `src/stores/newsStore.ts` – Zustand, Caching und Feed-Refresh
- `src/services/feedService.ts` – RSS-Parsing und Feed-Abfrage
- `src/config/feeds.ts` – Standard-Feed-Definitionen

## Hinweise

- Feed-Einstellungen werden im Browser `localStorage` gespeichert
- Nachrichten werden ebenfalls lokal zwischengespeichert, um schnellere Ladezeiten zu ermöglichen
- Fehler beim Laden der Feeds werden in der Oberfläche angezeigt

## KI-Coding-Assistenten

Dieses Repository enthält Instruktionsdateien für KI-gestützte Entwicklungstools:

| Datei | Tool |
|---|---|
| `AGENTS.md` | OpenCode, Devin und generische Agenten |
| `CLAUDE.md` | Anthropic Claude Code |
| `.cursorrules` | Cursor AI |
| `.github/copilot-instructions.md` | GitHub Copilot |
