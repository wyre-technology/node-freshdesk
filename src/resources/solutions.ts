import type { HttpClient } from '../http.js';
import type {
  SolutionCategory,
  SolutionCategoryCreate,
  SolutionCategoryUpdate,
  SolutionFolder,
  SolutionFolderCreate,
  SolutionFolderUpdate,
  SolutionArticle,
  SolutionArticleCreate,
  SolutionArticleUpdate,
} from '../types/solutions.js';

/**
 * Solutions knowledge base: categories → folders → articles.
 *
 * Categories live at `/solutions/categories`. Folders are created/listed under
 * a category but read/updated/deleted by their own id at `/solutions/folders`.
 * Articles follow the same nesting under `/solutions/articles`.
 *
 * @see https://developers.freshdesk.com/api/#solutions
 */
export class SolutionsResource {
  constructor(private readonly getClient: () => Promise<HttpClient>) {}

  // --- Categories ---------------------------------------------------------

  /** `GET /solutions/categories` — list all categories. */
  async listCategories(): Promise<SolutionCategory[]> {
    const client = await this.getClient();
    return client.request<SolutionCategory[]>('/solutions/categories');
  }

  /** `GET /solutions/categories/{id}` — fetch a single category. */
  async getCategory(id: number): Promise<SolutionCategory> {
    const client = await this.getClient();
    return client.request<SolutionCategory>(`/solutions/categories/${id}`);
  }

  /** `POST /solutions/categories` — create a category. */
  async createCategory(body: SolutionCategoryCreate): Promise<SolutionCategory> {
    const client = await this.getClient();
    return client.request<SolutionCategory>('/solutions/categories', { method: 'POST', body });
  }

  /** `PUT /solutions/categories/{id}` — update a category. */
  async updateCategory(id: number, body: SolutionCategoryUpdate): Promise<SolutionCategory> {
    const client = await this.getClient();
    return client.request<SolutionCategory>(`/solutions/categories/${id}`, { method: 'PUT', body });
  }

  /** `DELETE /solutions/categories/{id}` — delete a category. */
  async deleteCategory(id: number): Promise<void> {
    const client = await this.getClient();
    await client.request<void>(`/solutions/categories/${id}`, { method: 'DELETE' });
  }

  // --- Folders ------------------------------------------------------------

  /** `POST /solutions/categories/{categoryId}/folders` — create a folder. */
  async createFolder(categoryId: number, body: SolutionFolderCreate): Promise<SolutionFolder> {
    const client = await this.getClient();
    return client.request<SolutionFolder>(`/solutions/categories/${categoryId}/folders`, {
      method: 'POST',
      body,
    });
  }

  /** `GET /solutions/categories/{categoryId}/folders` — list a category's folders. */
  async listFolders(categoryId: number): Promise<SolutionFolder[]> {
    const client = await this.getClient();
    return client.request<SolutionFolder[]>(`/solutions/categories/${categoryId}/folders`);
  }

  /** `GET /solutions/folders/{id}` — fetch a single folder. */
  async getFolder(id: number): Promise<SolutionFolder> {
    const client = await this.getClient();
    return client.request<SolutionFolder>(`/solutions/folders/${id}`);
  }

  /** `PUT /solutions/folders/{id}` — update a folder. */
  async updateFolder(id: number, body: SolutionFolderUpdate): Promise<SolutionFolder> {
    const client = await this.getClient();
    return client.request<SolutionFolder>(`/solutions/folders/${id}`, { method: 'PUT', body });
  }

  /** `DELETE /solutions/folders/{id}` — delete a folder. */
  async deleteFolder(id: number): Promise<void> {
    const client = await this.getClient();
    await client.request<void>(`/solutions/folders/${id}`, { method: 'DELETE' });
  }

  // --- Articles -----------------------------------------------------------

  /** `POST /solutions/folders/{folderId}/articles` — create an article. */
  async createArticle(folderId: number, body: SolutionArticleCreate): Promise<SolutionArticle> {
    const client = await this.getClient();
    return client.request<SolutionArticle>(`/solutions/folders/${folderId}/articles`, {
      method: 'POST',
      body,
    });
  }

  /** `GET /solutions/folders/{folderId}/articles` — list a folder's articles. */
  async listArticles(folderId: number): Promise<SolutionArticle[]> {
    const client = await this.getClient();
    return client.request<SolutionArticle[]>(`/solutions/folders/${folderId}/articles`);
  }

  /** `GET /solutions/articles/{id}` — fetch a single article. */
  async getArticle(id: number): Promise<SolutionArticle> {
    const client = await this.getClient();
    return client.request<SolutionArticle>(`/solutions/articles/${id}`);
  }

  /** `PUT /solutions/articles/{id}` — update an article. */
  async updateArticle(id: number, body: SolutionArticleUpdate): Promise<SolutionArticle> {
    const client = await this.getClient();
    return client.request<SolutionArticle>(`/solutions/articles/${id}`, { method: 'PUT', body });
  }

  /** `DELETE /solutions/articles/{id}` — delete an article. */
  async deleteArticle(id: number): Promise<void> {
    const client = await this.getClient();
    await client.request<void>(`/solutions/articles/${id}`, { method: 'DELETE' });
  }
}
