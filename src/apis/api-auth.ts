import config from '@/utils/config';

const apiUrl = config.apiUrl;

/**
 * 将原request接口封装为Promise
 * @param {String} url
 * @param {String} method
 * @param {Object} data
 */
function request(url: string, method: RequestMethod, data: object): Promise<any> {
    return new Promise((resolve, reject) => {
        uni.request({
            url: url,
            data,
            method,
            timeout: 20000,
            success: res => {
                if (res.statusCode === 200) {
                    resolve(res.data)
                } else {
                    reject(new Error(res.errMsg));
                }
            },
            fail: err => {
                // 处理请求超时
                if (err.errMsg.indexOf('request:fail') !== -1) {
                    reject(new Error('网络连接失败，请检查网络设置'))
                }
                if(err.errMsg.indexOf('time out') !== -1){
                    reject(new Error('网络连接超时，请重试'))
                }
                reject(new Error(err.errMsg));
            }
        })
    })
}

/**
 * 获取openId自动登录
 * @param isForce 是否强制重新获取
 */
export async function reqOpenId(isForce = false): Promise<ResultAuth> {
    const result: ResultAuth = {
        openId: '',
        unionId: '',
        token: ''
    };
    const openId = uni.getStorageSync('openId');
    if (!isForce && openId) {
        result.openId = openId;
        result.unionId = uni.getStorageSync('unionId');
        result.token = uni.getStorageSync('token');
        return result;
    }
    const code = await mpLogin();
    const res = await request(apiUrl + '/api/v1/wx/mini/login', 'GET', {
        code,
    });
    if (res.code === 0) {
        const data = res.data;
        result.openId = data.miniOpenId;
        result.unionId = data.unionid;
        uni.setStorageSync('openId', data.miniOpenId);
        uni.setStorageSync('unionId', data.unionid);
        if (data.userInfo && data.userInfo.userId) {
            loginSuccess(data);
            result.token = data.token;
        }else{
			console.log('未注册')
		}
    }
    return result;
}

function mpLogin() {
    return new Promise((resolve, reject) => {
        uni.login({
            success: res => {
                resolve(res.code)
            },
            fail: (e) => {
                reject(e)
            }
        })
    })
}

/**
 * 登录成功
 */
export function loginSuccess(data: any) {
    if(!data) {
        uni.removeStorageSync('userInfo')
        uni.removeStorageSync('expireTime')
        uni.removeStorageSync('token')
    } else {
        uni.setStorageSync('userInfo', data.userInfo)
        uni.setStorageSync('expireTime', data.expireTime)
        uni.setStorageSync('token', data.token)
    }
}

export async function reqSmsLogin(phone: string, verCode: string) {
    const res = await request(apiUrl + '/v1/wx/web/loginByMobile', 'POST', {
        phone,
        verCode
    })
    if(res.code !== 0) {
        throw new Error(res.msg)
    }
    return res;
}
