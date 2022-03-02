import {ElMessage} from "element-plus";
import axios from "axios";
import {UpdateToken} from "./auth";

async function post(
    url, data, headers, responseHandler, errorHandlers = {
        hook: null,
        c400: null,
        c404: null,
        c500: null,
    }
) {
    try {
        let response = await axios.post(url, data, {headers: headers})
        UpdateToken(response)
        responseHandler(response)
    } catch (error) {
        if (errorHandlers.hook) {
            errorHandlers.hook()
        }
        if (error.response) {
            UpdateToken(error.response)
            let status = error.response.status
            if (status === 400) {
                if (error.response.data['code'] >= 23 && error.response.data['code'] <= 25)
                    ElMessage({
                        message: 'Recaptcha validation fail',
                        type: 'error'
                    })
                else if (errorHandlers.c400) {
                    errorHandlers.c400(error.response)
                } else {
                    // default implement
                    ElMessage({
                        message: 'Bad request, please refresh page',
                        type: 'error'
                    })
                }
            } else if (status === 404) {
                if (errorHandlers.c404) {
                    errorHandlers.c404(error.response)
                } else {
                    // default impl
                    ElMessage({
                        message: 'Not Found',
                        type: 'error'
                    })
                }
            } else if (status >= 500) {
                if (errorHandlers.c500) {
                    errorHandlers.c500(error.response)
                } else {
                    // default impl
                    ElMessage({
                        message: 'Server error',
                        type: 'error'
                    })
                }
            } else {
                ElMessage({
                    message: 'Unknown error',
                    type: 'error'
                })
            }
        } else if (error.request) {
            ElMessage({
                message: 'Error:' + error.message,
                type: "error"
            })
        } else {
            console.log(error)
        }
    }
}

export {post}