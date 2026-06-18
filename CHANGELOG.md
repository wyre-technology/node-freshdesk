# 1.0.0 (2026-06-18)


### Features

* initial Freshdesk API client SDK ([288a890](https://github.com/wyre-technology/node-freshdesk/commit/288a890e9a2bb7996d18f378a3f04c36a62911b5))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial release of the Freshdesk v2 API client.
- `FreshdeskClient` with HTTP Basic auth (`apiKey:X`), automatic base-URL
  derivation from the account `domain`, retries with backoff, `Retry-After`
  rate-limit handling, and `Link: rel="next"` pagination.
- Resources:
  - **Tickets**: list, listAll, get, create, update, delete, search, plus
    conversations (listConversations, reply, createNote, updateConversation,
    deleteConversation).
  - **Contacts**: list, listAll, get, create, update, softDelete, hardDelete,
    autocomplete, search, makeAgent, restore, sendInvite, merge.
  - **Companies**: list, listAll, get, create, update, delete, autocomplete,
    search.
  - **Agents**: list, listAll, get, me, create, update, delete.
  - **Groups**: list, listAll, get, create, update, delete.
  - **Solutions**: categories/folders/articles CRUD.
  - **SLA policies**: list, create, update.
  - **Business hours**: list, get (read-only).
  - **Canned responses**: listFolders, getFolder, listResponsesInFolder
    (read-only).
- Typed error hierarchy: `FreshdeskError`/`ServiceError`, `ValidationError`,
  `AuthenticationError`, `ForbiddenError`, `NotFoundError`, `RateLimitError`,
  `ServerError`.

[Unreleased]: https://github.com/wyre-technology/node-freshdesk/commits/main
