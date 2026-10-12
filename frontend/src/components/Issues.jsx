
import { useEffect, useState } from 'react'
import {
  Orbit,
  Plus,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  CircleAlert,
  ClipboardList
} from 'lucide-react'

function Issues() {
  const [issues, setIssues] = useState([])
  const [projects, setProjects] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [status, setStatus] = useState('OPEN')
  const [projectId, setProjectId] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const API = 'https://devboard-production-c684.up.railway.app/api/issues'
  const PROJECT_API = 'https://devboard-production-c684.up.railway.app/api/projects'

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

  async function loadData() {
    setLoading(true)

    try {
      const headers = getHeaders()

      const [issueResponse, projectResponse] = await Promise.all([
        fetch(API, { headers }),
        fetch(PROJECT_API, { headers })
      ])

      if (!issueResponse.ok || !projectResponse.ok) {
        throw new Error('Unable to retrieve data')
      }

      setIssues(await issueResponse.json())
      setProjects(await projectResponse.json())
      setError('')
    } catch {
      setError('Could not load issues. Please check your login and backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function resetForm() {
    setTitle('')
    setDescription('')
    setPriority('MEDIUM')
    setStatus('OPEN')
    setProjectId('')
    setEditingId(null)
    setFormOpen(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!projectId) {
      setError('Please select a project.')
      return
    }

    const issueData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      projectId: Number(projectId)
    }

    if (!issueData.title) {
      setError('Please enter an issue title.')
      return
    }

    try {
      const response = await fetch(
        editingId === null ? API : `${API}/${editingId}`,
        {
          method: editingId === null ? 'POST' : 'PUT',
          headers: getHeaders(true),
          body: JSON.stringify(issueData)
        }
      )

      if (!response.ok) throw new Error()

      const wasEditing = editingId !== null

      resetForm()
      setSuccess(wasEditing ? 'Issue updated successfully!' : 'Issue registered successfully!')

      await loadData()
    } catch {
      setError('Could not save the issue. Please try again.')
    }
  }

  function editIssue(issue) {
    setEditingId(issue.id)
    setTitle(issue.title)
    setDescription(issue.description || '')
    setPriority(issue.priority || 'MEDIUM')
    setStatus(issue.status || 'OPEN')
    setProjectId(String(issue.projectId || ''))
    setError('')
    setSuccess('')
    setFormOpen(true)
  }

  async function deleteIssue(id) {
    if (!window.confirm('Are you sure you want to delete this issue?')) {
      return
    }

    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })

      if (!response.ok) throw new Error()

      if (editingId === id) resetForm()

      setSuccess('Issue deleted successfully!')
      await loadData()
    } catch {
      setError('Could not delete the issue.')
    }
  }

  function getProjectName(id) {
    const project = projects.find(p => Number(p.id) === Number(id))
    return project ? project.name : `Project #${id}`
  }

  const filteredIssues = issues.filter(issue => {
    const query = search.toLowerCase()

    const matchesSearch =
      (issue.title || '').toLowerCase().includes(query) ||
      (issue.description || '').toLowerCase().includes(query) ||
      getProjectName(issue.projectId).toLowerCase().includes(query) ||
      String(issue.id).includes(query)

    const matchesPriority =
      priorityFilter === 'ALL' || issue.priority === priorityFilter

    const matchesStatus =
      statusFilter === 'ALL' || issue.status === statusFilter

    return matchesSearch && matchesPriority && matchesStatus
  })

  return (
    <div className="issues-page">
      <section className="issues-hero">
        <div>
          <span className="eyebrow">
            <Orbit size={15} /> MISSION CONTROL / ISSUE TRACKER
          </span>

          <h1>Issue Management</h1>

          <p>
            Every issue, one place. Review reported problems,
            monitor priorities, and keep your projects on track.
          </p>
        </div>

        <div className="issues-hero-icon">
          <ClipboardList size={56} strokeWidth={1.3} />
        </div>
      </section>

      {error && (
        <div className="issue-message issue-error" role="alert">
          <CircleAlert size={18} />
          <span>{error}</span>
          <button onClick={() => setError('')} aria-label="Dismiss error">
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="issue-message issue-success" role="status">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} aria-label="Dismiss message">
            <X size={16} />
          </button>
        </div>
      )}

      <section className="issues-toolbar">
        <div>
          <h2>Registered Issues</h2>
          <p>
            Showing {filteredIssues.length} of {issues.length} issues
          </p>
        </div>

        <button
          className="issue-primary-button"
          onClick={() => {
            if (formOpen && editingId === null) {
              resetForm()
            } else {
              resetForm()
              setError('')
              setSuccess('')
              setFormOpen(true)
            }
          }}
        >
          {formOpen && editingId === null ? <X size={18} /> : <Plus size={18} />}
          {formOpen && editingId === null ? 'Close Form' : 'Add Issue'}
        </button>
      </section>

      {formOpen && (
        <section className="issue-form-panel">
          <div className="issue-form-heading">
            <span className="issue-form-icon">
              {editingId === null ? <Plus size={22} /> : <Pencil size={21} />}
            </span>

            <div>
              <h2>{editingId === null ? 'Register New Issue' : 'Edit Issue'}</h2>
              <p>Enter the issue details below.</p>
            </div>
          </div>

          {projects.length === 0 ? (
            <p>Create a project first before registering issues.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <label htmlFor="issue-title">Issue title *</label>
              <input
                id="issue-title"
                type="text"
                placeholder="e.g. Login page not responding"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />

              <label htmlFor="issue-description">Description</label>
              <textarea
                id="issue-description"
                placeholder="Describe the issue..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
              />

              <div className="issue-form-grid">
                <div>
                  <label htmlFor="issue-project">Project *</label>
                  <select
                    id="issue-project"
                    value={projectId}
                    onChange={e => setProjectId(e.target.value)}
                    required
                  >
                    <option value="">Select project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="issue-priority">Priority</label>
                  <select
                    id="issue-priority"
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="issue-status">Status</label>
                  <select
                    id="issue-status"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>

              <div className="issue-form-actions">
                <button className="issue-primary-button" type="submit">
                  {editingId === null ? 'Register Issue' : 'Save Changes'}
                </button>

                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      <section className="issue-table-panel">
        <div className="issue-filters">
          <input
            type="search"
            placeholder="Search issues, projects, or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search issues"
          />

          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            aria-label="Filter by priority"
          >
            <option value="ALL">All priorities</option>
            <option value="HIGH">High priority</option>
            <option value="MEDIUM">Medium priority</option>
            <option value="LOW">Low priority</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="ALL">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
          </select>

          <button
            type="button"
            className="issue-refresh-button"
            onClick={loadData}
            title="Refresh issues"
            aria-label="Refresh issues"
          >
            <RefreshCw size={17} />
          </button>
        </div>

        <div className="issue-table-scroll">
          <table className="issue-table">
            <thead>
              <tr>
                <th>Issue ID</th>
                <th>Issue Details</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="issue-table-empty">
                    <RefreshCw size={22} className="loading-icon" />
                    <p>Loading your registered issues...</p>
                  </td>
                </tr>
              ) : filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan="6" className="issue-table-empty">
                    <ClipboardList size={30} />
                    <p>
                      {issues.length === 0
                        ? 'No issues registered yet. Add your first issue!'
                        : 'No issues match your search or filters.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredIssues.map(issue => (
                  <tr key={issue.id}>
                    <td>
                      <span className="issue-id-tag">
                        #{String(issue.id).padStart(3, '0')}
                      </span>
                    </td>

                    <td className="issue-details-cell">
                      <strong>{issue.title}</strong>
                      <span>
                        {issue.description || 'No description provided'}
                      </span>
                    </td>

                    <td>
                      <span className="issue-project-name">
                        {getProjectName(issue.projectId)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`issue-priority-badge priority-${(issue.priority || 'MEDIUM').toLowerCase()}`}
                      >
                        <span className="badge-dot" />
                        {issue.priority || 'MEDIUM'}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`issue-status-badge status-${(issue.status || 'OPEN').toLowerCase()}`}
                      >
                        {issue.status === 'IN_PROGRESS'
                          ? 'IN PROGRESS'
                          : issue.status || 'OPEN'}
                      </span>
                    </td>

                    <td>
                      <div className="issue-table-actions">
                        <button
                          type="button"
                          className="issue-icon-button"
                          onClick={() => editIssue(issue)}
                          aria-label={`Edit issue ${issue.id}`}
                          title="Edit issue"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="issue-icon-button issue-delete-button"
                          onClick={() => deleteIssue(issue.id)}
                          aria-label={`Delete issue ${issue.id}`}
                          title="Delete issue"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="issue-table-footer">
          <span>ISSUE REGISTER / {filteredIssues.length} RECORDS</span>
          <span>LIVE DATA FROM DEVBOARD</span>
        </div>
      </section>
    </div>
  )
}

export default Issues
