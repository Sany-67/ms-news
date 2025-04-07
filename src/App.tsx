import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import ErrorBoundary from "./components/ErrorBoundary";
import PostView from "./components/PostView";
import DefaultHelmet from "./components/DefaultHelmet";

const AuthCallback = lazy(() => import("./components/auth/callback"));
const Login = lazy(() => import("./components/auth/Login"));
const SignUp = lazy(() => import("./components/auth/SignUp"));

function App() {
  return (
    <ErrorBoundary>
      <DefaultHelmet />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <p>Loading...</p>
          </div>
        }
      >
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/post/:postId" element={<PostView />} />

            {/* Add a catch-all route that redirects to home */}
            {import.meta.env.VITE_TEMPO !== "true" && (
              <Route path="*" element={<Navigate to="/" />} />
            )}

            {/* Add tempobook route for Tempo */}
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" />
            )}
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
