import config from '@/utils/config';
import {http} from '@/utils/request';

const apiUrl = config.apiUrl;

/**
 * 查询数据列表
 */
export async function reqList(params: ListReq): Promise<PageRes<ListRes> | undefined> {
    const res = await http<PageRes<ListRes>>(apiUrl + '/api/v1/wx/mini/business/list', 'GET', params);
    return res.data;
}
/**
 * 查询数据详情
 */
export async function reqInfo(id:number): Promise<InfoRes | undefined> {
    const res = await http<InfoRes>(apiUrl + '/api/v1/wx/mini/business/info', 'GET', {id});
    return res.data?.business;
}

