module.exports = {
  ActionInput: {
    coverage_output_directory: 'coverage_output_directory',
    sources_base_path: 'sources_base_path',
    comment_template_file: 'comment_template_file',
    comment_mode: 'comment_mode',
    files_coverage_table_output_type_order: 'files_coverage_table_output_type_order',
    git_fetch_strategy: 'git_fetch_strategy',
    git_fetch_shallow_since: 'git_fetch_shallow_since'
  },
  ActionOutput: {
    total_lines_coverage_percent: 'total_lines_coverage_percent',
    total_statements_coverage_percent: 'total_statements_coverage_percent',
    total_functions_coverage_percent: 'total_functions_coverage_percent',
    total_branches_coverage_percent: 'total_branches_coverage_percent',
    total_lines_coverage_percent_raw: 'total_lines_coverage_percent_raw',
    total_statements_coverage_percent_raw: 'total_statements_coverage_percent_raw',
    total_functions_coverage_percent_raw: 'total_functions_coverage_percent_raw',
    total_branches_coverage_percent_raw: 'total_branches_coverage_percent_raw',
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
  GitFetchStrategy: {
    PRE_CHECKOUT: 'pre_checkout',
    SHALLOW_SINCE: 'shallow_since',
  },
  DEFAULT_COVERAGE_SUMMARY_JSON_FILENAME: 'coverage-summary.json',
  DEFAULT_COMMENT_MARKER: 'report-nyc-coverage-github-action-comment-mark',
};
