module.exports = {
  ActionInput: {
    coverage_output_directory: 'coverage_output_directory',
    sources_base_path: 'sources_base_path'
  },
  Token: {
    total_lines_coverage_percent: 'total_lines_coverage_percent',
    total_statements_coverage_percent: 'total_statements_coverage_percent',
    total_functions_coverage_percent: 'total_functions_coverage_percent',
    total_branches_coverage_percent: 'total_branches_coverage_percent',
    files_coverage_table: 'files_coverage_table',
    changed_files_coverage_table: 'changed_files_coverage_table',
    comment_body: 'comment_body',
  },
  InternalToken: {
    files_coverage_data: 'files_coverage_data',
    changed_files_coverage_data: 'changed_files_coverage_data',
  },
  DEFAULT_COVERAGE_SUMMARY_JSON_FILENAME: 'coverage-summary.json',
  DEFAULT_COMMENT_TEMPLATE_MD_FILENAME: 'comment-template.md',
};
