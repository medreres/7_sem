import { Button, DatePicker, Input, Label } from '@adminjs/design-system';
import { ActionProps, useNotice } from 'adminjs';
import React, { FC, FormEventHandler, useRef, useState } from 'react';

import { pointsInputProps } from './points-input.props.js';

import { InvoiceEntity } from '../../invoice/entities/invoice.entity.js';
import { approveInvoice } from '../resources/user/invoice/api/approve-invoice.js';

const ApproveInvoice: FC<ActionProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>();
  const [issuedAt, setIssuedAt] = useState<Date>();
  const notice = useNotice();

  const invoice = props.record?.params as InvoiceEntity;

  const submitHandler: FormEventHandler = async (event): Promise<void> => {
    try {
      event.preventDefault();
      const value = Number(inputRef.current?.value);

      if (!issuedAt) {
        alert('Select issued at date');

        return;
      }

      await approveInvoice({
        invoiceId: invoice.id,
        pointsAmount: value,
        issuedAt,
      });

      window.history.back();
    } catch (error) {
      console.error(error);
      notice({ type: 'danger', message: 'Error when approving invoice' });
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
      <div>
        <Label htmlFor="points">Points to assign</Label>
        <Input {...pointsInputProps} required ref={inputRef} />
      </div>
      <div>
        <Label htmlFor="date-picker">Issued at date</Label>
        <DatePicker
          id="date-picker"
          required
          value={issuedAt}
          onChange={(date) => {
            if (!date) {
              return;
            }

            setIssuedAt(new Date(date));
          }}
        />
      </div>
      <Button type="submit" color="success" variant="outlined">
        Approve
      </Button>
    </form>
  );
};

export default ApproveInvoice;
