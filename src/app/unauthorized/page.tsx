import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center border p-5 bg-white shadow rounded">
        <h1 className="text-danger mb-4">403 - Unauthorized</h1>
        <p className="mb-3">
        You do not have permission to access this page. Please log in with an account that has valid permissions.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link href="/login" className="btn btn-outline-primary">
            Login
          </Link>
          <Link href="/" className="btn btn-primary">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
