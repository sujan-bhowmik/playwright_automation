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

# Generate HTML report
npx allure generate allure-results --clean

# Open the report in browser
npx allure open


npx allure generate allure-results --clean && npx allure open

npx playwright test tests/SelectorsPractice.spec.js --project=chromium --headed --slowMo=800


playwright-api/
├── tests/
│   └── api/
│       ├── users.spec.js          # one spec per resource/endpoint group
│       ├── auth.spec.js
│       └── orders.spec.js
├── api/                           # service/client layer (like POM for APIs)
│   ├── base-api.js                # shared request logic, headers, error handling
│   ├── users-api.js               # wraps user endpoints: createUser(), getUser()...
│   └── auth-api.js
├── test-data/
│   ├── users.json                 # static payloads
│   └── payload-builders.js        # dynamic payload factories
├── utils/
│   ├── token-helper.js            # auth token generation/caching
│   └── schema-validator.js        # response schema validation
├── fixtures/
│   └── api-fixtures.js            # custom fixtures (authenticated request context)
├── config/
│   ├── dev.env
│   └── qa.env
├── playwright.config.js           # baseURL per environment, projects
├── .env                           # secrets (gitignored)
├── .gitignore
└── package.json



playwright-framework/
├── tests/
│   ├── web/                          # desktop web UI tests
│   │   ├── login.spec.js
│   │   └── checkout.spec.js
│   ├── mobile/                       # mobile-web tests (emulated devices)
│   │   ├── login.mobile.spec.js
│   │   └── nav.mobile.spec.js
│   └── api/
│       ├── users.spec.js
│       └── auth.spec.js
│
├── pages/                            # Page Object Model (shared by web + mobile)
│   ├── base-page.js
│   ├── login-page.js
│   └── checkout-page.js
│
├── api/                              # service layer for API tests
│   ├── base-api.js
│   ├── users-api.js
│   └── auth-api.js
│
├── fixtures/
│   ├── ui-fixtures.js                # injects page objects into tests
│   └── api-fixtures.js               # authenticated request context
│
├── test-data/
│   ├── users.json
│   └── payload-builders.js
│
├── utils/
│   ├── token-helper.js
│   └── schema-validator.js
│
├── config/                           # per-env settings if needed
├── playwright.config.js
├── .env
├── .gitignore
└── package.json

