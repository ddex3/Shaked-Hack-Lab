import type { Course } from "../types/course.types";

export const WINDOWS_FUNDAMENTALS_COURSE: Course = {
  id: "windows-fundamentals",
  title: "Windows Fundamentals",
  description: "Learn the essential Windows command-line skills every cybersecurity professional needs. Master file system navigation, user and permission management, system information gathering, and log analysis using built-in Windows tools.",
  level: "Beginner",
  category: "Windows Fundamentals",
  estimatedDuration: "5 hours",
  sections: [
    {
      id: "sec-win-filesystem",
      title: "Windows File System",
      lessons: [
        {
          id: "lesson-win-dir",
          title: "Listing Files with dir",
          order: 1,
          content: [
            { type: "heading", content: "The dir Command" },
            { type: "text", content: "The dir command is the Windows equivalent of the Linux ls command. It lists the files and directories within the current working directory or a specified path. Understanding dir and its switches is fundamental for navigating and auditing file systems from the Windows command prompt." },
            { type: "code", language: "cmd", content: "C:\\Users\\admin> dir\n Volume in drive C has no label.\n Volume Serial Number is A1B2-C3D4\n\n Directory of C:\\Users\\admin\n\n03/01/2026  09:15 AM    <DIR>          .\n03/01/2026  09:15 AM    <DIR>          ..\n02/28/2026  02:30 PM    <DIR>          Desktop\n02/28/2026  02:30 PM    <DIR>          Documents\n01/15/2026  11:00 AM           142,336  notes.txt\n               1 File(s)        142,336 bytes\n               4 Dir(s)  58,320,896,000 bytes free" },
            { type: "list", items: [
              "dir /a displays all files including hidden and system files",
              "dir /s performs a recursive search through all subdirectories",
              "dir /o:n sorts results by name; /o:d sorts by date; /o:s sorts by size",
              "dir /b outputs bare file names without headers or summaries",
              "dir /q shows the owner of each file, useful for auditing permissions"
            ] },
            { type: "alert", variant: "info", content: "In penetration testing and incident response, 'dir /a /s /q' is a powerful combination that recursively lists every file, including hidden ones, along with their owners." },
          ],
          challenges: [
            {
              id: "ch-win-dir-1", type: "multiple-choice", difficulty: "Beginner", xpReward: 20,
              question: "Which dir switch displays hidden and system files that are not shown by default?",
              options: ["dir /s", "dir /a", "dir /b", "dir /q"], correctAnswer: "dir /a",
              explanation: "The /a switch shows all files regardless of their attributes, including hidden (H) and system (S) files that dir hides by default.",
            },
            {
              id: "ch-win-dir-2", type: "true-false", difficulty: "Beginner", xpReward: 15,
              question: "The dir /s switch searches only the current directory and does not recurse into subdirectories.",
              options: ["True", "False"], correctAnswer: "False",
              explanation: "The /s switch performs a recursive search, descending into every subdirectory beneath the specified path and listing their contents.",
            },
            {
              id: "ch-win-dir-3", type: "multiple-choice", difficulty: "Beginner", xpReward: 20,
              question: "Which dir switch displays the owner of each file?",
              options: ["dir /o", "dir /q", "dir /w", "dir /p"], correctAnswer: "dir /q",
              explanation: "The /q switch displays the file owner next to each entry. This is valuable during security audits to verify who owns sensitive files.",
            },
          ],
        },
        {
          id: "lesson-win-cd",
          title: "Navigating with cd and Paths",
          order: 2,
          content: [
            { type: "heading", content: "Changing Directories" },
            { type: "text", content: "The cd (change directory) command moves your command prompt session to a different directory. Windows paths use backslashes and drive letters, which differs from Unix-based systems. Understanding absolute versus relative paths is essential for efficient navigation." },
            { type: "code", language: "cmd", content: "C:\\> cd Users\\admin\\Desktop\nC:\\Users\\admin\\Desktop>\n\nC:\\Users\\admin\\Desktop> cd ..\nC:\\Users\\admin>\n\nC:\\Users\\admin> cd /d D:\\Backups\nD:\\Backups>\n\nC:\\> cd %USERPROFILE%\nC:\\Users\\admin>" },
            { type: "list", items: [
              "cd .. moves one level up to the parent directory",
              "cd \\ moves to the root of the current drive",
              "cd /d D:\\path switches both drive and directory in one command",
              "%USERPROFILE% expands to the current user's home directory (e.g., C:\\Users\\admin)",
              "Typing a drive letter followed by a colon (e.g., D:) switches to that drive"
            ] },
            { type: "alert", variant: "warning", content: "Without the /d switch, cd will not change drives. Running 'cd D:\\Backups' from C:\\ will update the stored path for D: but keep you on the C: drive." },
          ],
          challenges: [
            {
              id: "ch-win-cd-1", type: "multiple-choice", difficulty: "Beginner", xpReward: 20,
              question: "Which command changes both the drive and directory to D:\\Logs in a single step?",
              options: ["cd D:\\Logs", "cd /d D:\\Logs", "chdir /s D:\\Logs", "cd -d D:\\Logs"], correctAnswer: "cd /d D:\\Logs",
              explanation: "The /d switch tells cd to change the current drive in addition to the directory. Without it, cd only updates the stored directory for the target drive.",
            },
            {
              id: "ch-win-cd-2", type: "true-false", difficulty: "Beginner", xpReward: 15,
              question: "The command 'cd ..' moves to the parent directory of the current working directory.",
              options: ["True", "False"], correctAnswer: "True",
              explanation: "The double-dot (..) notation is a universal shorthand for the parent directory. cd .. moves you one level up in the directory hierarchy.",
            },
            {
              id: "ch-win-cd-3", type: "multiple-choice", difficulty: "Beginner", xpReward: 20,
              question: "What does the environment variable %USERPROFILE% typically expand to?",
              options: ["C:\\Windows", "C:\\Users\\Public", "C:\\Users\\<current username>", "C:\\ProgramData"], correctAnswer: "C:\\Users\\<current username>",
              explanation: "%USERPROFILE% points to the home directory of the currently logged-in user, such as C:\\Users\\admin. It is commonly used in scripts for portability.",
            },
          ],
        },
        {
          id: "lesson-win-tree",
          title: "Visualizing Structure with tree",
          order: 3,
          content: [
            { type: "heading", content: "The tree Command" },
            { type: "text", content: "The tree command displays the directory structure of a path as a graphical tree in the console. It is particularly useful during security assessments for quickly understanding the layout of a file system, identifying unusual directory structures, or documenting the hierarchy of a compromised host." },
            { type: "code", language: "cmd", content: "C:\\Projects> tree\nFolder PATH listing\nC:\\PROJECTS\n|-- webapp\n|   |-- src\n|   |   |-- index.html\n|   |   |-- app.js\n|   |-- config\n|       |-- settings.json\n|-- database\n    |-- schema.sql\n\nC:\\Projects> tree /f\n(same output but includes file names)\n\nC:\\Projects> tree /a\n(uses ASCII characters instead of extended box-drawing characters)" },
            { type: "list", items: [
              "tree with no switches shows only directories, not files",
              "tree /f includes file names in the output alongside directories",
              "tree /a uses ASCII characters (+, -, |) instead of Unicode line-drawing characters",
              "Combine with > to redirect output to a file: tree /f > structure.txt"
            ] },
            { type: "alert", variant: "info", content: "During incident response, running 'tree /f C:\\ > C:\\evidence\\tree_output.txt' captures the entire file system structure for offline analysis. This can reveal suspicious directories created by malware." },
          ],
          challenges: [
            {
              id: "ch-win-tree-1", type: "multiple-choice", difficulty: "Beginner", xpReward: 20,
              question: "Which switch makes the tree command display file names in addition to directories?",
              options: ["/a", "/f", "/s", "/d"], correctAnswer: "/f",
              explanation: "The /f switch tells tree to display the names of files in each directory. Without it, tree shows only the folder structure.",
            },
            {
              id: "ch-win-tree-2", type: "true-false", difficulty: "Beginner", xpReward: 15,
              question: "By default, the tree command displays both files and directories.",
              options: ["True", "False"], correctAnswer: "False",
              explanation: "By default tree only displays directory names. You need to add the /f switch to include file names in the output.",
            },
          ],
        },
      ],
    },
    {
      id: "sec-win-users-permissions",
      title: "User and Permission Concepts",
      lessons: [
        {
          id: "lesson-win-whoami",
          title: "Identifying the Current User",
          order: 4,
          content: [
            { type: "heading", content: "whoami and User Context" },
            { type: "text", content: "The whoami command displays the domain and username of the currently logged-in user. In cybersecurity, knowing your user context is the first step in privilege escalation assessments and post-exploitation enumeration. Extended switches reveal group memberships and privilege tokens assigned to your session." },
            { type: "code", language: "cmd", content: "C:\\> whoami\ndesktop-lab\\admin\n\nC:\\> whoami /priv\nPRIVILEGE INFORMATION\n---------------------\nPrivilege Name                  Description                    State\n=============================== ============================== ========\nSeShutdownPrivilege             Shut down the system           Disabled\nSeChangeNotifyPrivilege         Bypass traverse checking       Enabled\nSeIncreaseWorkingSetPrivilege   Increase a process working set Disabled\n\nC:\\> whoami /groups\nGROUP INFORMATION\n-----------------\nGroup Name                       Type       SID          Attributes\n================================ ========== ============ ===========\nBUILTIN\\Administrators           Alias      S-1-5-32-544 Group used for deny only\nBUILTIN\\Users                    Alias      S-1-5-32-545 Mandatory group" },
            { type: "list", items: [
              "whoami displays DOMAIN\\username of the current session",
              "whoami /priv lists all privileges assigned to the current access token",
              "whoami /groups shows security group memberships for the current user",
              "whoami /all combines user, group, and privilege information in one output"
            ] },
            { type: "alert", variant: "danger", content: "If whoami /priv shows SeDebugPrivilege or SeImpersonatePrivilege as Enabled, the current user has powerful capabilities that can be leveraged for privilege escalation." },
          ],
          challenges: [
            {
              id: "ch-win-whoami-1", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
              question: "Which whoami switch displays the security privileges assigned to the current access token?",
              options: ["whoami /user", "whoami /groups", "whoami /priv", "whoami /sid"], correctAnswer: "whoami /priv",
              explanation: "The /priv switch lists all privileges assigned to the current user's token, such as SeShutdownPrivilege or SeDebugPrivilege, along with their enabled or disabled state.",
            },
            {
              id: "ch-win-whoami-2", type: "true-false", difficulty: "Beginner", xpReward: 20,
              question: "The SeDebugPrivilege token is a low-risk privilege that has no significance in privilege escalation.",
              options: ["True", "False"], correctAnswer: "False",
              explanation: "SeDebugPrivilege allows a process to debug and adjust the memory of any process. Attackers can use it to inject code into privileged processes, making it highly significant for escalation.",
            },
            {
              id: "ch-win-whoami-3", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
              question: "What does the 'whoami /all' command display?",
              options: ["Only the username", "Username and SID only", "User, group, and privilege information combined", "A list of all users on the system"], correctAnswer: "User, group, and privilege information combined",
              explanation: "The /all switch combines the output of /user, /groups, and /priv into a single comprehensive view of the current user's security context.",
            },
          ],
        },
        {
          id: "lesson-win-net-user",
          title: "Managing Users with net user",
          order: 5,
          content: [
            { type: "heading", content: "net user and Local Accounts" },
            { type: "text", content: "The net user command lets you enumerate and manage local user accounts on a Windows system. During a security assessment, it provides quick visibility into the accounts that exist on a machine, which accounts are active, when passwords were last set, and whether accounts have administrative privileges." },
            { type: "code", language: "cmd", content: "C:\\> net user\nUser accounts for \\\\DESKTOP-LAB\n----------------------------------------------\nAdministrator            DefaultAccount           Guest\nadmin                    svc_backup               WDAGUtilityAccount\nThe command completed successfully.\n\nC:\\> net user admin\nUser name                    admin\nFull Name                    Lab Admin\nAccount active               Yes\nPassword last set            2/15/2026 10:30:00 AM\nPassword expires             Never\nLocal Group Memberships      *Administrators       *Users\nGlobal Group memberships     *None" },
            { type: "list", items: [
              "net user with no arguments lists all local user accounts",
              "net user <username> shows detailed information about a specific account",
              "net user <username> <password> /add creates a new local user",
              "net localgroup Administrators <username> /add grants admin privileges",
              "net user <username> /active:no disables an account without deleting it"
            ] },
            { type: "alert", variant: "warning", content: "Service accounts like svc_backup often have elevated privileges and weak or infrequently rotated passwords. Always investigate service accounts during a security assessment." },
          ],
          challenges: [
            {
              id: "ch-win-netuser-1", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
              question: "Which command lists all local user accounts on a Windows machine?",
              options: ["net accounts", "net user", "net localgroup", "net session"], correctAnswer: "net user",
              explanation: "Running 'net user' without additional arguments displays a list of all local user accounts configured on the system.",
            },
            {
              id: "ch-win-netuser-2", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
              question: "Which command adds a user named 'testuser' to the local Administrators group?",
              options: ["net user testuser /admin", "net localgroup Administrators testuser /add", "net group Administrators testuser /add", "net user testuser /priv:admin"], correctAnswer: "net localgroup Administrators testuser /add",
              explanation: "The net localgroup command manages local group membership. Adding a user to the Administrators group grants them full administrative privileges on the local machine.",
            },
            {
              id: "ch-win-netuser-3", type: "true-false", difficulty: "Beginner", xpReward: 20,
              question: "The command 'net user admin' will display the group memberships and password expiration details for the admin account.",
              options: ["True", "False"], correctAnswer: "True",
              explanation: "Running 'net user <username>' displays detailed information including full name, active status, password details, and both local and global group memberships.",
            },
          ],
        },
      ],
    },
    {
      id: "sec-win-sysinfo",
      title: "System Information",
      lessons: [
        {
          id: "lesson-win-systeminfo",
          title: "Gathering System Details with systeminfo",
          order: 6,
          content: [
            { type: "heading", content: "The systeminfo Command" },
            { type: "text", content: "The systeminfo command outputs a comprehensive summary of the system's hardware and software configuration. It reveals the OS version, build number, installed hotfixes, network adapters, and more. In cybersecurity, this is one of the first commands run during post-exploitation to identify the target's patch level and potential vulnerabilities." },
            { type: "code", language: "cmd", content: "C:\\> systeminfo\nHost Name:                 DESKTOP-LAB\nOS Name:                   Microsoft Windows 11 Pro\nOS Version:                10.0.22631 N/A Build 22631\nSystem Manufacturer:       Dell Inc.\nSystem Model:              Latitude 5530\nSystem Type:               x64-based PC\nTotal Physical Memory:     16,384 MB\nAvailable Physical Memory: 8,192 MB\nDomain:                    WORKGROUP\nHotfix(s):                 12 Hotfix(s) Installed.\n                           [01]: KB5034765\n                           [02]: KB5034467\n                           ...\nNetwork Card(s):           2 NIC(s) Installed.\n                           [01]: Intel(R) Wi-Fi 6E AX211" },
            { type: "list", items: [
              "OS Name and OS Version identify the exact Windows edition and build for vulnerability research",
              "Hotfix(s) Installed shows which patches have been applied, revealing missing security updates",
              "Domain indicates whether the machine is domain-joined or in a WORKGROUP",
              "Network Card(s) lists all network interfaces, useful for identifying pivot opportunities",
              "System Boot Time shows the last reboot, which can indicate recent patching activity"
            ] },
            { type: "alert", variant: "info", content: "Compare the installed hotfixes against Microsoft's security bulletin list to identify missing patches. Tools like Windows Exploit Suggester automate this by parsing systeminfo output." },
          ],
          challenges: [
            {
              id: "ch-win-sysinfo-1", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
              question: "Which field in systeminfo output helps identify missing security patches?",
              options: ["OS Name", "System Type", "Hotfix(s) Installed", "Total Physical Memory"], correctAnswer: "Hotfix(s) Installed",
              explanation: "The Hotfix(s) Installed section lists all applied patches (KB numbers). Comparing these against known security updates reveals which patches are missing and what vulnerabilities may be exploitable.",
            },
            {
              id: "ch-win-sysinfo-2", type: "true-false", difficulty: "Beginner", xpReward: 20,
              question: "The systeminfo command shows network adapter information in addition to operating system details.",
              options: ["True", "False"], correctAnswer: "True",
              explanation: "systeminfo includes a Network Card(s) section that lists all installed network adapters, their connection names, DHCP status, and IP addresses.",
            },
            {
              id: "ch-win-sysinfo-3", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
              question: "What does the Domain field in systeminfo output indicate when it shows 'WORKGROUP'?",
              options: ["The machine is a domain controller", "The machine is joined to an Active Directory domain named WORKGROUP", "The machine is not joined to any domain", "The machine has no network connection"], correctAnswer: "The machine is not joined to any domain",
              explanation: "WORKGROUP is the default value for machines that are not part of an Active Directory domain. Domain-joined machines display their domain name (e.g., corp.example.com) in this field.",
            },
          ],
        },
        {
          id: "lesson-win-tasklist",
          title: "Inspecting Running Processes with tasklist",
          order: 7,
          content: [
            { type: "heading", content: "The tasklist Command" },
            { type: "text", content: "The tasklist command displays a list of all currently running processes on the system. This is essential for identifying suspicious processes, detecting malware, and understanding what software is active on a target machine. It can also show which services are hosted by each process and filter output to find specific entries." },
            { type: "code", language: "cmd", content: "C:\\> tasklist\nImage Name                     PID Session Name        Mem Usage\n========================= ======== ================ ============\nSystem Idle Process              0 Services                 8 K\nSystem                           4 Services               136 K\nsvchost.exe                   1284 Services            23,456 K\nexplorer.exe                  4820 Console             98,304 K\nchrome.exe                    7312 Console            215,040 K\n\nC:\\> tasklist /svc\nImage Name           PID Services\n==================== ==== ============================================\nsvchost.exe          1284 BrokerInfrastructure, DcomLaunch, Power\nsvchost.exe          1456 RpcEptMapper, RpcSs\nspoolsv.exe          2340 Spooler\n\nC:\\> tasklist /fi \"imagename eq svchost.exe\"\n(filters output to show only svchost.exe processes)" },
            { type: "list", items: [
              "tasklist displays process name, PID, session name, and memory usage",
              "tasklist /svc shows which Windows services are running inside each process",
              "tasklist /fi allows filtering by criteria such as imagename, PID, memusage, or status",
              "tasklist /v provides verbose output including the window title of each process",
              "Combine with findstr to search: tasklist | findstr /i \"malware\""
            ] },
            { type: "alert", variant: "danger", content: "Malware often disguises itself using names similar to legitimate Windows processes (e.g., svchost.exe in the wrong directory, or svch0st.exe). Always verify the file path of suspicious processes with 'wmic process where \"name='svchost.exe'\" get ProcessId,ExecutablePath'." },
          ],
          challenges: [
            {
              id: "ch-win-tasklist-1", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
              question: "Which tasklist switch shows the Windows services hosted by each running process?",
              options: ["tasklist /v", "tasklist /fi", "tasklist /svc", "tasklist /m"], correctAnswer: "tasklist /svc",
              explanation: "The /svc switch maps each process to the services it is hosting. This is especially useful for understanding which svchost.exe instance runs which service.",
            },
            {
              id: "ch-win-tasklist-2", type: "true-false", difficulty: "Beginner", xpReward: 20,
              question: "The tasklist /fi switch allows you to filter the process list by criteria such as process name or memory usage.",
              options: ["True", "False"], correctAnswer: "True",
              explanation: "The /fi (filter) switch supports multiple operators and fields. For example, 'tasklist /fi \"memusage gt 100000\"' shows processes using more than ~100 MB of memory.",
            },
            {
              id: "ch-win-tasklist-3", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
              question: "Why is it important to verify the file path of processes named svchost.exe?",
              options: ["Because svchost.exe always indicates a virus", "Because svchost.exe should only run from C:\\Windows\\System32 and malware may impersonate it from other locations", "Because there should only be one svchost.exe process running", "Because svchost.exe is deprecated in modern Windows"], correctAnswer: "Because svchost.exe should only run from C:\\Windows\\System32 and malware may impersonate it from other locations",
              explanation: "Legitimate svchost.exe runs from C:\\Windows\\System32. Malware frequently uses the same name but runs from temp folders, user directories, or other non-standard paths to avoid detection.",
            },
          ],
        },
      ],
    },
    {
      id: "sec-win-logs",
      title: "Log and Event Review",
      lessons: [
        {
          id: "lesson-win-event-viewer",
          title: "Understanding Windows Event Viewer",
          order: 8,
          content: [
            { type: "heading", content: "Windows Event Logs and wevtutil" },
            { type: "text", content: "Windows records system, security, and application events in structured logs accessible through Event Viewer (GUI) and the wevtutil command-line tool. Security professionals use these logs to investigate unauthorized access, track user logons, detect privilege escalation, and reconstruct attacker activity during incident response." },
            { type: "code", language: "cmd", content: "C:\\> wevtutil el\nApplication\nSecurity\nSetup\nSystem\nForwardedEvents\nMicrosoft-Windows-Sysmon/Operational\n...\n\nC:\\> wevtutil qe Security /c:5 /f:text /rd:true\nEvent[0]:\n  Log Name: Security\n  Source: Microsoft-Windows-Security-Auditing\n  Event ID: 4624\n  Level: Information\n  Description: An account was successfully logged on.\n  Account Name: admin\n  Logon Type: 10\n\nC:\\> wevtutil qe System /c:3 /f:text /rd:true\nEvent[0]:\n  Log Name: System\n  Source: Service Control Manager\n  Event ID: 7036\n  Description: The Windows Update service entered the running state." },
            { type: "list", items: [
              "wevtutil el lists all available event log channels on the system",
              "wevtutil qe <LogName> queries events from a specific log",
              "/c:N limits output to the most recent N events",
              "/f:text outputs events in human-readable text format instead of XML",
              "/rd:true reads events in reverse chronological order (newest first)",
              "The Security log requires Administrator privileges to read"
            ] },
            { type: "alert", variant: "warning", content: "Attackers often clear event logs to cover their tracks. Event ID 1102 in the Security log indicates the audit log was cleared - this itself is a critical indicator of compromise." },
          ],
          challenges: [
            {
              id: "ch-win-eventlog-1", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
              question: "Which wevtutil subcommand queries events from a specific event log?",
              options: ["wevtutil el", "wevtutil qe", "wevtutil gl", "wevtutil cl"], correctAnswer: "wevtutil qe",
              explanation: "The qe (query-events) subcommand retrieves events from a specified log channel. Combined with /c, /f, and /rd switches, it provides flexible command-line log analysis.",
            },
            {
              id: "ch-win-eventlog-2", type: "true-false", difficulty: "Beginner", xpReward: 20,
              question: "The Windows Security event log can be read by any user without elevated privileges.",
              options: ["True", "False"], correctAnswer: "False",
              explanation: "The Security log contains sensitive authentication and audit data. Reading it requires Administrator privileges or specific audit permissions granted through Group Policy.",
            },
            {
              id: "ch-win-eventlog-3", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
              question: "What does Event ID 1102 in the Security log indicate?",
              options: ["A user successfully logged on", "A new process was created", "The audit log was cleared", "A firewall rule was modified"], correctAnswer: "The audit log was cleared",
              explanation: "Event ID 1102 records that the Security audit log was cleared. During incident response, this event is a red flag because attackers clear logs to destroy evidence of their activity.",
            },
          ],
        },
        {
          id: "lesson-win-log-analysis",
          title: "Searching Logs and Identifying Suspicious Entries",
          order: 9,
          content: [
            { type: "heading", content: "Critical Event IDs and Log Analysis" },
            { type: "text", content: "Effective log analysis requires knowing which Event IDs signal security-relevant activity. Windows Security logs track user logons, privilege use, and process creation. By filtering for specific Event IDs, analysts can quickly identify brute force attempts, lateral movement, unauthorized access, and persistence mechanisms." },
            { type: "code", language: "cmd", content: "REM Find failed logon attempts (Event ID 4625)\nC:\\> wevtutil qe Security /q:\"*[System[EventID=4625]]\" /c:10 /f:text /rd:true\n\nREM Find successful logons (Event ID 4624)\nC:\\> wevtutil qe Security /q:\"*[System[EventID=4624]]\" /c:10 /f:text /rd:true\n\nREM Find new service installations (Event ID 7045 in System log)\nC:\\> wevtutil qe System /q:\"*[System[EventID=7045]]\" /c:5 /f:text /rd:true\n\nREM Export Security log for offline analysis\nC:\\> wevtutil epl Security C:\\evidence\\security_export.evtx" },
            { type: "list", items: [
              "Event ID 4624: Successful logon - Logon Type 2 is interactive, Type 3 is network, Type 10 is remote desktop",
              "Event ID 4625: Failed logon - multiple failures from one source may indicate brute force",
              "Event ID 4672: Special privileges assigned to a new logon (admin-level access)",
              "Event ID 4720: A new user account was created",
              "Event ID 7045 (System log): A new service was installed, which may indicate persistence",
              "Event ID 1102: The audit log was cleared, a potential indicator of tampering"
            ] },
            { type: "alert", variant: "danger", content: "A burst of Event ID 4625 (failed logons) followed by a single Event ID 4624 (successful logon) from the same source IP is a classic pattern of a successful brute force attack. Always correlate failed and successful logon events." },
            { type: "text", content: "The /q switch accepts XPath queries to filter events by any field. For example, you can filter by Logon Type to isolate remote desktop sessions (Type 10) or network logons (Type 3). Exporting logs with 'wevtutil epl' preserves them in the native .evtx format for analysis in tools like Event Viewer or Chainsaw." },
          ],
          challenges: [
            {
              id: "ch-win-loganalysis-1", type: "multiple-choice", difficulty: "Beginner", xpReward: 30,
              question: "Which Event ID in the Security log records failed logon attempts?",
              options: ["4624", "4625", "4672", "7045"], correctAnswer: "4625",
              explanation: "Event ID 4625 logs every failed logon attempt, including the reason for failure, the account targeted, and the source address. A high volume of 4625 events can indicate a brute force attack.",
            },
            {
              id: "ch-win-loganalysis-2", type: "multiple-choice", difficulty: "Beginner", xpReward: 30,
              question: "In a successful logon event (4624), what does Logon Type 10 indicate?",
              options: ["Interactive logon at the physical console", "Network logon (e.g., accessing a share)", "Remote Desktop (RDP) logon", "Service account logon"], correctAnswer: "Remote Desktop (RDP) logon",
              explanation: "Logon Type 10 specifically identifies Remote Desktop Protocol (RDP) sessions. This is critical for detecting unauthorized remote access to systems.",
            },
            {
              id: "ch-win-loganalysis-3", type: "true-false", difficulty: "Beginner", xpReward: 25,
              question: "Event ID 7045 in the System log records when a new service is installed, which can be an indicator of attacker persistence.",
              options: ["True", "False"], correctAnswer: "True",
              explanation: "Event ID 7045 logs new service installations. Attackers frequently install malicious services to maintain persistence across reboots. Unexpected service installations should always be investigated.",
            },
          ],
        },
      ],
    },
  ],
};
