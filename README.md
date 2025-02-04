# WEBLAB Projekt HS24: "Songlinks"

Für das WEBLAB Modul im HS24 wird ein eigenes Projekt "Songlinks" durchgeführt.

## Kontext

"Songlinks" ist eine Webapplikation, um Songs unabhänging von Streaming-Services zu teilen.

Dabei können Benutzer\*innen Song-Seiten mit Links zu diversen Streaming-Services (z. B. Spotify, Apple Music, etc.) erstellen ("Smart links"). \
Die Webapplikation besteht aus 3 Teilen:

- **Songlink Dashboard**, in der Admins, Artists und Users Songs erfassen und bearbeiten können.
- **Song Page**, welche eine Liste der verfügbaren Links zu den Streaming-Services (Spotify, Apple Music, etc.) bietet.
- **Artist Overview**, welche eine Überblick der erfassten Songs pro Artist bietet. 

## Fachliche Anforderungen

### User Story 1: Anmeldung (Must)

Als User, Artist oder Admin kann ich mich im Songlink Dashboard anmelden, damit ich Songs verwalten kann.

**Akzeptanzkriterien**

- Mit korrekter Benutzername/Passwort gelange ich zum Dashboard.
- Mit falscher Benutzername oder Passwort kann ich mich nicht anmelden.

### User Story 2: Rollen (Must)

Als Admin kann ich im Dashboard Benutzer\*innen verwalten, damit ich den Zugang und die Nutzung steuern und einschränken kann.

**Akzeptanzkriterien**

- Nur Personen mit der Rolle 'Admin' können Benutzer*innen erstellen und verwalten.
- Benutzer\*innen können die Rolle 'User', 'Artist' oder 'Admin' haben.
- Die Rolle 'User' kann Songs erstellen und nur selbst-erstellte Songs bearbeiten.
- An Personen mit der Rolle 'Artist' können Künstler\*innen hinterlegt werden für die sie Songs verwalten können.
- Die Rolle 'Admin' hat jegliche Rechte.

### User Story 3: Song Page erfassen (Must)

Als User, Artist oder Admin kann ich Song Pages mit grundlegende Details erstellen und diverse Links zu verschiedenen Streaming-Services hinterlegen.

**Akzeptanzkriterien**

- Ein Song besteht aus: Titel, Künstler\*in, Cover-Bild, Erscheinungsdatum, Album (sofern keine Single).
- Bei mehreren Künstler\*innen gilt die erste Person/Gruppe als "Hauptkünstler\*in".
- Der URL-Pfad ist im Format: `/artist/song-name`.
- Es können 1-10 Streaming-Link pro Song Page hinzugefügt werden.
- Es kann nur 1 Song Page pro realer Song erstellt werden.

### User Story 4: Song Page bearbeiten/löschen (Must)

Als User, Artist oder Admin kann ich bestehende Song Pages bearbeiten oder löschen, um diese auf dem aktuellsten Stand zu behalten.

**Akzeptanzkriterien**

- User kann nur selbst-erstellte Song Pages bearbeiten und löschen.
- Admins können jegliche Song Pages bearbeiten und löschen.
- Artist können jegliche Song Pages der ihr zugewiesene Künstler\*innen bearbeiten und löschen.
- Sofern ein Song Page ein Künstler\*in

### User Story 5: Song Page anzeigen (Must)

### User Story 6: Artist Overview erfassen (Should)

### User Story 7: Artist Overview bearbeiten (Should)

### User Story 8: Artist Overview anzeigen (Should)

### User Story 9: Artist Overview - Songs sortieren (Could)

### User Story 10: Metadata via API (Won't)



## Qualitätsanforderungen


## Technologie-Stack

| Layer          | Technologie          | Bemerkungen                                                      |
|----------------|----------------------|------------------------------------------------------------------|
| Frontend       | Next.js (TypeScript) |                                                                  |
| Backend        | Next.js (TypeScript) |                                                                  |
| Database       | PostgreSQL           |                                                                  |
| ORM            | Prisma               |                                                                  |
| Authentication | NextAuth.js          |                                                                  |
| Hosting        | tbd (Vercel?)        |                                                                  |
| Storage        | tbd                  |                                                                  |
| Styling        | Tailwind CSS         |                                                                  |
| APIs           | Spotify, (song.link) | Optional, alternativ für manuelle Erfassung / Metadata-Ergänzung |