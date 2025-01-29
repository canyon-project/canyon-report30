const libCoverage = require('istanbul-lib-coverage');
const getCommonPathPrefix = (paths) => {
  if (paths.length === 0) return '';
  const splitPaths = paths.map(path => path.split('/'));
  const minLength = Math.min(...splitPaths.map(p => p.length));

  let commonPrefix = [];
  for (let i = 0; i < minLength; i++) {
    const segment = splitPaths[0][i];
    if (splitPaths.every(path => path[i] === segment)) {
      commonPrefix.push(segment);
    } else {
      break;
    }
  }
  return commonPrefix.join('/');
};
const generateHtml = ({coverage,reportName,_instrumentCwd,date}) => {
  const commonPath = getCommonPathPrefix(Object.keys(JSON.parse(coverage)));
  const instrumentCwd = _instrumentCwd || commonPath;
  var map = libCoverage.createCoverageMap(JSON.parse(coverage));
  const obj = {}
  map.files().forEach(function(f) {
    var fc = map.fileCoverageFor(f),
      s = fc.toSummary();
    obj[f] = s.toJSON();
  });

  const su = Object.keys(obj).reduce((acc, cur) => {
    acc.push({
      ...obj[cur],
      path: cur.replaceAll(instrumentCwd+'/', ""),
    })
    return acc;
  }, [])


  return `

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>Webpack App</title>

    <script src="https://unpkg.com/dayjs@1.11.13/dayjs.min.js"></script>
    <script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/antd@5.23.2/dist/antd.min.js"></script>
    <script src="https://unpkg.com/axios@1.7.9/dist/axios.min.js"></script>
    <script src="https://unpkg.com/ahooks@3.8.4/dist/ahooks.js"></script>
    <script src="https://unpkg.com/@ant-design/icons@5.6.0/dist/index.umd.js"></script>

</head>
<body>
<div id="root">

</div>
<script>
  window.monaco = window.monaco || {}
  window.reportName="${reportName}"
    window.data = ${JSON.stringify(su)};
    window.date = "${date}";
</script>
<script defer="defer" src="bundle.js"></script>
</body>
</html>


`
}

module.exports = {
  generateHtml
}
