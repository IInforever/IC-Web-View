/*
 * Copyright (c) IInfo 2022.
 */

export function DecodeJWT(token) {
    let part = token.split(".")
    return JSON.parse(decodeURIComponent(escape(window
        .atob(part[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/")))))
}

export function CheckSession() {
    let sessions = ['auth-token', 'admin-token']
    let count = -1
    for (const index in sessions) {
        let token = localStorage.getItem(sessions[index])
        if (token == null)
            continue
        let data = DecodeJWT(token)
        if (data.exp * 1000 < Date.now()) {
            localStorage.removeItem(sessions[index])
            continue
        }
        count = parseInt(index)
    }
    return count
}

export function UpdateToken(response) {
    let token = response.headers.authorization
    if (token) {
        let sessions = ['auth-token', 'admin-token']
        let subjects = ['auth', 'Admin']
        let data = DecodeJWT(token)
        for (const i in subjects) {
            if (data.sub === subjects[i])
                localStorage.setItem(sessions[i], token)
        }
    }
}

export function RemoveTokens() {
    let keys = ['auth-token', 'admin-token', 'username']
    for (const i of keys) {
        localStorage.removeItem(i)
    }
}