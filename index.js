// ==================== 全局配置 ====================
const STORAGE_KEY = 'ward_bed_dashboard_data'; // 存储床位数据的key
const STATS_KEY = 'ward_bed_daily_stats'; // 存储每日入院出院计数的key

// ==================== 每日入院出院计数 ====================

// 获取今日日期字符串（用于判断是否需要重置计数）
function getTodayString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// 加载每日统计数据（跨天自动重置）
function loadDailyStats() {
  const saved = localStorage.getItem(STATS_KEY);
  if (saved) {
    const stats = JSON.parse(saved);
    if (stats.date === getTodayString()) {
      return stats;
    }
  }
  // 新的一天或无数据，重置计数
  const initial = { date: getTodayString(), admission: 0, discharge: 0 };
  saveDailyStats(initial);
  return initial;
}

// 保存每日统计数据
function saveDailyStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// ==================== 时间更新 ====================
function updateDateTime() {
  const now = new Date(); // 获取当前时间

  // 更新日期
  const year = now.getFullYear(); // 获取年份
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 获取月份
  const day = String(now.getDate()).padStart(2, '0'); // 获取日期
  document.getElementById('current-date').textContent =
    `${year}年${month}月${day}日`;

  // 更新星期
  const weeks = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ];
  document.getElementById('current-week').textContent = weeks[now.getDay()]; // 更新星期

  // 更新时间
  const hours = String(now.getHours()).padStart(2, '0'); // 获取小时
  const minutes = String(now.getMinutes()).padStart(2, '0'); // 获取分钟
  const seconds = String(now.getSeconds()).padStart(2, '0'); // 获取秒
  document.getElementById('current-time').textContent =
    `${hours}:${minutes}:${seconds}`; // 更新时间
}

// ==================== Mock 数据生成 ====================

// 生成床位数据（30个床位）
function generateBedData() {
  const beds = [];
  const statuses = ['free', 'occupied', 'cleaning']; // 床位状态
  const patientNames = [
    '张三',
    '李四',
    '王五',
    '赵六',
    '孙七',
    '周八',
    '吴九',
    '郑十',
    '陈十一',
    '林十二',
  ];

  for (let i = 1; i <= 30; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]; // 随机选择床位状态
    const bed = {
      id: i,
      number: String(i).padStart(3, '0'),
      status: status,
      patientName:
        status === 'occupied'
          ? patientNames[Math.floor(Math.random() * patientNames.length)]
          : '',
      ward: `${Math.ceil(i / 6)}病区`,
    };
    beds.push(bed);
  }
  return beds;
}

// 生成病区排行数据
function generateRankingData() {
  const wards = [
    '内科一区',
    '内科二区',
    '外科一区',
    '外科二区',
    '儿科病区',
    '妇产科',
  ];
  return wards
    .map((ward) => {
      const total = 30 + Math.floor(Math.random() * 20);
      const occupied = Math.floor(total * (0.5 + Math.random() * 0.4));
      const rate = ((occupied / total) * 100).toFixed(1);
      return {
        rank: 0,
        ward: ward,
        total: total,
        occupied: occupied,
        rate: parseFloat(rate),
      };
    })
    .sort((a, b) => b.rate - a.rate)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

// 生成趋势数据（近7天）
function generateTrendData() {
  const dates = [];
  const totalBeds = [];
  const occupiedBeds = [];
  const cleaningBeds = [];
  const freeBeds = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(`${date.getMonth() + 1}/${date.getDate()}`);

    const total = 30;
    const occupied = 15 + Math.floor(Math.random() * 8); // 占用 15-22
    const cleaning = Math.floor(Math.random() * 4); // 待消毒 0-3
    const free = total - occupied - cleaning; // 空闲剩余

    totalBeds.push(total);
    occupiedBeds.push(occupied);
    cleaningBeds.push(cleaning);
    freeBeds.push(free);
  }

  return { dates, totalBeds, occupiedBeds, cleaningBeds, freeBeds };
}

// 生成患者来源数据
function generateSourceData() {
  return [
    { name: '本市', value: 45 + Math.floor(Math.random() * 20) },
    { name: '本省其他市', value: 20 + Math.floor(Math.random() * 15) },
    { name: '外省', value: 10 + Math.floor(Math.random() * 10) },
  ];
}

// 生成值班人员数据
function generateStaffData() {
  const doctors = [
    { name: '李华', role: '主任医师', dept: '内科', avatar: '李' },
    { name: '王芳', role: '副主任医师', dept: '外科', avatar: '王' },
    { name: '张伟', role: '主治医师', dept: '儿科', avatar: '张' },
  ];

  const nurses = [
    { name: '刘洋', role: '护士长', dept: '内科', avatar: '刘' },
    { name: '陈明', role: '责任护士', dept: '外科', avatar: '陈' },
    { name: '周静', role: '护士', dept: '儿科', avatar: '周' },
  ];

  return [...doctors, ...nurses];
}

// 生成科室统计数据
function generateDeptData() {
  return [
    { dept: '内科', beds: 30, turnover: '85%' },
    { dept: '外科', beds: 28, turnover: '78%' },
    { dept: '儿科', beds: 20, turnover: '92%' },
    { dept: '妇产科', beds: 25, turnover: '88%' },
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
  const tbody = document.querySelector('#ranking-table tbody');

  tbody.innerHTML = data
    .map(
      (item, index) => `
        <tr>
            <td><span class="rank-number ${index < 3 ? 'top' : ''}">${
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
    `,
    )
    .join('');
}

// 渲染床位网格
function renderBedsGrid() {
  const beds = loadData();
  const grid = document.getElementById('beds-grid');

  grid.innerHTML = beds
    .map((bed) => {
      let icon = '';
      let statusText = '空闲';

      // SVG Icons
      const iconFree = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>`;
      const iconOccupied = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
      const iconCleaning = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L3 11l9 9 9-9-9-9z"/><path d="M12 14l-2 2"/><path d="M12 14l2-2"/><path d="M12 14v8"/></svg>`;

      if (bed.status === 'occupied') {
        icon = iconOccupied;
        statusText = bed.patientName;
      } else if (bed.status === 'cleaning') {
        icon = iconCleaning;
        statusText = '待消毒';
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
    .join('');

  updateBedStats();
}

// 更新床位统计数字
function updateBedStats() {
  const beds = loadData();
  const total = beds.length;
  const occupied = beds.filter((b) => b.status === 'occupied').length;
  const free = beds.filter((b) => b.status === 'free').length;

  document.getElementById('total-beds').textContent = total;
  document.getElementById('occupied-count').textContent = occupied;
  document.getElementById('free-count').textContent = free;
  document.getElementById('cleaning-count').textContent = beds.filter(
    (b) => b.status === 'cleaning',
  ).length;

  // 从持久化数据中读取今日入院/出院计数
  const dailyStats = loadDailyStats();
  document.getElementById('today-admission').textContent = dailyStats.admission;
  document.getElementById('today-discharge').textContent = dailyStats.discharge;

  // 更新饼图
  if (statusPieChart) {
    updateStatusPieChart();
  }
}

// 渲染值班人员列表
function renderStaffList() {
  const staff = generateStaffData();
  const container = document.getElementById('staff-list');

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
    `,
    )
    .join('');
}

// 渲染科室统计表
function renderDeptTable() {
  const data = generateDeptData();
  const tbody = document.querySelector('#dept-table tbody');

  tbody.innerHTML = data
    .map(
      (item) => `
        <tr>
            <td>${item.dept}</td>
            <td>${item.beds}</td>
            <td>${item.turnover}</td>
        </tr>
    `,
    )
    .join('');
}

// ==================== ECharts 图表 ====================

let trendChart = null;
let sourceChart = null;
let statusPieChart = null;

// 初始化趋势折线图
function initTrendChart() {
  if (!echarts) return;
  const chartDom = document.getElementById('trend-chart');
  trendChart = echarts.init(chartDom);

  const trendData = generateTrendData();

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#00d4ff',
      textStyle: { color: '#fff' },
    },
    legend: {
      data: ['总床位', '已占用', '空闲', '待消毒'],
      textStyle: { color: '#b0c4de' },
      top: 10,
    },
    grid: {
      left: '10%',
      right: '5%',
      bottom: '15%',
      top: '30%',
    },
    xAxis: {
      type: 'category',
      data: trendData.dates,
      axisLine: { lineStyle: { color: '#1e3a5f' } },
      axisLabel: { color: '#b0c4de', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#1e3a5f' } },
      splitLine: { lineStyle: { color: '#1e3a5f', type: 'dashed' } },
      axisLabel: { color: '#b0c4de', fontSize: 11 },
    },
    series: [
      {
        name: '总床位',
        type: 'line',
        data: trendData.totalBeds,
        lineStyle: { color: '#b0c4de', width: 2 },
        itemStyle: { color: '#b0c4de' },
        smooth: true,
      },
      {
        name: '已占用',
        type: 'line',
        data: trendData.occupiedBeds,
        lineStyle: { color: '#ff4757', width: 2 },
        itemStyle: { color: '#ff4757' },
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 71, 87, 0.3)' },
            { offset: 1, color: 'rgba(255, 71, 87, 0.05)' },
          ]),
        },
      },
      {
        name: '空闲',
        type: 'line',
        data: trendData.freeBeds,
        lineStyle: { color: '#00d4ff', width: 2 },
        itemStyle: { color: '#00d4ff' },
        smooth: true,
      },
      {
        name: '待消毒',
        type: 'line',
        data: trendData.cleaningBeds,
        lineStyle: { color: '#ffa502', width: 2 },
        itemStyle: { color: '#ffa502' },
        smooth: true,
      },
    ],
  };

  trendChart.setOption(option);
}

// 初始化来源柱状图
function initSourceChart() {
  if (!echarts) return;
  const chartDom = document.getElementById('source-chart');
  sourceChart = echarts.init(chartDom);

  const sourceData = generateSourceData();

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#00d4ff',
      textStyle: { color: '#fff' },
      axisPointer: { type: 'shadow' },
    },
    grid: {
      left: '20%',
      right: '10%',
      bottom: '10%',
      top: '10%',
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#1e3a5f', type: 'dashed' } },
      axisLabel: { color: '#b0c4de', fontSize: 11 },
    },
    yAxis: {
      type: 'category',
      data: sourceData.map((item) => item.name),
      axisLine: { lineStyle: { color: '#1e3a5f' } },
      axisTick: { show: false },
      axisLabel: { color: '#b0c4de', fontSize: 13 },
    },
    series: [
      {
        type: 'bar',
        data: sourceData.map((item) => item.value),
        barWidth: '50%',
        itemStyle: {
          borderRadius: [0, 10, 10, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#00d4ff' },
            { offset: 1, color: '#00ffaa' },
          ]),
        },
        label: {
          show: true,
          position: 'right',
          color: '#00d4ff',
          fontSize: 13,
          fontWeight: 'bold',
        },
      },
    ],
  };

  sourceChart.setOption(option);
}

// 初始化状态饼图
function initStatusPieChart() {
  if (!echarts) return;
  const chartDom = document.getElementById('status-pie-chart');
  statusPieChart = echarts.init(chartDom);

  // 获取初始数据
  const beds = loadData();
  const free = beds.filter((b) => b.status === 'free').length;
  const occupied = beds.filter((b) => b.status === 'occupied').length;
  const cleaning = beds.filter((b) => b.status === 'cleaning').length;

  // 首次设置完整配置
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#00d4ff',
      textStyle: { color: '#fff' },
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      textStyle: { color: '#b0c4de', fontSize: 12 },
    },
    series: [
      {
        name: '床位状态',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#0a0e27',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#fff',
          },
        },
        labelLine: { show: false },
        data: [
          { value: free, name: '空闲', itemStyle: { color: '#00d4ff' } },
          { value: occupied, name: '占用', itemStyle: { color: '#ff4757' } },
          { value: cleaning, name: '待消毒', itemStyle: { color: '#ffa502' } },
        ],
      },
    ],
  };

  statusPieChart.setOption(option);
}

// 更新状态饼图数据（增量更新，仅更新 data）
function updateStatusPieChart() {
  if (!statusPieChart) return;

  const beds = loadData();
  const free = beds.filter((b) => b.status === 'free').length;
  const occupied = beds.filter((b) => b.status === 'occupied').length;
  const cleaning = beds.filter((b) => b.status === 'cleaning').length;

  statusPieChart.setOption({
    series: [
      {
        data: [
          { value: free, name: '空闲', itemStyle: { color: '#00d4ff' } },
          { value: occupied, name: '占用', itemStyle: { color: '#ff4757' } },
          { value: cleaning, name: '待消毒', itemStyle: { color: '#ffa502' } },
        ],
      },
    ],
  });
}

// ==================== 交互功能 ====================

// 切换床位状态
function toggleBedStatus(bedId) {
  const beds = loadData();
  const bedIndex = beds.findIndex((b) => b.id === bedId);

  if (bedIndex !== -1) {
    const bed = beds[bedIndex];
    const dailyStats = loadDailyStats();

    // 状态循环: free -> occupied -> cleaning -> free
    if (bed.status === 'free') {
      bed.status = 'occupied';
      bed.patientName = '患者';
      // 入院计数 +1
      dailyStats.admission += 1;
    } else if (bed.status === 'occupied') {
      bed.status = 'cleaning';
      bed.patientName = '';
      // 出院计数 +1
      dailyStats.discharge += 1;
    } else {
      bed.status = 'free';
    }

    saveDailyStats(dailyStats);
    saveData(beds);
    renderBedsGrid();
  }
}

// ==================== 大屏适配缩放 ====================
function initScale() {
  const app = document.getElementById('app');
  if (!app) return;
  // 设计稿标准尺寸
  const designWidth = 1920;
  const designHeight = 1080;

  // 获取当前屏幕宽高
  const clientWidth = window.innerWidth;
  const clientHeight = window.innerHeight;

  // 计算缩放比例 (取最小的比例以保证内容完整显示不被裁切)
  const scaleX = clientWidth / designWidth;
  const scaleY = clientHeight / designHeight;
  const scale = Math.min(scaleX, scaleY);

  // 应用缩放和绝对居中 (translate(-50%, -50%) 已经在 CSS 中定义)
  app.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

// ==================== 初始化 ====================
function init() {
  // 初始大屏缩放
  initScale();

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

  // 窗口大小变化时重新计算大屏缩放比例
  window.addEventListener('resize', initScale);
}

// DOMContentLoaded 后初始化
document.addEventListener('DOMContentLoaded', init);
