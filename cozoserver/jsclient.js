function Client(options) {
    options.username ||= '';
    options.password ||= '';
    options.host ||= 'http://127.0.0.1:9070';

    const url = options.host + '/text-query';
    const headers = {
        'Content-Type': 'application/json',
        'x-cozo-username': options.username,
        'x-cozo-password': options.password
    }

    async function run(script, params) {
        params ||= {};
        const resp = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                script,
                params
            })
        });
        if (resp.ok) {
            return await resp.json()
        } else {
            console.error(await resp.text())
        }
    }

    async function print(script, params) {
        const res = await run(script, params);
        if (res) {
            res.headers ||= [];
            console.table(res.rows.map(row => {
                let ret = {};
                for (let i = 0; i < row.length; ++i) {
                    ret[res.headers[i] || `(${i})`] = row[i];
                }
                return ret
            }))
        }
    }

    return {run, print}
}