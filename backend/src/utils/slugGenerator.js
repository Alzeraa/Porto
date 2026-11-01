/**
 * Generate URL-friendly slug from title
 * Converts "LogiFlow Dispatch & Fleet Portal" to "logiflow-dispatch-fleet-portal"
 */
exports.generateSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w\-]/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^\-+|\-+$/g, '');
};

/**
 * Generate unique slug with numeric suffix if collision occurs
 * Example: "my-project-1", "my-project-2", etc.
 */
exports.generateUniqueSlug = async (pool, title, excludeId = null) => {
  let baseSlug = exports.generateSlug(title);
  let slug = baseSlug;
  let counter = 1;
  
  try {
    while (true) {
      let query = `SELECT id FROM projects WHERE slug = $1`;
      let params = [slug];
      
      // If updating, exclude current ID from conflict check
      if (excludeId) {
        query += ` AND id != $2`;
        params.push(excludeId);
      }
      
      const result = await pool.query(query, params);
      
      if (result.rows.length === 0) {
        // Slug is unique
        return slug;
      }
      
      // Slug exists, try with number suffix
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  } catch (error) {
    console.error('[SlugGenerator] Error checking slug uniqueness:', error.message);
    // Return base slug if there's an error
    return baseSlug;
  }
};
