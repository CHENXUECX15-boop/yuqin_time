const STORAGE_KEY = "yuqin.employee.workspace.v1";
const SYNC_STORAGE_PREFIX = "yuqin.owner.sync.";

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
  "24 小时时间表": "24-Hour Timetable",
  "最小刻度 0.5 小时，可以手动编辑，也可以从日历同步导入。": "Minimum step is 0.5 hour. Edit manually or import from calendars.",
  "账号与日历同步": "Account & Calendar Sync",
  "登录邮箱后，可以把 Google 日程和 Outlook 日历导入到当天时间表。": "Log in with email to import Google Calendar and Outlook Calendar into today's timetable.",
  "邮箱账号": "Email account",
  "密码或授权码": "Password or auth code",
  "密码或验证码": "Password or code",
  "设备名称，例如：办公室电脑": "Device name, e.g. Office laptop",
  "登录账号": "Log In",
  "登录并同步": "Log In & Sync",
  "退出账号": "Log Out",
  "退出登录": "Log Out",
  "未登录": "Not logged in",
  "已登录": "Logged in",
  "邮箱账号同步": "Email Account Sync",
  "使用邮箱登录，把任务、时间表、会议和复盘同步到同一个账号。": "Log in with email to sync tasks, timetable, meetings, and reviews to one account.",
  "未连接": "Not connected",
  "已连接": "Connected",
  "自动同步": "Auto sync",
  "立即同步": "Sync Now",
  "从账号拉取": "Pull From Account",
  "当前设备": "Current device",
  "云端版本": "Cloud version",
  "尚未同步": "Not synced yet",
  "等待其他设备登录同一邮箱": "Waiting for other devices to log in with the same email",
  "自动同步已开启": "Auto sync on",
  "自动同步已关闭": "Auto sync off",
  "本地原型": "Local prototype",
  "等待登录": "Waiting for login",
  "最近同步": "Last sync",
  "先登录邮箱账号，再连接日历来源。": "Use email login first, then connect calendar sources.",
  "连接 Google 日程": "Connect Google Calendar",
  "连接 Outlook 日历": "Connect Outlook Calendar",
  "导入已连接日历": "Import Connected Calendars",
  "Google 日程": "Google Calendar",
  "Outlook 日历": "Outlook Calendar",
  "Google 日程：晨间规划": "Google Calendar: Morning planning",
  "Google 日程：深度工作": "Google Calendar: Deep work",
  "Outlook 日历：项目跟进": "Outlook Calendar: Project follow-up",
  "Outlook 日历：个人安排": "Outlook Calendar: Personal plan",
  "活动名称": "Activity name",
  "选择类别": "Choose category",
  "开始时间": "Start time",
  "结束时间": "End time",
  "保存时间段": "Save Time Block",
  "取消编辑": "Cancel Edit",
  "用户可以新增、编辑、删除任意 0.5 小时倍数的时间段。重叠部分会自动被新安排替换。": "Add, edit, or delete time blocks in 0.5-hour increments. Overlaps are replaced by the new plan.",
  "点击时间块或明细里的编辑按钮即可修改。": "Click a block or the edit button in details to modify it.",
  "今日时间组合": "Today's Time Mix",
  "每格 0.5 小时，用色块表示这段时间我在做什么。": "Each cell is 0.5 hour. Color blocks show what I did during that time.",
  "时间明细": "Time Details",
  "开始、结束、活动和时长": "Start, end, activity, and duration",
  "全天覆盖": "Full Day",
  "最小刻度": "Minimum Step",
  "半小时格": "Half-hour Slots",
  "活动段": "Activity Blocks",
  "0.5 小时": "0.5 hr",
  "24 小时": "24 hrs",
  "48 格": "48 slots",
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
  "工作时长、专注时长、完成任务": "Work time, focus time, and completed tasks",
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
  "编辑": "Edit",
  "操作": "Actions",
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
  "请先输入邮箱账号": "Please enter an email account",
  "请先登录邮箱账号": "Please log in with an email account first",
  "请先连接至少一个日历": "Please connect at least one calendar",
  "邮箱账号已登录": "Email account logged in",
  "邮箱账号已退出": "Email account logged out",
  "账号数据已同步": "Account data synced",
  "暂无账号同步数据": "No account sync data yet",
  "已从账号拉取数据": "Pulled data from account",
  "日历账号已登录": "Calendar account logged in",
  "日历账号已退出": "Calendar account logged out",
  "已连接 Google 日程": "Google Calendar connected",
  "已连接 Outlook 日历": "Outlook Calendar connected",
  "Google 日程已断开": "Google Calendar disconnected",
  "Outlook 日历已断开": "Outlook Calendar disconnected",
  "日历已导入时间表": "Calendar imported into timetable",
  "请填写活动名称": "Please enter an activity name",
  "结束时间必须晚于开始时间": "End time must be later than start time",
  "时间段已保存": "Time block saved",
  "时间段已删除": "Time block deleted",
  "已进入编辑模式": "Edit mode enabled",
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
    dayPlan: createBlankDayPlan(today),
    calendarAccount: {
      email: "",
      loggedIn: false,
      google: false,
      outlook: false,
      lastSync: null
    },
    syncAccount: {
      email: "",
      loggedIn: false,
      autoSync: true,
      lastSync: null,
      cloudVersion: 0,
      deviceId: uid(),
      deviceName: "当前网页",
      devices: []
    },
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
    focusTimer: { ...base.focusTimer, ...(incoming.focusTimer || {}) },
    calendarAccount: { ...base.calendarAccount, ...(incoming.calendarAccount || {}) },
    syncAccount: { ...base.syncAccount, ...(incoming.syncAccount || {}) }
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
  autoSyncState();
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

  $("#calendarLoginForm").addEventListener("submit", handleCalendarLogin);
  $("#syncLoginForm").addEventListener("submit", handleSyncLogin);
  $("#dayPlanEditor").addEventListener("submit", saveDaySegment);
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

  $("#btnCalendarLogout").addEventListener("click", logoutCalendarAccount);
  $("#btnSyncLogout").addEventListener("click", logoutSyncAccount);
  $("#btnSyncNow").addEventListener("click", () => pushAccountSync(true));
  $("#btnPullCloud").addEventListener("click", pullAccountSync);
  $("#syncAuto").addEventListener("change", toggleAutoSync);
  $("#btnConnectGoogle").addEventListener("click", () => toggleCalendarProvider("google"));
  $("#btnConnectOutlook").addEventListener("click", () => toggleCalendarProvider("outlook"));
  $("#btnImportCalendars").addEventListener("click", importConnectedCalendars);
  $("#btnCancelDaySegment").addEventListener("click", resetDayPlanEditor);
  $("#dayPlanBoard").addEventListener("click", handleDayPlanEditClick);
  $("#dayPlanDetails").addEventListener("click", handleDayPlanDetailAction);
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
  hideChartTooltip();
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

function handleCalendarLogin(event) {
  event.preventDefault();
  const email = $("#calendarEmail").value.trim();
  if (!email) return toast("请先输入邮箱账号");
  loginSharedEmailAccount(email, "当前网页");
  state.calendarAccount = {
    ...ensureCalendarAccount(),
    email,
    loggedIn: true
  };
  $("#calendarPassword").value = "";
  saveAndRender("日历账号已登录");
}

function logoutCalendarAccount() {
  state.calendarAccount = {
    email: "",
    loggedIn: false,
    google: false,
    outlook: false,
    lastSync: null
  };
  saveAndRender("日历账号已退出");
}

function handleSyncLogin(event) {
  event.preventDefault();
  const email = $("#syncEmail").value.trim();
  const deviceName = $("#syncDeviceName").value.trim();
  if (!email) return toast("请先输入邮箱账号");
  loginSharedEmailAccount(email, deviceName);
  $("#syncPassword").value = "";
  saveAndRender("邮箱账号已登录");
}

function loginSharedEmailAccount(email, deviceName = "") {
  const account = ensureSyncAccount();
  account.email = email;
  account.loggedIn = true;
  account.autoSync = account.autoSync !== false;
  account.deviceId = account.deviceId || uid();
  account.deviceName = deviceName || account.deviceName || "当前网页";
  account.devices = upsertSyncDevice(account.devices || [], account);
  const calendar = ensureCalendarAccount();
  calendar.email = email;
  calendar.loggedIn = true;
}

function logoutSyncAccount() {
  state.syncAccount = {
    email: "",
    loggedIn: false,
    autoSync: true,
    lastSync: null,
    cloudVersion: 0,
    deviceId: ensureSyncAccount().deviceId || uid(),
    deviceName: ensureSyncAccount().deviceName || "当前网页",
    devices: []
  };
  state.calendarAccount = {
    ...ensureCalendarAccount(),
    email: "",
    loggedIn: false,
    google: false,
    outlook: false,
    lastSync: null
  };
  saveAndRender("邮箱账号已退出");
}

function toggleAutoSync() {
  const account = ensureSyncAccount();
  account.autoSync = $("#syncAuto").checked;
  saveState();
  renderSettings();
  renderTimeTable();
  renderIcons();
  toast(account.autoSync ? "自动同步已开启" : "自动同步已关闭");
}

function autoSyncState() {
  const account = state.syncAccount;
  if (!account || !account.loggedIn || account.autoSync === false) return;
  pushAccountSync(false, { silent: true });
}

function pushAccountSync(showToast = true, options = {}) {
  const account = ensureSyncAccount();
  if (!account.loggedIn || !account.email) {
    if (showToast) toast("请先登录邮箱账号");
    return false;
  }
  const now = iso(new Date());
  account.lastSync = now;
  account.cloudVersion = Number(account.cloudVersion || 0) + 1;
  account.devices = upsertSyncDevice(account.devices || [], account, now);
  const payload = {
    email: account.email,
    savedAt: now,
    version: account.cloudVersion,
    devices: account.devices,
    data: snapshotForAccountSync()
  };
  localStorage.setItem(syncStorageKey(account.email), JSON.stringify(payload));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (showToast && !options.silent) {
    renderAll();
    toast("账号数据已同步");
  }
  return true;
}

function pullAccountSync() {
  const account = ensureSyncAccount();
  if (!account.loggedIn || !account.email) return toast("请先登录邮箱账号");
  const raw = localStorage.getItem(syncStorageKey(account.email));
  if (!raw) return toast("暂无账号同步数据");
  try {
    const payload = JSON.parse(raw);
    const currentDeviceId = account.deviceId || uid();
    const currentDeviceName = account.deviceName || "当前网页";
    state = mergeState(createDefaultState(), payload.data || {});
    state.syncAccount = {
      ...ensureSyncAccount(),
      ...(payload.data?.syncAccount || {}),
      email: account.email,
      loggedIn: true,
      autoSync: account.autoSync !== false,
      lastSync: payload.savedAt || iso(new Date()),
      cloudVersion: Number(payload.version || 0),
      deviceId: currentDeviceId,
      deviceName: currentDeviceName,
      devices: upsertSyncDevice(payload.devices || [], { deviceId: currentDeviceId, deviceName: currentDeviceName })
    };
    state.calendarAccount = {
      ...ensureCalendarAccount(),
      email: account.email,
      loggedIn: true
    };
    saveAndRender("已从账号拉取数据");
  } catch (error) {
    toast("导入失败，请检查 JSON 文件");
  }
}

function snapshotForAccountSync() {
  return JSON.parse(JSON.stringify(state));
}

function syncStorageKey(email) {
  return `${SYNC_STORAGE_PREFIX}${String(email || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function upsertSyncDevice(devices, account, syncedAt = iso(new Date())) {
  const deviceId = account.deviceId || uid();
  const deviceName = account.deviceName || "当前网页";
  const next = (devices || []).filter((device) => device.id !== deviceId);
  next.unshift({
    id: deviceId,
    name: deviceName,
    type: "web",
    lastSync: syncedAt
  });
  return next.slice(0, 6);
}

function toggleCalendarProvider(provider) {
  const account = ensureCalendarAccount();
  if (!account.loggedIn) return toast("请先登录邮箱账号");
  account[provider] = !account[provider];
  const providerText = provider === "google" ? "Google 日程" : "Outlook 日历";
  saveAndRender(account[provider] ? `已连接 ${providerText}` : `${providerText}已断开`);
}

function importConnectedCalendars() {
  const account = ensureCalendarAccount();
  if (!account.loggedIn) return toast("请先登录邮箱账号");
  if (!account.google && !account.outlook) return toast("请先连接至少一个日历");
  const imports = buildCalendarImports(account);
  imports.forEach((segment) => insertDaySegment(segment));
  account.lastSync = iso(new Date());
  saveAndRender("日历已导入时间表");
}

function buildCalendarImports(account) {
  const items = [];
  if (account.google) {
    items.push({
      id: uid(),
      startSlot: 18,
      slots: 2,
      category: "会议",
      className: "meeting",
      activity: "Google 日程：晨间规划",
      source: "google"
    });
    items.push({
      id: uid(),
      startSlot: 32,
      slots: 2,
      category: "工作",
      className: "work",
      activity: "Google 日程：深度工作",
      source: "google"
    });
  }
  if (account.outlook) {
    items.push({
      id: uid(),
      startSlot: 26,
      slots: 3,
      category: "会议",
      className: "meeting",
      activity: "Outlook 日历：项目跟进",
      source: "outlook"
    });
    items.push({
      id: uid(),
      startSlot: 38,
      slots: 2,
      category: "生活",
      className: "life",
      activity: "Outlook 日历：个人安排",
      source: "outlook"
    });
  }
  return items;
}

function saveDaySegment(event) {
  event.preventDefault();
  const id = $("#daySegmentId").value;
  const activity = $("#daySegmentTitle").value.trim();
  const startSlot = Number($("#daySegmentStart").value);
  const endSlot = Number($("#daySegmentEnd").value);
  const category = categoryByClassName($("#daySegmentCategory").value);
  if (!activity) return toast("请填写活动名称");
  if (!Number.isFinite(startSlot) || !Number.isFinite(endSlot) || endSlot <= startSlot) return toast("结束时间必须晚于开始时间");

  insertDaySegment({
    id: id || uid(),
    startSlot,
    slots: endSlot - startSlot,
    category: category.category,
    className: category.className,
    activity
  }, id || null);
  resetDayPlanEditor(false);
  saveAndRender("时间段已保存");
}

function handleDayPlanEditClick(event) {
  const block = event.target.closest("[data-day-segment-edit]");
  if (!block) return;
  editDaySegment(block.dataset.daySegmentEdit);
}

function handleDayPlanDetailAction(event) {
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
  $("#daySegmentTitle").value = segment.activity;
  $("#btnCancelDaySegment").hidden = false;
  toast("已进入编辑模式");
}

function resetDayPlanEditor(shouldRenderIcons = true) {
  $("#daySegmentId").value = "";
  $("#daySegmentTitle").value = "";
  renderDayPlanEditorOptions("work", 18, 20);
  $("#btnCancelDaySegment").hidden = true;
  if (shouldRenderIcons) renderIcons();
}

function deleteDaySegment(id) {
  const plan = ensureDayPlan();
  plan.segments = normalizeDaySegments(plan.segments.filter((segment) => segment.id !== id));
  saveAndRender("时间段已删除");
}

function insertDaySegment(newSegment, replaceId = null) {
  const plan = ensureDayPlan();
  const newStart = Number(newSegment.startSlot);
  const newEnd = newStart + Number(newSegment.slots);
  const kept = [];
  (plan.segments || []).forEach((segment) => {
    if (replaceId && segment.id === replaceId) return;
    const start = Number(segment.startSlot);
    const end = start + Number(segment.slots);
    if (end <= newStart || start >= newEnd) {
      kept.push({ ...segment });
      return;
    }
    if (start < newStart) {
      kept.push({ ...segment, id: uid(), startSlot: start, slots: newStart - start });
    }
    if (end > newEnd) {
      kept.push({ ...segment, id: uid(), startSlot: newEnd, slots: end - newEnd });
    }
  });
  kept.push(newSegment);
  plan.day = todayKey();
  plan.mode = "manual";
  plan.updatedAt = iso(new Date());
  plan.segments = normalizeDaySegments(kept);
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
  renderTimeTable();
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

function renderTimeTable() {
  renderCalendarSync();
  renderDayPlanEditorOptions();
  const plan = ensureDayPlan();
  const segments = plan.segments || [];
  const categories = uniqueCategories(segments);
  $("#dayPlanSummary").innerHTML = [
    [t("全天覆盖"), t("24 小时")],
    [t("最小刻度"), t("0.5 小时")],
    [t("半小时格"), t("48 格")],
    [t("活动段"), `${segments.length} ${t("段")}`]
  ].map(([label, value]) => `
    <div>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `).join("");

  $("#dayPlanLegend").innerHTML = categories.map((category) => `
    <span class="day-plan-legend-item">
      <i class="plan-dot plan-${category.className}"></i>${escapeHtml(t(category.name))}
    </span>
  `).join("");

  $("#dayPlanBoard").innerHTML = `
    <div class="day-plan-board-head">
      <span>${escapeHtml(t("时间轴"))}</span>
      <strong>${escapeHtml(plan.day || todayKey())}</strong>
    </div>
    <div class="day-plan-axis">
      ${Array.from({ length: 13 }, (_, index) => index * 2).map((hour) => `
        <span style="grid-column:${hour * 2 + 1}">${hour === 24 ? "24:00" : `${String(hour).padStart(2, "0")}:00`}</span>
      `).join("")}
    </div>
    <div class="day-plan-strip" role="img" aria-label="${escapeHtml(t("24 小时时间表"))}">
      ${segments.map((segment) => `
        <button
          type="button"
          class="day-plan-block plan-${segment.className}"
          data-day-segment-edit="${segment.id}"
          style="grid-column:${segment.startSlot + 1} / span ${segment.slots}"
          title="${escapeHtml(segmentTitle(segment))}"
        >
          <strong>${escapeHtml(t(segment.activity))}</strong>
          <span>${escapeHtml(segmentTimeRange(segment))}</span>
        </button>
      `).join("")}
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
    ${segments.map((segment) => `
      <div class="time-detail-row">
        <time>${escapeHtml(segmentTimeRange(segment))}</time>
        <strong>${escapeHtml(t(segment.activity))}</strong>
        <span><i class="plan-dot plan-${segment.className}"></i>${escapeHtml(t(segment.category))}</span>
        <span>${escapeHtml(formatSlotDuration(segment.slots))}</span>
        <span class="tiny-actions">
          <button type="button" data-day-segment-edit="${segment.id}">${escapeHtml(t("编辑"))}</button>
          <button type="button" data-day-segment-delete="${segment.id}">${escapeHtml(t("删除"))}</button>
        </span>
      </div>
    `).join("")}
  `;
}

function renderCalendarSync() {
  const account = ensureCalendarAccount();
  const syncAccount = ensureSyncAccount();
  if (syncAccount.loggedIn && syncAccount.email && !account.loggedIn) {
    account.email = syncAccount.email;
    account.loggedIn = true;
  }
  const badge = $("#calendarLoginBadge");
  badge.textContent = account.loggedIn ? t("已登录") : t("未登录");
  badge.className = `status-pill ${account.loggedIn ? "good" : "neutral"}`;
  $("#calendarEmail").value = account.email || "";
  $("#btnCalendarLogout").disabled = !account.loggedIn;
  $("#btnConnectGoogle").disabled = !account.loggedIn;
  $("#btnConnectOutlook").disabled = !account.loggedIn;
  $("#btnImportCalendars").disabled = !account.loggedIn || (!account.google && !account.outlook);

  $("#calendarAccountStatus").innerHTML = account.loggedIn
    ? `
      <strong>${escapeHtml(account.email)}</strong>
      <span>${escapeHtml(account.lastSync ? `${t("最近同步")} ${formatDateTime(account.lastSync)}` : t("本地原型"))}</span>
    `
    : `
      <strong>${escapeHtml(t("等待登录"))}</strong>
      <span>${escapeHtml(t("先登录邮箱账号，再连接日历来源。"))}</span>
    `;

  $("#calendarProviderList").innerHTML = [
    { key: "google", name: "Google 日程", icon: "calendar-days" },
    { key: "outlook", name: "Outlook 日历", icon: "calendar-check" }
  ].map((provider) => {
    const connected = Boolean(account[provider.key]);
    return `
      <div class="calendar-provider ${connected ? "is-connected" : ""}">
        <i data-lucide="${provider.icon}"></i>
        <div>
          <strong>${escapeHtml(t(provider.name))}</strong>
          <span>${escapeHtml(connected ? t("已连接") : t("未连接"))}</span>
        </div>
      </div>
    `;
  }).join("");
}

function renderDayPlanEditorOptions(categoryClass = $("#daySegmentCategory")?.value || "work", startSlot = Number($("#daySegmentStart")?.value || 18), endSlot = Number($("#daySegmentEnd")?.value || 20)) {
  const categorySelect = $("#daySegmentCategory");
  const startSelect = $("#daySegmentStart");
  const endSelect = $("#daySegmentEnd");
  if (!categorySelect || !startSelect || !endSelect) return;

  categorySelect.innerHTML = dayPlanCategoryOptions.map((item) => `
    <option value="${escapeHtml(item.className)}">${escapeHtml(t(item.category))}</option>
  `).join("");
  categorySelect.value = dayPlanCategoryOptions.some((item) => item.className === categoryClass) ? categoryClass : "work";

  const slotOptions = Array.from({ length: 49 }, (_, slot) => `
    <option value="${slot}">${formatSlotClock(slot)}</option>
  `).join("");
  startSelect.innerHTML = slotOptions;
  endSelect.innerHTML = slotOptions;
  startSelect.value = String(Math.max(0, Math.min(47, Number.isFinite(startSlot) ? startSlot : 18)));
  endSelect.value = String(Math.max(1, Math.min(48, Number.isFinite(endSlot) ? endSlot : 20)));
}

function ensureDayPlan() {
  const hasCalendarSource = (state.dayPlan?.segments || []).some((segment) => segment.source);
  const isLegacyGeneratedPlan = state.dayPlan && !state.dayPlan.mode && !hasCalendarSource;
  if (!state.dayPlan || !Array.isArray(state.dayPlan.segments) || state.dayPlan.segments.length === 0 || isLegacyGeneratedPlan) {
    state.dayPlan = createBlankDayPlan(todayKey());
    saveState();
  }
  state.dayPlan.segments = normalizeDaySegments(state.dayPlan.segments);
  return state.dayPlan;
}

function createBlankDayPlan(day = todayKey()) {
  return {
    day,
    mode: "manual",
    updatedAt: iso(new Date()),
    segments: [makeFreeSegment(0, 48)]
  };
}

function ensureCalendarAccount() {
  if (!state.calendarAccount) {
    state.calendarAccount = {
      email: "",
      loggedIn: false,
      google: false,
      outlook: false,
      lastSync: null
    };
  }
  return state.calendarAccount;
}

function ensureSyncAccount() {
  if (!state.syncAccount) {
    state.syncAccount = {
      email: "",
      loggedIn: false,
      autoSync: true,
      lastSync: null,
      cloudVersion: 0,
      deviceId: uid(),
      deviceName: "当前网页",
      devices: []
    };
  }
  state.syncAccount.deviceId = state.syncAccount.deviceId || uid();
  state.syncAccount.deviceName = state.syncAccount.deviceName || "当前网页";
  state.syncAccount.devices = state.syncAccount.devices || [];
  return state.syncAccount;
}

function normalizeDaySegments(segments) {
  const clean = (segments || [])
    .map((segment) => {
      const startSlot = Math.max(0, Math.min(48, Math.round(Number(segment.startSlot || 0))));
      const slots = Math.max(0, Math.min(48 - startSlot, Math.round(Number(segment.slots || 0))));
      const category = categoryByClassName(segment.className || "free");
      return {
        id: segment.id || uid(),
        startSlot,
        slots,
        category: segment.category || category.category,
        className: category.className,
        activity: segment.activity || segment.category || category.category,
        source: segment.source || ""
      };
    })
    .filter((segment) => segment.slots > 0)
    .sort((a, b) => a.startSlot - b.startSlot);

  const filled = [];
  let cursor = 0;
  clean.forEach((segment) => {
    const start = Math.max(cursor, segment.startSlot);
    const end = Math.min(48, segment.startSlot + segment.slots);
    if (start > cursor) filled.push(makeFreeSegment(cursor, start - cursor));
    if (end > start) {
      filled.push({ ...segment, startSlot: start, slots: end - start });
      cursor = end;
    }
  });
  if (cursor < 48) filled.push(makeFreeSegment(cursor, 48 - cursor));
  return mergeAdjacentDaySegments(filled);
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
      previous.activity === segment.activity
    ) {
      previous.slots += segment.slots;
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
  if (slot >= 48) return "24:00";
  const hour = Math.floor(slot / 2);
  const minute = slot % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

function formatSlotDuration(slots) {
  const hours = Number(slots || 0) / 2;
  if (isEnglish()) return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hr`;
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} 小时`;
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

function renderSyncSettings() {
  const account = ensureSyncAccount();
  const loggedIn = Boolean(account.loggedIn && account.email);
  const badge = $("#syncLoginBadge");
  badge.textContent = loggedIn ? t("已登录") : t("未登录");
  badge.className = `status-pill ${loggedIn ? "good" : "neutral"}`;
  $("#syncEmail").value = account.email || "";
  $("#syncDeviceName").value = account.deviceName || "";
  $("#syncAuto").checked = account.autoSync !== false;
  $("#btnSyncLogout").disabled = !loggedIn;
  $("#btnSyncNow").disabled = !loggedIn;
  $("#btnPullCloud").disabled = !loggedIn;

  $("#syncAccountStatus").innerHTML = loggedIn
    ? `
      <div>
        <span>${escapeHtml(t("邮箱账号"))}</span>
        <strong>${escapeHtml(account.email)}</strong>
      </div>
      <div>
        <span>${escapeHtml(t("最近同步"))}</span>
        <strong>${escapeHtml(account.lastSync ? formatDateTime(account.lastSync) : t("尚未同步"))}</strong>
      </div>
      <div>
        <span>${escapeHtml(t("云端版本"))}</span>
        <strong>${escapeHtml(String(account.cloudVersion || 0))}</strong>
      </div>
    `
    : `
      <div>
        <span>${escapeHtml(t("等待登录"))}</span>
        <strong>${escapeHtml(isEnglish() ? "Use an email account to sync across devices." : "使用邮箱账号后可同步多设备数据")}</strong>
      </div>
    `;

  const devices = account.devices || [];
  $("#syncDeviceList").innerHTML = loggedIn && devices.length
    ? devices.map((device) => `
      <div class="sync-device-card">
        <i data-lucide="${device.id === account.deviceId ? "monitor" : "smartphone"}"></i>
        <div>
          <strong>${escapeHtml(device.name || t("当前设备"))}</strong>
          <span>${escapeHtml(device.lastSync ? formatDateTime(device.lastSync) : t("尚未同步"))}</span>
        </div>
        ${device.id === account.deviceId ? `<em>${escapeHtml(t("当前设备"))}</em>` : ""}
      </div>
    `).join("")
    : `<div class="empty compact">${escapeHtml(loggedIn ? t("等待其他设备登录同一邮箱") : t("请先登录邮箱账号"))}</div>`;
}

function renderSettings() {
  renderThemeSettings();
  renderLanguageSettings();
  renderSyncSettings();
  $("#schemaPreview").textContent = JSON.stringify({
    miniProgramCollections: {
      owners: ["_id", "name", "domain", "role", "createdAt"],
      appearanceProfiles: ["_id", "ownerId", "theme", "language", "updatedAt"],
      rhythmLogs: ["_id", "ownerId", "type", "at", "note"],
      focusSessions: ["_id", "ownerId", "title", "minutes", "targetMinutes", "reward", "rewardEarned", "startedAt", "endedAt"],
      meetingContacts: ["_id", "ownerId", "name", "createdAt"],
      syncAccounts: ["_id", "email", "deviceId", "deviceName", "autoSync", "lastSync", "cloudVersion"],
      calendarAccounts: ["_id", "ownerId", "email", "googleConnected", "outlookConnected", "lastSync"],
      dayPlans: ["_id", "ownerId", "day", "segments", "source", "updatedAt"],
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
  const maxMinutes = niceMinuteCeil(Math.max(
    ...days.map((day) => workMinutesForDay(day)),
    ...days.map((day) => focusMinutesForDay(day)),
    60
  ));
  const maxDone = Math.max(...days.map((day) => doneTasksForDay(day)), 1);
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
    const focus = focusMinutesForDay(day);
    const done = doneTasksForDay(day);
    const workH = (work / maxMinutes) * plotH;
    const focusH = (focus / maxMinutes) * plotH;
    const workRect = { x: x - barW - 2, y: top + plotH - workH, width: barW, height: Math.max(2, workH) };
    const focusRect = { x: x + 2, y: top + plotH - focusH, width: barW, height: Math.max(2, focusH) };
    roundRect(ctx, workRect.x, workRect.y, workRect.width, workH, 4, "#08756f");
    roundRect(ctx, focusRect.x, focusRect.y, focusRect.width, focusH, 4, "#d85d50");
    if (work > 0) hitAreas.push({ ...workRect, day, work, focus, done, series: "工作" });
    if (focus > 0) hitAreas.push({ ...focusRect, day, work, focus, done, series: "专注" });
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
    <span>${escapeHtml(t("专注"))}: ${escapeHtml(formatMinutes(hit.focus))}</span><br>
    <span>${escapeHtml(t("完成"))}: ${escapeHtml(countLabel(hit.done, "个任务", "task"))}</span>
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
