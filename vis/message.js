'use strict';

// const messageMap = new Map([
// 	[1807,'US',`1807.12.14, Weston, CT, U.S.A, meteor visible half a minute, loud sounds heard, many stones found scattered over 6-10 miles, weighing as much as 90 kg in total`],
// 	[1825,'IN',`1825.01.16, Oriang, Malwate, India, man killed, woman injured in meteorite fall [considered "possible" by LaPaz (1958)]`],
// 	[1827,'IN',`1827.02.16, Mhow, India, man wounded "severely in the arm" when hit by meteorite`],
// 	[1836,'BR',`1836.11.11, Macau, Brazil, cattle killed when hit by shower of meteorites [considered "possible" by LaPaz (1958)]`],
// 	[1844,'CN',`1844.12.01, Lo-shih Shan, An-chi, China, eleven stones fell; wall and side wall and room of Li Wei-kung's Temple damaged`],
// 	[1847,'CZ',`1847.07.14, Hauptmannsdorf, Braunau, Bohemia, 37-pound Braunau iron meteorite smashed into a room, covering three children with ceiling debris but not hurting them`],
// 	[1850,'CN',`1850.10.17, Tang village, near T'ing-ch'eng, China, shiny black stone broke through roof of a house`],
// 	[1860,'US',`1860.05.01, New Concord, OH, USA, horse struck and killed by meteorite`],
// 	[1863,'LV',`1863.08.08, Pillistfer, Latvia, 5.4-kg stony meteorite penetrated tile roof and floor of building`],
// 	[1868,'PL',`1868.01.30, Pultusk, Poland, meteorite shower of more than 100,000 fragments; bright fireball`],
// 	[1874,'CN',`1874.06.30, Chin-kuei Shan, Ming-tung Li, China, huge stone fell from sky, crushed half a cottage, killing a child`],
// 	[1879,'FR',`1879.01.31, Dun-le-Poelier, France, farmer reported killed by meteorite`],
// 	[1882,'RO',`1882.02.03, Mocs, Romania, meteorite shower of thousands of fragments; bright fireball`],
// 	[1890,'US',`1890.05.02, Forest City, IA, USA, meteorite shower of some 200 fragments; one fragment fell into a pile of hay (no fire); bright fireball seen`],
// 	[1893,'RU',`1893.09.02, Zabrodje, White Russia, 3-kg stony meteorite fell through house roof`],
// 	[1906,'ZA',`1906.11.04, Constantia, South Africa, 1-kg stony meteorite smashed through roof and ceiling (2-pound piece recovered)`],
// 	[1907,'CN',`1907.09.05, Hsin-p-ai Wei, Weng-li, China, meteorite caused a house to collapse, killing a family`],
// 	[1908,'RU',`1908.06.30, Tunguska, Siberia, apparent airblast (no recovered meteorites) of an object entering earth's atmosphere; leveled hundreds of square miles of forest, killing hundreds of reindeer; unverified two people killed`],
// 	[1911,'EG',`1911.06.28, Nakhla, Egypt, dog struck and killed by meteorite (part of meteorite shower)`],
// 	[1912,'US',`1912.07.19, Holbrook, AZ, USA, meteorite shower of more than 14000 fragments; meteorite fell a few meters from a person; largest fragment 9 pounds`],
// 	[1915,'CN',`1915.04.25, Ta-yang, east of Mai-po, China, meteorite tore off a woman's arm; several meteorites, ranging from about 2 to about 3.5 kg`],
// 	[1916,'US',`1916.01.18, Baxter, MO, USA, 611-gm stony meteorite penetrated roof of house`],
// 	[1921,'LB',`1921.12.31, Beyrout, Lebanon, 1.1-kg stony meteorite fell through hut roof`],
// 	[1924,'US',`1924.07.06, Johnstown, CO, USA, meteorites fell within a few feet of two men; 50-pound stone went 5 feet into wet soil`],
// 	[1927,'JP',`1927.04.28, Aba-mura, Inashiki-gun, Ibaragi-ken, Japan, young girl suffered two head injuries when struck by a stony meteorite`],
// 	[1929,'RS',`1929.11.20, Zvezvan, Yugoslavia, man riding in a carriage in a wedding party was killed when hit by a 40-cm meteorite; a woman sitting opposite him was badly injured; "meteor ... was glowing hot"`],
// 	[1932,'US',`1932.08.10, Archie, MO, USA, meteorite fell less than 1 m from person`],
// 	[1936,'UA',`1936.04.02, Yurtuk, Ukraine, 2-kg stony meteorite smashed hole in roof of house`],
// 	[1938,'PH',`1938.06.16, Pantar, Philippines, numerous buildings hit by thousands of meteorites "as big as corn and rice grains"`],
// 	[1947,'RU',`1947.02.12, Sikhote-Alin, south-eastern Siberia, largest meteorite shower on record; estimated 100 tons of total debris fell, the largest weighing 1745 kg; some 9000 fragments weighing about 28 tons recovered; largest crater 28 m wide; bright fireball`],
// 	[1949,'GB',`1949.09.21, Beddgelert, N. Wales, 794-gm stony meteorite broke through roof and fell into hotel room`],
// 	[1950,'US',`1950.09.20, Murray, KY, USA, five buildings hit by meteorites; bright fireball seen`],
// 	[1954,'US',`1954.11.30, Sylacauga, AL, USA, woman in home hit by meteorite after breaking through roof`],
// 	[1965,'GB',`1965.12.24, Barwell, England, two buildings and a car hit by meteorites`],
// 	[1971,'US',`1971.04.08, Wethersfield, CT, USA, 12-ounce meteorite entered house through roof, lodged in living- room ceiling; ordinary chondrite; less than two miles away, another house was hit 11.5 yr later`],
// 	[1976,'CN',`1976.03.08, Jilin City, Jilin, China, largest stony-meteorite shower in recent times; more than 100 fragments, the largest being 1770 kg in weight and making an impact crater 6 m deep; H5 chondrite`],
// 	[1977,'US',`1977.01.31, Louisville, KY, USA, three buildings and a car hit by meteorites`],
// 	[1979,'_',`1979 Antartica As you perhaps already noticed, Antartica seems to be the place where the biggest amount of meteorites fall. Meteorites fall everywhere on Earth with equal probability but there are places where they are more easily found because the geology and the environmental conditions allow these fallen rocks to be preserved for up to millions of years. In fact, Antartica is one of the best meteorites hunting places!`],
// 	[1982,'US',`1982.11.08, Wethersfield, CT, USA, meteorite entered house through roof; second house hit in same town in 11.5 years; L6 chondrite`],
// 	[1984,'AU',`1984.09.30, Binningup, WA, Australia, meteorite fell 4-5 m from two sunbathers on soft beach sand`],
// 	[1985,'_',`1985. Antartica, Lewis Cliff ice tongue, More than 1900 meteorite stones have been collected, including LEW88516, a Martian meteorite.`],
// 	[1986,'JP',`1986.07.29, Kokubunji, Japan, several buildings hit by meteorites`],
// 	[1991,'US',`1991.08.31, Noblesville, IN, USA, meteorite fell 3.5 m from two children outside`],
// 	[1992,'UG',`1992.08.14, Mbale, Uganda, meteorite shower; boy hit on head by 3.6-g fragment after it hit tree first`],
// 	[1994,'ES',`1994.06.21, near Getafe, Spain, 12-cm-wide, 1.4-kg meteorite broke windshield and bent steering wheel of moving car, breaking finger of driver; more than 50 kg of meteorites found within 200 m of accident`],
// 	[2003,'US',`2003.03.26, Chicago, IL, USA, meteorite shower; buildings hit in Park Forest`],
// 	[2004,'NZ',`2004.06.12, Ellerslie, suburban Auckland, N.Z., 1.3-kg  7-cm x 13-cm meteorite broke through roof of house and bounced off sofa`],
// 	//[2007,`20.7 09 15, Carancas, Peru (near Lake Titicaca at alt. 3824 m), 13.5-m-diameter crater created by mid-day visible fireball meteorite; made international news when local people complained of illness -- not yet definitively explained`],
// 	[2008,'SD',`2008.10.06, Nubian desert, northern Sudan (Almahata Sitta), 47 meteorites weighing 3.95 kg were found in Dec. 2008 via a systematic search along the suspected debris path for the small minor planet 2008 TC3, discovered 20 hours prior to impact by R. A. Kowalski with the 1.5-m telescope at Mt. Lemmon in Arizona, when it was about 370000 miles from the earth; a bright fireball was seen by airline pilots and orbiting satellites when the object entered the earth's atmosphere; the largest recovered meteorite weights 1.5 g`],
// 	[2013,'RU',`2013.02.15, near Chelyabinsk, south-central Russia, extremely bright fireball (apparent brightness rivalling that of the apparent brightness of the sun) entered atmosphere over Alaska and moving westward toward Chelyabinsk, near its point shortly before sunrise, creating a huge airblast shock that damaged thousands of buildings in Chelyabinsk (mostly broken glass) and injuring more than 1000 people; apparently meteorites were found in water under a large circular broken-ice feature found soon after the event`]
// ]);



const messageMap = new Map([
	[1807,`1807.12.14, Weston, CT, U.S.A, meteor visible half a minute, loud sounds heard, many stones found scattered over 6-10 miles, weighing as much as 90 kg in total`],
	[1825,`1825.01.16, Oriang, Malwate, India, man killed, woman injured in meteorite fall [considered "possible" by LaPaz (1958)]`],
	[1827,`1827.02.16, Mhow, India, man wounded "severely in the arm" when hit by meteorite`],
	[1836,`1836.11.11, Macau, Brazil, cattle killed when hit by shower of meteorites [considered "possible" by LaPaz (1958)]`],
	[1844,`1844.12.01, Lo-shih Shan, An-chi, China, eleven stones fell; wall and side wall and room of Li Wei-kung's Temple damaged`],
	[1847,`1847.07.14, Hauptmannsdorf, Braunau, Bohemia, 37-pound Braunau iron meteorite smashed into a room, covering three children with ceiling debris but not hurting them`],
	[1850,`1850.10.17, Tang village, near T'ing-ch'eng, China, shiny black stone broke through roof of a house`],
	[1860,`1860.05.01, New Concord, OH, USA, horse struck and killed by meteorite`],
	[1863,`1863.08.08, Pillistfer, Latvia, 5.4-kg stony meteorite penetrated tile roof and floor of building`],
	[1868,`1868.01.30, Pultusk, Poland, meteorite shower of more than 100,000 fragments; bright fireball`],
	[1874,`1874.06.30, Chin-kuei Shan, Ming-tung Li, China, huge stone fell from sky, crushed half a cottage, killing a child`],
	[1879,`1879.01.31, Dun-le-Poelier, France, farmer reported killed by meteorite`],
	[1882,`1882.02.03, Mocs, Romania, meteorite shower of thousands of fragments; bright fireball`],
	[1890,`1890.05.02, Forest City, IA, USA, meteorite shower of some 200 fragments; one fragment fell into a pile of hay (no fire); bright fireball seen`],
	[1893,`1893.09.02, Zabrodje, White Russia, 3-kg stony meteorite fell through house roof`],
	[1906,`1906.11.04, Constantia, South Africa, 1-kg stony meteorite smashed through roof and ceiling (2-pound piece recovered)`],
	[1907,`1907.09.05, Hsin-p-ai Wei, Weng-li, China, meteorite caused a house to collapse, killing a family`],
	[1908,`1908.06.30, Tunguska, Siberia, apparent airblast (no recovered meteorites) of an object entering earth's atmosphere; leveled hundreds of square miles of forest, killing hundreds of reindeer; unverified two people killed`],
	[1911,`1911.06.28, Nakhla, Egypt, dog struck and killed by meteorite (part of meteorite shower)`],
	[1912,`1912.07.19, Holbrook, AZ, USA, meteorite shower of more than 14000 fragments; meteorite fell a few meters from a person; largest fragment 9 pounds`],
	[1915,`1915.04.25, Ta-yang, east of Mai-po, China, meteorite tore off a woman's arm; several meteorites, ranging from about 2 to about 3.5 kg`],
	[1916,`1916.01.18, Baxter, MO, USA, 611-gm stony meteorite penetrated roof of house`],
	[1921,`1921.12.31, Beyrout, Syria, 1.1-kg stony meteorite fell through hut roof`],
	[1924,`1924.07.06, Johnstown, CO, USA, meteorites fell within a few feet of two men; 50-pound stone went 5 feet into wet soil`],
	[1927,`1927.04.28, Aba-mura, Inashiki-gun, Ibaragi-ken, Japan, young girl suffered two head injuries when struck by a stony meteorite`],
	[1929,`1929.11.20, Zvezvan, Yugoslavia, man riding in a carriage in a wedding party was killed when hit by a 40-cm meteorite; a woman sitting opposite him was badly injured; "meteor ... was glowing hot"`],
	[1932,`1932.08.10, Archie, MO, USA, meteorite fell less than 1 m from person`],
	[1936,`1936.04.02, Yurtuk, Ukraine, 2-kg stony meteorite smashed hole in roof of house`],
	[1938,`1938.06.16, Pantar, Philippines, numerous buildings hit by thousands of meteorites "as big as corn and rice grains"`],
	[1947,`1947.02.12, Sikhote-Alin, south-eastern Siberia, largest meteorite shower on record; estimated 100 tons of total debris fell, the largest weighing 1745 kg; some 9000 fragments weighing about 28 tons recovered; largest crater 28 m wide; bright fireball`],
	[1949,`1949.09.21, Beddgelert, N. Wales, 794-gm stony meteorite broke through roof and fell into hotel room`],
	[1950,`1950.09.20, Murray, KY, USA, five buildings hit by meteorites; bright fireball seen`],
	[1954,`1954.11.30, Sylacauga, AL, USA, woman in home hit by meteorite after breaking through roof`],
	[1965,`1965.12.24, Barwell, England, two buildings and a car hit by meteorites`],
	[1971,`1971.04.08, Wethersfield, CT, USA, 12-ounce meteorite entered house through roof, lodged in living- room ceiling; ordinary chondrite; less than two miles away, another house was hit 11.5 yr later`],
	[1976,`1976.03.08, Jilin City, Jilin, China, largest stony-meteorite shower in recent times; more than 100 fragments, the largest being 1770 kg in weight and making an impact crater 6 m deep; H5 chondrite`],
	[1977,`1977.01.31, Louisville, KY, USA, three buildings and a car hit by meteorites`],
	[1979,`1979 Antartica As you perhaps already noticed, Antartica seems to be the place where the biggest amount of meteorites fall. Meteorites fall everywhere on Earth with equal probability but there are places where they are more easily found because the geology and the environmental conditions allow these fallen rocks to be preserved for up to millions of years. In fact, Antartica is one of the best meteorites hunting places!`],
	[1982,`1982.11.08, Wethersfield, CT, USA, meteorite entered house through roof; second house hit in same town in 11.5 years; L6 chondrite`],
	[1984,`1984.09.30, Binningup, WA, Australia, meteorite fell 4-5 m from two sunbathers on soft beach sand`],
	[1985,`1985. Antartica, Lewis Cliff ice tongue, More than 1900 meteorite stones have been collected, including LEW88516, a Martian meteorite.`],
	[1986,`1986.07.29, Kokubunji, Japan, several buildings hit by meteorites`],
	[1991,`1991.08.31, Noblesville, IN, USA, meteorite fell 3.5 m from two children outside`],
	[1992,`1992.08.14, Mbale, Uganda, meteorite shower; boy hit on head by 3.6-g fragment after it hit tree first`],
	[1994,`1994.06.21, near Getafe, Spain, 12-cm-wide, 1.4-kg meteorite broke windshield and bent steering wheel of moving car, breaking finger of driver; more than 50 kg of meteorites found within 200 m of accident`],
	[2003,`2003.03.26, Chicago, IL, USA, meteorite shower; buildings hit in Park Forest`],
	[2004,`2004.06.12, Ellerslie, suburban Auckland, N.Z., 1.3-kg  7-cm x 13-cm meteorite broke through roof of house and bounced off sofa`],
	[2007,`20.7 09 15, Carancas, Peru (near Lake Titicaca at alt. 3824 m), 13.5-m-diameter crater created by mid-day visible fireball meteorite; made international news when local people complained of illness -- not yet definitively explained`],
	[2008,`2008.10.06, Nubian desert, northern Sudan (Almahata Sitta), 47 meteorites weighing 3.95 kg were found in Dec. 2008 via a systematic search along the suspected debris path for the small minor planet 2008 TC3, discovered 20 hours prior to impact by R. A. Kowalski with the 1.5-m telescope at Mt. Lemmon in Arizona, when it was about 370000 miles from the earth; a bright fireball was seen by airline pilots and orbiting satellites when the object entered the earth's atmosphere; the largest recovered meteorite weights 1.5 g`],
	[2013,`2013.02.15, near Chelyabinsk, south-central Russia, extremely bright fireball (apparent brightness rivalling that of the apparent brightness of the sun) entered atmosphere over Alaska and moving westward toward Chelyabinsk, near its point shortly before sunrise, creating a huge airblast shock that damaged thousands of buildings in Chelyabinsk (mostly broken glass) and injuring more than 1000 people; apparently meteorites were found in water under a large circular broken-ice feature found soon after the event`]
]);

function showMessage(year) {
	$("#messages").empty();
	const str = messageMap.get(year);
	//  With animation word by word
	const spans = '<span>' + str.split(/\s+/).join(' </span><span>') + '</span>';
	$(spans).hide().appendTo('#messages').each(function(i) {
		$(this).delay(50 * i).fadeIn(300);
	});
}

function hideMessage() {
	$("#messages").empty();
}
