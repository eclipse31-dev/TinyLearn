import { createBrowserRouter } from "react-router-dom";
import Login from "./views/login";
import Signup from "./views/Signup";
import Dashboard from "./views/Dashboard";
import NotFound from "./views/NotFound";
import HomePage from "./views/HomePage";
import CoursesPage from "./views/CoursesPage";
import CourseDetail from "./views/CourseDetail";
import CreateCoursePage from "./views/CreateCoursePage";
import EditCoursePage from "./views/EditCoursePage";
import ResourcesPage from "./views/ResourcesPage";
import DiscussionPage from "./views/DiscussionPage";
import SchedulesPage from "./views/SchedulesPage";
import SettingsPage from "./views/SettingsPage";
import CreateAnnouncementPage from "./views/CreateAnnouncementPage";
import CreateAssignmentPage from "./views/CreateAssignmentPage";
import CreateResourcePage from "./views/CreateResourcePage";
import { PrivateRoute } from "./components/PrivateRoute";


const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute><HomePage /></PrivateRoute>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><HomePage /></PrivateRoute>,
  },
  {
    path: "/courses",
    element: <PrivateRoute><CoursesPage /></PrivateRoute>,
  },
  {
    path: "/courses/create",
    element: <PrivateRoute><CreateCoursePage /></PrivateRoute>,
  },
  {
    path: "/courses/:id/edit",
    element: <PrivateRoute><EditCoursePage /></PrivateRoute>,
  },
  {
    path: "/courses/:id",
    element: <PrivateRoute><CourseDetail /></PrivateRoute>,
  },
  {
    path: "/courses/:courseId/announcements/create",
    element: <PrivateRoute><CreateAnnouncementPage /></PrivateRoute>,
  },
  {
    path: "/courses/:courseId/assignments/create",
    element: <PrivateRoute><CreateAssignmentPage /></PrivateRoute>,
  },
  {
    path: "/courses/:courseId/resources/create",
    element: <PrivateRoute><CreateResourcePage /></PrivateRoute>,
  },
  {
    path: "/resources",
    element: <PrivateRoute><ResourcesPage /></PrivateRoute>,
  },
  {
    path: "/discussion",
    element: <PrivateRoute><DiscussionPage /></PrivateRoute>,
  },
  {
    path: "/schedules",
    element: <PrivateRoute><SchedulesPage /></PrivateRoute>,
  },
  {
    path: "/settings",
    element: <PrivateRoute><SettingsPage /></PrivateRoute>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
