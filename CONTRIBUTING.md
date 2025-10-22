# Contributing to YouQuery

First off, thank you for considering contributing to YouQuery! It's people like you that make the open source community such a great place to learn, inspire, and create.

## 📋 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🎯 How Can I Contribute?

### Reporting Bugs

1. **Check if the bug has already been reported** by searching on GitHub under [Issues](https://github.com/yourusername/you-query/issues).
2. If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/yourusername/you-query/issues/new). Be sure to include:
   - A clear and descriptive title
   - Steps to reproduce the issue
   - Expected vs. actual behavior
   - Screenshots if applicable
   - Your environment (browser, OS, etc.)

### Suggesting Enhancements

1. Use the issue tracker to suggest new features or improvements.
2. Clearly describe the feature and why you believe it would be beneficial.
3. Include any relevant technical details or implementation ideas.

### Your First Code Contribution

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/you-query.git
   cd you-query
   git remote add upstream https://github.com/original-owner/you-query.git
   ```
3. **Create a new branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** following the project's coding standards.
5. **Test your changes** thoroughly.
6. **Commit your changes** with a clear message:
   ```bash
   git commit -m "feat: add new feature"
   ```
7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Create a Pull Request** from your fork to the original repository.

## 🛠 Development Setup

### Prerequisites

- Node.js 16+ and npm 8+
- Python 3.9+
- PostgreSQL

### Installation

1. **Set up the backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements-dev.txt
   ```

2. **Set up the frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

3. **Set up the database**:
   ```bash
   # Create a new PostgreSQL database
   createdb youquery_db
   
   # Run migrations
   cd ../backend
   alembic upgrade head
   ```

### Running Tests

1. **Backend tests**:
   ```bash
   cd backend
   pytest
   ```

2. **Frontend tests**:
   ```bash
   cd frontend
   npm test
   ```

## 📝 Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, including new environment variables, exposed ports, useful file locations, and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. Your pull request will be reviewed by the maintainers. You may be asked to make additional changes.

## 📜 Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for our commit messages. Here are some examples:

- `feat: add new feature`
- `fix: fix a bug`
- `docs: update documentation`
- `style: format code`
- `refactor: code change that neither fixes a bug nor adds a feature`
- `test: add tests`
- `chore: update build process, package manager configs, etc.`

## 🏆 Recognition

All contributors will be recognized in our contributors list. Significant contributions may also be highlighted in release notes.

## 🤔 Questions?

If you have any questions, feel free to open an issue or reach out to the maintainers.

Thank you for your interest in making Portfolio AI Chatbot better! 🚀
