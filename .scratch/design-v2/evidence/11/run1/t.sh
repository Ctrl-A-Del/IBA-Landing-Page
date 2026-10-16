#!/bin/sh
# Run the integration test (arg "all" = full suite) with the .claude/ worktree testMatch workaround.
cd /c/Users/SebastianAuner/Dev/IBA-Landing-Page/.claude/worktrees/agent-a57849b260aecc835 || exit 1
W=$(pwd -W)
if [ "$1" = "all" ]; then P="$W/src/**/*.test.{js,jsx}"; else P="$W/src/prototype/Page.integration.test.jsx"; fi
CI=true npx react-scripts test --watchAll=false --testMatch "$P" 2>&1 | grep -vE "punycode|trace-deprecation"
