import { Button, Input, Label } from '@adminjs/design-system';
import { ActionProps, useNotice } from 'adminjs';
import React, { FC, FormEventHandler, useRef } from 'react';

import { InvoiceEntity } from '../../invoice/entities/invoice.entity.js';
import { rejectInvoice } from '../resources/user/invoice/api/reject-invoice.js';

const RejectInvoice: FC<ActionProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>();
  const notice = useNotice();

  const invoice = props.record?.params as InvoiceEntity;

  const submitHandler: FormEventHandler = async (event): Promise<void> => {
    try {
      event.preventDefault();

      await rejectInvoice({
        invoiceId: invoice.id,
        reason: `${inputRef.current?.value}`,
      });

      window.history.back();
    } catch (error) {
      notice({ type: 'danger', message: 'Error when rejecting invoice' });
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      style={{
        gap: '16px',
        width: 300,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Label htmlFor="input1">Reject reason</Label>
        <Input required type="text" ref={inputRef} />
      </div>
      <Button variant="contained" type="submit" color="danger">
        Reject
      </Button>
    </form>
  );
};

export default RejectInvoice;
