import styles from './index.less';
import React, { useState, useEffect } from 'react';
import { getWarnDealLog } from '@/services/bigScreen';
import {} from 'antd';
import { isJSON } from '@/utils/utilsJS';
//定义props的类型
interface Props {
  onCancel: () => void;
  warnId: string;
}

const DealAlarmRecard: React.FC<Props> = (props) => {
  const { warnId, onCancel } = props;
  const [dealRecardList, setDealRecardList] = useState<any[]>([]); // 预警处置记录

  // 获取预警处置记录
  const getDealRecard = () => {
    const params = {
      queryObject: {
        page: '0',
        size: 99999,
        warnId: warnId,
      },
    };
    getWarnDealLog(params)
      .then((res: any) => {
        if (res.code === 200) {
          const typeList = res.result?.page?.content || [];
          setDealRecardList(typeList);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getDealRecard();
    // setDealRecardList([
    //   {
    //     dealContent: '{"personName":"张三、李四", "content":"发撒后方可就是房价开始"}',
    //     insertTime: '2021-11-12',
    //   }
    // ]);W
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warnId]);
  return (
    <div className={styles.alarmDealPopup}>
      <i className="iconfont icon-guanbi" onClick={() => onCancel()} />
      <div className={styles.alarmContent}>
        <div
          className={styles.rowSty}
          style={{ padding: '40px 20px 20px', backgroundColor: '#1a214acc' }}
        >
          <div className={`step-line-detail`}>
            {dealRecardList.length > 0 ? (
              dealRecardList.map((item) => {
                const json = isJSON(item.dealContent) ? JSON.parse(item.dealContent||"{}") : {};
                let person: any = '';
                let personAllName: string[] = [];
                if (json.personList) {
                  person = json.personList[0] || {};
                  personAllName = json.personList
                    .map((ite: any) => {
                      return ite.name;
                    })
                    .join('、');
                }
                return (
                  <div className="step" key={item.id}>
                    <div className="number">
                      <i className="iconfont icon-xingzhuang" />
                      <div className="name">{person?.name}</div>
                      <div className="time">{item.insertTime}</div>
                    </div>
                    <div className="content">
                      <div className="text">
                        <span className="labelName">下发指令：</span>
                        <span className="con">{json.content || ''}</span>
                      </div>
                      <div className="text">
                        <span className="labelName">处理人员：</span>
                        <span className="con">{personAllName}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-deal-recard">暂无处置记录</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DealAlarmRecard;
