(() => {
  "use strict";

  const output = document.querySelector("#terminal-output");
  const form = document.querySelector("#terminal-form");
  const input = document.querySelector("#command-input");
  const clearButton = document.querySelector("#clear-button");
  const clock = document.querySelector("#live-clock");
  const welcomeMarkup = document.querySelector("#welcome");
  const commandButtons = document.querySelectorAll("[data-command]");
  const history = [];
  let historyIndex = 0;

  const RESUME = "./resume.pdf";
  const FILES = {
    "about.txt": [
      "Nazmul Hasan Sheum — Senior Backend Engineer - Software Architecture",
      "",
      "Senior Backend Engineer with 7+ years of experience designing, developing, and maintaining production web applications using PHP, Laravel, CodeIgniter, and MySQL.",
      "Experienced in backend architecture, RESTful API design, database performance optimization, application security, and cloud deployments.",
      "I translate business requirements into technical solutions, collaborate directly with customers and stakeholders, and contribute from design through deployment. I also review code, mentor developers, and help lead small engineering teams."
    ].join("\n"),
    "experience.txt": [
      "Brain Station 23 PLC · Senior Software Engineer",
      "Aug 2023–Present",
      "  • Develop and maintain enterprise applications for a major telecommunications client.",
      "  • Collaborate directly with client stakeholders to gather requirements, propose technical solutions, and translate business needs into maintainable software.",
      "  • Lead a team of developers, conduct code reviews, and oversee implementation quality and delivery.",
      "  • Design and optimize backend services, REST APIs, and MySQL queries to improve application performance and reliability.",
      "",
      "Oneixchange LTD, Singapore · Software Engineer",
      "Remote · Jul 2020–Jul 2023",
      "  • Built backend services for business-critical web and mobile applications.",
      "  • Worked with clients on requirements, solution proposals, demos, and deployments.",
      "  • Led a five-member engineering team and supported AWS/GCP delivery.",
      "",
      "Freelance IT Lab · Junior Programmer",
      "Sep 2017–Apr 2019",
      "  • Developed and maintained PHP/CodeIgniter client applications."
    ].join("\n"),
    "projects.txt": [
      "FIXED ASSET MANAGEMENT · TELECOM SECTOR",
      "Backend modules for asset lifecycle workflows, relational data models, enterprise API integrations, and query optimization.",
      "",
      "RELIEF TEACHER SYSTEM · DUNEARN SECONDARY SCHOOL, SINGAPORE",
      "API-first backend supporting web and mobile clients, rule-based allocation, and performance-conscious data access.",
      "",
      "STEM CALENDAR · MINISTRY OF EDUCATION, SINGAPORE",
      "Event listing and registration services, database optimization, and AWS deployment."
    ].join("\n"),
    "skills.txt": [
      "Backend          PHP 8.x · Laravel · CodeIgniter · Python · Flask · JavaScript",
      "Architecture     REST APIs · SOLID · Design Patterns · Modular Architecture",
      "Databases        MySQL · Schema Design · EXPLAIN · Indexing · Query Optimization",
      "Quality          PHPUnit · Unit/Feature Testing · SonarQube · Code Reviews",
      "Security         OWASP Top 10 · Input Validation · Rate Limiting",
      "Reliability      Idempotency · Retry Strategies · Queues · Caching",
      "Cloud & DevOps   AWS · GCP · Docker · Linux · CI/CD",
      "Frontend         Blade · Vue.js · AngularJS · Bootstrap · Tailwind CSS"
    ].join("\n"),
    "achievements.txt": [
      "Star Performer — Performance Excellence Award",
      "Brain Station 23 PLC · SBU PNC & TELCO · 2026",
      "",
      "Star Performer — Performance Excellence Award",
      "Brain Station 23 PLC · SBU PNC & TELCO · 2024",
      "",
      "First Place · Intra-university Programming Contest · 2013",
      "HackerRank · Python Gold Badge",
      "HackerRank · SQL (Intermediate) Certification"
    ].join("\n"),
    "education.txt": [
      "B.Sc. in Computer Science and Engineering",
      "Jashore University of Science and Technology (JUST)",
      "2012–2017"
    ].join("\n"),
    "contact.txt": [
      "Email     nazmulhasansheum@gmail.com",
      "Phone     +880 1722057518",
      "Location  Dhaka, Bangladesh",
      "Availability  Open to remote opportunities",
      "GitHub    https://github.com/mohamadsheam",
      "LinkedIn  https://www.linkedin.com/in/mohammadsheam/"
    ].join("\n")
  };

  const COMMANDS = {
    help: [
      "Available commands:",
      "  help                 Show available commands",
      "  whoami               Show name and role",
      "  about                Professional summary",
      "  experience           Work history",
      "  projects             Selected projects",
      "  skills               Technical toolkit",
      "  achievements         Awards and highlights",
      "  education            Education",
      "  contact              Contact details and profile links",
      "  ls                   List portfolio files",
      "  pwd                  Print current directory",
      "  cat about.txt        Read a portfolio file",
      "  date                 Show current date and time in Dhaka",
      "  resume               Open the PDF resume",
      "  clear                Restore the welcome screen",
      "",
      "Try: cat skills.txt  |  cat projects.txt  |  cat experience.txt"
    ].join("\n"),
    whoami: "Nazmul Hasan Sheum\nSenior Backend Engineer · Software Architecture",
    about: FILES["about.txt"],
    experience: FILES["experience.txt"],
    projects: FILES["projects.txt"],
    skills: FILES["skills.txt"],
    achievements: FILES["achievements.txt"],
    education: FILES["education.txt"],
    contact: FILES["contact.txt"],
    pwd: "/home/nazmul/portfolio",
    ls: "about.txt  achievements.txt  contact.txt  education.txt  experience.txt  projects.txt  skills.txt  resume.pdf",
    date: ""
  };

  const SECTION_COMMANDS = new Set(["about", "experience", "projects", "skills", "achievements", "education"]);

  function appendLine(className, text) {
    const line = document.createElement("div");
    line.className = className;
    line.textContent = text;
    output.append(line);
    return line;
  }

  function scrollToCommandStart(commandLine) {
    if (!commandLine?.isConnected) return;
    const previousSpacer = output.querySelector(".command-scroll-spacer");
    previousSpacer?.remove();
    const outputTop = output.getBoundingClientRect().top;
    const commandTop = commandLine.getBoundingClientRect().top;
    const targetScrollTop = Math.max(0, output.scrollTop + commandTop - outputTop - 8);
    const spacer = document.createElement("div");
    spacer.className = "command-scroll-spacer";
    spacer.setAttribute("aria-hidden", "true");
    spacer.style.height = `${Math.max(0, targetScrollTop + output.clientHeight - output.scrollHeight)}px`;
    output.append(spacer);
    output.scrollTop = targetScrollTop;
  }

  function setActiveShortcut(activeButton) {
    commandButtons.forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function appendSkillRow(section, line) {
    const [label, detail] = line.trim().split(/ {2,}/, 2);
    const row = document.createElement("div");
    row.className = "section-skill";
    if (!detail) {
      row.textContent = line;
    } else {
      const heading = document.createElement("strong");
      heading.className = "section-heading";
      heading.textContent = label;
      const detailNode = document.createElement("span");
      detailNode.className = "section-detail";
      detailNode.textContent = detail;
      row.append(heading, detailNode);
    }
    section.append(row);
  }

  function appendSectionEntry(section, command, entryText) {
    const [title, ...lines] = entryText.split("\n");
    const entry = document.createElement("article");
    entry.className = "section-entry";
    const heading = document.createElement("h3");
    heading.className = "section-heading";
    heading.textContent = title;
    entry.append(heading);

    lines.forEach((line) => {
      const detail = document.createElement("p");
      const isBullet = command === "experience" && line.trimStart().startsWith("•");
      detail.className = isBullet ? "section-detail section-bullet" : "section-detail section-meta";
      detail.textContent = line.trim();
      entry.append(detail);
    });
    section.append(entry);
  }

  function appendAboutEntry(section, text) {
    const [title, ...paragraphs] = text.split("\n").filter(Boolean);
    const entry = document.createElement("article");
    entry.className = "section-entry";
    const heading = document.createElement("h3");
    heading.className = "section-heading";
    heading.textContent = title;
    entry.append(heading);
    paragraphs.forEach((paragraph) => {
      const detail = document.createElement("p");
      detail.className = "section-detail";
      detail.textContent = paragraph;
      entry.append(detail);
    });
    section.append(entry);
  }

  function appendSectionOutput(command, text) {
    const section = document.createElement("div");
    section.className = "response section-output";
    if (command === "skills") {
      text.split("\n").forEach((line) => appendSkillRow(section, line));
    } else if (command === "about") {
      appendAboutEntry(section, text);
    } else {
      text.split(/\n\s*\n/).filter(Boolean).forEach((entry) => appendSectionEntry(section, command, entry));
    }
    output.append(section);
  }

  function appendWhoami() {
    const card = document.createElement("section");
    card.className = "whoami-card response";
    const heading = document.createElement("div");
    heading.className = "whoami-name";
    heading.textContent = "Nazmul Hasan Sheum";
    const role = document.createElement("div");
    role.className = "whoami-role";
    role.textContent = "Senior Backend Engineer | Software Architecture";
    const rows = [
      ["Experience", "7+ years"],
      ["Stack", "PHP 8 · Laravel · MySQL · AWS · GCP · Docker"],
      ["Focus", "REST APIs · Clean Architecture · Performance"]
    ];
    const grid = document.createElement("div");
    grid.className = "whoami-grid";
    for (const [label, value] of rows) {
      const key = document.createElement("span");
      key.className = "whoami-key";
      key.textContent = label;
      const val = document.createElement("span");
      val.className = "whoami-value";
      val.textContent = value;
      grid.append(key, val);
    }
    card.append(heading, role, grid);
    output.append(card);
  }

  function appendLinks() {
    const box = document.createElement("div");
    box.className = "response";
    const links = [
      ["Email", "nazmulhasansheum@gmail.com", "mailto:nazmulhasansheum@gmail.com"],
      ["GitHub", "github.com/mohamadsheam", "https://github.com/mohamadsheam"],
      ["LinkedIn", "linkedin.com/in/mohammadsheam", "https://www.linkedin.com/in/mohammadsheam/"]
    ];
    for (const [label, text, url] of links) {
      const line = document.createElement("div");
      const labelNode = document.createElement("span");
      labelNode.className = "response-muted";
      labelNode.textContent = label.padEnd(10);
      const link = document.createElement("a");
      link.href = url;
      link.textContent = text;
      if (url.startsWith("https://")) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      line.append(labelNode, link);
      box.append(line);
    }
    box.append(document.createTextNode("\nPhone: +880 1722057518 · Dhaka, Bangladesh · Open to remote"));
    output.append(box);
  }

  function openResume() {
    const box = document.createElement("div");
    box.className = "response";
    const link = document.createElement("a");
    link.href = RESUME;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open resume.pdf";
    box.append(link);
    output.append(box);
  }

  function updateClock() {
    const now = new Date();
    const time = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
    }).format(now);
    const dateTime = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Dhaka", dateStyle: "medium", timeStyle: "long"
    }).format(now);
    clock.textContent = time + " BDT";
    clock.dateTime = now.toISOString();
    clock.title = "Dhaka time: " + dateTime;
  }

  function resetTerminal() {
    output.replaceChildren(welcomeMarkup);
    output.scrollTop = 0;
    setActiveShortcut(null);
  }

  function appendDate() {
    const dateText = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Dhaka", dateStyle: "full", timeStyle: "long"
    }).format(new Date());
    appendLine("response", dateText);
  }

  function runFileCommand(fileName) {
    if (fileName === "resume.pdf") {
      openResume();
      return;
    }
    if (!Object.hasOwn(FILES, fileName)) {
      appendLine("response", `cat: ${fileName}: No such file\nUse 'ls' to list available files.`);
      return;
    }

    const sectionCommand = fileName.replace(/\.txt$/, "");
    if (SECTION_COMMANDS.has(sectionCommand)) {
      appendSectionOutput(sectionCommand, FILES[fileName]);
    } else {
      appendLine("response", FILES[fileName]);
    }
  }

  function appendCommandResponse(command) {
    if (SECTION_COMMANDS.has(command)) {
      appendSectionOutput(command, COMMANDS[command]);
    } else {
      appendLine("response", COMMANDS[command]);
    }
  }

  function runCommand(raw) {
    const command = raw.trim();
    if (!command) return;
    output.querySelector(".command-scroll-spacer")?.remove();
    const commandLine = appendLine("command-line", `visitor@sheum:~$ ${command}`);

    const normalized = command.toLowerCase().replace(/\s+/g, " ");
    const specialCommands = {
      clear: resetTerminal,
      whoami: appendWhoami,
      resume: openResume,
      contact: appendLinks,
      date: appendDate
    };
    if (Object.hasOwn(specialCommands, normalized)) {
      specialCommands[normalized]();
      return commandLine;
    }

    const catMatch = normalized.match(/^cat\s+([a-z0-9._-]+)$/);
    if (catMatch) {
      runFileCommand(catMatch[1]);
      return commandLine;
    }

    if (Object.hasOwn(COMMANDS, normalized)) {
      appendCommandResponse(normalized);
      return commandLine;
    }

    appendLine("response", `command not found: ${command}\nType 'help' to see available commands.`);
    return commandLine;
  }

  function submit(command) {
    history.push(command);
    historyIndex = history.length;
    scrollToCommandStart(runCommand(command));
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (input.value.trim()) submit(input.value);
    input.value = "";
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length) {
        historyIndex = Math.max(0, historyIndex - 1);
        input.value = history[historyIndex] || "";
        input.setSelectionRange(input.value.length, input.value.length);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = history[historyIndex] || "";
      input.setSelectionRange(input.value.length, input.value.length);
    }
  });

  clearButton.addEventListener("click", () => {
    output.replaceChildren(welcomeMarkup);
    output.scrollTop = 0;
    setActiveShortcut(null);
  });

  commandButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const command = button.dataset.command;
      history.push(command);
      historyIndex = history.length;
      scrollToCommandStart(runCommand(command));
      setActiveShortcut(button);
    });
  });

  updateClock();
  window.setInterval(updateClock, 1000);
})();
