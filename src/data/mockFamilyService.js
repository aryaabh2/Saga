const avatar = (url) => `${url}&auto=format&fit=crop&w=240&h=240&q=80`;

const familyMembers = [
  {
    id: 'jordan',
    name: 'Jordan Lee',
    relation: 'You',
    tagline: 'Curator of family stories and host of the winter cocoa chats.',
    generation: 2,
    location: 'Portland, Oregon',
    avatarUrl: avatar('https://images.unsplash.com/photo-1544723795-3fb6469f5b39'),
    children: [],
    parents: ['evelyn', 'marcus'],
    partners: ['skylar'],
    highlights: ['Planning the winter reunion playlist', 'Collecting recipes from every branch']
  },
  {
    id: 'skylar',
    name: 'Skylar Lee',
    relation: 'Partner',
    tagline: 'Warm storyteller who strings up the festive lights first.',
    generation: 2,
    location: 'Portland, Oregon',
    avatarUrl: avatar('https://images.unsplash.com/photo-1524504388940-b1c1722653e1'),
    children: [],
    parents: [],
    partners: ['jordan'],
    highlights: ['Handwritten notes tucked into care packages', 'Captures candid photos at every gathering']
  },
  {
    id: 'amelia',
    name: 'Amelia Hart',
    relation: 'Sister',
    tagline: 'Neighborhood organizer and bringer of evergreen garlands.',
    generation: 2,
    location: 'San Diego, California',
    avatarUrl: avatar('https://images.unsplash.com/photo-1524504388940-b1c1722653e1'),
    children: [],
    parents: ['evelyn', 'marcus'],
    partners: ['rafael'],
    highlights: ['Launched the “letters to Nana” tradition'],
    siblings: ['jordan']
  },
  {
    id: 'rafael',
    name: 'Rafael Ortiz',
    relation: 'Brother-in-law',
    tagline: 'Resident barista who steams peppermint lattes for the crew.',
    generation: 2,
    location: 'San Diego, California',
    avatarUrl: avatar('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'),
    partners: ['amelia'],
    highlights: ['Brought the espresso cart to the last reunion']
  },
  {
    id: 'evelyn',
    name: 'Evelyn Hart',
    relation: 'Mother',
    tagline: 'Keeper of the handwritten recipe box and winter cider traditions.',
    generation: 1,
    location: 'Seattle, Washington',
    avatarUrl: avatar('https://images.unsplash.com/photo-1544723795-3fb6469f5b39'),
    children: ['jordan', 'amelia'],
    parents: ['ruth', 'samuel'],
    partners: ['marcus'],
    highlights: ['Hosts the Sunday soup call every winter'],
    siblings: []
  },
  {
    id: 'marcus',
    name: 'Marcus Hart',
    relation: 'Father',
    tagline: 'Storyteller who keeps the vinyl holiday records spinning.',
    generation: 1,
    location: 'Seattle, Washington',
    avatarUrl: avatar('https://images.unsplash.com/photo-1603415526960-f7e0328c63b1'),
    children: ['jordan', 'amelia'],
    parents: ['ada', 'leon'],
    partners: ['evelyn'],
    highlights: ['Keeps digitizing the family VHS tapes'],
    siblings: []
  },
  {
    id: 'ruth',
    name: 'Ruth Hart',
    relation: 'Grandmother',
    tagline: 'Keeps the family quilt growing one patch at a time.',
    generation: 0,
    location: 'Boise, Idaho',
    avatarUrl: avatar('https://images.unsplash.com/photo-1544723795-3fb6469f5b39'),
    children: ['evelyn'],
    partners: ['samuel'],
    highlights: ['Records lullabies for every new baby']
  },
  {
    id: 'samuel',
    name: 'Samuel Hart',
    relation: 'Grandfather',
    tagline: 'Archivist of the wooden photo boxes.',
    generation: 0,
    location: 'Boise, Idaho',
    avatarUrl: avatar('https://images.unsplash.com/photo-1603415526960-f7e0328c63b1'),
    children: ['evelyn'],
    partners: ['ruth'],
    highlights: ['Maps the family tree each spring']
  },
  {
    id: 'ada',
    name: 'Ada Wells',
    relation: 'Grandmother',
    tagline: 'Writes the monthly “Wells family letter.”',
    generation: 0,
    location: 'Denver, Colorado',
    avatarUrl: avatar('https://images.unsplash.com/photo-1544723795-3fb6469f5b39'),
    children: ['marcus'],
    partners: ['leon'],
    highlights: ['Hosts storytelling nights over tea']
  },
  {
    id: 'leon',
    name: 'Leon Wells',
    relation: 'Grandfather',
    tagline: 'Keeps the jazz playlists flowing during gatherings.',
    generation: 0,
    location: 'Denver, Colorado',
    avatarUrl: avatar('https://images.unsplash.com/photo-1603415526960-f7e0328c63b1'),
    children: ['marcus'],
    partners: ['ada'],
    highlights: ['Digitized the Super 8 family movies']
  }
];

const familyMemories = [
  {
    id: 'mem-001',
    title: 'Snowy soup and story swap',
    description:
      'Ruth guided everyone through a simmering pot of her winter root soup while Samuel shared postcards from snowy journeys. Jordan kept the call streaming so everyone could stir along together.',
    date: 'December 10, 2023',
    coverUrl: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=1200&q=80',
    people: ['ruth', 'samuel', 'evelyn', 'marcus', 'jordan'],
    tags: ['Tradition', 'Food'],
    mediaType: 'video call'
  },
  {
    id: 'mem-002',
    title: 'Winter lights walk downtown',
    description:
      'Jordan and Skylar surprised Amelia and Rafael with tickets to the riverfront lights walk. Between cocoa refills they swapped stories about holiday seasons past and planned the next family visit.',
    date: 'December 18, 2023',
    coverUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    people: ['jordan', 'skylar', 'amelia', 'rafael'],
    tags: ['Outdoors', 'Celebration'],
    mediaType: 'photos'
  },
  {
    id: 'mem-003',
    title: 'Evergreen wreath workshop',
    description:
      'Evelyn mailed cedar sprigs from the northwest while Amelia led the virtual wreath workshop. Rafael brewed peppermint lattes and Ruth hummed along to carols through the speaker.',
    date: 'December 3, 2023',
    coverUrl: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=1200&q=80',
    people: ['amelia', 'rafael', 'evelyn', 'ruth'],
    tags: ['Crafts', 'Tradition'],
    mediaType: 'video call'
  },
  {
    id: 'mem-004',
    title: 'Fireside audio letters',
    description:
      'Ada and Leon recorded a set of jazz-backed stories by the fireplace while Marcus digitized the tracks. Jordan added sleigh bell accents before sharing them with the rest of the family.',
    date: 'November 26, 2023',
    coverUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
    people: ['ada', 'leon', 'marcus', 'jordan'],
    tags: ['Legacy', 'Audio'],
    mediaType: 'audio'
  }
];

export async function fetchFamilySnapshot() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    members: familyMembers,
    memories: familyMemories,
    defaultMemberId: 'jordan'
  };
}

export function getMemberById(memberId) {
  return familyMembers.find((member) => member.id === memberId);
}

export function getMemoriesByPerson(memberId) {
  return familyMemories.filter((memory) => memory.people.includes(memberId));
}

export function listFamilyMembers() {
  return familyMembers;
}

export function listFamilyMemories() {
  return familyMemories;
}
