module.exports = {
  ActionInput: {
    coverage_file: 'coverage_file',
    base_coverage_file: 'base_coverage_file',
    sources_base_path: 'sources_base_path',
    comment_template_file: 'comment_template_file',
    comment_mode: 'comment_mode',
    files_coverage_table_output_type_order: 'files_coverage_table_output_type_order',
  },
  ActionOutput: {
    // Total Percent
    total_lines_coverage_percent: 'total_lines_coverage_percent',
    total_statements_coverage_percent: 'total_statements_coverage_percent',
    total_functions_coverage_percent: 'total_functions_coverage_percent',
    total_branches_coverage_percent: 'total_branches_coverage_percent',
    // Base Total Percent
    base_total_lines_coverage_percent: 'base_total_lines_coverage_percent',
    base_total_statements_coverage_percent: 'base_total_statements_coverage_percent',
    base_total_functions_coverage_percent: 'base_total_functions_coverage_percent',
    base_total_branches_coverage_percent: 'base_total_branches_coverage_percent',
    // Total Percent Diff
    total_lines_coverage_percent_diff: 'total_lines_coverage_percent_diff',
    total_statements_coverage_percent_diff: 'total_statements_coverage_percent_diff',
    total_functions_coverage_percent_diff: 'total_functions_coverage_percent_diff',
    total_branches_coverage_percent_diff: 'total_branches_coverage_percent_diff',
    // Total Percent Diff Raw
    total_lines_coverage_percent_diff_raw: 'total_lines_coverage_percent_diff_raw',
    total_statements_coverage_percent_diff_raw: 'total_statements_coverage_percent_diff_raw',
    total_functions_coverage_percent_diff_raw: 'total_functions_coverage_percent_diff_raw',
    total_branches_coverage_percent_diff_raw: 'total_branches_coverage_percent_diff_raw',
    // Total Percent Raw
    total_lines_coverage_percent_raw: 'total_lines_coverage_percent_raw',
    total_statements_coverage_percent_raw: 'total_statements_coverage_percent_raw',
    total_functions_coverage_percent_raw: 'total_functions_coverage_percent_raw',
    total_branches_coverage_percent_raw: 'total_branches_coverage_percent_raw',
    // Base Total Percent Raw
    base_total_lines_coverage_percent_raw: 'base_total_lines_coverage_percent_raw',
    base_total_statements_coverage_percent_raw: 'base_total_statements_coverage_percent_raw',
    base_total_functions_coverage_percent_raw: 'base_total_functions_coverage_percent_raw',
    base_total_branches_coverage_percent_raw: 'base_total_branches_coverage_percent_raw',
    files_coverage_table: 'files_coverage_table',
    changed_files_coverage_table: 'changed_files_coverage_table',
    comment_body: 'comment_body',
    commit_sha: 'commit_sha',
    short_commit_sha: 'short_commit_sha',
    commit_link: 'commit_link',
    base_commit_sha: 'base_commit_sha',
    base_short_commit_sha: 'base_short_commit_sha',
    base_commit_link: 'base_commit_link',
    base_ref: 'base_ref',
  },
  InternalToken: {
    files_coverage_data: 'files_coverage_data',
    changed_files_coverage_data: 'changed_files_coverage_data',
  },
  DEFAULT_COMMENT_MARKER: 'report-nyc-coverage-github-action-comment-mark',
};

// 3
