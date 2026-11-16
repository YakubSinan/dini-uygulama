import type { Localized } from "@/lib/i18n";

export interface Surah {
  number: number;
  arabic: string;
  latin: string;
  names: Localized;
  ayahs: number;
  page: number;
  revelation: "meccan" | "medinan";
}

// number | arabic | latin | turkish | german | english | ayahs | start page
const RAW = `1|الفاتحة|Al-Fatihah|Fâtiha|Die Eröffnung|The Opening|7|1
2|البقرة|Al-Baqarah|Bakara|Die Kuh|The Cow|286|2
3|آل عمران|Ali 'Imran|Âl-i İmrân|Die Sippe Imrans|Family of Imran|200|50
4|النساء|An-Nisa|Nisâ|Die Frauen|The Women|176|77
5|المائدة|Al-Ma'idah|Mâide|Der Tisch|The Table Spread|120|106
6|الأنعام|Al-An'am|En'âm|Das Vieh|The Cattle|165|128
7|الأعراف|Al-A'raf|A'râf|Die Höhen|The Heights|206|151
8|الأنفال|Al-Anfal|Enfâl|Die Beute|The Spoils of War|75|177
9|التوبة|At-Tawbah|Tevbe|Die Reue|The Repentance|129|187
10|يونس|Yunus|Yûnus|Jonas|Jonah|109|208
11|هود|Hud|Hûd|Hud|Hud|123|221
12|يوسف|Yusuf|Yûsuf|Josef|Joseph|111|235
13|الرعد|Ar-Ra'd|Ra'd|Der Donner|The Thunder|43|249
14|إبراهيم|Ibrahim|İbrâhim|Abraham|Abraham|52|255
15|الحجر|Al-Hijr|Hicr|Al-Hidschr|The Rocky Tract|99|262
16|النحل|An-Nahl|Nahl|Die Biene|The Bee|128|267
17|الإسراء|Al-Isra|İsrâ|Die Nachtreise|The Night Journey|111|282
18|الكهف|Al-Kahf|Kehf|Die Höhle|The Cave|110|293
19|مريم|Maryam|Meryem|Maria|Mary|98|305
20|طه|Ta-Ha|Tâhâ|Ta-Ha|Ta-Ha|135|312
21|الأنبياء|Al-Anbiya|Enbiyâ|Die Propheten|The Prophets|112|322
22|الحج|Al-Hajj|Hac|Die Pilgerfahrt|The Pilgrimage|78|332
23|المؤمنون|Al-Mu'minun|Mü'minûn|Die Gläubigen|The Believers|118|342
24|النور|An-Nur|Nûr|Das Licht|The Light|64|350
25|الفرقان|Al-Furqan|Furkân|Die Unterscheidung|The Criterion|77|359
26|الشعراء|Ash-Shu'ara|Şuarâ|Die Dichter|The Poets|227|367
27|النمل|An-Naml|Neml|Die Ameisen|The Ant|93|377
28|القصص|Al-Qasas|Kasas|Die Geschichten|The Stories|88|385
29|العنكبوت|Al-'Ankabut|Ankebût|Die Spinne|The Spider|69|396
30|الروم|Ar-Rum|Rûm|Die Römer|The Romans|60|404
31|لقمان|Luqman|Lokmân|Luqman|Luqman|34|411
32|السجدة|As-Sajdah|Secde|Die Niederwerfung|The Prostration|30|415
33|الأحزاب|Al-Ahzab|Ahzâb|Die Gruppierungen|The Combined Forces|73|418
34|سبأ|Saba|Sebe'|Saba|Sheba|54|428
35|فاطر|Fatir|Fâtır|Der Erschaffer|The Originator|45|434
36|يس|Ya-Sin|Yâsîn|Ya-Sin|Ya-Sin|83|440
37|الصافات|As-Saffat|Sâffât|Die sich Reihenden|Those Who Set the Ranks|182|446
38|ص|Sad|Sâd|Sad|Sad|88|453
39|الزمر|Az-Zumar|Zümer|Die Scharen|The Troops|75|458
40|غافر|Ghafir|Mü'min (Gâfir)|Der Vergebende|The Forgiver|85|467
41|فصلت|Fussilat|Fussılet|Ausführlich dargelegt|Explained in Detail|54|477
42|الشورى|Ash-Shura|Şûrâ|Die Beratung|The Consultation|53|483
43|الزخرف|Az-Zukhruf|Zuhruf|Der Goldschmuck|The Ornaments of Gold|89|489
44|الدخان|Ad-Dukhan|Duhân|Der Rauch|The Smoke|59|496
45|الجاثية|Al-Jathiyah|Câsiye|Die Kniende|The Kneeling|37|499
46|الأحقاف|Al-Ahqaf|Ahkâf|Die Sanddünen|The Wind-Curved Sandhills|35|502
47|محمد|Muhammad|Muhammed|Muhammad|Muhammad|38|507
48|الفتح|Al-Fath|Fetih|Der Sieg|The Victory|29|511
49|الحجرات|Al-Hujurat|Hucurât|Die Gemächer|The Rooms|18|515
50|ق|Qaf|Kâf|Qaf|Qaf|45|518
51|الذاريات|Adh-Dhariyat|Zâriyât|Die Aufwirbelnden|The Winnowing Winds|60|520
52|الطور|At-Tur|Tûr|Der Berg|The Mount|49|523
53|النجم|An-Najm|Necm|Der Stern|The Star|62|526
54|القمر|Al-Qamar|Kamer|Der Mond|The Moon|55|528
55|الرحمن|Ar-Rahman|Rahmân|Der Allerbarmer|The Most Merciful|78|531
56|الواقعة|Al-Waqi'ah|Vâkıa|Das eintreffende Ereignis|The Inevitable|96|534
57|الحديد|Al-Hadid|Hadîd|Das Eisen|The Iron|29|537
58|المجادلة|Al-Mujadilah|Mücâdele|Die Streitende|The Pleading Woman|22|542
59|الحشر|Al-Hashr|Haşr|Die Versammlung|The Exile|24|545
60|الممتحنة|Al-Mumtahanah|Mümtehine|Die Geprüfte|She Who Is Examined|13|549
61|الصف|As-Saff|Saf|Die Reihe|The Ranks|14|551
62|الجمعة|Al-Jumu'ah|Cuma|Der Freitag|The Congregation|11|553
63|المنافقون|Al-Munafiqun|Münâfikûn|Die Heuchler|The Hypocrites|11|554
64|التغابن|At-Taghabun|Teğâbün|Die Übervorteilung|The Mutual Disillusion|18|556
65|الطلاق|At-Talaq|Talâk|Die Scheidung|The Divorce|12|558
66|التحريم|At-Tahrim|Tahrîm|Das Verbot|The Prohibition|12|560
67|الملك|Al-Mulk|Mülk|Die Herrschaft|The Sovereignty|30|562
68|القلم|Al-Qalam|Kalem|Das Schreibrohr|The Pen|52|564
69|الحاقة|Al-Haqqah|Hâkka|Die fällig Werdende|The Reality|52|566
70|المعارج|Al-Ma'arij|Meâric|Die Aufstiegswege|The Ascending Stairways|44|568
71|نوح|Nuh|Nûh|Noah|Noah|28|570
72|الجن|Al-Jinn|Cin|Die Dschinn|The Jinn|28|572
73|المزمل|Al-Muzzammil|Müzzemmil|Der Eingehüllte|The Enshrouded One|20|574
74|المدثر|Al-Muddaththir|Müddessir|Der Zugedeckte|The Cloaked One|56|575
75|القيامة|Al-Qiyamah|Kıyâme|Die Auferstehung|The Resurrection|40|577
76|الإنسان|Al-Insan|İnsân|Der Mensch|The Human|31|578
77|المرسلات|Al-Mursalat|Mürselât|Die Gesandten|The Emissaries|50|580
78|النبأ|An-Naba|Nebe'|Die Kunde|The Tidings|40|582
79|النازعات|An-Nazi'at|Nâziât|Die Entreißenden|Those Who Drag Forth|46|583
80|عبس|'Abasa|Abese|Er runzelte die Stirn|He Frowned|42|585
81|التكوير|At-Takwir|Tekvîr|Das Zusammenfalten|The Overthrowing|29|586
82|الانفطار|Al-Infitar|İnfitâr|Das Zerbrechen|The Cleaving|19|587
83|المطففين|Al-Mutaffifin|Mutaffifîn|Die das Maß Verkürzenden|The Defrauding|36|587
84|الانشقاق|Al-Inshiqaq|İnşikâk|Das Zerreißen|The Sundering|25|589
85|البروج|Al-Buruj|Bürûc|Die Türme|The Mansions of the Stars|22|590
86|الطارق|At-Tariq|Târık|Der Pochende|The Nightcomer|17|591
87|الأعلى|Al-A'la|A'lâ|Der Höchste|The Most High|19|591
88|الغاشية|Al-Ghashiyah|Gâşiye|Die Bedeckende|The Overwhelming|26|592
89|الفجر|Al-Fajr|Fecr|Die Morgendämmerung|The Dawn|30|593
90|البلد|Al-Balad|Beled|Die Ortschaft|The City|20|594
91|الشمس|Ash-Shams|Şems|Die Sonne|The Sun|15|595
92|الليل|Al-Layl|Leyl|Die Nacht|The Night|21|595
93|الضحى|Ad-Duha|Duhâ|Die Morgenhelle|The Morning Hours|11|596
94|الشرح|Ash-Sharh|İnşirâh|Das Auftun|The Relief|8|596
95|التين|At-Tin|Tîn|Die Feige|The Fig|8|597
96|العلق|Al-'Alaq|Alak|Das Anhängsel|The Clot|19|597
97|القدر|Al-Qadr|Kadir|Die Bestimmung|The Power|5|598
98|البينة|Al-Bayyinah|Beyyine|Der klare Beweis|The Clear Proof|8|598
99|الزلزلة|Az-Zalzalah|Zilzâl|Das Beben|The Earthquake|8|599
100|العاديات|Al-'Adiyat|Âdiyât|Die Rennenden|The Coursers|11|599
101|القارعة|Al-Qari'ah|Kâria|Das Verhängnis|The Calamity|11|600
102|التكاثر|At-Takathur|Tekâsür|Die Vermehrung|The Rivalry in Increase|8|600
103|العصر|Al-'Asr|Asr|Das Zeitalter|The Declining Day|3|601
104|الهمزة|Al-Humazah|Hümeze|Der Stichler|The Slanderer|9|601
105|الفيل|Al-Fil|Fîl|Der Elefant|The Elephant|5|601
106|قريش|Quraysh|Kureyş|Quraisch|Quraysh|4|602
107|الماعون|Al-Ma'un|Mâûn|Die Hilfeleistung|The Small Kindnesses|7|602
108|الكوثر|Al-Kawthar|Kevser|Die Fülle|The Abundance|3|602
109|الكافرون|Al-Kafirun|Kâfirûn|Die Ungläubigen|The Disbelievers|6|603
110|النصر|An-Nasr|Nasr|Die Hilfe|The Divine Support|3|603
111|المسد|Al-Masad|Tebbet|Die Palmfasern|The Palm Fiber|5|603
112|الإخلاص|Al-Ikhlas|İhlâs|Die Aufrichtigkeit|The Sincerity|4|604
113|الفلق|Al-Falaq|Felak|Das Frühlicht|The Daybreak|5|604
114|الناس|An-Nas|Nâs|Die Menschen|Mankind|6|604`;

const MEDINAN = new Set([2, 3, 4, 5, 8, 9, 13, 22, 24, 33, 47, 48, 49, 55, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 76, 98, 99, 110]);

export const SURAHS: Surah[] = RAW.split("\n").map((line) => {
  const [n, arabic, latin, tr, de, en, ayahs, page] = line.split("|");
  const number = Number(n);
  return {
    number,
    arabic,
    latin,
    names: { tr, de, en },
    ayahs: Number(ayahs),
    page: Number(page),
    revelation: MEDINAN.has(number) ? "medinan" : "meccan",
  };
});

export const TOTAL_AYAHS = SURAHS.reduce((sum, s) => sum + s.ayahs, 0); // 6236

export function getSurah(n: number): Surah | undefined {
  return SURAHS[n - 1];
}

/** First surah/ayah and Madani mushaf page of each of the 30 juz. */
export const JUZ_STARTS: { juz: number; surah: number; ayah: number; page: number }[] = [
  [1, 1, 1], [2, 142, 22], [2, 253, 42], [3, 93, 62], [4, 24, 82], [4, 148, 102],
  [5, 82, 121], [6, 111, 142], [7, 88, 162], [8, 41, 182], [9, 93, 201], [11, 6, 222],
  [12, 53, 242], [15, 1, 262], [17, 1, 282], [18, 75, 302], [21, 1, 322], [23, 1, 342],
  [25, 21, 362], [27, 56, 382], [29, 46, 402], [33, 31, 422], [36, 28, 442], [39, 32, 462],
  [41, 47, 482], [46, 1, 502], [51, 31, 522], [58, 1, 542], [67, 1, 562], [78, 1, 582],
].map(([surah, ayah, page], i) => ({ juz: i + 1, surah, ayah, page }));

export const TOTAL_PAGES = 604;

/** Folds diacritics, Turkish/German letters and punctuation so searches are forgiving. */
export function normalizeSearch(s: string): string {
  return s
    .toLocaleLowerCase("tr")
    .replace(/[ıİ]/g, "i")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[ً-ٰٟۖ-ۭ]/g, "")
    .replace(/[آأإٱ]/g, "ا")
    .replace(/['`’\-\s.()]/g, "");
}

const searchIndex = SURAHS.map((s) => ({
  surah: s,
  haystack: [s.arabic, s.latin, s.names.tr, s.names.de, s.names.en].map(normalizeSearch),
}));

export function searchSurahs(query: string): Surah[] {
  const q = normalizeSearch(query);
  if (!q) return SURAHS;
  if (/^\d+$/.test(q)) {
    const n = Number(q);
    return SURAHS.filter((s) => String(s.number).startsWith(q) || s.number === n);
  }
  // Allow "al-" prefixed names to match without the article (e.g. "baqara").
  return searchIndex
    .filter(({ haystack }) => haystack.some((h) => h.includes(q) || h.replace(/^(al|an|ar|as|at|az|ad|ash|adh)/, "").startsWith(q)))
    .map(({ surah }) => surah);
}
