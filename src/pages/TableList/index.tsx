import { PlusOutlined } from '@ant-design/icons';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'umi';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { deletePerson, personInfo, updatePerson } from "@/services/essentials/person/api";


/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
// @duplicate
const handleRemove = async (selectedRows: Essential.Person.Schema[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deletePerson(selectedRows.map((row) => row.id).join(","));
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    console.log('Delete failed, please try again')
    // message.error('Delete failed, please try again');
    return false;
  }
};

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<Essential.Person.Schema>();
  const [selectedRowsState, setSelectedRows] = useState<Essential.Person.Schema[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  const handleUpdate = async (fields: Essential.Person.Schema | FormValueType) => {
    const isAdd = !fields.id
    const hide = message.loading(intl.formatMessage({
      id: isAdd ? 'data.action.adding' : 'data.action.updating',
      defaultMessage: isAdd ? 'Creating...' : 'Updating...',
    }));
    try {
      await updatePerson({ ...fields });
      hide();
      message.success(intl.formatMessage({
        id: isAdd ? 'data.action.added' : 'data.action.updated',
        defaultMessage: isAdd ? 'Created' : 'Updated',
      }));
      // 刷新表格
      actionRef.current?.reloadAndRest?.();
      return true;
    } catch (error) {
      hide();
      console.log(intl.formatMessage({
        id: isAdd ? 'data.action.add.failed' : 'data.action.update.failed',
        defaultMessage: isAdd ? 'Create failed!' : 'Update failed!',
      }))
      // message.error(intl.formatMessage({
      //   id: isAdd ? 'data.action.add.failed' : 'data.action.update.failed',
      //   defaultMessage: isAdd ? 'Create failed!' : 'Update failed!',
      // }));
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    const hide = message.loading(intl.formatMessage({
      id: 'data.action.deleting',
      defaultMessage: 'Deleting...',
    }));
    try {
      await deletePerson(id);
      hide();
      message.success(intl.formatMessage({
        id: 'data.action.deleted',
        defaultMessage: 'Deleted',
      }));
      // 刷新表格
      actionRef.current?.reloadAndRest?.();
      return true;
    } catch (error) {
      hide();
      console.log(intl.formatMessage({
        id: 'data.action.delete.failed',
        defaultMessage: 'Delete failed!',
      }))
      // message.error(intl.formatMessage({
      //   id: 'data.action.delete.failed',
      //   defaultMessage: 'Delete failed!',
      // }));
      return false;
    }
  };
  const columns: ProColumns<Essential.Person.Schema>[] = [
    {
      dataIndex: 'id',
      hideInTable: true
    },
    {
      title: (
        <FormattedMessage
          id="data.person.info.name"
          defaultMessage="name"
        />
      ),
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage
        id="data.person.info.alias"
        defaultMessage="alias"
      />,
      dataIndex: 'alias',
    },
    {
      title: (
        <FormattedMessage
          id="data.person.info.gender"
          defaultMessage="gender"
        />
      ),
      dataIndex: 'gender',
    },
    {
      title: (
        <FormattedMessage
          id="data.person.info.idCardCode"
          defaultMessage="idCardCode"
        />
      ),
      dataIndex: 'idCardCode',
    },
    {
      title: (
        <FormattedMessage
          id="data.person.info.birthday"
          defaultMessage="birthday"
        />
      ),
      hideInSearch: true,
      dataIndex: 'birthday',
    },
    {
      title: <FormattedMessage
        id="data.person.info.education"
        defaultMessage="education"
      />,
      dataIndex: 'education',
    },
    {
      title: (
        <FormattedMessage
          id="data.person.info.ethnicity"
          defaultMessage="ethnicity"
        />
      ),
      dataIndex: 'ethnicity',
    },
    {
      title: (
        <FormattedMessage
          id="data.person.info.marriage"
          defaultMessage="marriage"
        />
      ),
      dataIndex: 'marriage',
    },
    {
      title: (
        <FormattedMessage
          id="data.person.info.health"
          defaultMessage="health"
        />
      ),
      dataIndex: 'health',
    },
    {
      title: (
        <FormattedMessage
          id="data.person.info.nativeAddress"
          defaultMessage="nativeAddress"
        />
      ),
      dataIndex: 'nativeAddress',
    },
    {
      title: (
        <FormattedMessage
          id="data.person.info.partyAffiliation"
          defaultMessage="partyAffiliation"
        />
      ),
      dataIndex: 'partyAffiliation',
    },
    {
      title: (
        <FormattedMessage
          id="data.person.info.phoneNumber"
          defaultMessage="phoneNumber"
        />
      ),
      dataIndex: 'phoneNumber',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="data.action.update" defaultMessage="update" />
        </a>,
        <a key="delete"
          onClick={() => {
            handleDelete(record.id)
          }}>
          <FormattedMessage
            id="data.action.delete"
            defaultMessage="delete"
          />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<Essential.Person.Schema, Essential.Person.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={personInfo}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="人" />
            </div>
          }
        >
          <Button
            // 后端暂无批量删除接口
            disabled={true}
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
            type="primary"
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newRule',
          defaultMessage: 'New rule',
        })}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleUpdate(value as Essential.Person.Schema);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >

        <ProFormText
          name="name"
          label={intl.formatMessage({
            id: "data.person.info.name",
            defaultMessage: "name"
          })}
          width="md"
          rules={[
            {
              required: true,
              message: (
                <>
                  <FormattedMessage
                    id="data.rule.empty"
                    defaultMessage="Please input "
                  />
                  <FormattedMessage
                    id="data.person.info.name"
                    defaultMessage="name"
                  />
                </>
              ),
            },
          ]}
        />
        <ProFormText
          name="idCardCode"
          width="md"
          label={intl.formatMessage({
            id: 'data.person.info.idCardCode',
            defaultMessage: 'identity card code',
          })}
          rules={[
            {
              required: true,
              message: (
                <>
                  <FormattedMessage
                    id="data.rule.empty"
                    defaultMessage="Please input "
                  />
                  <FormattedMessage
                    id='data.person.info.idCardCode'
                    defaultMessage='identity card code'
                  />
                </>
              ),
              min: 15,
            },
          ]}
        />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<Essential.Person.Schema>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<Essential.Person.Schema>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
