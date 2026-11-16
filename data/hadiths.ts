import type { Localized } from "@/lib/i18n";

export interface Hadith {
  id: number;
  narrator: Localized;
  text: Localized;
  source: string;
  commentary: Localized;
  takeaway: Localized;
}

/**
 * Curated authentic hadiths (Sahih al-Bukhari, Sahih Muslim and sahih narrations of the Sunan).
 * Translations convey the meaning; commentary summarises classical explanations
 * (Ibn Hajar, an-Nawawi, Ibn Rajab) in accessible language.
 */
export const HADITHS: Hadith[] = [
  {
    id: 1,
    narrator: { tr: "Hz. Ömer (r.a.)", de: "Umar ibn al-Khattab (r)", en: "Umar ibn al-Khattab (ra)" },
    text: {
      tr: "Ameller ancak niyetlere göredir. Herkes için yalnızca niyet ettiği şey vardır.",
      de: "Die Taten werden nur nach den Absichten beurteilt, und jedem Menschen steht nur das zu, was er beabsichtigt hat.",
      en: "Actions are only judged by intentions, and every person will have only what they intended.",
    },
    source: "Sahih al-Bukhari 1, Sahih Muslim 1907",
    commentary: {
      tr: "İmam Buhârî eserine bu hadisle başlar; âlimler onu dinin üçte biri olarak nitelendirmiştir. Aynı görünen iki davranış, kalpteki niyete göre ya ibadete ya da sıradan bir alışkanlığa dönüşür. Niyet, işin Allah rızası için yapılmasını sağlar ve gösterişten korur. Yemek, uyku ve çalışmak gibi gündelik işler bile güzel bir niyetle sevaba vesile olur.",
      de: "Imam al-Bukhari eröffnet sein Werk mit diesem Hadith; Gelehrte nannten ihn ein Drittel der Religion. Zwei äußerlich gleiche Handlungen werden durch die Absicht im Herzen entweder zum Gottesdienst oder zu bloßer Gewohnheit. Die Absicht richtet das Tun auf Allahs Wohlgefallen aus und schützt vor Augendienerei. Selbst Essen, Schlafen und Arbeiten können mit guter Absicht zu belohnten Taten werden.",
      en: "Imam al-Bukhari opens his collection with this hadith, and scholars called it one third of the religion. Two identical outward actions become either worship or mere habit depending on the intention in the heart. Intention directs the deed toward the pleasure of Allah and protects it from showing off. Even eating, sleeping and working become rewarded acts when done with a good intention.",
    },
    takeaway: {
      tr: "Güne başlarken kısa bir niyet tazeleyin: işinizi, ailenize hizmetinizi ve öğreniminizi Allah rızası için yaptığınızı hatırlayın.",
      de: "Erneuern Sie morgens kurz Ihre Absicht: Arbeit, Familie und Lernen geschehen um Allahs willen.",
      en: "Renew your intention briefly each morning: your work, family care and study are done for the sake of Allah.",
    },
  },
  {
    id: 2,
    narrator: { tr: "Hz. Enes b. Mâlik (r.a.)", de: "Anas ibn Malik (r)", en: "Anas ibn Malik (ra)" },
    text: {
      tr: "Sizden biriniz, kendisi için istediğini kardeşi için de istemedikçe (gerçek anlamda) iman etmiş olmaz.",
      de: "Keiner von euch ist (wahrhaft) gläubig, bis er für seinen Bruder liebt, was er für sich selbst liebt.",
      en: "None of you truly believes until he loves for his brother what he loves for himself.",
    },
    source: "Sahih al-Bukhari 13, Sahih Muslim 45",
    commentary: {
      tr: "Bu hadis imanın olgunluğunu kalbin temizliğine bağlar. Haset, kıskançlık ve bencillikten arınmış bir kalp, başkasının iyiliğine de sevinir. Âlimler buradaki kardeşliğin önce mü'minleri, genel anlamda ise bütün insanları kapsadığını belirtmiştir; insanlar için hidayet ve hayır istemek de bu kapsama girer.",
      de: "Dieser Hadith verbindet die Vollkommenheit des Glaubens mit der Reinheit des Herzens. Ein Herz, das frei von Neid und Selbstsucht ist, freut sich auch über das Gute bei anderen. Gelehrte erklären, dass die Brüderlichkeit zuerst die Gläubigen, im weiteren Sinne aber alle Menschen umfasst; auch ihnen Rechtleitung und Gutes zu wünschen gehört dazu.",
      en: "This hadith links the perfection of faith to the purity of the heart. A heart free of envy and selfishness rejoices at the good of others. Scholars explain that brotherhood here refers first to the believers and, in a wider sense, to all people, which includes wishing them guidance and goodness.",
    },
    takeaway: {
      tr: "Bugün birinin başarısını içtenlikle tebrik edin ve kendiniz için yaptığınız bir duayı onun için de yapın.",
      de: "Gratulieren Sie heute jemandem aufrichtig zu einem Erfolg und sprechen Sie für ihn dasselbe Bittgebet wie für sich.",
      en: "Today, sincerely congratulate someone on a success and make the same dua for them that you make for yourself.",
    },
  },
  {
    id: 3,
    narrator: { tr: "Hz. Ebû Hüreyre (r.a.)", de: "Abu Huraira (r)", en: "Abu Hurayrah (ra)" },
    text: {
      tr: "Allah'a ve âhiret gününe iman eden ya hayır söylesin ya da sussun. Allah'a ve âhiret gününe iman eden komşusuna ikram etsin. Allah'a ve âhiret gününe iman eden misafirine ikram etsin.",
      de: "Wer an Allah und den Jüngsten Tag glaubt, soll Gutes sprechen oder schweigen. Wer an Allah und den Jüngsten Tag glaubt, soll seinen Nachbarn ehren. Wer an Allah und den Jüngsten Tag glaubt, soll seinen Gast ehren.",
      en: "Whoever believes in Allah and the Last Day, let him speak good or remain silent. Whoever believes in Allah and the Last Day, let him honour his neighbour. Whoever believes in Allah and the Last Day, let him honour his guest.",
    },
    source: "Sahih al-Bukhari 6018, Sahih Muslim 47",
    commentary: {
      tr: "Hadis, imanın sözlere ve sosyal ilişkilere nasıl yansıması gerektiğini özetler. Dil, insanın en kolay günah işlediği uzuvlardandır; konuşmadan önce düşünmek ve faydasız sözden kaçınmak takvanın alametidir. Komşu ve misafir hakkı, toplumun huzurunun temelidir.",
      de: "Der Hadith fasst zusammen, wie sich der Glaube in Worten und im sozialen Umgang zeigen soll. Die Zunge ist eines der Glieder, mit denen man am leichtesten sündigt; vor dem Sprechen nachzudenken und nutzloses Gerede zu meiden ist ein Zeichen der Gottesfurcht. Die Rechte von Nachbarn und Gästen sind die Grundlage des gesellschaftlichen Friedens.",
      en: "The hadith summarises how faith should show itself in speech and social relations. The tongue is among the easiest limbs to sin with; thinking before speaking and avoiding useless talk is a sign of God-consciousness. The rights of neighbours and guests form the foundation of a peaceful community.",
    },
    takeaway: {
      tr: "Konuşmadan önce sorun: Bu söz doğru mu, faydalı mı, nazik mi? Bu hafta bir komşunuza küçük bir ikramda bulunun.",
      de: "Fragen Sie sich vor dem Reden: Ist es wahr, nützlich, freundlich? Schenken Sie diese Woche einem Nachbarn eine kleine Aufmerksamkeit.",
      en: "Before speaking, ask: is it true, useful and kind? This week, offer a small kindness to a neighbour.",
    },
  },
  {
    id: 4,
    narrator: { tr: "Hz. Ebû Hüreyre (r.a.)", de: "Abu Huraira (r)", en: "Abu Hurayrah (ra)" },
    text: {
      tr: "Güçlü kimse, güreşte rakibini yenen değildir. Asıl güçlü olan, öfke anında kendine hâkim olandır.",
      de: "Der Starke ist nicht derjenige, der andere im Ringkampf besiegt. Der Starke ist vielmehr derjenige, der sich im Zorn beherrscht.",
      en: "The strong person is not the one who overcomes others in wrestling. The strong person is the one who controls himself when angry.",
    },
    source: "Sahih al-Bukhari 6114, Sahih Muslim 2609",
    commentary: {
      tr: "Peygamber Efendimiz (s.a.v.) gücün ölçüsünü bedenden ruha taşımıştır. Öfke, pişmanlık doğuran söz ve davranışların kaynağıdır. Başka rivayetlerde öfkelenen kişiye eûzü besmele çekmesi, ayaktaysa oturması ve abdest alması tavsiye edilmiştir. Nefse hâkim olmak, gerçek bir iradenin göstergesidir.",
      de: "Der Prophet (s) verlagerte den Maßstab der Stärke vom Körper auf die Seele. Zorn ist die Quelle vieler Worte und Taten, die man später bereut. In anderen Überlieferungen wird dem Zornigen empfohlen, Zuflucht bei Allah vor dem Satan zu suchen, sich hinzusetzen, wenn er steht, und die Gebetswaschung zu vollziehen. Selbstbeherrschung ist wahre Willensstärke.",
      en: "The Prophet (peace be upon him) moved the measure of strength from the body to the soul. Anger is the source of many words and deeds one later regrets. Other narrations advise the angry person to seek refuge in Allah from Satan, to sit down if standing, and to perform ablution. Mastering oneself is true strength of will.",
    },
    takeaway: {
      tr: "Öfkelendiğinizde cevap vermeden önce \"Eûzü billâhi mine'ş-şeytâni'r-racîm\" deyin ve birkaç derin nefes alın.",
      de: "Wenn Sie zornig werden, sprechen Sie vor einer Antwort \"A'udhu billahi min asch-schaitan ar-radschim\" und atmen Sie tief durch.",
      en: "When anger rises, say \"A'udhu billahi min ash-shaytan ir-rajim\" and take a few deep breaths before responding.",
    },
  },
  {
    id: 5,
    narrator: { tr: "Hz. Âişe (r.anhâ)", de: "Aischa (r)", en: "Aishah (ra)" },
    text: {
      tr: "Allah katında amellerin en sevimlisi, az da olsa devamlı olanıdır.",
      de: "Die bei Allah beliebtesten Taten sind diejenigen, die beständig verrichtet werden, auch wenn sie gering sind.",
      en: "The most beloved deeds to Allah are those done consistently, even if they are small.",
    },
    source: "Sahih al-Bukhari 6464, Sahih Muslim 783",
    commentary: {
      tr: "İslam, ani ve geçici coşkular yerine istikrarı öğütler. Az ama sürekli yapılan ibadet, kalbi sürekli Allah ile irtibatta tutar ve zamanla güçlü bir alışkanlığa dönüşür. Kendini aşırı zorlayan kişi çoğu zaman yorulup tamamen bırakır; dengeli olan ise yolda kalır.",
      de: "Der Islam lehrt Beständigkeit statt kurzlebiger Begeisterung. Eine kleine, aber regelmäßige Anbetung hält das Herz stets mit Allah verbunden und wird mit der Zeit zu einer festen Gewohnheit. Wer sich übermäßig belastet, gibt oft erschöpft ganz auf; wer maßvoll bleibt, bleibt auf dem Weg.",
      en: "Islam teaches steadiness rather than short-lived bursts of enthusiasm. A small but regular act of worship keeps the heart constantly connected to Allah and, over time, becomes a firm habit. Whoever overburdens himself often burns out and stops entirely; the balanced person stays on the path.",
    },
    takeaway: {
      tr: "Her gün sürdürebileceğiniz küçük bir hedef seçin: Örneğin her gün bir sayfa Kur'an veya namazdan sonra 33 tesbih.",
      de: "Wählen Sie ein kleines tägliches Ziel, etwa eine Seite Koran pro Tag oder 33 Lobpreisungen nach dem Gebet.",
      en: "Pick one small daily goal you can keep, such as one page of Quran a day or 33 tasbih after prayer.",
    },
  },
  {
    id: 6,
    narrator: { tr: "Hz. Osman b. Affân (r.a.)", de: "Uthman ibn Affan (r)", en: "Uthman ibn Affan (ra)" },
    text: {
      tr: "Sizin en hayırlınız Kur'an'ı öğrenen ve öğretendir.",
      de: "Die Besten unter euch sind diejenigen, die den Koran lernen und ihn lehren.",
      en: "The best of you are those who learn the Quran and teach it.",
    },
    source: "Sahih al-Bukhari 5027",
    commentary: {
      tr: "Bu hadis, Kur'an ile kurulan ilişkinin insanı en yüce mertebeye taşıdığını bildirir. Öğrenmek; okumayı, anlamayı, ezberlemeyi ve yaşamayı kapsar. Öğretmek ise bir çocuğa kısa bir sure öğretmekten bir ayetin anlamını paylaşmaya kadar geniş bir alanı içine alır. Bu hadisin râvisi Ebû Abdurrahman es-Sülemî, bu söz sebebiyle ömrünü Kûfe'de Kur'an öğretmeye adamıştır.",
      de: "Dieser Hadith zeigt, dass die Beziehung zum Koran den Menschen in den höchsten Rang erhebt. Lernen umfasst Lesen, Verstehen, Auswendiglernen und Umsetzen. Lehren reicht davon, einem Kind eine kurze Sure beizubringen, bis dahin, die Bedeutung eines Verses zu teilen. Der Überlieferer Abu Abdur-Rahman as-Sulami widmete wegen dieses Wortes sein Leben dem Koranunterricht in Kufa.",
      en: "This hadith shows that one's relationship with the Quran raises a person to the highest rank. Learning includes reading, understanding, memorising and living by it. Teaching ranges from teaching a child a short surah to sharing the meaning of a single verse. The narrator Abu Abd ar-Rahman as-Sulami devoted his life to teaching the Quran in Kufa because of this statement.",
    },
    takeaway: {
      tr: "Bu hafta yeni bir kısa sure ezberleyin veya bildiğiniz bir ayetin anlamını bir aile ferdinizle paylaşın.",
      de: "Lernen Sie diese Woche eine neue kurze Sure oder teilen Sie die Bedeutung eines Verses mit einem Familienmitglied.",
      en: "This week, memorise a new short surah or share the meaning of a verse with a family member.",
    },
  },
  {
    id: 7,
    narrator: { tr: "Hz. Ebû Mâlik el-Eş'arî (r.a.)", de: "Abu Malik al-Asch'ari (r)", en: "Abu Malik al-Ash'ari (ra)" },
    text: {
      tr: "Temizlik imanın yarısıdır. \"Elhamdülillah\" mizanı doldurur. \"Sübhânallah ve'l-hamdülillah\" gökler ile yer arasını doldurur.",
      de: "Die Reinheit ist die Hälfte des Glaubens. \"Al-hamdu lillah\" füllt die Waage. \"Subhanallah wal-hamdu lillah\" füllen den Raum zwischen den Himmeln und der Erde.",
      en: "Purity is half of faith. \"Al-hamdu lillah\" fills the scale. \"Subhan Allah wal-hamdu lillah\" fill what is between the heavens and the earth.",
    },
    source: "Sahih Muslim 223",
    commentary: {
      tr: "Temizlik hem bedenin hem de kalbin arınmasını ifade eder. Abdest ve gusül, namaz gibi ibadetlerin anahtarıdır; kalbin günahlardan arınması ise imanın özüdür. Hadisin devamında zikrin değeri vurgulanır: Dilde hafif olan bu kelimeler, mizanda en ağır gelen amellerdendir.",
      de: "Reinheit bedeutet sowohl körperliche als auch innere Läuterung. Gebetswaschung und Ganzkörperwaschung sind der Schlüssel zu Gottesdiensten wie dem Gebet; die Reinigung des Herzens von Sünden ist der Kern des Glaubens. Der Hadith betont anschließend den Wert des Gedenkens: Diese Worte sind leicht auf der Zunge, aber schwer auf der Waage.",
      en: "Purity refers to cleansing both body and heart. Ablution and ritual bath are the keys to worship such as prayer, while purifying the heart from sins is the essence of faith. The hadith then stresses the value of remembrance: these words are light on the tongue but among the heaviest deeds on the scale.",
    },
    takeaway: {
      tr: "Abdest alırken acele etmeyin; her uzvu yıkarken günahlardan arındığınızı düşünün. Gün içinde sık sık \"Elhamdülillah\" deyin.",
      de: "Vollziehen Sie die Waschung ohne Eile und denken Sie daran, dass jedes Glied von Sünden gereinigt wird. Sagen Sie oft \"Al-hamdu lillah\".",
      en: "Perform ablution without rushing, mindful that each limb is cleansed of sins. Say \"Al-hamdu lillah\" often throughout the day.",
    },
  },
  {
    id: 8,
    narrator: { tr: "Hz. Ebû Hüreyre (r.a.)", de: "Abu Huraira (r)", en: "Abu Hurayrah (ra)" },
    text: {
      tr: "Allah sizin suretlerinize ve mallarınıza bakmaz; fakat kalplerinize ve amellerinize bakar.",
      de: "Allah schaut nicht auf euer Aussehen und euren Besitz, sondern Er schaut auf eure Herzen und eure Taten.",
      en: "Allah does not look at your appearance or your wealth, but He looks at your hearts and your deeds.",
    },
    source: "Sahih Muslim 2564",
    commentary: {
      tr: "İnsanlar çoğu zaman dış görünüşe, makama ve servete göre değer biçer. Allah katında ise ölçü, kalbin samimiyeti ve amelin güzelliğidir. Bu hadis kibre karşı bir uyarı, imkânı az olanlara ise büyük bir müjdedir. İç dünyayı imar etmek, dış görüntüyü süslemekten daha önemlidir.",
      de: "Menschen urteilen oft nach Aussehen, Stellung und Reichtum. Bei Allah jedoch zählen die Aufrichtigkeit des Herzens und die Güte der Taten. Dieser Hadith ist eine Warnung vor Hochmut und eine frohe Botschaft für jene mit wenigen Mitteln. Das Innere zu pflegen ist wichtiger, als das Äußere zu schmücken.",
      en: "People often value one another by appearance, status and wealth, but with Allah the measure is sincerity of heart and excellence of deeds. This hadith is a warning against arrogance and glad tidings for those with little. Cultivating one's inner world matters more than adorning the outward.",
    },
    takeaway: {
      tr: "İnsanları dış görünüşlerine göre yargılamaktan kaçının. Akşam kısa bir muhasebe yapın: Bugün kalbim neyle meşguldü?",
      de: "Beurteilen Sie Menschen nicht nach ihrem Äußeren. Halten Sie abends kurz inne: Womit war mein Herz heute beschäftigt?",
      en: "Avoid judging people by appearances. In the evening, take a moment to ask: what occupied my heart today?",
    },
  },
  {
    id: 9,
    narrator: { tr: "Hz. Abdullah b. Amr (r.a.)", de: "Abdullah ibn Amr (r)", en: "Abdullah ibn Amr (ra)" },
    text: {
      tr: "Müslüman, dilinden ve elinden Müslümanların emin olduğu kimsedir.",
      de: "Der Muslim ist derjenige, vor dessen Zunge und Hand die Muslime sicher sind.",
      en: "A Muslim is the one from whose tongue and hand the Muslims are safe.",
    },
    source: "Sahih al-Bukhari 10, Sahih Muslim 40",
    commentary: {
      tr: "İslam kelimesi \"selam\" yani esenlik kökünden gelir. Gerçek Müslüman çevresine güven veren kişidir. Dilin önce zikredilmesi, sözlü incitmenin daha yaygın ve kalıcı olabileceğine işaret eder. Gıybet, alay ve kırıcı sözler de bu kapsamdadır; günümüzde sosyal medyada yazılanlar da dilin hükmündedir.",
      de: "Das Wort Islam stammt von der Wurzel \"Salam\", Frieden. Ein wahrer Muslim gibt seiner Umgebung Sicherheit. Dass die Zunge zuerst genannt wird, deutet darauf hin, dass verbale Verletzungen häufiger und nachhaltiger sein können. Lästern, Spott und verletzende Worte gehören dazu; auch Geschriebenes in sozialen Medien hat heute den Rang der Zunge.",
      en: "The word Islam comes from the root \"salam\", peace. A true Muslim gives safety to those around them. Mentioning the tongue first indicates that verbal harm can be more frequent and lasting. Backbiting, mockery and hurtful words are included, and today what we write on social media carries the same weight as the tongue.",
    },
    takeaway: {
      tr: "Bugün kimsenin arkasından konuşmamaya ve göndermeden önce her mesajı bir kez daha okumaya özen gösterin.",
      de: "Verzichten Sie heute auf jedes Lästern und lesen Sie jede Nachricht vor dem Senden noch einmal.",
      en: "Today, avoid speaking about anyone behind their back and reread every message before sending it.",
    },
  },
  {
    id: 10,
    narrator: { tr: "Hz. Ebû Hüreyre (r.a.)", de: "Abu Huraira (r)", en: "Abu Hurayrah (ra)" },
    text: {
      tr: "Sadaka maldan hiçbir şey eksiltmez. Allah affeden kulun ancak izzetini artırır. Allah için alçakgönüllü olanı Allah mutlaka yüceltir.",
      de: "Almosen vermindern das Vermögen nicht. Allah vermehrt einem Diener, der vergibt, nur an Ehre. Und wer sich um Allahs willen demütig zeigt, den erhöht Allah.",
      en: "Charity does not decrease wealth. Allah increases a servant who forgives only in honour. And no one humbles himself for the sake of Allah except that Allah raises him.",
    },
    source: "Sahih Muslim 2588",
    commentary: {
      tr: "Hadis, dünyevi hesapların ötesindeki ilahi dengeyi anlatır. Sadaka görünüşte malı azaltır, ancak bereket kazandırır ve âhirette katlanarak döner. Affetmek zayıflık sanılsa da insanın değerini yükseltir. Tevazu da kişiyi küçültmez; aksine Allah katında ve insanlar arasında yüceltir.",
      de: "Der Hadith beschreibt das göttliche Gleichgewicht jenseits weltlicher Berechnung. Ein Almosen scheint das Vermögen zu mindern, bringt aber Segen und kehrt im Jenseits vervielfacht zurück. Vergebung wird oft für Schwäche gehalten, erhöht jedoch den Wert des Menschen. Auch Demut erniedrigt nicht, sondern erhebt bei Allah und unter den Menschen.",
      en: "The hadith describes a divine balance beyond worldly calculation. Charity seems to reduce wealth, yet it brings blessing and returns multiplied in the Hereafter. Forgiveness may be mistaken for weakness, but it raises a person's worth. Humility does not diminish a person either; it elevates them with Allah and among people.",
    },
    takeaway: {
      tr: "Küçük de olsa düzenli bir sadaka belirleyin ve bugün sizi kıran birini içinizden affetmeye niyet edin.",
      de: "Legen Sie eine kleine, regelmäßige Spende fest und nehmen Sie sich vor, heute jemandem zu vergeben, der Sie gekränkt hat.",
      en: "Set up a small, regular act of charity and resolve today to forgive someone who has hurt you.",
    },
  },
  {
    id: 11,
    narrator: { tr: "Hz. Ebû Hüreyre (r.a.)", de: "Abu Huraira (r)", en: "Abu Hurayrah (ra)" },
    text: {
      tr: "Kim ilim öğrenmek için bir yola girerse, Allah onun için cennete giden yolu kolaylaştırır.",
      de: "Wer einen Weg beschreitet, um Wissen zu suchen, dem erleichtert Allah dadurch einen Weg ins Paradies.",
      en: "Whoever takes a path in search of knowledge, Allah makes easy for him a path to Paradise.",
    },
    source: "Sahih Muslim 2699",
    commentary: {
      tr: "İlim yolculuğu, ister bir mescide gitmek ister bir kitap açmak olsun, ibadet hükmündedir. Âlimler bu yolun hem dünyada hidayete hem de âhirette cennete ulaştırdığını belirtir. Faydalı ilim, insanı Allah'a yaklaştıran ve insanlara yarar sağlayan her bilgiyi kapsar.",
      de: "Die Suche nach Wissen, sei es der Weg zur Moschee oder das Aufschlagen eines Buches, gilt als Gottesdienst. Gelehrte erklären, dass dieser Weg im Diesseits zur Rechtleitung und im Jenseits ins Paradies führt. Nützliches Wissen umfasst alles, was den Menschen Allah näherbringt und anderen nützt.",
      en: "The journey of knowledge, whether walking to a mosque or opening a book, counts as worship. Scholars explain that this path leads to guidance in this world and to Paradise in the next. Beneficial knowledge includes all that brings a person closer to Allah and benefits others.",
    },
    takeaway: {
      tr: "Her gün en az on dakikanızı dinî veya faydalı bir konuyu öğrenmeye ayırın; ilim için \"Rabbi zidnî ilmâ\" diye dua edin.",
      de: "Nehmen Sie sich täglich mindestens zehn Minuten, um etwas Nützliches zu lernen, und bitten Sie: \"Rabbi zidni 'ilma\".",
      en: "Set aside at least ten minutes daily for beneficial learning, and pray: \"Rabbi zidni 'ilma\" (My Lord, increase me in knowledge).",
    },
  },
  {
    id: 12,
    narrator: { tr: "Hz. İbn Abbâs (r.a.)", de: "Ibn Abbas (r)", en: "Ibn Abbas (ra)" },
    text: {
      tr: "İki nimet vardır ki insanların çoğu onlar hususunda aldanmıştır: Sağlık ve boş vakit.",
      de: "Zwei Gaben gibt es, bei denen viele Menschen betrogen werden: Gesundheit und freie Zeit.",
      en: "There are two blessings in which many people are deceived: health and free time.",
    },
    source: "Sahih al-Bukhari 6412",
    commentary: {
      tr: "Hadisteki \"aldanmak\" kelimesi, alışverişte zarara uğramayı ifade eder. Sağlık ve boş vakit, değeri ancak kaybedilince anlaşılan sermayelerdir. İnsan bu iki nimeti faydasız işlerle harcadığında büyük bir kayba uğrar. Hadis, zamanı ve bedeni hayırlı işlerde kullanmaya teşvik eder.",
      de: "Das Wort \"betrogen\" bezeichnet im Hadith einen Verlust beim Handel. Gesundheit und freie Zeit sind Kapital, dessen Wert man oft erst nach dem Verlust erkennt. Wer diese beiden Gaben mit Nutzlosem verbringt, erleidet einen großen Verlust. Der Hadith ermutigt dazu, Zeit und Körper für Gutes zu nutzen.",
      en: "The word \"deceived\" in the hadith refers to suffering loss in a trade. Health and free time are capital whose value is often realised only after it is gone. Whoever spends these two blessings on useless things suffers a great loss. The hadith encourages using time and body for good.",
    },
    takeaway: {
      tr: "Telefonunuzda geçirdiğiniz sürenin bir kısmını zikre, okumaya veya bir yakınınızı aramaya ayırın.",
      de: "Widmen Sie einen Teil Ihrer Bildschirmzeit dem Gedenken Allahs, dem Lesen oder einem Anruf bei einem Angehörigen.",
      en: "Redirect part of your screen time to remembrance of Allah, reading, or calling a relative.",
    },
  },
  {
    id: 13,
    narrator: { tr: "Hz. Enes b. Mâlik (r.a.)", de: "Anas ibn Malik (r)", en: "Anas ibn Malik (ra)" },
    text: {
      tr: "Kolaylaştırınız, zorlaştırmayınız; müjdeleyiniz, nefret ettirmeyiniz.",
      de: "Macht es leicht und macht es nicht schwer; verkündet frohe Botschaft und schreckt nicht ab.",
      en: "Make things easy and do not make them difficult; give glad tidings and do not drive people away.",
    },
    source: "Sahih al-Bukhari 69, Sahih Muslim 1734",
    commentary: {
      tr: "Bu hadis, İslam'ı anlatma ve insanlarla ilişki kurma metodunu belirler. Peygamber Efendimiz (s.a.v.) iki şey arasında serbest bırakıldığında, günah olmadıkça daima kolay olanı seçerdi. Dini anlatırken korku yerine ümit, sertlik yerine şefkat esas alınmalıdır.",
      de: "Dieser Hadith legt die Methode fest, den Islam zu vermitteln und mit Menschen umzugehen. Wenn der Prophet (s) zwischen zwei Dingen wählen konnte, wählte er stets das leichtere, sofern es keine Sünde war. Bei der Vermittlung der Religion sollen Hoffnung statt Angst und Barmherzigkeit statt Härte im Vordergrund stehen.",
      en: "This hadith sets the method for conveying Islam and dealing with people. Whenever the Prophet (peace be upon him) was given a choice between two matters, he chose the easier one as long as it was not sinful. When teaching religion, hope should come before fear and compassion before harshness.",
    },
    takeaway: {
      tr: "Çocuklarınıza ve çevrenize dini anlatırken önce sevgiyi ve müjdeyi öne çıkarın; hatalara şefkatle yaklaşın.",
      de: "Stellen Sie im Gespräch über den Glauben zuerst Liebe und frohe Botschaft in den Vordergrund und begegnen Sie Fehlern mit Milde.",
      en: "When speaking about faith with children and others, lead with love and good news, and meet mistakes with gentleness.",
    },
  },
  {
    id: 14,
    narrator: { tr: "Hz. Âişe (r.anhâ)", de: "Aischa (r)", en: "Aishah (ra)" },
    text: {
      tr: "Allah Refîk'tir (yumuşak davranandır) ve her işte yumuşaklığı sever.",
      de: "Allah ist sanftmütig und liebt die Sanftmut in allen Angelegenheiten.",
      en: "Allah is Gentle and loves gentleness in all matters.",
    },
    source: "Sahih al-Bukhari 6927, Sahih Muslim 2165",
    commentary: {
      tr: "Rıfk, yumuşaklık ve nezaket demektir. Müslim'in bir rivayetinde \"Yumuşaklık girdiği şeyi güzelleştirir, çıktığı şeyi çirkinleştirir\" buyrulmuştur. Aile içinde, iş hayatında ve tartışmalarda yumuşak bir üslup, sertlikle elde edilemeyecek kapıları açar.",
      de: "Rifq bedeutet Sanftmut und Freundlichkeit. In einer Überlieferung bei Muslim heißt es: \"Sanftmut verschönert alles, worin sie ist, und ihr Fehlen verunstaltet alles.\" In der Familie, im Beruf und in Diskussionen öffnet ein sanfter Ton Türen, die Härte niemals öffnen kann.",
      en: "Rifq means gentleness and kindness. In a narration in Muslim it is said: \"Gentleness is not found in anything except that it beautifies it, and it is not removed from anything except that it disfigures it.\" In the family, at work and in disagreements, a gentle tone opens doors that harshness never will.",
    },
    takeaway: {
      tr: "Bugün sizi zorlayan bir konuşmada sesinizi yükseltmeden, sakin ve nazik bir dille cevap verin.",
      de: "Antworten Sie heute in einem schwierigen Gespräch ruhig und freundlich, ohne die Stimme zu erheben.",
      en: "Today, in a difficult conversation, reply calmly and kindly without raising your voice.",
    },
  },
  {
    id: 15,
    narrator: { tr: "Hz. Abdullah b. Amr (r.a.)", de: "Abdullah ibn Amr (r)", en: "Abdullah ibn Amr (ra)" },
    text: {
      tr: "Merhamet edenlere Rahmân da merhamet eder. Yeryüzündekilere merhamet edin ki gökte olanlar da size merhamet etsin.",
      de: "Den Barmherzigen erweist der Allerbarmer Barmherzigkeit. Seid barmherzig zu denen auf der Erde, dann wird Der im Himmel euch barmherzig sein.",
      en: "The merciful are shown mercy by the Most Merciful. Be merciful to those on earth, and the One in the heavens will have mercy on you.",
    },
    source: "Sunan Abi Dawud 4941, Jami at-Tirmidhi 1924 (sahih)",
    commentary: {
      tr: "Merhamet, Allah'ın en çok tecelli eden sıfatlarındandır ve kullarından da bu ahlakı bekler. Hadisteki \"yeryüzündekiler\" ifadesi insanları, hayvanları ve bütün canlıları kapsar. Rahmeti talep etmenin yolu, önce merhametli olmaktır.",
      de: "Barmherzigkeit ist eine der am häufigsten offenbarten Eigenschaften Allahs, und Er erwartet sie auch von Seinen Dienern. Der Ausdruck \"die auf der Erde\" umfasst Menschen, Tiere und alle Lebewesen. Der Weg, Barmherzigkeit zu erlangen, beginnt damit, selbst barmherzig zu sein.",
      en: "Mercy is among the most manifest attributes of Allah, and He expects this character from His servants. The phrase \"those on earth\" includes people, animals and all living beings. The way to seek mercy is first to be merciful.",
    },
    takeaway: {
      tr: "Bugün bir hayvana su veya yem bırakın, yaşlı bir yakınınızın gönlünü alın.",
      de: "Stellen Sie heute einem Tier Wasser oder Futter hin oder erfreuen Sie einen älteren Angehörigen.",
      en: "Today, leave water or food for an animal, or brighten the day of an elderly relative.",
    },
  },
  {
    id: 16,
    narrator: { tr: "Hz. Ebû Hüreyre (r.a.)", de: "Abu Huraira (r)", en: "Abu Hurayrah (ra)" },
    text: {
      tr: "İnsanlara teşekkür etmeyen, Allah'a da şükretmez.",
      de: "Wer den Menschen nicht dankt, der dankt auch Allah nicht.",
      en: "Whoever does not thank people does not thank Allah.",
    },
    source: "Sunan Abi Dawud 4811, Jami at-Tirmidhi 1954 (sahih)",
    commentary: {
      tr: "Allah'ın nimetleri çoğu zaman insanlar vasıtasıyla bize ulaşır. Bu vasıtaları görmezden gelen, nimetin asıl sahibine karşı da nankörlük etmiş olur. Teşekkür etmek, toplumdaki iyilik zincirini güçlendirir ve iyilik yapanı teşvik eder.",
      de: "Allahs Gaben erreichen uns oft durch Menschen. Wer diese Vermittler übersieht, ist auch dem eigentlichen Geber gegenüber undankbar. Dankbarkeit stärkt die Kette des Guten in der Gesellschaft und ermutigt den, der Gutes tut.",
      en: "Allah's blessings often reach us through people. Whoever ignores these means is also ungrateful to the true Giver. Thanking others strengthens the chain of goodness in society and encourages those who do good.",
    },
    takeaway: {
      tr: "Bugün size emeği geçen üç kişiye içtenlikle teşekkür edin; \"Cezâkallâhu hayran\" demeyi alışkanlık edinin.",
      de: "Danken Sie heute drei Menschen aufrichtig, die etwas für Sie getan haben; gewöhnen Sie sich an \"Dschazak Allahu khairan\".",
      en: "Today, sincerely thank three people who have helped you, and make a habit of saying \"Jazak Allahu khayran\".",
    },
  },
  {
    id: 17,
    narrator: { tr: "Hz. İbn Ömer (r.a.)", de: "Ibn Umar (r)", en: "Ibn Umar (ra)" },
    text: {
      tr: "Dünyada sanki bir garip veya bir yolcu gibi ol.",
      de: "Sei in dieser Welt wie ein Fremder oder ein Reisender.",
      en: "Be in this world as though you were a stranger or a traveller.",
    },
    source: "Sahih al-Bukhari 6416",
    commentary: {
      tr: "Yolcu, yolculuğunda ihtiyacı kadarını alır ve asıl vatanına ulaşmayı düşünür. Bu hadis dünyayı terk etmeyi değil, dünyaya kalben bağlanmamayı öğütler. İbn Ömer (r.a.) bu öğütten sonra şöyle derdi: \"Akşama erdiğinde sabahı bekleme, sabaha erdiğinde akşamı bekleme. Sağlığından hastalığın için, hayatından ölümün için pay ayır.\"",
      de: "Ein Reisender nimmt nur mit, was er braucht, und denkt an die Ankunft in seiner eigentlichen Heimat. Dieser Hadith lehrt nicht, die Welt aufzugeben, sondern das Herz nicht an sie zu hängen. Ibn Umar (r) pflegte danach zu sagen: \"Wenn du den Abend erreichst, erwarte nicht den Morgen, und wenn du den Morgen erreichst, erwarte nicht den Abend. Nimm von deiner Gesundheit für deine Krankheit und von deinem Leben für deinen Tod.\"",
      en: "A traveller takes only what they need and keeps their mind on reaching their true home. This hadith does not teach abandoning the world, but not attaching the heart to it. After narrating it, Ibn Umar (ra) would say: \"When evening comes, do not expect the morning, and when morning comes, do not expect the evening. Take from your health for your sickness, and from your life for your death.\"",
    },
    takeaway: {
      tr: "Ertelediğiniz bir hayrı bugün yapın: bir özür, bir ziyaret veya bir sadaka.",
      de: "Erledigen Sie heute eine gute Tat, die Sie aufgeschoben haben: eine Entschuldigung, einen Besuch oder eine Spende.",
      en: "Do one good deed today that you have been postponing: an apology, a visit or an act of charity.",
    },
  },
  {
    id: 18,
    narrator: { tr: "Hz. Ebû Hüreyre (r.a.)", de: "Abu Huraira (r)", en: "Abu Hurayrah (ra)" },
    text: {
      tr: "Her iyilik bir sadakadır.",
      de: "Jede gute Tat ist ein Almosen.",
      en: "Every act of goodness is charity.",
    },
    source: "Sahih al-Bukhari 6021, Sahih Muslim 1005",
    commentary: {
      tr: "Bu kısa hadis, sadakanın sadece maddi yardımdan ibaret olmadığını öğretir. Başka rivayetlerde güler yüz, yoldan bir engeli kaldırmak, yol sormak isteyene yardım etmek ve güzel söz de sadaka olarak sayılmıştır. Böylece her mü'min, imkânı ne olursa olsun her gün sadaka verebilir.",
      de: "Dieser kurze Hadith lehrt, dass ein Almosen nicht nur materielle Hilfe ist. In anderen Überlieferungen werden ein Lächeln, das Entfernen eines Hindernisses vom Weg, das Helfen bei der Wegbeschreibung und ein gutes Wort als Almosen genannt. So kann jeder Gläubige, unabhängig von seinen Mitteln, täglich Almosen geben.",
      en: "This short hadith teaches that charity is not limited to material help. Other narrations count a smile, removing an obstacle from the road, guiding someone who is lost, and a kind word as charity. Thus every believer, whatever their means, can give charity every day.",
    },
    takeaway: {
      tr: "Bugün en az bir küçük iyilik yapın: güler yüz, yardım eli veya güzel bir söz.",
      de: "Tun Sie heute mindestens eine kleine gute Tat: ein Lächeln, eine helfende Hand oder ein gutes Wort.",
      en: "Do at least one small good deed today: a smile, a helping hand, or a kind word.",
    },
  },
];

export function hadithOfTheDay(date = new Date(), shift = 0): Hadith {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000);
  const idx = (((dayOfYear + shift) % HADITHS.length) + HADITHS.length) % HADITHS.length;
  return HADITHS[idx];
}
