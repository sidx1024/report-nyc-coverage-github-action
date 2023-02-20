const core = require('@actions/core');
const exec = require('@actions/exec');

const BASE_REF = github.context.payload.pull_request.base.ref;
const HEAD_REF = github.context.payload.pull_request.head.ref

async function run() {
  try {
    // Check if there are any merge conflicts
    const hasMergeConflicts = await checkMergeConflicts();
    if (hasMergeConflicts) {
      core.setFailed('Merge conflicts found. Please resolve conflicts before updating the branch.');
      return;
    }
    // Merge base branch into head branch
    await exec.exec('git', ['merge', BASE_REF]);
    await exec.exec('git', ['push']);
    console.log('Branch updated successfully.');
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function checkMergeConflicts() {
  try {
    await exec.exec('git', ['merge-base', '--is-ancestor', BASE_REF, HEAD_REF]);
    return false;
  } catch (error) {
    return true;
  }
}

run();