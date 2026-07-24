import type { RouteObject } from "react-router-dom";
import { LandingPage } from "~/modules/landing/LandingPage";
import { SignupPage } from "~/modules/auth/SignupPage";
import { LoginPage } from "~/modules/auth/LoginPage";
import { DashboardPage } from "~/modules/dashboard/DashboardPage";
import { WizardPage } from "~/modules/discovery/WizardPage";
import { ProjectGeneratingPage } from "~/modules/strategy/ProjectGeneratingPage";
import { ProjectResultsPage } from "~/modules/strategy/ProjectResultsPage";
import { NotFound } from "~/modules/landing/NotFoundPage";

export const routes: RouteObject[] = [
  { path: "/", element: <LandingPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/wizard", element: <WizardPage /> },
  { path: "/project/:id", element: <ProjectGeneratingPage /> },
  { path: "/project/:id/results", element: <ProjectResultsPage /> },
  { path: "*", element: <NotFound /> },
];
