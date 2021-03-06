import React from 'react';
import {Modal} from 'antd';
import {ProFormText, StepsForm,} from '@ant-design/pro-form';
import {FormattedMessage, useIntl} from 'umi';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Essential.Person.Schema;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<Essential.Person.Schema>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  return (
    <StepsForm
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={640}
            bodyStyle={{padding: '32px 40px 48px'}}
            destroyOnClose
            title={intl.formatMessage({
              id: 'data.action.add',
              defaultMessage: 'add',
            }) + ' ' + intl.formatMessage({
              id: 'data.person.info',
              defaultMessage: 'Person Info',
            })}
            visible={props.updateModalVisible}
            footer={submitter}
            onCancel={() => {
              props.onCancel();
            }}
          >
            {dom}
          </Modal>
        );
      }}
      onFinish={async (fields: FormValueType) => await props.onSubmit({...props.values, ...fields})}
    >
      <StepsForm.StepForm
        initialValues={props.values}
        title={intl.formatMessage({
          id: 'data.person.info',
          defaultMessage: 'Person Info',
        })}
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
      </StepsForm.StepForm>
      {/*<StepsForm.StepForm*/}
      {/*  initialValues={{*/}
      {/*    target: '0',*/}
      {/*    template: '0',*/}
      {/*  }}*/}
      {/*  title={intl.formatMessage({*/}
      {/*    id: 'pages.searchTable.updateForm.ruleProps.title',*/}
      {/*    defaultMessage: '??????????????????',*/}
      {/*  })}*/}
      {/*>*/}
      {/*  <ProFormSelect*/}
      {/*    name="target"*/}
      {/*    width="md"*/}
      {/*    label={intl.formatMessage({*/}
      {/*      id: 'pages.searchTable.updateForm.object',*/}
      {/*      defaultMessage: '????????????',*/}
      {/*    })}*/}
      {/*    valueEnum={{*/}
      {/*      0: '??????',*/}
      {/*      1: '??????',*/}
      {/*    }}*/}
      {/*  />*/}
      {/*  <ProFormSelect*/}
      {/*    name="template"*/}
      {/*    width="md"*/}
      {/*    label={intl.formatMessage({*/}
      {/*      id: 'pages.searchTable.updateForm.ruleProps.templateLabel',*/}
      {/*      defaultMessage: '????????????',*/}
      {/*    })}*/}
      {/*    valueEnum={{*/}
      {/*      0: '???????????????',*/}
      {/*      1: '???????????????',*/}
      {/*    }}*/}
      {/*  />*/}
      {/*  <ProFormRadio.Group*/}
      {/*    name="type"*/}
      {/*    label={intl.formatMessage({*/}
      {/*      id: 'pages.searchTable.updateForm.ruleProps.typeLabel',*/}
      {/*      defaultMessage: '????????????',*/}
      {/*    })}*/}
      {/*    options={[*/}
      {/*      {*/}
      {/*        value: '0',*/}
      {/*        label: '???',*/}
      {/*      },*/}
      {/*      {*/}
      {/*        value: '1',*/}
      {/*        label: '???',*/}
      {/*      },*/}
      {/*    ]}*/}
      {/*  />*/}
      {/*</StepsForm.StepForm>*/}
      {/*<StepsForm.StepForm*/}
      {/*  initialValues={{*/}
      {/*    type: '1',*/}
      {/*    frequency: 'month',*/}
      {/*  }}*/}
      {/*  title={intl.formatMessage({*/}
      {/*    id: 'pages.searchTable.updateForm.schedulingPeriod.title',*/}
      {/*    defaultMessage: '??????????????????',*/}
      {/*  })}*/}
      {/*>*/}
      {/*  <ProFormDateTimePicker*/}
      {/*    name="time"*/}
      {/*    width="md"*/}
      {/*    label={intl.formatMessage({*/}
      {/*      id: 'pages.searchTable.updateForm.schedulingPeriod.timeLabel',*/}
      {/*      defaultMessage: '????????????',*/}
      {/*    })}*/}
      {/*    rules={[*/}
      {/*      {*/}
      {/*        required: true,*/}
      {/*        message: (*/}
      {/*          <FormattedMessage*/}
      {/*            id="pages.searchTable.updateForm.schedulingPeriod.timeRules"*/}
      {/*            defaultMessage="????????????????????????"*/}
      {/*          />*/}
      {/*        ),*/}
      {/*      },*/}
      {/*    ]}*/}
      {/*  />*/}
      {/*  <ProFormSelect*/}
      {/*    name="frequency"*/}
      {/*    label={intl.formatMessage({*/}
      {/*      id: 'pages.searchTable.updateForm.object',*/}
      {/*      defaultMessage: '????????????',*/}
      {/*    })}*/}
      {/*    width="md"*/}
      {/*    valueEnum={{*/}
      {/*      month: '???',*/}
      {/*      week: '???',*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</StepsForm.StepForm>*/}
    </StepsForm>
  );
};

export default UpdateForm;
