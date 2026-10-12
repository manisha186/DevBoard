
import { useEffect, useState } from 'react'
import {
  FolderKanban,
  CircleAlert,
  Activity,
  CircleCheck,
  Rocket,
  Orbit,
  RefreshCw
} from 'lucide-react'

function Dashboard() {
  const [projects, setProjects] = useState([])
  const [issues, setIssues] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadDashboard() {
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const [projectResponse, issueResponse] = await Promise.all([
        fetch('https://devboard-production-c684.up.railway.app/api/projects', { headers }),
        fetch('https://devboard-production-c684.up.railway.app/api/issues', { headers })
      ])

      if (!projectResponse.ok || !issueResponse.ok) {
        throw new Error('Failed to load dashboard data')
      }

      const projectData = await projectResponse.json()
      const issueData = await issueResponse.json()

      setProjects(projectData)
      setIssues(issueData)
      setError('')
    } catch {
      setError('Unable to connect to Mission Control. Check that your backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const inProgress = issues.filter(
    issue => issue.status === 'IN_PROGRESS'
  ).length

  const completed = issues.filter(
    issue => issue.status === 'CLOSED'
  ).length

  const openIssues = issues.filter(
    issue => issue.status === 'OPEN'
  ).length

  const stats = [
    {
      title: 'Total Missions',
      count: projects.length,
      icon: FolderKanban,
      color: '#22d3ee',
      note: 'Registered projects'
    },
    {
      title: 'Open Issues',
      count: openIssues,
      icon: CircleAlert,
      color: '#f59e0b',
      note: 'Awaiting action'
    },
    {
      title: 'In Progress',
      count: inProgress,
      icon: Activity,
      color: '#8b5cf6',
      note: 'Currently active'
    },
    {
      title: 'Landed',
      count: completed,
      icon: CircleCheck,
      color: '#34d399',
      note: 'Closed issues'
    }
  ]

  return (
    <div className="mission-dashboard">
      <section className="mission-hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Orbit size={15} /> MISSION CONTROL / OVERVIEW
          </span>

          <h1>Your universe of work.</h1>

          <p>
            Track missions, monitor issues, and keep your team
            moving towards the next milestone.
          </p>
        </div>

        <div className="hero-rocket">
          <div className="rocket-orbit orbit-one" />
          <div className="rocket-orbit orbit-two" />
          <Rocket size={68} strokeWidth={1.2} />
          <span className="rocket-star star-one">✦</span>
          <span className="rocket-star star-two">✧</span>
        </div>
      </section>

      {error && (
        <div className="dashboard-error" role="alert">
          <CircleAlert size={20} />
          <span>{error}</span>
          <button onClick={loadDashboard}>
            <RefreshCw size={15} /> Retry
          </button>
        </div>
      )}

      <section className="mission-stats">
        {stats.map((stat, index) => {
          const Icon = stat.icon

          return (
            <article
              className="mission-stat-card"
              key={stat.title}
              style={{ '--stat-color': stat.color, '--card-index': index }}
            >
              <div className="stat-top">
                <span className="stat-icon">
                  <Icon size={22} />
                </span>
                <span className="stat-indicator">LIVE</span>
              </div>

              <p className="stat-title">{stat.title}</p>

              <h2 className="stat-number">
                {loading ? '—' : stat.count}
              </h2>

              <p className="stat-note">{stat.note}</p>

              <div className="stat-glow" />
            </article>
          )
        })}
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">EXPLORE YOUR SPACE</span>
            <h2>Active Missions</h2>
          </div>

          <span className="section-count">
            {projects.length} PROJECTS
          </span>
        </div>

        {loading ? (
          <div className="dashboard-empty">
            Scanning the galaxy for your missions...
          </div>
        ) : projects.length === 0 ? (
          <div className="dashboard-empty">
            <Rocket size={30} />
            <h3>Your universe is waiting.</h3>
            <p>
              Create your first project in the Projects section
              to launch your first mission.
            </p>
          </div>
        ) : (
          <div className="mission-grid">
            {projects.map(project => {
              const projectIssues = issues.filter(
                issue => Number(issue.projectId) === Number(project.id)
              )

              const closedIssues = projectIssues.filter(
                issue => issue.status === 'CLOSED'
              ).length

              const progress = projectIssues.length
                ? Math.round((closedIssues / projectIssues.length) * 100)
                : 0

              return (
                <article className="mission-card" key={project.id}>
                  <div className="mission-card-top">
                    <span className="mission-card-icon">
                      <Rocket size={20} />
                    </span>

                    <span className="mission-id">
                      MS-{String(project.id).padStart(3, '0')}
                    </span>
                  </div>

                  <h3>{project.name}</h3>

                  <p className="mission-description">
                    {project.description || 'No mission description provided.'}
                  </p>

                  <div className="progress-label">
                    <span>Mission progress</span>
                    <strong>{progress}%</strong>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="mission-card-footer">
                    <span>{projectIssues.length} issues</span>
                    <span>{closedIssues} landed</span>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">RECENT ACTIVITY</span>
            <h2>Issue Tracking</h2>
          </div>

          <span className="section-count">
            {issues.length} ISSUES
          </span>
        </div>

        {loading ? (
          <div className="dashboard-empty">
            Retrieving your issue reports...
          </div>
        ) : issues.length === 0 ? (
          <div className="dashboard-empty">
            No issues detected. Enjoy the calm before launch!
          </div>
        ) : (
          <div className="recent-issues">
            {issues.slice(-5).reverse().map(issue => (
              <article className="recent-issue-row" key={issue.id}>
                <div className="issue-row-icon">
                  <CircleAlert size={19} />
                </div>

                <div className="issue-row-details">
                  <h3>{issue.title}</h3>
                  <p>
                    {issue.description || 'No additional details'}
                  </p>
                </div>

                <span className={`priority-tag priority-${(issue.priority || 'medium').toLowerCase()}`}>
                  {issue.priority || 'MEDIUM'}
                </span>

                <span className={`status-tag status-${(issue.status || 'open').toLowerCase()}`}>
                  {(issue.status || 'OPEN').replace('_', ' ')}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard
