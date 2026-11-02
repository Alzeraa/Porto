import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/api';

interface ProjectDetail {
  id: number;
  project_id: number;
  tagline: string;
  hero_stats: any[];
  screenshot_url: string;
  archive_code: string;
  year: number;
  overview_title: string;
  overview_description: string;
  overview_meta: any[];
  problem_title: string;
  problem_description: string;
  bottlenecks: any[];
  solution_title: string;
  solution_description: string;
  pipeline: any[];
  capabilities_title: string;
  capabilities: any[];
  tech_title: string;
  tech_specs: any[];
  tech_image_url: string;
  outcomes_title: string;
  deliverables: any[];
  how_built_title: string;
  how_built_description: string;
  how_built_items: any[];
  related_slugs: string[];
}

interface Project {
  id: number;
  slug: string;
  title: string;
}

const ProjectDetailsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectDetail, setProjectDetail] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch all projects
  useEffect(() => {
    fetch(API_ENDPOINTS.projects)
      .then(r => r.json())
      .then(data => {
        if (data.status === 'success' && Array.isArray(data.data)) {
          setProjects(data.data);
        }
      })
      .catch(err => console.error('Error fetching projects:', err));
  }, []);

  // Fetch project detail when selected
  useEffect(() => {
    if (!selectedProjectId) return;

    setLoading(true);
    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) return;

    fetch(`${API_ENDPOINTS.projectDetails}/${project.slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.status === 'success' && data.data && data.data.detail) {
          setProjectDetail({
            id: data.data.detail.id || 0,
            project_id: selectedProjectId,
            tagline: data.data.detail.tagline || '',
            hero_stats: data.data.detail.heroStats || [],
            screenshot_url: data.data.detail.screenshotUrl || '',
            archive_code: data.data.detail.archiveCode || '',
            year: data.data.detail.year || new Date().getFullYear(),
            overview_title: data.data.detail.overviewTitle || '',
            overview_description: data.data.detail.overviewDescription || '',
            overview_meta: data.data.detail.overviewMeta || [],
            problem_title: data.data.detail.problemTitle || '',
            problem_description: data.data.detail.problemDescription || '',
            bottlenecks: data.data.detail.bottlenecks || [],
            solution_title: data.data.detail.solutionTitle || '',
            solution_description: data.data.detail.solutionDescription || '',
            pipeline: data.data.detail.pipeline || [],
            capabilities_title: data.data.detail.capabilitiesTitle || '',
            capabilities: data.data.detail.capabilities || [],
            tech_title: data.data.detail.techTitle || '',
            tech_specs: data.data.detail.techSpecs || [],
            tech_image_url: data.data.detail.techImageUrl || '',
            outcomes_title: data.data.detail.outcomesTitle || '',
            deliverables: data.data.detail.deliverables || [],
            how_built_title: data.data.detail.howBuiltTitle || '',
            how_built_description: data.data.detail.howBuiltDescription || '',
            how_built_items: data.data.detail.howBuiltItems || [],
            related_slugs: data.data.detail.relatedSlugs || [],
          });
        }
      })
      .catch(err => {
        console.error('Error fetching detail:', err);
        setMessage('Error loading project detail');
      })
      .finally(() => setLoading(false));
  }, [selectedProjectId, projects]);

  const handleSave = async () => {
    if (!projectDetail) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.projectDetails}/${projectDetail.project_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('alzera_admin_token')}`
        },
        body: JSON.stringify({
          tagline: projectDetail.tagline,
          heroStats: projectDetail.hero_stats,
          screenshotUrl: projectDetail.screenshot_url,
          archiveCode: projectDetail.archive_code,
          year: projectDetail.year,
          overviewTitle: projectDetail.overview_title,
          overviewDescription: projectDetail.overview_description,
          overviewMeta: projectDetail.overview_meta,
          problemTitle: projectDetail.problem_title,
          problemDescription: projectDetail.problem_description,
          bottlenecks: projectDetail.bottlenecks,
          solutionTitle: projectDetail.solution_title,
          solutionDescription: projectDetail.solution_description,
          pipeline: projectDetail.pipeline,
          capabilitiesTitle: projectDetail.capabilities_title,
          capabilities: projectDetail.capabilities,
          techTitle: projectDetail.tech_title,
          techSpecs: projectDetail.tech_specs,
          techImageUrl: projectDetail.tech_image_url,
          outcomesTitle: projectDetail.outcomes_title,
          deliverables: projectDetail.deliverables,
          howBuiltTitle: projectDetail.how_built_title,
          howBuiltDescription: projectDetail.how_built_description,
          howBuiltItems: projectDetail.how_built_items,
          relatedSlugs: projectDetail.related_slugs,
        })
      });

      const data = await res.json();
      if (data.status === 'success') {
        setMessage('✅ Project detail saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Error saving project detail');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Error saving project detail');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700">
      <h2 className="text-2xl font-bold text-white mb-6">📝 Project Details Management</h2>

      {/* Project Selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-300 mb-2">Select Project</label>
        <select
          value={selectedProjectId || ''}
          onChange={(e) => setSelectedProjectId(e.target.value ? parseInt(e.target.value) : null)}
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg"
        >
          <option value="">Choose a project...</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="text-cyan-400 animate-pulse">Loading project detail...</div>
        </div>
      )}

      {/* Project Detail Form */}
      {projectDetail && !loading && (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Tagline</label>
              <input
                type="text"
                value={projectDetail.tagline}
                onChange={(e) => setProjectDetail({...projectDetail, tagline: e.target.value})}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Archive Code</label>
              <input
                type="text"
                value={projectDetail.archive_code}
                onChange={(e) => setProjectDetail({...projectDetail, archive_code: e.target.value})}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded text-sm"
              />
            </div>
          </div>

          {/* Overview */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Overview Description</label>
            <textarea
              value={projectDetail.overview_description}
              onChange={(e) => setProjectDetail({...projectDetail, overview_description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded text-sm"
            />
          </div>

          {/* Problem Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Problem Description</label>
            <textarea
              value={projectDetail.problem_description}
              onChange={(e) => setProjectDetail({...projectDetail, problem_description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded text-sm"
            />
          </div>

          {/* Solution Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Solution Description</label>
            <textarea
              value={projectDetail.solution_description}
              onChange={(e) => setProjectDetail({...projectDetail, solution_description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded text-sm"
            />
          </div>

          {/* Hero Stats JSON */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Hero Stats (JSON)</label>
            <textarea
              value={JSON.stringify(projectDetail.hero_stats, null, 2)}
              onChange={(e) => {
                try {
                  setProjectDetail({...projectDetail, hero_stats: JSON.parse(e.target.value)});
                } catch (err) {
                  // Invalid JSON, just update raw value
                }
              }}
              rows={4}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded text-sm font-mono text-xs"
            />
          </div>

          {/* Capabilities JSON */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Capabilities (JSON)</label>
            <textarea
              value={JSON.stringify(projectDetail.capabilities, null, 2)}
              onChange={(e) => {
                try {
                  setProjectDetail({...projectDetail, capabilities: JSON.parse(e.target.value)});
                } catch (err) {
                  // Invalid JSON, just update raw value
                }
              }}
              rows={5}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded text-sm font-mono text-xs"
            />
          </div>

          {/* Tech Specs JSON */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Tech Specs (JSON)</label>
            <textarea
              value={JSON.stringify(projectDetail.tech_specs, null, 2)}
              onChange={(e) => {
                try {
                  setProjectDetail({...projectDetail, tech_specs: JSON.parse(e.target.value)});
                } catch (err) {
                  // Invalid JSON, just update raw value
                }
              }}
              rows={4}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded text-sm font-mono text-xs"
            />
          </div>

          {/* Deliverables JSON */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Deliverables (JSON)</label>
            <textarea
              value={JSON.stringify(projectDetail.deliverables, null, 2)}
              onChange={(e) => {
                try {
                  setProjectDetail({...projectDetail, deliverables: JSON.parse(e.target.value)});
                } catch (err) {
                  // Invalid JSON, just update raw value
                }
              }}
              rows={4}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded text-sm font-mono text-xs"
            />
          </div>

          {/* Screenshots */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Screenshot URL</label>
            <input
              type="text"
              value={projectDetail.screenshot_url}
              onChange={(e) => setProjectDetail({...projectDetail, screenshot_url: e.target.value})}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded text-sm"
              placeholder="https://..."
            />
          </div>

          {/* Message */}
          {message && (
            <div className={`px-4 py-3 rounded text-sm font-semibold ${
              message.includes('✅') ? 'bg-green-900/40 text-green-400 border border-green-700' : 'bg-red-900/40 text-red-400 border border-red-700'
            }`}>
              {message}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 text-white font-bold rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : '💾 Save Project Detail'}
          </button>
        </div>
      )}

      {!selectedProjectId && !loading && (
        <div className="text-center py-12 bg-slate-800/40 rounded-lg border border-slate-700/50">
          <p className="text-slate-400">Select a project to start editing</p>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsAdmin;
