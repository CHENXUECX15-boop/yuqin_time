const STORAGE_KEY = "yuqin.employee.workspace.v1";

const statusMap = {
  todo: "待办",
  doing: "进行中",
  done: "已完成"
};

const priorityClass = {
  "高": "high",
  "中": "medium",
  "低": "low"
};

const moodLabels = {
  1: "非常不高兴",
  2: "不太高兴",
  3: "一般",
  4: "挺高兴",
  5: "非常高兴"
};

const DEFAULT_THEME = "mono-black";

const themeOptions = [
  { id: "mono-black", name: "简约黑色", nameEn: "Minimal Black", note: "默认", noteEn: "Default", colors: ["#111111", "#f7f7f4", "#d6d6d0"] },
  { id: "colored-cat", name: "彩色猫猫", nameEn: "Colorful Cat", note: "当前风格", noteEn: "Current style", colors: ["#0b7c77", "#ef6f61", "#eff6f5"] },
  { id: "line-cat", name: "线条猫猫", nameEn: "Line Cat", note: "黑白线稿", noteEn: "Line-art", colors: ["#1b1b1b", "#ffffff", "#e7e7e2"] },
  { id: "dopamine", name: "多巴胺配色", nameEn: "Dopamine", note: "夏日高饱和", noteEn: "Bright palette", colors: ["#42bfdf", "#bbdefa", "#fec2dc", "#9ce9e4"] },
  { id: "mono-red", name: "单色红色", nameEn: "Mono Red", note: "清晰醒目", noteEn: "Bold", colors: ["#c53b31", "#fff5f3", "#f7d8d3"] },
  { id: "mono-yellow", name: "单色黄色", nameEn: "Mono Yellow", note: "明亮轻快", noteEn: "Bright", colors: ["#c3841d", "#fff9e6", "#f4d982"] },
  { id: "mono-green", name: "单色绿色", nameEn: "Mono Green", note: "稳定舒展", noteEn: "Calm", colors: ["#2f7d5b", "#f0f7f2", "#cfe8d8"] }
];

const validThemeIds = new Set(themeOptions.map((theme) => theme.id));
const DEFAULT_LANGUAGE = "zh";
const languageOptions = [
  { id: "zh", name: "中文", nameEn: "Chinese", note: "简体中文", noteEn: "Simplified Chinese" },
  { id: "en", name: "English", nameEn: "English", note: "英文界面", noteEn: "English UI" }
];
const validLanguageIds = new Set(languageOptions.map((language) => language.id));
const i18nTextMemory = new WeakMap();

const zhToEn = {
  "主导航": "Main navigation",
  "早日成为富婆": "Early Rich Woman",
  "今日总览": "Today",
  "工作节奏": "Rhythm",
  "任务看板": "Tasks",
  "OKR 与项目": "OKR & Projects",
  "会议协作": "Meetings",
  "资源协同": "Resources",
  "健康边界": "Wellbeing",
  "每日复盘": "Review",
  "数据看板": "Analytics",
  "数据管理": "Data",
  "今日快照": "Snapshot",
  "专注": "Focus",
  "任务": "Tasks",
  "会议": "Meetings",
  "能量": "Energy",
  "未记录": "Not recorded",
  "个人主理人版 · 首屏工作台": "Owner Mode · Workspace",
  "把今天的推进、协作和边界放在同一屏": "Put progress, collaboration, and boundaries on one screen",
  "适合把自己当老板的人、项目主理人和自由职业者，在一天内完成开工、专注、任务、会议、复盘与数据沉淀。": "For self-directed owners, project leads, and freelancers who want work sessions, focus, tasks, meetings, reviews, and data in one place.",
  "开始工作": "Start Work",
  "新增任务": "New Task",
  "写复盘": "Write Review",
  "今日推进": "Today",
  "实时工作卡": "Live Work Card",
  "待启动": "Not started",
  "重点任务": "Key Task",
  "暂无重点任务": "No key task",
  "从任务看板添加": "Add from task board",
  "下一会议": "Next Meeting",
  "暂无会议": "No meetings",
  "会议协作中记录": "Record in meetings",
  "OKR 均值": "OKR Avg",
  "能量状态": "Energy",
  "记会议": "Log Meeting",
  "同步资源": "Sync Resources",
  "今日状态": "Status",
  "尚未开始工作": "Work not started",
  "待开工": "Ready",
  "开工": "Start",
  "收工": "End",
  "主动休息": "Active Rest",
  "身体恢复": "Recovery",
  "节奏调整": "Rhythm Reset",
  "外出事务": "Out of Office",
  "休整": "Rest",
  "工作时长": "Work Time",
  "专注时长": "Focus Time",
  "完成任务": "Done Tasks",
  "会议记录": "Meeting Logs",
  "今日执行": "Execution",
  "优先级、进行中和到期任务": "Priorities, active work, and due tasks",
  "打开任务看板": "Open tasks",
  "临时任务，例如：补齐周报风险项": "Quick task, e.g. add weekly report risks",
  "加入": "Add",
  "日程时间块": "Timeline",
  "工作段、会议与专注片段": "Work sessions, meetings, and focus blocks",
  "打开工作节奏": "Open rhythm",
  "主题速览": "Overview",
  "面向自我经营日常的核心模块": "Core modules for self-directed work",
  "任务流": "Task Flow",
  "复盘": "Review",
  "资源同步": "Resource Sync",
  "健康": "Health",
  "关闭未结束工作段": "Close Open Work",
  "清空今日休整": "Clear Rest",
  "专注计时": "Focus Timer",
  "与任务、工作段一起进入数据看板": "Flows into analytics with tasks and work sessions",
  "未开始": "Not started",
  "专注主题，例如：整理客户问题清单": "Focus topic, e.g. organize customer issues",
  "目标分钟": "Target Minutes",
  "达成奖励": "Reward",
  "例如：喝一杯喜欢的咖啡": "E.g. have a favorite coffee",
  "目标 25 分钟": "Target 25 min",
  "达成后给自己一个奖励": "Reward yourself after completion",
  "开始": "Start",
  "暂停": "Pause",
  "完成": "Complete",
  "重置": "Reset",
  "专注历史": "Focus History",
  "按日期记录每次完成的专注": "Completed focus sessions by date",
  "行动记录": "Activity Log",
  "开工、收工、休整和外出": "Start, end, rest, and outings",
  "近 7 天节奏": "Last 7 Days",
  "工作时长、专注时长与健康负荷": "Work time, focus time, and load",
  "0 个任务": "0 tasks",
  "任务名称": "Task name",
  "高优先级": "High priority",
  "中优先级": "Medium priority",
  "低优先级": "Low priority",
  "关联项目": "Project",
  "新增目标": "New Objective",
  "个人 OKR": "Personal OKR",
  "目标、关键结果与推进率": "Objectives, key results, and progress",
  "项目组合": "Project Portfolio",
  "职责、风险和下一步": "Role, risk, and next step",
  "新增项目": "New Project",
  "会议记录": "Meeting Notes",
  "结论、行动项和负责人": "Decisions, action items, and owners",
  "会议主题": "Meeting topic",
  "项目会": "Project",
  "客户会": "Client",
  "周会": "Weekly",
  "常用联系人，例如：客户张总 / 产品小李": "Frequent contacts, e.g. Alex / Product Lee",
  "加入常用": "Add Contact",
  "常用会议联系人": "Frequent meeting contacts",
  "关键结论": "Key decisions",
  "行动项，用逗号分隔": "Action items, comma-separated",
  "保存会议": "Save Meeting",
  "协作记录": "Collaboration Log",
  "最近会议与待跟进项": "Recent meetings and follow-ups",
  "同步卡片": "Resource Card",
  "进展、风险、需要的支持": "Progress, risks, and support needed",
  "同步主题": "Topic",
  "本周进展": "Progress this week",
  "风险或阻塞": "Risks or blockers",
  "需要的支持或资源": "Support or resources needed",
  "保存同步": "Save Resource Note",
  "同步历史": "Resource History",
  "用于周报、1:1 和绩效沟通": "For weekly reports, 1:1s, and performance talks",
  "今日准点下线": "End On Time",
  "能量登记": "Energy Check-in",
  "工作负荷、恢复感与备注": "Load, recovery, and notes",
  "能量值": "Energy",
  "压力值": "Stress",
  "今天需要照顾的身体或情绪信号": "Physical or emotional signals to care for today",
  "保存状态": "Save Status",
  "边界记录": "Boundary Log",
  "能量、压力和下线状态": "Energy, stress, and boundary status",
  "今天的闭环": "Today's Closure",
  "成果、风险、明日优先级": "Wins, risks, and tomorrow's priorities",
  "今天完成了什么": "What did you complete today?",
  "哪些事情需要预警": "What needs attention?",
  "明天最重要的 1-3 件事": "Top 1-3 things tomorrow",
  "今日满意度": "Today's mood",
  "非常不高兴": "Very Unhappy",
  "不太高兴": "Unhappy",
  "一般": "Neutral",
  "挺高兴": "Happy",
  "非常高兴": "Very Happy",
  "原因": "Reason",
  "写下原因，方便以后回看触发点": "Write the reason so you can review the trigger later",
  "保存复盘": "Save Review",
  "复盘记录": "Review Log",
  "保留每日可回看的工作轨迹": "Keep a daily work trail you can revisit",
  "数据周期": "Data range",
  "7 天": "7 days",
  "14 天": "14 days",
  "30 天": "30 days",
  "工作趋势": "Work Trend",
  "工作分钟、专注分钟、完成任务": "Work minutes, focus minutes, and completed tasks",
  "任务分布": "Task Distribution",
  "待办、进行中、已完成": "To do, in progress, and done",
  "自我体感": "Self Check",
  "能量与压力的相对变化": "Energy and stress over time",
  "主题外观": "Theme",
  "当前主题：": "Current theme: ",
  "语言设置": "Language",
  "当前语言：": "Current language: ",
  "语言选择": "Language selection",
  "本地数据": "Local Data",
  "导出、导入和重置": "Export, import, and reset",
  "导出 JSON": "Export JSON",
  "导入 JSON": "Import JSON",
  "重置演示数据": "Reset Demo Data",
  "导出内容会显示在这里": "Exported content appears here",
  "小程序迁移模型": "Mini Program Model",
  "后续可映射到云开发集合": "Can later map to cloud collections",
  "暂无任务": "No tasks",
  "暂无 OKR": "No OKRs",
  "暂无会议记录": "No meeting records",
  "暂无同步记录": "No resource notes",
  "暂无健康记录": "No wellbeing records",
  "暂无复盘记录": "No review records",
  "暂无行动记录": "No activity records",
  "今天还没有重点任务": "No key tasks today",
  "今天还没有时间块": "No timeline blocks today",
  "完成一次专注后会出现在这里": "Completed focus sessions will appear here",
  "待办": "To Do",
  "进行中": "In Progress",
  "已完成": "Done",
  "已暂停": "Paused",
  "绿": "Green",
  "黄": "Yellow",
  "蓝": "Blue",
  "满意度": "Mood",
  "工作": "Work",
  "压力": "Stress",
  "任务总数": "Total tasks",
  "未命名专注": "Untitled focus",
  "未设置目标": "No target",
  "前一列": "Previous",
  "后一列": "Next",
  "删除": "Delete",
  "删除专注记录": "Delete focus record",
  "删除行动记录": "Delete activity record",
  "工作记录": "Work record",
  "休整 / 外出记录": "Rest / out-of-office",
  "自动关闭": "Auto close",
  "自动收工": "Auto end",
  "请先填写会议主题": "Please enter a meeting topic",
  "会议已保存": "Meeting saved",
  "请先填写同步主题": "Please enter a resource topic",
  "同步卡片已保存": "Resource note saved",
  "复盘已保存": "Review saved",
  "已记录开工": "Start recorded",
  "已记录收工": "End recorded",
  "休整记录已添加": "Rest record added",
  "今天没有未结束工作段": "No open work session today",
  "已关闭未结束工作段": "Open work session closed",
  "今日休整记录已清空": "Today's rest records cleared",
  "专注计时已在进行": "Focus timer is already running",
  "专注开始": "Focus started",
  "当前没有运行中的专注": "No active focus session",
  "专注已暂停": "Focus paused",
  "专注时间太短，暂不记录": "Focus was too short to record",
  "专注已完成": "Focus completed",
  "专注计时已重置": "Focus timer reset",
  "请先输入联系人": "Please enter a contact",
  "这个联系人已经在常用名单里": "This contact already exists",
  "联系人已加入常用": "Contact added",
  "常用联系人已删除": "Frequent contact deleted",
  "请先填写任务名称": "Please enter a task name",
  "任务已新增": "Task added",
  "任务已删除": "Task deleted",
  "任务状态已更新": "Task status updated",
  "OKR 已新增": "OKR added",
  "OKR 已删除": "OKR deleted",
  "项目已新增": "Project added",
  "项目已删除": "Project deleted",
  "行动记录已删除": "Activity deleted",
  "专注记录已删除": "Focus record deleted",
  "会议已删除": "Meeting deleted",
  "同步记录已删除": "Resource note deleted",
  "复盘已删除": "Review deleted",
  "健康记录已删除": "Wellbeing record deleted",
  "健康状态已保存": "Wellbeing saved",
  "JSON 已导出": "JSON exported",
  "数据已导入": "Data imported",
  "导入失败，请检查 JSON 文件": "Import failed. Check the JSON file",
  "已重置为演示数据": "Demo data reset",
  "语言已切换为中文": "Language switched to Chinese"
};

const enToZh = Object.fromEntries(Object.entries(zhToEn).map(([zh, en]) => [en, zh]));

let state = loadState();
let activeSection = "home";
let dashboardRange = 7;
let timerTick = null;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

document.addEventListener("DOMContentLoaded", () => {
  bindNavigation();
  bindForms();
  bindActions();
  bindRanges();
  applyTheme();
  tickClock();
  setInterval(tickClock, 1000);
  timerTick = setInterval(renderFocusTimer, 500);
  renderAll();
});

function createDefaultState() {
  const now = new Date();
  const today = dateKey(now);
  const yesterday = dateKey(addDays(now, -1));
  const twoDaysAgo = dateKey(addDays(now, -2));

  return {
    tasks: [
      {
        id: uid(),
        title: "整理本周项目风险，补充到周报",
        status: "doing",
        priority: "高",
        project: "客户交付优化",
        due: today,
        createdAt: iso(addHours(now, -4)),
        completedAt: null
      },
      {
        id: uid(),
        title: "确认需求变更后的验收口径",
        status: "todo",
        priority: "高",
        project: "数据看板升级",
        due: today,
        createdAt: iso(addDays(now, -1)),
        completedAt: null
      },
      {
        id: uid(),
        title: "归档上次客户会议纪要和行动项",
        status: "done",
        priority: "中",
        project: "客户交付优化",
        due: yesterday,
        createdAt: iso(addDays(now, -2)),
        completedAt: iso(addHours(now, -5))
      }
    ],
    attendanceLogs: [
      { id: uid(), type: "in", at: iso(new Date(`${yesterday}T09:04:00`)), note: "开工" },
      { id: uid(), type: "out", at: iso(new Date(`${yesterday}T18:12:00`)), note: "收工" },
      { id: uid(), type: "in", at: iso(new Date(`${twoDaysAgo}T09:30:00`)), note: "开工" },
      { id: uid(), type: "out", at: iso(new Date(`${twoDaysAgo}T17:50:00`)), note: "收工" }
    ],
    focusSessions: [
      { id: uid(), title: "处理客户问题清单", minutes: 72, targetMinutes: 60, reward: "晚间看一集喜欢的节目", rewardEarned: true, startedAt: iso(new Date(`${yesterday}T10:00:00`)), endedAt: iso(new Date(`${yesterday}T11:12:00`)) },
      { id: uid(), title: "周报草稿", minutes: 45, targetMinutes: 50, reward: "点一杯热饮", rewardEarned: false, startedAt: iso(new Date(`${twoDaysAgo}T14:00:00`)), endedAt: iso(new Date(`${twoDaysAgo}T14:45:00`)) }
    ],
    focusTimer: {
      title: "",
      running: false,
      startedAt: null,
      elapsedMs: 0,
      targetMinutes: 25,
      reward: ""
    },
    okrs: [
      { id: uid(), title: "提升客户交付准时率", keyResult: "本月关键交付节点按期率达到 95%", progress: 62 },
      { id: uid(), title: "沉淀可复用的团队流程", keyResult: "完成 3 份项目模板和 1 次内部分享", progress: 40 },
      { id: uid(), title: "降低跨部门沟通返工", keyResult: "需求确认一次通过率提升到 80%", progress: 55 }
    ],
    projects: [
      { id: uid(), name: "客户交付优化", role: "执行负责人", health: "黄", risk: "验收口径仍需确认", next: "同步客户成功与产品" },
      { id: uid(), name: "数据看板升级", role: "需求接口人", health: "绿", risk: "暂无", next: "补齐字段口径" },
      { id: uid(), name: "流程模板库", role: "共建成员", health: "蓝", risk: "素材分散", next: "收集团队历史文档" }
    ],
    meetings: [
      {
        id: uid(),
        title: "客户交付周同步",
        type: "项目会",
        when: iso(new Date(`${today}T15:00:00`)),
        decision: "先锁定验收指标，再评估新增需求排期。",
        actions: ["补齐验收清单", "同步排期变更"],
        contacts: ["客户张总", "产品小李"],
        createdAt: iso(now)
      }
    ],
    meetingContacts: ["客户张总", "产品小李", "设计小周", "财务 Ada"],
    appearance: {
      theme: DEFAULT_THEME,
      language: DEFAULT_LANGUAGE
    },
    managerNotes: [
      {
        id: uid(),
        topic: "客户交付优化本周同步",
        progress: "已整理 3 类风险并推进产品确认。",
        risk: "客户新增需求可能影响原排期。",
        ask: "需要关键资源帮忙确认优先级取舍。",
        createdAt: iso(addDays(now, -1))
      }
    ],
    healthLogs: [
      { id: uid(), day: yesterday, energy: 4, load: 3, boundaryDone: true, note: "下午状态较好，晚上按时下线。", createdAt: iso(addDays(now, -1)) },
      { id: uid(), day: twoDaysAgo, energy: 3, load: 4, boundaryDone: false, note: "会议偏多，明天减少临时切换。", createdAt: iso(addDays(now, -2)) }
    ],
    reviews: [
      {
        id: uid(),
        day: yesterday,
        wins: "完成客户问题清单整理，推动验收口径进入确认。",
      risks: "新增需求仍需排期判断。",
      tomorrow: "先确认验收标准，再写周报。",
      score: 4,
      moodReason: "",
      createdAt: iso(addDays(now, -1))
    }
  ]
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw);
    return normalizeLegacyWording(mergeState(createDefaultState(), parsed));
  } catch (error) {
    console.warn("Failed to load state", error);
    return createDefaultState();
  }
}

function mergeState(base, incoming) {
  return {
    ...base,
    ...incoming,
    appearance: mergeAppearance(base.appearance, incoming.appearance),
    focusTimer: { ...base.focusTimer, ...(incoming.focusTimer || {}) }
  };
}

function mergeAppearance(base, incoming = {}) {
  incoming = incoming || {};
  const theme = validThemeIds.has(incoming.theme) ? incoming.theme : base.theme || DEFAULT_THEME;
  const language = validLanguageIds.has(incoming.language) ? incoming.language : base.language || DEFAULT_LANGUAGE;
  return { ...base, ...incoming, theme, language };
}

function normalizeLegacyWording(nextState) {
  const attendanceLabels = {
    "到位": "开工",
    "离开": "收工",
    "年假": "主动休息",
    "病假": "身体恢复",
    "调休": "节奏调整",
    "外勤": "外出事务",
    "自动关闭": "自动收工"
  };

  nextState.attendanceLogs = (nextState.attendanceLogs || []).map((item) => ({
    ...item,
    note: attendanceLabels[item.note] || item.note
  }));

  nextState.managerNotes = (nextState.managerNotes || []).map((item) => ({
    ...item,
    topic: replaceLegacyPerspective(item.topic),
    progress: replaceLegacyPerspective(item.progress),
    risk: replaceLegacyPerspective(item.risk),
    ask: replaceLegacyPerspective(item.ask)
  }));

  return nextState;
}

function replaceLegacyPerspective(value) {
  if (typeof value !== "string") return value;
  return value
    .replace(/主管/g, "关键资源")
    .replace(/向上/g, "资源");
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function bindNavigation() {
  $$(".nav-btn").forEach((button) => {
    button.addEventListener("click", () => showSection(button.dataset.section));
  });

  document.addEventListener("click", (event) => {
    const jump = event.target.closest("[data-jump]");
    if (!jump) return;
    showSection(jump.dataset.jump);
  });
}

function bindForms() {
  $("#quickTaskForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("#quickTaskInput");
    addTask(input.value, "中", "", todayKey());
    input.value = "";
  });

  $("#taskForm").addEventListener("submit", (event) => {
    event.preventDefault();
    addTask($("#taskTitle").value, $("#taskPriority").value, $("#taskProject").value, $("#taskDue").value);
    $("#taskForm").reset();
    $("#taskPriority").value = "中";
  });

  $("#meetingForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const title = $("#meetingTitle").value.trim();
    if (!title) return toast("请先填写会议主题");
    const actions = $("#meetingActions").value
      .split(/[，,]/)
      .map((item) => item.trim())
      .filter(Boolean);
    state.meetings.unshift({
      id: uid(),
      title,
      when: $("#meetingWhen").value ? iso(new Date($("#meetingWhen").value)) : iso(new Date()),
      type: $("#meetingType").value,
      decision: $("#meetingDecision").value.trim(),
      actions,
      contacts: getSelectedMeetingContacts(),
      createdAt: iso(new Date())
    });
    saveAndRender("会议已保存");
    $("#meetingForm").reset();
  });

  $("#meetingContactInput").addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addMeetingContact();
  });

  $("#managerForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const topic = $("#managerTopic").value.trim();
    if (!topic) return toast("请先填写同步主题");
    state.managerNotes.unshift({
      id: uid(),
      topic,
      progress: $("#managerProgress").value.trim(),
      risk: $("#managerRisk").value.trim(),
      ask: $("#managerAsk").value.trim(),
      createdAt: iso(new Date())
    });
    saveAndRender("同步卡片已保存");
    $("#managerForm").reset();
  });

  $("#healthForm").addEventListener("submit", (event) => {
    event.preventDefault();
    upsertHealthLog({
      energy: Number($("#energyRange").value),
      load: Number($("#loadRange").value),
      note: $("#healthNote").value.trim()
    });
  });

  $("#reviewForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const day = todayKey();
    const existing = state.reviews.find((item) => item.day === day);
    const payload = {
      day,
      wins: $("#reviewWins").value.trim(),
      risks: $("#reviewRisks").value.trim(),
      tomorrow: $("#reviewTomorrow").value.trim(),
      score: Number($("#reviewScore").value),
      moodReason: shouldCollectMoodReason(Number($("#reviewScore").value)) ? $("#reviewMoodReason").value.trim() : "",
      createdAt: iso(new Date())
    };
    if (existing) Object.assign(existing, payload);
    else state.reviews.unshift({ id: uid(), ...payload });
    saveAndRender("复盘已保存");
  });
}

function bindActions() {
  $("#heroStartWork").addEventListener("click", checkIn);
  $("#btnCheckIn").addEventListener("click", checkIn);
  $("#btnCheckOut").addEventListener("click", checkOut);
  $("#btnLeave").addEventListener("click", addLeave);
  $("#btnCloseOpenLogs").addEventListener("click", closeOpenLogs);
  $("#btnClearTodayLeaves").addEventListener("click", clearTodayLeaves);

  $("#btnFocusStart").addEventListener("click", startFocus);
  $("#btnFocusPause").addEventListener("click", pauseFocus);
  $("#btnFocusFinish").addEventListener("click", finishFocus);
  $("#btnFocusReset").addEventListener("click", resetFocus);
  $$(".mood-btn").forEach((button) => {
    button.addEventListener("click", () => setReviewMood(Number(button.dataset.reviewScore)));
  });
  $("#btnAddMeetingContact").addEventListener("click", addMeetingContact);
  $("#meetingContactList").addEventListener("click", handleMeetingContactAction);

  $("#btnAddObjective").addEventListener("click", addObjective);
  $("#btnAddProject").addEventListener("click", addProject);
  $("#btnBoundaryDone").addEventListener("click", () => {
    upsertHealthLog({ boundaryDone: true });
  });

  $("#btnExport").addEventListener("click", exportData);
  $("#importFile").addEventListener("change", importData);
  $("#btnReset").addEventListener("click", resetData);
  $("#themeChoiceList").addEventListener("click", handleThemeChoice);
  $("#themeChoiceList").addEventListener("keydown", handleThemeChoiceKey);
  $("#languageChoiceList").addEventListener("click", handleLanguageChoice);
  $("#languageChoiceList").addEventListener("keydown", handleLanguageChoiceKey);

  $("#kanbanBoard").addEventListener("click", handleTaskAction);
  $("#okrList").addEventListener("input", handleOkrProgress);
  $("#okrList").addEventListener("click", handleOkrDelete);
  $("#projectTable").addEventListener("click", handleProjectDelete);
  $("#attendanceList").addEventListener("click", handleDeleteFromList("attendanceLogs", "行动记录已删除"));
  $("#focusHistoryList").addEventListener("click", handleDeleteFromList("focusSessions", "专注记录已删除"));
  $("#meetingList").addEventListener("click", handleDeleteFromList("meetings", "会议已删除"));
  $("#managerList").addEventListener("click", handleDeleteFromList("managerNotes", "同步记录已删除"));
  $("#reviewList").addEventListener("click", handleDeleteFromList("reviews", "复盘已删除"));
  $("#healthList").addEventListener("click", handleDeleteFromList("healthLogs", "健康记录已删除"));

  $$(".segmented button").forEach((button) => {
    button.addEventListener("click", () => {
      dashboardRange = Number(button.dataset.range);
      $$(".segmented button").forEach((item) => item.classList.toggle("is-active", item === button));
      renderCharts();
    });
  });

  window.addEventListener("resize", () => {
    window.clearTimeout(window.__workspaceResize);
    window.__workspaceResize = window.setTimeout(renderCharts, 120);
  });
}

function bindRanges() {
  const energy = $("#energyRange");
  const load = $("#loadRange");

  energy.addEventListener("input", () => $("#energyValue").textContent = energy.value);
  load.addEventListener("input", () => $("#loadValue").textContent = load.value);
}

function showSection(id) {
  activeSection = id;
  $$(".view").forEach((section) => section.classList.toggle("is-visible", section.id === id));
  $$(".nav-btn").forEach((button) => button.classList.toggle("is-active", button.dataset.section === id));
  renderCharts();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function checkIn() {
  state.attendanceLogs.push({ id: uid(), type: "in", at: iso(new Date()), note: "开工" });
  saveAndRender("已记录开工");
}

function checkOut() {
  state.attendanceLogs.push({ id: uid(), type: "out", at: iso(new Date()), note: "收工" });
  saveAndRender("已记录收工");
}

function addLeave() {
  state.attendanceLogs.push({ id: uid(), type: "leave", at: iso(new Date()), note: $("#leaveType").value });
  saveAndRender("休整记录已添加");
}

function closeOpenLogs() {
  if (openWorkSegmentCount() === 0) return toast("今天没有未结束工作段");
  state.attendanceLogs.push({ id: uid(), type: "out", at: iso(new Date()), note: "自动关闭" });
  saveAndRender("已关闭未结束工作段");
}

function clearTodayLeaves() {
  const today = todayKey();
  state.attendanceLogs = state.attendanceLogs.filter((item) => !(item.type === "leave" && dateKey(new Date(item.at)) === today));
  saveAndRender("今日休整记录已清空");
}

function startFocus() {
  const timer = state.focusTimer;
  if (timer.running) return toast("专注计时已在进行");
  timer.title = $("#focusTitle").value.trim() || timer.title || (isEnglish() ? "Untitled focus" : "未命名专注");
  timer.targetMinutes = clampFocusTarget($("#focusTargetMinutes").value);
  timer.reward = $("#focusReward").value.trim();
  timer.startedAt = iso(new Date());
  timer.running = true;
  saveAndRender("专注开始");
}

function pauseFocus() {
  const timer = state.focusTimer;
  if (!timer.running) return toast("当前没有运行中的专注");
  timer.elapsedMs += Date.now() - new Date(timer.startedAt).getTime();
  timer.startedAt = null;
  timer.running = false;
  saveAndRender("专注已暂停");
}

function finishFocus() {
  const timer = state.focusTimer;
  const elapsedMs = currentFocusMs();
  const minutes = Math.max(1, Math.round(elapsedMs / 60000));
  if (elapsedMs < 5000) return toast("专注时间太短，暂不记录");
  const endedAt = new Date();
  state.focusSessions.unshift({
    id: uid(),
    title: timer.title || $("#focusTitle").value.trim() || (isEnglish() ? "Untitled focus" : "未命名专注"),
    minutes,
    targetMinutes: timer.targetMinutes || clampFocusTarget($("#focusTargetMinutes").value),
    reward: timer.reward || $("#focusReward").value.trim(),
    rewardEarned: Boolean((timer.targetMinutes || clampFocusTarget($("#focusTargetMinutes").value)) && minutes >= (timer.targetMinutes || clampFocusTarget($("#focusTargetMinutes").value))),
    startedAt: iso(new Date(endedAt.getTime() - elapsedMs)),
    endedAt: iso(endedAt)
  });
  const latest = state.focusSessions[0];
  state.focusTimer = { title: "", running: false, startedAt: null, elapsedMs: 0, targetMinutes: latest.targetMinutes || 25, reward: latest.reward || "" };
  $("#focusTitle").value = "";
  if (latest.rewardEarned && latest.reward) {
    saveAndRender(isEnglish() ? `Goal reached. Reward yourself: ${latest.reward}` : `目标达成，奖励自己：${latest.reward}`);
  } else if (latest.rewardEarned) {
    saveAndRender(isEnglish() ? "Goal reached. Remember your reward" : "目标达成，记得兑现给自己的奖励");
  } else if (latest.targetMinutes) {
    saveAndRender(isEnglish() ? `Focus saved. Target of ${latest.targetMinutes} min was not reached` : `专注已保存，本次未达成 ${latest.targetMinutes} 分钟目标`);
  } else {
    saveAndRender("专注已完成");
  }
}

function resetFocus() {
  state.focusTimer = {
    title: "",
    running: false,
    startedAt: null,
    elapsedMs: 0,
    targetMinutes: clampFocusTarget($("#focusTargetMinutes").value),
    reward: $("#focusReward").value.trim()
  };
  $("#focusTitle").value = "";
  saveAndRender("专注计时已重置");
}

function clampFocusTarget(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return 0;
  return Math.max(1, Math.min(240, Math.round(number)));
}

function addMeetingContact() {
  const input = $("#meetingContactInput");
  const name = input.value.trim();
  if (!name) return toast("请先输入联系人");
  state.meetingContacts = state.meetingContacts || [];
  const exists = state.meetingContacts.some((item) => item.toLowerCase() === name.toLowerCase());
  if (exists) return toast("这个联系人已经在常用名单里");
  const selected = getSelectedMeetingContacts();
  state.meetingContacts.push(name);
  input.value = "";
  saveState();
  renderMeetingContacts([...selected, name]);
  renderIcons();
  toast("联系人已加入常用");
}

function handleMeetingContactAction(event) {
  const button = event.target.closest("[data-contact-delete]");
  if (!button) return;
  const selected = getSelectedMeetingContacts().filter((name) => name !== button.dataset.contactDelete);
  state.meetingContacts = (state.meetingContacts || []).filter((name) => name !== button.dataset.contactDelete);
  saveState();
  renderMeetingContacts(selected);
  renderIcons();
  toast("常用联系人已删除");
}

function getSelectedMeetingContacts() {
  return $$("[data-meeting-contact]:checked").map((input) => input.value);
}

function setReviewMood(score, reason = null) {
  const safeScore = Math.max(1, Math.min(5, Number(score) || 3));
  $("#reviewScore").value = safeScore;
  $$(".mood-btn").forEach((button) => {
    button.classList.toggle("is-selected", Number(button.dataset.reviewScore) === safeScore);
  });

  const reasonWrap = $("#reviewMoodReasonWrap");
  const reasonInput = $("#reviewMoodReason");
  const reasonLabel = $("#reviewMoodReasonLabel");
  const needsReason = shouldCollectMoodReason(safeScore);
  reasonWrap.hidden = !needsReason;

  if (needsReason) {
    reasonLabel.textContent = safeScore === 5
      ? (isEnglish() ? "Why are you especially happy today?" : "为什么今天特别高兴？")
      : (isEnglish() ? "Why are you especially unhappy today?" : "为什么今天特别不高兴？");
    reasonInput.placeholder = safeScore === 5
      ? (isEnglish() ? "Record the trigger that made you happy" : "记录让你很开心的触发点")
      : (isEnglish() ? "Record the trigger that felt uncomfortable" : "记录让你不舒服的触发点");
    if (reason !== null) reasonInput.value = reason;
  } else {
    reasonInput.value = "";
  }
}

function shouldCollectMoodReason(score) {
  return Number(score) === 1 || Number(score) === 5;
}

function addTask(title, priority = "中", project = "", due = "") {
  const cleanTitle = title.trim();
  if (!cleanTitle) return toast("请先填写任务名称");
  state.tasks.unshift({
    id: uid(),
    title: cleanTitle,
    status: "todo",
    priority,
    project: project.trim(),
    due: due || "",
    createdAt: iso(new Date()),
    completedAt: null
  });
  saveAndRender("任务已新增");
}

function handleTaskAction(event) {
  const button = event.target.closest("[data-task-action]");
  if (!button) return;
  const task = state.tasks.find((item) => item.id === button.dataset.id);
  if (!task) return;
  const action = button.dataset.taskAction;

  if (action === "prev") {
    task.status = task.status === "done" ? "doing" : "todo";
    task.completedAt = null;
  }
  if (action === "next") {
    task.status = task.status === "todo" ? "doing" : "done";
    task.completedAt = task.status === "done" ? iso(new Date()) : null;
  }
  if (action === "done") {
    task.status = "done";
    task.completedAt = iso(new Date());
  }
  if (action === "delete") {
    state.tasks = state.tasks.filter((item) => item.id !== task.id);
  }
  saveAndRender(action === "delete" ? "任务已删除" : "任务状态已更新");
}

function addObjective() {
  const title = window.prompt(isEnglish() ? "Objective name" : "目标名称");
  if (!title) return;
  const keyResult = window.prompt(isEnglish() ? "Key result" : "关键结果", isEnglish() ? "Describe a measurable result" : "用一个可衡量结果描述完成标准") || "";
  state.okrs.unshift({ id: uid(), title: title.trim(), keyResult: keyResult.trim(), progress: 0 });
  saveAndRender("OKR 已新增");
}

function handleOkrProgress(event) {
  const input = event.target.closest("[data-okr-progress], [data-okr-number]");
  if (!input) return;
  const okr = state.okrs.find((item) => item.id === input.dataset.id);
  if (!okr) return;
  if (input.value === "") return;
  okr.progress = clampProgress(input.value);
  saveState();
  syncOkrProgressControls(okr.id, okr.progress);
  renderHome();
  renderCharts();
}

function syncOkrProgressControls(id, value) {
  $$(`[data-id="${id}"][data-okr-progress], [data-id="${id}"][data-okr-number]`).forEach((control) => {
    control.value = value;
  });
}

function clampProgress(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function handleOkrDelete(event) {
  const button = event.target.closest("[data-okr-delete]");
  if (!button) return;
  state.okrs = state.okrs.filter((item) => item.id !== button.dataset.id);
  saveAndRender("OKR 已删除");
}

function addProject() {
  const name = window.prompt(isEnglish() ? "Project name" : "项目名称");
  if (!name) return;
  const role = window.prompt(isEnglish() ? "Your role" : "你的角色", isEnglish() ? "Owner" : "主理人") || (isEnglish() ? "Owner" : "主理人");
  const risk = window.prompt(isEnglish() ? "Current risk" : "当前风险", isEnglish() ? "None" : "暂无") || (isEnglish() ? "None" : "暂无");
  const next = window.prompt(isEnglish() ? "Next action" : "下一步动作", isEnglish() ? "Add next step" : "补充下一步") || (isEnglish() ? "Add next step" : "补充下一步");
  state.projects.unshift({ id: uid(), name: name.trim(), role: role.trim(), health: "黄", risk: risk.trim(), next: next.trim() });
  saveAndRender("项目已新增");
}

function handleProjectDelete(event) {
  const button = event.target.closest("[data-project-delete]");
  if (!button) return;
  state.projects = state.projects.filter((item) => item.id !== button.dataset.id);
  saveAndRender("项目已删除");
}

function handleDeleteFromList(key, message) {
  return (event) => {
    const button = event.target.closest("[data-delete-id]");
    if (!button) return;
    state[key] = state[key].filter((item) => item.id !== button.dataset.deleteId);
    saveAndRender(message);
  };
}

function upsertHealthLog(patch) {
  const day = todayKey();
  let log = state.healthLogs.find((item) => item.day === day);
  if (!log) {
    log = {
      id: uid(),
      day,
      energy: Number($("#energyRange").value),
      load: Number($("#loadRange").value),
      boundaryDone: false,
      note: "",
      createdAt: iso(new Date())
    };
    state.healthLogs.unshift(log);
  }
  Object.assign(log, patch, { createdAt: iso(new Date()) });
  $("#energyRange").value = log.energy;
  $("#loadRange").value = log.load;
  $("#energyValue").textContent = log.energy;
  $("#loadValue").textContent = log.load;
  saveAndRender("健康状态已保存");
}

function exportData() {
  const payload = JSON.stringify(state, null, 2);
  $("#exportBox").value = payload;
  const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${isEnglish() ? "early-rich-woman" : "早日成为富婆"}-${todayKey()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  toast("JSON 已导出");
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      state = mergeState(createDefaultState(), imported);
      saveAndRender("数据已导入");
    } catch (error) {
      toast("导入失败，请检查 JSON 文件");
    }
  };
  reader.readAsText(file, "utf-8");
  event.target.value = "";
}

function resetData() {
  const confirmed = window.confirm(isEnglish() ? "Reset demo data? Current local data will be overwritten." : "确定重置为演示数据吗？当前本地数据会被覆盖。");
  if (!confirmed) return;
  state = createDefaultState();
  saveAndRender("已重置为演示数据");
}

function handleThemeChoice(event) {
  const button = event.target.closest("[data-theme-choice]");
  if (!button) return;
  setTheme(button.dataset.themeChoice);
}

function handleThemeChoiceKey(event) {
  if (event.key !== "Enter" && event.key !== " ") return;
  const button = event.target.closest("[data-theme-choice]");
  if (!button) return;
  event.preventDefault();
  setTheme(button.dataset.themeChoice);
}

function setTheme(themeId) {
  if (!validThemeIds.has(themeId)) return;
  state.appearance = { ...(state.appearance || {}), theme: themeId };
  applyTheme();
  saveAndRender(isEnglish() ? `Theme switched to ${themeName(themeId)}` : `主题已切换为${themeName(themeId)}`);
}

function applyTheme() {
  const theme = validThemeIds.has(state.appearance?.theme) ? state.appearance.theme : DEFAULT_THEME;
  state.appearance = { ...(state.appearance || {}), theme };
  if (document.body) document.body.dataset.theme = theme;
}

function handleLanguageChoice(event) {
  const button = event.target.closest("[data-language-choice]");
  if (!button) return;
  setLanguage(button.dataset.languageChoice);
}

function handleLanguageChoiceKey(event) {
  if (event.key !== "Enter" && event.key !== " ") return;
  const button = event.target.closest("[data-language-choice]");
  if (!button) return;
  event.preventDefault();
  setLanguage(button.dataset.languageChoice);
}

function setLanguage(languageId) {
  if (!validLanguageIds.has(languageId)) return;
  state.appearance = { ...(state.appearance || {}), language: languageId };
  saveAndRender(languageId === "en" ? "Language switched to English" : "语言已切换为中文");
}

function currentLanguage() {
  const language = state.appearance?.language;
  return validLanguageIds.has(language) ? language : DEFAULT_LANGUAGE;
}

function isEnglish() {
  return currentLanguage() === "en";
}

function translateExact(value) {
  if (value == null) return value;
  const text = String(value);
  const trimmed = text.trim();
  if (!trimmed) return text;
  const translated = localizeI18nKey(normalizeI18nKey(trimmed));
  if (!translated) return text;
  return text.replace(trimmed, translated);
}

function t(value) {
  return isEnglish() ? zhToEn[value] || value : enToZh[value] || value;
}

function normalizeI18nKey(text) {
  return enToZh[text] || text;
}

function localizeI18nKey(key) {
  return isEnglish() ? zhToEn[key] || key : key;
}

function translateRememberedText(value, memo) {
  const text = String(value);
  const trimmed = text.trim();
  if (!trimmed) return { text, key: memo?.key || "", translated: trimmed };
  const expected = memo ? localizeI18nKey(memo.key) : "";
  const key = !memo || (trimmed !== memo.last && trimmed !== expected)
    ? normalizeI18nKey(trimmed)
    : memo.key;
  const translated = localizeI18nKey(key);
  return {
    text: text.replace(trimmed, translated),
    key,
    translated
  };
}

function statusText(status) {
  const labels = isEnglish()
    ? { todo: "To Do", doing: "In Progress", done: "Done" }
    : statusMap;
  return labels[status] || status;
}

function priorityText(priority) {
  if (!isEnglish()) return priority;
  return { "高": "High", "中": "Medium", "低": "Low" }[priority] || priority;
}

function priorityLabel(priority) {
  return isEnglish() ? `${priorityText(priority)} priority` : `${priority}优先级`;
}

function countLabel(count, zhUnit, enUnit) {
  return isEnglish() ? `${count} ${enUnit}${Number(count) === 1 ? "" : "s"}` : `${count} ${zhUnit}`;
}

function applyLanguage() {
  const language = currentLanguage();
  document.documentElement.lang = language === "en" ? "en" : "zh-CN";
  document.title = language === "en" ? "Early Rich Woman | work for tomorrow." : "早日成为富婆 | work for tomorrow.";
  translateDomText(document.body);
  translateDomAttributes();
}

function translateDomText(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "PRE", "TEXTAREA"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const result = translateRememberedText(node.nodeValue, i18nTextMemory.get(node));
    i18nTextMemory.set(node, { key: result.key, last: result.translated });
    node.nodeValue = result.text;
  });
}

function translateDomAttributes() {
  ["placeholder", "aria-label", "title"].forEach((attribute) => {
    $$(`[${attribute}]`).forEach((node) => {
      const keyAttribute = `data-i18n-${attribute}-key`;
      const lastAttribute = `data-i18n-${attribute}-last`;
      const memo = node.hasAttribute(keyAttribute)
        ? { key: node.getAttribute(keyAttribute), last: node.getAttribute(lastAttribute) || "" }
        : null;
      const result = translateRememberedText(node.getAttribute(attribute), memo);
      node.setAttribute(keyAttribute, result.key);
      node.setAttribute(lastAttribute, result.translated);
      node.setAttribute(attribute, result.text);
    });
  });
}

function renderAll() {
  applyTheme();
  tickClock();
  renderHome();
  renderRhythm();
  renderTasks();
  renderOkr();
  renderMeetings();
  renderManager();
  renderHealth();
  renderReview();
  renderSettings();
  renderFocusTimer();
  renderCharts();
  applyLanguage();
  renderIcons();
}

function renderHome() {
  const today = todayKey();
  const todayTasks = state.tasks.filter((task) => task.due === today || task.status === "doing" || task.priority === "高");
  const doneToday = state.tasks.filter((task) => task.completedAt && dateKey(new Date(task.completedAt)) === today).length;
  const focus = focusMinutesForDay(today);
  const workMinutes = workMinutesForDay(today);
  const meetings = state.meetings.filter((item) => dateKey(new Date(item.when)) === today).length;
  const health = state.healthLogs.find((item) => item.day === today);
  const openCount = openWorkSegmentCount();
  const totalTasks = state.tasks.length;
  const openTasks = state.tasks.filter((task) => task.status !== "done").length;

  $("#todayWorkMinutes").textContent = formatMinutes(workMinutes);
  $("#todayFocusMinutes").textContent = formatMinutes(focus);
  $("#todayDoneTasks").textContent = doneToday;
  $("#todayMeetingCount").textContent = meetings;
  $("#sideFocus").textContent = formatMinutes(focus);
  $("#sideTasks").textContent = `${totalTasks - openTasks}/${totalTasks}`;
  $("#sideMeetings").textContent = meetings;
  $("#sideEnergy").textContent = health ? `${health.energy}/5` : t("未记录");
  $("#workStateLabel").textContent = openCount > 0 ? (isEnglish() ? "Work session active" : "工作段进行中") : workMinutes > 0 ? (isEnglish() ? "Work recorded today" : "今日已有工作记录") : t("尚未开始工作");
  $("#openLogBadge").textContent = openCount > 0 ? `${t("进行中")} ${openCount}` : t("待开工");
  $("#openLogBadge").className = `status-pill ${openCount > 0 ? "good" : "neutral"}`;

  $("#homeTaskList").innerHTML = todayTasks.length ? todayTasks
    .slice()
    .sort(sortTasks)
    .slice(0, 6)
    .map(taskCard)
    .join("") : empty("今天还没有重点任务");

  $("#todayTimeline").innerHTML = buildTimeline(today).slice(0, 8).map(timelineItem).join("") || empty("今天还没有时间块");
}

function renderRhythm() {
  const groups = groupedAttendanceByDay();
  const focusGroups = groupedFocusByDay();
  $("#focusHistoryList").innerHTML = focusGroups.map((group) => `
    <div class="date-group">
      <div class="date-divider">
        <span>${escapeHtml(formatDayTitle(group.day))}</span>
        <strong>${formatMinutes(group.totalMinutes)}</strong>
      </div>
      <div class="stack-list">
        ${group.items.map((item) => `
          <div class="stack-item focus-history-item">
            <div class="stack-item-head">
              <div>
                <h3><i data-lucide="timer"></i> ${escapeHtml(item.title || (isEnglish() ? "Untitled focus" : "未命名专注"))}</h3>
                <p>${formatTime(item.startedAt)} - ${formatTime(item.endedAt)} · ${formatMinutes(item.minutes)}</p>
                <div class="item-meta">
                  ${item.targetMinutes ? `<span class="tag">${isEnglish() ? `Target ${item.targetMinutes} min` : `目标 ${item.targetMinutes} 分钟`}</span>` : ""}
                  ${item.reward ? `<span class="tag ${item.rewardEarned ? "low" : "medium"}">${item.rewardEarned ? (isEnglish() ? "Reward unlocked" : "奖励已解锁") : (isEnglish() ? "Reward locked" : "奖励未解锁")}${isEnglish() ? ": " : "："}${escapeHtml(item.reward)}</span>` : ""}
                </div>
              </div>
              <button class="icon-btn" data-delete-id="${item.id}" aria-label="${t("删除专注记录")}" title="${t("删除专注记录")}"><i data-lucide="trash-2"></i></button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("") || empty("完成一次专注后会出现在这里");

  $("#attendanceList").innerHTML = groups.map((group) => `
    <div class="date-group">
      <div class="date-divider">
        <span>${escapeHtml(formatDayTitle(group.day))}</span>
        <strong>${isEnglish() ? countLabel(group.items.length, "条", "item") : `${group.items.length} 条`}</strong>
      </div>
      <div class="stack-list">
        ${group.items.map((item) => {
          const icon = item.type === "in" ? "log-in" : item.type === "out" ? "log-out" : "umbrella";
          const title = item.type === "leave" ? t(item.note) : item.type === "in" ? t("开工") : t("收工");
          return `
            <div class="stack-item attendance-item">
              <div class="stack-item-head">
                <div>
                  <h3><i data-lucide="${icon}"></i> ${escapeHtml(title)}</h3>
                  <p>${escapeHtml(t(item.note || ""))}</p>
                </div>
                <div class="attendance-actions">
                  <span class="tag">${formatTime(item.at)}</span>
                  <button class="icon-btn" data-delete-id="${item.id}" aria-label="${t("删除行动记录")}" title="${t("删除行动记录")}"><i data-lucide="trash-2"></i></button>
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `).join("") || empty("暂无行动记录");
}

function groupedFocusByDay() {
  const groups = new Map();
  state.focusSessions
    .slice()
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
    .slice(0, 20)
    .forEach((item) => {
      const day = dateKey(new Date(item.startedAt));
      if (!groups.has(day)) groups.set(day, []);
      groups.get(day).push(item);
    });
  return Array.from(groups.entries()).map(([day, items]) => ({
    day,
    items,
    totalMinutes: items.reduce((sum, item) => sum + Number(item.minutes || 0), 0)
  }));
}

function groupedAttendanceByDay() {
  const groups = new Map();
  recentAttendance().forEach((item) => {
    const day = dateKey(new Date(item.at));
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day).push(item);
  });
  return Array.from(groups.entries()).map(([day, items]) => ({ day, items }));
}

function formatDayTitle(day) {
  const date = new Date(`${day}T12:00:00`);
  const weekday = date.toLocaleDateString(isEnglish() ? "en-US" : "zh-CN", { weekday: "long" });
  return `${day} ${weekday}`;
}

function renderFocusTimer() {
  const ms = currentFocusMs();
  $("#focusTimer").textContent = formatDuration(ms);
  const timer = state.focusTimer;
  const isLocked = timer.running || Number(timer.elapsedMs || 0) > 0;
  if (isLocked) {
    if (timer.targetMinutes) $("#focusTargetMinutes").value = timer.targetMinutes;
    $("#focusReward").value = timer.reward || "";
  }
  const targetMinutes = isLocked ? Number(timer.targetMinutes || 0) : clampFocusTarget($("#focusTargetMinutes").value);
  const reward = isLocked ? (timer.reward || "") : $("#focusReward").value.trim();
  const progress = targetMinutes ? Math.min(100, Math.floor((ms / (targetMinutes * 60000)) * 100)) : 0;
  $("#focusState").textContent = timer.running ? t("进行中") : ms > 0 ? (isEnglish() ? "Paused" : "已暂停") : t("未开始");
  $("#focusState").className = `status-pill ${timer.running ? "good" : "neutral"}`;
  if (timer.title && !$("#focusTitle").value) $("#focusTitle").value = timer.title;
  $("#focusGoalLabel").textContent = targetMinutes ? (isEnglish() ? `Target ${targetMinutes} min` : `目标 ${targetMinutes} 分钟`) : (isEnglish() ? "No target" : "未设置目标");
  $("#focusGoalProgress").textContent = `${progress}%`;
  $("#focusGoalBar").style.width = `${progress}%`;
  $("#focusRewardPreview").textContent = reward ? (isEnglish() ? `Reward: ${reward}` : `达成奖励：${reward}`) : t("达成后给自己一个奖励");
}

function renderTasks() {
  const columns = [
    { key: "todo", title: statusText("todo") },
    { key: "doing", title: statusText("doing") },
    { key: "done", title: statusText("done") }
  ];

  $("#taskSummaryPill").textContent = countLabel(state.tasks.length, "个任务", "task");
  $("#kanbanBoard").innerHTML = columns.map((column) => {
    const tasks = state.tasks.filter((task) => task.status === column.key).sort(sortTasks);
    return `
      <div class="kanban-column">
        <h2>${column.title}<span class="kanban-count">${tasks.length}</span></h2>
        <div class="stack-list">${tasks.map(taskCard).join("") || empty("暂无任务")}</div>
      </div>
    `;
  }).join("");
}

function taskCard(task) {
  const priority = priorityClass[task.priority] || "medium";
  const dueLabel = task.due ? (isEnglish() ? `Due ${task.due}` : `截止 ${task.due}`) : (isEnglish() ? "No due date" : "未设截止");
  const canPrev = task.status !== "todo";
  const canNext = task.status !== "done";
  return `
    <div class="stack-item">
      <div class="stack-item-head">
        <div>
          <h3>${escapeHtml(task.title)}</h3>
          <div class="item-meta">
            <span class="tag ${priority}">${escapeHtml(priorityLabel(task.priority))}</span>
            <span class="tag">${escapeHtml(statusText(task.status))}</span>
            <span class="tag">${escapeHtml(dueLabel)}</span>
            ${task.project ? `<span class="tag">${escapeHtml(task.project)}</span>` : ""}
          </div>
        </div>
      </div>
      <div class="tiny-actions">
        ${canPrev ? `<button data-task-action="prev" data-id="${task.id}">${isEnglish() ? "Previous" : "前一列"}</button>` : ""}
        ${canNext ? `<button data-task-action="next" data-id="${task.id}">${isEnglish() ? "Next" : "后一列"}</button>` : ""}
        ${task.status !== "done" ? `<button data-task-action="done" data-id="${task.id}">${t("完成")}</button>` : ""}
        <button data-task-action="delete" data-id="${task.id}">${isEnglish() ? "Delete" : "删除"}</button>
      </div>
    </div>
  `;
}

function renderOkr() {
  $("#okrList").innerHTML = state.okrs.map((okr) => `
    <div class="okr-item">
      <div class="okr-top">
        <div>
          <h3>${escapeHtml(okr.title)}</h3>
          <p>${escapeHtml(okr.keyResult)}</p>
        </div>
        <button class="icon-btn" data-okr-delete data-id="${okr.id}" aria-label="${isEnglish() ? "Delete objective" : "删除目标"}" title="${isEnglish() ? "Delete objective" : "删除目标"}"><i data-lucide="trash-2"></i></button>
      </div>
      <div class="progress-wrap">
        <input type="range" min="0" max="100" value="${okr.progress}" data-okr-progress data-id="${okr.id}" aria-label="${escapeHtml(okr.title)} ${isEnglish() ? "progress" : "进度"}">
        <label class="progress-number" aria-label="${escapeHtml(okr.title)} ${isEnglish() ? "progress percent" : "进度百分比"}">
          <input type="number" min="0" max="100" step="1" inputmode="numeric" value="${okr.progress}" data-okr-number data-id="${okr.id}">
          <span>%</span>
        </label>
      </div>
    </div>
  `).join("") || empty("暂无 OKR");

  $("#projectTable").innerHTML = `
    <div class="table-row header"><span>${isEnglish() ? "Project" : "项目"}</span><span>${isEnglish() ? "Role" : "角色"}</span><span>${isEnglish() ? "Status" : "状态"}</span><span>${isEnglish() ? "Next" : "下一步"}</span><span></span></div>
    ${state.projects.map((project) => `
      <div class="table-row">
        <strong>${escapeHtml(project.name)}</strong>
        <span>${escapeHtml(project.role)}</span>
        <span class="tag ${project.health === "绿" ? "low" : project.health === "黄" ? "medium" : ""}">${escapeHtml(t(project.health))}</span>
        <span>${escapeHtml(project.next)}<br><small>${escapeHtml(project.risk)}</small></span>
        <button class="icon-btn" data-project-delete data-id="${project.id}" aria-label="${isEnglish() ? "Delete project" : "删除项目"}" title="${isEnglish() ? "Delete project" : "删除项目"}"><i data-lucide="trash-2"></i></button>
      </div>
    `).join("")}
  `;
}

function renderMeetings() {
  renderMeetingContacts();
  $("#meetingList").innerHTML = state.meetings.map((meeting) => `
    <div class="stack-item">
      <div class="stack-item-head">
        <div>
          <h3>${escapeHtml(meeting.title)}</h3>
          <div class="item-meta">
            <span class="tag">${escapeHtml(t(meeting.type))}</span>
            <span class="tag">${formatDateTime(meeting.when)}</span>
          </div>
        </div>
        <button class="icon-btn" data-delete-id="${meeting.id}" aria-label="${isEnglish() ? "Delete meeting" : "删除会议"}" title="${isEnglish() ? "Delete meeting" : "删除会议"}"><i data-lucide="trash-2"></i></button>
      </div>
      <p>${escapeHtml(meeting.decision || (isEnglish() ? "No decision" : "暂无结论"))}</p>
      ${(meeting.contacts || []).length ? `<div class="item-meta">${meeting.contacts.map((contact) => `<span class="tag">${isEnglish() ? "Contact: " : "联系人："}${escapeHtml(contact)}</span>`).join("")}</div>` : ""}
      <div class="item-meta">${(meeting.actions || []).map((action) => `<span class="tag">${escapeHtml(action)}</span>`).join("")}</div>
    </div>
  `).join("") || empty("暂无会议记录");
}

function renderMeetingContacts(selected = getSelectedMeetingContacts()) {
  const contacts = state.meetingContacts || [];
  const selectedSet = new Set(selected);
  $("#meetingContactList").innerHTML = contacts.length ? contacts.map((contact) => `
    <label class="contact-check">
      <input type="checkbox" value="${escapeHtml(contact)}" data-meeting-contact ${selectedSet.has(contact) ? "checked" : ""}>
      <span>${escapeHtml(contact)}</span>
      <button type="button" data-contact-delete="${escapeHtml(contact)}" aria-label="${isEnglish() ? "Delete frequent contact" : "删除常用联系人"} ${escapeHtml(contact)}" title="${isEnglish() ? "Delete frequent contact" : "删除常用联系人"}"><i data-lucide="x"></i></button>
    </label>
  `).join("") : `<div class="empty compact">${isEnglish() ? "Add frequent contacts to select them quickly" : "添加常用联系人后可直接勾选"}</div>`;
}

function renderManager() {
  $("#managerList").innerHTML = state.managerNotes.map((note) => `
    <div class="stack-item">
      <div class="stack-item-head">
        <div>
          <h3>${escapeHtml(note.topic)}</h3>
          <div class="item-meta"><span class="tag">${formatDateTime(note.createdAt)}</span></div>
        </div>
        <button class="icon-btn" data-delete-id="${note.id}" aria-label="${isEnglish() ? "Delete resource note" : "删除同步"}" title="${isEnglish() ? "Delete resource note" : "删除同步"}"><i data-lucide="trash-2"></i></button>
      </div>
      <p><strong>${isEnglish() ? "Progress: " : "进展："}</strong>${escapeHtml(note.progress || (isEnglish() ? "None" : "暂无"))}</p>
      <p><strong>${isEnglish() ? "Risk: " : "风险："}</strong>${escapeHtml(note.risk || (isEnglish() ? "None" : "暂无"))}</p>
      <p><strong>${isEnglish() ? "Support: " : "支持："}</strong>${escapeHtml(note.ask || (isEnglish() ? "None" : "暂无"))}</p>
    </div>
  `).join("") || empty("暂无同步记录");
}

function renderHealth() {
  const today = state.healthLogs.find((item) => item.day === todayKey());
  if (today) {
    $("#energyRange").value = today.energy;
    $("#loadRange").value = today.load;
    $("#energyValue").textContent = today.energy;
    $("#loadValue").textContent = today.load;
    $("#healthNote").value = today.note || "";
  }

  $("#healthList").innerHTML = state.healthLogs
    .slice()
    .sort((a, b) => b.day.localeCompare(a.day))
    .map((log) => `
      <div class="stack-item">
        <div class="stack-item-head">
          <div>
            <h3>${escapeHtml(log.day)}</h3>
            <div class="item-meta">
              <span class="tag low">${isEnglish() ? "Energy" : "能量"} ${log.energy}/5</span>
              <span class="tag ${log.load >= 4 ? "high" : "medium"}">${isEnglish() ? "Stress" : "压力"} ${log.load}/5</span>
              <span class="tag">${log.boundaryDone ? (isEnglish() ? "Ended on time" : "已准点下线") : (isEnglish() ? "No end recorded" : "未记录下线")}</span>
            </div>
          </div>
          <button class="icon-btn" data-delete-id="${log.id}" aria-label="${isEnglish() ? "Delete wellbeing record" : "删除健康记录"}" title="${isEnglish() ? "Delete wellbeing record" : "删除健康记录"}"><i data-lucide="trash-2"></i></button>
        </div>
        <p>${escapeHtml(log.note || (isEnglish() ? "No note" : "暂无备注"))}</p>
      </div>
    `).join("") || empty("暂无健康记录");
}

function renderReview() {
  const today = state.reviews.find((item) => item.day === todayKey());
  if (today) {
    $("#reviewWins").value = today.wins;
    $("#reviewRisks").value = today.risks;
    $("#reviewTomorrow").value = today.tomorrow;
    setReviewMood(today.score, today.moodReason || "");
  } else {
    setReviewMood(Number($("#reviewScore").value || 4), $("#reviewMoodReason").value);
  }

  $("#reviewList").innerHTML = state.reviews
    .slice()
    .sort((a, b) => b.day.localeCompare(a.day))
    .map((review) => `
      <div class="stack-item">
        <div class="stack-item-head">
          <div>
            <h3>${escapeHtml(review.day)}</h3>
            <div class="item-meta"><span class="tag low">${escapeHtml(moodText(review.score))} · ${review.score}/5</span></div>
          </div>
          <button class="icon-btn" data-delete-id="${review.id}" aria-label="${isEnglish() ? "Delete review" : "删除复盘"}" title="${isEnglish() ? "Delete review" : "删除复盘"}"><i data-lucide="trash-2"></i></button>
        </div>
        <p><strong>${isEnglish() ? "Wins: " : "成果："}</strong>${escapeHtml(review.wins || (isEnglish() ? "None" : "暂无"))}</p>
        <p><strong>${isEnglish() ? "Risks: " : "风险："}</strong>${escapeHtml(review.risks || (isEnglish() ? "None" : "暂无"))}</p>
        <p><strong>${isEnglish() ? "Tomorrow: " : "明日："}</strong>${escapeHtml(review.tomorrow || (isEnglish() ? "None" : "暂无"))}</p>
        ${review.moodReason ? `<p><strong>${isEnglish() ? "Reason: " : "原因："}</strong>${escapeHtml(review.moodReason)}</p>` : ""}
      </div>
    `).join("") || empty("暂无复盘记录");
}

function moodText(score) {
  const zh = moodLabels[score] || "满意度";
  return t(zh);
}

function renderThemeSettings() {
  const currentTheme = validThemeIds.has(state.appearance?.theme) ? state.appearance.theme : DEFAULT_THEME;
  $("#currentThemeName").textContent = themeName(currentTheme);
  $("#themeChoiceList").innerHTML = themeOptions.map((theme) => `
    <button class="theme-card ${theme.id === currentTheme ? "is-selected" : ""}" type="button" data-theme-choice="${theme.id}" role="radio" aria-checked="${theme.id === currentTheme}">
      <span class="theme-preview theme-preview-${theme.id}">
        ${theme.colors.map((color) => `<span style="background:${color}"></span>`).join("")}
      </span>
      <span class="theme-copy">
        <strong>${themeName(theme.id)}</strong>
        <small>${themeNote(theme.id)}</small>
      </span>
      <i data-lucide="${theme.id.includes("cat") ? "cat" : theme.id === "dopamine" ? "sparkles" : "circle"}"></i>
    </button>
  `).join("");
}

function themeName(themeId) {
  const theme = themeOptions.find((item) => item.id === themeId);
  if (!theme) return isEnglish() ? "Minimal Black" : "简约黑色";
  return isEnglish() ? theme.nameEn : theme.name;
}

function themeNote(themeId) {
  const theme = themeOptions.find((item) => item.id === themeId);
  if (!theme) return "";
  return isEnglish() ? theme.noteEn : theme.note;
}

function renderLanguageSettings() {
  const language = currentLanguage();
  const current = languageOptions.find((item) => item.id === language) || languageOptions[0];
  $("#currentLanguageName").textContent = isEnglish() ? current.nameEn : current.name;
  $("#languageChoiceList").innerHTML = languageOptions.map((item) => `
    <button class="language-card ${item.id === language ? "is-selected" : ""}" type="button" data-language-choice="${item.id}" role="radio" aria-checked="${item.id === language}">
      <span>${item.id === "zh" ? "中" : "EN"}</span>
      <strong>${isEnglish() ? item.nameEn : item.name}</strong>
      <small>${isEnglish() ? item.noteEn : item.note}</small>
    </button>
  `).join("");
}

function renderSettings() {
  renderThemeSettings();
  renderLanguageSettings();
  $("#schemaPreview").textContent = JSON.stringify({
    miniProgramCollections: {
      owners: ["_id", "name", "domain", "role", "createdAt"],
      appearanceProfiles: ["_id", "ownerId", "theme", "language", "updatedAt"],
      rhythmLogs: ["_id", "ownerId", "type", "at", "note"],
      focusSessions: ["_id", "ownerId", "title", "minutes", "targetMinutes", "reward", "rewardEarned", "startedAt", "endedAt"],
      meetingContacts: ["_id", "ownerId", "name", "createdAt"],
      tasks: ["_id", "ownerId", "title", "status", "priority", "project", "due", "completedAt"],
      okrs: ["_id", "ownerId", "title", "keyResult", "progress"],
      projects: ["_id", "ownerId", "name", "role", "health", "risk", "next"],
      meetings: ["_id", "ownerId", "title", "type", "when", "contacts", "decision", "actions"],
      resourceNotes: ["_id", "ownerId", "topic", "progress", "risk", "ask", "createdAt"],
      healthLogs: ["_id", "ownerId", "day", "energy", "load", "boundaryDone", "note"],
      reviews: ["_id", "ownerId", "day", "wins", "risks", "tomorrow", "score", "moodReason"]
    },
    migrationNotes: isEnglish()
      ? [
        "localStorage -> wx.cloud.database",
        "single-page sections -> mini program pages",
        "render functions -> setData and component split",
        "export JSON -> owner data backup"
      ]
      : [
        "localStorage -> wx.cloud.database",
        "单页 section -> 小程序 pages",
        "render 函数 -> setData 与组件拆分",
        "导出 JSON -> 主理人数据备份"
      ]
  }, null, 2);
}

function renderCharts() {
  if (activeSection === "rhythm") {
    drawTrendChart($("#rhythmChart"), 7, { compact: true });
  }
  if (activeSection === "dashboard") {
    drawTrendChart($("#mainChart"), dashboardRange);
    drawTaskDonut($("#taskDonut"));
    drawHealthChart($("#healthChart"), dashboardRange);
  }
}

function drawTrendChart(canvas, range, options = {}) {
  const chart = prepareCanvas(canvas);
  if (!chart) return;
  const { ctx, width, height } = chart;
  const days = lastDays(range);
  const maxWork = Math.max(...days.map((day) => workMinutesForDay(day)), 60);
  const maxFocus = Math.max(...days.map((day) => focusMinutesForDay(day)), 30);
  const maxDone = Math.max(...days.map((day) => doneTasksForDay(day)), 1);
  const top = 24;
  const bottom = 34;
  const left = 36;
  const right = 16;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const group = plotW / days.length;
  const barW = Math.max(8, Math.min(18, group * 0.22));

  clearCanvas(ctx, width, height);
  drawGrid(ctx, left, top, plotW, plotH);

  days.forEach((day, index) => {
    const x = left + index * group + group / 2;
    const work = workMinutesForDay(day);
    const focus = focusMinutesForDay(day);
    const workH = (work / maxWork) * plotH;
    const focusH = (focus / maxFocus) * plotH;
    roundRect(ctx, x - barW - 2, top + plotH - workH, barW, workH, 4, "#08756f");
    roundRect(ctx, x + 2, top + plotH - focusH, barW, focusH, 4, "#d85d50");
    ctx.fillStyle = "#697386";
    ctx.font = "11px Arial";
    ctx.textAlign = "center";
    ctx.fillText(day.slice(5), x, height - 12);
  });

  const linePoints = days.map((day, index) => {
    const x = left + index * group + group / 2;
    const y = top + plotH - (doneTasksForDay(day) / maxDone) * plotH;
    return { x, y };
  });
  drawLine(ctx, linePoints, "#5d55b3");
  drawLegend(ctx, [
    ["工作", "#08756f"],
    ["专注", "#d85d50"],
    ["完成", "#5d55b3"]
  ], options.compact ? 26 : 38);
}

function drawTaskDonut(canvas) {
  const chart = prepareCanvas(canvas);
  if (!chart) return;
  const { ctx, width, height } = chart;
  const counts = ["todo", "doing", "done"].map((status) => state.tasks.filter((task) => task.status === status).length);
  const total = counts.reduce((sum, item) => sum + item, 0) || 1;
  const colors = ["#b7791f", "#08756f", "#2f7d4f"];
  const cx = width / 2;
  const cy = height / 2 - 4;
  const radius = Math.min(width, height) * 0.29;
  let start = -Math.PI / 2;
  clearCanvas(ctx, width, height);

  counts.forEach((count, index) => {
    const end = start + (count / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, start, end);
    ctx.arc(cx, cy, radius * 0.58, end, start, true);
    ctx.closePath();
    ctx.fillStyle = colors[index];
    ctx.fill();
    start = end;
  });

  ctx.fillStyle = "#202938";
  ctx.font = "800 24px Arial";
  ctx.textAlign = "center";
  ctx.fillText(String(state.tasks.length), cx, cy + 6);
  ctx.fillStyle = "#697386";
  ctx.font = "12px Arial";
  ctx.fillText(t("任务总数"), cx, cy + 26);
  drawLegend(ctx, [
    ["待办", colors[0]],
    ["进行中", colors[1]],
    ["已完成", colors[2]]
  ], 24);
}

function drawHealthChart(canvas, range) {
  const chart = prepareCanvas(canvas);
  if (!chart) return;
  const { ctx, width, height } = chart;
  const days = lastDays(range);
  const top = 24;
  const bottom = 34;
  const left = 36;
  const right = 16;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const group = plotW / Math.max(1, days.length - 1);
  const energyPoints = [];
  const loadPoints = [];

  clearCanvas(ctx, width, height);
  drawGrid(ctx, left, top, plotW, plotH);
  days.forEach((day, index) => {
    const log = state.healthLogs.find((item) => item.day === day);
    const energy = log ? log.energy : 0;
    const load = log ? log.load : 0;
    const x = left + index * group;
    energyPoints.push({ x, y: top + plotH - (energy / 5) * plotH });
    loadPoints.push({ x, y: top + plotH - (load / 5) * plotH });
    ctx.fillStyle = "#697386";
    ctx.font = "11px Arial";
    ctx.textAlign = "center";
    ctx.fillText(day.slice(5), x, height - 12);
  });
  drawLine(ctx, energyPoints, "#2f7d4f");
  drawLine(ctx, loadPoints, "#d85d50");
  drawLegend(ctx, [
    ["能量", "#2f7d4f"],
    ["压力", "#d85d50"]
  ], 24);
}

function prepareCanvas(canvas) {
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  const width = Math.floor(rect.width);
  const height = Number(canvas.getAttribute("height")) || 220;
  if (width < 40) return null;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx, width, height };
}

function clearCanvas(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
}

function drawGrid(ctx, left, top, width, height) {
  ctx.strokeStyle = "#e4e9f0";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = top + (height / 4) * i;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(left + width, y);
    ctx.stroke();
  }
}

function roundRect(ctx, x, y, width, height, radius, color) {
  const safeHeight = Math.max(2, height);
  const safeY = height <= 0 ? y - 2 : y;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + radius, safeY);
  ctx.lineTo(x + width - radius, safeY);
  ctx.quadraticCurveTo(x + width, safeY, x + width, safeY + radius);
  ctx.lineTo(x + width, safeY + safeHeight);
  ctx.lineTo(x, safeY + safeHeight);
  ctx.lineTo(x, safeY + radius);
  ctx.quadraticCurveTo(x, safeY, x + radius, safeY);
  ctx.closePath();
  ctx.fill();
}

function drawLine(ctx, points, color) {
  if (!points.length) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
  points.forEach((point) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawLegend(ctx, items, x) {
  items.forEach(([label, color], index) => {
    const displayLabel = translateExact(label);
    const y = 16 + index * 18;
    ctx.fillStyle = color;
    ctx.fillRect(x, y - 8, 10, 10);
    ctx.fillStyle = "#697386";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText(displayLabel, x + 16, y + 1);
  });
}

function tickClock() {
  const now = new Date();
  const locale = isEnglish() ? "en-US" : "zh-CN";
  $("#currentDate").textContent = now.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric", weekday: "long" });
  $("#currentTime").textContent = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function buildTimeline(day) {
  const logs = state.attendanceLogs
    .filter((item) => dateKey(new Date(item.at)) === day)
    .map((item) => ({
      at: item.at,
      title: item.type === "in" ? t("开工") : item.type === "out" ? t("收工") : t(item.note),
      note: item.type === "leave" ? t("休整 / 外出记录") : t("工作记录")
    }));

  const meetings = state.meetings
    .filter((item) => dateKey(new Date(item.when)) === day)
    .map((item) => ({ at: item.when, title: item.title, note: t(item.type) }));

  const focus = state.focusSessions
    .filter((item) => dateKey(new Date(item.startedAt)) === day)
    .map((item) => ({ at: item.startedAt, title: item.title, note: isEnglish() ? `Focus ${item.minutes} min` : `专注 ${item.minutes} 分钟` }));

  return [...logs, ...meetings, ...focus].sort((a, b) => new Date(a.at) - new Date(b.at));
}

function timelineItem(item) {
  return `
    <div class="timeline-item">
      <div class="timeline-time">${formatTime(item.at)}</div>
      <div>
        <div class="timeline-title">${escapeHtml(item.title)}</div>
        <div class="timeline-note">${escapeHtml(item.note)}</div>
      </div>
    </div>
  `;
}

function recentAttendance() {
  return state.attendanceLogs
    .slice()
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 12);
}

function workMinutesForDay(day) {
  const logs = state.attendanceLogs
    .filter((item) => dateKey(new Date(item.at)) === day && (item.type === "in" || item.type === "out"))
    .sort((a, b) => new Date(a.at) - new Date(b.at));
  let opened = null;
  let total = 0;
  logs.forEach((log) => {
    if (log.type === "in") opened = new Date(log.at);
    if (log.type === "out" && opened) {
      total += Math.max(0, new Date(log.at) - opened);
      opened = null;
    }
  });
  if (opened && day === todayKey()) total += Math.max(0, Date.now() - opened.getTime());
  return Math.round(total / 60000);
}

function openWorkSegmentCount() {
  const today = todayKey();
  const logs = state.attendanceLogs
    .filter((item) => dateKey(new Date(item.at)) === today && (item.type === "in" || item.type === "out"))
    .sort((a, b) => new Date(a.at) - new Date(b.at));
  let open = 0;
  logs.forEach((log) => {
    if (log.type === "in") open += 1;
    if (log.type === "out" && open > 0) open -= 1;
  });
  return open;
}

function focusMinutesForDay(day) {
  const done = state.focusSessions
    .filter((item) => dateKey(new Date(item.startedAt)) === day)
    .reduce((sum, item) => sum + Number(item.minutes || 0), 0);
  const running = state.focusTimer.running && dateKey(new Date(state.focusTimer.startedAt)) === day
    ? Math.round(currentFocusMs() / 60000)
    : 0;
  return done + running;
}

function doneTasksForDay(day) {
  return state.tasks.filter((task) => task.completedAt && dateKey(new Date(task.completedAt)) === day).length;
}

function currentFocusMs() {
  const timer = state.focusTimer;
  const base = Number(timer.elapsedMs || 0);
  if (!timer.running || !timer.startedAt) return base;
  return base + Math.max(0, Date.now() - new Date(timer.startedAt).getTime());
}

function lastDays(count) {
  const days = [];
  for (let i = count - 1; i >= 0; i -= 1) days.push(dateKey(addDays(new Date(), -i)));
  return days;
}

function sortTasks(a, b) {
  const order = { "高": 0, "中": 1, "低": 2 };
  if (a.status !== b.status) return Object.keys(statusMap).indexOf(a.status) - Object.keys(statusMap).indexOf(b.status);
  if (order[a.priority] !== order[b.priority]) return order[a.priority] - order[b.priority];
  return (a.due || "9999-99-99").localeCompare(b.due || "9999-99-99");
}

function saveAndRender(message) {
  saveState();
  renderAll();
  toast(message);
}

function renderIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function toast(message) {
  const toastEl = $("#toast");
  toastEl.textContent = translateExact(message);
  toastEl.classList.add("is-visible");
  window.clearTimeout(window.__workspaceToast);
  window.__workspaceToast = window.setTimeout(() => toastEl.classList.remove("is-visible"), 2200);
}

function empty(text) {
  return `<div class="empty">${escapeHtml(translateExact(text))}</div>`;
}

function uid() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addHours(date, hours) {
  const next = new Date(date);
  next.setHours(next.getHours() + hours);
  return next;
}

function iso(date) {
  return date.toISOString();
}

function dateKey(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function todayKey() {
  return dateKey(new Date());
}

function formatMinutes(minutes) {
  if (isEnglish()) {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
  }
  if (minutes < 60) return `${minutes} 分钟`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} 小时 ${rest} 分钟` : `${hours} 小时`;
}

function formatDuration(ms) {
  const total = Math.floor(ms / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return [hours, minutes, seconds].map((num) => String(num).padStart(2, "0")).join(":");
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString(isEnglish() ? "en-US" : "zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function formatDateTime(value) {
  const date = new Date(value);
  const locale = isEnglish() ? "en-US" : "zh-CN";
  return `${date.toLocaleDateString(locale, { month: "2-digit", day: "2-digit" })} ${date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
