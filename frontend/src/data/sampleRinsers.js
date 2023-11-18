const sampleRinsers = [
  {
    id: 1,
    name: 'John Smith',
    profileImage: '/images/providers/stock2.jpg',
    altText: 'Profile Pic',
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
  },
  {
    id: 2,
    name: 'Emily Davis',
    profileImage: '/images/providers/stock3.jpg',
    altText: 'Profile Pic',
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
  },
  {
    id: 3,
    name: 'Alice Johnson',
    profileImage: '/images/providers/stock4.jpg',
    altText: 'Profile Pic',
    services: [
      {
        name: 'Express Wash',
        price: 15.99,
        estimatedTime: '30 minutes',
        rating: 4.3,
      },
      {
        name: 'Full Detailing',
        price: 59.99,
        estimatedTime: '3 hours',
        rating: 4.7,
      },
      {
        name: 'Polishing',
        price: 45.99,
        estimatedTime: '2 hours',
        rating: 4.5,
      },
    ],
    serviceArea: 'Midtown Area',
    overallRating: 4.6,
    reviews: [
      { user: 'Mark Taylor', rating: 4, comment: 'Quick and efficient!' },
      {
        user: 'Sophie White',
        rating: 5,
        comment: 'Great attention to detail.',
      },
      {
        user: 'Chris Brown',
        rating: 4,
        comment: 'Affordable and good service.',
      },
    ],
    travelDistance: 8, // in miles
    locations: { latitude: 37.7749, longitude: -122.4194 },
  },
]


export default sampleRinsers
