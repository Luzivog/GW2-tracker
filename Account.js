const { fetch } = require('cross-fetch');

const { API_URL } = require('./config');

const call_api = async (api_key, endpoint, params={}) => {

    params['access_token'] = api_key;
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

        let account = await call_api(this.api_key, 'account');
        if (!Object.keys(account).includes('id'))  throw new TypeError('Invalid api key');

        this.account = account;
        this.characters = await call_api(this.api_key, 'characters', {'ids':'all'});

        this.main_character = this.characters.sort((c) => {return c['age']})[0];

        let wallet = await call_api(this.api_key, 'account/wallet');
        this.wallet = wallet;

        let coins = wallet[0]['value'];

        this.gold = coins > 9999 ? `${coins}`.slice(0,-4) : '0';
        this.silver = coins > 99 ? `${+`${coins}`.slice(-4,-2)}` : '0';
        this.bronze = `${+`${coins}`.slice(-2)}`;

    };
};

module.exports = {
    Account: Account
};