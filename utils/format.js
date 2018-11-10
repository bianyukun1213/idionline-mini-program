//还是网上抄的
function formatDate(inputTime) {
  var date = new Date(inputTime * 1000)
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? (m) : m
  var d = date.getDate()
  d = d < 10 ? (d) : d
  return y + '年' + m + '月' + d + '日'
}
module.exports.formatDate = formatDate