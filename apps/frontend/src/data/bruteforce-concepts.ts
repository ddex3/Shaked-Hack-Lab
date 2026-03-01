import type { Course } from "../types/course.types";

export const BRUTEFORCE_CONCEPTS_COURSE: Course = {
  id: "bruteforce-concepts",
  title: "Brute Force Concepts",
  description: "Understand how brute force attacks work and, more importantly, how to defend against them. Learn about password entropy, rate limiting, credential stuffing, and modern detection mechanisms from a defensive security perspective.",
  level: "Intermediate",
  category: "Brute Force",
  estimatedDuration: "4 hours",
  sections: [
    {
      id: "sec-password-entropy",
      title: "Password Entropy and Complexity",
      lessons: [
        {
          id: "lesson-entropy-fundamentals",
          title: "Understanding Password Entropy",
          order: 1,
          content: [
            { type: "heading", content: "What Is Password Entropy?" },
            { type: "text", content: "Password entropy is a mathematical measure of how unpredictable a password is, expressed in bits. The higher the entropy, the more guesses an attacker would need on average to crack the password. Entropy is calculated as log2(C^L), where C is the size of the character set and L is the password length. A password drawn from 95 printable ASCII characters with a length of 12 has roughly 79 bits of entropy, meaning an attacker would need up to 2^79 guesses in a pure brute force scenario." },
            { type: "code", language: "python", content: "import math\n\ndef calculate_entropy(charset_size: int, length: int) -> float:\n    \"\"\"Calculate password entropy in bits.\"\"\"\n    if charset_size <= 0 or length <= 0:\n        return 0.0\n    return length * math.log2(charset_size)\n\n# Examples\nprint(calculate_entropy(26, 8))   # lowercase only, 8 chars  => ~37.6 bits\nprint(calculate_entropy(62, 12))  # alphanumeric, 12 chars   => ~71.5 bits\nprint(calculate_entropy(95, 16))  # full ASCII, 16 chars     => ~105.0 bits" },
            { type: "list", items: [
              "Below 28 bits: trivially crackable in seconds with modern hardware",
              "28-35 bits: weak, vulnerable to targeted attacks within minutes",
              "36-59 bits: moderate, may resist online attacks but falls to offline GPU cracking",
              "60-79 bits: strong, practical resistance against most offline attacks",
              "80+ bits: very strong, infeasible to brute force with current technology"
            ] },
            { type: "alert", variant: "info", content: "Entropy only measures theoretical strength against random guessing. Real-world password cracking uses dictionaries, rules, and patterns, which dramatically reduce the effective search space for human-chosen passwords." },
          ],
          challenges: [
            {
              id: "ch-entropy-1", type: "multiple-choice", difficulty: "Intermediate", xpReward: 25,
              question: "A password uses only lowercase letters (26 characters) and is 10 characters long. Approximately how many bits of entropy does it have?",
              options: ["26 bits", "37 bits", "47 bits", "52 bits"], correctAnswer: "47 bits",
              explanation: "Entropy = 10 * log2(26) = 10 * 4.7 = approximately 47 bits. Each lowercase letter contributes about 4.7 bits of entropy.",
            },
            {
              id: "ch-entropy-2", type: "true-false", difficulty: "Intermediate", xpReward: 20,
              question: "A 20-character password composed entirely of the letter 'a' has high entropy because it is long.",
              options: ["True", "False"], correctAnswer: "False",
              explanation: "Entropy depends on both length and the effective character set actually used. A password using only one character has essentially zero entropy regardless of length, because an attacker would guess it immediately using dictionary and pattern-based attacks.",
            },
            {
              id: "ch-entropy-3", type: "multiple-choice", difficulty: "Intermediate", xpReward: 30,
              question: "Which factor has the greatest impact on increasing password entropy?",
              options: ["Increasing password length", "Using only uppercase letters", "Adding a single special character at the end", "Capitalizing the first letter"], correctAnswer: "Increasing password length",
              explanation: "Entropy scales linearly with length (L * log2(C)). Adding length multiplies the search space exponentially, while common substitutions like capitalizing the first letter or appending one symbol add minimal real-world entropy.",
            },
          ],
        },
        {
          id: "lesson-password-policies",
          title: "Designing Effective Password Policies",
          order: 2,
          content: [
            { type: "heading", content: "Modern Password Policy Guidelines" },
            { type: "text", content: "NIST Special Publication 800-63B has fundamentally changed how organizations should approach password policies. The traditional approach of mandating uppercase, lowercase, digits, and symbols while forcing periodic rotation has been shown to lead users toward predictable patterns like 'Password1!' or 'Summer2024!'. Modern guidance emphasizes length over complexity, passphrase adoption, and screening against known breached password databases." },
            { type: "code", language: "typescript", content: "interface PasswordPolicy {\n  minLength: number;          // NIST recommends minimum 8, prefer 12+\n  maxLength: number;          // Allow at least 64 characters\n  checkBreachedDb: boolean;   // Screen against known compromised passwords\n  requireComplexity: boolean; // NIST advises AGAINST forced complexity rules\n  blockCommonPasswords: boolean;\n  allowPassphrases: boolean;  // Encourage multi-word passphrases\n}\n\nconst recommendedPolicy: PasswordPolicy = {\n  minLength: 12,\n  maxLength: 128,\n  checkBreachedDb: true,\n  requireComplexity: false,\n  blockCommonPasswords: true,\n  allowPassphrases: true,\n};" },
            { type: "list", items: [
              "Enforce a minimum length of 12 characters; allow up to 64 or more",
              "Do not require arbitrary complexity rules (uppercase, digit, symbol mandates)",
              "Check submitted passwords against breached credential databases like Have I Been Pwned",
              "Block the top 100,000 most common passwords from being registered",
              "Never force periodic password rotation unless a breach is suspected"
            ] },
            { type: "alert", variant: "warning", content: "Forced password rotation every 90 days leads to weaker passwords. Users resort to predictable increments like 'Spring2024!' becoming 'Summer2024!'. Only require a change when there is evidence of compromise." },
          ],
          challenges: [
            {
              id: "ch-policy-1", type: "multiple-choice", difficulty: "Intermediate", xpReward: 25,
              question: "According to NIST 800-63B, which practice should organizations AVOID in their password policies?",
              options: ["Checking passwords against breached databases", "Mandatory periodic password rotation", "Allowing passphrases", "Setting a minimum password length"], correctAnswer: "Mandatory periodic password rotation",
              explanation: "NIST 800-63B advises against mandatory periodic rotation because it drives users toward predictable patterns. Passwords should only be changed when compromise is suspected.",
            },
            {
              id: "ch-policy-2", type: "true-false", difficulty: "Intermediate", xpReward: 20,
              question: "Requiring at least one uppercase letter, one digit, and one special character significantly increases the real-world security of user-chosen passwords.",
              options: ["True", "False"], correctAnswer: "False",
              explanation: "Composition rules push users toward predictable patterns (e.g., capitalizing the first letter, appending '1!'). NIST research shows these rules do not meaningfully improve security and can reduce it by making passwords harder to remember, leading to reuse.",
            },
            {
              id: "ch-policy-3", type: "multiple-choice", difficulty: "Intermediate", xpReward: 30,
              question: "What is the most effective way to prevent users from choosing passwords that are already known to attackers?",
              options: ["Requiring 16+ character passwords", "Screening against breached password databases", "Enforcing monthly password changes", "Requiring biometric confirmation"], correctAnswer: "Screening against breached password databases",
              explanation: "Checking passwords against known breached databases (like Have I Been Pwned) directly blocks credentials that attackers already have in their dictionaries, regardless of the password's theoretical entropy.",
            },
          ],
        },
      ],
    },
    {
      id: "sec-rate-limiting",
      title: "Rate Limiting and Lockout Systems",
      lessons: [
        {
          id: "lesson-rate-limiting-fundamentals",
          title: "Rate Limiting Authentication Endpoints",
          order: 3,
          content: [
            { type: "heading", content: "Why Rate Limiting Matters" },
            { type: "text", content: "Rate limiting is the primary defense against online brute force attacks. Without it, an attacker can submit thousands of login attempts per second against your authentication endpoint. Effective rate limiting restricts the number of authentication attempts a client can make within a given time window, making brute force attacks impractical even against weak passwords. Common strategies include fixed window counters, sliding window logs, and token bucket algorithms." },
            { type: "code", language: "typescript", content: "// Example: Express rate limiter for login endpoint\nimport rateLimit from 'express-rate-limit';\n\nconst loginLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000,  // 15-minute window\n  max: 10,                    // limit each IP to 10 requests per window\n  message: 'Too many login attempts. Please try again in 15 minutes.',\n  standardHeaders: true,      // Return rate limit info in headers\n  legacyHeaders: false,\n  keyGenerator: (req) => {\n    // Rate limit by IP + username combination\n    return `${req.ip}:${req.body.username}`;\n  },\n});\n\napp.post('/api/auth/login', loginLimiter, loginHandler);" },
            { type: "list", items: [
              "Fixed Window: counts requests in discrete time blocks; simple but allows bursts at window boundaries",
              "Sliding Window Log: tracks each request timestamp for precise enforcement; higher memory usage",
              "Token Bucket: permits short bursts while enforcing average rate; best for user experience",
              "Leaky Bucket: processes requests at a constant rate, queuing excess; smoothest traffic pattern"
            ] },
            { type: "alert", variant: "warning", content: "Rate limiting by IP address alone is insufficient. Attackers use botnets and proxy networks to distribute requests. Combine IP-based limiting with per-account limiting and behavioral analysis for defense in depth." },
          ],
          challenges: [
            {
              id: "ch-ratelimit-1", type: "multiple-choice", difficulty: "Intermediate", xpReward: 25,
              question: "Why is rate limiting by IP address alone insufficient to stop brute force attacks?",
              options: ["IP addresses change too frequently", "Attackers use distributed botnets and proxy networks to rotate IPs", "Rate limiting by IP causes too many false positives", "IP-based limiting is too computationally expensive"], correctAnswer: "Attackers use distributed botnets and proxy networks to rotate IPs",
              explanation: "Sophisticated attackers distribute their attempts across thousands of IPs using botnets or rotating proxy services, making per-IP rate limits ineffective on their own. Combining IP-based and account-based limits provides stronger protection.",
            },
            {
              id: "ch-ratelimit-2", type: "multiple-choice", difficulty: "Intermediate", xpReward: 30,
              question: "Which rate limiting algorithm allows short bursts of traffic while maintaining an average request rate?",
              options: ["Fixed Window Counter", "Token Bucket", "Leaky Bucket", "Simple Counter"], correctAnswer: "Token Bucket",
              explanation: "The token bucket algorithm accumulates tokens at a steady rate. Requests consume tokens, allowing short bursts when tokens are available while enforcing an average rate over time.",
            },
            {
              id: "ch-ratelimit-3", type: "true-false", difficulty: "Intermediate", xpReward: 20,
              question: "Setting a login rate limit of 1000 attempts per minute per IP provides adequate brute force protection for most applications.",
              options: ["True", "False"], correctAnswer: "False",
              explanation: "1000 attempts per minute is far too permissive. At that rate, an attacker could try over 1.4 million passwords per day from a single IP. Typical recommendations are 5-10 attempts per 15-minute window per account.",
            },
          ],
        },
        {
          id: "lesson-account-lockout",
          title: "Account Lockout Strategies",
          order: 4,
          content: [
            { type: "heading", content: "Lockout Mechanisms and Their Tradeoffs" },
            { type: "text", content: "Account lockout temporarily or permanently disables authentication for an account after a threshold of failed attempts. While effective at stopping brute force attacks on individual accounts, lockout mechanisms introduce a denial-of-service risk: an attacker can deliberately trigger lockouts to prevent legitimate users from accessing their accounts. Modern implementations use progressive delays, temporary lockouts with automatic reset, and CAPTCHA escalation to balance security with usability." },
            { type: "code", language: "python", content: "class ProgressiveLockout:\n    \"\"\"Implements progressive delays instead of hard lockout.\"\"\"\n\n    def __init__(self):\n        self.failed_attempts: dict[str, int] = {}\n        self.lockout_until: dict[str, float] = {}\n\n    def get_delay_seconds(self, username: str) -> int:\n        \"\"\"Return the delay before the next attempt is allowed.\"\"\"\n        failures = self.failed_attempts.get(username, 0)\n        if failures < 3:\n            return 0          # No delay for first 3 attempts\n        elif failures < 5:\n            return 5           # 5-second delay\n        elif failures < 8:\n            return 30          # 30-second delay\n        elif failures < 12:\n            return 300         # 5-minute delay\n        else:\n            return 900         # 15-minute delay, require CAPTCHA\n\n    def record_failure(self, username: str) -> None:\n        self.failed_attempts[username] = self.failed_attempts.get(username, 0) + 1\n\n    def record_success(self, username: str) -> None:\n        self.failed_attempts.pop(username, None)\n        self.lockout_until.pop(username, None)" },
            { type: "list", items: [
              "Hard lockout: disables the account entirely after N failures; high security but enables account DoS",
              "Temporary lockout: locks for a set duration (e.g., 15 minutes) then auto-resets; balances security and usability",
              "Progressive delay: each failure increases the wait time exponentially; frustrates attackers without locking out users",
              "CAPTCHA escalation: introduces a CAPTCHA after several failures before allowing more attempts",
              "Notification-based: alerts the account owner via email or SMS of suspicious login activity"
            ] },
            { type: "alert", variant: "danger", content: "Never reveal whether a username exists in your system through lockout messages. Responses like 'This account has been locked' confirm the account exists. Use generic messages like 'If this account exists, it has been temporarily restricted.'" },
          ],
          challenges: [
            {
              id: "ch-lockout-1", type: "multiple-choice", difficulty: "Intermediate", xpReward: 25,
              question: "What is the primary risk of implementing a hard account lockout policy?",
              options: ["It uses too much server memory", "Attackers can intentionally lock out legitimate users as a denial-of-service attack", "It makes password recovery impossible", "Users will choose shorter passwords"], correctAnswer: "Attackers can intentionally lock out legitimate users as a denial-of-service attack",
              explanation: "Hard lockout creates a denial-of-service vector. An attacker who knows or can guess usernames can deliberately trigger lockouts, preventing real users from accessing their accounts.",
            },
            {
              id: "ch-lockout-2", type: "multiple-choice", difficulty: "Intermediate", xpReward: 30,
              question: "Which approach best balances brute force protection with user experience?",
              options: ["Lock the account permanently after 3 failures", "Progressive delays that increase with each failed attempt", "Allow unlimited attempts but log them", "Lock out the user's IP address permanently"], correctAnswer: "Progressive delays that increase with each failed attempt",
              explanation: "Progressive delays exponentially slow down attackers while allowing legitimate users who mistype their password to retry after a brief wait, avoiding the denial-of-service risk of hard lockouts.",
            },
            {
              id: "ch-lockout-3", type: "true-false", difficulty: "Intermediate", xpReward: 25,
              question: "Displaying 'Account locked' versus 'Invalid credentials' reveals whether a username exists in the system, which is an information disclosure vulnerability.",
              options: ["True", "False"], correctAnswer: "True",
              explanation: "Differentiated error messages allow attackers to enumerate valid usernames. If the lockout message differs from the invalid-credentials message, attackers learn which accounts exist and can target them specifically.",
            },
          ],
        },
      ],
    },
    {
      id: "sec-credential-stuffing",
      title: "Credential Stuffing Simulation",
      lessons: [
        {
          id: "lesson-credential-stuffing-overview",
          title: "How Credential Stuffing Works",
          order: 5,
          content: [
            { type: "heading", content: "Credential Stuffing: The Password Reuse Threat" },
            { type: "text", content: "Credential stuffing is an automated attack in which stolen username-password pairs from one data breach are tested against other services. Unlike traditional brute force, which guesses passwords, credential stuffing uses real credentials that users have reused across multiple sites. Billions of credential pairs are available from past breaches, and attackers systematically test them against banking, email, e-commerce, and enterprise login portals. Studies show that 0.1% to 2% of stuffed credentials typically succeed due to widespread password reuse." },
            { type: "code", language: "text", content: "Credential Stuffing Attack Flow (Defender's Perspective):\n\n1. Attacker obtains breach database (e.g., from underground forums)\n2. Automated tool loads username:password pairs\n3. Requests are distributed across thousands of proxy IPs\n4. Each proxy sends login attempts at low frequency to avoid rate limits\n5. Successful logins are harvested for account takeover\n\nDefensive Indicators to Monitor:\n- Login attempts using known breached credentials\n- Geographically impossible login patterns\n- High ratio of failed logins from diverse IPs targeting many accounts\n- User-Agent strings that rotate in patterns (automation signatures)" },
            { type: "list", items: [
              "Credential stuffing exploits password reuse, not password weakness",
              "Attacks typically use residential proxies to appear as legitimate traffic",
              "Success rates of 0.1-2% mean thousands of compromised accounts from a single campaign",
              "The attack volume can reach millions of attempts per day against a single target",
              "Traditional rate limiting alone is ineffective because requests come from unique IPs"
            ] },
            { type: "alert", variant: "danger", content: "Credential stuffing is one of the most common and successful attack vectors today. The 2024 Verizon DBIR reports that stolen credentials are involved in over 40% of data breaches. Multi-factor authentication is the single most effective countermeasure." },
          ],
          challenges: [
            {
              id: "ch-stuffing-1", type: "multiple-choice", difficulty: "Intermediate", xpReward: 25,
              question: "What differentiates credential stuffing from a traditional brute force attack?",
              options: ["Credential stuffing is faster", "Credential stuffing uses real stolen credentials instead of guessing passwords", "Credential stuffing only targets admin accounts", "Credential stuffing does not require network access"], correctAnswer: "Credential stuffing uses real stolen credentials instead of guessing passwords",
              explanation: "Traditional brute force tries many password guesses against one account. Credential stuffing uses actual username:password pairs from breaches, testing them across different services to exploit password reuse.",
            },
            {
              id: "ch-stuffing-2", type: "true-false", difficulty: "Intermediate", xpReward: 20,
              question: "Credential stuffing attacks are ineffective if your application enforces strong password complexity requirements.",
              options: ["True", "False"], correctAnswer: "False",
              explanation: "Password complexity does not protect against credential stuffing because the attack uses real passwords that users have set (and reused) across services. Even a complex password is vulnerable if the user reused it on a breached site.",
            },
            {
              id: "ch-stuffing-3", type: "multiple-choice", difficulty: "Intermediate", xpReward: 30,
              question: "What is the most effective single countermeasure against credential stuffing attacks?",
              options: ["Longer password requirements", "IP-based rate limiting", "Multi-factor authentication (MFA)", "CAPTCHA on every login"], correctAnswer: "Multi-factor authentication (MFA)",
              explanation: "MFA requires a second factor beyond the password, so even if the stolen credentials are valid, the attacker cannot complete authentication without the additional factor (e.g., TOTP code, hardware key, or push notification).",
            },
          ],
        },
        {
          id: "lesson-defending-credential-stuffing",
          title: "Building Credential Stuffing Defenses",
          order: 6,
          content: [
            { type: "heading", content: "Layered Defense Against Credential Stuffing" },
            { type: "text", content: "Defending against credential stuffing requires a layered approach because no single control is sufficient. Attackers adapt by rotating proxies, throttling their own request rates, solving CAPTCHAs, and mimicking real browser fingerprints. Effective defense combines proactive credential screening, adaptive authentication, device fingerprinting, and real-time anomaly detection to identify and block automated login attempts while minimizing friction for legitimate users." },
            { type: "code", language: "typescript", content: "// Layered defense middleware example\ninterface LoginRiskSignals {\n  isKnownBreachedPassword: boolean;\n  isNewDevice: boolean;\n  isNewGeoLocation: boolean;\n  failedAttemptsLastHour: number;\n  loginVelocityScore: number;   // 0-100, higher = more suspicious\n  browserFingerprintMismatch: boolean;\n}\n\nfunction evaluateLoginRisk(signals: LoginRiskSignals): 'allow' | 'mfa' | 'captcha' | 'block' {\n  if (signals.isKnownBreachedPassword) return 'block';  // Force password reset\n  if (signals.loginVelocityScore > 80) return 'block';\n  if (signals.failedAttemptsLastHour > 5) return 'captcha';\n  if (signals.isNewDevice || signals.isNewGeoLocation) return 'mfa';\n  if (signals.browserFingerprintMismatch) return 'mfa';\n  return 'allow';\n}" },
            { type: "list", items: [
              "Proactive screening: check new passwords against breached databases at registration and on change",
              "Adaptive MFA: trigger step-up authentication for logins from new devices or locations",
              "Device fingerprinting: track known devices per user to detect automated tooling",
              "Bot detection: analyze request patterns, TLS fingerprints, and JavaScript execution to identify automation",
              "Credential breach monitoring: subscribe to breach notification feeds and proactively force resets for affected accounts"
            ] },
            { type: "alert", variant: "info", content: "Services like Have I Been Pwned offer free APIs to check passwords against billions of breached credentials using k-anonymity, meaning you never send the full password to the service. Integrating this check at registration and login is a high-impact, low-effort defense." },
          ],
          challenges: [
            {
              id: "ch-defense-stuffing-1", type: "multiple-choice", difficulty: "Intermediate", xpReward: 30,
              question: "Why does checking passwords against breached databases use k-anonymity?",
              options: ["To speed up the lookup", "To ensure the full password is never sent to the external service", "To comply with GDPR requirements", "To allow offline checking without an API"], correctAnswer: "To ensure the full password is never sent to the external service",
              explanation: "K-anonymity sends only the first 5 characters of the password hash to the API, which returns all matching hashes. The client compares locally, so the full password or its complete hash is never exposed to the third-party service.",
            },
            {
              id: "ch-defense-stuffing-2", type: "multiple-choice", difficulty: "Intermediate", xpReward: 25,
              question: "Which signal would most strongly indicate an automated credential stuffing attempt?",
              options: ["A user logging in from a new city", "Hundreds of failed logins targeting different accounts from diverse IPs within minutes", "A user mistyping their password three times", "A login from a mobile device"], correctAnswer: "Hundreds of failed logins targeting different accounts from diverse IPs within minutes",
              explanation: "Credential stuffing involves high-volume attempts across many accounts from distributed IPs. A single user mistyping their password is normal behavior, but mass failures across accounts from varied sources is a strong automation indicator.",
            },
            {
              id: "ch-defense-stuffing-3", type: "true-false", difficulty: "Intermediate", xpReward: 20,
              question: "Device fingerprinting alone is a reliable method to block all credential stuffing attacks.",
              options: ["True", "False"], correctAnswer: "False",
              explanation: "Device fingerprinting can be spoofed by sophisticated attackers using anti-detect browsers and headless browser frameworks. It should be one layer in a defense-in-depth strategy, not the sole countermeasure.",
            },
          ],
        },
      ],
    },
    {
      id: "sec-detection-defense",
      title: "Detection and Defense Mechanisms",
      lessons: [
        {
          id: "lesson-monitoring-detection",
          title: "Monitoring and Detecting Brute Force Attacks",
          order: 7,
          content: [
            { type: "heading", content: "Real-Time Detection of Brute Force Activity" },
            { type: "text", content: "Detecting brute force attacks in real time requires monitoring authentication telemetry for anomalous patterns. Key signals include spikes in failed login rates, login attempts against nonexistent usernames, geographically dispersed attempts against a single account, and timing patterns that suggest automation. Security teams should build dashboards and automated alerting around these metrics, integrating authentication logs with a SIEM (Security Information and Event Management) platform for correlation and investigation." },
            { type: "code", language: "sql", content: "-- Query to detect potential brute force activity in auth logs\n-- Flag IPs with more than 20 failed logins in the past 10 minutes\nSELECT\n    source_ip,\n    COUNT(*) AS failed_attempts,\n    COUNT(DISTINCT target_username) AS unique_accounts_targeted,\n    MIN(attempt_time) AS first_seen,\n    MAX(attempt_time) AS last_seen\nFROM authentication_logs\nWHERE\n    success = FALSE\n    AND attempt_time >= NOW() - INTERVAL '10 minutes'\nGROUP BY source_ip\nHAVING COUNT(*) > 20\nORDER BY failed_attempts DESC;" },
            { type: "list", items: [
              "Monitor failed login rate per IP, per account, and globally across the application",
              "Alert on login attempts to accounts that do not exist (username enumeration probing)",
              "Track impossible travel: logins from geographically distant locations within minutes",
              "Detect timing uniformity in login requests, a hallmark of automated tooling",
              "Correlate authentication failures with other signals like port scans or vulnerability probing from the same source"
            ] },
            { type: "alert", variant: "info", content: "Set up tiered alerting: automated blocks for high-confidence detections (e.g., 100+ failures in 1 minute from one IP), analyst review for medium-confidence signals, and weekly trend reports for slow-and-low patterns." },
          ],
          challenges: [
            {
              id: "ch-detection-1", type: "multiple-choice", difficulty: "Intermediate", xpReward: 25,
              question: "Which of the following is the strongest indicator of an automated brute force attack?",
              options: ["A user failing login twice then succeeding on the third try", "Hundreds of failed logins from one IP with precisely uniform timing intervals", "A login from a different country than usual", "An account that has not been used in 6 months"], correctAnswer: "Hundreds of failed logins from one IP with precisely uniform timing intervals",
              explanation: "Uniform timing between requests is a strong automation signature. Human users naturally have variable delays between attempts, while scripted attacks tend to produce evenly spaced requests.",
            },
            {
              id: "ch-detection-2", type: "true-false", difficulty: "Intermediate", xpReward: 20,
              question: "Login attempts against usernames that do not exist in the system should be ignored since no account is at risk.",
              options: ["True", "False"], correctAnswer: "False",
              explanation: "Attempts against nonexistent usernames indicate reconnaissance or username enumeration. Monitoring these helps detect the early stages of an attack and can reveal the attacker's target list or methodology.",
            },
            {
              id: "ch-detection-3", type: "multiple-choice", difficulty: "Intermediate", xpReward: 30,
              question: "What is 'impossible travel' in the context of brute force detection?",
              options: ["A VPN that routes traffic through multiple countries", "Login attempts from geographically distant locations within a physically impossible timeframe", "Using Tor to hide the true source of login attempts", "Attempting to log in during off-business hours"], correctAnswer: "Login attempts from geographically distant locations within a physically impossible timeframe",
              explanation: "Impossible travel detects when a user account shows login attempts from locations that are too far apart given the time between them (e.g., New York and Tokyo within 5 minutes), indicating credential compromise.",
            },
          ],
        },
        {
          id: "lesson-defense-in-depth",
          title: "Defense in Depth for Authentication",
          order: 8,
          content: [
            { type: "heading", content: "Building a Multi-Layered Authentication Defense" },
            { type: "text", content: "No single defense mechanism can fully protect authentication systems. Defense in depth layers multiple controls so that if one fails, others continue to provide protection. A robust authentication stack combines password policies, rate limiting, account lockout, multi-factor authentication, anomaly detection, and incident response procedures. Each layer addresses a different attack scenario, and together they make brute force attacks economically infeasible for attackers." },
            { type: "code", language: "yaml", content: "# Defense-in-depth authentication configuration example\nauthentication_defenses:\n  layer_1_password_policy:\n    min_length: 12\n    max_length: 128\n    check_breached_db: true\n    block_common_passwords: true\n\n  layer_2_rate_limiting:\n    per_ip_per_minute: 10\n    per_account_per_hour: 15\n    global_failed_per_minute: 500\n\n  layer_3_progressive_lockout:\n    delay_after_3_failures: 5s\n    delay_after_5_failures: 30s\n    delay_after_10_failures: 300s\n    captcha_after: 5_failures\n\n  layer_4_mfa:\n    required_for: [admin_accounts, new_devices, high_risk_logins]\n    methods: [totp, webauthn, push_notification]\n\n  layer_5_monitoring:\n    siem_integration: true\n    alert_on_impossible_travel: true\n    alert_on_mass_failures: true\n    automated_ip_block_threshold: 100_failures_per_10min\n\n  layer_6_incident_response:\n    auto_notify_user_on_suspicious_login: true\n    force_password_reset_on_breach_detection: true\n    security_team_escalation: true" },
            { type: "list", items: [
              "Layer 1: Strong password policies with breach database screening prevent weak starting points",
              "Layer 2: Rate limiting makes high-volume attacks impractical from individual sources",
              "Layer 3: Progressive lockout slows targeted attacks without enabling account denial-of-service",
              "Layer 4: MFA ensures stolen passwords alone are insufficient for account access",
              "Layer 5: Real-time monitoring detects distributed and slow-and-low attacks that bypass per-source limits",
              "Layer 6: Incident response procedures ensure fast containment when attacks are detected"
            ] },
            { type: "alert", variant: "warning", content: "Regularly test your defenses using authorized red team exercises and penetration tests. Simulate credential stuffing, distributed brute force, and slow-and-low attacks against your own systems to validate that each defensive layer performs as expected." },
            { type: "text", content: "When designing your authentication defense stack, consider the attacker's economics. Each defensive layer increases the cost and time required to compromise an account. The goal is not to make attacks theoretically impossible, but to make them so expensive and slow that attackers move on to easier targets. A layered defense that forces an attacker to bypass rate limiting, solve CAPTCHAs, acquire a second factor, and avoid anomaly detection makes credential attacks economically unviable." },
          ],
          challenges: [
            {
              id: "ch-did-1", type: "multiple-choice", difficulty: "Intermediate", xpReward: 30,
              question: "Why is defense in depth more effective than relying on a single strong control?",
              options: ["It is cheaper to implement", "If one layer fails or is bypassed, remaining layers continue to provide protection", "It eliminates the need for monitoring", "It guarantees 100% attack prevention"], correctAnswer: "If one layer fails or is bypassed, remaining layers continue to provide protection",
              explanation: "Defense in depth ensures no single point of failure. Rate limiting might be bypassed with distributed IPs, but MFA still blocks access. If MFA is compromised, anomaly detection can flag the unusual activity. Each layer compensates for weaknesses in others.",
            },
            {
              id: "ch-did-2", type: "multiple-choice", difficulty: "Intermediate", xpReward: 35,
              question: "Which combination of defenses provides the most comprehensive protection against both brute force and credential stuffing attacks?",
              options: [
                "Strong password policy and IP blocking",
                "Rate limiting, progressive lockout, MFA, and breached credential screening",
                "CAPTCHA on every page and account lockout after 1 failure",
                "Passwordless authentication only"
              ], correctAnswer: "Rate limiting, progressive lockout, MFA, and breached credential screening",
              explanation: "This combination addresses multiple attack vectors: rate limiting stops high-volume attempts, progressive lockout slows targeted attacks, MFA blocks stolen credentials, and breach screening prevents known-compromised passwords from being used.",
            },
            {
              id: "ch-did-3", type: "true-false", difficulty: "Intermediate", xpReward: 25,
              question: "The primary goal of authentication defense is to make attacks theoretically impossible rather than economically infeasible.",
              options: ["True", "False"], correctAnswer: "False",
              explanation: "Making attacks theoretically impossible is unrealistic. The practical goal is to raise the cost, time, and effort required to the point where attacking your system is not worth the return compared to easier targets. This economic framing guides effective security investment.",
            },
          ],
        },
      ],
    },
  ],
};
