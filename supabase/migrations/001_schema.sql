-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create booking_status enum
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'provider')),
  bio TEXT,
  phone TEXT,
  address TEXT,
  location GEOGRAPHY(Point, 4326),
  rating NUMERIC(3, 2) DEFAULT 0 NOT NULL CHECK (rating >= 0 AND rating <= 5),
  num_ratings INTEGER DEFAULT 0 NOT NULL,
  stripe_account_id TEXT,
  stripe_onboarding_complete BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index on location for geospatial queries
CREATE INDEX profiles_location_idx ON profiles USING GIST(location);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Anyone can read profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- SERVICES TABLE
-- ============================================================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  photo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index on provider_id for quick lookups
CREATE INDEX services_provider_id_idx ON services(provider_id);

-- Enable RLS on services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services
CREATE POLICY "Anyone can read active services"
  ON services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Providers can insert own services"
  ON services FOR INSERT
  WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update own services"
  ON services FOR UPDATE
  USING (auth.uid() = provider_id);

CREATE POLICY "Providers can delete own services"
  ON services FOR DELETE
  USING (auth.uid() = provider_id);

-- ============================================================================
-- AVAILABILITY TABLE
-- ============================================================================
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  UNIQUE(provider_id, day_of_week, start_time, end_time)
);

-- Index on provider_id for quick lookups
CREATE INDEX availability_provider_id_idx ON availability(provider_id);

-- Enable RLS on availability
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies for availability
CREATE POLICY "Anyone can read availability"
  ON availability FOR SELECT
  USING (true);

CREATE POLICY "Providers can insert own availability"
  ON availability FOR INSERT
  WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update own availability"
  ON availability FOR UPDATE
  USING (auth.uid() = provider_id);

CREATE POLICY "Providers can delete own availability"
  ON availability FOR DELETE
  USING (auth.uid() = provider_id);

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  address TEXT NOT NULL,
  location GEOGRAPHY(Point, 4326),
  status booking_status DEFAULT 'pending' NOT NULL,
  payment_intent_id TEXT,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  platform_fee NUMERIC(10, 2) NOT NULL CHECK (platform_fee >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for quick lookups
CREATE INDEX bookings_provider_id_idx ON bookings(provider_id);
CREATE INDEX bookings_customer_id_idx ON bookings(customer_id);
CREATE INDEX bookings_location_idx ON bookings USING GIST(location);

-- Enable RLS on bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings
CREATE POLICY "Providers can read own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = provider_id);

CREATE POLICY "Customers can read own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Providers can update booking status"
  ON bookings FOR UPDATE
  USING (auth.uid() = provider_id);

-- ============================================================================
-- REVIEWS TABLE
-- ============================================================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  reply TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for quick lookups
CREATE INDEX reviews_provider_id_idx ON reviews(provider_id);
CREATE INDEX reviews_customer_id_idx ON reviews(customer_id);

-- Enable RLS on reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Customers can create reviews for completed bookings"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() = customer_id AND
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
        AND bookings.customer_id = auth.uid()
        AND bookings.status = 'completed'
    )
  );

CREATE POLICY "Providers can update review reply"
  ON reviews FOR UPDATE
  USING (auth.uid() = provider_id)
  WITH CHECK (auth.uid() = provider_id);

-- ============================================================================
-- TRIGGER FUNCTIONS
-- ============================================================================

-- Function: Update provider rating when a review is created
CREATE OR REPLACE FUNCTION on_review_created()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET
    rating = (
      SELECT AVG(rating)::NUMERIC(3, 2)
      FROM reviews
      WHERE provider_id = NEW.provider_id
    ),
    num_ratings = (
      SELECT COUNT(*)
      FROM reviews
      WHERE provider_id = NEW.provider_id
    )
  WHERE id = NEW.provider_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on reviews insert
CREATE TRIGGER on_review_created_trigger
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION on_review_created();

-- Function: Create profile when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function: Find nearby providers within a given radius
CREATE OR REPLACE FUNCTION find_nearby_providers(
  lat FLOAT,
  lng FLOAT,
  radius_km FLOAT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  rating NUMERIC,
  num_ratings INTEGER,
  distance_km FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.full_name,
    p.avatar_url,
    p.bio,
    p.rating,
    p.num_ratings,
    ST_Distance(
      p.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) / 1000 AS distance_km
  FROM profiles p
  WHERE
    p.role = 'provider' AND
    p.location IS NOT NULL AND
    ST_DWithin(
      p.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_km * 1000
    )
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;
