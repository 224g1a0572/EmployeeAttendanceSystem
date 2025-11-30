// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/useAuthStore";

// const Login = () => {
//   const { login, isLoading, error } = useAuthStore();
//   const [email, setEmail] = useState("manager@example.com");
//   const [password, setPassword] = useState("password123");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const user = await login(email, password);
//       if (user.role === "manager") {
//         navigate("/manager/dashboard");
//       } else {
//         navigate("/employee/dashboard");
//       }
//     } catch {
//       // error handled in store
//     }
//   };

//   return (
//     <div className="auth-wrapper">
//       <div className="card auth-card">
//         <div className="card-header">
//           <div>
//             <div className="card-title">Welcome back 👋</div>
//             <div className="card-subtitle">Sign in to manage attendance</div>
//           </div>
//           <span className="badge-soft">Employee & Manager</span>
//         </div>

//         {error && (
//           <div
//             style={{
//               marginBottom: "0.75rem",
//               padding: "0.55rem 0.75rem",
//               borderRadius: 12,
//               fontSize: 12,
//               background: "rgba(248,113,113,0.16)",
//               color: "#fecaca",
//               border: "1px solid rgba(248,113,113,0.5)"
//             }}
//           >
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <div className="label">Email</div>
//             <input
//               className="input"
//               type="email"
//               placeholder="you@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               autoComplete="username"
//             />
//           </div>
//           <div className="form-group">
//             <div className="label">Password</div>
//             <input
//               className="input"
//               type="password"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               autoComplete="current-password"
//             />
//           </div>
//           <button className="btn" type="submit" disabled={isLoading} style={{ width: "100%", marginTop: "0.25rem" }}>
//             {isLoading ? "Signing in..." : "Sign In"}
//           </button>
//         </form>

//         <div
//           style={{
//             marginTop: "0.85rem",
//             fontSize: 12,
//             color: "var(--text-muted)",
//             textAlign: "center"
//           }}
//         >
//           No account?{" "}
//           <Link to="/register" style={{ color: "#a5b4fc", textDecoration: "none" }}>
//             Register as Employee
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Login = () => {
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState("manager@example.com");
  const [password, setPassword] = useState("password123");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === "manager") navigate("/manager/dashboard");
      else navigate("/employee/dashboard");
    } catch {}
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span>EA</span>
          </div>
          <h2>Welcome Back 👋</h2>
          <p>Login to your attendance dashboard</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <span>New Employee?</span>
          <Link to="/register">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
