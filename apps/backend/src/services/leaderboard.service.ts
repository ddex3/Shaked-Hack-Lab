import { prisma } from "../config/prisma";

export async function getLeaderboard(
  limit: number = 50
): Promise<Array<Record<string, unknown>>> {
  const profiles = await prisma.profile.findMany({
    orderBy: { score: "desc" },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          _count: { select: { progress: { where: { completed: true } } } },
        },
      },
    },
  });

  return profiles.map((profile, index) => ({
    userId: profile.user.id,
    username: profile.user.username,
    displayName: profile.displayName,
    score: profile.score,
    rank: index + 1,
    solveCount: profile.user._count.progress,
  }));
}
