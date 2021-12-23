export function DecodeJWT(token) {
    let part = token.split(".")
    return JSON.parse(decodeURIComponent(escape(window
        .atob(part[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/")))))
}