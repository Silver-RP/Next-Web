
"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

export default function ConfirmRedux() {
  const { userInfo, isAuthenticated } = useSelector((state: RootState) => state.user);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Confirm Redux State</h2>

      {!isAuthenticated ? (
        <div className="alert alert-warning text-center" role="alert">
          No user is logged in.
        </div>
      ) : (
        <div className="card mx-auto" style={{ maxWidth: "400px" }}>
          <div className="card-header bg-primary text-white">
            Logged In User Info
          </div>
          <div className="card-body">
            <h5 className="card-title">👤 {userInfo?.name}</h5>
            <p className="card-text">
              <strong>Email:</strong> {userInfo?.email}<br />
                <strong>Phone:</strong> {userInfo?.phone}<br />
              <strong>Role:</strong> {userInfo?.role ?? "N/A"}<br />
              <strong>User ID:</strong> {userInfo?.id}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
