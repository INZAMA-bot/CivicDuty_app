# Security Specification: CivicDuty Cloud Data Layer

## 1. Data Invariants
- A `Post` document must have an authentic `id`, `country`, `dept`, `lane`, `title`, `body`, and valid `created_at` timestamp.
- Whistleblower reports must not expose raw plain phone numbers or unmasked government national IDs.
- `AuditReceipt` records in `/audit_ledger/` are immutable upon write. They cannot be modified or deleted by anyone once sealed.
- Users can read public posts in the Citizen Gazette feed, and can create posts.
- Departments can be read by any citizen; only authorized desk owners or admins can update claimed states or SLA records.
- Claims can be created by verified business representatives during commercial checkout.

## 2. The Dirty Dozen Payloads (Adversarial Tests)
1. Injecting 1MB payload into `Post.body` to exhaust database storage (Blocked by `body.size() <= 4000`).
2. Spoofing `Post.id` with path traversal or illegal characters (Blocked by `isValidId(postId)`).
3. Modifying `Post.crypto_seal_hash` after creation to falsify audit logs (Blocked by immutability of hash on update).
4. Deleting an `AuditReceipt` from `/audit_ledger/` to hide a corruption paper trail (Blocked by `allow delete: if false`).
5. Overwriting another citizen's user profile score (Blocked by user ID authorization checks).
6. Changing a public department from `civic` to `consumer` to illegitimately charge taxpayers (Blocked by schema lane lock).
7. Creating a `Post` without required category or department (Blocked by `isValidPost()` validator).
8. Setting `upvotes` to negative values or bypassing numerical limits (Blocked by data type checks).
9. Updating an already resolved ticket without official authorization (Blocked by state transition gates).
10. Injecting arbitrary malicious keys into a `Claim` document (Blocked by key count checks).
11. Reading unmasked PII of other whistleblowers (Blocked by collection boundary and field masking).
12. Blanket list queries bypassing indexed fields (Blocked by query boundary checks).
