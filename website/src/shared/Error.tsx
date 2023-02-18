import { Alert } from '@mui/material';
import {CSSProperties} from "react";

export const Error = (props: { message?: string; onClick?: () => void, style?: CSSProperties; }) =>
  props.message ? (
    <Alert severity="error" {...props}>
      {props.message}
    </Alert>
  ) : null;

export default Error;
