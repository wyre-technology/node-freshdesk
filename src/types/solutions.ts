import type { Timestamp } from './common.js';

/**
 * Solution category — the top level of the knowledge-base hierarchy
 * (category → folder → article).
 *
 * @see https://developers.freshdesk.com/api/#solutions
 */
export interface SolutionCategory {
  id: number;
  name?: string;
  description?: string;
  /** Portal IDs this category is visible in. */
  visible_in_portals?: number[];
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface SolutionCategoryCreate {
  name: string;
  description?: string;
  visible_in_portals?: number[];
}

export type SolutionCategoryUpdate = Partial<SolutionCategoryCreate>;

/** Solution folder — belongs to a category, contains articles. */
export interface SolutionFolder {
  id: number;
  name?: string;
  description?: string;
  category_id?: number;
  /** 1=All, 2=Logged-in users, 3=Agents, 4=Selected companies. */
  visibility?: number;
  company_ids?: number[];
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface SolutionFolderCreate {
  name: string;
  description?: string;
  visibility?: number;
  company_ids?: number[];
}

export type SolutionFolderUpdate = Partial<SolutionFolderCreate>;

/** Solution article — belongs to a folder. */
export interface SolutionArticle {
  id: number;
  title?: string;
  description?: string;
  /** Plain-text version of {@link SolutionArticle.description}. */
  description_text?: string;
  /** 1=Draft, 2=Published. */
  status?: number;
  folder_id?: number;
  category_id?: number;
  agent_id?: number;
  type?: number;
  seo_data?: Record<string, unknown>;
  tags?: string[];
  hits?: number;
  thumbs_up?: number;
  thumbs_down?: number;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface SolutionArticleCreate {
  title: string;
  description: string;
  /** 1=Draft, 2=Published. */
  status: number;
  type?: number;
  tags?: string[];
  seo_data?: Record<string, unknown>;
}

export type SolutionArticleUpdate = Partial<SolutionArticleCreate>;
