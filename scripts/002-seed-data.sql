-- Insert demo user
INSERT INTO users (id, name, email, avatar_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'John Doe', 'john@example.com', NULL),
  ('22222222-2222-2222-2222-222222222222', 'Jane Smith', 'jane@example.com', NULL),
  ('33333333-3333-3333-3333-333333333333', 'Bob Wilson', 'bob@example.com', NULL);

-- Insert demo workspace
INSERT INTO workspaces (id, name, owner_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Acme Corp', '11111111-1111-1111-1111-111111111111');

-- Insert workspace members
INSERT INTO workspace_members (user_id, workspace_id, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'member'),
  ('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'member');

-- Insert demo projects
INSERT INTO projects (id, name, description, workspace_id) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Website Redesign', 'Complete overhaul of the company website', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Mobile App', 'Native mobile application development', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'API Integration', 'Third-party API integrations', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

-- Insert demo tasks
INSERT INTO tasks (title, description, status, priority, due_date, project_id, assignee_id) VALUES
  ('Design homepage mockup', 'Create initial wireframes and visual design', 'done', 'high', '2025-01-15', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222'),
  ('Implement responsive layout', 'Make design work on all screen sizes', 'in_progress', 'high', '2025-01-20', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111'),
  ('Set up CI/CD pipeline', 'Configure automated deployment', 'todo', 'medium', '2025-01-25', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NULL),
  ('User authentication flow', 'Implement login and registration', 'in_progress', 'high', '2025-01-18', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111'),
  ('Push notifications', 'Add push notification support', 'todo', 'medium', '2025-02-01', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333'),
  ('App store submission', 'Prepare and submit to app stores', 'todo', 'low', '2025-02-15', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NULL),
  ('Payment gateway integration', 'Connect Stripe for payments', 'done', 'high', '2025-01-10', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222'),
  ('Analytics setup', 'Implement tracking and analytics', 'in_progress', 'medium', '2025-01-22', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333'),
  ('Documentation', 'Write API documentation', 'todo', 'low', '2025-02-05', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NULL);
