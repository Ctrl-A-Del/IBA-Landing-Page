// ONE-OFF (ticket 12): writes the golden copy fixture from the approved prototype, before anything
// is moved or deleted. Deleted again in the same ticket once the fixture is committed.
import fs from "fs";
import path from "path";
import React from "react";
import Prototype from "./Prototype";
import { captureCopy } from "../__fixtures__/captureCopy";

beforeAll(() => {
  const original = window.getComputedStyle;
  window.getComputedStyle = (elt) => original(elt);
});

test("capture the approved prototype copy", async () => {
  const copy = await captureCopy(<Prototype />);
  fs.writeFileSync(
    path.resolve(__dirname, "../__fixtures__/prototype-copy.json"),
    `${JSON.stringify(copy, null, 2)}\n`,
    "utf8"
  );
});
