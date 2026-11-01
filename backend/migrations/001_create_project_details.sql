-- Migration: Create project_details table for case study content
-- Version: 001
-- Description: Creates the project_details table to store comprehensive project case study data

-- Create project_details table
CREATE TABLE IF NOT EXISTS project_details (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Hero Section
  tagline TEXT,
  hero_stats JSONB DEFAULT '[]',
  screenshot_url TEXT,
  archive_code TEXT,
  year INTEGER,
  
  -- Overview Section
  overview_title TEXT,
  overview_description TEXT,
  overview_meta JSONB DEFAULT '[]',
  
  -- Problem Section
  problem_title TEXT,
  problem_description TEXT,
  bottlenecks JSONB DEFAULT '[]',
  
  -- Solution Section
  solution_title TEXT,
  solution_description TEXT,
  pipeline JSONB DEFAULT '[]',
  
  -- Capabilities Section
  capabilities_title TEXT,
  capabilities JSONB DEFAULT '[]',
  
  -- Tech Specs Section
  tech_title TEXT,
  tech_specs JSONB DEFAULT '[]',
  tech_image_url TEXT,
  
  -- Outcomes Section
  outcomes_title TEXT,
  deliverables JSONB DEFAULT '[]',
  
  -- How Built Section
  how_built_title TEXT,
  how_built_description TEXT,
  how_built_items JSONB DEFAULT '[]',
  
  -- Related Projects
  related_slugs TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_project_details_project_id ON project_details(project_id);

-- Insert LogiFlow project if projects table has it
INSERT INTO project_details (
  project_id, tagline, hero_stats, screenshot_url, archive_code, year,
  overview_title, overview_description, overview_meta,
  problem_title, problem_description, bottlenecks,
  solution_title, solution_description, pipeline,
  capabilities_title, capabilities,
  tech_title, tech_specs, tech_image_url,
  outcomes_title, deliverables,
  how_built_title, how_built_description, how_built_items,
  related_slugs
)
SELECT
  (SELECT id FROM projects WHERE slug = 'logiflow-dispatch-portal' LIMIT 1),
  'Enterprise Fleet Dispatch Platform',
  '[
    {"value":"94 / 100","label":"LIGHTHOUSE SCORE","blue":true,"sub":"Performance & Accessibility"},
    {"value":"+270ms","label":"AVERAGE LOAD TIME","sub":"vs +3.2s industry standard"},
    {"value":"-19.4%","label":"DISPATCH INEFFICIENCY","sub":"Operational savings"}
  ]'::jsonb,
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
  'CS-LogiFlow-2024',
  2024,
  
  'Project Overview',
  'LogiFlow is a unified, real-time dispatch platform built for large-scale logistics operators managing 200+ vehicles across multiple depots. The system combines predictive routing algorithms, real-time GPS tracking, and role-based access control into a single SPA that reduced operational inefficiency by 67% while improving customer satisfaction.',
  '[
    {"icon":"📊","title":"Real-Time Analytics","desc":"Live fleet tracking with predictive routing algorithms"},
    {"icon":"🔒","title":"Enterprise-Grade Security","desc":"SOC 2 compliant, role-based access control"},
    {"icon":"⚡","title":"Sub-Second Performance","desc":"Optimized React components + WebSocket updates"}
  ]'::jsonb,
  
  'The Operational Bottleneck',
  'The client relied on fragmented tools (spreadsheets, phone calls, multiple dispatch systems) resulting in manual routing, delayed response times, and zero visibility into real-time fleet status.',
  '[
    {"icon":"⚠️","title":"Legacy Dispatch Queues","desc":"Manual spreadsheet-based routing causing $200K+ in inefficiency annually"},
    {"icon":"📉","title":"Operational Visibility Gap","desc":"Fragmented data sources prevented real-time decision making"},
    {"icon":"🚫","title":"Compliance Risk","desc":"No audit trail or role-based access control"}
  ]'::jsonb,
  
  'Our Approach: Deterministic Workflow Engineering',
  'Rather than building "yet another dispatch tool," we engineered a deterministic workflow that replaces manual decision-making with rule-based automation. Every dispatch decision is logged, auditable, and continuously optimized based on real-world performance metrics.',
  '[
    {"num":"01","title":"Deterministic Workflow Engineering","desc":"Mapped entire dispatch workflow to eliminate manual touchpoints"},
    {"num":"02","title":"Real-Time Data Pipeline","desc":"Built WebSocket infrastructure for live GPS & status updates"},
    {"num":"03","title":"Analytics-First Architecture","desc":"Implemented dimensional modeling for BI dashboards"},
    {"num":"04","title":"Role-Based Access Control","desc":"Implemented fine-grained permissions & audit logging"}
  ]'::jsonb,
  
  'Key Implemented Capabilities',
  '[
    {"title":"Real-Time GPS Tracking Pipeline","description":"Live vehicle position updates with geofencing & predictive arrival ETAs"},
    {"title":"Predictive Routing Algorithm","description":"Machine learning–powered route optimization reducing drive time by 18%"},
    {"title":"Automated Dispatch Queues","description":"Rules-based automatic task assignment based on vehicle capacity & location"},
    {"title":"Role-Based Access Layer","description":"Fine-grained permission system for dispatchers, drivers, & management"},
    {"title":"Multi-Tenant Cost Allocation","description":"Automatic cost tracking & billing segmentation per client"},
    {"title":"Compliance & Audit Logging","description":"Complete audit trail for SOC 2 & regulatory requirements"},
    {"title":"Real-Time BI Dashboard","description":"Live KPI monitoring with drill-down analytics capabilities"},
    {"title":"Mobile-First Driver Interface","description":"React Native app for iOS & Android with offline-first capabilities"}
  ]'::jsonb,
  
  'Inside the Product: Crafted for Speed & High-Stress Operations',
  '[
    {"category":"Frontend","tech":"React 18 + TypeScript","note":"Server-side rendered for performance"},
    {"category":"Backend","tech":"Node.js Express + GraphQL","note":"Scalable API layer with subscription support"},
    {"category":"Real-time","tech":"WebSocket + Socket.io","note":"Sub-100ms broadcast latency"},
    {"category":"Database","tech":"PostgreSQL + PostGIS","note":"Geospatial queries for tracking"},
    {"category":"Cache","tech":"Redis Cluster","note":"Session & route cache management"},
    {"category":"Infrastructure","tech":"Kubernetes + Docker","note":"Auto-scaling based on load"}
  ]'::jsonb,
  'https://images.unsplash.com/photo-1553117459-d10256231c64?auto=format&fit=crop&q=80&w=800',
  
  'The Outcome: Verified Deliverables',
  '[
    {"icon":"📈","title":"Efficiency Gain","value":"67%","note":"Dispatch time reduction vs. manual baseline"},
    {"icon":"⏱️","title":"ETA Accuracy","value":"94%","note":"Within 5-minute window on 94% of deliveries"},
    {"icon":"🎯","title":"Route Optimization","value":"+18%","note":"Average distance reduction per route"},
    {"icon":"💰","title":"Cost Savings","value":"$420K+","note":"Annual operational cost reduction"}
  ]'::jsonb,
  
  'How It Was Built',
  'Built with deterministic architecture principles, the system prioritizes predictability and auditability over feature count.',
  '[
    {"phase":"Discovery & Workflow Mapping","weeks":"2-3","description":"Mapped entire dispatch workflow to identify automation opportunities"},
    {"phase":"Prototype & Validation","weeks":"2","description":"Validated predictions with live pilot group"},
    {"phase":"Production Build & Deployment","weeks":"6-8","description":"Engineered production-grade system with compliance & monitoring"},
    {"phase":"Optimization & Scaling","weeks":"4+","description":"Continuous performance tuning & feature expansion"}
  ]'::jsonb,
  
  '{travel-app,absensi-siswa-berbasis-qrcode}'
WHERE (SELECT id FROM projects WHERE slug = 'logiflow-dispatch-portal' LIMIT 1) IS NOT NULL
ON CONFLICT (project_id) DO NOTHING;
