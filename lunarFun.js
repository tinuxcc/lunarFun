'use strict';

/**
 * @auth iilu.me
 * 用法说明可查看 [lunarFun](https://github.com/iilu/lunarFun)
 * 没有特殊说明，牵扯到的日期都为公历日期，农历日期会特别说明
 */

const LUNAR_INFO = {
    MIN_YEAR: 1901, // YEAR_INFO 的最小年份，和数组下标配合可知每个项的年份
    MAX_YEAR: 2100, // YEAR_INFO 的最大年份
    YEAR_INFO: [
        "4e4ae0", "22a570", "7554d5", "42d260", "12d950", "e56554", "3656a0", "a9ad0", "5955d2", "2a4ae0",
        "79a5b6", "4aa4d0", "1ad250", "e9d255", "3ab540", "ed6a0", "5dada2", "2e95b0", "864977", "524970",
        "22a4b0", "71b4b5", "426a50", "166d40", "e1ab54", "362b60", "a9570", "5d52f2", "2a4970", "796566",
        "46d4a0", "1aea50", "e96a95", "3a5ad0", "122b60", "e186e3", "2e92e0", "fd48d7", "4ec950", "22d4a0",
        "edd8a6", "3eb550", "1656a0", "e5a5b4", "3625d0", "a92d0", "59d2b2", "2aa950", "75b557", "466ca0",
        "1ab550", "ed5355", "3a4da0", "ea5b0", "e14573", "3252b0", "7da9a8", "4ae930", "226aa0", "71aea6",
        "3eab50", "164b60", "65aae4", "36a570", "a5260", "55f263", "26d950", "795b57", "4656a0", "1a96d0",
        "6d4dd5", "3e4ad0", "ea4d0", "5dd4d4", "2ed250", "7dd558", "4ab540", "1eb6a0", "f195a6", "4295b0",
        "1649b0", "65a974", "36a4b0", "ab27a", "526a50", "266d40", "75af46", "46ab60", "1a9570", "6d4af5",
        "3e4970", "1264b0", "5d74a3", "2aea50", "7d6b58", "4e5ac0", "1eab60", "7196d5", "4292e0", "16c960",
        "61d954", "32d4a0", "6da50", "597552", "2656a0", "75abb7", "4a25d0", "1e92d0", "69cab5", "3aa950",
        "eb4a0", "5dbaa4", "2aad50", "7d55d9", "4e4ba0", "22a5b0", "f15176", "4252b0", "16a930", "657954",
        "326aa0", "6ad50", "595b52", "2a4b60", "75a6e6", "46a4e0", "1ad260", "69ea65", "36d530", "e5aa0",
        "5d76a3", "2e96d0", "7d4afb", "4e4ad0", "22a4d0", "f1d0b6", "3ed250", "12d520", "61dd45", "32b5a0",
        "656d0", "5955b2", "2a49b0", "79a577", "46a4b0", "1aaa50", "e9b255", "3a6d20", "aada0", "dd4b63",
        "2e9370", "649f8", "4e4970", "2264b0", "f168a6", "3eea50", "126aa0", "e1a6c4", "32aae0", "a92e0",
        "55d2e3", "26c960", "75d557", "46d4a0", "16da50", "695d55", "3a56a0", "ea6d0", "5d55d4", "2e52d0",
        "7da9b8", "4ea950", "1eb4a0", "6db6a6", "3ead50", "1655a0", "61aba4", "32a5b0", "a52b0", "59b273",
        "266930", "757337", "466aa0", "1aad50", "e94b55", "3a4b60", "ea570", "6154e4", "2ad160", "79e968",
        "4ad520", "1edaa0", "ed6aa6", "3e56d0", "164ae0", "65a9d4", "32a2d0", "6d150", "55f252", "26d520"
    ],
    HEAVENLY_STEMS: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
    EARTHLY_BRANCHES: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
    ZODIAC: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],
    CHINESE_MONTH: ['正', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
    CHINESE_DATE: ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '初', '廿', '卅'], // 廿: nian; 卅: sa; 都读四声
    CHINESE_SOLAR_TERMS: ['立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至', '小寒', '大寒']
}

/**
 * _ 开头的方法默认为私有方法
 */
class LunarFunClass {
    constructor() {

    }

    /**
     * 必传参数的默认参数，如果必传参数没有传则会抛出一个错误
     */
    _throwIfMissing() {
        throw new Error('Missing parameter');
    }

    /**
     * 传入年份和其对应的十六进制字符串，返回JS对象表示的数据
     * 传入的十六进制字符串不包括 “0x” 前缀
     * @param { number } year
     * @param { string } numStr
     */
    toJSON(year = this._throwIfMissing(), numStr = this._throwIfMissing()) {
        if (!numStr) {
            return '';
        }
        let hexadecimal = numStr.toString('16'); // 保证使用的数据是十六进制的字符串
        let binary = parseInt(hexadecimal, 16).toString(2);
        if (binary.length !== 24) { // 不足24位则左边补0补足24位
            binary = '0'.repeat(24 - binary.length) + binary;
        }
        let lunarItem = {
            'year': +year,
        };
        // binary 第 21-24 个字符判断是否是闰年，如果是则得到闰几月
        // binary 第 1 个字符是当年份是闰年的时候判断闰月的天数，1是大月30天， 0是小月29天，如果不是闰年则为0
        let runInfo = binary.slice(-4);
        if (runInfo === '0000') {
          lunarItem.isRun = false;
          lunarItem.runMonth = 0;
          lunarItem.runMonthDays = 0;
        } else {
          lunarItem.isRun = true;
          lunarItem.runMonth = parseInt(runInfo, 2);
          lunarItem.runMonthDays = +binary.slice(0, 1) + 29;
        }

        // binary 第 9-20 个字符是当年的正常月份天数，1是大月30天， 0是小月29天
        lunarItem.monthsDays = [];
        let monthInfo = binary.slice(8, 20);
        [...monthInfo].map(item => {
            lunarItem.monthsDays.push(+item + 29);
        })

        // binary 第 7-8 个字符是 农历年份正月初一对应的公历月份
        lunarItem.firstMonth = parseInt(binary.slice(6, 8), 2);

        // binary 2-6 个字符是 农历年份正月初一对应的公历日子
        lunarItem.firstDay = parseInt(binary.slice(1, 6), 2);

        return lunarItem;
        /* 输出例子
            {
                 "year": 2000,
                 "isRun": false,
                 "runMonth": 0,
                 "runMonthDays": 0,
                 "monthsDays": [30, 30, 29, 29, 30, 29, 29, 30, 29, 30, 30, 29],
                 "firstMonth": 2,
                 "firstDay": 5
            }
        */
    }

    /**
     * 判断输入的公历年份是否是闰年
     * @param year
     * @returns {boolean}
     */
    isLeapYear(year = this._throwIfMissing()) {
        /**
         * 现在的公历是格里高利历，是公元1582年以后使用的，之前使用的是儒略历。
         * 格里高利历闰年的定义：世纪年中能被400整除的，和非世纪年中能被4整除的年份(即能被400整除的，或者不能被100整除而能被4整除的年份)
         * 儒略历闰年的定义：能被4整除的年份。
         */

        /**
         * 使用一元运算符 + 来转换数字对于 parseInt() 和 parseFloat() 来转换数字说有一个地方表现不一致
         * 对于 '123abc' 前者转为 NaN , 后者转为 123
         */

        let yearNum = +year;

        if (Number.isNaN(yearNum)) {
            console.warn('输入的年份参数有误');
            return false;
        }

        if (yearNum < 1582) {
            // 儒略历闰年
            return (yearNum % 4 === 0);
        } else {
            // 格里高利历闰年
            return (yearNum % 4 === 0 && yearNum % 100 !== 0) || (yearNum % 400 === 0);
        }
    }

    /**
     * 传入公历年份，输出天干，如果参数错误返回空字符串
     * @param year
     * @returns {string}
     */
    getHeavenlyStems(year = this._throwIfMissing()) {
        /**
         * 公元年数先减 3，除以 10 余数所对应的的天干是数组 HeavenlyStems 里的第几个项。也就是余数 -1 作为数组下标得出的值
         * 以 2010(庚寅) 年为例，年份减 3 得基数 2007 ,除以 10 得余数 7, 第 7 个是 '庚'。 也就是 HeavenlyStems[7-1] 为 '庚'
         */

        let yearNum = +year;

        if (Number.isNaN(yearNum)) {
            console.warn('输入的年份参数有误');
            return '';
        }

        let i = (yearNum - 3) % 10;
        if (i === 0) {// 余数为 0 的项即是第 10 个项
            i = 10;
        }

        return this.LUNAR_INFO.HEAVENLY_STEMS[i - 1];
    }

    /**
     * 传入公历年份，输出地支，如果参数错误返回空字符串
     * @param year
     * @returns {string}
     */
    getEarthlyBranches(year = this._throwIfMissing()) {
        /**
         * 公元年数先减 3，除以 12 余数所对应的的地支是数组 EarthlyBranches 里的第几个项。也就是余数 -1 作为数组下标得出的值
         * 以 2010(庚寅) 年为例，年份减 3 得基数 2007 ,除以 12 得余数 3, 第 3 个是 '寅'。 也就是 EarthlyBranches[3-1] 为 '庚'
         */

        let yearNum = +year;

        if (Number.isNaN(yearNum)) {
            console.warn('输入的年份参数有误');
            return '';
        }

        let i = (yearNum - 3) % 12;
        if (i === 0) { // 余数为 0 的项及时第 12 个项
            i = 12;
        }

        return this.LUNAR_INFO.EARTHLY_BRANCHES[i - 1];
    }

    /**
     * 传入公历年份，输出生肖，如果参数错误返回空字符串
     * @param year
     * @returns {string}
     */
    getZodiac(year = this._throwIfMissing()) {
        /**
         * 公元年数先减 3，除以 12 余数所对应的的生肖是数组 Zodiac 里的第几个项。也就是余数 -1 作为数组下标得出的值
         * 以 2010(虎) 年为例，年份减 3 得基数 2007 ,除以 12 得余数 3, 第 3 个是 '虎'。 也就是 Zodiac[3-1] 为 '虎'
         */

        let yearNum = +year;

        if (Number.isNaN(yearNum)) {
            console.warn('输入的年份参数有误');
            return '';
        }

        let i = (yearNum - 3) % 12;
        if (i === 0) { // 余数为 0 的项及时第 12 个项
            i = 12;
        }

        return this.LUNAR_INFO.ZODIAC[i - 1];
    }

    /**
     * 传入公历年份和月份，输出对应月份的天数
     * @param year
     * @param month
     * @returns {number}
     */
    getMonthNumberDays(year = this._throwIfMissing(), month = this._throwIfMissing()) {
        let FebDays = this.isLeapYear(year) ? 29 : 28;
        let monthNumberDaysArr = ['', 31, FebDays, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return monthNumberDaysArr[month];
    }

    /**
     * 传入农历年份和月份，输出对应月份的天数，第三个参数是输入的月份是否为闰月，默认为 false
     * 假设传入的是 (1903, 4);       表示 输出 农历1906年 4月 的天数
     * 假设传入的是 (1906, 4, true); 表示 输出 农历1906年 闰4月 的天数（第三个参数生效的前提是输入的是闰年，且月搞好是闰）
     * @param year
     * @param month
     * @param run
     * @returns {number}
     */
    getLunarMonthNumberDays(year = this._throwIfMissing(), month = this._throwIfMissing(), isRun = false) {
        let yearData = this.LUNAR_INFO.YEAR_INFO[year - this.LUNAR_INFO.MIN_YEAR];
        let yearDataInfo = this.toJSON(+year, yearData);

        // 如果输入的年份是农历闰年，且输入的月份刚好是闰月，且 isRun 为 true，说明需要输出闰月的天数
        if (yearDataInfo.isRun && (+month === yearDataInfo.runMonth) && isRun) {
            return yearDataInfo.runMonthDays;
        } else {
            return yearDataInfo.monthsDays[month - 1];
        }
    }

    /**
     * 传入农历年份，输出那年所有的天数
     * 如果传入的参数不规范，则返回 0
     * @param year
     */
    getLunarYearDaysTotal(year = this._throwIfMissing()) {
        if (!year) {
            console.warn('输入的年份参数有误');
            return 0;
        }
        let yearData = this.LUNAR_INFO.YEAR_INFO[year - this.LUNAR_INFO.MIN_YEAR];
        let yearDataInfo = this.toJSON(+year, yearData);

        if (yearDataInfo.isRun) { // 是闰年，加上闰月的天数
            return yearDataInfo.monthsDays.reduce((arr, cur) => {
                return arr + cur;
            }, yearDataInfo.runMonthDays)
        } else { // 不是闰年，只计算普通月份天数
            return yearDataInfo.monthsDays.reduce((arr, cur) => {
                return arr + cur;
            })
        }
    }

    /**
     * 输入农历日期，输出日期距离那年正月初一的天数
     * 第4个参数是输入的月份是否为闰月，默认为 false
     * @param year
     * @param month
     * @param day
     * @param run
     * @returns {number}
     */
    distanceLunarFirstDays(year = this._throwIfMissing(), month = this._throwIfMissing(), day = this._throwIfMissing(), isRun = false) {
        let yearData = this.LUNAR_INFO.YEAR_INFO[year - this.LUNAR_INFO.MIN_YEAR];
        let yearDataInfo = this.toJSON(+year, yearData);

        if (!yearDataInfo.isRun) { // 如果不是闰年 返回1月到输入月份前一个月的天数总和加上 日子-1
            return yearDataInfo.monthsDays.slice(0, month-1).reduce((arr, cur) => {
                return arr + cur;
            }) + day - 1;
        } else { // 如果是闰年，存在多种情况
            // 如果输入的月份比闰月小，或者输入的月份值等于闰月但isRun为false，则和不是闰年一样输出
            // month < yearDataInfo.runMonth 的话，isRun一定是false，不是则说明输入的值有误
            if (month <= yearDataInfo.runMonth && !isRun) {
                return yearDataInfo.monthsDays.slice(0, month-1).reduce((arr, cur) => {
                    return arr + cur;
                }) + day - 1;
            }
            // 输入的月份和闰月一样，且isRun为true，返回1月到输入月份的的天数和加上日子-1
            if (month === yearDataInfo.runMonth && isRun) {
                return yearDataInfo.monthsDays.slice(0, month).reduce((arr, cur) => {
                    return arr + cur;
                }) + day - 1;
            }
            // 输入的月份比闰月大，输出的月份总和要加上闰月
            if (month > yearDataInfo.runMonth) {
                return yearDataInfo.monthsDays.slice(0, month-1).reduce((arr, cur) => {
                    return arr + cur;
                }, yearDataInfo.runMonthDays) + day - 1;
            }

        }
    }

    /**
     * 输入两个公历日期对象，输出两个日期间隔的天数
     * @param date1
     * @param date2
     * @returns {number}
     */
    distanceDate(date1 = this._throwIfMissing(), date2 = this._throwIfMissing()) {
        // 这里注意如果是手动 new Date(y, m, d); 来声明日期对象，月份要 -1，因为js日期对象月份从0开始 0-11
        let distance = date1 - date2; // 以毫秒计的运行时长
        return Math.floor(Math.abs(distance) / 1000 / 60 / 60 / 24); // 相差的毫秒数转为天数
    }

    /**
     * 输入公历年月日，返回其日期对象
     * 因为月份在日期对象里面需要 -1(js日期对象月份从0开始 0-11)，时常忘记，所以这里写一个方法
     * @param year
     * @param month
     * @param day
     * @returns {Date}
     */
    getDateYMD(year = this._throwIfMissing(), month = this._throwIfMissing(), day = this._throwIfMissing()) {
        return new Date(+year, month - 1, +day);
    }

    /**
     * 传入公历年月日返回农历年月日数组
     * 数组的第四个项是在年份为闰年的时候决定输出的月份是否是闰月
     */
    /**
     * 
     * @param { number } year 
     * @param { number } month 
     * @param { number } day 
     */
    gregorianToLunal(year = this._throwIfMissing(), month = this._throwIfMissing(), day = this._throwIfMissing()) {
        let yearData = this.LUNAR_INFO.YEAR_INFO[year - this.LUNAR_INFO.MIN_YEAR];
        let yearDataInfo = this.toJSON(+year, yearData);

        /**
         * 以输入年份的农历正月初一对应的月份和天数来作为基准
         * 如果输入的月份和天数比基准 大，说明输出的农历年份是同年
         * 如果输入的月份和天数比基准 小，说明输出的农历年份要比同年公历小一年
         */
        let compare = 0; // 0 表示输入的月份天数和基准一致, 即正月初一 || 1 表示输入的月份天数比基准 大 || -1 表示输入的月份天数比基准 小
        if (month > yearDataInfo.firstMonth) { // 输入的月份和比正月初一对应的月份大，
            compare = 1;
        } else if (month < yearDataInfo.firstMonth) { // 输入的月份比正月初一对应的月份小
            compare = -1;
        } else if (+month === yearDataInfo.firstMonth) { // 输入的月份和正月初一的月份相同，这个时候比较天数
            if (day > yearDataInfo.firstDay) {
                compare = 1;
            } else if (day < yearDataInfo.firstDay) {
                compare = -1;
            } else if (+day === yearDataInfo.firstDay) {
                compare = 0;
            }
        }

        let lunalYear = 0; // 输出的农历年份
        let lunalMonth = 0; // 输出的农历月份
        let lunalDay = 0; // 输出的农历天
        let lunalIsRun = false; // 如果输出的农历年份是闰年，此参数有效，判断输出的月份是否是闰月， 默认false

        if (compare === 1) { // 输入的月份天数比基准 大， 使用同输入年份的农历年份数据
            lunalYear = +year;
        } else if (compare === -1) { // 输入的月份天数比基准 小，使用同输入年份 上一年 的农历数据
            lunalYear = year - 1;
            yearData = this.LUNAR_INFO.YEAR_INFO[lunalYear - this.LUNAR_INFO.MIN_YEAR];
            yearDataInfo = this.toJSON(lunalYear, yearData);
        } else if (compare === 0) { // 输入的月份天数和基准一致
            lunalYear = +year;
            lunalMonth = 1;
            lunalDay = 1;
        }

        let differDays = this.distanceDate(this.getDateYMD(lunalYear, yearDataInfo.firstMonth, yearDataInfo.firstDay), this.getDateYMD(year, month, day)); // 输入的公历年月日和其所在农历正月初一相差的天数
        let monthsTotalArr = [...yearDataInfo.monthsDays]; // 农历所有月份组成的数组，包括闰月，
        if (yearDataInfo.isRun) { // 如果有闰月，则在原来的月份后面插入闰月
            monthsTotalArr.splice(yearDataInfo.runMonth, 0, yearDataInfo.runMonthDays);
        }
        let monthsTotalArrIndex = 0; // 农历月份处在monthsTotalArr的下标
        let reduceBreak = false; // 额外参数，用来判断是否还进行计算 monthsTotalArrIndex 和 lunalDay
        monthsTotalArr.reduce((accumulator, currentValue, index) => {
            // 与正月初一相差的天数+1即是正月初一到输入年月日的天数，例如1号到3号相差2天，但1号到3号总共3天
            if (((accumulator + currentValue) >= (differDays + 1)) && !reduceBreak) {
                reduceBreak = true;
                monthsTotalArrIndex = index;
                // 天数 = 月份的天数 - (农历前几个月的总和 - (公历相差天数 + 1))
                lunalDay = monthsTotalArr[index] - ((accumulator + currentValue) - (differDays + 1))
            }
            return accumulator + currentValue
        }, 0);
        
        /**
         * monthsTotalArrIndex 是所有农历月份数组的下标，如果不是闰年 monthsTotalArrIndex+1 就表示当前农历月份
         * 如果是闰年，monthsTotalArrIndex+1 <= 闰月， 则 monthsTotalArrIndex+1 表示当前农历月份
         * 如果是闰年，monthsTotalArrIndex+1 > 闰月，则 monthsTotalArrIndex 表示当前农历月份
         * 如果 monthsTotalArrIndex+1 刚好比闰月打一个月，则 lunalIsRun 为 true
         */
        if (yearDataInfo.isRun) {
            if ((monthsTotalArrIndex + 1) <= yearDataInfo.runMonth) {
                lunalMonth = monthsTotalArrIndex + 1;
            } else {
                lunalMonth = monthsTotalArrIndex;
                // (monthsTotalArrIndex + 1) - yearDataInfo.runMonth === 1 缩写一下就是下面的判断
                if (monthsTotalArrIndex === yearDataInfo.runMonth) {
                    lunalIsRun = true
                }
            }
        } else {
            lunalMonth = monthsTotalArrIndex + 1;
        }

        return [+lunalYear, +lunalMonth, +lunalDay, lunalIsRun];
    }

    /**
     * 传入农历返回公历年月日数组，第四个参数在农历年份是闰年的时候决定输入的是正常月份还是闰月
     * @param year
     * @param month
     * @param day
     * @param isRun
     */
    lunalToGregorian(year, month, day, isRun = false) {

    }
};
LunarFunClass.prototype.LUNAR_INFO = LUNAR_INFO;
let lunarFun = new LunarFunClass();


console.log(lunarFun.gregorianToLunal(1906, 7, 23))

/**
 * 以下代码是测试代码，没反应说明代码没问题
 * 测试代码可删除
 */

// gregorianToLunal() 方法
 console.assert(JSON.stringify(lunarFun.gregorianToLunal(1906, 5, 22)) === '[1906,4,29,false]', 'gregorianToLunal()方法出错');
 console.assert(JSON.stringify(lunarFun.gregorianToLunal(1906, 5, 23)) === '[1906,4,1,true]', 'gregorianToLunal()方法出错');
 console.assert(JSON.stringify(lunarFun.gregorianToLunal(2000, 2, 4)) === '[1999,12,29,false]', 'gregorianToLunal()方法出错');
 console.assert(JSON.stringify(lunarFun.gregorianToLunal(2000, 12, 31)) === '[2000,12,6,false]', 'gregorianToLunal()方法出错');
 console.assert(JSON.stringify(lunarFun.gregorianToLunal(2000, 4, 6)) === '[2000,3,2,false]', 'gregorianToLunal()方法出错');



