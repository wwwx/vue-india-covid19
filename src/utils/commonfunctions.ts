import {
    STATE_CODES,
    STATE_CODES_REVERSE,
    // LOCALE_SHORTHANDS,
} from './constants';

import {
    parse,
    differenceInDays,
    isBefore,
    isSameDay,
    startOfDay,
    format,
    formatDistance,
} from 'date-fns';

import {utcToZonedTime} from 'date-fns-tz';

export const formatNumber = (value: number) => {
    const numberFormatter = new Intl.NumberFormat('en-IN');
    return isNaN(value) ? '-' : numberFormatter.format(value);
};

export const getIndiaDay = () => {
    return startOfDay(utcToZonedTime(new Date(), 'Asia/Kolkata'));
};


const validateCTS = (data = []) => {
    const dataTypes = [
        'dailyconfirmed',
        'dailydeceased',
        'dailyrecovered',
        'totalconfirmed',
        'totaldeceased',
        'totalrecovered',
    ];
    return data
        .filter((d: any) => dataTypes.every((dt) => d[dt]) && d.date)
        .filter((d: any) => dataTypes.every((dt) => Number(d[dt]) >= 0))
        .filter((d: any) => {
            // Skip data from the current day
            const today = getIndiaDay();
            const date = parse(d.date, 'dd MMMM', new Date(2020, 0, 1));
            return isBefore(date, today);
        });
};

export const preprocessTimeseries = (timeseries: any) => {
    return validateCTS(timeseries).map((stat: any, index) => ({
        date: parse(stat.date, 'dd MMMM', new Date(2020, 0, 1)),
        totalconfirmed: +stat.totalconfirmed,
        totalrecovered: +stat.totalrecovered,
        totaldeceased: +stat.totaldeceased,
        dailyconfirmed: +stat.dailyconfirmed,
        dailyrecovered: +stat.dailyrecovered,
        dailydeceased: +stat.dailydeceased,
        // Active = Confimed - Recovered - Deceased
        totalactive:
        +stat.totalconfirmed - +stat.totalrecovered - +stat.totaldeceased,
        dailyactive:
        +stat.dailyconfirmed - +stat.dailyrecovered - +stat.dailydeceased,
    }));
};

export const parseStateTimeseries = ({ states_daily: data }: any) => {
    const statewiseSeries = Object.keys(STATE_CODES).reduce((a: any, c) => {
        a[c] = [];
        return a;
    }, {});

    const today = getIndiaDay();
    for (let i = 0; i < data.length; i += 3) {
        const date = parse(data[i].date, 'dd-MMM-yy', new Date());
        // Skip data from the current day
        if (isBefore(date, today)) {
        Object.entries(statewiseSeries).forEach((item: any[]) => {
            const [k, v] = item;
            const stateCode = k.toLowerCase();
            const prev = v[v.length - 1] || {};
            // Parser
            const dailyconfirmed = +data[i][stateCode] || 0;
            const dailyrecovered = +data[i + 1][stateCode] || 0;
            const dailydeceased = +data[i + 2][stateCode] || 0;
            const totalconfirmed = +data[i][stateCode] + (prev.totalconfirmed || 0);
            const totalrecovered =  +data[i + 1][stateCode] + (prev.totalrecovered || 0);
            const totaldeceased = +data[i + 2][stateCode] + (prev.totaldeceased || 0);
            // Push
            v.push({
                date,
                dailyconfirmed,
                dailyrecovered,
                dailydeceased,
                totalconfirmed,
                totalrecovered,
                totaldeceased,
                // Active = Confimed - Recovered - Deceased
                totalactive: totalconfirmed - totalrecovered - totaldeceased,
                dailyactive: dailyconfirmed - dailyrecovered - dailydeceased,
            });
        });
        }
    }

    return statewiseSeries;
};

export const parseStateTestData = (data: any) => {
    const reversed = [...data].reverse();
    return Object.keys(STATE_CODES_REVERSE).reduce((ret: any, state) => {
        const obj = reversed.find(
            (item) => item.state === state && item.totaltested !== ''
        );
        ret[state] = {
            source: obj?.source1 || obj?.source2,
            totaltested: obj?.totaltested,
            updatedon: obj?.updatedon,
        };
        return ret;
    }, {});
};

export const parseStateTestTimeseries = (data: any) => {
    const testTimseries: any = Object.keys(STATE_CODES).reduce((ret: any, sc) => {
        ret[sc] = [];
        return ret;
    }, {});

    const today = getIndiaDay();
    data.forEach((d: any) => {
        const date = parse(d.updatedon, 'dd/MM/yyyy', new Date());
        const totaltested = +d.totaltested;
        const stateCode = STATE_CODES_REVERSE[d.state];
        if (stateCode && isBefore(date, today) && totaltested) {
            const stateTs = testTimseries[stateCode];
            let dailytested;
            if (stateTs.length) {
                const prev = stateTs[stateTs.length - 1];
                dailytested =
                differenceInDays(date, prev.date) === 1
                    ? totaltested - prev.totaltested
                    : NaN;
            } else {
                dailytested = NaN;
            }
            stateTs.push({
                date,
                totaltested,
                dailytested,
            });
        }
    });
    return testTimseries;
};

export const parseTotalTestTimeseries = (data: any) => {
    const testTimseries: any[] = [];
    const today = getIndiaDay();
    data.forEach((d: any) => {
        const date = parse(
            d.updatetimestamp.split(' ')[0],
            'dd/MM/yyyy',
            new Date()
        );
        const totaltested = +d.totalsamplestested;
        if (isBefore(date, today) && totaltested) {
            let dailytested;
            if (testTimseries.length) {
                const prev = testTimseries[testTimseries.length - 1];
                if (isSameDay(date, prev.date)) {
                    prev.dailytested += totaltested - prev.totaltested;
                    prev.totaltested = totaltested;
                } else {
                    if (differenceInDays(date, prev.date) === 1) {
                        dailytested = totaltested - prev.totaltested;
                    } else {
                        dailytested = NaN;
                    }
                }
            } else {
                dailytested = NaN;
            }
            testTimseries.push({
                date,
                totaltested,
                dailytested,
            });
        }
    });
    return testTimseries;
};

export const mergeTimeseries = (ts1: any, ts2: any) => {
    const tsRet = Object.assign({}, ts1);
    for (const state in ts1) {
        if (ts1.hasOwnProperty(state)) {
            tsRet[state] = ts1[state].map((d1: any) => {
                const testData = ts2[state].find((d2: any) => isSameDay(d1.date, d2.date));
                return {
                totaltested: testData?.totaltested,
                dailytested: testData?.dailytested,
                ...d1,
                };
            });
        }
    }
    return tsRet;
};
