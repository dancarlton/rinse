import bcrypt from 'bcryptjs';

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
    email: 'jsmith@email.com',
    password: bcrypt.hashSync('123456', 10),
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
    email: 'edavis@email.com',
    password: bcrypt.hashSync('123456', 10),
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
    email: 'ajohnson@email.com',
    password: bcrypt.hashSync('123456', 10),
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
];
