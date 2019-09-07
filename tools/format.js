//还是网上抄的
function formatDate(inputTime, mDMode) {
  var date = new Date(inputTime * 1000)
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? (m) : m
  var d = date.getDate()
  d = d < 10 ? (d) : d
  if (mDMode)
    return m + '月' + d + '日'
  return y + '年' + m + '月' + d + '日'
}

function getUnixTimestamp() {
  var ts = new Date()
  return Date.parse(ts) / 1000
}
module.exports.formatDate = formatDate
module.exports.getUnixTimestamp = getUnixTimestamp