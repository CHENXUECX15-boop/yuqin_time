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
      { id: uid(), title: "处理客户问题清单", minutes: 72, startedAt: iso(new Date(`${yesterday}T10:00:00`)), endedAt: iso(new Date(`${yesterday}T11:12:00`)) },
      { id: uid(), title: "周报草稿", minutes: 45, startedAt: iso(new Date(`${twoDaysAgo}T14:00:00`)), endedAt: iso(new Date(`${twoDaysAgo}T14:45:00`)) }
    ],
    focusTimer: {
      title: "",
      running: false,
      startedAt: null,
      elapsedMs: 0
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
        createdAt: iso(now)
      }
    ],
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
    focusTimer: { ...base.focusTimer, ...(incoming.focusTimer || {}) }
  };
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
      createdAt: iso(new Date())
    });
    saveAndRender("会议已保存");
    $("#meetingForm").reset();
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

  $("#btnAddObjective").addEventListener("click", addObjective);
  $("#btnAddProject").addEventListener("click", addProject);
  $("#btnBoundaryDone").addEventListener("click", () => {
    upsertHealthLog({ boundaryDone: true });
  });

  $("#btnExport").addEventListener("click", exportData);
  $("#importFile").addEventListener("change", importData);
  $("#btnReset").addEventListener("click", resetData);

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
  timer.title = $("#focusTitle").value.trim() || timer.title || "未命名专注";
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
    title: timer.title || $("#focusTitle").value.trim() || "未命名专注",
    minutes,
    startedAt: iso(new Date(endedAt.getTime() - elapsedMs)),
    endedAt: iso(endedAt)
  });
  state.focusTimer = { title: "", running: false, startedAt: null, elapsedMs: 0 };
  $("#focusTitle").value = "";
  saveAndRender("专注已完成");
}

function resetFocus() {
  state.focusTimer = { title: "", running: false, startedAt: null, elapsedMs: 0 };
  $("#focusTitle").value = "";
  saveAndRender("专注计时已重置");
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
    reasonLabel.textContent = safeScore === 5 ? "为什么今天特别高兴？" : "为什么今天特别不高兴？";
    reasonInput.placeholder = safeScore === 5 ? "记录让你很开心的触发点" : "记录让你不舒服的触发点";
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
  const title = window.prompt("目标名称");
  if (!title) return;
  const keyResult = window.prompt("关键结果", "用一个可衡量结果描述完成标准") || "";
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
  const name = window.prompt("项目名称");
  if (!name) return;
  const role = window.prompt("你的角色", "执行成员") || "执行成员";
  const risk = window.prompt("当前风险", "暂无") || "暂无";
  const next = window.prompt("下一步动作", "补充下一步") || "补充下一步";
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
  link.download = `早日成为富婆-${todayKey()}.json`;
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
  const confirmed = window.confirm("确定重置为演示数据吗？当前本地数据会被覆盖。");
  if (!confirmed) return;
  state = createDefaultState();
  saveAndRender("已重置为演示数据");
}

function renderAll() {
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
  const avgOkr = state.okrs.length ? Math.round(state.okrs.reduce((sum, item) => sum + item.progress, 0) / state.okrs.length) : 0;
  const topTask = todayTasks.slice().sort(sortTasks).find((task) => task.status !== "done") || todayTasks[0];
  const todayMeetings = state.meetings
    .filter((item) => dateKey(new Date(item.when)) === today)
    .sort((a, b) => new Date(a.when) - new Date(b.when));
  const nextMeeting = todayMeetings.find((item) => new Date(item.when) >= new Date()) || todayMeetings[0];

  $("#todayWorkMinutes").textContent = formatMinutes(workMinutes);
  $("#todayFocusMinutes").textContent = formatMinutes(focus);
  $("#todayDoneTasks").textContent = doneToday;
  $("#todayMeetingCount").textContent = meetings;
  $("#sideFocus").textContent = formatMinutes(focus);
  $("#sideTasks").textContent = `${totalTasks - openTasks}/${totalTasks}`;
  $("#sideMeetings").textContent = meetings;
  $("#sideEnergy").textContent = health ? `${health.energy}/5` : "未记录";
  $("#moduleTask").textContent = openTasks;
  $("#moduleOkr").textContent = `${avgOkr}%`;
  $("#moduleMeetings").textContent = meetings;
  $("#moduleManager").textContent = state.managerNotes.length;
  $("#moduleEnergy").textContent = health ? `${health.energy}/5` : "-";
  $("#moduleReview").textContent = state.reviews.length;
  $("#heroTodaySignal").textContent = openCount > 0 ? `进行中 ${openCount}` : openTasks > 0 ? `待推进 ${openTasks}` : "今日清爽";
  $("#heroTodaySignal").className = `status-pill ${openCount > 0 ? "good" : openTasks > 0 ? "warn" : "neutral"}`;
  $("#heroTopTask").textContent = topTask ? topTask.title : "暂无重点任务";
  $("#heroTopTaskMeta").textContent = topTask ? `${statusMap[topTask.status]} · ${topTask.priority}优先级${topTask.due ? ` · ${topTask.due}` : ""}` : "从任务看板添加";
  $("#heroNextMeeting").textContent = nextMeeting ? nextMeeting.title : "暂无会议";
  $("#heroMeetingMeta").textContent = nextMeeting ? `${formatTime(nextMeeting.when)} · ${nextMeeting.type}` : "会议协作中记录";
  $("#heroOkrAvg").textContent = `${avgOkr}%`;
  $("#heroEnergyState").textContent = health ? `${health.energy}/5` : "未记录";
  $("#workStateLabel").textContent = openCount > 0 ? "工作段进行中" : workMinutes > 0 ? "今日已有工作记录" : "尚未开始工作";
  $("#openLogBadge").textContent = openCount > 0 ? `进行中 ${openCount}` : "待开工";
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
                <h3><i data-lucide="timer"></i> ${escapeHtml(item.title || "未命名专注")}</h3>
                <p>${formatTime(item.startedAt)} - ${formatTime(item.endedAt)} · ${formatMinutes(item.minutes)}</p>
              </div>
              <button class="icon-btn" data-delete-id="${item.id}" aria-label="删除专注记录" title="删除专注记录"><i data-lucide="trash-2"></i></button>
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
        <strong>${group.items.length} 条</strong>
      </div>
      <div class="stack-list">
        ${group.items.map((item) => {
          const icon = item.type === "in" ? "log-in" : item.type === "out" ? "log-out" : "umbrella";
          const title = item.type === "leave" ? item.note : item.type === "in" ? "开工" : "收工";
          return `
            <div class="stack-item attendance-item">
              <div class="stack-item-head">
                <div>
                  <h3><i data-lucide="${icon}"></i> ${escapeHtml(title)}</h3>
                  <p>${escapeHtml(item.note || "")}</p>
                </div>
                <div class="attendance-actions">
                  <span class="tag">${formatTime(item.at)}</span>
                  <button class="icon-btn" data-delete-id="${item.id}" aria-label="删除行动记录" title="删除行动记录"><i data-lucide="trash-2"></i></button>
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
  const weekday = date.toLocaleDateString("zh-CN", { weekday: "long" });
  return `${day} ${weekday}`;
}

function renderFocusTimer() {
  const ms = currentFocusMs();
  $("#focusTimer").textContent = formatDuration(ms);
  const timer = state.focusTimer;
  $("#focusState").textContent = timer.running ? "进行中" : ms > 0 ? "已暂停" : "未开始";
  $("#focusState").className = `status-pill ${timer.running ? "good" : "neutral"}`;
  if (timer.title && !$("#focusTitle").value) $("#focusTitle").value = timer.title;
}

function renderTasks() {
  const columns = [
    { key: "todo", title: "待办" },
    { key: "doing", title: "进行中" },
    { key: "done", title: "已完成" }
  ];

  $("#taskSummaryPill").textContent = `${state.tasks.length} 个任务`;
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
  const dueLabel = task.due ? `截止 ${task.due}` : "未设截止";
  const canPrev = task.status !== "todo";
  const canNext = task.status !== "done";
  return `
    <div class="stack-item">
      <div class="stack-item-head">
        <div>
          <h3>${escapeHtml(task.title)}</h3>
          <div class="item-meta">
            <span class="tag ${priority}">${escapeHtml(task.priority)}优先级</span>
            <span class="tag">${escapeHtml(statusMap[task.status])}</span>
            <span class="tag">${escapeHtml(dueLabel)}</span>
            ${task.project ? `<span class="tag">${escapeHtml(task.project)}</span>` : ""}
          </div>
        </div>
      </div>
      <div class="tiny-actions">
        ${canPrev ? `<button data-task-action="prev" data-id="${task.id}">前一列</button>` : ""}
        ${canNext ? `<button data-task-action="next" data-id="${task.id}">后一列</button>` : ""}
        ${task.status !== "done" ? `<button data-task-action="done" data-id="${task.id}">完成</button>` : ""}
        <button data-task-action="delete" data-id="${task.id}">删除</button>
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
        <button class="icon-btn" data-okr-delete data-id="${okr.id}" aria-label="删除目标" title="删除目标"><i data-lucide="trash-2"></i></button>
      </div>
      <div class="progress-wrap">
        <input type="range" min="0" max="100" value="${okr.progress}" data-okr-progress data-id="${okr.id}" aria-label="${escapeHtml(okr.title)}进度">
        <label class="progress-number" aria-label="${escapeHtml(okr.title)}进度百分比">
          <input type="number" min="0" max="100" step="1" inputmode="numeric" value="${okr.progress}" data-okr-number data-id="${okr.id}">
          <span>%</span>
        </label>
      </div>
    </div>
  `).join("") || empty("暂无 OKR");

  $("#projectTable").innerHTML = `
    <div class="table-row header"><span>项目</span><span>角色</span><span>状态</span><span>下一步</span><span></span></div>
    ${state.projects.map((project) => `
      <div class="table-row">
        <strong>${escapeHtml(project.name)}</strong>
        <span>${escapeHtml(project.role)}</span>
        <span class="tag ${project.health === "绿" ? "low" : project.health === "黄" ? "medium" : ""}">${escapeHtml(project.health)}</span>
        <span>${escapeHtml(project.next)}<br><small>${escapeHtml(project.risk)}</small></span>
        <button class="icon-btn" data-project-delete data-id="${project.id}" aria-label="删除项目" title="删除项目"><i data-lucide="trash-2"></i></button>
      </div>
    `).join("")}
  `;
}

function renderMeetings() {
  $("#meetingList").innerHTML = state.meetings.map((meeting) => `
    <div class="stack-item">
      <div class="stack-item-head">
        <div>
          <h3>${escapeHtml(meeting.title)}</h3>
          <div class="item-meta">
            <span class="tag">${escapeHtml(meeting.type)}</span>
            <span class="tag">${formatDateTime(meeting.when)}</span>
          </div>
        </div>
        <button class="icon-btn" data-delete-id="${meeting.id}" aria-label="删除会议" title="删除会议"><i data-lucide="trash-2"></i></button>
      </div>
      <p>${escapeHtml(meeting.decision || "暂无结论")}</p>
      <div class="item-meta">${(meeting.actions || []).map((action) => `<span class="tag">${escapeHtml(action)}</span>`).join("")}</div>
    </div>
  `).join("") || empty("暂无会议记录");
}

function renderManager() {
  $("#managerList").innerHTML = state.managerNotes.map((note) => `
    <div class="stack-item">
      <div class="stack-item-head">
        <div>
          <h3>${escapeHtml(note.topic)}</h3>
          <div class="item-meta"><span class="tag">${formatDateTime(note.createdAt)}</span></div>
        </div>
        <button class="icon-btn" data-delete-id="${note.id}" aria-label="删除同步" title="删除同步"><i data-lucide="trash-2"></i></button>
      </div>
      <p><strong>进展：</strong>${escapeHtml(note.progress || "暂无")}</p>
      <p><strong>风险：</strong>${escapeHtml(note.risk || "暂无")}</p>
      <p><strong>支持：</strong>${escapeHtml(note.ask || "暂无")}</p>
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
              <span class="tag low">能量 ${log.energy}/5</span>
              <span class="tag ${log.load >= 4 ? "high" : "medium"}">压力 ${log.load}/5</span>
              <span class="tag">${log.boundaryDone ? "已准点下线" : "未记录下线"}</span>
            </div>
          </div>
          <button class="icon-btn" data-delete-id="${log.id}" aria-label="删除健康记录" title="删除健康记录"><i data-lucide="trash-2"></i></button>
        </div>
        <p>${escapeHtml(log.note || "暂无备注")}</p>
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
            <div class="item-meta"><span class="tag low">${escapeHtml(moodLabels[review.score] || "满意度")} · ${review.score}/5</span></div>
          </div>
          <button class="icon-btn" data-delete-id="${review.id}" aria-label="删除复盘" title="删除复盘"><i data-lucide="trash-2"></i></button>
        </div>
        <p><strong>成果：</strong>${escapeHtml(review.wins || "暂无")}</p>
        <p><strong>风险：</strong>${escapeHtml(review.risks || "暂无")}</p>
        <p><strong>明日：</strong>${escapeHtml(review.tomorrow || "暂无")}</p>
        ${review.moodReason ? `<p><strong>原因：</strong>${escapeHtml(review.moodReason)}</p>` : ""}
      </div>
    `).join("") || empty("暂无复盘记录");
}

function renderSettings() {
  $("#schemaPreview").textContent = JSON.stringify({
    miniProgramCollections: {
      owners: ["_id", "name", "domain", "role", "createdAt"],
      rhythmLogs: ["_id", "ownerId", "type", "at", "note"],
      tasks: ["_id", "ownerId", "title", "status", "priority", "project", "due", "completedAt"],
      okrs: ["_id", "ownerId", "title", "keyResult", "progress"],
      projects: ["_id", "ownerId", "name", "role", "health", "risk", "next"],
      meetings: ["_id", "ownerId", "title", "type", "when", "decision", "actions"],
      resourceNotes: ["_id", "ownerId", "topic", "progress", "risk", "ask", "createdAt"],
      healthLogs: ["_id", "ownerId", "day", "energy", "load", "boundaryDone", "note"],
      reviews: ["_id", "ownerId", "day", "wins", "risks", "tomorrow", "score", "moodReason"]
    },
    migrationNotes: [
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
  ctx.fillText("任务总数", cx, cy + 26);
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
    const y = 16 + index * 18;
    ctx.fillStyle = color;
    ctx.fillRect(x, y - 8, 10, 10);
    ctx.fillStyle = "#697386";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText(label, x + 16, y + 1);
  });
}

function tickClock() {
  const now = new Date();
  $("#currentDate").textContent = now.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
  $("#currentTime").textContent = now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function buildTimeline(day) {
  const logs = state.attendanceLogs
    .filter((item) => dateKey(new Date(item.at)) === day)
    .map((item) => ({
      at: item.at,
      title: item.type === "in" ? "开工" : item.type === "out" ? "收工" : item.note,
      note: item.type === "leave" ? "休整 / 外出记录" : "工作记录"
    }));

  const meetings = state.meetings
    .filter((item) => dateKey(new Date(item.when)) === day)
    .map((item) => ({ at: item.when, title: item.title, note: item.type }));

  const focus = state.focusSessions
    .filter((item) => dateKey(new Date(item.startedAt)) === day)
    .map((item) => ({ at: item.startedAt, title: item.title, note: `专注 ${item.minutes} 分钟` }));

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
  toastEl.textContent = message;
  toastEl.classList.add("is-visible");
  window.clearTimeout(window.__workspaceToast);
  window.__workspaceToast = window.setTimeout(() => toastEl.classList.remove("is-visible"), 2200);
}

function empty(text) {
  return `<div class="empty">${escapeHtml(text)}</div>`;
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
  return new Date(value).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function formatDateTime(value) {
  const date = new Date(value);
  return `${date.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" })} ${date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
