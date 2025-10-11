const avatar = (url) => `${url}&auto=format&fit=crop&w=240&h=240&q=80`;

const familyMembers = [
  {
    id: 'jordan',
    name: 'Jordan Lee',
    relation: 'You',
    tagline: 'Curator of family stories and keeper of the weekly video call.',
    generation: 2,
    location: 'Portland, Oregon',
    avatarUrl: avatar('https://images.unsplash.com/photo-1544723795-3fb6469f5b39'),
    children: ['mia', 'noah'],
    parents: ['evelyn', 'marcus'],
    partners: ['skylar'],
    highlights: ['Planning the annual reunion playlist', 'Collecting recipes from every branch']
  },
  {
    id: 'skylar',
    name: 'Skylar Lee',
    relation: 'Partner',
    tagline: 'Warm storyteller who never forgets a birthday.',
    generation: 2,
    location: 'Portland, Oregon',
    avatarUrl: avatar('https://images.unsplash.com/photo-1524504388940-b1c1722653e1'),
    children: ['mia', 'noah'],
    parents: [],
    partners: ['jordan'],
    highlights: ['Handwritten notes tucked into lunch boxes', 'Captures candid photos at every gathering']
  },
  {
    id: 'mia',
    name: 'Mia Lee',
    relation: 'Daughter',
    tagline: 'Aspiring painter who sketches every family adventure.',
    generation: 3,
    location: 'Portland, Oregon',
    avatarUrl: avatar('https://images.unsplash.com/photo-1524504388940-b1c1722653e1'),
    children: [],
    parents: ['jordan', 'skylar'],
    highlights: ['Won the community art fair 2023'],
    siblings: ['noah']
  },
  {
    id: 'noah',
    name: 'Noah Lee',
    relation: 'Son',
    tagline: 'Future naturalist who knows every trail story.',
    generation: 3,
    location: 'Portland, Oregon',
    avatarUrl: avatar('https://images.unsplash.com/photo-1524504388940-b1c1722653e1'),
    children: [],
    parents: ['jordan', 'skylar'],
    highlights: ['Scouted the best picnic spot by the river'],
    siblings: ['mia']
  },
  {
    id: 'evelyn',
    name: 'Evelyn Hart',
    relation: 'Mother',
    tagline: 'Keeper of the handwritten recipe box.',
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
    tagline: 'Storyteller who never misses a school concert.',
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
    id: 'amelia',
    name: 'Amelia Hart',
    relation: 'Sister',
    tagline: 'Neighborhood organizer and bringer of fresh flowers.',
    generation: 2,
    location: 'San Diego, California',
    avatarUrl: avatar('https://images.unsplash.com/photo-1524504388940-b1c1722653e1'),
    children: ['ella'],
    parents: ['evelyn', 'marcus'],
    partners: ['rafael'],
    highlights: ['Launched the “letters to Nana” tradition'],
    siblings: ['jordan']
  },
  {
    id: 'rafael',
    name: 'Rafael Ortiz',
    relation: 'Brother-in-law',
    tagline: 'Resident barista of every family breakfast.',
    generation: 2,
    location: 'San Diego, California',
    avatarUrl: avatar('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'),
    children: ['ella'],
    partners: ['amelia'],
    highlights: ['Brought the espresso cart to the last reunion']
  },
  {
    id: 'ella',
    name: 'Ella Ortiz',
    relation: 'Niece',
    tagline: 'Tiny dancer who choreographs cousins night in.',
    generation: 3,
    location: 'San Diego, California',
    avatarUrl: avatar('https://images.unsplash.com/photo-1524504388940-b1c1722653e1'),
    children: [],
    parents: ['amelia', 'rafael'],
    highlights: ['Started the "story dice" game']
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
    title: 'Sunday soup and story swap',
    description:
      'Ruth guided everyone through the new soup recipe while Samuel pulled out postcards from his travels. Jordan streamed it so the cousins could cook along from their kitchens.',
    date: 'February 18, 2024',
    coverUrl: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=1200&q=80',
    people: ['ruth', 'samuel', 'evelyn', 'jordan', 'amelia'],
    tags: ['Tradition', 'Food'],
    mediaType: 'video call'
  },
  {
    id: 'mem-002',
    title: 'Mia’s riverside gallery',
    description:
      'A sunny afternoon turned into a family art walk as Mia lined the riverside path with fresh watercolor prints. Skylar captured candid smiles while Noah narrated each piece.',
    date: 'April 6, 2024',
    coverUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    people: ['mia', 'jordan', 'skylar', 'noah'],
    tags: ['Creativity', 'Outdoors'],
    mediaType: 'photos'
  },
  {
    id: 'mem-003',
    title: 'Reunion brunch under the jacarandas',
    description:
      'Amelia organized a relaxed brunch with Rafael’s espresso cart humming in the background. Ella surprised the grandparents with a new dance inspired by Ruth’s quilt.',
    date: 'June 22, 2024',
    coverUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    people: ['amelia', 'rafael', 'ella', 'jordan', 'evelyn', 'marcus'],
    tags: ['Celebration', 'Dance'],
    mediaType: 'photos'
  },
  {
    id: 'mem-004',
    title: 'Grandparents’ audio letters',
    description:
      'Ada and Leon recorded a jazz-backed audio letter about their first apartment. Jordan edited the stories into a keepsake track for the younger generation.',
    date: 'August 14, 2023',
    coverUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
    people: ['ada', 'leon', 'jordan'],
    tags: ['Legacy', 'Audio'],
    mediaType: 'audio'
  },
  {
    id: 'mem-005',
    title: 'Trail clean-up and picnic stories',
    description:
      'Noah led the cousins through a morning clean-up on the Pine Ridge trail. Everyone contributed a favorite trail memory over a picnic spread planned by Skylar.',
    date: 'September 10, 2024',
    coverUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    people: ['noah', 'mia', 'skylar', 'jordan', 'ella'],
    tags: ['Nature', 'Service'],
    mediaType: 'photos'
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

