/**
 * Seed Script: Project Detail Data (LogiFlow Case Study)
 * 
 * This script inserts comprehensive project detail data for the LogiFlow project
 * based on the design mockup from the case study.
 * 
 * Run with: node src/scripts/seed-project-detail.js
 */

const pool = require('../config/database');

const seedProjectDetails = async () => {
  const client = await pool.connect();
  
  try {
    console.log('[Seed] Starting project detail seeding...');

    // ──── CREATE EXTENDED PROJECTS TABLE IF NEEDED ────
    // This table stores the detailed case study content
    await client.query(`
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
    `);

    console.log('[Seed] Table project_details ready');

    // ──── FIND OR CREATE LOGIFLOW PROJECT ────
    let projectId;
    const projectCheck = await client.query(
      'SELECT id FROM projects WHERE slug = $1',
      ['logiflow-dispatch-portal']
    );

    if (projectCheck.rows.length === 0) {
      // Create the project if it doesn't exist
      const newProject = await client.query(`
        INSERT INTO projects 
        (title, category, description, tech, image, link, slug, order_index)
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `, [
        'LogiFlow Dispatch & Fleet Portal',
        'Full-Stack Web',
        'A custom-built SPA designed for unified fleet dispatch management with real-time tracking and analytics.',
        JSON.stringify(['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Real-time API', 'Google Maps API']),
        'https://images.unsplash.com/photo-1633356122544-f134324ef6db?auto=format&fit=crop&q=80&w=600&h=400',
        'https://logiflow-demo.example.com',
        'logiflow-dispatch-portal',
        1
      ]);
      projectId = newProject.rows[0].id;
      console.log('[Seed] Created new LogiFlow project with ID:', projectId);
    } else {
      projectId = projectCheck.rows[0].id;
      console.log('[Seed] Found existing LogiFlow project with ID:', projectId);
    }

    // ──── INSERT OR UPDATE PROJECT DETAIL ────
    const detailCheck = await client.query(
      'SELECT id FROM project_details WHERE project_id = $1',
      [projectId]
    );

    const heroStatsData = [
      { value: '94 / 100', label: 'LIGHTHOUSE SCORE', blue: true, sub: 'Performance & Accessibility' },
      { value: '+270ms', label: 'AVERAGE LOAD TIME', sub: 'vs +3.2s industry standard' },
      { value: '-19.4%', label: 'DISPATCH INEFFICIENCY', sub: 'Operational savings' }
    ];

    const overviewMetaData = [
      { icon: '📊', title: 'Real-Time Analytics', desc: 'Live fleet tracking with predictive routing algorithms' },
      { icon: '🔒', title: 'Enterprise-Grade Security', desc: 'SOC 2 compliant, role-based access control' },
      { icon: '⚡', title: 'Sub-Second Performance', desc: 'Optimized React components + WebSocket updates' }
    ];

    const bottlenecksData = [
      { icon: '⚠️', title: 'Legacy Dispatch Queues', desc: 'Manual spreadsheet-based routing causing $200K+ in inefficiency annually' },
      { icon: '📉', title: 'Operational Visibility Gap', desc: 'Fragmented data sources prevented real-time decision making' },
      { icon: '🚫', title: 'Compliance Risk', desc: 'No audit trail or role-based access control' }
    ];

    const pipelineData = [
      { num: '01', title: 'Deterministic Workflow Engineering', desc: 'Mapped entire dispatch workflow to eliminate manual touchpoints' },
      { num: '02', title: 'Real-Time Data Pipeline', desc: 'Built WebSocket infrastructure for live GPS & status updates' },
      { num: '03', title: 'Analytics-First Architecture', desc: 'Implemented dimensional modeling for BI dashboards' },
      { num: '04', title: 'Role-Based Access Control', desc: 'Implemented fine-grained permissions & audit logging' }
    ];

    const capabilitiesData = [
      { title: 'Real-Time GPS Tracking Pipeline', description: 'Live vehicle position updates with geofencing & predictive arrival ETAs' },
      { title: 'Predictive Routing Algorithm', description: 'Machine learning–powered route optimization reducing drive time by 18%' },
      { title: 'Automated Dispatch Queues', description: 'Rules-based automatic task assignment based on vehicle capacity & location' },
      { title: 'Role-Based Access Layer', description: 'Fine-grained permission system for dispatchers, drivers, & management' },
      { title: 'Multi-Tenant Cost Allocation', description: 'Automatic cost tracking & billing segmentation per client' },
      { title: 'Compliance & Audit Logging', description: 'Complete audit trail for SOC 2 & regulatory requirements' },
      { title: 'Real-Time BI Dashboard', description: 'Live KPI monitoring with drill-down analytics capabilities' },
      { title: 'Mobile-First Driver Interface', description: 'React Native app for iOS & Android with offline-first capabilities' }
    ];

    const techSpecsData = [
      { category: 'Frontend', tech: 'React 18 + TypeScript', note: 'Server-side rendered for performance' },
      { category: 'Backend', tech: 'Node.js Express + GraphQL', note: 'Scalable API layer with subscription support' },
      { category: 'Real-time', tech: 'WebSocket + Socket.io', note: 'Sub-100ms broadcast latency' },
      { category: 'Database', tech: 'PostgreSQL + PostGIS', note: 'Geospatial queries for tracking' },
      { category: 'Cache', tech: 'Redis Cluster', note: 'Session & route cache management' },
      { category: 'Infrastructure', tech: 'Kubernetes + Docker', note: 'Auto-scaling based on load' }
    ];

    const deliverablesData = [
      { icon: '📈', title: 'Efficiency Gain', value: '67%', note: 'Dispatch time reduction vs. manual baseline' },
      { icon: '⏱️', title: 'ETA Accuracy', value: '94%', note: 'Within 5-minute window on 94% of deliveries' },
      { icon: '🎯', title: 'Route Optimization', value: '+18%', note: 'Average distance reduction per route' },
      { icon: '💰', title: 'Cost Savings', value: '$420K+', note: 'Annual operational cost reduction' }
    ];

    const detailData = {
      project_id: projectId,
      tagline: 'Enterprise Fleet Dispatch Platform',
      hero_stats: JSON.stringify(heroStatsData),
      screenshot_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
      archive_code: 'CS-LogiFlow-2024',
      year: 2024,
      
      overview_title: 'Project Overview',
      overview_description: 'LogiFlow is a unified, real-time dispatch platform built for large-scale logistics operators managing 200+ vehicles across multiple depots. The system combines predictive routing algorithms, real-time GPS tracking, and role-based access control into a single SPA that reduced operational inefficiency by 67% while improving customer satisfaction.',
      overview_meta: JSON.stringify(overviewMetaData),
      
      problem_title: 'The Operational Bottleneck',
      problem_description: 'The client relied on fragmented tools (spreadsheets, phone calls, multiple dispatch systems) resulting in manual routing, delayed response times, and zero visibility into real-time fleet status.',
      bottlenecks: JSON.stringify(bottlenecksData),
      
      solution_title: 'Our Approach: Deterministic Workflow Engineering',
      solution_description: 'Rather than building "yet another dispatch tool," we engineered a deterministic workflow that replaces manual decision-making with rule-based automation. Every dispatch decision is logged, auditable, and continuously optimized based on real-world performance metrics.',
      pipeline: JSON.stringify(pipelineData),
      
      capabilities_title: 'Key Implemented Capabilities',
      capabilities: JSON.stringify(capabilitiesData),
      
      tech_title: 'Inside the Product: Crafted for Speed & High-Stress Operations',
      tech_specs: JSON.stringify(techSpecsData),
      tech_image_url: 'https://images.unsplash.com/photo-1553117459-d10256231c64?auto=format&fit=crop&q=80&w=800',
      
      outcomes_title: 'The Outcome: Verified Deliverables',
      deliverables: JSON.stringify(deliverablesData),
      
      how_built_title: 'How It Was Built',
      how_built_description: 'Built with deterministic architecture principles, the system prioritizes predictability and auditability over feature count.',
      how_built_items: JSON.stringify([
        { phase: 'Discovery & Workflow Mapping', weeks: '2-3', description: 'Mapped entire dispatch workflow to identify automation opportunities' },
        { phase: 'Prototype & Validation', weeks: '2', description: 'Validated predictions with live pilot group' },
        { phase: 'Production Build & Deployment', weeks: '6-8', description: 'Engineered production-grade system with compliance & monitoring' },
        { phase: 'Optimization & Scaling', weeks: '4+', description: 'Continuous performance tuning & feature expansion' }
      ]),
      
      related_slugs: JSON.stringify(['travel-app', 'absensi-siswa-berbasis-qrcode'])
    };

    if (detailCheck.rows.length === 0) {
      // Insert new detail record
      await client.query(`
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
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9,
          $10, $11, $12,
          $13, $14, $15,
          $16, $17,
          $18, $19, $20,
          $21, $22,
          $23, $24, $25,
          $26
        )
      `, [
        detailData.project_id,
        detailData.tagline,
        detailData.hero_stats,
        detailData.screenshot_url,
        detailData.archive_code,
        detailData.year,
        detailData.overview_title,
        detailData.overview_description,
        detailData.overview_meta,
        detailData.problem_title,
        detailData.problem_description,
        detailData.bottlenecks,
        detailData.solution_title,
        detailData.solution_description,
        detailData.pipeline,
        detailData.capabilities_title,
        detailData.capabilities,
        detailData.tech_title,
        detailData.tech_specs,
        detailData.tech_image_url,
        detailData.outcomes_title,
        detailData.deliverables,
        detailData.how_built_title,
        detailData.how_built_description,
        detailData.how_built_items,
        detailData.related_slugs
      ]);
      console.log('✅ [Seed] Project detail inserted successfully!');
    } else {
      // Update existing detail record
      await client.query(`
        UPDATE project_details SET
          tagline = $2, hero_stats = $3, screenshot_url = $4, archive_code = $5, year = $6,
          overview_title = $7, overview_description = $8, overview_meta = $9,
          problem_title = $10, problem_description = $11, bottlenecks = $12,
          solution_title = $13, solution_description = $14, pipeline = $15,
          capabilities_title = $16, capabilities = $17,
          tech_title = $18, tech_specs = $19, tech_image_url = $20,
          outcomes_title = $21, deliverables = $22,
          how_built_title = $23, how_built_description = $24, how_built_items = $25,
          related_slugs = $26,
          updated_at = NOW()
        WHERE project_id = $1
      `, [
        detailData.project_id,
        detailData.tagline,
        detailData.hero_stats,
        detailData.screenshot_url,
        detailData.archive_code,
        detailData.year,
        detailData.overview_title,
        detailData.overview_description,
        detailData.overview_meta,
        detailData.problem_title,
        detailData.problem_description,
        detailData.bottlenecks,
        detailData.solution_title,
        detailData.solution_description,
        detailData.pipeline,
        detailData.capabilities_title,
        detailData.capabilities,
        detailData.tech_title,
        detailData.tech_specs,
        detailData.tech_image_url,
        detailData.outcomes_title,
        detailData.deliverables,
        detailData.how_built_title,
        detailData.how_built_description,
        detailData.how_built_items,
        detailData.related_slugs
      ]);
      console.log('✅ [Seed] Project detail updated successfully!');
    }

    console.log('[Seed] ✅ All seeds completed!');
    process.exit(0);
    
  } catch (err) {
    console.error('[Seed] ❌ Error:', err.message);
    process.exit(1);
  } finally {
    client.release();
  }
};

// Run if called directly
if (require.main === module) {
  seedProjectDetails();
}

module.exports = seedProjectDetails;
