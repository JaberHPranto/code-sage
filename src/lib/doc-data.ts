export const summarizations = [
  {
    fileName: "src/libs/redux/store.ts",
    summary:
      "This file (`src/libs/redux/store.ts`) sets up the Redux store for our application.  It configures the store using `configureStore` from `@reduxjs/toolkit`, combining reducers for chat messages (`chatMessagesSlice`), side panel state (`sidePanelSlice`), and the API slice (`apiSlice`).  `apiSlice` integrates with the application's API, handling asynchronous actions.  The store provides a single source of truth for application state, accessible via `store.getState()` and modifiable using `store.dispatch()`.  Understanding Redux and its concepts (reducers, actions, middleware) is crucial.  The `RootState` and `AppDispatch` types are exported for TypeScript type safety.\n",
  },
  {
    fileName: "src/services/filters/filtersApi.ts",
    summary:
      "This file, `src/services/filters/filtersApi.ts`, defines API endpoints for retrieving filter options used in the application.  It leverages the `apiSlice` (likely from RTK Query) to create reusable, asynchronous data fetching functions for countries, agencies, drugs, biomarkers, modalities, and diseases.  These functions, exposed as queries (`getAvailableCountries`, etc.),  fetch arrays of strings representing available filter values.  The `providesTags` mechanism is crucial for efficient caching and data invalidation within RTK Query.  Understanding RTK Query and its caching strategies is essential for working with this file.\n",
  },
  {
    fileName: "src/libs/redux/sidePanelSlice.ts",
    summary:
      "This file (`src/libs/redux/sidePanelSlice.ts`) manages the state of left and right side panels in the application using Redux Toolkit.  It defines two actions: `toggleLeftPanel` and `toggleRightPanel`, which control the open/closed state of each panel.  The `sidePanelSlice` reducer updates the Redux store accordingly.  It relies on Redux Toolkit's `createSlice` for concise state management and integrates with the broader application's Redux store to provide a centralized, predictable way to manage UI state.  Understanding Redux and Redux Toolkit is critical for working with this file.\n",
  },
  {
    fileName: "src/libs/redux/hooks.ts",
    summary:
      "This `hooks.ts` file provides custom React-Redux hooks for simplified state management within our application.  It leverages `useDispatch` and `useSelector` from `react-redux`, but adds type safety through `withTypes`.  `useAppDispatch` returns a typed `AppDispatch` allowing for type-safe dispatching of actions, and `useAppSelector` returns a typed `RootState` for safe access to the application's state.  This relies on the `store.ts` file (defining `RootState` and `AppDispatch`) and the `react-redux` library. Understanding Redux and its core concepts (actions, reducers, store) is crucial.\n",
  },
  {
    fileName: "src/services/api/customFetchBase.ts",
    summary:
      "This file, `src/services/api/customFetchBase.ts`, provides a custom base query function for making API requests within a Redux Toolkit application.  It leverages `fetchBaseQuery` to handle HTTP requests, using the `API_URL` environment variable for the base URL.  Critically, it currently lacks authentication (the `prepareHeaders` function is commented out), though it's designed to add authorization headers if an access token is available. This file is a foundational dependency for any API calls made using the Redux Toolkit's `createApi` hook, simplifying and centralizing API interaction logic.  Understanding environment variables and Redux Toolkit's query system is essential.\n",
  },
  {
    fileName: "src/services/api/apiSlice.ts",
    summary:
      "This `apiSlice.ts` file sets up the foundation for making API requests within our Redux application using the `@reduxjs/toolkit/query` library.  It utilizes a custom `baseQuery` (likely handling authentication or error handling) and defines the base structure for future API endpoints.  Crucially, it pre-configures caching (`keepUnusedDataFor`) and  data tagging (`tagTypes`) for efficient data management and invalidation.  It's a central dependency for all API interactions, integrating directly with Redux for state management. Understanding `baseQuery` and Redux's workings is vital.\n",
  },
  {
    fileName: "src/features/chat-studio/chat/ChatInterface.tsx",
    summary:
      '`ChatInterface.tsx` is the main user interface component for the chat feature within the "chat-studio" application.  It handles rendering chat messages, user input (using an auto-sizing textarea), and sending messages.  Key functionality includes displaying messages using `ChatMessage` components, managing a streaming response via `useStreamResponseForChat`, and integrating with Redux for state management (using `useAppSelector` and `useAppDispatch` for side panel toggling and message updates). It relies heavily on custom UI components and utilizes the `lucide-react` icon library.  Understanding Redux and React hooks is crucial for working with this file.\n',
  },
  {
    fileName: "src/features/chat-studio/filters/TableView.tsx",
    summary:
      '`TableView.tsx` displays filtered chat data in a tabular format within the chat-studio feature.  It fetches data using `useGetTableViewQuery` from the `filtersApi` service, based on an array of IDs passed as props.  The component renders a loading spinner while fetching and a "No data available" message if the fetch fails.  Critical dependencies are the `filtersApi` and the custom `Table` component.  The component uses the `react-router-dom` `Link` (though it\'s not shown in the snippet) for navigation, likely to detail views.  It implements a common data fetching and display pattern.\n',
  },
  {
    fileName: "src/features/chat-studio/chat/ChatMessage.tsx",
    summary:
      'This file (`ChatMessage.tsx`) renders individual messages within a chat interface.  It displays user or assistant messages, differentiating them visually.  The `type` prop allows for different message types, currently "text" and "deep-research" (handled by `DeepResearchAgent`).  It uses `lucide-react` icons to visually represent the sender.  Crucially, it leverages the `MarkdownContent` component for formatted text rendering. This component is part of the larger `chat-studio` feature and depends on the correctly formatted props passed to it,  specifically the `sender` and `content` fields.\n',
  },
  {
    fileName: "src/features/chat-studio/filters/FilterConfigController.tsx",
    summary:
      'This file, `FilterConfigController.tsx`, manages the user interface for configuring chat message filters within the "chat-studio" feature.  It uses React components (from `@/components`) to create a filter configuration dialog, allowing users to select filters like biomarkers, countries, diseases, etc., using various select components (SimpleSelect, MultiSelect).  It leverages Redux (`setFilterIds`) to update filter selections and utilizes custom hooks (`useGetAvailable...Query`) to fetch filter options from a backend API (`filtersApi`).  Understanding the Redux and API interaction is crucial. The component renders within a larger chat application, enabling users to refine chat message display based on selected filters.\n',
  },
  {
    fileName: "src/features/chat-studio/history/ChatHistory.tsx",
    summary:
      "`ChatHistory.tsx` manages the display and control of chat history within a larger chat application.  Its core function is to provide a button that initiates a new chat session, clearing both the Redux store (`chatMessagesSlice`) and the displayed chat history.  It uses the `setMessageHistory` prop to update the chat display and relies on Redux for state management and custom hooks (`useAppDispatch`) for accessing the dispatch function.  Critical dependencies include UI components (`Button`, `Card`, `ScrollArea`),  utility functions (`sleep`), and type definitions (`ChatMessageType`).  The component uses a functional component pattern and leverages asynchronous operations (`async/await`).\n",
  },
  {
    fileName: "postcss.config.js",
    summary:
      "This `postcss.config.js` file configures PostCSS, a toolchain for transforming CSS.  Its primary purpose is to integrate Tailwind CSS and Autoprefixer into our build process.  Tailwind provides utility-first styling, while Autoprefixer adds vendor prefixes for browser compatibility.  This config file acts as a bridge, instructing PostCSS to run these plugins on our CSS, ultimately generating optimized, browser-compatible stylesheets.  Understanding npm packages `tailwindcss` and `autoprefixer` is crucial; this file directly depends on their installation and correct configuration within the project.\n",
  },
  {
    fileName:
      "src/features/chat-studio/chat/custom-message/DeepResearchMessage.tsx",
    summary:
      "This React component, `DeepResearchMessage.tsx`, displays a detailed research response within a chat interface.  It takes a raw string (`content`) as input, parses it using `parseStreamedText` to extract research sections, a final answer, and an optional rewrite.  The parsed data is then rendered using Accordions to display individual research sections (`ResearchContent`) and a dedicated `FinalAnswerSection`.  Key dependencies include the `parseStreamedText` utility and UI components from `@/components/ui`. It leverages the `DeepResearchSection` type and uses `useMemo` for performance optimization. The component is part of the larger `chat-studio` feature, providing a rich display for complex AI-generated responses.\n",
  },
  {
    fileName: "vite.config.ts",
    summary:
      "This `vite.config.ts` file configures Vite, a build tool, for our React project.  It defines environment variables using `loadEnv`,  sets up aliases for common import paths (e.g., `@` points to `./src`), improving code organization and readability.  The `plugins` section includes `@vitejs/plugin-react` for React support. This configuration is crucial for development and production builds; it dictates how Vite processes your code, bundles dependencies, and manages environment-specific settings.  Understanding environment variables and aliasing is key to using this file effectively.\n",
  },
  {
    fileName: "tsconfig.node.json",
    summary:
      "This `tsconfig.node.json` file configures the TypeScript compiler specifically for a Node.js environment within a Vite project.  It enables faster incremental builds (`incremental`), targets modern JavaScript (`ES2022`, `ESNext`), and uses Vite's bundler mode (`moduleResolution: \"bundler\"`) for efficient module resolution.  Strict linting (`strict: true`) ensures code quality.  Crucially, `noEmit: true` prevents TypeScript from generating JavaScript, relying instead on Vite's bundling process.  The file's inclusion of `vite.config.ts` indicates its close integration with Vite's build configuration.\n",
  },
  {
    fileName: "src/features/chat-studio/chat/components/AiResponseAction.tsx",
    summary:
      "This file, `AiResponseAction.tsx`, defines a React component responsible for displaying user interface actions related to an AI's chat response.  It renders buttons for \"thumbs down\" feedback (currently unimplemented) and copying the response to the clipboard.  The component uses `useState` for managing the copy state and `navigator.clipboard` for clipboard functionality. It leverages the `sonner` library for toast notifications and relies on UI components from `@/components/ui/button` and `lucide-react` for icons. It's likely part of a larger chat application, providing user interaction within the chat interface.  Understanding asynchronous operations (using `async/await`) and React's state management are key.\n",
  },
  {
    fileName: "Dockerfile",
    summary:
      "This Dockerfile builds and runs a Node.js application using a multi-stage build.  The `builder` stage installs dependencies and builds the app using `pnpm`.  The `runner` stage uses a lightweight Nginx server to serve the built application's static assets (`/app/dist`).  It relies on `pnpm` (a Node.js package manager) and an existing `nginx.conf` file. The final image exposes port 80 and runs Nginx in foreground mode.  This ensures a small, production-ready image containing only the necessary application files.\n",
  },
  {
    fileName: "nginx.conf",
    summary:
      "This `nginx.conf` file configures an Nginx web server.  Its main purpose is to serve web content from `/usr/share/nginx/html`.  It listens on port 80, maps requests to files, and handles 404 errors by serving `index.html`.  The `location` block optimizes static asset serving (`/static/`) with caching.  It relies on the existence of the specified root directory and the `index.html` file. Understanding file paths and HTTP request handling is crucial.  Nginx sits between clients and the web application, acting as a reverse proxy or load balancer in larger systems.\n",
  },
  {
    fileName:
      "src/features/chat-studio/chat/prompt-template/PromptTemplateModal.tsx",
    summary:
      "This file, `PromptTemplateModal.tsx`, implements a modal dialog for selecting and inserting prompt templates into a chat application (likely a chat studio).  It fetches available templates using `useGetAllPromptTemplatesQuery` from a backend API (`promptTemplateApi`). Users select a template from categorized lists, and the chosen template's text is set via the `setPrompt` prop, updating the main chat input.  It relies on UI components from `@/components/ui` and uses `lucide-react` icons.  Understanding the `PromptTemplate` type and the `TemplateCategory` enum is crucial, as is familiarity with React state management (`useState`, props).\n",
  },
  {
    fileName: "tsconfig.app.json",
    summary:
      'This `tsconfig.app.json` file configures the TypeScript compiler for your application.  It dictates how TypeScript code is compiled into JavaScript, specifically for a bundler environment. Key features include setting the target JavaScript version (ES2020), enabling React JSX,  strict type checking (`strict: true`), and using path aliases (`@/*` for `./src/*`).  Crucially, `moduleResolution: "bundler"` and `noEmit: true` indicate it\'s designed for a bundler (like Webpack or Vite) which handles the actual JavaScript output.  Understanding bundler workflows is critical for working with this configuration.  The `include` property specifies the source code directory.\n',
  },
  {
    fileName: "eslint.config.js",
    summary:
      "This `eslint.config.js` file configures ESLint, a JavaScript linter, for TypeScript projects.  It defines linting rules and settings, ensuring consistent code style and catching potential errors.  It leverages pre-built configurations from `@eslint/js` and `typescript-eslint`, extends them with React-specific rules (using `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`), and customizes certain rules.  Crucially, it relies on these plugins and the `typescript-eslint` package; understanding TypeScript's type system is vital for using this configuration effectively.  It integrates into the build process to enforce code quality before deployment.\n",
  },
  {
    fileName: "src/App.tsx",
    summary:
      "This `src/App.tsx` file serves as the root component of our React application.  Its primary function is to render the main application layout and initialize the routing system.  It imports and renders the `Router` component, which is responsible for handling navigation between different application views.  The `font-onest` class likely applies global styling. Understanding React's component tree and how routing works (via `Router`) is crucial.  This file is the entry point for the entire application's UI.\n",
  },
  {
    fileName: "src/index.css",
    summary:
      "This `src/index.css` file styles the React application.  It primarily uses Tailwind CSS for rapid UI development, importing Google Fonts and defining custom CSS variables for consistent theming (e.g., `--primary`, `--background`).  `@tailwind base; @tailwind components; @tailwind utilities;`  inject Tailwind's pre-built styles.  A custom component style `.custom-paragraph strong` demonstrates extending Tailwind's functionality.  Understanding Tailwind's utility-first approach and the defined CSS variables is crucial for modifying the application's appearance. The file's Google Fonts import is a dependency.\n",
  },
  {
    fileName: "index.html",
    summary:
      "This `index.html` file serves as the entry point for your web application.  It sets up the basic HTML structure, including the `<div id=\"root\">` which acts as a container for your React (or similar framework) application to render into.  The `<script>` tag loads `main.tsx`, the application's main JavaScript file, which is likely written in TypeScript and handles all application logic.  This file relies on the `main.tsx` script and implicitly on the framework it uses (likely React, judging by the `.tsx` extension) to function correctly.  Essentially, it's the barebones HTML shell that gets populated by your application's JavaScript code.\n",
  },
  {
    fileName: "tailwind.config.js",
    summary:
      "This `tailwind.config.js` file configures Tailwind CSS for our project.  Its main purpose is to define how Tailwind processes and applies utility classes to our HTML, TSX, and JSX files (specified in `content`).  Key functionality includes specifying dark mode (`darkMode`), customizing the `theme` (colors, fonts like 'Onest', container sizing), and extending Tailwind's defaults.  It's critical for the build process, as Tailwind uses this configuration to generate the CSS.  Understanding CSS variables (e.g., `hsl(var(--primary))`) and the `content` array which specifies the files Tailwind should scan for utility classes is essential.\n",
  },
  {
    fileName: "tsconfig.json",
    summary:
      "This `tsconfig.json` acts as a central configuration file for our TypeScript project.  It doesn't directly compile code; instead, it manages compilation settings by referencing other configuration files (`tsconfig.app.json`, `tsconfig.node.json`).  These likely represent different build targets (e.g., browser vs. Node.js).  Crucially, it defines a `baseUrl` and `paths` mapping `@/*` to `./src/*`, enabling convenient alias imports like `import {foo} from '@module/foo'`. Understanding this aliasing is critical for navigating the project's codebase.\n",
  },
  {
    fileName: "src/main.tsx",
    summary:
      "This `src/main.tsx` file is the entry point of our React application.  Its core function is to render the main application component (`App.tsx`) within a React StrictMode for enhanced development warnings.  It leverages Redux via the `<Provider>` component to make the application store accessible throughout the component tree.  The `Toaster` component provides in-app notifications. Critical dependencies include React, React-DOM, Redux, and `sonner` for toasts.  Understanding React's component tree and Redux's state management is key to working with this file.\n",
  },
  {
    fileName: "src/vite-env.d.ts",
    summary:
      "The `src/vite-env.d.ts` file in a Vite project is a TypeScript declaration file.  Its main purpose is to provide type definitions for environment variables and other browser APIs that aren't automatically included in the TypeScript compiler's base definitions.  It leverages the `<reference types=\"vite/client\" />` directive to import Vite's client-side type definitions, enriching your IDE's autocompletion and ensuring type safety when accessing browser-specific features and environment variables within your Vue or React components.  This enhances developer experience and helps catch type errors during development, rather than at runtime.  Its critical dependency is the presence of a TypeScript project setup within a Vite-based application.\n",
  },
  {
    fileName:
      "src/features/chat-studio/chat/custom-message/components/FinalAnswerSection.tsx",
    summary:
      'This file, `FinalAnswerSection.tsx`, is a React component displaying the final answer generated within the "chat-studio" feature.  It conditionally renders either a loading indicator, an error message (implicitly, based on the provided snippet), or the final answer formatted using Markdown.  The component relies on `isResearchCompleted` and `finalAnswer` props to determine its output.  Critical dependencies include `MarkdownContent` for rendering markdown and `lucide-react` icons for visual feedback. It uses a conditional rendering pattern based on the research completion status and the presence of a final answer.  This component integrates into the chat interface to present the result of a chat session\'s research process.\n',
  },
  {
    fileName: "README.md",
    summary:
      "This `README.md` file serves as the primary documentation for a React, TypeScript, and Vite project template.  It explains the project's setup, highlighting the use of Vite for fast development with HMR (Hot Module Replacement) and ESLint for linting.  It details the choice between two React plugins – one using Babel, the other SWC – for Fast Refresh.  Crucially, it guides expanding the ESLint configuration for type-aware linting in production, referencing `tsconfig.json` files and  `tseslint`. Understanding TypeScript,  Vite's plugin system, and ESLint are key for working with this template.\n",
  },
  {
    fileName: "package.json",
    summary:
      "This `package.json` file is the manifest for a Node.js project (Aurora frontend).  It describes the project, specifying its name and version.  Crucially, it lists project dependencies (like React, Redux, and various UI component libraries) and defines scripts for development tasks (e.g., `dev`, `build`, `lint`).  `type: \"module\"` indicates use of ES modules.  The `dependencies` section dictates what external packages the project needs; `scripts` define commands to manage it (e.g., starting the dev server or building for production).  It's central to the project's build process and environment management, making it easily reproducible across different machines.\n",
  },
  {
    fileName: "docker-compose.yml",
    summary:
      'This `docker-compose.yml` file defines the multi-container application\'s structure.  Its main purpose is to orchestrate the creation and linking of Docker containers for our application ("app" service here). It specifies building the "app" container from a local `Dockerfile`, maps port 3000 to the container\'s port 80, loads environment variables from `.env`, and ensures automatic restarts.  It relies on Docker and a `Dockerfile` (defining the app\'s image). The `.env` file is a critical dependency providing environment-specific configurations.  This file simplifies local development and deployment by managing multiple interdependent services.\n',
  },
  {
    fileName: "components.json",
    summary:
      'This `components.json` file configures the UI framework, likely Shadcn UI, for our project.  It specifies styling preferences ("new-york" style),  enables TypeScript (tsx: true), and integrates Tailwind CSS, pointing to its config and CSS files.  Crucially, it defines aliases for commonly used directories (components, utils, etc.), simplifying imports throughout the codebase.  The `iconLibrary` setting indicates the icon set used.  Understanding these aliases is key to navigating the project structure, and the file\'s settings directly influence the appearance and functionality of the user interface.\n',
  },
  {
    fileName:
      "src/features/chat-studio/chat/custom-message/components/ResearchContent.tsx",
    summary:
      'This file, `ResearchContent.tsx`, is a React component responsible for displaying research content within a chat application\'s "chat studio" feature.  It takes an array of `DeepResearchSection` objects and renders them using an accordion UI.  If no research data is available, it displays a loading indicator.  Key functionality includes dynamically rendering expandable sections of research data.  It depends on the `lucide-react` icon library,  the custom UI components (`Accordion`, `CardContent`), and the `DeepResearchSection` type definition.  It uses a controlled component pattern to manage the open accordion section.  This component integrates into the broader chat studio by providing a structured view of research results relevant to the ongoing chat.\n',
  },
  {
    fileName: "src/hooks/useClickOutside.tsx",
    summary:
      "This hook, `useClickOutside`, allows components to detect clicks outside their boundaries.  It takes a ref to a component's element and a callback function.  The hook adds an event listener to the `document` that triggers the callback whenever a click occurs outside the referenced element.  The cleanup function removes the listener on unmount, preventing memory leaks. It uses the `useEffect` hook and relies on the `ref` object to identify the component's DOM element. Understanding refs and event handling in React is crucial to using this effectively.  It improves user experience by enabling features like closing dropdowns or modals when clicking outside them.\n",
  },
  {
    fileName: "src/libs/utils.ts",
    summary:
      "This `src/libs/utils.ts` file contains a utility function `cn` for efficiently managing Tailwind CSS classes.  It merges class names passed as arguments, leveraging `clsx` for conditional class application and `tailwind-merge` for optimal Tailwind class merging. This prevents class name conflicts and improves readability.  It's a crucial dependency for any component using Tailwind CSS within the project, simplifying class manipulation and improving code maintainability. Understanding `clsx` and `tailwind-merge` is key to using this function effectively.\n",
  },
  {
    fileName: "src/router/routes.tsx",
    summary:
      "This `routes.tsx` file defines the routing configuration for our React application.  It uses an array of route objects, each specifying a URL path (`path`) and its corresponding React component (`element`).  The `ProtectedRoute` component is a key dependency, enforcing authentication for specific routes.  Lazy loading (`lazy`) improves initial load times by delaying component imports. This file integrates with a routing library (likely React Router) to map URLs to views, forming the core navigation logic of the application.  Understanding React Router concepts is crucial for working with this file.\n",
  },
  {
    fileName: "src/hooks/useStreamingResponse.ts",
    summary:
      "This `useStreamingResponseForChat` hook manages the streaming of responses from a chat API.  It fetches chat responses, either via `/chat/stream` or `/chat/deep_think/stream` depending on `isDeepResearchEnabled`, updating the UI with incremental results.  It uses Redux (`useSelector`) to access filter IDs and existing chat messages and `useState` to manage loading state and the response. The hook's critical dependencies are the Redux store (for chat data) and the backend API endpoints.  The `setMessages` prop updates the application state with the streamed response, integrating it into the broader chat application.\n",
  },
  {
    fileName: "src/types/common.ts",
    summary:
      "This `src/types/common.ts` file defines common data types used throughout our application.  It enhances code readability and maintainability by centralizing type definitions.  Specifically, it declares interfaces for `SelectProp` (used for dropdown components), `FilterDataPayload` (for filtering data across various fields), and `ChatMessageType` (for structuring chat messages).  These types are used across multiple components and modules, ensuring consistency and type safety.  No external dependencies are present; it's a self-contained file crucial for the application's type system.\n",
  },
  {
    fileName: "src/types/prompt-template.ts",
    summary:
      "This `src/types/prompt-template.ts` file defines the data structure for prompt templates used in our system.  It uses an `enum` to categorize prompts (e.g., relating to patients, interventions, etc.) and an interface `PromptTemplate` to represent each template, including its ID, title, description, the prompt text itself, and its category. This ensures type safety and consistency across the application when handling prompts.  It's a critical dependency for any module generating or utilizing prompt templates.  Understanding the `TemplateCategory` enum is key to correctly categorizing and filtering prompts.\n",
  },
  {
    fileName: "src/pages/NotFoundPage.tsx",
    summary:
      "This `src/pages/NotFoundPage.tsx` file renders a custom \"404 Not Found\" page for the React application.  Its core functionality is to display a user-friendly message when a user navigates to a non-existent route. It uses React Router's `Link` component to provide a link back to the home page (`/`).  It's crucial for providing a good user experience and gracefully handling invalid URLs.  Key dependencies are `react-router-dom` for navigation and Tailwind CSS for styling. Understanding React component structure and routing concepts is essential.\n",
  },
  {
    fileName: "src/router/ProtectedRoute.tsx",
    summary:
      "This `ProtectedRoute` component controls access to protected parts of the application.  Its core functionality is to check if an API key exists in `sessionStorage` (`isAuthenticatedUser`). If present (user is authenticated), it renders its child components; otherwise, it redirects to the root path (\"/\").  It leverages React Router's `Navigate` for redirection. This fits into the broader system by acting as a gatekeeper for secured routes, ensuring only authenticated users can access sensitive content.  A critical dependency is `sessionStorage` and understanding how React Router's component rendering works.\n",
  },
  {
    fileName: "src/pages/ChatStudioPage.tsx",
    summary:
      "`src/pages/ChatStudioPage.tsx` renders the main UI for the Chat Studio application.  It uses a functional component structure and leverages React's state management for messages.  Key functionality includes displaying a chat interface (`ChatInterface`), filter controls (`FilterConfigController`), and chat history (`ChatHistory`).  It relies on Redux (`useAppSelector`) for side panel state and utilizes custom utility functions (`cn`) and type definitions (`ChatMessageType`).  The page's layout is managed through a custom `Panel` component.  Understanding Redux and the application's state management is critical.\n",
  },
  {
    fileName: "src/router/index.tsx",
    summary:
      "This `src/router/index.tsx` file defines the application's routing logic using React Router v6.  It creates a browser router (`createBrowserRouter`) using a pre-defined set of routes (`routes`). The `Router` component renders the `RouterProvider`, which dynamically displays components based on the URL.  `Suspense` handles loading states.  Critical dependencies are `react-router-dom` and the `routes` file (defining the application's navigation structure).  This file is central to the application's navigation and user interface flow.\n",
  },
  {
    fileName: "src/pages/ApiKeyPage.tsx",
    summary:
      "`src/pages/ApiKeyPage.tsx` is a React component responsible for handling API key input and validation.  It uses `react-hook-form` for form management with Zod for schema validation (`apiKeySchema`).  The component fetches the API key from environment variables (`process.env.API_KEY`) and submits it, likely for authentication.  It uses UI components from `@/components` and integrates with `react-router-dom` for navigation and `sonner` for toast notifications.  Critical dependencies include the `apiKeySchema` validator and the environment variable `API_KEY`.  The component's success or failure likely determines user access to other parts of the application.\n",
  },
  {
    fileName: "src/components/select/MultiSelect.tsx",
    summary:
      "This file (`src/components/select/MultiSelect.tsx`) implements a reusable multi-select dropdown component.  Its core functionality allows users to select multiple options from a provided list.  It handles searching, visual feedback (loading, error), and dynamic positioning of the dropdown.  It integrates with `react-hook-form` (via the `value` and `onChange` props) for form management.  Key dependencies include `lucide-react` for icons and a custom `useClickOutside` hook for managing dropdown closure.  Understanding React's state management (`useState`, `useEffect`) and functional component patterns is crucial for working with this component.\n",
  },
  {
    fileName: "src/utils/data.ts",
    summary:
      "This `src/utils/data.ts` file provides static data for the application.  It exports two constant arrays: `chatHistoryData`, containing sample chat titles with IDs, and `decisionDateData`, offering pre-defined date ranges with labels and values.  This file acts as a data source, likely used for populating dropdown menus, lists, or initial state in components.  It's independent and doesn't depend on any external services or data sources; it simply provides hardcoded data. Understanding its structure is key for modifying or extending the available data options within the application.\n",
  },
  {
    fileName: "src/utils/helpers.tsx",
    summary:
      "This `helpers.tsx` file contains reusable utility functions for common tasks, preventing code duplication across the project.  It provides functions for formatting select options, converting objects to query strings,  simulating asynchronous delays (`sleep`), and retrieving conversation history.  It leverages TypeScript for type safety.  A key dependency is the `Message` type from `@/libs/redux/chatMessagesSlice`, used by `getConversationHistory`. The functions use functional programming patterns (e.g., `map`) for concise and readable code. These helpers improve maintainability and consistency throughout the application.\n",
  },
  {
    fileName: "src/types/deep-research.ts",
    summary:
      "This file, `src/types/deep-research.ts`, defines TypeScript interfaces and types for different message types used in a deep research process.  It ensures type safety for messages like `RewriteMessage`, `ThinkMessage`, `ResearchMessage`, etc., each representing a stage in the process.  These messages likely form the communication backbone of a system performing in-depth research or problem-solving, with each message carrying specific data.  Understanding these types is crucial for correctly sending and processing messages within the system.  No external dependencies are explicitly shown in this snippet; the key pattern is the use of discriminated unions (`DeepResearchMessage`) for handling various message types.\n",
  },
  {
    fileName: "src/components/ui/autosize-textarea.tsx",
    summary:
      "This file, `src/components/ui/autosize-textarea.tsx`, provides a custom React hook, `useAutosizeTextArea`,  that automatically adjusts the height of a textarea element based on its content.  It ensures the textarea dynamically grows or shrinks within specified minimum and maximum height constraints.  It uses `useEffect` for reactive height adjustment and relies on the `scrollHeight` property.  The hook is imperative, using `useImperativeHandle` to manage the textarea ref.  It's part of a UI component library (`src/components/ui`) and depends on internal utility functions (`cn` from `@/libs/utils`).  Understanding React refs and imperative hooks is crucial.\n",
  },
  {
    fileName: "src/services/chatApi.ts",
    summary:
      "This file, `src/services/chatApi.ts`, defines API endpoints for interacting with a chat service using the `apiSlice` library (a critical dependency, likely RTK Query).  It provides two mutation functions: `useAddQueryMutation` for sending a standard chat query and `useAddSteamingQueryMutation` for streaming queries.  These functions handle POST requests to `/chat/` and `/chat/stream` respectively, sending data and likely receiving chat responses.  It integrates into the broader system by providing a clean, typed interface for accessing chat functionality from other parts of the application.  Understanding RTK Query's concepts of mutations and asynchronous data fetching is crucial.\n",
  },
  {
    fileName: "src/utils/index.ts",
    summary: "",
  },
  {
    fileName: "src/services/promptTemplateApi.ts",
    summary:
      "This file, `src/services/promptTemplateApi.ts`, defines an API slice using the `apiSlice` (presumably a Redux Toolkit RTK Query instance) to interact with a backend service for retrieving prompt templates.  Its key functionality is fetching all available prompt templates via the `getAllPromptTemplates` query.  This integrates with the broader system by providing a convenient React hook, `useGetAllPromptTemplatesQuery`, for components to easily access and manage prompt templates. Critical dependencies are `apiSlice` and the `PromptTemplate` type definition.  It leverages RTK Query's caching and data fetching mechanisms.\n",
  },
  {
    fileName: "src/utils/parser.ts",
    summary:
      'This `src/utils/parser.ts` file handles parsing and grouping of Deep Research messages.  Its main purpose is to process a JSON Lines (JSONL) string, splitting it into individual JSON messages (`parseJsonl`).  It then groups these messages by a common ID, separating "think" and "research" message types (`groupMessagesByID`). This is crucial for organizing data received from a Deep Research system.  It relies on the `DeepResearchMessage` type defined in `@/types/deep-research` and uses a custom separator ("---VIVA--SEPARATOR---"). Robust error handling is included for malformed JSON.  The output is used downstream to process and display research data.\n',
  },
  {
    fileName: "src/validators/authSchema.ts",
    summary:
      "This file, `src/validators/authSchema.ts`, defines a schema for validating API keys using the Zod validation library.  Its main purpose is to ensure that API keys provided by clients meet specific criteria (minimum length of 10 characters in this case).  It enhances system security by preventing improperly formatted keys from reaching authentication processes.  The `apiKeySchema` exports a Zod schema, and `ApiKeyType` exports a type definition inferred from the schema for TypeScript type safety.  The critical dependency is the Zod library. This schema is likely used early in the authentication flow to validate incoming requests.\n",
  },
  {
    fileName: "src/components/select/SimpleSelect.tsx",
    summary:
      "This file (`SimpleSelect.tsx`) defines a reusable React component for a simple, customizable select dropdown.  It uses the `ui/select` component library for rendering the dropdown's visual elements.  Key functionality includes displaying options passed via `options` prop, handling user selection via `onChange`, and incorporating labels, placeholders, and error messages.  It relies on the `cn` utility for class name manipulation and  `SelectProp` type definition.  It fits into the broader system by providing a standardized select input element across the application, improving code consistency and maintainability.\n",
  },
  {
    fileName: "src/components/shared/TextSelectionWrapper.tsx",
    summary:
      "This `TextSelectionWrapper` component provides a reusable mechanism for handling text selections within the application.  It captures selected text, its position, timestamp, and assigns a color, storing selections in an internal state.  A tooltip, rendered via `createPortal`, displays the selected text and potentially offers actions (though those actions aren't fully shown in this snippet). It leverages React's state management (`useState`, `useEffect`) and functional components.  Critical dependencies include Lucide-React for icons and the UI component library (`Button`, `Dialog`, `Input`, `ScrollArea`). The component uses functional programming paradigms and likely integrates with other parts of the system needing text selection capabilities.\n",
  },
  {
    fileName: "src/components/ui/calendar.tsx",
    summary:
      "This file (`src/components/ui/calendar.tsx`) implements a reusable calendar component for the application.  It uses the `react-day-picker` library to render a calendar, allowing users to select dates.  The component is highly customizable through props, inheriting styling from a shared `buttonVariants` and utilizing a utility function (`cn`) for className management.  It's part of a UI component library (`src/components/ui`) and depends on React and the `react-day-picker` library for its core functionality.  Understanding the `cn` utility and prop drilling for styling is crucial.\n",
  },
  {
    fileName: "src/components/shared/TypingLoadder.tsx",
    summary:
      "This file, `TypingLoader.tsx`, defines a reusable React component that displays a simple loading animation.  It uses three bouncing circles to visually indicate that an operation is in progress.  The animation is achieved using CSS's `animate-bounce` class and staggered `animationDelay` to create a typing-like effect. It's located in `src/components/shared/` indicating it's a general-purpose component shared across the application.  It has no external dependencies beyond standard React and CSS, relying on pre-defined CSS classes (`primary-500`, `animate-bounce`).  Understanding basic React component structure and CSS animations is key to working with it.\n",
  },
  {
    fileName: "src/components/spinner/index.tsx",
    summary:
      "This `src/components/spinner/index.tsx` file defines a reusable React component called `Spinner`.  Its purpose is to display a loading indicator to the user.  It uses the `lucide-react` library for the visual spinner (`Loader` component) and `cn` (likely a utility for class name concatenation) for styling flexibility.  The `Spinner` integrates into the broader system by providing a standardized loading experience across different parts of the application. Critically, it relies on the `cn` utility and the `lucide-react` library; understanding how to install and use external libraries is important.  The `className` prop allows for custom styling integration.\n",
  },
  {
    fileName: "src/validators/filtersSchema.ts",
    summary:
      "This file, `src/validators/filtersSchema.ts`, defines a schema for validating filter parameters used in our application.  It uses the Zod library to create a structured schema ensuring that incoming filter data (countries, agencies, etc.) conforms to the expected format: an optional array of objects with `label` and `value` strings.  This schema is crucial for data integrity and prevents unexpected input from causing errors. It's a critical dependency for any component handling filter requests, enforcing type safety and enabling robust error handling through Zod's validation capabilities.  The `FiltersSchemaType` provides a TypeScript type for strongly-typed usage throughout the system.\n",
  },
  {
    fileName: "src/components/ui/accordion.tsx",
    summary:
      "This file `src/components/ui/accordion.tsx` implements a reusable accordion component for the application.  It leverages the `@radix-ui/react-accordion` library for core functionality, enhancing it with custom styling using Tailwind CSS (`cn` utility).  The component exports `Accordion`, `AccordionItem`, and `AccordionTrigger` for easy integration. It uses React's `forwardRef` for better accessibility and prop handling. Understanding Tailwind CSS and the `@radix-ui/react-accordion` library's API is crucial for working with this component.  It sits within the `ui` component directory, providing a standardized, accessible accordion for use throughout the application.\n",
  },
  {
    fileName: "src/components/ui/card.tsx",
    summary:
      "This file, `src/components/ui/card.tsx`, defines reusable UI components for creating cards: a base `Card` component and supporting components `CardHeader` and `CardTitle`.  Its purpose is to provide a consistent, styled card structure for displaying information throughout the application.  It leverages the `cn` utility (likely for class name concatenation) and React's `forwardRef` for better control over refs.  The components use Tailwind CSS for styling.  It fits within a broader UI component library and depends on the `cn` utility function likely located in `src/libs/utils`.  Understanding Tailwind CSS classes and React's composition patterns is crucial.\n",
  },
  {
    fileName: "src/components/ui/input.tsx",
    summary:
      "This file (`src/components/ui/input.tsx`) defines a reusable UI component for input fields.  It provides a styled and accessible HTML input element, handling various input types and optional error display.  It leverages the `cn` utility for efficient class name management and uses React's `forwardRef` for proper ref handling.  It's part of a UI component library (`src/components/ui`) and depends on the `cn` utility from `@/libs/utils`. Understanding React's component composition and styled-system principles is crucial for working with this component.\n",
  },
  {
    fileName: "src/components/shared/MarkdownContent.tsx",
    summary:
      "This `MarkdownContent.tsx` component renders Markdown content within our application.  Its key functionality is to take a Markdown string as input (`children` prop) and convert it into styled HTML using `react-markdown` and `remark-gfm` for GitHub Flavored Markdown support.  It enhances readability by applying custom styling to headings (h1-h4).  It's a shared component, reusable across the application for displaying formatted text. Critical dependencies are `react-markdown` and `remark-gfm`; understanding how React component props and JSX work is crucial.\n",
  },
  {
    fileName: "src/components/ui/form.tsx",
    summary:
      "This file (`src/components/ui/form.tsx`) provides a reusable, enhanced form component for the application.  It leverages `react-hook-form` for efficient form management and state handling, wrapping its `Controller` component within a custom `FormField` context. This context makes the field name readily accessible to child components.  The `Form` component is an alias for `FormProvider`, setting up the overall form context.  Key dependencies are `react-hook-form`, `@radix-ui/react-label`, and internal utility functions (`cn`). Understanding React context and `react-hook-form`'s concepts is crucial for working with this component.  It integrates with the broader system by providing a consistent and manageable way to build forms throughout the application.\n",
  },
  {
    fileName: "src/components/ui/dialog.tsx",
    summary:
      "This file (`src/components/ui/dialog.tsx`) implements a reusable dialog component using the `@radix-ui/react-dialog` library.  It provides a customizable modal dialog with an overlay, content area, trigger, and close button.  The component leverages React's `forwardRef` for better accessibility and integrates seamlessly into other parts of the application as a UI element. Key functionality includes opening, closing, and managing the dialog's state.  It relies on Radix UI for its core dialog functionality and uses Lucide React for the close icon, along with internal utility functions (`cn` for className composition).  Understanding React's composition and Radix UI's dialog primitives is crucial.\n",
  },
  {
    fileName: "src/components/ui/button.tsx",
    summary:
      "This file (`src/components/ui/button.tsx`) defines a reusable button component for the UI library.  It uses `class-variance-authority` for styling variations (default, destructive, outline, secondary), offering flexibility through props.  It leverages Radix UI's `Slot` for customizability and includes a loading state via `LoaderIcon`.  It relies on utility functions (`cn` for className concatenation) and design system's color palette. This component is a crucial building block for creating interactive elements throughout the application. Understanding `cva` and its variant system is key to customizing the button's appearance.\n",
  },
  {
    fileName: "src/components/ui/select.tsx",
    summary:
      "This file (`src/components/ui/select.tsx`) defines a reusable custom select component.  It leverages the `@radix-ui/react-select` library for core functionality, enhancing it with custom styling and theming using Tailwind CSS (`cn` utility).  The component provides a styled dropdown select input, including trigger, value display, and option grouping capabilities. It's a crucial UI building block, likely used throughout the application, relying on Lucide React for icons and internal utility functions (`cn`). Understanding React's `forwardRef` and the `@radix-ui/react-select` API is key to working with this component.\n",
  },
  {
    fileName: "src/components/ui/scroll-area.tsx",
    summary:
      "This file `src/components/ui/scroll-area.tsx` implements a reusable, customizable scroll area component using the `@radix-ui/react-scroll-area` library.  Its core functionality is providing smooth scrolling with visually appealing scrollbars within a contained area.  It leverages React's `forwardRef` for better accessibility and integrates seamlessly into other UI components needing scrollable content.  Critical dependencies include `@radix-ui/react-scroll-area` and the project's `cn` utility for className management.  The component follows a composition pattern, wrapping the radix UI primitives.\n",
  },
  {
    fileName: "src/components/ui/label.tsx",
    summary:
      "This file defines a reusable `Label` component for UI forms.  It leverages `@radix-ui/react-label` for accessibility and styling via `class-variance-authority` (cva) for flexible theming.  The `cn` utility from `@/libs/utils` helps manage classNames.  It's a crucial part of the UI component library, providing accessible and styled labels for all form inputs. Understanding cva for variant props and the `cn` utility for className management are key.  It depends on `@radix-ui/react-label` for its core functionality.\n",
  },
  {
    fileName: "src/components/ui/table.tsx",
    summary:
      "This file, `src/components/ui/table.tsx`, provides reusable React components for creating accessible and styled HTML tables.  It exports `Table`, `TableHeader`, `TableBody`, and `TableFooter` components,  allowing developers to structure tabular data cleanly.  It uses the `cn` utility (likely for class name composition) and leverages React's `forwardRef` for better accessibility and ref management.  It's a UI component, so it depends on React and the `cn` utility from `@/libs/utils`.  Understanding React's component lifecycle and composition is crucial for using it effectively.\n",
  },
  {
    fileName: "src/libs/redux/chatMessagesSlice.ts",
    summary:
      "This file (`src/libs/redux/chatMessagesSlice.ts`) manages the chat message state within a Redux application using Redux Toolkit.  It defines the structure of chat messages (`Message` interface),  holds the array of messages and filter IDs (`ChatState`), and provides actions (`addMessage`, `addMessages`, `updateMessage`) to add, add multiple, and update messages in the store.  It relies on `@reduxjs/toolkit` for efficient state management.  This slice likely integrates with a chat UI component, updating its display whenever the Redux store changes. Understanding Redux and Redux Toolkit is crucial for working with this file.\n",
  },
  {
    fileName: "src/components/ui/separator.tsx",
    summary:
      "This file defines a reusable UI component, `Separator`,  for creating horizontal or vertical dividers within the application. It leverages the `@radix-ui/react-separator` library for core functionality, wrapping it with custom styling using Tailwind CSS (`cn` utility).  The component is designed for flexibility, allowing customization of orientation and decoration.  It utilizes React's `forwardRef` for proper ref forwarding and integrates seamlessly into any part of the application needing visual separation.  Understanding Tailwind CSS and React's component composition is key.\n",
  },
  {
    fileName: "src/components/ui/popover.tsx",
    summary:
      "This file (`src/components/ui/popover.tsx`) implements a reusable popover component using the `@radix-ui/react-popover` library.  It provides a customizable popover with trigger, content, and anchor functionalities.  The component leverages React's `forwardRef` for better accessibility and integrates with the project's utility functions (`cn` for className merging). It's a UI component that's likely used throughout the application for displaying contextual information or menus.  Critical dependencies are `@radix-ui/react-popover` and the internal `cn` utility.  Understanding React's component composition and forwardRef is crucial.\n",
  },
  {
    fileName: "src/components/hook-form/HookFormItem.tsx",
    summary:
      "`HookFormItem.tsx` is a reusable React component that simplifies creating form fields within a React Hook Form context.  It leverages `react-hook-form` for validation and state management.  The component takes children (typically an input element), a name, and an optional label. It renders a form label, input field, and error message, integrating seamlessly with the UI form components (`FormControl`, `FormField`, etc.).  Understanding `react-hook-form`'s `useFormContext` and its `control` object is crucial.  It uses `isValidElement` to handle custom input components.\n",
  },
  {
    fileName: "src/components/ui/textarea.tsx",
    summary:
      "This file, `src/components/ui/textarea.tsx`, defines a reusable React component for text input areas.  It implements a styled textarea with features like minimum height, rounded corners, and accessibility features (focus styles).  It leverages the `cn` utility function (likely for class name concatenation) from `@/libs/utils`.  This component is part of a UI library (`src/components/ui`), providing a consistent and styled textarea for use throughout the application. Understanding React's `forwardRef` for proper ref management and the `cn` utility's functionality are crucial.\n",
  },
];

export const fileStructure = {
  Dockerfile: "file",
  "components.json": "file",
  "README.md": "file",
  "package.json": "file",
  "docker-compose.yml": "file",
  "index.html": "file",
  "postcss.config.js": "file",
  "vite.config.ts": "file",
  "tailwind.config.js": "file",
  "nginx.conf": "file",
  src: {
    "main.tsx": "file",
    "App.tsx": "file",
    "index.css": "file",
    "vite-env.d.ts": "file",
    libs: {
      "utils.ts": "file",
      redux: {
        "chatMessagesSlice.ts": "file",
        "sidePanelSlice.ts": "file",
        "store.ts": "file",
        "hooks.ts": "file",
      },
    },
    pages: {
      "ChatStudioPage.tsx": "file",
      "ApiKeyPage.tsx": "file",
      "NotFoundPage.tsx": "file",
    },
    hooks: {
      "useStreamingResponse.ts": "file",
      "useClickOutside.tsx": "file",
    },
    types: {
      "common.ts": "file",
      "prompt-template.ts": "file",
      "deep-research.ts": "file",
    },
    router: {
      "routes.tsx": "file",
      "ProtectedRoute.tsx": "file",
      "index.tsx": "file",
    },
    services: {
      "chatApi.ts": "file",
      "promptTemplateApi.ts": "file",
      filters: {
        "filtersApi.ts": "file",
      },
      api: {
        "apiSlice.ts": "file",
        "customFetchBase.ts": "file",
      },
    },
    utils: {
      "helpers.tsx": "file",
      "data.ts": "file",
      "parser.ts": "file",
      "index.ts": "file",
    },
    components: {
      "hook-form": {
        "HookFormItem.tsx": "file",
      },
      shared: {
        "TypingLoadder.tsx": "file",
        "TextSelectionWrapper.tsx": "file",
        "MarkdownContent.tsx": "file",
      },
      spinner: {
        "index.tsx": "file",
      },
      ui: {
        "autosize-textarea.tsx": "file",
        "accordion.tsx": "file",
        "dialog.tsx": "file",
        "card.tsx": "file",
        "form.tsx": "file",
        "popover.tsx": "file",
        "select.tsx": "file",
        "table.tsx": "file",
        "textarea.tsx": "file",
        "label.tsx": "file",
        "separator.tsx": "file",
        "button.tsx": "file",
        "scroll-area.tsx": "file",
        "calendar.tsx": "file",
        "input.tsx": "file",
      },
      select: {
        "SimpleSelect.tsx": "file",
        "MultiSelect.tsx": "file",
      },
    },
    validators: {
      "authSchema.ts": "file",
      "filtersSchema.ts": "file",
    },
    features: {
      "chat-studio": {
        chat: {
          "ChatInterface.tsx": "file",
          "ChatMessage.tsx": "file",
          components: {
            "AiResponseAction.tsx": "file",
          },
          "custom-message": {
            "DeepResearchMessage.tsx": "file",
            components: {
              "FinalAnswerSection.tsx": "file",
              "ResearchContent.tsx": "file",
            },
          },
          "prompt-template": {
            "PromptTemplateModal.tsx": "file",
          },
        },
        history: {
          "ChatHistory.tsx": "file",
        },
        filters: {
          "TableView.tsx": "file",
          "FilterConfigController.tsx": "file",
        },
      },
    },
  },
};
