import bcrypt from 'bcryptjs'

const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    username: 'johnd',
    email: 'john@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
  {
    username: 'janed',
    email: 'jane@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
]

const sampleRinsers = [
  [
    {
      id: 1,
      name: 'John Smith',
      services: [
        {
          name: 'Exterior Wash',
          price: 25.99,
          estimatedTime: '1 hour',
          rating: 4.5,
        },
        {
          name: 'Interior Detailing',
          price: 49.99,
          estimatedTime: '2 hours',
          rating: 4.8,
        },
        {
          name: 'Waxing',
          price: 34.99,
          estimatedTime: '1.5 hours',
          rating: 4.2,
        },
      ],
      serviceArea: 'Downtown Area',
      overallRating: 4.5,
      reviews: [
        { user: 'Jane Doe', rating: 4, comment: 'Great service!' },
        { user: 'Bob Johnson', rating: 5, comment: 'Highly recommended.' },
        {
          user: 'Alice Williams',
          rating: 4,
          comment: 'Punctual and thorough.',
        },
      ],
      travelDistance: 10, // in miles
      locations: { latitude: 37.7749, longitude: -122.4194 },
      profileImage: 'https://example.com/john-smith-profile.jpg',
      coverPhoto: 'https://example.com/john-smith-cover.jpg',
    },
    {
      id: 2,
      name: 'Emily Davis',
      services: [
        {
          name: 'Hand Wash',
          price: 19.99,
          estimatedTime: '45 minutes',
          rating: 4.7,
        },
        {
          name: 'Vacuuming',
          price: 29.99,
          estimatedTime: '1.5 hours',
          rating: 4.6,
        },
        {
          name: 'Leather Cleaning',
          price: 39.99,
          estimatedTime: '2 hours',
          rating: 4.9,
        },
      ],
      serviceArea: 'Suburban Heights',
      overallRating: 4.7,
      reviews: [
        { user: 'David Brown', rating: 5, comment: 'Excellent work!' },
        {
          user: 'Sophia Rodriguez',
          rating: 4,
          comment: 'Convenient and efficient.',
        },
        {
          user: 'Liam Thomas',
          rating: 5,
          comment: 'Always satisfied with their service.',
        },
      ],
      travelDistance: 15, // in miles
      locations: { latitude: 38.5816, longitude: -121.4944 },
      profileImage: 'https://example.com/emily-davis-profile.jpg',
      coverPhoto: 'https://example.com/emily-davis-cover.jpg',
    },
    // ... (similar entries for other service providers)
  ],
]

export default users
