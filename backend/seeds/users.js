import bcrypt from 'bcryptjs';

function generateRandomString(length = 6) {
  // Generates a random string of specified length
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function createUsers(numUsers = 3) {
  // Creates a specified number of user objects
  const users = [];
  for (let i = 0; i < numUsers; i++) {
    const name = generateRandomString();
    const email = `${name}@email.com`;
    const password = bcrypt.hashSync('123456', 10);
    const role = 'user';
    users.push({
      name,
      email,
      password,
      role,
    });
  }
  return users;
}

// Generate 100 user objects
// const sampleUsers = createUsers(10000);

// ! added email because of seeder.js error:
// ! Error: MongoBulkWriteError: E11000 duplicate key error collection: rinse.users index: email_1 dup key: { email: null }
export const sampleUsers = [
  {
    name: 'admin',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'admin',
  },
  {
    name: 'johnd',
    email: 'john@email.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'user',
  },
  {
    name: 'janed',
    email: 'jane@email.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'user',
  },
  {
    name: 'John Smith',
    // ! adding email for sample script
    email: 'john_smith@rinse-test123.com',
    avatar: '/images/icons/avatar2.jpg',
    profileImage: '/images/providers/stock2.jpg',
    altText: 'Profile Pic',
    role: 'provider',
    services: [
      {
        name: 'Exterior Wash',
        description: 'Thorough cleaning of the exterior of your vehicle.',
        price: 25.99,
        estimatedTime: 1,
        rating: 4.5,
        photo: '/images/providers/stock2.jpg',
      },
      {
        name: 'Interior Detailing',
        description: 'Comprehensive cleaning of the interior, including seats and dashboard.',
        price: 49.99,
        estimatedTime: 2,
        rating: 4.8,
        photo: '/images/providers/stock5.jpg',
      },
      {
        name: 'Waxing',
        description: 'Application of high-quality wax for a shiny finish.',
        price: 34.99,
        estimatedTime: 1.5,
        rating: 4.2,
        photo: '/images/providers/stock6.jpg',
      },
    ],
    serviceArea: 'Downtown Area',
    overallRating: 4.5,
    reviews: [
      {
        user: 'Jane Doe',
        avatar: '/images/icons/avatar3.jpg',
        rating: 4,
        comment: 'Great service!',
      },
      {
        user: 'Bob Johnson',
        avatar: '',
        rating: 5,
        comment: 'Highly recommended.',
      },
      {
        user: 'Alice Williams',
        avatar: '',
        rating: 4,
        comment: 'Punctual and thorough.',
      },
    ],
    travelDistance: 10, // in miles
    locations: { latitude: 37.7749, longitude: -122.4194 },
  },
  {
    name: 'Emily Davis',
    // ! adding email for sample script
    email: 'emily_davis@rinse-test123.com',
    avatar: '/images/icons/avatar1.jpg',
    profileImage: '/images/providers/stock3.jpg',
    altText: 'Profile Pic',
    role: 'provider',
    services: [
      {
        name: 'Hand Wash',
        description: 'Gentle hand wash for a spotless clean.',
        price: 19.99,
        estimatedTime: 0.75,
        rating: 4.7,
        photo: '/images/providers/stock7.jpg',
      },
      {
        name: 'Vacuuming',
        description: 'Thorough vacuuming of the interior to remove dust and debris.',
        price: 29.99,
        estimatedTime: 1.5,
        rating: 4.6,
        photo: '/images/providers/stock1.jpg',
      },
      {
        name: 'Leather Cleaning',
        description: 'Specialized cleaning for leather interiors.',
        price: 39.99,
        estimatedTime: 2,
        rating: 4.9,
        photo: '/images/providers/stock3.jpg',
      },
    ],
    serviceArea: 'Suburban Heights',
    overallRating: 4.7,
    reviews: [
      {
        user: 'David Brown',
        avatar: '',
        rating: 5,
        comment: 'Excellent work!',
      },
      {
        user: 'Sophia Rodriguez',
        avatar: '',
        rating: 4,
        comment: 'Convenient and efficient.',
      },
      {
        user: 'Liam Thomas',
        avatar: '',
        rating: 5,
        comment: 'Always satisfied with their service.',
      },
    ],
    travelDistance: 15, // in miles
    locations: { latitude: 38.5816, longitude: -121.4944 },
  },
  {
    name: 'Alice Johnson',
    // ! adding email for sample script
    email: 'alice_johnson@rinse-test123.com',
    avatar: '',
    role: 'provider',
    profileImage: '/images/providers/stock4.jpg',
    altText: 'Profile Pic',
    services: [
      {
        name: 'Express Wash',
        description: 'Quick and efficient express wash service.',
        price: 15.99,
        estimatedTime: 0.5,
        rating: 4.3,
        photo: '/images/providers/stock7.jpg',
      },
      {
        name: 'Full Detailing',
        description: 'Comprehensive detailing for a complete makeover.',
        price: 59.99,
        estimatedTime: 3,
        rating: 4.7,
        photo: '/images/providers/stock6.jpg',
      },
      {
        name: 'Polishing',
        description: 'Professional polishing for a glossy finish.',
        price: 45.99,
        estimatedTime: 2,
        rating: 4.5,
        photo: '/images/providers/stock3.jpg',
      },
    ],
    serviceArea: 'Midtown Area',
    overallRating: 4.6,
    reviews: [
      {
        user: 'Mark Taylor',
        avatar: '',
        rating: 4,
        comment: 'Quick and efficient!',
      },
      {
        user: 'Sophie White',
        avatar: '',
        rating: 5,
        comment: 'Great attention to detail.',
      },
      {
        user: 'Chris Brown',
        avatar: '',
        rating: 4,
        comment: 'Affordable and good service.',
      },
    ],
    travelDistance: 8, // in miles
    locations: { latitude: 37.7749, longitude: -122.4194 },
  },
  // ! new users added for testing
  {
    name: 'Greg Patrick',
    email: 'greg_patrick@rinse-test123.com',
    avatar: '',
    role: 'provider',
    profileImage: '/images/providers/stock4.jpg',
    altText: 'Profile Pic',
    services: [
      {
        name: 'Express Wash',
        description: 'Quick and efficient express wash service.',
        price: 15.99,
        estimatedTime: 0.5,
        rating: 4.3,
        photo: '/images/providers/stock7.jpg',
      },
      {
        name: 'Full Detailing',
        description: 'Comprehensive detailing for a complete makeover.',
        price: 59.99,
        estimatedTime: 3,
        rating: 4.7,
        photo: '/images/providers/stock6.jpg',
      },
      {
        name: 'Polishing',
        description: 'Professional polishing for a glossy finish.',
        price: 45.99,
        estimatedTime: 2,
        rating: 4.5,
        photo: '/images/providers/stock3.jpg',
      },
    ],
    serviceArea: 'Green Point Brooklyn',
    overallRating: 4.6,
    reviews: [
      {
        user: 'Alice Taylor',
        avatar: '',
        rating: 4,
        comment: 'Quick and efficient!',
      },
      {
        user: 'Mark Smith',
        avatar: '',
        rating: 5,
        comment: 'Great attention to detail.',
      },
      {
        user: 'John Thomas',
        avatar: '',
        rating: 4,
        comment: 'Affordable and good service.',
      },
    ],
    travelDistance: 8, // in miles
    locations: { latitude: 40.73181828627376, longitude: -73.95845221094753 },
  },
  {
    name: 'Paul Dimasi',
    // ! adding email for sample script
    email: 'paul_dimasi@rinse-test123.com',
    avatar: '',
    role: 'provider',
    profileImage: '/images/providers/stock4.jpg',
    altText: 'Profile Pic',
    services: [
      {
        name: 'Express Wash',
        description: 'Quick and efficient express wash service.',
        price: 15.99,
        estimatedTime: 0.5,
        rating: 4.3,
        photo: '/images/providers/stock7.jpg',
      },
      {
        name: 'Full Detailing',
        description: 'Comprehensive detailing for a complete makeover.',
        price: 59.99,
        estimatedTime: 3,
        rating: 4.7,
        photo: '/images/providers/stock6.jpg',
      },
      {
        name: 'Polishing',
        description: 'Professional polishing for a glossy finish.',
        price: 45.99,
        estimatedTime: 2,
        rating: 4.5,
        photo: '/images/providers/stock3.jpg',
      },
    ],
    serviceArea: 'Union City New Jersey',
    overallRating: 4.6,
    reviews: [
      {
        user: 'Marissa Jones',
        avatar: '',
        rating: 4,
        comment: 'Quick and efficient!',
      },
      {
        user: 'Colleen Murphy',
        avatar: '',
        rating: 5,
        comment: 'Great attention to detail.',
      },
      {
        user: 'Michael Chan',
        avatar: '',
        rating: 4,
        comment: 'Affordable and good service.',
      },
    ],
    travelDistance: 8, // in miles
    locations: { latitude: 40.7527117261711, longitude: -74.05142012646066 },
  },
  {
    name: 'Dominic Stanfield',
    // ! adding email for sample script
    email: 'dominic_stanfield@rinse-test123.com',
    avatar: '',
    role: 'provider',
    profileImage: '/images/providers/stock4.jpg',
    altText: 'Profile Pic',
    services: [
      {
        name: 'Express Wash',
        description: 'Quick and efficient express wash service.',
        price: 15.99,
        estimatedTime: 0.5,
        rating: 4.3,
        photo: '/images/providers/stock7.jpg',
      },
      {
        name: 'Full Detailing',
        description: 'Comprehensive detailing for a complete makeover.',
        price: 59.99,
        estimatedTime: 3,
        rating: 4.7,
        photo: '/images/providers/stock6.jpg',
      },
      {
        name: 'Polishing',
        description: 'Professional polishing for a glossy finish.',
        price: 45.99,
        estimatedTime: 2,
        rating: 4.5,
        photo: '/images/providers/stock3.jpg',
      },
    ],
    serviceArea: 'Upper West Side Manhattan',
    overallRating: 4.6,
    reviews: [
      {
        user: 'Colin Cassell',
        avatar: '',
        rating: 4,
        comment: 'Quick and efficient!',
      },
      {
        user: 'Grace Johnson',
        avatar: '',
        rating: 5,
        comment: 'Great attention to detail.',
      },
      {
        user: 'Susan Green',
        avatar: '',
        rating: 4,
        comment: 'Affordable and good service.',
      },
    ],
    travelDistance: 8, // in miles
    locations: { latitude: 40.760364881510775, longitude: -73.96343176828717 },
  },
];

export default sampleUsers;
