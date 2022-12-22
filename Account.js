const { fetch } = require('cross-fetch');

const { API_URL } = require('./config');

const call_api = async (endpoint, api_key=null, params={}) => {

    if (api_key) params['access_token'] = api_key;
    params_list = [];
    for (k in params) params_list.push(`${k}=${params[k]}`);
    params_str = params_list.join('&');

    req_url = API_URL+endpoint+'?'+params_str;
    req = await fetch(req_url);
    res = await req.json();

    return res
};

class Account {

    constructor(api_key) {
        this.api_key = api_key;
    };

    async init() {

        let account = await call_api('account', this.api_key);
        if (!Object.keys(account).includes('id'))  throw new TypeError('Invalid api key');

        this.account = account;
        this.characters = await call_api('characters', this.api_key, {'ids':'all'});

        this.main_character = this.characters.sort((c1,c2) =>  c2['age']-c1['age'])[0];

        let wallet = await call_api('account/wallet', this.api_key);
        this.wallet = wallet;

        let coins = wallet[0]['value'];

        this.gold = coins > 9999 ? `${coins}`.slice(0,-4) : '0';
        this.silver = coins > 99 ? `${+`${coins}`.slice(-4,-2)}` : '0';
        this.bronze = `${+`${coins}`.slice(-2)}`;

        this.achievements = await call_api('account/achievements', this.api_key);

    };
};

module.exports = {
    Account: Account,
    call_api: call_api
};