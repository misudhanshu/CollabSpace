import { Route, Routes } from "react-router-dom";
import Login from "../pages/Authentication/Login";
import Signup from "../pages/Authentication/Signup";
import Home from "../pages/Home";
import UserProfile from "../pages/Users/UserProfile";
import CreatingOrganizationForm from "../pages/Organization/CreatingOrganizationForm";
import Layout from "../layouts/Layout";
import Organizations from "../pages/Organizations";
import SingleOrganization from "../pages/Organization/SingleOrganization";
import CreatingWorkspace from "../pages/Workspace/CreatingWorkspace";
import AllWorkspace from "../pages/Workspace/AllWorkspace";
import SingleWorkspace from "../pages/Workspace/SingleWorkspace";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFound from "../components/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/create-form" element={<CreatingOrganizationForm />} />

        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route
            path="/organizations/:organizationId"
            element={<SingleOrganization />}
          />
          <Route
            path="/organizations/:organizationId/workspace"
            element={<AllWorkspace />}
          />
          <Route
            path="/organizations/:organizationId/workspace/:workspaceId"
            element={<SingleWorkspace />}
          />
        </Route>

        <Route
          path="/organizations/:organizationId/workspace/create"
          element={<CreatingWorkspace />}
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
