// ==================== 全局配置 ====================
const STORAGE_KEY = "ward_bed_dashboard_data"; // 存储床位数据的key

// ==================== 时间更新 ====================
function updateDateTime() {
  const now = new Date(); // 获取当前时间

  // 更新日期
  const year = now.getFullYear(); // 获取年份
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 获取月份
  const day = String(now.getDate()).padStart(2, "0"); // 获取日期
  document.getElementById(
    "current-date"
  ).textContent = `${year}年${month}月${day}日`;

  // 更新星期
  const weeks = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  document.getElementById("current-week").textContent = weeks[now.getDay()]; // 更新星期

  // 更新时间
  const hours = String(now.getHours()).padStart(2, "0"); // 获取小时
  const minutes = String(now.getMinutes()).padStart(2, "0"); // 获取分钟
  const seconds = String(now.getSeconds()).padStart(2, "0"); // 获取秒
  document.getElementById(
    "current-time"
  ).textContent = `${hours}:${minutes}:${seconds}`; // 更新时间
}

// ==================== Mock 数据生成 ====================

// 生成床位数据（30个床位）
function generateBedData() {
  const beds = [];
  const statuses = ["free", "occupied", "cleaning"]; // 床位状态
  const patientNames = [
    "张三",
    "李四",
    "王五",
    "赵六",
    "孙七",
    "周八",
    "吴九",
    "郑十",
    "陈十一",
    "林十二",
  ];

  for (let i = 1; i <= 30; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]; // 随机选择床位状态
    const bed = {
      id: i,
      number: String(i).padStart(3, "0"),
      status: status,
      patientName:
        status === "occupied"
          ? patientNames[Math.floor(Math.random() * patientNames.length)]
          : "",
      ward: `${Math.ceil(i / 6)}病区`,
    };
    beds.push(bed);
  }
  return beds;
}

// 生成病区排行数据
function generateRankingData() {
  const wards = [
    "内科一区",
    "内科二区",
    "外科一区",
    "外科二区",
    "儿科病区",
    "妇产科",
  ];
  return wards
    .map((ward, index) => {
      const total = 30 + Math.floor(Math.random() * 20);
      const occupied = Math.floor(total * (0.5 + Math.random() * 0.4));
      const rate = ((occupied / total) * 100).toFixed(1);
      return {
        rank: index + 1,
        ward: ward,
        total: total,
        occupied: occupied,
        rate: parseFloat(rate),
      };
    })
    .sort((a, b) => b.rate - a.rate);
}

// 生成趋势数据（近7天）
function generateTrendData() {
  const days = [];
  const dates = [];
  const totalBeds = [];
  const occupiedBeds = [];
  const freeBeds = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(`${date.getMonth() + 1}/${date.getDate()}`);

    const total = 30;
    const occupied = 15 + Math.floor(Math.random() * 10);
    const free = total - occupied;

    totalBeds.push(total);
    occupiedBeds.push(occupied);
    freeBeds.push(free);
  }

  return { dates, totalBeds, occupiedBeds, freeBeds };
}

// 生成患者来源数据
function generateSourceData() {
  return [
    { name: "本市", value: 45 + Math.floor(Math.random() * 20) },
    { name: "本省其他市", value: 20 + Math.floor(Math.random() * 15) },
    { name: "外省", value: 10 + Math.floor(Math.random() * 10) },
  ];
}

// 生成值班人员数据
function generateStaffData() {
  const doctors = [
    { name: "李华", role: "主任医师", dept: "内科", avatar: "李" },
    { name: "王芳", role: "副主任医师", dept: "外科", avatar: "王" },
    { name: "张伟", role: "主治医师", dept: "儿科", avatar: "张" },
  ];

  const nurses = [
    { name: "刘洋", role: "护士长", dept: "内科", avatar: "刘" },
    { name: "陈明", role: "责任护士", dept: "外科", avatar: "陈" },
    { name: "周静", role: "护士", dept: "儿科", avatar: "周" },
  ];

  return [...doctors, ...nurses];
}

// 生成科室统计数据
function generateDeptData() {
  return [
    { dept: "内科", beds: 30, turnover: "85%" },
    { dept: "外科", beds: 28, turnover: "78%" },
    { dept: "儿科", beds: 20, turnover: "92%" },
    { dept: "妇产科", beds: 25, turnover: "88%" },
  ];
}

// ==================== 数据持久化 ====================
function loadData() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    return JSON.parse(savedData);
  } else {
    const initialData = generateBedData();
    saveData(initialData);
    return initialData;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ==================== 渲染函数 ====================

// 渲染床位占用排行榜
function renderRankingTable() {
  const data = generateRankingData();
  const tbody = document.querySelector("#ranking-table tbody");

  tbody.innerHTML = data
    .map(
      (item, index) => `
        <tr>
            <td><span class="rank-number ${index < 3 ? "top" : ""}">${
        item.rank
      }</span></td>
            <td>${item.ward}</td>
            <td>${item.occupied}/${item.total}</td>
            <td>
                ${item.rate}%
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${
                      item.rate
                    }%"></div>
                </div>
            </td>
        </tr>
    `
    )
    .join("");
}

// 渲染床位网格
function renderBedsGrid() {
  const beds = loadData();
  const grid = document.getElementById("beds-grid");

  grid.innerHTML = beds
    .map((bed) => {
      let icon = "";
      let statusText = "空闲";

      // SVG Icons
      const iconFree = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>`;
      const iconOccupied = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
      const iconCleaning = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L3 11l9 9 9-9-9-9z"/><path d="M12 14l-2 2"/><path d="M12 14l2-2"/><path d="M12 14v8"/></svg>`;

      if (bed.status === "occupied") {
        icon = iconOccupied;
        statusText = bed.patientName;
      } else if (bed.status === "cleaning") {
        icon = iconCleaning;
        statusText = "待消毒";
      } else {
        icon = iconFree;
      }

      return `
            <div class="bed-card ${bed.status}" data-id="${bed.id}" onclick="toggleBedStatus(${bed.id})">
                <div class="bed-icon">${icon}</div>
                <div class="bed-number">${bed.number}床</div>
                <div class="bed-status-text">${statusText}</div>
            </div>
        `;
    })
    .join("");

  updateBedStats();
}

// 更新床位统计数字
function updateBedStats() {
  const beds = loadData();
  const total = beds.length;
  const occupied = beds.filter((b) => b.status === "occupied").length;
  const free = beds.filter((b) => b.status === "free").length;

  document.getElementById("total-beds").textContent = total;
  document.getElementById("occupied-count").textContent = occupied;
  document.getElementById("free-count").textContent = free;

  // 更新右侧快捷统计 - 使用更合理的计算方式
  const admission = Math.max(1, Math.floor(Math.random() * 5) + 2); // 2-6人
  const discharge = Math.max(1, Math.floor(Math.random() * 4) + 1); // 1-4人
  document.getElementById("today-admission").textContent = admission;
  document.getElementById("today-discharge").textContent = discharge;

  // 更新饼图
  if (window.statusPieChart) {
    updateStatusPieChart();
  }
}

// 渲染值班人员列表
function renderStaffList() {
  const staff = generateStaffData();
  const container = document.getElementById("staff-list");

  container.innerHTML = staff
    .map(
      (person) => `
        <div class="staff-item">
            <div class="staff-avatar">${person.avatar}</div>
            <div class="staff-info">
                <div class="staff-name">${person.name}</div>
                <div class="staff-role">${person.role}</div>
                <div class="staff-dept">${person.dept}</div>
            </div>
        </div>
    `
    )
    .join("");
}

// 渲染科室统计表
function renderDeptTable() {
  const data = generateDeptData();
  const tbody = document.querySelector("#dept-table tbody");

  tbody.innerHTML = data
    .map(
      (item) => `
        <tr>
            <td>${item.dept}</td>
            <td>${item.beds}</td>
            <td>${item.turnover}</td>
        </tr>
    `
    )
    .join("");
}

// ==================== ECharts 图表 ====================

let trendChart = null;
let sourceChart = null;
let statusPieChart = null;

// 初始化趋势折线图
function initTrendChart() {
  const chartDom = document.getElementById("trend-chart");
  trendChart = echarts.init(chartDom);

  const trendData = generateTrendData();

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "#00d4ff",
      textStyle: { color: "#fff" },
    },
    legend: {
      data: ["总床位", "已占用", "空闲"],
      textStyle: { color: "#b0c4de" },
      top: 10,
    },
    grid: {
      left: "10%",
      right: "5%",
      bottom: "15%",
      top: "20%",
    },
    xAxis: {
      type: "category",
      data: trendData.dates,
      axisLine: { lineStyle: { color: "#1e3a5f" } },
      axisLabel: { color: "#b0c4de", fontSize: 11 },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: "#1e3a5f" } },
      splitLine: { lineStyle: { color: "#1e3a5f", type: "dashed" } },
      axisLabel: { color: "#b0c4de", fontSize: 11 },
    },
    series: [
      {
        name: "总床位",
        type: "line",
        data: trendData.totalBeds,
        lineStyle: { color: "#b0c4de", width: 2 },
        itemStyle: { color: "#b0c4de" },
        smooth: true,
      },
      {
        name: "已占用",
        type: "line",
        data: trendData.occupiedBeds,
        lineStyle: { color: "#ff4757", width: 2 },
        itemStyle: { color: "#ff4757" },
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(255, 71, 87, 0.3)" },
            { offset: 1, color: "rgba(255, 71, 87, 0.05)" },
          ]),
        },
      },
      {
        name: "空闲",
        type: "line",
        data: trendData.freeBeds,
        lineStyle: { color: "#00d4ff", width: 2 },
        itemStyle: { color: "#00d4ff" },
        smooth: true,
      },
    ],
  };

  trendChart.setOption(option);
}

// 初始化来源柱状图
function initSourceChart() {
  const chartDom = document.getElementById("source-chart");
  sourceChart = echarts.init(chartDom);

  const sourceData = generateSourceData();

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "#00d4ff",
      textStyle: { color: "#fff" },
      axisPointer: { type: "shadow" },
    },
    grid: {
      left: "20%",
      right: "10%",
      bottom: "10%",
      top: "10%",
    },
    xAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#1e3a5f", type: "dashed" } },
      axisLabel: { color: "#b0c4de", fontSize: 11 },
    },
    yAxis: {
      type: "category",
      data: sourceData.map((item) => item.name),
      axisLine: { lineStyle: { color: "#1e3a5f" } },
      axisTick: { show: false },
      axisLabel: { color: "#b0c4de", fontSize: 13 },
    },
    series: [
      {
        type: "bar",
        data: sourceData.map((item) => item.value),
        barWidth: "50%",
        itemStyle: {
          borderRadius: [0, 10, 10, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: "#00d4ff" },
            { offset: 1, color: "#00ffaa" },
          ]),
        },
        label: {
          show: true,
          position: "right",
          color: "#00d4ff",
          fontSize: 13,
          fontWeight: "bold",
        },
      },
    ],
  };

  sourceChart.setOption(option);
}

// 初始化状态饼图
function initStatusPieChart() {
  const chartDom = document.getElementById("status-pie-chart");
  statusPieChart = echarts.init(chartDom);

  updateStatusPieChart();
}

// 更新状态饼图数据
function updateStatusPieChart() {
  const beds = loadData();
  const free = beds.filter((b) => b.status === "free").length;
  const occupied = beds.filter((b) => b.status === "occupied").length;
  const cleaning = beds.filter((b) => b.status === "cleaning").length;

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "#00d4ff",
      textStyle: { color: "#fff" },
    },
    legend: {
      orient: "vertical",
      right: "10%",
      top: "center",
      textStyle: { color: "#b0c4de", fontSize: 12 },
    },
    series: [
      {
        name: "床位状态",
        type: "pie",
        radius: ["45%", "70%"],
        center: ["35%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: "#0a0e27",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: "bold",
            color: "#fff",
          },
        },
        labelLine: { show: false },
        data: [
          { value: free, name: "空闲", itemStyle: { color: "#00d4ff" } },
          { value: occupied, name: "占用", itemStyle: { color: "#ff4757" } },
          { value: cleaning, name: "待消毒", itemStyle: { color: "#ffa502" } },
        ],
      },
    ],
  };

  statusPieChart.setOption(option);
}

// ==================== 交互功能 ====================

// 切换床位状态
function toggleBedStatus(bedId) {
  const beds = loadData();
  const bedIndex = beds.findIndex((b) => b.id === bedId);

  if (bedIndex !== -1) {
    const bed = beds[bedIndex];

    // 状态循环: free -> occupied -> cleaning -> free
    if (bed.status === "free") {
      bed.status = "occupied";
      bed.patientName = "患者";
    } else if (bed.status === "occupied") {
      bed.status = "cleaning";
      bed.patientName = "";
    } else {
      bed.status = "free";
    }

    saveData(beds);
    renderBedsGrid();
  }
}

// ==================== 初始化 ====================
function init() {
  // 更新时间
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // 渲染所有模块
  renderRankingTable();
  renderBedsGrid();
  renderStaffList();
  renderDeptTable();

  // 初始化图表
  initTrendChart();
  initSourceChart();
  initStatusPieChart();

  // 窗口大小变化时重绘图表
  window.addEventListener("resize", () => {
    trendChart && trendChart.resize();
    sourceChart && sourceChart.resize();
    statusPieChart && statusPieChart.resize();
  });
}

// DOMContentLoaded 后初始化
document.addEventListener("DOMContentLoaded", init);
