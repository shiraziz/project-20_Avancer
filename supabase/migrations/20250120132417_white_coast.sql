-- /*
--   # Schéma initial pour le système de gestion des commandes

--   1. Tables
--     - users (gérée par Supabase Auth)
--     - stores
--       - id (uuid, primary key)
--       - name (text)
--       - created_at (timestamp)
--       - owner_id (uuid, foreign key)
--     - orders
--       - id (uuid, primary key)
--       - store_id (uuid, foreign key)
--       - client_name (text)
--       - phone_1 (text)
--       - phone_2 (text)
--       - state (text)
--       - municipality (text)
--       - address (text)
--       - note (text)
--       - sku (text)
--       - quantity (integer)
--       - unit_price (decimal)
--       - shipping_fee (decimal)
--       - discount (decimal)
--       - reference (text)
--       - office_stop (text)
--       - status (text)
--       - created_at (timestamp)
--       - updated_at (timestamp)
--       - created_by (uuid, foreign key)
--     - states
--       - id (uuid, primary key)
--       - name (text)
--     - municipalities
--       - id (uuid, primary key)
--       - state_id (uuid, foreign key)
--       - name (text)

--   2. Security
--     - Enable RLS sur toutes les tables
--     - Politiques pour administrateurs, responsables et employés
-- */

-- -- Create enum for user roles
-- CREATE TYPE user_role AS ENUM ('admin', 'store_manager', 'employee');

-- -- Add role to auth.users
-- ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'employee';

-- -- Create stores table
-- CREATE TABLE IF NOT EXISTS stores (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   name text NOT NULL,
--   created_at timestamptz DEFAULT now(),
--   owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
-- );

-- -- Create states table
-- CREATE TABLE IF NOT EXISTS states (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   name text NOT NULL UNIQUE
-- );

-- -- Create municipalities table
-- CREATE TABLE IF NOT EXISTS municipalities (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   state_id uuid REFERENCES states(id) ON DELETE CASCADE,
--   name text NOT NULL,
--   UNIQUE(state_id, name)
-- );

-- -- Create orders table
-- CREATE TABLE IF NOT EXISTS orders (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
--   client_name text NOT NULL,
--   phone_1 text NOT NULL,
--   phone_2 text,
--   state text NOT NULL,
--   municipality text NOT NULL,
--   address text NOT NULL,
--   note text,
--   sku text NOT NULL,
--   quantity integer NOT NULL,
--   unit_price decimal(10,2) NOT NULL,
--   shipping_fee decimal(10,2) DEFAULT 0,
--   discount decimal(10,2) DEFAULT 0,
--   reference text,
--   office_stop text,
--   status text DEFAULT 'pending',
--   created_at timestamptz DEFAULT now(),
--   updated_at timestamptz DEFAULT now(),
--   created_by uuid REFERENCES auth.users(id)
-- );

-- -- Enable RLS
-- ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE states ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE municipalities ENABLE ROW LEVEL SECURITY;

-- -- Policies for stores
-- CREATE POLICY "Admins can do everything with stores"
--   ON stores
--   FOR ALL
--   TO authenticated
--   USING (auth.jwt() ->> 'role' = 'admin');

-- CREATE POLICY "Store managers can view their own stores"
--   ON stores
--   FOR SELECT
--   TO authenticated
--   USING (owner_id = auth.uid());

-- -- Policies for orders
-- CREATE POLICY "Admins can do everything with orders"
--   ON orders
--   FOR ALL
--   TO authenticated
--   USING (auth.jwt() ->> 'role' = 'admin');

-- CREATE POLICY "Store managers can manage their store orders"
--   ON orders
--   FOR ALL
--   TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM stores
--       WHERE stores.id = orders.store_id
--       AND stores.owner_id = auth.uid()
--     )
--   );

-- CREATE POLICY "Employees can view and update order status"
--   ON orders
--   FOR SELECT
--   TO authenticated
--   USING (true);

-- -- Policies for states and municipalities
-- CREATE POLICY "Everyone can read states"
--   ON states
--   FOR SELECT
--   TO authenticated
--   USING (true);

-- CREATE POLICY "Everyone can read municipalities"
--   ON municipalities
--   FOR SELECT
--   TO authenticated
--   USING (true);

-- -- Insert some initial states
-- INSERT INTO states (name) VALUES
--   ('État 1'),
--   ('État 2'),
--   ('État 3')
-- ON CONFLICT DO NOTHING;

-- -- Insert some initial municipalities
-- INSERT INTO municipalities (state_id, name)
-- SELECT states.id, 'Municipalité 1'
-- FROM states
-- WHERE states.name = 'État 1'
-- ON CONFLICT DO NOTHING;

-- INSERT INTO municipalities (state_id, name)
-- SELECT states.id, 'Municipalité 2'
-- FROM states
-- WHERE states.name = 'État 1'
-- ON CONFLICT DO NOTHING;