const core = require('@actions/core');
const github = require('@actions/github');

const { replaceTokens } = require("./utils");

try {
  // `who-to-greet` input defined in action metadata file
  const tokenMap = {
    'who-to-greet': core.getInput('who-to-greet'),
    'time': (new Date()).toTimeString(),
  }
  console.log(replaceTokens(`Hello {{who-to-greet}}, the time is {{time}}`, tokenMap));

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
