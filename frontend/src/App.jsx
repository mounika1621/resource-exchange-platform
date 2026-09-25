import React, { useEffect, useState } from 'react';
import { api } from './services/api';

const emptyResource = {
  title: '',
  category: '',
  description: '',
  condition: 'Good',
  availability: true
};

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('rep_token');

    if (!token) {
      setLoading(false);
      return;
    }

    api.me()
      .then((u) => {
        setUser(u);
        localStorage.setItem('rep_user', JSON.stringify(u));
      })
      .catch(() => {
        localStorage.removeItem('rep_token');
        localStorage.removeItem('rep_user');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (data) => {
    localStorage.setItem('rep_token', data.token);
    localStorage.setItem('rep_user', JSON.stringify(data.user));
    setUser(data.user);
    setPage('home');
  };

  const logout = () => {
    localStorage.removeItem('rep_token');
    localStorage.removeItem('rep_user');
    setUser(null);
    setPage('home');
  };

  const flash = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(''), 2500);
  };

  if (loading) {
    return (
      <div className="center">
        <div className="loader" />
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={login} />;
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand" onClick={() => setPage('home')}>
          Resource<span>Exchange</span>
        </div>

        <nav>
          <button onClick={() => setPage('home')}>Home</button>

          <button onClick={() => setPage('resources')}>
            Resources
          </button>
          <button onClick={() => setPage('smartmatch')}>
  Smart Match
</button>

          <button onClick={() => setPage('requests')}>
            My Requests
          </button>

          <button onClick={() => setPage('owner')}>
            Incoming Requests
          </button>

          {user.role === 'ADMIN' && (
            <button onClick={() => setPage('admin')}>
              Admin
            </button>
          )}

          <button
            className="outline"
            onClick={() => setPage('profile')}
          >
            Profile
          </button>

          <button className="danger" onClick={logout}>
            Logout
          </button>
        </nav>
      </header>

      {notice && <div className="toast">{notice}</div>}

      <main>
        {page === 'home' && (
          <Home user={user} go={setPage} />
        )}

        {page === 'resources' && (
          <Resources
            user={user}
            flash={flash}
          />
        )}
        {page === 'smartmatch' && (
  <SmartMatch
    user={user}
    flash={flash}
  />
)}

        {page === 'requests' && (
          <Requests
            mode="mine"
            flash={flash}
          />
        )}

        {page === 'owner' && (
          <Requests
            mode="owner"
            flash={flash}
          />
        )}

        {page === 'profile' && (
          <Profile
            user={user}
            setUser={setUser}
            flash={flash}
          />
        )}

        {page === 'admin' && user.role === 'ADMIN' && (
          <Admin flash={flash} />
        )}
      </main>
    </div>
  );
}

/* =========================
   AUTHENTICATION
========================= */

function Auth({ onLogin }) {
  const [mode, setMode] = useState('login');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data =
        mode === 'login'
          ? await api.login({
              email: form.email,
              password: form.password
            })
          : await api.register(form);

      onLogin(data);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="auth">
      <div className="auth-card">
        <div className="brand big">
          Resource<span>Exchange</span>
        </div>

        <p className="muted">
          Share resources. Find what you need.
        </p>

        <div className="tabs">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Login
          </button>

          <button
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={submit}>
          {mode === 'register' && (
            <>
              <label>
                Name
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value
                    })
                  }
                />
              </label>

              <label>
                Phone
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value
                    })
                  }
                />
              </label>
            </>
          )}

          <label>
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value
                })
              }
            />
          </label>

          <label>
            Password
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value
                })
              }
            />
          </label>

          <button className="primary full">
            {mode === 'login'
              ? 'Login'
              : 'Create Account'}
          </button>
        </form>

        {mode === 'login' && (
          <p className="hint">
            Admin demo: admin@resourceexchange.com / Admin@123
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================
   HOME DASHBOARD
========================= */

function Home({ user, go }) {
  const [stats, setStats] = useState({
    resources: 0,
    requests: 0,
    incoming: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [resources, requests, incoming] =
          await Promise.all([
            api.mineResources(),
            api.myRequests(),
            api.ownerRequests()
          ]);

        setStats({
          resources: resources.length,
          requests: requests.length,
          incoming: incoming.length
        });
      } catch {
        // Dashboard statistics are optional.
      }
    };

    loadStats();
  }, []);

  return (
    <section>
      <section className="hero">
        <div>
          <span className="pill">
            RESOURCE EXCHANGE PLATFORM
          </span>

          <h1>
            Exchange what you have.
            <br />
            <em>Find what you need.</em>
          </h1>

          <p>
            Manage your resources, discover useful items
            and send secure exchange requests through one
            platform.
          </p>

          <div className="actions">
            <button
              className="primary"
              onClick={() => go('resources')}
            >
              Explore Resources
            </button>

            <button
              className="secondary"
              onClick={() => go('requests')}
            >
              View My Requests
            </button>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-icon">⇄</div>

          <h3>Welcome, {user.name}</h3>

          <p>Role: {user.role}</p>

          <div className="mini-grid">
            <div>
              <b>Secure</b>
              <span>JWT Login</span>
            </div>

            <div>
              <b>Organized</b>
              <span>Resource Search</span>
            </div>

            <div>
              <b>Tracked</b>
              <span>Request Status</span>
            </div>

            <div>
              <b>Managed</b>
              <span>Admin Controls</span>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-stats">
        <DashboardCard
          title="My Resources"
          value={stats.resources}
          text="Resources you have shared"
          onClick={() => go('resources')}
        />

        <DashboardCard
          title="My Requests"
          value={stats.requests}
          text="Exchange requests you sent"
          onClick={() => go('requests')}
        />

        <DashboardCard
          title="Incoming Requests"
          value={stats.incoming}
          text="Requests for your resources"
          onClick={() => go('owner')}
        />
      </section>

      <section className="quick-panel">
        <h3>Quick Actions</h3>

        <div className="quick-actions">
          <button
            className="secondary"
            onClick={() => go('resources')}
          >
            Find Resources
          </button>

          <button
            className="secondary"
            onClick={() => go('resources')}
          >
            Add Resource
          </button>

          <button
            className="secondary"
            onClick={() => go('requests')}
          >
            My Requests
          </button>

          <button
            className="secondary"
            onClick={() => go('owner')}
          >
            Incoming Requests
          </button>
        </div>
      </section>
    </section>
  );
}

function DashboardCard({ title, value, text, onClick }) {
  return (
    <div
      className="dashboard-card"
      onClick={onClick}
    >
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{text}</small>
    </div>
  );
}

/* =========================
   RESOURCES
========================= */

function Resources({ user, flash }) {
  const [list, setList] = useState([]);

  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');

  const [mine, setMine] = useState(false);

  const [editing, setEditing] = useState(null);

  const [selectedResource, setSelectedResource] =
    useState(null);

  const load = async () => {
    try {
      const data = mine
        ? await api.mineResources()
        : await api.resources(q, cat);

      setList(data);
    } catch (e) {
      flash(e.message);
    }
  };

  useEffect(() => {
  load();
}, [mine, cat]);
  const search = async (e) => {
    e.preventDefault();
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this resource?')) {
      return;
    }

    try {
      await api.deleteResource(id);
      flash('Resource deleted');
      load();
    } catch (e) {
      flash(e.message);
    }
  };

  const request = async (id) => {
    try {
      await api.createRequest(id);
      flash('Exchange request submitted');
    } catch (e) {
      flash(e.message);
    }
  };

  return (
    <section>
      <div className="page-title">
        <div>
          <span className="pill">
            RESOURCE MANAGEMENT
          </span>

          <h2>
            {mine
              ? 'My Resources'
              : 'Find Resources'}
          </h2>
        </div>

        <button
          className="primary"
          onClick={() =>
            setEditing({
              ...emptyResource
            })
          }
        >
          + Add Resource
        </button>
      </div>

      <form
        className="searchbar"
        onSubmit={search}
      >
        <input
          placeholder="Search by title..."
          value={q}
          onChange={(e) =>
            setQ(e.target.value)
          }
        />

        <select
          value={cat}
          onChange={(e) =>
            setCat(e.target.value)
          }
        >
          <option value="">
            All categories
          </option>

          <option>Education</option>
          <option>Electronics</option>
          <option>Books</option>
          <option>Tools</option>
          <option>Other</option>
        </select>

        <button className="secondary">
          Search
        </button>

        <button
          type="button"
          className="linkbtn"
          onClick={() => setMine(!mine)}
        >
          {mine
            ? 'Show All'
            : 'My Resources'}
        </button>
      </form>

      {editing && (
        <ResourceForm
          resource={editing}
          onClose={() =>
            setEditing(null)
          }
          onSaved={() => {
            setEditing(null);
            flash('Resource saved');
            load();
          }}
        />
      )}

      {selectedResource && (
        <ResourceDetails
          resource={selectedResource}
          user={user}
          onClose={() =>
            setSelectedResource(null)
          }
          onRequest={async () => {
            await request(
              selectedResource.resourceId
            );
            setSelectedResource(null);
          }}
        />
      )}

      <div className="cards">
        {list.map((r) => (
          <article
            className="card"
            key={r.resourceId}
          >
            <div className="card-top">
              <span className="category">
                {r.category}
              </span>

              <span
                className={
                  r.availability
                    ? 'available'
                    : 'unavailable'
                }
              >
                {r.availability
                  ? 'Available'
                  : 'Unavailable'}
              </span>
            </div>

            <h3>{r.title}</h3>

            <p>{r.description}</p>

            <div className="meta">
              <span>
                Condition:{' '}
                {r.condition ||
                  'Not specified'}
              </span>

              <span>
                Owner: {r.ownerName}
              </span>
            </div>

            <div className="card-actions">
              <button
                onClick={() =>
                  setSelectedResource(r)
                }
              >
                View Details
              </button>

              {r.ownerId === userId() ? (
                <>
                  <button
                    onClick={() =>
                      setEditing({
                        ...r
                      })
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="danger-text"
                    onClick={() =>
                      remove(r.resourceId)
                    }
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  className="primary small"
                  disabled={!r.availability}
                  onClick={() =>
                    request(
                      r.resourceId
                    )
                  }
                >
                  {r.availability
                    ? 'Request Exchange'
                    : 'Unavailable'}
                </button>
              )}
            </div>
          </article>
        ))}

        {!list.length && (
          <div className="empty">
            No resources found.
          </div>
        )}
      </div>
    </section>
  );
}

const userId = () => {
  try {
    return JSON.parse(
      localStorage.getItem(
        'rep_user'
      ) || 'null'
    )?.userId;
  } catch {
    return null;
  }
};

/* =========================
   RESOURCE DETAILS
========================= */

function ResourceDetails({
  resource,
  user,
  onClose,
  onRequest
}) {
  const isOwner =
    resource.ownerId === user.userId;

  return (
    <div className="modal">
      <div className="modal-card">
        <div className="page-title">
          <div>
            <span className="pill">
              RESOURCE DETAILS
            </span>

            <h2>{resource.title}</h2>
          </div>

          <button
            className="iconbtn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="details-grid">
          <div>
            <span>Category</span>
            <strong>
              {resource.category}
            </strong>
          </div>

          <div>
            <span>Condition</span>
            <strong>
              {resource.condition ||
                'Not specified'}
            </strong>
          </div>

          <div>
            <span>Owner</span>
            <strong>
              {resource.ownerName}
            </strong>
          </div>

          <div>
            <span>Availability</span>
            <strong>
              {resource.availability
                ? 'Available'
                : 'Unavailable'}
            </strong>
          </div>
        </div>

        <div className="description-box">
          <h3>Description</h3>
          <p>{resource.description}</p>
        </div>

        <div className="actions">
          <button
            className="secondary"
            onClick={onClose}
          >
            Close
          </button>

          {!isOwner && (
            <button
              className="primary"
              disabled={!resource.availability}
              onClick={onRequest}
            >
              {resource.availability
                ? 'Request Exchange'
                : 'Currently Unavailable'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================
   RESOURCE FORM
========================= */

function ResourceForm({
  resource,
  onClose,
  onSaved
}) {
  const [form, setForm] =
    useState(resource);

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (form.resourceId) {
        await api.updateResource(
          form.resourceId,
          form
        );
      } else {
        await api.createResource(form);
      }

      onSaved();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="modal">
      <form
        className="modal-card"
        onSubmit={submit}
      >
        <div className="page-title">
          <h3>
            {form.resourceId
              ? 'Edit Resource'
              : 'Add Resource'}
          </h3>

          <button
            type="button"
            className="iconbtn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <label>
          Title

          <input
            required
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value
              })
            }
          />
        </label>

        <label>
          Category

          <select
            required
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category:
                  e.target.value
              })
            }
          >
            <option value="">
              Select category
            </option>

            <option>Education</option>
            <option>Electronics</option>
            <option>Books</option>
            <option>Tools</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Description

          <textarea
            required
            rows="4"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value
              })
            }
          />
        </label>

        <label>
          Condition

          <input
            value={form.condition}
            onChange={(e) =>
              setForm({
                ...form,
                condition:
                  e.target.value
              })
            }
          />
        </label>

        <label className="check">
          <input
            type="checkbox"
            checked={
              form.availability
            }
            onChange={(e) =>
              setForm({
                ...form,
                availability:
                  e.target.checked
              })
            }
          />

          Available for exchange
        </label>

        <div className="actions">
          <button
            type="button"
            className="secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button className="primary">
            Save Resource
          </button>
        </div>
      </form>
    </div>
  );
}

/* =========================
   MY REQUESTS / INCOMING
========================= */

function Requests({
  mode,
  flash
}) {
  const [list, setList] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const load = async () => {
    setLoading(true);

    try {
      const data =
        mode === 'mine'
          ? await api.myRequests()
          : await api.ownerRequests();

      setList(data);
    } catch (e) {
      flash(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [mode]);

  const update = async (
    id,
    status
  ) => {
    try {
      await api.updateRequestStatus(
        id,
        status
      );

      flash(
        `Request ${status.toLowerCase()}`
      );

      load();
    } catch (e) {
      flash(e.message);
    }
  };

  return (
    <section>
      <div className="page-title">
        <div>
          <span className="pill">
            EXCHANGE WORKFLOW
          </span>

          <h2>
            {mode === 'mine'
              ? 'My Exchange Requests'
              : 'Incoming Requests'}
          </h2>

          <p className="muted">
            {mode === 'mine'
              ? 'Track the resources you have requested.'
              : 'Manage exchange requests received for your resources.'}
          </p>
        </div>

        <button
          className="secondary"
          onClick={load}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="center">
          <div className="loader" />
          Loading requests...
        </div>
      ) : !list.length ? (
        <div className="empty">
          <h3>
            {mode === 'mine'
              ? 'No exchange requests yet'
              : 'No incoming requests'}
          </h3>

          <p>
            {mode === 'mine'
              ? 'When you request a resource, it will appear here.'
              : 'Requests from other users will appear here.'}
          </p>
        </div>
      ) : (
        <div className="request-grid">
          {list.map((r) => (
            <RequestCard
              key={r.requestId}
              request={r}
              mode={mode}
              update={update}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function RequestCard({
  request,
  mode,
  update
}) {
  return (
    <article className="request-card">
      <div className="request-card-header">
        <div>
          <span className="pill">
            REQUEST #{request.requestId}
          </span>

          <h3>
            {request.resourceTitle}
          </h3>
        </div>

        <span
          className={`status ${request.status.toLowerCase()}`}
        >
          {request.status}
        </span>
      </div>

      <div className="request-info">
        <div>
          <span>
            {mode === 'mine'
              ? 'Resource Owner'
              : 'Requester'}
          </span>

          <strong>
            {mode === 'mine'
              ? request.ownerName
              : request.requesterName}
          </strong>
        </div>

        <div>
          <span>Request Date</span>

          <strong>
            {request.requestDate
              ? new Date(
                  request.requestDate
                ).toLocaleDateString()
              : 'N/A'}
          </strong>
        </div>

        <div>
          <span>Resource</span>

          <strong>
            {request.resourceTitle}
          </strong>
        </div>
      </div>

      <div className="request-actions">
        {mode === 'mine' &&
          request.status ===
            'PENDING' && (
            <button
              className="reject"
              onClick={() =>
                update(
                  request.requestId,
                  'CANCELLED'
                )
              }
            >
              Cancel Request
            </button>
          )}

        {mode === 'owner' &&
          request.status ===
            'PENDING' && (
            <>
              <button
                className="accept"
                onClick={() =>
                  update(
                    request.requestId,
                    'ACCEPTED'
                  )
                }
              >
                ✓ Accept
              </button>

              <button
                className="reject"
                onClick={() =>
                  update(
                    request.requestId,
                    'REJECTED'
                  )
                }
              >
                ✕ Reject
              </button>
            </>
          )}

        {request.status ===
          'ACCEPTED' && (
          <span className="success-message">
            Exchange request accepted
          </span>
        )}

        {request.status ===
          'REJECTED' && (
          <span className="error-message">
            Request was rejected
          </span>
        )}

        {request.status ===
          'CANCELLED' && (
          <span className="muted">
            Request cancelled
          </span>
        )}

        {request.status ===
          'COMPLETED' && (
          <span className="success-message">
            Exchange completed
          </span>
        )}
      </div>
    </article>
  );
}

/* =========================
   PROFILE
========================= */

function Profile({
  user,
  setUser,
  flash
}) {
  const [form, setForm] =
    useState({
      name: user.name,
      phone: user.phone || ''
    });

  const save = async (e) => {
    e.preventDefault();

    try {
      const updated =
        await api.updateProfile(
          form
        );

      setUser(updated);

      localStorage.setItem(
        'rep_user',
        JSON.stringify(updated)
      );

      flash('Profile updated');
    } catch (e) {
      flash(e.message);
    }
  };

  return (
    <section className="narrow">
      <span className="pill">
        ACCOUNT
      </span>

      <h2>My Profile</h2>

      <div className="profile-summary">
        <div className="profile-avatar">
          {user.name
            ?.charAt(0)
            ?.toUpperCase()}
        </div>

        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <span className="status accepted">
            {user.role}
          </span>
        </div>
      </div>

      <form
        className="panel"
        onSubmit={save}
      >
        <label>
          Name

          <input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
            }
          />
        </label>

        <label>
          Email

          <input
            disabled
            value={user.email}
          />
        </label>

        <label>
          Phone

          <input
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value
              })
            }
          />
        </label>

        <button className="primary">
          Update Profile
        </button>
      </form>
    </section>
  );
}

/* =========================
   ADMIN
========================= */

function Admin({ flash }) {
  const [tab, setTab] =
    useState('users');

  const [users, setUsers] =
    useState([]);

  const [requests, setRequests] =
    useState([]);

  const load = async () => {
    try {
      if (tab === 'users') {
        setUsers(
          await api.adminUsers()
        );
      } else {
        setRequests(
          await api.adminRequests()
        );
      }
    } catch (e) {
      flash(e.message);
    }
  };

  useEffect(() => {
    load();
  }, [tab]);

  const toggle = async (user) => {
    try {
      await api.adminToggleUser(
        user.userId,
        !user.enabled
      );

      flash(
        'User status updated'
      );

      load();
    } catch (e) {
      flash(e.message);
    }
  };

  const status = async (
    id,
    value
  ) => {
    try {
      await api.adminRequestStatus(
        id,
        value
      );

      flash(
        `Request ${value.toLowerCase()}`
      );

      load();
    } catch (e) {
      flash(e.message);
    }
  };

  return (
    <section>
      <div className="page-title">
        <div>
          <span className="pill">
            ADMIN CONSOLE
          </span>

          <h2>
            System Management
          </h2>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={
            tab === 'users'
              ? 'active'
              : ''
          }
          onClick={() =>
            setTab('users')
          }
        >
          Manage Users
        </button>

        <button
          className={
            tab === 'requests'
              ? 'active'
              : ''
          }
          onClick={() =>
            setTab('requests')
          }
        >
          Manage Requests
        </button>
      </div>

      {tab === 'users' ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.userId}>
                  <td>
                    {u.userId}
                  </td>

                  <td>{u.name}</td>

                  <td>{u.email}</td>

                  <td>{u.role}</td>

                  <td>
                    {u.enabled
                      ? 'Enabled'
                      : 'Disabled'}
                  </td>

                  <td>
                    {u.role !==
                      'ADMIN' && (
                      <button
                        onClick={() =>
                          toggle(u)
                        }
                      >
                        {u.enabled
                          ? 'Disable'
                          : 'Enable'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Resource</th>
                <th>Requester</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((r) => (
                <tr key={r.requestId}>
                  <td>
                    #{r.requestId}
                  </td>

                  <td>
                    {r.resourceTitle}
                  </td>

                  <td>
                    {r.requesterName}
                  </td>

                  <td>
                    {r.ownerName}
                  </td>

                  <td>
                    <span
                      className={`status ${r.status.toLowerCase()}`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td>
                    {r.status ===
                      'PENDING' && (
                      <>
                        <button
                          className="accept"
                          onClick={() =>
                            status(
                              r.requestId,
                              'ACCEPTED'
                            )
                          }
                        >
                          Accept
                        </button>

                        <button
                          className="reject"
                          onClick={() =>
                            status(
                              r.requestId,
                              'REJECTED'
                            )
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
/* =========================
   SMART RESOURCE MATCHING
========================= */

function SmartMatch({ user, flash }) {

  const [requirement, setRequirement] =
    useState('');

  const [results, setResults] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const search = async (e) => {

    e.preventDefault();

    if (!requirement.trim()) {
      flash('Enter what resource you need');
      return;
    }

    try {

      setLoading(true);

      const data =
        await api.smartMatch(
          requirement
        );

      setResults(data);

    } catch (e) {

      flash(e.message);

    } finally {

      setLoading(false);
    }
  };

  const requestResource = async (id) => {

    try {

      await api.createRequest(id);

      flash(
        'Exchange request submitted'
      );

    } catch (e) {

      flash(e.message);
    }
  };

  return (
    <section>

      <div className="page-title">

        <div>

          <span className="pill">
            SMART RESOURCE MATCHING
          </span>

          <h2>
            Find Your Best Match
          </h2>

          <p className="muted">
            Describe what you need and the
            system will find matching resources.
          </p>

        </div>

      </div>

      <form
        className="smart-match-box"
        onSubmit={search}
      >

        <input
          type="text"
          placeholder="Example: I need a laptop for programming"
          value={requirement}
          onChange={(e) =>
            setRequirement(
              e.target.value
            )
          }
        />

        <button
          className="primary"
          disabled={loading}
        >
          {loading
            ? 'Finding...'
            : '🤖 Find Smart Matches'}
        </button>

      </form>

      {loading && (
        <div className="center">
          <div className="loader" />
          Finding suitable resources...
        </div>
      )}

      {!loading &&
        requirement &&
        results.length === 0 && (
          <div className="empty">

            <h3>
              No matching resources found
            </h3>

            <p>
              Try describing your requirement
              using different keywords.
            </p>

          </div>
        )}

      <div className="cards">

        {results.map((r) => (

          <article
            className="card smart-card"
            key={r.resourceId}
          >

            <div className="card-top">

              <span className="category">
                {r.category}
              </span>

              <span className="match-score">
                {r.matchScore}% Match
              </span>

            </div>

            <h3>
              {r.title}
            </h3>

            <p>
              {r.description}
            </p>

            <div className="meta">

              <span>
                Condition:{' '}
                {r.condition ||
                  'Not specified'}
              </span>

              <span>
                Available
              </span>

            </div>

            <div className="card-actions">

              <button
                className="primary small"
                onClick={() =>
                  requestResource(
                    r.resourceId
                  )
                }
              >
                Request Exchange
              </button>

            </div>

          </article>

        ))}

      </div>

    </section>
  );
}
export default App;