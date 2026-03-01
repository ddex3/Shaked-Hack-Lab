import Docker from "dockerode";

const socketPath =
  process.platform === "win32"
    ? "//./pipe/docker_engine"
    : "/var/run/docker.sock";

export const docker = new Docker({ socketPath });
