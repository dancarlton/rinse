import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  console.log('🌱 Starting database seed...\n')

  // Miami-area coordinates for providers
  const providers = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'mike@mikedetail.com',
      full_name: 'Mike Rodriguez',
      role: 'provider',
      business_name: "Mike's Mobile Detail",
      bio: 'Premium mobile detailing serving Miami since 2018. Specializing in luxury vehicles and ceramic coatings.',
      phone: '+1 (305) 555-0101',
      stripe_account_id: null,
      stripe_onboarding_complete: false,
      location: {
        type: 'Point',
        coordinates: [-80.1918, 25.7617] // Downtown Miami
      },
      service_radius_km: 15,
      rating: 4.8,
      num_ratings: 127
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'contact@pristineauto.com',
      full_name: 'Sarah Martinez',
      role: 'provider',
      business_name: 'Pristine Auto Spa',
      bio: 'Eco-friendly detailing using premium waterless products. We come to you!',
      phone: '+1 (305) 555-0102',
      stripe_account_id: null,
      stripe_onboarding_complete: false,
      location: {
        type: 'Point',
        coordinates: [-80.3034, 25.7907] // Coral Gables
      },
      service_radius_km: 20,
      rating: 4.9,
      num_ratings: 203
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      email: 'info@cleanmachine.com',
      full_name: 'James Wilson',
      role: 'provider',
      business_name: 'Clean Machine Detailing',
      bio: 'Fast, affordable, professional. Same-day service available for most locations.',
      phone: '+1 (305) 555-0103',
      stripe_account_id: null,
      stripe_onboarding_complete: false,
      location: {
        type: 'Point',
        coordinates: [-80.1373, 25.7907] // Wynwood
      },
      service_radius_km: 12,
      rating: 4.6,
      num_ratings: 89
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      email: 'elite@oceandetail.com',
      full_name: 'Carlos Fernandez',
      role: 'provider',
      business_name: 'Ocean Elite Detailing',
      bio: 'Specializing in high-end vehicles and yacht interiors. White-glove service.',
      phone: '+1 (305) 555-0104',
      stripe_account_id: null,
      stripe_onboarding_complete: false,
      location: {
        type: 'Point',
        coordinates: [-80.1300, 25.8176] // North Miami Beach
      },
      service_radius_km: 25,
      rating: 5.0,
      num_ratings: 64
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      email: 'shine@expresswash.com',
      full_name: 'Alex Thompson',
      role: 'provider',
      business_name: 'Express Shine Mobile Wash',
      bio: 'Quick washes and maintenance details. Perfect for busy professionals.',
      phone: '+1 (305) 555-0105',
      stripe_account_id: null,
      stripe_onboarding_complete: false,
      location: {
        type: 'Point',
        coordinates: [-80.2089, 25.7889] // Brickell
      },
      service_radius_km: 10,
      rating: 4.7,
      num_ratings: 156
    },
    {
      id: '00000000-0000-0000-0000-000000000006',
      email: 'max@luxedetail.com',
      full_name: 'Max Delgado',
      role: 'provider',
      business_name: 'Luxe Detail Co.',
      bio: 'Premium paint correction and protection. Certified ceramic coating installer.',
      phone: '+1 (305) 555-0106',
      stripe_account_id: null,
      stripe_onboarding_complete: false,
      location: {
        type: 'Point',
        coordinates: [-80.2675, 25.7907] // Miami Beach
      },
      service_radius_km: 18,
      rating: 4.9,
      num_ratings: 95
    }
  ]

  console.log('📍 Inserting providers...')
  const { error: providersError } = await supabase
    .from('profiles')
    .upsert(providers, { onConflict: 'id' })

  if (providersError) {
    console.error('Error inserting providers:', providersError)
    throw providersError
  }
  console.log(`✓ Inserted ${providers.length} providers\n`)

  // Services for each provider
  const services = [
    // Mike's Mobile Detail
    { provider_id: providers[0].id, name: 'Express Wash', description: 'Quick exterior wash and dry. Perfect for maintenance.', price: 35, duration_minutes: 30, active: true },
    { provider_id: providers[0].id, name: 'Interior Detail', description: 'Deep clean interior, vacuum, leather conditioning.', price: 75, duration_minutes: 60, active: true },
    { provider_id: providers[0].id, name: 'Full Detail', description: 'Complete interior and exterior detail. Hand wash, wax, interior deep clean.', price: 150, duration_minutes: 150, active: true },
    { provider_id: providers[0].id, name: 'Ceramic Coating', description: 'Premium ceramic coating with 3-year warranty. Paint correction included.', price: 350, duration_minutes: 240, active: true },

    // Pristine Auto Spa
    { provider_id: providers[1].id, name: 'Eco Wash', description: 'Waterless wash using eco-friendly products.', price: 40, duration_minutes: 35, active: true },
    { provider_id: providers[1].id, name: 'Interior Refresh', description: 'Vacuum, wipe down, air freshener.', price: 60, duration_minutes: 45, active: true },
    { provider_id: providers[1].id, name: 'Complete Detail', description: 'Full eco-friendly detail inside and out.', price: 140, duration_minutes: 120, active: true },
    { provider_id: providers[1].id, name: 'Paint Protection', description: 'Sealant application for long-lasting shine.', price: 200, duration_minutes: 90, active: true },

    // Clean Machine Detailing
    { provider_id: providers[2].id, name: 'Basic Wash', description: 'Hand wash and dry. Fast and affordable.', price: 30, duration_minutes: 25, active: true },
    { provider_id: providers[2].id, name: 'Interior Clean', description: 'Vacuum and wipe down all surfaces.', price: 50, duration_minutes: 40, active: true },
    { provider_id: providers[2].id, name: 'Standard Detail', description: 'Wash, wax, interior cleaning.', price: 120, duration_minutes: 90, active: true },

    // Ocean Elite Detailing
    { provider_id: providers[3].id, name: 'Elite Wash', description: 'Premium hand wash with soft microfiber towels.', price: 80, duration_minutes: 45, active: true },
    { provider_id: providers[3].id, name: 'Concours Detail', description: 'Show-car quality detail. Every surface perfected.', price: 300, duration_minutes: 240, active: true },
    { provider_id: providers[3].id, name: 'Paint Correction', description: 'Multi-stage polishing to remove swirls and scratches.', price: 400, duration_minutes: 300, active: true },
    { provider_id: providers[3].id, name: 'Interior Restoration', description: 'Deep cleaning, leather restoration, odor elimination.', price: 180, duration_minutes: 120, active: true },

    // Express Shine Mobile Wash
    { provider_id: providers[4].id, name: 'Quick Wash', description: 'Express exterior wash. In and out in 20 minutes.', price: 25, duration_minutes: 20, active: true },
    { provider_id: providers[4].id, name: 'Maintenance Detail', description: 'Wash, wax, quick interior vacuum.', price: 65, duration_minutes: 50, active: true },
    { provider_id: providers[4].id, name: 'Full Service', description: 'Complete wash, wax, and interior detail.', price: 110, duration_minutes: 90, active: true },

    // Luxe Detail Co.
    { provider_id: providers[5].id, name: 'Premium Wash', description: 'Two-bucket hand wash with pH-neutral soap.', price: 60, duration_minutes: 40, active: true },
    { provider_id: providers[5].id, name: 'Paint Enhancement', description: 'Single-stage polish for improved gloss.', price: 250, duration_minutes: 180, active: true },
    { provider_id: providers[5].id, name: 'Ceramic Pro Package', description: 'Professional-grade ceramic coating. 5-year warranty.', price: 500, duration_minutes: 300, active: true },
    { provider_id: providers[5].id, name: 'Executive Detail', description: 'Full interior and exterior detail with premium products.', price: 200, duration_minutes: 150, active: true }
  ]

  console.log('🔧 Inserting services...')
  const { error: servicesError } = await supabase
    .from('services')
    .upsert(services)

  if (servicesError) {
    console.error('Error inserting services:', servicesError)
    throw servicesError
  }
  console.log(`✓ Inserted ${services.length} services\n`)

  // Availability for each provider (Mon-Fri 8am-6pm, Sat 9am-4pm)
  const availability = []
  for (const provider of providers) {
    // Weekdays
    for (let day = 1; day <= 5; day++) {
      availability.push({
        provider_id: provider.id,
        day_of_week: day,
        start_time: provider.id === providers[4].id ? '07:00' : '08:00', // Express Shine starts earlier
        end_time: provider.id === providers[3].id ? '20:00' : '18:00', // Ocean Elite works later
        available: true
      })
    }
    // Saturday
    if (provider.id !== providers[4].id) { // Express Shine doesn't work Saturdays
      availability.push({
        provider_id: provider.id,
        day_of_week: 6,
        start_time: '09:00',
        end_time: provider.id === providers[3].id ? '17:00' : '16:00',
        available: true
      })
    }
  }

  console.log('📅 Inserting availability...')
  const { error: availabilityError } = await supabase
    .from('provider_availability')
    .upsert(availability)

  if (availabilityError) {
    console.error('Error inserting availability:', availabilityError)
    throw availabilityError
  }
  console.log(`✓ Inserted ${availability.length} availability slots\n`)

  // Reviews (2-5 per provider)
  const reviews = [
    // Mike's Mobile Detail
    { provider_id: providers[0].id, customer_name: 'John Smith', rating: 5, comment: 'Amazing work! My Tesla looks brand new. Mike was professional and on time.', provider_reply: 'Thanks John! Enjoy that shine!' },
    { provider_id: providers[0].id, customer_name: 'Emily Davis', rating: 5, comment: 'Best ceramic coating in Miami. Worth every penny.', provider_reply: null },
    { provider_id: providers[0].id, customer_name: 'Robert Chen', rating: 4, comment: 'Great service, very thorough. Took a bit longer than expected but the results were perfect.', provider_reply: null },
    { provider_id: providers[0].id, customer_name: 'Maria Garcia', rating: 5, comment: 'Mike detailed my Porsche and it looks incredible. Highly recommend!', provider_reply: 'Thank you Maria! Always a pleasure working on fine automobiles.' },

    // Pristine Auto Spa
    { provider_id: providers[1].id, customer_name: 'David Park', rating: 5, comment: 'Love that they use eco-friendly products. Car looks great and I feel good about it.', provider_reply: 'Thanks David! Eco-friendly doesn\'t mean compromising on quality!' },
    { provider_id: providers[1].id, customer_name: 'Lisa Anderson', rating: 5, comment: 'Sarah is amazing! Very detail-oriented and professional.', provider_reply: null },
    { provider_id: providers[1].id, customer_name: 'Tom Bradley', rating: 5, comment: 'Best detailing I\'ve had in years. Booking again next month.', provider_reply: null },
    { provider_id: providers[1].id, customer_name: 'Rachel Green', rating: 4, comment: 'Really good service. My SUV interior looks brand new.', provider_reply: 'Thank you Rachel! See you next time!' },
    { provider_id: providers[1].id, customer_name: 'Chris Evans', rating: 5, comment: 'Waterless wash is genius. Perfect for Miami.', provider_reply: null },

    // Clean Machine Detailing
    { provider_id: providers[2].id, customer_name: 'Mike Johnson', rating: 5, comment: 'Fast and affordable. Exactly what I needed.', provider_reply: null },
    { provider_id: providers[2].id, customer_name: 'Sarah Williams', rating: 4, comment: 'Good value for money. Quick service.', provider_reply: 'Thanks Sarah!' },
    { provider_id: providers[2].id, customer_name: 'Alex Martinez', rating: 5, comment: 'James did a great job on my sedan. Will use again.', provider_reply: null },

    // Ocean Elite Detailing
    { provider_id: providers[3].id, customer_name: 'Richard Sterling', rating: 5, comment: 'White-glove service indeed. My Bentley has never looked better.', provider_reply: 'Thank you Richard! Pleasure working on such a beautiful vehicle.' },
    { provider_id: providers[3].id, customer_name: 'Victoria Lane', rating: 5, comment: 'Carlos is an artist. Paint correction was flawless.', provider_reply: null },
    { provider_id: providers[3].id, customer_name: 'James Morrison', rating: 5, comment: 'Worth every dollar. Premium service for premium cars.', provider_reply: 'Appreciate the kind words James!' },
    { provider_id: providers[3].id, customer_name: 'Amanda Cruz', rating: 5, comment: 'Interior restoration on my yacht was perfect. Highly recommend.', provider_reply: null },

    // Express Shine Mobile Wash
    { provider_id: providers[4].id, customer_name: 'Kevin Brown', rating: 5, comment: 'Perfect for my weekly maintenance. Quick and convenient.', provider_reply: null },
    { provider_id: providers[4].id, customer_name: 'Julia Roberts', rating: 4, comment: 'Great for busy professionals. Gets the job done.', provider_reply: 'Thanks Julia!' },
    { provider_id: providers[4].id, customer_name: 'Daniel White', rating: 5, comment: 'Alex is super reliable. Never late, always does a great job.', provider_reply: null },

    // Luxe Detail Co.
    { provider_id: providers[5].id, customer_name: 'Nicholas Cage', rating: 5, comment: 'Ceramic coating looks amazing after 6 months. Still beading like day one.', provider_reply: 'Glad to hear it Nicholas! That\'s the Ceramic Pro quality.' },
    { provider_id: providers[5].id, customer_name: 'Sophia Turner', rating: 5, comment: 'Max is a perfectionist. My Mercedes looks showroom ready.', provider_reply: null },
    { provider_id: providers[5].id, customer_name: 'Oliver James', rating: 5, comment: 'Best paint correction in South Florida. Removed all the swirl marks.', provider_reply: 'Thank you Oliver! Appreciate the trust in our work.' },
    { provider_id: providers[5].id, customer_name: 'Emma Stone', rating: 4, comment: 'Excellent work. A bit pricey but you get what you pay for.', provider_reply: null }
  ]

  console.log('⭐ Inserting reviews...')
  const { error: reviewsError } = await supabase
    .from('reviews')
    .upsert(reviews)

  if (reviewsError) {
    console.error('Error inserting reviews:', reviewsError)
    throw reviewsError
  }
  console.log(`✓ Inserted ${reviews.length} reviews\n`)

  console.log('✅ Seed completed successfully!\n')
  console.log('📊 Summary:')
  console.log(`   - ${providers.length} providers`)
  console.log(`   - ${services.length} services`)
  console.log(`   - ${availability.length} availability slots`)
  console.log(`   - ${reviews.length} reviews`)
  console.log('\nNote: Provider accounts are profile-only (no auth users).')
  console.log('For full testing, create real auth users and update provider profiles.')
}

seed()
  .then(() => {
    console.log('\n🎉 All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Seed failed:', error)
    process.exit(1)
  })
