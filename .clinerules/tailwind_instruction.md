Here is a guideline for writing modern React components with Tailwind CSS.

The core philosophy is to **embrace utility classes directly in your JSX** and build complex UIs by composing small, reusable components.

-----

### \#\# Component Architecture

Structure your components into logical types. A common and effective pattern is to separate them by responsibility, moving from generic to specific.

#### 1\. Primitive (or "Dumb") Components 🧱

These are your most basic, reusable UI elements. They don't manage state and are styled almost entirely with props.

  * **Examples**: `Button`, `Input`, `Badge`, `Card`, `Icon`.
  * **Goal**: Create a consistent set of building blocks for your entire application.
  * **Best Practices**:
      * They should accept props to control variants, sizes, and colors.
      * Use a library like `clsx` or `tailwind-merge` to conditionally apply classes.
      * Forward refs using `React.forwardRef` so they behave like native HTML elements.

**Example `Button.jsx`:**

```jsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

const Button = React.forwardRef(({ variant = 'primary', className, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md px-4 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const combinedClasses = twMerge(baseStyles, variants[variant], className);

  return <button ref={ref} className={combinedClasses} {...props} />;
});

export default Button;
```

#### 2\. Composite (or "Smart") Components 🧩

These components are composed of multiple primitive components to build more complex UI sections. They often manage local state.

  * **Examples**: `LoginForm`, `UserProfileCard`, `ProductGrid`.
  * **Goal**: Assemble your building blocks into functional pieces of the UI.
  * **Best Practices**:
      * Import and use your primitive components (`Button`, `Input`).
      * Handle user interactions and state management (`useState`, `useForm`).
      * Styling is mostly for layout (flex, grid, spacing) between the primitives.

**Example `LoginForm.jsx`:**

```jsx
import React, { useState } from 'react';
import Button from './Button'; // Your primitive button

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-md">
      <h2 className="text-xl font-bold text-gray-800">Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
      <Button type="submit" variant="primary">
        Sign In
      </Button>
    </form>
  );
}
```

-----

### \#\# Layout

Keep page structure separate from your UI components. Create dedicated layout components that use Flexbox or Grid to arrange content.

  * **Goal**: Define the main structure of a page (e.g., header, sidebar, main content) without mixing layout concerns into smaller components.
  * **Tools**: Primarily `flex`, `grid`, `gap`, and responsive prefixes (`sm:`, `md:`, `lg:`).

**Example `PageLayout.jsx`:**

```jsx
import React from 'react';
import Header from './Header'; // A composite component
import Sidebar from './Sidebar'; // Another composite component

function PageLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

// How you'd use it in a page file
function DashboardPage() {
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {/* ... page content ... */}
    </PageLayout>
  );
}
```

-----

### \#\# Handling CSS and Class Names ✨

#### Managing Dynamic Classes

Directly using ternary operators for classes can get messy and lead to conflicts. **`tailwind-merge`** is the essential modern tool to solve this. It intelligently merges your Tailwind classes, so the last utility in a group always wins (e.g., `p-4` will override `p-2`).

  * **Installation**: `npm install tailwind-merge`
  * **Usage**: Wrap all your component `className` strings in `twMerge()`. It cleans up conditional logic and resolves style conflicts automatically.

#### Co-locating Styles

For very long or complex class strings, define them as constants inside your component file. This keeps your JSX clean and readable.

**Example `Card.jsx` with co-located styles:**

```jsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

const cardBase = 'overflow-hidden rounded-lg bg-white shadow-lg';
const headerBase = 'border-b border-gray-200 px-4 py-3';
const contentBase = 'p-4';

function Card({ className, header, children }) {
  return (
    <div className={twMerge(cardBase, className)}>
      {header && <div className={headerBase}>{header}</div>}
      <div className={contentBase}>
        {children}
      </div>
    </div>
  );
}
```

#### When to Use `@apply` (The Escape Hatch)

While you should prefer utility classes, there are times `@apply` is useful in your main CSS file (`index.css` or similar).

1.  **Complex, Reused Custom Styles**: For a custom class that combines many utilities you use over and over.
    ```css
    .btn-fancy {
      @apply rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 text-white shadow-lg transition-transform hover:scale-105;
    }
    ```
2.  **Styling Third-Party Libraries**: When a library component only lets you apply a single class name.
3.  **Styling Markdown/CMS Content**: To apply styles to raw HTML tags like `h1`, `p`, and `ul` that you don't control directly.
    ```css
    .prose h1 {
        @apply mb-4 text-3xl font-bold;
    }
    .prose p {
        @apply mb-2 text-base text-gray-700;
    }
    ```