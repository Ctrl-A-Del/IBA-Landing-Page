/**
 * Tests for the ONE test seam agreed for ticket 02: the `useReveal` hook.
 *
 * Why this seam and nothing else: `useReveal` is the only piece of the theme foundation with real
 * branching logic (browser capability detection, observer lifecycle, cleanup). Everything else in
 * ticket 02 is a Tailwind token or a presentational primitive, which the ticket verifies through
 * build output and the compiled CSS (and, until ticket 12 deleted it, a dev-only showcase) — asserting Tailwind class strings would test the
 * implementation, not behaviour, so it is deliberately not done here.
 *
 * The hook is exercised through its public interface only: a probe component consumes it, spreads
 * the returned `ref` onto an element and writes the returned `isRevealed` boolean to the DOM. The
 * tests never reach into the hook's internals.
 *
 * `src/setupTests.js` (jest-dom) is loaded by CRA's test setup before these run.
 */
import React from "react";
import { render, act } from "@testing-library/react";
import { useReveal } from "./useReveal";

/** Consumes the hook the way a real section would, and exposes the state to the DOM. */
const Probe = () => {
  const { ref, isRevealed } = useReveal();
  return <div ref={ref} data-testid="probe" data-revealed={String(isRevealed)} />;
};

/**
 * jsdom implements neither `matchMedia` nor `IntersectionObserver`, so both are stubbed here (the
 * brief requires this). They are browser APIs — a real system boundary — which is why stubbing them
 * is legitimate rather than mocking our own code.
 */
const stubReducedMotion = (matches) => {
  window.matchMedia = vi.fn(() => ({
    matches,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
};

/**
 * A functional `IntersectionObserver` stand-in. It records every instance so a test can trigger
 * intersection the way the browser would, and it records the observed targets so we can tell that
 * the hook actually registered the element it handed out through `ref`.
 */
const stubIntersectionObserver = () => {
  const instances = [];
  const Stub = vi.fn(function IntersectionObserverStub(callback, options) {
    this.callback = callback;
    this.options = options;
    this.observed = [];
    instances.push(this);
    this.observe = (element) => this.observed.push(element);
    this.unobserve = () => {};
    this.disconnect = () => {};
    this.takeRecords = () => [];
  });
  window.IntersectionObserver = Stub;
  return instances;
};

test("without a motion preference, content starts hidden and is revealed once it scrolls into view", () => {
  // Catches: the hook never wiring up an observer, failing to hand the element to it, or failing to
  //          react to the intersection entry — i.e. content that would stay invisible forever.
  // Does NOT catch: the visual quality of the transition, the animation duration, or which DOM node
  //          in a real section receives the ref.
  stubReducedMotion(false);
  const instances = stubIntersectionObserver();

  const { getByTestId } = render(<Probe />);
  expect(getByTestId("probe").getAttribute("data-revealed")).toBe("false");

  const [observer] = instances;
  expect(observer).toBeDefined();
  expect(observer.observed).toContain(getByTestId("probe"));

  act(() => {
    observer.callback([{ target: getByTestId("probe"), isIntersecting: true }]);
  });

  expect(getByTestId("probe").getAttribute("data-revealed")).toBe("true");
});

test("in a browser without IntersectionObserver the content is shown rather than hidden forever", () => {
  // Catches: a hook that hides content and then has no way to reveal it, i.e. a blank page in an
  //          environment that lacks the API. Failing open is the only safe direction here.
  // Does NOT catch: real-browser support matrices — no browser we target lacks the API.
  stubReducedMotion(false);
  delete window.IntersectionObserver;

  const { getByTestId } = render(<Probe />);

  expect(getByTestId("probe").getAttribute("data-revealed")).toBe("true");
});

test("with reduced motion, content is visible immediately and nothing is animated or observed", () => {
  // Catches: (a) the hook hiding content from a visitor who asked for reduced motion, and
  //          (b) the hook starting an IntersectionObserver anyway, i.e. not being inert.
  // Does NOT catch: whether the CSS transition classes themselves are reduced-motion-safe — that is
  // a stylesheet concern, verified against the compiled CSS, not here.
  stubReducedMotion(true);
  const IntersectionObserverStub = vi.fn();
  window.IntersectionObserver = IntersectionObserverStub;

  const { getByTestId } = render(<Probe />);

  expect(getByTestId("probe").getAttribute("data-revealed")).toBe("true");
  expect(IntersectionObserverStub).not.toHaveBeenCalled();
});
