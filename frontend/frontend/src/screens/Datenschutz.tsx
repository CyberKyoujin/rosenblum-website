import Footer from "../components/Footer";
import NavigationSection from "../components/NavigationSection";

const Datenschutz = () => {
    return (
        <>
            <div className="main-app-container">
                <NavigationSection first_link="Datenschutz" />

                <div className="legal-container">
                    <h1 className="legal-title">Datenschutzerklärung</h1>

                    <section className="legal-section">
                        <h2>1. Datenschutz auf einen Blick</h2>

                        <h3>Allgemeine Hinweise</h3>
                        <p>
                            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
                            personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
                            Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert
                            werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie
                            unserer unter diesem Text aufgeführten Datenschutzerklärung.
                        </p>

                        <h3>Datenerfassung auf dieser Website</h3>
                        <p><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong></p>
                        <p>
                            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.
                            Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur Verantwortlichen
                            Stelle" in dieser Datenschutzerklärung entnehmen.
                        </p>

                        <p><strong>Wie erfassen wir Ihre Daten?</strong></p>
                        <p>
                            Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen.
                            Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
                        </p>
                        <p>
                            Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der
                            Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten
                            (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die
                            Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.
                        </p>

                        <p><strong>Wofür nutzen wir Ihre Daten?</strong></p>
                        <p>
                            Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website
                            zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
                        </p>

                        <p><strong>Welche Rechte haben Sie bezüglich Ihrer Daten?</strong></p>
                        <p>
                            Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger
                            und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben
                            außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.
                            Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese
                            Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht,
                            unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer
                            personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein
                            Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
                        </p>
                    </section>

                    <section className="legal-section">
                        <h2>2. Hosting und Content Delivery Networks (CDN)</h2>

                        <h3>Cloudflare</h3>
                        <p>
                            Wir nutzen den Service „Cloudflare". Anbieter ist die Cloudflare Inc., 101
                            Townsend St., San Francisco, CA 94107, USA (im Folgenden „Cloudflare").
                        </p>
                        <p>
                            Cloudflare bietet ein weltweit verteiltes Content Delivery Network mit DNS an.
                            Dabei wird technisch der Informationstransfer zwischen Ihrem Browser und unserer
                            Website über das Netzwerk von Cloudflare geleitet. Das versetzt Cloudflare in die
                            Lage, den Datenverkehr zwischen Ihrem Browser und unserer Website zu analysieren
                            und als Filter zwischen unseren Servern und potenziell bösartigem Datenverkehr
                            aus dem Internet zu dienen. Hierbei kann Cloudflare auch Cookies oder sonstige
                            Technologien zur Wiedererkennung von Internetnutzern einsetzen, die jedoch
                            allein zum hier beschriebenen Zweck verwendet werden.
                        </p>
                        <p>
                            Der Einsatz von Cloudflare beruht auf unserem berechtigten Interesse an einer
                            möglichst fehlerfreien und sicheren Bereitstellung unseres Webangebotes (Art. 6
                            Abs. 1 lit. f DSGVO).
                        </p>
                        <p>
                            Die Datenübertragung in die USA wird auf die Standardvertragsklauseln der
                            EU-Kommission gestützt. Details finden Sie hier:{" "}
                            <a
                                href="https://www.cloudflare.com/privacypolicy/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="legal-link"
                            >
                                https://www.cloudflare.com/privacypolicy/
                            </a>
                        </p>
                    </section>

                    <section className="legal-section">
                        <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>

                        <h3>Datenschutz</h3>
                        <p>
                            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr
                            ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend
                            den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                        </p>
                        <p>
                            Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten
                            erhoben. Personenbezogene Daten sind Daten, mit denen Sie persönlich
                            identifiziert werden können. Die vorliegende Datenschutzerklärung erläutert,
                            welche Daten wir erheben und wofür wir sie nutzen. Sie erläutert auch, wie und
                            zu welchem Zweck das geschieht.
                        </p>
                        <p>
                            Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der
                            Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser
                            Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.
                        </p>

                        <h3>Hinweis zur verantwortlichen Stelle</h3>
                        <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
                        <p>
                            Oleg Rosenblum<br />
                            Altepoststraße 25<br />
                            49074 Osnabrück
                        </p>
                        <p>
                            Telefon: 0176 24137205<br />
                            E-Mail: rosenblum.uebersetzungsbuero@gmail.com
                        </p>
                        <p>
                            Verantwortliche Stelle ist die natürliche oder juristische Person, die allein
                            oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von
                            personenbezogenen Daten (z.B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
                        </p>

                        <h3>Speicherdauer</h3>
                        <p>
                            Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer
                            genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck
                            für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen
                            geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden
                            Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für
                            die Speicherung Ihrer personenbezogenen Daten haben (z.B. steuer- oder
                            handelsrechtliche Aufbewahrungsfristen); im letztgenannten Fall erfolgt die
                            Löschung nach Fortfall dieser Gründe.
                        </p>

                        <h3>Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung</h3>
                        <p>
                            Sofern Sie in die Datenverarbeitung eingewilligt haben, verarbeiten wir Ihre
                            personenbezogenen Daten auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO bzw. Art. 9
                            Abs. 2 lit. a DSGVO, sofern besondere Datenkategorien nach Art. 9 Abs. 1 DSGVO
                            verarbeitet werden. Im Falle einer ausdrücklichen Einwilligung in die
                            Übertragung personenbezogener Daten in Drittstaaten erfolgt die
                            Datenverarbeitung außerdem auf Grundlage von Art. 49 Abs. 1 lit. a DSGVO. Sofern
                            Sie in die Speicherung von Cookies oder in den Zugriff auf Informationen in Ihr
                            Endgerät (z.B. via Device-Fingerprinting) eingewilligt haben, erfolgt die
                            Datenverarbeitung zusätzlich auf Grundlage von § 25 Abs. 1 TDDDG.
                        </p>

                        <h3>Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
                        <p>
                            Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung
                            möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die
                            Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom
                            Widerruf unberührt.
                        </p>

                        <h3>Widerspruchsrecht gegen die Datenerhebung (Art. 21 DSGVO)</h3>
                        <p>
                            <strong>
                                WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT. E ODER F
                                DSGVO ERFOLGT, HABEN SIE JEDERZEIT DAS RECHT, AUS GRÜNDEN, DIE SICH AUS
                                IHRER BESONDEREN SITUATION ERGEBEN, GEGEN DIE VERARBEITUNG IHRER
                                PERSONENBEZOGENEN DATEN WIDERSPRUCH EINZULEGEN; DIES GILT AUCH FÜR EIN AUF
                                DIESE BESTIMMUNGEN GESTÜTZTES PROFILING. DIE JEWEILIGE RECHTSGRUNDLAGE, AUF
                                DENEN EINE VERARBEITUNG BERUHT, ENTNEHMEN SIE DIESER DATENSCHUTZERKLÄRUNG.
                                WENN SIE WIDERSPRUCH EINLEGEN, WERDEN WIR IHRE BETROFFENEN PERSONENBEZOGENEN
                                DATEN NICHT MEHR VERARBEITEN, ES SEI DENN, WIR KÖNNEN ZWINGENDE
                                SCHUTZWÜRDIGE GRÜNDE FÜR DIE VERARBEITUNG NACHWEISEN, DIE IHRE INTERESSEN,
                                RECHTE UND FREIHEITEN ÜBERWIEGEN ODER DIE VERARBEITUNG DIENT DER
                                GELTENDMACHUNG, AUSÜBUNG ODER VERTEIDIGUNG VON RECHTSANSPRÜCHEN (WIDERSPRUCH
                                NACH ART. 21 ABS. 1 DSGVO).
                            </strong>
                        </p>

                        <h3>Beschwerderecht bei der zuständigen Aufsichtsbehörde</h3>
                        <p>
                            Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht
                            bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen
                            Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu.
                            Das Beschwerderecht besteht unbeschadet anderweitiger verwaltungsrechtlicher
                            oder gerichtlicher Rechtsbehelfe.
                        </p>

                        <h3>Recht auf Datenübertragbarkeit</h3>
                        <p>
                            Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in
                            Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen
                            Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen.
                            Sofern Sie die direkte Übertragung der Daten an einen anderen Verantwortlichen
                            verlangen, erfolgt dies nur, soweit es technisch machbar ist.
                        </p>

                        <h3>Auskunft, Berichtigung und Löschung</h3>
                        <p>
                            Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht
                            auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten,
                            deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein
                            Recht auf Berichtigung oder Löschung dieser Daten. Hierzu sowie zu weiteren
                            Fragen zum Thema personenbezogene Daten können Sie sich jederzeit an uns wenden.
                        </p>

                        <h3>Recht auf Einschränkung der Verarbeitung</h3>
                        <p>
                            Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen
                            Daten zu verlangen. Hierzu können Sie sich jederzeit an uns wenden.
                        </p>

                        <h3>SSL- bzw. TLS-Verschlüsselung</h3>
                        <p>
                            Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung
                            vertraulicher Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an
                            uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. Eine
                            verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers
                            von „http://" auf „https://" wechselt und an dem Schloss-Symbol in Ihrer
                            Browserzeile.
                        </p>
                        <p>
                            Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie
                            an uns übermitteln, nicht von Dritten mitgelesen werden.
                        </p>
                    </section>

                    <section className="legal-section">
                        <h2>4. Datenerfassung auf dieser Website</h2>

                        <h3>Cookies</h3>
                        <p>
                            Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine
                            Datenpakete und richten auf Ihrem Endgerät keinen Schaden an. Sie werden
                            entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder
                            dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert. Session-Cookies
                            werden nach Ende Ihres Besuchs automatisch gelöscht. Permanente Cookies bleiben
                            auf Ihrem Endgerät gespeichert, bis Sie diese selbst löschen oder eine
                            automatische Löschung durch Ihren Webbrowser erfolgt.
                        </p>
                        <p>
                            Cookies können von uns (First-Party-Cookies) oder von Drittunternehmen stammen
                            (sog. Third-Party-Cookies). Third-Party-Cookies ermöglichen die Einbindung
                            bestimmter Dienstleistungen von Drittunternehmen innerhalb von Webseiten (z.B.
                            Cookies zur Abwicklung von Zahlungsdienstleistungen).
                        </p>
                        <p>
                            Cookies haben verschiedene Funktionen. Zahlreiche Cookies sind technisch
                            notwendig, da bestimmte Webseitenfunktionen ohne diese nicht funktionieren
                            würden (z.B. die Warenkorbfunktion oder die Anzeige von Videos). Andere Cookies
                            können zur Auswertung des Nutzerverhaltens oder zu Werbezwecken verwendet werden.
                        </p>
                        <p>
                            Cookies, die zur Durchführung des elektronischen Kommunikationsvorgangs, zur
                            Bereitstellung bestimmter, von Ihnen erwünschter Funktionen (z.B.
                            Warenkorbfunktion) oder zur Optimierung der Website (z.B. Cookies zur Messung
                            des Webpublikums) erforderlich sind (notwendige Cookies), werden auf Grundlage
                            von Art. 6 Abs. 1 lit. f DSGVO gespeichert, sofern keine andere Rechtsgrundlage
                            angegeben wird. Der Websitebetreiber hat ein berechtigtes Interesse an der
                            Speicherung von notwendigen Cookies zur technisch fehlerfreien und optimierten
                            Bereitstellung seiner Dienste. Sofern eine Einwilligung zur Speicherung von
                            Cookies und vergleichbaren Wiedererkennungstechnologien abgefragt wurde, erfolgt
                            die Verarbeitung ausschließlich auf Grundlage dieser Einwilligung (Art. 6 Abs. 1
                            lit. a DSGVO und § 25 Abs. 1 TDDDG); die Einwilligung ist jederzeit widerrufbar.
                        </p>

                        <h3>Server-Log-Dateien</h3>
                        <p>
                            Der Provider der Seiten erhebt und speichert automatisch Informationen in so
                            genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.
                            Dies sind:
                        </p>
                        <ul>
                            <li>Browsertyp und Browserversion</li>
                            <li>verwendetes Betriebssystem</li>
                            <li>Referrer URL</li>
                            <li>Hostname des zugreifenden Rechners</li>
                            <li>Uhrzeit der Serveranfrage</li>
                            <li>IP-Adresse</li>
                        </ul>
                        <p>
                            Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht
                            vorgenommen.
                        </p>
                        <p>
                            Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
                            Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien
                            Darstellung und der Optimierung seiner Website – hierzu müssen die
                            Server-Log-Dateien erfasst werden.
                        </p>

                        <h3>Kontaktformular</h3>
                        <p>
                            Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben
                            aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten
                            zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns
                            gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                        </p>
                        <p>
                            Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b
                            DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder
                            zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen
                            Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der
                            effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f
                            DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese
                            abgefragt wurde; die Einwilligung ist jederzeit widerrufbar.
                        </p>
                        <p>
                            Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie
                            uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder
                            der Zweck für die Datenspeicherung entfällt (z.B. nach abgeschlossener
                            Bearbeitung Ihrer Anfrage). Zwingende gesetzliche Bestimmungen – insbesondere
                            Aufbewahrungsfristen – bleiben unberührt.
                        </p>

                        <h3>Registrierung auf dieser Website</h3>
                        <p>
                            Sie können sich auf dieser Website registrieren, um zusätzliche Funktionen auf
                            der Seite zu nutzen. Die dazu eingegebenen Daten verwenden wir nur zum Zwecke
                            der Nutzung des jeweiligen Angebotes oder Dienstes, für den Sie sich registriert
                            haben. Die bei der Registrierung abgefragten Pflichtangaben müssen vollständig
                            angegeben werden. Anderenfalls werden wir die Registrierung ablehnen.
                        </p>
                        <p>
                            Für wichtige Änderungen etwa beim Angebotsumfang oder bei technisch notwendigen
                            Änderungen nutzen wir die bei der Registrierung angegebene E-Mail-Adresse, um
                            Sie auf diesem Wege zu informieren.
                        </p>
                        <p>
                            Die Verarbeitung der bei der Registrierung eingegebenen Daten erfolgt zum Zwecke
                            der Durchführung des durch die Registrierung begründeten Nutzungsverhältnisses
                            und ggf. zur Anbahnung weiterer Verträge (Art. 6 Abs. 1 lit. b DSGVO).
                        </p>
                        <p>
                            Die bei der Registrierung erfassten Daten werden von uns gespeichert, solange
                            Sie auf dieser Website registriert sind und werden anschließend gelöscht.
                            Gesetzliche Aufbewahrungsfristen bleiben unberührt.
                        </p>
                    </section>

                    <section className="legal-section">
                        <h2>5. Soziale Medien</h2>

                        <h3>Google OAuth (Anmeldung über Google)</h3>
                        <p>
                            Auf unserer Website bieten wir Ihnen die Möglichkeit, sich mit Ihrem
                            Google-Konto zu registrieren bzw. anzumelden. Anbieter ist die Google Ireland
                            Limited, Gordon House, Barrow Street, Dublin 4, Irland.
                        </p>
                        <p>
                            Wenn Sie sich für die Registrierung über Google entscheiden, werden Sie
                            automatisch auf die Plattform von Google weitergeleitet. Dort können Sie sich
                            mit Ihren Nutzungsdaten anmelden. Dadurch wird Ihr Google-Profil mit unserer
                            Website bzw. unseren Diensten verknüpft. Durch diese Verknüpfung erhalten wir
                            Zugriff auf Ihre bei Google hinterlegten Daten. Dies sind insbesondere:
                        </p>
                        <ul>
                            <li>Google-ID</li>
                            <li>Name</li>
                            <li>Profilbild</li>
                            <li>E-Mail-Adresse</li>
                        </ul>
                        <p>
                            Diese Daten werden zur Einrichtung, Bereitstellung und Personalisierung Ihres
                            Kontos verwendet.
                        </p>
                        <p>
                            Die Registrierung über Google und die damit verbundenen
                            Datenverarbeitungsvorgänge erfolgen auf Grundlage Ihrer Einwilligung (Art. 6
                            Abs. 1 lit. a DSGVO). Diese Einwilligung können Sie jederzeit mit Wirkung für
                            die Zukunft widerrufen.
                        </p>
                        <p>
                            Weitere Informationen finden Sie in den Google-Datenschutzbestimmungen:{" "}
                            <a
                                href="https://policies.google.com/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="legal-link"
                            >
                                https://policies.google.com/privacy
                            </a>
                        </p>
                    </section>

                    <section className="legal-section">
                        <h2>6. Analyse-Tools und Werbung</h2>

                        <h3>Google Analytics</h3>
                        <p>
                            Diese Website nutzt Funktionen des Webanalysedienstes Google Analytics. Anbieter
                            ist die Google Ireland Limited („Google"), Gordon House, Barrow Street, Dublin 4,
                            Irland.
                        </p>
                        <p>
                            Google Analytics ermöglicht es dem Websitebetreiber, das Verhalten der
                            Websitebesucher zu analysieren. Hierbei erhält der Websitebetreiber verschiedene
                            Nutzungsdaten, wie z.B. Seitenaufrufe, Verweildauer, verwendete Betriebssysteme
                            und Herkunft des Nutzers. Diese Daten werden in einem Nutzerprofil
                            zusammengefasst und dem jeweiligen Endgerät des Websitebesuchers zugeordnet.
                        </p>
                        <p>
                            Google Analytics verwendet Technologien, die die Wiedererkennung des Nutzers zum
                            Zwecke der Analyse des Nutzerverhaltens ermöglichen (z.B. Cookies oder
                            Device-Fingerprinting). Die von Google erfassten Informationen über die
                            Benutzung dieser Website werden in der Regel an einen Server von Google in den
                            USA übertragen und dort gespeichert.
                        </p>
                        <p>
                            Die Nutzung dieses Dienstes erfolgt auf Grundlage Ihrer Einwilligung nach Art. 6
                            Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG. Die Einwilligung ist jederzeit
                            widerrufbar.
                        </p>
                        <p>
                            Die Datenübertragung in die USA wird auf die Standardvertragsklauseln der
                            EU-Kommission gestützt. Details finden Sie hier:{" "}
                            <a
                                href="https://privacy.google.com/businesses/controllerterms/mccs/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="legal-link"
                            >
                                https://privacy.google.com/businesses/controllerterms/mccs/
                            </a>
                        </p>

                        <h3>IP-Anonymisierung</h3>
                        <p>
                            Wir haben auf dieser Website die Funktion IP-Anonymisierung aktiviert. Dadurch
                            wird Ihre IP-Adresse von Google innerhalb von Mitgliedstaaten der Europäischen
                            Union oder in anderen Vertragsstaaten des Abkommens über den Europäischen
                            Wirtschaftsraum vor der Übermittlung in die USA gekürzt. Nur in Ausnahmefällen
                            wird die volle IP-Adresse an einen Server von Google in den USA übertragen und
                            dort gekürzt. Im Auftrag des Betreibers dieser Website wird Google diese
                            Informationen benutzen, um Ihre Nutzung der Website auszuwerten, um Reports über
                            die Websiteaktivitäten zusammenzustellen und um weitere mit der Websitenutzung
                            und der Internetnutzung verbundene Dienstleistungen gegenüber dem
                            Websitebetreiber zu erbringen.
                        </p>

                        <h3>Browser Plugin</h3>
                        <p>
                            Sie können die Erfassung und Verarbeitung Ihrer Daten durch Google verhindern,
                            indem Sie das unter dem folgenden Link verfügbare Browser-Plugin herunterladen
                            und installieren:{" "}
                            <a
                                href="https://tools.google.com/dlpage/gaoptout?hl=de"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="legal-link"
                            >
                                https://tools.google.com/dlpage/gaoptout?hl=de
                            </a>
                        </p>
                        <p>
                            Mehr Informationen zum Umgang mit Nutzerdaten bei Google Analytics finden Sie in
                            der Datenschutzerklärung von Google:{" "}
                            <a
                                href="https://support.google.com/analytics/answer/6004245?hl=de"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="legal-link"
                            >
                                https://support.google.com/analytics/answer/6004245?hl=de
                            </a>
                        </p>
                    </section>

                    <section className="legal-section">
                        <h2>7. Plugins und Tools</h2>

                        <h3>Sentry (Fehlerüberwachung)</h3>
                        <p>
                            Wir verwenden auf unserer Website Sentry, einen Dienst zur Überwachung von
                            Software-Fehlern. Anbieter ist Functional Software, Inc. dba Sentry, 45 Fremont
                            Street, 8th Floor, San Francisco, CA 94105, USA.
                        </p>
                        <p>
                            Sentry erfasst automatisch Informationen über Fehler, die auf unserer Website
                            auftreten, um uns bei der Identifizierung und Behebung von technischen Problemen
                            zu unterstützen. Dabei werden folgende Daten erfasst:
                        </p>
                        <ul>
                            <li>Informationen über den Browser (Typ, Version)</li>
                            <li>Betriebssystem</li>
                            <li>URL der besuchten Seite</li>
                            <li>Zeitpunkt des Fehlers</li>
                            <li>Technische Fehlermeldungen</li>
                            <li>IP-Adresse (anonymisiert)</li>
                        </ul>
                        <p>
                            Darüber hinaus können Sie über das integrierte Feedback-Widget freiwillig
                            zusätzliche Informationen wie Ihre E-Mail-Adresse und eine Fehlerbeschreibung
                            übermitteln.
                        </p>
                        <p>
                            Der Einsatz von Sentry erfolgt auf Grundlage unseres berechtigten Interesses an
                            einer technisch einwandfreien und optimierten Bereitstellung unserer Website
                            (Art. 6 Abs. 1 lit. f DSGVO).
                        </p>
                        <p>
                            Weitere Informationen finden Sie in der Datenschutzerklärung von Sentry:{" "}
                            <a
                                href="https://sentry.io/privacy/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="legal-link"
                            >
                                https://sentry.io/privacy/
                            </a>
                        </p>
                    </section>

                    <section className="legal-section">
                        <h2>8. Auftragsverarbeitung</h2>
                        <p>
                            Für Übersetzungsaufträge verarbeiten wir die von Ihnen übermittelten Dokumente
                            und personenbezogenen Daten ausschließlich zum Zweck der Auftragserfüllung. Die
                            Datenverarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO
                            (Vertragserfüllung).
                        </p>
                        <p>
                            Die übermittelten Dokumente werden nach Abschluss des Auftrags und Ablauf der
                            gesetzlichen Aufbewahrungsfristen gelöscht, sofern Sie nicht ausdrücklich eine
                            längere Speicherung wünschen.
                        </p>
                    </section>

                    <p className="legal-footer">Stand: Januar 2025</p>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Datenschutz;
