<?php
// start a session
session_start();

// 2 hours timeout (in seconds)
define("SESSION_TIMEOUT", 7200);

/**
 * Auto-expire session if user is logged in and inactive too long
 */
if (isset($_SESSION['computingID']) && isset($_SESSION['LAST_ACTIVE'])) {
    if ((time() - $_SESSION['LAST_ACTIVE']) > SESSION_TIMEOUT) {
        session_unset();
        session_destroy();
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(["error" => "Session expired"]);
        exit;
    }
}

// If session is alive, refresh last active timestamp
if (isset($_SESSION['computingID'])) {
    $_SESSION['LAST_ACTIVE'] = time();
}

/**
 * Ensure there is a logged in user for protected endpoints
 */
function requireLogin(): void {
    if (!isset($_SESSION['computingID'])) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(["error" => "Not authenticated"]);
        exit;
    }
}

/**
 * Get the currently logged in user's computingID, or null
 */
function currentUser(): ?string {
    return $_SESSION['computingID'] ?? null;
}
