import { UserOutlined } from '@ant-design/icons';
import { Upload, Form, Avatar } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { FC, useEffect, useState } from 'react';
import styles from './AvatarSelector.module.scss';

type Props = {
  name: string;
  initialValue?: string;
  size: number;
};

const toFiles = (event: any) => {
  if (Array.isArray(event)) {
    return event;
  }

  return event && event.fileList;
};

export const AvatarSelector: FC<Props> = ({ name, initialValue, size }) => {
  const [file, setFile] = useState<RcFile | undefined>();
  const [src, setSrc] = useState(initialValue);

  useEffect(() => {
    let url: string | undefined;
    if (file) {
      url = URL.createObjectURL(file);
      setSrc(url);
    } else {
      setSrc(initialValue);
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [file, initialValue]);

  return (
    <Form.Item
      name={name}
      valuePropName="fileList"
      getValueFromEvent={toFiles}
      className={styles.item}
      style={{ height: `${size}px` }}
    >
      <Upload
        accept="image/gif,image/jpeg,image/png,image/svg+xml,image/webp"
        showUploadList={false}
        beforeUpload={(file) => {
          setFile(file);
          return false;
        }}
      >
        {src ? (
          <div
            style={{
              width: `${size}px`,
              height: `${size}px`,
              background: `url(${src}) no-repeat center/cover`,
            }}
            className={styles.avatar}
          ></div>
        ) : (
          <Avatar
            shape="square"
            size={size}
            icon={
              <div className={styles.avatar}>
                <UserOutlined />
              </div>
            }
          />
        )}
      </Upload>
    </Form.Item>
  );
};
