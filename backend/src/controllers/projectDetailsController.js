const pool = require('../config/database');

// GET project detail by slug (Public)
exports.getProjectDetailBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const query = `
      SELECT 
        p.id, p.slug, p.title, p.category, p.description, p.tech, 
        p.image, p.link, p.order_index,
        pd.*
      FROM projects p
      LEFT JOIN project_details pd ON p.id = pd.project_id
      WHERE p.slug = $1
    `;
    
    const result = await pool.query(query, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Project tidak ditemukan' 
      });
    }
    
    const row = result.rows[0];
    const data = {
      // Basic project info
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.category,
      description: row.description,
      tech: JSON.parse(row.tech || '[]'),
      image: row.image,
      link: row.link,
      orderIndex: row.order_index,
      
      // Detail sections (if exists)
      detail: row.project_id ? {
        tagline: row.tagline,
        screenshotUrl: row.screenshot_url,
        heroStats: row.hero_stats,
        overviewBody: row.overview_body,
        overviewMeta: row.overview_meta,
        bottleneckIntro: row.bottleneck_intro,
        bottlenecks: row.bottlenecks,
        strategyBody: row.strategy_body,
        pipeline: row.pipeline,
        pipelineNote: row.pipeline_note,
        pipelineNoteRight: row.pipeline_note_right,
        capabilitiesIntro: row.capabilities_intro,
        capabilities: row.capabilities,
        techSpecs: row.tech_specs,
        deliverablesIntro: row.deliverables_intro,
        deliverables: row.deliverables,
        deliverablesDisclaimer: row.deliverables_disclaimer,
        relatedSlugs: row.related_slugs
      } : null
    };
    
    res.json({ status: 'success', data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memuat project detail.' });
  }
};

// GET project detail by ID (Admin - for editing)
exports.getProjectDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT pd.* FROM project_details pd
      WHERE pd.project_id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.json({ 
        status: 'success', 
        data: null,
        message: 'No detail data yet'
      });
    }
    
    res.json({ status: 'success', data: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal memuat project detail.' });
  }
};

// POST/PUT project detail (Admin)
exports.upsertProjectDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tagline,
      heroStats,
      overviewBody, overviewMeta,
      bottleneckIntro, bottlenecks,
      strategyBody, pipeline, pipelineNote, pipelineNoteRight,
      capabilitiesIntro, capabilities,
      techSpecs,
      deliverablesIntro, deliverables, deliverablesDisclaimer,
      relatedSlugs
    } = req.body;

    // Check if project exists
    const projectCheck = await pool.query('SELECT id FROM projects WHERE id = $1', [id]);
    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Project tidak ditemukan.' });
    }

    // Upsert project_details
    const query = `
      INSERT INTO project_details (
        project_id, tagline, hero_stats, overview_body, overview_meta,
        bottleneck_intro, bottlenecks, strategy_body, pipeline, pipeline_note, pipeline_note_right,
        capabilities_intro, capabilities, tech_specs,
        deliverables_intro, deliverables, deliverables_disclaimer, related_slugs
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      ON CONFLICT (project_id) DO UPDATE SET
        tagline = $2,
        hero_stats = $3,
        overview_body = $4,
        overview_meta = $5,
        bottleneck_intro = $6,
        bottlenecks = $7,
        strategy_body = $8,
        pipeline = $9,
        pipeline_note = $10,
        pipeline_note_right = $11,
        capabilities_intro = $12,
        capabilities = $13,
        tech_specs = $14,
        deliverables_intro = $15,
        deliverables = $16,
        deliverables_disclaimer = $17,
        related_slugs = $18,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const result = await pool.query(query, [
      id,
      tagline,
      JSON.stringify(heroStats || []),
      overviewBody,
      JSON.stringify(overviewMeta || []),
      bottleneckIntro,
      JSON.stringify(bottlenecks || []),
      strategyBody,
      JSON.stringify(pipeline || []),
      pipelineNote,
      pipelineNoteRight,
      capabilitiesIntro,
      JSON.stringify(capabilities || []),
      JSON.stringify(techSpecs || []),
      deliverablesIntro,
      JSON.stringify(deliverables || []),
      deliverablesDisclaimer,
      JSON.stringify(relatedSlugs || [])
    ]);

    res.json({ 
      status: 'success', 
      message: 'Project detail berhasil disimpan!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal menyimpan project detail.' });
  }
};
