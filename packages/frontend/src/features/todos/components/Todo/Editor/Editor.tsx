import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useEffect,
  useState,
} from 'react';
import { Button, Checkbox, Input } from 'antd';
import styles from './Editor.module.scss';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';

type Props = {
  text: string;
  done?: boolean;
  className?: string;
  isEditMode?: boolean;
  onDoneClick?: () => void;
  onTextChange?: (value: string) => void;
  onDelete?: () => void;
};

export const Editor: FC<Props> = ({
  text,
  done,
  className,
  isEditMode,
  onDoneClick,
  onTextChange,
  onDelete,
}) => {
  const [isDraftMode, setIsDraftMode] = useState(false);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (!isDraftMode) {
      setDraft(text);
    }
  }, [isDraftMode, text]);

  const startEdit = () => {
    setIsDraftMode(true);
  };

  const endEdit = () => {
    setIsDraftMode(false);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    onTextChange && onTextChange(draft);
    endEdit();
  };

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setDraft(event.target.value);
  };

  const element = isEditMode ? (
    isDraftMode ? (
      <form onSubmit={onSubmit} className={styles.form}>
        <Input
          placeholder="Todo text"
          type="text"
          className={styles.input}
          value={draft}
          onChange={onInputChange}
        />
        <Button type="primary" htmlType="submit" disabled={draft.trim() === ''}>
          <CheckOutlined />
        </Button>
        <Button danger htmlType="button" onClick={endEdit}>
          <CloseOutlined />
        </Button>
      </form>
    ) : (
      <>
        <span className={styles.editorText}>{text}</span>
        <Button onClick={startEdit}>
          <EditOutlined />
        </Button>
        <Button danger className={styles.delete} onClick={onDelete}>
          <DeleteOutlined />
        </Button>
      </>
    )
  ) : (
    <>
      <Checkbox checked={done} onClick={onDoneClick} />
      <span className={styles.text}>{text}</span>
    </>
  );

  const divClassName = className ? `${styles.root} ${className}` : styles.root;
  return <div className={divClassName}>{element}</div>;
};
