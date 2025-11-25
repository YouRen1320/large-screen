// Update Time and Date
function updateTime() {
  const now = new Date();

  // Date: YYYY年MM月DD日
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  document.getElementById("date").textContent = `${year}年${month}月${day}日`;

  // Week
  const weeks = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  document.getElementById("week").textContent = weeks[now.getDay()];

  // Time: HH:mm:ss
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  document.getElementById(
    "hours"
  ).textContent = `${hours}:${minutes}:${seconds}`;
}

// Initial call and interval
updateTime();
setInterval(updateTime, 1000);

// Mock Weather Data (In a real app, this would fetch from an API)
function initWeather() {
  // These values are already hardcoded in HTML for now,
  // but this function shows where dynamic update logic would go.
  // Example:
  // document.getElementById('header-weather').textContent = '晴';
  // document.getElementById('header-temperature').textContent = '26℃';
}

initWeather();
