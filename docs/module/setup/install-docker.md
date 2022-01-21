# Installation des Moduls für den Betrieb in Docker
Das Modul unterstützt den Betrieb als Docker-Image. Für den Betrieb in Docker haben wir nachstehend ein Beispiel aufgeführt wie das Modul in einer Compose-Datei zu verwenden ist.

> [!NOTE]
> Die hier aufgeführten Beispiele sollen Ihnen den Einstieg vereinfachen und spiegeln keinesfalls die Konfiguration wider, in dem das System zwingend betrieben werden muss.
> 
> Die hier aufgeführten Konfigurationen gewährleisten lediglich den erfolgreichen Betrieb der Services. Sie können die Einstellungen jederzeit und nach Belieben verändern.

## Docker-Compose Eintrag
Für den Betrieb als Docker-Image kann folgendes Beispiel verwendet werden:

```yml
io-module-iotemplate:
    image: actiwareio/io-module-iotemplate:1-latest
    restart: always
    ports:
      - 30100:30100
```

### Verfügbare Images
Eine Übersicht der verfügbaren Docker-Images für das System entnehmen Sie bitte dem Docker-Repository.

Für jede erstellte Version unserers Moduls wird ein Version-Tag erstellt mit diesem man eine explizite Version des Modules in seiner Umgebung verwenden kann. Wenn man beispielsweise die Version 1.0.0 vom Modul verwenden möchte, würde man das Docker-Image wie folgt angeben:

> actiwareio/io-module-iotemplate:1.0.0

Nachstehend haben wir eine Übersicht über die weiteren Tags aufgeführt, die wir den Docker-Images vergeben um bestimmte Versionen anzusteuern.

| Tag      | Beschreibung                                                                                                                                                                                                                                                             |
| :------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| nightly  | Gibt an, dass immer die zuletzt veröffentlichte Entwicklerversion bezogen werden soll. Mit diesem Tag greifen Sie immer auf ein nächtlich erstelltes Docker-Image eines Service und/oder Moduls zurück.                                                                  |
| x-latest | Gibt an, dass immer die zuletzt veröffentlichte Version bezogen werden soll. Mit diesem Tag greifen Sie immer auf das aktuelle Release eines Services und/oder Moduls zurück. Dabei ist zu beachten, dass das x mit der Hauptversion 1 oder 2 bspw. ersetzt werden muss. |
| x.x.x    | Angabe der entsprechenden Version des Docker-Images, welches explizit verwendet werden soll.                                                                                                                                                                             |

> [!CAUTION]
> Bitte beachten Sie, dass es sich hierbei um eine Entwicklerversion handelt, welche noch keine QM Tests durchlaufen hat und nicht als Release freigegeben wurde.
> 
> Bei dem Einsatz einer Entwicklerversion kann kein störungsfreier Betrieb der Systeme gewährleistet werden und es kann zu Problemen und/oder Datenverlusten führen. Die Entwicklerversionen sollte nur zum Testen bzw. Anschauen von neuen Funktionen/Verbesserungen und nicht für die produktiven Einsatz verwendet werden.

> [!NOTE]
> Welche Versionsnummer ein Docker-Image hat, entnehmen Sie aus dem Docker-Repository und der Informationsseite der Tags für das jeweilige Docker-Image.