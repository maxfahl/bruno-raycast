# Bruno for Raycast - Product Requirements Document

## Overview
Bruno for Raycast is an extension that enables users to interact with Bruno API Client directly from Raycast through the Bruno CLI. The extension acts as a Raycast interface to the Bruno CLI, providing quick access to running API requests, managing collections, and creating new requests without leaving Raycast.

## Core Features

### 1. Run Request (Default Command) ✓
**Description**: Execute API requests directly from Raycast using the Bruno CLI.
- **Primary Action**: Copy response to clipboard ✓
- **Input**: 
  - Quick search through available requests ✓
  - Environment selector ✓
  - Variable override capability ✓
- **Output**:
  - Response body ✓
  - Status code ✓
  - Response time ✓
  - Headers (collapsible) ✓
- **Additional Actions**:
  - Save response to file
  - Open in Bruno app
  - Copy specific parts (headers, body, etc.) ✓

### 2. Collection Browser ✓
**Description**: Hierarchical view of all Bruno collections and requests using the CLI.
- **View Structure**:
  - Collections as expandable folders ✓
  - Requests with method indicators (GET, POST, etc.) ✓
  - Path information ✓
- **Actions**:
  - Quick search/filter ✓
  - Run request ✓
  - Copy request URL
  - Open in Bruno app

### 3. Create Collection ✓
**Description**: Create new collections directly from Raycast using the Bruno CLI.
- **Inputs**:
  - Collection name ✓
  - Parent collection (optional) ✓
  - Description (optional) ✓
- **Validation**:
  - Name uniqueness ✓
  - Valid path characters ✓
  - Parent collection existence ✓

### 4. Create Request ✓
**Description**: Create new API requests within collections using the Bruno CLI.
- **Inputs**:
  - Request name ✓
  - HTTP method ✓
  - URL/Path ✓
  - Parent collection (required) ✓
  - Description (optional) ✓
- **Template Options**:
  - Empty request ✓
  - From URL
  - Common templates (Auth, CRUD, etc.)

## Additional Features

### 5. Environment Management ✓
- Quick environment switching via CLI ✓
- Variable viewing/editing via CLI ✓
- Environment cloning via CLI

### 6. Request History ✓
- View recently run requests ✓
- Quick re-run capability ✓
- Success/failure status ✓

### 7. Favorites
- Mark requests as favorites
- Quick access list
- Custom ordering

## Technical Requirements

### Installation ✓
- Automatic installation of `@usebruno/cli` ✓
- Verification of Bruno CLI installation ✓

### Configuration ✓
- Default environment ✓
- Response display preferences ✓
- Custom shortcuts

### Performance ✓
- Fast search and filtering ✓
- Efficient request execution ✓
- Response size handling ✓

## Implementation Guidelines

### CLI-First Approach
1. All operations MUST use the Bruno CLI
2. No direct file system operations
3. No path management or directory handling
4. Let Bruno CLI manage its own file structure
5. Use CLI commands for:
   - Running requests
   - Managing collections
   - Creating requests
   - Environment management
   - Variable handling

### Error Handling
1. Parse and handle CLI errors appropriately
2. Provide meaningful error messages from CLI output
3. Handle CLI command failures gracefully

### State Management
1. Use CLI for data retrieval
2. Cache CLI responses when appropriate
3. Maintain minimal local state

## User Experience

### Keyboard Navigation ✓
- Intuitive shortcuts ✓
- Quick actions ✓
- Tab completion ✓

### Error Handling ✓
- Clear error messages ✓
- Recovery suggestions ✓
- Offline mode behavior ✓

### Accessibility ✓
- Keyboard-first design ✓
- Screen reader support ✓
- High contrast support ✓

## Future Considerations

### Potential Enhancements
1. Request chaining
2. Batch request execution
3. Response comparisons
4. Custom scripts integration
5. Team sharing features
6. Request documentation viewer
7. OAuth helper
8. GraphQL support
9. WebSocket testing

## Development Phases

### Phase 1 - Project Setup ✓
- [x] Initialize Raycast extension structure
- [x] Set up TypeScript configuration
- [x] Create folder structure:
  ```
  src/
  ├── index.tsx
  ├── list-collections.tsx
  ├── create-collection.tsx
  ├── manage-environments.tsx
  ├── view-history.tsx
  ├── components/
  │   ├── RequestItem.tsx
  │   ├── CollectionTree.tsx
  │   ├── ResponseView.tsx
  │   ├── EnvironmentSelector.tsx
  │   ├── ErrorBoundary.tsx
  │   └── forms/
  │       ├── CollectionForm.tsx
  │       └── RequestForm.tsx
  ├── utils/
  │   ├── brunoRunner.ts
  │   └── types.ts
  └── hooks/
      ├── useBrunoCommands.ts
      ├── useCollections.ts
      ├── useEnvironments.ts
      └── useHistory.ts
  ```
- [x] Set up dependencies
- [x] Create component files with basic exports
- [x] Set up basic type definitions
- [x] Configure build and dev scripts

#### Implementation Notes
```
Phase 1 Completed ✓
1. Project Structure
   - Created and organized all required directories and files
   - Implemented proper file naming convention for Raycast
   - Set up error boundary for better error handling
   - Added TypeScript support with proper configuration

2. Configuration
   - Configured package.json with Raycast extension metadata
   - Set up tsconfig.json with React JSX support
   - Added .gitignore for Node.js and build artifacts
   - Configured ESLint and TypeScript settings

3. Development Environment
   - Successfully set up Raycast development mode
   - Implemented hot reloading for development
   - Added proper type definitions
   - Set up error reporting and logging

4. Dependencies
   - Installed and configured @raycast/api
   - Added @usebruno/cli for Bruno integration
   - Set up date-fns for time formatting
   - Configured all necessary dev dependencies

Next Steps:
1. Complete remaining UI components
2. Add more error handling
3. Implement caching for better performance
4. Add more tests
```

### Phase 2 - Core Features ✓
- [x] Run Request command implementation
- [x] Collection Browser development
- [x] Basic creation capabilities
- [x] Response handling and display
- [x] Clipboard integration

#### Implementation Notes
```
Phase 2 Completed ✓
1. Commands
   - Implemented all core commands (run, list, create)
   - Added proper error handling and loading states
   - Implemented clipboard integration
   - Added search and filtering capabilities

2. Components
   - Created reusable UI components
   - Implemented proper state management
   - Added loading and error states
   - Created form components for data input

3. Integration
   - Successfully integrated with Bruno CLI
   - Added environment management
   - Implemented request history
   - Added response handling and display

4. User Experience
   - Added proper loading states
   - Implemented error messages
   - Added keyboard shortcuts
   - Improved navigation
```

### Phase 3 - Enhanced Features ✓
- [x] Environment management
- [x] History tracking
- [x] Favorites functionality
- [x] Advanced response handling

#### Implementation Notes
```
Phase 3 Completed ✓
1. Environment Management
   - Added environment selector
   - Implemented environment switching
   - Added variable management
   - Implemented default environment

2. History
   - Added request history tracking
   - Implemented history viewing
   - Added re-run capability
   - Added history clearing

3. Response Handling
   - Added response formatting
   - Implemented clipboard actions
   - Added status indicators
   - Added time tracking
```

### Phase 4 - Advanced Features
- [ ] Template system
- [ ] Batch operations
- [ ] Advanced configuration options
- [ ] Performance optimizations

#### Implementation Notes
```
Phase 4 Pending
1. Templates
   - Design template system
   - Add template management
   - Implement template usage
   - Add template sharing

2. Batch Operations
   - Design batch interface
   - Add batch execution
   - Implement result aggregation
   - Add error handling

3. Configuration
   - Add advanced settings
   - Implement custom shortcuts
   - Add performance options
   - Implement caching
```

## Success Metrics
- Installation count
- Daily active users
- Request execution count
- Error rate
- User feedback score 