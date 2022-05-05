/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-param-reassign */
import { querySolution } from '@/services/bigScreen';
/**
 * @param {Array} source
 * @returns {object}
 * editor fuhy
 */
// 数组对象
export function setTreeData(source) {
  const cloneData = deepCopy(source);
  // 对源数据深度克隆
  return cloneData.filter((father) => {
    // 循环所有项，并添加children属性
    // father.icon = '';
    const branchArr = cloneData.filter((child) => father.id === child.pId); // 返回每一项的子级数组
    branchArr.length > 0 ? (father.children = branchArr) : ''; // 给父级添加一个children属性，并赋值
    return father.pId === -1; // 返回第一层
  });
}
function daotree(cloneData, children) {
  const arr2 = cloneData.filter((father) => {
    const brancharr = children.filter((child) => {
      return father.id === child.organizationId;
    });
    // eslint-disable-next-line no-return-assign
    return brancharr.length > 0 ? (father.children = brancharr) : '';
  });
  if (arr2.length > 1) {
    return daotree(cloneData, arr2);
  }
  return arr2;
}
// 递归树
// eslint-disable-next-line @typescript-eslint/no-redeclare
export function retTreeData(source, nocheck) {
  const cloneData = deepCopy(source);
  const children = cloneData.filter((item) => {
    return item[nocheck] === false;
  }); // 最底层
  if (children.length > 0) {
    return daotree(cloneData, children);
  }
  return cloneData.filter((father) => {
    // 循环所有项，并添加children属性
    father.icon = '';
    const branchArr = cloneData.filter((child) => father.id === child.organizationId); // 返回每一项的子级数组
    branchArr.length > 0 ? (father.children = branchArr) : ''; // 给父级添加一个children属性，并赋值
    return father.organizationId === 0; // 返回第一层
  });
}
/**
 * @param {Object} obj
 * @returns {object}
 * editor fuhy
 */
export function deepCopy(obj) {
  // 深度复制数组
  if (Object.prototype.toString.call(obj) === '[object Array]') {
    const object = [];
    for (let i = 0; i < obj.length; i++) {
      object.push(deepCopy(obj[i]));
    }
    return object;
  }
  // 深度复制对象
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    const object = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const p in obj) {
      object[p] = obj[p];
    }
    return object;
  }
}
/**
 * @param {Array} treeObj
 * @param {String} rootid
 * @returns {Array}
 * editor fuhy
 */
export function tree2Array(treeObj, rootid) {
  let temp = []; // 设置临时数组，用来存放队列
  let out = []; // 设置输出数组，用来存放要输出的一维数组
  if (treeObj.length === 0) {
    return treeObj;
  }
  temp = temp.concat(treeObj);
  // 首先把根元素存放入out中
  let pid = rootid;
  const obj = deepCopy(treeObj);
  const outObj = obj.map((item) => {
    delete item.children;
    return item;
  });
  out = out.concat(outObj);
  // 对树对象进行广度优先的遍历
  while (temp.length > 0) {
    const first = temp.shift();
    const { children } = first;
    if (children && children.length > 0) {
      pid = first.id;
      const len = first.children.length;
      for (let i = 0; i < len; i++) {
        temp.push(children[i]);
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const obj = deepCopy(children[i]);
        obj.parentId = pid;
        delete obj.children;
        out.push(obj);
      }
    }
  }
  return out;
}
export function url2obj(url) {
  const urlobj = {};
  const urlArr = url.split(':');
  // eslint-disable-next-line prefer-destructuring
  urlobj.http = urlArr[0];
  urlobj.ip = urlArr[1].replace('//', '');
  const pathA = urlArr[2].split('/');
  const port = pathA.shift();
  urlobj.port = port;
  urlobj.path = `/${pathA.join('/')}`;

  if (url.indexOf('?') < 0) {
    urlobj.params = {};
  }
  urlobj.url = url.substring(0, url.indexOf('?') + 1);
  const paraString = url.substring(url.indexOf('?') + 1, url.length).split('&');
  urlobj.params = {};
  let keyvalue = [];
  let key = '';
  let value = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const i in paraString) {
    keyvalue = paraString[i].split('=');
    // eslint-disable-next-line prefer-destructuring
    key = keyvalue[0];
    // eslint-disable-next-line prefer-destructuring
    value = keyvalue[1];
    urlobj.params[key] = value;
  }
  return urlobj;
}

// 去除半选状态
export function checked(id, data, newArr) {
  data.forEach((item) => {
    if (item.id === id) {
      if (!item.children || item.children.length === 0) {
        newArr.push(item.id);
      }
    } else if (item.children && item.children.length !== 0) {
      checked(id, item.children, newArr);
    }
  });
}

// 获取近多少天起始日期/当年(type=1 为获取当年)
export function getDate(days, type = 0) {
  const nowDate = new Date();
  const nowYear = nowDate.getFullYear();
  let nowMonth = nowDate.getMonth() + 1;
  let nowDay = nowDate.getDate();
  if (nowMonth >= 1 && nowMonth <= 9) {
    nowMonth = `0${nowMonth}`;
  }
  if (nowDay >= 0 && nowDay <= 9) {
    nowDay = `0${nowDay}`;
  }
  const date = new Date(nowDate);
  date.setDate(date.getDate() - days);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = `0${month}`;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = `0${strDate}`;
  }
  const endDate = `${nowYear}-${nowMonth}-${nowDay}`;
  let startDate = `${year}-${month}-${strDate}`;
  if (type === 1) {
    startDate = `${nowYear}-01-01`;
  }
  return {
    startDate,
    endDate,
  };
}

//中国标准时间转化---yyyy-MM-dd 00:00:00
export function formatDate(date) {
  let formatDateTime;
  formatDateTime = new Date(date);
  formatDateTime =
    formatDateTime.getFullYear() +
    '-' +
    (formatDateTime.getMonth() + 1 > 9
      ? formatDateTime.getMonth() + 1
      : '0' + (formatDateTime.getMonth() + 1)) +
    '-' +
    (formatDateTime.getDate() > 9 ? formatDateTime.getDate() : '0' + formatDateTime.getDate()) +
    ' ' +
    (formatDateTime.getHours() > 9 ? formatDateTime.getHours() : '0' + formatDateTime.getHours()) +
    ':' +
    (formatDateTime.getMinutes() > 9
      ? formatDateTime.getMinutes()
      : '0' + formatDateTime.getMinutes()) +
    ':' +
    (formatDateTime.getSeconds() > 9
      ? formatDateTime.getSeconds()
      : '0' + formatDateTime.getSeconds());
  return formatDateTime;
}

export function getBJLXLB(value) {
  if (value) {
    const namemap = {
      10: '刑事',
      20: '治安',
      10000: '案件',
      20000: '交通',
      30000: '火警',
      40000: '求助',
      50000: '咨询',
      60000: '举报',
      70000: '投诉监督',
      80000: '事件',
      90000: '灾害事故',
      100000: '纠纷',
      110000: '警务协助',
      120000: '医疗救助',
      130000: '扬言',
      999000: '其它',
      10010: '偷盗类',
      10020: '抢夺',
      10030: '抢劫',
      10040: '通讯网络诈骗',
      10060: '投毒',
      10070: '劫持',
      40100: '移车类',
      41000: '医疗类',
      41100: '走失类',
      50300: '交通车管类',
      60500: '诈骗类',
      70200: '警务监督',
      70300: '非警务',
      100100: '治安纠纷',
      100200: '医患纠纷',
      100300: '劳资纠纷',
      100400: '消费纠纷',
      100500: '其他家庭纠纷',
      100600: '邻里纠纷',
      100700: '经济纠纷',
      100800: '家庭暴力',
      130001: '扬言个人极端',
    };
    if (!namemap.hasOwnProperty(value)) return '其他';
    return namemap[value];
  } else return '无';
}

//判断视域格式
export function formatPolygon(json) {
  const data = json || false;
  if (!Array.isArray(data)) {
    return null;
  } else {
    if (data.length < 3) return null;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (!item.hasOwnProperty('x') || !item.hasOwnProperty('y')) {
        return null;
      }
    }
    if (data[0].x !== data[data.length - 1].x || data[0].y !== data[data.length - 1].y) {
      data.push(data[0]);
    }
  }
  return data;
}
// 获取指定时间的下一天
export function getNextDay(d) {
  d = new Date(d);
  d = +d + 1000 * 60 * 60 * 24;
  d = new Date(d);

  var yy = d.getFullYear();
  var mm = d.getMonth() + 1;
  var dd = d.getDate();
  var nextday = yy + '-';
  if (mm < 10) {
    nextday += '0';
  }
  nextday += mm + '-';
  if (dd < 10) {
    nextday += '0';
  }
  nextday += dd;
  return nextday;
}
// 判断指定时间是不是在指定时间段内，不在返回最后一天
export function getDateDuring(start, end) {
  if (!end) return;
  const endDay = end.substring(0, 10);
  const objTime = getDate(0).startDate;
  console.log('getNextDay:', getNextDay(objTime));
  const nowDate = new Date().getTime();
  console.log('end:', end);
  if (!(nowDate > new Date(start).getTime() && nowDate < new Date(end).getTime())) {
    return {
      start: endDay + ' 00:00:00',
      end: getNextDay(endDay) + ' 00:00:00',
    };
  } else {
    return {
      start: objTime + ' 00:00:00',
      end: getNextDay(objTime) + ' 00:00:00',
    };
  }
}

// 设置html添加
export function innerHtml(graphic) {
  let innerTooltip = '';
  let innerBindPop = '';
  let info = [];
  const graphicData = graphic.options?.attr?.data?.entity;
  console.log('graphicData111:', graphic, graphic.options.type);
  if (graphic.options.type === 'billboard' || graphic.options.type === 'label') {
    if (graphicData) {
      info = JSON.parse(graphicData).info?.self || [];
      // if (!(info && info.length)) {
      //   return;
      // }
      if (graphic.options.type === 'label') {
        console.log('graphicData111info:', info);
      }
    }
    const topTip =
      '<div class="safetyinfo">' +
      '<div class="top_line"></div>' +
      '<div class="top_block"></div>' +
      '<div class="left_line"></div>' +
      '<div class="left_block"></div>' +
      '<div class="info_left_line"></div>' +
      '<div class="info_left"></div>';
    innerTooltip += topTip + '<div class="info_content" style="display: block;">';
    innerBindPop +=
      topTip +
      `<div class="info_close info_close_ab" style="pointer-events: none" title="关闭">X</div>
    <div class="info_content" style="display: block;">`;
    info.forEach((item, index) => {
      innerBindPop += `<div class="info_key">${item.first}: <span class="info_value info-policestask">${item.last}</span></div>`;
      if (index < 6) {
        innerTooltip += `<div class="info_key">${item.first}: <span class="info_value info-policestask">${item.last}</span></div>`;
      }
    });
    const params = {
      id: graphic.options?.attr.data.id,
    };
    querySolution(params)
      .then((res) => {
        const resultNow = res.data.solutionPersonList;
        if (resultNow.length) {
          innerTooltip +=
            `<div class="info_key"><p class="lastTitle small">岗点人员：</p>` +
            `<p class="lastTitle large">`;
          innerBindPop +=
            `<div class="info_key"><p class="lastTitle small">岗点人员：</p>` +
            `<p class="lastTitle large">`;
          resultNow.forEach((ress) => {
            let number = '';
            if (ress.phoneNumber) {
              number = ress.phoneNumber;
            }
            const paramP = `<span class="lastSpan" style="color:#fff;background:rgba(255,255,255,0.6);padding:0 4px;margin:10px;">${ress.personName} ${number}</span>`;
            innerTooltip += paramP;
            innerBindPop += paramP;
          });
          innerTooltip +=
            '</p></div></div>' +
            '<div class="info_right_line"></div>' +
            '<div class="info_right"></div>' +
            '<div class="info_bottom"></div>' +
            '<div class="bottom_one"></div>' +
            '<div class="bottom_two"></div>' +
            '<div class="bottom_three"></div>' +
            '<div class="bottom_four"></div>' +
            '</div>';
          innerBindPop +=
            '</p></div></div>' +
            '<div class="info_right_line"></div>' +
            '<div class="info_right"></div>' +
            '<div class="info_bottom"></div>' +
            '<div class="bottom_one"></div>' +
            '<div class="bottom_two"></div>' +
            '<div class="bottom_three"></div>' +
            '<div class="bottom_four"></div>' +
            '</div>';
        } else {
          if (graphicData) {
            info = JSON.parse(graphicData).info?.self;
            if (!(info && info.length)) {
              return;
            }
          }
        }
        // bindPopup
        graphic.bindTooltip(
          function () {
            return innerTooltip;
          },
          {
            direction: 'top',
            offsetY: -20,
            template: false,
          },
        );
        // bindPopup
        graphic.bindPopup(
          function () {
            return innerBindPop;
          },
          {
            direction: 'top',
            offsetY: -20,
            template: false,
          },
        );
      })
      .catch(() => {
        if (graphicData) {
          info = JSON.parse(graphicData).info?.self;
          if (!(info && info.length)) {
            return;
          }
        }
        // bindPopup
        graphic.bindTooltip(
          function () {
            return innerTooltip;
          },
          {
            direction: 'top',
            offsetY: -20,
            template: false,
          },
        );
        // bindPopup
        graphic.bindPopup(
          function () {
            return innerBindPop;
          },
          {
            direction: 'top',
            offsetY: -20,
            template: false,
          },
        );
      });
  } else if (graphic.options.type !== 'label') {
    graphic.bindTooltip(
      function () {
        const name = graphicData ? JSON.parse(graphicData)?.info?.name : '';
        return `<div class="popupTooltip_self">${name}</div>`;
      },
      {
        direction: 'top',
        offsetY: -20,
        template: false,
      },
    );
  }
}
export function checkPointInPolygon2D(checkPoint, polygonPoints) {
  // checkPoint: { x: 0, y: 0 } polygonPoints:[{ x: 0, y: 0 }, {}, {}...]
  if (!Array.isArray(polygonPoints)) return true;
  if (!Array.isArray(polygonPoints) || polygonPoints.length < 3) return false;
  if (checkPoint.hasOwnProperty('longitude') && checkPoint.hasOwnProperty('latitude'))
    checkPoint = {
      x: checkPoint.longitude,
      y: checkPoint.latitude,
    };
  var tempPoints = [];
  for (var i = 0; i < polygonPoints.length; ++i)
    tempPoints.push(
      polygonPoints[i].hasOwnProperty('longitude') && polygonPoints[i].hasOwnProperty('latitude')
        ? {
            x: polygonPoints[i].longitude,
            y: polygonPoints[i].latitude,
          }
        : polygonPoints[i],
    );
  polygonPoints = tempPoints;

  var ret = false;
  var p1 = polygonPoints[0];
  // eslint-disable-next-line @typescript-eslint/no-redeclare
  for (var i = 1; i <= polygonPoints.length; ++i) {
    var p2 = polygonPoints[i % polygonPoints.length];
    if (checkPoint.x > Math.min(p1.x, p2.x) && checkPoint.x <= Math.max(p1.x, p2.x)) {
      if (checkPoint.y <= Math.max(p1.y, p2.y) && p1.x !== p2.x) {
        var xinters = ((checkPoint.x - p1.x) * (p2.y - p1.y)) / (p2.x - p1.x) + p1.y;
        if (p1.y === p2.y || checkPoint.y <= xinters) ret = !ret;
      }
    }
    p1 = p2;
  }
  return ret;
}
// 判断字符串是不是json格式
export function isJSON(json) {
  if (typeof json == 'string') {
    const str = json.replace(/&nbsp;/g, '');
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e);
      return false;
    }
  }
}
//截取小数点后(bit-1)位
export function getBit(value, bit = 7) {
  if (!value) return null;
  let str = value.toString();
  let strIndex = str.indexOf('.');
  if (strIndex === -1) return parseInt(str);
  if (str.length - (strIndex + 1) <= bit - 1) return parseFloat(str);
  str = str.substring(0, strIndex + bit);
  return parseFloat(str);
}

//判断数组对象中是否有某个值
export function findElem(array, attr, val) {
  for(var i = 0; i < array.length; i++) {
    if(array[i][attr] == val) {
      return i;
    }
  }
  return -1;
}