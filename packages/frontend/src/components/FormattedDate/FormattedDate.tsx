import { FC, useEffect, useState } from 'react';
import moment from 'moment';

type Props = {
  format?: string;
};

export const FormattedDate: FC<Props> = ({ format }) => {
  const [date, setDate] = useState(() => moment());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(moment());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <span>{date.format(format)}</span>;
};

FormattedDate.defaultProps = {
  format: 'dddd',
};
