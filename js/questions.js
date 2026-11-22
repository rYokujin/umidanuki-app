// =============================================================================
// BUJINKAN UMIDANUKI DOJO - 300 KUDEN QUESTIONS & QUIZ POOL BUILDER
// =============================================================================

let kuden_quiz_questions = [];

const explicit_kuden_questions = [
    ["Japanisch für Budôka", "Was bedeutet ‚Uke‘?", "Empfänger einer Technik", ["Position / Stellung", "Angriff / Schlag", "Ausführender / Verteidiger", "Wurftechnik", "Ausweichbewegung", "Schriftrolle"]],
    ["Japanisch für Budôka", "Wie heißt der Ausführende einer Technik?", "Tori", ["Uke", "Migi", "Nage", "Tsuki", "Kamae", "Waza"]],
    ["Japanisch für Budôka", "Wie heißt die Angriffshöhe ‚Hoch‘ / Kopfhöhe?", "Jôdan", ["Chûdan", "Gedan", "Shôdan", "Yoko", "Zenpô", "Kohô"]],
    ["Japanisch für Budôka", "Wie heißt die Angriffshöhe ‚Mittel‘ / Bauchhöhe?", "Chûdan", ["Jôdan", "Gedan", "Shôdan", "Nidan", "Sandan", "Godan"]],
    ["Japanisch für Budôka", "Wie heißt die Angriffshöhe ‚Tief‘ / Beinhöhe?", "Gedan", ["Jôdan", "Chûdan", "Shôdan", "Uchi", "Soto", "Yoko"]],
    ["Japanisch für Budôka", "Wie bedanken sich die Schüler für ein Training z. B. beim Abgrüßen?", "Arigatô Gozaimashita", ["Dô Itashimashite", "Onegai Shimasu", "Shikin Haramitsu Daikomyô", "Ganbatte Kudasai", "Konbanwa", "Sayônara"]],
    ["Japanisch für Budôka", "Was heißt ‚Laufen / Gehen‘ auf Japanisch?", "Aruki", ["Jûji", "Suwari", "Seiza", "Tobi", "Ukemi", "Nagare"]],
    ["Körperteile", "Welches Körperteil ist ‚Ashi‘?", "Bein", ["Finger", "Hals", "Körper", "Schulter", "Handgelenk", "Hüfte"]],
    ["Japanisch für Budôka", "Was bedeutet ‚Budô‘ auf Deutsch?", "Der Weg des Kriegers", ["Der Weg Gottes", "Die Ehre des Krieges", "Kriegerfreunde", "Halle des Kriegsgottes", "Kunst des Fallens", "Unbewegliches Herz"]],
    ["Japanisch für Budôka", "Was bedeutet ‚Bujinkan‘ auf Deutsch?", "Halle des Kriegsgottes", ["Göttliche Kampfkunst", "Leere Hand", "Der Weg des sanften Gottes", "Weg des Kriegers", "Schule des Juwelentigers", "Haus des Bibers"]],
    ["Körperteile", "Wie bezeichnet man die kurzen Rippen, die häufig Ziel von Angriffen werden?", "Butsumetsu", ["Taki", "Nodo", "Yubi", "Kasumi", "Suigetsu", "Koshi"]],
    ["Japanisch für Budôka", "Was bedeutet ‚Buyû‘ auf Deutsch?", "Kriegerfreunde", ["Kriegsfeinde", "Kampfsportfreunde", "Teilfreunde", "Großmeister", "Schülergrade", "Kriegsgötter"]],
    ["Gogyô • Fünf Elemente", "Welches Element ist ‚Chi‘ (地)?", "Erde", ["Wasser", "Feuer", "Luft / Wind", "Leere", "Metall", "Holz"]],
    ["Gogyô • Fünf Elemente", "Welches Element ist ‚Sui‘ (水)?", "Wasser", ["Erde", "Feuer", "Luft / Wind", "Leere", "Metall", "Eis"]],
    ["Gogyô • Fünf Elemente", "Welches Element ist ‚Ka‘ (火)?", "Feuer", ["Erde", "Wasser", "Luft / Wind", "Leere", "Blitz", "Stein"]],
    ["Gogyô • Fünf Elemente", "Welches Element ist ‚Fû‘ (風)?", "Luft / Wind", ["Erde", "Wasser", "Feuer", "Leere", "Nebel", "Himmel"]],
    ["Gogyô • Fünf Elemente", "Welches Element ist ‚Kû‘ (空)?", "Leere", ["Erde", "Wasser", "Feuer", "Luft / Wind", "Schatten", "Licht"]],
    ["Bujinkan • Titel", "Welche Reihenfolge sortiert die Titel im Bujinkan aufsteigend (1 bis 5)?", "Kôhai ➔ Senpai ➔ Shidôshi ➔ Shihan ➔ Daishihan", ["Senpai ➔ Kôhai ➔ Shihan ➔ Shidôshi ➔ Daishihan", "Kôhai ➔ Shidôshi ➔ Senpai ➔ Daishihan ➔ Shihan", "Shidôshi ➔ Kôhai ➔ Senpai ➔ Shihan ➔ Daishihan", "Kôhai ➔ Senpai ➔ Shihan ➔ Shidôshi ➔ Daishihan", "Daishihan ➔ Shihan ➔ Shidôshi ➔ Senpai ➔ Kôhai", "Kôhai ➔ Senpai ➔ Shidôshi ➔ Daishihan ➔ Shihan"]],
    ["Japanisch für Budôka", "Wie heißen die Graduierungen der Meisterränge?", "Dan", ["Kyû", "San", "Nan", "Zan", "Ryû", "Waza"]],
    ["Japanisch für Budôka", "Was enthält eine ‚Denshô‘?", "Beschreibung von Techniken", ["Japanisch/Deutsch-Übersetzungen", "Darstellungen von Meerestieren", "Aktzeichnungen", "Mitgliederlisten", "Trainingszeiten", "Prüfungsgebühren"]],
    ["Körperteile", "Welches Körperteil bezeichnet ‚Dô‘?", "Oberkörper", ["Bein", "Solar Plexus", "Finger", "Schläfe", "Handgelenk", "Hals"]],
    ["Japanisch für Budôka", "Was ist ein ‚Dôjô-Chô‘?", "Die Leitung eines Dôjô", ["Der Buchhalter eines Dôjô", "Der neueste Schüler eines Dôjô", "Der erfahrenste Schüler eines Dôjô", "Ein Prüfer im Honbu Dôjô", "Der Erbauer eines Schreins", "Ein Gastlehrer"]],
    ["Japanisch für Budôka", "Was ist ein ‚Gaijin‘?", "Ein Nicht-Japaner / Ausländer", ["Ein Bergeremit", "Ein unzivilisierter Mensch", "Ein Großmeister", "Ein Schwertschmied", "Ein Tempelwächter", "Ein Anfänger"]],
    ["Japanisch für Budôka", "Was bedeutet ‚Ganbatte‘ oder ‚Ganbatte Kudasai‘ NICHT?", "Entspann dich", ["Halte durch", "Bleib dran", "Viel Erfolg", "Gib dein Bestes", "Keep going", "Nicht aufgeben"]],
    ["Japanisch für Budôka", "Wie heißt das dreistufige japanische Lernprinzip?", "Shu Ha Ri", ["Sha Sho Shin", "Shi Dô Shi", "Chi Sui Ka", "Ten Chi Jin", "Omote Ura", "Migi Hidari"]],
    ["Japanisch für Budôka", "Wie bezeichnet man eine Variation von einer Grundtechnik?", "Henka", ["Zanka", "Denshô", "Kata", "Kamae", "Reihô", "Kuzushi"]],
    ["Kihon • Kata", "Welcher Begriff bezeichnet die Fünf-Elemente-Kata neben ‚Sanshin No Kata‘?", "Gogyô No Kata", ["Kihon Happô", "Juppô Sesshô", "Jûnan Taisô", "Tai Sabaki", "Suwari Gata", "Denshô Kata"]],
    ["Kihon • Kata", "Wie heißt die Fünf-Elemente-Kata neben ‚Gogyô No Kata‘?", "Sanshin No Kata", ["Denshô Kata", "Tai Sabaki", "Suwari Gata", "Kihon Happô", "Ryu Sui Iki", "Kamae No Kata"]],
    ["Richtungen", "Was heißt ‚links‘ auf Japanisch?", "Hidari", ["Migi", "Soto", "Uchi", "Mae", "Ushiro", "Yoko"]],
    ["Richtungen", "Was heißt ‚rechts‘ auf Japanisch?", "Migi", ["Hidari", "Omote", "Ura", "Zenpô", "Kohô", "Soto"]],
    ["Bujinkan • Struktur", "Was ist das ‚Honbu Dôjô‘?", "Das zentrale Dôjô des Bujinkan in Japan nahe der Atago Station", ["Der Privatwohnsitz von Hatsumi Masaaki", "Ein Dôjô für die Honbu Ryû", "Der Trainingsort des Umidanuki Dôjô", "Ein historisches Museum in Kyoto", "Eine Universität für Budô", "Ein Schrein auf dem Berg Fuji"]],
    ["Japanisch für Budôka", "Was ist ein ‚Jinja‘?", "Schrein", ["Tempel", "Schrank", "Altar", "Trainingshalle", "Schwertständer", "Torbogen"]],
    ["Japanisch für Budôka", "Wie lässt sich ‚Juppô Sesshô‘ idiomatisch übersetzen?", "Anpassung in 10 Wegen", ["10.000 Veränderungen, keine Überraschung", "Halte durch", "In jedem Moment steckt Erleuchtung", "Der Weg des unbeweglichen Herzens", "Siebenmal hinfallen, achtmal aufstehen", "Ohne Schwert kämpfen"]],
    ["Japanisch für Budôka", "Was bedeutet ‚Jutsu‘ auf Deutsch?", "Kunst", ["Kraft", "Erfahrung", "Balance", "Weg", "Stellung", "Schule"]],
    ["Japanisch für Budôka", "Was bedeutet ‚Kamae‘ auf Deutsch?", "Stellung / Haltung", ["Ausführung / Bewegungsablauf", "Faustposition", "Schildkröte", "Wurftechnik", "Begrüßung", "Fallschule"]],
    ["Japanisch für Budôka", "Was ist der sogenannte ‚Kamidana‘ oder ‚Kamiza‘?", "Der Schrein, zu dem im Training angegrüßt wird", ["Der Raum für die Trainingswaffen", "Die Box für eine Samurai-Rüstung", "Der Vorraum zum Schuhe ausziehen", "Die Wand mit den Namensschildern", "Der Sitzplatz der Anfänger", "Das Eingangstor zum Dôjô"]],
    ["Japanische Schrift", "Welches dieser Zeichen ist ein Kanji?", "狸", ["A", "あ", "ア", "い", "イ", "K"]],
    ["Japanische Schrift", "Welches dieser Zeichen ist ein Hiragana?", "あ", ["A", "ア", "狸", "武", "カ", "Z"]],
    ["Japanische Schrift", "Welches dieser Zeichen ist ein Katakana?", "ア", ["A", "あ", "狸", "神", "の", "B"]],
    ["Japanische Schrift", "Welches dieser Zeichen ist Romaji?", "A", ["あ", "ア", "狸", "忍", "の", "タ"]],
    ["Körperteile", "Welches Körperteil ist ‚Kasumi‘?", "Schläfe", ["Gesicht", "Ohr", "Hals", "Schulter", "Rippen", "Handgelenk"]],
    ["Körperteile", "Welches Körperteil bezeichnet ‚Kata‘?", "Schulter", ["Arm", "Bauch", "Bein", "Hüfte", "Kopf", "Knie"]],
    ["Körperteile", "Welches Körperteil ist ‚Koshi‘?", "Hüfte", ["Oberschenkel", "Fingerspitze", "Kiefer", "Schulter", "Oberkörper", "Fuß"]],
    ["Körperteile", "Welches Körperteil ist ‚Kote‘?", "Handgelenk", ["Ellbogen", "Rippen", "Schulter", "Hüfte", "Ohr", "Finger"]],
    ["Körperteile", "Welches Körperteil ist ‚Me‘?", "Augen", ["Nase", "Mund", "Ohren", "Hände", "Füße", "Finger"]],
    ["Körperteile", "Welches Körperteil ist ‚Mimi‘?", "Ohren", ["Augen", "Nase", "Mund", "Schläfe", "Kinn", "Hals"]],
    ["Körperteile", "Welches Körperteil ist ‚Suigetsu‘?", "Solar Plexus", ["Bauch", "Rippen", "Magen", "Schläfe", "Kehle", "Hüfte"]],
    ["Japanisch für Budôka", "Wofür steht das ‚Tai‘ in Taijutsu?", "Körper", ["Kopf", "Arme", "Beine", "Fisch", "Hände", "Geist"]],
    ["Körperteile", "Welches Körperteil ist ‚Te‘?", "Hand", ["Finger", "Hüfte", "Unterarm", "Bein", "Schulter", "Kopf"]],
    ["Körperteile", "Welches Körperteil ist ‚Ude‘?", "Arm / Unterarm", ["Hand", "Schulter", "Nacken", "Bein", "Hüfte", "Finger"]],
    ["Körperteile", "Welches Körperteil ist ‚Yubi‘?", "Finger", ["Hand", "Fuß", "Bein", "Arm", "Ohr", "Zeh"]],
    ["Japanisch für Budôka", "Was bedeuten ‚Ryôte‘, ‚Katate‘ und ‚Mute‘?", "Ryôte = Beide Hände, Katate = Eine Hand, Mute = Keine Hand", ["Ryôte = Eine Hand, Katate = Beide Hände, Mute = Keine Hand", "Ryôte = Keine Hand, Katate = Eine Hand, Mute = Beide Hände", "Ryôte = Rechts, Katate = Links, Mute = Mitte", "Ryôte = Hoch, Katate = Mittel, Mute = Tief", "Ryôte = Außen, Katate = Innen, Mute = Hinten", "Ryôte = Lang, Katate = Kurz, Mute = Breit"]],
    ["Japanisch für Budôka", "Was ist eine ‚Kata‘?", "Ein Bewegungsablauf / eine spezifische Form einer Technik", ["Eine Schriftrolle mit Techniken", "Eine traditionelle Waffe", "Eine spezielle Art zu Rollen", "Eine Verbeugung", "Eine Gürtelfarbe", "Ein Nervendruckpunkt"]],
    ["Japanisch für Budôka", "Was bezeichnet der japanische Begriff ‚Ken‘ im Taijutsu?", "Faust", ["Tritt", "Stellung", "Wurf", "Rolle", "Hebel", "Ausweichen"]],
    ["Japanisch für Budôka", "Was bezeichnet der japanische Begriff ‚Keri‘?", "Tritt", ["Faust", "Stellung", "Schlag", "Wurf", "Block", "Hebel"]],
    ["Japanisch für Budôka", "Was bedeutet ‚Grundlagen / Basis‘ auf Japanisch?", "Kihon", ["Happô", "Gogyô", "Sanshin", "Henka", "Sabaki", "Reihô"]],
    ["Bujinkan • Titel", "Wie bezeichnet man auf Japanisch einen noch unerfahrenen Schüler?", "Kôhai", ["Senpai", "Shodan", "Shihan", "Shidôshi", "Soke", "Daishihan"]],
    ["Bujinkan • Titel", "Wie bezeichnet man auf Japanisch einen erfahrenen Schüler?", "Senpai", ["Kôhai", "Shodan", "Shihan", "Shidôshi", "Soke", "Gaijin"]],
    ["Bujinkan • Titel", "Wie bezeichnet man im Bujinkan einen Lehrer (‚Der den Weg weist‘)?", "Shidôshi", ["Daishihan", "Shihan", "Shodan", "Senpai", "Kôhai", "Uke"]],
    ["Bujinkan • Titel", "Wie bezeichnet man einen sehr erfahrenen Lehrer ab dem 10. Dan?", "Shihan", ["Daishihan", "Shodan", "Shidôshi", "Senpai", "Kôhai", "Shidôshi-Hô"]],
    ["Bujinkan • Titel", "Was ist der höchste Ehrentitel für Lehrer im Bujinkan (ab 15. Dan)?", "Daishihan", ["Shihan", "Shodan", "Shidôshi", "Senpai", "Dôjô-Chô", "Godan"]],
    ["Richtungen", "Wofür steht ‚Zenpô‘ bzw. ‚Mae‘?", "Nach vorne gerichtet", ["Nach hinten gerichtet", "Nach links gerichtet", "Nach rechts gerichtet", "Zur Seite gerichtet", "Nach oben gerichtet", "Nach unten gerichtet"]],
    ["Richtungen", "Wofür steht ‚Kohô‘ bzw. ‚Ushiro‘?", "Nach hinten gerichtet", ["Nach vorne gerichtet", "Nach rechts gerichtet", "Nach links gerichtet", "Zur Seite gerichtet", "Nach innen gerichtet", "Nach außen gerichtet"]],
    ["Japanisch für Budôka", "Was bezeichnet der japanische Begriff ‚Kuzushi‘?", "Schief / Gleichgewicht brechen", ["Stabilität", "Raum", "Moment", "Rolle", "Verbeugung", "Kraft"]],
    ["Bujinkan • Graduierungen", "Wie nennt man im Bujinkan Schülergraduierungen?", "Kyû", ["Dan", "Ryû", "Zan", "Kata", "Waza", "Ken"]],
    ["Kyûsho Jutsu", "Was ist ein ‚Kyûsho‘-Punkt?", "Ein Schmerzpunkt / Nervendruckpunkt", ["Ein Hebelpunkt", "Der Schwerpunkt beim Werfen", "Der wichtigste Punkt einer Kata", "Ein Punkt auf dem Schwert", "Die Mitte des Dôjô", "Eine Verbeugungshöhe"]],
    ["Japanisch für Budôka", "Was bezeichnet der japanische Begriff ‚Mutô‘ NICHT?", "Ohne Sinn", ["Ohne Schwert", "Ohne Kampfeswillen", "Ohne Intention", "Waffenlose Verteidigung gegen Schwert", "Friedliches Herz", "Frei von Angriffslust"]],
    ["Japanisch für Budôka", "Was bezeichnet der japanische Begriff ‚Nagare‘?", "Fließen", ["Aufhalten", "Kämpfen", "Springen", "Stehen", "Schneiden", "Blocken"]],
    ["Japanisch für Budôka", "Wofür steht das ‚Nin‘ (忍) in Ninjutsu?", "Geduld / Ausdauer / Durchhalten", ["Spionieren", "Kämpfen", "Verstecken", "Schleichen", "Täuschen", "Siegen"]],
    ["Etikette • Reihô", "Wie bitten wir beim Angrüßen um ein gutes Training?", "Onegai Shimasu", ["Arigatô Gozaimashita", "Shikin Haramitsu Daikomyô", "Ganbatte Kudasai", "Dô Itashimashite", "Konnichiwa", "Sumimasen"]],
    ["Japanisch für Budôka", "Was bezeichnet der japanische Begriff ‚Otoshi‘?", "Zu Boden werfen / fallen lassen", ["Einen Hebel ausführen", "Eine Wurfwaffe werfen", "Schneiden", "Ausweichen", "Blocken", "Springen"]],
    ["Etikette • Reihô", "Wie bezeichnet man das Verbeugen / die Begrüßungsetikette auf Japanisch?", "Reihô", ["Otoshi", "Reiki", "Ryûha", "Kamae", "Ukemi", "Sabaki"]],
    ["Shu-Ha-Ri", "Wofür steht das ‚Shu‘ (守) aus ‚Shu-Ha-Ri‘?", "Nachahmen / Form bewahren", ["Brechen", "Loslassen", "Hinterfragen", "Erfinden", "Vergessen", "Ignorieren"]],
    ["Shu-Ha-Ri", "Wofür steht das ‚Ha‘ (破) aus ‚Shu-Ha-Ri‘?", "Brechen (der gelernten Form)", ["Nachahmen", "Loslassen", "Erfinden", "Kopieren", "Stehenbleiben", "Vergessen"]],
    ["Shu-Ha-Ri", "Wofür steht das ‚Ri‘ (離) aus ‚Shu-Ha-Ri‘?", "Loslassen / Frei werden", ["Nachahmen", "Brechen", "Vergessen", "Festhalten", "Üben", "Verstecken"]],
    ["Japanisch für Budôka", "Was bezeichnet der japanische Begriff ‚Ryû‘ (流)?", "Kampfkunst-Schule", ["Technik", "Rolle", "Schülergraduierung", "Waffe", "Stellung", "Gürtel"]],
    ["Jûnan Taisô", "Wie kann ‚Ryûtai Undô‘ idiomatisch übersetzt werden?", "Drachenkörper-Übungen", ["10 Wege sich zu stärken", "Spezielle Waffenkata", "Schwertzieh-Übungen", "Atemübungen im Sitzen", "Sprungtraining", "Fallschule rückwärts"]],
    ["Sabaki Waza", "Wie bezeichnet man auf Japanisch das ‚Ausweichen‘?", "Sabaki", ["Hodoki", "Kaiten", "Nagare", "Ukemi", "Tsuki", "Keri"]],
    ["Bujinkan • Konzepte", "Was bezeichnet der japanische Begriff ‚Sakki‘?", "Gespür für Gefahr / Tötungsabsicht", ["Schwertschneide", "Todesangst", "Glücksspiel", "Bewegungsfluss", "Krafteinsatz", "Schnelligkeit"]],
    ["Etikette • Reihô", "Was bedeutet ‚Shikin Haramitsu Daikomyô‘?", "In jedem Moment steckt Erleuchtung", ["Wir bitten um ein gutes Training", "Vielen Dank für das Training", "Mögen die alten Meister uns schützen", "Haltet durch und bleibt dran", "Der Weg des unbeweglichen Herzens", "Siebenmal hinfallen, achtmal aufstehen"]],
    ["Japanisch für Budôka", "Was bezeichnet der japanische Begriff ‚Shinobi‘?", "Eine andere Bezeichnung für ‚Ninja‘", ["Eine Bezeichnung für Großmeister", "Eine alte Ninja-Waffe", "Eine Gürtelfarbe", "Eine Schwertform", "Ein Tempelwächter", "Ein Dôjô-Raum"]],
    ["Bujinkan • Graduierungen", "Wie bezeichnet man den ersten Meistergrad (1. Dan) noch?", "Shodan", ["Nidan", "Senpai", "Sendan", "Godan", "Jûdan", "Kôhai"]],
    ["Japanisch für Budôka", "Was bezeichnet ‚Sode‘ (an der Rüstung bzw. am Gi)?", "Ärmel / Schulterrüstung", ["Faust", "Gürtel", "Hose", "Helm", "Beinschiene", "Kragen"]],
    ["Bujinkan • Struktur", "Was bezeichnet der japanische Begriff ‚Soke‘?", "Oberhaupt einer Kampfkunstschule (Ryû)", ["Eine spezifische Fausthaltung", "Schulterrüstung", "Dôjô-Leiter", "Anfänger im 10. Kyû", "Waffenmeister", "Trainingspartner"]],
    ["Richtungen", "Was bezeichnet der japanische Begriff ‚Uchi‘?", "Innenseite", ["Außenseite", "Rechts", "Links", "Vorne", "Hinten", "Oben"]],
    ["Richtungen", "Was bezeichnet der japanische Begriff ‚Soto‘?", "Außenseite", ["Innenseite", "Rechts", "Links", "Vorne", "Hinten", "Unten"]],
    ["Japanisch für Budôka", "Was bezeichnet der japanische Begriff ‚Suwari‘?", "Sitzen", ["Stehen", "Laufen", "Hocken", "Springen", "Rollen", "Fallen"]],
    ["Taihen Jutsu", "Was ist das ‚Taihen Jutsu‘?", "Kunst, den Körper zu verändern / zu bewegen", ["Kunst zu Rollen", "Kunst zu Fallen", "Kunst einen Gegner zu werfen", "Kunst des Schwertziehens", "Kunst des Werfens von Shuriken", "Kunst der Hebel"]],
    ["Tsuki Waza", "Was bezeichnet der japanische Begriff ‚Tsuki‘?", "Gerader Schlag / Stich", ["Wurf", "Tritt", "Haltung", "Block", "Hebel", "Rolle"]],
    ["Ukemi Waza", "Was bezeichnet der japanische Begriff ‚Ukemi‘?", "Fallen / Fallschule", ["Springen", "Ausweichen", "Schlagen", "Werfen", "Hebeln", "Dehnen"]],
    ["Dôjô-Identität", "Was bezeichnet der japanische Begriff ‚Umidanuki‘ (海狸)?", "Biber", ["Wurfstern", "Maus", "Otter", "Dachs", "Fuchs", "Marderhund"]],
    ["Japanisch für Budôka", "Was bezeichnet der japanische Begriff ‚Waza‘?", "Technik / Prinzip", ["Waffe", "Eine Art zu sitzen", "Eine Körperhaltung", "Eine Schule", "Ein Gürtel", "Ein Schrein"]],
    ["Richtungen", "Was bezeichnet der japanische Begriff ‚Yoko‘?", "Zur Seite gerichtet", ["Nach vorne gerichtet", "Nach hinten gerichtet", "Nach unten gerichtet", "Nach oben gerichtet", "Nach innen gerichtet", "Schräg nach vorne"]],
    ["Kihon-Buch • Historie", "Wer war der letzte aktive Shinobi und Lehrer von Soke Masaaki Hatsumi?", "Takamatsu Toshitsugu", ["Jigorô Kanô", "Morihei Ueshiba", "Miyamoto Musashi", "Gichin Funakoshi", "Oda Nobunaga", "Tokugawa Ieyasu"]],
    ["Kihon-Buch • Struktur", "Wie viele traditionelle japanische Kampfkunstschulen vereint das Bujinkan?", "9 Schulen (6 Samurai- und 3 Ninja-Schulen)", ["5 Schulen (nach den 5 Elementen)", "3 reine Ninja-Schulen", "10 Schulen (für 10 Dan-Grade)", "7 Samurai-Schulen", "12 Schulen", "8 Schulen (nach Kihon Happô)"]],
    ["Kihon-Buch • 9 Schulen", "Welche 3 der 9 Schulen im Bujinkan sind traditionelle Ninja-Schulen?", "Tôgakure Ryû, Kumogakure Ryû, Gyokushin Ryû", ["Gyokko Ryû, Kotô Ryû, Gikan Ryû", "Kukishinden Ryû, Shinden Fudô Ryû, Takagi Yôshin Ryû", "Tôgakure Ryû, Gyokko Ryû, Kukishinden Ryû", "Kotô Ryû, Kumogakure Ryû, Shinden Fudô Ryû", "Gyokushin Ryû, Takagi Yôshin Ryû, Gikan Ryû", "Tôgakure Ryû, Kotô Ryû, Gikan Ryû"]],
    ["Kihon-Buch • Philosophie", "Warum wird im Bujinkan bewusst von ‚Kampfkunst‘ statt ‚Kampfsport‘ gesprochen?", "Es gibt keine Wettkämpfe; Ziel ist die körperliche, geistige und spirituelle Entwicklung", ["Weil nur mit Waffen trainiert wird", "Weil es keine Gürtel gibt", "Weil nur in Japan trainiert werden darf", "Weil keine Techniken am Partner geübt werden", "Weil man erst ab 18 Jahren starten darf", "Weil es olympisch ist"]],
    ["Kihon-Buch • Umidanuki Dôjô", "Welche 3 Grundsätze hebt das Buch ‚Umidanuki Dôjô No Kihon‘ besonders hervor?", "Respekt, Sicherheit und Spaß", ["Härte, Wettkampf und Sieg", "Geschwindigkeit, Muskelkraft und Ausdauer", "Geheimhaltung, Disziplin und Schweigen", "Stärke, Mut und Ehre", "Schnelligkeit, Risiko und Macht", "Strenge, Pflicht und Gehorsam"]],
    ["Kihon-Buch • Graduierungen", "Mit welcher Graduierung und Gürtelfarbe starten Erwachsene im Bujinkan?", "10. Kyû mit weißem Gürtel", ["9. Kyû mit grünem Gürtel", "10. Kyû mit gelbem Gürtel", "1. Kyû mit weißem Gürtel", "Shodan mit schwarzem Gürtel", "8. Kyû mit rotem Gürtel", "10. Kyû ohne Gürtel"]],
    ["Kihon-Buch • Graduierungen", "Welche Gürtelfarben tragen erwachsene Schüler vom 9. Kyû bis zum 1. Kyû?", "Frauen tragen Rot, Männer tragen Grün", ["Alle tragen Gelb bis Braun", "Frauen tragen Blau, Männer tragen Grün", "Jeder Kyû hat eine eigene Farbe", "Alle tragen Orange", "Frauen tragen Weiß, Männer tragen Schwarz", "Alle tragen Braun"]],
    ["Kihon-Buch • Graduierungen", "Woran erkennt man die unterschiedlichen Schülergrade vom 9. bis 1. Kyû auf dem Gi?", "An den silbernen und goldenen Sternen um den Bujin-Patch", ["An farbigen Streifen am Ärmel", "An der Farbe der Hose", "An verschiedenen Gürtelfarben pro Kyû", "An der Größe des Rückendrucks", "An der Knotenart des Gürtels", "An roten Bändern am Gürtel"]],
    ["Kihon-Buch • Graduierungen", "Wie nennt man den angehenden Lehrer vom 1. bis 4. Dan?", "Shidôshi-Hô", ["Shidôshi", "Shihan", "Daishihan", "Senpai", "Soke", "Kôhai"]],
    ["Kihon-Buch • Sakki-Test", "Was ist die Besonderheit der Prüfung zum 5. Dan (Godan)?", "Der Sakki-Test (Ausweichen vor einem Schwertstreich von hinten aus Seiza)", ["Ein Vollkontaktkampf gegen 5 Gegner", "Das Auswendiglernen aller 9 Denshô", "Ein 24-Stunden-Ausdauertraining", "Bogenschießen mit verbundenen Augen", "Ein Bruchtest mit der offenen Hand", "Das Schmieden eines eigenen Tantô"]],
    ["Kihon-Buch • Graduierungen", "In welche 5 Stufen ist der 10. Dan (bis zum 15. Dan) unterteilt?", "Die 5 Elemente: Chi, Sui, Ka, Fû und Kû (Kugyô)", ["Die 5 Techniken des Torite Kihon Gohô", "Die 5 Richtungen des Tai Sabaki", "Die 5 Würfe der Ryu Sui Iki", "Die 5 Waffen des Budo", "Die 5 Stufen des Shu-Ha-Ri", "Die 5 Grund-Kamae"]],
    ["Kihon-Buch • Graduierungen", "Welches Patch darf ein Daishihan (ab 15. Dan) tragen?", "Goldenes Bujin-Symbol auf violettem Grund mit rotem Rand", ["Weißes Kanji auf rotem Grund mit weißem Rand", "Schwarzes Kanji auf rotem Grund mit schwarzem Rand", "Grünes Kanji auf orangefarbenem Grund mit blauem Rand", "Schwarzes Kanji auf gelbem Grund", "Silbernes Kanji auf blauem Grund", "Rotes Kanji auf weißem Grund"]],
    ["Kihon-Buch • Training", "Was ist im Bujinkan-Training laut Kihon-Buch wichtiger als Geschwindigkeit und Kraft?", "Genauigkeit und Präzision (so langsam wie nötig, so flüssig wie möglich)", ["Maximale Muskelkraft", "Explosive Schnelligkeit von Anfang an", "Möglichst harte Treffer bei Uke", "Akrobatische Sprünge", "Ausdauerlaufen", "Wettkampfpunkte"]],
    ["Kihon-Buch • Training", "Wie lautet das Zitat im Kihon-Buch über den Unterschied zwischen Meister und Schüler?", "Der Meister versagte öfter, als der Schüler es versuchte", ["Der Meister ist doppelt so schnell wie der Schüler", "Der Meister macht niemals Fehler", "Der Meister kennt doppelt so viele Waffen", "Der Meister gewinnt jeden Kampf", "Der Meister trainiert nur im Honbu Dôjô", "Der Meister braucht keine Kihon mehr"]],
    ["Kihon-Buch • Reihô", "Wie tief sollte die stehende Verbeugung ‚Shizen Rei‘ mindestens sein?", "Mindestens 30° bei gehaltenem Blickkontakt", ["Genau 90° mit Blick auf die Füße", "Maximal 10° mit geschlossenen Augen", "Bis die Hände die Knie berühren", "Man verbeugt sich im Stehen nicht", "45° mit verschränkten Armen", "Nur ein kurzes Kopfnicken"]],
    ["Kihon-Buch • Reihô", "In welcher Reihenfolge werden die Hände bei ‚Seiza Rei‘ auf dem Boden abgelegt?", "Erst die linke, dann die rechte Hand", ["Erst die rechte, dann die linke Hand", "Beide Hände gleichzeitig als Fäuste", "Die Hände bleiben auf den Oberschenkeln", "Die Arme werden hinter dem Rücken gekreuzt", "Nur die rechte Hand berührt den Boden", "Die Ellbogen werden zuerst abgelegt"]],
    ["Kihon-Buch • Kamae", "Wie ist das Körpergewicht in ‚Ichimonji No Kamae‘ verteilt?", "70 % auf dem hinteren Bein, damit das vordere beweglich bleibt", ["70 % auf dem vorderen Bein", "100 % auf dem vorderen Bein", "Exakt 50/50 im schulterbreiten Stand", "Man steht auf einem Bein", "Man kniet auf dem hinteren Bein", "80 % auf den Zehenspitzen"]],
    ["Kihon-Buch • Kamae", "Welche Faustform bilden die Hände in ‚Ichimonji No Kamae‘?", "Kiten Ken (Shutô)", ["Fudô Ken", "Bôshi Ken", "Shako Ken", "Shikan Ken", "Koppo Ken", "Happa Ken"]],
    ["Kihon-Buch • Kamae", "Welche Faustform und Gewichtsverteilung gehören zu ‚Jumonji No Kamae‘?", "Bôshi Ken über Kreuz vor der Brust, 70 % Gewicht vorne", ["Kiten Ken seitlich gestreckt, 70 % Gewicht hinten", "Fudô Ken an der Hüfte, 50/50 Gewicht", "Shako Ken über dem Kopf, Gewicht auf einem Bein", "Happa Ken am Hals, sitzende Haltung", "Shishin Ken nach vorne, 90 % Gewicht hinten", "Koppo Ken am Knie, 50/50 Gewicht"]],
    ["Kihon-Buch • Kamae", "Wo ist das vordere Bein in ‚Hichô No Kamae‘ positioniert?", "Auf die Wade des hinteren Standbeins aufgestützt", ["Weit nach vorne ausgestreckt", "Hinter dem anderen Bein gekreuzt", "Auf dem Boden abgekniet", "Schulterbreit parallel zum anderen Fuß", "Auf dem Oberschenkel des Gegners", "In der Luft nach hinten gestreckt"]],
    ["Kihon-Buch • Kamae", "Auf welcher Höhe befindet sich die hintere Hand (in Fudô Ken) bei ‚Doko No Kamae‘?", "Auf Höhe von Kasumi (Schläfe)", ["Versteckt an der Hüfte", "Über dem Kopf", "Am vorderen Knie", "Hinter dem Rücken", "Vor dem Bauch", "In der Armbeuge des vorderen Arms"]],
    ["Kihon-Buch • Kamae", "Wodurch zeichnet sich ‚Ihen No Kamae‘ im Vergleich zu Ichimonji aus?", "70 % Gewicht auf dem vorderen Fuß, hintere Hand in der vorderen Armbeuge", ["Beide Arme über dem Kopf in Shako Ken", "Einbeiniger Stand wie bei Hichô", "Sitzende Haltung auf einem Fuß", "Arme weit seitlich ausgestreckt", "Hände vor der Brust in Grußhaltung", "Hände auf den Schienbeinen"]],
    ["Kihon-Buch • Kamae", "Wie werden die Arme und Fäuste in ‚Hoko No Kamae‘ gehalten?", "Arme über dem Kopf, Fäuste bilden Shako Ken", ["Arme seitlich ausgestreckt in Fudô Ken", "Arme über Kreuz vor der Brust in Bôshi Ken", "Hintere Hand an der Hüfte, vordere am Hals", "Rechte Hand umschließt linke Faust vor der Brust", "Hände an der Hüfte in Shizen Tai", "Ein Arm nach unten, einer zur Schläfe"]],
    ["Kihon-Buch • Kamae", "Welche Grußposition umschließt mit der rechten Hand die linke Faust (Fudô Ken) vor der Brust?", "Kongo Gassho No Kamae", ["Fudôza No Kamae", "Rushinyo No Kamae", "Kôsei No Kamae", "Hira No Kamae", "Seiza No Kamae", "Doko No Kamae"]],
    ["Kihon-Buch • Ukemi", "In welcher Form schlagen die Arme bei ‚Zenpô Ukemi‘ vor dem Kopf ab?", "In Form einer japanischen Acht (八 • Hachi)", ["Im 90°-Winkel seitlich ausgestreckt", "Über Kreuz vor der Brust", "Parallel nach hinten gestreckt", "Mit geschlossenen Fäusten auf den Boden", "Flach unter dem Bauch", "Gar nicht – nur die Knie fangen den Sturz ab"]],
    ["Kihon-Buch • Ukemi", "In welchem Winkel zum Oberkörper schlagen die Arme bei ‚Yoko Ukemi‘ und ‚Ushiro Ukemi‘ ab?", "45° zum Oberkörper (Hüfte berührt den Boden nicht)", ["90° waagerecht zum Oberkörper", "0° eng am Körper anliegend", "180° über dem Kopf ausgestreckt", "120° nach hinten oben", "Mit den Ellbogen zuerst im 60°-Winkel", "Die Arme bleiben in der Luft"]],
    ["Kihon-Buch • Ukemi", "Wohin wird der Kopf bei den Rollen (Nagare & Kaiten) genommen?", "Zur Schulter, über die man NICHT rollt (wie einen Telefonhörer einklemmen)", ["In den Nacken gelegt mit Blick nach oben", "Auf die Schulter, über die man rollt", "Geradeaus nach vorne gestreckt", "Mit dem Kinn fest auf das Knie", "Zwischen beide ausgestreckten Arme", "Immer nach links unabhängig von der Rollseite"]],
    ["Kihon-Buch • Ukemi", "Was ist der Unterschied zwischen ‚Jun Nagare‘ und ‚Gyaku Nagare‘ (8. Kyû)?", "Beide sind Fluchtrollen: Jun Nagare rollt schräg rückwärts, Gyaku Nagare verdreht über den vorderen Arm", ["Jun Nagare ist ein Sprung, Gyaku Nagare ein Radschlag", "Jun Nagare ist ein Wurf, Gyaku Nagare ein Hebel", "Jun Nagare erfolgt im Sitzen, Gyaku Nagare aus dem Handstand", "Jun Nagare ist ein Block, Gyaku Nagare ein Tritt", "Beide sind Vorwärtsstürze ohne Rolle", "Jun Nagare nutzt Waffen, Gyaku Nagare ist waffenlos"]],
    ["Kihon-Buch • Ukemi", "Was bezeichnen ‚Hichô Kaiten‘, ‚Oten‘ und ‚Kiten‘ (7. Kyû)?", "Hichô Kaiten = Sprungrolle, Oten = Radschlag, Kiten = Handstandüberschlag", ["Hichô Kaiten = Tritt, Oten = Wurf, Kiten = Faust", "Hichô Kaiten = Stand, Oten = Block, Kiten = Hebel", "Hichô Kaiten = Rückwärtsrolle, Oten = Vorwärtsrolle, Kiten = Seitwärtsrolle", "Hichô Kaiten = Würgegriff, Oten = Opferwurf, Kiten = Feger", "Hichô Kaiten = Schwertschlag, Oten = Stockblock, Kiten = Stich", "Hichô Kaiten = Meditation, Oten = Gruß, Kiten = Dehnung"]],
    ["Kihon-Buch • Taihen Jutsu", "Was ist ‚Ten Chi Tobi‘ (7. Kyû)?", "Ein hoher Sprung mit über Kreuz an die Brust gezogenen Beinen", ["Ein tiefer Schritt am Boden (Suwari Aruki)", "Eine verdrehte Rückwärtsrolle", "Ein seitlicher Ausfallschritt", "Ein Handstandüberschlag über einen Partner", "Ein gerader Fauststoß im Sprung", "Ein Sturz auf den Rücken"]],
    ["Kihon-Buch • Uke Waza", "Wie unterscheiden sich ‚Jodan Uke‘, ‚Daken Uke‘ und ‚Uke Nagashi‘?", "Jodan Uke = defensives Schild, Daken Uke = aggressiver Schlagblock auf Kyûsho, Uke Nagashi = fließendes Weiterleiten", ["Alle drei sind identische Handkantenblöcke", "Jodan Uke nutzt Füße, Daken Uke nutzt Waffen, Uke Nagashi nutzt Würfe", "Jodan Uke ist tief, Daken Uke ist seitlich, Uke Nagashi ist rückwärts", "Jodan Uke greift an, Daken Uke weicht aus, Uke Nagashi würgt", "Alle drei sind Würgetechniken aus dem 7. Kyû", "Jodan Uke ist ein Tritt, Daken Uke ein Hebel, Uke Nagashi eine Rolle"]],
    ["Kihon-Buch • Timing", "Welches Timing beschreibt ‚Nijigen‘ (7. Kyû)?", "Das Tai Sabaki startet erst, nachdem Uke seinen Angriff eingeleitet hat (überrascht)", ["Das Tai Sabaki startet zeitgleich mit Ukes Angriff", "Das Tai Sabaki startet vor Ukes Ausführung (Intention erkannt)", "Ein Angriff im Bodenkampf", "Ein verzögerter Gegenangriff nach einem Wurf", "Das langsame Üben einer Kata", "Ein gleichzeitiger Doppelangriff"]],
    ["Kihon-Buch • Timing", "Welches Timing beschreibt ‚Sanjigen‘ und wofür wird es besonders favorisiert?", "Zeitgleich mit Ukes Angriff – ideal für Uke Nagashi", ["Erst nach Ukes Angriff – ideal für Jodan Uke", "Vor Ukes Angriffsbeginn – ideal für Yûgen", "Nach einem Sturz am Boden", "Nur beim Einsatz des Langstocks", "Nur beim Sakki-Test", "Beim freien Ausführen von Henka"]],
    ["Kihon-Buch • Timing", "Was charakterisiert das Timing ‚Yûgen‘ (7. Kyû)?", "Tori erkennt Ukes Willen/Intention und handelt, noch bevor der Angriff umgesetzt wird", ["Tori wird überrascht und reagiert erst nach Angriffsbeginn", "Tori blockt hart im Moment des Einschlags", "Tori wartet, bis Uke erschöpft ist", "Tori führt einen blinden Präventivschlag aus", "Tori bewegt sich zeitgleich mit dem Angriff", "Tori kontert erst nach dem Griff"]],
    ["Kihon-Buch • Ha Jutsu Kyû Hô", "Welche Finger werden bei ‚Oya Goroshi‘ und ‚Ko Goroshi‘ gehebelt?", "Oya Goroshi = Daumen, Ko Goroshi = Kleiner Finger", ["Oya Goroshi = Zeigefinger, Ko Goroshi = Ringfinger", "Oya Goroshi = Mittelfinger, Ko Goroshi = Daumen", "Oya Goroshi = Handgelenk, Ko Goroshi = Ellbogen", "Oya Goroshi = Schulter, Ko Goroshi = Knie", "Oya Goroshi = Großer Zeh, Ko Goroshi = Knöchel", "Oya Goroshi = Kleiner Finger, Ko Goroshi = Daumen"]],
    ["Kihon-Buch • Ha Jutsu Kyû Hô", "In welcher Richtung erfolgt der Folgeangriff bei ‚Ken Kudaki‘ / ‚Keri Kudaki‘?", "45° in Richtung Boden, um Ukes Gleichgewicht weiter zu brechen", ["Senkrecht nach oben zur Decke", "Waagerecht direkt ins Gesicht", "90° nach hinten über die Schulter", "Kreisförmig um die Hüfte", "Gerade nach unten auf den eigenen Fuß", "Es gibt keinen Folgeangriff"]],
    ["Kihon-Buch • Ha Jutsu Kyû Hô", "Welche Grundregel gilt bei ‚Tai Hodoki‘ zur Befreiung aus Körperhaltegriffen?", "Schwerpunkt tief absenken und Körperspannung lösen, damit Uke keinen Halt findet", ["Alle Muskeln maximal anspannen und nach oben ziehen", "Die Luft anhalten und nach hinten fallen lassen", "Mit beiden Händen blind um sich schlagen", "Auf den Zehenspitzen möglichst groß machen", "Sich im Kreis drehen ohne abzusenken", "Abwarten bis Uke freiwillig loslässt"]],
    ["Kihon-Buch • Kihon Happô", "Aus welchen zwei Technikgruppen setzt sich das ‚Kihon Happô‘ zusammen?", "Koshi Kihon Sanpô (3 Kata) und Torite Kihon Gohô (5 Kata)", ["Sanshin No Kata (5) und Ryu Sui Iki (3)", "Ukemi Waza (4) und Sabaki Waza (4)", "Shime Waza (4) und Nage Waza (4)", "Kamae Kihon (5) und Reihô (3)", "Gyaku Gi (5) und Kaeshi Waza (3)", "Mutô Dori (3) und Sannin Dori (5)"]],
    ["Kihon-Buch • Kihon Happô", "Welche 3 Kata bilden das ‚Koshi Kihon Sanpô‘?", "Ichimonji No Kata, Hichô No Kata, Jumonji No Kata", ["Chi No Kata, Sui No Kata, Ka No Kata", "Omote Gyaku, Ura Gyaku, Ganseki Nage", "Musha Dori, Muso Dori, Ganseki Nage", "Tomoe Nage, Tachi Nagare, Kuruma", "Oya Goroshi, Ko Goroshi, Ôgami Dori", "Tai Gyaku, Hon Gyaku, Yahazu Gake"]],
    ["Kihon-Buch • Kihon Happô", "Welche 5 Techniken bilden das ‚Torite Kihon Gohô‘?", "Omote Kote Gyaku, Ura Kote Gyaku, Musha Dori, Muso Dori, Ganseki Nage", ["Chi, Sui, Ka, Fû und Kû No Kata", "Harai Goshi, Koshi Guruma, Seoi Nage, Uchi Mata, Tomoe Nage", "Omote Oni Kudaki, Ura Oni Kudaki, Take Ori, Ô Gyaku, Juji Dori", "Gyaku Jime, Sankaku Jime, Itami Jime, Do Jime, Hon Jime", "Ichimonji, Hichô, Jumonji, Doko, Hoko No Kata", "Uchi Mawashi, Soto Mawashi, Ôgami Dori, Oya Goroshi, Ko Goroshi"]],
    ["Kihon-Buch • Ryu Sui Iki", "Was sind die 5 Techniken der ‚Ryu Sui Iki‘ (6. Kyû)?", "Opferwürfe (Sutemi Waza), bei denen Tori gemeinsam mit Uke zu Boden geht", ["Fünf Würgetechniken am Revers", "Fünf Befreiungen aus Handgelenksgriffen", "Fünf Schwertkata der Kukishinden Ryû", "Fünf Schlagformen des Hoken Jûrôppô", "Fünf Dehnübungen aus dem Ryûtai Undô", "Fünf Blocktechniken gegen Tritte"]],
    ["Kihon-Buch • Kime Waza", "Wie sollen Kyûsho-Punkte beim Festlegen ‚Itami Dori‘ (6. Kyû) eingesetzt werden?", "Explosionsartig zum Überraschen, dann wieder lockern (Ungewissheit lähmt Uke)", ["Mit gleichmäßigem, dauerhaftem Maximaldruck", "Nur sanft streichend ohne Schmerzreiz", "Erst nachdem Uke aufgestanden ist", "Immer mit geschlossenen Augen", "Nur mit Waffen statt den Händen", "Niemals am Boden"]],
    ["Kihon-Buch • Kaeshi Waza", "Wie lautet der zentrale Leitsatz für Gegentechniken (Kaeshi Waza) im Umidanuki Dôjô?", "‚Gib Uke mehr als er will.‘", ["‚Halte mit voller Kraft dagegen.‘", "‚Weiche niemals in Ukes Richtung aus.‘", "‚Blockiere jedes Gelenk sofort.‘", "‚Greife immer zuerst an.‘", "‚Schnelligkeit schlägt Rhythmus.‘", "‚Lass dich niemals greifen.‘"]],
    ["Kihon-Buch • Sannin Dori", "Was trainiert ‚Sannin Dori‘ (5. Kyû) und welcher Spruch von Nagato Sensei gilt dabei?", "Verteidigung gegen mehrere Gegner – ‚Langsam ist flüssig. Flüssig ist schnell.‘", ["Bodenkampf gegen einen Gegner – ‚Kraft bricht Technik.‘", "Schwertkampf zu dritt – ‚Der Schnellste gewinnt.‘", "Meditation im Stehen – ‚Ruhe ist Stärke.‘", "Fallschule über Hindernisse – ‚Hoch ist sicher.‘", "Waffenabwehr im Sitzen – ‚Härte siegt.‘", "Partnerdehnung – ‚Dehnen vor dem Kampf.‘"]],
    ["Kihon-Buch • Sannin Dori", "Welches taktische Ziel verfolgt man im ‚Sannin Dori‘ gegenüber zwei Angreifern?", "Uke 1 als Hindernis zwischen Tori und Uke 2 positionieren", ["Beide Angreifer gleichzeitig mit beiden Händen greifen", "Zwischen beiden Angreifern stehen bleiben", "Sofort zu Boden gehen und Sutemi Waza nutzen", "Dem zweiten Angreifer den Rücken zudrehen", "Schneller schlagen als beide zusammen", "Die Augen schließen und auf Sakki vertrauen"]],
    ["Honbu Dôjô Leitlinie", "Wie lautet das 7. Prinzip der Bujinkan-Leitlinie von Soke Masaaki Hatsumi?", "‚To study is the path to the immovable heart (Fudôshin).‘", ["‚Nur wer Turniere gewinnt, versteht Budô.‘", "‚Das Geheimnis des Taijutsu liegt in reiner Muskelkraft.‘", "‚Waffen dürfen erst ab dem 5. Dan berührt werden.‘", "‚Techniken dürfen niemals variiert werden.‘", "‚Geschwindigkeit ist wichtiger als Balance.‘", "‚Kampfkunst dient dem Sieg über Schwächere.‘"]],
    ["Kihon-Buch • Ausblick", "Welches Zitat von Hatsumi Masaaki steht am Ende des Kapitels ‚Ausblick‘ im Kihon-Buch?", "‚Understand? Good. Play!‘", ["‚No pain, no gain!‘", "‚Never surrender!‘", "‚Strike first, strike hard!‘", "‚Speed is everything!‘", "‚Train harder every day!‘", "‚Only one way exists!‘"]],
    ["Kihon-Buch • Sanshin", "Mit welcher Technik greift Tori zum Abschluss der ‚Chi No Kata‘ (9. Kyû) an?", "Mit San Shitan Ken zu Nodo (Kehlkopf)", ["Mit horizontalem Shutô Uchi zum Hals", "Mit Ura Shutô zum Hals", "Mit Bôshi Ken zur Hüfte", "Mit Zenpô Geri aus Shako Ken", "Mit Kikaku Ken zur Brust", "Mit Omote Kote Gyaku"]],
    ["Kihon-Buch • Sanshin", "Mit welcher Technik schließt ‚Sui No Kata‘ (8. Kyû) ab?", "Mit einem horizontal ausgeführten Shutô Uchi zum Hals", ["Mit San Shitan Ken zu Nodo", "Mit einem horizontalen Ura Shutô zum Hals", "Mit Bôshi Ken zur Hüfte", "Mit Zenpô Geri nach angetäuschtem Shako Ken", "Mit Happa Ken zu den Ohren", "Mit Ganseki Nage"]],
    ["Kihon-Buch • Sanshin", "Wodurch unterscheidet sich der Abschluss der ‚Ka No Kata‘ (7. Kyû) von ‚Sui No Kata‘?", "Tori greift mit einem horizontal ausgeführten Ura Shutô zum Hals an", ["Tori schlägt mit Bôshi Ken zur Hüfte", "Tori führt einen Zenpô Geri aus", "Tori nutzt San Shitan Ken zum Kehlkopf", "Tori weicht mit einem Rückwärtssalto aus", "Tori wirft Uke mit Tomoe Nage", "Tori setzt einen Würgegriff an"]],
    ["Kihon-Buch • Sanshin", "Wohin greift Tori im Abschluss der ‚Fû No Kata‘ (6. Kyû) nach dem Gedan Uke an?", "Mit Bôshi Ken zur Hüfte von Uke", ["Mit San Shitan Ken zu Nodo", "Mit Shutô Uchi zum Hals", "Mit Zenpô Geri zum Gesicht", "Mit Shuki Ken zu den Rippen", "Mit Kikaku Ken zur Nase", "Mit Ura Kote Gyaku"]],
    ["Kihon-Buch • Sanshin", "Was ist die Besonderheit im Abschluss der ‚Kû No Kata‘ (5. Kyû)?", "Tori wirft die hintere Hand in Shako Ken Richtung Gesicht, greift aber stattdessen mit Zenpô Geri an", ["Tori blockt dreimal hintereinander mit Jodan Uke", "Tori greift mit beiden Händen gleichzeitig zu Nodo an", "Tori führt einen Opferwurf (Tomoe Nage) aus", "Tori beendet die Kata in Seiza No Kamae", "Tori greift mit Bôshi Ken zur Hüfte an", "Tori nutzt ein Katana zur Abwehr"]],
    ["Kihon-Buch • Sabaki", "Was beschreibt das Sabaki-Prinzip ‚Moguri‘ (8. Kyû)?", "Das tiefe Absenken des Körpers unter einen Angriff bzw. zum Balancebrechen", ["Einen hohen Sprung aus der Angriffslinie", "Eine halbkreisförmige Ausweichbewegung", "Das Laufen auf den Knien (Suwari Aruki)", "Einen schnellen Fluchtsprung (Tobi Ashi)", "Das Rollen über ein Hindernis", "Das Eindrehen für einen Hüftwurf"]],
    ["Kihon-Buch • Sabaki", "Was fasst das Sabaki-Prinzip ‚Tobi‘ (8. Kyû) zusammen?", "Alle Flucht- und Ausweichbewegungen mit einem Herausspringen aus Ukes Angriffslinie", ["Das tiefe Abtauchen unter Schlägen", "Das halbkreisförmige Ausweichen", "Das Laufen mit gekreuzten Füßen", "Das Abfangen eines Sturzes", "Das Festlegen am Boden", "Das Werfen von Shuriken"]],
    ["Kihon-Buch • Shinobi Aruki", "Wie stehen die drei Bodenkontaktpunkte (Fuß, Knie, Ballen) beim Start von ‚Suwari Aruki‘?", "Sie bilden ein gleichschenkliges Dreieck in Suwari Gata No Kamae", ["Alle Punkte liegen auf einer geraden Linie", "Beide Knie berühren sich eng wie in Seiza", "Man hockt nur auf beiden Fersen", "Ein Bein ist seitlich 90° ausgestreckt", "Man liegt flach auf dem Bauch", "Beide Füße stehen schulterbreit im Stand"]],
    ["Kihon-Buch • Shinobi Aruki", "Aus welcher Kamae beginnt ‚Yoko Aruki‘ und in welche Kamae bewegen sich die Arme?", "Start aus tiefer Jumonji No Kamae, Arme bewegen sich analog Hira No Kamae", ["Start aus Seiza, Arme über dem Kopf in Hoko No Kamae", "Start aus Hichô No Kamae, Arme in Kongo Gassho", "Start aus Shizen Tai, Arme am Rücken", "Start aus Doko No Kamae, Arme in Fudô Ken", "Start aus Fudôza, Arme nach unten gestreckt", "Start aus Kôsei No Kamae, Arme verschränkt"]],
    ["Kihon-Buch • Shinobi Aruki", "Wozu dient die Schritt-/Sprungtechnik ‚Tobi Ashi‘ (9. Kyû)?", "Eine schnelle Sprungbewegung zur Flucht durch fliegenden Standbeinwechsel", ["Ein hoher Sprung über einen Langstock", "Ein lautloses Gehen auf den Knien", "Ein kräftiger Stampftritt mit der Ferse", "Ein Feger gegen Ukes vorderes Bein", "Ein Handstandüberschlag", "Eine Methode zum Aufstehen aus Seiza"]],
    ["Kihon-Buch • Kihon Happô", "Wie wird der Arm von Uke bei ‚Omote Kote Gyaku‘ gedreht?", "Die Hand wird gekippt und gedreht, sodass Elle und Speiche gegeneinander verdreht werden", ["Der Arm wird gestreckt hinter dem Rücken fixiert", "Nur der Daumen wird nach hinten gedrückt", "Der Ellbogen wird mit dem Knie nach unten geschlagen", "Die Hand wird wie zum Gebet nach oben geführt", "Ukes Arm wird um Toris Nacken gelegt", "Uke wird am Revers über die Hüfte geworfen"]],
    ["Kihon-Buch • Gyaku Gi", "Wie entsteht die Hebelwirkung bei ‚Yahazu Gake‘ (8. Kyû)?", "Tori formt ein ‚Z‘ aus Hand, Unterarm und Oberarm und verdreht Hand und Ellbogen gegensätzlich", ["Tori verneigt sich einfach nach vorne über Ukes Hand", "Tori hebt Uke an der Hüfte aus", "Tori legt seinen Arm um Ukes Hals", "Tori tritt gegen Ukes Kniekehle", "Tori drückt nur auf Ukes kleinen Finger", "Tori klemmt Ukes Hand unter die eigene Achsel"]],
    ["Kihon-Buch • Gyaku Gi", "Wie wird der Schmerzhebel ‚Hon Gyaku‘ (8. Kyû) abgeschlossen?", "Ukes Hand (kleiner Finger oben) wird mit beiden Händen gegriffen und Tori verneigt sich", ["Tori tritt mit Sokuyaku Geri zum Bauch", "Tori dreht sich für einen Schulterwurf ein", "Tori presst Ukes Ellbogen an die eigene Brust", "Tori springt über Ukes Arm hinweg", "Tori greift Ukes Revers über Kreuz", "Tori wirft Uke über den gestreckten Arm"]],
    ["Kihon-Buch • Shime Waza", "Wie wird der Würgegriff ‚Gyaku Jime‘ (7. Kyû) ausgeführt?", "Hände greifen Ukes Revers gegensätzlich und drehen beide Hände nach innen", ["Tori legt von hinten die Armbeuge an Ukes Kehlkopf", "Tori umklammert Ukes Oberkörper und verdreht ihn", "Tori presst Ukes Arm gegen seinen eigenen Hals", "Tori klemmt Ukes Kopf zwischen den Beinen ein", "Tori drückt mit einem Finger auf Kasumi", "Tori greift nur mit einer Hand den Gürtel"]],
    ["Kihon-Buch • Shime Waza", "Wie schützt sich Tori bei ‚Do Jime‘ (7. Kyû) vor einem Kopfstoß (Kikaku Ken) von Uke?", "Tori nimmt den eigenen Kopf seitlich an Uke in Deckung", ["Tori lehnt den Kopf weit nach hinten", "Tori hält eine Hand vor die eigene Stirn", "Tori kniet sich sofort ab", "Tori schließt die Augen", "Tori streckt beide Arme weit von sich", "Tori trägt immer einen Helm"]],
    ["Kihon-Buch • Mutô Dori", "Aus welchen 3 Kamae wird ‚Mutô Dori‘ im 5. Kyû Kihon-Buch gegen einen Shomen Giri trainiert?", "Hira No Kamae, Ichimonji No Kamae und Jumonji No Kamae", ["Seiza, Fudôza und Shizen Tai", "Doko, Hoko und Kôsei No Kamae", "Hichô, Ihen und Rushinyo No Kamae", "Kongo Gassho, Seigan und Hassô No Kamae", "Katayaburi, Otonashi und Tôtoku No Kamae", "Hachimonji, Tonsô und Mokuton No Kamae"]],
    ["Curriculum • 4. Kyû Begriffe", "Was bezeichnen ‚Shoden‘, ‚Chûden‘ und ‚Okuden‘ in den Denshô der Schulen?", "Anfangsstufe (Grundstufe), Mittelstufe und tiefe / innere Überlieferung", ["Hoch, Mittel und Tief beim Schlagen", "Links, Mitte und Rechts im Raum", "Messer, Kurzschwert und Langschwert", "Schüler, Lehrer und Großmeister", "Erde, Wasser und Feuer", "Vorwärts-, Seitwärts- und Rückwärtsrolle"]],
    ["Curriculum • 4. Kyû Begriffe", "Was bezeichnen die Begriffe ‚Tantô‘ und ‚Wakizashi‘?", "Tantô = Messer / Dolch, Wakizashi = Kurzschwert", ["Tantô = Langstock, Wakizashi = Kurzstock", "Tantô = Speer, Wakizashi = Hellebarde", "Tantô = Wurfstern, Wakizashi = Wurfpfeil", "Tantô = Langschwert, Wakizashi = Holzschwert", "Tantô = Seil, Wakizashi = Kette", "Tantô = Rüstung, Wakizashi = Helm"]],
    ["Curriculum • 3. Kyû Begriffe", "Was sind ‚Katana‘ und ‚Tachi‘ im Kenjutsu (3. Kyû)?", "Traditionelle japanische Langschwerter (unterschiedliche Tragweise / Krümmung)", ["Kurzstock und Langstock", "Wurfstern und Wurfmesser", "Messer und Kurzschwert", "Zwei Arten von Verbeugungen", "Zwei Würgegriffe der Kukishinden Ryû", "Zwei Arten von Fallschule"]],
    ["Curriculum • 8. Kyû Begriffe", "Was bezeichnet der japanische Begriff ‚Yoroi‘ (8. Kyû)?", "Traditionelle japanische Samurai-Rüstung", ["Ein hölzernes Übungsschwert", "Ein traditioneller Trainingsanzug", "Ein japanischer Bogen", "Ein Wurf über die Hüfte", "Ein Schrein im Dôjô", "Eine Atemübung"]],
    ["Curriculum • 9. Kyû", "Zu welchem Trainingsbereich gehören ‚Suri Ashi‘ und ‚Wari Ashi‘ im 9. Kyû?", "Shinobi Aruki Jutsu (Spezielle Geh- und Schrittarten)", ["Kihon Happô (Hebeltechniken)", "Shime Waza (Würgetechniken)", "Nage Waza (Wurftechniken)", "Kime Waza (Bodenkontrolle)", "Reihô (Grußzeremonie)", "Jûnan Taisô (Dehnübungen)"]],
    ["Kihon-Buch • Graduierungen", "Wie sieht das Bujin-Patch ab dem 5. Dan (Shidôshi) bis 9. Dan aus?", "Schwarzes Kanji (weiß umrandet) auf rotem Grund mit silbernem Rand", ["Weißes Kanji auf rotem Grund mit weißem Rand", "Schwarzes Kanji auf rotem Grund mit schwarzem Rand", "Grünes Kanji auf orangefarbenem Grund mit blauem Rand", "Goldenes Kanji auf violettem Grund mit rotem Rand", "Rotes Kanji auf schwarzem Grund mit goldenem Rand", "Blaues Kanji auf weißem Grund"]],
    ["Kihon-Buch • Graduierungen", "Wie sieht das Bujin-Patch ab dem 10. Dan (Shihan) aus?", "Grünes Kanji auf orangefarbenem Grund mit blauem Rand", ["Weißes Kanji auf rotem Grund mit weißem Rand", "Schwarzes Kanji auf rotem Grund mit schwarzem Rand", "Schwarzes Kanji (weiß umrandet) auf rotem Grund mit silbernem Rand", "Goldenes Kanji auf violettem Grund mit rotem Rand", "Gelbes Kanji auf grünem Grund mit weißem Rand", "Schwarzes Kanji auf blauem Grund"]]
];

// Structured factual datasets from Kihon Book & all 14 Curriculum CSVs (137 entries -> total = exactly 300 questions!)
const structured_quiz_tables = [
    {
        category: "Japanisch • Zahlen (10. Kyû)",
        template: "Welche Zahl bedeutet ‚{key}‘ auf Japanisch?",
        entries: [
            ["Ichi (一)", "1"], ["Ni (二)", "2"], ["San (三)", "3"], ["Shi / Yon (四)", "4"], ["Go (五)", "5"],
            ["Roku (六)", "6"], ["Shichi / Nana (七)", "7"], ["Hachi (八)", "8"], ["Ku / Kyû (九)", "9"], ["Jû (十)", "10"]
        ]
    },
    {
        category: "Die 9 Schulen (Ryûha)",
        template: "Wie lautet die deutsche Übersetzung der ‚{key}‘?",
        entries: [
            ["Gikan Ryû", "Die Schule der Wahrheit, Treue und Gerechtigkeit"],
            ["Gyokko Ryû", "Die Schule des Juwelentigers"],
            ["Gyokushin Ryû", "Die Schule des Juwelenherzens"],
            ["Kotô Ryû", "Die Schule, die den Tiger niederschlägt"],
            ["Kukishinden Ryû", "Die Schule der neun göttlichen Dämonen"],
            ["Kumogakure Ryû", "Die Schule verborgen im Nebel"],
            ["Shinden Fudô Ryû", "Die Schule des unbeweglichen Herzens"],
            ["Takagi Yôshin Ryû", "Hoher Baum - Erhabenes Herz - Schule"],
            ["Tôgakure Ryû", "Die Schule der verborgenen Tür"]
        ]
    },
    {
        category: "Die 9 Schulen (Disziplinen)",
        template: "Wie lautet der vollständige japanische Name der ‚{key}‘?",
        entries: [
            ["Tôgakure Ryû", "Tôgakure Ryû Ninpô Taijutsu"],
            ["Kumogakure Ryû", "Kumogakure Ryû Ninpô Taijutsu"],
            ["Gyokushin Ryû", "Gyokushin Ryû Ninpô Taijutsu"],
            ["Gyokko Ryû", "Gyokko Ryû Kosshi Jutsu"],
            ["Kotô Ryû", "Kotô Ryû Koppo Jutsu"],
            ["Shinden Fudô Ryû", "Shinden Fudô Ryû Daken Taijutsu"],
            ["Kukishinden Ryû", "Kukishinden Ryû Happô Biken Jutsu"],
            ["Takagi Yôshin Ryû", "Takagi Yôshin Ryû Jutai Jutsu"],
            ["Gikan Ryû", "Gikan Ryû Koppo Jutsu"]
        ]
    },
    {
        category: "Hoken Jûrôppô (Körperwaffen)",
        template: "Was beschreibt die Körperwaffe ‚{key}‘ im Hoken Jûrôppô?",
        entries: [
            ["Fudô Ken", "Stabile Faust mit seitlich an die mittleren Fingerglieder gedrücktem Daumen"],
            ["Bôshi Ken", "Daumenfaust: Daumen übt Druck auf den eingeknickten Zeigefinger aus"],
            ["Kiten Ken (Shutô)", "Handkantenschlag mit weit geöffneten Langfingern und Druck des Daumens"],
            ["Go Shitan Ken", "Die vier Langfinger werden zusammengeführt und durch den Daumen stabilisiert"],
            ["Shishin Ken", "Ein einzelner Finger zum Angriff auf Nervendruckpunkte (Kyûsho)"],
            ["Shako Ken", "Krallenfaust zum Attackieren weicher Stellen und anschließendem Greifen"],
            ["Shikan Ken", "Angewinkelte Finger mit ausgestrecktem erstem Glied (Knöchelangriff)"],
            ["Koppo Ken", "Daumenknöchel-Angriff aus Fudô Ken auf Kyûsho-Punkte"],
            ["Happa Ken", "Flach geöffnete Handfläche zum Angriff auf empfindliche Stellen wie die Ohren"],
            ["Sokuyaku Geri", "Gerader Stampftritt mit der Ferse als Trefferfläche"],
            ["Sokugyaku Geri", "Gerader Tritt mit abgespreizten Zehen und dem Fußballen als Trefferfläche"],
            ["Sokushi Geri", "Angriff mit den ausgestreckten Zehen auf Kyûsho-Punkte (ähnlich Bôshi Ken)"],
            ["Kikaku Ken", "Angriff mit der Stirn bzw. dem Kopf"],
            ["Shuki Ken", "Angriff mit dem Ellbogen (optional gestützt durch den anderen Arm)"],
            ["Sokki Ken", "Angriff mit dem Knie in kurzer Distanz"],
            ["Tai Ken", "Nutzung des gesamten Körpers als Waffe (z. B. Umlaufen eines instabilen Uke)"]
        ]
    },
    {
        category: "Curriculum • Fokus je Grad",
        template: "Welcher Fokus / Schwerpunkt gehört im Umidanuki-Curriculum zu ‚{key}‘?",
        entries: [
            ["Gedan (Gelber Gürtel)", "Sicherheit – Ten"],
            ["Chûdan (Gelber Gürtel)", "Kihon I – Chi"],
            ["Jôdan (Gelber Gürtel)", "Kihon II – Jin"],
            ["10. Kyû", "Verständnis (Philosophie, Etikette & Struktur)"],
            ["9. Kyû", "Balance / Element Erde (Chi)"],
            ["8. Kyû", "Distanz / Element Wasser (Sui)"],
            ["7. Kyû", "Timing / Element Feuer (Ka)"],
            ["6. Kyû", "Rhythmus / Element Luft (Fû)"],
            ["5. Kyû", "Gespür (Feeling) / Element Leere (Kû)"],
            ["4. Kyû", "Gyokko Ryû / Kotô Ryû – Tantô & Wakizashi Jutsu"],
            ["3. Kyû", "Kukishinden Ryû – Kenjutsu (Katana / Tachi)"],
            ["2. Kyû", "Takagi Yôshin Ryû – Hanbô Jutsu"],
            ["1. Kyû", "Shinden Fudô Ryû – Bô, Yari & Naginata Jutsu"],
            ["1. Dan (Shodan)", "Tôgakure / Kumogakure / Gyokushin Ryû – Hiden Buki & Shuriken Jutsu"]
        ]
    },
    {
        category: "Kime Waza • Bodenkontrolle",
        template: "Wie wird die Boden-Kontrolltechnik ‚{key}‘ ausgeführt?",
        entries: [
            ["Omote Kote Gyaku (Kime Waza)", "Tori kniet sich auf Ukes Brustmuskelansatz und verdreht das Handgelenk"],
            ["Ura Kote Gyaku (Kime Waza)", "Tori kniet sich auf Ukes Hüfte und verdreht den Arm auf dem Rücken"],
            ["Itami Dori (Kime Waza)", "Explosionsartiges, überraschendes Drücken und Lockern von Kyûsho-Punkten am Boden"],
            ["Muso Dori (Kime Waza)", "Ukes Arm liegt auf dem Spann von Toris Fuß, der zweite Fuß drückt auf den Ellbogen"],
            ["Musha Dori (Kime Waza)", "Tori stellt sein Bein an Ukes Kopf ab, um ein Herausdrehen am Boden zu verhindern"],
            ["Tai Gyaku (Kime Waza)", "Tori kniet auf Ukes Schulterblatt und schiebt den gestützten Arm über Ukes Kopf"],
            ["Take Ori (Kime Waza)", "Tori kniet auf Ukes Bizeps (vor- und zurückschieben) bei gleichzeitigem Take Ori"]
        ]
    },
    {
        category: "Kihon • Technik-Kategorien",
        template: "Zu welchem Themenbereich gehört die Technik ‚{key}‘?",
        entries: [
            ["Uchi Mawashi Dori", "Ha Jutsu Kyû Hô (Te Hodoki – Griffbefreiung)"],
            ["Soto Mawashi Dori", "Ha Jutsu Kyû Hô (Te Hodoki – Griffbefreiung)"],
            ["Ôgami Dori", "Ha Jutsu Kyû Hô (Te Hodoki – Griffbefreiung)"],
            ["Happô Keri", "Ha Jutsu Kyû Hô (Befreiung durch Tritte)"],
            ["Harai Goshi", "Nage Waza (Wurftechnik • 6. Kyû)"],
            ["Koshi Guruma", "Nage Waza (Wurftechnik • 6. Kyû)"],
            ["Seoi Nage", "Nage Waza (Wurftechnik • 6. Kyû)"],
            ["Uchi Mata", "Nage Waza (Wurftechnik • 6. Kyû)"],
            ["Tomoe Nage", "Ryu Sui Iki (Opferwurf / Sutemi Waza • 6. Kyû)"],
            ["Tachi Nagare", "Ryu Sui Iki (Opferwurf / Sutemi Waza • 6. Kyû)"],
            ["Te Makura", "Ryu Sui Iki (Opferwurf / Sutemi Waza • 6. Kyû)"],
            ["Kuruma", "Ryu Sui Iki (Opferwurf / Sutemi Waza • 6. Kyû)"],
            ["Sankaku Jime", "Shime Waza (Würgetechnik • 7. Kyû)"],
            ["Itami Jime", "Shime Waza (Würgetechnik • 7. Kyû)"],
            ["Hon Jime", "Shime Waza (Würgetechnik • 7. Kyû)"],
            ["Omote Oni Kudaki", "Gyaku Gi (Hebeltechnik • 7. Kyû)"],
            ["Ura Oni Kudaki", "Gyaku Gi (Hebeltechnik • 7. Kyû)"],
            ["Omote Take Ori", "Gyaku Gi (Hebeltechnik • 7. Kyû)"],
            ["Ô Gyaku", "Gyaku Gi (Hebeltechnik • 7. Kyû)"],
            ["Jûji Dori", "Gyaku Gi (Hebeltechnik • 7. Kyû)"],
            ["Omote Ude Gadami", "Gyaku Gi (Hebeltechnik • 7. Kyû)"],
            ["Kakato Geri", "Keri Waza (Wischender Tritt • 8. Kyû)"],
            ["Tsuitaiken", "Keri Waza (Stampftritt ohne Hüftdrehung • 8. Kyû)"],
            ["Shin Kokyô Sanden (Dai Ichi – Dai San)", "Atem- und Energieübungen (8. Kyû Curriculum)"]
        ]
    },
    {
        category: "Curriculum • Ryûha Kata",
        template: "Zu welcher Schule (Ryûha) gehört ‚{key}‘ im Curriculum?",
        extra_pool: [
            "Kumogakure Ryû (1. Dan)",
            "Gyokushin Ryû (1. Dan)",
            "Gikan Ryû (Koppo Jutsu)"
        ],
        entries: [
            ["Joryaku No Maki – Koku & Renyo", "Gyokko Ryû (4. Kyû)"],
            ["Joryaku No Maki – Danshu & Danshi", "Gyokko Ryû (4. Kyû)"],
            ["Joryaku No Maki – Ketsumyaku & Sakketsu", "Gyokko Ryû (4. Kyû)"],
            ["Churyaku No Maki – Hosen & Horaku", "Gyokko Ryû (4. Kyû)"],
            ["Geryaku No Maki – Shunsoku & Ichigeki", "Gyokko Ryû (4. Kyû)"],
            ["Shoden Gata – Yokuto & Koyoku", "Kotô Ryû (4. Kyû)"],
            ["Shoden Gata – Shato & Sakugeki", "Kotô Ryû (4. Kyû)"],
            ["Chuden Gata – Hida & Tekigaeshi", "Kotô Ryû (4. Kyû)"],
            ["Hekito Gata – Sokuboku & Dako", "Kotô Ryû (4. Kyû)"],
            ["Kaiden – Goshin & Katsugan", "Kotô Ryû (4. Kyû)"],
            ["Shoden Gata – Seion & Uyoku", "Kukishinden Ryû (3. Kyû)"],
            ["Shoden Gata – Suisha & Iso Arashi", "Kukishinden Ryû (3. Kyû)"],
            ["Chuden Gata – Shiokaze & Tatsunami", "Kukishinden Ryû (3. Kyû)"],
            ["Sabaki Gata – Arakoma & Iso Gaeshi", "Kukishinden Ryû (3. Kyû)"],
            ["Shirabe Moguri Gata – Torafushi & Musasabi", "Kukishinden Ryû (3. Kyû)"],
            ["Shoden Omote Waza – Kasumi Dori & Do Gaeshi", "Takagi Yôshin Ryû (2. Kyû)"],
            ["Shoden Omote Waza – Karame Dori & Kaigo Kudaki", "Takagi Yôshin Ryû (2. Kyû)"],
            ["Chuden No Tai – Yotsude & Yuki Yanagi", "Takagi Yôshin Ryû (2. Kyû)"],
            ["Daisho Sabaki Gata – Tsuka Kudaki & Yaiba Musubi", "Takagi Yôshin Ryû (2. Kyû)"],
            ["Okuden Moguri Gata – Gokuraku Otoshi & Jigoku Dori", "Takagi Yôshin Ryû (2. Kyû)"],
            ["Shoden Gata – Matsu Kaze & Ryu Ko", "Shinden Fudô Ryû (1. Kyû)"],
            ["Shoden Gata – Koromo Gaeshi & Saka Otoshi", "Shinden Fudô Ryû (1. Kyû)"],
            ["Shoden Gata – Jinchu Nage & Gyakuraku Otoshi", "Shinden Fudô Ryû (1. Kyû)"],
            ["Chuden Gata – Kocho Dori & Kasa Harai", "Shinden Fudô Ryû (1. Kyû)"],
            ["Okuden Gata – Hyo Fu & Furoya Nage", "Shinden Fudô Ryû (1. Kyû)"],
            ["Taijutsu Ukemi Gata – Kaeshi Dori & Itto Dori", "Tôgakure Ryû (1. Dan)"],
            ["Shinobi Gaeshi Gata – Shige Gaeshi & Sora Tobi", "Tôgakure Ryû (1. Dan)"],
            ["Shinobi Gaeshi Hiden Gata – Chugaeri & Teppan Nage", "Tôgakure Ryû (1. Dan)"],
            ["Santo Tonko No Kata – Atekomi Tonso No Kata", "Tôgakure Ryû (1. Dan)"],
            ["Santo Tonko No Kata – Happo Kirigakure No Kata", "Tôgakure Ryû (1. Dan)"]
        ]
    },
    {
        category: "Curriculum • Waffen & Ryûha-Kamae",
        template: "Wohin gehört ‚{key}‘ im Ninjutsu-Curriculum?",
        entries: [
            ["Hanin No Kamae", "Gyokko Ryû (4. Kyû)"],
            ["Bobi No Kamae", "Kotô Ryû (4. Kyû)"],
            ["Katate Hichô No Kamae", "Kukishinden Ryû (3. Kyû)"],
            ["Moko No Kamae", "Takagi Yôshin Ryû (2. Kyû)"],
            ["Katate Seigan No Kamae", "Shinden Fudô Ryû (1. Kyû)"],
            ["Hachimonji, Happô Gakure, Tonsô & Mokuton No Kamae", "Tôgakure / Kumogakure / Gyokushin Ryû (1. Dan)"],
            ["Shomen Giri, Do Giri, Kesa Giri & Gyaku Kesa Giri", "Grundschnitte im Tantô-, Wakizashi- & Kenjutsu"],
            ["Wakizashi No Nugi", "Ziehtechnik des Kurzschwerts (4. Kyû)"],
            ["Nugigatana", "Schwertziehtechnik im Kenjutsu (3. Kyû)"],
            ["Daijôdan, Hassô & Kasumi No Kamae (Waffe)", "Kenjutsu – Katana / Tachi (3. Kyû)"],
            ["Katayaburi, Munenmusô / Tate, Otonashi & Tôtoku No Kamae", "Hanbô Jutsu – Kurzstock (2. Kyû)"],
            ["Koshi Ori & Tsuki Iri (Waffe)", "Gyaku Gi im Hanbô Jutsu (2. Kyû)"],
            ["Ushiro Naname Wake Uchi", "Uke Waza im Hanbô Jutsu (2. Kyû)"],
            ["Bo Furi Gata & Goho No Kata", "Bô Jutsu – Langstock (1. Kyû)"],
            ["Tenchi No Kamae & Heito No Kamae", "Bô Jutsu – Langstock (1. Kyû)"],
            ["Tento Uchi, Men Uchi, Ashi Barai & Age Uchi", "Schlag- und Fegertechniken im Bô Jutsu (1. Kyû)"],
            ["Bô Shuriken, Teppan Shuriken & Senban Shuriken Nage", "Shuriken Jutsu – Wurfwaffen (1. Dan)"],
            ["Tori Momune Katate, Kumiuchi, Sode-, Kata- & Kote Tori", "Tori Kihon Gata – Grundgriffe (9. Kyû)"]
        ]
    }
];

// =========================================================================
// QUIZ POOL BUILDER (EXACTLY 300 QUESTIONS, 6 WRONG OPTIONS PER QUESTION)
// =========================================================================

function ShuffleArrayInPlace(target_array)
{
    for (let _i = target_array.length - 1; _i > 0; _i--)
    {
        let _j = Math.floor(Math.random() * (_i + 1));
        let _temp = target_array[_i];
        target_array[_i] = target_array[_j];
        target_array[_j] = _temp;
    }
    return target_array;
}

function BuildCompleteQuizPool()
{
    let _pool = [];

    // 1. Add all explicit questions (163 questions with 6 bespoke wrong answers each)
    explicit_kuden_questions.forEach(function(_item)
    {
        _pool.push({
            category: _item[0],
            question: _item[1],
            correct: _item[2],
            wrong_pool: _item[3].slice(0, 6)
        });
    });

    // 2. Expand structured Kihon & Curriculum tables (137 questions -> 300 total)
    structured_quiz_tables.forEach(function(_table)
    {
        let _unique_answers = [];
        _table.entries.forEach(function(_e)
        {
            if (_unique_answers.indexOf(_e[1]) === -1)
            {
                _unique_answers.push(_e[1]);
            }
        });
        if (_table.extra_pool)
        {
            _table.extra_pool.forEach(function(_extra)
            {
                if (_unique_answers.indexOf(_extra) === -1)
                {
                    _unique_answers.push(_extra);
                }
            });
        }

        _table.entries.forEach(function(_entry)
        {
            let _key = _entry[0];
            let _correct_answer = _entry[1];
            let _distractors = _unique_answers.filter(function(_ans)
            {
                return _ans !== _correct_answer;
            });
            ShuffleArrayInPlace(_distractors);

            _pool.push({
                category: _table.category,
                question: _table.template.replace("{key}", _key),
                correct: _correct_answer,
                wrong_pool: _distractors.slice(0, 6)
            });
        });
    });

    kuden_quiz_questions = ShuffleArrayInPlace(_pool);
}
