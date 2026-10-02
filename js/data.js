/* =========================================================
   NewJeans fan page - data
   All facts are public and verifiable (see README sources).
   Photos live in assets/photos/. This file is the single
   source of truth the page reads.
   ========================================================= */

var NJ = {
  group: {
    name: 'NewJeans',
    hangul: '뉴진스',
    label: 'ADOR',
    debut: 'July 22, 2022',
    debutSingle: 'Attention',
    fandom: 'Bunnies',
    tagline: 'A timeless new generation of pop.',
    intro:
      'NewJeans is a South Korean girl group under ADOR. They are known for a "girl next door" image and a sound that recalls 1990s and 2000s R&B and pop. The name plays on "new genes": a new generation of pop music.'
  },

  // Members, in the officially listed order. All facts are public (kprofiles / Wikipedia).
  // Danielle's ADOR contract ended on 29 Dec 2025, so she is listed as a former member.
  members: [
    {
      id: 'minji',
      name: 'Minji',
      full: 'Kim Min-ji',
      hangul: '민지',
      role: 'Rapper',
      status: 'Member',
      born: '2004',
      birthday: 'May 7, 2004',
      from: 'Chuncheon, South Korea',
      tone: '#8cc6ff',
      emoji: '🧸',
      blurb: 'The group’s eldest, its de facto leader, and the voice that usually opens a NewJeans rap.',
      bio: 'Kim Min-ji trained at Source Music before joining ADOR, and appeared with Hanni in BTS’s 2021 "Permission to Dance" video before debut. NewJeans released their first single on 22 July 2022.',
      facts: [
        ['Position', 'Rapper'],
        ['Birthday', 'May 7, 2004'],
        ['Nationality', 'Korean'],
        ['Height', '169 cm'],
        ['MBTI', 'ESTJ'],
        ['Colour', 'Blue']
      ],
      photo: 'MINJI-12.png'
    },
    {
      id: 'hanni',
      name: 'Hanni',
      full: 'Hanni Pham',
      hangul: '하니',
      role: 'Vocalist',
      status: 'Member',
      born: '2004',
      birthday: 'October 6, 2004',
      from: 'Melbourne, Australia',
      tone: '#b7e46a',
      emoji: '🦦',
      blurb: 'Born in Vietnam and raised in Melbourne, Hanni was the only trainee from the group’s global auditions to make the final line-up.',
      bio: 'Hanni Pham danced with the Aemina Dance Crew in Melbourne before moving to Korea. She debuted with NewJeans on 22 July 2022 and is known for a bright, high vocal colour.',
      facts: [
        ['Position', 'Vocalist'],
        ['Birthday', 'October 6, 2004'],
        ['Nationality', 'Vietnamese-Australian'],
        ['Height', '160 cm'],
        ['MBTI', 'INFP'],
        ['Colour', 'Pink']
      ],
      photo: 'HANNI-12.png'
    },
    {
      id: 'danielle',
      name: 'Danielle',
      full: 'Danielle Marsh',
      hangul: '다니엘',
      role: 'Member',
      status: 'Former member',
      born: '2005',
      birthday: 'April 11, 2005',
      from: 'Newcastle, Australia',
      tone: '#ff8fc4',
      emoji: '🐶',
      blurb: 'Australian-Korean, a former child television regular, and the member whose warmth set the tone of the group’s softer songs.',
      bio: 'Danielle Marsh appeared on Korean television as a child and was a YG Entertainment trainee before joining Source Music in 2020. She debuted with NewJeans on 22 July 2022. ADOR announced the end of her contract on 29 December 2025.',
      facts: [
        ['Status', 'Former member (contract ended 29 Dec 2025)'],
        ['Birthday', 'April 11, 2005'],
        ['Nationality', 'Korean-Australian'],
        ['Height', '165 cm'],
        ['MBTI', 'ENFP'],
        ['Colour', 'Yellow']
      ],
      photo: 'DANIELLE-2.png'
    },
    {
      id: 'haerin',
      name: 'Haerin',
      full: 'Kang Hae-rin',
      hangul: '해린',
      role: 'Member',
      status: 'Member',
      born: '2006',
      birthday: 'May 15, 2006',
      from: 'Seoul, South Korea',
      tone: '#b7a6ff',
      emoji: '🐱',
      blurb: 'Street-cast, quiet on camera and sharp in the mix — Haerin’s feline look became one of the group’s most recognised images.',
      bio: 'Kang Hae-rin was street-cast and joined Source Music in early 2020. She debuted with NewJeans on 22 July 2022 and is known for a low, distinctive vocal tone and a calm, curious manner.',
      facts: [
        ['Birthday', 'May 15, 2006'],
        ['Nationality', 'Korean'],
        ['Height', '164.5 cm'],
        ['MBTI', 'INTP'],
        ['Colour', 'Green'],
        ['Emoji', '🐱']
      ],
      photo: 'HAERIN-7.png'
    },
    {
      id: 'hyein',
      name: 'Hyein',
      full: 'Lee Hye-in',
      hangul: '혜인',
      role: 'Maknae',
      status: 'Member',
      born: '2008',
      birthday: 'April 21, 2008',
      from: 'Incheon, South Korea',
      tone: '#ffc978',
      emoji: '🐹',
      blurb: 'The youngest member, and a stage veteran before she was a teenager — Hyein had already debuted in a children’s group at nine.',
      bio: 'Lee Hye-in debuted in the children’s group U.SSO Girl in 2017 under the name U.Jeong, and later joined Play With Me Club. She debuted with NewJeans on 22 July 2022 as its maknae.',
      facts: [
        ['Position', 'Maknae'],
        ['Birthday', 'April 21, 2008'],
        ['Nationality', 'Korean'],
        ['Height', '170 cm'],
        ['MBTI', 'ISFP'],
        ['Colour', 'Purple']
      ],
      photo: 'HYEIN-3.png'
    }
  ],

  // Discography. Releases are public. type: EP / Single Album / Single.
  releases: [
    { year: '2022', month: 'Jul', title: 'Attention', type: 'Single', note: 'Debut single' },
    { year: '2022', month: 'Jul', title: 'Hype Boy', type: 'Single', note: 'Longest-running K-pop female act on Billboard Global 200' },
    { year: '2022', month: 'Aug', title: 'New Jeans', type: 'EP', note: 'Debut EP' },
    { year: '2022', month: 'Dec', title: 'Ditto', type: 'Single', note: 'Pre-release single' },
    { year: '2023', month: 'Jan', title: 'OMG', type: 'Single Album', note: '' },
    { year: '2023', month: 'Jul', title: 'Get Up', type: 'EP', note: 'Reached no. 1 on the Billboard 200' },
    { year: '2023', month: 'Jul', title: 'Super Shy', type: 'Single', note: 'From the EP Get Up' },
    { year: '2023', month: 'Okt', title: 'GODS', type: 'Single', note: 'With League of Legends, Worlds 2023 anthem' },
    { year: '2024', month: 'May', title: 'How Sweet', type: 'Single', note: '' },
    { year: '2024', month: 'Jun', title: 'Supernatural', type: 'Single', note: 'Official Japanese debut' }
  ],

  // Era timeline. Each era carries a colour drawn from its own release art,
  // so the 2022 to 2024 story reads as a spectrum, not a grey list.
  eras: [
    { id: 'debut', year: '2022', title: 'New Jeans', tone: '#8cc6ff',
      blurb: 'A surprise debut with no promotion: "Attention", then "Hype Boy" and "Cookie". The EP sold a million copies and set the calm, Y2K look the group is known for.' },
    { id: 'omg', year: '2023', title: 'OMG', tone: '#b7a6ff',
      blurb: '"Ditto" and "OMG" took the winter. "Ditto" held the top of the Circle chart for thirteen weeks and became their first Billboard Hot 100 entry.' },
    { id: 'getup', year: '2023', title: 'Get Up', tone: '#ff8fc4',
      blurb: 'The second EP went to number one on the Billboard 200. "Super Shy", "ETA" and "Cool with You" all charted at once, a first for a K-pop female act.' },
    { id: 'howsweet', year: '2024', title: 'How Sweet', tone: '#b7e46a',
      blurb: 'A softer, spring-set single with B-side "Bubble Gum", before a full Japanese debut cycle began.' },
    { id: 'supernatural', year: '2024', title: 'Supernatural', tone: '#ffc978',
      blurb: 'Their official Japanese debut, with "Right Now" as its B-side, and a fan meeting at the Tokyo Dome.' }
  ]
};


/* expose for member.js and previews.js */
window.NJ = NJ;
