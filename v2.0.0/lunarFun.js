'use strict';

/**
 * @auth iilu.me
 * 用法说明可查看 [lunarFun](https://github.com/iilu/lunarFun)
 * 没有特殊说明，牵扯到的数字日期都为中国公历日期，农历日期会特别说明
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
    CHINESE_MONTH: ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
    CHINESE_DATE: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '初', '廿', '卅', '年', '月', '日', '闰'], // 廿: nian; 卅: sa; 都读四声
    CHINESE_SOLAR_TERMS: ['立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至', '小寒', '大寒']
}

/**
 * _ 开头的方法默认为私有方法
 */
class LunarFunClass {
    constructor() {

    }

    /**
     * 作为下列方法必传参数的默认参数传入
     * 用来在方法所需的参数没有传入的时候抛出错误
     */
    _missingParameters() {
        throw new Error('Missing parameter');
    }

    /**
     * 传入中国农历年份和其对应的十六进制字符串信息，返回JS对象表示的农历数据
     * 传入的十六进制字符串不包括 “0x” 前缀
     * @param { number } year
     * @param { string } numStr
     */
    toJSON(year = this._missingParameters(), numStr = this._missingParameters()) {
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
                 "year": 2000, // 农历年份的数字表示
                 "isRun": false, // 是否是闰年
                 "runMonth": 0, // 是闰年的话闰几月，非闰年为 0
                 "runMonthDays": 0, // 是闰年的话闰月的天数，非闰年为 0
                 "monthsDays": [30, 30, 29, 29, 30, 29, 29, 30, 29, 30, 30, 29], // 正常十二个月的每月天数
                 "firstMonth": 2, // 农历年份正月初一对应的公历月份
                 "firstDay": 5 // 农历年份正月初一对应的公历日子
            }
        */
    }

    /**
     * 判断输入的中国公历年份是否是闰年
     * @param year
     * @returns {boolean}
     */
    isLeapYear(year = this._missingParameters()) {
        /**
         * 现在的公历是格里高利历，是公元1582年以后使用的，之前使用的是儒略历。
         * 格里高利历闰年的定义：世纪年中能被400整除的，和非世纪年中能被4整除的年份(即能被400整除的，或者不能被100整除而能被4整除的年份)
         * 儒略历闰年的定义：能被4整除的年份。
         */

        /**
         * 使用一元运算符 + 来转换数字对于 parseInt() 和 parseFloat() 来说有一个地方表现不一致
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
     * 传入中国公历年份，输出天干，如果参数错误返回空字符串
     * @param year
     * @returns {string}
     */
    getHeavenlyStems(year = this._missingParameters()) {
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
     * 传入中国公历年份，输出地支，如果参数错误返回空字符串
     * @param year
     * @returns {string}
     */
    getEarthlyBranches(year = this._missingParameters()) {
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
     * 传入中国公历年份，输出生肖，如果参数错误返回空字符串
     * @param year
     * @returns {string}
     */
    getZodiac(year = this._missingParameters()) {
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
     * 传入中国公历年份和月份，输出对应月份的天数
     * @param year
     * @param month
     * @returns {number}
     */
    getMonthNumberDays(year = this._missingParameters(), month = this._missingParameters()) {
        let FebDays = this.isLeapYear(year) ? 29 : 28;
        let monthNumberDaysArr = ['', 31, FebDays, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return monthNumberDaysArr[month];
    }

    /**
     * 传入中国农历年份和月份，输出对应月份的天数，第三个参数是输入的月份是否为闰月，默认为 false
     * 假设传入的是 (1903, 4);       表示 输出 农历1906年 4月 的天数
     * 假设传入的是 (1906, 4, true); 表示 输出 农历1906年 闰4月 的天数（第三个参数生效的前提是输入的是闰年，且月刚好是闰）
     * @param year
     * @param month
     * @param run
     * @returns {number}
     */
    getLunarMonthNumberDays(year = this._missingParameters(), month = this._missingParameters(), isRun = false) {
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
     * 传入中国农历年月日返回其汉字表示，第四个参数在农历年份是闰年的时候决定输入的是正常月份还是闰月
     */
    formatLunarDate(year = this._missingParameters(), month = this._missingParameters(), day = this._missingParameters(), isRun = false) {
        let chineseDateText = this.LUNAR_INFO.CHINESE_DATE; // 存放有关 天 的字符串数组
        let chineseMonthText = this.LUNAR_INFO.CHINESE_MONTH; // 存放有关 月 的字符串数组
        // 年
        let resultYear = '';
        let yearNumArr = [...(+year + '')];
        let yearStrArr = [];
        yearNumArr.map(item => {
            yearStrArr.push(chineseDateText[+item]);
        })
        resultYear = yearStrArr.join('');

        // 月
        let resultMonth = chineseMonthText[month - 1];
        if (isRun) {
            resultMonth = chineseDateText[17] + resultMonth;
        }

        // 日
        let resultDay = '';
        let dayNumArr = [...(+day + '')];
        if (day <= 10) {
            resultDay = chineseDateText[11] + chineseDateText[+day];
        } else if (day <= 20) {
            if (day < 20) {
                resultDay = chineseDateText[10] + chineseDateText[+dayNumArr[1]];
            } else if (+day === 20) {
                resultDay = chineseDateText[2] + chineseDateText[10];
            }
        } else if (day <= 30) { // 农历一个月最多大月30天
            if (day < 30) {
                resultDay = chineseDateText[12] + chineseDateText[+dayNumArr[1]];
            } else if (+day === 30) {
                resultDay = chineseDateText[3] + chineseDateText[10];
            }
        }

        return resultYear + chineseDateText[14] + resultMonth + chineseDateText[15] + resultDay + chineseDateText[16];
    }

    /**
     * 传入中国农历年份，输出那年所有的天数
     * 如果传入的参数不规范，则返回 0
     * @param year
     */
    getLunarYearDaysTotal(year = this._missingParameters()) {
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
     * 输入中国农历日期，输出日期距离那年正月初一的天数
     * 第4个参数是输入的月份是否为闰月，默认为 false
     * @param year
     * @param month
     * @param day
     * @param isRun
     * @returns {number}
     */
    distanceLunarFirstDays(year = this._missingParameters(), month = this._missingParameters(), day = this._missingParameters(), isRun = false) {
        let yearData = this.LUNAR_INFO.YEAR_INFO[year - this.LUNAR_INFO.MIN_YEAR];
        let yearDataInfo = this.toJSON(+year, yearData);

        if (!yearDataInfo.isRun) { // 如果不是闰年 返回1月到输入月份前一个月的天数总和加上 日子-1
            return yearDataInfo.monthsDays.slice(0, month-1).reduce((arr, cur) => {
                return arr + cur;
            }, 0) + day - 1;
        } else { // 如果是闰年，存在多种情况，方便理解下面写出了4种情况
            // 如果输入的月份比闰月小，则和不是闰年一样输出
            if (month < yearDataInfo.runMonth) {
                return yearDataInfo.monthsDays.slice(0, month-1).reduce((arr, cur) => {
                    return arr + cur;
                }, 0) + day - 1;
            }
            // 输入的月份比闰月大，输出的月份总和要加上闰月
            if (month > yearDataInfo.runMonth) {
                return yearDataInfo.monthsDays.slice(0, month-1).reduce((arr, cur) => {
                    return arr + cur;
                }, yearDataInfo.runMonthDays) + day - 1;
            }
            // 输入的月份和闰月一样，且isRun为false，和不是闰年一样输出
            if (month === yearDataInfo.runMonth && !isRun) {
                return yearDataInfo.monthsDays.slice(0, month-1).reduce((arr, cur) => {
                    return arr + cur;
                }, 0) + day - 1;
            }
            // 输入的月份和闰月一样，且isRun为true，返回1月到输入月份的的天数和加上日子-1
            if (month === yearDataInfo.runMonth && isRun) {
                return yearDataInfo.monthsDays.slice(0, month).reduce((arr, cur) => {
                    return arr + cur;
                }, 0) + day - 1;
            }
        }
    }

     /**
     * 输入两个公历日期对象，输出两个日期间隔的天数
     * 注意，请传入两个时区相同的对象，例如传入的两个日起对象都是 UTC 时间，或都是中国时区的日起对象
     * @param date1
     * @param date2
     * @returns {number}
     */
    distanceDate(date1 = this._missingParameters(), date2 = this._missingParameters()) {
        let distance = date1 - date2; // 以毫秒计的运行时长

        // 这里会有精度问题，由原来的 Math.floor 转为 Math.round 方法，因为计算的天数有可能会出现 在中国时区为 354天，在新加坡时区为 353.99天，（中国时区和新加坡时区应该都是 +8 时区，按理说获取的时间戳是一样的，但它就是有误差我也是没办法
        // return Math.floor(Math.abs(distance) / 1000 / 60 / 60 / 24); // 相差的毫秒数转为天数
        return Math.round(Math.abs(distance) / 1000 / 60 / 60 / 24); // 相差的毫秒数转为天数
    }

    /**
     * 输入中国公历年月日，返回其中国时间日期对象，时分秒不传默认 0
     * 注意：此日期对象最好不要使用日期对象的获取年月日方法等直接返回年月日，因为时区不一定是,在中国
     * 因为月份在日期对象里面需要 -1(js日期对象月份从0开始 0-11)，时常忘记，所以这里写一个方法
     * @param year
     * @param month
     * @param day
     * @returns {Date}
     */
    getDateYMD(year = this._missingParameters(), month = this._missingParameters(), day = this._missingParameters(), h = 0, m = 0, s = 0) {
        if (new Date().getTimezoneOffset() === -480) { // 表示当前是在中国时区
            return new Date(+year, month - 1, +day, h, m, s);
            
        } else { // 表示当前不是在中国时区，那么根据输入的年月日，返回其中国时区相同的日期对象(即时间戳一样)
            let localDate = new Date(+year, month - 1, +day, h, m, s); // 本地时间
            let offsetGMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
            let chinaTimestamp = localDate.getTime() - (offsetGMT * 60 * 1000) - (8 * 60 * 60 * 1000); // 中国时间戳

            return new Date(chinaTimestamp);
        }
    }

     /**
     * 格式化输出中国时间对象
     * 根据中国时间对象，返回对应中国时间格式的中国时间字符串
     * @param {object} dateObj 时间对象 如果不传则默认当前时间（如果在非中国时区，则默认中国时区的当前时间对象
     * @param {string} formatText 时间格式 区分大小写 如果不传则默认格式为 YYYY-MM-DD hh:mm:ss
     */
    formatDate(dateObj, formatText = 'YYYY-MM-DD hh:mm:ss') {
        /**
         * formatText 的字符含义
         * | 格式       | 含义    | 备注       | 举例           |
         * | :--:      | :--:    | :--:      | :--:          |
         * | YYYY      | 年      | 四位数         | 1999          |
         * | M         | 月      | 不补零     | 6             |
         * | MM        | 月      | 补零       | 06            |
         * | D         | 日      | 不补零     | 6             |
         * | DD        | 日      | 补零       | 06            |
         * | h         | 小时     | 不补零     | 7             |
         * | hh        | 小时     | 补零      | 07            |
         * | m         | 分钟     | 不补零     | 8             |
         * | mm        | 分钟     | 补零      | 08            |
         * | s         | 秒      | 不补零     | 9             |
         * | ss        | 秒      | 补零       | 09            |
         * | W         | 星期    | 不补零，返回 0-6 0表示星期天     | 1             |
         * |WW         | 星期    | 补零，返回 00-06 00表示星期天      | 01            |
         * |WT         | 星期    | 文字表述   | 星期一         |
         * | timestamp | JS时间戳 | 13位毫秒级 | 0928624089000 |
         */

        /**
         * @desc 十进制数字补零 注意无穷大和无穷小, 会返回一个数字字符串, 如果无法补零则会返回空字符串，默认十进制
         * @todu 注意，如果参数值是Number且是0开头，有可能会被解析为八进制数字
         * @returns {string} 返回十进制数字字符串
         * @param {number or string} num
         */
        let addZero = function (num) {
            if (typeof num === "undefined") {
                console.warn("注意，addZero() 补零方法没有接收到值，将返回空字符串");
                return '';
            }

            let number = num - 0;

            if (Number.isNaN(number)) {
                console.warn("注意，addZero() 补零方法接收的值无法转换为数字，将返回空字符串");
                return '';
            }
            if (!isFinite(number)) {
                console.warn("注意，addZero() 补零方法接收的值不是js能解析的有限数值，将返回空字符串");
                return '';
            }

            return number < 10 ? '0' + number : '' + number;
        };

        /**
         * 传入中国日期对象和格式化字符串，返回相应的根据 格式化字符串 替换后的 格式化后的时间字符串
         * @todu 如果需要增加其他的格式，例如‘毫秒’，则需要修改 regObj 这个正则，并修改接下来的格式化方法(中国时区和非中国时区的格式化方法)。
         * @param {object} dateObj 时间日期对象
         * @param {string} formatText 格式化字符串模板
         */
        let formatReplace = function (dateObj, formatText = 'YYYY-MM-DD hh:mm:ss') {
            if (!dateObj) { // 如果时间对象为空，则返回错误
                console.error('formatReplace() 函数没有接收到 Date 时间日期对象。');
                return false;
            }
            
            // 格式化时间就是把日期对象格式化类似默认的 YYYY-MM-DD hh:mm:ss 模样
            // 在同一个日期对象上 UTC时区格式化时间 比 中国时区格式化时间 少8小时
            // 要想让 UTC时区格式化时间 和 中国时区格式化时间一样，只需要 日期对象本身+8小时
            // 这样 新的日期对象UTC时区格式化时间 就和 旧的日期对象中国时区格式化时间 在字符串展示上一样
            // 上面的可用伪代码表达为 日期对象.getHours() === new Date(日期对象.getTime() + 8小时毫秒).getUTCHours()
            let lengthenDateObj = new Date(dateObj.getTime() + 8 * 60 * 60 * 1000);
            let weekText = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            let regObj = /YYYY|M{1,2}|D{1,2}|h{1,2}|m{1,2}|s{1,2}|WT|W{1,2}|timestamp/g; // 注意顺序，比如 WT 要在 W 前面，否则会先匹配 W
            
            return formatText.replace(regObj, function (match) {
                /**
                 * 返回替换字符串，根据 **中国时间** 返回
                 * match 是匹配到的字符串 如果 regObj 为 g 模式（全局替换），则每次匹配都会执行这个函数
                 * switch 使用的是全等匹配 即 match === case的值
                 */
                switch (match) {
                    case 'YYYY':
                        return lengthenDateObj.getUTCFullYear(); // 1000-9999
                    case 'M':
                        return lengthenDateObj.getUTCMonth() + 1; // 月份是 0-11, 这里返回 1-12
                    case 'MM':
                        return addZero(lengthenDateObj.getUTCMonth() + 1); // 月份是 0-11, 这里返回 01-12
                    case 'D':
                        return lengthenDateObj.getUTCDate(); // 1-31
                    case 'DD':
                        return addZero(lengthenDateObj.getUTCDate()); // 01-31
                    case 'h':
                        return lengthenDateObj.getUTCHours(); // 0-23
                    case 'hh':
                        return addZero(lengthenDateObj.getUTCHours()); // 00-23
                    case 'm':
                        return lengthenDateObj.getUTCMinutes(); // 0-59
                    case 'mm':
                        return addZero(lengthenDateObj.getUTCMinutes()); // 00-59
                    case 's':
                        return lengthenDateObj.getUTCSeconds(); // 0-59
                    case 'ss':
                        return addZero(lengthenDateObj.getUTCSeconds()); // 00-59
                    case 'W':
                        return lengthenDateObj.getUTCDay(); // 日期是 0 代表星期日， 1 代表星期一，2 代表星期二， 依次类推 这里返回 0-6
                    case 'WW':
                        return addZero(lengthenDateObj.getUTCDay()); // 日期是 0 代表星期日， 1 代表星期一，2 代表星期二， 依次类推 这里返回 00-06
                    case 'WT':
                        return weekText[lengthenDateObj.getUTCDay()]; // // 日期是 0 代表星期日， 1 代表星期一，2 代表星期二， 依次类推 这里返回 星期一~星期日
                    case 'timestamp':
                        // 注意，这里不能用 lengthenDateObj日期对象 返回时间戳，要用 dateObj日期对象 返回时间戳，因为 lengthenDateObj 只是方便计算的时间对象，实际传入的时间对象还是 dateObj
                        // 时间戳代表日期对象，实际传入 dateObj 的日期对象 , 则返回 dateObj 的时间戳。
                        // 同一个日期对象在不同的时区获得的时间戳都是一样的。
                        return dateObj.getTime(); // 从1970-1-1 00:00:00 UTC（协调世界时）到该日期经过的毫秒数，对于1970-1-1 00:00:00 UTC之前的时间返回负值。
                    default:
                        console.warn('没有查询到格式化字符串，请确认日期格式化字符串是否正确');
                        return '';
                }
            });
        };

        if (!dateObj) { // 如果时间对象为空，则默认为当前中国时间
            let nowDate = null;
            if (new Date().getTimezoneOffset() === -480) { // 表示当前是在中国时区
                nowDate = new Date();
            } else {
                let localDate = new Date(); // 本地时间
                let offsetGMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
                let chinaTimestamp = localDate.getTime() - (offsetGMT * 60 * 1000) - (8 * 60 * 60 * 1000); // 中国时间戳

                nowDate = new Date(chinaTimestamp);
            }
            return formatReplace(nowDate, formatText);
        } else {
            return formatReplace(dateObj, formatText);
        }
    }
   
    /**
     * 传入中国公历年月日返回农历年月日数组
     * 数组的第四个项是在年份为闰年的时候决定输出的月份是否是闰月
     * @param { number } year 
     * @param { number } month 
     * @param { number } day 
     */
    gregorianToLunal(year = this._missingParameters(), month = this._missingParameters(), day = this._missingParameters()) {
        let yearData = this.LUNAR_INFO.YEAR_INFO[year - this.LUNAR_INFO.MIN_YEAR]; // 获取输入年份的16进制数据
        let yearDataInfo = this.toJSON(+year, yearData); // 转化为 JSON数据

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
                lunalDay = monthsTotalArr[index] - ((accumulator + currentValue) - (differDays + 1));
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
     * 传入中国农历年月日返回中国公历年月日数组，第四个参数在农历年份是闰年的时候决定输入的是正常月份还是闰月
     * @param year
     * @param month
     * @param day
     * @param isRun
     */
    lunalToGregorian(year = this._missingParameters(), month = this._missingParameters(), day = this._missingParameters(), isRun = false) {
        let yearData = this.LUNAR_INFO.YEAR_INFO[year - this.LUNAR_INFO.MIN_YEAR];
        let yearDataInfo = this.toJSON(+year, yearData);

        let distanceLunarLunarFirstDays = this.distanceLunarFirstDays(+year, +month, +day, isRun); // 输入的日子和农历正月初一相差的天数
        let distanceLunarGregorianFirstDay = this.distanceDate(this.getDateYMD(+year, 1, 1), this.getDateYMD(+year, yearDataInfo.firstMonth, yearDataInfo.firstDay)); // 输入年份农历正月初一和公历一月一日相差的天数
        let distanceGregorianFirstDay = distanceLunarLunarFirstDays + distanceLunarGregorianFirstDay; // 输入日期距离公历一月一日相差的天数
        let isGregorianRun = this.isLeapYear(+year); // 输入的年份公历是否是闰年
        let gregorianYearDays = isGregorianRun ? 366 : 365; // 输入的年份的公历天数，平年365，闰年366
        
        // 输入的农历日期到了下一年公历年
        if ((distanceGregorianFirstDay + 1) > gregorianYearDays) { // +1是因为 相差天数+1 === 两个日期所占的天数，例如：1-3日相差2天，但1-3一共3天。
            let day = (distanceGregorianFirstDay + 1) - gregorianYearDays;
            // 输入的农历日期在下一年公历年的1月
            if (day <= 31) {
                return [+year+1, 1, day];
            } else { // 输入的农历日期在下一年的2月
                return [+year+1, 2, day-31];
            }
        } else { // 输入的农历日期还在当前的公历年
            let monthsTotalArr = isGregorianRun ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 公历年月份组成的数组，闰年2月29天，平年2月28天
            let monthsTotalArrIndex = 0; // 公历月份处在 monthsTotalArr 的下标
            let gregorianDays = 0; // 公历当月天数
            let reduceBreak = false; // 额外参数，用来判断是否还进行计算 monthsTotalArrIndex
            monthsTotalArr.reduce((accumulator, currentValue, index) => {
                // +1是因为 相差天数+1 === 两个日期所占的天数，例如：1-3日相差2天，但1-3一共3天。
                if (((accumulator + currentValue) >= (distanceGregorianFirstDay + 1)) && !reduceBreak) {
                    reduceBreak = true;
                    monthsTotalArrIndex = index;
                    // 天数 = 月份的天数 - (公历前几个月的总和 - (公历相差天数 + 1))
                    gregorianDays = monthsTotalArr[index] - ((accumulator + currentValue) - (distanceGregorianFirstDay + 1))
                }
                return accumulator + currentValue
            }, 0);
            return [+year, monthsTotalArrIndex + 1, gregorianDays];
        }
    }



    

}

LunarFunClass.prototype.LUNAR_INFO = LUNAR_INFO;

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.lunarFun = factory()); // lunarFun 是库的名字
}(this, (function () { 
    'use strict';
    return new LunarFunClass();
})));
