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

const dayActivityPools = [
  { category: "睡眠", className: "sleep", activities: ["睡觉", "赖床恢复", "午间小睡"], durations: [1, 2, 3, 12, 13, 14, 15, 16] },
  { category: "准备", className: "prep", activities: ["晨间准备", "洗漱收尾", "整理房间"], durations: [1, 2] },
  { category: "通勤", className: "commute", activities: ["通勤", "外出路上", "步行转换"], durations: [1, 2, 3] },
  { category: "工作", className: "work", activities: ["深度工作", "项目推进", "邮件与消息", "文档整理"], durations: [1, 2, 3, 4, 5, 6] },
  { category: "会议", className: "meeting", activities: ["会议沟通", "客户沟通", "需求确认"], durations: [1, 2, 3] },
  { category: "吃饭", className: "meal", activities: ["早餐", "午餐", "晚餐", "咖啡休息"], durations: [1, 2] },
  { category: "恢复", className: "rest", activities: ["主动休息", "散步恢复", "发呆放空"], durations: [1, 2, 3] },
  { category: "生活", className: "life", activities: ["家务", "采购", "运动", "朋友家人"], durations: [1, 2, 3, 4] },
  { category: "成长", className: "learn", activities: ["学习充电", "阅读", "复盘计划"], durations: [1, 2, 3] },
  { category: "娱乐", className: "play", activities: ["娱乐放松", "看剧", "自由安排"], durations: [1, 2, 3, 4] }
];

const dayPlanCategoryOptions = [
  { category: "未安排", className: "free" },
  ...dayActivityPools.map(({ category, className }) => ({ category, className }))
];

const DAY_PLAN_SLOT_MINUTES = 10;
const LEGACY_DAY_PLAN_SLOT_MINUTES = 30;
const DAY_PLAN_SLOTS_PER_HOUR = 60 / DAY_PLAN_SLOT_MINUTES;
const DAY_PLAN_TOTAL_SLOTS = 24 * DAY_PLAN_SLOTS_PER_HOUR;
const DAY_PLAN_VISIBLE_START_HOUR = 8;
const DAY_PLAN_VISIBLE_END_HOUR = 24;
const DAY_PLAN_VISIBLE_START_SLOT = DAY_PLAN_VISIBLE_START_HOUR * DAY_PLAN_SLOTS_PER_HOUR;
const DAY_PLAN_VISIBLE_END_SLOT = DAY_PLAN_VISIBLE_END_HOUR * DAY_PLAN_SLOTS_PER_HOUR;
const DAY_PLAN_VISIBLE_SLOTS = DAY_PLAN_VISIBLE_END_SLOT - DAY_PLAN_VISIBLE_START_SLOT;
const DEFAULT_DAY_PLAN_START_SLOT = 9 * DAY_PLAN_SLOTS_PER_HOUR;
const DEFAULT_DAY_PLAN_END_SLOT = 10 * DAY_PLAN_SLOTS_PER_HOUR;
const DAY_PLAN_AXIS_HOURS = Array.from(
  { length: (DAY_PLAN_VISIBLE_END_HOUR - DAY_PLAN_VISIBLE_START_HOUR) / 2 + 1 },
  (_, index) => DAY_PLAN_VISIBLE_START_HOUR + index * 2
);

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
  "时间表": "Timetable",
  "会议协作": "Meetings",
  "每日复盘": "Review",
  "数据看板": "Analytics",
  "数据管理": "Data",
  "今日快照": "Snapshot",
  "专注": "Focus",
  "任务": "Tasks",
  "会议": "Meetings",
  "未记录": "Not recorded",
  "个人主理人版 · 首屏工作台": "Owner Mode · Workspace",
  "把今天的推进、任务和复盘放在同一屏": "Put today's progress, tasks, and reviews on one screen",
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
  "记会议": "Log Meeting",
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
  "任务看板中的所有未完成任务": "All unfinished tasks from the task board",
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
  "关闭未结束工作段": "Close Open Work",
  "清空今日休整": "Clear Rest",
  "专注计时": "Focus Timer",
  "与任务、工作段一起进入数据看板": "Flows into analytics with tasks and work sessions",
  "设置目标、奖励和专注历史": "Set targets, rewards, and focus history",
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
  "0 个任务": "0 tasks",
  "任务名称": "Task name",
  "今日任务": "Today's Tasks",
  "之前设置": "Previous Tasks",
  "加入今日": "Add Today",
  "高优先级": "High priority",
  "中优先级": "Medium priority",
  "低优先级": "Low priority",
  "关联项目": "Project",
  "24 小时时间表": "24-Hour Timetable",
  "最小刻度 10 分钟，可以手动编辑一天的安排。": "Minimum step is 10 minutes. Edit a full day manually.",
  "活动名称": "Activity name",
  "选择类别": "Choose category",
  "开始时间": "Start time",
  "结束时间": "End time",
  "保存时间段": "Save Time Block",
  "取消编辑": "Cancel Edit",
  "用户可以新增、编辑、删除任意 10 分钟倍数的时间段。重叠部分会自动分为上下行显示。": "Add, edit, or delete time blocks in 10-minute increments. Overlaps are shown on separate rows.",
  "点击时间块或明细里的编辑按钮即可修改。": "Click a block or the edit button in details to modify it.",
  "正计时": "Count Up",
  "未选择时间段": "No time block selected",
  "本次用时会写入对应时间段": "This session will be saved to the linked block",
  "输入活动后开始计时": "Enter an activity to start timing",
  "填写活动名称并选择类别，完成后会自动加入 24 小时时间表。": "Enter an activity and category. When finished, it will be added to the 24-hour timetable.",
  "待写入时间表": "Ready to add to timetable",
  "开始计时": "Start Timer",
  "暂停计时": "Pause Timer",
  "完成并写入": "Finish & Save",
  "重置计时": "Reset Timer",
  "计时": "Timer",
  "计时中": "Timing",
  "已选择": "Selected",
  "本次": "Session",
  "本次用时": "Session Time",
  "累计计时": "Tracked",
  "计时任务已加入时间表": "Timed activity added to timetable",
  "请先填写活动名称": "Enter an activity name first",
  "请先选择时间段或填写活动名称": "Select a time block or enter an activity name first",
  "请先完成或重置当前计时": "Finish or reset the current timer first",
  "时间明细": "Time Details",
  "开始、结束、活动和时长": "Start, end, activity, and duration",
  "历史时间表": "Timetable History",
  "按日期保留之前记录": "Previous records grouped by date",
  "暂无历史时间表": "No timetable history yet",
  "段": "blocks",
  "时间轴": "Timeline",
  "时间": "Time",
  "活动": "Activity",
  "类别": "Category",
  "时长": "Duration",
  "未安排": "Unplanned",
  "睡眠": "Sleep",
  "睡觉": "Sleep",
  "赖床恢复": "Slow wake-up",
  "午间小睡": "Nap",
  "准备": "Prep",
  "晨间准备": "Morning prep",
  "洗漱收尾": "Wind down",
  "整理房间": "Tidy room",
  "通勤": "Commute",
  "外出路上": "In transit",
  "步行转换": "Walking transfer",
  "深度工作": "Deep work",
  "项目推进": "Project work",
  "邮件与消息": "Email & messages",
  "文档整理": "Document work",
  "会议沟通": "Meetings",
  "客户沟通": "Client sync",
  "需求确认": "Requirement check",
  "吃饭": "Meals",
  "早餐": "Breakfast",
  "午餐": "Lunch",
  "晚餐": "Dinner",
  "咖啡休息": "Coffee break",
  "恢复": "Recovery",
  "散步恢复": "Recovery walk",
  "发呆放空": "Blank space",
  "生活": "Life",
  "家务": "Chores",
  "采购": "Errands",
  "运动": "Exercise",
  "朋友家人": "Friends & family",
  "成长": "Growth",
  "学习充电": "Learning",
  "阅读": "Reading",
  "复盘计划": "Review planning",
  "娱乐": "Leisure",
  "娱乐放松": "Relaxing",
  "看剧": "Watch shows",
  "自由安排": "Free time",
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
  "保存修改": "Save Changes",
  "复盘记录": "Review Log",
  "保留每日可回看的工作轨迹": "Keep a daily work trail you can revisit",
  "数据周期": "Data range",
  "7 天": "7 days",
  "14 天": "14 days",
  "30 天": "30 days",
  "工作趋势": "Work Trend",
  "工作时长、专注时长、完成任务": "Work time, focus time, and completed tasks",
  "工作时长、专注时长": "Work time and focus time",
  "任务分布": "Task Distribution",
  "待办、进行中、已完成": "To do, in progress, and done",
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
  "暂无任务": "No tasks",
  "暂无 OKR": "No OKRs",
  "暂无会议记录": "No meeting records",
  "暂无复盘记录": "No review records",
  "暂无行动记录": "No activity records",
  "今天还没有重点任务": "No key tasks today",
  "暂无未完成任务": "No unfinished tasks",
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
  "编辑": "Edit",
  "编辑复盘": "Edit review",
  "操作": "Actions",
  "删除专注记录": "Delete focus record",
  "删除行动记录": "Delete activity record",
  "工作记录": "Work record",
  "休整 / 外出记录": "Rest / out-of-office",
  "自动关闭": "Auto close",
  "自动收工": "Auto end",
  "请先填写会议主题": "Please enter a meeting topic",
  "会议已保存": "Meeting saved",
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
  "任务已更新": "Task updated",
  "任务已删除": "Task deleted",
  "任务状态已更新": "Task status updated",
  "已加入今日任务": "Added to today's tasks",
  "OKR 已新增": "OKR added",
  "OKR 已删除": "OKR deleted",
  "项目已新增": "Project added",
  "项目已删除": "Project deleted",
  "行动记录已删除": "Activity deleted",
  "专注记录已删除": "Focus record deleted",
  "会议已删除": "Meeting deleted",
  "复盘已删除": "Review deleted",
  "复盘已更新": "Review updated",
  "请填写活动名称": "Please enter an activity name",
  "结束时间必须晚于开始时间": "End time must be later than start time",
  "时间段已保存": "Time block saved",
  "时间段已删除": "Time block deleted",
  "已进入编辑模式": "Edit mode enabled",
  "已进入复盘编辑模式": "Review edit mode enabled",
  "正计时已开始": "Timer started",
  "计时已暂停": "Timer paused",
  "计时已重置": "Timer reset",
  "计时已写入时间表": "Timer saved to timetable",
  "请先选择时间段": "Select a time block first",
  "请先完成当前计时": "Finish the current timer first",
  "计时时间太短": "Timer was too short",
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
let dayPlanScrollLeft = null;
let dayPlanDrag = null;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

document.addEventListener("DOMContentLoaded", () => {
  bindNavigation();
  bindForms();
  bindActions();
  applyTheme();
  tickClock();
  setInterval(tickClock, 1000);
  timerTick = setInterval(() => {
    renderFocusTimer();
    renderDayPlanTimer();
  }, 500);
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
    activityHistory: [],
    dayPlan: createBlankDayPlan(today),
    dayPlanHistory: [],
    dayPlanTimer: createDefaultDayPlanTimer(),
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
    return prepareLoadedDayPlans(normalizeLegacyWording(mergeState(createDefaultState(), parsed)));
  } catch (error) {
    console.warn("Failed to load state", error);
    return createDefaultState();
  }
}

function mergeState(base, incoming) {
  const cleanIncoming = { ...(incoming || {}) };
  delete cleanIncoming[["cal", "endarAccount"].join("")];
  delete cleanIncoming.managerNotes;
  delete cleanIncoming.healthLogs;
  delete cleanIncoming[["sync", "Account"].join("")];
  return {
    ...base,
    ...cleanIncoming,
    appearance: mergeAppearance(base.appearance, cleanIncoming.appearance),
    focusTimer: { ...base.focusTimer, ...(cleanIncoming.focusTimer || {}) },
    activityHistory: normalizeActivityHistory(cleanIncoming.activityHistory || base.activityHistory || []),
    dayPlanHistory: normalizeDayPlanHistory(cleanIncoming.dayPlanHistory || base.dayPlanHistory || []),
    dayPlanTimer: { ...createDefaultDayPlanTimer(), ...(cleanIncoming.dayPlanTimer || {}) }
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
    id: item.id || uid(),
    closedInId: item.closedInId || item.closedBy || "",
    note: attendanceLabels[item.note] || item.note
  }));

  nextState.reviews = (nextState.reviews || []).map((item) => ({
    ...item,
    id: item.id || uid()
  }));

  return nextState;
}

function prepareLoadedDayPlans(nextState) {
  const today = todayKey();
  nextState.dayPlanHistory = normalizeDayPlanHistory(nextState.dayPlanHistory || []);
  const currentPlan = cloneDayPlan(nextState.dayPlan || createBlankDayPlan(today));

  if (currentPlan.day && currentPlan.day !== today) {
    archivePlanIntoState(nextState, currentPlan);
    const todayPlan = findHistoryPlan(nextState.dayPlanHistory, today);
    nextState.dayPlan = todayPlan ? cloneDayPlan(todayPlan) : createBlankDayPlan(today);
  } else {
    nextState.dayPlan = cloneDayPlan({ ...currentPlan, day: currentPlan.day || today });
  }

  archivePlanIntoState(nextState, nextState.dayPlan);
  nextState.activityHistory = collectActivityHistory(nextState);
  return nextState;
}

function normalizeActivityHistory(history) {
  const seen = new Set();
  return (history || [])
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 80);
}

function collectActivityHistory(targetState = state) {
  const names = [];
  [targetState.dayPlan, ...(targetState.dayPlanHistory || [])].forEach((plan) => {
    visibleSegmentsForPlan(plan).forEach((segment) => names.push(segment.activity));
  });
  return normalizeActivityHistory([...(targetState.activityHistory || []), ...names]);
}

function rememberActivityName(activity) {
  const clean = String(activity || "").trim();
  if (!clean) return;
  state.activityHistory = normalizeActivityHistory([clean, ...(state.activityHistory || [])]);
}

function cloneDayPlan(plan) {
  const today = todayKey();
  const source = plan || createBlankDayPlan(today);
  const sourceSlotMinutes = inferDayPlanSlotMinutes(source);
  return {
    day: source.day || today,
    mode: source.mode || "manual",
    updatedAt: source.updatedAt || iso(new Date()),
    slotMinutes: DAY_PLAN_SLOT_MINUTES,
    segments: normalizeDaySegments(source.segments || [], sourceSlotMinutes).map((segment) => ({ ...segment }))
  };
}

function visibleSegmentsForPlan(plan) {
  return normalizeDaySegments(plan?.segments || [], inferDayPlanSlotMinutes(plan)).filter((segment) => segment.className !== "free");
}

function inferDayPlanSlotMinutes(plan) {
  const explicit = Number(plan?.slotMinutes || 0);
  if (explicit > 0) return explicit;
  const maxEnd = Math.max(0, ...(plan?.segments || []).map((segment) => Number(segment.startSlot || 0) + Number(segment.slots || 0)));
  return maxEnd <= 48 ? LEGACY_DAY_PLAN_SLOT_MINUTES : DAY_PLAN_SLOT_MINUTES;
}

function convertSlotValue(value, fromSlotMinutes = DAY_PLAN_SLOT_MINUTES) {
  return Math.round((Number(value || 0) * fromSlotMinutes) / DAY_PLAN_SLOT_MINUTES);
}

function normalizeDayPlanHistory(history) {
  const byDay = new Map();
  (history || []).forEach((plan) => {
    const snapshot = cloneDayPlan(plan);
    if (!snapshot.day || visibleSegmentsForPlan(snapshot).length === 0) return;
    byDay.set(snapshot.day, snapshot);
  });
  return Array.from(byDay.values()).sort((a, b) => b.day.localeCompare(a.day));
}

function findHistoryPlan(history, day) {
  return (history || []).find((plan) => plan.day === day) || null;
}

function dayPlanForDay(day) {
  if (state.dayPlan?.day === day) return state.dayPlan;
  return findHistoryPlan(state.dayPlanHistory, day) || createBlankDayPlan(day);
}

function normalizeDayKey(value, fallback = todayKey()) {
  const text = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : fallback;
}

function archivePlanIntoState(targetState, plan) {
  if (!targetState || !plan?.day) return;
  const snapshot = cloneDayPlan(plan);
  const withoutSameDay = normalizeDayPlanHistory(targetState.dayPlanHistory || []).filter((item) => item.day !== snapshot.day);
  targetState.dayPlanHistory = visibleSegmentsForPlan(snapshot).length
    ? normalizeDayPlanHistory([...withoutSameDay, snapshot])
    : withoutSameDay;
}

function archiveCurrentDayPlan() {
  archivePlanIntoState(state, state.dayPlan);
}

function saveState() {
  archiveCurrentDayPlan();
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
    if (addTask(input.value, "中", "", todayKey())) input.value = "";
  });

  $("#taskForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const editId = $("#taskEditId").value;
    const saved = editId
      ? updateTask(editId, $("#taskTitle").value, $("#taskPriority").value, $("#taskProject").value, $("#taskDue").value)
      : addTask($("#taskTitle").value, $("#taskPriority").value, $("#taskProject").value, $("#taskDue").value);
    if (saved) resetTaskEditor();
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

  $("#reviewForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const editingId = $("#reviewEditId").value;
    const editingDay = $("#reviewEditDay").value;
    const day = todayKey();
    const now = iso(new Date());
    const payload = {
      wins: $("#reviewWins").value.trim(),
      risks: $("#reviewRisks").value.trim(),
      tomorrow: $("#reviewTomorrow").value.trim(),
      score: Number($("#reviewScore").value),
      moodReason: shouldCollectMoodReason(Number($("#reviewScore").value)) ? $("#reviewMoodReason").value.trim() : "",
      updatedAt: now
    };

    if (editingId) {
      const editing = state.reviews.find((item) => item.id === editingId);
      if (editing) {
        Object.assign(editing, {
          ...payload,
          day: editing.day || editingDay || day,
          createdAt: editing.createdAt || now
        });
      }
      clearReviewEditState();
      saveAndRender("复盘已更新");
      return;
    }

    const existing = state.reviews.find((item) => item.day === day);
    if (existing) Object.assign(existing, { ...payload, day, createdAt: existing.createdAt || now });
    else state.reviews.unshift({ id: uid(), day, createdAt: now, ...payload });
    saveAndRender("复盘已保存");
  });

  $("#dayPlanEditor").addEventListener("submit", saveDaySegment);
}

function bindActions() {
  $("#heroStartWork")?.addEventListener("click", checkIn);
  $("#btnCheckIn").addEventListener("click", checkIn);
  $("#btnCheckOut").addEventListener("click", checkOut);
  $("#btnLeave").addEventListener("click", addLeave);
  $("#btnCloseOpenLogs").addEventListener("click", closeOpenLogs);
  $("#btnClearTodayLeaves").addEventListener("click", clearTodayLeaves);

  $("#btnFocusStart")?.addEventListener("click", startFocus);
  $("#btnFocusPause")?.addEventListener("click", pauseFocus);
  $("#btnFocusFinish")?.addEventListener("click", finishFocus);
  $("#btnFocusReset")?.addEventListener("click", resetFocus);
  $$(".mood-btn").forEach((button) => {
    button.addEventListener("click", () => setReviewMood(Number(button.dataset.reviewScore)));
  });
  $("#btnCancelTaskEdit").addEventListener("click", resetTaskEditor);
  $("#btnCancelReviewEdit").addEventListener("click", resetReviewEditor);
  $("#btnAddMeetingContact").addEventListener("click", addMeetingContact);
  $("#meetingContactList").addEventListener("click", handleMeetingContactAction);

  $("#btnCancelDaySegment").addEventListener("click", resetDayPlanEditor);
  $("#btnDayTimerStart").addEventListener("click", resumeDayPlanTimer);
  $("#btnDayTimerPause").addEventListener("click", pauseDayPlanTimer);
  $("#btnDayTimerFinish").addEventListener("click", finishDayPlanTimer);
  $("#btnDayTimerReset").addEventListener("click", resetDayPlanTimer);
  $("#daySegmentTitle").addEventListener("input", renderDayPlanTimer);
  $("#daySegmentCategory").addEventListener("change", renderDayPlanTimer);
  $("#dayPlanBoard").addEventListener("click", handleDayPlanEditClick);
  $("#dayPlanBoard").addEventListener("pointerdown", startDayPlanGridDrag);
  document.addEventListener("pointermove", updateDayPlanGridDrag);
  document.addEventListener("pointerup", finishDayPlanGridDrag);
  document.addEventListener("pointercancel", cancelDayPlanGridDrag);
  $("#dayPlanDetails").addEventListener("click", handleDayPlanDetailAction);

  $("#btnExport").addEventListener("click", exportData);
  $("#importFile").addEventListener("change", importData);
  $("#btnReset").addEventListener("click", resetData);
  $("#themeChoiceList").addEventListener("click", handleThemeChoice);
  $("#themeChoiceList").addEventListener("keydown", handleThemeChoiceKey);
  $("#languageChoiceList").addEventListener("click", handleLanguageChoice);
  $("#languageChoiceList").addEventListener("keydown", handleLanguageChoiceKey);

  $("#kanbanBoard").addEventListener("click", handleTaskAction);
  $("#homeTaskList").addEventListener("click", handleTaskAction);
  $("#attendanceList").addEventListener("click", handleDeleteFromList("attendanceLogs", "行动记录已删除"));
  $("#focusHistoryList")?.addEventListener("click", handleDeleteFromList("focusSessions", "专注记录已删除"));
  $("#meetingList").addEventListener("click", handleDeleteFromList("meetings", "会议已删除"));
  $("#reviewList").addEventListener("click", handleReviewListAction);

  $$(".segmented button").forEach((button) => {
    button.addEventListener("click", () => {
      dashboardRange = Number(button.dataset.range);
      $$(".segmented button").forEach((item) => item.classList.toggle("is-active", item === button));
      renderCharts();
    });
  });

  window.addEventListener("resize", () => {
    window.clearTimeout(window.__workspaceResize);
    window.__workspaceResize = window.setTimeout(() => {
      renderCharts();
      setupDayPlanScroll();
    }, 120);
  });
}

function showSection(id) {
  activeSection = id;
  hideChartTooltip();
  $$(".view").forEach((section) => section.classList.toggle("is-visible", section.id === id));
  $$(".nav-btn").forEach((button) => button.classList.toggle("is-active", button.dataset.section === id));
  renderCharts();
  if (id === "okr") window.requestAnimationFrame(setupDayPlanScroll);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function checkIn() {
  state.attendanceLogs.push({ id: uid(), type: "in", at: iso(new Date()), note: "开工" });
  saveAndRender("已记录开工");
}

function checkOut() {
  const openStarts = unmatchedWorkStarts(todayKey());
  const openStart = openStarts[openStarts.length - 1];
  if (!openStart) return toast("今天没有未结束工作段");
  state.attendanceLogs.push({ id: uid(), type: "out", at: iso(new Date()), note: "收工", closedInId: openStart.id });
  saveAndRender("已记录收工");
}

function addLeave() {
  state.attendanceLogs.push({ id: uid(), type: "leave", at: iso(new Date()), note: $("#leaveType").value });
  saveAndRender("休整记录已添加");
}

function closeOpenLogs() {
  const openStarts = unmatchedWorkStarts(todayKey());
  if (openStarts.length === 0) return toast("今天没有未结束工作段");
  const now = iso(new Date());
  openStarts.forEach((openStart) => {
    state.attendanceLogs.push({ id: uid(), type: "out", at: now, note: "自动关闭", closedInId: openStart.id });
  });
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

function fillReviewForm(review) {
  $("#reviewWins").value = review?.wins || "";
  $("#reviewRisks").value = review?.risks || "";
  $("#reviewTomorrow").value = review?.tomorrow || "";
  setReviewMood(Number(review?.score || 4), review?.moodReason || "");
}

function clearReviewForm() {
  $("#reviewWins").value = "";
  $("#reviewRisks").value = "";
  $("#reviewTomorrow").value = "";
  $("#reviewMoodReason").value = "";
  setReviewMood(4, "");
}

function setReviewEditState(review = null) {
  $("#reviewEditId").value = review?.id || "";
  $("#reviewEditDay").value = review?.day || "";
  $("#btnCancelReviewEdit").hidden = !review;
  $("#reviewSubmitLabel").textContent = review ? t("保存修改") : t("保存复盘");
}

function clearReviewEditState() {
  setReviewEditState(null);
}

function resetReviewEditor() {
  clearReviewEditState();
  const today = state.reviews.find((item) => item.day === todayKey());
  if (today) fillReviewForm(today);
  else clearReviewForm();
  renderIcons();
}

function editReview(id) {
  const review = state.reviews.find((item) => item.id === id);
  if (!review) return;
  fillReviewForm(review);
  setReviewEditState(review);
  renderIcons();
  toast("已进入复盘编辑模式");
}

function handleReviewListAction(event) {
  const editButton = event.target.closest("[data-review-edit]");
  if (editButton) {
    editReview(editButton.dataset.reviewEdit);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-id]");
  if (!deleteButton) return;
  const deletedId = deleteButton.dataset.deleteId;
  state.reviews = state.reviews.filter((item) => item.id !== deletedId);
  if ($("#reviewEditId").value === deletedId) clearReviewEditState();
  saveAndRender("复盘已删除");
}

function addTask(title, priority = "中", project = "", due = "") {
  const cleanTitle = title.trim();
  if (!cleanTitle) {
    toast("请先填写任务名称");
    return false;
  }
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
  return true;
}

function updateTask(id, title, priority = "中", project = "", due = "") {
  const task = state.tasks.find((item) => item.id === id);
  const cleanTitle = title.trim();
  if (!task) {
    resetTaskEditor();
    return false;
  }
  if (!cleanTitle) {
    toast("请先填写任务名称");
    return false;
  }
  task.title = cleanTitle;
  task.priority = priority;
  task.project = project.trim();
  task.due = due || "";
  saveAndRender("任务已更新");
  return true;
}

function editTask(task) {
  showSection("tasks");
  $("#taskEditId").value = task.id;
  $("#taskTitle").value = task.title || "";
  $("#taskPriority").value = task.priority || "中";
  $("#taskProject").value = task.project || "";
  $("#taskDue").value = task.due || "";
  setTaskEditorMode(true);
  $("#taskForm").scrollIntoView({ behavior: "smooth", block: "nearest" });
  $("#taskTitle").focus();
  toast("已进入编辑模式");
}

function resetTaskEditor() {
  const form = $("#taskForm");
  if (!form) return;
  form.reset();
  $("#taskEditId").value = "";
  $("#taskPriority").value = "中";
  setTaskEditorMode(false);
}

function setTaskEditorMode(isEditing) {
  const button = $("#btnSaveTask");
  const cancelButton = $("#btnCancelTaskEdit");
  if (!button || !cancelButton) return;
  const label = isEditing ? t("保存修改") : t("新增任务");
  const icon = isEditing ? "save" : "plus";
  button.innerHTML = `<i data-lucide="${icon}"></i><span id="taskSubmitLabel">${escapeHtml(label)}</span>`;
  cancelButton.hidden = !isEditing;
  renderIcons();
}

function handleTaskAction(event) {
  const button = event.target.closest("[data-task-action]");
  if (!button) return;
  const task = state.tasks.find((item) => item.id === button.dataset.id);
  if (!task) return;
  const action = button.dataset.taskAction;

  if (action === "edit") {
    editTask(task);
    return;
  }
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
  if (action === "today") {
    task.due = todayKey();
  }
  if (action === "delete") {
    state.tasks = state.tasks.filter((item) => item.id !== task.id);
    if ($("#taskEditId")?.value === task.id) resetTaskEditor();
  }
  saveAndRender(action === "delete" ? "任务已删除" : action === "today" ? "已加入今日任务" : "任务状态已更新");
}

function saveDaySegment(event) {
  event.preventDefault();
  const id = $("#daySegmentId").value;
  const day = normalizeDayKey($("#daySegmentDay")?.value, state.dayPlan?.day || todayKey());
  const activity = $("#daySegmentTitle").value.trim();
  const startSlot = Number($("#daySegmentStart").value);
  const endSlot = Number($("#daySegmentEnd").value);
  const category = categoryByClassName($("#daySegmentCategory").value);
  const existingSegment = id ? dayPlanForDay(day).segments.find((segment) => segment.id === id) : null;
  if (!activity) return toast("请填写活动名称");
  if (!Number.isFinite(startSlot) || !Number.isFinite(endSlot) || endSlot <= startSlot) return toast("结束时间必须晚于开始时间");

  insertDaySegment({
    id: id || uid(),
    startSlot,
    slots: endSlot - startSlot,
    category: category.category,
    className: category.className,
    activity,
    trackedMs: Math.max(0, Number(existingSegment?.trackedMs || 0))
  }, id || null, day);
  rememberActivityName(activity);
  resetDayPlanEditor(false);
  saveAndRender("时间段已保存");
}

function handleDayPlanEditClick(event) {
  const block = event.target.closest("[data-day-segment-start]");
  if (!block) return;
  startDayPlanTimer(block.dataset.daySegmentStart);
}

function startDayPlanGridDrag(event) {
  const strip = event.target.closest("[data-day-plan-strip]");
  if (!strip || event.target.closest(".day-plan-block")) return;
  if (event.button !== undefined && event.button !== 0) return;
  event.preventDefault();
  const boundary = slotBoundaryFromPointer(strip, event.clientX);
  dayPlanDrag = {
    strip,
    day: normalizeDayKey(strip.dataset.dayPlanDay),
    pointerId: event.pointerId,
    startBoundary: boundary,
    currentBoundary: boundary
  };
  try {
    strip.setPointerCapture(event.pointerId);
  } catch {}
  renderDayPlanDragPreview();
}

function updateDayPlanGridDrag(event) {
  if (!dayPlanDrag) return;
  if (dayPlanDrag.pointerId !== undefined && event.pointerId !== dayPlanDrag.pointerId) return;
  event.preventDefault();
  dayPlanDrag.currentBoundary = slotBoundaryFromPointer(dayPlanDrag.strip, event.clientX);
  renderDayPlanDragPreview();
}

function finishDayPlanGridDrag(event) {
  if (!dayPlanDrag) return;
  if (dayPlanDrag.pointerId !== undefined && event.pointerId !== dayPlanDrag.pointerId) return;
  event.preventDefault();
  dayPlanDrag.currentBoundary = slotBoundaryFromPointer(dayPlanDrag.strip, event.clientX);
  const range = selectedDayPlanDragRange();
  const startSlot = DAY_PLAN_VISIBLE_START_SLOT + range.start;
  const endSlot = DAY_PLAN_VISIBLE_START_SLOT + range.end;
  $("#daySegmentId").value = "";
  $("#daySegmentDay").value = dayPlanDrag.day;
  renderDayPlanEditorOptions($("#daySegmentCategory")?.value || "work", startSlot, endSlot);
  $("#btnCancelDaySegment").hidden = false;
  clearDayPlanDragPreview();
  const selectedDay = dayPlanDrag.day;
  dayPlanDrag = null;
  $("#daySegmentTitle").focus();
  toast(`${weekDayLabel(selectedDay)} ${formatSlotClock(startSlot)}-${formatSlotClock(endSlot)}`);
}

function cancelDayPlanGridDrag() {
  clearDayPlanDragPreview();
  dayPlanDrag = null;
}

function slotBoundaryFromPointer(strip, clientX) {
  const rect = strip.getBoundingClientRect();
  const ratio = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
  return Math.max(0, Math.min(DAY_PLAN_VISIBLE_SLOTS, Math.round(ratio * DAY_PLAN_VISIBLE_SLOTS)));
}

function selectedDayPlanDragRange() {
  const start = Math.max(0, Math.min(DAY_PLAN_VISIBLE_SLOTS, Number(dayPlanDrag?.startBoundary || 0)));
  const current = Math.max(0, Math.min(DAY_PLAN_VISIBLE_SLOTS, Number(dayPlanDrag?.currentBoundary ?? start)));
  let rangeStart = Math.min(start, current);
  let rangeEnd = Math.max(start, current);
  if (rangeEnd <= rangeStart) {
    rangeEnd = Math.min(DAY_PLAN_VISIBLE_SLOTS, rangeStart + 1);
    rangeStart = Math.max(0, rangeEnd - 1);
  }
  return { start: rangeStart, end: rangeEnd, slots: rangeEnd - rangeStart };
}

function renderDayPlanDragPreview() {
  if (!dayPlanDrag?.strip) return;
  clearDayPlanDragPreview(dayPlanDrag.strip);
  const range = selectedDayPlanDragRange();
  const preview = document.createElement("div");
  preview.className = "day-plan-drag-preview";
  preview.style.gridColumn = `${range.start + 1} / span ${range.slots}`;
  preview.innerHTML = `<span>${escapeHtml(`${formatSlotClock(DAY_PLAN_VISIBLE_START_SLOT + range.start)}-${formatSlotClock(DAY_PLAN_VISIBLE_START_SLOT + range.end)}`)}</span>`;
  dayPlanDrag.strip.appendChild(preview);
}

function clearDayPlanDragPreview(strip = document) {
  $$(".day-plan-drag-preview", strip).forEach((preview) => preview.remove());
}

function handleDayPlanDetailAction(event) {
  const timerButton = event.target.closest("[data-day-segment-start]");
  if (timerButton) {
    startDayPlanTimer(timerButton.dataset.daySegmentStart);
    return;
  }
  const editButton = event.target.closest("[data-day-segment-edit]");
  if (editButton) {
    editDaySegment(editButton.dataset.daySegmentEdit);
    return;
  }
  const deleteButton = event.target.closest("[data-day-segment-delete]");
  if (!deleteButton) return;
  deleteDaySegment(deleteButton.dataset.daySegmentDelete);
}

function editDaySegment(id) {
  const segment = ensureDayPlan().segments.find((item) => item.id === id);
  if (!segment) return;
  renderDayPlanEditorOptions(segment.className, segment.startSlot, segment.startSlot + segment.slots);
  $("#daySegmentId").value = segment.id;
  $("#daySegmentDay").value = state.dayPlan?.day || todayKey();
  $("#daySegmentTitle").value = segment.activity;
  $("#btnCancelDaySegment").hidden = false;
  toast("已进入编辑模式");
}

function resetDayPlanEditor(shouldRenderIcons = true) {
  $("#daySegmentId").value = "";
  $("#daySegmentDay").value = state.dayPlan?.day || todayKey();
  $("#daySegmentTitle").value = "";
  renderDayPlanEditorOptions("work", DEFAULT_DAY_PLAN_START_SLOT, DEFAULT_DAY_PLAN_END_SLOT);
  $("#btnCancelDaySegment").hidden = true;
  if (shouldRenderIcons) renderIcons();
}

function deleteDaySegment(id) {
  const plan = ensureDayPlan();
  const timer = ensureDayPlanTimer();
  if (timer.segmentId === id) Object.assign(timer, createDefaultDayPlanTimer());
  plan.segments = normalizeDaySegments(plan.segments.filter((segment) => segment.id !== id));
  saveAndRender("时间段已删除");
}

function createDefaultDayPlanTimer() {
  return { segmentId: "", running: false, startedAt: null, firstStartedAt: null, elapsedMs: 0, activity: "", categoryClass: "work" };
}

function ensureDayPlanTimer() {
  if (!state.dayPlanTimer) state.dayPlanTimer = createDefaultDayPlanTimer();
  state.dayPlanTimer.elapsedMs = Math.max(0, Number(state.dayPlanTimer.elapsedMs || 0));
  state.dayPlanTimer.segmentId = state.dayPlanTimer.segmentId || "";
  state.dayPlanTimer.activity = state.dayPlanTimer.activity || "";
  state.dayPlanTimer.categoryClass = state.dayPlanTimer.categoryClass || "work";
  state.dayPlanTimer.firstStartedAt = state.dayPlanTimer.firstStartedAt || null;
  if (state.dayPlanTimer.running && !state.dayPlanTimer.firstStartedAt) state.dayPlanTimer.firstStartedAt = state.dayPlanTimer.startedAt || iso(new Date());
  return state.dayPlanTimer;
}

function currentDayPlanTimerMs(timer = ensureDayPlanTimer()) {
  const base = Number(timer.elapsedMs || 0);
  if (!timer.running || !timer.startedAt) return base;
  return base + Math.max(0, Date.now() - new Date(timer.startedAt).getTime());
}

function dayTimerSegment() {
  const timer = ensureDayPlanTimer();
  return ensureDayPlan().segments.find((segment) => segment.id === timer.segmentId) || null;
}

function dayTimerDraftFromEditor() {
  const activity = $("#daySegmentTitle")?.value.trim() || "";
  const category = categoryByClassName($("#daySegmentCategory")?.value || "work");
  return { activity, category: category.category, className: category.className };
}

function slotFromDate(dateValue = new Date()) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (Number.isNaN(date.getTime())) return slotFromDate(new Date());
  const minutes = date.getHours() * 60 + date.getMinutes();
  return Math.max(0, Math.min(DAY_PLAN_TOTAL_SLOTS - 1, Math.floor(minutes / DAY_PLAN_SLOT_MINUTES)));
}

function insertTimerSegmentFromElapsed(timer, elapsedMs) {
  const category = categoryByClassName(timer.categoryClass || "work");
  const slots = Math.max(1, Math.min(DAY_PLAN_TOTAL_SLOTS, Math.ceil(elapsedMs / (DAY_PLAN_SLOT_MINUTES * 60 * 1000))));
  let startSlot = slotFromDate(timer.firstStartedAt || timer.startedAt || new Date());
  if (startSlot + slots > DAY_PLAN_TOTAL_SLOTS) startSlot = Math.max(0, DAY_PLAN_TOTAL_SLOTS - slots);
  insertDaySegment({
    id: uid(),
    startSlot,
    slots,
    category: category.category,
    className: category.className,
    activity: timer.activity.trim(),
    trackedMs: elapsedMs
  }, null);
  rememberActivityName(timer.activity);
}

function startDayPlanTimer(segmentId) {
  const segment = ensureDayPlan().segments.find((item) => item.id === segmentId);
  if (!segment) return toast("请先选择时间段");
  const timer = ensureDayPlanTimer();
  const hasElapsedTimer = currentDayPlanTimerMs(timer) > 0;
  if ((timer.running || hasElapsedTimer) && timer.segmentId && timer.segmentId !== segment.id) return toast("请先完成或重置当前计时");
  if ((timer.running || hasElapsedTimer) && timer.activity && !timer.segmentId) return toast("请先完成或重置当前计时");
  if (timer.running && timer.segmentId === segment.id) {
    renderDayPlanTimer();
    return;
  }
  if (timer.segmentId !== segment.id) {
    timer.elapsedMs = 0;
    timer.activity = "";
    timer.categoryClass = segment.className;
    timer.firstStartedAt = iso(new Date());
  }
  timer.segmentId = segment.id;
  timer.running = true;
  timer.startedAt = iso(new Date());
  if (!timer.firstStartedAt) timer.firstStartedAt = timer.startedAt;
  saveState();
  renderTimeTable();
  renderIcons();
  toast("正计时已开始");
}

function resumeDayPlanTimer() {
  const timer = ensureDayPlanTimer();
  const segment = dayTimerSegment();
  if (!segment && !timer.activity) {
    const draft = dayTimerDraftFromEditor();
    if (!draft.activity) return toast("请先填写活动名称");
    timer.segmentId = "";
    timer.activity = draft.activity;
    timer.categoryClass = draft.className;
    timer.firstStartedAt = iso(new Date());
    timer.elapsedMs = 0;
  }
  if (!segment && !timer.activity.trim()) return toast("请先填写活动名称");
  if (timer.running) return;
  timer.running = true;
  timer.startedAt = iso(new Date());
  if (!timer.firstStartedAt) timer.firstStartedAt = timer.startedAt;
  saveState();
  renderTimeTable();
  renderIcons();
  toast("正计时已开始");
}

function pauseDayPlanTimer() {
  const timer = ensureDayPlanTimer();
  if (!timer.segmentId && !timer.activity) return toast("请先选择时间段或填写活动名称");
  timer.elapsedMs = currentDayPlanTimerMs(timer);
  timer.running = false;
  timer.startedAt = null;
  saveState();
  renderTimeTable();
  renderIcons();
  toast("计时已暂停");
}

function finishDayPlanTimer() {
  const timer = ensureDayPlanTimer();
  const segment = dayTimerSegment();
  const elapsedMs = currentDayPlanTimerMs(timer);
  if (!segment && !timer.activity.trim()) return toast("请先选择时间段或填写活动名称");
  if (elapsedMs < 1000) return toast("计时时间太短");
  if (segment) {
    segment.trackedMs = Math.max(0, Number(segment.trackedMs || 0)) + elapsedMs;
    ensureDayPlan().updatedAt = iso(new Date());
    rememberActivityName(segment.activity);
    Object.assign(timer, createDefaultDayPlanTimer());
    saveAndRender("计时已写入时间表");
    return;
  }
  insertTimerSegmentFromElapsed(timer, elapsedMs);
  Object.assign(timer, createDefaultDayPlanTimer());
  resetDayPlanEditor(false);
  saveAndRender("计时任务已加入时间表");
}

function resetDayPlanTimer() {
  Object.assign(ensureDayPlanTimer(), createDefaultDayPlanTimer());
  saveState();
  renderTimeTable();
  renderIcons();
  toast("计时已重置");
}

function insertDaySegment(newSegment, replaceId = null, targetDay = state.dayPlan?.day || todayKey()) {
  const day = normalizeDayKey(targetDay, state.dayPlan?.day || todayKey());
  const isActivePlan = state.dayPlan?.day === day;
  const plan = isActivePlan ? ensureDayPlan() : cloneDayPlan(findHistoryPlan(state.dayPlanHistory, day) || createBlankDayPlan(day));
  const kept = (plan.segments || [])
    .filter((segment) => !(replaceId && segment.id === replaceId))
    .map((segment) => ({ ...segment }));
  kept.push(newSegment);
  plan.day = day;
  plan.mode = "manual";
  plan.updatedAt = iso(new Date());
  plan.segments = normalizeDaySegments(kept);
  if (isActivePlan && state.dayPlanTimer?.segmentId && !plan.segments.some((segment) => segment.id === state.dayPlanTimer.segmentId)) {
    Object.assign(state.dayPlanTimer, createDefaultDayPlanTimer());
  }
  if (!isActivePlan) archivePlanIntoState(state, plan);
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
      state = prepareLoadedDayPlans(mergeState(createDefaultState(), imported));
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
  renderTimeTable();
  renderMeetings();
  renderReview();
  renderSettings();
  renderFocusTimer();
  renderCharts();
  applyLanguage();
  renderIcons();
}

function renderHome() {
  const today = todayKey();
  const unfinishedTasks = state.tasks.filter((task) => task.status !== "done");
  const doneToday = state.tasks.filter((task) => task.completedAt && dateKey(new Date(task.completedAt)) === today).length;
  const workMinutes = workMinutesForDay(today);
  const focus = timetableMinutesForDay(today);
  const meetings = state.meetings.filter((item) => dateKey(new Date(item.when)) === today).length;
  const openCount = openWorkSegmentCount();
  const totalTasks = state.tasks.length;
  const openTasks = state.tasks.filter((task) => task.status !== "done").length;

  $("#todayWorkMinutes").textContent = formatMinutes(workMinutes);
  $("#todayFocusMinutes").textContent = formatMinutes(focus);
  $("#todayDoneTasks").textContent = doneToday;
  $("#todayMeetingCount").textContent = meetings;
  $("#sideWork").textContent = formatMinutes(workMinutes);
  $("#sideFocus").textContent = formatMinutes(focus);
  $("#sideTasks").textContent = `${totalTasks - openTasks}/${totalTasks}`;
  $("#sideMeetings").textContent = meetings;
  $("#workStateLabel").textContent = openCount > 0 ? (isEnglish() ? "Work session active" : "工作段进行中") : workMinutes > 0 ? (isEnglish() ? "Work recorded today" : "今日已有工作记录") : t("尚未开始工作");
  $("#openLogBadge").textContent = openCount > 0 ? `${t("进行中")} ${openCount}` : t("待开工");
  $("#openLogBadge").className = `status-pill ${openCount > 0 ? "good" : "neutral"}`;

  $("#homeTaskList").innerHTML = unfinishedTasks.length ? unfinishedTasks
    .slice()
    .sort(sortTasks)
    .map(taskCard)
    .join("") : empty("暂无未完成任务");

  const todayTimeline = $("#todayTimeline");
  if (todayTimeline) {
    todayTimeline.innerHTML = buildTimeline(today).slice(0, 8).map(timelineItem).join("") || empty("今天还没有时间块");
  }
}

function renderRhythm() {
  const groups = groupedAttendanceByDay();
  const focusHistoryList = $("#focusHistoryList");
  if (focusHistoryList) {
    const focusGroups = groupedFocusByDay();
    focusHistoryList.innerHTML = focusGroups.map((group) => `
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
  }

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
          const pairClass = item.workPair ? ` work-pair-${item.workPair}` : "";
          const pairLabel = item.workPair ? `${isEnglish() ? "Work session" : "工作段"} ${item.workPair}` : "";
          return `
            <div class="stack-item attendance-item${pairClass}" ${pairLabel ? `title="${escapeHtml(pairLabel)}"` : ""}>
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
  return Array.from(groups.entries()).map(([day, items]) => ({ day, items: decorateAttendancePairs(day, items) }));
}

function decorateAttendancePairs(day, items) {
  const pairMap = workPairMapForDay(day);
  return items.map((item) => ({
    ...item,
    workPair: pairMap.get(attendancePairKey(item)) || 0
  }));
}

function attendancePairKey(item) {
  return item.id || `${item.type || ""}|${item.at || ""}|${item.note || ""}`;
}

function workPairMapForDay(day) {
  const pairMap = new Map();
  const opened = [];
  let pairIndex = 0;

  pairedWorkLogsForDay(day).forEach((log) => {
    if (log.type === "in") {
      opened.push(log);
      return;
    }
    const closeIndex = findOpenStartIndex(opened, log);
    if (closeIndex < 0) return;
    const start = opened.splice(closeIndex, 1)[0];
    pairIndex += 1;
    const visualPair = ((pairIndex - 1) % 6) + 1;
    pairMap.set(attendancePairKey(start), visualPair);
    pairMap.set(attendancePairKey(log), visualPair);
  });

  return pairMap;
}

function formatDayTitle(day) {
  const date = new Date(`${day}T12:00:00`);
  const weekday = date.toLocaleDateString(isEnglish() ? "en-US" : "zh-CN", { weekday: "long" });
  return `${day} ${weekday}`;
}

function renderFocusTimer() {
  if (!$("#focusTimer")) return;
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
  const today = todayKey();
  const columns = [
    { key: "todo", title: statusText("todo") },
    { key: "doing", title: statusText("doing") },
    { key: "done", title: statusText("done") }
  ];

  $("#taskSummaryPill").textContent = countLabel(state.tasks.length, "个任务", "task");
  $("#kanbanBoard").innerHTML = columns.map((column) => {
    const tasks = state.tasks.filter((task) => task.status === column.key).sort(sortTasks);
    const todayTasks = tasks.filter((task) => isDailyTask(task, today));
    const previousTasks = tasks.filter((task) => !isDailyTask(task, today));
    return `
      <div class="kanban-column">
        <h2>${column.title}<span class="kanban-count">${tasks.length}</span></h2>
        ${taskLane("今日任务", todayTasks, false)}
        ${taskLane("之前设置", previousTasks, true)}
      </div>
    `;
  }).join("");
}

function taskLane(title, tasks, showTodayAction) {
  return `
    <div class="task-lane ${showTodayAction ? "is-previous" : "is-daily"}">
      <div class="task-lane-head">
        <span>${escapeHtml(t(title))}</span>
        <strong>${tasks.length}</strong>
      </div>
      <div class="stack-list">${tasks.map((task) => taskCard(task, { showTodayAction })).join("") || empty("暂无任务")}</div>
    </div>
  `;
}

function isDailyTask(task, today = todayKey()) {
  if (task.completedAt && dateKey(new Date(task.completedAt)) === today) return true;
  if (task.due === today) return true;
  if (task.due) return false;
  return task.createdAt ? dateKey(new Date(task.createdAt)) === today : true;
}

function taskCard(task, options = {}) {
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
        ${options.showTodayAction && task.status !== "done" ? `<button data-task-action="today" data-id="${task.id}">${escapeHtml(t("加入今日"))}</button>` : ""}
        ${canPrev ? `<button data-task-action="prev" data-id="${task.id}">${isEnglish() ? "Previous" : "前一列"}</button>` : ""}
        ${canNext ? `<button data-task-action="next" data-id="${task.id}">${isEnglish() ? "Next" : "后一列"}</button>` : ""}
        ${task.status !== "done" ? `<button data-task-action="done" data-id="${task.id}">${t("完成")}</button>` : ""}
        <button data-task-action="edit" data-id="${task.id}">${isEnglish() ? "Edit" : "编辑"}</button>
        <button data-task-action="delete" data-id="${task.id}">${isEnglish() ? "Delete" : "删除"}</button>
      </div>
    </div>
  `;
}

function renderTimeTable() {
  const plan = ensureDayPlan();
  renderDayPlanEditorOptions();
  renderActivityNameHistory();
  if ($("#daySegmentDay") && !$("#daySegmentDay").value) $("#daySegmentDay").value = plan.day || todayKey();
  const segments = plan.segments || [];
  const visibleSegments = segments.filter((segment) => segment.className !== "free");
  const timer = ensureDayPlanTimer();
  const weekPlans = currentWeekDayKeys().map((day) => ({
    day,
    plan: dayPlanForDay(day)
  }));
  const weekVisibleSegments = weekPlans.flatMap((item) => visibleSegmentsForPlan(item.plan));
  const categories = uniqueCategories(weekVisibleSegments.length ? weekVisibleSegments : visibleSegments);
  const weekStart = weekPlans[0]?.day || todayKey();
  const weekEnd = weekPlans[weekPlans.length - 1]?.day || todayKey();

  $("#dayPlanLegend").innerHTML = categories.map((category) => `
    <span class="day-plan-legend-item">
      <i class="plan-dot plan-${category.className}"></i>${escapeHtml(t(category.name))}
    </span>
  `).join("");

  $("#dayPlanBoard").innerHTML = `
    <div class="day-plan-board-head">
      <span>${escapeHtml(t("时间轴"))}</span>
      <strong>${escapeHtml(`${weekStart} - ${weekEnd}`)}</strong>
    </div>
    <div class="day-plan-stack">
      ${weekPlans.map(({ day, plan: weekPlan }) => dayPlanWeekRow(day, visibleSegmentsForPlan(weekPlan), timer, day === plan.day)).join("")}
    </div>
  `;

  $("#dayPlanDetails").innerHTML = `
    <div class="time-detail-row header">
      <span>${escapeHtml(t("时间"))}</span>
      <span>${escapeHtml(t("活动"))}</span>
      <span>${escapeHtml(t("类别"))}</span>
      <span>${escapeHtml(t("时长"))}</span>
      <span>${escapeHtml(t("操作"))}</span>
    </div>
    ${visibleSegments.map((segment) => `
      <div class="time-detail-row">
        <time>${escapeHtml(segmentTimeRange(segment))}</time>
        <strong>${escapeHtml(t(segment.activity))}</strong>
        <span><i class="plan-dot plan-${segment.className}"></i>${escapeHtml(t(segment.category))}</span>
        <span class="duration-stack">
          <span>${escapeHtml(formatSlotDuration(segment.slots))}</span>
          ${Number(segment.trackedMs || 0) > 0 ? `<small>${escapeHtml(`${t("累计计时")} ${formatDuration(segment.trackedMs)}`)}</small>` : ""}
        </span>
        <span class="tiny-actions">
          <button type="button" data-day-segment-start="${segment.id}">${escapeHtml(t("计时"))}</button>
          <button type="button" data-day-segment-edit="${segment.id}">${escapeHtml(t("编辑"))}</button>
          <button type="button" data-day-segment-delete="${segment.id}">${escapeHtml(t("删除"))}</button>
        </span>
      </div>
    `).join("")}
  `;
  renderDayPlanHistory();
  renderDayPlanTimer();
  setupDayPlanScroll();
}

function dayPlanWeekRow(day, visibleSegments, timer, isCurrentDay = false) {
  const rowSegments = visibleSegments.reduce((items, segment) => {
    const startSlot = Number(segment.startSlot || 0);
    const endSlot = startSlot + Number(segment.slots || 0);
    const clippedStart = Math.max(startSlot, DAY_PLAN_VISIBLE_START_SLOT);
    const clippedEnd = Math.min(endSlot, DAY_PLAN_VISIBLE_END_SLOT);
    if (clippedEnd <= clippedStart) return items;
    items.push({
      ...segment,
      gridStartSlot: clippedStart - DAY_PLAN_VISIBLE_START_SLOT,
      gridSlots: clippedEnd - clippedStart
    });
    return items;
  }, []);
  const layout = layoutDayPlanSegments(rowSegments);
  return `
    <section class="day-plan-row ${day === todayKey() ? "is-today" : ""}">
      <div class="day-plan-row-head">
        <strong>${escapeHtml(weekDayLabel(day))}</strong>
        ${day === todayKey() ? `<span>${escapeHtml(isEnglish() ? "Today" : "今天")}</span>` : ""}
      </div>
      <div class="day-plan-axis">
        ${DAY_PLAN_AXIS_HOURS.map((absoluteHour) => {
          return `
            <span style="grid-column:${(absoluteHour - DAY_PLAN_VISIBLE_START_HOUR) * DAY_PLAN_SLOTS_PER_HOUR + 1}">
              ${absoluteHour === 24 ? "24:00" : `${String(absoluteHour).padStart(2, "0")}:00`}
            </span>
          `;
        }).join("")}
      </div>
      <div class="day-plan-strip" data-day-plan-strip data-day-plan-day="${escapeHtml(day)}" role="img" aria-label="${escapeHtml(`${t("24 小时时间表")} ${day} ${formatSlotClock(DAY_PLAN_VISIBLE_START_SLOT)}-${formatSlotClock(DAY_PLAN_VISIBLE_END_SLOT)}`)}" style="--day-plan-lanes:${Math.max(1, layout.lanes)}">
        ${layout.segments.map((segment) => `
          <${isCurrentDay ? "button" : "div"}
            ${isCurrentDay ? 'type="button"' : ""}
            class="day-plan-block plan-${segment.className} ${timer.segmentId === segment.id ? "is-timing" : ""} ${Number(segment.trackedMs || 0) > 0 ? "has-timed" : ""}"
            ${isCurrentDay ? `data-day-segment-start="${segment.id}"` : ""}
            style="grid-column:${segment.gridStartSlot + 1} / span ${segment.gridSlots}; grid-row:${segment.lane + 1}"
            title="${escapeHtml(segmentTitle(segment))}"
          >
            <strong>${escapeHtml(t(segment.activity))}</strong>
            <span>${escapeHtml(segmentTimeRange(segment))}</span>
            ${timer.segmentId === segment.id ? `<em data-day-timer-live>${escapeHtml(`${timer.running ? t("计时中") : t("本次")} ${formatDuration(currentDayPlanTimerMs(timer))}`)}</em>` : ""}
            ${timer.segmentId !== segment.id && Number(segment.trackedMs || 0) > 0 ? `<em>${escapeHtml(`${t("累计计时")} ${formatDuration(segment.trackedMs)}`)}</em>` : ""}
          </${isCurrentDay ? "button" : "div"}>
        `).join("")}
      </div>
    </section>
  `;
}

function renderActivityNameHistory() {
  const list = $("#daySegmentTitleHistory");
  if (!list) return;
  state.activityHistory = collectActivityHistory(state);
  list.innerHTML = state.activityHistory.map((name) => `<option value="${escapeHtml(name)}"></option>`).join("");
}

function renderDayPlanHistory() {
  const root = $("#dayPlanHistory");
  if (!root) return;
  const currentDay = state.dayPlan?.day || todayKey();
  const plans = normalizeDayPlanHistory(state.dayPlanHistory || [])
    .filter((plan) => plan.day !== currentDay)
    .slice(0, 12);

  root.innerHTML = plans.length ? plans.map((plan) => {
    const segments = visibleSegmentsForPlan(plan);
    const totalSlots = segments.reduce((sum, segment) => sum + Number(segment.slots || 0), 0);
    return `
      <section class="day-history-card">
        <div class="day-history-head">
          <strong>${escapeHtml(plan.day)}</strong>
          <span>${escapeHtml(`${segments.length} ${t("段")} · ${formatSlotDuration(totalSlots)}`)}</span>
        </div>
        <div class="day-history-list">
          ${segments.map((segment) => `
            <div class="day-history-row">
              <time>${escapeHtml(segmentTimeRange(segment))}</time>
              <strong>${escapeHtml(t(segment.activity))}</strong>
              <span><i class="plan-dot plan-${segment.className}"></i>${escapeHtml(t(segment.category))}</span>
              <span>${escapeHtml(formatSlotDuration(segment.slots))}</span>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }).join("") : empty("暂无历史时间表");
}

function setupDayPlanScroll() {
  // The 24-hour board is split into three fixed 8-hour rows, so no horizontal scroll setup is needed.
}

function renderDayPlanTimer() {
  const face = $("#dayTimerFace");
  if (!face) return;
  const timer = ensureDayPlanTimer();
  const segment = dayTimerSegment();
  const elapsedMs = currentDayPlanTimerMs(timer);
  const editorDraft = dayTimerDraftFromEditor();
  const draftActivity = timer.activity || editorDraft.activity;
  const draftClassName = timer.activity ? timer.categoryClass : editorDraft.className;
  const draftCategory = categoryByClassName(draftClassName);
  const hasTimerTask = Boolean(segment || draftActivity);
  const hasTimerState = Boolean(segment || timer.activity || elapsedMs > 0);
  face.textContent = formatDuration(elapsedMs);
  $("#dayTimerTitle").textContent = segment
    ? `${t(segment.activity)} · ${segmentTimeRange(segment)}`
    : draftActivity
      ? `${t(draftActivity)} · ${t("待写入时间表")}`
      : t("输入活动后开始计时");
  $("#dayTimerMeta").textContent = segment
    ? `${timer.running ? t("计时中") : elapsedMs > 0 ? t("已暂停") : t("已选择")} · ${t("本次用时")} ${formatDuration(elapsedMs)} · ${t("累计计时")} ${formatDuration(Number(segment.trackedMs || 0))}`
    : draftActivity
      ? `${draftCategory.category ? t(draftCategory.category) : ""} · ${timer.running ? t("计时中") : elapsedMs > 0 ? t("已暂停") : t("已选择")} · ${t("本次用时")} ${formatDuration(elapsedMs)}`
      : t("填写活动名称并选择类别，完成后会自动加入 24 小时时间表。");
  $("#btnDayTimerStart").disabled = !hasTimerTask || timer.running;
  $("#btnDayTimerPause").disabled = !hasTimerTask || !timer.running;
  $("#btnDayTimerFinish").disabled = !hasTimerTask || elapsedMs < 1000;
  $("#btnDayTimerReset").disabled = !hasTimerState;
  $$("[data-day-timer-live]").forEach((node) => {
    node.textContent = `${timer.running ? t("计时中") : t("本次")} ${formatDuration(elapsedMs)}`;
  });
}

function renderDayPlanEditorOptions(categoryClass = $("#daySegmentCategory")?.value || "work", startSlot = Number($("#daySegmentStart")?.value || DEFAULT_DAY_PLAN_START_SLOT), endSlot = Number($("#daySegmentEnd")?.value || DEFAULT_DAY_PLAN_END_SLOT)) {
  const categorySelect = $("#daySegmentCategory");
  const startSelect = $("#daySegmentStart");
  const endSelect = $("#daySegmentEnd");
  if (!categorySelect || !startSelect || !endSelect) return;

  categorySelect.innerHTML = dayPlanCategoryOptions.map((item) => `
    <option value="${escapeHtml(item.className)}">${escapeHtml(t(item.category))}</option>
  `).join("");
  categorySelect.value = dayPlanCategoryOptions.some((item) => item.className === categoryClass) ? categoryClass : "work";

  const slotOptions = Array.from({ length: DAY_PLAN_TOTAL_SLOTS + 1 }, (_, slot) => `
    <option value="${slot}">${formatSlotClock(slot)}</option>
  `).join("");
  startSelect.innerHTML = slotOptions;
  endSelect.innerHTML = slotOptions;
  startSelect.value = String(Math.max(0, Math.min(DAY_PLAN_TOTAL_SLOTS - 1, Number.isFinite(startSlot) ? startSlot : DEFAULT_DAY_PLAN_START_SLOT)));
  endSelect.value = String(Math.max(1, Math.min(DAY_PLAN_TOTAL_SLOTS, Number.isFinite(endSlot) ? endSlot : DEFAULT_DAY_PLAN_END_SLOT)));
}

function ensureDayPlan() {
  const hasExternalSource = (state.dayPlan?.segments || []).some((segment) => segment.source);
  const isLegacyGeneratedPlan = state.dayPlan && !state.dayPlan.mode && !hasExternalSource;
  if (!state.dayPlan || !Array.isArray(state.dayPlan.segments) || state.dayPlan.segments.length === 0 || isLegacyGeneratedPlan) {
    state.dayPlan = createBlankDayPlan(todayKey());
    saveState();
  }
  if (state.dayPlan.slotMinutes !== DAY_PLAN_SLOT_MINUTES) {
    state.dayPlan = cloneDayPlan(state.dayPlan);
  }
  state.dayPlan.segments = normalizeDaySegments(state.dayPlan.segments);
  state.dayPlan.slotMinutes = DAY_PLAN_SLOT_MINUTES;
  return state.dayPlan;
}

function createBlankDayPlan(day = todayKey()) {
  return {
    day,
    mode: "manual",
    slotMinutes: DAY_PLAN_SLOT_MINUTES,
    updatedAt: iso(new Date()),
    segments: [makeFreeSegment(0, DAY_PLAN_TOTAL_SLOTS)]
  };
}

function normalizeDaySegments(segments, sourceSlotMinutes = DAY_PLAN_SLOT_MINUTES) {
  const clean = (segments || [])
    .map((segment) => {
      const startSlot = Math.max(0, Math.min(DAY_PLAN_TOTAL_SLOTS, convertSlotValue(segment.startSlot, sourceSlotMinutes)));
      const slots = Math.max(0, Math.min(DAY_PLAN_TOTAL_SLOTS - startSlot, convertSlotValue(segment.slots, sourceSlotMinutes)));
      const category = categoryByClassName(segment.className || "free");
      return {
        id: segment.id || uid(),
        startSlot,
        slots,
        category: segment.category || category.category,
        className: category.className,
        activity: segment.activity || segment.category || category.category,
        source: segment.source || "",
        trackedMs: Math.max(0, Number(segment.trackedMs || 0))
      };
    })
    .filter((segment) => segment.slots > 0)
    .sort((a, b) => a.startSlot - b.startSlot || (a.startSlot + a.slots) - (b.startSlot + b.slots));

  const visible = mergeAdjacentDaySegments(clean.filter((segment) => segment.className !== "free"));
  const free = buildFreeDaySegments(visible);
  return [...visible, ...free].sort((a, b) => a.startSlot - b.startSlot || (a.className === "free" ? 1 : -1));
}

function buildFreeDaySegments(visibleSegments) {
  const occupied = Array(DAY_PLAN_TOTAL_SLOTS).fill(false);
  visibleSegments.forEach((segment) => {
    const start = Math.max(0, Math.min(DAY_PLAN_TOTAL_SLOTS, Number(segment.startSlot || 0)));
    const end = Math.max(start, Math.min(DAY_PLAN_TOTAL_SLOTS, start + Number(segment.slots || 0)));
    for (let slot = start; slot < end; slot += 1) occupied[slot] = true;
  });
  const free = [];
  let cursor = 0;
  while (cursor < DAY_PLAN_TOTAL_SLOTS) {
    while (cursor < DAY_PLAN_TOTAL_SLOTS && occupied[cursor]) cursor += 1;
    if (cursor >= DAY_PLAN_TOTAL_SLOTS) break;
    const start = cursor;
    while (cursor < DAY_PLAN_TOTAL_SLOTS && !occupied[cursor]) cursor += 1;
    free.push(makeFreeSegment(start, cursor - start));
  }
  return free;
}

function layoutDayPlanSegments(segments) {
  const lanes = [];
  const laidOut = segments
    .slice()
    .sort((a, b) => {
      const aStart = Number(a.gridStartSlot ?? a.startSlot ?? 0);
      const bStart = Number(b.gridStartSlot ?? b.startSlot ?? 0);
      const aEnd = aStart + Number(a.gridSlots ?? a.slots ?? 0);
      const bEnd = bStart + Number(b.gridSlots ?? b.slots ?? 0);
      return aStart - bStart || aEnd - bEnd;
    })
    .map((segment) => {
      const start = Number(segment.gridStartSlot ?? segment.startSlot ?? 0);
      const slots = Number(segment.gridSlots ?? segment.slots ?? 0);
      const end = start + slots;
      let lane = lanes.findIndex((laneEnd) => laneEnd <= start);
      if (lane < 0) {
        lane = lanes.length;
        lanes.push(end);
      } else {
        lanes[lane] = end;
      }
      return { ...segment, gridStartSlot: start, gridSlots: slots, lane };
    });
  return { segments: laidOut, lanes: lanes.length || 1 };
}

function makeFreeSegment(startSlot, slots) {
  return {
    id: uid(),
    startSlot,
    slots,
    category: "未安排",
    className: "free",
    activity: "未安排"
  };
}

function mergeAdjacentDaySegments(segments) {
  return segments.reduce((items, segment) => {
    const previous = items[items.length - 1];
    if (
      previous &&
      previous.startSlot + previous.slots === segment.startSlot &&
      previous.category === segment.category &&
      previous.className === segment.className &&
      previous.activity === segment.activity &&
      previous.source === segment.source &&
      Number(previous.trackedMs || 0) === 0 &&
      Number(segment.trackedMs || 0) === 0
    ) {
      previous.slots += segment.slots;
      previous.trackedMs = Math.max(0, Number(previous.trackedMs || 0)) + Math.max(0, Number(segment.trackedMs || 0));
    } else {
      items.push({ ...segment });
    }
    return items;
  }, []);
}

function categoryByClassName(className) {
  return dayPlanCategoryOptions.find((item) => item.className === className) || dayPlanCategoryOptions[0];
}

function uniqueCategories(segments) {
  const seen = new Set();
  return segments.reduce((items, segment) => {
    if (seen.has(segment.category)) return items;
    seen.add(segment.category);
    items.push({ name: segment.category, className: segment.className });
    return items;
  }, []);
}

function segmentTimeRange(segment) {
  return `${formatSlotClock(segment.startSlot)}-${formatSlotClock(segment.startSlot + segment.slots)}`;
}

function segmentTitle(segment) {
  return `${segmentTimeRange(segment)} · ${t(segment.activity)} · ${formatSlotDuration(segment.slots)}`;
}

function formatSlotClock(slot) {
  if (slot >= DAY_PLAN_TOTAL_SLOTS) return "24:00";
  const totalMinutes = Math.max(0, Math.round(Number(slot || 0))) * DAY_PLAN_SLOT_MINUTES;
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function formatSlotDuration(slots) {
  const minutes = Math.max(0, Math.round(Number(slots || 0))) * DAY_PLAN_SLOT_MINUTES;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (isEnglish()) {
    if (minutes < 60) return `${minutes} min`;
    return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
  }
  if (minutes < 60) return `${minutes} 分钟`;
  return rest ? `${hours} 小时 ${rest} 分钟` : `${hours} 小时`;
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

function renderReview() {
  const editing = state.reviews.find((item) => item.id === $("#reviewEditId")?.value);
  const today = state.reviews.find((item) => item.day === todayKey());
  if (editing) {
    fillReviewForm(editing);
    setReviewEditState(editing);
  } else if (today) {
    fillReviewForm(today);
    setReviewEditState(null);
  } else {
    clearReviewForm();
    setReviewEditState(null);
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
          <div class="stack-actions">
            <button class="icon-btn" data-review-edit="${review.id}" aria-label="${isEnglish() ? "Edit review" : "编辑复盘"}" title="${isEnglish() ? "Edit review" : "编辑复盘"}"><i data-lucide="square-pen"></i></button>
            <button class="icon-btn" data-delete-id="${review.id}" aria-label="${isEnglish() ? "Delete review" : "删除复盘"}" title="${isEnglish() ? "Delete review" : "删除复盘"}"><i data-lucide="trash-2"></i></button>
          </div>
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
}

function renderCharts() {
  if (activeSection === "dashboard") {
    drawTrendChart($("#mainChart"), dashboardRange);
    drawTaskDonut($("#taskDonut"));
  }
}

function drawTrendChart(canvas, range, options = {}) {
  const chart = prepareCanvas(canvas);
  if (!chart) return;
  const { ctx, width, height } = chart;
  const days = lastDays(range);
  const maxMinutes = niceMinuteCeil(Math.max(
    ...days.map((day) => workMinutesForDay(day)),
    ...days.map((day) => timetableMinutesForDay(day)),
    60
  ));
  const top = 24;
  const bottom = 34;
  const left = options.compact ? 44 : 50;
  const right = options.compact ? 48 : 56;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const group = plotW / days.length;
  const barW = Math.max(8, Math.min(18, group * 0.22));
  const hitAreas = [];

  clearCanvas(ctx, width, height);
  drawGrid(ctx, left, top, plotW, plotH);
  drawHourAxis(ctx, left, top, plotW, plotH, maxMinutes);

  days.forEach((day, index) => {
    const x = left + index * group + group / 2;
    const work = workMinutesForDay(day);
    const focus = timetableMinutesForDay(day);
    const workH = (work / maxMinutes) * plotH;
    const focusH = (focus / maxMinutes) * plotH;
    const workRect = { x: x - barW - 2, y: top + plotH - workH, width: barW, height: Math.max(2, workH) };
    const focusRect = { x: x + 2, y: top + plotH - focusH, width: barW, height: Math.max(2, focusH) };
    roundRect(ctx, workRect.x, workRect.y, workRect.width, workH, 4, "#08756f");
    roundRect(ctx, focusRect.x, focusRect.y, focusRect.width, focusH, 4, "#d85d50");
    if (work > 0) hitAreas.push({ ...workRect, day, work, focus, series: "工作" });
    if (focus > 0) hitAreas.push({ ...focusRect, day, work, focus, series: "专注" });
    ctx.fillStyle = "#697386";
    ctx.font = "11px Arial";
    ctx.textAlign = "center";
    ctx.fillText(day.slice(5), x, height - 12);
  });

  drawLegend(ctx, [
    ["工作", "#08756f"],
    ["专注", "#d85d50"]
  ], options.compact ? 26 : 38);
  canvas.__chartBars = hitAreas;
  ensureTrendChartHover(canvas);
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

function prepareCanvas(canvas) {
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  const width = Math.floor(rect.width);
  const height = Math.floor(rect.height) || Number(canvas.getAttribute("height")) || 220;
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

function drawHourAxis(ctx, left, top, width, height, maxMinutes) {
  const unit = isEnglish() ? "hr" : "小时";
  const ticks = [maxMinutes, Math.round(maxMinutes / 2), 0];
  const x = left + width + 8;
  ctx.fillStyle = "#697386";
  ctx.font = "11px Arial";
  ctx.textAlign = "left";
  ticks.forEach((tick) => {
    const y = top + height - (tick / maxMinutes) * height;
    ctx.fillText(formatHourTick(tick), x, y + 4);
  });
  ctx.font = "700 11px Arial";
  ctx.fillText(unit, x, Math.max(12, top - 8));
}

function formatHourTick(minutes) {
  const hours = Number(minutes || 0) / 60;
  if (Number.isInteger(hours)) return String(hours);
  return hours.toFixed(1).replace(/\.0$/, "");
}

function niceMinuteCeil(value) {
  const safe = Math.max(60, Number(value) || 0);
  const steps = [60, 120, 180, 240, 360, 480, 600, 720, 960, 1200];
  return steps.find((step) => step >= safe) || Math.ceil(safe / 60) * 60;
}

function ensureTrendChartHover(canvas) {
  if (canvas.__trendHoverReady) return;
  canvas.__trendHoverReady = true;
  canvas.addEventListener("mousemove", (event) => {
    const hit = findChartBar(canvas, event);
    if (!hit) {
      hideChartTooltip();
      return;
    }
    showChartTooltip(event, hit);
  });
  canvas.addEventListener("mouseleave", hideChartTooltip);
}

function findChartBar(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const padding = 7;
  return (canvas.__chartBars || []).find((bar) => (
    x >= bar.x - padding
    && x <= bar.x + bar.width + padding
    && y >= bar.y - padding
    && y <= bar.y + bar.height + padding
  ));
}

function showChartTooltip(event, hit) {
  const tooltip = getChartTooltip();
  const selected = t(hit.series);
  tooltip.innerHTML = `
    <strong>${escapeHtml(hit.day)} · ${escapeHtml(selected)}</strong>
    <span>${escapeHtml(t("工作"))}: ${escapeHtml(formatMinutes(hit.work))}</span><br>
    <span>${escapeHtml(t("专注"))}: ${escapeHtml(formatMinutes(hit.focus))}</span>
  `;
  tooltip.hidden = false;
  const margin = 16;
  const tooltipRect = tooltip.getBoundingClientRect();
  const left = Math.min(event.clientX + 12, window.innerWidth - tooltipRect.width - margin);
  const top = Math.min(event.clientY + 12, window.innerHeight - tooltipRect.height - margin);
  tooltip.style.left = `${Math.max(margin, left)}px`;
  tooltip.style.top = `${Math.max(margin, top)}px`;
}

function getChartTooltip() {
  let tooltip = $("#chartTooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "chartTooltip";
    tooltip.className = "chart-tooltip";
    tooltip.hidden = true;
    document.body.appendChild(tooltip);
  }
  return tooltip;
}

function hideChartTooltip() {
  const tooltip = $("#chartTooltip");
  if (tooltip) tooltip.hidden = true;
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
  const opened = [];
  let total = 0;

  pairedWorkLogsForDay(day).forEach((log) => {
    if (log.type === "in") {
      opened.push(log);
      return;
    }
    const closeIndex = findOpenStartIndex(opened, log);
    if (closeIndex < 0) return;
    const start = opened.splice(closeIndex, 1)[0];
    total += Math.max(0, new Date(log.at) - new Date(start.at));
  });
  if (day === todayKey()) {
    opened.forEach((start) => {
      total += Math.max(0, Date.now() - new Date(start.at).getTime());
    });
  }
  return Math.round(total / 60000);
}

function timetableMinutesForDay(day) {
  const plan = state.dayPlan?.day === day ? state.dayPlan : findHistoryPlan(state.dayPlanHistory, day);
  if (!plan) return 0;
  return visibleSegmentsForPlan(plan).reduce((sum, segment) => (
    sum + Math.max(0, Number(segment.slots || 0)) * DAY_PLAN_SLOT_MINUTES
  ), 0);
}

function openWorkSegmentCount() {
  return unmatchedWorkStarts(todayKey()).length;
}

function pairedWorkLogsForDay(day) {
  return state.attendanceLogs
    .filter((item) => dateKey(new Date(item.at)) === day && (item.type === "in" || item.type === "out"))
    .sort((a, b) => new Date(a.at) - new Date(b.at));
}

function findOpenStartIndex(opened, outLog) {
  if (!opened.length) return -1;
  if (outLog.closedInId) {
    const exactIndex = opened.findIndex((item) => item.id === outLog.closedInId);
    if (exactIndex >= 0) return exactIndex;
  }
  return opened.length - 1;
}

function unmatchedWorkStarts(day) {
  const opened = [];
  pairedWorkLogsForDay(day).forEach((log) => {
    if (log.type === "in") {
      opened.push(log);
      return;
    }
    const closeIndex = findOpenStartIndex(opened, log);
    if (closeIndex >= 0) opened.splice(closeIndex, 1);
  });
  return opened;
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

function startOfWeek(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const mondayOffset = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - mondayOffset);
  return start;
}

function currentWeekDayKeys(date = new Date()) {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, index) => dateKey(addDays(start, index)));
}

function weekDayLabel(day) {
  const date = new Date(`${day}T00:00:00`);
  const locale = isEnglish() ? "en-US" : "zh-CN";
  return `${date.toLocaleDateString(locale, { month: "2-digit", day: "2-digit" })} ${date.toLocaleDateString(locale, { weekday: "short" })}`;
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
