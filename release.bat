# Build the Windows installer
npm run build:win

# Commit changes if any
git add .
git commit -m "Prepare for release v1.0.0"

# Create and push tag
git tag v1.0.0
git push origin main
git push origin v1.0.0
