import { createBrowserRouter } from "react-router";
import { MarketingLayout } from "./components/marketing/MarketingLayout";
import { HomePage } from "./pages/HomePage";
import { RestaurantAdminLoginPage } from "./pages/RestaurantAdminLoginPage";
import { InternalAdminLoginPage } from "./pages/InternalAdminLoginPage";
import { AdminDashboardLayout } from "./components/admin/AdminDashboardLayout";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { CompsPage } from "./pages/admin/CompsPage";
import { SpendPage } from "./pages/admin/SpendPage";
import { AnalyticsPage } from "./pages/admin/AnalyticsPage";
import { EditMenuPage } from "./pages/admin/EditMenuPage";
import { EditDeliverablesPage } from "./pages/admin/EditDeliverablesPage";
import { EditProfilePage } from "./pages/admin/EditProfilePage";
import { SupportPage } from "./pages/admin/SupportPage";
import { InternalAdminLayout } from "./components/internal/InternalAdminLayout";
import { ApplicationsQueuePage } from "./pages/internal/ApplicationsQueuePage";
import { SubmissionsQueuePage } from "./pages/internal/SubmissionsQueuePage";
import { SupportQueuePage } from "./pages/internal/SupportQueuePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MarketingLayout,
    children: [
      { index: true, Component: HomePage },
    ],
  },
  {
    path: "/restaurant-admin/login",
    Component: RestaurantAdminLoginPage,
  },
  {
    path: "/restaurant-admin",
    Component: AdminDashboardLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "comps", Component: CompsPage },
      { path: "spend", Component: SpendPage },
      { path: "analytics", Component: AnalyticsPage },
      { path: "menu", Component: EditMenuPage },
      { path: "deliverables", Component: EditDeliverablesPage },
      { path: "profile", Component: EditProfilePage },
      { path: "support", Component: SupportPage },
    ],
  },
  {
    path: "/internal-admin/login",
    Component: InternalAdminLoginPage,
  },
  {
    path: "/internal-admin",
    Component: InternalAdminLayout,
    children: [
      { index: true, Component: ApplicationsQueuePage },
      { path: "submissions", Component: SubmissionsQueuePage },
      { path: "support", Component: SupportQueuePage },
    ],
  },
]);