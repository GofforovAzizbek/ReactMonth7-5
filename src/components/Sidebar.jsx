import { useAuth } from "../context/AuthContext";
import { Icon } from "../components/icons";

export function Sidebar({ page, setPage }) {
  const { admin, logout } = useAuth();
  const nav = [
    { id: "dashboard", label: "Dashboard", icon: Icon.dashboard },
    { id: "products", label: "Products", icon: Icon.products },
    { id: "orders", label: "Orders", icon: Icon.orders },
  ];

  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        background: "#0a0a0a",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Mono', 'Courier New', monospace",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 900, color: "#000" }}>
              N
            </span>
          </div>
          <div>
            <p
              style={{
                margin: 0,
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "-0.3px",
              }}
            >
              NIKE
            </p>
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.3)",
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Admin
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {nav.map(({ id, label, icon }) => {
          const active = page === id;
          const IconComp = icon;
          return (
            <button
              key={id}
              onClick={() => setPage(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "9px 10px",
                background: active ? "rgba(255,255,255,0.07)" : "transparent",
                border: active
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.4)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 12,
                textAlign: "left",
                marginBottom: 2,
                transition: "all 0.15s",
              }}
            >
              {IconComp ? <IconComp /> : null}
              {label}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div
        style={{
          padding: "16px 12px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {admin?.avatar}
          </div>
          <div>
            <p
              style={{
                margin: 0,
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {admin?.username}
            </p>
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.3)",
                fontSize: 10,
              }}
            >
              {admin?.role}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
            padding: "8px 10px",
            background: "rgba(255,100,100,0.07)",
            border: "1px solid rgba(255,100,100,0.15)",
            color: "rgba(255,120,120,0.8)",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 11,
            transition: "all 0.15s",
          }}
        >
          <Icon.logout />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
