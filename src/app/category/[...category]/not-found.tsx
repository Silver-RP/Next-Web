export default function NotFound() {
    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>404 - Category Not Found</h1>
            <p>The category you are looking for does not exist or has been removed.</p>
            <a href="/" style={{ color: "blue", textDecoration: "underline" }}>
                Go back to the homepage
            </a>
        </div>
    );
}
