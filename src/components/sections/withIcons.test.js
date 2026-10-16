/**
 * SEAM: `withIcons`, the one place a section pairs its decorative icons with its copy items.
 * A count mismatch must fail loudly rather than render a wrong or missing icon.
 */
import { withIcons } from "./withIcons";

const A = () => null;
const B = () => null;

test("pairs each item with the icon at the same position", () => {
  expect(withIcons([{ name: "x" }, { name: "y" }], [A, B], "Demo")).toEqual([
    { name: "x", Icon: A },
    { name: "y", Icon: B },
  ]);
});

test("throws, naming the section, when there are more items than icons", () => {
  expect(() => withIcons([{}, {}, {}], [A, B], "Demo")).toThrow(/Demo.*3.*2/);
});

test("throws when there are fewer items than icons", () => {
  expect(() => withIcons([{}], [A, B], "Demo")).toThrow(/Demo/);
});
