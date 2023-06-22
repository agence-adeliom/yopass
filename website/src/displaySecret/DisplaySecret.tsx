import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { backendDomain, decryptMessage } from '../utils/utils';
import Secret from './Secret';
import ErrorPage from './Error';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAsync } from 'react-use';

const fetcher = async (url: string) => {
  const request = await fetch(url);
  if (!request.ok) {
    throw new Error('Failed to fetch secret');
  }
  return await request.json();
};

const EnterDecryptionKey = ({
  setPassword,
  password,
  loaded,
}: {
  setPassword: (password: string) => any;
  readonly password?: string;
  readonly loaded?: boolean;
}) => {
  const { t } = useTranslation();
  const [tempPassword, setTempPassword] = useState(password);
  const invalidPassword = !!password;

  const submitPassword = () => {
    if (tempPassword) {
      setPassword(tempPassword);
    }
  };
  return (
    <Container maxWidth="lg">
      <Grid container direction="column" justifyContent="center" spacing={1}>
        <Grid item xs={12} textAlign="center" marginBottom="10px">
          <Typography variant="h5" textAlign="center" marginBottom="2rem" >
            {t('display.titleDecryptionKey')}
          </Typography>
          {loaded ? (
            <Typography variant="caption" textAlign="center" marginBottom="2rem" >
              {t('display.captionDecryptionKey')}
            </Typography>
          ) : null}
        </Grid>
        <Grid item xs={12} marginBottom="10px" >
          <TextField
            fullWidth
            autoFocus
            name="decryptionKey"
            id="decryptionKey"
            placeholder={t<string>('display.inputDecryptionKeyPlaceholder')}
            label={t('display.inputDecryptionKeyLabel')}
            value={tempPassword}
            error={invalidPassword}
            helperText={invalidPassword && t('display.errorInvalidPassword')}
            onChange={(e) => setTempPassword(e.target.value)}
            inputProps={{ spellCheck: 'false', 'data-gramm': 'false' }}
          />
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Button variant="contained" onClick={submitPassword}>
            {t('display.buttonDecrypt')}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

const DisplaySecret = () => {
  const { t } = useTranslation();
  const { format, key, password: paramsPassword } = useParams();

  const isFile = format === 'f';
  const url = isFile
    ? `${backendDomain}/file/${key}`
    : `${backendDomain}/secret/${key}`;

  const [password, setPassword] = useState(paramsPassword);
  const [loadSecret, setLoadSecret] = useState(!!password);

  // Ensure that we unload the password when this param changes
  useEffect(() => {
    setPassword(paramsPassword);
    setLoadSecret(!!paramsPassword);
  }, [paramsPassword, key]);

  // Ensure that we unload the secret when the key changes
  useEffect(() => {
    setLoadSecret(!!password);
  }, [password, key]);

  // Load the secret data when required
  const { data, error } = useSWR(loadSecret ? url : null, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Decrypt the secret if password or data is changed
  const {
    loading,
    error: decryptError,
    value,
  } = useAsync(async () => {
    if (!data || !password) {
      return;
    }

    return await decryptMessage(
      data.message,
      password,
      isFile ? 'binary' : 'utf8',
    );
  }, [password, data]);

  // Handle the loaded of the secret
  if (loadSecret) {
    if (error) {
      return <ErrorPage error={error} />;
    }
    if (!data) {
      return <Typography textAlign="center" marginBottom="2rem" variant="h4">{t('display.titleFetching')}</Typography>;
    }
  }

  // Handle the decrypting
  if (loading) {
    return <Typography textAlign="center" marginBottom="2rem"  variant="h4">{t('display.titleDecrypting')}</Typography>;
  }
  if (decryptError) {
    return (
      <EnterDecryptionKey
        password={password}
        setPassword={setPassword}
        loaded={true}
      />
    );
  }
  if (value) {
    return (
      <>
        <Secret secret={value.data as string} deleteUri={data.one_time ? undefined : url} fileName={value.filename} />
      </>
    );
  }

  // If there is no password we need to fetch it.
  return (
    <EnterDecryptionKey
      password=""
      setPassword={(password: string) => {
        setPassword(password);
        setLoadSecret(true);
      }}
    />
  );
};

export default DisplaySecret;
