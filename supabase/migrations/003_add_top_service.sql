-- Update find_nearby_providers to include top (cheapest) service
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
  address TEXT,
  latitude FLOAT,
  longitude FLOAT,
  rating NUMERIC,
  num_ratings INTEGER,
  distance_km FLOAT,
  top_service_title TEXT,
  top_service_price NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.full_name,
    p.avatar_url,
    p.bio,
    p.address,
    ST_Y(p.location::geometry) AS latitude,
    ST_X(p.location::geometry) AS longitude,
    p.rating,
    p.num_ratings,
    ST_Distance(
      p.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) / 1000 AS distance_km,
    s.title AS top_service_title,
    s.price AS top_service_price
  FROM profiles p
  LEFT JOIN LATERAL (
    SELECT title, price
    FROM services
    WHERE provider_id = p.id
    ORDER BY price ASC
    LIMIT 1
  ) s ON true
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
