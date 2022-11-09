import { forEachAsync } from './async';

export async function getYdPisno(lotno) {
    const gylc = (
        await (
            await fetch('http://172.18.248.225:8080/TgmesAppdi/service/tgmesJzNmService/gylcQuery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json',
                },
                body: new URLSearchParams({
                    lotno: lotno,
                }),
            })
        ).json()
    ).response;

    if (gylc === '[]') return 'X1';

    let maxPisno = '1';
    gylc.forEach((g) => {
        const p = g.pisno;
        if (p === maxPisno) return;
        if (maxPisno === '1') {
            maxPisno = p;
            return;
        }
        if (parseInt(p.substring(1)) > parseInt(maxPisno.substring(1))) {
            maxPisno = p;
            return;
        }
    });

    return maxPisno === '1' ? 'X1' : 'X' + (parseInt(maxPisno.substring(1)) + 1);
}

export async function getYdPisnos(lotnos) {
    const res = new Array(lotnos.length).fill(['1']);
    await forEachAsync(lotnos, async (ln, i) => {
        res[i] = await getYdPisno(ln);
    });
    return res;
}

export async function getProd(lotno) {
    return (
        await (
            await fetch(`http://172.18.248.225:8080/TgmesAppdi/service/tgmesJzNmService/productionQuery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json',
                },
                body: new URLSearchParams({
                    lotno: lotno,
                }),
            })
        ).json()
    ).response;
}

export async function getProds(lotnos) {
    const map = new Map();
    await forEachAsync(lotnos, async (lotno) => {
        const prod = await getProd(lotno);
        map.set(lotno, prod);
    });
    return map;
}

export async function getGylc(lotno) {
    return (
        await (
            await fetch(`http://172.18.248.225:8080/TgmesAppdi/service/tgmesJzNmService/gylcQuery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json',
                },
                body: new URLSearchParams({
                    lotno: lotno,
                }),
            })
        ).json()
    ).response;
}

export async function getGylcs(lotnos) {
    const map = new Map();
    await forEachAsync(lotnos, async (lotno) => {
        const gylc = await getGylc(lotno);
        map.set(lotno, gylc);
    });
    return map;
}
