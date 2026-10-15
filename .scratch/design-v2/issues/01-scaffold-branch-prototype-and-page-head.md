# 01: Scaffold — branch, prototype tree, and page head

**What to build:** An isolated prototype path so the entire redesign can be built beside the existing site and reverted by editing a single line, plus a page head that previews properly when the link is shared. The dev server renders the prototype tree, and no existing section component is modified.

**Blocked by:** None (can start immediately)

**Status:** claimed

- [ ] Branch `design/v2` exists, created off `master` at `e5ffdd6`
- [ ] `npm ci` completes, and `npm start` serves the app — npm only, with `package-lock.json` left in sync
- [ ] A prototype component tree exists that the app entry points at through a single line, and nothing under the existing component tree is modified
- [ ] Reverting to the current design requires editing that one line and nothing else
- [ ] The four favicon references pointing at files that do not exist are removed or replaced, so the console no longer reports 404s for them
- [ ] The meta description is no longer empty
- [ ] Open Graph and Twitter card tags are present, describing trench milling for energy and utility network expansion, consistent with the theme colour `#0a1f2e`
- [ ] The document language and title remain correct for a German site
- [ ] The legal pages, `robots.txt` and the `CNAME` file are untouched
