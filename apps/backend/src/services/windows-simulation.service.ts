import { AppError } from "../utils/AppError";

interface WindowsFileSystem {
  [path: string]: {
    type: "file" | "directory";
    content?: string;
    children?: string[];
    permissions?: string;
    owner?: string;
    size?: number;
    modified?: string;
  };
}

interface WindowsUser {
  name: string;
  fullName: string;
  active: boolean;
  admin: boolean;
  lastLogin: string;
  passwordLastSet: string;
}

interface WindowsProcess {
  imageName: string;
  pid: number;
  sessionName: string;
  sessionNum: number;
  memUsage: string;
  status: string;
  username: string;
  suspicious?: boolean;
}

interface WindowsEventLog {
  timeGenerated: string;
  source: string;
  eventId: number;
  level: string;
  message: string;
  suspicious?: boolean;
}

interface WindowsEnvironment {
  currentDirectory: string;
  computerName: string;
  username: string;
  domain: string;
  fileSystem: WindowsFileSystem;
  users: WindowsUser[];
  processes: WindowsProcess[];
  eventLogs: WindowsEventLog[];
  systemInfo: Record<string, string>;
}

const DEFAULT_ENV: WindowsEnvironment = {
  currentDirectory: "C:\\Users\\trainee",
  computerName: "SHAKED-LAB-PC",
  username: "trainee",
  domain: "SHAKED-LAB",
  fileSystem: {
    "C:\\": { type: "directory", children: ["Users", "Windows", "Program Files", "ProgramData", "Temp"] },
    "C:\\Users": { type: "directory", children: ["trainee", "Administrator", "Public", "svc_backup"] },
    "C:\\Users\\trainee": { type: "directory", children: ["Desktop", "Documents", "Downloads", ".config"] },
    "C:\\Users\\trainee\\Desktop": { type: "directory", children: ["readme.txt", "notes.txt"] },
    "C:\\Users\\trainee\\Desktop\\readme.txt": { type: "file", content: "Welcome to Windows Fundamentals Lab\nComplete the objectives to earn XP.", size: 72, modified: "2025-12-15 09:00:00" },
    "C:\\Users\\trainee\\Desktop\\notes.txt": { type: "file", content: "TODO: Check event logs for suspicious activity\nReview user accounts", size: 65, modified: "2025-12-20 14:30:00" },
    "C:\\Users\\trainee\\Documents": { type: "directory", children: ["report.docx", "config.ini"] },
    "C:\\Users\\trainee\\Documents\\config.ini": { type: "file", content: "[Database]\nServer=192.168.1.50\nPort=1433\nUser=sa\nPassword=S3cretP@ss!", size: 80, modified: "2025-12-18 11:00:00" },
    "C:\\Users\\trainee\\Downloads": { type: "directory", children: [] },
    "C:\\Users\\trainee\\.config": { type: "directory", children: ["credentials.xml"] },
    "C:\\Users\\trainee\\.config\\credentials.xml": { type: "file", content: "<credentials>\n  <entry service=\"backup\" user=\"svc_backup\" token=\"FLAG{w1nd0ws_cr3d_f0und}\" />\n</credentials>", size: 110, modified: "2025-11-01 08:00:00" },
    "C:\\Users\\Administrator": { type: "directory", children: ["Desktop"], permissions: "SYSTEM", owner: "Administrator" },
    "C:\\Users\\svc_backup": { type: "directory", children: ["backup_log.txt"], owner: "svc_backup" },
    "C:\\Users\\svc_backup\\backup_log.txt": { type: "file", content: "2025-12-20 03:00 - Backup completed\n2025-12-21 03:00 - Backup failed: access denied\n2025-12-22 03:00 - Backup completed", size: 150, modified: "2025-12-22 03:00:00" },
    "C:\\Windows": { type: "directory", children: ["System32", "Logs"] },
    "C:\\Windows\\System32": { type: "directory", children: ["cmd.exe", "config"] },
    "C:\\Windows\\Logs": { type: "directory", children: ["security.evtx"] },
    "C:\\Program Files": { type: "directory", children: ["Common Files", "Windows Defender"] },
    "C:\\ProgramData": { type: "directory", children: ["Microsoft"] },
    "C:\\Temp": { type: "directory", children: ["debug.log", "shell.exe"] },
    "C:\\Temp\\debug.log": { type: "file", content: "2025-12-22 02:15 - Connection attempt from 10.0.0.99\n2025-12-22 02:15 - Reverse shell established\n2025-12-22 02:16 - Privilege escalation attempted\n2025-12-22 02:17 - Data exfiltration started", size: 200, modified: "2025-12-22 02:17:00" },
    "C:\\Temp\\shell.exe": { type: "file", content: "[BINARY - Suspicious executable]", size: 45056, modified: "2025-12-22 02:14:00" },
  },
  users: [
    { name: "trainee", fullName: "Lab Trainee", active: true, admin: false, lastLogin: "2025-12-22 09:00:00", passwordLastSet: "2025-12-01 00:00:00" },
    { name: "Administrator", fullName: "Built-in Administrator", active: true, admin: true, lastLogin: "2025-12-22 02:14:00", passwordLastSet: "2025-06-15 00:00:00" },
    { name: "svc_backup", fullName: "Backup Service", active: true, admin: true, lastLogin: "2025-12-22 03:00:00", passwordLastSet: "2025-01-01 00:00:00" },
    { name: "Guest", fullName: "Guest Account", active: false, admin: false, lastLogin: "Never", passwordLastSet: "Never" },
  ],
  processes: [
    { imageName: "System", pid: 4, sessionName: "Services", sessionNum: 0, memUsage: "136 K", status: "Running", username: "NT AUTHORITY\\SYSTEM" },
    { imageName: "svchost.exe", pid: 812, sessionName: "Services", sessionNum: 0, memUsage: "24,560 K", status: "Running", username: "NT AUTHORITY\\SYSTEM" },
    { imageName: "explorer.exe", pid: 3204, sessionName: "Console", sessionNum: 1, memUsage: "85,400 K", status: "Running", username: "SHAKED-LAB\\trainee" },
    { imageName: "cmd.exe", pid: 4580, sessionName: "Console", sessionNum: 1, memUsage: "5,120 K", status: "Running", username: "SHAKED-LAB\\trainee" },
    { imageName: "shell.exe", pid: 6660, sessionName: "Console", sessionNum: 0, memUsage: "12,288 K", status: "Running", username: "NT AUTHORITY\\SYSTEM", suspicious: true },
    { imageName: "tasklist.exe", pid: 7000, sessionName: "Console", sessionNum: 1, memUsage: "8,192 K", status: "Running", username: "SHAKED-LAB\\trainee" },
    { imageName: "WindowsDefender.exe", pid: 1520, sessionName: "Services", sessionNum: 0, memUsage: "45,000 K", status: "Running", username: "NT AUTHORITY\\SYSTEM" },
    { imageName: "powershell.exe", pid: 8080, sessionName: "Console", sessionNum: 0, memUsage: "78,000 K", status: "Running", username: "NT AUTHORITY\\SYSTEM", suspicious: true },
  ],
  eventLogs: [
    { timeGenerated: "2025-12-22 09:00:00", source: "Security", eventId: 4624, level: "Information", message: "An account was successfully logged on. Account: trainee" },
    { timeGenerated: "2025-12-22 02:14:00", source: "Security", eventId: 4624, level: "Information", message: "An account was successfully logged on. Account: Administrator", suspicious: true },
    { timeGenerated: "2025-12-22 02:14:30", source: "Security", eventId: 4672, level: "Information", message: "Special privileges assigned to new logon. Account: Administrator", suspicious: true },
    { timeGenerated: "2025-12-22 02:15:00", source: "Security", eventId: 4688, level: "Information", message: "A new process has been created. Process: C:\\Temp\\shell.exe Creator: Administrator", suspicious: true },
    { timeGenerated: "2025-12-22 02:16:00", source: "Security", eventId: 4648, level: "Warning", message: "A logon was attempted using explicit credentials. Target: SHAKED-LAB\\svc_backup", suspicious: true },
    { timeGenerated: "2025-12-22 03:00:00", source: "Application", eventId: 1001, level: "Information", message: "Backup job completed successfully." },
    { timeGenerated: "2025-12-21 03:00:00", source: "Application", eventId: 1002, level: "Error", message: "Backup job failed: access denied to target share." },
    { timeGenerated: "2025-12-20 14:30:00", source: "System", eventId: 7036, level: "Information", message: "Windows Update service entered the running state." },
  ],
  systemInfo: {
    "Host Name": "SHAKED-LAB-PC",
    "OS Name": "Microsoft Windows 11 Pro (Simulated)",
    "OS Version": "10.0.22631 Build 22631",
    "System Manufacturer": "Virtual Lab",
    "System Model": "Shaked-Hack-Lab VM",
    "System Type": "x64-based PC",
    "Processor": "Intel Core i7-12700 (Simulated)",
    "Total Physical Memory": "8,192 MB",
    "Available Physical Memory": "4,096 MB",
    "Domain": "SHAKED-LAB",
    "Logon Server": "\\\\SHAKED-LAB-DC",
    "Hotfix(s)": "3 Hotfix(s) Installed",
    "Network Card(s)": "1 NIC(s) Installed - Intel Ethernet (10.0.0.50)",
  },
};

const sessionEnvironments = new Map<string, WindowsEnvironment>();

export function getOrCreateSession(sessionKey: string): WindowsEnvironment {
  let env = sessionEnvironments.get(sessionKey);
  if (!env) {
    env = JSON.parse(JSON.stringify(DEFAULT_ENV));
    sessionEnvironments.set(sessionKey, env!);
  }
  return env!;
}

export function resetSession(sessionKey: string): void {
  sessionEnvironments.delete(sessionKey);
}

export function executeWindowsCommand(
  sessionKey: string,
  rawCommand: string
): { command: string; output: string; exitCode: number; cwd: string } {
  const env = getOrCreateSession(sessionKey);
  const trimmed = rawCommand.trim();
  const parts = trimmed.split(/\s+/);
  const cmd = (parts[0] ?? "").toLowerCase();
  const args = parts.slice(1);

  const ALLOWED_COMMANDS = [
    "dir", "cd", "tree", "type", "whoami", "net",
    "systeminfo", "tasklist", "echo", "cls", "help",
    "hostname", "ipconfig", "findstr", "more",
  ];

  if (!ALLOWED_COMMANDS.includes(cmd)) {
    return {
      command: trimmed,
      output: `'${cmd}' is not recognized as an internal or external command,\noperable program or batch file.`,
      exitCode: 1,
      cwd: env.currentDirectory,
    };
  }

  let output = "";
  let exitCode = 0;

  switch (cmd) {
    case "dir": {
      const targetPath = args.length > 0 ? resolvePath(env.currentDirectory, args.join(" ")) : env.currentDirectory;
      const entry = env.fileSystem[targetPath];
      if (!entry || entry.type !== "directory") {
        output = "File Not Found";
        exitCode = 1;
        break;
      }
      const children = entry.children ?? [];
      output = ` Volume in drive C has no label.\n Volume Serial Number is ABCD-1234\n\n Directory of ${targetPath}\n\n`;
      output += `${"2025-12-22".padEnd(12)}${"09:00 AM".padEnd(12)}${"<DIR>".padEnd(16)}.
`;
      output += `${"2025-12-22".padEnd(12)}${"09:00 AM".padEnd(12)}${"<DIR>".padEnd(16)}..
`;
      for (const child of children) {
        const childPath = targetPath.endsWith("\\") ? `${targetPath}${child}` : `${targetPath}\\${child}`;
        const childEntry = env.fileSystem[childPath];
        if (childEntry?.type === "directory") {
          output += `${"2025-12-22".padEnd(12)}${"09:00 AM".padEnd(12)}${"<DIR>".padEnd(16)}${child}\n`;
        } else {
          const size = childEntry?.size ?? 0;
          output += `${"2025-12-22".padEnd(12)}${"09:00 AM".padEnd(12)}${String(size).padStart(14)} ${child}\n`;
        }
      }
      output += `               ${children.length} File(s)\n`;
      break;
    }

    case "cd": {
      if (args.length === 0) {
        output = env.currentDirectory;
        break;
      }
      const target = resolvePath(env.currentDirectory, args.join(" "));
      const entry = env.fileSystem[target];
      if (entry?.type === "directory") {
        env.currentDirectory = target;
        output = "";
      } else {
        output = "The system cannot find the path specified.";
        exitCode = 1;
      }
      break;
    }

    case "tree": {
      const targetPath = args.length > 0 ? resolvePath(env.currentDirectory, args.join(" ")) : env.currentDirectory;
      output = buildTree(env.fileSystem, targetPath, "");
      break;
    }

    case "type": {
      if (args.length === 0) {
        output = "The syntax of the command is incorrect.";
        exitCode = 1;
        break;
      }
      const filePath = resolvePath(env.currentDirectory, args.join(" "));
      const fileEntry = env.fileSystem[filePath];
      if (!fileEntry || fileEntry.type !== "file") {
        output = "The system cannot find the file specified.";
        exitCode = 1;
      } else {
        output = fileEntry.content ?? "";
      }
      break;
    }

    case "whoami": {
      output = `${env.domain.toLowerCase()}\\${env.username}`;
      break;
    }

    case "hostname": {
      output = env.computerName;
      break;
    }

    case "net": {
      const subCmd = (args[0] ?? "").toLowerCase();
      if (subCmd === "user") {
        if (args.length > 1) {
          const targetUser = args[1]!;
          const user = env.users.find(
            (u) => u.name.toLowerCase() === targetUser.toLowerCase()
          );
          if (!user) {
            output = `The user name could not be found.`;
            exitCode = 1;
          } else {
            output = `User name                    ${user.name}\n`;
            output += `Full Name                    ${user.fullName}\n`;
            output += `Account active               ${user.active ? "Yes" : "No"}\n`;
            output += `Local Group Memberships      ${user.admin ? "*Administrators" : "*Users"}\n`;
            output += `Last logon                   ${user.lastLogin}\n`;
            output += `Password last set            ${user.passwordLastSet}\n`;
          }
        } else {
          output = `User accounts for \\\\${env.computerName}\n\n`;
          output += "-------------------------------------------------------------------------------\n";
          for (const u of env.users) {
            output += `${u.name}\n`;
          }
          output += `The command completed successfully.\n`;
        }
      } else if (subCmd === "localgroup") {
        if (args.length > 1 && args[1]!.toLowerCase() === "administrators") {
          output = `Alias name     Administrators\nComment        Administrators have complete and unrestricted access\n\nMembers\n\n-------------------------------------------------------------------------------\n`;
          for (const u of env.users.filter((u) => u.admin)) {
            output += `${u.name}\n`;
          }
          output += `The command completed successfully.\n`;
        } else {
          output = `Aliases for \\\\${env.computerName}\n\n*Administrators\n*Users\n*Guests\n*Backup Operators\nThe command completed successfully.\n`;
        }
      } else {
        output = "The syntax of this command is:\n\nNET USER [username]\nNET LOCALGROUP [groupname]";
      }
      break;
    }

    case "systeminfo": {
      output = "";
      for (const [key, value] of Object.entries(env.systemInfo)) {
        output += `${key.padEnd(35)}${value}\n`;
      }
      break;
    }

    case "tasklist": {
      output = "\nImage Name                     PID Session Name        Session#    Mem Usage\n";
      output += "========================= ======== ================ =========== ============\n";
      for (const proc of env.processes) {
        output += `${proc.imageName.padEnd(26)}${String(proc.pid).padStart(8)} ${proc.sessionName.padEnd(17)}${String(proc.sessionNum).padStart(11)} ${proc.memUsage.padStart(12)}\n`;
      }
      break;
    }

    case "echo": {
      output = args.join(" ");
      break;
    }

    case "cls": {
      output = "\x1b[2J\x1b[H";
      break;
    }

    case "ipconfig": {
      output = `\nWindows IP Configuration\n\nEthernet adapter Ethernet0:\n\n   Connection-specific DNS Suffix  . : shaked-lab.local\n   IPv4 Address. . . . . . . . . . . : 10.0.0.50\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . : 10.0.0.1\n`;
      break;
    }

    case "findstr": {
      if (args.length < 2) {
        output = "FINDSTR: Bad command line";
        exitCode = 2;
        break;
      }
      const pattern = args[0]!.replace(/"/g, "");
      const searchPath = resolvePath(env.currentDirectory, args[1]!);
      const searchEntry = env.fileSystem[searchPath];
      if (!searchEntry || searchEntry.type !== "file") {
        output = "File not found - " + args[1];
        exitCode = 1;
      } else {
        const lines = (searchEntry.content ?? "").split("\n");
        const matches = lines.filter((l) =>
          l.toLowerCase().includes(pattern.toLowerCase())
        );
        output = matches.join("\n");
        if (matches.length === 0) exitCode = 1;
      }
      break;
    }

    case "more": {
      if (args.length === 0) {
        output = "Cannot access file ";
        exitCode = 1;
        break;
      }
      const morePath = resolvePath(env.currentDirectory, args.join(" "));
      const moreEntry = env.fileSystem[morePath];
      if (!moreEntry || moreEntry.type !== "file") {
        output = "Cannot access file " + args.join(" ");
        exitCode = 1;
      } else {
        output = moreEntry.content ?? "";
      }
      break;
    }

    case "help": {
      output = "Available commands:\n\n";
      output += "DIR          Displays a list of files and subdirectories.\n";
      output += "CD           Displays or changes the current directory.\n";
      output += "TREE         Graphically displays the directory structure.\n";
      output += "TYPE         Displays the contents of a text file.\n";
      output += "WHOAMI       Displays the current user.\n";
      output += "HOSTNAME     Displays the computer name.\n";
      output += "NET USER     Displays user account information.\n";
      output += "SYSTEMINFO   Displays system configuration.\n";
      output += "TASKLIST     Displays running processes.\n";
      output += "IPCONFIG     Displays IP configuration.\n";
      output += "FINDSTR      Searches for strings in files.\n";
      output += "ECHO         Displays messages.\n";
      output += "CLS          Clears the screen.\n";
      break;
    }

    default: {
      output = `'${cmd}' is not recognized.`;
      exitCode = 1;
    }
  }

  return {
    command: trimmed,
    output,
    exitCode,
    cwd: env.currentDirectory,
  };
}

function resolvePath(cwd: string, relative: string): string {
  const cleaned = relative.replace(/"/g, "").replace(/\//g, "\\").trim();
  if (/^[a-zA-Z]:\\/.test(cleaned)) return cleaned;
  if (cleaned === "..") {
    const parts = cwd.split("\\");
    if (parts.length > 1) {
      parts.pop();
      return parts.join("\\") || "C:\\";
    }
    return cwd;
  }
  if (cleaned === ".") return cwd;
  return cwd.endsWith("\\") ? `${cwd}${cleaned}` : `${cwd}\\${cleaned}`;
}

function buildTree(
  fs: WindowsFileSystem,
  path: string,
  prefix: string,
  depth: number = 0
): string {
  if (depth > 5) return "";
  const entry = fs[path];
  if (!entry || entry.type !== "file") {
    const name = path.split("\\").pop() ?? path;
    let result = depth === 0 ? `${path}\n` : "";
    const children = entry?.children ?? [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i]!;
      const isLast = i === children.length - 1;
      const connector = isLast ? "\\---" : "+---";
      const nextPrefix = prefix + (isLast ? "    " : "|   ");
      const childPath = path.endsWith("\\") ? `${path}${child}` : `${path}\\${child}`;
      const childEntry = fs[childPath];
      result += `${prefix}${connector}${child}\n`;
      if (childEntry?.type === "directory") {
        result += buildTree(fs, childPath, nextPrefix, depth + 1);
      }
    }
    return result;
  }
  return "";
}
