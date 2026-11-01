/**
 * Project Detail Controller
 * 
 * Handles fetching and managing project case study details
 */

const pool = require('../config/database');

// ──── GET PROJECT DETAIL BY SLUG ────
exports.getProjectDetail = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        status: 'error',
        message: 'Project slug is required'
      });
    }

    const query = `
      SELECT 
        p.id,
        p.title,
        p.category,
        p.description,
        p.tech,
        p.image,
        p.link,
        p.slug,
        pd.tagline,
        pd.hero_stats,
        pd.screenshot_url,
        pd.archive_code,
        pd.year,
        pd.overview_title,
        pd.overview_description,
        pd.overview_meta,
        pd.problem_title,
        pd.problem_description,
        pd.bottlenecks,
        pd.solution_title,
        pd.solution_description,
        pd.pipeline,
        pd.capabilities_title,
        pd.capabilities,
        pd.tech_title,
        pd.tech_specs,
        pd.tech_image_url,
        pd.outcomes_title,
        pd.deliverables,
        pd.how_built_title,
        pd.how_built_description,
        pd.how_built_items,
        pd.related_slugs
      FROM projects p
      LEFT JOIN project_details pd ON p.id = pd.project_id
      WHERE p.slug = $1
    `;

    const result = await pool.query(query, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    const row = result.rows[0];
    const project = {
      id: row.id,
      title: row.title,
      category: row.category,
      description: row.description,
      tech: JSON.parse(row.tech || '[]'),
      image: row.image,
      link: row.link,
      slug: row.slug,
      detail: {
        tagline: row.tagline,
        heroStats: row.hero_stats ? JSON.parse(row.hero_stats) : [],
        screenshotUrl: row.screenshot_url,
        archiveCode: row.archive_code,
        year: row.year,
        overviewTitle: row.overview_title,
        overviewDescription: row.overview_description,
        overviewMeta: row.overview_meta ? JSON.parse(row.overview_meta) : [],
        problemTitle: row.problem_title,
        problemDescription: row.problem_description,
        bottlenecks: row.bottlenecks ? JSON.parse(row.bottlenecks) : [],
        solutionTitle: row.solution_title,
        solutionDescription: row.solution_description,
        pipeline: row.pipeline ? JSON.parse(row.pipeline) : [],
        capabilitiesTitle: row.capabilities_title,
        capabilities: row.capabilities ? JSON.parse(row.capabilities) : [],
        techTitle: row.tech_title,
        techSpecs: row.tech_specs ? JSON.parse(row.tech_specs) : [],
        techImageUrl: row.tech_image_url,
        outcomesTitle: row.outcomes_title,
        deliverables: row.deliverables ? JSON.parse(row.deliverables) : [],
        howBuiltTitle: row.how_built_title,
        howBuiltDescription: row.how_built_description,
        howBuiltItems: row.how_built_items ? JSON.parse(row.how_built_items) : [],
        relatedSlugs: row.related_slugs || []
      }
    };

    res.json({
      status: 'success',
      data: project
    });

  } catch (error) {
    console.error('[ProjectDetail] Error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch project detail'
    });
  }
};

// ──── UPDATE PROJECT DETAIL (Admin) ────
exports.updateProjectDetail = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      tagline,
      heroStats,
      screenshotUrl,
      archiveCode,
      year,
      overviewTitle,
      overviewDescription,
      overviewMeta,
      problemTitle,
      problemDescription,
      bottlenecks,
      solutionTitle,
      solutionDescription,
      pipeline,
      capabilitiesTitle,
      capabilities,
      techTitle,
      techSpecs,
      techImageUrl,
      outcomesTitle,
      deliverables,
      howBuiltTitle,
      howBuiltDescription,
      howBuiltItems,
      relatedSlugs
    } = req.body;

    const query = `
      UPDATE project_details SET
        tagline = COALESCE($2, tagline),
        hero_stats = COALESCE($3::jsonb, hero_stats),
        screenshot_url = COALESCE($4, screenshot_url),
        archive_code = COALESCE($5, archive_code),
        year = COALESCE($6, year),
        overview_title = COALESCE($7, overview_title),
        overview_description = COALESCE($8, overview_description),
        overview_meta = COALESCE($9::jsonb, overview_meta),
        problem_title = COALESCE($10, problem_title),
        problem_description = COALESCE($11, problem_description),
        bottlenecks = COALESCE($12::jsonb, bottlenecks),
        solution_title = COALESCE($13, solution_title),
        solution_description = COALESCE($14, solution_description),
        pipeline = COALESCE($15::jsonb, pipeline),
        capabilities_title = COALESCE($16, capabilities_title),
        capabilities = COALESCE($17::jsonb, capabilities),
        tech_title = COALESCE($18, tech_title),
        tech_specs = COALESCE($19::jsonb, tech_specs),
        tech_image_url = COALESCE($20, tech_image_url),
        outcomes_title = COALESCE($21, outcomes_title),
        deliverables = COALESCE($22::jsonb, deliverables),
        how_built_title = COALESCE($23, how_built_title),
        how_built_description = COALESCE($24, how_built_description),
        how_built_items = COALESCE($25::jsonb, how_built_items),
        related_slugs = COALESCE($26, related_slugs),
        updated_at = NOW()
      WHERE project_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [
      projectId,
      tagline,
      heroStats ? JSON.stringify(heroStats) : null,
      screenshotUrl,
      archiveCode,
      year,
      overviewTitle,
      overviewDescription,
      overviewMeta ? JSON.stringify(overviewMeta) : null,
      problemTitle,
      problemDescription,
      bottlenecks ? JSON.stringify(bottlenecks) : null,
      solutionTitle,
      solutionDescription,
      pipeline ? JSON.stringify(pipeline) : null,
      capabilitiesTitle,
      capabilities ? JSON.stringify(capabilities) : null,
      techTitle,
      techSpecs ? JSON.stringify(techSpecs) : null,
      techImageUrl,
      outcomesTitle,
      deliverables ? JSON.stringify(deliverables) : null,
      howBuiltTitle,
      howBuiltDescription,
      howBuiltItems ? JSON.stringify(howBuiltItems) : null,
      relatedSlugs ? relatedSlugs.join(',') : null
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Project detail not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Project detail updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('[ProjectDetail] Update error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update project detail'
    });
  }
};
