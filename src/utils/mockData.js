// Mock user data for the dating app

export const mockUsers = [
  {
    id: 1,
    name: 'Emma Johnson',
    age: 26,
    location: 'New York, NY',
    distance: 3,
    bio: 'Adventure seeker | Coffee enthusiast | Dog mom 🐕',
    occupation: 'UX Designer',
    education: 'Columbia University',
    interests: ['Travel', 'Photography', 'Yoga', 'Cooking', 'Dogs', 'Art'],
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800'
    ],
    verified: true,
    online: true
  },
  {
    id: 2,
    name: 'Alex Martinez',
    age: 28,
    location: 'Los Angeles, CA',
    distance: 5,
    bio: 'Musician by day, stargazer by night ✨',
    occupation: 'Music Producer',
    education: 'Berklee College of Music',
    interests: ['Music', 'Hiking', 'Art', 'Concerts', 'Astronomy', 'Cooking'],
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800'
    ],
    verified: true,
    online: false
  },
  {
    id: 3,
    name: 'Sophie Chen',
    age: 24,
    location: 'Miami, FL',
    distance: 2,
    bio: 'Beach lover | Fitness junkie | Always laughing 😊',
    occupation: 'Personal Trainer',
    education: 'University of Miami',
    interests: ['Surfing', 'Dancing', 'Travel', 'Food', 'Fitness', 'Yoga'],
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800'
    ],
    verified: true,
    online: true
  },
  {
    id: 4,
    name: 'Jake Williams',
    age: 29,
    location: 'Chicago, IL',
    distance: 7,
    bio: 'Tech geek with a love for the outdoors 🏔️',
    occupation: 'Software Engineer',
    education: 'MIT',
    interests: ['Coding', 'Rock Climbing', 'Gaming', 'Reading', 'Hiking', 'Coffee'],
    images: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800'
    ],
    verified: true,
    online: false
  },
  {
    id: 5,
    name: 'Maya Patel',
    age: 27,
    location: 'Seattle, WA',
    distance: 4,
    bio: 'Artist | Plant parent | Coffee snob ☕',
    occupation: 'Graphic Designer',
    education: 'Rhode Island School of Design',
    interests: ['Painting', 'Gardening', 'Pottery', 'Wine', 'Photography', 'Travel'],
    images: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'
    ],
    verified: true,
    online: true
  },
  {
    id: 6,
    name: 'Ryan Cooper',
    age: 30,
    location: 'Austin, TX',
    distance: 6,
    bio: 'Entrepreneur | Foodie | Live music lover 🎸',
    occupation: 'Startup Founder',
    education: 'University of Texas',
    interests: ['Business', 'BBQ', 'Running', 'Photography', 'Music', 'Travel'],
    images: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800',
      'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
    ],
    verified: true,
    online: false
  },
  {
    id: 7,
    name: 'Isabella Garcia',
    age: 25,
    location: 'San Francisco, CA',
    distance: 3,
    bio: 'Dancing through life | Wine enthusiast 🍷',
    occupation: 'Marketing Manager',
    education: 'Stanford University',
    interests: ['Dancing', 'Wine', 'Fashion', 'Travel', 'Yoga', 'Food'],
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800'
    ],
    verified: true,
    online: true
  },
  {
    id: 8,
    name: 'Daniel Kim',
    age: 31,
    location: 'Boston, MA',
    distance: 8,
    bio: 'Doctor by profession, explorer by passion 🌍',
    occupation: 'Physician',
    education: 'Harvard Medical School',
    interests: ['Travel', 'Cooking', 'Photography', 'Running', 'Reading', 'Wine'],
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800'
    ],
    verified: true,
    online: false
  }
];

export const mockMatches = [
  {
    id: 2,
    userId: 2,
    name: 'Alex Martinez',
    age: 28,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    lastMessage: 'That sounds amazing! When are you free?',
    timestamp: new Date(Date.now() - 2 * 60000), // 2 minutes ago
    unread: true,
    online: false
  },
  {
    id: 5,
    userId: 5,
    name: 'Maya Patel',
    age: 27,
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
    lastMessage: 'I love that coffee shop too!',
    timestamp: new Date(Date.now() - 60 * 60000), // 1 hour ago
    unread: false,
    online: true
  },
  {
    id: 3,
    userId: 3,
    name: 'Sophie Chen',
    age: 24,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    lastMessage: 'See you then! 😊',
    timestamp: new Date(Date.now() - 3 * 60 * 60000), // 3 hours ago
    unread: false,
    online: true
  },
  {
    id: 7,
    userId: 7,
    name: 'Isabella Garcia',
    age: 25,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    lastMessage: 'That restaurant was incredible!',
    timestamp: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
    unread: false,
    online: true
  }
];

export const mockMessages = {
  2: [
    {
      id: 1,
      senderId: 2,
      text: 'Hey! I saw you like photography too!',
      timestamp: new Date(Date.now() - 120 * 60000),
      read: true
    },
    {
      id: 2,
      senderId: 'me',
      text: 'Yeah! I love landscape photography especially',
      timestamp: new Date(Date.now() - 118 * 60000),
      read: true
    },
    {
      id: 3,
      senderId: 2,
      text: 'That\'s awesome! Have you been to Yosemite?',
      timestamp: new Date(Date.now() - 115 * 60000),
      read: true
    },
    {
      id: 4,
      senderId: 'me',
      text: 'Not yet, but it\'s definitely on my bucket list! The photos I\'ve seen are breathtaking',
      timestamp: new Date(Date.now() - 110 * 60000),
      read: true
    },
    {
      id: 5,
      senderId: 2,
      text: 'We should plan a trip sometime! I know all the best spots',
      timestamp: new Date(Date.now() - 105 * 60000),
      read: true
    },
    {
      id: 6,
      senderId: 'me',
      text: 'That would be amazing! I\'d love to learn some tips from you',
      timestamp: new Date(Date.now() - 100 * 60000),
      read: true
    },
    {
      id: 7,
      senderId: 2,
      text: 'That sounds amazing! When are you free?',
      timestamp: new Date(Date.now() - 2 * 60000),
      read: false
    }
  ],
  5: [
    {
      id: 1,
      senderId: 5,
      text: 'Hi! Love your art collection!',
      timestamp: new Date(Date.now() - 180 * 60000),
      read: true
    },
    {
      id: 2,
      senderId: 'me',
      text: 'Thank you! Are you an artist too?',
      timestamp: new Date(Date.now() - 175 * 60000),
      read: true
    },
    {
      id: 3,
      senderId: 5,
      text: 'Yes! I do graphic design and painting',
      timestamp: new Date(Date.now() - 170 * 60000),
      read: true
    },
    {
      id: 4,
      senderId: 'me',
      text: 'That\'s so cool! What kind of painting do you do?',
      timestamp: new Date(Date.now() - 165 * 60000),
      read: true
    },
    {
      id: 5,
      senderId: 5,
      text: 'Mostly abstract and watercolors. There\'s this great coffee shop with an art gallery',
      timestamp: new Date(Date.now() - 160 * 60000),
      read: true
    },
    {
      id: 6,
      senderId: 'me',
      text: 'Which one?',
      timestamp: new Date(Date.now() - 155 * 60000),
      read: true
    },
    {
      id: 7,
      senderId: 5,
      text: 'I love that coffee shop too!',
      timestamp: new Date(Date.now() - 60 * 60000),
      read: true
    }
  ],
  3: [
    {
      id: 1,
      senderId: 3,
      text: 'Hey there! How\'s your day going?',
      timestamp: new Date(Date.now() - 5 * 60 * 60000),
      read: true
    },
    {
      id: 2,
      senderId: 'me',
      text: 'Great! Just finished a workout. You?',
      timestamp: new Date(Date.now() - 4.5 * 60 * 60000),
      read: true
    },
    {
      id: 3,
      senderId: 3,
      text: 'Nice! I just got back from the beach 🏖️',
      timestamp: new Date(Date.now() - 4 * 60 * 60000),
      read: true
    },
    {
      id: 4,
      senderId: 'me',
      text: 'Lucky! The weather is perfect today',
      timestamp: new Date(Date.now() - 3.5 * 60 * 60000),
      read: true
    },
    {
      id: 5,
      senderId: 3,
      text: 'Want to grab coffee tomorrow?',
      timestamp: new Date(Date.now() - 3.2 * 60 * 60000),
      read: true
    },
    {
      id: 6,
      senderId: 'me',
      text: 'Sounds perfect! How about 10am at Blue Bottle?',
      timestamp: new Date(Date.now() - 3.1 * 60 * 60000),
      read: true
    },
    {
      id: 7,
      senderId: 3,
      text: 'See you then! 😊',
      timestamp: new Date(Date.now() - 3 * 60 * 60000),
      read: true
    }
  ],
  7: [
    {
      id: 1,
      senderId: 7,
      text: 'That restaurant was incredible!',
      timestamp: new Date(Date.now() - 24 * 60 * 60000),
      read: true
    },
    {
      id: 2,
      senderId: 'me',
      text: 'I know right! We should go back sometime',
      timestamp: new Date(Date.now() - 23 * 60 * 60000),
      read: true
    }
  ]
};

export const currentUser = {
  id: 'me',
  name: 'John Doe',
  age: 28,
  location: 'San Francisco, CA',
  bio: 'Adventure seeker and coffee enthusiast. Always up for trying new restaurants or exploring hidden gems in the city. Love hiking on weekends and catching live music shows.',
  occupation: 'Product Manager',
  education: 'Stanford University',
  interests: ['Travel', 'Photography', 'Cooking', 'Music', 'Hiking', 'Art'],
  images: [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800'
  ],
  preferences: {
    ageRange: [24, 32],
    distance: 25,
    lookingFor: 'Long-term relationship',
    showMe: 'Everyone'
  },
  verified: true
};

export const interestOptions = [
  'Travel', 'Photography', 'Cooking', 'Music', 'Hiking', 'Art',
  'Dancing', 'Wine', 'Fitness', 'Yoga', 'Reading', 'Gaming',
  'Coffee', 'Dogs', 'Cats', 'Fashion', 'Movies', 'Sports',
  'Running', 'Cycling', 'Surfing', 'Skiing', 'Painting', 'Writing',
  'Theater', 'Comedy', 'Food', 'Technology', 'Science', 'Politics'
];
