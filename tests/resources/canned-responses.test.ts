import { describe, it, expect } from 'vitest';
import { clientWith } from '../mocks/handlers.js';
import { cannedResponseFolderFixture, cannedResponseFixture } from '../fixtures/index.js';

describe('CannedResponsesResource', () => {
  it('listFolders -> GET /canned_response_folders', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/canned_response_folders', json: [cannedResponseFolderFixture] },
    ]);
    const result = await client.cannedResponses.listFolders();
    expect(result).toEqual([cannedResponseFolderFixture]);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/canned_response_folders' });
  });

  it('getFolder -> GET /canned_response_folders/{id}', async () => {
    const folderWithResponses = {
      ...cannedResponseFolderFixture,
      responses: [cannedResponseFixture],
    };
    const { client, requests } = clientWith([
      { method: 'GET', path: '/canned_response_folders/61', json: folderWithResponses },
    ]);
    const result = await client.cannedResponses.getFolder(61);
    expect(result).toEqual(folderWithResponses);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/canned_response_folders/61' });
  });

  it('listResponsesInFolder -> GET /canned_response_folders/{id}/responses', async () => {
    const { client, requests } = clientWith([
      { method: 'GET', path: '/canned_response_folders/61/responses', json: [cannedResponseFixture] },
    ]);
    const result = await client.cannedResponses.listResponsesInFolder(61);
    expect(result).toEqual([cannedResponseFixture]);
    expect(requests[0]).toMatchObject({ method: 'GET', path: '/canned_response_folders/61/responses' });
  });
});
