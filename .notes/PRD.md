# Bruno for Raycast - Product Requirements Document

## Overview
Bruno for Raycast is an extension that enables users to interact with Bruno API Client directly from Raycast. It provides quick access to running API requests, managing collections, and creating new requests without leaving Raycast.

## Core Features

### 1. Run Request (Default Command)
**Description**: Execute API requests directly from Raycast with results displayed inline.
- **Primary Action**: Copy response to clipboard
- **Input**: 
  - Quick search through available requests
  - Environment selector
  - Variable override capability
- **Output**:
  - Response body
  - Status code
  - Response time
  - Headers (collapsible)
- **Additional Actions**:
  - Save response to file
  - Open in Bruno app
  - Copy specific parts (headers, body, etc.)

### 2. Collection Browser
**Description**: Hierarchical view of all Bruno collections and requests.
- **View Structure**:
  - Collections as expandable folders
  - Requests with method indicators (GET, POST, etc.)
  - Path information
- **Actions**:
  - Quick search/filter
  - Run request
  - Copy request URL
  - Open in Bruno app

### 3. Create Collection
**Description**: Create new collections directly from Raycast.
- **Inputs**:
  - Collection name
  - Parent collection (optional)
  - Description (optional)
  - Base path (optional)
- **Validation**:
  - Name uniqueness
  - Valid path characters
  - Parent collection existence

### 4. Create Request
**Description**: Create new API requests within collections.
- **Inputs**:
  - Request name
  - HTTP method
  - URL/Path
  - Parent collection (required)
  - Description (optional)
- **Template Options**:
  - Empty request
  - From URL
  - Common templates (Auth, CRUD, etc.)

## Additional Features

### 5. Environment Management
- Quick environment switching
- Variable viewing/editing
- Environment cloning

### 6. Request History
- View recently run requests
- Quick re-run capability
- Success/failure status

### 7. Favorites
- Mark requests as favorites
- Quick access list
- Custom ordering

## Technical Requirements

### Installation
- Automatic installation of `@usebruno/cli`
- Verification of Bruno desktop app installation
- Directory permission setup

### Configuration
- Bruno collections directory path
- Default environment
- Response display preferences
- Custom shortcuts

### Performance
- Fast search and filtering
- Efficient request execution
- Response size handling

## User Experience

### Keyboard Navigation
- Intuitive shortcuts
- Quick actions
- Tab completion

### Error Handling
- Clear error messages
- Recovery suggestions
- Offline mode behavior

### Accessibility
- Keyboard-first design
- Screen reader support
- High contrast support

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

### Phase 1 - Project Setup
- [x] Initialize Raycast extension structure
- [x] Set up TypeScript configuration
- [x] Create folder structure:
  ```
  src/
  ├── commands/
  │   ├── runRequest.tsx
  │   ├── listCollections.tsx
  │   └── createCollection.tsx
  ├── components/
  │   ├── RequestItem.tsx
  │   ├── CollectionTree.tsx
  │   ├── ResponseView.tsx
  │   └── forms/
  │       ├── CollectionForm.tsx
  │       └── RequestForm.tsx
  ├── utils/
  │   ├── brunoRunner.ts
  │   ├── fileUtils.ts
  │   └── types.ts
  └── hooks/
      ├── useBrunoCommands.ts
      └── useCollections.ts
  ```
- [x] Set up dependencies
- [ ] Create empty component files with basic exports
- [x] Set up basic type definitions
- [x] Configure build and dev scripts

#### Implementation Details
1. **Extension Initialization**
   - Use `npx @raycast/create-extension` to create the base structure
   - Files: `package.json`, `tsconfig.json`

2. **Dependencies Setup**
   ```json
   {
     "dependencies": {
       "@raycast/api": "latest",
       "@usebruno/cli": "latest"
     },
     "devDependencies": {
       "@types/node": "latest",
       "@typescript-eslint/eslint-plugin": "latest",
       "@typescript-eslint/parser": "latest",
       "eslint": "latest",
       "typescript": "latest"
     }
   }
   ```

3. **Type Definitions** (`src/utils/types.ts`)
   - Collection types
   - Request types
   - Response types
   - Configuration types

4. **Basic Component Structure**
   - Empty React components with TypeScript interfaces
   - Basic exports and imports setup
   - Component documentation

#### Implementation Notes
```
Completed:
1. Project Structure ✓
   - Created full directory structure following Raycast conventions
   - All placeholder files created and ready for implementation
   - Proper separation of concerns (commands, components, utils, hooks)

2. Configuration ✓
   - package.json configured with correct Raycast scripts and dependencies
   - tsconfig.json set up with React and Node.js support
   - .gitignore with proper exclusions for Node.js and Raycast

3. Type System ✓
   - Basic types defined for Bruno entities (Collection, Request, Environment, Response)
   - Types are extensible for future features
   - Prepared for strict TypeScript usage

Important Notes for Future Phases:
1. Node.js Version
   - @raycast/api requires Node.js >= 20.5.0
   - Current warning during npm install needs to be addressed
   - Consider adding .nvmrc file

2. Bruno CLI Integration
   - @usebruno/cli is installed but needs testing
   - May need to handle CLI not being globally installed
   - Consider adding CLI version check

3. Build System
   - Using Raycast's build system (ray build/develop)
   - Need to test build process
   - May need additional build scripts for production

4. Development Workflow
   - VSCode settings might need configuration
   - Consider adding ESLint configuration
   - Add Prettier for code formatting

Next Immediate Tasks:
1. Test the development environment (npm run dev)
2. Add basic component exports
3. Verify Bruno CLI integration
```

### Phase 2 - Core Features
- [x] Run Request command implementation
- [x] Collection Browser development
- [x] Basic creation capabilities
- [x] Response handling and display
- [x] Clipboard integration

#### Implementation Details
1. **Run Request Command** (`src/commands/runRequest.tsx`)
   - Search interface
   - Request execution
   - Response display
   - Clipboard actions

2. **Collection Browser** (`src/commands/listCollections.tsx`)
   - Tree view implementation
   - Search/filter functionality
   - Action handlers

3. **Request Creation** (`src/commands/createCollection.tsx`)
   - Form implementation
   - Validation logic
   - File system integration

4. **Components**
   - `RequestItem.tsx`: List item display
   - `CollectionTree.tsx`: Hierarchical view
   - `ResponseView.tsx`: Response formatting

#### Implementation Notes
```
Completed Core Components:

1. Utilities
   - brunoRunner.ts: CLI command wrapper
   - fileUtils.ts: File system operations
   - types.ts: Type definitions

2. Hooks
   - useBrunoCommands: Command execution and management
   - useCollections: Collection and request management

3. Components
   - RequestItem: Individual request display
   - CollectionTree: Hierarchical collection view
   - ResponseView: API response display
   - Forms:
     - CollectionForm: New collection creation
     - RequestForm: New request creation
   - ErrorBoundary: React error handling

4. Commands
   - runRequest: Main command for executing requests
   - listCollections: Browse and manage collections
   - createCollection: Quick collection creation

Technical Notes:
1. React Integration ✓
   - Added React imports to all components
   - Fixed JSX warnings
   - Added ErrorBoundary for error handling

2. Bruno CLI Integration
   - Using child_process for CLI execution
   - Error handling for CLI operations
   - Response parsing and formatting

3. File System
   - Bruno directory structure handling
   - Collection and request file parsing
   - File creation and management

Next Steps:
1. Add loading states
2. Test all commands
3. Add more error handling for edge cases
4. Improve response formatting
```

### Phase 3 - Enhanced Features
- [ ] Environment management implementation
- [ ] History tracking system
- [ ] Favorites functionality
- [ ] Settings preferences

#### Implementation Details
1. **Environment Management**
   - Environment selector component
   - Variable editor
   - Environment storage

2. **History System**
   - Local storage integration
   - History view component
   - Quick re-run functionality

3. **Favorites**
   - Favorites storage
   - Star/unstar functionality
   - Favorites view

4. **Files Involved**
   - New: `src/hooks/useHistory.ts`
   - New: `src/hooks/useFavorites.ts`
   - New: `src/components/EnvironmentSelector.tsx`

#### Implementation Notes
```
[To be filled in after implementation]
```

### Phase 4 - Advanced Features
- [ ] Template system implementation
- [ ] Batch operations
- [ ] Advanced configuration options
- [ ] Performance optimizations

#### Implementation Details
1. **Templates**
   - Template definition system
   - Template selection UI
   - Template storage

2. **Batch Operations**
   - Batch runner implementation
   - Results aggregation
   - Error handling

3. **Configuration**
   - Advanced settings UI
   - Performance tuning
   - Custom shortcuts

4. **Files Involved**
   - New: `src/utils/templateManager.ts`
   - New: `src/utils/batchRunner.ts`
   - New: `src/components/AdvancedSettings.tsx`

#### Implementation Notes
```
[To be filled in after implementation]
```

## Success Metrics
- Installation count
- Daily active users
- Request execution count
- Error rate
- User feedback score 