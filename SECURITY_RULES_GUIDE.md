# Firebase Security Rules Implementation Guide

## Overview

This guide explains how to implement and customize the provided Firestore and Storage security rules for your Firebase project.

## Firestore Security Rules

### Key Features

1. **User-based Access Control**: Users can only access their own data
2. **Role-based Permissions**: Support for admin roles and organization hierarchies
3. **Public/Private Content**: Separate rules for public posts and private content
4. **Validation**: Data validation to ensure proper document structure
5. **Audit Trail**: Write-only access for analytics and logging

### Rule Categories

#### User Management
- `/users/{userId}`: Personal user documents
- `/users/{userId}/private/{document}`: Private user data
- `/users/{userId}/profile/{document}`: Public profile information

#### Content Management
- `/posts/{postId}`: Public posts with comments
- `/private_posts/{postId}`: Private user posts
- `/organizations/{orgId}`: Organization data with member access

#### System Collections
- `/admins/{adminId}`: Admin user management
- `/analytics/{document}`: Usage analytics (write-only for users)
- `/logs/{document}`: System logs (write-only for users)

### Helper Functions

\`\`\`javascript
// Check if user is authenticated
function isAuthenticated() {
  return request.auth != null;
}

// Check if user owns the resource
function isOwner(userId) {
  return request.auth.uid == userId;
}

// Check if user has admin privileges
function isAdmin() {
  return isAuthenticated() && 
         exists(/databases/$(database)/documents/admins/$(request.auth.uid));
}
\`\`\`

## Storage Security Rules

### Key Features

1. **File Type Validation**: Restrict uploads to specific file types
2. **Size Limits**: Enforce maximum file sizes per type
3. **User Isolation**: Users can only access their own files
4. **Public/Private Separation**: Different access levels for different content
5. **Organization Support**: Shared file access for organization members

### File Organization Structure

\`\`\`
/public/                    # Public files (read by anyone)
/users/{userId}/
  ├── profile/             # Public profile images
  ├── private/             # Private user files
  ├── documents/           # User documents (PDF, DOC, etc.)
  └── media/
      ├── images/          # User images
      ├── videos/          # User videos
      └── audio/           # User audio files
/organizations/{orgId}/     # Organization shared files
/posts/{postId}/attachments/ # Post attachments
/chats/{chatId}/attachments/ # Chat attachments
/temp/{userId}/             # Temporary uploads (1-hour expiry)
/admin/                     # Admin-only files
/system/                    # System files and backups
\`\`\`

### File Type and Size Limits

| File Type | Extensions | Max Size | Use Case |
|-----------|------------|----------|----------|
| Images | jpg, png, gif, webp | 10MB | Profile pictures, post images |
| Documents | pdf, doc, docx, txt | 50MB | User documents, attachments |
| Videos | mp4, mov, avi, webm | 100MB | User videos, media content |
| Audio | mp3, wav, ogg, m4a | 25MB | Voice messages, audio content |

## Implementation Steps

### 1. Deploy Firestore Rules

1. Save the Firestore rules to `firestore.rules`
2. Deploy using Firebase CLI:
   \`\`\`bash
   firebase deploy --only firestore:rules
   \`\`\`

### 2. Deploy Storage Rules

1. Save the Storage rules to `storage.rules`
2. Deploy using Firebase CLI:
   \`\`\`bash
   firebase deploy --only storage
   \`\`\`

### 3. Set Up Admin Users

Create admin users in Firestore:

\`\`\`javascript
// Add to /admins/{userId} collection
{
  email: "admin@example.com",
  role: "super_admin",
  createdAt: serverTimestamp(),
  permissions: ["read", "write", "delete", "manage_users"]
}
\`\`\`

### 4. Initialize User Documents

When users sign up, create their user document:

\`\`\`javascript
// Add to /users/{userId} collection
{
  email: user.email,
  displayName: user.displayName,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  isActive: true
}
\`\`\`

## Customization Guide

### Adding New Collections

1. Define the collection path in Firestore rules
2. Add appropriate read/write conditions
3. Include validation functions if needed

Example:
\`\`\`javascript
match /custom_collection/{docId} {
  allow read: if isAuthenticated();
  allow write: if isAuthenticated() && 
                  request.resource.data.authorId == request.auth.uid;
}
\`\`\`

### Modifying File Upload Restrictions

Update the helper functions in Storage rules:

\`\`\`javascript
function isValidCustomFile() {
  return request.resource.contentType in ['application/custom'] &&
         request.resource.size < 20 * 1024 * 1024; // 20MB limit
}
\`\`\`

### Adding Role-Based Access

1. Create role documents in Firestore
2. Update helper functions to check roles
3. Apply role checks in security rules

\`\`\`javascript
function hasRole(role) {
  return isAuthenticated() && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
}
\`\`\`

## Testing Security Rules

### Firestore Rules Testing

Use the Firebase Emulator Suite:

\`\`\`bash
firebase emulators:start --only firestore
\`\`\`

Test with the Rules Playground in Firebase Console.

### Storage Rules Testing

Test file uploads with different user contexts:

\`\`\`javascript
// Test authenticated upload
const storageRef = ref(storage, `users/${user.uid}/documents/test.pdf`);
await uploadBytes(storageRef, file);

// Test unauthorized access (should fail)
const otherUserRef = ref(storage, `users/other-user-id/documents/test.pdf`);
await getDownloadURL(otherUserRef); // Should throw permission error
\`\`\`

## Security Best Practices

1. **Principle of Least Privilege**: Grant minimum necessary permissions
2. **Input Validation**: Always validate data structure and content
3. **Rate Limiting**: Implement client-side rate limiting for uploads
4. **Audit Logging**: Log all sensitive operations
5. **Regular Reviews**: Periodically review and update rules
6. **Testing**: Thoroughly test rules with different user scenarios

## Common Pitfalls

1. **Overly Permissive Rules**: Avoid `allow read, write: if true` except for truly public data
2. **Missing Validation**: Always validate required fields and data types
3. **Circular Dependencies**: Avoid rules that reference each other circularly
4. **Performance Issues**: Minimize expensive operations like `get()` calls
5. **Hardcoded Values**: Use variables and functions instead of hardcoded IDs

## Monitoring and Maintenance

1. **Firebase Console**: Monitor rule violations and performance
2. **Cloud Logging**: Set up alerts for security rule failures
3. **Regular Audits**: Review access patterns and update rules accordingly
4. **Version Control**: Keep rules in version control with proper documentation

## Support and Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/rules)
- [Firestore Security Rules Reference](https://firebase.google.com/docs/firestore/security/rules-structure)
- [Storage Security Rules Reference](https://firebase.google.com/docs/storage/security)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
