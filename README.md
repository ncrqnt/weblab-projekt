# WEBLAB Projekt HS24: "Songlinks"

Für das WEBLAB Modul im HS24 wird ein eigenes Projekt "Songlinks" durchgeführt.

## Kontext

"Songlinks" ist eine Webapplikation, um Songs unabhängig von Streaming-Services zu teilen.

Dabei können Benutzer\*innen Song-Seiten mit Links zu diversen Streaming-Services (z. B. Spotify, Apple Music, etc.)
erstellen ("Smart links"). \
Die Webapplikation besteht aus 3 Teilen:

- **Songlink Dashboard**, in der Admins, Manager und Users Songs erfassen und bearbeiten können.
- **Song Page**, welche eine Liste der verfügbaren Links zu den Streaming-Services (Spotify, Apple Music, etc.) bietet.
- **Artist Overview**, welche einen Überblick der erfassten Songs pro Artist bietet.

## Fachliche Anforderungen

### User Story 1: Anmeldung (Must)

Als User, Manager oder Admin kann ich mich im Songlink Dashboard anmelden, damit ich Songs verwalten kann.

**Akzeptanzkriterien**

- Mit korrekter Benutzername/Passwort gelange ich zum Dashboard.
- Mit falscher Benutzername oder Passwort kann sich nicht angemeldet werden.
- Aufruf des Dashboards ohne Authentifizierung wird mit `HTTP 401 Unauthorized` abgewiesen.

### User Story 2: Rollen (Must)

Als Admin kann ich im Dashboard Benutzer\*innen verwalten, damit ich den Zugang und die Nutzung steuern und einschränken
kann.

**Akzeptanzkriterien**

- Nur Personen mit der Rolle 'Admin' können Benutzer*innen erstellen und verwalten.
- Benutzer\*innen können die Rolle 'User', 'Manager' oder 'Admin' haben.
- Die Rolle 'User' kann Songs erstellen und nur selbst-erstellte Songs bearbeiten.
- An Personen mit der Rolle 'Manager' können Künstler\*innen zugewiesen werden für die sie Song Pages verwalten können.
- Die Rolle 'Admin' hat jegliche Rechte.

### User Story 3: Song Page erfassen (Must)

Als User, Manager oder Admin kann ich Song Pages mit grundlegende Details erstellen und diverse Links zu verschiedenen
Streaming-Services hinterlegen.

**Akzeptanzkriterien**

- Ein Song besteht aus: Titel, Künstler\*in, Cover-Bild, Erscheinungsdatum, Album (sofern keine Single).
- Bei mehreren Künstler\*innen gilt die erste Person/Gruppe als "Hauptkünstler\*in".
- Die Seite ist zugänglich über: `/artist/song-title`.
- Es können 1-10 Streaming-Link pro Song Page hinzugefügt werden.
- Es kann nur 1 Song Page pro Song (Künstler\*in + Titel) erstellt werden.

### User Story 4: Song Page bearbeiten/löschen (Must)

Als User, Manager oder Admin kann ich bestehende Song Pages bearbeiten oder löschen, um diese auf dem aktuellsten Stand
zu behalten.

**Akzeptanzkriterien**

- User kann nur selbst-erstellte Song Pages bearbeiten und löschen.
- Song Pages erstellt von anderen Benutzer sind read-only.
- Admins können jegliche Song Pages bearbeiten und löschen.
- Manager können jegliche Song Pages der ihr zugewiesene Künstler\*innen bearbeiten und löschen.

### User Story 5: Song Page anzeigen (Must)

Als Besucher kann ich bestehende Song Pages aufrufen, um die Links zu den verschiedenen Streaming-Plattformen zu erhalten.

**Akzeptanzkriterien**

- Bestehende Song Pages können via URL aufgerufen werden.
- Nicht bestehende Song Pages werden mit einem `HTTP 404 Not Found` erwidert.

### User Story 6: Artist Overview (Should)

Als Besucher kann ich alle erfassten Songs eines Artists einsehen, damit ich einen Überblick über deren Songs erhalte.

**Akzeptanzkriterien**

- Artist Pages werden automatisch erstellt, sobald eine Song Page mit einem neuen Artist erstellt wird.
- Die Seite ist zugänglich über: `/artist`
- Ein Klick auf ein Song leitet zur entsprechenden Song Page weiter.
- Jeder Song auf der Overview Page enthält bis zu 3 Direktlinks zu der entsprechenden Streaming-Plattform.
- Die Songs werden in chronologischer Reihenfolge (gemäss Erscheinungsdatum) sortiert.
- Die Songs enthalten Cover-Bild, Titel, Album (sofern vorhanden) und Erscheinungsdatum.

### User Story 7: Artist Overview ergänzen (Should)

Als Manager kann ich Artist Overview Seiten der mir zugewiesene Künstler\*innen bearbeiten, um sie mit Details zu bereichern.

**Akzeptanzkriterien**

- Artist Overview können mit 0-10 Streaming-Links (als Icon) ergänzt werden.
- Nur Benutzer\*innen mit der Rolle 'Manager' können Artist Overview Seiten bearbeiten.
- Es können nur Seiten bearbeitet werden, sofern ihnen die entsprechenden Künstler\*innen zugewiesen wurden.

### User Story 8: Artist Overview - Songs suchen & sortieren (Could)

Als Besucher kann ich die Songs auf einer Artist Overview Seite suchen und sortieren, um schneller einen Song zu finden.

**Akzeptanzkriterien**

- Songs können auf einer Arist Overview Seite client-seitig sortiert werden.
- Eine Artist Overview Seite enthält eine Suche für die Song-Titel.

### User Story 9: Metadata via API (Won't)

Als User, Manager oder Admin kann ich beim Erfassen eines neuen Songs die Details automatisch abfüllen lassen, um mir die Erfassung zu beschleunigen.

**Akzeptanzkriterien**

- Song-Daten (Cover-Bild, Titel, Artist, Erscheinungsdatum) können via externer API abgerufen und abgefüllt werden.
- Streaming-Links können via externer API abgerufen und abgefüllt werden.
- Abgefüllte Inhalte können überschrieben werden.

### User Story 10: Audit Logging (Must)

Als Admin kann ich einsehen, wer welche Aktionen ausführt, damit ich Änderungen nachvollziehen kann.

**Akzeptanzkriterien**

- Erstellung, Löschung und Bearbeitung von Song Pages werden geloggt.
- Logs können im Dashboard in einem übersichtlichen Format angesehen werden.
- Nur Personen mit der Rolle 'Admin' können Logs nachschauen.

## Qualitätsanforderungen

- _Song Pages_ und _Artist Overview_ sollen sowohl für Desktop-, als auch Mobile-Ansicht optimiert sein. (Must)
- Dashboard soll sowohl für Desktop-, als auch Mobile-Ansicht optimiert sein. (Could)
- _Song Pages_ und _Artist Overview_ sollen innerhalb 1s geladen sein.

## Technologie-Stack

| Layer          | Technologie          | Bemerkungen           |
|----------------|----------------------|-----------------------|
| Frontend       | Next.js (TypeScript) | via Vercel            |
| Backend        | Next.js (TypeScript) | via Vercel Serverless |
| Database       | PostgreSQL           | via Supabase          |
| ORM            | Prisma               |                       |
| Authentication | Supabase Auth        | via Supabase          |
| Styling        | Tailwind CSS         |                       |