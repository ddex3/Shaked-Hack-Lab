import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ui/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DashboardHome } from "./pages/DashboardHome";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { CoursesPage } from "./pages/CoursesPage";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { LessonPage } from "./pages/LessonPage";
import { ChallengesPage } from "./pages/ChallengesPage";
import { ChallengePage } from "./pages/ChallengePage";
import type { ReactNode } from "react";

export default function App(): ReactNode {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:courseId" element={<CourseDetailPage />} />
        <Route path="courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
        <Route path="challenges" element={<ChallengesPage />} />
        <Route path="challenges/:challengeId" element={<ChallengePage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
