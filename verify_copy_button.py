from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    try:
        print("Navigating to homepage...")
        page.goto("http://localhost:3000")

        # Wait for the page to load
        page.wait_for_load_state("networkidle")

        print("Searching for copy button...")
        # Find the copy button
        # The button has sr-only text "Copy"
        # We target the one in the playground toolbar if possible, or just the first one found
        copy_button = page.locator("button:has(span.sr-only:text-is('Copy'))").first

        if not copy_button.is_visible():
            print("Copy button not visible, taking screenshot...")
            page.screenshot(path="verification_failed.png")
            raise Exception("Copy button not found")

        # Take a screenshot before clicking
        page.screenshot(path="verification_before.png")
        print("Screenshot verification_before.png taken.")

        # Click the button
        print("Clicking copy button...")
        copy_button.click()

        # Wait for the state change
        # The sr-only text should change to "Copied"
        print("Waiting for text change...")
        page.locator("button:has(span.sr-only:text-is('Copied'))").first.wait_for()
        print("Text changed to 'Copied'.")

        # Hover to show tooltip
        print("Hovering to show tooltip...")
        copy_button.hover()
        # Wait a bit for tooltip animation
        page.wait_for_timeout(500)

        # Take a screenshot after clicking
        page.screenshot(path="verification_after.png")
        print("Screenshot verification_after.png taken.")

        print("Verification successful!")
    except Exception as e:
        print(f"Verification failed: {e}")
        page.screenshot(path="verification_error.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
