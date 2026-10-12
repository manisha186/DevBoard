
import { useEffect, useState } from 'react'
import {
  Rocket,
  Plus,
  Pencil,
  Trash2,
  X,
  FolderKanban,
  RefreshCw,
  Orbit
} from 'lucide-react'

function Projects() {
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)

  const API_URL = 'https://devboard-production-c684.up.railway.app/api/projects'

  function getHeaders(includeContentType = false) {
    const token = localStorage.getItem('token')

    return {
      ...(includeContentType && {
        'Content-Type': 'application/json'
      }),
      ...(token && {
        Authorization: `Bearer ${token}`
      })
    }
  }

  async function fetchProjects() {
    setLoading(true)

    try {
      const response = await fetch(API_URL, {
        headers: getHeaders()
      })

      if (!response.ok) throw new Error()

      setProjects(await response.json())
      setError('')
    } catch {
      setError('Unable to retrieve projects. Check your backend connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name.trim()) {
      setError('Please enter a project name.')
      return
    }

    const projectData = {
      name: name.trim(),
      description: description.trim()
    }

    try {
      const response = await fetch(
        editingId === null ? API_URL : `${API_URL}/${editingId}`,
        {
          method: editingId === null ? 'POST' : 'PUT',
          headers: getHeaders(true),
          body: JSON.stringify(projectData)
        }
      )

      if (!response.ok) throw new Error()

      const wasEditing = editingId !== null

      setName('')
      setDescription('')
      setEditingId(null)
      setFormOpen(false)
      setSuccess(wasEditing ? 'project updated successfully!' : 'New project launched!')

      await fetchProjects()
    } catch {
      setError('Could not save this project. Please try again.')
    }
  }

  function editProject(project) {
    setEditingId(project.id)
    setName(project.name)
    setDescription(project.description || '')
    setError('')
    setSuccess('')
    setFormOpen(true)
  }

  async function deleteProject(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    )

    if (!confirmed) return

    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })

      if (!response.ok) throw new Error()

      if (editingId === id) cancelEdit()

      setSuccess('project deleted successfully!')
      await fetchProjects()
    } catch {
      setError('Could not delete this project.')
    }
  }

  function cancelEdit() {
    setEditingId(null)
    setName('')
    setDescription('')
    setError('')
    setFormOpen(false)
  }

  return (
    <div className="projects-page">
      <section className="projects-hero">
        <div>
          <span className="eyebrow">
            <Orbit size={15} /> project CONTROL / PROJECTS
          </span>

          <h1>Project Directory</h1>

          <p>
            Every great idea starts somewhere. Organize your projects,
            track Your Projects, and bring your team's ideas to life.
          </p>
        </div>

        <div className="projects-hero-icon">
          <Rocket size={58} strokeWidth={1.3} />
        </div>
      </section>

      <section className="projects-toolbar">
        <div>
          <h2>Your Projects</h2>
          <p>
            {projects.length} {projects.length === 1 ? 'project' : 'projects'} registered
          </p>
        </div>

        <button
          className="launch-button"
          onClick={() => {
            if (formOpen && editingId === null) {
              cancelEdit()
            } else {
              setEditingId(null)
              setName('')
              setDescription('')
              setError('')
              setSuccess('')
              setFormOpen(true)
            }
          }}
        >
          {formOpen && editingId === null ? <X size={18} /> : <Plus size={18} />}
          {formOpen && editingId === null ? 'Close Form' : 'New project'}
        </button>
      </section>

      {error && (
        <div className="project-message project-error" role="alert">
          {error}
          <button onClick={() => setError('')} aria-label="Dismiss error">
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="project-message project-success" role="status">
          {success}
          <button onClick={() => setSuccess('')} aria-label="Dismiss message">
            <X size={16} />
          </button>
        </div>
      )}

      {formOpen && (
        <section className="project-form-panel">
          <div className="project-form-heading">
            <span className="project-form-icon">
              {editingId === null ? <Rocket size={22} /> : <Pencil size={22} />}
            </span>

            <div>
              <h2>{editingId === null ? 'Launch a project' : 'Update project'}</h2>
              <p>
                {editingId === null
                  ? 'Enter the details for your new project.'
                  : 'Modify the details of your existing project.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="project-name">project name *</label>
            <input
              id="project-name"
              type="text"
              placeholder="e.g. Smart Campus Platform"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={100}
              required
            />

            <label htmlFor="project-description">project description</label>
            <textarea
              id="project-description"
              placeholder="What are you and your team building?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              maxLength={1000}
            />

            <div className="project-form-actions">
              <button className="launch-button" type="submit">
                <Rocket size={17} />
                {editingId === null ? 'Launch project' : 'Save Changes'}
              </button>

              <button type="button" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="projects-grid">
        {loading ? (
          <div className="projects-empty">
            <RefreshCw size={28} className="loading-icon" />
            <h3>Scanning the galaxy...</h3>
            <p>Retrieving your registered projects.</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="projects-empty">
            <FolderKanban size={38} />
            <h3>No projects launched yet</h3>
            <p>Your next big idea belongs here. Launch your first project!</p>

            <button className="launch-button" onClick={() => setFormOpen(true)}>
              <Plus size={17} /> Create First project
            </button>
          </div>
        ) : (
          projects.map((project, index) => (
            <article className="project-project-card" key={project.id}>
              <div className="project-card-top">
                <span className="project-rocket-icon">
                  <Rocket size={23} />
                </span>

                <span className="project-code">
                  MS-{String(project.id).padStart(3, '0')}
                </span>
              </div>

              <div className="project-card-body">
                <span className="project-label">
                  {index % 2 === 0 ? 'project RECORD' : 'PROJECT RECORD'}
                </span>

                <h3>{project.name}</h3>

                <p>
                  {project.description || 'No project briefing added yet.'}
                </p>
              </div>

              <div className="project-card-footer">
                <span className="project-status">
                  <span className="status-dot" /> Registered
                </span>

                <div className="project-actions">
                  <button
                    type="button"
                    className="icon-action"
                    onClick={() => editProject(project)}
                    aria-label={`Edit ${project.name}`}
                    title="Edit project"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    className="icon-action delete-action"
                    onClick={() => deleteProject(project.id)}
                    aria-label={`Delete ${project.name}`}
                    title="Delete project"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  )
}

export default Projects
