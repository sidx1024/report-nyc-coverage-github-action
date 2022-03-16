const core = require('@actions/core');
const github = require('@actions/github');

const { replaceTokens } = require('./utils');

try {
  const whoToGreet = core.getInput('who-to-greet');
  const time = new Date().toTimeString();

  // `who-to-greet` input defined in action metadata file
  const tokenMap = {
    'who-to-greet': whoToGreet,
    time: time,
  };
  console.log(replaceTokens(`Hello {{who-to-greet}}, the time is {{time}}`, tokenMap));
  core.setOutput('time', time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
