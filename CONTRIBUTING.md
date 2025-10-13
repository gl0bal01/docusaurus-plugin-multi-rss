# Contributing to docusaurus-plugin-multi-rss

Thank you for considering contributing to this project! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version, Docusaurus version)
- Any relevant logs or error messages

### Suggesting Features

Feature requests are welcome! Please open an issue describing:
- The problem you're trying to solve
- Your proposed solution
- Why this feature would be useful to others

### Pull Requests

1. **Fork the repository** and create a feature branch
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run typecheck
   ```

4. **Commit your changes**
   ```bash
   git commit -m "Add feature: description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/my-new-feature
   ```

6. **Open a Pull Request** with:
   - Clear description of changes
   - Reference to related issues
   - Any breaking changes noted

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/docusaurus-plugin-multi-rss.git
cd docusaurus-plugin-multi-rss

# Install dependencies
npm install

# Type check
npm run typecheck
```

## Code Style

- Use TypeScript for all source files
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Use meaningful variable names

## Testing

Before submitting a PR:
- [ ] Code passes TypeScript checks (`npm run typecheck`)
- [ ] Tested in a real Docusaurus project
- [ ] Documentation updated if needed
- [ ] No breaking changes (or clearly documented)

## Questions?

Feel free to open an issue for questions or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
