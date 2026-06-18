import { describe, it, expect } from 'vitest';
import { clientWith } from '../mocks/handlers.js';
import { categoryFixture, folderFixture, articleFixture } from '../fixtures/index.js';

describe('SolutionsResource', () => {
  // --- Categories ---
  it('listCategories -> GET /solutions/categories', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/solutions/categories', json: [categoryFixture] },
    ]);
    const result = await client.solutions.listCategories();
    expect(result).toEqual([categoryFixture]);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/solutions/categories' });
  });

  it('getCategory -> GET /solutions/categories/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/solutions/categories/11', json: categoryFixture },
    ]);
    await client.solutions.getCategory(11);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/solutions/categories/11' });
  });

  it('createCategory -> POST /solutions/categories', async () => {
    const { client, requests } = clientWith([
      { method: 'POST', path: '/solutions/categories', status: 201, json: categoryFixture },
    ]);
    await client.solutions.createCategory({ name: 'General' });
    expect(requests[0]).toMatchObject({ method: 'POST', path: '/solutions/categories', body: { name: 'General' } });
  });

  it('updateCategory -> PUT /solutions/categories/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'PUT', path: '/solutions/categories/11', json: categoryFixture },
    ]);
    await client.solutions.updateCategory(11, { description: 'x' });
    expect(requests[0]).toMatchObject({ method: 'PUT', path: '/solutions/categories/11' });
  });

  it('deleteCategory -> DELETE /solutions/categories/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'DELETE', path: '/solutions/categories/11', status: 204 },
    ]);
    await client.solutions.deleteCategory(11);
    expect(requests[0]).toMatchObject({ method: 'DELETE', path: '/solutions/categories/11' });
  });

  // --- Folders ---
  it('createFolder -> POST /solutions/categories/{categoryId}/folders', async () => {
    const { client, requests } = clientWith([
      { method: 'POST', path: '/solutions/categories/11/folders', status: 201, json: folderFixture },
    ]);
    await client.solutions.createFolder(11, { name: 'FAQs', visibility: 1 });
    expect(requests[0]).toMatchObject({
      method: 'POST',
      path: '/solutions/categories/11/folders',
      body: { name: 'FAQs', visibility: 1 },
    });
  });

  it('listFolders -> GET /solutions/categories/{categoryId}/folders', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/solutions/categories/11/folders', json: [folderFixture] },
    ]);
    const result = await client.solutions.listFolders(11);
    expect(result).toEqual([folderFixture]);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/solutions/categories/11/folders' });
  });

  it('getFolder -> GET /solutions/folders/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/solutions/folders/21', json: folderFixture },
    ]);
    await client.solutions.getFolder(21);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/solutions/folders/21' });
  });

  it('updateFolder -> PUT /solutions/folders/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'PUT', path: '/solutions/folders/21', json: folderFixture },
    ]);
    await client.solutions.updateFolder(21, { name: 'New' });
    expect(requests[0]).toMatchObject({ method: 'PUT', path: '/solutions/folders/21' });
  });

  it('deleteFolder -> DELETE /solutions/folders/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'DELETE', path: '/solutions/folders/21', status: 204 },
    ]);
    await client.solutions.deleteFolder(21);
    expect(requests[0]).toMatchObject({ method: 'DELETE', path: '/solutions/folders/21' });
  });

  // --- Articles ---
  it('createArticle -> POST /solutions/folders/{folderId}/articles', async () => {
    const { client, requests } = clientWith([
      { method: 'POST', path: '/solutions/folders/21/articles', status: 201, json: articleFixture },
    ]);
    await client.solutions.createArticle(21, { title: 'T', description: 'D', status: 2 });
    expect(requests[0]).toMatchObject({
      method: 'POST',
      path: '/solutions/folders/21/articles',
      body: { title: 'T', description: 'D', status: 2 },
    });
  });

  it('listArticles -> GET /solutions/folders/{folderId}/articles', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/solutions/folders/21/articles', json: [articleFixture] },
    ]);
    const result = await client.solutions.listArticles(21);
    expect(result).toEqual([articleFixture]);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/solutions/folders/21/articles' });
  });

  it('getArticle -> GET /solutions/articles/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/solutions/articles/31', json: articleFixture },
    ]);
    await client.solutions.getArticle(31);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/solutions/articles/31' });
  });

  it('updateArticle -> PUT /solutions/articles/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'PUT', path: '/solutions/articles/31', json: articleFixture },
    ]);
    await client.solutions.updateArticle(31, { status: 1 });
    expect(requests[0]).toMatchObject({ method: 'PUT', path: '/solutions/articles/31' });
  });

  it('deleteArticle -> DELETE /solutions/articles/{id}', async () => {
    const { client, requests } = clientWith([
      { method: 'DELETE', path: '/solutions/articles/31', status: 204 },
    ]);
    await client.solutions.deleteArticle(31);
    expect(requests[0]).toMatchObject({ method: 'DELETE', path: '/solutions/articles/31' });
  });
});
