import { afterAll, beforeAll, afterEach } from "vitest";
import { isIntegrationTest } from "./__integration__";
import { BASE_CONFIGURATION } from "../src/constants/base-configuration";
import { setupCommonMocks } from "./setup-common-mocks";

process.env["MODE"] = "dev";
//process.env["MONGOMS_DISTRO"] = "ubuntu-22.04";

if (isIntegrationTest) {
  console.error("wrong environment");
  process.exit();
}

if (!process.env["REDIS_URI"]) {
  // use mock if not set
  process.env["REDIS_URI"] = "redis://mock";
}

beforeAll(async () => {
  //don't add any configuration here, add to global-setup.ts instead.

  vi.mock("../src/dal/logs", () => ({
    addLog: vi.fn(),
    addImportantLog: vi.fn(),
    deleteUserLogs: vi.fn(),
  }));
  vi.mock("../src/init/configuration", () => ({
    getLiveConfiguration: () => BASE_CONFIGURATION,
    getCachedConfiguration: () => BASE_CONFIGURATION,
    patchConfiguration: vi.fn(),
  }));

  vi.mock("../src/init/db", () => ({
    __esModule: true,
    getDb: () => undefined,
    collection: () => undefined,
    close: () => {
      //
    },
  }));

  setupCommonMocks();
});

afterEach(async () => {
  //noting
});

afterAll(async () => {
  vi.resetAllMocks();
});
