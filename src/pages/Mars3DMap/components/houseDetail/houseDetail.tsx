/* eslint-disable react/no-array-index-key */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pagination, Tabs} from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns , ActionType } from '@ant-design/pro-table';
import { queryHouse } from '@/services/bigScreen';
import styles from './index.less';
import './houseDetail.less';

const HouseDetail: React.FC<any> = (props) => {
  const { onCancel: handleCancel, visible, houseId } = props;
  const { TabPane } = Tabs;
  const unit: any = useRef([]);
  const table: any = useRef<ActionType>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [houseData, setHouseData] = useState<any>([]); //每页数据
  const [allData, setAllData] = useState<any>([]); //总数据
  const [xtotal, setXtotal] = useState(0);
  const [tableList, setTableList] = useState<any>([]);
  const [xpageSize, setXpageSize] = useState<any>(15);
  const [xpageNo, setXpageNo] = useState<any>(1);
  const [houseName, setHouseName] = useState<string>("");




  const columns: ProColumns<any>[] = [
    {
      title: '姓名',
      dataIndex: 'xm',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '户籍地址',
      dataIndex: 'hjdxz',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '证件号码',
      dataIndex: 'gmsfhm',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '性别',
      dataIndex: 'xb',
      ellipsis: true,
      hideInSearch: true,
      valueEnum:{
        1: { text: "男"},
        2: { text: "女"}
      }
    },
    {
      title: '电话',
      dataIndex: 'tel',
      hideInSearch: true,
      ellipsis: true,
    },
  ];
  //截取 类似分页
  const sliceData = (data: any, page?: any, size?: any) => {
    const info = data.slice(page,size);
    console.log(info);
    setHouseData(info);

  }
  const DataMp = (data: any) => {
    const AllData: any = [];
    data?.map((item: any) => {
      AllData.push(...item.roomNo);
    })
    setAllData([...AllData]);
    sliceData(AllData, 0, 15);
    setXtotal(AllData?.length);
    console.log(AllData,'展开');
  }
 //查询房屋下人员
 const queryHousesList = (id: any) => {
    queryHouse({
      param:{
        active:"1",
        fwid:id,
        limit:"9999",
        page:"1",
        searchCount:false
      },
      url: "/gly/ry/syrk/listByFwid"
    })
    .then((res) => {
      console.log(res?.result?.data,'人员列表');
      if(res?.result?.data?.total === 0) {
        setTableList([]);
        return;
      }
      setTableList(res?.result?.data?.records);
      table.current?.reload();
    }).catch((err) => {
      console.error(err.message || err);
    })
  }
  //查询单元下
  const queryHouses = (name?: any) => {
    queryHouse({
      param:{
        id:houseId,
        name:name || "",
      },
      url: "/gly/fw/queryRoomNo"
    })
    .then((res) => {
      if(res.result?.list?.length === 0) return;
      if(res.result?.list?.length <= 1) {
        const data = res.result?.list[0]
        setAllData([...data?.roomNo]);
        sliceData(data?.roomNo, 0, 15);
        setXtotal(data?.roomNo?.length);
        return
      }else {
        DataMp(res.result?.list);
      }
      
    }).catch((err) => {
      console.error(err.message || err);
    })
  }
  //根据id或取单元
  const queryUnit = () => {
    queryHouse({
      param:{id:houseId},
      url: "/gly/fw/queryDy"
    })
    .then((res) => {
      unit.current = res?.result?.list
      queryHouses(res?.result?.list[0]?.name);
      
      console.log("单元",res?.result?.list);
    }).catch((err) => {
      console.error(err.message || err);
    })
  }
  //根据id获取单元详细信息
  const fetchData = () => {
    queryHouse({
      param:{
        id:houseId
      },
      url: "/gly/jz/get"
    }).then((res) => {
      setHouseName(res?.result?.data?.bzdz);
      queryUnit();//查询单元
    }).catch((err) => {
      console.error(err.message || err);
    })
  }

  useEffect(() => {
    console.log(houseId,'房屋code');
    fetchData();//查询楼栋详细信息
  }, []);


  const showModal = (itme: any) => {
    setIsModalVisible(true);
    console.log(itme,'点击单个');
    queryHousesList(itme?.id);
  };
  const xonChange = (page: any)=>{
    setXpageNo(page);
    const pages = page - 1;
    console.log(pages,'分页');
    if(pages === 0) {
      sliceData(allData, 0, 15);
      return;
    }
    sliceData(allData, (pages * 15), ((pages + 1) * 15));

  }

  function callback(key: any) {
    console.log(key);
    queryHouses(key);
  }

  return (
    <>
      <Modal
        width={850}
        mask={false}
        bodyStyle={{ padding: '0' }}
        destroyOnClose
        maskClosable={false}
        className="xbigPopup"
        visible={visible}
        footer={false}
        onCancel={() => {
          handleCancel(false);
        }}
      >
        <div className={styles.title}>
          <div className={styles.titImg}>
            楼栋信息
          </div>
          <div className={styles.nameD}>
            <span title={houseName} className={styles.name}>{houseName}</span>
          </div>
        </div>
        <div className="pb20 w100">
          
          <Tabs className={styles.Tab} onChange={callback}>
            {unit.current?.map((item: any) => {
              return(
                <TabPane tab={item?.name || "其他"} key={item?.name || ""}>
                  <div className="xbox mr20">
                    {houseData?.map((itme: any)=>{
                      return (<>
                          <div key={itme?.id} className="xbox-1-5" onClick={()=>{showModal(itme)}}>
                            <div className="big-popup-item ml20 mt30" style={{background: itme?.ldrks+itme?.hjrks+itme?.jwrys === 0 ? "#afa4a473" : ""}}>
                              <div className="tcName">
                                <span className="titleS" title={item?.roomName}>{itme?.roomName}</span>
                              </div>
                              <div className="tc"><span className='lk fs'>流口：</span><span className="FW500 lk">{itme?.ldrks || 0}</span></div>
                              <div className="tc"><span className='hj fs'>户籍：</span><span className="FW500 hj">{itme?.hjrks || 0}</span></div>
                              <div className="tc"><span className='jw fs'>境外：</span><span className="FW500 jw">{itme?.jwrys || 0}</span></div>
                            </div>
                          </div>
                      </>)
                    })}
                  </div>
                </TabPane>
              )
              
            })}
          </Tabs>
          <div className='xxm pt30 xpagination'>
            <Pagination
              onChange={xonChange}
              total={xtotal}
              current={xpageNo}
              pageSize={xpageSize}
            />
          </div>
        </div>
      </Modal>
      {/* 住户信息弹窗 */}
      <Modal
        width={850}
        mask={false}
        bodyStyle={{ padding: '0' }}
        destroyOnClose
        maskClosable={false}
        title="住户信息"
        className="xbigPopup2"
        visible={isModalVisible}
        footer={false}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <ProTable
          actionRef={table}
          scroll={{ x: '100%', y: 400 }}
          tableRender={(_props, dom) => { return dom}}
          rowKey="id"
          size="small"
          // tableAlertRender={false}
          options={false}
          request={async () => {

            return Promise.resolve({
              data: tableList,
              success: true,
              total: tableList.length,
            });
          }}
          pagination={{
            responsive: false,
            showQuickJumper: false,
            showTotal: (total) => "",
            defaultPageSize: 10,
          }}
          search={false}
          columns={columns}
        />
      </Modal>
    </>
  );
};

export default HouseDetail;
