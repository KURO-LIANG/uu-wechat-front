import config from './config.js';
import MyError from './MyError.js';
import {reqOpenId} from '../apis/api-auth';

/**
 * 获取登录token
 */
export function getToken(): string {
    let token = uni.getStorageSync('token')
    let expireTime = uni.getStorageSync('expireTime')

    if (!token || !expireTime || expireTime < Date.now()) {
        return '';
    }
    return token
}

/**
 * 将原request接口封装为Promise
 */
function request<T>(url: string, method: RequestMethod, data?: RequestData, header?: any): Promise<ResultRes<T>> {
    return new Promise((resolve, reject) => {
        if (!url.startsWith('http')) {
            url = `${config.apiUrl}${url}`
        }
        uni.request({
            url,
            header,
            data,
            method,
            success: res => {
                if (res.statusCode === 200) {
                    resolve(res.data as ResultRes<T>)
                } else if (res.statusCode === 401) {
                    resolve({code: res.statusCode, message: '登录已失效'})
                } else {
                    reject(new MyError(res.statusCode, res.data as any ?? ''));
                }
            },
            fail: (err: any) => {
                reject(new MyError(err.errno, err.errMsg));
            }
        })
    })
}

/**
 * 清除登录信息
 */
function cleanLoginInfo() {
    uni.removeStorageSync('token')
    uni.removeStorageSync('expireTime')
}

/**
 * 通用业务请求封装
 */
let promise: Promise<ResultAuth> | null;

async function http<T>(url: string, method: RequestMethod, data?: RequestData, options?: Record<string, string>): Promise<ResultRes<T>> {
    const headers: Record<string, string> = {
        ...options
    };
    let token: string = uni.getStorageSync('token')
    if (token) {
        headers['Authorization'] = 'Bearer ' + token
    }
    if (['GET', 'DELETE'].includes(method)) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
    } else {
        headers['Content-Type'] = 'application/json'
    }
    let res = await request<T>(url, method, data, headers)
    //#ifdef MP
    if (res.code === 401) {
        if (!promise) promise = reqOpenId(true);
        const result = await promise;
        promise = null;
        headers['Authorization'] = 'Bearer ' + result.token
        res = await request(url, method, data, headers)
    }
    //#endif
    if (res.code === 401) {
        cleanLoginInfo()
        // jumpLogin()
        throw new MyError(res.code, '登录已失效')
    }

    if (![200, 0].includes(res.code)) {
        throw new MyError(res.code, res.message)
    }

    return res
}

/**
 * 将原uploadFile接口封装为Promise
 */
function uploadFile<T>(url: string, options: any): Promise<T> {
    return new Promise((resolve, reject) => {
        if (!url.startsWith('http')) {
            url = `${config.apiUrl}${url}`
        }
        uni.uploadFile({
            url,
            ...options,
            success: (res: any) => {
                if (res.statusCode === 200) {
                    resolve(res.data)
                } else if (res.statusCode === 401) {
                    cleanLoginInfo()
                    // jumpLogin()
                    throw new MyError(res.statusCode, '登录已失效')
                } else {
                    reject(new MyError(res.statusCode, res.errMsg));
                }
            },
            fail: (err: any) => {
                reject(new MyError(err.code, err.errMsg));
            }
        })
    })
}

/**
 * 跳转登录页
 */
function jumpLogin(): void {
    //解决并发请求时，多次跳转登录页的问题
    const pages = getCurrentPages()
    const page = pages[pages.length - 1]
    const jumpLogin = uni.getStorageSync('JUMP_LOGIN')
    if (!jumpLogin && 'pages/login/login' !== page.route) {
        uni.setStorageSync('JUMP_LOGIN', true)
        uni.navigateTo({
            url: '/pages/login/login',
        })
    }
}

export {
    http,
    request,
    uploadFile
}
