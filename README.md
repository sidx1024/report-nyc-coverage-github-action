<!-- start title -->

# GitHub Action: Report NYC coverage

<!-- end title -->
<!-- start description -->

GitHub Action that posts the report in a comment on a GitHub Pull Request from coverage data generated by nyc (istanbul).

<!-- end description -->
<!-- start contents -->
<!-- end contents -->

[See sample comment](https://github.com/sidx1024/report-nyc-coverage-github-action/pull/10#issuecomment-1074885726)
<img src="docs/sample-report.png" alt="Sample comment image">

## Setup
Please refer to the folder [.github/workflows](https://github.com/sidx1024/report-nyc-coverage-github-action/tree/main/.github/workflows) to see how this action is used in this repo itself. Use it as a reference for setting it up for your repo.

## Typical Usage

```yaml
on: [pull_request]

jobs:
  my_app_job:
    runs-on: ubuntu-latest
    name: My App
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          ref: ${{ github.event.pull_request.head.sha }}
          fetch-depth: 1000 # Set this according to the size of your git history

      - name: Fetch base
        run: git fetch origin ${{ github.event.pull_request.base.ref }} --depth=1000

      - name: Run tests
        run: npm run test

      - name: Generate NYC report
        run: |
          npx nyc report \
            --reporter json-summary \
            --report-dir nyc-coverage-report \
            --exclude-after-remap false

      - name: Report NYC coverage
        uses: sidx1024/report-nyc-coverage-github-action@v1.2.7
        with:
          # Path to coverage file generated by "nyc report".
          coverage_file: "nyc-coverage-report/coverage-summary.json"
```

## Usage

<!-- start usage -->

```yaml
- uses: sidx1024/report-nyc-coverage-github-action@v1.2.7
  with:
    # Path to coverage file generated by "nyc report".
    # Default: coverage-summary.json
    coverage_file: ""

    # Path to coverage file generated by "nyc report" for the base branch (for
    # comparison)
    # Default: .base_nyc_output/coverage-summary.json
    base_coverage_file: ""

    # Template file to be used for GitHub PR comment. Markdown and Svelte are
    # supported.
    # Default: comment-template.md
    comment_template_file: ""

    # "replace" or "new"
    # Default: replace
    comment_mode: ""

    # The unique marker used to leave the PR comment. Update to run multiple NYC reports in a single PR
    # Default: report-nyc-coverage-github-action-comment-mark
    comment_marker: ""

    # An alternative GitHub token, other than the default provided by GitHub Actions
    # runner. Optional.
    # Default: ${{ github.token }}
    github_token: ""

    # Absolute path to the source files. The path will be trimmed from the coverage
    # data. Optional. Default is the github workspace directory with a trailing slash.
    # Default: ${{ format('{0}/', github.workspace) }}
    sources_base_path: ""

    # Specify the order for coverage types to be included in the output table. (S:
    # statements, B: branches, F: functions, L: lines). Missing types will be
    # excluded.
    # Default: SBFL
    files_coverage_table_output_type_order: ""
```

<!-- end usage -->
<!-- start inputs -->

| **Input**                                    | **Description**                                                                                                                                                | **Default**                               | **Required** |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------ |
| **`coverage_file`**                          | Path to coverage file generated by "nyc report".                                                                                                               | `coverage-summary.json`                   | **true**     |
| **`base_coverage_file`**                     | Path to coverage file generated by "nyc report" for the base branch (for comparison)                                                                           | `.base_nyc_output/coverage-summary.json`  | **true**     |
| **`comment_template_file`**                  | Template file to be used for GitHub PR comment. Markdown and Svelte are supported.                                                                             | `comment-template.md`                     | **false**    |
| **`comment_mode`**                           | "replace" or "new"                                                                                                                                             | `replace`                                 | **false**    |
| **`comment_marker`**                           | The unique marker used to leave the PR comment. Update to run multiple NYC reports in a single PR                                                                                                                                      | `report-nyc-coverage-github-action-comment-mark`                                 | **false**    |
| **`github_token`**                           | An alternative GitHub token, other than the default provided by GitHub Actions runner. Optional.                                                               | `${{ github.token }}`                     | **false**    |
| **`sources_base_path`**                      | Absolute path to the source files. The path will be trimmed from the coverage data. Optional. Default is the github workspace directory with a trailing slash. | `${{ format('{0}/', github.workspace) }}` | **false**    |
| **`files_coverage_table_output_type_order`** | Specify the order for coverage types to be included in the output table. (S: statements, B: branches, F: functions, L: lines). Missing types will be excluded. | `SBFL`                                    | **false**    |

<!-- end inputs -->
<!-- start outputs -->

| \***\*Output\*\***                           | \***\*Description\*\***                                                                                    | \***\*Default\*\*** | \***\*Required\*\*** |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------- | -------------------- |
| `total_lines_coverage_percent`               | Total lines coverage percent (XX.XX%) with level indicator                                                 | undefined           | undefined            |
| `total_branches_coverage_percent`            | Total branches coverage percent (XX.XX%) with level indicator                                              | undefined           | undefined            |
| `total_statements_coverage_percent`          | Total statements coverage percent (XX.XX%) with level indicator                                            | undefined           | undefined            |
| `total_functions_coverage_percent`           | Total functions coverage percent (XX.XX%) with level indicator                                             | undefined           | undefined            |
| `total_lines_coverage_percent_raw`           | Total lines coverage percent (XX.XX) without percent and level indicator                                   | undefined           | undefined            |
| `total_branches_coverage_percent_raw`        | Total branches coverage percent (XX.XX) without percent and level indicator                                | undefined           | undefined            |
| `total_statements_coverage_percent_raw`      | Total statements coverage percent (XX.XX) without percent and level indicator                              | undefined           | undefined            |
| `total_functions_coverage_percent_raw`       | Total functions coverage percent (XX.XX) without percent and level indicator                               | undefined           | undefined            |
| `base_total_lines_coverage_percent`          | Base total lines coverage percent (XX.XX%) with level indicator                                            | undefined           | undefined            |
| `base_total_branches_coverage_percent`       | Base total branches coverage percent (XX.XX%) with level indicator                                         | undefined           | undefined            |
| `base_total_statements_coverage_percent`     | Base total statements coverage percent (XX.XX%) with level indicator                                       | undefined           | undefined            |
| `base_total_functions_coverage_percent`      | Base total functions coverage percent (XX.XX%) with level indicator                                        | undefined           | undefined            |
| `total_lines_coverage_percent_diff`          | Total lines coverage percent diff (+XX.XX%)                                                                | undefined           | undefined            |
| `total_statements_coverage_percent_diff`     | Total branches coverage percent diff (+XX.XX%)                                                             | undefined           | undefined            |
| `total_functions_coverage_percent_diff`      | Total statements coverage percent diff (+XX.XX%)                                                           | undefined           | undefined            |
| `total_branches_coverage_percent_diff`       | Total functions coverage percent diff (+XX.XX%)                                                            | undefined           | undefined            |
| `total_lines_coverage_percent_diff_raw`      | Total lines coverage percent diff (-XX.XX) without percent sign                                            | undefined           | undefined            |
| `total_statements_coverage_percent_diff_raw` | Total branches coverage percent diff (-XX.XX) without percent sign                                         | undefined           | undefined            |
| `total_functions_coverage_percent_diff_raw`  | Total statements coverage percent diff (-XX.XX) without percent sign                                       | undefined           | undefined            |
| `total_branches_coverage_percent_diff_raw`   | Total functions coverage percent diff (-XX.XX) without percent sign                                        | undefined           | undefined            |
| `files_coverage_table`                       | HTML table content containing the file path and corresponding coverage percent for all files               | undefined           | undefined            |
| `changed_files_coverage_table`               | HTML table content containing the file path and corresponding coverage percent for files changed in the PR | undefined           | undefined            |
| `comment_body`                               | The comment body in HTML format                                                                            | undefined           | undefined            |
| `commit_sha`                                 | Last commit SHA (commit due to which this action was executed)                                             | undefined           | undefined            |
| `short_commit_sha`                           | Last commit SHA in shorter format (6ef01b)                                                                 | undefined           | undefined            |
| `commit_link`                                | Relative link for the last commit                                                                          | undefined           | undefined            |
| `base_commit_sha`                            | Base commit SHA                                                                                            | undefined           | undefined            |
| `base_short_commit_sha`                      | Base commit SHA in shorter format (bca317)                                                                 | undefined           | undefined            |
| `base_commit_link`                           | Relative link for the base commit                                                                          | undefined           | undefined            |
| `base_ref`                                   | Base branch name                                                                                           | undefined           | undefined            |

<!-- end outputs -->
<!-- start [.github/ghdocs/examples/] -->
<!-- end [.github/ghdocs/examples/] -->
