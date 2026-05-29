# playwright_automation
playwright Web and API Automation

npx playwright test tests/browserContext.spec.js --headed

npx playwright test texts.spec.js --project=chromium

npx playwright test texts.spec.js --ui



# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox

# Run with specific configuration
npx playwright test --config=playwright.config.ts

# Parallelism control
npx playwright test --workers=4

# Set timeout
npx playwright test --timeout=60000

# Save video + screenshot on failure
npx playwright test --grep="my test" --headed


# 1. Development (Recommended)
npx playwright test texts.spec.js --ui

# 2. Debug one test
npx playwright test texts.spec.js --debug

# 3. Run and see report
npx playwright test texts.spec.js && npx playwright show-report

# 4. Run only Chrome, visible
npx playwright test texts.spec.js --project=chromium --headed


# Basic command
npx playwright codegen

# Record on a specific website (Recommended)
npx playwright codegen https://example.com

# Save directly to a file while recording
npx playwright codegen https://example.com --output tests/texts.spec.js

npx playwright codegen --device="Pixel 5" --output tests/mobile.spec.js https://playwright.dev

