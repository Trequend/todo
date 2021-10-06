import { Alert, Form } from 'antd';
import { Button } from 'src/components';
import { FC, ReactNode, useEffect, useState } from 'react';
import { ApiError } from 'src/errors';
import styles from './ValueEditor.module.scss';

type Props = {
  className?: string;
  name: string;
  preview: ReactNode;
  form: ReactNode;
  onDelete?: () => Promise<void>;
  onFinish?: (values: any) => Promise<void>;
};

export const ValueEditor: FC<Props> = ({
  className,
  name,
  preview,
  onDelete,
  form,
  onFinish,
}) => {
  const [isPreview, setIsPreview] = useState(true);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [deletePending, setDeletePending] = useState(false);

  useEffect(() => {
    if (!isPreview) {
      setFormError(undefined);
    }
  }, [isPreview]);

  const onFormFinish = (values: any) => {
    if (!onFinish) {
      return;
    }

    const action = async () => {
      setPending(true);
      try {
        await onFinish(values);
        setFormError(undefined);
        setIsPreview(true);
      } catch (error) {
        if (error instanceof ApiError) {
          setFormError(error.message);
        } else {
          setFormError('Unknown error');
        }
      } finally {
        setPending(false);
      }
    };

    action();
  };

  const deleteValue = () => {
    if (!onDelete || deletePending) {
      return;
    }

    const action = async () => {
      setDeletePending(true);
      await onDelete();
      setDeletePending(false);
    };

    action();
  };

  return isPreview ? (
    <div className={className}>
      <span className={styles.name}>{name}</span>
      <Button
        type="link"
        className={styles.button}
        onClick={() => setIsPreview(false)}
        disabled={deletePending}
      >
        Edit
      </Button>
      {onDelete ? (
        <Button
          type="link"
          danger
          className={styles.button}
          onClick={deleteValue}
          loading={deletePending}
          loadingDelay={500}
        >
          Delete
        </Button>
      ) : null}
      <div>{preview}</div>
    </div>
  ) : (
    <div className={className}>
      <Form onFinish={onFormFinish}>
        <span className={styles.name}>{name}</span>
        <Button
          type="link"
          loading={pending}
          className={styles.button}
          loadingDelay={500}
          htmlType="submit"
        >
          Apply
        </Button>
        <Button
          type="link"
          disabled={pending}
          danger
          className={styles.button}
          onClick={() => setIsPreview(true)}
        >
          Cancel
        </Button>
        <div>
          {formError ? (
            <div className={styles.alert}>
              <Alert message={formError} type="error" />
            </div>
          ) : null}
          {form}
        </div>
      </Form>
    </div>
  );
};
