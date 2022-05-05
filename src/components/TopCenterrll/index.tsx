import { useEffect, useState } from 'react';
import type { FC } from 'react';
import styles from './index.less';
import { queryCountpeople, getCameraIdsByGroup } from '@/services/bigScreen';
import { getDate } from '@/utils/utilsJS';
//定义props的类型
interface Props {
  onCancel: (falg?: boolean) => void;
  personNumId: string
}
let timer: any = null
const TopCenterModule: FC<Props> = (props) => {
  const { personNumId, onCancel } = props;
  const [count, setCount] = useState<any>('0');
  const [countCurrent, setCountCurrent] = useState<any>('0');
  // 获取预案树
  const getTree = (id: string) => {
    getCameraIdsByGroup({
      "group_ids": [id]
    })
      .then((res) => {
        if (res.status == 200) {
          const date: any[] = res.group_item || [];
          const arr = date.length > 0 ? date[0].camera_ids : []
          const dataTime = getDate(0);
          const entity = JSON.parse(window.cjObj.entity||"{}")

          const params0 = {
            start_timestamp: new Date().getTime() - 15*1000,
            end_timestamp:  new Date().getTime(),
            camera_ids: arr,
          }
          queryCountpeople(params0)
            .then((res1: any) => {
              if (res1.status == 200) {
                const dealDate: any[] = res1.results || [];
                let num = 0
                dealDate.map((item) => {
                  if (item.total_count) {
                    num += Number(item.total_count)
                  }
                })
                setCountCurrent(num);
              }
            })
            .catch((err) => {
              console.log(err.message || err);
            });


          const params = {
            start_timestamp:  (entity?.rlStartTime && new Date(entity?.rlStartTime).getTime()) || new Date(dataTime.endDate + ' 00:00:00').getTime() ,
            end_timestamp:  (entity?.rlEndTime && new Date(entity?.rlEndTime).getTime()) || new Date(dataTime.endDate + ' 23:59:59').getTime() ,
            camera_ids: arr,
          }
          queryCountpeople(params)
            .then((res2: any) => {
              if (res2.status == 200) {
                const dealDate: any[] = res2.results || [];
                let num = 0
                dealDate.map((item) => {
                  if (item.total_count) {
                    num += Number(item.total_count)
                  }
                })
                setCount(num);
              }
            })
            .catch((err) => {
              console.log(err.message || err);
            });
        }
      })
      .catch((err) => {
        console.log(err.message || err);
      });
  };
  const changeYatyTime = (val: any) => {
    getTree(val)
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    const timeSpeed = 1000 * 10
    timer = setInterval(() => {
      getTree(val)
    }, timeSpeed)
  }
  useEffect(() => {
    if (personNumId) {
      const arr = JSON.parse(personNumId||"{}") || {};

      changeYatyTime(arr.personNumId||'1213')
    } else {
      console.log('请配置预案id')
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }
  }, [personNumId]);

  return (
    <div className={styles.contentBoxrll}>
      <i
        className="iconfont icon-guanbi"
        onClick={() => {
          if (timer) {
            clearInterval(timer)
            timer = null
          }
          onCancel();
        }}
      />
      <div className={styles.contentrll}>
        <div className={styles.firstll}>
          人流量
        </div>
        <div className={styles.firstll} style={{ fontSize: '24px', fontWeight: 'bold' }}>{countCurrent} | {count}</div>
      </div>
    </div>
  );
};
export default TopCenterModule;
