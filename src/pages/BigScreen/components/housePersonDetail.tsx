import React, { useEffect } from 'react';
import { Modal, message, Tag } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { arHouseQueryDetail } from '@/services/bigScreen';
import './popup.less';

export interface BaseConfirmProps {
  onCancel: (flag?: boolean) => void;
  visible: boolean;
  houseId: string;
}
export interface TableListItem {
  id?: string;
  name?: string;
  personName?: string;
  customerName?: string;
  type?: string;
}

const HousePersonDetail: React.FC<BaseConfirmProps> = (props) => {
  const { onCancel: handleCancel, visible, houseId } = props;
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      hideInSearch: true,
      width: 50,
      render: (_, record, index) => index + 1,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标签',
      dataIndex: 'posTypeName',
      search: false,
      width: 90,
      valueEnum: {
        民警: {
          text: <Tag color="#87d068">普通人员</Tag>,
        },
        辅警: {
          text: <Tag color="#87d068">普通人员</Tag>,
        },
        保安: {
          text: <Tag color="#87d068">普通人员</Tag>,
        },
        交警: {
          text: <Tag color="#87d068">普通人员</Tag>,
        },
        普通人员: {
          text: <Tag color="#87d068">普通人员</Tag>,
        },
        重点人员: {
          text: <Tag color="#f50">重点人员</Tag>,
        },
      },
    },
    {
      title: '性别',
      dataIndex: 'genderName',
      width: 100,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '人员类别',
      dataIndex: 'personTypeName',
      width: 100,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '职业类别',
      dataIndex: 'posTypeName',
      width: 100,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '身份证号',
      dataIndex: 'idCardCode',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '关联组织机构',
      dataIndex: 'orgName',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      hideInSearch: true,
    },
  ];
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [houseId]);
  return (
    <Modal
      width={1000}
      mask={false}
      bodyStyle={{ padding: '0' }}
      destroyOnClose
      maskClosable={false}
      title="人员详情"
      className="bigPopup"
      visible={visible}
      footer={false}
      onCancel={() => {
        handleCancel(false);
      }}
    >
      <ProTable<TableListItem>
        scroll={{ x: '100%', y: 400 }}
        tableRender={(_props, dom) => {
          return dom;
        }}
        rowKey="id"
        size="small"
        tableAlertRender={false}
        options={false}
        pagination={false}
        request={async () => {
          const res = await arHouseQueryDetail({
            id: houseId,
          });
          if (res.code !== 200) {
             console.log(res.message)
            // message.error(res.message);
          }
          return {
            data: res.data?.personInfoVOList || [],
          };
        }}
        search={false}
        columns={columns}
      />
    </Modal>
  );
};

export default HousePersonDetail;
