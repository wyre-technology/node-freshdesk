/**
 * Realistic Freshdesk API fixtures used by the resource tests. Field names
 * mirror the snake_case wire format.
 */

export const ticketFixture = {
  id: 1,
  subject: 'Support needed',
  description: '<p>My printer is on fire</p>',
  description_text: 'My printer is on fire',
  status: 2,
  priority: 1,
  source: 2,
  requester_id: 5,
  responder_id: 7,
  group_id: 3,
  company_id: 9,
  tags: ['hardware'],
  created_at: '2024-01-15T09:30:00Z',
  updated_at: '2024-01-15T09:30:00Z',
};

export const conversationFixture = {
  id: 100,
  ticket_id: 1,
  body: '<p>Have you tried turning it off and on again?</p>',
  body_text: 'Have you tried turning it off and on again?',
  private: false,
  user_id: 7,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
};

export const contactFixture = {
  id: 5,
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company_id: 9,
  active: true,
  created_at: '2024-01-10T00:00:00Z',
  updated_at: '2024-01-10T00:00:00Z',
};

export const agentFixture = {
  id: 7,
  available: true,
  ticket_scope: 1,
  group_ids: [3],
  role_ids: [1],
  contact: { name: 'Grace Hopper', email: 'grace@example.com', active: true },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const companyFixture = {
  id: 9,
  name: 'Acme Corp',
  domains: ['acme.example.com'],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const groupFixture = {
  id: 3,
  name: 'Tier 1',
  agent_ids: [7],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const categoryFixture = {
  id: 11,
  name: 'General',
  description: 'General knowledge base',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const folderFixture = {
  id: 21,
  name: 'FAQs',
  category_id: 11,
  visibility: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const articleFixture = {
  id: 31,
  title: 'How to reset your password',
  description: '<p>Click reset.</p>',
  status: 2,
  folder_id: 21,
  category_id: 11,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const slaPolicyFixture = {
  id: 41,
  name: 'Default SLA',
  is_default: true,
  active: true,
  position: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const businessHoursFixture = {
  id: 51,
  name: 'Default Business Hours',
  time_zone: 'UTC',
  is_default: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const cannedResponseFolderFixture = {
  id: 61,
  name: 'Personal',
  responses_count: 2,
  personal: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const cannedResponseFixture = {
  id: 71,
  title: 'Thanks',
  content: 'Thanks for reaching out!',
  content_html: '<p>Thanks for reaching out!</p>',
  folder_id: 61,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};
