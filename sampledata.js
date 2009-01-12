var sampleData =
"/type/object/name\t/type/object/type\t/film/film/directed_by\n" +
"Stolen Kisses\t/film/film\tFran\u00E7ois Truffaut\n" +
"The Stoned Age\t/film/film\tJames Melkonian\n" +
"Stonewall\t/film/film\tNigel Finch\n" +
"Strange Days\t/film/film\tKathryn Bigelow\n" +
"The Strange Love of Martha Ivers\t/film/film\tLewis Milestone\n" +
"Straw Dogs\t/film/film\tSam Peckinpah\n" +
"A Streetcar Named Desire\t/film/film\tElia Kazan\n" +
"Stripes\t/film/film\tIvan Reitman\n" +
"Stroker Ace\t/film/film\tHal Needham\n" +
"Summertime\t/film/film\tDavid Lean\n" +
"Sunday in the Country\t/film/film\tBertrand Tavernier\n" +
"Surviving the Game\t/film/film\tErnest R. Dickerson\n" +
"Swashbuckler\t/film/film\tJames Goldstone\n" +
"Sweet Dreams\t/film/film\tKarel Reisz\n" +
"Swingers\t/film/film\tDoug Liman\n" +
"Hard Eight\t/film/film\tPaul Thomas Anderson\n" +
"Take the Money and Run\t/film/film\tWoody Allen\n" +
"Tale of Two Sisters\t/film/film\tAdam Rifkin\n" +
"Tales from the Crypt: Demon Knight\t/film/film\tErnest R. Dickerson\n" +
"Tampopo\t/film/film\tJuzo Itami\n" +
"Tango & Cash\t/film/film\tAndrei Konchalovsky\n" +
"Tequila Sunrise\t/film/film\tRobert Towne\n" +
"The Terminator\t/film/film\tJames Cameron\n" +
"Terror of Mechagodzilla\t/film/film\tIshir\u00F4 Honda\n" +
"Tess of the Storm Country\t/film/film\tJohn S. Robertson\n" +
"Tetsuo 2: Body Hammer\t/film/film\tShinya Tsukamoto\n" +
"Tetsuo: The Iron Man\t/film/film\tShinya Tsukamoto\n" +
"They Might Be Giants\t/film/film\tAnthony Harvey\n" +
"The Thief of Bagdad\t/film/film\tRaoul Walsh\n" +
"The Thing\t/film/film\tJohn Carpenter\n" +
"Things to Do in Denver When You\'re Dead\t/film/film\tGary Fleder\n" +
"This Sporting Life\t/film/film\tLindsay Anderson\n" +
"The Thomas Crown Affair\t/film/film\tNorman Jewison\n" +
"Three Amigos\t/film/film\tJohn Landis\n" +
"Three Days of the Condor\t/film/film\tSydney Pollack\n" +
"The Three Musketeers\t/film/film\tStephen Herek\n" +
"Thunder Road\t/film/film\tRobert Mitchum\n" +
"Thunderball\t/film/film\tTerence Young\n" +
"Thunderheart\t/film/film\tMichael Apted\n" +
"Tiger Bay\t/film/film\tJ. Lee Thompson\n" +
"Tim\t/film/film\tMichael Pate\n" +
"Timecop\t/film/film\tPeter Hyams\n" +
"Tin Cup\t/film/film\tRon Shelton\n" +
"The Tingler\t/film/film\tWilliam Castle\n" +
"To Die For\t/film/film\tGus Van Sant\n" +
"Tokyo Fist\t/film/film\tShinya Tsukamoto\n" +
"Tol\'able David\t/film/film\tHenry King\n" +
"Tora! Tora! Tora!\t/film/film\tKinji Fukasuka\n" +
"Tornado!\t/film/film\tNoel Nosseck\n" +
"Tourist Trap\t/film/film\t\n" +
"The Toxic Avenger\t/film/film\tLloyd Kaufman\n" +
"Trancers\t/film/film\tCharles Band\n" +
"La Traviata\t/film/film\tFranco Zeffirelli\n" +
"Trial\t/film/film\tDavid Jones\n" +
"True Grit\t/film/film\tHenry Hathaway\n" +
"True Romance\t/film/film\tTony Scott\n" +
"Truman\t/film/film\tFrank Pierson\n" +
"Madonna: Truth or Dare\t/film/film\tAlek Keshishian\n" +
"The Tune\t/film/film\tBill Plympton\n" +
"Turbulence\t/film/film\tTobert Butler\n" +
"Two Lost Worlds\t/film/film\t\n" +
"Two-Minute Warning\t/film/film\tLarry Peerce\n" +
"Two Moon Junction\t/film/film\tZalman King\n" +
"Two-Lane Blacktop\t/film/film\tMonte Hellman\n" +
"U2: Rattle and Hum\t/film/film\tPhil Joanou\n" +
"The Umbrellas of Cherbourg\t/film/film\tJacques Demy\n" +
"Uncle Buck\t/film/film\tJohn Hughes\n" +
"Under Siege\t/film/film\tAndrew Davis\n" +
"The Underneath\t/film/film\tSteven Soderbergh\n" +
"Vagabond\t/film/film\tAgn\u00E8s Varda\n" +
"The Vanishing\t/film/film\tGeorge Sluizer\n" +
"Vengeance Valley\t/film/film\tRichard Thorpe\n" +
"Very Natural Thing\t/film/film\tChristopher Larkin\n" +
"Victory\t/film/film\tJohn Huston\n" +
"Vive L\'Amour\t/film/film\tMing-liang Tsai\n" +
"Volunteers\t/film/film\tNicholas Meyer\n" +
"Voodoo Dawn\t/film/film\tAndrzej Sekula\n" +
"Waiting to Exhale\t/film/film\tForest Whitaker\n" +
"Walkabout\t/film/film\tNicolas Roeg\n" +
"Walking Tall\t/film/film\tPhil Karlson\n" +
"The War Room\t/film/film\tD.A. Pennebaker\n" +
"The War Wagon\t/film/film\tBurt Kennedy\n" +
"Wedding Bell Blues\t/film/film\tDana Lustig\n" +
"The Westerner\t/film/film\tWilliam Wyler\n" +
"When a Man Loves a Woman\t/film/film\tLuis Mandoki\n" +
"When We Were Kings\t/film/film\tLeon Gast\n" +
"Where the Buffalo Roam\t/film/film\tArt Linson\n" +
"White Palace\t/film/film\tLuis Mandoki\n" +
"White Squall\t/film/film\tRidley Scott\n" +
"Who\'s Afraid of Virginia Woolf?\t/film/film\tMike Nichols\n" +
"Wide Awake\t/film/film\tM. Night Shyamalan\n" +
"The Wild One\t/film/film\tLaslo Benedek\n" +
"The Winslow Boy\t/film/film\tDavid Mamet\n" +
"Winstanley\t/film/film\tAndrew Mollo\n" +
"Witness\t/film/film\tPeter Weir\n" +
"The Woman Who Came Back\t/film/film\tWalter Colmes\n" +
"Women in Revolt\t/film/film\tPaul Morrissey\n" +
"Wrecking Crew\t/film/film\t\n" +
"Xanadu\t/film/film\tRobert Greenwald\n" +
"Year of the Gun\t/film/film\tJohn Frankenheimer\n" +
"Yellow Submarine\t/film/film\tGeorge Dunning\n" +
"Yojimbo\t/film/film\tAkira Kurosawa\n" +
"Young Guns II\t/film/film\tGeoff Murphy\n" +
"Zu: Warriors from the Magic Mountain\t/film/film\tHark Tsui\n" +
"Gridlock\'d\t/film/film\tVondie Curtis-Hall\n" +
"Shanghai Grand\t/film/film\tPoon Man Kit\n" +
"The House of Yes\t/film/film\tMark S. Waters\n" +
"Love Jones\t/film/film\tTheodore Witcher\n" +
"Clockwatchers\t/film/film\tJill Sprecher\n" +
"Zeus and Roxanne\t/film/film\tGeorge Miller\n" +
"Meet Wally Sparks\t/film/film\tPeter Baldwin\n" +
"Chasing Amy\t/film/film\tKevin Smith\n" +
"Absolute Power\t/film/film\tClint Eastwood\n" +
"Dante\'s Peak\t/film/film\tRoger Donaldson\n" +
"Hugo Pool\t/film/film\tRobert Downey Sr.\n" +
"Rosewood\t/film/film\tJohn Singleton\n" +
"Fools Rush In\t/film/film\tAndy Tennant\n" +
"Vegas Vacation\t/film/film\tStephen Kessler\n" +
"The Three Stooges: Sing a Song of Six Pants\t/film/film\tJules White\n" +
"Quatermass and the Pit\t/film/film\tRoy Ward Baker\n" +
"The Bicycle Thief\t/film/film\tVittorio De Sica\n" +
"For a Few Dollars More\t/film/film\tSergio Leone\n" +
"Mean Guns\t/film/film\tAlbert Pyun\n" +
"Samurai Trilogy 2: Duel at Ichijoji Temple\t/film/film\tHiroshi Inagaki\n" +
"Head: The Monkees\t/film/film\tBob Rafelson\n" +
"Private Parts\t/film/film\tBetty Thomas\n" +
"Boys Life 2\t/film/film\tNickolas Perry\n" +
"The Designated Mourner\t/film/film\tDavid Hare\n" +
"Selena\t/film/film\tGregory Nava\n" +
"The Devil\'s Own\t/film/film\tAlan J. Pakula\n" +
"Grosse Pointe Blank\t/film/film\tGeorge Armitage\n" +
"Double Team\t/film/film\tHark Tsui\n" +
"Anaconda\t/film/film\tLuis Llosa\n" +
"Murder at 1600\t/film/film\tDwight H. Little\n" +
"Volcano\t/film/film\tMick Jackson\n" +
"Austin Powers: International Man of Mystery\t/film/film\tJay Roach\n" +
"Warriors of Virtue\t/film/film\tRonny Yu\n" +
"Fathers\' Day\t/film/film\tIvan Reitman\n" +
"The Bride with White Hair\t/film/film\tRonny Yu\n" +
"Hard Rain\t/film/film\tMichael Salomon\n" +
"Batman & Robin\t/film/film\tJoel Schumacher\n" +
"Face/Off\t/film/film\tJohn Woo\n" +
"Speed 2: Cruise Control\t/film/film\tJan De Bont\n" +
"My Son the Fanatic\t/film/film\tUdayan Prasad\n" +
"Pretty Village, Pretty Flame\t/film/film\tSrdjan Dragojevic\n" +
"Africa: The Serengeti: IMAX\t/film/film\tGeorge Casey\n" +
"Beware! Children at Play\t/film/film\tMik Cribben\n" +
"Insomnia\t/film/film\tErik Skjoldbjaerg\n" +
"The Sweet Hereafter\t/film/film\tAtom Egoyan\n" +
"Ma Vie En Rose\t/film/film\tAlain Berliner\n" +
"Taste of Cherry\t/film/film\tAbbas Kiarostami\n" +
"Mrs. Brown\t/film/film\tJohn Madden\n" +
"Armageddon\t/film/film\tGordon Chan\n" +
"Last Breath\t/film/film\tPJ Posner\n" +
"Till the Clouds Roll By\t/film/film\tVincente Minnelli\n" +
"Jack-O\t/film/film\tSteve Latshaw\n" +
"Hercules\t/film/film\tRon Clements\n" +
"George of the Jungle\t/film/film\tSam Weisman\n" +
"Contact\t/film/film\tRobert Zemeckis\n" +
"Nothing to Lose\t/film/film\tSteve Oedekerk\n" +
"Air Force One\t/film/film\tWolfgang Petersen\n" +
"Conspiracy Theory\t/film/film\tRichard Donner\n" +
"Air Bud\t/film/film\tCharles Martin Smith\n" +
"Soul Food\t/film/film\tGeorge Tillman Jr.\n" +
"In & Out\t/film/film\tFrank Oz\n" +
"The Game\t/film/film\tDavid Fincher\n" +
"Kull the Conqueror\t/film/film\tJohn Nicolella\n" +
"How To Be A Player\t/film/film\tLionel C. Martin\n" +
"A Life Less Ordinary\t/film/film\tDanny Boyle\n" +
"Deconstructing Harry\t/film/film\tWoody Allen\n" +
"Hoodlum\t/film/film\tBill Duke\n" +
"Lawn Dogs\t/film/film\tJohn Duigan\n" +
"The Apostle\t/film/film\tRobert Duvall\n" +
"Gattaca\t/film/film\tAndrew Niccol\n" +
"The Spanish Prisoner\t/film/film\tDavid Mamet\n" +
"Swept from the Sea\t/film/film\tBeeban Kidron\n" +
"Telling Lies in America\t/film/film\t\n" +
"The Real Blonde\t/film/film\tTom DiCillo\n" +
"Six Ways to Sunday\t/film/film\tAdam Bernstein\n" +
"The Ugly\t/film/film\tScott Reynolds\n" +
"Playing God\t/film/film\tAndy Wilson\n" +
"Dancehall Queen\t/film/film\tRick Elgood\n" +
"Desperate Measures\t/film/film\tBarbet Schroeder\n" +
"Home Alone 3\t/film/film\tRaja Gosnell\n" +
"Mouse Hunt\t/film/film\tGore Verbinski\n" +
"As Good as It Gets\t/film/film\tJames L. Brooks\n" +
"The Postman\t/film/film\tKevin Costner\n" +
"The Big Lebowski\t/film/film\tJoel Coen\n" +
"Midnight in the Garden of Good and Evil\t/film/film\tClint Eastwood\n" +
"Scream 2\t/film/film\tWes Craven\n" +
"Mortal Kombat: Annihilation\t/film/film\tJohn R. Leonetti\n" +
"An American Werewolf in Paris\t/film/film\tJohn Landis\n" +
"The Gingerbread Man\t/film/film\tRobert Altman\n" +
"I Know What You Did Last Summer\t/film/film\tJim Gillespie\n" +
"The Devil\'s Advocate\t/film/film\tTaylor Hackford\n" +
"Switchback\t/film/film\tJeb Stuart\n" +
"I Love You, I Love You Not\t/film/film\tBilly Hopkins\n" +
"Broken Vessels\t/film/film\tScott Ziehl\n" +
"Godzilla\t/film/film\tRoland Emmerich\n" +
"Happiness\t/film/film\tTodd Solondz\n" +
"Like It Is\t/film/film\tPaul Oremland\n" +
"A Perfect Murder\t/film/film\tAndrew Davis\n" +
"The Dreamlife of Angels\t/film/film\tErick Zonca\n" +
"Chemmeen: Malayalam\t/film/film\tRamu Kariat\n" +
"Upkar\t/film/film\tManoj Kumar\n" +
"Anastasia\t/film/film\tGary Goldman\n" +
"The Borrowers\t/film/film\tPeter Hewitt\n" +
"Trekkies\t/film/film\tRoger Nygard\n" +
"Incognito\t/film/film\tJohn Badham\n" +
"Spice World\t/film/film\tBob Spiers\n" +
"Firestorm\t/film/film\tDean Semler\n" +
"Fallen\t/film/film\tGregory Hoblit\n" +
"Sliding Doors\t/film/film\tPeter Howitt\n" +
"Pi: Faith in Chaos\t/film/film\tDarren Aronofsky\n" +
"Gods and Monsters\t/film/film\tBill Condon\n" +
"Polish Wedding\t/film/film\tTheresa Connelly\n" +
"Kurt & Courtney\t/film/film\tNick Broomfield\n" +
"Lee Rock\t/film/film\tLawrence Ah Mon\n" +
"God of Gamblers Return\t/film/film\tJing Wong\n" +
"Lawyer Lawyer\t/film/film\tJoe Ma\n" +
"Species II\t/film/film\tPeter Medak\n" +
"In God\'s Hands\t/film/film\tZalman King\n" +
"The Big Hit\t/film/film\tKirk Wong\n" +
"Cannibal! The Musical\t/film/film\tTrey Parker\n" +
"Shivers\t/film/film\tDavid Cronenberg\n" +
"Meet John Doe\t/film/film\tFrank Capra\n" +
"Six Days, Seven Nights\t/film/film\tIvan Reitman\n" +
"The X-Files: Fight the Future\t/film/film\tRob Bowman\n" +
"Dr. Dolittle\t/film/film\tBetty Thomas\n" +
"Southie\t/film/film\tJohn Shea\n" +
"Spawn 2\t/film/film\tEric Radomski\n" +
"Cats\t/film/film\tDavid Mallet\n" +
"Phoenix\t/film/film\tDanny Cannon\n" +
"Curse of the Puppet Master\t/film/film\tVictoria Sloan\n" +
"Mafia!\t/film/film\tJim Abrahams\n" +
"Disturbing Behavior\t/film/film\tDavid Nutter\n" +
"BASEketball\t/film/film\tDavid Zucker\n" +
"Ever After: A Cinderella Story\t/film/film\tAndy Tennant\n" +
"Madeline\t/film/film\tDaisy Von Scherler Mayer\n" +
"Your Friends & Neighbors\t/film/film\tNeil LaBute\n" +
"How Stella Got Her Groove Back\t/film/film\tKevin Rodney Sullivan\n" +
"Why Do Fools Fall in Love\t/film/film\tGregory Nava\n" +
"Man with the Movie Camera\t/film/film\tDziga Vertov\n" +
"When Trumpets Fade\t/film/film\tJohn Irvin\n" +
"Tomorrow Never Dies\t/film/film\tRoger Spottiswoode\n" +
"Posse\t/film/film\tMario Van Peebles\n" +
"Flesh for Frankenstein\t/film/film\tPaul Morrissey\n" +
"Blood for Dracula\t/film/film\tAntonio Margheriti\n" +
"Aflatoon\t/film/film\tGuddu Dhanoa\n" +
"Fearless Hyena 1 / Fearless Hyena 2\t/film/film\t\n" +
"Dark Star\t/film/film\tJohn Carpenter\n" +
"Hitman\t/film/film\tTung Wai\n" +
"Beast Cops\t/film/film\tDante Lam\n" +
"The Wonderful, Horrible Life of Leni Riefenstahl\t/film/film\tRay Muller\n" +
"Lethal Weapon 4\t/film/film\tRichard Donner\n" +
"Tekken\t/film/film\tJunji Sakamoto\n" +
"The Lost World\t/film/film\tHarry O. Hoyt\n" +
"Nothing Sacred\t/film/film\tWilliam A. Wellman\n" +
"Odin: Photon Space Sailer Starlight\t/film/film\tEichi Yamamoto\n" +
"Another Day in Paradise\t/film/film\tLarry Clark\n" +
"Antz\t/film/film\tEric Darnell\n" +
"Besieged\t/film/film\tBernardo Bertolucci\n" +
"Clay Pigeons\t/film/film\tDavid Dobkin\n" +
"Elizabeth\t/film/film\tShekhar Kapur\n" +
"Get Real\t/film/film\tSimon Shore\n" +
"Hilary and Jackie\t/film/film\tAnand Tucker\n" +
"Home Fries\t/film/film\tDean Parisot\n" +
"Hurlyburly\t/film/film\tAnthony Drazan\n" +
"One True Thing\t/film/film\tCarl Franklin\n" +
"Rushmore\t/film/film\tWes Anderson\n" +
"Urban Legend\t/film/film\tJamie Blanks\n" +
"Very Bad Things\t/film/film\t\n" +
"Amir Garib\t/film/film\tMohan Kumar\n" +
"Zanjeer\t/film/film\tPrakash Mehra\n" +
"Jack Frost\t/film/film\tMichael Cooney\n" +
"The Big Chill\t/film/film\tLawrence Kasdan\n" +
"Bulworth\t/film/film\tWarren Beatty\n" +
"The Long Good Friday\t/film/film\tJohn Mackenzie\n" +
"Koyla\t/film/film\tRakesh Roshan\n" +
"Gupt\t/film/film\tRajiv Rai\n" +
"Sholay\t/film/film\tRamesh Sippy\n" +
"Virasat\t/film/film\tPriyadarshan\n" +
"Ishq\t/film/film\tIndra Kumar\n" +
"Raja Hindustani\t/film/film\t\n" +
"Yes Boss\t/film/film\tAziz Mirza\n" +
"Karan Arjun\t/film/film\tRakesh Roshan\n" +
"Kasme Vaade\t/film/film\tRamesh Bhel\n" +
"Mrityudand\t/film/film\tPrakash Jha\n" +
"Saat Rang Ke Sapne\t/film/film\tPriyadarshan\n" +
"Dil Se\t/film/film\tMani Ratnam\n" +
"Lola Montes\t/film/film\tMax Ophuls\n" +
"Jackie Chan\'s First Strike\t/film/film\tStanley Tong\n" +
"The River Wild\t/film/film\tCurtis Hanson\n" +
"Waterworld\t/film/film\tKevin Reynolds\n" +
"12 Monkeys\t/film/film\tTerry Gilliam\n" +
"Time Bandits\t/film/film\tTerry Gilliam\n" +
"Ronin\t/film/film\tJohn Frankenheimer\n" +
"Winners & Sinners\t/film/film\tSammo Hung Kam-Bo\n" +
"Wild Search\t/film/film\tRingo Lam\n" +
"Namak Haraam\t/film/film\tHrishikesh Mukherjee\n" +
"Tridev\t/film/film\tRajiv Rai\n" +
"Tere Mere Sapne\t/film/film\tJoy Augustine\n" +
"My Life as a Dog\t/film/film\tLasse Hallstr\u00F6m\n" +
"Ringmaster\t/film/film\tNeil Abramson\n" +
"Jai Santoshi Maa\t/film/film\tVijay Sharma\n" +
"True Stories\t/film/film\tDavid Byrne\n" +
"Living Out Loud\t/film/film\tRichard LaGravenese\n" +
"Sargam\t/film/film\tK. Vishwanath\n" +
"Millionaire\'s Express\t/film/film\tSammo Hung Kam-Bo\n" +
"Mighty Joe Young\t/film/film\tRon Underwood\n" +
"Custer of the West\t/film/film\tRobert Siodmak\n" +
"I Still Know What You Did Last Summer\t/film/film\tDanny Cannon\n" +
"Legionnaire\t/film/film\tPeter McDonald\n" +
"Ram Balram\t/film/film\tVijay Anand\n" +
"The Rugrats Movie\t/film/film\tIgor Kovalyov\n" +
"Six-String Samurai\t/film/film\tLance Mungia\n" +
"A Bug\'s Life\t/film/film\tAndrew Stanton\n" +
"Dil\t/film/film\tIndra Kumar\n" +
"Things to Come\t/film/film\tWilliam Cameron Menzies\n" +
"Celebrity\t/film/film\tWoody Allen\n" +
"What Dreams May Come\t/film/film\tVincent Ward\n" +
"Razor Blade Smile\t/film/film\tJake West\n" +
"Holy Man\t/film/film\tStephen Herek\n" +
"Just Write\t/film/film\tAndrew Gallerani\n" +
"Finding Graceland\t/film/film\tDavid Winkler\n" +
"Little Voice\t/film/film\tMark Herman\n" +
"Enemy of the State\t/film/film\tTony Scott\n" +
"Babe: Pig in the City\t/film/film\tGeorge Miller\n" +
"Psycho\t/film/film\tGus Van Sant\n" +
"Still Crazy\t/film/film\tBrian Gibson\n" +
"Brown\'s Requiem\t/film/film\tJason Freeland\n" +
"You\'ve Got Mail\t/film/film\tNora Ephron\n" +
"A Civil Action\t/film/film\tSteven Zaillian\n" +
"The Faculty\t/film/film\tRobert Rodriguez\n" +
"At First Sight\t/film/film\tIrwin Winkler\n" +
"In Dreams\t/film/film\tNeil Jordan\n" +
"Gloria\t/film/film\tSidney Lumet\n" +
"Romance\t/film/film\tCatherine Breillat\n" +
"Blast from the Past\t/film/film\tHugh Wilson\n" +
"Buena Vista Social Club\t/film/film\tWim Wenders\n" +
"Better Than Chocolate\t/film/film\tAnne Wheeler\n" +
"Out of Sight\t/film/film\tSteven Soderbergh\n" +
"Sci-Fighters\t/film/film\tPeter Svatek\n" +
"Texas Chainsaw Massacre: The Next Generation\t/film/film\tKim Henkel\n" +
"Gangster World\t/film/film\t\n" +
"She\'s All That\t/film/film\tRobert Iscove\n" +
"From Dusk Till Dawn 2: Texas Blood Money\t/film/film\tScott Spiegel\n" +
"Bloodsport 4\t/film/film\tElvis Restaino\n" +
"Simply Irresistible\t/film/film\tMark Tarlov\n" +
"October Sky\t/film/film\tJoe Johnston\n" +
"Existenz\t/film/film\tDavid Cronenberg\n" +
"8MM\t/film/film\tJoel Schumacher\n" +
"Just the Ticket\t/film/film\tRichard Wenk\n" +
"Analyze This\t/film/film\tHarold Ramis\n" +
"The Corruptor\t/film/film\tJames Foley\n" +
"The Rage: Carrie 2\t/film/film\tKatt Shea\n" +
"Turbulence\t/film/film\tJon McCormack\n" +
"The King and I\t/film/film\tRichard Rich\n" +
"The Boxer\t/film/film\tJim Sheridan\n" +
"Bonnie and Clyde\t/film/film\tArthur Penn\n" +
"Hum Aapke Dil Mein Rehte Hain\t/film/film\tSatish Kaushik\n" +
"The Patriot\t/film/film\tDean Semler\n" +
"I, Zombie\t/film/film\tAndrew Parkinson\n" +
"Jawbreaker\t/film/film\tDarren Stein\n" +
"Storm of the Century\t/film/film\tCraig R. Baxley\n" +
"The Arrival / The Arrival 2\t/film/film\tDavid Twohy\n" +
"Roja\t/film/film\tMani Ratnam\n" +
"Double Platinum\t/film/film\tRobert Allan Ackerman\n" +
"Zakhm\t/film/film\tMahesh Bhatt\n" +
"Aa Ab Laut Chalen\t/film/film\tRishi Kapoor\n" +
"Ghayal\t/film/film\tRaj Kumar Santoshi\n" +
"Pyaar To Hona Hi Tha\t/film/film\tAnees Bazmee\n" +
"Chachi 420\t/film/film\tKamal Hassan\n" +
"Jeans\t/film/film\tShankar\n" +
"Khamoshi\t/film/film\tSanjay Leela Bhansali\n" +
"Paulie\t/film/film\tJohn Roberts\n" +
"Aadmi\t/film/film\tA. Bheem Singh\n" +
"Beta\t/film/film\tIndra Kumar\n" +
"Anarkali\t/film/film\tNandlal Jaswantlal\n" +
"Aandhi\t/film/film\tGulzar\n" +
"Chandni\t/film/film\tYash Chopra\n" +
"Agni Sakshi\t/film/film\tParto Ghosh\n" +
"Chupke Chupke\t/film/film\tHrishikesh Mukherjee\n" +
"Hero\t/film/film\tSubhash Ghai\n" +
"Hero No. 1\t/film/film\tDavid Dhawan\n" +
"Kaun\t/film/film\tRam Gopal Varma\n" +
"Professor\t/film/film\tLekh Tandon\n" +
"Aaina\t/film/film\tYash Chopra\n" +
"Army\t/film/film\tRaam Shetty\n" +
"Umrao Jaan\t/film/film\tMuzaffar Ali\n" +
"The Witches\t/film/film\tNicolas Roeg\n" +
"Ready to Wear\t/film/film\tRobert Altman\n" +
"Cat City\t/film/film\tBela Ternovsky\n" +
"Office Space\t/film/film\tMike Judge\n" +
"Antonia\'s Line\t/film/film\tMarleen Gorris\n" +
"Idle Hands\t/film/film\tRodman Flender\n" +
"Love Story\t/film/film\tRajendra Kumar\n" +
"The \'Burbs\t/film/film\tJoe Dante\n" +
"The Mod Squad\t/film/film\tScott Silver\n" +
"Forces of Nature\t/film/film\tBronwen Hughes\n" +
"The Out-of-Towners\t/film/film\tSam Weisman\n" +
"Ravenous\t/film/film\tAntonia Bird\n" +
"The Mummy\t/film/film\tStephen Sommers\n" +
"Pushing Tin\t/film/film\tMike Newell\n" +
"1941\t/film/film\tSteven Spielberg\n" +
"1942: A Love Story\t/film/film\tVidhu Vinod Chopra\n" +
"April 1st Vidudhala\t/film/film\tVamsy\n" +
"Cobra\t/film/film\tJoseph Henabery\n" +
"Army of One\t/film/film\tVic Armstrong\n" +
"Jeene Ki Raah\t/film/film\tL.V. Prasad\n" +
"C.I.D\t/film/film\tRaj Khosla\n" +
"Darr\t/film/film\tYash Chopra\n" +
"Iron Monkey\t/film/film\t\n" +
"Saagar\t/film/film\tRamesh Sippy\n" +
"Shahenshah\t/film/film\tTinnu Anand\n" +
"Trimurti\t/film/film\tMukul Anand\n" +
"Vidhaata\t/film/film\tSubhash Ghai\n" +
"Zindagi Ek Juaa\t/film/film\tPrakash Mehra\n" +
"Anupama\t/film/film\tHrishikesh Mukherjee\n" +
"Dil Hai Ke Manta Nahin\t/film/film\tMahesh Bhatt\n" +
"English Babu Desi Mem\t/film/film\tPraveen Nischol\n" +
"Hera Pheri\t/film/film\tPrakash Mehra\n" +
"Jhanak Jhanak Payal Baaje\t/film/film\tV. Shantaram\n" +
"Parinda\t/film/film\tVidhu Vinod Chopra\n" +
"Trinity and Beyond: Atomic Bomb\t/film/film\tPeter Kuran\n" +
"The Confession\t/film/film\tDavid Jones\n" +
"Urban Menace\t/film/film\tAlbert Pyun\n" +
"20,000 Leagues Under the Sea\t/film/film\tStuart Paton\n" +
"2010: The Year We Make Contact\t/film/film\tPeter Hyams\n" +
"Operation Condor 2: Armour of the Gods\t/film/film\tJackie Chan\n" +
"Marlene\t/film/film\tMaximilian Schell\n" +
"Atomic Train\t/film/film\tDick Lowry\n" +
"36 Fillette\t/film/film\tCatherine Breillat\n" +
"48 Hrs.\t/film/film\tWalter Hill\n" +
"Akele Hum Akele Tum\t/film/film\tMansoor Khan\n" +
"Disco Dancer\t/film/film\tB. Subhash\n" +
"Gol Maal\t/film/film\tHrishikesh Mukherjee\n" +
"Hum Kisise Kum Nahim\t/film/film\tNasir Hussain\n" +
"Kaagaz Ke Phool\t/film/film\tGuru Dutt\n" +
"10 Things I Hate About You\t/film/film\tGil Junger\n" +
"Life\t/film/film\tTed Demme\n" +
"Never Been Kissed\t/film/film\tRaja Gosnell\n" +
"Hello Brother\t/film/film\tSohail Khan\n" +
"Hote Hote Pyaar Ho Gaya\t/film/film\tFiroz Irani\n" +
"Warlock 3: The End of Innocence\t/film/film\tEric Freiser\n" +
"Austin Powers: The Spy Who Shagged Me\t/film/film\tJay Roach\n" +
"Instinct\t/film/film\tJon Turtletaub\n" +
"The Thirteenth Floor\t/film/film\tJosef Rusnak\n" +
"Children of the Corn 666: Isaac\'s Return\t/film/film\tKari Skogland\n" +
"Above the Law\t/film/film\tAndrew Davis\n" +
"Absence of Malice\t/film/film\tSydney Pollack\n" +
"Fitzcarraldo\t/film/film\tWerner Herzog\n" +
"Hum Dil De Chuke Sanam\t/film/film\tSanjay Leela Bhansali\n" +
"Pink Floyd: The Wall\t/film/film\tAlan Parker\n" +
"Salaakhen\t/film/film\t\n" +
"Metallica: Cliff \'Em All\t/film/film\tJean Pellerin\n" +
"Metallica: A Year and a Half in the Life of Metallica #1\t/film/film\tAdam Dubin\n" +
"Yudh\t/film/film\t\n" +
"The Addams Family\t/film/film\tBarry Sonnenfeld\n" +
"Addicted to Love\t/film/film\tGriffin Dunne\n" +
"The General\t/film/film\tBuster Keaton\n" +
"Sakura Wars\t/film/film\t\n" +
"Friends & Lovers\t/film/film\tGeorge Haas\n" +
"Resurrection\t/film/film\tRussell Mulcahy\n" +
"Saving Private Ryan\t/film/film\tSteven Spielberg\n" +
"Bartok the Magnificent\t/film/film\tDon Bluth\n" +
"Grand Illusion\t/film/film\tJean Renoir\n" +
"Puppet Master\t/film/film\tDavid Schmoeller\n" +
"The Adventures of Baron Munchausen\t/film/film\tTerry Gilliam\n" +
"Entrapment\t/film/film\tJon Amiel\n" +
"Heavy Metal\t/film/film\tGerald Potterton\n" +
"Drop Dead Gorgeous\t/film/film\tMichael Patrick Jann\n" +
"American Pie\t/film/film\tPaul Weitz\n" +
"Teaching Mrs. Tingle\t/film/film\tKevin Williamson\n" +
"Summer of Sam\t/film/film\tSpike Lee\n" +
"GoldenEye\t/film/film\tMartin Campbell\n" +
"Death Rides a Horse\t/film/film\tGiulio Petroni\n" +
"Darkside Blues\t/film/film\t\n" +
"The Love Letter\t/film/film\tPeter Ho-Sun Chan\n" +
"Killer Condom\t/film/film\tMartin Walz\n" +
"Led Zeppelin: The Song Remains the Same\t/film/film\tJoe Massot\n" +
"The Adventures of Pinocchio\t/film/film\tSteve Barron\n" +
"Boiling Point\t/film/film\tTakeshi \"Beat\" Kitano\n" +
"Everest: IMAX\t/film/film\tGreg Mac Gillivray\n" +
"Top of the World\t/film/film\tSidney J. Furie\n" +
"Trippin\'\t/film/film\tDavid Raynr\n" +
"Black Sunday\t/film/film\tMario Bava\n" +
"Corrina, Corrina\t/film/film\tJessie Nelson\n" +
"The General\'s Daughter\t/film/film\tSimon West\n" +
"Now and Then\t/film/film\tLesli Linka Glatter\n" +
"Rogue Trader\t/film/film\tJames Dearden\n" +
"Run Lola Run\t/film/film\tTom Tykwer\n" +
"Lake Placid\t/film/film\tSteve Miner\n" +
"Great Expectations\t/film/film\tAlfonso Cuar\u00F3n\n" +
"The Thomas Crown Affair\t/film/film\tJohn McTiernan\n" +
"Wind in the Willows\t/film/film\t\n" +
"Aaye Din Bahaar Ke\t/film/film\tRaghunath Jhalani\n" +
"Desh Premee\t/film/film\tManmohan Desai\n" +
"Henna\t/film/film\t\n" +
"Hindustan Ki Kasam\t/film/film\tVeeru Devgan\n" +
"Purab Aur Pachhim\t/film/film\t\n" +
"Vaastav\t/film/film\t\n" +
"Clean, Shaven\t/film/film\tLodge Kerrigan\n" +
"Universal Soldier: The Return\t/film/film\tMic Rodgers\n" +
"Dudley Do-Right\t/film/film\tHugh Wilson\n" +
"Stir of Echoes\t/film/film\tDavid Koepp\n" +
"Limbo\t/film/film\tJohn Sayles\n" +
"An Affair to Remember\t/film/film\tLeo McCarey\n" +
"Against All Odds\t/film/film\tTaylor Hackford\n" +
"Air America\t/film/film\tRoger Spottiswoode\n" +
"Alaap\t/film/film\tHrishikesh Mukherjee\n" +
"Achanak\t/film/film\tNaresh Malhotra\n" +
"Asli Naqli\t/film/film\tHrishikesh Mukherjee\n" +
"Alexander Nevsky\t/film/film\tD.I. Vassiliev\n" +
"Dostana\t/film/film\tRaj Khosla\n" +
"Himmat\t/film/film\tSunil Sharma\n" +
"Jeet\t/film/film\tRaj Kanwar\n" +
"Koshish\t/film/film\tGulzar\n" +
"Mehndi\t/film/film\t\n" +
"Mohra\t/film/film\tRajiv Rai\n" +
"Nikaah\t/film/film\tB. R. Chopra\n" +
"Ram Jaane\t/film/film\tRajiv Mehra\n" +
"Menno\'s Mind\t/film/film\tJon Kroll\n" +
"All About Ah-Long\t/film/film\tJohnny To\n" +
"All About Eve\t/film/film\tJoseph L. Mankiewicz\n" +
"All Quiet on the Western Front\t/film/film\tLewis Milestone\n" +
"All the President\'s Men\t/film/film\tAlan J. Pakula\n" +
"Altered States\t/film/film\tKen Russell\n" +
"Alvarez Kelly\t/film/film\tEdward Dmytryk\n" +
"Always\t/film/film\tSteven Spielberg\n" +
"Amar Akbar Anthony\t/film/film\tManmohan Desai\n" +
"The Big Brass Ring\t/film/film\tGeorge Hickenlooper\n" +
"College\t/film/film\tJames W. Horne\n" +
"Flash Gordon: Space Soldiers\t/film/film\tFrederick Stephani\n" +
"The Saphead\t/film/film\tHerbert Blanche\n" +
"Seven Chances\t/film/film\tBuster Keaton\n" +
"American Flyers\t/film/film\tJohn Badham\n" +
"An American in Paris\t/film/film\tVincente Minnelli\n" +
"American Pop\t/film/film\tRalph Bakshi\n" +
"The American President\t/film/film\tRob Reiner\n" +
"Runaway Bride\t/film/film\tGarry Marshall\n" +
"Andrei Rublev\t/film/film\tAndrei Tarkovsky\n" +
"Angel and the Badman\t/film/film\tJames Edward Grant\n" +
"Crazy in Alabama\t/film/film\tAntonio Banderas\n" +
"The Story of Us\t/film/film\tRob Reiner\n" +
"Grey Owl\t/film/film\tRichard Attenborough\n" +
"One Man\'s Hero\t/film/film\tLance Hool\n" +
"The Astronaut\'s Wife\t/film/film\tRand Ravich\n" +
"The Muse\t/film/film\tAlbert Brooks\n" +
"Aatish\t/film/film\tAmbarish Sangal\n" +
"Annie Hall\t/film/film\tWoody Allen\n" +
"The Wood\t/film/film\tRick Famuyiwa\n" +
"Roti Kapada Aur Makaan\t/film/film\tManoj Kumar\n" +
"Another Man\'s Poison\t/film/film\tIrving Rapper\n" +
"B.U.S.T.E.D.\t/film/film\t\n" +
"Annamalai\t/film/film\tSuresh Krishna\n" +
"Seema\t/film/film\tAmiya Chakravarty\n" +
"Dogma\t/film/film\tKevin Smith\n" +
"All About My Mother\t/film/film\tPedro Almod\u00F3var\n" +
"An Autumn\'s Tale\t/film/film\tMabel Cheung\n" +
"Butch Cassidy and the Sundance Kid\t/film/film\tGeorge Roy Hill\n" +
"Trick\t/film/film\tJim Fall\n" +
"To Sir, with Love\t/film/film\tJames Clavell\n" +
"As You Like It\t/film/film\tPaul Czinner\n" +
"Jazz on a Summer\'s Day\t/film/film\tBert Stern\n" +
"Godzilla vs. Destroyah / Godzilla vs. Space Godzilla Double Feature\t/film/film\tKensho Yamashita\n" +
"Love and Death on Long Island\t/film/film\tRichard Kwietniowski\n" +
"Richard III\t/film/film\tRichard Loncraine\n" +
"Introducing Dorothy Dandridge\t/film/film\t\n" +
"Assassins\t/film/film\tRichard Donner\n" +
"187\t/film/film\tKevin Reynolds\n" +
"Blood Feast\t/film/film\tHerschell Gordon Lewis\n" +
"Color Me Blood Red\t/film/film\tHerschell Gordon Lewis\n" +
"Emmanuelle 5\t/film/film\t\n" +
"The Associate\t/film/film\tDonald Petrie\n" +
"Best Laid Plans\t/film/film\t\n" +
"Atomic Submarine\t/film/film\tSpencer Gordon Bennet\n" +
"Autopsy\t/film/film\tArmando Crispino\n" +
"Awakenings\t/film/film\tPenny Marshall\n" +
"Bad Boys\t/film/film\tMichael Bay\n" +
"Mann\t/film/film\tIndra Kumar\n" +
"Boys Don\'t Cry\t/film/film\tKimberly Peirce\n" +
"Music of the Heart\t/film/film\tWes Craven\n" +
"Hillbillys in a Haunted House\t/film/film\tJean Yarbrough\n" +
"Arunachalam\t/film/film\tC. Sundar\n" +
"Retro Puppet Master\t/film/film\tDavid DeCoteau\n" +
"The Trial\t/film/film\tOrson Welles\n" +
"Who\'s Harry Crumb?\t/film/film\tPaul Flaherty\n" +
"The Bone Collector\t/film/film\tPhillip Noyce\n" +
"The Magical Legend of the Leprechauns\t/film/film\t\n" +
"The Prophecy 3: The Ascent\t/film/film\tPatrick Lussier\n" +
"Storm Riders\t/film/film\tAndrew Lau\n" +
"Hot Boyz\t/film/film\tMaster P\n" +
"Victor / Victoria\t/film/film\tBlake Edwards\n" +
"Carnosaur 2\t/film/film\t\n" +
"Three to Tango\t/film/film\tDamon Santostefano\n" +
"The Bachelor\t/film/film\tGary Sinyor\n" +
"End of Days\t/film/film\tPeter Hyams\n" +
"The Audrey Hepburn Story\t/film/film\tSteve Robman\n" +
"The Slipper and the Rose\t/film/film\tBryan Forbes\n" +
"RKO 281\t/film/film\tBenjamin Ross\n" +
"Ball of Fire\t/film/film\tHoward Hawks\n" +
"La Bamba\t/film/film\tLuis Valdez\n" +
"Baraka\t/film/film\tRon Fricke\n" +
"Being John Malkovich\t/film/film\tSpike Jonze\n" +
"Cradle Will Rock\t/film/film\tTim Robbins\n" +
"Galaxy Quest\t/film/film\tDean Parisot\n" +
"The Man with the Golden Gun\t/film/film\tGuy Hamilton\n" +
"The World Is Not Enough\t/film/film\tMichael Apted\n" +
"Barefoot in the Park\t/film/film\tGene Saks\n" +
"Barsaat\t/film/film\tRaj Kumar Santoshi\n" +
"Basic Instinct\t/film/film\tPaul Verhoeven\n" +
"On Her Majesty\'s Secret Service\t/film/film\tPeter Hunt\n" +
"Patita\t/film/film\tAmiya Chakravarthy\n" +
"Princess Mononoke\t/film/film\tHayao Miyazaki\n" +
"Best of the Best 3 & 4\t/film/film\tPhillip Rhee\n" +
"Cleo from 5 to 7\t/film/film\tAgn\u00E8s Varda\n" +
"Stuart Little\t/film/film\tRob Minkoff\n" +
"Superstar\t/film/film\tBruce McCulloch\n" +
"Fist of Legend\t/film/film\tGordon Chan\n" +
"For Love of the Game\t/film/film\tSam Raimi\n" +
"The Fox and the Hound\t/film/film\tRichard Rich\n" +
"The Basketball Diaries\t/film/film\tScott Kalvert\n" +
"Battling Butler\t/film/film\tBuster Keaton\n" +
"The Bear\t/film/film\tJean-Jacques Annaud\n" +
"Beavis and Butt-head Do America\t/film/film\tMike Judge\n" +
"Bed of Roses\t/film/film\tMichael Goldenberg\n" +
"Beethoven\'s 2nd\t/film/film\tRod Daniel\n" +
"Before Sunrise\t/film/film\tRichard Linklater\n" +
"Bell, Book and Candle\t/film/film\tRichard Quine\n" +
"The Bells of St. Mary\'s\t/film/film\tLeo McCarey\n" +
"Benji\t/film/film\tJoe Camp\n" +
"Berlin: Symphony of a Great City / Opus 1\t/film/film\tWalter Ruttmann\n" +
"The Best of Times\t/film/film\tRoger Spottiswoode\n" +
"Big\t/film/film\tPenny Marshall\n" +
"Big Bad Mama\t/film/film\tSteve Carver\n" +
"Big Night\t/film/film\tStanley Tucci\n" +
"The Big Trees\t/film/film\tFelix Feist\n" +
"The Birdcage\t/film/film\tMike Nichols\n" +
"Birdy\t/film/film\tAlan Parker\n" +
"The Black Hole\t/film/film\tGary Nelson\n" +
"The Black Pirate\t/film/film\tAlbert Parker\n" +
"Black Rain\t/film/film\tRidley Scott\n" +
"Blood on the Sun\t/film/film\tFrank Lloyd\n" +
"Blown Away\t/film/film\tStephen Hopkins\n" +
"The Blue Gardenia\t/film/film\tFritz Lang\n" +
"Blue Thunder\t/film/film\tJohn Badham\n" +
"Blue Velvet\t/film/film\tDavid Lynch\n" +
"Body Snatchers\t/film/film\tAbel Ferrara\n" +
"The Bodyguard\t/film/film\tMick Jackson\n" +
"Boiling Point\t/film/film\tJames B. Harris\n" +
"Born in East L.A.\t/film/film\tCheech Marin\n" +
"Box of Moonlight\t/film/film\tTom DiCillo\n" +
"The Boys from Brazil\t/film/film\tFranklin J. Schaffner\n" +
"Boys on the Side\t/film/film\tHerbert Ross\n" +
"The Brain That Wouldn\'t Die\t/film/film\tJoseph Green\n" +
"Brainstorm\t/film/film\tDouglas Trumbull\n" +
"Brassed Off\t/film/film\tMark Herman\n" +
"Breakfast at Tiffany\'s\t/film/film\tBlake Edwards\n" +
"The Breakfast Club\t/film/film\tJohn Hughes\n" +
"Breathless\t/film/film\tJim McBride\n" +
"Brewster\'s Millions\t/film/film\tWalter Hill\n" +
"The Bridge at Remagen\t/film/film\tJohn Guillermin\n" +
"The Bridge of San Luis Rey\t/film/film\tRowland V. Lee\n" +
"The Bridges of Madison County\t/film/film\tClint Eastwood\n" +
"The Brute Man\t/film/film\tJean Yarbrough\n" +
"Swimming with Sharks\t/film/film\tGeorge Huang\n" +
"Bull Durham\t/film/film\tRon Shelton\n" +
"Bulletproof\t/film/film\tErnest R. Dickerson\n" +
"Bullets Over Broadway\t/film/film\tWoody Allen\n" +
"Bullitt\t/film/film\tPeter Yates\n" +
"Burglar\t/film/film\tHugh Wilson\n" +
"Bye Bye Birdie\t/film/film\tGeorge Sidney\n" +
"Caligula\t/film/film\tTinto Brass\n" +
"Camelot\t/film/film\tJoshua Logan\n" +
"The Candidate\t/film/film\tMichael Ritchie\n" +
"Cannibal Women in the Avocado Jungle of Death\t/film/film\tJ.D. Athens\n" +
"The Cannonball Run II\t/film/film\tHal Needham\n" +
"Career Opportunities\t/film/film\tBryan Gordon\n" +
"Carlito\'s Way\t/film/film\tBrian De Palma\n" +
"Carnosaur\t/film/film\t\n" +
"The Cassandra Crossing\t/film/film\tGeorge P. Cosmatos\n" +
"Castle Freak\t/film/film\tStuart Gordon\n" +
"The Cat and the Canary\t/film/film\tPaul Leni\n" +
"The Chamber\t/film/film\tJames Foley\n" +
"Chances Are\t/film/film\tEmile Ardolino\n" +
"Child\'s Play\t/film/film\tTom Holland\n" +
"Child\'s Play 2: Chucky\'s Back\t/film/film\tJohn Lafia\n" +
"The China Syndrome\t/film/film\tJames Bridges\n" +
"Chinatown\t/film/film\tRoman Polanski\n" +
"City Hunter\t/film/film\tJing Wong\n" +
"The Clan of the Cave Bear\t/film/film\tMichael Chapman\n" +
"National Lampoon\'s Class Reunion\t/film/film\tMichael Miller\n" +
"Clean and Sober\t/film/film\tGlenn Gordon Caron\n" +
"Clear and Present Danger\t/film/film\tPhillip Noyce\n" +
"The Client\t/film/film\tJoel Schumacher\n" +
"Cliffhanger\t/film/film\tRenny Harlin\n" +
"Clockers\t/film/film\tSpike Lee\n" +
"Clueless\t/film/film\tAmy Heckerling\n" +
"Cobra\t/film/film\tGeorge P. Cosmatos\n" +
"The Cocoanuts\t/film/film\tJoseph Santley\n" +
"Coma\t/film/film\tMichael Crichton\n" +
"Combat Shock\t/film/film\tBuddy Giovinazzo\n" +
"Come and Get It\t/film/film\tHoward Hawks\n" +
"Communion\t/film/film\tPhilippe Mora\n" +
"Congo\t/film/film\tFrank Marshall\n" +
"Cool Hand Luke\t/film/film\tStuart Rosenberg\n" +
"Cooley High\t/film/film\tMichael Schultz\n" +
"Copycat\t/film/film\tJon Amiel\n" +
"Corridors of Blood\t/film/film\tRobert Day\n" +
"Corrupt\t/film/film\tAlbert Pyun\n" +
"The Court Jester\t/film/film\tNorman Panama\n" +
"The Cowboy Way\t/film/film\tGregg Champion\n" +
"The Cowboys\t/film/film\tMark Rydell\n" +
"The Craft\t/film/film\tAndrew Fleming\n" +
"Creator\t/film/film\tIvan Passer\n" +
"Phenomena\t/film/film\tDario Argento\n" +
"Creepshow\t/film/film\tGeorge A. Romero\n" +
"Crimson Tide\t/film/film\tTony Scott\n" +
"Crooklyn\t/film/film\tSpike Lee\n" +
"The Crow: City of Angels\t/film/film\tTim Pope\n" +
"The Crush\t/film/film\tAlan Shapiro\n" +
"Cry Freedom\t/film/film\tRichard Attenborough\n" +
"Cry Uncle\t/film/film\tJohn G. Avildsen\n" +
"Cutthroat Island\t/film/film\tRenny Harlin\n" +
"Cyborg\t/film/film\tAlbert Pyun\n" +
"Daddy Long Legs\t/film/film\tMarshall Neilan\n" +
"Dancing in the Dark\t/film/film\tBill Corcoran\n" +
"Dangerous Liaisons\t/film/film\tStephen Frears\n" +
"The Dark Crystal\t/film/film\tFrank Oz\n" +
"The Dark Half\t/film/film\tGeorge A. Romero\n" +
"Day of the Animals\t/film/film\tWilliam Girdler\n" +
"The Day of the Jackal\t/film/film\tFred Zinnemann\n" +
"Days of Thunder\t/film/film\tTony Scott\n" +
"Dead Calm\t/film/film\tPhillip Noyce\n" +
"Dead Man Walking\t/film/film\tTim Robbins\n" +
"Dead Men Don\'t Wear Plaid\t/film/film\tCarl Reiner\n" +
"Dead Presidents\t/film/film\tAlbert Hughes\n" +
"Death Becomes Her\t/film/film\tRobert Zemeckis\n" +
"Death Race 2000\t/film/film\tPaul Bartel\n" +
"The Decameron\t/film/film\tPier Paolo Pasolini\n" +
"Deep Cover\t/film/film\tBill Duke\n" +
"Def by Temptation\t/film/film\tJames Bond III\n" +
"Deliverance\t/film/film\tJohn Boorman\n" +
"Demon City Shinjuku\t/film/film\t\n" +
"Dentist\t/film/film\tBrian Yuzna\n" +
"Destination Moon\t/film/film\tIrving Pichel\n" +
"Devil Girl from Mars\t/film/film\tDavid MacDonald\n" +
"Devil in a Blue Dress\t/film/film\tCarl Franklin\n" +
"The Devil\'s Rain\t/film/film\tRobert Feust\n" +
"The Dirty Dozen\t/film/film\tRobert Aldrich\n" +
"Disclosure\t/film/film\tBarry Levinson\n" +
"Dixiana\t/film/film\tLuther Reed\n" +
"Dolores Claiborne\t/film/film\tTaylor Hackford\n" +
"Don Juan De Marco\t/film/film\tJeremy Leven\n" +
"Don\'s Party\t/film/film\tBruce Beresford\n" +
"Don\'t Touch the White Woman!\t/film/film\tMarco Ferreri\n" +
"The Doors\t/film/film\tOliver Stone\n" +
"Dr. No\t/film/film\tTerence Young\n" +
"Dracula\t/film/film\tJohn Badham\n" +
"Dragnet\t/film/film\tTom Mankiewicz\n" +
"Drive\t/film/film\tSteve Wang\n" +
"Driving Miss Daisy\t/film/film\tBruce Beresford\n" +
"Dune\t/film/film\tDavid Lynch\n" +
"Eastern Condors\t/film/film\tSammo Hung Kam-Bo\n" +
"Easy Rider\t/film/film\tDennis Hopper\n" +
"Ebony, Ivory & Jade\t/film/film\tCirio H. Santiago\n" +
"Eddie\t/film/film\tSteve Rash\n" +
"The Eiger Sanction\t/film/film\tClint Eastwood\n" +
"El Dorado\t/film/film\tHoward Hawks\n" +
"The Electric Horseman\t/film/film\tSydney Pollack\n" +
"Embrace of the Vampire\t/film/film\tAnne Goursaud\n" +
"Embryo\t/film/film\t\n" +
"The English Patient\t/film/film\tAnthony Minghella\n" +
"The Englishman Who Went Up a Hill but Came Down a Mountain\t/film/film\tChristopher Monger\n" +
"Eraser\t/film/film\tCharles Russell\n" +
"Escape from Alcatraz\t/film/film\tDon Siegel\n" +
"Escape from Sobibor\t/film/film\tJack Gold\n" +
"The Exorcist 3\t/film/film\tWilliam Peter Blatty\n" +
"Extreme Measures\t/film/film\tMichael Apted\n" +
"Fahrenheit 451\t/film/film\tFran\u00E7ois Truffaut\n" +
"Fair Game\t/film/film\tAndrew Sipes\n" +
"Far and Away\t/film/film\tRon Howard\n" +
"The Farmer\'s Wife\t/film/film\tAlfred Hitchcock\n" +
"Father of the Bride\t/film/film\tCharles Shyer\n" +
"Fear\t/film/film\tJames Foley\n" +
"Fearless\t/film/film\tPeter Weir\n" +
"Operation Condor\t/film/film\tJackie Chan\n" +
"Ferris Bueller\'s Day Off\t/film/film\tJohn Hughes\n" +
"A Few Good Men\t/film/film\tRob Reiner\n" +
"Fiddler on the Roof\t/film/film\tNorman Jewison\n" +
"Field of Dreams\t/film/film\tPhil Alden Robinson\n" +
"The Fighting Seabees\t/film/film\tEdward Ludwig\n" +
"The First Deadly Sin\t/film/film\tBrian Hutton\n" +
"First Man Into Space\t/film/film\tRobert Day\n" +
"The First Wives Club\t/film/film\tHugh Wilson\n" +
"A Fish Called Wanda\t/film/film\tCharles Crichton\n" +
"Fist of Fear, Touch of Death\t/film/film\tMatthew Mallinson\n" +
"The Flamingo Kid\t/film/film\tGarry Marshall\n" +
"Flash Gordon\t/film/film\tMike Hodges\n" +
"Flatliners\t/film/film\tJoel Schumacher\n" +
"The Flintstones\t/film/film\tBrian Levant\n" +
"For Whom the Bell Tolls\t/film/film\tSam Wood\n" +
"Forbidden Planet\t/film/film\tFred M. Wilcox\n" +
"Force 10 from Navarone\t/film/film\tGuy Hamilton\n" +
"Forever Young\t/film/film\tSteve Miner\n" +
"Frankenhooker\t/film/film\tFrank Henenlotter\n" +
"Free Willy\t/film/film\tSimon Wincer\n" +
"Freeway\t/film/film\tMatthew Bright\n" +
"French Kiss\t/film/film\tLawrence Kasdan\n" +
"Fresh\t/film/film\tBoaz Yakin\n" +
"Friday the 13th\t/film/film\tSean S. Cunningham\n" +
"Friday the 13th: Part 2\t/film/film\tSteve Miner\n" +
"Fried Green Tomatoes\t/film/film\tJon Avnet\n" +
"Fright Night\t/film/film\tTom Holland\n" +
"From Dusk Till Dawn\t/film/film\tRobert Rodriguez\n" +
"From Russia With Love\t/film/film\tTerence Young\n" +
"Full Metal Jacket\t/film/film\tStanley Kubrick\n" +
"The Funhouse\t/film/film\tTobe Hooper\n" +
"Funny Farm\t/film/film\tGeorge Roy Hill\n" +
"A Funny Thing Happened on the Way to the Forum\t/film/film\tRichard Lester\n" +
"Gallipoli\t/film/film\tPeter Weir\n" +
"Ganja & Hess\t/film/film\tBill Gunn\n" +
"The Gauntlet\t/film/film\tClint Eastwood\n" +
"Gentleman\'s Agreement\t/film/film\tElia Kazan\n" +
"Get Shorty\t/film/film\tBarry Sonnenfeld\n" +
"The Getaway\t/film/film\tSam Peckinpah\n" +
"The Getaway\t/film/film\tRoger Donaldson\n" +
"Ghost Story\t/film/film\tJohn Irvin\n" +
"Ghostbusters\t/film/film\tIvan Reitman\n" +
"Ghostbusters 2\t/film/film\tIvan Reitman\n" +
"Ghosts of Mississippi\t/film/film\tRob Reiner\n" +
"The Girl Hunters\t/film/film\tRoy Rowland\n" +
"The Glimmer Man\t/film/film\tJohn Gray\n" +
"Glory\t/film/film\tEdward Zwick\n" +
"Gold\t/film/film\tPeter Hunt\n" +
"Gravesend\t/film/film\tSalvatore Stabile\n" +
"Hard Times\t/film/film\tWalter Hill\n" +
"The Great Santini\t/film/film\tLewis John Carlino\n" +
"Groundhog Day\t/film/film\tHarold Ramis\n" +
"Guarding Tess\t/film/film\tHugh Wilson\n" +
"Blade\t/film/film\tStephen Norrington\n" +
"Armageddon\t/film/film\tMichael Bay\n" +
"Pleasantville\t/film/film\tGary Ross\n" +
"Baby Geniuses\t/film/film\tBob Clark\n" +
"The Red Violin\t/film/film\tFrancois Girard\n" +
"Apt Pupil\t/film/film\tBryan Singer\n" +
"Meet Joe Black\t/film/film\tMartin Brest\n" +
"Eyes Wide Shut\t/film/film\tStanley Kubrick\n" +
"U.S. Marshals\t/film/film\tStuart Bairo\n" +
"The Mighty\t/film/film\tPeter Chelsom\n" +
"The Horse Whisperer\t/film/film\tRobert Redford\n" +
"Chairman of the Board\t/film/film\tAlex Zamm\n" +
"Guys and Dolls\t/film/film\tJoseph L. Mankiewicz\n" +
"Gypsy\t/film/film\tMervyn LeRoy\n" +
"Hair\t/film/film\tMilos Forman\n" +
"Half a Loaf of Kung Fu\t/film/film\tChi-Hwa Chen\n" +
"Halloween\t/film/film\tJohn Carpenter\n" +
"Halloween III: Season of the Witch\t/film/film\tTommy Lee Wallace\n" +
"Halloween 4: The Return of Michael Myers\t/film/film\tDwight H. Little\n" +
"Hamburger Hill\t/film/film\tJohn Irvin\n" +
"Hang \'Em High\t/film/film\tTed Post\n" +
"Happy Go Lovely\t/film/film\tH. Bruce Humberstone\n" +
"Hard Target\t/film/film\tJohn Woo\n" +
"Hard to Kill\t/film/film\tBruce Malmuth\n" +
"The Hard Way\t/film/film\tJohn Badham\n" +
"Havana\t/film/film\tSydney Pollack\n" +
"The Heartbreak Kid\t/film/film\tElaine May\n" +
"Heaven Can Wait\t/film/film\tWarren Beatty\n" +
"Heaven\'s Gate\t/film/film\tMichael Cimino\n" +
"Heavy\t/film/film\tJames Mangold\n" +
"Henry & June\t/film/film\tPhilip Kaufman\n" +
"Hero\t/film/film\tStephen Frears\n" +
"The Hidden\t/film/film\tJack Sholder\n" +
"High Noon\t/film/film\tFred Zinnemann\n" +
"High Plains Drifter\t/film/film\tClint Eastwood\n" +
"The Hindenburg\t/film/film\tRobert Wise\n" +
"Hiroshima\t/film/film\tKoreyoshi Kurahara\n" +
"History of the World: Part 1\t/film/film\tMel Brooks\n" +
"Hocus Pocus\t/film/film\tKenny Ortega\n" +
"Homeward Bound: The Incredible Journey\t/film/film\tDuwayne Dunham\n" +
"Honeymoon in Vegas\t/film/film\tAndrew Bergman\n" +
"Il Postino\t/film/film\tMichael Radford\n" +
"The Breaks\t/film/film\tEric Meza\n" +
"Our Town\t/film/film\tSam Wood\n" +
"Bloodfist 2\t/film/film\tAndy Bluementhal\n" +
"Bloodfist 4: Die Trying\t/film/film\tPaul Ziller\n" +
"Perfect Blue\t/film/film\tSatoshi Kon\n" +
"The End of the Affair\t/film/film\tNeil Jordan\n" +
"Virtual Sexuality\t/film/film\tNick Hurran\n" +
"Things Change\t/film/film\tDavid Mamet\n" +
"The Guns of Navarone\t/film/film\tJ. Lee Thompson\n" +
"Blue Hawaii\t/film/film\tNorman Taurog\n" +
"Roustabout\t/film/film\tJohn Rich\n" +
"The Endless Summer\t/film/film\tBruce Brown\n" +
"The Gore Gore Girls: Special Edition\t/film/film\tHerschell Gordon Lewis\n" +
"The Story of G.I. Joe\t/film/film\tWilliam A. Wellman\n" +
"Visions of Light\t/film/film\tTodd McCarthy\n" +
"Surf Crazy\t/film/film\t\n" +
"Drowning Mona\t/film/film\tNick Gomez\n" +
"The Next Best Thing\t/film/film\tJohn Schlesinger\n" +
"The Whole Nine Yards\t/film/film\tJonathan Lynn\n" +
"What Planet Are You From?\t/film/film\tMike Nichols\n" +
"High Fidelity\t/film/film\tStephen Frears\n" +
"The Road to El Dorado\t/film/film\tDon Paul\n" +
"Rules of Engagement\t/film/film\tWilliam Friedkin\n" +
"The Beach\t/film/film\tDanny Boyle\n" +
"Sleepy Hollow\t/film/film\tTim Burton\n" +
"The Talented Mr. Ripley\t/film/film\tAnthony Minghella\n" +
"The Firm\t/film/film\tSydney Pollack\n" +
"Drunken Master\t/film/film\tYuen Woo Ping\n" +
"Good Times\t/film/film\tWilliam Friedkin\n" +
"White Zombie\t/film/film\t\n" +
"Desperately Seeking Susan\t/film/film\tSusan Seidelman\n" +
"Married to the Mob\t/film/film\tJonathan Demme\n" +
"F/X 2\t/film/film\tRichard Franklin\n" +
"Missing in Action\t/film/film\tJoseph Zito\n" +
"Switchblade Sisters\t/film/film\tJack Hill\n" +
"Parting Glances\t/film/film\tBill Sherwood\n" +
"The Architecture of Doom\t/film/film\tPeter Cohen\n" +
"The Abyss\t/film/film\tJames Cameron\n" +
"The Tempest\t/film/film\tDerek Jarman\n" +
"The Ten Commandments\t/film/film\tCecil B. DeMille\n" +
"The Omega Code\t/film/film\tRobert Marcarelli\n" +
"Romeo is Bleeding\t/film/film\tPeter Medak\n" +
"River\'s Edge\t/film/film\tTim Hunter\n" +
"Pyaasa Sawan\t/film/film\tNarayana Rao Dasari\n" +
"Baazi\t/film/film\tGuru Dutt\n" +
"Aakraman\t/film/film\tJ. Om Prakash\n" +
"Naya Daur\t/film/film\tB.R. Chopra\n" +
"Ek Nai Paheli\t/film/film\tK. Balachander\n" +
"Anmol\t/film/film\tKetan Desai\n" +
"Final Destination\t/film/film\tJames Wong\n" +
"Holy Smoke\t/film/film\tJane Campion\n" +
"Rear Window\t/film/film\tAlfred Hitchcock\n" +
"Paigham\t/film/film\t\n" +
"Half Ticket\t/film/film\tKalidas\n" +
"American Beauty\t/film/film\tSam Mendes\n" +
"Snow Day\t/film/film\tChris Koch\n" +
"The Cider House Rules\t/film/film\tLasse Hallstr\u00F6m\n" +
"A Map of the World\t/film/film\tScott Elliott\n" +
"Pitch Black\t/film/film\tDavid Twohy\n" +
"3 Strikes\t/film/film\tD.J. Pooh\n" +
"The Emperor and the Assassin\t/film/film\tKaige Chen\n" +
"The Hurricane\t/film/film\tNorman Jewison\n" +
"Dolphins: IMAX\t/film/film\tGreg MacGillivray\n" +
"Any Given Sunday\t/film/film\tOliver Stone\n" +
"Ghost Dog: The Way of the Samurai\t/film/film\tJim Jarmusch\n" +
"Fantasia 2000\t/film/film\tGaetan Brizzi\n" +
"Anna and the King\t/film/film\tAndy Tennant\n" +
"The Third Miracle\t/film/film\tAgnieszka Holland\n" +
"The War Zone\t/film/film\tTim Roth\n" +
"Liberty Heights\t/film/film\tBarry Levinson\n" +
"The Terrorist\t/film/film\tSantosh Sivan\n" +
"The Life and Times of Hank Greenberg\t/film/film\tAviva Kempner\n" +
"Rosetta\t/film/film\tLuc Dardenne\n" +
"Kadosh\t/film/film\tAmos Gitai\n" +
"Isn\'t She Great\t/film/film\tAndrew Bergman\n" +
"Ride with the Devil\t/film/film\tAng Lee\n" +
"All I Wanna Do\t/film/film\tSarah Kernochan\n" +
"Man on the Moon\t/film/film\tMilos Forman\n" +
"Love 101\t/film/film\tAdrian Fulle\n" +
"My Best Fiend: Klaus Kinski\t/film/film\tWerner Herzog\n" +
"Man of the Century\t/film/film\tAdam Abraham\n" +
"Cosmic Voyage: IMAX\t/film/film\tBayley Silleck\n" +
"The Dream Is Alive: IMAX\t/film/film\tGraeme Ferguson\n" +
"Planet of the Apes\t/film/film\tFranklin J. Schaffner\n" +
"Braveheart\t/film/film\tMel Gibson\n" +
"North by Northwest\t/film/film\tAlfred Hitchcock\n" +
"Please Not Now!\t/film/film\tRoger Vadim\n" +
"The Goonies\t/film/film\tRichard Donner\n" +
"Grease\t/film/film\tRandal Kleiser\n" +
"Speaking in Strings: Nadja Salerno-Sonnenberg\t/film/film\tPaola Di Florio\n" +
"Harold and Maude\t/film/film\tHal Ashby\n" +
"Citizen Kane\t/film/film\tOrson Welles\n" +
"The Filth and the Fury: A Sex Pistols Film\t/film/film\tJulien Temple\n" +
"Dark Passage\t/film/film\tDelmer Daves\n" +
"Fireworks\t/film/film\tTakeshi \"Beat\" Kitano\n" +
"Safe\t/film/film\tTodd Haynes\n" +
"Chungking Express\t/film/film\tKar Wai Wong\n" +
"Sonatine\t/film/film\tTakeshi \"Beat\" Kitano\n" +
"Spectres of the Spectrum\t/film/film\tCraig Baldwin\n" +
"The Duke\t/film/film\tPhilip Spink\n" +
"Contempt\t/film/film\tJean-Luc Godard\n" +
"Live Flesh\t/film/film\tPedro Almod\u00F3var\n" +
"Pandora\'s Box\t/film/film\tGeorg Wilhelm Pabst\n" +
"Destiny\t/film/film\tFritz Lang\n" +
"Mississippi Mermaid\t/film/film\tFran\u00E7ois Truffaut\n" +
"Julien Donkey-Boy\t/film/film\tHarmony Korine\n" +
"Simpatico\t/film/film\tMatthew Warchus\n" +
"Beau Travail\t/film/film\tClaire Denis\n" +
"The Last September\t/film/film\tDeborah Warner\n" +
"Delicatessen\t/film/film\tJean-Pierre Jeunet\n" +
"Mother Kusters Goes to Heaven\t/film/film\tRainer Werner Fassbinder\n" +
"On the Waterfront\t/film/film\tElia Kazan\n" +
"Playtime\t/film/film\tJacques Tati\n" +
"The Skulls\t/film/film\tRob Cohen\n" +
"Phir Bhi Dil Hai Hindustani\t/film/film\tAziz Mirza\n" +
"Forrest Gump\t/film/film\tRobert Zemeckis\n" +
"Bill & Ted\'s Excellent Adventure\t/film/film\tStephen Herek";