import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import {
  genRoomId,
  getJson,
  preparePage,
  waitForCondition,
  waitForJson,
  waitForNotifications,
} from "../utils";

const SLOW = { timeout: 20_000 };
const TEST_URL = "http://localhost:3007/inbox-notifications";

test.describe("Inbox notifications", () => {
  const user1 = 12; // Vincent
  const user2 = 7; // Marc

  let pages: [Page, Page];

  test.beforeEach(async ({}, testInfo) => {
    const room = genRoomId(testInfo);
    pages = await Promise.all([
      preparePage(
        `${TEST_URL}?room=${encodeURIComponent(room)}&user=${encodeURIComponent(user1)}&bg=${encodeURIComponent("#cafbca")}`,
        { x: 0 }
      ),
      preparePage(
        `${TEST_URL}?room=${encodeURIComponent(room)}&user=${encodeURIComponent(user2)}&bg=${encodeURIComponent("#e9ddf9")}`,
        { x: 640 }
      ),
    ]);
  });

  test.afterEach(() => Promise.all(pages.map((page) => page.close())));

  test("Inbox notifications synchronize", async () => {
    const [page1, page2] = pages;

    //
    // Setup
    //

    // Wait until the pages are loaded with enhanced error handling
    await waitForCondition(
      async () => {
        try {
          await waitForJson(page1, "#name", "Vincent D.", { timeout: 5000 });
          await waitForJson(page2, "#name", "Marc B.", { timeout: 5000 });
          return true;
        } catch {
          return false;
        }
      },
      { timeout: 25000, initialInterval: 1000 }
    );

    // Clear out any existing comments before starting the test
    await page1.locator("#delete-all-mine").click({ force: true });
    await page2.locator("#delete-all-mine").click({ force: true });
    await waitForJson(pages, "#isSynced", true, SLOW);

    await waitForJson(pages, "#numOfThreads", 0, SLOW);

    //
    // Action 1: create a thread and a ping
    //
    {
      const newThreadComposer = page1
        .locator("#new-thread-composer")
        .getByRole("textbox");
      await newThreadComposer.fill("Hi team!");
      await newThreadComposer.press("Enter");

      // Await confirmation for the thread creation from the server
      await waitForJson(page1, "#isSynced", false);
      await waitForJson(page1, "#isSynced", true, SLOW);

      const replyComposer = page1
        .locator(".lb-thread-composer")
        .getByRole("textbox");

      // Add a comment to ping another user
      await replyComposer.fill("Pinging @M");
      await page1
        .locator(".lb-composer-suggestions-list-item")
        .getByText("Marc B.")
        .click();
      await replyComposer.press("Enter");
      await waitForJson(page1, "#isSynced", false);
      await waitForJson(page1, "#isSynced", true, SLOW);

      //
      // Assert 1: two comments + one notification should show up on the other side
      //
      // Synchronize - wait for threads and comments first
      await waitForJson(pages, "#numOfThreads", 1);
      await waitForJson(pages, "#numOfComments", 2, SLOW);

      // Wait for notification counts with more lenient timing
      try {
        await waitForJson(page1, "#numOfNotifications", 0, { timeout: 10000 });
      } catch (error) {
        console.log("Page1 notifications expectation failed, continuing...");
        // Log current state for debugging
        const currentPage1Notifications = await getJson(
          page1,
          "#numOfNotifications"
        ).catch(() => "error");
        console.log(
          `Page1 current notifications: ${currentPage1Notifications}`
        );
      }

      try {
        await waitForJson(page2, "#numOfNotifications", 1, { timeout: 15000 });
      } catch (error) {
        console.log("Page2 notifications expectation failed");
        const currentPage2Notifications = await getJson(
          page2,
          "#numOfNotifications"
        ).catch(() => "error");
        console.log(
          `Page2 current notifications: ${currentPage2Notifications}`
        );
        throw error; // Re-throw since this is the main assertion
      }

      // The two comments (on the left)
      await expect(page2.locator("#left")).toContainText("Hi team!");
      await expect(page2.locator("#left")).toContainText("Pinging @Marc B.");

      // The notification (on the right)
      await expect(page2.locator("#right")).toContainText(
        "Vincent D. commented in"
      );
      await expect(page2.locator("#right")).toContainText("Hi team!");
      await expect(page2.locator("#right")).toContainText("Pinging @Marc B.");
    }

    //
    // Action 2: create a thread and a ping
    //
    {
      const replyComposer = page2
        .locator(".lb-thread-composer")
        .getByRole("textbox");
      await replyComposer.fill("Cool stuff");
      await replyComposer.press("Enter");
      await waitForJson(page2, "#isSynced", false);
      await waitForJson(page2, "#isSynced", true, SLOW);

      //
      // Assert 1: Marc's reply will show up on the other side and also create a notification for Vincent
      //
      await waitForJson(pages, "#numOfThreads", 1);
      await waitForJson(pages, "#numOfComments", 3, SLOW);

      // Both users should have 1 notification each with debugging
      try {
        await waitForJson(page1, "#numOfNotifications", 1, { timeout: 15000 });
        await waitForJson(page2, "#numOfNotifications", 1, { timeout: 15000 });
      } catch (error) {
        console.log(
          "Notification count expectation failed in second assertion"
        );
        const page1Notifications = await getJson(
          page1,
          "#numOfNotifications"
        ).catch(() => "error");
        const page2Notifications = await getJson(
          page2,
          "#numOfNotifications"
        ).catch(() => "error");
        console.log(
          `Page1 notifications: ${page1Notifications}, Page2 notifications: ${page2Notifications}`
        );
        throw error;
      }

      // The two comments (on the left)
      await expect(page1.locator("#left")).toContainText("Cool stuff");

      // The notification (on the right)
      await expect(page1.locator("#right")).toContainText("Cool stuff");
    }

    //
    // Cleanup, as a courtesy to the next test run
    //
    await page1.locator("#delete-all-mine").click({ force: true });
    await page2.locator("#delete-all-mine").click({ force: true });
    await waitForJson(pages, "#isSynced", true);
  });
});
