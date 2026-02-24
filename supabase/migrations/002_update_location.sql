-- RPC function to update profile location (PostGIS geography type)
CREATE OR REPLACE FUNCTION update_profile_location(
  user_id uuid,
  lat double precision,
  lng double precision
) RETURNS void AS $$
BEGIN
  UPDATE profiles SET location = ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
