//还是网上抄的
function formatDate(inputTime, mDMode) {
  let TRANSLATIONS = getApp().globalData.translations;
  let date = new Date(inputTime * 1000);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? m : m;
  let d = date.getDate();
  d = d < 10 ? d : d;
  if (mDMode)
    return (
      m +
      ' ' +
      TRANSLATIONS.toolsFormatTextMonth +
      ' ' +
      d +
      ' ' +
      TRANSLATIONS.toolsFormatTextDay
    );
  return (
    y +
    ' ' +
    TRANSLATIONS.toolsFormatTextYear +
    ' ' +
    m +
    ' ' +
    TRANSLATIONS.toolsFormatTextMonth +
    ' ' +
    d +
    ' ' +
    TRANSLATIONS.toolsFormatTextDay
  );
}

function getUnixTimestamp() {
  let ts = new Date();
  return Date.parse(ts) / 1000;
}

module.exports.formatDate = formatDate;
module.exports.getUnixTimestamp = getUnixTimestamp;
