import { createBrowserRouter } from "react-router-dom";
import { Login, Signup, NotFound, SettingsPage } from "./views/shared";
import HomePage from "./views/HomePage";
import { CoursesPage, CourseDetail, CreateCoursePage, EditCoursePage, CreateAnnouncementPage, CreateAssignmentPage, CreateResourcePage, GradeSubmissionsPage } from "./views/teacher";
import { ResourcesPage, SchedulesPage, DiscussionPage, AssignmentsPage, SubmitAssignmentPage } from "./views/student";
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
    path: "/courses/:courseId/materials/create",
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
    path: "/assignments",
    element: <PrivateRoute><AssignmentsPage /></PrivateRoute>,
  },
  {
    path: "/assignments/:assignmentId/submit",
    element: <PrivateRoute><SubmitAssignmentPage /></PrivateRoute>,
  },
  {
    path: "/assignments/:assignmentId/grade",
    element: <PrivateRoute><GradeSubmissionsPage /></PrivateRoute>,
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
