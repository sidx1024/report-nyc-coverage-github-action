<script>
  export let json;
</script>

<h2>Coverage Report</h2>
{json.total_lines_coverage_percent}

<pre>
  {JSON.stringify(json, null, 2)}
</pre>
