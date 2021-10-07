import { Alert, Form, Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { FC } from 'react';
import { Button } from 'src/components';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { todosActions } from '../../slice';
import styles from './CreateTodoForm.module.scss';

export const CreateTodoForm: FC = () => {
  const [form] = useForm();
  const error = useAppSelector((state) => state.todos.createError);
  const pending = useAppSelector((state) => state.todos.createPending);
  const dispatch = useAppDispatch();

  const onFinish = (values: Record<string, string>) => {
    const text = values.text;
    dispatch(
      todosActions.createTodo({
        onFulfill: () => {
          form.resetFields();
        },
        params: {
          text,
        },
      })
    );
  };

  return (
    <Form form={form} onFinish={onFinish}>
      {error ? (
        <Alert className={styles.error} message={error} type="error" />
      ) : null}
      <Form.Item
        name="text"
        rules={[{ required: true, message: 'Required field' }]}
      >
        <Input.TextArea
          placeholder="Text"
          maxLength={500}
          showCount
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </Form.Item>
      <Button
        type="primary"
        loadingDelay={500}
        loading={pending}
        htmlType="submit"
      >
        Create
      </Button>
    </Form>
  );
};
