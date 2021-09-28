import { Button, Form, Input, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { FC, useEffect, useState } from 'react';
import useAppDispatch from '../../../../hooks/useAppDispatch';
import useAppSelector from '../../../../hooks/useAppSelector';
import { todosActions } from '../../slice';

export const CreateTodoForm: FC = () => {
  const [form] = useForm();
  const pending = useAppSelector((state) => state.todos.createPending);
  const error = useAppSelector((state) => state.todos.createError);
  const dispatch = useAppDispatch();
  const [submitted, setSubmitted] = useState(false);

  const onFinish = (values: Record<string, string>) => {
    const text = values.text;
    dispatch(todosActions.createTodo(text));
    setSubmitted(true);
  };

  useEffect(() => {
    if (submitted && !error && !pending) {
      message.success('Todo created');
      form.resetFields();
    }
  }, [submitted, form, error, pending]);

  return (
    <Form form={form} onFinish={onFinish}>
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
      <Button type="primary" loading={pending} htmlType="submit">
        Create
      </Button>
    </Form>
  );
};
