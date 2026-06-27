/** @vitest-environment jsdom */
import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { ItemViewer } from "./ItemViewer";

const MODEL_VIEWER_SRC =
  "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";

describe("ItemViewer", () => {
  afterEach(() => {
    document.querySelector(`script[src="${MODEL_VIEWER_SRC}"]`)?.remove();
  });

  it("renders model-viewer element with given props", () => {
    const { container } = render(
      <ItemViewer modelUrl="/models/souvenir.glb" name="ของที่ระลึก" />,
    );
    const mv = container.querySelector("model-viewer");
    expect(mv).toBeTruthy();
    expect(mv?.getAttribute("src")).toBe("/models/souvenir.glb");
    expect(mv?.getAttribute("alt")).toBe("ของที่ระลึก");
  });

  it("lazy-loads model-viewer script on mount", () => {
    expect(
      document.querySelector(`script[src="${MODEL_VIEWER_SRC}"]`),
    ).toBeNull();
    render(<ItemViewer modelUrl="/models/souvenir.glb" name="ของที่ระลึก" />);
    const script = document.querySelector(`script[src="${MODEL_VIEWER_SRC}"]`);
    expect(script).toBeTruthy();
    expect(script?.getAttribute("type")).toBe("module");
  });

  it("does not add duplicate scripts if already loaded", () => {
    render(<ItemViewer modelUrl="/models/souvenir.glb" name="test1" />);
    render(<ItemViewer modelUrl="/models/souvenir.glb" name="test2" />);
    const scripts = document.querySelectorAll(
      `script[src="${MODEL_VIEWER_SRC}"]`,
    );
    expect(scripts.length).toBe(1);
  });
});

describe("layout.tsx global scripts", () => {
  it("does not contain a global model-viewer script tag", () => {
    const layoutPath = join(
      process.cwd(),
      "src",
      "app",
      "layout.tsx",
    );
    const content = readFileSync(layoutPath, "utf-8");
    expect(content).not.toContain("model-viewer.min.js");
  });
});
