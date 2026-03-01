#!/bin/bash
set -e

mkdir -p /home/hacker/.ssh
mkdir -p /home/hacker/Documents
mkdir -p /home/hacker/Documents/projects
mkdir -p /home/hacker/Documents/backup
mkdir -p /home/hacker/.config
mkdir -p /tmp/lab/logs
mkdir -p /challenges/level1
mkdir -p /challenges/level2
mkdir -p /challenges/level3
mkdir -p /challenges/.hidden

echo "Welcome to Linux Fundamentals Lab" > /home/hacker/README.txt
echo "Complete all objectives to earn XP." >> /home/hacker/README.txt

echo "FLAG{l1nux_h1dd3n_f1l3}" > /challenges/.hidden/.secret_token
chmod 600 /challenges/.hidden/.secret_token

echo "admin:x:0:0:admin:/root:/bin/bash" > /challenges/level2/passwd_sim
echo "hacker:x:1000:1000:hacker:/home/hacker:/bin/bash" >> /challenges/level2/passwd_sim
echo "svc_account:x:1001:1001:service:/var/svc:/bin/bash" >> /challenges/level2/passwd_sim

cat > /challenges/level2/config.ini << 'CONF'
[database]
host=192.168.1.100
port=5432
user=admin
password=Sup3rS3cret!

[api]
key=sk_live_abc123def456
endpoint=https://api.internal.lab
CONF
chmod 644 /challenges/level2/config.ini

chmod 777 /challenges/level1
chmod 755 /challenges/level2
chmod 700 /challenges/level3

touch /challenges/level1/public_file.txt
echo "This file is world-readable and world-writable" > /challenges/level1/public_file.txt
chmod 666 /challenges/level1/public_file.txt

touch /challenges/level3/restricted_data.txt
echo "CLASSIFIED: Internal security report" > /challenges/level3/restricted_data.txt
chmod 600 /challenges/level3/restricted_data.txt

cat > /tmp/lab/logs/syslog.sim << 'SYSLOG'
Dec 22 03:00:01 lab-server CRON[1234]: (root) CMD (/usr/bin/backup.sh)
Dec 22 03:00:05 lab-server backup.sh[1235]: Backup started
Dec 22 03:00:45 lab-server backup.sh[1235]: Backup completed successfully
Dec 22 03:15:00 lab-server sshd[1300]: Accepted password for admin from 10.0.0.99 port 44521 ssh2
Dec 22 03:15:01 lab-server sshd[1300]: pam_unix(sshd:session): session opened for user admin
Dec 22 03:15:30 lab-server sudo[1305]: admin : TTY=pts/0 ; PWD=/root ; USER=root ; COMMAND=/bin/bash
Dec 22 03:16:00 lab-server kernel: [UFW BLOCK] IN=eth0 OUT= SRC=192.168.1.200 DST=10.0.0.50 PROTO=TCP SPT=54321 DPT=4444
Dec 22 03:16:05 lab-server sshd[1310]: Failed password for root from 192.168.1.200 port 54322 ssh2
Dec 22 03:16:06 lab-server sshd[1310]: Failed password for root from 192.168.1.200 port 54323 ssh2
Dec 22 03:16:07 lab-server sshd[1310]: Failed password for root from 192.168.1.200 port 54324 ssh2
Dec 22 03:16:08 lab-server sshd[1310]: Failed password for root from 192.168.1.200 port 54325 ssh2
Dec 22 03:16:09 lab-server sshd[1310]: Failed password for root from 192.168.1.200 port 54326 ssh2
Dec 22 03:17:00 lab-server sshd[1315]: Connection closed by 192.168.1.200 port 54327 [preauth]
Dec 22 08:00:00 lab-server CRON[2000]: (hacker) CMD (/usr/local/bin/check_updates.sh)
Dec 22 08:30:00 lab-server systemd[1]: Started Daily apt download activities.
Dec 22 09:00:00 lab-server sshd[2100]: Accepted publickey for hacker from 10.0.0.1 port 55000 ssh2
SYSLOG

cat > /tmp/lab/logs/auth.log.sim << 'AUTH'
Dec 22 03:15:00 lab-server sshd[1300]: Accepted password for admin from 10.0.0.99
Dec 22 03:16:05 lab-server sshd[1310]: Failed password for root from 192.168.1.200
Dec 22 03:16:06 lab-server sshd[1310]: Failed password for root from 192.168.1.200
Dec 22 03:16:07 lab-server sshd[1310]: Failed password for root from 192.168.1.200
Dec 22 03:16:08 lab-server sshd[1310]: Failed password for root from 192.168.1.200
Dec 22 03:16:09 lab-server sshd[1310]: Failed password for root from 192.168.1.200
Dec 22 09:00:00 lab-server sshd[2100]: Accepted publickey for hacker from 10.0.0.1
AUTH

cat > /home/hacker/Documents/projects/notes.md << 'NOTES'
# Project Notes
- Server migration scheduled for Jan 2026
- Backup service account needs rotation
- Review firewall rules for port 4444
NOTES

echo "FLAG{d1r_tr33_m4st3r}" > /home/hacker/Documents/backup/.flag_backup

chown -R hacker:hacker /home/hacker /challenges /tmp/lab
