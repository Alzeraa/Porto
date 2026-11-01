-- Add slug column to projects table for URL routing support

-- Check if column exists and add it if needed
-- For PostgreSQL:
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Note: Manual slug generation should be done separately by updating existing projects
-- Example: UPDATE projects SET slug = 'logiflow-dispatch-fleet-portal' WHERE id = 1;
