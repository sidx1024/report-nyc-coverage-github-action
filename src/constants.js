module.exports = {
  ActionInput: {
    coverage_output_directory: 'coverage_output_directory',
    sources_base_path: 'sources_base_path',
    comment_template_file: 'comment_template_file',
    comment_mode: 'comment_mode',
  },
  ActionOutput: {
    total_lines_coverage_percent: 'total_lines_coverage_percent',
    total_statements_coverage_percent: 'total_statements_coverage_percent',
    total_functions_coverage_percent: 'total_functions_coverage_percent',
    total_branches_coverage_percent: 'total_branches_coverage_percent',
    files_coverage_table: 'files_coverage_table',
    changed_files_coverage_table: 'changed_files_coverage_table',
    comment_body: 'comment_body',
    commit_sha: 'commit_sha',
    short_commit_sha: 'short_commit_sha',
    commit_link: 'commit_link',
  },
  InternalToken: {
    files_coverage_data: 'files_coverage_data',
    changed_files_coverage_data: 'changed_files_coverage_data',
  },
  DEFAULT_COVERAGE_SUMMARY_JSON_FILENAME: 'coverage-summary.json',
  DEFAULT_COMMENT_MARKER: 'report-nyc-coverage-github-action-comment-mark',
};
