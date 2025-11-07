#!/bin/bash

# Design System Cleanup - Implementation Script
# This script helps you safely migrate to the new clean design system

echo "🎨 Workspace Design System Cleanup"
echo "===================================="
echo ""

# Step 1: Backup current files
echo "📦 Step 1: Creating backups..."
echo ""

# Create backup directory
mkdir -p ./backup-$(date +%Y%m%d)

# Backup important files
if [ -f "tailwind.config.mjs" ]; then
    cp tailwind.config.mjs ./backup-$(date +%Y%m%d)/
    echo "✓ Backed up tailwind.config.mjs"
fi

if [ -f "src/styles/global.css" ]; then
    cp src/styles/global.css ./backup-$(date +%Y%m%d)/
    echo "✓ Backed up global.css"
fi

if [ -f "package.json" ]; then
    cp package.json ./backup-$(date +%Y%m%d)/
    echo "✓ Backed up package.json"
fi

echo ""
echo "✅ Backups created in ./backup-$(date +%Y%m%d)/"
echo ""

# Step 2: Show what needs to be done
echo "📋 Step 2: Migration Checklist"
echo ""
echo "□ Replace tailwind.config.mjs with clean version"
echo "□ Replace src/styles/global.css with clean version"
echo "□ Update component class names (see migration-guide.md)"
echo "□ Remove DaisyUI from package.json (optional)"
echo "□ Test all components"
echo "□ Check dark mode"
echo ""

# Step 3: File comparison
echo "🔍 Step 3: Comparing files..."
echo ""
echo "Current Tailwind config size:"
wc -l tailwind.config.mjs 2>/dev/null || echo "  File not found"
echo ""
echo "Current global.css size:"
wc -l src/styles/global.css 2>/dev/null || echo "  File not found"
echo ""

# Step 4: Instructions
echo "📝 Step 4: Manual Actions Required"
echo ""
echo "1. Review the new files:"
echo "   - tailwind.config.clean.mjs"
echo "   - global.clean.css"
echo "   - migration-guide.md"
echo ""
echo "2. When ready to apply changes:"
echo "   cp tailwind.config.clean.mjs tailwind.config.mjs"
echo "   cp global.clean.css src/styles/global.css"
echo ""
echo "3. Update your components (refer to migration-guide.md)"
echo ""
echo "4. (Optional) Remove DaisyUI:"
echo "   npm uninstall daisyui"
echo ""
echo "5. Restart your dev server:"
echo "   npm run dev"
echo ""

# Step 5: Find files that need updating
echo "🔎 Step 5: Finding files that need updates..."
echo ""
echo "Files using DaisyUI classes:"
grep -r "btn-primary\|btn-secondary\|badge-primary\|input-bordered" src/ --include="*.astro" --include="*.tsx" --include="*.jsx" 2>/dev/null | wc -l
echo ""

# Step 6: Safety checks
echo "⚠️  Step 6: Important Notes"
echo ""
echo "1. Test thoroughly after migration"
echo "2. Check mobile responsiveness"
echo "3. Verify dark mode still works"
echo "4. Test all forms and buttons"
echo "5. Check accessibility (keyboard navigation)"
echo ""

echo "✨ Ready to clean up your design system!"
echo ""
echo "Next steps:"
echo "  1. Read the migration-guide.md"
echo "  2. Apply the new config files"
echo "  3. Update component class names"
echo "  4. Test everything!"
echo ""
