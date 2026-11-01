-- Create project_details table for comprehensive case study content
CREATE TABLE IF NOT EXISTS project_details (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Hero section
  tagline VARCHAR(255),
  hero_stats JSONB,
  
  -- Section 01: Overview
  overview_body TEXT,
  overview_meta JSONB,
  
  -- Section 02: Bottlenecks
  bottleneck_intro TEXT,
  bottlenecks JSONB,
  
  -- Section 03: Engineering Strategy
  strategy_body TEXT,
  pipeline JSONB,
  pipeline_note VARCHAR(255),
  pipeline_note_right VARCHAR(255),
  
  -- Section 04: Capabilities
  capabilities_intro TEXT,
  capabilities JSONB,
  
  -- Section 06: Tech Specs
  tech_specs JSONB,
  
  -- Section 07: Deliverables
  deliverables_intro TEXT,
  deliverables JSONB,
  deliverables_disclaimer VARCHAR(255),
  
  -- Related projects (slugs)
  related_slugs JSONB,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_project_details_project_id ON project_details(project_id);


-- Trigger untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_project_details_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER project_details_timestamp
BEFORE UPDATE ON project_details
FOR EACH ROW
EXECUTE FUNCTION update_project_details_timestamp();
