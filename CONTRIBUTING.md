# Contributing Guidelines

Thank you for your interest in contributing to Filmify Frontend! This document provides guidelines and instructions for contributing to the project.

## 🎯 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Respect others' work and ideas
- Report issues through proper channels

## 📋 Before You Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
4. **Set up development environment** (see README.md)

## 🔧 Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests (if available)
npm test

# Run linter
npm run lint
```

## 📝 Making Changes

### Branch Naming Convention
```
feature/description          # New feature
bugfix/description           # Bug fix
improvement/description      # Code improvement
docs/description            # Documentation
refactor/description        # Code refactoring
```

### Commit Message Format
```
type(scope): subject

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Test updates
- `chore`: Build/tooling changes

**Examples:**
```
feat(booking): add seat selection confirmation
fix(auth): resolve token expiry issue
docs(readme): add installation instructions
refactor(components): simplify card component
```

## 🎨 Code Style

### JavaScript/React
- Use **functional components** with hooks
- Use **camelCase** for variables and functions
- Use **PascalCase** for component names
- Use **UPPERCASE** for constants
- Maximum line length: 100 characters

```javascript
// Good ✓
const getUserData = async () => {
  const response = await fetchUser();
  return response.data;
};

// Bad ✗
function get_user_data(){
  const data=fetchUser();return data;
}
```

### SCSS/CSS
- Use **BEM methodology** for class names
- Group related properties
- Use variables for repeated values
- Mobile-first approach

```scss
// Good ✓
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  
  &:hover {
    background-color: $accent;
  }
  
  &--primary {
    background: $primary;
  }
}

// Bad ✗
.btn { padding:5px; }
.btn-primary { background:blue; }
```

### Component Structure
```jsx
import React, { useState, useEffect } from 'react';
import './Component.scss';

export const Component = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState(null);

  // Effects
  useEffect(() => {
    // Initialization
  }, []);

  // Event handlers
  const handleClick = () => {};

  // Render
  return (
    <div className="component">
      {/* JSX */}
    </div>
  );
};
```

## 🧪 Testing Checklist

Before submitting a PR, ensure:
- [ ] Code builds without errors (`npm run build`)
- [ ] No console warnings or errors
- [ ] Changes work in both light and dark modes
- [ ] Responsive design maintained (mobile, tablet, desktop)
- [ ] Forms validated correctly
- [ ] API integration tested
- [ ] No breaking changes to existing features

## 📤 Submitting a Pull Request

1. **Update your fork**
```bash
git fetch upstream
git rebase upstream/main
```

2. **Push to your fork**
```bash
git push origin your-branch-name
```

3. **Create Pull Request**
   - Go to GitHub and create PR to `main` branch
   - Fill out PR template completely
   - Link related issues with `Closes #123`
   - Add screenshots for UI changes

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Changes Made
- List specific changes
- What was modified
- Why it was needed

## Testing
- [ ] Tested in development
- [ ] Tested in production build
- [ ] Mobile responsive verified
- [ ] Dark mode tested

## Screenshots (if UI changes)
[Add screenshots here]

## Related Issues
Closes #123
```

## 📚 Documentation

### Update Documentation When:
- Adding new features
- Changing API endpoints
- Modifying component props
- Creating new utility functions

### Documentation Format
```jsx
/**
 * Description of the component/function
 * 
 * @param {type} name - Description
 * @returns {type} Description
 * 
 * @example
 * const result = myFunction(param);
 */
```

## 🐛 Reporting Bugs

When reporting bugs, include:
1. **Description** - What's the issue?
2. **Steps to reproduce** - How to trigger it?
3. **Expected behavior** - What should happen?
4. **Actual behavior** - What actually happens?
5. **Environment** - Browser, OS, Node version
6. **Screenshots/Logs** - Visual evidence

## 💡 Suggesting Features

1. **Check existing issues** - Avoid duplicates
2. **Describe the feature** - Clear explanation
3. **Use cases** - Why is it needed?
4. **Implementation ideas** - How might it work?

## ✨ Best Practices

### Performance
- Avoid unnecessary re-renders (use React.memo, useMemo)
- Lazy load images and components
- Debounce search and input handlers
- Minimize bundle size

### Accessibility
- Use semantic HTML
- Add alt text to images
- Ensure keyboard navigation
- Maintain color contrast ratios

### Security
- Never commit secrets/keys
- Validate user input
- Sanitize API responses
- Use HTTPS for APIs

### Maintainability
- Keep functions small and focused
- Use descriptive variable names
- Add comments for complex logic
- DRY principle - Don't Repeat Yourself

## 🚀 Advanced Topics

### Adding Analytics
```javascript
import { trackEvent } from '../utils/analytics';

const handleBooking = () => {
  trackEvent('booking_completed', {
    movieId: movie.id,
    seats: selectedSeats.length
  });
};
```

### Error Boundary
```jsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## 📋 Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to docs
- `good first issue` - Good for beginners
- `help wanted` - Need assistance
- `in progress` - Currently being worked on
- `blocked` - Waiting for something

## 💬 Getting Help

- Check existing issues and PRs
- Read documentation thoroughly
- Ask in GitHub Discussions
- Email: dev@filmify.com

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [CSS-Tricks](https://css-tricks.com)
- [MDN Web Docs](https://developer.mozilla.org)

## ✅ Checklist Before Submitting

- [ ] Code follows style guide
- [ ] Changes documented
- [ ] Tested thoroughly
- [ ] No breaking changes
- [ ] PR description is clear
- [ ] Commits are meaningful
- [ ] No unnecessary files committed

## 🙏 Thank You

Thank you for contributing! Your efforts help make Filmify better for everyone!

---

**Questions?** Open an issue or reach out to the maintainers.
