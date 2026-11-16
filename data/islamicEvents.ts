import type { Localized } from "@/lib/i18n";
import { addDays, daysBetween, toHijri, type HijriDate } from "@/lib/hijri";

export type EventRule =
  | { type: "hijri"; month: number; day: number; duration?: number }
  | { type: "firstThursdayOfRajab" };

export interface IslamicEvent {
  id: string;
  rule: EventRule;
  /** Kandil nights: the blessed night begins on the evening of the listed day. */
  night?: boolean;
  /** Major days (Eids, Ramadan) get a stronger visual accent. */
  major?: boolean;
  name: Localized;
  short: Localized;
  meaning: Localized;
  history: Localized;
  worship: Localized;
}

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    id: "hijriNewYear",
    rule: { type: "hijri", month: 1, day: 1 },
    name: { tr: "Hicri Yılbaşı", de: "Islamisches Neujahr", en: "Islamic New Year" },
    short: {
      tr: "Hicri takvimin ilk günü, 1 Muharrem.",
      de: "Erster Tag des islamischen Kalenders, 1. Muharram.",
      en: "The first day of the Hijri calendar, 1 Muharram.",
    },
    meaning: {
      tr: "Muharrem, Kur'an'da bildirilen dört haram aydan biridir. Yeni hicri yıl, geçen yılın muhasebesini yapmak ve yeni yıla tevbe ve güzel niyetlerle başlamak için bir fırsattır.",
      de: "Muharram ist einer der vier heiligen Monate, die im Koran erwähnt werden. Das neue Hidschri-Jahr ist eine Gelegenheit, Bilanz über das vergangene Jahr zu ziehen und mit Reue und guten Vorsätzen neu zu beginnen.",
      en: "Muharram is one of the four sacred months mentioned in the Quran. The new Hijri year is an opportunity to reflect on the past year and begin anew with repentance and good intentions.",
    },
    history: {
      tr: "Hicri takvim, Hz. Ömer (r.a.) döneminde, Peygamber Efendimiz'in (s.a.v.) Mekke'den Medine'ye hicretini başlangıç kabul ederek oluşturulmuştur. Hicret, İslam toplumunun kuruluşunun dönüm noktasıdır.",
      de: "Der Hidschri-Kalender wurde unter dem Kalifen Umar (r) eingeführt und beginnt mit der Auswanderung (Hidschra) des Propheten (s) von Mekka nach Medina, dem Wendepunkt der Gründung der muslimischen Gemeinschaft.",
      en: "The Hijri calendar was established during the caliphate of Umar (ra), taking the Prophet's (peace be upon him) migration from Makkah to Madinah as its starting point, the turning point in the founding of the Muslim community.",
    },
    worship: {
      tr: "Geçen yılın muhasebesini yapmak, tevbe ve istiğfar etmek, yeni yıl için hayırlı hedefler belirlemek. Muharrem ayında nafile oruç tutmak tavsiye edilmiştir (Müslim, 1163).",
      de: "Selbstprüfung über das vergangene Jahr, Reue und Bitte um Vergebung, gute Vorsätze für das neue Jahr. Freiwilliges Fasten im Muharram wird empfohlen (Muslim 1163).",
      en: "Reflect on the past year, repent and seek forgiveness, and set good goals for the year ahead. Voluntary fasting in Muharram is recommended (Muslim 1163).",
    },
  },
  {
    id: "ashura",
    rule: { type: "hijri", month: 1, day: 10 },
    name: { tr: "Aşure Günü", de: "Aschura", en: "Day of Ashura" },
    short: {
      tr: "10 Muharrem; oruç tutulması tavsiye edilen mübarek gün.",
      de: "10. Muharram; ein gesegneter Tag, an dem Fasten empfohlen wird.",
      en: "10 Muharram; a blessed day on which fasting is recommended.",
    },
    meaning: {
      tr: "Aşure, Allah'ın Hz. Musa'yı (a.s.) ve kavmini Firavun'dan kurtardığı gündür. Peygamber Efendimiz (s.a.v.) bu günün orucunun geçmiş bir yılın günahlarına kefaret olmasını Allah'tan umduğunu bildirmiştir (Müslim, 1162).",
      de: "Aschura ist der Tag, an dem Allah Musa (a) und sein Volk vor dem Pharao rettete. Der Prophet (s) sagte, er hoffe, dass das Fasten an diesem Tag die Sünden des vergangenen Jahres sühnt (Muslim 1162).",
      en: "Ashura is the day Allah saved Musa (peace be upon him) and his people from Pharaoh. The Prophet (peace be upon him) said he hoped that fasting on this day expiates the sins of the previous year (Muslim 1162).",
    },
    history: {
      tr: "Bu gün aynı zamanda Hz. Peygamber'in torunu Hz. Hüseyin'in (r.a.) ve Ehl-i Beyt'ten birçok kişinin Kerbelâ'da şehit edildiği gündür. Anadolu'da bu vesileyle bereket ve paylaşmanın sembolü olan aşure tatlısı pişirilip komşulara dağıtılır.",
      de: "An diesem Tag wurden auch Husain (r), der Enkel des Propheten, und viele Angehörige der Prophetenfamilie in Kerbela getötet. In Anatolien wird zu diesem Anlass die Süßspeise Aschure gekocht und als Zeichen des Teilens an Nachbarn verteilt.",
      en: "This is also the day Husayn (ra), the grandson of the Prophet, and many members of the Prophet's family were martyred at Karbala. In Anatolia, the dessert ashure is cooked and shared with neighbours as a symbol of blessing and sharing.",
    },
    worship: {
      tr: "9 ve 10 Muharrem veya 10 ve 11 Muharrem günlerinde oruç tutmak, sadaka vermek, aile ve komşularla paylaşmak, Kerbelâ şehitlerini rahmetle anmak.",
      de: "Fasten am 9. und 10. oder am 10. und 11. Muharram, Almosen geben, mit Familie und Nachbarn teilen und der Märtyrer von Kerbela gedenken.",
      en: "Fast on the 9th and 10th or the 10th and 11th of Muharram, give charity, share with family and neighbours, and remember the martyrs of Karbala with prayers of mercy.",
    },
  },
  {
    id: "mawlid",
    rule: { type: "hijri", month: 3, day: 11 },
    night: true,
    name: { tr: "Mevlid Kandili", de: "Maulid an-Nabi", en: "Mawlid an-Nabi" },
    short: {
      tr: "Peygamber Efendimiz'in (s.a.v.) dünyaya teşrif ettiği gece.",
      de: "Die Nacht der Geburt des Propheten Muhammad (s).",
      en: "The night of the birth of Prophet Muhammad (peace be upon him).",
    },
    meaning: {
      tr: "Âlemlere rahmet olarak gönderilen Hz. Muhammed'in (s.a.v.) doğumunun yıl dönümüdür. Bu gece, O'nun hayatını, ahlakını ve sünnetini hatırlamak ve O'na olan sevgiyi tazelemek için bir vesiledir.",
      de: "Jahrestag der Geburt Muhammads (s), der als Barmherzigkeit für die Welten gesandt wurde. Diese Nacht ist ein Anlass, sich an sein Leben, seinen Charakter und seine Sunna zu erinnern und die Liebe zu ihm zu erneuern.",
      en: "The anniversary of the birth of Muhammad (peace be upon him), sent as a mercy to the worlds. This night is an occasion to remember his life, character and Sunnah, and to renew one's love for him.",
    },
    history: {
      tr: "Peygamber Efendimiz (s.a.v.) Fil Vakası yılında (M. 571) Rebiülevvel ayında Mekke'de doğmuştur. Pazartesi günü doğduğunu kendisi bildirmiş ve bu sebeple pazartesi orucu tutardı (Müslim, 1162). Osmanlı döneminde Süleyman Çelebi'nin Mevlid'i bu gecenin geleneği haline gelmiştir.",
      de: "Der Prophet (s) wurde im Jahr des Elefanten (571 n. Chr.) im Monat Rabi al-Awwal in Mekka geboren. Er berichtete selbst, an einem Montag geboren zu sein, und fastete deshalb montags (Muslim 1162). In osmanischer Zeit wurde das Mevlid-Gedicht von Süleyman Çelebi zur Tradition dieser Nacht.",
      en: "The Prophet (peace be upon him) was born in Makkah in the month of Rabi al-Awwal in the Year of the Elephant (571 CE). He himself said he was born on a Monday and fasted on Mondays for this reason (Muslim 1162). In Ottoman times, Suleyman Celebi's Mevlid poem became a tradition of this night.",
    },
    worship: {
      tr: "Bol salavat getirmek, siyer okumak, Kur'an tilavet etmek, kaza ve nafile namaz kılmak, ertesi gün oruç tutmak ve sünneti hayata geçirmeye niyet etmek.",
      de: "Viele Segenswünsche (Salawat) für den Propheten sprechen, seine Biografie lesen, Koran rezitieren, nachzuholende und freiwillige Gebete verrichten und sich vornehmen, die Sunna zu leben.",
      en: "Send abundant salawat upon the Prophet, read his biography, recite the Quran, offer missed and voluntary prayers, and resolve to live by his Sunnah.",
    },
  },
  {
    id: "threeMonths",
    rule: { type: "hijri", month: 7, day: 1 },
    name: { tr: "Üç Ayların Başlangıcı", de: "Beginn der drei heiligen Monate", en: "Beginning of the Three Holy Months" },
    short: {
      tr: "Recep, Şaban ve Ramazan aylarından oluşan mübarek dönemin ilk günü.",
      de: "Erster Tag der gesegneten Zeit aus Radschab, Schaban und Ramadan.",
      en: "The first day of the blessed season of Rajab, Shaban and Ramadan.",
    },
    meaning: {
      tr: "Üç Aylar, Ramazan'a manevi bir hazırlık dönemidir. Recep, haram aylardan biridir; Şaban, amellerin Allah'a yükseldiği aydır; Ramazan ise Kur'an'ın indirildiği aydır. Bu dönem tevbe, ibadet ve iç arınma için bir fırsattır.",
      de: "Die drei Monate sind eine spirituelle Vorbereitung auf den Ramadan. Radschab ist einer der heiligen Monate, im Schaban werden die Taten zu Allah erhoben, und im Ramadan wurde der Koran herabgesandt. Diese Zeit ist eine Gelegenheit zu Reue, Anbetung und innerer Reinigung.",
      en: "The Three Months are a period of spiritual preparation for Ramadan. Rajab is one of the sacred months, Shaban is the month in which deeds are raised to Allah, and Ramadan is the month in which the Quran was revealed. This season is an opportunity for repentance, worship and inner purification.",
    },
    history: {
      tr: "Recep ayı, savaşın yasak olduğu dört haram aydan biri olarak cahiliye döneminden beri saygı görmüştür. Peygamber Efendimiz (s.a.v.) Şaban ayında diğer aylardan daha fazla oruç tutardı (Buhârî, 1969; Müslim, 1156).",
      de: "Radschab wurde schon vor dem Islam als einer der vier heiligen Monate geehrt, in denen Krieg verboten war. Der Prophet (s) fastete im Schaban mehr als in jedem anderen Monat außer Ramadan (Bukhari 1969, Muslim 1156).",
      en: "Rajab was honoured even before Islam as one of the four sacred months in which fighting was forbidden. The Prophet (peace be upon him) fasted more in Shaban than in any month other than Ramadan (Bukhari 1969, Muslim 1156).",
    },
    worship: {
      tr: "\"Allâhümme bârik lenâ fî Recebe ve Şa'bân ve belliğnâ Ramazân\" (Allah'ım! Recep ve Şaban'ı bize mübarek kıl ve bizi Ramazan'a ulaştır) duası (Ahmed, Müsned). Nafile oruç, kaza namazı, tevbe ve Kur'an okumayı artırmak.",
      de: "Das Bittgebet \"Allahumma barik lana fi Radschab wa Scha'ban wa ballighna Ramadan\" (O Allah, segne uns Radschab und Schaban und lass uns den Ramadan erreichen; Ahmad, Musnad). Freiwilliges Fasten, Nachholgebete, Reue und mehr Koranlesung.",
      en: "The dua \"Allahumma barik lana fi Rajab wa Sha'ban wa ballighna Ramadan\" (O Allah, bless us in Rajab and Shaban and let us reach Ramadan; Ahmad, Musnad). Voluntary fasting, making up missed prayers, repentance and increased Quran recitation.",
    },
  },
  {
    id: "regaib",
    rule: { type: "firstThursdayOfRajab" },
    night: true,
    name: { tr: "Regaip Kandili", de: "Nacht von Ragha'ib", en: "Laylat al-Ragha'ib" },
    short: {
      tr: "Recep ayının ilk cuma gecesi; Üç Ayların ilk kandili.",
      de: "Die erste Freitagnacht im Radschab; die erste gesegnete Nacht der drei Monate.",
      en: "The first Friday night of Rajab; the first blessed night of the Three Months.",
    },
    meaning: {
      tr: "\"Regaib\" kelimesi, değerli ve rağbet edilen şeyler anlamına gelir. Bu gece, Allah'ın lütuf ve ikramının bol olduğu umulan, kulların rahmet ve mağfiret talebiyle Rablerine yöneldiği bir gecedir.",
      de: "Das Wort \"Ragha'ib\" bedeutet kostbare und begehrte Dinge. In dieser Nacht wenden sich die Diener mit der Bitte um Barmherzigkeit und Vergebung an ihren Herrn, in der Hoffnung auf Seine reichliche Gnade.",
      en: "The word \"Ragha'ib\" means precious and desired things. On this night, servants turn to their Lord seeking mercy and forgiveness, hoping for His abundant grace and generosity.",
    },
    history: {
      tr: "Regaip gecesi, Üç Ayların ilk kandili olarak İslam dünyasında, özellikle Anadolu ve Balkanlar'da asırlardır ihya edilen bir gelenektir. Bu gece için özel bir namaz şekli sahih kaynaklarda yer almaz; genel ibadet, dua ve tevbe ile değerlendirilir.",
      de: "Die Nacht von Ragha'ib wird als erste gesegnete Nacht der drei Monate seit Jahrhunderten, besonders in Anatolien und auf dem Balkan, belebt. Ein besonderes Gebet für diese Nacht ist in authentischen Quellen nicht belegt; sie wird mit allgemeiner Anbetung, Bittgebet und Reue verbracht.",
      en: "Laylat al-Ragha'ib has been observed for centuries as the first blessed night of the Three Months, especially in Anatolia and the Balkans. No specific prayer for this night is established in authentic sources; it is spent in general worship, supplication and repentance.",
    },
    worship: {
      tr: "Kaza ve nafile namaz kılmak, Kur'an okumak, tevbe ve istiğfar etmek, anne-babaya ve tüm mü'minlere dua etmek, ertesi gün oruç tutmak.",
      de: "Nachhol- und freiwillige Gebete verrichten, Koran lesen, um Vergebung bitten, für Eltern und alle Gläubigen beten und am folgenden Tag fasten.",
      en: "Offer missed and voluntary prayers, recite the Quran, repent and seek forgiveness, pray for parents and all believers, and fast the following day.",
    },
  },
  {
    id: "miraj",
    rule: { type: "hijri", month: 7, day: 26 },
    night: true,
    name: { tr: "Miraç Kandili", de: "Nacht der Himmelfahrt (Mi'radsch)", en: "Laylat al-Mi'raj" },
    short: {
      tr: "Peygamber Efendimiz'in (s.a.v.) İsra ve Miraç mucizesinin gecesi, 27 Recep gecesi.",
      de: "Die Nacht der Nachtreise und Himmelfahrt des Propheten (s), Nacht zum 27. Radschab.",
      en: "The night of the Prophet's Night Journey and Ascension, the eve of 27 Rajab.",
    },
    meaning: {
      tr: "Miraç, Peygamber Efendimiz'in (s.a.v.) Mescid-i Haram'dan Mescid-i Aksa'ya, oradan da semalara yükseltildiği mucizevi yolculuktur. Beş vakit namaz bu gecede farz kılınmıştır; bu yüzden namaz, mü'minin miracı olarak anılır.",
      de: "Der Mi'radsch ist die wundersame Reise des Propheten (s) von der Heiligen Moschee in Mekka zur Al-Aqsa-Moschee und von dort in die Himmel. In dieser Nacht wurden die fünf täglichen Gebete vorgeschrieben; deshalb wird das Gebet als Mi'radsch des Gläubigen bezeichnet.",
      en: "The Mi'raj is the miraculous journey of the Prophet (peace be upon him) from al-Masjid al-Haram to al-Masjid al-Aqsa and then through the heavens. The five daily prayers were prescribed on this night, which is why prayer is called the believer's ascension.",
    },
    history: {
      tr: "Hicretten yaklaşık bir buçuk yıl önce, Hz. Hatice ve Ebû Tâlib'in vefatıyla geçen \"Hüzün Yılı\"nın ardından gerçekleşmiştir. İsra suresinin ilk ayeti ve Necm suresi bu olaydan bahseder. Bakara suresinin son iki ayeti de bu gecede hediye edilmiştir.",
      de: "Er ereignete sich etwa eineinhalb Jahre vor der Hidschra, nach dem \"Jahr der Trauer\", in dem Chadidscha und Abu Talib verstarben. Der erste Vers der Sure al-Isra und die Sure an-Nadschm berichten davon. Auch die letzten beiden Verse der Sure al-Baqara wurden in dieser Nacht geschenkt.",
      en: "It took place about a year and a half before the Hijrah, after the \"Year of Sorrow\" in which Khadijah and Abu Talib passed away. The first verse of Surah al-Isra and Surah an-Najm speak of it. The last two verses of Surah al-Baqarah were also gifted on this night.",
    },
    worship: {
      tr: "Namazı huşu ile kılmak ve kaza namazlarını tamamlamaya niyet etmek, İsra suresini ve Bakara suresinin son iki ayetini (Âmenerrasûlü) okumak, salavat getirmek, dua ve tevbe etmek.",
      de: "Das Gebet mit Andacht verrichten und sich vornehmen, versäumte Gebete nachzuholen; die Sure al-Isra und die letzten beiden Verse von al-Baqara lesen, Salawat sprechen, Bittgebete und Reue.",
      en: "Pray with devotion and resolve to make up missed prayers, recite Surah al-Isra and the last two verses of al-Baqarah, send salawat, and make dua and repentance.",
    },
  },
  {
    id: "barat",
    rule: { type: "hijri", month: 8, day: 14 },
    night: true,
    name: { tr: "Berat Kandili", de: "Nacht der Vergebung (Bara'a)", en: "Laylat al-Bara'ah" },
    short: {
      tr: "Şaban ayının 15. gecesi; af ve mağfiret gecesi.",
      de: "Die Nacht zum 15. Schaban; eine Nacht der Vergebung.",
      en: "The eve of 15 Shaban; a night of forgiveness and pardon.",
    },
    meaning: {
      tr: "\"Berat\" kurtuluş ve aklanma demektir. Bir hadiste Allah'ın Şaban'ın yarısı gecesinde kullarına rahmetiyle tecelli ettiği ve şirk koşan ile kin besleyen dışındaki herkesi bağışladığı bildirilmiştir (İbn Mâce, 1390; İbn Hibbân).",
      de: "\"Bara'a\" bedeutet Befreiung und Freispruch. In einem Hadith wird berichtet, dass Allah sich in der Nacht zur Mitte des Schaban Seinen Dienern zuwendet und allen vergibt außer dem Götzendiener und dem, der Groll hegt (Ibn Madscha 1390, Ibn Hibban).",
      en: "\"Bara'ah\" means freedom and acquittal. A hadith reports that on the night of mid-Shaban Allah looks upon His servants with mercy and forgives all except one who associates partners with Him and one who harbours hatred (Ibn Majah 1390, Ibn Hibban).",
    },
    history: {
      tr: "Bu gece, Ramazan'a yaklaşırken kalbin kin ve nefretten arındırılması için bir dönüm noktası kabul edilmiştir. Selef âlimlerinden birçoğu bu geceyi ibadetle ihya etmiştir.",
      de: "Diese Nacht gilt als Wendepunkt kurz vor dem Ramadan, um das Herz von Groll und Hass zu reinigen. Viele frühe Gelehrte verbrachten sie in Anbetung.",
      en: "This night is regarded as a turning point before Ramadan for cleansing the heart of resentment and hatred. Many early scholars spent it in worship.",
    },
    worship: {
      tr: "Küs olduğunuz kişilerle barışmak, kalbi kinden arındırmak, tevbe ve istiğfar, kaza ve nafile namaz, Kur'an okumak ve ertesi gün (15 Şaban) oruç tutmak.",
      de: "Sich mit Menschen versöhnen, mit denen man im Streit liegt, das Herz von Groll befreien, Reue, Nachhol- und freiwillige Gebete, Koranlesung und Fasten am folgenden Tag (15. Schaban).",
      en: "Reconcile with anyone you are estranged from, cleanse your heart of resentment, repent, offer missed and voluntary prayers, recite the Quran and fast the next day (15 Shaban).",
    },
  },
  {
    id: "ramadanStart",
    rule: { type: "hijri", month: 9, day: 1 },
    major: true,
    name: { tr: "Ramazan Başlangıcı", de: "Beginn des Ramadan", en: "Start of Ramadan" },
    short: {
      tr: "Oruç ayı Ramazan'ın ilk günü; ilk sahur bir önceki gece yapılır.",
      de: "Erster Fastentag des Ramadan; das erste Suhur ist in der Nacht davor.",
      en: "The first day of fasting in Ramadan; the first suhoor is the night before.",
    },
    meaning: {
      tr: "Ramazan, Kur'an'ın indirildiği, cennet kapılarının açıldığı ve orucun farz kılındığı aydır (Bakara, 185). İman ederek ve sevabını Allah'tan umarak Ramazan orucunu tutanın geçmiş günahları bağışlanır (Buhârî, 38).",
      de: "Ramadan ist der Monat, in dem der Koran herabgesandt wurde, die Tore des Paradieses geöffnet werden und das Fasten vorgeschrieben ist (2:185). Wer im Ramadan aus Glauben und in Hoffnung auf Belohnung fastet, dem werden seine früheren Sünden vergeben (Bukhari 38).",
      en: "Ramadan is the month in which the Quran was revealed, the gates of Paradise are opened, and fasting is prescribed (2:185). Whoever fasts Ramadan out of faith and seeking reward will have their past sins forgiven (Bukhari 38).",
    },
    history: {
      tr: "Ramazan orucu hicretin ikinci yılında farz kılınmıştır. Teravih namazı, mukabele ve iftar sofraları asırlar boyunca bu ayın sembolleri olmuştur.",
      de: "Das Fasten im Ramadan wurde im zweiten Jahr nach der Hidschra vorgeschrieben. Tarawih-Gebete, gemeinsame Koranlesungen und Iftar-Mahlzeiten sind seit Jahrhunderten Sinnbilder dieses Monats.",
      en: "Fasting in Ramadan was prescribed in the second year after the Hijrah. Tarawih prayers, communal Quran recitation and iftar gatherings have been symbols of this month for centuries.",
    },
    worship: {
      tr: "Orucu tutmak, sahura kalkmak, teravih kılmak, hatim veya mukabele ile Kur'an okumak, fitre ve sadaka vermek, iftarda \"Allâhümme leke sumtü ve bike âmentü ve aleyke tevekkeltü ve alâ rızkıke eftartü\" duası.",
      de: "Fasten, zum Suhur aufstehen, Tarawih beten, den Koran vollständig lesen, Zakat al-Fitr und Almosen geben und beim Fastenbrechen das Bittgebet \"Allahumma laka sumtu wa 'ala rizqika aftartu\" sprechen.",
      en: "Fast, wake for suhoor, pray tarawih, complete a reading of the Quran, give zakat al-fitr and charity, and at iftar say \"Allahumma laka sumtu wa 'ala rizqika aftartu\".",
    },
  },
  {
    id: "qadr",
    rule: { type: "hijri", month: 9, day: 26 },
    night: true,
    major: true,
    name: { tr: "Kadir Gecesi", de: "Nacht der Bestimmung (Laylat al-Qadr)", en: "Laylat al-Qadr" },
    short: {
      tr: "Bin aydan daha hayırlı gece; 27 Ramazan gecesi.",
      de: "Die Nacht, die besser ist als tausend Monate; Nacht zum 27. Ramadan.",
      en: "The night better than a thousand months; the eve of 27 Ramadan.",
    },
    meaning: {
      tr: "Kur'an-ı Kerim bu gecede indirilmeye başlanmıştır. Kadir suresi bu gecenin bin aydan daha hayırlı olduğunu, meleklerin ve Ruh'un (Cebrail) indiğini ve gecenin tan yerinin ağarmasına kadar esenlik olduğunu bildirir.",
      de: "In dieser Nacht begann die Herabsendung des Korans. Die Sure al-Qadr erklärt, dass diese Nacht besser ist als tausend Monate, dass die Engel und der Geist (Gabriel) herabsteigen und dass sie Frieden ist bis zum Anbruch der Morgendämmerung.",
      en: "The revelation of the Quran began on this night. Surah al-Qadr declares that it is better than a thousand months, that the angels and the Spirit (Jibril) descend, and that it is peace until the break of dawn.",
    },
    history: {
      tr: "Peygamber Efendimiz (s.a.v.) Kadir Gecesi'ni Ramazan'ın son on gecesinde, özellikle tek gecelerde aramayı tavsiye etmiştir (Buhârî, 2017). Ümmet arasında yaygın kanaat, 27. gece olduğu yönündedir; kesin tarih ise hikmetle gizli tutulmuştur.",
      de: "Der Prophet (s) empfahl, die Nacht der Bestimmung in den letzten zehn Nächten des Ramadan zu suchen, besonders in den ungeraden (Bukhari 2017). Weit verbreitet ist die Ansicht, dass es die 27. Nacht ist; das genaue Datum wurde aus Weisheit verborgen.",
      en: "The Prophet (peace be upon him) advised seeking Laylat al-Qadr in the last ten nights of Ramadan, especially the odd nights (Bukhari 2017). The widespread view is that it is the 27th night; its exact date has been concealed out of wisdom.",
    },
    worship: {
      tr: "Hz. Âişe'ye öğretilen dua: \"Allâhümme inneke afüvvün tühibbü'l-afve fa'fu annî\" (Allah'ım, Sen affedicisin, affetmeyi seversin, beni affet; Tirmizî, 3513). Namaz, Kur'an, Kadir suresi, tevbe, sadaka ve gece boyunca ibadet.",
      de: "Das Bittgebet, das Aischa gelehrt wurde: \"Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni\" (O Allah, Du bist vergebend und liebst die Vergebung, so vergib mir; Tirmidhi 3513). Gebet, Koran, Sure al-Qadr, Reue, Almosen und Anbetung die ganze Nacht.",
      en: "The dua taught to Aishah: \"Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni\" (O Allah, You are Pardoning and love to pardon, so pardon me; Tirmidhi 3513). Prayer, Quran, Surah al-Qadr, repentance, charity and worship throughout the night.",
    },
  },
  {
    id: "eidFitr",
    rule: { type: "hijri", month: 10, day: 1, duration: 3 },
    major: true,
    name: { tr: "Ramazan Bayramı", de: "Ramadanfest (Id al-Fitr)", en: "Eid al-Fitr" },
    short: {
      tr: "Ramazan orucunun tamamlanmasının sevinç ve şükür bayramı (3 gün).",
      de: "Fest der Freude und Dankbarkeit nach dem Fastenmonat (3 Tage).",
      en: "The festival of joy and gratitude after completing Ramadan (3 days).",
    },
    meaning: {
      tr: "Ramazan Bayramı, bir ay boyunca oruç tutmayı nasip eden Allah'a şükür, sevinç ve paylaşma günüdür. Bayram, küslüklerin bittiği, akraba ve büyüklerin ziyaret edildiği, çocukların sevindirildiği bir kardeşlik iklimidir.",
      de: "Das Ramadanfest ist ein Tag des Dankes an Allah, der einen Monat des Fastens ermöglichte, ein Tag der Freude und des Teilens. Es ist eine Zeit der Geschwisterlichkeit, in der Streit beendet, Verwandte und Ältere besucht und Kinder beschenkt werden.",
      en: "Eid al-Fitr is a day of gratitude to Allah for enabling a month of fasting, a day of joy and sharing. It is a season of brotherhood in which quarrels end, relatives and elders are visited, and children are made happy.",
    },
    history: {
      tr: "Hicretin ikinci yılında, Ramazan orucunun farz kılınmasıyla birlikte bayram da meşru kılınmıştır. Peygamber Efendimiz (s.a.v.) Medine'ye geldiğinde, Allah'ın onlara cahiliye bayramları yerine daha hayırlı iki bayram, Ramazan ve Kurban bayramlarını verdiğini bildirmiştir (Ebû Dâvûd, 1134).",
      de: "Im zweiten Jahr nach der Hidschra wurde mit dem Fasten auch das Fest eingeführt. Als der Prophet (s) nach Medina kam, sagte er, Allah habe ihnen statt der vorislamischen Feste zwei bessere gegeben: das Ramadan- und das Opferfest (Abu Dawud 1134).",
      en: "The Eid was instituted in the second year after the Hijrah together with the fast of Ramadan. When the Prophet (peace be upon him) came to Madinah, he said Allah had given them two better festivals in place of the pre-Islamic ones: Eid al-Fitr and Eid al-Adha (Abu Dawud 1134).",
    },
    worship: {
      tr: "Bayram namazından önce fitreyi vermek, gusletmek ve güzel giyinmek, namaza gitmeden önce tatlı bir şey yemek, yolda tekbir getirmek, bayram namazını kılmak, akraba ve büyükleri ziyaret etmek, küslere barışmak. Şevval'de altı gün oruç tutmak tavsiye edilmiştir (Müslim, 1164).",
      de: "Zakat al-Fitr vor dem Festgebet geben, die Ganzkörperwaschung vollziehen und schöne Kleidung tragen, vor dem Gebet etwas Süßes essen, auf dem Weg Takbir sprechen, das Festgebet verrichten, Verwandte und Ältere besuchen und sich versöhnen. Sechs Tage Fasten im Schawwal werden empfohlen (Muslim 1164).",
      en: "Give zakat al-fitr before the Eid prayer, perform the ritual bath and wear good clothes, eat something sweet before the prayer, recite takbir on the way, attend the Eid prayer, visit relatives and elders, and reconcile. Fasting six days of Shawwal is recommended (Muslim 1164).",
    },
  },
  {
    id: "arafah",
    rule: { type: "hijri", month: 12, day: 9 },
    name: { tr: "Kurban Bayramı Arefesi", de: "Tag von Arafat", en: "Day of Arafah" },
    short: {
      tr: "9 Zilhicce; hacıların Arafat'ta vakfeye durduğu gün.",
      de: "9. Dhu al-Hiddscha; der Tag, an dem die Pilger auf Arafat stehen.",
      en: "9 Dhul Hijjah; the day the pilgrims stand at Arafat.",
    },
    meaning: {
      tr: "Arefe günü, yılın en faziletli günlerindendir. Peygamber Efendimiz (s.a.v.) bu günün orucunun bir önceki ve bir sonraki yılın günahlarına kefaret olmasını Allah'tan umduğunu bildirmiştir (Müslim, 1162). Duaların en hayırlısı Arefe günü yapılan duadır (Tirmizî, 3585).",
      de: "Der Tag von Arafat ist einer der vorzüglichsten Tage des Jahres. Der Prophet (s) sagte, er hoffe, dass das Fasten an diesem Tag die Sünden des vergangenen und des kommenden Jahres sühnt (Muslim 1162). Das beste Bittgebet ist das am Tag von Arafat (Tirmidhi 3585).",
      en: "The Day of Arafah is among the most virtuous days of the year. The Prophet (peace be upon him) said he hoped fasting on this day expiates the sins of the previous and the coming year (Muslim 1162). The best supplication is the supplication on the Day of Arafah (Tirmidhi 3585).",
    },
    history: {
      tr: "Haccın en temel rüknü Arafat'ta vakfedir. Peygamber Efendimiz (s.a.v.) Veda Haccı'nda bu gün Arafat'ta insan hakları ve kardeşliğe dair tarihi Veda Hutbesi'ni irad etmiştir.",
      de: "Das Stehen auf Arafat ist die wichtigste Säule der Pilgerfahrt. Bei der Abschiedspilgerfahrt hielt der Prophet (s) an diesem Tag auf Arafat die historische Abschiedspredigt über Menschenrechte und Geschwisterlichkeit.",
      en: "Standing at Arafat is the essential pillar of Hajj. During the Farewell Pilgrimage, the Prophet (peace be upon him) delivered the historic Farewell Sermon on human rights and brotherhood at Arafat on this day.",
    },
    worship: {
      tr: "Hacı olmayanlar için oruç tutmak, bol dua etmek: \"Lâ ilâhe illallâhu vahdehû lâ şerîke leh, lehü'l-mülkü ve lehü'l-hamdü ve hüve alâ külli şey'in kadîr.\" Sabah namazından itibaren teşrik tekbirlerine başlamak.",
      de: "Für Nicht-Pilger: fasten und viel Bittgebete sprechen: \"La ilaha illallahu wahdahu la scharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli schai'in qadir.\" Ab dem Morgengebet mit den Taschriq-Takbiren beginnen.",
      en: "For those not on Hajj: fast and supplicate abundantly: \"La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir.\" Begin the takbirat al-tashriq from the dawn prayer.",
    },
  },
  {
    id: "eidAdha",
    rule: { type: "hijri", month: 12, day: 10, duration: 4 },
    major: true,
    name: { tr: "Kurban Bayramı", de: "Opferfest (Id al-Adha)", en: "Eid al-Adha" },
    short: {
      tr: "Hz. İbrahim'in teslimiyetini anan, kurban ve paylaşma bayramı (4 gün).",
      de: "Fest des Opfers und Teilens im Gedenken an Abrahams Hingabe (4 Tage).",
      en: "The festival of sacrifice and sharing, remembering Ibrahim's devotion (4 days).",
    },
    meaning: {
      tr: "Kurban, Allah'a yakınlaşmak demektir. Allah'a ulaşan, kurbanın eti ve kanı değil, kişinin takvasıdır (Hac, 37). Kurban; teslimiyet, fedakârlık ve ihtiyaç sahipleriyle paylaşmanın ibadetidir.",
      de: "Qurban bedeutet, sich Allah zu nähern. Nicht das Fleisch und Blut des Opfertiers erreichen Allah, sondern die Gottesfurcht (22:37). Das Opfer ist ein Gottesdienst der Hingabe, Aufopferung und des Teilens mit Bedürftigen.",
      en: "Qurban means drawing near to Allah. It is not the meat or blood of the sacrifice that reaches Allah, but one's piety (22:37). The sacrifice is an act of worship expressing submission, self-sacrifice and sharing with those in need.",
    },
    history: {
      tr: "Bayram, Hz. İbrahim'in (a.s.) oğlu Hz. İsmail'i (a.s.) Allah'ın emriyle kurban etmeye hazır olması ve Allah'ın onun yerine bir koç fidye vermesi hadisesini anar (Sâffât, 102-107). Hac ibadetinin de doruk noktasıdır.",
      de: "Das Fest erinnert daran, dass Abraham (a) bereit war, seinen Sohn Ismael (a) auf Allahs Befehl zu opfern, und Allah ihn durch einen Widder auslöste (37:102-107). Es ist auch der Höhepunkt der Pilgerfahrt.",
      en: "The Eid commemorates Ibrahim's (peace be upon him) readiness to sacrifice his son Ismail (peace be upon him) at Allah's command, and Allah ransoming him with a ram (37:102-107). It is also the culmination of the Hajj.",
    },
    worship: {
      tr: "Bayram namazını kılmak, gücü yetenin kurban kesmesi ve etini akraba, komşu ve ihtiyaç sahipleriyle paylaşması, bayramın dördüncü günü ikindi namazına kadar farz namazlardan sonra teşrik tekbiri getirmek, akrabaları ziyaret etmek.",
      de: "Das Festgebet verrichten; wer es vermag, opfert ein Tier und teilt das Fleisch mit Verwandten, Nachbarn und Bedürftigen; bis zum Asr-Gebet des vierten Festtages nach jedem Pflichtgebet die Taschriq-Takbire sprechen; Verwandte besuchen.",
      en: "Attend the Eid prayer; those able should offer a sacrifice and share the meat with relatives, neighbours and the needy; recite the takbirat al-tashriq after every obligatory prayer until Asr on the fourth day; visit relatives.",
    },
  },
];

export function getEvent(id: string): IslamicEvent | undefined {
  return ISLAMIC_EVENTS.find((e) => e.id === id);
}

export interface EventMatch {
  event: IslamicEvent;
  /** 1-based day index for multi-day events such as the Eids. */
  dayIndex: number;
}

/** Events falling on a Gregorian day (UTC noon date) with the given Hijri date. */
export function eventsForDay(date: Date, hijri: HijriDate): EventMatch[] {
  const matches: EventMatch[] = [];
  for (const event of ISLAMIC_EVENTS) {
    const rule = event.rule;
    if (rule.type === "hijri") {
      const duration = rule.duration ?? 1;
      if (hijri.month === rule.month && hijri.day >= rule.day && hijri.day < rule.day + duration) {
        matches.push({ event, dayIndex: hijri.day - rule.day + 1 });
      }
    } else if (rule.type === "firstThursdayOfRajab") {
      if (hijri.month === 7 && hijri.day <= 7 && date.getUTCDay() === 4) matches.push({ event, dayIndex: 1 });
    }
  }
  return matches;
}

export interface UpcomingEvent {
  event: IslamicEvent;
  date: Date;
  daysLeft: number;
}

/** Next occurrences (first day only) of all events, sorted, using the offline Umm al-Qura calendar. */
export function upcomingEvents(from: Date, offset = 0, horizonDays = 400): UpcomingEvent[] {
  const seen = new Set<string>();
  const list: UpcomingEvent[] = [];
  for (let i = 0; i <= horizonDays && seen.size < ISLAMIC_EVENTS.length; i++) {
    const date = addDays(from, i);
    for (const { event, dayIndex } of eventsForDay(date, toHijri(date, offset))) {
      if (seen.has(event.id)) continue;
      // An Eid already in progress counts from its first day, still shown as "today".
      if (dayIndex > 1 && i > 0) continue;
      seen.add(event.id);
      list.push({ event, date, daysLeft: daysBetween(from, date) });
    }
  }
  return list.sort((a, b) => a.daysLeft - b.daysLeft);
}
