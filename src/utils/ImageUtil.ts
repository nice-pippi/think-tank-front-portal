const baseUrl = 'http://192.168.88.150:9000'

export function processUrl(url: string) {
    if (url.startsWith('https://thirdwx.qlogo.cn')) {
        return url;
    } else {
        return baseUrl + url;
    }
}